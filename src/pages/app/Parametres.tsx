import { Settings, Building2, User, Bell, Palette } from "lucide-react";

const SECTIONS = [
  { icon: Building2, label: "Organisation", desc: "Nom, secteur, taille, adresse de l'entreprise" },
  { icon: User, label: "Profil utilisateur", desc: "Nom, email, rôle, mot de passe" },
  { icon: Bell, label: "Notifications", desc: "Alertes, rappels de mise à jour, rapports périodiques" },
  { icon: Palette, label: "Personnalisation", desc: "Logo, couleurs de l'entreprise pour les rapports" },
];

export default function Parametres() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0">
          <Settings className="w-6 h-6 text-muted-foreground" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-2xl text-foreground">Paramètres</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Configurez votre organisation, votre profil et vos préférences.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-card p-5 flex items-center gap-4 hover:border-primary/30 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-foreground">{s.label}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Ces paramètres seront fonctionnels une fois l'authentification Supabase connectée.
        </p>
      </div>
    </div>
  );
}
