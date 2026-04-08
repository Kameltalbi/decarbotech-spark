// Service OpenAI pour génération de plans de conformité
// L'API key doit être définie dans les variables d'environnement: VITE_OPENAI_API_KEY

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export interface ComplianceAction {
  id: string;
  priorite: "Haute" | "Moyenne" | "Basse";
  recommandation: string;
  standard_ref: string;
  benefice_metier: string;
  template_requis: string;
  delai_mois: number;
  cout_estime: string;
  categorie: "E" | "S" | "G";
}

export interface CompliancePlan {
  titre: string;
  description: string;
  score_global: number;
  score_e: number;
  score_s: number;
  score_g: number;
  actions: ComplianceAction[];
  priorites_haute: number;
  priorites_moyenne: number;
  priorites_basse: number;
}

interface ESGData {
  organization: {
    name: string;
    sector: string;
    size: string;
  };
  pillarScores: {
    E: number | null;
    S: number | null;
    G: number | null;
  };
  categories: Array<{
    pillar: string;
    category: string;
    score: number | null;
    data: Record<string, any>;
  }>;
}

export async function generateCompliancePlan(
  esgData: ESGData,
  standard: "CSRD" | "GRI" | "SBTi" = "CSRD",
  apiKey: string
): Promise<CompliancePlan> {
  const prompt = buildPrompt(esgData, standard);

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Tu es un expert international en audit ESG et conseiller en stratégie de durabilité. Tu génères des plans de conformité structurés en JSON uniquement."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500,
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Erreur OpenAI API");
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  if (!content) {
    throw new Error("Réponse vide de l'API");
  }

  return JSON.parse(content) as CompliancePlan;
}

function buildPrompt(esgData: ESGData, standard: string): string {
  const { organization, pillarScores, categories } = esgData;
  
  // Identifier les gaps (scores < 50)
  const gaps = categories
    .filter(c => c.score !== null && c.score < 50)
    .map(c => ({
      pillar: c.pillar,
      category: c.category,
      score: c.score,
      data: c.data
    }));

  // Identifier les points forts (scores >= 70)
  const strengths = categories
    .filter(c => c.score !== null && c.score >= 70)
    .map(c => c.category);

  return `Génère un Plan de Conformité Stratégique ESG au format JSON strict.

## DONNÉES DE L'ENTREPRISE
- Nom: ${organization.name}
- Secteur: ${organization.sector}
- Taille: ${organization.size}

## SCORES ESG ACTUELS
- Environnement (E): ${pillarScores.E ?? "Non évalué"}/100
- Social (S): ${pillarScores.S ?? "Non évalué"}/100
- Gouvernance (G): ${pillarScores.G ?? "Non évalué"}/100
- Global: ${Math.round(((pillarScores.E || 0) + (pillarScores.S || 0) + (pillarScores.G || 0)) / 3)}/100

## GAPS IDENTIFIÉS (Prioritaires)
${gaps.map(g => `- [${g.pillar}] ${g.category}: ${g.score}/100`).join("\n") || "Aucun gap majeur identifié"}

## POINTS FORTS
${strengths.join(", ") || "À développer"}

## STANDARD VISÉ
${standard}

## INSTRUCTIONS DE RÉPONSE
Retourne UNIQUEMENT un objet JSON valide avec cette structure exacte:

{
  "titre": "Plan de conformité [Standard] - [Nom entreprise]",
  "description": "Résumé en 2 phrases du plan stratégique",
  "score_global": [0-100],
  "score_e": [0-100],
  "score_s": [0-100],
  "score_g": [0-100],
  "priorites_haute": [nombre],
  "priorites_moyenne": [nombre],
  "priorites_basse": [nombre],
  "actions": [
    {
      "id": "unique-string",
      "priorite": "Haute|Moyenne|Basse",
      "recommandation": "Action concrète et chiffrée, adaptée au contexte tunisien",
      "standard_ref": "Article précis (ex: ESRS E1-6, GRI 305-1)",
      "benefice_metier": "ROI explicite en DT ou avantage compétitif",
      "template_requis": "Type de document à créer (ex: Charte Achats Responsables)",
      "delai_mois": [1-12],
      "cout_estime": "Estimation en TND ou 'Interne'",
      "categorie": "E|S|G"
    }
  ]
}

## CONTRAINTES
- 6 à 10 actions maximum
- Délais réalistes (1-12 mois)
- Coûts en Dinar Tunisien (TND) quand applicable
- Actions réalistes techniquement pour une PME tunisienne
- Ton professionnel, direct, orienté action
- Chaque action doit avoir un ID unique (uuid-like court)

Ne retourne aucun texte hors du JSON.`;
}
