# CONFIGURAÇÃO DA TOOL — RP / UNO

Objetivo: registrar no CRM da UNO os leads que entrarem pelo atendimento da IA na Awsales.

Este arquivo consolida o que já está confirmado pela guia da Awsales, pelos prints do cliente e pelo material da campanha atual.

---

## 1. Diagnóstico Rápido

- A campanha atual já usa a UNO para consultar horários e criar agendamentos.
- O endpoint de lead não está documentado no arquivo `API plataforma UNO.txt`; esse arquivo descreve modelos de dados do UNO, não o endpoint de criação de lead.
- O endpoint de criação de lead veio dos prints enviados pelo cliente.
- Portanto, a configuração abaixo é viável, mas alguns campos fixos precisam ser homologados no painel antes de publicar.

---

## 2. Conexão na Awsales

Caminho: Habilidades Personalizadas -> Nova Conexão

- Nome da conexão: Plataforma Uno - RP
- Tipo de autenticação: Header Personalizado
- Header principal: `x-uno-access-token`
- Valor do header principal: `2D3453FD350EAF7478E6`

Observação importante:

- Como a Awsales aceita apenas 1 header na conexão, o segundo header deve ser adicionado dentro da própria tool.

---

## 3. Tool HTTP

### Nome sugerido

Registrar Lead no RP

### Handle sugerido

`@registrar_lead_rp_uno`

### Descrição para a IA

Use esta tool para registrar no CRM da UNO um lead que entrou pelo atendimento da IA.
Chame esta tool quando o lead já tiver nome identificável e número de telefone disponível no WhatsApp.
Informe nome, telefone e um resumo curto do contexto do lead para o time comercial.
Não chame esta tool duas vezes para o mesmo lead no mesmo atendimento.

### Método

`POST`

### URL

`https://api.unobject.com.br/v1/lead`

### Header customizado da tool

- Nome: `x-uno-secret-key`
- Valor: `3d9bc7418e4ec1ed74bae82c03c945ee780d4f798df21108ba`

---

## 4. Body da Requisição

Campos confirmados pelos prints:

| Campo | Tipo | Fonte | Req | Instrução |
|---|---|---|---|---|
| name | String | IA | Sim | Nome do lead. Priorizar nome completo; se só houver primeiro nome, usar o primeiro nome. |
| cellPhone | String | IA | Sim | Número do lead com DDD, preferencialmente o mesmo número do WhatsApp da conversa. |
| tagId | String | Fixo | Sim | Usar `1`. |
| observation | String | IA | Sim | Resumo curto do contexto do lead: origem pela IA, procedimento de interesse, dor principal e observações relevantes. |
| adCampaignName | String | IA | Não | Se houver `utm_campaign`, repassar. Se não houver, deixar vazio ou usar valor homologado. |
| adSetName | String | IA | Não | Se houver `utm_medium`, repassar. Se não houver, deixar vazio ou usar valor homologado. |
| adName | String | IA | Não | Se houver `utm_source`, repassar. Se não houver, deixar vazio ou usar valor homologado. |
| campaignSlug | String | Fixo | Sim | Confirmar no painel antes de publicar. Os prints mostram `kinbox` em um caso e `typebot` em outro. |
| rating | String | Fixo ou IA | Não | Confirmar no painel antes de publicar. Os prints mostram conflito entre valor fixo `5` e preenchimento variável. |
| originId | String | Fixo | Sim | Usar `2`. |

---

## 5. JSON Base Sugerido

```json
{
  "url": "https://api.unobject.com.br/v1/lead",
  "method": "POST",
  "headers": {
    "x-uno-access-token": "2D3453FD350EAF7478E6",
    "x-uno-secret-key": "3d9bc7418e4ec1ed74bae82c03c945ee780d4f798df21108ba"
  },
  "body": {
    "name": "{{name}}",
    "cellPhone": "{{cellPhone}}",
    "tagId": "1",
    "observation": "{{observation}}",
    "adCampaignName": "{{utm_campaign}}",
    "adSetName": "{{utm_medium}}",
    "adName": "{{utm_source}}",
    "campaignSlug": "CONFIRMAR_NO_PAINEL",
    "rating": "CONFIRMAR_NO_PAINEL",
    "originId": "2"
  }
}
```

Se a interface estiver em modo de formulário, preencher os mesmos campos acima em vez de colar o JSON inteiro.

---

## 6. Mapeamento de Resposta

Como a resposta do endpoint não foi documentada no material recebido:

- Executar o teste com um lead real de homologação.
- Clicar em "Executar e Mapear Automaticamente".
- Se a API retornar algum identificador do lead, mapear esse campo.
- Se não houver identificador claro, mapear pelo menos um campo de sucesso como `ok`, `success` ou equivalente.

---

## 7. O Que Falta Homologar

Antes de publicar em produção, confirmar com o cliente ou no modelo ativo:

- Qual `campaignSlug` é o correto para esta integração: `kinbox` ou `typebot`.
- Se `rating` é fixo, variável, ou pode ficar vazio.
- Se os campos de UTM realmente chegam na Awsales nessa campanha.
- Em que ponto do fluxo o lead deve ser enviado ao RP: logo no começo, após identificar nome, ou somente após qualificação mínima.

---

## 8. Próximo Passo no Checkpoint

Depois de a tool estar criada no painel, o checkpoint deve passar a referenciá-la explicitamente no formato abaixo:

`Utilize a tool para registrar o lead no RP @registrar_lead_rp_uno`

Minha recomendação é inserir essa chamada uma única vez por lead, num ponto estável do fluxo, para evitar duplicidade.
