import { useState, useEffect, useRef } from "react";
import logo from "@/assets/logo_decarbotech.png";

const NAV_LINKS = [
  { label: "Solutions", href: "#produits" },
  { label: "Avantages", href: "#pourquoi" },
  { label: "Méthodologie", href: "#process" },
  { label: "Contact", href: "#contact" },
];

const PRODUCTS = [
  {
    name: "CarbonScan",
    emoji: "📊",
    description: "Mesurez et pilotez votre empreinte carbone d'entreprise en temps réel. Bilan carbone automatisé, reporting CSRD et plan de réduction personnalisé.",
    tags: ["Bilan Carbone", "CSRD", "Scope 1-2-3"],
    url: "https://carbonscan.io",
  },
  {
    name: "HydroScan",
    emoji: "💧",
    description: "Évaluez et optimisez votre empreinte eau. Monitoring en continu, détection de fuites et conformité réglementaire sur l'ensemble de vos sites.",
    tags: ["Empreinte Eau", "Monitoring", "Conformité"],
    url: "https://hydroscan.io",
  },
  {
    name: "DecarboBat",
    emoji: "🏗️",
    description: "Accompagnez la décarbonation du secteur du bâtiment. Simulation énergétique, conformité RE2020 et suivi des rénovations bas carbone.",
    tags: ["Bâtiment", "RE2020", "Rénovation"],
    url: "https://decarbobat.io",
  },
];

const FEATURES = [
  { icon: "⚡", title: "Données temps réel", desc: "Synchronisation continue avec vos systèmes existants pour des mesures toujours à jour." },
  { icon: "🔒", title: "Sécurité souveraine", desc: "Hébergement européen, chiffrement de bout en bout, conformité RGPD." },
  { icon: "🔗", title: "Intégration native", desc: "API REST et connecteurs ERP, CRM, comptabilité prêts à l'emploi." },
  { icon: "🏆", title: "Standards reconnus", desc: "Méthodologie alignée GHG Protocol, SBTi et taxonomie européenne." },
];

const STATS = [
  { label: "Tonnes CO₂ évitées", value: "2.4M+", pct: 85 },
  { label: "Entreprises clientes", value: "340+", pct: 70 },
  { label: "Pays couverts", value: "28", pct: 55 },
  { label: "Précision des mesures", value: "99.2%", pct: 99 },
];

const STEPS = [
  { num: "01", title: "Connectez", desc: "Intégrez vos sources de données en quelques clics via nos connecteurs certifiés." },
  { num: "02", title: "Mesurez", desc: "Notre moteur calcule automatiquement vos émissions scope 1, 2 et 3." },
  { num: "03", title: "Réduisez", desc: "Recevez des recommandations personnalisées pour diminuer votre impact." },
  { num: "04", title: "Reportez", desc: "Générez des rapports conformes et communiquez vos progrès aux parties prenantes." },
];

function useScrollVisible(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function ProgressBar({ pct, visible }: { pct: number; visible: boolean }) {
  return (
    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
      <div
        className="h-full rounded-full bg-primary transition-all duration-[1.2s] ease-out"
        style={{ width: visible ? `${pct}%` : "0%" }}
      />
    </div>
  );
}

export default function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const statsSection = useScrollVisible(0.3);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-nav shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-[72px]">
          <a href="#" className="flex items-center">
            <img src={logo} alt="DecarboTech" className="h-10" />
          </a>
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              className="px-6 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Prendre rendez-vous
            </a>
          </div>
          <button className="md:hidden text-foreground" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenu
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden bg-card border-t border-border px-5 pb-5 space-y-1">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileMenu(false)} className="block py-3 text-sm text-muted-foreground hover:text-foreground font-medium">
                {l.label}
              </a>
            ))}
            <a href="#contact" onClick={() => setMobileMenu(false)} className="block py-3 text-sm font-semibold text-primary">
              Prendre rendez-vous
            </a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="pt-36 pb-24 px-5 sm:px-8 max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wide uppercase animate-pulse-glow">
            Nouveau — DecarboBat RE2020
          </span>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mt-8 text-foreground">
            La technologie au service de la{" "}
            <span className="gradient-text">décarbonation</span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl mt-6 leading-relaxed max-w-2xl">
            DecarboTech développe des solutions SaaS pour mesurer, réduire et piloter l'impact environnemental des entreprises — carbone, eau et bâtiment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <a
              href="#produits"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-sm"
            >
              Découvrir nos solutions
            </a>
            <a
              href="#process"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-md border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors"
            >
              Notre méthodologie
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-20 pt-10 border-t border-border">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-heading font-bold text-3xl sm:text-4xl text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUITS */}
      <section id="produits" className="py-24 px-5 sm:px-8 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Nos Applications</p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-card-foreground">
              Trois plateformes pour votre stratégie environnementale
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {PRODUCTS.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-lg border border-border bg-background p-8 card-hover"
              >
                <div className="flex items-start justify-between">
                  <div className="text-3xl">{p.emoji}</div>
                  <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-xl text-foreground mt-4 group-hover:text-primary transition-colors">
                  {p.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{p.description}</p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-medium px-3 py-1 rounded-full bg-secondary text-secondary-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* POURQUOI NOUS */}
      <section id="pourquoi" className="py-24 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-start">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Avantages</p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground">
              Pourquoi les leaders nous font confiance
            </h2>
            <div className="space-y-10 mt-12">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex gap-5">
                  <div className="text-2xl mt-0.5 shrink-0">{f.icon}</div>
                  <div>
                    <h4 className="font-heading font-bold text-foreground text-lg">{f.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div ref={statsSection.ref} className="bg-card rounded-lg border border-border p-8 lg:sticky lg:top-24">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">Impact</p>
            <h3 className="font-heading font-bold text-xl text-card-foreground mb-8">Nos résultats en chiffres</h3>
            <div className="space-y-7">
              {STATS.map((s) => (
                <div key={s.label} className="space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-semibold text-foreground">{s.value}</span>
                  </div>
                  <ProgressBar pct={s.pct} visible={statsSection.visible} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="py-24 px-5 sm:px-8 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Méthodologie</p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-card-foreground">
              Quatre étapes vers la neutralité carbone
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {STEPS.map((s) => (
              <div key={s.num}>
                <div className="font-heading font-extrabold text-5xl text-primary/20">{s.num}</div>
                <h4 className="font-heading font-bold text-lg text-card-foreground mt-3">{s.title}</h4>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-24 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground">
            Prêt à accélérer votre transition environnementale ?
          </h2>
          <p className="text-muted-foreground mt-5 text-lg max-w-xl mx-auto leading-relaxed">
            Prenez rendez-vous avec notre équipe pour une démonstration personnalisée de nos solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <a
              href="mailto:contact@decarbotech.com"
              className="inline-flex items-center justify-center px-8 py-4 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-sm"
            >
              contact@decarbotech.com
            </a>
            <a
              href="tel:+33140000000"
              className="inline-flex items-center justify-center px-8 py-4 rounded-md border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors"
            >
              +33 1 40 00 00 00
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-16 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <img src={logo} alt="DecarboTech" className="h-8 mb-4" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              La technologie au service de la transition bas carbone. Paris, France.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-foreground mb-4">Applications</h4>
            <ul className="space-y-3">
              {PRODUCTS.map((p) => (
                <li key={p.name}>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {p.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-foreground mb-4">Navigation</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-foreground mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="mailto:contact@decarbotech.com" className="hover:text-foreground transition-colors">contact@decarbotech.com</a></li>
              <li><a href="tel:+33140000000" className="hover:text-foreground transition-colors">+33 1 40 00 00 00</a></li>
              <li>Paris, France</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© 2026 DecarboTech. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
