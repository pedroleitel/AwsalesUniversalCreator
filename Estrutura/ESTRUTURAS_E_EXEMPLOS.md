# Exemplos e Estrutura de Artefatos AWSALES

Este documento possui os guias de estrutura para criação de textos e checkpoints para a plataforma Awsales de forma universal.

## 0. O Que é Uma Campanha na AWSales?

Uma campanha na plataforma Awsales é, em essência, a junção de duas peças principais:
1. **O Checkpoint:** É o "cérebro" das etapas do bot (funil). Ele diz para onde a conversa deve ir, o que focar no momento e quais são os passos lógicos.
2. **A Base de Conhecimento (FAQs Produto + Playbook):** São as informações passivas da plataforma.
   - **MUITO IMPORTANTE:** As FAQs funcionam via **Busca Semântica (RAG)**. Quando o lead (cliente) envia uma mensagem no WhatsApp, a IA compara o contexto da mensagem com o banco de FAQs buscando as 5 mais relevantes.
   - Portanto, ao avaliar ou escrever uma FAQ, **a Pergunta (Título da FAQ) precisa ter a intenção exata da linguagem coloquial de um lead**, e não perguntas robóticas ou de bastidores. Exemplo: "O que ganho comprando isso?" será acionado se o lead disser "qual a vantagem?", "tem algum bônus?", etc. Sempre avalie FAQs sob a ótica da intenção do lead.

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

## 2. Checkpoint (O Cerebro do Bot)

O Checkpoint tem uma estrutura universal que deve estar sempre em markdown elegante.

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
*(Liste variáveis aqui)*

## 3. DIRETRIZES GERAIS DE COMUNICAÇÃO
- Tom: [Institucional / Descontraído / Médico / etc.]
- O que o AI Não deve fazer: [Ex: Prometer bônus acabados]

## 4. ETAPAS DO FUNIL (Exemplo: SPiN ou Aniquilador)
### ETAPA 1: XXXXX
- Objetivo: ...
- Como agir: ...
➤ [ ] Ação 1
➤ [ ] Ação 2

### ETAPA 2: XXXXX
(etc)
```

---

## 3. Mensagens de Disparo (WhatsApp)

### Exemplo de Estrutura:
**Abertura (Abandono de Carrinho com Escassez)**
"Oi! Tudo bem? 😊
Vi que você chegou na página de [Produto] mas acabou não finalizando.
Lembrando que os [Entregáveis/Benefícios] estão disponíveis com o valor de [Preço X] apenas até [Data], depois vai para [Preço Y].
Quer ajuda para garantir sua vaga?"

**FUP 1 (Foco Valor)**
"Oi, passando só para lembrar que além de todo o material das aulas, o acesso garante também [Benefício 2] e [Benefício 3].
Se tiver qualquer instabilidade travando sua matrícula, me avisa!"

**FUP 2 (Despedida/Última Escassez)**
"O link com a condição exclusiva fecha em algumas horas.
Vou deixar o atalho aqui caso você já tenha se decidido:
👉 [URL completa sem variável ou {{link_vendas}} se o disparo for interno]
Estou no suporte até o fechamento caso precise."
