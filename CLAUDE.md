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

FAQs na plataforma AWSales nunca devem conter variáveis (`{{link_vendas}}`, `{{link_reagendamento}}`, etc.) ou links. Variáveis e links vão exclusivamente no Checkpoint. FAQs são conteúdo puro para busca semântica.

**Why:** Links/integrações são tratados no nível do checkpoint/plataforma, não na base de conhecimento.

**How to apply:** Ao escrever Texto Complementar para geração de FAQs, focar só em conteúdo (o que são as coisas, como funcionam, objeções, tom). Nunca incluir variáveis ou URLs em textos complementares voltados para extração de FAQ.

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
