// =====================================================================
// NORMALIZADOR — Bot AWSales (Lucas Firmino) -> Webhook AWSales (output)
// =====================================================================
// Recebe o payload original do Webhook (vindo da tool personalizada da
// plataforma AWSales) e monta o objeto no formato esperado pelo endpoint
// /api/webhooks/organizations/.../credentials/output-personalizado.
//
// Lê SEMPRE do nó Webhook1 via $('Webhook1') — funciona independente da
// posição do Code in JavaScript no flow (antes ou depois do Tool http).
//
// Apenas NOME e TELEFONE vêm do payload. Email é gerado como placeholder
// porque o bot não coleta email mas a AWSales exige um email válido.
// =====================================================================

const webhook = $('Webhook1').first().json;
const body = webhook.body || {};

// --- Normaliza o telefone para o formato internacional +55XXXXXXXXXXX ---
function formatPhone(raw) {
  if (!raw) return "";
  const digits = String(raw).replace(/\D/g, "");
  if (digits.startsWith("55") && digits.length >= 12) return "+" + digits;
  if (digits.length >= 10) return "+55" + digits;
  return "+" + digits;
}

// --- Resolve email: usa o real se vier no payload; senão gera placeholder ---
// AWSales exige email válido obrigatório. Quando o bot/tool passar a coletar
// email, basta enviá-lo no body que ele passa a ser usado automaticamente.
function resolveEmail(rawEmail, rawPhone) {
  const email = String(rawEmail || "").trim();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (isValid) return email;
  const digits = String(rawPhone || "").replace(/\D/g, "");
  return digits ? `lead-${digits}@placeholder.awsales.io` : "no-email@placeholder.awsales.io";
}

// --- Timestamp UTC no formato ISO 8601 sem milissegundos ---
const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

// --- Payload final no formato AWSales output-personalizado ---
const output = {
  event: "custom_action",
  timestamp: timestamp,
  source: {
    id: "agendamento-realizado-dleon",
    name: "Agendamento Realizado"
  },
  lead: {
    phone: formatPhone(body.cellPhone),
    email: resolveEmail(body.email, body.cellPhone),
    name: body.name || ""
  },
  utm: {
    source: "awsales",
    campaign: "lucas-firmino-sdr",
    medium: "whatsapp",
    content: "",
    term: ""
  },
  metadata: {
    action_details: "Lead solicitou agendamento via bot WhatsApp",
    engagement_level: "high",
    intent_level: "ready",
    emotional_tone: "interessado",
    context_notes: ""
  }
};

return [{ json: output }];
