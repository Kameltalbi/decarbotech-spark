import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { Zap, ShieldCheck, Link2, Award, Linkedin, Send, Phone, MapPin, FileText, 
         LayoutDashboard, Leaf, Users, ShieldCheck as Shield, Scale, Sparkles, 
         ArrowRight, BarChart3, CheckCircle2, Check, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo_decarbotech.png";
import logoKeyconsulting from "@/assets/logo_keyconsulting.png";
import heroImage from "@/assets/hero_decarbonation.jpg";

const NAV_LINKS = [
  { label: "Fonctionnalités", href: "#features" },
  { label: "Modules", href: "#modules" },
  { label: "Diagnostic", href: "#diagnostic" },
  { label: "Normes", href: "#normes" },
];

// Diagnostic ESG questions
const PILLAR_META = {
  E: { label: "Environnemental", color: "#16a34a", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", gri: "GRI 302, 303, 305, 306" },
  S: { label: "Social",          color: "#2563eb", bg: "bg-blue-50",    border: "border-blue-200",    text: "text-blue-700",    gri: "GRI 401, 403, 404, 405" },
  G: { label: "Gouvernance",     color: "#7c3aed", bg: "bg-purple-50",  border: "border-purple-200",  text: "text-purple-700",  gri: "GRI 205, 206, 207, 418" },
};

type EsgOption = { label: string; pts: number };
type EsgQuestion = { id: string; pillar: "E" | "S" | "G"; question: string; context?: string; options: EsgOption[] };

const ESG_QUESTIONS: EsgQuestion[] = [
  { id: "e1", pillar: "E", question: "Réalisez-vous un bilan carbone selon le GHG Protocol ?", context: "Scope 1, 2 & 3", options: [{ label: "Oui — Scopes 1, 2 & 3 mesurés annuellement", pts: 4 }, { label: "Partiellement — Scopes 1 & 2", pts: 2 }, { label: "En cours", pts: 1 }, { label: "Non", pts: 0 }] },
  { id: "e2", pillar: "E", question: "Disposez-vous d'objectifs chiffrés de réduction des émissions ?", options: [{ label: "Oui — alignés SBTi", pts: 4 }, { label: "Objectifs internes", pts: 2 }, { label: "En cours", pts: 1 }, { label: "Non", pts: 0 }] },
  { id: "e3", pillar: "E", question: "Mesurez-vous et gérez-vous votre consommation d'eau ?", options: [{ label: "Monitoring continu + plan", pts: 4 }, { label: "Suivi partiel", pts: 2 }, { label: "En cours", pts: 1 }, { label: "Non", pts: 0 }] },
  { id: "e4", pillar: "E", question: "Gérez-vous vos déchets selon l'économie circulaire ?", options: [{ label: "Politique formalisée", pts: 4 }, { label: "Actions en cours", pts: 2 }, { label: "Conformité minimale", pts: 1 }, { label: "Non", pts: 0 }] },
  { id: "e5", pillar: "E", question: "Certification environnementale (ISO 14001, etc.) ?", options: [{ label: "Certifié", pts: 4 }, { label: "En cours", pts: 2 }, { label: "Politique sans certif", pts: 1 }, { label: "Non", pts: 0 }] },
  { id: "s1", pillar: "S", question: "Évaluez-vous la satisfaction et bien-être des employés ?", options: [{ label: "Enquête annuelle + plan", pts: 4 }, { label: "Ponctuellement", pts: 2 }, { label: "En cours", pts: 1 }, { label: "Non", pts: 0 }] },
  { id: "s2", pillar: "S", question: "Politique de diversité, équité et inclusion (DEI) ?", options: [{ label: "Politique + indicateurs", pts: 4 }, { label: "Politique sans indicateurs", pts: 2 }, { label: "En cours", pts: 1 }, { label: "Non", pts: 0 }] },
  { id: "s3", pillar: "S", question: "Gestion santé et sécurité au travail (SST) ?", options: [{ label: "ISO 45001 certifié", pts: 4 }, { label: "Plan SST suivi", pts: 2 }, { label: "Conformité légale", pts: 1 }, { label: "Non", pts: 0 }] },
  { id: "s4", pillar: "S", question: "Programmes de formation et développement ?", options: [{ label: "Budget + plan annuel", pts: 4 }, { label: "Formations ponctuelles", pts: 2 }, { label: "Obligatoires uniquement", pts: 1 }, { label: "Non", pts: 0 }] },
  { id: "s5", pillar: "S", question: "Évaluez-vous les pratiques ESG de vos fournisseurs ?", options: [{ label: "Audit systématique", pts: 4 }, { label: "Questionnaire RSE", pts: 2 }, { label: "En cours", pts: 1 }, { label: "Non", pts: 0 }] },
  { id: "g1", pillar: "G", question: "Publiez-vous un rapport de durabilité/RSE ?", options: [{ label: "Rapport GRI certifié", pts: 4 }, { label: "Rapport interne", pts: 2 }, { label: "Quelques éléments", pts: 1 }, { label: "Non", pts: 0 }] },
  { id: "g2", pillar: "G", question: "Code d'éthique et politique anti-corruption ?", options: [{ label: "Formalisé + formation", pts: 4 }, { label: "Code sans signalement", pts: 2 }, { label: "En cours", pts: 1 }, { label: "Non", pts: 0 }] },
  { id: "g3", pillar: "G", question: "Les enjeux ESG sont-ils intégrés dans votre stratégie ?", options: [{ label: "KPIs au conseil", pts: 4 }, { label: "Direction opérationnelle", pts: 2 }, { label: "En réflexion", pts: 1 }, { label: "Non", pts: 0 }] },
  { id: "g4", pillar: "G", question: "Analyse des risques ESG (physiques et transition) ?", options: [{ label: "Analyse formelle", pts: 4 }, { label: "Partielle", pts: 2 }, { label: "En cours", pts: 1 }, { label: "Non", pts: 0 }] },
  { id: "g5", pillar: "G", question: "Consultez-vous régulièrement vos parties prenantes ?", options: [{ label: "Processus formalisé", pts: 4 }, { label: "Ponctuellement", pts: 2 }, { label: "Informel", pts: 1 }, { label: "Non", pts: 0 }] },
];

type Answers = Record<string, number>;

function calcScorePro(answers: Answers) {
  const byPillar = (p: "E" | "S" | "G") => {
    const qs = ESG_QUESTIONS.filter((q) => q.pillar === p);
    const total = qs.reduce((acc, q) => acc + (answers[q.id] ?? 0), 0);
    return Math.round((total / (qs.length * 4)) * 100);
  };
  const e = byPillar("E"), s = byPillar("S"), g = byPillar("G");
  const global = Math.round((e + s + g) / 3);
  const gaps: { pillar: "E"|"S"|"G"; label: string; reco: string }[] = [];
  if (e < 50) gaps.push({ pillar: "E", label: "Environnemental", reco: "Démarrez par un bilan carbone GHG Protocol." });
  if (s < 50) gaps.push({ pillar: "S", label: "Social", reco: "Mettez en place une politique DEI et ISO 45001." });
  if (g < 50) gaps.push({ pillar: "G", label: "Gouvernance", reco: "Publiez un rapport GRI et formalisez risques ESG." });
  const maturity =
    global >= 75 ? { label: "Leader ESG", desc: "Démarche avancée. Passez au niveau supérieur avec notre plateforme." } :
    global >= 55 ? { label: "En progression", desc: "Bases solides. Formalisez avec notre accompagnement." } :
    global >= 35 ? { label: "En construction", desc: "Actions engagées. Un plan d'action structuré vous attend." } :
                   { label: "Débutant", desc: "C'est le moment de poser des bases solides." };
  return { e, s, g, global, gaps, maturity };
}

// SaaS Features - la plateforme unifiée
const SAAS_FEATURES = [
  { 
    icon: LayoutDashboard, 
    title: "Dashboard ESG",
    desc: "Vue d'ensemble de vos scores E/S/G avec indicateurs clés et priorités d'action",
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  { 
    icon: Leaf, 
    title: "Module Environnement",
    desc: "Bilan carbone, eau, biodiversité, déchets et économie circulaire",
    color: "text-green-600",
    bg: "bg-green-50"
  },
  { 
    icon: Users, 
    title: "Module Social", 
    desc: "RH, diversité, dialogue social, santé/sécurité et formation",
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  { 
    icon: Shield, 
    title: "Module Gouvernance",
    desc: "Éthique, conformité, lanceurs d'alerte et board ESG",
    color: "text-violet-600",
    bg: "bg-violet-50"
  },
  { 
    icon: Scale, 
    title: "Conformité Normes",
    desc: "Self-assessment ESRS, GRI, ISSB, SASB, TCFD avec tracking des exigences",
    color: "text-amber-600",
    bg: "bg-amber-50"
  },
  { 
    icon: Sparkles, 
    title: "Plan d'Action IA",
    desc: "Génération automatique de plans de conformité personnalisés avec OpenAI",
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
];

// Standards couverts
const STANDARDS = [
  { name: "ESRS", full: "European Sustainability Reporting Standards", type: "Mandatory EU", materiality: "Double" },
  { name: "GRI", full: "Global Reporting Initiative", type: "Volontaire", materiality: "Impact" },
  { name: "ISSB", full: "IFRS S1 & S2", type: "Investor-focused", materiality: "Financial" },
  { name: "SASB", full: "Sustainability Accounting", type: "Sectoriel", materiality: "Financial" },
  { name: "TCFD", full: "Task Force Climate", type: "Consolidé ISSB", materiality: "Financial" },
  { name: "CSRD", full: "Corporate Sustainability Reporting", type: "Directive EU", materiality: "Double" },
];

const FEATURES = [
  { Icon: Zap, title: "Données centralisées", desc: "Tous vos indicateurs ESG dans un seul dashboard — fini les silos." },
  { Icon: ShieldCheck, title: "Conformité garantie", desc: "Mapping automatique vers ESRS, GRI et ISSB. Reports prêts pour audit." },
  { Icon: Sparkles, title: "IA générative", desc: "Plan d'action personnalisé généré par IA selon votre profil et normes visées." },
  { Icon: FileText, title: "Export rapports", desc: "Exportez vos rapports de conformité et dashboards en PDF/Excel." },
];

const STATS = [
  { label: "Exigences trackées", value: "100+", pct: 95 },
  { label: "Standards couverts", value: "6", pct: 100 },
  { label: "Modules ESG", value: "3", pct: 100 },
  { label: "Score moyen users", value: "78%", pct: 78 },
];

const STEPS = [
  { num: "01", title: "Inscrivez-vous", desc: "Créez votre compte en 30 secondes et configurez votre organisation." },
  { num: "02", title: "Renseignez vos données", desc: "Remplissez les modules E, S et G avec vos pratiques actuelles." },
  { num: "03", title: "Obtenez votre score", desc: "Visualisez votre maturité ESG et identifiez les axes d'amélioration." },
  { num: "04", title: "Générez votre plan", desc: "L'IA crée un plan d'action priorisé pour atteindre la conformité." },
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
  const statsSection = useScrollVisible(0.3);

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Header />

      {/* HERO */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-5 sm:px-8 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Link to="/auth" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-700 text-xs font-semibold tracking-wide uppercase animate-pulse-glow hover:bg-emerald-100 transition-colors">
              ✦ Inscription gratuite — Sans engagement
            </Link>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mt-8 text-foreground">
              Votre plateforme ESG{" "}
              <span className="gradient-text">tout-en-un</span>
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl mt-6 leading-relaxed max-w-2xl">
              Mesurez, pilotez et reportez vos performances ESG. Conformité CSRD, GRI, ISSB — dashboard, modules E/S/G et plan d'action IA dans une seule application web.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-sm"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Démarrer gratuitement
              </Link>
              <Link
                to="/rse"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-md border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors"
              >
                Faire le diagnostic ESG
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 pt-8 border-t border-border">
              <span className="text-xs text-muted-foreground font-medium">Standards couverts :</span>
              {["ESRS", "GRI", "ISSB", "SASB", "TCFD", "CSRD"].map((s) => (
                <span key={s} className="text-xs font-bold text-foreground/70">{s}</span>
              ))}
            </div>
          </div>
          <div className="animate-float">
            <div className="rounded-xl overflow-hidden shadow-lg animate-hero-in border border-border">
              <img src={heroImage} alt="Dashboard ESG DecarboTech" className="w-full h-auto object-cover" width={1280} height={720} fetchPriority="high" />
            </div>
          </div>
        </div>
      </section>

      {/* BARRE DE CONFIANCE */}
      <section className="py-10 px-5 sm:px-8 border-y border-border bg-card">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-6">
            Standards ESG couverts
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
            {["ESRS (CSRD)", "GRI Standards", "ISSB / IFRS S1-S2", "SASB", "TCFD", "GHG Protocol"].map((name) => (
              <span key={name} className="text-sm font-bold text-foreground/50 hover:text-foreground/80 transition-colors tracking-wide">
                {name}
              </span>
            ))}
            <span className="flex items-center gap-2 border border-primary/20 rounded-full px-4 py-1.5">
              <img src={logoKeyconsulting} alt="Key Consulting" className="h-4 object-contain" />
              <span className="text-xs font-semibold text-primary">Partenaire GRI/CSRD</span>
            </span>
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
                <div className="font-heading font-extrabold text-2xl text-foreground">+50</div>
                <div className="text-xs text-muted-foreground mt-1">PME accompagnées</div>
              </div>
              <div className="border-l-2 border-primary pl-4">
                <div className="font-heading font-extrabold text-2xl text-foreground">4</div>
                <div className="text-xs text-muted-foreground mt-1">Outils certifiés</div>
              </div>
              <div className="border-l-2 border-primary pl-4">
                <div className="font-heading font-extrabold text-2xl text-foreground">TN & MA</div>
                <div className="text-xs text-muted-foreground mt-1">Tunisie & Maghreb</div>
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

      {/* MODULES SaaS */}
      <section id="modules" className="py-16 sm:py-24 px-5 sm:px-8 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Votre plateforme ESG</p>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground">
                Une plateforme, tous vos enjeux ESG
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Dashboard unifié avec modules Environnement, Social, Gouvernance, Conformité normes et Plan d'action IA.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAAS_FEATURES.map((feature) => (
              <div key={feature.title} className="group rounded-xl border border-border bg-background p-6 card-hover">
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              Accéder à la plateforme
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* STANDARDS CALLOUT */}
      <section id="normes" className="py-16 sm:py-20 px-5 sm:px-8 bg-primary">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-primary-foreground/60 mb-3">Conformité multi-standards</p>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-primary-foreground">
                Un seul outil, tous les standards ESG
              </h2>
              <p className="text-primary-foreground/80 mt-5 text-base leading-relaxed">
                ESRS (CSRD), GRI, ISSB, SASB, TCFD — notre module Conformité vous permet d'évaluer votre adhérence à chaque exigence, de suivre votre progression et de générer des rapports d'audit prêts pour vos parties prenantes.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-primary-foreground text-primary font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  <Scale className="w-4 h-4" />
                  Tester la conformité
                </Link>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary-foreground/10 border border-primary-foreground/20">
                  <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                  <span className="text-xs text-primary-foreground/90 font-medium">
                    100+ exigences trackées
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {STANDARDS.map((s) => (
                <div key={s.name} className="rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 p-5">
                  <div className="text-xs font-bold text-primary-foreground/60 mb-1">{s.type}</div>
                  <div className="font-heading font-bold text-lg text-primary-foreground">{s.name}</div>
                  <div className="text-xs text-primary-foreground/60 mt-1">{s.materiality} materiality</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ESG SCAN TEASER */}
      <section className="py-16 sm:py-20 px-5 sm:px-8 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-6">
              Diagnostic gratuit · 2 minutes
            </div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground">
              Où en êtes-vous sur l’ESG&nbsp;?
            </h2>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              Obtenez un score ESG indicatif sur les 3 piliers E, S & G en 2 minutes — sans inscription. Nos experts vous contactent ensuite pour vous accompagner.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { label: "E", color: "bg-emerald-500", desc: "Environnemental" },
                { label: "S", color: "bg-blue-500", desc: "Social" },
                { label: "G", color: "bg-purple-500", desc: "Gouvernance" },
              ].map((p) => (
                <div key={p.label} className="rounded-lg border border-border bg-background p-4 text-center">
                  <div className={`w-8 h-8 rounded-full ${p.color} text-white font-bold text-sm flex items-center justify-center mx-auto mb-2`}>{p.label}</div>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background p-8 shadow-sm">
            <p className="font-heading font-bold text-lg text-foreground mb-6">3 questions pour estimer votre score</p>
            <div className="space-y-4 mb-6">
              {[
                { q: "Mesurez-vous vos émissions CO₂ ?", opts: ["Oui", "En cours", "Non"] },
                { q: "Avez-vous une politique RH ?", opts: ["Oui", "En cours", "Non"] },
                { q: "Publiez-vous un rapport annuel ?", opts: ["Oui", "Non"] },
              ].map((item, i) => (
                <div key={i} className="rounded-lg border border-border p-4">
                  <p className="text-sm font-medium text-foreground mb-3">{item.q}</p>
                  <div className="flex gap-2 flex-wrap">
                    {item.opts.map((opt) => (
                      <span key={opt} className="px-3 py-1 rounded-full text-xs border border-border text-muted-foreground">{opt}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/rse#diagnostic"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Faire le diagnostic complet →
            </Link>
            <p className="text-center text-xs text-muted-foreground mt-3">Gratuit · Aucune carte requise · Score instantané</p>
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

      {/* DIAGNOSTIC ESG */}
      <section id="diagnostic" className="py-16 sm:py-24 px-5 sm:px-8 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Diagnostic rapide</p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground">Testez votre maturité ESG</h2>
            <p className="text-muted-foreground mt-3 text-base max-w-xl mx-auto">15 questions couvrant les piliers E, S & G. Obtenez votre score instantanément et découvrez vos priorités.</p>
          </div>
          <div className="bg-background rounded-2xl border border-border p-6 sm:p-10 shadow-sm">
            <DiagnosticSection />
          </div>
        </div>
      </section>

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
            <h4 className="font-heading font-bold text-sm text-card-foreground mb-4">Plateforme</h4>
            <ul className="space-y-3">
              <li><Link to="/app" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard ESG</Link></li>
              <li><Link to="/app/environnement" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Module Environnement</Link></li>
              <li><Link to="/app/social" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Module Social</Link></li>
              <li><Link to="/app/gouvernance" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Module Gouvernance</Link></li>
              <li><Link to="/app/conformite" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Conformité Normes</Link></li>
              <li><Link to="/app/plan-action" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Plan d'Action IA</Link></li>
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

// Diagnostic components
function GaugeSVG({ value, color, label, delay = 0 }: { value: number; color: string; label: string; delay?: number }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200 + delay);
    return () => clearTimeout(t);
  }, [delay]);
  const r = 15.9155;
  const circ = 2 * Math.PI * r;
  const dash = animated ? (value / 100) * circ : 0;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r={r} fill="none" stroke="#e5e7eb" strokeWidth="3" />
          <circle cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1.4s cubic-bezier(0.22,1,0.36,1)" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold text-base text-foreground">{animated ? value : 0}</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-foreground">{label}</span>
    </div>
  );
}

function DiagnosticSection() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState<ReturnType<typeof calcScorePro> | null>(null);

  const q = ESG_QUESTIONS[step];
  const meta = PILLAR_META[q.pillar];
  const pillarStart = ESG_QUESTIONS.findIndex((x) => x.pillar === q.pillar);
  const pillarIdx = step - pillarStart + 1;
  const pillarTotal = ESG_QUESTIONS.filter((x) => x.pillar === q.pillar).length;

  const confirm = () => {
    if (selected === null) return;
    const next = { ...answers, [q.id]: q.options[selected].pts };
    setAnswers(next);
    setSelected(null);
    if (step < ESG_QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setScore(calcScorePro(next));
    }
  };

  const restart = () => { setStep(0); setAnswers({}); setSelected(null); setScore(null); };

  if (score) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p className="font-heading font-bold text-2xl text-foreground">
            Score ESG global : <span className="text-primary">{score.global}/100</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">{score.maturity.label}</p>
        </div>
        <div className="flex justify-center gap-8 mb-8">
          <GaugeSVG value={score.e} color={PILLAR_META.E.color} label="Environnement" delay={0} />
          <GaugeSVG value={score.s} color={PILLAR_META.S.color} label="Social" delay={250} />
          <GaugeSVG value={score.g} color={PILLAR_META.G.color} label="Gouvernance" delay={500} />
        </div>
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-5 mb-6 text-sm">
          <p className="font-semibold text-foreground mb-1">{score.maturity.label}</p>
          <p className="text-muted-foreground">{score.maturity.desc}</p>
        </div>
        {score.gaps.length > 0 && (
          <div className="space-y-3 mb-6">
            <p className="text-xs font-bold uppercase tracking-wider">Priorités d'amélioration</p>
            {score.gaps.map((g) => {
              const m = PILLAR_META[g.pillar];
              return (
                <div key={g.pillar} className={`rounded-lg border ${m.border} ${m.bg} p-4`}>
                  <p className={`text-xs font-bold mb-1 ${m.text}`}>Pilier {g.pillar} — {g.label}</p>
                  <p className="text-xs text-foreground">{g.reco}</p>
                </div>
              );
            })}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/auth" className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">
            Accéder à la plateforme →
          </Link>
          <button onClick={restart} className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-md border border-border text-sm font-semibold hover:bg-secondary">
            Recommencer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(step / ESG_QUESTIONS.length) * 100}%` }} />
        </div>
        <span className="text-xs text-muted-foreground">{step + 1}/{ESG_QUESTIONS.length}</span>
      </div>
      <div className="flex items-center gap-4 mb-6">
        {(["E", "S", "G"] as const).map((p) => {
          const m = PILLAR_META[p];
          const active = q.pillar === p;
          const done = (p === "E" && step >= 5) || (p === "S" && step >= 10);
          return (
            <div key={p} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${active ? `${m.bg} ${m.border} ${m.text}` : done ? "bg-muted border-border text-muted-foreground" : "border-border text-muted-foreground"}`}>
              <span>{p}</span>
              {active && <span className="opacity-60">{pillarIdx}/{pillarTotal}</span>}
            </div>
          );
        })}
      </div>
      <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${meta.text}`}>Pilier {q.pillar} — {meta.label}</p>
      <h3 className="font-heading font-bold text-xl text-foreground mb-2">{q.question}</h3>
      {q.context && <p className="text-xs text-muted-foreground mb-5 italic">{q.context}</p>}
      <div className="space-y-2 mb-6">
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => setSelected(i)}
            className={`w-full text-left px-5 py-4 rounded-lg border-2 text-sm transition-all flex items-start gap-3 ${selected === i ? `${meta.bg} ${meta.border} font-semibold` : "border-border hover:border-primary/40"}`}>
            <span className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${selected === i ? `${meta.border}` : "border-muted-foreground/40"}`}>
              {selected === i && <span className="w-2 h-2 rounded-full" style={{ background: meta.color }} />}
            </span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
      <button onClick={confirm} disabled={selected === null}
        className="w-full py-3 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-40">
        {step < ESG_QUESTIONS.length - 1 ? "Question suivante →" : "Voir mon score ESG"}
      </button>
    </div>
  );
}
