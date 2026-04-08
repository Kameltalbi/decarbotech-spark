import { useState, useEffect } from "react";
import { 
  Sparkles, Loader2, CheckCircle2, Circle, Clock, AlertCircle, 
  ChevronDown, ChevronUp, FileText, TrendingUp, Target, AlertTriangle,
  Calendar, DollarSign, BookOpen, RefreshCw, Download
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { useToast } from "@/hooks/use-toast";
import { generateCompliancePlan, type CompliancePlan, type ComplianceAction } from "@/services/openai";

const STANDARDS = [
  { value: "CSRD", label: "CSRD / ESRS (UE)", desc: "Corporate Sustainability Reporting Directive" },
  { value: "GRI", label: "GRI Standards", desc: "Global Reporting Initiative" },
  { value: "SBTi", label: "SBTi", desc: "Science Based Targets initiative" },
];

interface ActionStatus {
  actionId: string;
  status: "todo" | "in_progress" | "done";
  notes?: string;
  updatedAt?: string;
}

export default function PlanAction() {
  const { organizationId, loading: orgLoading } = useOrganization();
  const { toast } = useToast();
  const [plan, setPlan] = useState<CompliancePlan | null>(null);
  const [generating, setGenerating] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState("CSRD");
  const [apiKey, setApiKey] = useState("");
  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const [actionStatuses, setActionStatuses] = useState<Record<string, ActionStatus>>({});
  const [esgData, setEsgData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);

  const year = new Date().getFullYear().toString();

  // Load ESG data and any saved plan
  useEffect(() => {
    if (!organizationId) { setDataLoading(false); return; }
    
    Promise.all([
      // Load ESG data
      supabase
        .from("esg_data")
        .select("pillar, category, score, data")
        .eq("organization_id", organizationId)
        .eq("period", year),
      // Load organization details
      supabase
        .from("organizations")
        .select("name, sector, size")
        .eq("id", organizationId)
        .single(),
      // Load saved plan statuses
      supabase
        .from("action_statuses")
        .select("action_id, status, notes, updated_at")
        .eq("organization_id", organizationId)
    ]).then(([esgRes, orgRes, statusRes]) => {
      const categories = esgRes.data || [];
      const org = orgRes.data;
      const statuses = statusRes.data || [];

      // Calculate pillar scores
      const pillarScores = {
        E: calculatePillarScore(categories, "E"),
        S: calculatePillarScore(categories, "S"),
        G: calculatePillarScore(categories, "G"),
      };

      setEsgData({
        organization: org,
        pillarScores,
        categories,
      });

      // Load action statuses
      const statusMap: Record<string, ActionStatus> = {};
      statuses.forEach((s: any) => {
        statusMap[s.action_id] = {
          actionId: s.action_id,
          status: s.status,
          notes: s.notes,
          updatedAt: s.updated_at,
        };
      });
      setActionStatuses(statusMap);
      setDataLoading(false);
    });
  }, [organizationId, year]);

  function calculatePillarScore(categories: any[], pillar: string): number | null {
    const pillarCats = categories.filter(c => c.pillar === pillar && c.score !== null);
    if (pillarCats.length === 0) return null;
    return Math.round(pillarCats.reduce((acc, c) => acc + (c.score || 0), 0) / pillarCats.length);
  }

  async function handleGenerate() {
    if (!apiKey.trim()) {
      toast({ title: "Clé API requise", description: "Veuillez saisir votre clé API OpenAI", variant: "destructive" });
      return;
    }
    if (!esgData || !esgData.organization) {
      toast({ title: "Données manquantes", description: "Remplissez d'abord les modules E, S et G", variant: "destructive" });
      return;
    }

    setGenerating(true);
    try {
      const newPlan = await generateCompliancePlan(esgData, selectedStandard as any, apiKey);
      setPlan(newPlan);
      toast({ title: "Plan généré", description: `${newPlan.actions.length} actions créées` });
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  }

  async function updateActionStatus(actionId: string, status: ActionStatus["status"]) {
    if (!organizationId) return;
    
    const newStatus = { actionId, status, updatedAt: new Date().toISOString() };
    setActionStatuses(prev => ({ ...prev, [actionId]: newStatus }));

    // Save to Supabase
    await supabase.from("action_statuses").upsert({
      organization_id: organizationId,
      action_id: actionId,
      status,
      updated_at: new Date().toISOString(),
    }, { onConflict: "organization_id,action_id" });
  }

  const getProgressStats = () => {
    if (!plan) return { done: 0, inProgress: 0, todo: 0, total: 0 };
    const done = plan.actions.filter(a => actionStatuses[a.id]?.status === "done").length;
    const inProgress = plan.actions.filter(a => actionStatuses[a.id]?.status === "in_progress").length;
    const todo = plan.actions.length - done - inProgress;
    return { done, inProgress, todo, total: plan.actions.length };
  };

  const stats = getProgressStats();
  const progressPercent = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  if (orgLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-2xl text-foreground">Plan de Conformité IA</h2>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Générez un plan d'action ESG personnalisé basé sur vos données et propulsé par l'IA.
          </p>
        </div>
      </div>

      {/* Configuration */}
      {!plan && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <h3 className="font-heading font-bold text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Configuration
          </h3>

          {/* Standard selection */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block">Standard de conformité</label>
            <div className="grid sm:grid-cols-3 gap-3">
              {STANDARDS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSelectedStandard(s.value)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    selectedStandard === s.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <p className="font-semibold text-sm text-foreground">{s.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Clé API OpenAI
              <span className="text-xs text-muted-foreground font-normal ml-2">(votre clé reste locale, non stockée)</span>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full max-w-md px-4 py-2.5 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Data preview */}
          {esgData?.pillarScores && (
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm font-semibold text-foreground mb-2">Données disponibles</p>
              <div className="flex flex-wrap gap-2">
                {esgData.pillarScores.E !== null && (
                  <span className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">
                    E: {esgData.pillarScores.E}/100
                  </span>
                )}
                {esgData.pillarScores.S !== null && (
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                    S: {esgData.pillarScores.S}/100
                  </span>
                )}
                {esgData.pillarScores.G !== null && (
                  <span className="px-2 py-1 rounded-full text-xs bg-violet-100 text-violet-700">
                    G: {esgData.pillarScores.G}/100
                  </span>
                )}
                {esgData.pillarScores.E === null && esgData.pillarScores.S === null && esgData.pillarScores.G === null && (
                  <span className="text-xs text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Remplissez les modules E, S et G pour générer un plan pertinent
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={generating || !apiKey.trim()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Génération en cours…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Générer mon plan de conformité
              </>
            )}
          </button>
        </div>
      )}

      {/* Generated Plan */}
      {plan && (
        <div className="space-y-6">
          {/* Plan Header */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h3 className="font-heading font-bold text-xl text-foreground">{plan.titre}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPlan(null)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border text-sm font-semibold hover:bg-muted transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Régénérer
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Download className="w-4 h-4" />
                  Exporter
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progression du plan</span>
                <span className="font-semibold text-foreground">{progressPercent}% ({stats.done}/{stats.total})</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-3 rounded-lg bg-red-50 border border-red-100">
                <p className="text-2xl font-bold text-red-600">{plan.priorites_haute}</p>
                <p className="text-xs text-red-700">Priorités hautes</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-amber-50 border border-amber-100">
                <p className="text-2xl font-bold text-amber-600">{plan.priorites_moyenne}</p>
                <p className="text-xs text-amber-700">Priorités moyennes</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                <p className="text-2xl font-bold text-emerald-600">{plan.priorites_basse}</p>
                <p className="text-xs text-emerald-700">Priorités basses</p>
              </div>
            </div>
          </div>

          {/* Actions List */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Actions recommandées ({plan.actions.length})
            </h4>

            {plan.actions.map((action) => {
              const status = actionStatuses[action.id]?.status || "todo";
              const isExpanded = expandedAction === action.id;
              const isDone = status === "done";

              return (
                <div
                  key={action.id}
                  className={`rounded-xl border overflow-hidden transition-all ${
                    isDone ? "border-emerald-200 bg-emerald-50/30" : "border-border bg-card"
                  }`}
                >
                  <div
                    className="p-4 flex items-start gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandedAction(isExpanded ? null : action.id)}
                  >
                    {/* Status toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const nextStatus = status === "todo" ? "in_progress" : status === "in_progress" ? "done" : "todo";
                        updateActionStatus(action.id, nextStatus);
                      }}
                      className="shrink-0 mt-0.5"
                    >
                      {status === "done" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : status === "in_progress" ? (
                        <Clock className="w-5 h-5 text-amber-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          action.priorite === "Haute" ? "bg-red-100 text-red-700" :
                          action.priorite === "Moyenne" ? "bg-amber-100 text-amber-700" :
                          "bg-emerald-100 text-emerald-700"
                        }`}>
                          {action.priorite}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          action.categorie === "E" ? "bg-emerald-100 text-emerald-700" :
                          action.categorie === "S" ? "bg-blue-100 text-blue-700" :
                          "bg-violet-100 text-violet-700"
                        }`}>
                          {action.categorie}
                        </span>
                        {isDone && <span className="text-xs text-emerald-600 font-medium">Terminé</span>}
                      </div>
                      <p className={`text-sm font-medium ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}>
                        {action.recommandation}
                      </p>
                    </div>

                    {/* Expand icon */}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-border">
                      <div className="pt-4 space-y-3">
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm">
                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Standard:</span>
                            <span className="font-medium">{action.standard_ref}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Délai:</span>
                            <span className="font-medium">{action.delai_mois} mois</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Coût estimé:</span>
                            <span className="font-medium">{action.cout_estime}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Document:</span>
                            <span className="font-medium">{action.template_requis}</span>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                          <p className="text-sm">
                            <span className="font-semibold text-foreground">Bénéfice métier:</span>{" "}
                            <span className="text-muted-foreground">{action.benefice_metier}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
