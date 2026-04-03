import { useState, useEffect } from "react";
import { FileText, Leaf, Users, ShieldCheck, Award, ArrowRight, Phone, Send, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import logo from "@/assets/logo_decarbotech.png";
import logoKeyconsulting from "@/assets/logo_keyconsulting.png";
import logoCarboscan from "@/assets/logo_carboscan.png";
import logoHydroscan from "@/assets/logo_hydroscan.png";
import logoDecarbobat from "@/assets/logo_decarbobat.png";

const PILLARS = [
  {
    Icon: Leaf,
    code: "E",
    label: "Environnemental",
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
    desc: "Mesure et réduction de l'impact sur le climat, l'eau, l'énergie, la biodiversité et les déchets.",
    items: ["Bilan carbone & GHG Protocol", "Gestion de l'empreinte eau", "Performance énergétique bâtiments", "Gestion des déchets & économie circulaire"],
    covered: true,
  },
  {
    Icon: Users,
    code: "S",
    label: "Social",
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    desc: "Conditions de travail, droits humains, diversité, inclusion et impact sur les communautés locales.",
    items: ["Conditions de travail & santé/sécurité", "Égalité et diversité (H/F)", "Formation et développement des employés", "Relations avec les communautés locales"],
    covered: false,
  },
  {
    Icon: ShieldCheck,
    code: "G",
    label: "Gouvernance",
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-200",
    desc: "Éthique des affaires, transparence, lutte contre la corruption et structure de gouvernance.",
    items: ["Éthique des affaires & anti-corruption", "Transparence et reporting", "Composition des organes dirigeants", "Gestion des risques ESG"],
    covered: false,
  },
];

const GRI_STANDARDS = [
  { code: "GRI 302", topic: "Énergie", app: "DecarboBat", logo: logoDecarbobat },
  { code: "GRI 303", topic: "Eau & effluents", app: "HydroScan", logo: logoHydroscan },
  { code: "GRI 305", topic: "Émissions", app: "CarbonScan", logo: logoCarboscan },
  { code: "GRI 306", topic: "Déchets", app: "WasteScan (bientôt)", logo: null },
];

const REGLEMENTS = [
  { name: "CSRD", full: "Corporate Sustainability Reporting Directive", desc: "Obligation légale européenne de reporting ESG pour les grandes entreprises — cascade vers leurs fournisseurs PME.", date: "2024–2026" },
  { name: "GRI", full: "Global Reporting Initiative", desc: "Standard mondial de reporting développement durable, exigé par les donneurs d'ordre, banques et investisseurs.", date: "En vigueur" },
  { name: "ESRS", full: "European Sustainability Reporting Standards", desc: "12 normes techniques qui détaillent comment appliquer la CSRD en pratique.", date: "Obligatoire CSRD" },
  { name: "GHG Protocol", full: "Greenhouse Gas Protocol", desc: "Méthodologie internationale de comptabilisation des émissions carbone Scope 1, 2 et 3.", date: "Référence mondiale" },
];

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
          <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Jean Dupont" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">Email *</label>
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="jean@entreprise.com" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-foreground mb-1.5">Entreprise</label>
        <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Ma société" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-foreground mb-1.5">Message *</label>
        <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          placeholder="Décrivez votre besoin RSE/ESG ou demandez une démonstration…" />
      </div>
      <button type="submit" disabled={sending}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60">
        <Send className="w-4 h-4" />
        {sending ? "Envoi en cours…" : "Envoyer la demande"}
      </button>
    </form>
  );
}

export default function RSE() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

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
          <Link to="/" className="flex items-center">
            <img src={logo} alt="DecarboTech" className="h-14" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">Accueil</Link>
            <a href="#piliers" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">Les 3 piliers</a>
            <a href="#reglements" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">Réglementations</a>
            <a href="#gri" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">GRI</a>
            <a href="#contact" className="px-6 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
              Nous contacter
            </a>
          </div>
          <button className="md:hidden text-foreground" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenu
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden bg-card border-t border-border px-5 pb-5 space-y-1">
            <Link to="/" onClick={() => setMobileMenu(false)} className="block py-3 text-sm text-muted-foreground hover:text-foreground font-medium">Accueil</Link>
            <a href="#piliers" onClick={() => setMobileMenu(false)} className="block py-3 text-sm text-muted-foreground hover:text-foreground font-medium">Les 3 piliers</a>
            <a href="#reglements" onClick={() => setMobileMenu(false)} className="block py-3 text-sm text-muted-foreground hover:text-foreground font-medium">Réglementations</a>
            <a href="#contact" onClick={() => setMobileMenu(false)} className="block py-3 text-sm font-semibold text-primary">Nous contacter</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-5 sm:px-8 bg-card border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wide uppercase mb-8">
              RSE & ESG
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-foreground">
              Comprendre et piloter votre{" "}
              <span className="gradient-text">démarche RSE & ESG</span>
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl mt-6 leading-relaxed max-w-2xl">
              Réglementations, standards GRI, piliers environnemental, social et gouvernance — tout ce que votre entreprise doit savoir pour agir concrètement et se conformer aux exigences de vos parties prenantes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <a href="#piliers" className="inline-flex items-center justify-center px-8 py-3.5 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-sm">
                Découvrir les 3 piliers
              </a>
              <a href="#contact" className="inline-flex items-center justify-center px-8 py-3.5 rounded-md border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors">
                Parler à un expert
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* QU'EST-CE QUE LA RSE */}
      <section className="py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Définition</p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground">
              RSE et ESG : quelle différence&nbsp;?
            </h2>
            <p className="text-muted-foreground mt-6 text-base leading-relaxed">
              <strong className="text-foreground">RSE (Responsabilité Sociétale des Entreprises)</strong> est le concept global : une entreprise intègre les préoccupations sociales, environnementales et économiques dans ses activités et ses relations avec ses parties prenantes.
            </p>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              <strong className="text-foreground">ESG (Environmental, Social, Governance)</strong> est le cadre de mesure et de reporting de la RSE — utilisé par les investisseurs, banques et donneurs d'ordre pour évaluer et comparer les entreprises.
            </p>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              En pratique : la RSE est la <em>démarche</em>, l'ESG est le <em>langage</em> pour la mesurer et la communiquer.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { q: "Pourquoi mes clients me demandent un rapport ESG ?", r: "Vos donneurs d'ordre sont soumis à la CSRD et doivent reporter sur leur chaîne de valeur — vous y compris." },
              { q: "Est-ce obligatoire pour une PME ?", r: "Pas directement, mais vos clients grands comptes vous le transmettront comme condition contractuelle." },
              { q: "Par où commencer ?", r: "Par le pilier E (Environnemental) — c'est le plus documenté, réglementé et là où DecarboTech vous accompagne." },
            ].map((item) => (
              <div key={item.q} className="rounded-lg border border-border bg-card p-5">
                <p className="font-heading font-bold text-sm text-foreground mb-2">{item.q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LES 3 PILIERS */}
      <section id="piliers" className="py-16 sm:py-24 px-5 sm:px-8 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Les 3 piliers ESG</p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground">
              E, S, G — ce que chaque pilier couvre
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {PILLARS.map((p) => (
              <div key={p.code} className={`rounded-xl border-2 ${p.bg} p-8`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white border ${p.bg}`}>
                    <p.Icon className={`w-5 h-5 ${p.color}`} />
                  </div>
                  <div>
                    <span className={`font-heading font-extrabold text-2xl ${p.color}`}>{p.code}</span>
                    <p className="text-xs font-semibold text-muted-foreground">{p.label}</p>
                  </div>
                  {p.covered && (
                    <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                      Couvert
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{p.desc}</p>
                <ul className="space-y-2">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                      <ArrowRight className={`w-4 h-4 mt-0.5 shrink-0 ${p.color}`} />
                      {item}
                    </li>
                  ))}
                </ul>
                {p.covered && (
                  <div className="mt-6 pt-5 border-t border-current/10">
                    <p className="text-xs font-semibold text-primary">✓ Couvert par les applications DecarboTech</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RÉGLEMENTATIONS */}
      <section id="reglements" className="py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Réglementations</p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground">
              Les standards que vos parties prenantes exigent
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {REGLEMENTS.map((r) => (
              <div key={r.name} className="rounded-lg border border-border bg-card p-7">
                <div className="flex items-start justify-between mb-3">
                  <span className="font-heading font-extrabold text-2xl text-primary">{r.name}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">{r.date}</span>
                </div>
                <p className="text-xs font-medium text-muted-foreground mb-3">{r.full}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GRI + DECARBOTECH */}
      <section id="gri" className="py-16 sm:py-20 px-5 sm:px-8 bg-primary">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-primary-foreground/60 mb-3">Rapport GRI</p>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-primary-foreground">
                DecarboTech couvre les indicateurs GRI environnementaux
              </h2>
              <p className="text-primary-foreground/80 mt-5 text-base leading-relaxed">
                Vos données collectées via nos applications sont automatiquement formatées selon les standards GRI correspondants — prêtes à intégrer dans votre rapport de durabilité.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-primary-foreground text-primary font-semibold text-sm hover:opacity-90 transition-opacity">
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
              {GRI_STANDARDS.map((g) => (
                <div key={g.code} className="rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 p-5">
                  <div className="text-xs font-bold text-primary-foreground/60 mb-1">{g.code}</div>
                  <div className="font-heading font-bold text-lg text-primary-foreground">{g.topic}</div>
                  <div className="flex items-center gap-2 mt-2">
                    {g.logo
                      ? <img src={g.logo} alt={g.app} className="h-5 object-contain" />
                      : <span className="text-xs text-primary-foreground/60">→ {g.app}</span>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PARTENAIRE */}
      <section className="py-16 px-5 sm:px-8 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-10">Notre partenaire expert</p>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              <img src={logoKeyconsulting} alt="Key Consulting Tunisie" className="h-16 object-contain shrink-0" loading="lazy" />
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                  Partenaire officiel
                </div>
                <h3 className="font-heading font-bold text-2xl text-foreground">Key Consulting Tunisie</h3>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  Cabinet de renommée spécialisé en RSE, ESG & reporting GRI. Key Consulting accompagne les entreprises dans leur démarche de certification, la formation de leurs équipes et la production de rapports conformes aux standards internationaux.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {["RSE", "ESG", "GRI", "CSRD", "Formation"].map((tag) => (
                    <span key={tag} className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">{tag}</span>
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

      {/* CONTACT */}
      <section id="contact" className="py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Contact</p>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground">
                Lancez votre démarche RSE & ESG
              </h2>
              <p className="text-muted-foreground mt-5 text-base leading-relaxed">
                Nos experts vous accompagnent de la première mesure jusqu'au rapport GRI final. Prenez rendez-vous pour une consultation gratuite.
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
      <footer className="border-t border-border py-10 px-5 sm:px-8 bg-card">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link to="/">
            <img src={logo} alt="DecarboTech" className="h-10 object-contain" />
          </Link>
          <p className="text-xs text-muted-foreground">© 2026 DecarboTech. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Accueil</Link>
            <a href="/mentions-legales" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Mentions légales</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
