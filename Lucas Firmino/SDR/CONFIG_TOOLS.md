# CONFIGURAÃ‡ÃƒO DE TOOLS â€” SDR D'Leon (Lentes de Porcelana)

InstruÃ§Ãµes para os campos das tools na plataforma AWSales. Colar no campo "InstruÃ§Ãµes para a LLM" de cada parÃ¢metro.

---

## @consultar_horarios_disponiveis

### date
Se o lead disse dia da semana (ex: "quinta"), calcule a prÃ³xima ocorrÃªncia a partir da data atual. Se nÃ£o especificou, use hoje.

### serviceId
Valor fixo: 1

---

## @criar_agendamento

### date
Usar exatamente a data verificada como disponÃ­vel na consulta anterior.

### hour
Usar exatamente o horÃ¡rio que o lead escolheu entre as opÃ§Ãµes.

### name
Nome completo coletado na etapa 4.2. NÃ£o inventar sobrenome.

### cellPhone
NÃºmero confirmado na etapa 4.2. Se o lead confirmou o nÃºmero da conversa, usar esse.

### serviceId
Valor fixo: 1

### observation
Resumir em 1-2 frases: incÃ´modo estÃ©tico principal, objetivo e observaÃ§Ãµes relevantes (ex: pediu presenÃ§a do Dr. Lucas, gestante, receio especÃ­fico).
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


