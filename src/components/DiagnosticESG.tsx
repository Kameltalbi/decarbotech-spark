import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Send, Check, ChevronLeft, Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// ── Types ─────────────────────────────────────────────────────────────────────
type DiagOption   = { label: string; score: number };
type DiagQuestion = { pillar: "E"|"S"|"G"; theme: string; text: string; hint: string; options: DiagOption[] };
type DiagAnswers  = (number | null)[];
type ContactData  = { company: string; sector: string; name: string; role: string; email: string; phone: string };
type DiagScreen   = "quiz" | "contact" | "loading" | "results";
type Reco         = { pillar: "E"|"S"|"G"; theme: string; title: string; actions: string[]; standard: string };

// ── Constants ─────────────────────────────────────────────────────────────────
const SECTORS = [
  "Textile & Habillement", "Agroalimentaire", "Industrie manufacturière",
  "Bâtiment & Construction", "Commerce & Distribution", "Services & Conseil",
  "Tourisme & Hôtellerie", "Transport & Logistique", "Agriculture",
  "Santé & Pharmaceutique", "Technologie & Numérique", "Autre",
];

const PM = {
  E: { label: "Environnement", color: "#2d6a4f", bg: "bg-emerald-50",  border: "border-emerald-200", text: "text-emerald-700", weight: 0.40 },
  S: { label: "Social",        color: "#1d4ed8", bg: "bg-blue-50",     border: "border-blue-200",    text: "text-blue-700",   weight: 0.35 },
  G: { label: "Gouvernance",   color: "#6d28d9", bg: "bg-violet-50",   border: "border-violet-200",  text: "text-violet-700", weight: 0.25 },
};

const QUESTIONS: DiagQuestion[] = [
  // ── E ──────────────────────────────────────────────────────────────────────
  {
    pillar: "E", theme: "Émissions carbone",
    text: "Réalisez-vous un bilan des émissions de gaz à effet de serre selon le GHG Protocol ?",
    hint: "Scope 1 (émissions directes), Scope 2 (énergie achetée), Scope 3 (chaîne de valeur)",
    options: [
      { label: "Oui — Scopes 1, 2 & 3 mesurés annuellement avec plan de réduction", score: 4 },
      { label: "Oui — Scopes 1 & 2 seulement, sans Scope 3", score: 3 },
      { label: "En cours de mise en place", score: 1 },
      { label: "Non — aucun bilan carbone réalisé", score: 0 },
    ],
  },
  {
    pillar: "E", theme: "Stratégie climat",
    text: "Disposez-vous d'objectifs chiffrés et datés de réduction de vos émissions ?",
    hint: "Ex. : alignés Science Based Targets (SBTi), neutralité carbone 2030 ou 2050",
    options: [
      { label: "Oui — objectifs SBTi validés et publiés", score: 4 },
      { label: "Oui — objectifs internes formalisés mais non certifiés", score: 3 },
      { label: "En cours de définition", score: 1 },
      { label: "Non", score: 0 },
    ],
  },
  {
    pillar: "E", theme: "Eau & biodiversité",
    text: "Mesurez-vous et gérez-vous votre consommation d'eau et votre impact sur la biodiversité ?",
    hint: "ISO 14046 — empreinte eau, stress hydrique, TNFD pour la biodiversité",
    options: [
      { label: "Oui — suivi eau + évaluation biodiversité avec plans de réduction", score: 4 },
      { label: "Suivi de la consommation d'eau seule, pas de biodiversité", score: 2 },
      { label: "Monitoring partiel, pas encore de plan formel", score: 1 },
      { label: "Non", score: 0 },
    ],
  },
  {
    pillar: "E", theme: "Déchets & économie circulaire",
    text: "Disposez-vous d'une politique de gestion des déchets orientée économie circulaire ?",
    hint: "Tri sélectif, valorisation, réduction à la source, reporting GRI 306",
    options: [
      { label: "Oui — politique formalisée avec indicateurs de valorisation et reporting", score: 4 },
      { label: "Actions en cours, pas encore entièrement formalisées", score: 2 },
      { label: "Conformité légale minimale uniquement", score: 1 },
      { label: "Non", score: 0 },
    ],
  },
  {
    pillar: "E", theme: "Énergie",
    text: "Avez-vous un plan de transition énergétique vers les énergies renouvelables ?",
    hint: "Part EnR dans le mix, contrats PPA, efficacité énergétique, ISO 50001",
    options: [
      { label: "Oui — plan formalisé avec cibles et suivi des EnR (>50% du mix)", score: 4 },
      { label: "Démarches engagées (contrat d'électricité verte, audits énergie)", score: 2 },
      { label: "Réflexion en cours sans plan structuré", score: 1 },
      { label: "Non", score: 0 },
    ],
  },
  {
    pillar: "E", theme: "Certifications environnementales",
    text: "Disposez-vous d'une certification environnementale reconnue ?",
    hint: "ISO 14001, EMAS, HQE, LEED, EcoVadis, label Économie Verte, B Corp…",
    options: [
      { label: "Oui — certifié ISO 14001 ou équivalent", score: 4 },
      { label: "En cours de certification, audit programmé", score: 2 },
      { label: "Politique environnementale documentée sans certification externe", score: 1 },
      { label: "Non", score: 0 },
    ],
  },
  // ── S ──────────────────────────────────────────────────────────────────────
  {
    pillar: "S", theme: "Bien-être & satisfaction",
    text: "Évaluez-vous régulièrement la satisfaction et le bien-être de vos collaborateurs ?",
    hint: "Enquête annuelle, baromètre social, index de bien-être, eNPS",
    options: [
      { label: "Oui — enquête annuelle formalisée avec plan d'action suivi", score: 4 },
      { label: "Consultations ponctuelles sans processus structuré", score: 2 },
      { label: "En cours de mise en place", score: 1 },
      { label: "Non", score: 0 },
    ],
  },
  {
    pillar: "S", theme: "Diversité, équité & inclusion",
    text: "Disposez-vous d'une politique formalisée de diversité, équité et inclusion (DEI) ?",
    hint: "Égalité H/F, handicap, origines, Index Égalité Pro, plan d'action avec indicateurs",
    options: [
      { label: "Oui — politique DEI formalisée avec indicateurs publiés et plan d'action", score: 4 },
      { label: "Politique existante mais sans indicateurs de suivi systématiques", score: 2 },
      { label: "En cours d'élaboration", score: 1 },
      { label: "Non", score: 0 },
    ],
  },
  {
    pillar: "S", theme: "Santé & sécurité au travail",
    text: "Quel est votre niveau de management de la santé et sécurité au travail (SST) ?",
    hint: "ISO 45001, DUERP (Document Unique), taux de fréquence/gravité, CSSCT",
    options: [
      { label: "Système SST certifié ISO 45001 ou équivalent, avec revue annuelle", score: 4 },
      { label: "DUERP à jour et plan de prévention suivi, sans certification externe", score: 2 },
      { label: "Conformité légale minimale (DUERP existant mais peu actualisé)", score: 1 },
      { label: "Pas de dispositif SST formalisé", score: 0 },
    ],
  },
  {
    pillar: "S", theme: "Formation & développement",
    text: "Proposez-vous des programmes structurés de formation et développement des compétences ?",
    hint: "Plan de développement des compétences, budget dédié, heures de formation / ETP",
    options: [
      { label: "Oui — plan annuel formalisé avec budget dédié et indicateurs de suivi", score: 4 },
      { label: "Formations régulières mais sans plan ni budget formalisé", score: 2 },
      { label: "Formations réglementaires obligatoires uniquement", score: 1 },
      { label: "Non", score: 0 },
    ],
  },
  {
    pillar: "S", theme: "Fournisseurs & approvisionnement",
    text: "Évaluez-vous les pratiques sociales et éthiques de vos fournisseurs clés ?",
    hint: "Questionnaires RSE, audits fournisseurs, clauses contractuelles, EcoVadis",
    options: [
      { label: "Oui — audit systématique avec critères formalisés et mesures correctives", score: 4 },
      { label: "Questionnaire RSE envoyé aux principaux fournisseurs sans audit terrain", score: 2 },
      { label: "Démarche initiée sur quelques fournisseurs", score: 1 },
      { label: "Non", score: 0 },
    ],
  },
  {
    pillar: "S", theme: "Engagement communautaire",
    text: "Votre entreprise s'engage-t-elle activement dans son territoire et ses communautés locales ?",
    hint: "Mécénat, partenariats associations, politique achats locaux, ancrage territorial",
    options: [
      { label: "Oui — programme structuré avec budget dédié et indicateurs d'impact", score: 4 },
      { label: "Actions ponctuelles non formalisées (dons, partenariats locaux)", score: 2 },
      { label: "Réflexion en cours", score: 1 },
      { label: "Non", score: 0 },
    ],
  },
  // ── G ──────────────────────────────────────────────────────────────────────
  {
    pillar: "G", theme: "Reporting & transparence",
    text: "Publiez-vous un rapport de durabilité ou rapport RSE accessible publiquement ?",
    hint: "GRI Standards, CSRD/DPEF, rapport intégré, ESRS, CDP, TCFD",
    options: [
      { label: "Oui — rapport GRI ou CSRD publié annuellement et vérifié", score: 4 },
      { label: "Rapport structuré publié sans vérification tierce partie", score: 3 },
      { label: "Quelques éléments publiés sans structure formelle", score: 1 },
      { label: "Non", score: 0 },
    ],
  },
  {
    pillar: "G", theme: "Éthique & anti-corruption",
    text: "Disposez-vous d'un code d'éthique et d'une politique anti-corruption opérationnelle ?",
    hint: "Loi Sapin II, FCPA — plan de vigilance, canal de signalement, formation obligatoire",
    options: [
      { label: "Oui — code d'éthique, formation obligatoire et canal de signalement actif", score: 4 },
      { label: "Code d'éthique formalisé mais sans canal de signalement ni formation", score: 2 },
      { label: "En cours d'élaboration", score: 1 },
      { label: "Non", score: 0 },
    ],
  },
  {
    pillar: "G", theme: "Stratégie & gouvernance ESG",
    text: "Les enjeux ESG sont-ils formellement intégrés dans la stratégie et la gouvernance de votre entreprise ?",
    hint: "KPIs ESG au conseil d'administration, feuille de route ESG pluriannuelle, comité RSE",
    options: [
      { label: "Oui — comité RSE dédié, KPIs ESG au CA, feuille de route formalisée", score: 4 },
      { label: "ESG intégré dans la stratégie opérationnelle sans gouvernance dédiée", score: 2 },
      { label: "Réflexion stratégique en cours", score: 1 },
      { label: "Non — ESG non intégré à la stratégie", score: 0 },
    ],
  },
  {
    pillar: "G", theme: "Gestion des risques ESG",
    text: "Réalisez-vous une analyse formelle des risques ESG physiques et de transition ?",
    hint: "TCFD, TNFD — risques climatiques physiques, risques de transition (réglementaires, marché)",
    options: [
      { label: "Oui — analyse intégrée à la gestion des risques globale, publiée TCFD/TNFD", score: 4 },
      { label: "Analyse partielle réalisée sur certains risques ESG prioritaires", score: 2 },
      { label: "En cours d'identification des risques ESG", score: 1 },
      { label: "Non", score: 0 },
    ],
  },
  {
    pillar: "G", theme: "Engagement parties prenantes",
    text: "Consultez-vous régulièrement vos parties prenantes sur les enjeux ESG ?",
    hint: "Clients, fournisseurs, investisseurs, employés, communautés — analyse de matérialité",
    options: [
      { label: "Oui — processus formel d'analyse de matérialité et d'engagement structuré", score: 4 },
      { label: "Consultations ponctuelles sans processus structuré", score: 2 },
      { label: "Consultations informelles uniquement", score: 1 },
      { label: "Non", score: 0 },
    ],
  },
  {
    pillar: "G", theme: "Conformité réglementaire",
    text: "Êtes-vous en conformité avec les principales réglementations ESG applicables à votre secteur ?",
    hint: "CSRD, Loi Vigilance, Loi AGEC, RE2020, SFDR, taxonomie européenne…",
    options: [
      { label: "Oui — veille réglementaire active, conformité vérifiée par audit externe", score: 4 },
      { label: "Conformité assurée en interne, sans audit externe", score: 2 },
      { label: "Conformité partielle, des lacunes identifiées", score: 1 },
      { label: "Non — conformité non évaluée", score: 0 },
    ],
  },
];

// ── Scoring ───────────────────────────────────────────────────────────────────
function calcScores(answers: DiagAnswers) {
  const byPillar = (p: "E"|"S"|"G") => {
    const idxs = QUESTIONS.map((q, i) => q.pillar === p ? i : -1).filter(i => i >= 0);
    const total = idxs.reduce((acc, i) => acc + (answers[i] ?? 0), 0);
    return Math.round((total / (idxs.length * 4)) * 100);
  };
  const e = byPillar("E"), s = byPillar("S"), g = byPillar("G");
  const global = Math.round(e * PM.E.weight + s * PM.S.weight + g * PM.G.weight);
  return { e, s, g, global };
}

function calcThemeScores(answers: DiagAnswers) {
  const themes = [...new Set(QUESTIONS.map(q => q.theme))];
  return themes.map(theme => {
    const idxs = QUESTIONS.map((q, i) => q.theme === theme ? i : -1).filter(i => i >= 0);
    const total = idxs.reduce((acc, i) => acc + (answers[i] ?? 0), 0);
    const score = Math.round((total / (idxs.length * 4)) * 100);
    const pillar = QUESTIONS[idxs[0]].pillar;
    return { theme, score, pillar };
  });
}

function getGrade(score: number) {
  if (score >= 80) return { grade: "A",  label: "Leader ESG",      color: "#2d6a4f" };
  if (score >= 65) return { grade: "B+", label: "En progression",  color: "#40916c" };
  if (score >= 50) return { grade: "B",  label: "En construction", color: "#d97706" };
  if (score >= 35) return { grade: "C",  label: "Débutant",        color: "#ea580c" };
  return               { grade: "D",  label: "Urgent",          color: "#dc2626" };
}

function buildRecos(answers: DiagAnswers): Reco[] {
  const recoMap: Record<string, Reco> = {
    "Émissions carbone": {
      pillar: "E", theme: "Émissions carbone",
      title: "Réaliser votre premier bilan carbone GHG Protocol",
      actions: [
        "Engager un prestataire spécialisé pour mesurer vos Scopes 1, 2 & 3",
        "Définir une année de référence et des objectifs de réduction à 3 ans",
        "Rejoindre l'initiative Science Based Targets (SBTi)",
      ],
      standard: "GHG Protocol / ISO 14064",
    },
    "Stratégie climat": {
      pillar: "E", theme: "Stratégie climat",
      title: "Formaliser une stratégie climat avec des objectifs mesurables",
      actions: [
        "Adopter la méthodologie SBTi pour aligner vos objectifs sur les Accords de Paris",
        "Intégrer des KPIs carbone dans vos indicateurs de performance annuels",
        "Communiquer sur votre trajectoire de décarbonation auprès de vos parties prenantes",
      ],
      standard: "SBTi / CSRD ESRS E1",
    },
    "Eau & biodiversité": {
      pillar: "E", theme: "Eau & biodiversité",
      title: "Mettre en place un suivi eau et une évaluation biodiversité",
      actions: [
        "Réaliser un diagnostic empreinte eau (ISO 14046) et identifier les zones de stress hydrique",
        "Conduire une évaluation d'impact nature selon le cadre TNFD",
        "Définir des objectifs de réduction de la consommation d'eau",
      ],
      standard: "ISO 14046 / TNFD / CSRD ESRS E3",
    },
    "Déchets & économie circulaire": {
      pillar: "E", theme: "Déchets & économie circulaire",
      title: "Structurer une politique déchets orientée économie circulaire",
      actions: [
        "Réaliser un audit déchets pour cartographier vos flux et gisements de valorisation",
        "Définir des objectifs de réduction à la source et de taux de valorisation",
        "Mettre en place un reporting déchets conforme GRI 306",
      ],
      standard: "GRI 306 / Loi AGEC",
    },
    "Énergie": {
      pillar: "E", theme: "Énergie",
      title: "Engager un plan de transition vers les énergies renouvelables",
      actions: [
        "Réaliser un audit énergétique pour identifier les gisements d'économies",
        "Négocier un contrat Power Purchase Agreement (PPA) pour votre approvisionnement",
        "Viser la certification ISO 50001 pour votre système de management de l'énergie",
      ],
      standard: "ISO 50001 / RE2020",
    },
    "Certifications environnementales": {
      pillar: "E", theme: "Certifications environnementales",
      title: "Engager un processus de certification environnementale",
      actions: [
        "Choisir la certification adaptée à votre secteur (ISO 14001, HQE, B Corp…)",
        "Conduire un audit à blanc pour identifier les écarts par rapport au référentiel",
        "Planifier la certification sur 12 à 18 mois avec Key Consulting",
      ],
      standard: "ISO 14001 / EMAS",
    },
    "Bien-être & satisfaction": {
      pillar: "S", theme: "Bien-être & satisfaction",
      title: "Mettre en place une démarche structurée de bien-être au travail",
      actions: [
        "Lancer une enquête de satisfaction annuelle (eNPS + questions qualitatives)",
        "Créer un plan d'action QVT basé sur les résultats",
        "Former les managers à la détection des risques psychosociaux (RPS)",
      ],
      standard: "ISO 45003 / GRI 401",
    },
    "Diversité, équité & inclusion": {
      pillar: "S", theme: "Diversité, équité & inclusion",
      title: "Formaliser et piloter votre politique DEI",
      actions: [
        "Mesurer et publier votre Index d'Égalité Professionnelle H/F",
        "Définir des objectifs chiffrés de représentation (femmes, handicap, minorités)",
        "Mettre en place un programme de mentorat pour les groupes sous-représentés",
      ],
      standard: "GRI 405 / ESRS S1",
    },
    "Santé & sécurité au travail": {
      pillar: "S", theme: "Santé & sécurité au travail",
      title: "Renforcer votre système de management SST",
      actions: [
        "Mettre à jour votre DUERP en impliquant les collaborateurs et le CSE/CSSCT",
        "Définir et suivre des indicateurs SST (taux de fréquence, taux de gravité)",
        "Viser la certification ISO 45001 pour votre système de management SST",
      ],
      standard: "ISO 45001 / Code du travail",
    },
    "Formation & développement": {
      pillar: "S", theme: "Formation & développement",
      title: "Structurer un plan de développement des compétences",
      actions: [
        "Formaliser un plan annuel de développement des compétences avec budget dédié",
        "Mettre en place des entretiens professionnels systématiques tous les 2 ans",
        "Mesurer le nombre d'heures de formation par collaborateur annuellement",
      ],
      standard: "GRI 404 / ESRS S1",
    },
    "Fournisseurs & approvisionnement": {
      pillar: "S", theme: "Fournisseurs & approvisionnement",
      title: "Déployer une démarche d'évaluation RSE fournisseurs",
      actions: [
        "Cartographier vos fournisseurs critiques et leurs risques ESG",
        "Mettre en place une évaluation annuelle via questionnaire (EcoVadis ou équivalent)",
        "Intégrer des clauses RSE dans vos contrats fournisseurs",
      ],
      standard: "GRI 308, 414 / Loi Vigilance",
    },
    "Engagement communautaire": {
      pillar: "S", theme: "Engagement communautaire",
      title: "Structurer votre engagement territorial",
      actions: [
        "Définir une stratégie d'ancrage territorial avec un budget mécénat dédié",
        "Identifier des partenaires associatifs alignés avec vos valeurs et impacts",
        "Mesurer les impacts sociaux de vos actions (SROI — Social Return on Investment)",
      ],
      standard: "GRI 413 / ISO 26000",
    },
    "Reporting & transparence": {
      pillar: "G", theme: "Reporting & transparence",
      title: "Publier votre premier rapport ESG structuré",
      actions: [
        "Réaliser une analyse de matérialité double pour identifier vos enjeux prioritaires",
        "Produire un rapport conforme aux standards GRI ou CSRD/ESRS",
        "Faire vérifier votre rapport par un organisme tiers indépendant (OTI)",
      ],
      standard: "GRI Standards / CSRD ESRS",
    },
    "Éthique & anti-corruption": {
      pillar: "G", theme: "Éthique & anti-corruption",
      title: "Déployer un dispositif anti-corruption conforme Sapin II",
      actions: [
        "Rédiger et diffuser un code d'éthique et de conduite des affaires",
        "Mettre en place un canal de signalement (lanceur d'alerte) conforme à la directive UE",
        "Former l'ensemble des collaborateurs à l'éthique et à la prévention de la corruption",
      ],
      standard: "Loi Sapin II / FCPA / ISO 37001",
    },
    "Stratégie & gouvernance ESG": {
      pillar: "G", theme: "Stratégie & gouvernance ESG",
      title: "Intégrer l'ESG au cœur de la gouvernance d'entreprise",
      actions: [
        "Créer un comité RSE/ESG avec des membres de la direction et du conseil",
        "Définir une feuille de route ESG pluriannuelle avec des jalons mesurables",
        "Lier une partie de la rémunération variable des dirigeants aux KPIs ESG",
      ],
      standard: "GRI 205 / CSRD ESRS G1",
    },
    "Gestion des risques ESG": {
      pillar: "G", theme: "Gestion des risques ESG",
      title: "Intégrer les risques ESG dans votre gestion des risques globale",
      actions: [
        "Réaliser une analyse de scénarios climatiques (TCFD) pour vos actifs et opérations",
        "Évaluer les risques liés à la biodiversité selon le cadre TNFD",
        "Intégrer les risques ESG dans votre cartographie des risques annuelle",
      ],
      standard: "TCFD / TNFD / CSRD ESRS",
    },
    "Engagement parties prenantes": {
      pillar: "G", theme: "Engagement parties prenantes",
      title: "Structurer votre dialogue avec les parties prenantes",
      actions: [
        "Cartographier vos parties prenantes (clients, fournisseurs, riverains, investisseurs)",
        "Conduire une analyse de matérialité double impliquant vos parties prenantes clés",
        "Publier les résultats de vos consultations et vos engagements de réponse",
      ],
      standard: "GRI 2 / ISO 26000 / AA1000",
    },
    "Conformité réglementaire": {
      pillar: "G", theme: "Conformité réglementaire",
      title: "Mettre en place une veille réglementaire ESG active",
      actions: [
        "Cartographier les réglementations ESG applicables à votre secteur et taille",
        "Nommer un référent conformité ESG et mettre en place une veille réglementaire",
        "Planifier un audit de conformité externe pour identifier les lacunes",
      ],
      standard: "CSRD / Loi Vigilance / Loi AGEC",
    },
  };

  const seen = new Set<string>();
  const recos: Reco[] = [];
  QUESTIONS.forEach((q, i) => {
    const score = answers[i] ?? 0;
    if (score < 2 && recoMap[q.theme] && !seen.has(q.theme)) {
      seen.add(q.theme);
      recos.push(recoMap[q.theme]);
    }
  });
  return recos.slice(0, 6);
}

// ── GaugeSVG ──────────────────────────────────────────────────────────────────
function GaugeSVG({ value, color, label, sublabel, delay = 0 }: {
  value: number; color: string; label: string; sublabel?: string; delay?: number;
}) {
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
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r={r} fill="none" stroke="#e5e7eb" strokeWidth="3" />
          <circle cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1.4s cubic-bezier(0.22,1,0.36,1)" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold text-xl leading-none text-foreground">{animated ? value : 0}</span>
          <span className="text-[10px] text-muted-foreground">/100</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-bold" style={{ color }}>{label}</p>
        {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
      </div>
    </div>
  );
}

// ── RadarChart ────────────────────────────────────────────────────────────────
function RadarChart({ e, s, g }: { e: number; s: number; g: number }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 500); return () => clearTimeout(t); }, []);

  const cx = 100, cy = 105, maxR = 72;
  const axes = [
    { angle: -90, value: animated ? e : 0, label: "E", color: PM.E.color },
    { angle:  30, value: animated ? s : 0, label: "S", color: PM.S.color },
    { angle: 150, value: animated ? g : 0, label: "G", color: PM.G.color },
  ];
  const toXY = (angle: number, r: number) => ({
    x: cx + r * Math.cos((angle * Math.PI) / 180),
    y: cy + r * Math.sin((angle * Math.PI) / 180),
  });
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const dataPoints = axes.map(a => toXY(a.angle, (a.value / 100) * maxR));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <svg viewBox="0 0 200 210" className="w-full max-w-[200px]">
      {gridLevels.map((level, li) => {
        const pts = axes.map(a => toXY(a.angle, level * maxR));
        const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
        return <path key={li} d={d} fill="none" stroke="#e5e7eb" strokeWidth="0.7" />;
      })}
      {axes.map((a, i) => {
        const end = toXY(a.angle, maxR);
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#e5e7eb" strokeWidth="0.7" />;
      })}
      <path d={dataPath} fill="rgba(45,106,79,0.15)" stroke="#2d6a4f" strokeWidth="1.5"
        style={{ transition: "d 1s ease" }} />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={axes[i].color} />
      ))}
      {axes.map((a, i) => {
        const pos = toXY(a.angle, maxR + 16);
        return (
          <text key={i} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle"
            fontSize="11" fontWeight="bold" fill={a.color}>{a.label}</text>
        );
      })}
    </svg>
  );
}

const LOADING_STEPS = [
  "Analyse de vos réponses…",
  "Calcul du score ESG pondéré…",
  "Identification des priorités…",
  "Génération des recommandations…",
  "Finalisation du rapport…",
];

// ── LoadingScreen ─────────────────────────────────────────────────────────────
function LoadingScreen() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step < LOADING_STEPS.length - 1) {
      const t = setTimeout(() => setStep(s => s + 1), 600);
      return () => clearTimeout(t);
    }
  }, [step]);
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-8">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full animate-spin" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#2d6a4f" strokeWidth="3"
            strokeDasharray="40 60" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-extrabold text-primary">ESG</span>
        </div>
      </div>
      <div className="space-y-1 text-center">
        {LOADING_STEPS.map((s, i) => (
          <p key={i} className={`text-sm transition-all duration-300 ${i < step ? "text-emerald-600 font-medium" : i === step ? "text-foreground font-semibold" : "text-muted-foreground/40"}`}>
            {i < step ? "✓ " : i === step ? "→ " : "  "}{s}
          </p>
        ))}
      </div>
    </div>
  );
}

// ── ContactScreen ─────────────────────────────────────────────────────────────
function ContactScreen({ onSubmit, onBack }: { onSubmit: (data: ContactData) => void; onBack: () => void }) {
  const [form, setForm] = useState<ContactData>({ company: "", sector: "", name: "", role: "", email: "", phone: "" });
  const set = (k: keyof ContactData) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));
  const handleSubmit = (e: FormEvent) => { e.preventDefault(); onSubmit(form); };

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Étape finale — 18/18</p>
        <h3 className="font-heading font-bold text-xl text-foreground mb-1">Votre rapport personnalisé</h3>
        <p className="text-sm text-muted-foreground">
          Renseignez vos coordonnées pour recevoir votre diagnostic ESG complet et être contacté par un expert Key Consulting.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Société *</label>
            <input required value={form.company} onChange={set("company")} placeholder="Nom de votre entreprise"
              className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Secteur *</label>
            <select required value={form.sector} onChange={set("sector")}
              className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">Sélectionnez votre secteur…</option>
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Prénom & Nom *</label>
            <input required value={form.name} onChange={set("name")} placeholder="Ex. Jean Dupont"
              className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Fonction</label>
            <input value={form.role} onChange={set("role")} placeholder="Ex. Directeur RSE"
              className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Email professionnel *</label>
            <input required type="email" value={form.email} onChange={set("email")} placeholder="votre@email.com"
              className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Téléphone</label>
            <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+33 6 00 00 00 00"
              className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-border text-sm font-semibold hover:bg-secondary transition-colors">
            <ChevronLeft className="w-4 h-4" /> Retour
          </button>
          <button type="submit"
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            <Send className="w-4 h-4" /> Voir mon diagnostic ESG
          </button>
        </div>
      </form>
    </div>
  );
}

// ── ResultsScreen ─────────────────────────────────────────────────────────────
function ResultsScreen({ answers, contact, onRestart }: {
  answers: DiagAnswers; contact: ContactData; onRestart: () => void;
}) {
  const [emailStatus, setEmailStatus] = useState<"idle"|"sending"|"sent"|"error">("idle");
  const [saveStatus, setSaveStatus] = useState<"idle"|"saving"|"saved"|"error">("idle");
  const { user } = useAuth();
  const scores     = calcScores(answers);
  const themeScores = calcThemeScores(answers);
  const grade      = getGrade(scores.global);
  const recos      = buildRecos(answers);

  // Save to Supabase if user is logged in
  useEffect(() => {
    if (user) {
      setSaveStatus("saving");
      supabase
        .from("assessments")
        .insert({
          user_id: user.id,
          answers: answers,
          scores: { e: scores.e, s: scores.s, g: scores.g, global: scores.global },
          contact: contact,
        })
        .then(({ error }) => {
          setSaveStatus(error ? "error" : "saved");
        });
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setEmailStatus("sending");
    fetch("/.netlify/functions/send-esg-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: contact.name, email: contact.email, company: contact.company,
        sector: contact.sector, role: contact.role, phone: contact.phone,
        scores, grade: grade.grade, maturity: grade.label,
        recos: recos.map(r => ({ theme: r.theme, title: r.title })),
      }),
    }).then(r => setEmailStatus(r.ok ? "sent" : "error")).catch(() => setEmailStatus("error"));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          {contact.company} · {contact.sector}
        </p>
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-extrabold text-white mb-3"
          style={{ background: grade.color }}>
          {grade.grade}
        </div>
        <h3 className="font-heading font-bold text-2xl text-foreground">{grade.label}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Score global ESG : <strong>{scores.global}/100</strong> · 18 critères évalués
        </p>
        {emailStatus === "sent" && (
          <p className="text-xs text-emerald-600 mt-2 flex items-center justify-center gap-1">
            <Check className="w-3 h-3" /> Rapport envoyé à {contact.email}
          </p>
        )}
        {saveStatus === "saving" && user && (
          <p className="text-xs text-blue-600 mt-2 flex items-center justify-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" /> Sauvegarde dans votre espace…
          </p>
        )}
        {saveStatus === "saved" && user && (
          <p className="text-xs text-emerald-600 mt-2 flex items-center justify-center gap-1">
            <Save className="w-3 h-3" /> Diagnostic sauvegardé dans votre espace ESG
          </p>
        )}
      </div>

      {/* Pillar donuts */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Scores par pilier</p>
        <div className="flex justify-center gap-6 sm:gap-10">
          <GaugeSVG value={scores.e} color={PM.E.color} label="E" sublabel="Environnement" delay={0} />
          <GaugeSVG value={scores.s} color={PM.S.color} label="S" sublabel="Social"        delay={250} />
          <GaugeSVG value={scores.g} color={PM.G.color} label="G" sublabel="Gouvernance"   delay={500} />
        </div>
      </div>

      {/* Theme bars + Radar */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Détail par thème</p>
          <div className="space-y-2">
            {themeScores.map(({ theme, score, pillar }) => {
              const m = PM[pillar];
              return (
                <div key={theme}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-foreground truncate pr-2 text-[11px]">{theme}</span>
                    <span className={`font-semibold shrink-0 ${m.text}`}>{score}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${score}%`, background: m.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Radar ESG</p>
          <RadarChart e={scores.e} s={scores.s} g={scores.g} />
        </div>
      </div>

      {/* Recommendations */}
      {recos.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Priorités d'amélioration · {recos.length} axes identifiés
          </p>
          <div className="space-y-3">
            {recos.map((r, i) => {
              const m = PM[r.pillar];
              return (
                <div key={i} className={`rounded-lg border ${m.border} ${m.bg} p-4`}>
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white shrink-0"
                      style={{ background: m.color }}>{r.pillar}</span>
                    <p className="text-sm font-semibold text-foreground leading-tight">{r.title}</p>
                  </div>
                  <ul className="space-y-1 mb-2">
                    {r.actions.map((a, j) => (
                      <li key={j} className="text-xs text-muted-foreground flex gap-2">
                        <span className="shrink-0 text-primary">→</span><span>{a}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-muted-foreground italic">Référence : {r.standard}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 text-center">
        <p className="font-heading font-bold text-lg text-foreground mb-1">
          Besoin d'un accompagnement sur mesure ?
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Key Consulting vous aide à transformer ces recommandations en plan d'action concret et mesurable.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#contact"
            className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            <Send className="w-4 h-4" /> Contacter Key Consulting
          </a>
          <button onClick={onRestart}
            className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-md border border-border text-sm font-semibold hover:bg-secondary transition-colors">
            Recommencer le diagnostic
          </button>
        </div>
      </div>
    </div>
  );
}

// ── DiagnosticESG (main state machine) ───────────────────────────────────────
export default function DiagnosticESG() {
  const [screen, setScreen]   = useState<DiagScreen>("quiz");
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState<DiagAnswers>(new Array(QUESTIONS.length).fill(null));
  const [selected, setSelected] = useState<number | null>(null);
  const [contact, setContact] = useState<ContactData | null>(null);

  const q       = QUESTIONS[step];
  const pillar  = q.pillar;
  const m       = PM[pillar];
  const pIdxs   = QUESTIONS.map((x, i) => x.pillar === pillar ? i : -1).filter(i => i >= 0);
  const pStep   = pIdxs.indexOf(step) + 1;
  const pTotal  = pIdxs.length;

  const handleSelect = (i: number) => {
    setSelected(i);
    const newAnswers = [...answers];
    newAnswers[step] = q.options[i].score;
    setTimeout(() => {
      setAnswers(newAnswers);
      setSelected(null);
      if (step < QUESTIONS.length - 1) {
        setStep(s => s + 1);
      } else {
        setScreen("contact");
      }
    }, 380);
  };

  const handleBack = () => {
    if (step > 0) { setStep(s => s - 1); setSelected(null); }
  };

  const handleContactSubmit = (data: ContactData) => {
    setContact(data);
    setScreen("loading");
    setTimeout(() => setScreen("results"), 3200);
  };

  const handleRestart = () => {
    setScreen("quiz");
    setStep(0);
    setAnswers(new Array(QUESTIONS.length).fill(null));
    setSelected(null);
    setContact(null);
  };

  if (screen === "loading") return <LoadingScreen />;
  if (screen === "results" && contact) return <ResultsScreen answers={answers} contact={contact} onRestart={handleRestart} />;
  if (screen === "contact") return <ContactScreen onSubmit={handleContactSubmit} onBack={() => { setScreen("quiz"); }} />;

  return (
    <div className="font-body">
      {/* Global progress */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
        </div>
        <span className="text-xs text-muted-foreground shrink-0">{step + 1}/{QUESTIONS.length}</span>
      </div>

      {/* Pillar tabs */}
      <div className="flex items-center gap-2 mb-6 mt-3 flex-wrap">
        {(["E", "S", "G"] as const).map(p => {
          const pm = PM[p];
          const active = pillar === p;
          const pidxs = QUESTIONS.map((x, i) => x.pillar === p ? i : -1).filter(i => i >= 0);
          const done = step > pidxs[pidxs.length - 1];
          return (
            <div key={p} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
              active ? `${pm.bg} ${pm.border} ${pm.text}` :
              done   ? "bg-muted border-border text-muted-foreground opacity-60" :
                       "border-border text-muted-foreground"}`}>
              {done ? <Check className="w-3 h-3" /> : <span>{p}</span>}
              <span className="hidden sm:inline">{pm.label}</span>
              {active && <span className="opacity-70">{pStep}/{pTotal}</span>}
            </div>
          );
        })}
      </div>

      {/* Theme + question */}
      <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${m.text}`}>
        Pilier {pillar} · {q.theme}
      </p>
      <h3 className="font-heading font-bold text-lg text-foreground mb-1">{q.text}</h3>
      <p className="text-xs text-muted-foreground italic mb-5">{q.hint}</p>

      {/* Options */}
      <div className="space-y-2 mb-6">
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => handleSelect(i)}
            className={`w-full text-left px-5 py-4 rounded-lg border-2 text-sm transition-all flex items-start gap-3 ${
              selected === i ? `${m.bg} ${m.border} font-semibold` : "border-border hover:border-primary/40"}`}>
            <span className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
              selected === i ? m.border : "border-muted-foreground/40"}`}>
              {selected === i && <span className="w-2 h-2 rounded-full" style={{ background: m.color }} />}
            </span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Navigation — back only, next is automatic */}
      {step > 0 && (
        <button onClick={handleBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-border text-sm font-semibold hover:bg-secondary transition-colors">
          <ChevronLeft className="w-4 h-4" /> Retour
        </button>
      )}
    </div>
  );
}
