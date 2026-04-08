import { FileBarChart, Download, FileText, Table2 } from "lucide-react";

const REPORT_TYPES = [
  { icon: FileBarChart, label: "Rapport ESG complet", desc: "Synthèse de vos scores E, S, G avec graphiques, recommandations et plan d'action", format: "PDF" },
  { icon: FileText, label: "Index GRI", desc: "Mapping de vos indicateurs vers les standards GRI (302, 303, 305, 306, 401, 403, 405…)", format: "PDF" },
  { icon: Table2, label: "Export données brutes", desc: "Téléchargez l'ensemble de vos données ESG au format tableur pour analyse externe", format: "Excel" },
];

export default function Rapports() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
          <FileBarChart className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-2xl text-foreground">Rapports & Conformité</h2>
          <p className="text-muted-foreground text-sm mt-1 max-w-xl">
            Générez vos rapports ESG conformes aux standards internationaux (GRI, CSRD, ESRS) et exportez vos données.
          </p>
        </div>
      </div>

      {/* Report types */}
      <div className="space-y-4">
        {REPORT_TYPES.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.label}
              className="rounded-xl border border-border bg-card p-6 flex items-center gap-5"
            >
              <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-foreground">{r.label}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
              </div>
              <button
                disabled
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-border text-sm font-semibold text-muted-foreground bg-muted cursor-not-allowed shrink-0"
              >
                <Download className="w-4 h-4" />
                {r.format}
              </button>
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Les rapports seront disponibles une fois vos données renseignées dans les modules Environnement, Social et Gouvernance.
        </p>
      </div>
    </div>
  );
}
