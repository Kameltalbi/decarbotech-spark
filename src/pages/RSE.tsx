import { useState, useEffect } from "react";
import { FileText, Leaf, Users, ShieldCheck, Award, ArrowRight, Phone, Send, MapPin, Check, ChevronRight } from "lucide-react";
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

type EsgOption = { label: string; pts: number };
type EsgQuestion = { id: string; pillar: "E" | "S" | "G"; question: string; context?: string; options: EsgOption[] };

const ESG_QUESTIONS: EsgQuestion[] = [
  // ── PILIER E ──
  {
    id: "e1", pillar: "E",
    question: "Réalisez-vous un bilan carbone selon le GHG Protocol ?",
    context: "Scope 1 (émissions directes), Scope 2 (énergie), Scope 3 (chaîne de valeur)",
    options: [
      { label: "Oui — Scopes 1, 2 & 3 mesurés annuellement", pts: 4 },
      { label: "Partiellement — Scopes 1 & 2 seulement", pts: 2 },
      { label: "En cours de mise en place", pts: 1 },
      { label: "Non", pts: 0 },
    ],
  },
  {
    id: "e2", pillar: "E",
    question: "Disposez-vous d'objectifs chiffrés de réduction des émissions ?",
    context: "Ex. : alignés Science Based Targets (SBTi), neutralité carbone 2050",
    options: [
      { label: "Oui — alignés sur les Accords de Paris (SBTi)", pts: 4 },
      { label: "Oui — objectifs internes définis et suivis", pts: 2 },
      { label: "En cours de définition", pts: 1 },
      { label: "Non", pts: 0 },
    ],
  },
  {
    id: "e3", pillar: "E",
    question: "Mesurez-vous et gérez-vous votre consommation d'eau ?",
    context: "Conforme ISO 14046 — empreinte eau et stress hydrique",
    options: [
      { label: "Oui — monitoring continu + plan de réduction formalisé", pts: 4 },
      { label: "Suivi partiel sans objectifs formalisés", pts: 2 },
      { label: "En cours", pts: 1 },
      { label: "Non", pts: 0 },
    ],
  },
  {
    id: "e4", pillar: "E",
    question: "Gérez-vous vos déchets selon une approche d'économie circulaire ?",
    context: "Tri sélectif, valorisation, réduction à la source, reporting GRI 306",
    options: [
      { label: "Oui — politique formalisée avec indicateurs et reporting", pts: 4 },
      { label: "Actions en cours, pas encore formalisées", pts: 2 },
      { label: "Conformité légale minimale uniquement", pts: 1 },
      { label: "Non", pts: 0 },
    ],
  },
  {
    id: "e5", pillar: "E",
    question: "Disposez-vous d'une certification environnementale reconnue ?",
    context: "ISO 14001, EMAS, HQE, LEED, label Économie Verte…",
    options: [
      { label: "Oui — certifié (ISO 14001 ou équivalent)", pts: 4 },
      { label: "En cours de certification", pts: 2 },
      { label: "Politique environnementale documentée sans certification", pts: 1 },
      { label: "Non", pts: 0 },
    ],
  },
  // ── PILIER S ──
  {
    id: "s1", pillar: "S",
    question: "Évaluez-vous régulièrement la satisfaction et le bien-être de vos employés ?",
    context: "Enquêtes internes, baromètre social, plans d'action associés",
    options: [
      { label: "Oui — enquête annuelle avec plan d'action formalisé", pts: 4 },
      { label: "Ponctuellement, sans plan d'action systématique", pts: 2 },
      { label: "En cours de mise en place", pts: 1 },
      { label: "Non", pts: 0 },
    ],
  },
  {
    id: "s2", pillar: "S",
    question: "Disposez-vous d'une politique de diversité, équité et inclusion (DEI) ?",
    context: "Égalité H/F, handicap, origines, indicateurs de suivi et reporting",
    options: [
      { label: "Oui — politique formalisée avec indicateurs et reporting", pts: 4 },
      { label: "Politique existante sans indicateurs de suivi", pts: 2 },
      { label: "En cours d'élaboration", pts: 1 },
      { label: "Non", pts: 0 },
    ],
  },
  {
    id: "s3", pillar: "S",
    question: "Quel est votre niveau de gestion de la santé et sécurité au travail (SST) ?",
    context: "ISO 45001, Document Unique d'Évaluation des Risques (DUER)",
    options: [
      { label: "Système de management SST certifié (ISO 45001 ou équivalent)", pts: 4 },
      { label: "Plan SST documenté et suivi régulièrement", pts: 2 },
      { label: "Conformité légale minimale", pts: 1 },
      { label: "Pas de politique SST spécifique", pts: 0 },
    ],
  },
  {
    id: "s4", pillar: "S",
    question: "Proposez-vous des programmes de formation et développement des compétences ?",
    context: "Plan de formation annuel, budget dédié, indicateurs d'heures de formation",
    options: [
      { label: "Oui — budget dédié et plan de formation annuel formalisé", pts: 4 },
      { label: "Formations ponctuelles sans plan structuré", pts: 2 },
      { label: "Formations obligatoires réglementaires uniquement", pts: 1 },
      { label: "Non", pts: 0 },
    ],
  },
  {
    id: "s5", pillar: "S",
    question: "Évaluez-vous les pratiques sociales et éthiques de vos fournisseurs ?",
    context: "Questionnaires RSE, audits fournisseurs, clauses contractuelles sociales",
    options: [
      { label: "Oui — audit systématique et critères d'évaluation formalisés", pts: 4 },
      { label: "Questionnaire RSE envoyé aux principaux fournisseurs", pts: 2 },
      { label: "En cours de mise en place", pts: 1 },
      { label: "Non", pts: 0 },
    ],
  },
  // ── PILIER G ──
  {
    id: "g1", pillar: "G",
    question: "Publiez-vous un rapport de durabilité ou RSE ?",
    context: "Rapport GRI Standards, DPEF, rapport intégré, CSRD",
    options: [
      { label: "Oui — rapport GRI Standards certifié et publié", pts: 4 },
      { label: "Rapport interne structuré (non publié)", pts: 2 },
      { label: "Quelques éléments publiés sans structure formelle", pts: 1 },
      { label: "Non", pts: 0 },
    ],
  },
  {
    id: "g2", pillar: "G",
    question: "Disposez-vous d'un code d'éthique et d'une politique anti-corruption ?",
    context: "Loi Sapin II, FCPA — formation obligatoire, canal de signalement",
    options: [
      { label: "Oui — formalisé, formation obligatoire et canal de signalement", pts: 4 },
      { label: "Code d'éthique existant sans dispositif de signalement", pts: 2 },
      { label: "En cours d'élaboration", pts: 1 },
      { label: "Non", pts: 0 },
    ],
  },
  {
    id: "g3", pillar: "G",
    question: "Les enjeux ESG sont-ils intégrés dans votre stratégie d'entreprise ?",
    context: "KPIs ESG au comité de direction, feuille de route ESG pluriannuelle",
    options: [
      { label: "Oui — KPIs ESG au niveau du conseil d'administration", pts: 4 },
      { label: "Intégrés dans la stratégie opérationnelle (direction)", pts: 2 },
      { label: "En cours de réflexion stratégique", pts: 1 },
      { label: "Non, ESG non intégré à la stratégie", pts: 0 },
    ],
  },
  {
    id: "g4", pillar: "G",
    question: "Réalisez-vous une analyse des risques ESG (physiques et de transition) ?",
    context: "TCFD, TNFD — risques climatiques, risques sociaux et de gouvernance",
    options: [
      { label: "Oui — analyse formelle intégrée à la gestion des risques", pts: 4 },
      { label: "Analyse partielle sur certains risques ESG", pts: 2 },
      { label: "En cours d'identification", pts: 1 },
      { label: "Non", pts: 0 },
    ],
  },
  {
    id: "g5", pillar: "G",
    question: "Consultez-vous régulièrement vos parties prenantes sur les enjeux ESG ?",
    context: "Clients, fournisseurs, employés, investisseurs, communautés locales",
    options: [
      { label: "Oui — processus formalisé d'engagement des parties prenantes", pts: 4 },
      { label: "Consultations ponctuelles sans processus structuré", pts: 2 },
      { label: "Consultations informelles uniquement", pts: 1 },
      { label: "Non", pts: 0 },
    ],
  },
];

const PILLAR_META = {
  E: { label: "Environnemental", color: "#16a34a", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", gri: "GRI 302, 303, 305, 306" },
  S: { label: "Social",          color: "#2563eb", bg: "bg-blue-50",    border: "border-blue-200",    text: "text-blue-700",    gri: "GRI 401, 403, 404, 405" },
  G: { label: "Gouvernance",     color: "#7c3aed", bg: "bg-purple-50",  border: "border-purple-200",  text: "text-purple-700",  gri: "GRI 205, 206, 207, 418" },
};

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
  if (e < 50) gaps.push({ pillar: "E", label: "Environnemental", reco: "Démarrez par un bilan carbone GHG Protocol et une politique de gestion des déchets formalisée." });
  if (s < 50) gaps.push({ pillar: "S", label: "Social", reco: "Mettez en place une politique DEI et un système de management SST (ISO 45001)." });
  if (g < 50) gaps.push({ pillar: "G", label: "Gouvernance", reco: "Publiez un rapport GRI et formalisez votre analyse des risques ESG (TCFD/TNFD)." });

  const maturity =
    global >= 75 ? { label: "Leader ESG", desc: "Votre démarche est avancée. Un rapport GRI certifié renforcera votre crédibilité auprès des investisseurs." } :
    global >= 55 ? { label: "En progression", desc: "Vos bases sont solides. Formalisez et certifiez votre démarche pour répondre aux exigences CSRD et GRI." } :
    global >= 35 ? { label: "En construction", desc: "Des actions concrètes ont été engagées. Un plan d'action structuré avec Key Consulting accélérera votre progression." } :
                   { label: "Débutant", desc: "La démarche ESG reste à construire. C'est le bon moment pour poser des bases solides avec un accompagnement expert." };

  return { e, s, g, global, gaps, maturity };
}

function GaugeSVG({ value, color, label, sublabel, delay = 0 }: { value: number; color: string; label: string; sublabel?: string; delay?: number }) {
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
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r={r} fill="none" stroke="#e5e7eb" strokeWidth="3" />
          <circle cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1.4s cubic-bezier(0.22,1,0.36,1)" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold text-lg text-foreground">{animated ? value : 0}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-foreground">{label}</span>
      {sublabel && <span className="text-[10px] text-muted-foreground -mt-1">{sublabel}</span>}
    </div>
  );
}

function Questionnaire() {
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
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-heading font-bold text-2xl text-foreground">
              Score ESG global : <span className="text-primary">{score.global}/100</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">{score.maturity.label} — {ESG_QUESTIONS.length} critères évalués</p>
          </div>
        </div>

        <div className="flex justify-center gap-6 sm:gap-10 mb-8">
          <GaugeSVG value={score.e} color={PILLAR_META.E.color} label="E" sublabel="Environnemental" delay={0} />
          <GaugeSVG value={score.s} color={PILLAR_META.S.color} label="S" sublabel="Social" delay={250} />
          <GaugeSVG value={score.g} color={PILLAR_META.G.color} label="G" sublabel="Gouvernance" delay={500} />
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-5 mb-6 text-sm leading-relaxed">
          <p className="font-semibold text-foreground mb-1">{score.maturity.label}</p>
          <p className="text-muted-foreground">{score.maturity.desc}</p>
        </div>

        {score.gaps.length > 0 && (
          <div className="space-y-3 mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">Priorités d'amélioration identifiées</p>
            {score.gaps.map((g) => {
              const m = PILLAR_META[g.pillar];
              return (
                <div key={g.pillar} className={`rounded-lg border ${m.border} ${m.bg} p-4`}>
                  <p className={`text-xs font-bold mb-1 ${m.text}`}>Pilier {g.pillar} — {g.label}</p>
                  <p className="text-xs text-foreground leading-relaxed">{g.reco}</p>
                </div>
              );
            })}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <a href="#contact" className="inline-flex items-center justify-center gap-2 py-3 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            Être accompagné par Key Consulting
          </a>
          <button onClick={restart} className="inline-flex items-center justify-center gap-2 py-3 rounded-md border border-border font-semibold text-sm hover:bg-secondary transition-colors">
            Recommencer le diagnostic
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Progression globale */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${((step) / ESG_QUESTIONS.length) * 100}%` }} />
        </div>
        <span className="text-xs text-muted-foreground shrink-0">{step + 1}/{ESG_QUESTIONS.length}</span>
      </div>

      {/* Indicateur de pilier */}
      <div className="flex items-center gap-6 mb-6 mt-4">
        {(["E", "S", "G"] as const).map((p) => {
          const m = PILLAR_META[p];
          const active = q.pillar === p;
          const done = (p === "E" && step >= 5) || (p === "S" && step >= 10);
          return (
            <div key={p} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all
              ${active ? `${m.bg} ${m.border} ${m.text}` : done ? "bg-muted border-border text-muted-foreground line-through" : "border-border text-muted-foreground"}`}>
              <span>{p}</span>
              <span className="hidden sm:inline">{m.label}</span>
              {active && <span className="opacity-60">{pillarIdx}/{pillarTotal}</span>}
            </div>
          );
        })}
      </div>

      {/* Question */}
      <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${meta.text}`}>Pilier {q.pillar} — {meta.label}</p>
      <h3 className="font-heading font-bold text-xl text-foreground mb-1">{q.question}</h3>
      {q.context && <p className="text-xs text-muted-foreground mb-5 italic">{q.context}</p>}

      <div className="space-y-2 mb-6">
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => setSelected(i)}
            className={`w-full text-left px-5 py-4 rounded-lg border-2 text-sm transition-all flex items-start gap-3
              ${selected === i ? `${meta.bg} ${meta.border} font-semibold` : "border-border hover:border-primary/40"}`}>
            <span className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center
              ${selected === i ? `${meta.border}` : "border-muted-foreground/40"}`}>
              {selected === i && <span className="w-2 h-2 rounded-full" style={{ background: meta.color }} />}
            </span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>

      <button onClick={confirm} disabled={selected === null}
        className="w-full py-3 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40">
        {step < ESG_QUESTIONS.length - 1 ? "Question suivante →" : "Voir mon score ESG"}
      </button>
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
            <a href="#diagnostic" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">Diagnostic</a>
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
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wide uppercase mb-8">
              RSE & ESG
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-foreground">
              Comprendre et piloter votre{" "}
              <span className="gradient-text">démarche RSE & ESG</span>
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl mt-6 leading-relaxed">
              Réglementations, standards GRI, piliers E, S & G — tout ce que votre entreprise doit savoir pour agir et se conformer aux exigences de vos parties prenantes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <a href="#diagnostic" className="inline-flex items-center justify-center px-8 py-3.5 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-sm">
                Tester mon score ESG
              </a>
              <a href="#contact" className="inline-flex items-center justify-center px-8 py-3.5 rounded-md border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors">
                Parler à un expert
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="rounded-2xl shadow-lg border border-border bg-background p-8 w-full max-w-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Score ESG indicatif</p>
                  <p className="font-heading font-bold text-3xl text-foreground">62<span className="text-lg text-muted-foreground">/100</span></p>
                </div>
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">Intermédiaire</span>
              </div>
              <div className="flex justify-around">
                <GaugeSVG value={72} color="#16a34a" label="E" delay={0} />
                <GaugeSVG value={58} color="#2563eb" label="S" delay={300} />
                <GaugeSVG value={55} color="#7c3aed" label="G" delay={600} />
              </div>
              <div className="mt-6 space-y-2 border-t border-border pt-4">
                {[
                  { label: "Bilan carbone", done: true },
                  { label: "Politique RH", done: true },
                  { label: "Rapport GRI", done: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 text-sm">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${item.done ? 'bg-green-500' : 'bg-muted'}`}>
                      {item.done && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className={item.done ? 'text-foreground' : 'text-muted-foreground'}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="py-16 sm:py-20 px-5 sm:px-8 bg-card border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Processus</p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground">Comment ça marche</h2>
            <p className="text-muted-foreground mt-3 text-base max-w-xl mx-auto">Du diagnostic initial à l'accompagnement certifié, un parcours en 3 étapes conçu pour les PME.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 relative">
            <div className="hidden sm:block absolute top-10 left-[33%] w-[17%] border-t-2 border-dashed border-border" />
            <div className="hidden sm:block absolute top-10 left-[67%] w-[17%] border-t-2 border-dashed border-border" />
            {[
              {
                num: "01",
                icon: "📋",
                title: "Répondez au diagnostic ESG",
                desc: "15 questions couvrant les piliers Environnemental, Social et Gouvernance. Standards GHG Protocol, ISO 45001, GRI intégrés. Durée : 5 minutes.",
                cta: { label: "Démarrer le diagnostic", href: "#diagnostic" },
                color: "bg-emerald-50 border-emerald-200",
              },
              {
                num: "02",
                icon: "📊",
                title: "Recevez votre score E / S / G",
                desc: "Score instantané sur 100 par pilier avec votre niveau de maturité (Débutant → Leader ESG), vos lacunes prioritaires et les normes associées.",
                cta: null,
                color: "bg-blue-50 border-blue-200",
              },
              {
                num: "03",
                icon: "🤝",
                title: "Key Consulting vous accompagne",
                desc: "Rapport GRI certifié, plan d'action sur mesure, badge RSE officiel. Contrat annuel avec suivi trimestriel dédié par des experts Tunisie & Maghreb.",
                cta: { label: "Contacter Key Consulting", href: "#contact" },
                color: "bg-purple-50 border-purple-200",
              },
            ].map((step) => (
              <div key={step.num} className={`rounded-xl border-2 ${step.color} p-7 flex flex-col gap-4`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{step.icon}</span>
                  <span className="text-xs font-bold text-muted-foreground tracking-widest">{step.num}</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{step.desc}</p>
                {step.cta && (
                  <a href={step.cta.href}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline mt-auto">
                    {step.cta.label} →
                  </a>
                )}
              </div>
            ))}
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

      {/* TABLEAU COMPARATIF */}
      <section className="py-16 sm:py-24 px-5 sm:px-8 bg-card">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Comparatif</p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground">
              Diagnostic gratuit vs Accompagnement complet
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-xl border-2 border-border bg-background p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Diagnostic gratuit</p>
              <p className="font-heading font-bold text-2xl text-foreground mb-1">Score ESG instantané</p>
              <p className="font-extrabold text-3xl text-primary mb-6">Gratuit</p>
              <ul className="space-y-3 mb-8">
                {["Score ESG indicatif sur 100","Analyse par pilier E, S & G","Identification des lacunes","Recommandations de base","Résultat en 2 minutes"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" />{item}
                  </li>
                ))}
              </ul>
              <a href="#diagnostic" className="w-full inline-flex items-center justify-center py-3 rounded-md border-2 border-primary text-primary font-semibold text-sm hover:bg-primary/5 transition-colors">
                Démarrer le diagnostic
              </a>
            </div>
            <div className="rounded-xl border-2 border-primary bg-primary/5 p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground">Recommandé</div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Accompagnement complet</p>
              <p className="font-heading font-bold text-2xl text-foreground mb-1">Key Consulting</p>
              <p className="text-sm text-muted-foreground mb-6">Sur devis · Contrat annuel</p>
              <ul className="space-y-3 mb-8">
                {["Rapport certifié GRI Standards","Conformité ISO 26000 / TNFD / CSRD","Plan d'action sur mesure","Suivi trimestriel dédié","Badge RSE officiel","Présentation aux investisseurs & banques"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" />{item}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                Contacter Key Consulting <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* DIAGNOSTIC */}
      <section id="diagnostic" className="py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Diagnostic gratuit</p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-3">
              Testez votre score ESG maintenant
            </h2>
            <p className="text-muted-foreground text-sm">5 questions · 2 minutes · Résultat instantané</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
            <Questionnaire />
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
