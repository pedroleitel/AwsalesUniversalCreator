# Playbook — Relatório de Suporte Falcão das Milhas

## O que é esse relatório

Relatório de performance da IA de suporte da campanha Falcão das Milhas. Conecta dados operacionais (atendimento, resolução, handoff) com impacto financeiro (custo da IA, retenção, reembolso). O destinatário é o João (cliente), que usa o relatório em reunião de liderança.

---

## Tabelas que você precisa puxar

### 1. Optimization Hub

- **Fonte**: Plataforma Awsales → exportar relatório da campanha de suporte.
- **Formato**: `.xlsx`
- **O que tem**: Visão consolidada da campanha — total de conversas, resolvidas pela IA, resolvidas por humano, abandonadas, CSAT, volume por dia, tópicos mais frequentes e fricções.
- **Por que importa**: É o resumo-mãe. Dele saem os indicadores principais do relatório (deflexão, taxa de resolução, CSAT).

---

### 2. Tactical Analysis

- **Fonte**: Banco de dados → tabela `tactical_analysis` (ou equivalente).
- **Formato**: `.xlsx` (query result)
- **O que tem**: Uma linha por conversa analisada. Campos principais:
  - `Conversation ID`, `Campaign ID`, `Created At`, `Analyzed At`
  - `Resolution Status`, `Had Handoff`, `Handoff Reason`
  - `Topic Primary`, `Topic Secondary`, `Topic Tags`
  - `Is Product Friction`, `Product Friction Feature`
  - `Rag Missing Info`, `Rag Accuracy`
  - `Ai Cost Usd ($)`
  - `Duration Total Seconds`, `Duration Ai Only Seconds`, `Duration Human Handling Seconds`
  - `Csat Score`, `Summary`
- **Por que importa**: Custo por conversa, temas recorrentes, tempo de atendimento, lacunas da base de conhecimento e fricções de produto. É a tabela mais rica para análise detalhada.

---

### 3. Handoff Snapshots

- **Fonte**: Banco de dados → tabela `handoff_snapshots` (ou equivalente).
- **Formato**: `.xlsx` (query result)
- **O que tem**: Snapshot do momento exato em que a IA transferiu para humano. Campos principais:
  - `Conversation ID`, `Handoff Ticket ID`
  - `Handoff Type`, `Handoff Reason`, `Handoff Summary`
  - `Rag Last Query`, `Rag Results`, `Rag Score`
  - `Last Ai Response`, `Last User Message`
  - `Conversation Transcription`
- **Por que importa**: Entender **por que** a IA transferiu. Permite classificar handoffs em evitáveis vs inevitáveis, identificar gaps da base de conhecimento e propor melhorias no checkpoint.

---

### 4. Handoff Tickets

- **Fonte**: Banco de dados → tabela `handoff_tickets` (ou equivalente).
- **Formato**: `.xlsx` (query result)
- **O que tem**: Registro do que aconteceu **depois** da transferência. Campos principais:
  - `Conversation ID`, `Handoff Reason`, `Handoff Summary`
  - `Priority`, `Priority Score`, `Status`
  - `Assigned At`, `Resolved At`, `Sla Breached`
  - `Return Count`, `Last Return Reason`
- **Por que importa**: Medir qualidade pós-handoff — tickets resolvidos, tempo de resolução, SLA, retornos por problema não resolvido.

---

### 5. Conversas completas da campanha

- **Fonte**: Banco de dados → tabela de mensagens/conversas da campanha de suporte.
- **Formato**: `.xlsx` (query result)
- **O que tem**: Todas as mensagens das conversas. Campos principais:
  - `conversation_id`, `conversation_agent_session_id`
  - `created_at`, `sender` / `role`
  - `message` / `content`
  - `is_handoff`, `handoff_reason`
  - `customer_phone`, `customer_email`
- **Por que importa**: Reconstruir conversas completas, identificar pedidos de cancelamento/reembolso, verificar se houve retenção (cliente desistiu de cancelar após orientação da IA). É essencial para a análise qualitativa e para cruzar com dados de reembolso.

---

### 6. Tabela de reembolso / checkout (se disponível)

- **Fonte**: Sistema de checkout do cliente (pedir acesso ao João).
- **Formato**: `.xlsx` ou `.csv`
- **O que tem**: Pedidos de reembolso com status. Campos ideais:
  - ID do pedido, e-mail, telefone, produto, valor
  - Data de compra, data de solicitação de reembolso
  - Motivo, status final (reembolsado sim/não, retido sim/não)
- **Por que importa**: Calcular taxa de reembolso atual, comparar com baseline histórico (22,5%–23%), calcular valor recuperado/preservado. **Sem essa tabela, a parte financeira do relatório fica como pendência.**

---

## Resumo rápido

| # | Tabela | Responde a... |
|---|--------|---------------|
| 1 | Optimization Hub | Indicadores gerais (deflexão, CSAT, volume) |
| 2 | Tactical Analysis | Custo, temas, resolução, fricções |
| 3 | Handoff Snapshots | Por que a IA transferiu |
| 4 | Handoff Tickets | O que aconteceu depois do handoff |
| 5 | Conversas completas | Retenção, padrões, análise qualitativa |
| 6 | Reembolso / checkout | Taxa de reembolso, valor recuperado |

---

## Dado financeiro fixo

- Custo total da IA no mês (informado pelo cliente): usar o valor atualizado que o João passar.
- Baseline histórico de reembolso: **22,5% a 23%** (referência dos últimos 4 meses).

## Filtro de período

- Filtrar tudo por `Created At` ou `Analyzed At`.
- Separar: recorte novo (desde último relatório) + acumulado do mês.
