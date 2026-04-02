# Exemplos e Estrutura de Artefatos AWSALES

Este documento possui os guias de estrutura para criação de textos e checkpoints para a plataforma Awsales de forma universal.

## 0. O Que é Uma Campanha na AWSales?

Uma campanha na plataforma Awsales é, em essência, a junção de duas peças principais:
1. **O Checkpoint:** É o "cérebro" das etapas do bot (funil). Ele diz para onde a conversa deve ir, o que focar no momento e quais são os passos lógicos.
2. **A Base de Conhecimento (FAQs Produto + Playbook):** São as informações passivas da plataforma.
   - **MUITO IMPORTANTE:** As FAQs funcionam via **Busca Semântica (RAG)**. Quando o lead (cliente) envia uma mensagem no WhatsApp, a IA compara o contexto da mensagem com o banco de FAQs buscando as 5 mais relevantes.
   - Portanto, ao avaliar ou escrever uma FAQ, **a Pergunta (Título da FAQ) precisa ter a intenção exata da linguagem coloquial de um lead**, e não perguntas robóticas ou de bastidores. Exemplo: "O que ganho comprando isso?" será acionado se o lead disser "qual a vantagem?", "tem algum bônus?", etc. Sempre avalie FAQs sob a ótica da intenção do lead.

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

---

## 2. Checkpoint — O Artefato Mais Crítico da Campanha

O Checkpoint é o artefato mais importante de toda a campanha. Ele é literalmente o **prompt que alimenta o sub-agente Checkpoint Manager** dentro da plataforma AWSales. É ele quem diz ao bot:
- Em que etapa da conversa ele está
- Como deve se comportar em cada momento
- Quando avançar, quando recuar, quando fechar
- Quais regras nunca quebrar

Se o Checkpoint for fraco, genérico ou resumido demais, o bot perde o controle do funil, erra o tom, não sabe quando avançar etapa e a conversa morre. **Um Checkpoint ruim invalida todo o resto** (FAQs perfeitas e abertura matadora não salvam um bot sem direção).

### Checkpoint = Comportamento e Fluxo (NÃO Conhecimento)
A plataforma tem dois sub-agentes separados:
- **Checkpoint Manager** — controla fluxo e comportamento do bot (alimentado pelo Checkpoint)
- **Information Manager** — busca informações nas FAQs por semântica (alimentado pela Base de Conhecimento)

Portanto, o Checkpoint deve focar em **como o bot age**, não no que o produto é. NÃO repita no checkpoint informações que já estão cobertas pelas FAQs (preço detalhado, lista de módulos, garantia, etc.) — isso é redundante e desperdiça tokens. Repita informação das FAQs apenas quando ela for essencial para uma regra de comportamento (ex: "Se o lead perguntar sobre parcelamento, ofereça primeiro 12x antes do à vista").

### Rico em Instrução, Enxuto em Repetição
- O Checkpoint Manager **substitui o arquivo inteiro** a cada atualização — ele não acumula. Se a instrução não estiver lá, o bot não sabe.
- O Copywriter (sub-agente que gera a resposta final) se baseia no checkpoint para interpretar o momento da conversa. Sem contexto psicológico e regras de condução claras, ele vira genérico.
- **NÃO RESUMA DEMAIS as instruções de comportamento.** Preserve contexto psicológico do avatar, lógica de etapas e regras de condução ricamente detalhadas. A economia inteligente de tokens vem de cortar repetição de FAQs, não de cortar instruções de comportamento.

### Estrutura Base do Checkpoint
```markdown
# CHECKPOINT DA CAMPANHA: [Nome da Campanha]

## 1. CONTEXTO E MISSÃO
- Papel do Agente: [Quem o bot finge ser]
- Objetivo Principal: [O que precisa acontecer no fim]
- Mensagem de Abertura Enviada (Para o bot saber de onde começa):
"Olá, tudo bem? ..."

## 2. INFORMAÇÕES GERAIS E LINKS
- Link Vendas: {{link_vendas}}
- Suporte: {{link_suporte}}
(Liste variáveis aqui)

## 3. DIRETRIZES GERAIS DE COMUNICAÇÃO
- Tom: [Institucional / Descontraído / Médico / etc.]
- O que o AI Não deve fazer: [Ex: Prometer bônus acabados]
- Não usar emojis.

## 4. ETAPAS DO FUNIL (Exemplo: SPIN ou Aniquilador)
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

A Abertura e os FUPs sao o segundo artefato mais critico da campanha. Se a abertura nao gerar resposta do lead, **o bot nunca entra em acao** e todo o resto (FAQs, Checkpoint, agente) e inutil. A abertura e a unica chance de captar a atencao.

### Por Que a Abertura e Tao Importante
- O lead recebe dezenas de mensagens por dia no WhatsApp. A abertura compete com tudo isso.
- Uma abertura generica ("Oi, tudo bem? Vi que voce se interessou...") e ignorada. Uma abertura com gancho especifico (dor, preco, urgencia, beneficio concreto) gera resposta.
- O tom da abertura define a expectativa do lead para toda a conversa. Se comecar robotico, o lead ja trata como spam.
- A abertura deve ser coerente com o tipo de campanha e o agente selecionado.

### Estrutura das Mensagens de Disparo

**Abertura (1a mensagem — a mais importante)**
- Deve ter um gancho claro: dor, preco, urgencia ou beneficio concreto
- Cumprimento natural (nunca comecar direto com "Tudo bem?")
- CTA isolado no ultimo paragrafo
- Se houver deadline de preco: use preco + urgencia
- Se ticket for perpetuo/fixo: reconexao emocional primeiro, preco depois

**Exemplo — Abandono de Carrinho com Escassez:**
"Oi! Tudo bem? 😊
Vi que voce chegou na pagina de [Produto] mas acabou nao finalizando.
Lembrando que os [Entregaveis/Beneficios] estao disponiveis com o valor de [Preco X] apenas ate [Data], depois vai para [Preco Y].
Quer ajuda para garantir sua vaga?"

**FUP 1 (Foco Valor — reforco de beneficios)**
"Oi, passando so para lembrar que alem de todo o material das aulas, o acesso garante tambem [Beneficio 2] e [Beneficio 3].
Se tiver qualquer instabilidade travando sua matricula, me avisa!"

**FUP 2 (Despedida/Ultima Escassez — ultimo contato)**
"O link com a condicao exclusiva fecha em algumas horas.
Vou deixar o atalho aqui caso voce ja tenha se decidido:
👉 [URL completa sem variavel ou {{link_vendas}} se o disparo for interno]
Estou no suporte ate o fechamento caso precise."

---

## 4. Uso de Imagens e Provas Sociais nas FAQs

Quando a campanha possuir imagens de prova social (antes/depois, resultados de clientes, fotos de produto, etc.), essas imagens podem ser enviadas automaticamente durante a conversa através de FAQs com variáveis de arquivo.

### Como Funciona na Plataforma

Na plataforma AWSales, ao criar uma FAQ, é possível anexar um arquivo (imagem) e atribuir um nome de variável a ele (ex: `imagem1`). Na resposta da FAQ, basta referenciar `{{imagem1}}` para que o bot envie a imagem junto com o texto.

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
