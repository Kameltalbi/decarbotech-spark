import { useState, useEffect, useCallback } from "react";
import { 
  CheckCircle2, Circle, AlertCircle, HelpCircle, BookOpen, 
  ChevronDown, ChevronUp, FileText, ExternalLink, Save, 
  CheckSquare, Square, MinusSquare, TrendingUp, Award,
  Filter, Search, Building2, Globe2, Landmark, Scale,
  Info, ArrowRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { useToast } from "@/hooks/use-toast";
import { 
  COMPLIANCE_STANDARDS, 
  getStandardById, 
  getMaterialityLabel,
  getStatusColor,
  type ComplianceStatus,
  type Standard,
  type Requirement
} from "@/data/complianceStandards";

interface ComplianceData {
  [requirementId: string]: {
    status: ComplianceStatus;
    comment?: string;
    proofUrl?: string;
    updatedAt?: string;
  };
}

export default function Conformite() {
  const { organizationId, loading: orgLoading } = useOrganization();
  const { toast } = useToast();
  const [selectedStandard, setSelectedStandard] = useState<string>("esrs");
  const [complianceData, setComplianceData] = useState<ComplianceData>({});
  const [expandedReq, setExpandedReq] = useState<string | null>(null);
  const [filterPillar, setFilterPillar] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  const currentStandard = getStandardById(selectedStandard)!;

  // Load compliance data from Supabase
  useEffect(() => {
    if (!organizationId) return;
    
    supabase
      .from("compliance_statuses")
      .select("requirement_id, status, comment, proof_url, updated_at")
      .eq("organization_id", organizationId)
      .eq("standard_id", selectedStandard)
      .then(({ data }) => {
        if (data) {
          const mapped: ComplianceData = {};
          data.forEach((item: any) => {
            mapped[item.requirement_id] = {
              status: item.status,
              comment: item.comment,
              proofUrl: item.proof_url,
              updatedAt: item.updated_at,
            };
          });
          setComplianceData(mapped);
        }
      });
  }, [organizationId, selectedStandard]);

  const handleStatusChange = async (reqId: string, status: ComplianceStatus) => {
    if (!organizationId) return;
    
    setSaving(reqId);
    const newData = { ...complianceData, [reqId]: { 
      ...complianceData[reqId], 
      status,
      updatedAt: new Date().toISOString()
    }};
    setComplianceData(newData);

    const { error } = await supabase.from("compliance_statuses").upsert({
      organization_id: organizationId,
      standard_id: selectedStandard,
      requirement_id: reqId,
      status,
      updated_at: new Date().toISOString(),
    }, { onConflict: "organization_id,standard_id,requirement_id" });

    setSaving(null);
    
    if (error) {
      toast({ title: "Erreur sauvegarde", description: error.message, variant: "destructive" });
    }
  };

  const handleCommentChange = async (reqId: string, comment: string) => {
    if (!organizationId) return;
    
    const currentStatus = complianceData[reqId]?.status || "na";
    const newData = { ...complianceData, [reqId]: { 
      ...complianceData[reqId], 
      comment,
      status: currentStatus,
      updatedAt: new Date().toISOString()
    }};
    setComplianceData(newData);

    await supabase.from("compliance_statuses").upsert({
      organization_id: organizationId,
      standard_id: selectedStandard,
      requirement_id: reqId,
      status: currentStatus,
      comment,
      updated_at: new Date().toISOString(),
    }, { onConflict: "organization_id,standard_id,requirement_id" });
  };

  // Calculate statistics
  const getStats = () => {
    const reqs = currentStandard.requirements;
    const total = reqs.length;
    const conforme = reqs.filter(r => complianceData[r.id]?.status === "conforme").length;
    const partiel = reqs.filter(r => complianceData[r.id]?.status === "partiel").length;
    const nonConforme = reqs.filter(r => complianceData[r.id]?.status === "non_conforme").length;
    const na = reqs.filter(r => complianceData[r.id]?.status === "na").length;
    const nonEvalue = total - conforme - partiel - nonConforme - na;
    
    return { total, conforme, partiel, nonConforme, na, nonEvalue, progress: Math.round(((conforme + na) / total) * 100) };
  };

  const stats = getStats();

  // Filter requirements
  const filteredRequirements = currentStandard.requirements.filter(req => {
    if (filterPillar !== "all" && req.pillar !== filterPillar) return false;
    if (filterStatus !== "all") {
      const status = complianceData[req.id]?.status;
      if (filterStatus === "null" && status) return false;
      if (filterStatus !== "null" && status !== filterStatus) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return req.title.toLowerCase().includes(q) || 
             req.description.toLowerCase().includes(q) ||
             req.code.toLowerCase().includes(q);
    }
    return true;
  });

  if (orgLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-2xl text-foreground">Conformité Normes Internationales</h2>
            <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
              Évaluez votre conformité aux standards ESG : ESRS (CSRD), GRI, ISSB, TCFD et SASB.
            </p>
          </div>
        </div>
      </div>

      {/* Standards selector */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {COMPLIANCE_STANDARDS.map((std) => (
          <button
            key={std.id}
            onClick={() => setSelectedStandard(std.id)}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedStandard === std.id
                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                : "border-border bg-card hover:border-primary/30"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-lg text-foreground">{std.shortName}</span>
              {std.mandatoryInEU && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                  EU
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{std.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                std.materialityType === "double" ? "bg-violet-100 text-violet-700" :
                std.materialityType === "financial" ? "bg-blue-100 text-blue-700" :
                "bg-emerald-100 text-emerald-700"
              }`}>
                {getMaterialityLabel(std.materialityType)}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Standard details */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground">{currentStandard.fullName}</h3>
              <p className="text-sm text-muted-foreground">{currentStandard.application}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                  Version: {currentStandard.version}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                  Audience: {currentStandard.targetAudience}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                  {currentStandard.requirements.length} exigences
                </span>
              </div>
            </div>
          </div>
          
          {/* Progress */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{stats.progress}%</p>
              <p className="text-xs text-muted-foreground">Conformité</p>
            </div>
            <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${stats.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une exigence..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select
          value={filterPillar}
          onChange={(e) => setFilterPillar(e.target.value)}
          className="px-4 py-2 rounded-lg border border-border bg-background text-sm"
        >
          <option value="all">Tous piliers</option>
          <option value="E">Environnement</option>
          <option value="S">Social</option>
          <option value="G">Gouvernance</option>
          <option value="Transverse">Transverse</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border border-border bg-background text-sm"
        >
          <option value="all">Tous statuts</option>
          <option value="conforme">Conforme</option>
          <option value="partiel">Partiel</option>
          <option value="non_conforme">Non conforme</option>
          <option value="na">N/A</option>
          <option value="null">Non évalué</option>
        </select>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-center">
          <p className="text-2xl font-bold text-emerald-600">{stats.conforme}</p>
          <p className="text-xs text-emerald-700">Conforme</p>
        </div>
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 text-center">
          <p className="text-2xl font-bold text-amber-600">{stats.partiel}</p>
          <p className="text-xs text-amber-700">Partiel</p>
        </div>
        <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.nonConforme}</p>
          <p className="text-xs text-red-700">Non conforme</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
          <p className="text-2xl font-bold text-slate-600">{stats.na}</p>
          <p className="text-xs text-slate-700">N/A</p>
        </div>
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-600">{stats.nonEvalue}</p>
          <p className="text-xs text-gray-700">Non évalué</p>
        </div>
      </div>

      {/* Requirements list */}
      <div className="space-y-3">
        {filteredRequirements.map((req) => {
          const status = complianceData[req.id]?.status;
          const isExpanded = expandedReq === req.id;
          
          return (
            <div
              key={req.id}
              className={`rounded-xl border overflow-hidden transition-all ${
                status === "conforme" ? "border-emerald-200" :
                status === "partiel" ? "border-amber-200" :
                status === "non_conforme" ? "border-red-200" :
                "border-border"
              }`}
            >
              <div
                className="p-4 flex items-start gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setExpandedReq(isExpanded ? null : req.id)}
              >
                {/* Status selector */}
                <div className="shrink-0 pt-0.5">
                  <select
                    value={status ?? ""}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleStatusChange(req.id, e.target.value as ComplianceStatus || null)}
                    disabled={saving === req.id}
                    className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                      status === "conforme" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                      status === "partiel" ? "bg-amber-100 text-amber-700 border-amber-200" :
                      status === "non_conforme" ? "bg-red-100 text-red-700 border-red-200" :
                      status === "na" ? "bg-slate-100 text-slate-600 border-slate-200" :
                      "bg-gray-100 text-gray-500 border-gray-200"
                    }`}
                  >
                    <option value="">Non évalué</option>
                    <option value="conforme">Conforme</option>
                    <option value="partiel">Partiel</option>
                    <option value="non_conforme">Non conforme</option>
                    <option value="na">N/A</option>
                  </select>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-primary">{req.code}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      req.obligation === "Obligatoire" ? "bg-red-100 text-red-700" :
                      req.obligation === "Recommandé" ? "bg-amber-100 text-amber-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {req.obligation}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      req.pillar === "E" ? "bg-emerald-100 text-emerald-700" :
                      req.pillar === "S" ? "bg-blue-100 text-blue-700" :
                      req.pillar === "G" ? "bg-violet-100 text-violet-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {req.pillar}
                    </span>
                  </div>
                  <h4 className="font-semibold text-foreground">{req.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{req.description}</p>
                </div>

                {/* Expand */}
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t border-border bg-muted/20">
                  <div className="pt-4 space-y-4">
                    {/* Description full */}
                    <div>
                      <p className="text-sm text-foreground">{req.description}</p>
                      {req.guidance && (
                        <p className="text-sm text-muted-foreground mt-2 italic">{req.guidance}</p>
                      )}
                    </div>

                    {/* Materiality */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Type de matérialité:</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        req.materiality === "double" ? "bg-violet-100 text-violet-700" :
                        req.materiality === "financial" ? "bg-blue-100 text-blue-700" :
                        "bg-emerald-100 text-emerald-700"
                      }`}>
                        {getMaterialityLabel(req.materiality)}
                      </span>
                    </div>

                    {/* Proof examples */}
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-2">Exemples de preuves:</p>
                      <div className="flex flex-wrap gap-2">
                        {req.proofExamples.map((example, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-full bg-background border border-border">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    <div>
                      <label className="text-sm font-semibold text-foreground">Commentaire / Preuve:</label>
                      <textarea
                        value={complianceData[req.id]?.comment || ""}
                        onChange={(e) => handleCommentChange(req.id, e.target.value)}
                        placeholder="Décrivez votre conformité et joignez les preuves..."
                        className="w-full mt-2 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredRequirements.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Filter className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Aucune exigence ne correspond aux filtres sélectionnés.</p>
        </div>
      )}
    </div>
  );
}
