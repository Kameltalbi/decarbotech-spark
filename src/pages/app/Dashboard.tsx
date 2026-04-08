import { useState, useEffect } from "react";
import { Leaf, Users, ShieldCheck, TrendingUp, Target, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";

const PILLARS = [
  { key: "E", label: "Environnement", icon: Leaf, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", href: "/app/environnement" },
  { key: "S", label: "Social", icon: Users, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", href: "/app/social" },
  { key: "G", label: "Gouvernance", icon: ShieldCheck, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200", href: "/app/gouvernance" },
];

interface EsgRow {
  pillar: string;
  category: string;
  score: number | null;
  data: Record<string, any>;
}

export default function Dashboard() {
  const { organizationId, loading: orgLoading } = useOrganization();
  const [rows, setRows] = useState<EsgRow[]>([]);
  const [loading, setLoading] = useState(true);
  const year = new Date().getFullYear().toString();

  useEffect(() => {
    if (!organizationId) { setLoading(false); return; }
    supabase
      .from("esg_data")
      .select("pillar, category, score, data")
      .eq("organization_id", organizationId)
      .eq("period", year)
      .then(({ data }) => {
        setRows((data as EsgRow[]) ?? []);
        setLoading(false);
      });
  }, [organizationId, year]);

  // Compute scores per pillar
  const pillarScores = PILLARS.map((p) => {
    const pRows = rows.filter((r) => r.pillar === p.key && r.score !== null);
    const avg = pRows.length ? Math.round(pRows.reduce((acc, r) => acc + (r.score ?? 0), 0) / pRows.length) : null;
    return { ...p, score: avg, count: pRows.length };
  });

  // Global ESG score
  const validPillarScores = pillarScores.map((p) => p.score).filter((s): s is number => s !== null);
  const globalScore = validPillarScores.length ? Math.round(validPillarScores.reduce((a, b) => a + b, 0) / validPillarScores.length) : null;

  // Priorities: lowest scored categories across all pillars
  const priorities = rows
    .filter((r) => r.score !== null)
    .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
    .slice(0, 3);

  const progressPct = Math.round((rows.length / 15) * 100); // 5 catégories x 3 piliers = 15

  if (orgLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome banner */}
      <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
        <h2 className="font-heading font-bold text-2xl text-foreground mb-2">
          Bienvenue sur votre espace ESG
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
          Suivez vos performances Environnement, Social et Gouvernance, identifiez vos priorités et générez vos rapports de conformité.
        </p>
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progression globale</span>
            <span className="font-semibold text-foreground">{progressPct}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      {/* Score cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Global score */}
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Score ESG</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <p className="font-heading font-extrabold text-3xl text-foreground">
            {globalScore !== null ? globalScore : "—"}
            <span className="text-lg text-muted-foreground font-normal">/100</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {globalScore !== null ? "Score calculé sur vos données" : "Complétez vos modules pour obtenir votre score"}
          </p>
        </div>

        {/* Pillar scores */}
        {pillarScores.map((p) => {
          const Icon = p.icon;
          return (
            <a key={p.key} href={p.href} className={`rounded-xl border ${p.border} ${p.bg} p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold uppercase tracking-wider ${p.color}`}>{p.label}</span>
                <Icon className={`w-4 h-4 ${p.color}`} />
              </div>
              <p className="font-heading font-extrabold text-3xl text-foreground">
                {p.score !== null ? p.score : "—"}
                <span className="text-lg text-muted-foreground font-normal">/100</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {p.count > 0 ? `${p.count} catégorie${p.count > 1 ? "s" : ""} complétée${p.count > 1 ? "s" : ""}` : "Aucune donnée"}
              </p>
            </a>
          );
        })}
      </div>

      {/* Quick actions & priorities */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Actions rapides */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-heading font-bold text-lg text-foreground mb-4 flex items-center gap-2">
            <Target className="w-4.5 h-4.5 text-primary" />
            Actions rapides
          </h3>
          <div className="space-y-3">
            {[
              { label: "Renseigner vos données environnementales", href: "/app/environnement", done: pillarScores[0].count > 0 },
              { label: "Compléter le volet social", href: "/app/social", done: pillarScores[1].count > 0 },
              { label: "Évaluer votre gouvernance", href: "/app/gouvernance", done: pillarScores[2].count > 0 },
              { label: "Générer votre premier rapport", href: "/app/rapports", done: globalScore !== null },
            ].map((a) => (
              <a
                key={a.href}
                href={a.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-sm font-medium text-foreground group"
              >
                <span className={`w-2 h-2 rounded-full transition-colors ${a.done ? "bg-emerald-500" : "bg-primary/40 group-hover:bg-primary"}`} />
                <span className={a.done ? "line-through text-muted-foreground" : ""}>{a.label}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>

        {/* Priorities */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-heading font-bold text-lg text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
            Priorités identifiées
          </h3>
          {priorities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground text-sm">
                Les priorités apparaîtront une fois vos données renseignées dans les modules E, S et G.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {priorities.map((p) => {
                const pillar = PILLARS.find((pi) => pi.key === p.pillar);
                return (
                  <a
                    key={`${p.pillar}-${p.category}`}
                    href={pillar?.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <span className={`w-2 h-2 rounded-full ${pillar?.color.replace("text-", "bg-")}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground capitalize">{p.category.replace(/_/g, " ")}</p>
                      <p className="text-xs text-muted-foreground">{pillar?.label}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${(p.score ?? 0) < 40 ? "bg-red-100 text-red-700" : (p.score ?? 0) < 70 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {p.score}/100
                    </span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
