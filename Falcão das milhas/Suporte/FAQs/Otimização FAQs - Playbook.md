# Otimização FAQs - Playbook (IA de Suporte - Falcão das Milhas)

Otimizações aplicadas a partir do feedback dos pontos 16 e 17 (auditoria de atendimento). Foco: remover a promessa de reset que a IA não consegue executar e impedir o envio do formulário de reembolso quando o cliente tem problema de acesso.

Contexto verificado no Manual IA Atendimento.pdf: o único procedimento estruturado documentado é o de cancelamento e reembolso. Não existe formulário próprio para problemas de acesso. Para acesso, o caminho oficial é handoff humano direto após coletar o e-mail da compra.

---

## FAQs a EDITAR

### FAQ 1

Pergunta (manter exata, sem alteração):
Estou com problema no acesso, o que faço?

Resposta otimizada (substituir a atual):
Em problemas de acesso ao Buscador, conduzir nesta ordem:

1. Validar o sentimento do cliente e perguntar se é problema de login/senha ou erro dentro da plataforma após entrar. Cada caso tem trilha diferente.
2. Se for acesso, orientar a tentativa de "Esqueci minha senha" e a verificação da caixa de entrada e da pasta de spam ou lixo eletrônico, com o e-mail usado na compra.
3. Se nada chegou nem no spam, pedir o e-mail da compra para confirmar.
4. Com o e-mail em mãos, NÃO prometer reset e NÃO enviar nenhum formulário. Avisar que o caso será encaminhado para o time humano resolver o acesso e fazer o handoff.

Falas proibidas: "vou resetar para você", "já sigo com o reset", "manda o e-mail que eu reseto agora", além de qualquer envio de formulário neste fluxo. Quem destrava o acesso é o time humano após handoff, e o formulário existente atende somente cancelamento e reembolso, não acesso.

Motivo da edição: a resposta anterior orientava a IA a "falar que vai resetar o acesso do cliente", criando uma promessa que ela não consegue cumprir. Auditoria mostrou também que, na prática, a IA acabou enviando o formulário de reembolso (cuja URL tem o nome enganoso "formulariodesuporte") como se fosse formulário de acesso, gerando confusão de cancelamento (pontos 16 e 17). A nova versão remove a promessa de execução, bloqueia o envio de qualquer formulário neste fluxo e mantém o caminho correto: e-mail e handoff.

---

## FAQs a REMOVER

Nenhuma.

---

## FAQs para ATIVAR sem alteração

Todas as demais FAQs do Playbook permanecem ativas e sem alteração:

- Quero cancelar porque não tive resultados rápidos. O que fazer?
- Eu prefiro que alguém faça tudo por mim. Qual o melhor produto?
- Achei a viagem dos sonhos, mas não tenho as milhas certas. E agora?
- Não entendo nada de milhas, como posso aprender com segurança?
- Como lidar com o cliente que só viaja em alta temporada e está insatisfeito?
- Como orientar clientes acima de 45 anos ou que não entendem de milhas?
- Como agir quando o cliente pede atendimento humano imediatamente?
- Como transformar clientes satisfeitos em defensores da marca sem forçar?
- Como proceder quando o cliente pede atendimento humano imediatamente?
- Como responder quando a promoção desaparece ao emitir e o cliente culpa o sistema?
- Como lidar com cliente frustrado porque não encontrou nada barato no buscador?
- Como orientar sobre a área de seguros sem criar expectativa errada?
- Como transformar uma reclamação em oportunidade de encantamento?
- Como abordar o cliente que só pode viajar em alta temporada e está insatisfeito?
- Como diagnosticar o perfil do cliente e indicar o produto certo do ecossistema?
- Como orientar um cliente acima de 45 anos que diz não entender milhas?
- Como conduzir um pedido de cancelamento ou reembolso sem perder o cliente?
- Como recuperar um cliente em risco por falta de resultados nos primeiros dias?
- Como agir quando o cliente não tem milhas no programa da oportunidade?
- Como agir quando o cliente quer destino e data exatos e está decepcionado?
- Como explicar, sem gerar atrito, por que o primeiro filtro não tem destino?
- Como motivar um cliente que está procrastinando a decisão?

---

## Verificação das FAQs de Produto

Verifiquei as 21 FAQs de Produto. Nenhuma trata de problema de acesso, login, senha ou reset, e nenhuma referencia o formulário de reembolso de forma que conflite com as novas regras do checkpoint. As menções a formulário em "Como proceder quando o cliente pede cancelamento ou reembolso?" continuam coerentes (formulário oficial de reembolso, único formulário existente). Nenhuma alteração necessária no Produto.
