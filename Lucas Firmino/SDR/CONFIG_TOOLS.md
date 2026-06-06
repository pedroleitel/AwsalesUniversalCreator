# CONFIGURAÇÃO DE TOOLS — SDR D'Leon (Lentes de Porcelana)

Instruções para os campos das tools na plataforma AWSales. Colar no campo "Instruções para a LLM" de cada parâmetro.

---

## @consultar_horarios_disponiveis

### date
Se o lead disse dia da semana (ex: "quinta"), calcule a próxima ocorrência a partir da data atual. Se não especificou, use hoje. Expediente: segunda a sexta 08:00-19:40, sábado 08:00-11:40, domingo não atende. Descarte da resposta qualquer horário fora desses limites antes de apresentar ao lead.

### serviceId
Valor fixo: 1

---

## @criar_agendamento

### date
Usar exatamente a data verificada como disponível na consulta anterior.

### hour
Usar exatamente o horário que o lead escolheu entre as opções.

### name
Nome completo coletado na etapa 4.2. Não inventar sobrenome.

### cellPhone
Número confirmado na etapa 4.2. Se o lead confirmou o número da conversa, usar esse.

### serviceId
Valor fixo: 1

### observation
Resumir em 1-2 frases: incômodo estético principal, objetivo e observações relevantes (ex: pediu presença do Dr. Lucas, gestante, receio específico).

---

## @registrar_lead_rp_uno

### name
Usar o nome que o lead informou na conversa. Priorizar nome completo. Se o lead só informou o primeiro nome, usar apenas o primeiro nome. Não inventar sobrenome.

### cellPhone
Usar o número do WhatsApp do próprio atendimento, com DDD. Se houver confirmação explícita do lead, usar o número confirmado.

### tagId
Valor fixo: 1

### observation
Resumir em 1-2 frases: origem pelo atendimento da IA/Awsales, procedimento de interesse, principal dor estética, reação inicial e qualquer observação útil para o time comercial.

### adCampaignName
Se a integração tiver acesso ao `utm_campaign`, repassar esse valor. Se não houver esse dado disponível no momento da chamada, deixar vazio ou seguir o valor fixo homologado no painel.

### adSetName
Se a integração tiver acesso ao `utm_medium`, repassar esse valor. Se não houver esse dado disponível no momento da chamada, deixar vazio ou seguir o valor fixo homologado no painel.

### adName
Se a integração tiver acesso ao `utm_source`, repassar esse valor. Se não houver esse dado disponível no momento da chamada, deixar vazio ou seguir o valor fixo homologado no painel.

### campaignSlug
Usar o valor fixo homologado para esta integração. Os prints recebidos mostram conflito entre `typebot` e `kinbox`, então validar no painel antes de publicar.

### rating
Usar o valor homologado para esta integração. Os prints recebidos mostram conflito entre valor fixo `5` e preenchimento dinâmico, então validar no painel antes de publicar.

### originId
Valor fixo: 2
