import { Leaf, Flame, Building2, Droplets, Trash2, ExternalLink } from "lucide-react";
import logoDecarbotech from "@/assets/logo_decarbotech.png";
import logoCarboscan from "@/assets/logo_carboscan.png";
import logoDecarbobat from "@/assets/logo_decarbobat.png";
import logoHydroscan from "@/assets/logo_hydroscan.png";
import logoWastescan from "@/assets/logo_wastescan.svg";

const PLATFORMS = [
  {
    name: "DecarboTech",
    desc: "Plateforme mère ESG — pilotez vos performances Environnement, Social et Gouvernance depuis un dashboard unifié.",
    logo: logoDecarbotech,
    icon: Leaf,
    gradient: "from-emerald-500 to-emerald-700",
    url: null, // current platform
    featured: true,
  },
  {
    name: "CarboScan",
    desc: "Bilan Carbone complet & Analyse du Cycle de Vie (ACV) pour mesurer et réduire votre empreinte carbone.",
    logo: logoCarboscan,
    icon: Flame,
    gradient: "from-green-500 to-green-700",
    url: "https://carboscan.io",
    featured: false,
  },
  {
    name: "DecarboBat",
    desc: "ACV Bâtiment et conformité RE2020 — optimisez l'impact environnemental de vos projets de construction.",
    logo: logoDecarbobat,
    icon: Building2,
    gradient: "from-amber-500 to-amber-700",
    url: "https://decarbobat.io",
    featured: false,
  },
  {
    name: "HydroScan",
    desc: "Mesurez et optimisez votre empreinte eau avec des indicateurs de consommation et de stress hydrique.",
    logo: logoHydroscan,
    icon: Droplets,
    gradient: "from-blue-500 to-blue-700",
    url: "https://hydroscan.io",
    featured: false,
  },
  {
    name: "WasteScan",
    desc: "Gestion des déchets et économie circulaire — traçabilité, réduction et valorisation de vos flux.",
    logo: logoWastescan,
    icon: Trash2,
    gradient: "from-violet-500 to-violet-700",
    url: "https://wastescan.io",
    featured: false,
  },
];

export default function EcosystemSection() {
  const featured = PLATFORMS.find((p) => p.featured)!;
  const others = PLATFORMS.filter((p) => !p.featured);

  return (
    <section className="py-16 sm:py-24 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">
            Écosystème complet
          </p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground">
            L'écosystème ESG DecarboTech
          </h2>
          <p className="text-sm text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">
            Cinq plateformes spécialisées qui couvrent l'ensemble de vos enjeux environnementaux — du bilan carbone à la gestion des déchets.
          </p>
        </div>

        {/* Featured card - DecarboTech */}
        <div className="mb-6">
          <div className="relative rounded-xl border border-border bg-card overflow-hidden opacity-60 grayscale pointer-events-none select-none">
            <div className={`h-1.5 w-full bg-gradient-to-r ${featured.gradient}`} />
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <img
                src={featured.logo}
                alt={featured.name}
                className="h-14 w-auto object-contain"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-heading font-bold text-xl text-foreground">
                    {featured.name}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                    ✦ Vous êtes ici
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  {featured.desc}
                </p>
              </div>
              <featured.icon className="w-10 h-10 text-muted-foreground/30 shrink-0 hidden sm:block" />
            </div>
          </div>
        </div>

        {/* Other platforms */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {others.map((platform) => (
            <a
              key={platform.name}
              href={platform.url!}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-border bg-card overflow-hidden card-hover"
            >
              <div className={`h-1.5 w-full bg-gradient-to-r ${platform.gradient}`} />
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <img
                    src={platform.logo}
                    alt={platform.name}
                    className="h-9 w-auto object-contain"
                  />
                  <platform.icon className="w-5 h-5 text-muted-foreground/40 group-hover:text-foreground/60 transition-colors" />
                </div>
                <h3 className="font-heading font-bold text-base text-foreground mb-1.5 flex items-center gap-2">
                  {platform.name}
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {platform.desc}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
