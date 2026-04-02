// =============================================================
// Normalizador: UNO Data Lake (Appointment) → Awsales
// Cliente: Clínica D'Leon BH
// =============================================================
//
// CREDENCIAIS UNO (usar nos headers do nó HTTP Request que chama a UNO)
//   x-uno-access-token: BA779B6447B12E3F0150
//   x-uno-secret-key:   d59217553f292c649dc74cbbbd14098eab16b26247b3e87e6c
//
// ENDPOINTS UNO
//   Consultar horários livres:
//     GET https://api.unobject.com.br/v1/scheduler/hours
//     Params: date (DD/MM/YYYY), serviceId
//
//   Criar OU reagendar agendamento (mesmo endpoint para os dois casos):
//     POST https://api.unobject.com.br/v1/scheduler/create
//     Body: { date, hour, name, cellPhone, serviceId }
// =============================================================

// Mapa de serviceId UNO → produto / título da sessão
const SERVICE_MAP = {
  1:   { product: "Lentes de Porcelana",        title: "Avaliação Inicial Lentes"                   },
  136: { product: "Protocolo de Implantes",      title: "Avaliação Inicial de Protocolo"             },
  137: { product: "Harmonização Facial (HOF)",   title: "Avaliação Inicial de Harmonização Facial"   },
};

// status_id UNO → event + meeting.status Awsales
function mapStatus(statusId, rescheduled) {
  if (rescheduled > 0) return { event: "meeting_rescheduled", status: "scheduled" };
  switch (statusId) {
    case 1: return { event: "meeting_scheduled", status: "scheduled" }; // Agendado
    case 2: return { event: "meeting_scheduled", status: "scheduled" }; // Confirmado
    case 5: return { event: "meeting_scheduled", status: "completed" }; // Realizado
    case 6: return { event: "meeting_cancelled", status: "cancelled" }; // Falta
    case 7: return { event: "meeting_cancelled", status: "cancelled" }; // Bloqueio
    default: return { event: "meeting_scheduled", status: "scheduled" };
  }
}

// Garante ISO 8601 UTC — "2026-01-18T21:00:00.000Z"
function toISO(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toISOString();
}

// Formata telefone para E.164 (+5511999999999)
function formatPhone(raw) {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("55") && digits.length >= 12) return "+" + digits;
  if (digits.length >= 10) return "+55" + digits;
  return raw;
}

function normalizePayload(input) {
  const customer = input.customer ?? {};

  const { event, status } = mapStatus(
    input.status_id ?? 1,
    input.rescheduled ?? 0
  );

  // Resolve produto/título pelo serviceId; fallback para o que vier no payload
  const serviceInfo = SERVICE_MAP[input.service_id] ?? {
    product: input.service_name ?? "",
    title:   input.service_name ?? "",
  };

  return {
    event:     event,
    timestamp: toISO(input.updated_at ?? input.created_at) || new Date().toISOString(),

    source: {
      // serviceId como ID de origem + nome do produto como nome da campanha/funil
      id:   String(input.service_id ?? input.franchisor_id ?? ""),
      name: serviceInfo.product,
    },

    lead: {
      phone: formatPhone(
        customer.cellphone ?? input.customer_cellphone ??
        customer.phone     ?? input.customer_phone     ?? ""
      ),
      email: customer.email ?? input.customer_email ?? "",
      name:  customer.name  ?? input.customer_name  ?? "",
    },

    meeting: {
      title:      serviceInfo.title,
      start_time: toISO(input.start_date),
      end_time:   toISO(input.end_date),
      timezone:   input.timezone ?? input.company_timezone ?? "America/Sao_Paulo",
      status:     status,
      host: {
        name:  input.employee_name  ?? "",
        email: input.employee_email ?? "", // não disponível no modelo UNO
      },
      location: {
        type: "online",
        url:  input.meeting_url ?? input.location_url ?? "",
      },
    },

    metadata: {
      action_details:   String(input.appointment_id ?? ""),
      engagement_level: "",
      intent_level:     "",
      emotional_tone:   "",
      context_notes: [
        serviceInfo.product                        ? `Produto: ${serviceInfo.product}`             : "",
        input.service_session != null              ? `Sessão: ${input.service_session}`            : "",
        input.rating          != null              ? `Avaliação: ${input.rating}`                  : "",
        (input.rescheduled ?? 0) > 0               ? `Reagendamentos: ${input.rescheduled}`        : "",
      ].filter(Boolean).join(" | "),
    },

    utm: {
      // UNO não fornece dados UTM — preencher em outro nó se disponível
      source:   "",
      medium:   "",
      campaign: "",
      term:     "",
      content:  "",
    },
  };
}

// Entry point — "payload" é a variável injetada pelo nó Webhook da Awsales
const normalized = normalizePayload(payload);
return normalized;
