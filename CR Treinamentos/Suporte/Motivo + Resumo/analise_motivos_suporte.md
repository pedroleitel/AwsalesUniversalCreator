# Análise de Motivos de Escalonamento - Campanha de Suporte

**Total de casos analisados:** 33

## Ranking de Motivos (maior para menor)

| # | Motivo | Ocorrências | % do Total |
|---|--------|-------------|------------|
| 1 | IA não soube responder | 13 | 39,4% |
| 2 | Detecção de mentira | 10 | 30,3% |
| 3 | Falha em ferramenta | 4 | 12,1% |
| 4 | FALSE_PROMISE | 4 | 12,1% |
| 5 | Solicitação de humano | 2 | 6,1% |

---

## 1. IA não soube responder (13 ocorrências)

1. O usuário enviou uma imagem de um exercício e afirmou que não conseguiu encontrá-lo. A IA explicou o que é o exercício e deu um exemplo, mas não forneceu informações sobre onde o usuário pode encontrá-lo, pois essa informação não está na base de conhecimento. O atendimento precisa ser transferido para um humano que possa ajudar o cliente a localizar o exercício.

2. O usuário solicitou um código Pix para pagamento, mas a IA não conseguiu fornecer a informação específica e não direcionou para o suporte humano conforme as diretrizes para problemas de pagamento.

3. O usuário está com problemas de pagamento e parcelamento, propondo uma negociação flexível. A IA admitiu incapacidade de lidar com a solicitação e direcionou para o suporte humano via WhatsApp.

4. A IA fabricou três frases curtas para o usuário, mesmo a base de conhecimento indicando explicitamente que não há informações sobre 'versões mais curtas da resposta para usar no dia a dia'. A IA deveria ter informado que não possuía essa informação.

5. A IA não consegue ver a agenda do usuário e admite essa incapacidade, o que vai contra as instruções de contornar a falta de informação sem admitir explicitamente.

6. O usuário precisa corrigir o e-mail de acesso, mas a IA não tem a capacidade de realizar esse ajuste e direciona para o suporte humano.

7. O usuário perguntou se um número de celular pertence à empresa. A IA respondeu que não consegue confirmar o número e direcionou para canais oficiais, admitindo sua incapacidade de verificar a informação diretamente.

8. O usuário está solicitando o link de check-in do dia 3, mas a IA não conseguiu localizar a informação e admitiu sua incapacidade. A IA forneceu um link de login geral e um contato de suporte humano.

9. A IA não possui informações específicas sobre café no contexto do jejum, conforme a base de conhecimento. O usuário perguntou sobre café e a IA admitiu não ter essa informação.

10. O usuário perguntou se é possível reabilitar a opção de check-in. A IA informou que não possui orientação confirmada na base de conhecimento sobre como reabilitar essa opção e direcionou para o suporte humano.

11. O usuário perguntou sobre a confiabilidade de migrar para 'watts web' para participar de um grupo. A IA informou que não tem validação para essa ação e aconselhou a não seguir sem confirmar com o suporte, mas não forneceu o contato do suporte humano, o que é esperado quando a IA admite não ter a informação principal.

12. O usuário relatou uma inconsistência no material do curso (título da aula vs. mapa mental para Aula 6 e Dia 7). A IA admitiu não ter essa informação clara em sua base de conhecimento e direcionou para o suporte humano.

13. A IA admitiu não ter a informação sobre a repetição do Dia 02, o que é uma quebra da regra de não dizer 'não sei'. O atendimento deve ser transferido para um humano para que a dúvida seja esclarecida sem a IA admitir incapacidade.

---

## 2. Detecção de mentira (10 ocorrências)

1. A IA prometeu ajudar a conectar os livros lidos pelo usuário com os exercícios do programa e mostrar onde a leitura se encaixa, mas não possui capacidade para realizar essa análise e mapeamento complexo.

2. A IA prometeu 'ajudar a organizar isso de forma prática' em relação a padrões de infância, o que é uma promessa de coaching ou suporte psicológico que a IA não pode cumprir.

3. O usuário está frustrado com um reembolso não processado. A IA forneceu informações sobre o prazo de reembolso e ofereceu 'orientar no próximo passo' após direcionar para o suporte humano. Isso viola a regra de que a IA não deve tentar resolver, justificar ou intermediar solicitações de reembolso, devendo apenas direcionar imediatamente para o suporte humano.

4. A IA prometeu 'ajudar a conferir qual dia do protocolo' o usuário está, mas não tem a capacidade de verificar essa informação. O operador humano deve assumir para auxiliar o usuário a identificar o dia correto do protocolo ou direcionar para o suporte adequado.

5. O usuário está com problemas para encontrar o link de check-in. A IA ofereceu orientar o usuário 'no caminho certo da área de membros', o que é uma promessa de capacidade visual que a IA não possui. O atendimento deve ser transferido para um humano para que possa guiar o usuário de forma mais eficaz ou resolver o problema do link.

6. A IA prometeu 'passar o suporte certinho' se o problema persistir, o que é uma promessa vaga de ação futura. A IA deveria ter fornecido o contato de suporte humano diretamente ou usado a frase de escalonamento padrão, em vez de deferir a ação.

7. A IA prometeu orientar o usuário com base na descrição do que aparece na tela, o que é uma capacidade visual que o checkpoint proíbe. A IA deve direcionar para o suporte humano neste caso, conforme as regras de 'Proibição de Promessas de Capacidade Visual'.

8. A IA prometeu analisar vídeos do usuário, o que ela não tem capacidade de fazer. O usuário deseja enviar vídeos para análise.

9. A IA prometeu guiar o usuário visualmente ('posso te orientar rapidinho sobre onde clicar por lá'), o que é uma capacidade que ela não possui e é explicitamente proibido pelo checkpoint.

10. A IA prometeu sugerir um horário personalizado para o usuário, mas não possui a capacidade de realizar essa ação. A promessa de 'sugerir um horário mais fácil de manter na rotina' é uma promessa falsa.

---

## 3. Falha em ferramenta (4 ocorrências)

1. A ferramenta 'buscar_membro_por_email' falhou ao tentar localizar o membro, impedindo a geração de um deep link de acesso. Além disso, a IA sugeriu o e-mail 'daiseoliveira1527@gmail.com' para redefinição de senha, mas o e-mail visível na imagem do usuário é 'daisealves1527@gmail.com'. O operador humano deve verificar o e-mail correto do cliente e auxiliar na redefinição de senha ou acesso.

2. A IA não conseguiu buscar o membro por e-mail (jeanedelima13@yahoo.com) devido a falha na ferramenta 'buscar_membro_por_email'. O usuário está com problema de acesso ('não usuário cadastrado'). A IA deveria ter escalado para o suporte humano, mas tentou continuar o atendimento com orientações genéricas.

3. A ferramenta para buscar o membro por e-mail e gerar um deep link falhou. A IA forneceu passos de troubleshooting, mas não escalou para o suporte humano com o contato, conforme o protocolo para falhas de acesso persistentes ou falha de ferramenta.

4. A ferramenta para buscar o membro por e-mail falhou, impedindo a IA de gerar o link de acesso. O usuário foi direcionado para o suporte humano ou para tentar o login manual.

---

## 4. FALSE_PROMISE (4 ocorrências)

1. A IA prometeu passar um passo a passo para o usuário 'quando ele voltar', o que é uma promessa de retorno em outro momento e viola as regras de comunicação no tempo presente.

2. A IA prometeu 'orientar sobre onde clicar para seguir com a aula', o que é uma promessa de guia interativo que a IA não pode cumprir. O checkpoint proíbe 'vou te mostrar onde clicar'.

3. O usuário pediu orientação e a IA forneceu uma mensagem para ele enviar ao suporte humano. No entanto, a IA prometeu 'orientar no próximo passo' após o usuário enviar a mensagem, o que é uma promessa de continuidade futura que a IA não deve fazer, conforme as regras de 'Proibição de Promessas Futuras ou Ações Não Executáveis'.

4. A IA prometeu uma ação futura ('eu te passo o caminho certinho') que não está alinhada com a regra de comunicação no tempo presente. O usuário está reclamando que o suporte humano não responde, e a IA reitera o contato e adiciona informações, mas a frase final é uma promessa futura.

---

## 5. Solicitação de humano (2 ocorrências)

1. O usuário está irritado e pediu explicitamente para falar com um atendente humano, afirmando que não quer interagir com a IA.

2. O usuário solicitou explicitamente falar com um atendente humano.

---

## Observações

- **IA não soube responder + Detecção de mentira** juntos somam **69,7%** dos casos, indicando que o maior gargalo está na gestão de limitações da IA (seja admitindo incapacidade quando não deveria, seja prometendo capacidades que não possui).
- **Detecção de mentira + FALSE_PROMISE** compartilham a mesma raiz conceitual (promessas indevidas) e, somados, representam **42,4%** dos casos — vale revisar se a categorização poderia ser unificada ou se há critérios claros que diferenciam uma da outra.
- **Falha em ferramenta** (12,1%) está concentrada na ferramenta `buscar_membro_por_email` nos 4 casos — pode ser um ponto de investigação técnica prioritário.
- **Solicitação de humano** (6,1%) é o único motivo genuinamente "saudável" de escalonamento — os outros indicam falhas que poderiam ser evitadas com ajustes no checkpoint ou na base de conhecimento.
