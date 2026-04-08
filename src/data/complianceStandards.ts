// Standards de conformité ESG selon documents de référence
// ESRS (Post-Omnibus), GRI, ISSB, SASB, TCFD

export type ComplianceStatus = "conforme" | "non_conforme" | "partiel" | "na" | null;
export type MaterialityType = "impact" | "financial" | "double";
export type ObligationLevel = "Obligatoire" | "Recommandé" | "Optionnel";
export type Pillar = "E" | "S" | "G" | "Transverse";

export interface Requirement {
  id: string;
  code: string;
  title: string;
  description: string;
  pillar: Pillar;
  obligation: ObligationLevel;
  materiality: MaterialityType;
  proofExamples: string[];
  guidance?: string;
}

export interface Standard {
  id: string;
  shortName: string;
  fullName: string;
  description: string;
  version: string;
  application: string;
  materialityType: MaterialityType;
  targetAudience: string;
  mandatoryInEU: boolean;
  requirements: Requirement[];
}

// ESRS E1 - Climate Change
const esrsE1: Requirement[] = [
  { id: "esrs-e1-1", code: "E1-1", title: "Politique climat", description: "Politique de gestion des impacts sur le changement climatique", pillar: "E", obligation: "Obligatoire", materiality: "double", proofExamples: ["Politique climat", "Engagement réduction"] },
  { id: "esrs-e1-2", code: "E1-2", title: "Actions climat", description: "Actions et ressources liées à la politique climat", pillar: "E", obligation: "Obligatoire", materiality: "double", proofExamples: ["Plan action climat", "Budget dédié"] },
  { id: "esrs-e1-3", code: "E1-3", title: "Objectifs climatiques", description: "Objectifs quantifiés de réduction des émissions GES", pillar: "E", obligation: "Obligatoire", materiality: "double", proofExamples: ["Objectifs SBTi", "Milestones"] },
  { id: "esrs-e1-4", code: "E1-4", title: "Inventaire GES", description: "Bilan carbone Scope 1, 2 et 3 selon GHG Protocol", pillar: "E", obligation: "Obligatoire", materiality: "double", proofExamples: ["Rapport GES", "CarboScan"] },
  { id: "esrs-e1-5", code: "E1-5", title: "Risques physiques", description: "Identification et évaluation des risques physiques climatiques", pillar: "E", obligation: "Obligatoire", materiality: "double", proofExamples: ["Analyse vulnérabilité", "Scénarios climatiques"] },
  { id: "esrs-e1-6", code: "E1-6", title: "Risques de transition", description: "Analyse des risques de transition vers économie bas-carbone", pillar: "E", obligation: "Obligatoire", materiality: "double", proofExamples: ["Scénarios transition", "Analyse financière"] },
  { id: "esrs-e1-7", code: "E1-7", title: "Compensation carbone", description: "Utilisation de crédits carbone et compensation résiduelle", pillar: "E", obligation: "Optionnel", materiality: "double", proofExamples: ["Certificats Verra/Gold", "Contrats PPA"] },
];

// ESRS E2 - Pollution
const esrsE2: Requirement[] = [
  { id: "esrs-e2-1", code: "E2-1", title: "Politique pollution", description: "Politique de prévention et réduction de la pollution", pillar: "E", obligation: "Obligatoire", materiality: "double", proofExamples: ["Politique EHS", "Permis exploitation"] },
  { id: "esrs-e2-2", code: "E2-2", title: "Polluants émis", description: "Quantités de polluants émis à l'air, eau et sol", pillar: "E", obligation: "Obligatoire", materiality: "double", proofExamples: ["Registre émissions", "Analyses élab"] },
  { id: "esrs-e2-3", code: "E2-3", title: "Microplastiques", description: "Émissions de microplastiques et nanomatériaux", pillar: "E", obligation: "Recommandé", materiality: "double", proofExamples: ["Analyse produits", "Substitutions"] },
];

// ESRS E3 - Water
const esrsE3: Requirement[] = [
  { id: "esrs-e3-1", code: "E3-1", title: "Politique eau", description: "Politique de gestion durable des ressources en eau", pillar: "E", obligation: "Obligatoire", materiality: "double", proofExamples: ["Charte eau", "Objectifs réduction"] },
  { id: "esrs-e3-2", code: "E3-2", title: "Prélèvements eau", description: "Volumes d'eau prélevés par source et bassin versant", pillar: "E", obligation: "Obligatoire", materiality: "double", proofExamples: ["Factures d'eau", "HydroScan"] },
  { id: "esrs-e3-3", code: "E3-3", title: "Zones stress hydrique", description: "Sites en zones de stress hydrique et plans d'action", pillar: "E", obligation: "Obligatoire", materiality: "double", proofExamples: ["Cartographie Aqueduct", "Plans sécheresse"] },
];

// ESRS E4 - Biodiversity
const esrsE4: Requirement[] = [
  { id: "esrs-e4-1", code: "E4-1", title: "Politique biodiversité", description: "Stratégie de transition vers neutralité en biodiversité", pillar: "E", obligation: "Obligatoire", materiality: "double", proofExamples: ["Plan biodiversité", "Engagements naturalistes"] },
  { id: "esrs-e4-2", code: "E4-2", title: "Impacts biodiversité", description: "Évaluation des impacts significatifs sur la biodiversité", pillar: "E", obligation: "Obligatoire", materiality: "double", proofExamples: ["Étude d'impact", "Plan de gestion"] },
  { id: "esrs-e4-3", code: "E4-3", title: "Sites sensibles", description: "Sites opérant dans ou à proximité des zones sensibles", pillar: "E", obligation: "Obligatoire", materiality: "double", proofExamples: ["Cartographie zonages", "Évaluations écologiques"] },
];

// ESRS E5 - Circular Economy
const esrsE5: Requirement[] = [
  { id: "esrs-e5-1", code: "E5-1", title: "Politique économie circulaire", description: "Engagement en faveur de l'économie circulaire et ecoconception", pillar: "E", obligation: "Obligatoire", materiality: "double", proofExamples: ["Charte ecoconception", "Objectifs recyclage"] },
  { id: "esrs-e5-2", code: "E5-2", title: "Déchets", description: "Génération de déchets par type et destination", pillar: "E", obligation: "Obligatoire", materiality: "double", proofExamples: ["Registre déchets", "Bordereaux de suivi"] },
  { id: "esrs-e5-3", code: "E5-3", title: "Matières recyclées", description: "Utilisation de matières recyclées et contenu recyclé", pillar: "E", obligation: "Obligatoire", materiality: "double", proofExamples: ["Analyse composition", "Certificats recyclage"] },
];

// ESRS S1 - Own Workforce
const esrsS1: Requirement[] = [
  { id: "esrs-s1-1", code: "S1-1", title: "Politique emploi", description: "Politique de respect des droits des travailleurs", pillar: "S", obligation: "Obligatoire", materiality: "double", proofExamples: ["Code de conduite RH", "Charte éthique"] },
  { id: "esrs-s1-2", code: "S1-2", title: "Dialogue social", description: "Structures de représentation et dialogue avec les travailleurs", pillar: "S", obligation: "Obligatoire", materiality: "double", proofExamples: ["CE/DP", "Accords collectifs"] },
  { id: "esrs-s1-3", code: "S1-3", title: "Santé et sécurité", description: "Système de gestion SST et indicateurs accidents", pillar: "S", obligation: "Obligatoire", materiality: "double", proofExamples: ["Document unique", "DPAT", "Taux fréquence"] },
  { id: "esrs-s1-4", code: "S1-4", title: "Formation", description: "Heures de formation par travailleur", pillar: "S", obligation: "Obligatoire", materiality: "double", proofExamples: ["Plan de formation", "Budget formation"] },
  { id: "esrs-s1-5", code: "S1-5", title: "Diversité", description: "Politique de diversité, égalité et inclusion", pillar: "S", obligation: "Obligatoire", materiality: "double", proofExamples: ["Index égalité", "Politique handicap"] },
  { id: "esrs-s1-6", code: "S1-6", title: "Égalité rémunération", description: "Écart de rémunération entre genres", pillar: "S", obligation: "Obligatoire", materiality: "double", proofExamples: ["Analyse écarts rémunération", "Plan égalité"] },
  { id: "esrs-s1-7", code: "S1-7", title: "Droits fondamentaux", description: "Respect des droits fondamentaux au travail (OIT)", pillar: "S", obligation: "Obligatoire", materiality: "double", proofExamples: ["Charte droits humains", "Audit social"] },
];

// ESRS S2 - Value Chain Workers
const esrsS2: Requirement[] = [
  { id: "esrs-s2-1", code: "S2-1", title: "Politique chaîne de valeur", description: "Politique de gestion des impacts sur travailleurs de la chaîne de valeur", pillar: "S", obligation: "Obligatoire", materiality: "double", proofExamples: ["Code fournisseurs", "Charte sous-traitance"] },
  { id: "esrs-s2-2", code: "S2-2", title: "Due diligence fournisseurs", description: "Processus d'évaluation des impacts sociaux des fournisseurs", pillar: "S", obligation: "Obligatoire", materiality: "double", proofExamples: ["Audit fournisseurs", "Questionnaires ESG"] },
];

// ESRS G1 - Business Conduct
const esrsG1: Requirement[] = [
  { id: "esrs-g1-1", code: "G1-1", title: "Rôles du board", description: "Rôles de l'organe d'administration en ESG", pillar: "G", obligation: "Obligatoire", materiality: "double", proofExamples: ["Règlement intérieur", "Délibérations CA"] },
  { id: "esrs-g1-2", code: "G1-2", title: "Information ESG", description: "Processus de communication ESG aux parties prenantes", pillar: "G", obligation: "Obligatoire", materiality: "double", proofExamples: ["Rapport annuel", "Materiality matrix"] },
  { id: "esrs-g1-3", code: "G1-3", title: "Éthique", description: "Politique anti-corruption, lanceurs d'alerte, conflits d'intérêts", pillar: "G", obligation: "Obligatoire", materiality: "double", proofExamples: ["Code éthique", "Canal éthique"] },
  { id: "esrs-g1-4", code: "G1-4", title: "Protection lanceurs d'alerte", description: "Mécanismes de signalement et protection des lanceurs d'alerte", pillar: "G", obligation: "Obligatoire", materiality: "double", proofExamples: ["Procédure alertes", "Confidentialité"] },
  { id: "esrs-g1-5", code: "G1-5", title: "Animal testing", description: "Politique sur les tests sur animaux", pillar: "G", obligation: "Recommandé", materiality: "double", proofExamples: ["Politique alternatives", "Certifications"] },
];

// GRI Standards
const griRequirements: Requirement[] = [
  // GRI 2 - General Disclosures
  { id: "gri-2-9", code: "GRI 2-9", title: "Structure gouvernance", description: "Composition du plus haut organe de gouvernance", pillar: "G", obligation: "Obligatoire", materiality: "impact", proofExamples: ["Organigramme CA", "Composition comités"] },
  { id: "gri-2-10", code: "GRI 2-10", title: "Nomination board", description: "Processus de nomination des membres de la gouvernance", pillar: "G", obligation: "Obligatoire", materiality: "impact", proofExamples: ["Procédure nomination", "Critères sélection"] },
  { id: "gri-2-12", code: "GRI 2-12", title: "Rôle direction", description: "Rôle de la direction dans supervision impacts ESG", pillar: "G", obligation: "Obligatoire", materiality: "impact", proofExamples: ["Description rôles", "Référentiels CA"] },
  { id: "gri-2-13", code: "GRI 2-13", title: "Délégation responsabilité", description: "Délégation de responsabilité pour impacts ESG", pillar: "G", obligation: "Obligatoire", materiality: "impact", proofExamples: ["Tableau délégation", "Process décisionnel"] },
  { id: "gri-2-14", code: "GRI 2-14", title: "Rôle dans reporting", description: "Rôle de l'organe de gouvernance dans reporting durabilité", pillar: "G", obligation: "Obligatoire", materiality: "impact", proofExamples: ["Validation rapport", "Process reporting"] },
  { id: "gri-2-15", code: "GRI 2-15", title: "Conflits d'intérêts", description: "Conflits d'intérêts et résolution", pillar: "G", obligation: "Obligatoire", materiality: "impact", proofExamples: ["Déclaration conflits", "Procédure gestion"] },
  { id: "gri-2-16", code: "GRI 2-16", title: "Communication valeurs", description: "Communication des valeurs critiques aux travailleurs", pillar: "G", obligation: "Obligatoire", materiality: "impact", proofExamples: ["Code éthique diffusé", "Formation éthique"] },
  { id: "gri-2-17", code: "GRI 2-17", title: "Connaissance collective", description: "Mécanismes de collecte des connaissances du board", pillar: "G", obligation: "Obligatoire", materiality: "impact", proofExamples: ["Formation continue CA", "Expertise externe"] },
  { id: "gri-2-18", code: "GRI 2-18", title: "Évaluation performance", description: "Évaluation de la performance du board", pillar: "G", obligation: "Obligatoire", materiality: "impact", proofExamples: ["Evaluation annuelle", "Questionnaires évaluation"] },
  { id: "gri-2-19", code: "GRI 2-19", title: "Politique rémunération", description: "Politiques de rémunération et processus de décision", pillar: "G", obligation: "Obligatoire", materiality: "impact", proofExamples: ["Politique rémunération", "Comité rémunération"] },
  { id: "gri-2-22", code: "GRI 2-22", title: "Déclaration stratégique RS", description: "Déclaration sur la stratégie de développement durable", pillar: "Transverse", obligation: "Obligatoire", materiality: "impact", proofExamples: ["Stratégie ESG", "Plan développement durable"] },
  { id: "gri-2-23", code: "GRI 2-23", title: "Engagements politiques", description: "Engagements politiques de l'organisation", pillar: "Transverse", obligation: "Obligatoire", materiality: "impact", proofExamples: ["Chartes signées", "Adhésions coalitions"] },
  { id: "gri-2-25", code: "GRI 2-25", title: "Processus remédiation", description: "Processus pour remédier aux impacts négatifs", pillar: "Transverse", obligation: "Obligatoire", materiality: "impact", proofExamples: ["Procédure réclamation", "Mécanisme recours"] },
  { id: "gri-2-26", code: "GRI 2-26", title: "Mécanismes avis", description: "Mécanismes pour recherche avis et protection lanceurs d'alerte", pillar: "Transverse", obligation: "Obligatoire", materiality: "impact", proofExamples: ["Canal éthique", "Protection alerteurs"] },
  { id: "gri-2-27", code: "GRI 2-27", title: "Conformité légale", description: "Conformité avec les lois et réglementations", pillar: "Transverse", obligation: "Obligatoire", materiality: "impact", proofExamples: ["Veille juridique", "Registre conformité"] },
  { id: "gri-2-29", code: "GRI 2-29", title: "Engagement parties prenantes", description: "Approche pour l'engagement des parties prenantes", pillar: "Transverse", obligation: "Obligatoire", materiality: "impact", proofExamples: ["Matrice parties prenantes", "Plan engagement"] },
  { id: "gri-2-30", code: "GRI 2-30", title: "Contrats collectifs", description: "Pourcentage de travailleurs couverts par contrats collectifs", pillar: "S", obligation: "Obligatoire", materiality: "impact", proofExamples: ["Accords collectifs", "Couverture syndicale"] },
  // GRI 3 - Material Topics
  { id: "gri-3-1", code: "GRI 3-1", title: "Processus matérialité", description: "Processus pour déterminer les sujets matériels", pillar: "Transverse", obligation: "Obligatoire", materiality: "impact", proofExamples: ["Analyse matérialité", "Cartographie risques"] },
  { id: "gri-3-2", code: "GRI 3-2", title: "Liste sujets matériels", description: "Liste des sujets matériels et limites", pillar: "Transverse", obligation: "Obligatoire", materiality: "impact", proofExamples: ["Materiality matrix", "Rapport matérialité"] },
  { id: "gri-3-3", code: "GRI 3-3", title: "Gestion sujets matériels", description: "Gestion des sujets matériels et évaluation des approches", pillar: "Transverse", obligation: "Obligatoire", materiality: "impact", proofExamples: ["Plans d'action", "Indicateurs suivi"] },
  // GRI 200 - Economic
  { id: "gri-201", code: "GRI 201", title: "Performance économique", description: "Valeur économique directement générée et distribuée", pillar: "Transverse", obligation: "Obligatoire", materiality: "impact", proofExamples: ["Comptes annuels", "Répartition valeur ajoutée"] },
  { id: "gri-203", code: "GRI 203", title: "Impacts économiques indirects", description: "Impacts économiques indirects significatifs", pillar: "Transverse", obligation: "Obligatoire", materiality: "impact", proofExamples: ["Étude d'impact", "Emploi indirect"] },
  { id: "gri-204", code: "GRI 204", title: "Approvisionnement local", description: "Proportion des dépenses auprès de fournisseurs locaux", pillar: "Transverse", obligation: "Obligatoire", materiality: "impact", proofExamples: ["Cartographie fournisseurs", "Budget local"] },
  { id: "gri-205", code: "GRI 205", title: "Anti-corruption", description: "Opérations évaluées pour les risques liés à la corruption", pillar: "G", obligation: "Obligatoire", materiality: "impact", proofExamples: ["Cartographie risques", "Audits anticorruption"] },
];

// ISSB Standards (IFRS S1 & S2)
const issbRequirements: Requirement[] = [
  { id: "ifrs-s1-1", code: "IFRS S1.1", title: "Sustainability risks/opportunities", description: "Disclosure of sustainability-related risks and opportunities that could affect enterprise value", pillar: "Transverse", obligation: "Obligatoire", materiality: "financial", proofExamples: ["Risk register", "Materiality assessment", "Climate scenarios"] },
  { id: "ifrs-s1-2", code: "IFRS S1.2", title: "Governance disclosure", description: "Governance processes, controls and procedures for sustainability risks/opportunities", pillar: "G", obligation: "Obligatoire", materiality: "financial", proofExamples: ["Board oversight process", "ESG committee charter", "Risk governance framework"] },
  { id: "ifrs-s1-3", code: "IFRS S1.3", title: "Strategy disclosure", description: "Strategy for addressing sustainability-related risks/opportunities", pillar: "Transverse", obligation: "Obligatoire", materiality: "financial", proofExamples: ["Strategic plan ESG", "Business model resilience", "Transition plan"] },
  { id: "ifrs-s1-4", code: "IFRS S1.4", title: "Risk management", description: "Risk management processes for sustainability-related risks", pillar: "G", obligation: "Obligatoire", materiality: "financial", proofExamples: ["ERM integration", "Risk assessment process", "Controls documentation"] },
  { id: "ifrs-s1-5", code: "IFRS S1.5", title: "Metrics and targets", description: "Metrics and targets used to manage sustainability risks/opportunities", pillar: "Transverse", obligation: "Obligatoire", materiality: "financial", proofExamples: ["KPI dashboard", "Target setting process", "Performance metrics"] },
  { id: "ifrs-s2-1", code: "IFRS S2.1", title: "Climate-related risks/opportunities", description: "Climate-related risks and opportunities that could affect enterprise value", pillar: "E", obligation: "Obligatoire", materiality: "financial", proofExamples: ["Climate risk assessment", "Scenario analysis", "Transition risks"] },
  { id: "ifrs-s2-2", code: "IFRS S2.2", title: "Climate governance", description: "Governance of climate-related risks and opportunities", pillar: "G", obligation: "Obligatoire", materiality: "financial", proofExamples: ["Board climate oversight", "Management responsibilities"] },
  { id: "ifrs-s2-3", code: "IFRS S2.3", title: "Climate strategy", description: "Strategy resilience to climate-related risks", pillar: "E", obligation: "Obligatoire", materiality: "financial", proofExamples: ["Scenario analysis", "Strategy review process"] },
  { id: "ifrs-s2-4", code: "IFRS S2.4", title: "Climate risk management", description: "Climate risk identification, assessment and management", pillar: "E", obligation: "Obligatoire", materiality: "financial", proofExamples: ["Risk management process", "Climate risk register"] },
  { id: "ifrs-s2-5", code: "IFRS S2.5", title: "GHG emissions (Scope 1,2,3)", description: "Disclosure of absolute Scope 1, 2 and 3 GHG emissions", pillar: "E", obligation: "Obligatoire", materiality: "financial", proofExamples: ["GHG inventory", "Emissions data", "Verification statement"] },
  { id: "ifrs-s2-6", code: "IFRS S2.6", title: "Climate targets", description: "Climate-related targets and transition plan", pillar: "E", obligation: "Obligatoire", materiality: "financial", proofExamples: ["Science-based targets", "Transition plan", "Net zero commitment"] },
  { id: "ifrs-s2-7", code: "IFRS S2.7", title: "Industry-based metrics", description: "Industry-based metrics beyond GHG emissions", pillar: "E", obligation: "Recommandé", materiality: "financial", proofExamples: ["SASB metrics", "Industry KPIs", "Sector benchmarks"] },
];

// TCFD (consolidated into ISSB but kept separate for reference)
const tcfdRequirements: Requirement[] = [
  { id: "tcfd-gov-1", code: "TCFD GOV-1", title: "Oversight climate risks", description: "Board oversight of climate-related risks and opportunities", pillar: "G", obligation: "Obligatoire", materiality: "financial", proofExamples: ["Board climate training", "Climate agenda items", "Minutes review"] },
  { id: "tcfd-gov-2", code: "TCFD GOV-2", title: "Management role", description: "Management's role in assessing and managing climate-related risks", pillar: "G", obligation: "Obligatoire", materiality: "financial", proofExamples: ["Management responsibilities", "Climate committee", "Risk owners"] },
  { id: "tcfd-strat-1", code: "TCFD STRAT-1", title: "Climate risks/opportunities", description: "Climate-related risks and opportunities identified over short/medium/long term", pillar: "E", obligation: "Obligatoire", materiality: "financial", proofExamples: ["Risk register", "Opportunity register", "Time horizons"] },
  { id: "tcfd-strat-2", code: "TCFD STRAT-2", title: "Impact on business", description: "Impact of climate-related risks and opportunities on business strategy", pillar: "E", obligation: "Obligatoire", materiality: "financial", proofExamples: ["Strategy assessment", "Business model review"] },
  { id: "tcfd-strat-3", code: "TCFD STRAT-3", title: "Resilience assessment", description: "Resilience of organization's strategy under different climate scenarios", pillar: "E", obligation: "Obligatoire", materiality: "financial", proofExamples: ["Scenario analysis", "Stress testing", "Strategic resilience"] },
  { id: "tcfd-risk-1", code: "TCFD RISK-1", title: "Risk identification", description: "Processes for identifying and assessing climate-related risks", pillar: "E", obligation: "Obligatoire", materiality: "financial", proofExamples: ["Risk identification process", "Climate risk register"] },
  { id: "tcfd-risk-2", code: "TCFD RISK-2", title: "Risk management", description: "Processes for managing climate-related risks", pillar: "E", obligation: "Obligatoire", materiality: "financial", proofExamples: ["Risk management procedures", "Mitigation plans"] },
  { id: "tcfd-risk-3", code: "TCFD RISK-3", title: "Integration risk management", description: "Integration of climate risks into overall risk management", pillar: "E", obligation: "Obligatoire", materiality: "financial", proofExamples: ["ERM integration", "Risk framework update"] },
  { id: "tcfd-metr-1", code: "TCFD METR-1", title: "Climate metrics", description: "Metrics used to assess climate-related risks and opportunities", pillar: "E", obligation: "Obligatoire", materiality: "financial", proofExamples: ["Climate KPIs", "Carbon intensity", "Physical risk metrics"] },
  { id: "tcfd-metr-2", code: "TCFD METR-2", title: "GHG emissions", description: "Scope 1, 2 and if appropriate Scope 3 GHG emissions", pillar: "E", obligation: "Obligatoire", materiality: "financial", proofExamples: ["GHG inventory", "Third-party verification"] },
  { id: "tcfd-metr-3", code: "TCFD METR-3", title: "Climate targets", description: "Climate-related targets and performance against targets", pillar: "E", obligation: "Obligatoire", materiality: "financial", proofExamples: ["SBTi targets", "Progress tracking", "Milestones"] },
];

// SASB Standards (now part of ISSB, sector-specific)
const sasbRequirements: Requirement[] = [
  { id: "sasb-gen-1", code: "SASB GENERAL", title: "SASB industry standards", description: "Application of SASB industry-specific standards for sector disclosure", pillar: "Transverse", obligation: "Recommandé", materiality: "financial", proofExamples: ["SASB standards mapping", "Industry classification", "Materiality finder"] },
  { id: "sasb-em-1", code: "SASB EM-EP", title: "Energy metrics (Energy sector)", description: "Greenhouse gas emissions, air quality, energy management, water management", pillar: "E", obligation: "Recommandé", materiality: "financial", proofExamples: ["Emissions intensity", "Energy mix data"] },
  { id: "sasb-em-2", code: "SASB EM-EP", title: "Reserves valuation", description: "Proved reserves valuation under climate scenarios", pillar: "E", obligation: "Recommandé", materiality: "financial", proofExamples: ["Reserve valuation models", "Carbon price assumptions"] },
  { id: "sasb-tr-1", code: "SASB TR", title: "Transport emissions", description: "Fleet fuel management, emissions from transportation", pillar: "E", obligation: "Recommandé", materiality: "financial", proofExamples: ["Fleet data", "Fuel efficiency metrics"] },
  { id: "sasb-cg-1", code: "SASB CG", title: "Consumer goods sourcing", description: "Supply chain environmental and social impacts", pillar: "S", obligation: "Recommandé", materiality: "financial", proofExamples: ["Supplier audits", "Sourcing disclosure"] },
  { id: "sasb-cg-2", code: "SASB CG", title: "Product safety", description: "Product health and safety, marketing and labeling", pillar: "S", obligation: "Recommandé", materiality: "financial", proofExamples: ["Safety testing", "Recall procedures"] },
  { id: "sasb-tc-1", code: "SASB TC", title: "Technology energy use", description: "Energy consumption in data centers and products", pillar: "E", obligation: "Recommandé", materiality: "financial", proofExamples: ["PUE metrics", "Product energy labels"] },
  { id: "sasb-tc-2", code: "SASB TC", title: "Data security", description: "Data security, privacy and customer welfare", pillar: "G", obligation: "Recommandé", materiality: "financial", proofExamples: ["Security policies", "Privacy compliance", "Breach disclosures"] },
  { id: "sasb-fb-1", code: "SASB FB", title: "Food safety", description: "Food safety, environmental and social impacts of ingredient supply chains", pillar: "S", obligation: "Recommandé", materiality: "financial", proofExamples: ["HACCP certification", "Supplier audits"] },
  { id: "sasb-fn-1", code: "SASB FN", title: "Financial integration", description: "Integration of ESG factors in investment and lending", pillar: "G", obligation: "Recommandé", materiality: "financial", proofExamples: ["ESG integration policy", "Portfolio analysis"] },
  { id: "sasb-hc-1", code: "SASB HC", title: "Healthcare access", description: "Access to healthcare, pricing and fair drug marketing", pillar: "S", obligation: "Recommandé", materiality: "financial", proofExamples: ["Pricing policy", "Access programs"] },
  { id: "sasb-if-1", code: "SASB IF", title: "Infrastructure resilience", description: "Climate adaptation and resilience of infrastructure", pillar: "E", obligation: "Recommandé", materiality: "financial", proofExamples: ["Resilience assessment", "Adaptation plans"] },
];

// Combine all ESRS requirements
const allESRSRequirements = [
  ...esrsE1, ...esrsE2, ...esrsE3, ...esrsE4, ...esrsE5,
  ...esrsS1, ...esrsS2, ...esrsG1,
];

export const COMPLIANCE_STANDARDS: Standard[] = [
  {
    id: "esrs",
    shortName: "ESRS",
    fullName: "European Sustainability Reporting Standards (CSRD)",
    description: "Standards européens de reporting durabilité avec double materialité. Mandatory pour grandes entreprises (>1000 salariés) et PME cotées en EU. Post-Omnibus 2024: scope narrowed, sector standards dropped.",
    version: "Post-Omnibus 2024",
    application: "Mandatory pour grandes entreprises et PME cotées EU. Simplified reporting pour smaller companies.",
    materialityType: "double",
    targetAudience: "All stakeholders",
    mandatoryInEU: true,
    requirements: allESRSRequirements,
  },
  {
    id: "gri",
    shortName: "GRI",
    fullName: "Global Reporting Initiative",
    description: "Impact materiality - reports your impact on the world. Standards globaux les plus utilisés pour le reporting ESG volontaire.",
    version: "2021",
    application: "Volontaire, global",
    materialityType: "impact",
    targetAudience: "All stakeholders",
    mandatoryInEU: false,
    requirements: griRequirements,
  },
  {
    id: "issb",
    shortName: "ISSB",
    fullName: "International Sustainability Standards Board (IFRS S1 & S2)",
    description: "Financial materiality - reports how the world impacts your financials. Incorporates TCFD. Consolidated SASB.",
    version: "2023-2024",
    application: "Subject to national jurisdiction adoption. Voluntary unless mandated.",
    materialityType: "financial",
    targetAudience: "Investors",
    mandatoryInEU: false,
    requirements: issbRequirements,
  },
  {
    id: "tcfd",
    shortName: "TCFD",
    fullName: "Task Force on Climate-related Financial Disclosures",
    description: "Recommandations pour disclosure des risques climatiques. Consolidated into ISSB S2. Architecture Governance/Strategy/Risk/Metrics.",
    version: "2017 (consolidated 2023)",
    application: "Volontaire, consolidated into ISSB",
    materialityType: "financial",
    targetAudience: "Investors",
    mandatoryInEU: false,
    requirements: tcfdRequirements,
  },
  {
    id: "sasb",
    shortName: "SASB",
    fullName: "Sustainability Accounting Standards Board",
    description: "Sector-specific metrics that ISSB builds on. Now part of IFRS Sustainability Disclosure Standards.",
    version: "2018 (consolidated 2022)",
    application: "Volontaire, consolidated into ISSB. 77 industries covered.",
    materialityType: "financial",
    targetAudience: "Investors",
    mandatoryInEU: false,
    requirements: sasbRequirements,
  },
];

// Helper functions
export function getStandardById(id: string): Standard | undefined {
  return COMPLIANCE_STANDARDS.find(s => s.id === id);
}

export function getRequirementById(standardId: string, reqId: string): Requirement | undefined {
  const standard = getStandardById(standardId);
  return standard?.requirements.find(r => r.id === reqId);
}

export function getMaterialityLabel(type: MaterialityType): string {
  const labels = {
    impact: "Impact Materiality",
    financial: "Financial Materiality",
    double: "Double Materiality",
  };
  return labels[type];
}

export function getStatusColor(status: ComplianceStatus): string {
  const colors = {
    conforme: "bg-emerald-100 text-emerald-700 border-emerald-200",
    non_conforme: "bg-red-100 text-red-700 border-red-200",
    partiel: "bg-amber-100 text-amber-700 border-amber-200",
    na: "bg-slate-100 text-slate-600 border-slate-200",
    null: "bg-gray-100 text-gray-400 border-gray-200",
  };
  return colors[status ?? "null"];
}

export function getStatusIcon(status: ComplianceStatus): string {
  const icons = {
    conforme: "✓",
    non_conforme: "✗",
    partiel: "~",
    na: "—",
    null: "?",
  };
  return icons[status ?? "null"];
}
