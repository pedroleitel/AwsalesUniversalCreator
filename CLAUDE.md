# CLAUDE.md — AWSales Universal Campaign Creator

Contexto persistente deste projeto. Sistema universal para criação de campanhas de bots de WhatsApp AI na plataforma AWSales.

> **Instrução para o Claude:** quando o usuário pedir para lembrar algo, registrar feedback, ou salvar contexto persistente neste projeto, **atualize este arquivo diretamente** em vez de criar memórias em `~/.claude/projects/.../memory/`. Este arquivo é versionado no Git e sincroniza entre máquinas; a pasta `memory/` não.

## Projeto

Este projeto é um sistema universal para criação de campanhas na plataforma AWSales — bots de WhatsApp com IA para vendas, recuperação, lançamentos, CS e SDR.

**Artefatos por campanha:**
1. Texto Complementar (Produto + Playbook) — preenche lacunas dos inputs do cliente, direciona auto-geração de FAQs
2. Checkpoint — o mais crítico; controla comportamento/fluxo do bot via sub-agente Checkpoint Manager
3. Mensagens de Disparo — mensagem de abertura + FUPs para WhatsApp

**Fluxo obrigatório de 3 fases:**
- Fase 1: Ler inputs → gerar textos complementares → PARAR e aguardar FAQs
- Fase 2: Avaliar FAQs → criar Checkpoint → criar Mensagens
- Fase 3: Otimizações (ler tudo primeiro, aplicar diretamente, validar formatação, checar FAQs)

**Arquitetura da plataforma:** Dois sub-agentes — Checkpoint Manager (comportamento/fluxo) e Information Manager (busca semântica nas FAQs). Checkpoint NÃO deve repetir conteúdo das FAQs.

**Regras críticas:** Zero asteriscos/emojis no checkpoint, FAQs em linguagem coloquial do lead (busca semântica), links como variáveis no checkpoint (`{{link_vendas}}`), preço parcelado antes do preço à vista, Tools referenciadas como `@tool_name`.

## Bot sem nome

Nunca atribuir nome pessoal ao bot de IA em checkpoints ou mensagens. Manter identidade neutra (ex: "assistente da equipe de experiência"). Nomes de pessoas reais (consultores) só para referências de escalonamento, não para o bot.

**Why:** O bot não deve se passar por um membro específico da equipe.

**How to apply:** No checkpoint "Papel do Agente", descrever o papel sem nome. Em mensagens, usar saudações sem se apresentar por nome.

## FAQs sem variáveis ou links

FAQs na plataforma AWSales nunca devem conter links externos nem variáveis de navegação (`{{link_vendas}}`, `{{link_reagendamento}}`, etc.). Essas variáveis vão exclusivamente no Checkpoint. FAQs são conteúdo puro para busca semântica, com exceção de variáveis de arquivo/mídia usadas para disparar prova social.

**Why:** Links/integrações são tratados no nível do checkpoint/plataforma, não na base de conhecimento.

**How to apply:** Ao escrever Texto Complementar para geração de FAQs, focar só em conteúdo (o que são as coisas, como funcionam, objeções, tom). Nunca incluir variáveis de navegação ou URLs em textos complementares voltados para extração de FAQ. Se a intenção for disparar imagem de prova social, seguir a exceção documentada na seção abaixo.

## Follow-Up Inteligente

A plataforma AWSales tem um recurso chamado "Follow-Up Inteligente" que substitui mensagens de FUP estáticas. É configurado por campanha no painel da plataforma.

O sistema roda 3 prompts automáticos: (1) Análise de necessidade (SEND/SKIP), (2) Timing ideal, (3) Geração de mensagem personalizada.

O CS preenche 3 campos de "Orientações adicionais" que são concatenados ao final de cada prompt base. As orientações são específicas por campanha.

Prompts base documentados em `Estrutura/FOLLOWUP_INTELIGENTE.md`. Orientações por campanha ficam no `MENSAGENS_FOLLOWUP.md` de cada campanha.

**FUPs inteligentes NÃO vão no checkpoint.** São configurados direto no painel da plataforma.

## Campanha Suporte EQJC (estado vivo)

Campanha "CR Treinamentos | Suporte | Os Exercícios Quânticos de Jesus Cristo" está em ciclo de otimização baseado em relatório de 455 atendimentos (80.9% resolvidos pela IA, 18.7% escalados) e análise de 33 casos de escalonamento.

Estado (última atualização 2026-04-17): checkpoint reescrito, FAQs Produto e Playbook otimizadas em documentos de referência (não aplicados na plataforma ainda). 12 blocos de dúvidas enviados ao cliente em PDF — aguardando respostas para fechar gaps restantes.

**How to apply:** Se o usuário mencionar "EQJC", "Suporte Paulo Aguiar", "fechar gaps do relatório" ou similar, ler `CR Treinamentos/Suporte/CONTEXTO_E_PROXIMOS_PASSOS.md` primeiro — contém o handoff completo.

Entregáveis vivos (editar conforme cliente responder):
- `CR Treinamentos/Suporte/Checkpoint/checkpoint.md`
- `CR Treinamentos/Suporte/FAQs/Otimização FAQs - Produto.md`
- `CR Treinamentos/Suporte/FAQs/Otimização FAQs - Playbook.md`

Variáveis atuais: `link_suporte`, `link_area_de_membros`, `link_do_grupo`, `link_pagamento_alt`, `link_consultor_completo`, `link_consultor_21`, `link_reembolso_7d`, `link_reembolso_21d`, `link_matricula`, `link_ascensao_grupo`, `link_ascensao_youtube`, `lead_email`.

## Imagens de prova social via FAQ

Quando a campanha tiver imagens de prova social (antes/depois, resultados de clientes, prints, etc.), criar FAQs específicas para capturar intenções como "quero ver resultado", "tem foto?" ou "o resultado fica natural?" e disparar a mídia no momento certo da conversa.

**Why:** As FAQs funcionam por busca semântica. Se não existir uma pergunta/resposta que cubra a intenção do lead, a imagem cadastrada na plataforma nunca será enviada, mesmo que o arquivo já esteja disponível.

**How to apply:** Criar 1-2 FAQs de Produto na linguagem do lead, contextualizar a imagem antes de referenciá-la, usar a variável de arquivo no final da resposta (ex: `{{imagem1}}`) e distribuir as imagens entre intenções diferentes. As imagens ficam nas FAQs, não no checkpoint nem no texto complementar, e os links brutos dos arquivos não devem entrar no insumo limpo.

## Formato de menção `@tool` no checkpoint

Toda referência a tool no checkpoint DEVE usar o formato exato `Utilize a tool para [ação] @nome_da_tool` (do guia `Estrutura/Guia — Criar Tool Personalizada na Awsales.md`). Nunca usar `@tool` em definições, listagens, checklists, parênteses ou referências a eventos passados.

**Why:** O Integration Manager (Gemini 2.5 Flash normal — modelo caro) escaneia o checkpoint procurando `@toolName` em cada turno para planejar execuções. Menções fora do formato correto (ex: "Após sucesso da @criar_agendamento", "Use @consultar_horarios", "(@registrar_lead_no_rp)" em checklist) podem fazer ele:
- Planejar execução desnecessária da tool, gastando tokens à toa.
- Em casos críticos, executar a tool indevidamente — risco real, não teórico (ex: duplicar agendamento por causa de uma referência a evento passado).

**How to apply:**
- Em invocações reais (Etapas 4, 5 etc.): "Utilize a tool para [ação descritiva] @nome_da_tool"
- Em definições/regras gerais sobre tools: descrever sem `@` (ex: "Tool de consulta de horários: usar SEMPRE antes de propor horários")
- Em checklists de pré-requisitos: omitir o `@` (ex: "- [ ] Lead já registrado no RP")
- Em referências a eventos passados: descrever a ação sem o handle (ex: "Após sucesso na criação do agendamento")
- Validar com `grep '@\w+' checkpoint.md` ao final, conferindo cada ocorrência.

## Otimização de custos AWSales — metodologia

Quando o usuário pedir para reduzir custos de uma campanha, seguir este diagnóstico antes de cortar qualquer coisa do checkpoint.

**Why:** A intuição padrão é "checkpoint grande = Checkpoint Manager caro". Está errado. O Checkpoint Manager roda em Gemini 2.5 Flash Lite (barato). Quem realmente paga o tamanho do checkpoint são os agentes que carregam `{checkpoints}` no prompt em cada turno e usam modelos caros: **Copywriter (Gemini 3 Flash), Integration Manager (Gemini 2.5 Flash normal), Smart FUP Análise/Template/Mensagem**. Esses 4 agentes costumam somar ~80% do gasto.

**How to apply:**
1. **Pedir 3 inputs:** (a) tabela de custos da campanha em xlsx, (b) o agente usado da campanha em txt (mostra qual modelo cada sub-agente usa), (c) checkpoint atual.
2. **Agregar custos por `fee_name`** no xlsx (Python + openpyxl) e mapear modelo → agente usando o txt do agente. Identificar os 2-3 modelos mais caros e quem os consome.
3. **Confirmar com o usuário** o diagnóstico antes de cortar qualquer coisa.
4. **Cortar do checkpoint o que já está nas FAQs:** preço, especificações de produto, endereço, contornos prontos de objeção, contraindicações, scripts longos. Manter no checkpoint só comportamento e fluxo (etapas, gates, ordem de tools).
5. **Conferir conflitos nas FAQs** (regra do prompt universal — só criar `Otimização FAQs.md` se houver conflito ou gap genuíno).
6. **Validar formato `@tool`** (ver seção acima) — etapa obrigatória ao final.
7. **Recomendar monitoramento de 7 dias** após aplicar e medir de novo.

Caso real de referência: SDR Lucas Firmino (D'Leon, abr/2026). Checkpoint cortado de 22.230 para 11.834 chars (47%). Diagnóstico inicial: Gemini 2.5 Flash normal era 48% do gasto (não Lite, como se imaginava). Aplicado em 28/04/2026.

## Campanha SDR Lucas Firmino — D'Leon (estado vivo)

Campanha "SDR - Lucas Firmino" (D'Leon By Lucas Firmino, BH) — agendamento de avaliação presencial gratuita para Lentes de Porcelana. Agente da plataforma: Qualify & Schedule. Tipo: receptiva (lead inicia).

Estado (última atualização 2026-04-28): checkpoint reescrito (47% menor) e validado contra regras de formatação + formato `@tool`. Adicionada 1 FAQ nova no Playbook ("atendimento por texto") — aguardando o usuário aplicar na plataforma. Acompanhar custo em 7 dias para confirmar redução projetada (~R$ 280-370 nos próximos 19 dias).

Tools da campanha (Plataforma Uno): `@consultar_horarios_disponiveis`, `@registrar_lead_no_rp`, `@criar_agendamento`. Variáveis do checkpoint: `{{foto_antes_depois_1}}`, `{{foto_antes_depois_2}}`, `{{link_suporte}}`.

Decisão pendente sobre Smart FUP: estimativa atual ~13-17% do gasto total, esperado cair para ~7-10% após otimização do checkpoint. Reavaliar substituição por FUP estático apenas se ainda for >15% após 1 semana.

**How to apply:** Se o usuário mencionar "Lucas Firmino", "D'Leon", "SDR lentes" ou similar, ler `Lucas Firmino/SDR/Checkpoint/Checkpoint.md` e `Lucas Firmino/SDR/FAQs/Otimização FAQs - Playbook.md` primeiro. Para análise de custos, processar `Lucas Firmino/SDR/Tabela de detalhes/Custos da campanha - Lucas Firmino.xlsx` e cruzar com `Lucas Firmino/SDR/Tabela de detalhes/Qualify & Schedule - Agente.txt`.
