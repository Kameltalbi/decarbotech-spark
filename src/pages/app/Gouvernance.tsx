import { useState, useEffect, useCallback } from "react";
import { ShieldCheck, Scale, Eye, AlertOctagon, FileCheck, Landmark, ChevronDown, Save, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { useToast } from "@/hooks/use-toast";
import type { LucideIcon } from "lucide-react";

interface Field { key: string; label: string; unit?: string; type: "number" | "select"; options?: { value: string; label: string }[] }
interface Category { id: string; icon: LucideIcon; label: string; desc: string; fields: Field[]; scoreFn: (d: Record<string, any>) => number | null }

const YES_NO = [{ value: "", label: "—" }, { value: "oui", label: "Oui" }, { value: "non", label: "Non" }, { value: "en_cours", label: "En cours" }];
const MATURITY = [{ value: "", label: "—" }, { value: "0", label: "Inexistant" }, { value: "25", label: "Initial" }, { value: "50", label: "Structuré" }, { value: "75", label: "Avancé" }, { value: "100", label: "Exemplaire" }];

const yesScore = (v: string) => v === "oui" ? 100 : v === "en_cours" ? 50 : v === "non" ? 0 : null;
const numScore = (v: any) => (v !== "" && v !== undefined && v !== null) ? Number(v) : null;
const avg = (vals: (number | null)[]) => { const valid = vals.filter((v): v is number => v !== null); return valid.length ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : null; };

const CATEGORIES: Category[] = [
  {
    id: "transparence",
    icon: Eye,
    label: "Transparence",
    desc: "Publication d'informations, communication parties prenantes, reporting",
    fields: [
      { key: "reporting_public", label: "Reporting ESG public ?", type: "select", options: YES_NO },
      { key: "parties_prenantes", label: "Dialogue parties prenantes formalisé ?", type: "select", options: YES_NO },
      { key: "maturite_transparence", label: "Maturité transparence", type: "select", options: MATURITY },
    ],
    scoreFn: (d) => avg([yesScore(d.reporting_public), yesScore(d.parties_prenantes), numScore(d.maturite_transparence)]),
  },
  {
    id: "ethique",
    icon: Scale,
    label: "Éthique & anti-corruption",
    desc: "Code de conduite, politique anti-corruption, alerte interne",
    fields: [
      { key: "code_conduite", label: "Code de conduite existant ?", type: "select", options: YES_NO },
      { key: "politique_anti_corruption", label: "Politique anti-corruption ?", type: "select", options: YES_NO },
      { key: "alerte_interne", label: "Canal d'alerte interne ?", type: "select", options: YES_NO },
      { key: "formation_ethique", label: "Formation éthique obligatoire ?", type: "select", options: YES_NO },
    ],
    scoreFn: (d) => avg([yesScore(d.code_conduite), yesScore(d.politique_anti_corruption), yesScore(d.alerte_interne), yesScore(d.formation_ethique)]),
  },
  {
    id: "risques",
    icon: AlertOctagon,
    label: "Gestion des risques",
    desc: "Cartographie des risques ESG, plans de mitigation, veille réglementaire",
    fields: [
      { key: "cartographie_risques", label: "Cartographie des risques ESG ?", type: "select", options: YES_NO },
      { key: "plan_mitigation", label: "Plan de mitigation des risques ?", type: "select", options: YES_NO },
      { key: "veille_reglementaire", label: "Veille réglementaire formalisée ?", type: "select", options: YES_NO },
      { key: "maturite_risques", label: "Maturité gestion risques", type: "select", options: MATURITY },
    ],
    scoreFn: (d) => avg([yesScore(d.cartographie_risques), yesScore(d.plan_mitigation), yesScore(d.veille_reglementaire), numScore(d.maturite_risques)]),
  },
  {
    id: "conformite",
    icon: FileCheck,
    label: "Conformité réglementaire",
    desc: "CSRD, ESRS, devoir de vigilance, taxonomie européenne",
    fields: [
      { key: "csrd", label: "Conformité CSRD ?", type: "select", options: YES_NO },
      { key: "devoir_vigilance", label: "Déclaration devoir de vigilance ?", type: "select", options: YES_NO },
      { key: "taxonomie", label: "Alignement taxonomie européenne ?", type: "select", options: YES_NO },
      { key: "maturite_conformite", label: "Maturité conformité", type: "select", options: MATURITY },
    ],
    scoreFn: (d) => avg([yesScore(d.csrd), yesScore(d.devoir_vigilance), yesScore(d.taxonomie), numScore(d.maturite_conformite)]),
  },
  {
    id: "structure",
    icon: Landmark,
    label: "Structure de gouvernance",
    desc: "Composition du CA/comité ESG, % indépendants, diversité instances",
    fields: [
      { key: "pct_femmes_ca", label: "% femmes au CA/executive", unit: "%", type: "number" },
      { key: "pct_independants", label: "% indépendants au CA", unit: "%", type: "number" },
      { key: "comite_esg", label: "Comité ESG dédié ?", type: "select", options: YES_NO },
      { key: "responsable_esg", label: "Responsable ESG nommé ?", type: "select", options: YES_NO },
    ],
    scoreFn: (d) => avg([numScore(d.pct_femmes_ca), numScore(d.pct_independants), yesScore(d.comite_esg), yesScore(d.responsable_esg)]),
  },
];

function CategoryForm({ cat, data, onChange, onSave, saving, saved }: { cat: Category; data: Record<string, any>; onChange: (k: string, v: string) => void; onSave: () => void; saving: boolean; saved: boolean }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4 pt-4">
      {cat.fields.map((f) => (
        <div key={f.key}>
          <label className="text-xs font-semibold text-foreground mb-1 block">
            {f.label} {f.unit && <span className="text-muted-foreground font-normal">({f.unit})</span>}
          </label>
          {f.type === "number" ? (
            <input type="number" value={data[f.key] ?? ""} onChange={(e) => onChange(f.key, e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-300/50" placeholder="0" />
          ) : (
            <select value={data[f.key] ?? ""} onChange={(e) => onChange(f.key, e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-300/50">
              {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          )}
        </div>
      ))}
      <div className="sm:col-span-2 flex justify-end pt-2">
        <button onClick={onSave} disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? "Enregistrement…" : saved ? "Enregistré" : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}

export default function Gouvernance() {
  const { organizationId, loading: orgLoading } = useOrganization();
  const { toast } = useToast();
  const [openCat, setOpenCat] = useState<string | null>(null);
  const [allData, setAllData] = useState<Record<string, Record<string, any>>>({});
  const [scores, setScores] = useState<Record<string, number | null>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [savedCats, setSavedCats] = useState<Set<string>>(new Set());
  const [dataLoading, setDataLoading] = useState(true);
  const year = new Date().getFullYear().toString();

  useEffect(() => {
    if (!organizationId) { setDataLoading(false); return; }
    supabase.from("esg_data").select("category, data, score").eq("organization_id", organizationId).eq("pillar", "G").eq("period", year)
      .then(({ data: rows }) => {
        if (rows) {
          const d: Record<string, Record<string, any>> = {}; const s: Record<string, number | null> = {}; const sv = new Set<string>();
          rows.forEach((r) => { d[r.category] = (r.data as Record<string, any>) ?? {}; s[r.category] = r.score; sv.add(r.category); });
          setAllData(d); setScores(s); setSavedCats(sv);
        }
        setDataLoading(false);
      });
  }, [organizationId, year]);

  const handleChange = useCallback((catId: string, key: string, value: string) => {
    setAllData((prev) => ({ ...prev, [catId]: { ...(prev[catId] ?? {}), [key]: value } }));
    setSavedCats((prev) => { const n = new Set(prev); n.delete(catId); return n; });
  }, []);

  const handleSave = useCallback(async (cat: Category) => {
    if (!organizationId) return;
    setSaving(cat.id);
    const catData = allData[cat.id] ?? {};
    const score = cat.scoreFn(catData);
    const { error } = await supabase.from("esg_data").upsert(
      { organization_id: organizationId, pillar: "G", category: cat.id, period: year, data: catData, score },
      { onConflict: "organization_id,pillar,category,period" }
    );
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); }
    else { setScores((prev) => ({ ...prev, [cat.id]: score })); setSavedCats((prev) => new Set(prev).add(cat.id)); toast({ title: "Données enregistrées" }); }
    setSaving(null);
  }, [organizationId, allData, year, toast]);

  const completedCount = CATEGORIES.filter((c) => savedCats.has(c.id)).length;
  const validScores = Object.values(scores).filter((s): s is number => s !== null);
  const globalScore = validScores.length ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : null;

  if (orgLoading || dataLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-violet-600" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6 text-violet-600" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-2xl text-foreground">Module Gouvernance</h2>
          <p className="text-muted-foreground text-sm mt-1 max-w-xl">
            Évaluez vos pratiques de gouvernance : transparence, éthique, gestion des risques et conformité réglementaire.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-violet-200 bg-violet-50 p-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 mb-1">Score Gouvernance</p>
          <p className="font-heading font-extrabold text-4xl text-foreground">
            {globalScore !== null ? globalScore : "—"}<span className="text-lg text-muted-foreground font-normal">/100</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Catégories complétées</p>
          <p className="font-bold text-foreground">{completedCount} / {CATEGORIES.length}</p>
        </div>
      </div>

      <div className="space-y-3">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon; const isOpen = openCat === cat.id; const isSaved = savedCats.has(cat.id); const score = scores[cat.id];
          return (
            <div key={cat.id} className="rounded-xl border border-border bg-card overflow-hidden">
              <button onClick={() => setOpenCat(isOpen ? null : cat.id)} className="w-full p-5 flex items-center gap-4 hover:bg-violet-50/30 transition-all">
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${isSaved ? "bg-violet-100 border-violet-300" : "bg-violet-50 border-violet-200"}`}>
                  {isSaved ? <Check className="w-5 h-5 text-violet-600" /> : <Icon className="w-5 h-5 text-violet-600" />}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="font-semibold text-sm text-foreground">{cat.label}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.desc}</p>
                </div>
                {score !== null && score !== undefined && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${score >= 70 ? "bg-violet-100 text-violet-700" : score >= 40 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{score}/100</span>
                )}
                {!isSaved && score === undefined && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground shrink-0">À compléter</span>}
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 border-t border-border">
                  <CategoryForm cat={cat} data={allData[cat.id] ?? {}} onChange={(k, v) => handleChange(cat.id, k, v)} onSave={() => handleSave(cat)} saving={saving === cat.id} saved={isSaved} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
