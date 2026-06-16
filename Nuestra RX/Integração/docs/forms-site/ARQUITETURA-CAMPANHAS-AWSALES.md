# Arquitetura de Integração — Campanhas Nuestra RX × AWSales

Mapa da integração forms-site/Dosable ↔ AWSales. Serve como referência e **template**
para as próximas campanhas da Nuestra RX (este doc nasceu da campanha "Recuperação de
Formulário", validada end-to-end em 2026-06-08).

---

## 1. Visão geral: 1 input, 2 outputs

O lead tem **dois caminhos** para o mesmo objetivo (chegar ao checkout), então a campanha
tem 1 disparo de entrada e 2 eventos de conversão:

```
                        ┌─ abandona o form ─────────────► INPUT (dispara a campanha)
Lead na evaluacion ─────┤
                        ├─ termina no SITE ─────────────► OUTPUT 1 (form_response)
                        └─ termina no WHATSAPP (a IA) ──► OUTPUT 2 (custom_action)
```

Qualquer um dos 2 outputs **encerra a participação** do lead na campanha (a IA para de
recuperar), não importa por onde ele fechou.

---

## 2. Os dois fluxos n8n

### Fluxo A — Forms-site (input + output do site)

```
Webhook /webhook/nuestra-forms-site
   (worker do Willian: x-nrx-source: webhook.nuestrarx.com)
        ↓
[Code] Normalize Abandono          → forms-site/normalize-abandono-awsales.n8n.js
        ↓
[IF] routing.should_send_to_awsales_now is true
        ↓ true
[HTTP] POST AWSales (credencial FORMS-SITE)
```

Mapeamento de evento (no normalizador):

| Evento que chega | event_kind | event AWSales | Envia? | Papel |
|---|---|---|---|---|
| `intake_abandoned` | `form_abandonment_confirmed` | `form_response_partial` | ✅ na hora | **INPUT** |
| `intake_plan_selected` | `checkout_reached` | `form_response` | ✅ na hora | **OUTPUT 1** |
| `intake_progress` | `form_progress_snapshot` | — | ❌ | autosave |
| `intake_partial` | `contact_captured` | — | ❌ | só contato |

### Fluxo B — Tool ai-handoff (output do WhatsApp)

```
Webhook tool-ai-handoff   (a IA da AWSales chama esta tool)
        ↓
[Code] normalizer da tool          → ../tool-ai-handoff-normalizer.n8n.js
        ↓
[HTTP] POST https://webhook.nuestrarx.com/ai-handoff   (wrapper do Willian → Dosable)
        ↓   (resposta: { ok, session_id, lead_id, checkout_url, product, plan, tenant_id })
[Code] Build AWSales Output        → ../tool-output-awsales.n8n.js
        ↓
[IF] should_send_output is true     (só quando ok:true E veio checkout_url)
        ↓ true
[HTTP] POST AWSales (credencial OUTPUT-ENVIO-DA-TOOL, Custom Action)
```

> ⚠️ O fluxo B precisa estar **conectado ponta a ponta**. O "Build AWSales Output" usa
> `$('tool-ai-handoff').item` para puxar o contato (phone/email), e o n8n só consegue
> rastrear esse item se houver caminho conectado do webhook até o node. Desconectado =
> contato vazio = `lead.phone/email Required` no AWSales.

---

## 3. Config da campanha no painel AWSales

**Evento de Conversão** (encerra a participação do lead) — 2 blocos:

| Bloco | Plataforma de conclusão | Produto de atuação | Evento |
|---|---|---|---|
| 1 | `FORMS-SITE` | Nuestra RX - Evaluacion GLP-1 | Resposta de Formulário (`form_response`) |
| 2 | `OUTPUT-ENVIO-DA-TOOL` | Nuestra RX - Checkout via WhatsApp (ai-handoff) | `CUSTOM_ACTION` |

- "Produto de atuação" do bloco 1 = o `form.name` enviado pelo normalizador do site.
- "Produto de atuação" do bloco 2 = o `source.name` enviado pelo Build AWSales Output.

---

## 4. Endpoints e credenciais

- **Org AWSales:** `b34f181e-c7b3-49fb-b69f-3454a7336df2`
- **AWSales (input/output do site):** `POST .../api/webhooks/organizations/{org}/credentials/forms-site` *(confirmar slug exato da credencial FORMS-SITE)*
- **AWSales (output da tool, Custom Action):** `POST https://app.awsales.io/api/webhooks/organizations/b34f181e-c7b3-49fb-b69f-3454a7336df2/credentials/output-envio-da-tool`
- **Wrapper Dosable (Willian):** `POST https://webhook.nuestrarx.com/ai-handoff` (Bearer `<AI_HANDOFF_SECRET>`)
- **Dosable API oficial:** ver `../dosable/Api/openapi.json` (o `/ai-handoff` é wrapper do Willian em cima de `POST /sessions/{id}/complete`).

---

## 5. Arquivos da integração

| Arquivo | Papel |
|---|---|
| `normalize-abandono-awsales.n8n.js` | Fluxo A: forms-site → AWSales (input + output do site) |
| `../tool-ai-handoff-normalizer.n8n.js` | Fluxo B: monta o body do `/ai-handoff` a partir da tool |
| `../tool-output-awsales.n8n.js` | Fluxo B: monta o `custom_action` de output quando volta checkout_url |
| `../tool-ai-handoff-awsales.md` | Doc da tool na AWSales (config, schema, testes) |
| `../handoff-awsales-20260528/` | Schema das 33 perguntas Dosable (Tenant 64) + sample_request |

---

## 6. Gotchas aprendidos (NÃO repetir os erros)

1. **Birthday / lead de abandono (lado Willian):** o `/ai-handoff` é wrapper do Willian.
   Para lead que já existe (veio do abandono com `dosable_lead_id`/`dosable_session_id`),
   o wrapper completa a sessão existente e validava o birthday **vazio salvo na ficha**,
   não o que a gente manda → erro genérico "Birthday must be in MM/DD/YYYY format and
   indicate at least 18 years old". Corrigido: o wrapper agora grava o birthday do payload
   na ficha antes de completar. A data válida em MM/DD não era o problema.

2. **Formato da data:** a Dosable aceita birthday em **MM/DD/YYYY** e **rejeita ISO**
   (`1990-01-15` → INVALID_DATE_FORMAT). O form coleta dia/mês/ano separados, então é
   MM/DD sem ambiguidade. NÃO converter para ISO.

3. **Schema do Custom Action (output da tool):** obrigatórios = `event`, `timestamp`,
   `source.id`, `source.name`, `lead.phone`, `lead.email`. E **`utm.source` DEVE ser
   `"awsales"`** senão a conversão não aparece no dashboard. `metadata` é opcional.

4. **`lead.phone` em +E164** (ex: `+5531983020653`): tem que casar com o mesmo lead que o
   input criou no AWSales, senão a conversão não associa ao lead certo.

5. **n8n — fluxo conectado:** `$('node').item` precisa de caminho conectado para o
   rastreio de item. Desconectado → dado vazio.

6. **n8n — corpo do HTTP:** mandar **`{{ $json.awsales_payload }}`** (objeto, modo JSON)
   ou Raw + Content-Type `application/json` + `{{ $json.awsales_payload_json }}`. Nunca
   mandar o `$json` inteiro (o "envelope") — o AWSales reclama de todos os campos Required.
   Com modo JSON, não precisa setar header (o n8n manda o Content-Type sozinho).

7. **Passthrough de IDs Dosable:** o normalizador da tool reenvia
   `session_id`/`lead_id`/`dosable_*` (vindos do metadata) para o wrapper saber qual
   sessão completar. Só envia quando existem (lead novo não manda → wrapper cria do zero).

---

## 7. Template para as PRÓXIMAS campanhas Nuestra RX

A base é reusável. Para uma nova campanha (ex: outra oferta/funil), o que muda:

- **Input:** geralmente continua `intake_abandoned` → `form_response_partial` (mesmo
  webhook forms-site). Se a nova campanha dispara por outro momento do funil, ajustar
  `getEventKind`/`getAwsalesEvent` no `normalize-abandono-awsales.n8n.js`.
- **Outputs:** os 2 caminhos (site `form_response` + WhatsApp `custom_action`) tendem a se
  repetir. Reaproveitar `tool-output-awsales.n8n.js` mudando só `SOURCE.id`/`SOURCE.name`
  por campanha, e criar uma credencial Custom Action dedicada por campanha (isolamento).
- **Campanha no painel:** replicar os 2 blocos de Evento de Conversão apontando para as
  plataformas/produtos da nova campanha.
- **Checkpoint da IA:** continua chamando `@enviar_avaliacao_nuestra_rx` e tratando
  `checkout_url` vs erro/desqualificação (ver `../../Campanhas/.../Checkpoint/`).

Regra de ouro: **uma credencial/integração dedicada por output** para isolar variável se
algo quebrar no futuro (foi por isso que separamos `output-envio-da-tool` do `forms-site`).

---

_Última validação end-to-end: 2026-06-08 (lead samuel jackson / 247334 retornou ok:true +
checkout_url; campanha com 2 eventos de conversão ativos)._
