# Contexto e Próximos Passos — Campanha Suporte EQJC

Arquivo de handoff. Se você é o Claude lendo isto em uma nova conversa: leia este arquivo de cima a baixo e depois leia os arquivos referenciados. Com isso você tem contexto total para continuar o trabalho sem precisar do histórico da conversa anterior.

---

## 1. O que é esta campanha

Campanha de Suporte WhatsApp da CR Treinamentos / Paulo Aguiar X para o produto "21 Exercícios Quânticos de Jesus Cristo" (EQJC), rodando na plataforma AWSales. O bot atende alunos já matriculados e inscritos na aula gratuita "A Ascensão".

Localização: `CR Treinamentos/Suporte/`

Estrutura da plataforma AWSales: Checkpoint (regras de comportamento + variáveis) + Information Manager com duas bases RAG — Produto (FAQs factuais) e Playbook (FAQs comportamentais).

---

## 2. Insumos originais usados no trabalho (leitura obrigatória para entender o contexto)

- `Suporte/Checkpoint/checkpoint.md` — checkpoint atualizado da campanha
- `Suporte/FAQs/CR Treinamentos  Suporte - Exercícios Quânticos de Jesus Cristo - Produto.txt` — FAQs Produto atuais (exportadas da plataforma)
- `Suporte/FAQs/CR Treinamentos  Suporte - Exercícios Quânticos de Jesus Cristo - Playbook.txt` — FAQs Playbook atuais (exportadas da plataforma)
- `Suporte/Insumo para fortalecer/BASE_CONHECIMENTO_SUPORTE_EQJC (1) (1).md` — base de conhecimento oficial v1.4 fornecida pelo cliente
- `Suporte/Relatório de GAPs/relatorio_atendimento_ia.html` — relatório dos últimos 455 atendimentos: 80.9% resolvidos pela IA, 18.7% escalados, CSAT 4.74, RAG 69.4%. Top gaps de deflection: Reembolso 80%, Pagamento 60%, Contrato 45%, Bônus 40%, Exercícios 36%, Progresso 33%, Sintomas 29%, WhatsApp 22%, Onboarding 21%, Acesso 14% (com 202 conversas).
- `Suporte/Motivo + Resumo/analise_motivos_suporte.md` — análise de 33 casos específicos com motivo de escalonamento categorizado: IA não soube responder 39.4%, Detecção de mentira 30.3%, Falha em tool 12.1%, FALSE_PROMISE 12.1%, Solicitação de humano 6.1%.

Estrutura e regras universais de todas as campanhas:
- `Estrutura/ESTRUTURAS_E_EXEMPLOS.md`
- `Estrutura/PROMPT_SISTEMA_UNIVERSAL.md`

---

## 3. O que já foi feito (entregáveis desta fase)

### 3.1 Checkpoint reescrito
Arquivo: `Suporte/Checkpoint/checkpoint.md`

Mudanças principais:
- Identidade neutra do bot (sem nome próprio)
- 11 proibições absolutas (retenção de contato, gestão interna, promessas futuras, capacidade visual, envio de material, invenção de resumos/rotinas, correção de email do lead, direcionamento obrigatório em reembolso/pagamento, eficácia do produto, limite de acolhimento emocional, não criar informação além da base)
- 4 etapas do funil de atendimento
- Protocolo de Deep Link em 6 níveis (com escalonamento imediato em falha de tool)
- Seção "Quando não souber a resposta" com frases proibidas vs permitidas
- 16 situações que sempre escalam para suporte humano
- Variáveis no rodapé: {{lead_email}}, {{link_suporte}}, {{link_area_de_membros}}, {{link_do_grupo}}, {{link_pagamento_alt}}, {{link_consultor_completo}}, {{link_consultor_21}}, {{link_reembolso_7d}}, {{link_reembolso_21d}}, {{link_matricula}}, {{link_ascensao_grupo}}, {{link_ascensao_youtube}}

Formatação: sem asteriscos, sem emojis, markdown puro, pt-br com acentos, checklist com `- [ ]`.

### 3.2 FAQs Produto otimizadas
Arquivo: `Suporte/FAQs/Otimização FAQs - Produto.md`

Contém 3 seções:
- A. 16 novas FAQs a adicionar (formulário matrícula, Consultor Quântico, imprimir Diário, parcelamento +12x, dois cartões, Pix seguro, reembolso para outra pessoa, café no Jejum, repetir dia, check-in acesso, WhatsApp Web, matrículas bloqueadas, contrato download, bônus localização, A Ascensão o que é, A Ascensão custo)
- B. 3 FAQs existentes a editar (check-in dia, acessar produto pós-compra, bônus imediatos)
- C. Lista de FAQs a manter ativas sem alteração

### 3.3 FAQs Playbook otimizadas
Arquivo: `Suporte/FAQs/Otimização FAQs - Playbook.md`

Contém 3 seções:
- A. 12 novas FAQs comportamentais (nome do assistente, número da empresa, análise de foto/vídeo, sugestão de rotina, versão resumida, identificar dia do protocolo, conectar livros externos, falha de tool, correção de e-mail, código Pix, negociação flexível, inconsistência no material)
- B. Nenhuma edição nas existentes
- C. Lista das 24 FAQs Playbook ativas a manter

### 3.4 Dúvidas para o cliente (documento interno + documento de envio)
- `Suporte/PERGUNTAS_PARA_CLIENTE.md` — versão interna com jargão técnico (checkpoint, FAQs, variáveis) e mapeamento de onde cada resposta será aplicada
- `Suporte/Dúvidas - Suporte EQJC.md` — versão limpa em linguagem de cliente
- `Suporte/Dúvidas - Suporte EQJC.pdf` — PDF gerado para envio

Organizados em 12 blocos por prioridade:
- Alta: consistência do material (bloco 1), correção de e-mail (2), localização dos materiais (5), reabilitação de check-in (6), vídeo não carrega (10)
- Média: código Pix (3), repetição de dias (7), grupo Ascensão (9)
- Baixa: negociação de parcelamento (4), contrato (8), CSAT (11), conteúdo dia a dia (12)

---

## 4. Estado atual

Campanha pronta para produção com o material disponível. Arquivos de otimização (FAQs Produto e Playbook) ainda são documentos de referência — não foram aplicados dentro da plataforma AWSales, isso é ação manual do usuário.

PDF com dúvidas foi gerado para envio ao cliente. Aguardando respostas.

---

## 5. Próximo passo previsto

Quando o cliente responder as 12 dúvidas, o fluxo é:

### 5.1 Ler as respostas do cliente
O cliente provavelmente vai responder em texto/áudio. Extrair cada resposta e associar ao bloco correspondente do arquivo `Dúvidas - Suporte EQJC.md`.

### 5.2 Atualizar FAQs Produto
Para cada resposta que vira informação factual/mecânica:
- Criar nova FAQ em `Suporte/FAQs/Otimização FAQs - Produto.md` na seção A
- Nomear a FAQ como pergunta do aluno (ex.: "Como faço para trocar o e-mail de acesso?")
- Resposta com no máximo 120 palavras, linguagem direta, com link literal quando aplicável

### 5.3 Atualizar FAQs Playbook
Para cada resposta que muda comportamento do bot:
- Criar nova FAQ em `Suporte/FAQs/Otimização FAQs - Playbook.md` na seção A
- Nomear como "Como agir quando..." ou "Como responder quando..."
- Corpo da FAQ em passos numerados

### 5.4 Atualizar checkpoint se necessário
Só se a resposta do cliente mudar regra de conduta ou adicionar situação de escalonamento. Edit direto em `Suporte/Checkpoint/checkpoint.md`. Manter formatação: sem asteriscos, sem emojis, acentos pt-br, variáveis no rodapé.

### 5.5 Gerar relatório de follow-up para o usuário
Listar quais respostas foram aplicadas onde. Usuário aplica manualmente na plataforma AWSales.

---

## 6. Regras invioláveis aprendidas neste trabalho (não violar)

- Checkpoint: zero asteriscos (`**`, `*`), zero emojis, markdown com `#`, `##`, `- [ ]`, acentuação pt-br obrigatória, variáveis no rodapé.
- Identidade do bot: neutra, sem nome próprio. Nunca atribuir nome pessoal.
- FAQs podem conter links literais (ex.: https://pay.hotmart.com/...) e contato (+55 66 9668-5192). Não usam `{{variáveis}}` — as variáveis ficam só no checkpoint.
- Variáveis da campanha (atuais, conforme a plataforma): `link_suporte`, `link_area_de_membros`, `link_do_grupo`, `link_pagamento_alt`, `link_consultor_completo`, `link_consultor_21`, `link_reembolso_7d`, `link_reembolso_21d`, `link_matricula`, `link_ascensao_grupo`, `link_ascensao_youtube`, `lead_email`.
- Gerar PDF de dúvidas: script em `/tmp/md_to_pdf.py` usa reportlab, trata headings, bullets (`- `) e horizontal rules (`---`). Não passa `value='bullet'` para ListItem (bug conhecido). Renderiza bullets como `•` literal em Paragraph indentado.

---

## 7. Arquivos que NÃO precisa mexer (contexto, não entregáveis)

- `Suporte/Relatório de GAPs/relatorio_atendimento_ia.html` (read-only)
- `Suporte/Motivo + Resumo/analise_motivos_suporte.md` (read-only)
- `Suporte/Insumo para fortalecer/*` (read-only)
- `Suporte/FAQs/*.txt` e `*.pdf` (export da plataforma, não editar)

Arquivos vivos (pode editar conforme cliente responder):
- `Suporte/Checkpoint/checkpoint.md`
- `Suporte/FAQs/Otimização FAQs - Produto.md`
- `Suporte/FAQs/Otimização FAQs - Playbook.md`

---

## 8. Como começar uma nova conversa sobre esta campanha

Usuário deve mandar no primeiro turno: "leia `CR Treinamentos/Suporte/CONTEXTO_E_PROXIMOS_PASSOS.md` e me diga o que falta fazer". Claude lê este arquivo + o checkpoint atual + os dois arquivos de otimização de FAQs e tem o contexto completo.
