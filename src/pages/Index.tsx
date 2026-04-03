import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Zap, ShieldCheck, Link2, Award, Linkedin, Send, Phone, MapPin, FileText } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo_decarbotech.png";
import logoCarboscan from "@/assets/logo_carboscan.png";
import logoHydroscan from "@/assets/logo_hydroscan.png";
import logoDecarbobat from "@/assets/logo_decarbobat.png";
import logoWastescan from "@/assets/logo_wastescan.svg";
import logoKeyconsulting from "@/assets/logo_keyconsulting.png";
import heroImage from "@/assets/hero_decarbonation.jpg";

const NAV_LINKS = [
  { label: "À propos", href: "#a-propos" },
  { label: "Solutions", href: "#produits" },
];

const PRODUCTS = [
  {
    name: "CarbonScan",
    logo: logoCarboscan,
    tagline: "Maîtrisez votre empreinte carbone",
    description: "Bilan carbone automatisé, suivi en temps réel des émissions Scope 1-2-3, et reporting CSRD clé en main pour vos équipes et parties prenantes.",
    features: ["Bilan GES automatisé (Scope 1, 2 & 3)", "Reporting CSRD & GHG Protocol", "Plan de réduction personnalisé"],
    tags: ["Bilan Carbone", "CSRD", "Scope 1-2-3"],
    accent: "border-emerald-500",
    accentBg: "bg-emerald-50 dark:bg-emerald-950/20",
    accentText: "text-emerald-700 dark:text-emerald-400",
    url: "https://carbonscan.io",
  },
  {
    name: "HydroScan",
    logo: logoHydroscan,
    tagline: "Pilotez votre consommation d'eau",
    description: "Monitoring continu de l'empreinte eau, détection automatique des fuites et anomalies, conformité réglementaire sur l'ensemble de vos sites industriels.",
    features: ["Monitoring eau en temps réel", "Détection de fuites & anomalies", "Conformité réglementaire multi-sites"],
    tags: ["Empreinte Eau", "Monitoring", "Conformité"],
    accent: "border-blue-500",
    accentBg: "bg-blue-50 dark:bg-blue-950/20",
    accentText: "text-blue-700 dark:text-blue-400",
    url: "https://hydroscan.io",
  },
  {
    name: "DecarboBat",
    logo: logoDecarbobat,
    tagline: "Décarbonez votre parc immobilier",
    description: "Simulation énergétique des bâtiments, vérification de la conformité RE2020 et suivi complet des projets de rénovation bas carbone.",
    features: ["Simulation énergétique RE2020", "Suivi des rénovations bas carbone", "Diagnostic & plan d'action bâtiment"],
    tags: ["Bâtiment", "RE2020", "Rénovation"],
    accent: "border-orange-500",
    accentBg: "bg-orange-50 dark:bg-orange-950/20",
    accentText: "text-orange-700 dark:text-orange-400",
    url: "https://decarbobat.io",
  },
  {
    name: "WasteScan",
    logo: logoWastescan,
    tagline: "Maîtrisez vos déchets et votre économie circulaire",
    description: "Suivi des flux de déchets industriels, conformité réglementaire et pilotage de votre transition vers l'économie circulaire sur l'ensemble de vos sites.",
    features: ["Cartographie & suivi des flux de déchets", "Conformité réglementaire déchets industriels", "Plan d'action économie circulaire"],
    tags: ["Déchets", "Économie circulaire", "Conformité"],
    accent: "border-purple-300",
    accentBg: "bg-purple-50 dark:bg-purple-950/20",
    accentText: "text-purple-400",
    url: "https://wastescan.io",
    comingSoon: true,
  },
];

const FEATURES = [
  { Icon: Zap, title: "Données temps réel", desc: "Synchronisation continue avec vos systèmes existants pour des mesures toujours à jour." },
  { Icon: ShieldCheck, title: "Sécurité souveraine", desc: "Hébergement européen, chiffrement de bout en bout, conformité RGPD." },
  { Icon: Link2, title: "Intégration native", desc: "API REST et connecteurs ERP, CRM, comptabilité prêts à l'emploi." },
  { Icon: FileText, title: "Rapport GRI automatisé", desc: "Vos données génèrent automatiquement un rapport GRI prêt à soumettre à vos partenaires et investisseurs." },
];

const STATS = [
  { label: "Tonnes CO₂ évitées", value: "2.4M+", pct: 85 },
  { label: "Entreprises clientes", value: "340+", pct: 70 },
  { label: "Pays couverts", value: "28", pct: 55 },
  { label: "Précision des mesures", value: "99.2%", pct: 99 },
];

const STEPS = [
  { num: "01", title: "Connectez", desc: "Intégrez vos sources de données en quelques clics via nos connecteurs certifiés." },
  { num: "02", title: "Mesurez", desc: "Notre moteur analyse automatiquement vos indicateurs environnementaux en continu." },
  { num: "03", title: "Réduisez", desc: "Recevez des recommandations personnalisées pour diminuer votre impact environnemental." },
  { num: "04", title: "Reportez", desc: "Générez des rapports conformes et communiquez vos progrès aux parties prenantes." },
];

const CLIENTS = ["Groupe Meridia", "IndustriaPlus", "BâtiVerde", "EcoLogis", "ThermiGroup", "AquaRéseau"];

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

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", company: "", message: "" });
      toast.success("Message envoyé ! Nous reviendrons vers vous sous 24h.");
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">Nom *</label>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Jean Dupont"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">Email *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="jean@entreprise.com"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-foreground mb-1.5">Entreprise</label>
        <input
          type="text"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Ma société"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-foreground mb-1.5">Message *</label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          placeholder="Décrivez votre besoin ou demandez une démonstration…"
        />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-sm disabled:opacity-60"
      >
        <Send className="w-4 h-4" />
        {sending ? "Envoi en cours…" : "Envoyer la demande"}
      </button>
    </form>
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
            <img src={logo} alt="DecarboTech" className="h-14" />
          </a>
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
                {l.label}
              </a>
            ))}
            <Link to="/rse" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
              RSE & ESG
            </Link>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
              Contact
            </a>
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
            <Link to="/rse" onClick={() => setMobileMenu(false)} className="block py-3 text-sm text-muted-foreground hover:text-foreground font-medium">
              RSE & ESG
            </Link>
            <a href="#contact" onClick={() => setMobileMenu(false)} className="block py-3 text-sm text-muted-foreground hover:text-foreground font-medium">
              Contact
            </a>
            <a href="#contact" onClick={() => setMobileMenu(false)} className="block py-3 text-sm font-semibold text-primary">
              Prendre rendez-vous
            </a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-5 sm:px-8 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <a href="#produits" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wide uppercase animate-pulse-glow hover:bg-primary/10 transition-colors">
              Nouveau — DecarboBat RE2020
            </a>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mt-8 text-foreground">
              Votre transition environnementale,{" "}
              <span className="gradient-text">notre engagement</span>
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl mt-6 leading-relaxed max-w-2xl">
              La plateforme climat & environnement conçue pour les PME. Carbone, eau, bâtiment, déchets : quatre outils experts pour mesurer votre impact, vous conformer et atteindre vos objectifs — sans complexité.
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
          <div className="animate-float">
            <div className="rounded-xl overflow-hidden shadow-lg animate-hero-in">
              <img src={heroImage} alt="Ville durable avec panneaux solaires et espaces verts" className="w-full h-auto object-cover" width={1280} height={720} fetchPriority="high" />
            </div>
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section className="py-12 px-5 sm:px-8 border-y border-border bg-card">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-8">
            Ils nous font confiance
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-5">
            {CLIENTS.map((name) => (
              <span key={name} className="text-sm font-semibold text-muted-foreground/60 hover:text-muted-foreground transition-colors">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PARTENAIRES */}
      <section className="py-16 px-5 sm:px-8 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-10">
            Notre partenaire expert
          </p>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              <img src={logoKeyconsulting} alt="Key Consulting Tunisie" className="h-16 object-contain shrink-0" loading="lazy" />
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                  Partenaire officiel
                </div>
                <h3 className="font-heading font-bold text-2xl text-foreground">Key Consulting Tunisie</h3>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  Cabinet de renommée en RSE, ESG & reporting GRI. En partenariat avec DecarboTech, Key Consulting accompagne les entreprises dans leur démarche de certification environnementale et la production de rapports conformes aux standards internationaux.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {["RSE", "ESG", "GRI", "CSRD"].map((tag) => (
                    <span key={tag} className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Conseil RSE", desc: "Stratégie et déploiement de votre politique RSE adaptée à votre secteur." },
                { title: "Reporting GRI", desc: "Production de rapports GRI conformes pour vos parties prenantes." },
                { title: "Formation ESG", desc: "Sensibilisation et formation de vos équipes aux enjeux ESG." },
                { title: "Certification", desc: "Accompagnement vers les certifications environnementales reconnues." },
              ].map((s) => (
                <div key={s.title} className="rounded-lg border border-border bg-background p-5">
                  <h4 className="font-heading font-bold text-sm text-foreground mb-1.5">{s.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QUI SOMMES-NOUS */}
      <section id="a-propos" className="py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Qui sommes-nous</p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground">
              Une plateforme climat & environnement, conçue par des experts de terrain
            </h2>
            <p className="text-muted-foreground mt-6 text-base leading-relaxed">
              Chez DecarboTech, nous sommes des experts de l'environnement — carbone, eau, bâtiment et déchets — convaincus que la transition écologique passe par des actes concrets dans les entreprises.
            </p>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              Notre mission : offrir aux PME une plateforme complète pour piloter tous leurs enjeux environnementaux — conformité réglementaire (CSRD, RE2020, GHG Protocol), réduction d'impact et reporting — sans expertise technique préalable.
            </p>
            <div className="mt-10 grid sm:grid-cols-3 gap-6">
              <div className="border-l-2 border-primary pl-4">
                <div className="font-heading font-extrabold text-2xl text-foreground">4</div>
                <div className="text-xs text-muted-foreground mt-1">Applications spécialisées</div>
              </div>
              <div className="border-l-2 border-primary pl-4">
                <div className="font-heading font-extrabold text-2xl text-foreground">100%</div>
                <div className="text-xs text-muted-foreground mt-1">Cloud & conforme RGPD</div>
              </div>
              <div className="border-l-2 border-primary pl-4">
                <div className="font-heading font-extrabold text-2xl text-foreground">24h</div>
                <div className="text-xs text-muted-foreground mt-1">Délai de mise en route</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h4 className="font-heading font-bold text-sm text-foreground">Mesure précise</h4>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Collecte automatisée de vos données environnementales depuis vos systèmes existants.</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6 sm:mt-8">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h4 className="font-heading font-bold text-sm text-foreground">Action ciblée</h4>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Recommandations concrètes pour réduire votre empreinte et prioriser les actions à fort impact.</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h4 className="font-heading font-bold text-sm text-foreground">Conformité assurée</h4>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Rapports prêts pour CSRD, RE2020 et la taxonomie verte européenne.</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6 sm:mt-8">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h4 className="font-heading font-bold text-sm text-foreground">Équipes engagées</h4>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Tableaux de bord collaboratifs pour mobiliser toutes vos parties prenantes internes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUITS */}
      <section id="produits" className="py-16 sm:py-24 px-5 sm:px-8 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Nos Applications</p>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground">
                Quatre plateformes spécialisées,<br className="hidden sm:block" /> un seul objectif
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Carbone, eau, bâtiment, déchets : une couverture complète des enjeux climat & environnement, accessible à toutes les PME.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((p) => (
              <div key={p.name} className={`group rounded-xl border-t-4 ${p.accent} border-x border-b border-border flex flex-col overflow-hidden ${'comingSoon' in p && p.comingSoon ? 'bg-muted/40 opacity-70' : 'bg-background card-hover'}`}>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    {p.logo
                      ? <img src={p.logo} alt={p.name} className={`h-10 object-contain ${'comingSoon' in p && p.comingSoon ? 'grayscale' : ''}`} loading="lazy" />
                      : <span className={`font-heading font-extrabold text-lg tracking-tight ${p.accentText}`}>{p.name}</span>
                    }
                    {'comingSoon' in p && p.comingSoon
                      ? <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">Bientôt</span>
                      : <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.accentBg} ${p.accentText}`}>SaaS</span>
                    }
                  </div>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${p.accentText} mb-2`}>{p.tagline}</p>
                  <h3 className="font-heading font-bold text-2xl text-foreground mb-4">{p.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{p.description}</p>
                  <ul className="space-y-2.5 mb-8">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <svg className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    {'comingSoon' in p && p.comingSoon
                      ? <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground cursor-not-allowed">
                          En cours de développement…
                        </span>
                      : <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 text-sm font-semibold ${p.accentText} hover:underline`}
                        >
                          Découvrir {p.name}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
                          </svg>
                        </a>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GRI CALLOUT */}
      <section className="py-16 sm:py-20 px-5 sm:px-8 bg-primary">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-primary-foreground/60 mb-3">Rapport GRI</p>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-primary-foreground">
                Vos données DecarboTech → rapport GRI en un clic
              </h2>
              <p className="text-primary-foreground/80 mt-5 text-base leading-relaxed">
                Vos clients, investisseurs et donneurs d’ordre exigent un rapport GRI ? Toutes vos mesures environnementales sont automatiquement formatées selon les standards GRI — prêtes à soumettre, sans ressaisie.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-primary-foreground text-primary font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  <FileText className="w-4 h-4" />
                  Demander une démo GRI
                </a>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary-foreground/10 border border-primary-foreground/20">
                  <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                  <span className="text-xs text-primary-foreground/90 font-medium">
                    En partenariat avec <span className="font-bold">Key Consulting Tunisie</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { code: "GRI 302", label: "Énergie", app: "DecarboBat" },
                { code: "GRI 303", label: "Eau", app: "HydroScan" },
                { code: "GRI 305", label: "Émissions", app: "CarbonScan" },
                { code: "GRI 306", label: "Déchets", app: "WasteScan" },
              ].map((g) => (
                <div key={g.code} className="rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 p-5">
                  <div className="text-xs font-bold text-primary-foreground/60 mb-1">{g.code}</div>
                  <div className="font-heading font-bold text-lg text-primary-foreground">{g.label}</div>
                  <div className="text-xs text-primary-foreground/60 mt-1">→ {g.app}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* POURQUOI NOUS */}
      <section id="pourquoi" className="py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Avantages</p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-card-foreground">
              Pourquoi les leaders nous font confiance
            </h2>
            <div className="space-y-10 mt-12">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex gap-5">
                  <div className="mt-0.5 shrink-0 text-primary">
                    <f.Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-card-foreground text-lg">{f.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div ref={statsSection.ref} className="bg-background rounded-lg border border-border p-8 lg:sticky lg:top-24">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">Impact</p>
            <h3 className="font-heading font-bold text-xl text-foreground mb-8">Nos résultats en chiffres</h3>
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
      <section id="process" className="py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Méthodologie</p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground">
              Quatre étapes vers la neutralité carbone
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {STEPS.map((s) => (
              <div key={s.num}>
                <div className="font-heading font-extrabold text-5xl text-primary/20">{s.num}</div>
                <h4 className="font-heading font-bold text-lg text-foreground mt-3">{s.title}</h4>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / CONTACT */}
      <section id="contact" className="py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Contact</p>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground">
                Prêt à accélérer votre transition environnementale&nbsp;?
              </h2>
              <p className="text-muted-foreground mt-5 text-base leading-relaxed">
                Prenez rendez-vous avec notre équipe pour une démonstration personnalisée de nos solutions.
              </p>
              <div className="mt-10 space-y-4">
                <a href="mailto:contact@decarbotech.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Send className="w-4 h-4 text-primary shrink-0" />
                  contact@decarbotech.com
                </a>
                <a href="tel:+21655053505" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  +216 55 053 505
                </a>
                <p className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  Tunis, Tunisie
                </p>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-16 px-5 sm:px-8 bg-card">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <img src={logo} alt="DecarboTech" className="h-12 mb-4" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              La technologie au service de la transition bas carbone. Tunis, Tunisie.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://linkedin.com/company/decarbotech"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn DecarboTech"
                className="p-2 rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-card-foreground mb-4">Applications</h4>
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
            <h4 className="font-heading font-bold text-sm text-card-foreground mb-4">Navigation</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/rse" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  RSE & ESG
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-card-foreground mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="mailto:contact@decarbotech.com" className="hover:text-foreground transition-colors">contact@decarbotech.com</a></li>
              <li><a href="tel:+21655053505" className="hover:text-foreground transition-colors">+216 55 053 505</a></li>
              <li>Tunis, Tunisie</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© 2026 DecarboTech. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="/mentions-legales" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Mentions légales</a>
            <a href="/politique-confidentialite" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Politique de confidentialité</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
