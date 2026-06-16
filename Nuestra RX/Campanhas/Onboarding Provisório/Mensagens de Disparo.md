# Mensagens de Disparo — Onboarding Provisório (Nuestra RX · Aprovado + portal)

Idioma: espanhol neutro latino-americano. Abertura sem emoji (template HSM). Sem variável {{nome}}.
Dispara no evento de aprovação do médico (`rx_written`). Fecha em afirmação, sem induzir pergunta.

> Provisório: roda enquanto não temos o despacho (`shipping_confirmation`) nem as variáveis de
> rastreio. Como o link do portal é uma URL FIXA (igual para todos), ele pode ir direto na abertura
> — diferente do código de rastreio, que era variável de metadata e não entrava no HSM.

---

## Abertura de janela (HSM — dispara quando o médico aprova)

A abertura só dá a boa notícia e se coloca à disposição. O link do portal e as demais respostas a
IA manda quando o lead perguntar (a campanha existe pra responder as dúvidas do Onboarding 1 e 2).

¡Felicidades! Tu receta ya fue aprobada por el médico.

La farmacia despacha tu pedido en un máximo de 24 horas.

Cualquier duda mientras tanto, estoy aquí para acompañarte.

---

## Follow-up (se o lead não responder)

Hola, paso para avisarte que tu tratamiento sigue su curso después de la aprobación.

Si tienes cualquier duda sobre tu pedido o el envío, escríbeme por aquí y te ayudo.

---

## Alternativa: Follow-Up Inteligente

Pode usar o Follow-Up Inteligente da plataforma no lugar do FUP estático. Se optar, as orientações
dos 3 campos vão num `MENSAGENS_FOLLOWUP.md` e NÃO no checkpoint. Me avisa que eu preparo.
