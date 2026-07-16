# Nova FAQ - Prova Social Visual (Base de Produto) — Variação B

Esta é a ÚNICA FAQ nova do teste A/B. Serve para disparar a imagem de antes e depois como PROVA DE VALOR
(objeção de preço) e prova de resultado (dúvida de credibilidade, pedido de foto). As outras 30 FAQs
(15 Produto + 15 Playbook) são as mesmas da campanha atual, sem alteração.

v2 (2026-07-10): pergunta ampliada para cobrir também a intenção de VALOR ("vale a pena?"), porque a
análise de conversas mostrou que a objeção dominante do funil é preço — o match semântico precisa
acontecer também nesse contexto para a imagem ser entregue.

## FAQ a ADICIONAR (base Produto)

Pergunta:
¿Vale la pena pagar esto? ¿De verdad funciona? ¿Tienen fotos de resultados?

Resposta:
Sí. Muchas personas que también habían probado de todo encontraron aquí el primer tratamiento que de verdad les funcionó, y por eso para ellas valió la inversión. Aquí tienes un caso real en un antes y después: los resultados varían y no están garantizados, pero con el acompañamiento médico el cambio fue real. Contextualiza en una sola frase que es un caso real de alguien que también dudaba, recuerda que los resultados varían y reconecta invitando a finalizar el checkout sin cobro. Si la traba de la persona es el precio, usa la imagen como contraste de valor ANTES de hablar del cupón (el cupón queda para el turno siguiente, según el checkpoint). {{imagen_antes_despues}}

## Configuração na plataforma (obrigatório para a imagem disparar)

- Criar esta FAQ na base de PRODUTO da Variação B.
- Anexar o arquivo da imagem de antes e depois (a gerada com o prompt da Variação B) a esta FAQ.
- Nomear a variável do arquivo exatamente como `imagen_antes_despues` (sem acento, snake_case), para casar
  com a referência `{{imagen_antes_despues}}` do checkpoint e desta resposta.
- Ativar a FAQ.

## Regras respeitadas

- Linguagem coloquial do lead na pergunta (busca semântica): "¿vale la pena?", "¿de verdad funciona?", "¿tienen fotos?". A intenção de valor faz a FAQ dar match também em conversas de objeção de preço.
- Sem preço, sem link, sem valores na FAQ (a única variável é a de arquivo/mídia, exceção permitida).
- Compliance: "los resultados varían y no están garantizados" na resposta; sem comparação com marcas; sem
  promessa de resultado.
- 1 imagem por FAQ. O checkpoint controla o MOMENTO e garante envio único (não repetir a foto).

## Isolamento do teste A/B (ler antes de aplicar)

Esta FAQ NÃO pode ser adicionada à base compartilhada da campanha atual (Variação A / controle). Se A e B
usarem a mesma base, a campanha A também dispararia a imagem e o teste perderia a validade. Solução: a
Variação B usa uma CÓPIA da base (mesmas 30 FAQs, idênticas) com esta 1 FAQ a mais. Ver `README - Teste AB.md`.
