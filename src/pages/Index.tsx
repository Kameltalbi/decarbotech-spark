import { useState, useEffect, useRef } from "react";

const NAV_LINKS = [
  { label: "Produits", href: "#produits" },
  { label: "Pourquoi nous", href: "#pourquoi" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

const PRODUCTS = [
  {
    name: "CarbonTrack",
    emoji: "📊",
    description: "Mesurez votre empreinte carbone en temps réel avec des dashboards intelligents et des rapports automatisés.",
    tags: ["Mesure", "Dashboard", "API"],
    url: "https://decarbotech.com/carbontrack",
    accent: "152 100% 45%",
  },
  {
    name: "GreenSupply",
    emoji: "🌿",
    description: "Analysez et optimisez l'impact environnemental de votre chaîne d'approvisionnement de bout en bout.",
    tags: ["Supply Chain", "Audit", "Score ESG"],
    url: "https://decarbotech.com/greensupply",
    accent: "180 70% 45%",
  },
  {
    name: "OffsetHub",
    emoji: "🌍",
    description: "Accédez à un marketplace de crédits carbone vérifiés et compensez vos émissions résiduelles.",
    tags: ["Compensation", "Marketplace", "Certifié"],
    url: "https://decarbotech.com/offsethub",
    accent: "45 90% 55%",
  },
  {
    name: "ReportIQ",
    emoji: "📄",
    description: "Générez automatiquement vos rapports CSRD, taxonomie verte et bilan carbone réglementaire.",
    tags: ["CSRD", "Réglementation", "Auto-génération"],
    url: "https://decarbotech.com/reportiq",
    accent: "270 60% 60%",
  },
];

const FEATURES = [
  { icon: "⚡", title: "Temps réel", desc: "Données mises à jour en continu depuis vos systèmes existants." },
  { icon: "🔒", title: "Sécurisé", desc: "Chiffrement de bout en bout, hébergement souverain européen." },
  { icon: "🔗", title: "Intégrable", desc: "API REST et connecteurs ERP, CRM, comptabilité prêts à l'emploi." },
  { icon: "🏆", title: "Certifié", desc: "Méthodologie alignée GHG Protocol, SBTi et taxonomie EU." },
];

const STATS = [
  { label: "Tonnes CO₂ évitées", value: "2.4M+", pct: 85 },
  { label: "Entreprises clientes", value: "340+", pct: 70 },
  { label: "Pays couverts", value: "28", pct: 55 },
  { label: "Précision des mesures", value: "99.2%", pct: 99 },
];

const STEPS = [
  { num: "01", title: "Connectez", desc: "Intégrez vos sources de données en quelques clics via nos connecteurs." },
  { num: "02", title: "Mesurez", desc: "Notre moteur calcule automatiquement vos émissions scope 1, 2 et 3." },
  { num: "03", title: "Réduisez", desc: "Recevez des recommandations personnalisées pour diminuer votre impact." },
  { num: "04", title: "Reportez", desc: "Générez des rapports conformes et communiquez vos progrès." },
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
    <div className="h-2 rounded-full bg-secondary overflow-hidden">
      <div
        className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
        style={{ width: visible ? `${pct}%` : "0%", "--target-width": `${pct}%` } as React.CSSProperties}
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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-nav shadow-lg" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="#" className="font-heading font-bold text-xl tracking-tight">
            <span className="text-primary">Decarbo</span>
            <span className="text-foreground">tech</span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Nous contacter
            </a>
          </div>
          <button className="md:hidden text-foreground" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenu
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden glass-nav border-t border-border/50 px-4 pb-4 space-y-3">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileMenu(false)} className="block py-2 text-sm text-muted-foreground hover:text-foreground">
                {l.label}
              </a>
            ))}
            <a href="#contact" onClick={() => setMobileMenu(false)} className="block py-2 text-sm font-semibold text-primary">
              Nous contacter
            </a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium animate-pulse-glow">
            🚀 Nouveau — ReportIQ CSRD disponible
          </span>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-7xl leading-tight max-w-4xl">
            Décarbonez votre entreprise{" "}
            <span className="gradient-text">intelligemment</span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl leading-relaxed">
            Decarbotech fournit aux entreprises les outils technologiques pour mesurer, réduire et compenser leur empreinte carbone — simplement et efficacement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#produits"
              className="px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-sm"
            >
              Découvrir nos solutions
            </a>
            <a
              href="#process"
              className="px-8 py-3.5 rounded-lg border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors"
            >
              Comment ça marche
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-12 w-full max-w-3xl">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-heading font-bold text-2xl sm:text-3xl text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUITS */}
      <section id="produits" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl">Nos solutions</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Une suite d'outils complémentaires pour chaque étape de votre transition bas carbone.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl border border-border bg-card p-6 card-hover"
            >
              <div className="text-4xl mb-4">{p.emoji}</div>
              <h3 className="font-heading font-bold text-lg text-card-foreground group-hover:text-primary transition-colors">
                {p.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-medium px-2.5 py-1 rounded-full border border-border bg-secondary text-secondary-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-4 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                En savoir plus →
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* POURQUOI NOUS */}
      <section id="pourquoi" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl">
              Pourquoi choisir <span className="gradient-text">Decarbotech</span> ?
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Nous combinons expertise climat et technologie de pointe pour vous offrir des résultats mesurables et vérifiables.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 mt-10">
              {FEATURES.map((f) => (
                <div key={f.title} className="space-y-2">
                  <div className="text-2xl">{f.icon}</div>
                  <h4 className="font-heading font-bold text-foreground">{f.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div ref={statsSection.ref} className="space-y-6 bg-card rounded-xl border border-border p-8">
            <h3 className="font-heading font-bold text-lg text-card-foreground">Impact en chiffres</h3>
            {STATS.map((s) => (
              <div key={s.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-semibold text-foreground">{s.value}</span>
                </div>
                <ProgressBar pct={s.pct} visible={statsSection.visible} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl">Comment ça marche</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Quatre étapes simples pour transformer votre stratégie carbone.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((s, i) => (
            <div key={s.num} className="relative group">
              <div className="text-5xl font-heading font-extrabold text-primary/15 group-hover:text-primary/30 transition-colors">
                {s.num}
              </div>
              <h4 className="font-heading font-bold text-lg mt-2 text-foreground">{s.title}</h4>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.desc}</p>
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-8 -right-4 text-border text-2xl">→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center bg-card rounded-2xl border border-border p-10 sm:p-16">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl">
            Prêt à <span className="gradient-text">décarboner</span> ?
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Contactez-nous pour une démo personnalisée ou envoyez-nous un email directement.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:contact@decarbotech.com"
              className="px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-sm"
            >
              contact@decarbotech.com
            </a>
            <a
              href="tel:+33140000000"
              className="px-8 py-3.5 rounded-lg border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors"
            >
              +33 1 40 00 00 00
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <span className="font-heading font-bold text-lg">
              <span className="text-primary">Decarbo</span>tech
            </span>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              La technologie au service de la transition bas carbone. Paris, France.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-foreground mb-3">Produits</h4>
            <ul className="space-y-2">
              {PRODUCTS.map((p) => (
                <li key={p.name}>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {p.emoji} {p.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-foreground mb-3">Navigation</h4>
            <ul className="space-y-2">
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
            <h4 className="font-heading font-bold text-sm text-foreground mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="mailto:contact@decarbotech.com" className="hover:text-foreground transition-colors">
                  contact@decarbotech.com
                </a>
              </li>
              <li>
                <a href="tel:+33140000000" className="hover:text-foreground transition-colors">
                  +33 1 40 00 00 00
                </a>
              </li>
              <li>Paris, France 🇫🇷</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© 2026 Decarbotech. Tous droits réservés.</p>
          <p className="text-xs text-muted-foreground">Fait avec 💚 pour la planète</p>
        </div>
      </footer>
    </div>
  );
}
