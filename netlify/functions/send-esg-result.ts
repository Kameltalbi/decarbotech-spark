import type { Handler } from "@netlify/functions";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM ?? "noreply@decarbotech.com";
const TO_KEY_CONSULTING = process.env.RESEND_TO_KEY_CONSULTING ?? "contact@keyconsulting.tn";

interface EsgPayload {
  name: string;
  email: string;
  company?: string;
  scores: { e: number; s: number; g: number; global: number };
  maturity: string;
  gaps: { pillar: string; label: string; reco: string }[];
}

const maturityColor = (m: string) => {
  if (m === "Leader ESG") return "#16a34a";
  if (m === "En progression") return "#2563eb";
  if (m === "En construction") return "#f59e0b";
  return "#ef4444";
};

const pillarColor: Record<string, string> = {
  E: "#16a34a",
  S: "#2563eb",
  G: "#7c3aed",
};

function buildKeyConsultingEmail(p: EsgPayload): string {
  const gapsHtml = p.gaps.length
    ? p.gaps.map((g) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">
            <span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:${pillarColor[g.pillar]};color:#fff;font-size:11px;font-weight:700;text-align:center;line-height:20px;">${g.pillar}</span>
            &nbsp;<strong>${g.label}</strong>
          </td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;color:#555;font-size:13px;">${g.reco}</td>
        </tr>`).join("")
    : `<tr><td colspan="2" style="padding:12px;color:#16a34a;font-weight:600;">Aucune lacune majeure identifiée — démarche avancée ✓</td></tr>`;

  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f8f7f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#2d6a4f;padding:28px 36px;">
            <p style="margin:0;color:#fff;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">DecarboTech × Key Consulting</p>
            <h1 style="margin:6px 0 0;color:#fff;font-size:22px;font-weight:700;">Nouveau diagnostic ESG reçu</h1>
          </td>
        </tr>

        <!-- Lead info -->
        <tr>
          <td style="padding:28px 36px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;border-radius:8px;overflow:hidden;">
              <tr>
                <td style="padding:14px 18px;border-bottom:1px solid #ece9e3;">
                  <span style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;">Nom</span><br />
                  <strong style="font-size:15px;color:#1a1a1a;">${p.name}</strong>
                </td>
                <td style="padding:14px 18px;border-bottom:1px solid #ece9e3;">
                  <span style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;">Email</span><br />
                  <a href="mailto:${p.email}" style="font-size:15px;color:#2d6a4f;font-weight:600;">${p.email}</a>
                </td>
              </tr>
              ${p.company ? `<tr><td colspan="2" style="padding:14px 18px;">
                <span style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;">Société</span><br />
                <strong style="font-size:15px;color:#1a1a1a;">${p.company}</strong>
              </td></tr>` : ""}
            </table>
          </td>
        </tr>

        <!-- Scores -->
        <tr>
          <td style="padding:24px 36px 0;">
            <h2 style="margin:0 0 16px;font-size:16px;color:#1a1a1a;">Résultats du diagnostic ESG</h2>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                ${(["E","S","G"] as const).map((pillar) => {
                  const val = pillar === "E" ? p.scores.e : pillar === "S" ? p.scores.s : p.scores.g;
                  const labels: Record<string, string> = { E: "Environnemental", S: "Social", G: "Gouvernance" };
                  return `<td align="center" style="padding:0 8px;">
                    <div style="background:#f8f7f4;border-radius:10px;padding:16px 12px;border:2px solid ${pillarColor[pillar]}22;">
                      <div style="font-size:28px;font-weight:800;color:${pillarColor[pillar]};">${val}</div>
                      <div style="font-size:11px;color:#888;">/100</div>
                      <div style="font-size:12px;font-weight:700;color:#333;margin-top:4px;">${pillar} — ${labels[pillar]}</div>
                    </div>
                  </td>`;
                }).join("")}
                <td align="center" style="padding:0 8px;">
                  <div style="background:#2d6a4f;border-radius:10px;padding:16px 12px;">
                    <div style="font-size:28px;font-weight:800;color:#fff;">${p.scores.global}</div>
                    <div style="font-size:11px;color:#a7d3be;">/100</div>
                    <div style="font-size:12px;font-weight:700;color:#fff;margin-top:4px;">Score global</div>
                  </div>
                </td>
              </tr>
            </table>
            <p style="margin:12px 0 0;font-size:13px;text-align:center;">
              Niveau de maturité : <span style="font-weight:700;color:${maturityColor(p.maturity)};">${p.maturity}</span>
            </p>
          </td>
        </tr>

        <!-- Gaps -->
        <tr>
          <td style="padding:24px 36px 0;">
            <h2 style="margin:0 0 12px;font-size:16px;color:#1a1a1a;">Priorités d'amélioration identifiées</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ece9e3;border-radius:8px;overflow:hidden;">
              ${gapsHtml}
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:28px 36px 36px;">
            <a href="mailto:${p.email}" style="display:inline-block;background:#2d6a4f;color:#fff;font-size:14px;font-weight:700;padding:14px 28px;border-radius:8px;text-decoration:none;">
              Répondre à ${p.name}
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8f7f4;padding:20px 36px;border-top:1px solid #ece9e3;">
            <p style="margin:0;font-size:12px;color:#aaa;">Ce lead a été généré via le diagnostic ESG gratuit sur <strong>decarbotech.com</strong>.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildUserConfirmationEmail(p: EsgPayload): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#f8f7f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;padding:40px 0;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#2d6a4f;padding:28px 36px;">
            <p style="margin:0;color:#a7d3be;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">DecarboTech</p>
            <h1 style="margin:6px 0 0;color:#fff;font-size:20px;font-weight:700;">Votre diagnostic ESG — Score ${p.scores.global}/100</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 36px;">
            <p style="margin:0 0 16px;font-size:15px;color:#333;">Bonjour <strong>${p.name}</strong>,</p>
            <p style="margin:0 0 20px;font-size:14px;color:#555;line-height:1.6;">
              Merci d'avoir complété votre diagnostic ESG gratuit. Voici un résumé de vos scores :
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
              <tr>
                ${[
                  { l: "E", v: p.scores.e, name: "Environnemental" },
                  { l: "S", v: p.scores.s, name: "Social" },
                  { l: "G", v: p.scores.g, name: "Gouvernance" },
                ].map(({ l, v, name }) => `
                <td align="center" style="padding:0 6px;">
                  <div style="background:#f8f7f4;border-radius:8px;padding:14px 10px;border-left:3px solid ${pillarColor[l]};">
                    <div style="font-size:24px;font-weight:800;color:${pillarColor[l]};">${v}</div>
                    <div style="font-size:11px;color:#888;">${l} — ${name}</div>
                  </div>
                </td>`).join("")}
              </tr>
            </table>
            <p style="margin:0 0 8px;font-size:14px;color:#333;">
              Niveau : <strong style="color:${maturityColor(p.maturity)};">${p.maturity}</strong>
            </p>
            ${p.gaps.length ? `<p style="margin:0 0 20px;font-size:14px;color:#555;">Nos experts Key Consulting vont vous contacter pour travailler sur vos axes d'amélioration prioritaires.</p>` : `<p style="margin:0 0 20px;font-size:14px;color:#555;">Votre démarche ESG est avancée — Key Consulting peut vous aider à la certifier et la valoriser.</p>`}
            <a href="https://decarbotech.com/rse" style="display:inline-block;background:#2d6a4f;color:#fff;font-size:13px;font-weight:700;padding:12px 24px;border-radius:8px;text-decoration:none;">
              Voir ma page ESG Scan
            </a>
          </td>
        </tr>
        <tr>
          <td style="background:#f8f7f4;padding:18px 36px;border-top:1px solid #ece9e3;">
            <p style="margin:0;font-size:11px;color:#aaa;">DecarboTech · Plateforme climat & environnement pour les PME · decarbotech.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let payload: EsgPayload;
  try {
    payload = JSON.parse(event.body ?? "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const { name, email, scores, maturity, gaps } = payload;
  if (!name || !email || !scores) {
    return { statusCode: 400, body: JSON.stringify({ error: "Champs requis manquants" }) };
  }

  try {
    await Promise.all([
      resend.emails.send({
        from: FROM,
        to: [TO_KEY_CONSULTING],
        subject: `🎯 Nouveau lead ESG — ${name}${payload.company ? ` (${payload.company})` : ""} — Score ${scores.global}/100`,
        html: buildKeyConsultingEmail(payload),
      }),
      resend.emails.send({
        from: FROM,
        to: [email],
        subject: `Votre diagnostic ESG DecarboTech — Score ${scores.global}/100 · ${maturity}`,
        html: buildUserConfirmationEmail(payload),
      }),
    ]);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error("Resend error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Échec de l'envoi de l'email" }),
    };
  }
};
