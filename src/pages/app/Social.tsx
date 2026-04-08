import { useState, useEffect, useCallback } from "react";
import { Users, Heart, GraduationCap, ShieldCheck, Equal, SmilePlus, ChevronDown, Save, Check, Loader2 } from "lucide-react";
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
    id: "bienetre",
    icon: Heart,
    label: "Bien-être & satisfaction",
    desc: "Baromètre social, eNPS, qualité de vie au travail",
    fields: [
      { key: "enps", label: "Score eNPS", unit: "(-100 à 100)", type: "number" },
      { key: "barometre", label: "Baromètre social réalisé ?", type: "select", options: YES_NO },
      { key: "qvt", label: "Démarche QVT en place ?", type: "select", options: YES_NO },
      { key: "maturite_bienetre", label: "Maturité bien-être", type: "select", options: MATURITY },
    ],
    scoreFn: (d) => avg([yesScore(d.barometre), yesScore(d.qvt), numScore(d.maturite_bienetre)]),
  },
  {
    id: "sante_securite",
    icon: ShieldCheck,
    label: "Santé & sécurité",
    desc: "Taux AT/MP, politique SST, ISO 45001",
    fields: [
      { key: "taux_at", label: "Taux d'accidents du travail", unit: "%", type: "number" },
      { key: "taux_mp", label: "Taux de maladies professionnelles", unit: "%", type: "number" },
      { key: "politique_sst", label: "Politique SST formalisée ?", type: "select", options: YES_NO },
      { key: "iso_45001", label: "Certification ISO 45001 ?", type: "select", options: YES_NO },
    ],
    scoreFn: (d) => avg([yesScore(d.politique_sst), yesScore(d.iso_45001)]),
  },
  {
    id: "formation",
    icon: GraduationCap,
    label: "Formation & développement",
    desc: "Heures de formation, budget, plan de montée en compétences",
    fields: [
      { key: "heures_formation", label: "Heures de formation / salarié / an", unit: "h", type: "number" },
      { key: "budget_formation", label: "Budget formation / masse salariale", unit: "%", type: "number" },
      { key: "plan_competences", label: "Plan de montée en compétences ?", type: "select", options: YES_NO },
      { key: "entretiens_annuels", label: "Entretiens annuels systématiques ?", type: "select", options: YES_NO },
    ],
    scoreFn: (d) => avg([yesScore(d.plan_competences), yesScore(d.entretiens_annuels)]),
  },
  {
    id: "diversite",
    icon: Equal,
    label: "Diversité & inclusion",
    desc: "Index égalité F/H, représentation, politique D&I",
    fields: [
      { key: "index_egalite", label: "Index égalité femmes-hommes", unit: "/100", type: "number" },
      { key: "politique_di", label: "Politique diversité & inclusion ?", type: "select", options: YES_NO },
      { key: "handicap", label: "Actions en faveur du handicap ?", type: "select", options: YES_NO },
      { key: "maturite_diversite", label: "Maturité D&I", type: "select", options: MATURITY },
    ],
    scoreFn: (d) => avg([numScore(d.index_egalite), yesScore(d.politique_di), yesScore(d.handicap), numScore(d.maturite_diversite)]),
  },
  {
    id: "conditions_travail",
    icon: SmilePlus,
    label: "Conditions de travail",
    desc: "Turnover, absentéisme, rémunération, avantages sociaux",
    fields: [
      { key: "turnover", label: "Taux de turnover", unit: "%", type: "number" },
      { key: "absenteisme", label: "Taux d'absentéisme", unit: "%", type: "number" },
      { key: "teletravail", label: "Politique de télétravail ?", type: "select", options: YES_NO },
      { key: "avantages_sociaux", label: "Avantages sociaux compétitifs ?", type: "select", options: YES_NO },
    ],
    scoreFn: (d) => avg([yesScore(d.teletravail), yesScore(d.avantages_sociaux)]),
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
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-300/50" placeholder="0" />
          ) : (
            <select value={data[f.key] ?? ""} onChange={(e) => onChange(f.key, e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-300/50">
              {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          )}
        </div>
      ))}
      <div className="sm:col-span-2 flex justify-end pt-2">
        <button onClick={onSave} disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? "Enregistrement…" : saved ? "Enregistré" : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}

export default function Social() {
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
    supabase.from("esg_data").select("category, data, score").eq("organization_id", organizationId).eq("pillar", "S").eq("period", year)
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
      { organization_id: organizationId, pillar: "S", category: cat.id, period: year, data: catData, score },
      { onConflict: "organization_id,pillar,category,period" }
    );
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); }
    else { setScores((prev) => ({ ...prev, [cat.id]: score })); setSavedCats((prev) => new Set(prev).add(cat.id)); toast({ title: "Données enregistrées" }); }
    setSaving(null);
  }, [organizationId, allData, year, toast]);

  const completedCount = CATEGORIES.filter((c) => savedCats.has(c.id)).length;
  const validScores = Object.values(scores).filter((s): s is number => s !== null);
  const globalScore = validScores.length ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : null;

  if (orgLoading || dataLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
          <Users className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-2xl text-foreground">Module Social</h2>
          <p className="text-muted-foreground text-sm mt-1 max-w-xl">
            Renseignez vos données sociales pour évaluer vos pratiques RH, bien-être et diversité, et recevoir des recommandations.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">Score Social</p>
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
              <button onClick={() => setOpenCat(isOpen ? null : cat.id)} className="w-full p-5 flex items-center gap-4 hover:bg-blue-50/30 transition-all">
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${isSaved ? "bg-blue-100 border-blue-300" : "bg-blue-50 border-blue-200"}`}>
                  {isSaved ? <Check className="w-5 h-5 text-blue-600" /> : <Icon className="w-5 h-5 text-blue-600" />}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="font-semibold text-sm text-foreground">{cat.label}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.desc}</p>
                </div>
                {score !== null && score !== undefined && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${score >= 70 ? "bg-blue-100 text-blue-700" : score >= 40 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{score}/100</span>
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
