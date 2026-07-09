# Nova FAQ - Prova Social Visual (Base de Produto) — Variação B

Esta é a ÚNICA FAQ nova do teste A/B. Serve para disparar a imagem de antes e depois quando o lead
duvida do resultado ou pede prova. As outras 30 FAQs (15 Produto + 15 Playbook) são as mesmas da campanha
atual, sem alteração.

## FAQ a ADICIONAR (base Produto)

Pergunta:
¿Tienen fotos de resultados? ¿A alguien de verdad le funcionó?

Resposta:
Sí. Muchas personas que también habían probado de todo encontraron aquí el primer tratamiento que de verdad les funcionó. Aquí tienes un caso real en un antes y después: los resultados varían y no están garantizados, pero con el acompañamiento médico el cambio fue real. Contextualiza en una sola frase que es un caso real de alguien que también lo intentó todo, recuerda que los resultados varían y luego reconecta invitando a finalizar el checkout sin cobro. {{imagen_antes_despues}}

## Configuração na plataforma (obrigatório para a imagem disparar)

- Criar esta FAQ na base de PRODUTO da Variação B.
- Anexar o arquivo da imagem de antes e depois (a gerada com o prompt da Variação B) a esta FAQ.
- Nomear a variável do arquivo exatamente como `imagen_antes_despues` (sem acento, snake_case), para casar
  com a referência `{{imagen_antes_despues}}` do checkpoint e desta resposta.
- Ativar a FAQ.

## Regras respeitadas

- Linguagem coloquial do lead na pergunta (busca semântica): "¿tienen fotos?", "¿a alguien le funcionó?".
- Sem preço, sem link, sem valores na FAQ (a única variável é a de arquivo/mídia, exceção permitida).
- Compliance: "los resultados varían y no están garantizados" na resposta; sem comparação com marcas; sem
  promessa de resultado.
- 1 imagem por FAQ. O checkpoint controla o MOMENTO e garante envio único (não repetir a foto).

## Isolamento do teste A/B (ler antes de aplicar)

Esta FAQ NÃO pode ser adicionada à base compartilhada da campanha atual (Variação A / controle). Se A e B
usarem a mesma base, a campanha A também dispararia a imagem e o teste perderia a validade. Solução: a
Variação B usa uma CÓPIA da base (mesmas 30 FAQs, idênticas) com esta 1 FAQ a mais. Ver `README - Teste AB.md`.
