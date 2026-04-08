import { useState, useEffect, useCallback } from "react";
import { Leaf, Flame, Droplets, Trash2, Zap, TreePine, ChevronDown, Save, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { useToast } from "@/hooks/use-toast";
import type { LucideIcon } from "lucide-react";

/* ── Field definition ── */
interface Field {
  key: string;
  label: string;
  unit?: string;
  type: "number" | "select";
  options?: { value: string; label: string }[];
  help?: string;
}

/* ── Category definition ── */
interface Category {
  id: string;
  icon: LucideIcon;
  label: string;
  desc: string;
  fields: Field[];
  scoreFn: (d: Record<string, any>) => number | null;
}

const YES_NO = [
  { value: "", label: "—" },
  { value: "oui", label: "Oui" },
  { value: "non", label: "Non" },
  { value: "en_cours", label: "En cours" },
];

const MATURITY = [
  { value: "", label: "—" },
  { value: "0", label: "Inexistant" },
  { value: "25", label: "Initial" },
  { value: "50", label: "Structuré" },
  { value: "75", label: "Avancé" },
  { value: "100", label: "Exemplaire" },
];

/* ── Scoring helpers ── */
const yesScore = (v: string) => v === "oui" ? 100 : v === "en_cours" ? 50 : v === "non" ? 0 : null;
const numScore = (v: any) => (v !== "" && v !== undefined && v !== null) ? Number(v) : null;
const avg = (vals: (number | null)[]) => {
  const valid = vals.filter((v): v is number => v !== null);
  return valid.length ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : null;
};

/* ── Categories ── */
const CATEGORIES: Category[] = [
  {
    id: "emissions",
    icon: Flame,
    label: "Émissions carbone",
    desc: "Bilan GES Scope 1, 2 & 3 selon le GHG Protocol",
    fields: [
      { key: "scope1", label: "Émissions Scope 1 (directes)", unit: "tCO₂e", type: "number" },
      { key: "scope2", label: "Émissions Scope 2 (énergie)", unit: "tCO₂e", type: "number" },
      { key: "scope3", label: "Émissions Scope 3 (chaîne de valeur)", unit: "tCO₂e", type: "number" },
      { key: "bilan_ges", label: "Bilan GES réalisé ?", type: "select", options: YES_NO },
      { key: "plan_reduction", label: "Plan de réduction en place ?", type: "select", options: YES_NO },
    ],
    scoreFn: (d) => avg([yesScore(d.bilan_ges), yesScore(d.plan_reduction)]),
  },
  {
    id: "energie",
    icon: Zap,
    label: "Énergie",
    desc: "Consommation énergétique, mix renouvelable, efficacité",
    fields: [
      { key: "conso_totale", label: "Consommation totale", unit: "MWh/an", type: "number" },
      { key: "part_renouvelable", label: "Part d'énergie renouvelable", unit: "%", type: "number" },
      { key: "audit_energetique", label: "Audit énergétique réalisé ?", type: "select", options: YES_NO },
      { key: "objectif_reduction", label: "Objectif de réduction défini ?", type: "select", options: YES_NO },
    ],
    scoreFn: (d) => avg([
      numScore(d.part_renouvelable),
      yesScore(d.audit_energetique),
      yesScore(d.objectif_reduction),
    ]),
  },
  {
    id: "eau",
    icon: Droplets,
    label: "Eau",
    desc: "Consommation d'eau, stress hydrique, traitement des effluents",
    fields: [
      { key: "conso_eau", label: "Consommation d'eau", unit: "m³/an", type: "number" },
      { key: "recyclage_eau", label: "Système de recyclage de l'eau ?", type: "select", options: YES_NO },
      { key: "traitement_effluents", label: "Traitement des effluents ?", type: "select", options: YES_NO },
      { key: "maturite_eau", label: "Maturité gestion de l'eau", type: "select", options: MATURITY },
    ],
    scoreFn: (d) => avg([yesScore(d.recyclage_eau), yesScore(d.traitement_effluents), numScore(d.maturite_eau)]),
  },
  {
    id: "dechets",
    icon: Trash2,
    label: "Déchets",
    desc: "Gestion des déchets, taux de valorisation, économie circulaire",
    fields: [
      { key: "tonnage_dechets", label: "Tonnage total de déchets", unit: "tonnes/an", type: "number" },
      { key: "taux_valorisation", label: "Taux de valorisation", unit: "%", type: "number" },
      { key: "tri_selectif", label: "Tri sélectif en place ?", type: "select", options: YES_NO },
      { key: "economie_circulaire", label: "Démarche d'économie circulaire ?", type: "select", options: YES_NO },
    ],
    scoreFn: (d) => avg([numScore(d.taux_valorisation), yesScore(d.tri_selectif), yesScore(d.economie_circulaire)]),
  },
  {
    id: "biodiversite",
    icon: TreePine,
    label: "Biodiversité",
    desc: "Impact sur les écosystèmes, plans de préservation, TNFD",
    fields: [
      { key: "evaluation_impact", label: "Évaluation de l'impact biodiversité ?", type: "select", options: YES_NO },
      { key: "plan_preservation", label: "Plan de préservation ?", type: "select", options: YES_NO },
      { key: "maturite_biodiversite", label: "Maturité démarche biodiversité", type: "select", options: MATURITY },
    ],
    scoreFn: (d) => avg([yesScore(d.evaluation_impact), yesScore(d.plan_preservation), numScore(d.maturite_biodiversite)]),
  },
];

/* ── Category form component ── */
function CategoryForm({
  cat,
  data,
  onChange,
  onSave,
  saving,
  saved,
}: {
  cat: Category;
  data: Record<string, any>;
  onChange: (key: string, value: string) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-4 pt-4">
      {cat.fields.map((f) => (
        <div key={f.key}>
          <label className="text-xs font-semibold text-foreground mb-1 block">
            {f.label} {f.unit && <span className="text-muted-foreground font-normal">({f.unit})</span>}
          </label>
          {f.type === "number" ? (
            <input
              type="number"
              value={data[f.key] ?? ""}
              onChange={(e) => onChange(f.key, e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300/50"
              placeholder="0"
              min={0}
            />
          ) : (
            <select
              value={data[f.key] ?? ""}
              onChange={(e) => onChange(f.key, e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300/50"
            >
              {f.options?.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          )}
        </div>
      ))}
      <div className="sm:col-span-2 flex justify-end pt-2">
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? "Enregistrement…" : saved ? "Enregistré" : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function Environnement() {
  const { organizationId, loading: orgLoading } = useOrganization();
  const { toast } = useToast();
  const [openCat, setOpenCat] = useState<string | null>(null);
  const [allData, setAllData] = useState<Record<string, Record<string, any>>>({});
  const [scores, setScores] = useState<Record<string, number | null>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [savedCats, setSavedCats] = useState<Set<string>>(new Set());
  const [dataLoading, setDataLoading] = useState(true);

  const year = new Date().getFullYear().toString();

  // Load existing data
  useEffect(() => {
    if (!organizationId) { setDataLoading(false); return; }
    supabase
      .from("esg_data")
      .select("category, data, score")
      .eq("organization_id", organizationId)
      .eq("pillar", "E")
      .eq("period", year)
      .then(({ data: rows }) => {
        if (rows) {
          const d: Record<string, Record<string, any>> = {};
          const s: Record<string, number | null> = {};
          const saved = new Set<string>();
          rows.forEach((r) => {
            d[r.category] = (r.data as Record<string, any>) ?? {};
            s[r.category] = r.score;
            saved.add(r.category);
          });
          setAllData(d);
          setScores(s);
          setSavedCats(saved);
        }
        setDataLoading(false);
      });
  }, [organizationId, year]);

  const handleChange = useCallback((catId: string, key: string, value: string) => {
    setAllData((prev) => ({
      ...prev,
      [catId]: { ...(prev[catId] ?? {}), [key]: value },
    }));
    setSavedCats((prev) => { const n = new Set(prev); n.delete(catId); return n; });
  }, []);

  const handleSave = useCallback(async (cat: Category) => {
    if (!organizationId) return;
    setSaving(cat.id);
    const catData = allData[cat.id] ?? {};
    const score = cat.scoreFn(catData);

    const { error } = await supabase
      .from("esg_data")
      .upsert(
        {
          organization_id: organizationId,
          pillar: "E",
          category: cat.id,
          period: year,
          data: catData,
          score,
        },
        { onConflict: "organization_id,pillar,category,period" }
      );

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setScores((prev) => ({ ...prev, [cat.id]: score }));
      setSavedCats((prev) => new Set(prev).add(cat.id));
      toast({ title: "Données enregistrées" });
    }
    setSaving(null);
  }, [organizationId, allData, year, toast]);

  // Compute totals
  const completedCount = CATEGORIES.filter((c) => savedCats.has(c.id)).length;
  const validScores = Object.values(scores).filter((s): s is number => s !== null);
  const globalScore = validScores.length ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : null;

  if (orgLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
          <Leaf className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-2xl text-foreground">Module Environnement</h2>
          <p className="text-muted-foreground text-sm mt-1 max-w-xl">
            Renseignez vos données environnementales pour calculer votre score et obtenir des recommandations personnalisées.
          </p>
        </div>
      </div>

      {/* Score card */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-1">Score Environnement</p>
          <p className="font-heading font-extrabold text-4xl text-foreground">
            {globalScore !== null ? globalScore : "—"}
            <span className="text-lg text-muted-foreground font-normal">/100</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Catégories complétées</p>
          <p className="font-bold text-foreground">{completedCount} / {CATEGORIES.length}</p>
        </div>
      </div>

      {/* Categories accordion */}
      <div className="space-y-3">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isOpen = openCat === cat.id;
          const isSaved = savedCats.has(cat.id);
          const score = scores[cat.id];
          return (
            <div key={cat.id} className="rounded-xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => setOpenCat(isOpen ? null : cat.id)}
                className="w-full p-5 flex items-center gap-4 hover:bg-emerald-50/30 transition-all"
              >
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${isSaved ? "bg-emerald-100 border-emerald-300" : "bg-emerald-50 border-emerald-200"}`}>
                  {isSaved ? <Check className="w-5 h-5 text-emerald-600" /> : <Icon className="w-5 h-5 text-emerald-600" />}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="font-semibold text-sm text-foreground">{cat.label}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.desc}</p>
                </div>
                {score !== null && score !== undefined && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${score >= 70 ? "bg-emerald-100 text-emerald-700" : score >= 40 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                    {score}/100
                  </span>
                )}
                {!isSaved && score === undefined && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground shrink-0">
                    À compléter
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 border-t border-border">
                  <CategoryForm
                    cat={cat}
                    data={allData[cat.id] ?? {}}
                    onChange={(key, value) => handleChange(cat.id, key, value)}
                    onSave={() => handleSave(cat)}
                    saving={saving === cat.id}
                    saved={isSaved}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
