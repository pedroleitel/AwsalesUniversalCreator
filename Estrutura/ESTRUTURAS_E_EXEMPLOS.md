# Exemplos e Estrutura de Artefatos AWSALES

Este documento possui os guias de estrutura para criação de textos e checkpoints para a plataforma Awsales de forma universal.

## 0. O Que é Uma Campanha na AWSales?

Uma campanha na plataforma Awsales é, em essência, a junção de duas peças principais:
1. **O Checkpoint:** É o "cérebro" das etapas da IA (funil). Ele diz para onde a conversa deve ir, o que focar no momento e quais são os passos lógicos.
2. **A Base de Conhecimento (FAQs Produto + Playbook):** São as informações passivas da plataforma.
   - **MUITO IMPORTANTE:** As FAQs funcionam via **Busca Semântica (RAG)**. Quando o lead (cliente) envia uma mensagem no WhatsApp, a IA compara o contexto da mensagem com o banco de FAQs buscando as 5 mais relevantes.
   - A busca semântica é flexível e dá match mesmo quando a Pergunta (Título da FAQ) está redigida em linguagem mais formal ou de bastidor, desde que a intenção esteja contemplada. Portanto, ao **avaliar uma FAQ existente**, só recomende reescrever a pergunta quando ela estiver realmente desconectada da intenção do lead, a ponto de não conseguir cobrir nenhuma mensagem real. Ao **criar uma FAQ nova**, prefira escrever a Pergunta na linguagem coloquial do lead (ex: "O que ganho comprando isso?" será acionado se o lead disser "qual a vantagem?", "tem algum bônus?", etc.). Sempre avalie FAQs sob a ótica da intenção do lead, mas sem ser excessivamente rigoroso com o formato da pergunta.

### Orquestração Multiagente Real

A campanha não roda só com "Checkpoint + FAQs". Esses artefatos alimentam uma cadeia de agentes:
- **Checkpoint Manager:** mantém memória factual e estado da conversa.
- **Information Manager:** consulta FAQs/catálogo e organiza fatos para a resposta.
- **Integration Manager:** planeja tools apenas quando encontra `@toolName` no checkpoint.
- **Integration Runner:** executa a sequência de tools planejada.
- **Copywriter:** escreve a resposta final ao lead.
- **Response Auditor:** valida idioma, coerência e vazamento de contexto interno.
- **Smart Follow-Up:** usa transcrição + checkpoint para decidir retomada, timing e mensagem.

Consequência prática:
- Checkpoint = roteador de estado, ritmo, prioridade, limites, próximo passo e uso de tools.
- FAQ Produto = fatos comerciais e operacionais.
- FAQ Playbook = objeções, argumentos, psicologia do avatar e tom.
- Follow-Up Inteligente = precisa de status, pendência, temperatura e alavanca registrados pelo checkpoint.
- Integrações = só funcionam se o checkpoint mencionar a tool no formato correto.

### Como as FAQs São Criadas na Plataforma

As FAQs **não são escritas manualmente**. A plataforma AWSales possui **Prompts de Extração** internos que geram as FAQs automaticamente a partir dos insumos fornecidos. O fluxo é:

1. O CS faz upload dos **insumos do cliente** (PDFs, textos, páginas de venda, etc.) na plataforma.
2. O CS cola o **Texto Complementar** (gerado por você) junto aos insumos.
3. A plataforma usa seus **Prompts de Extração (Produto + Playbook)** para gerar os pares de Pergunta e Resposta automaticamente.
4. O CS traz as FAQs geradas para avaliação e ajuste.

Existem **5 tipos de campanha**, cada um com prompts de extração específicos:
- **Recuperação de Vendas** — foco em resgatar leads que não finalizaram a compra
- **Venda Direta** — foco em conversão direta com gatilhos psicológicos
- **Lançamentos** — foco em cronograma de CPLs, urgência de carrinho e jornada de transformação
- **Customer Success** — foco em onboarding, suporte e retenção pós-venda
- **SDR** — foco em qualificação de leads e agendamento de calls de vendas

### Subtipo Operacional: Campanha Show Up Burra

A campanha Show Up Burra é um subtipo enxuto de Lançamento/Show Up usado quando o objetivo não é vender, qualificar ou aprofundar objeções, mas apenas levar o lead para a transmissão ao vivo com o menor custo possível.

Use quando:
- O lead já está inscrito ou já demonstrou intenção de participar.
- A campanha precisa ser muito barata e objetiva.
- A principal ação esperada é clicar no link da live.
- Dúvidas fora do básico devem ser enviadas para o suporte humano/operacional.

Regras principais:
- Checkpoint curto, direto e sem funil consultivo.
- Não usar SPIN, aniquilação de objeções, venda ativa ou exploração de dor.
- Não tentar responder dúvidas profundas sobre método, produto, espiritualidade, pagamento ou suporte técnico. Responder brevemente, encaminhar para suporte e voltar a mandar o lead para a live.
- Nunca dizer que o suporte é IA. Usar termos como "suporte", "equipe" ou "time de suporte".
- Links ficam no checkpoint como variáveis, especialmente `{{link_live}}` e `{{link_suporte}}`.
- FAQs podem ser poucas: 3 de Produto e 2 a 3 de Playbook normalmente bastam.
- Mensagens de disparo devem ter tom de utilidade: "a transmissão já começou", "o acesso oficial está disponível", "entre pelo link abaixo". Evitar hype, perguntas longas, curiosidade excessiva e follow-up inteligente quando a prioridade for custo.

### O Papel do Texto Complementar na Geração de FAQs

O Texto Complementar (Produto + Playbook) tem **dupla função**:
1. **Complementar lacunas:** Adicionar informações que o insumo original não possui (gatilhos, objeções, tom de voz, regras de links).
2. **Direcionar a extração:** Como o texto complementar é processado junto com os insumos pelos prompts de extração, ele influencia diretamente a **qualidade e o direcionamento** das FAQs geradas. Um texto complementar bem escrito resulta em FAQs mais precisas e estratégicas.

## 1. Texto Complementar (Produto & Playbook)

O objetivo desses textos é adicionar informações EXTRAS que **não estão presentes no insumo do cliente** (como um PDF, por exemplo). Na plataforma AWSales, o usuário fará o upload do PDF (em "Arquivo") e colar o seu texto (em "Texto"). Logo, seu papel aqui é preencher as lacunas que o PDF não possui, como gatilhos, mentalidade, regras de links e objeções não óbvias. Eles devem ser separados.

### A. Texto Complementar: PRODUTO
*Escopo: Tudo que é mecânico, factual, regras, valores.*
- **Contexto da Campanha e Produto (O que é)**
- **Detalhes de Oferta (Valores, lotes, opções de parcelamento)**
- **Entregáveis (Módulos, bônus, carga horária, encontros)**
- **Operação (Como acessa, suporte, tempo de acesso)**

### B. Texto Complementar: PLAYBOOK
*Escopo: Tudo que é comportamental, negociação, tom de voz, objeções.*
- **Psicologia do Avatar (Quem é o lead, dor principal, por que travou)**
- **Lista de Objeções Comuns (Desculpa vs Razão real) e Como Transpor**
- **Credibilidade do Especialista (Provas, currículo aplicável)**
- **Tom de Voz (Jargões do nicho a usar, expressões a evitar terminantemente)**
- **Estratégia Comercial (RAR, SPIN enxuto, urgência real, escassez real, contraste de custo da inação, CTA de avanço)**
- **Limites Éticos (não inventar garantia, não prometer resultado absoluto, não usar escassez falsa, não pressionar com fatos inexistentes)**

---

## 2. Checkpoint — O Artefato Mais Crítico da Campanha

O Checkpoint é o artefato mais importante de toda a campanha. Ele é literalmente o **prompt que alimenta o sub-agente Checkpoint Manager** dentro da plataforma AWSales. É ele quem diz à IA:
- Em que etapa da conversa ele está
- Como deve se comportar em cada momento
- Quando avançar, quando recuar, quando fechar
- Quais regras nunca quebrar

Se o Checkpoint for fraco, genérico ou resumido demais, a IA perde o controle do funil, erra o tom, não sabe quando avançar etapa e a conversa morre. **Um Checkpoint ruim invalida todo o resto** (FAQs perfeitas e abertura matadora não salvam uma IA sem direção).

### Checkpoint = Roteador Multiagente (NÃO Conhecimento)
A plataforma tem uma cadeia de agentes. O checkpoint influencia todos:
- **Checkpoint Manager** — registra memória factual e estado da conversa.
- **Information Manager** — busca informações nas FAQs por semântica.
- **Integration Manager** — procura menções `@toolName` no checkpoint para decidir se planeja ferramentas.
- **Copywriter** — interpreta momento, tom e próximo passo com base no checkpoint.
- **Smart Follow-Up** — usa checkpoint para entender pendência, temperatura e alavanca de retomada.

Portanto, o Checkpoint deve focar em **como a IA age**, não no que o produto é. NÃO repita no checkpoint informações que já estão cobertas pelas FAQs (preço detalhado, lista de módulos, garantia, etc.) — isso é redundante e desperdiça tokens. Repita informação das FAQs apenas quando ela for essencial para uma regra de comportamento (ex: "Se o lead perguntar sobre parcelamento, ofereça primeiro 12x antes do à vista").

### Rico em Instrução, Enxuto em Repetição
- O Checkpoint Manager **substitui o arquivo inteiro** a cada atualização — ele não acumula. Se a instrução não estiver lá, a IA não sabe.
- O Copywriter (sub-agente que gera a resposta final) se baseia no checkpoint para interpretar o momento da conversa. Sem contexto psicológico e regras de condução claras, ele vira genérico.
- O Integration Manager só executa ferramentas se o checkpoint mencionar a tool explicitamente no formato correto.
- O Smart Follow-Up precisa que o checkpoint deixe claro status, pendência, temperatura do lead, alavanca de valor e próximo passo.
- **NÃO RESUMA DEMAIS as instruções de comportamento.** Preserve contexto psicológico do avatar, lógica de etapas e regras de condução ricamente detalhadas. A economia inteligente de tokens vem de cortar repetição de FAQs, não de cortar instruções de comportamento.

### Estrutura Base do Checkpoint
```markdown
# CHECKPOINT DA CAMPANHA: [Nome da Campanha]

## 1. CONTEXTO E MISSÃO
- Papel do Agente: [identidade da IA na campanha]
- Objetivo Principal: [O que precisa acontecer no fim]
- Mensagem de Abertura Enviada (Para a IA saber de onde começa):
"Olá, tudo bem? ..."

## 2. INFORMAÇÕES GERAIS E LINKS
- Link Vendas: {{link_vendas}}
- Suporte: {{link_suporte}}
(Liste variáveis aqui)

## 3. DIRETRIZES GERAIS DE COMUNICAÇÃO
- Tom: [Institucional / Descontraído / Médico / etc.]
- O que o AI Não deve fazer: [Ex: Prometer bônus acabados]
- Não usar emojis.

## 4. ROTEADOR DE ESTADO DO LEAD
- [ ] Intenção de compra: enviar link imediatamente, sem nova pergunta diagnóstica.
- [ ] Dúvida factual: responder pela FAQ Produto e reconectar ao próximo passo.
- [ ] Objeção: validar a trava, usar FAQ Playbook e avançar para decisão.
- [ ] Ambivalência: fazer uma pergunta única de trava.
- [ ] Problema operacional: resolver ou acionar suporte/tool e retomar objetivo da campanha.
- [ ] Recusa clara: respeitar e encerrar sem insistência.

## 5. PONTE DE VENDA
- Dor/interesse do lead:
- Objeção provável:
- Custo de não agir:
- Benefício central do produto:
- Próximo passo desejado:

## 6. FLUXO PRINCIPAL (RAR / SPIN Enxuto / Aniquilador Assertivo)
### ETAPA 1: XXXXX
- Objetivo: ...
- Como agir: ...
- [ ] Ação 1
- [ ] Ação 2

### ETAPA 2: XXXXX
(etc)

## [VARIÁVEIS DE SISTEMA UTILIZADAS NO CHECKPOINT]
- {{link_vendas}}: [URL real]
- {{link_suporte}}: [URL real]
(etc)
```

### Regras de Formatação do Checkpoint
- **PROIBIDO asteriscos (`**` ou `*`) e emojis!** A plataforma falha ao renderizá-los.
- Formate usando apenas Markdown limpo (`#`, `##`, listas com `- [ ]`).
- Adicione expressamente "Não usar emojis." nas limitações do agente.
- Liste TODAS as variáveis no rodapé sob `[VARIÁVEIS DE SISTEMA UTILIZADAS NO CHECKPOINT]`.
- **SEMPRE escreva o Checkpoint com acentuação pt-br correta.** Nunca remova acentos (é, ã, ç, á, ú, õ, etc.).

---

## 3. Mensagens de Disparo (WhatsApp) — A Porta de Entrada

A Abertura e os FUPs são o segundo artefato mais crítico da campanha. Se a abertura não gerar resposta do lead, **a IA nunca entra em ação** e todo o resto (FAQs, Checkpoint, agente) é inútil. A abertura é a única chance de captar a atenção.

### Por Que a Abertura e Tao Importante
- O lead recebe dezenas de mensagens por dia no WhatsApp. A abertura compete com tudo isso.
- Uma abertura genérica ("Oi, tudo bem? Vi que você se interessou...") é ignorada. Uma abertura com gancho específico (dor, preço, urgência, benefício concreto) gera resposta.
- O tom da abertura define a expectativa do lead para toda a conversa. Se começar robótico, o lead já trata como spam.
- A abertura deve ser coerente com o tipo de campanha e o agente selecionado.

### Estrutura das Mensagens de Disparo

**Abertura (1a mensagem — a mais importante)**
- Deve ter um gancho claro: dor, preço, urgência ou benefício concreto
- Cumprimento natural (nunca começar direto com "Tudo bem?")
- Não usar emoji na abertura de janela/template inicial
- CTA isolado no último parágrafo
- Se houver deadline de preço: use preço + urgência
- Se ticket for perpétuo/fixo: reconexão emocional primeiro, preço depois

**Exemplo — Abandono de Carrinho com Escassez:**
"Oi! Tudo bem?
Vi que voce chegou na pagina de [Produto] mas acabou nao finalizando.
Lembrando que os [Entregáveis/Benefícios] estão disponíveis com o valor de [Preço X] apenas até [Data], depois vai para [Preço Y].
Quer ajuda para garantir sua vaga?"

**FUP 1 (Foco Valor — reforco de beneficios)**
"Oi, passando só para lembrar que além de todo o material das aulas, o acesso garante também [Benefício 2] e [Benefício 3].
Se tiver qualquer instabilidade travando sua matrícula, me avisa!"

**FUP 2 (Despedida/Ultima Escassez — ultimo contato)**
"O link com a condição exclusiva fecha em algumas horas.
Vou deixar o atalho aqui caso você já tenha se decidido:
👉 [URL completa sem variavel ou {{link_vendas}} se o disparo for interno]
Estou no suporte ate o fechamento caso precise."

---

## 4. Uso de Imagens e Provas Sociais nas FAQs

Quando a campanha possuir imagens de prova social (antes/depois, resultados de clientes, fotos de produto, etc.), essas imagens podem ser enviadas automaticamente durante a conversa através de FAQs com variáveis de arquivo.

### Como Funciona na Plataforma

Na plataforma AWSales, ao criar uma FAQ, é possível anexar um arquivo (imagem) e atribuir um nome de variável a ele (ex: `imagem1`). Na resposta da FAQ, basta referenciar `{{imagem1}}` para que a IA envie a imagem junto com o texto.

### Como Criar FAQs com Imagens

1. A Pergunta da FAQ deve refletir a intenção real do lead na linguagem coloquial dele (ex: "Tem como ver um antes e depois?", "O resultado fica natural?", "Tem foto de como fica?").
2. A Resposta deve contextualizar a imagem antes de referenciá-la — nunca mandar a foto solta. Explique brevemente o que o lead está vendo e conecte ao benefício do produto/serviço.
3. No final da resposta, inclua a variável `{{nomeVariavel}}` para disparar o envio da imagem.
4. Não use todas as imagens disponíveis em uma única FAQ. Distribua entre FAQs com intenções diferentes para maximizar os gatilhos de busca semântica.

### Exemplo Prático (Clínica Odontológica — Lentes de Porcelana)

**FAQ 1:**
- Pergunta: "Tem como ver um antes e depois de lentes de porcelana?"
- Resposta: "Olha só esse resultado de um paciente da clínica. Essa transformação foi feita com lentes de porcelana em apenas 3 consultas, preservando o dente natural. Cada caso é personalizado na cor e formato. Na avaliação gratuita o profissional mostra como ficaria no seu caso. {{imagem1}}"

**FAQ 2:**
- Pergunta: "O resultado das lentes fica natural ou parece artificial?"
- Resposta: "Fica completamente natural. A cor e o formato são personalizados pra cada paciente, justamente pra combinar com o rosto e a pele. Olha esse exemplo de um caso real. {{imagem2}}"

### Regras Importantes

- As imagens são exclusivas das FAQs. NÃO vão no checkpoint nem no texto complementar.
- Links de imagens (Drive, URLs) NÃO devem ir no insumo limpo — a FAQ não acessa links externos, apenas arquivos anexados diretamente na plataforma.
- Limite de 1 imagem por FAQ para não sobrecarregar a mensagem.
- A variável da imagem só funciona se o arquivo foi anexado e nomeado corretamente na plataforma.

---

## 5. Follow-Up Inteligente (Configuração na Plataforma)

A plataforma AWSales possui um sistema de Follow-Up Inteligente que substitui os FUPs manuais/estáticos. Ele analisa automaticamente conversas onde o lead parou de responder e decide se, quando e como enviar um follow-up personalizado.

### Quando Usar

Use Follow-Up Inteligente em vez de mensagens estáticas de FUP quando a campanha exigir personalização no retorno (o sistema lê o contexto da conversa e gera uma mensagem sob medida). Isso é especialmente útil em campanhas SDR e de Venda Direta onde cada lead para em um ponto diferente do funil.

### Como Funciona

O sistema roda 3 prompts em sequência:
1. Análise de Necessidade (SEND ou SKIP) — Decide se faz sentido enviar.
2. Agendamento (Timing) — Decide o momento ideal para enviar.
3. Mensagem Personalizada — Gera a mensagem com base no ponto exato onde a conversa parou.

O Follow-Up Inteligente lê transcrição + checkpoint. Por isso, em campanhas de venda, o checkpoint precisa deixar fácil para ele entender:
- Status atual: link enviado, objeção ativa, pagamento travado, material enviado, lead pediu tempo, recusa clara.
- Temperatura: HOT, WARM ou COLD, quando isso estiver evidente.
- Pendência: o que ficou em aberto e qual seria o próximo avanço natural.
- Alavanca de valor: principal dor, desejo, economia, oportunidade ou benefício que justifica retomar.

### O Que o CS Preenche

Na configuração da campanha, existem 3 campos de orientação que são concatenados ao final de cada prompt base. O CS preenche com regras específicas da campanha:

1. Orientações para mensagens personalizadas: Tom de voz, ganchos da campanha, CTA padrão, o que pode/não pode dizer.
2. Orientações sobre a necessidade de follow-ups: Cenários para ENVIAR vs NÃO ENVIAR, sinais de desqualificação.
3. Orientações sobre o agendamento de follow-ups: Timing por etapa do funil, horários prioritários, regras de urgência.

### Onde Encontrar os Prompts Base

Os prompts base completos (não editáveis na plataforma) estão documentados em `Estrutura/FOLLOWUP_INTELIGENTE.md` para referência.

### Entrega na Campanha

Ao criar ou otimizar uma campanha que use Follow-Up Inteligente, entregue as orientações dos 3 campos no arquivo `MENSAGENS_FOLLOWUP.md` da pasta da campanha, prontas para o CS copiar e colar na plataforma.
