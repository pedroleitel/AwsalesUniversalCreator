# MEMÓRIA — Way Group (estado vivo)

Última atualização: 2026-07-16, fim do dia. Este arquivo é o ponto de entrada para retomar o projeto em qualquer máquina/sessão. Ler junto: `DADOS OPERACIONAIS - Way Group.md` (fatos operacionais: links, preços, contatos, funil, CRM).

## O que é o projeto

Cliente novo Way Group (Lucas Arruda, "Embaixador Amazon Brasil", BH). Ecossistema Amazon FBA. Demanda do chefe: 4 campanhas para o funil do VTD:

1. REC de vendas VTD (recuperação de checkout/indeciso/reembolso)
2. Onboarding VTD (ativação pós-compra, 50% dos compradores)
3. SDR pós-compra do VTD (outros 50%, abordagem comercial direta)
4. SDR pós-aula 2 (os 50% onboardados, gatilho = assistiu 2 primeiras aulas)

Decisão de arquitetura (validada): 3 bases de conhecimento — REC (tipo Recuperação), Onboarding (tipo Customer Success), SDR compartilhada pelos 2 SDRs (tipo SDR). Diferença entre os SDRs vive só no checkpoint/abertura. Campanhas Venda FAS e Venda CNPJ são do Cardoso (Awsales), não nossas — mas a base SDR já carrega o conteúdo delas.

## O que já foi feito (2026-07-16)

1. Estrutura de pastas criada (padrão FDS: pasta mãe = base compartilhada).
2. Insumos coletados, convertidos e organizados nas pastas `Insumos/` de cada campanha. PDF do FAS era só imagem: extração manual página a página salva em `SDR pós-VTD/Insumos/FAS 2026 - página de vendas EXTRAÍDA.txt`.
3. FASE 1 completa: 6 textos complementares (Produto + Playbook × 3 bases), nas pastas `Texto Complementar/`. Validados contra os prompts de extração.
4. Usuário criou as 3 bases na plataforma e gerou as FAQs (91 no total). Prints em PDF nas pastas `FAQs/` (+ .txt extraídos).
5. FASE 2 parte 1 — avaliação das FAQs: 5 edições, salvas prontas para copiar/colar em:
   - `SDR pós-VTD/FAQs compartilhadas/Otimização FAQs - Produto.md` (3 edições)
   - `Recuperação de vendas - VTD/FAQs/Otimização FAQs - Playbook.md` (1 edição)
   - `Onboarding - VTD/FAQs/Otimização FAQs - Playbook.md` (1 edição)
   ATENÇÃO: no momento da avaliação as FAQs estavam todas com status Inativo no painel — usuário precisa aplicar as 5 edições e ativar tudo.
6. FASE 2 parte 2 — 4 checkpoints criados e validados (zero asteriscos, zero emojis, caixas de marcação com critério observável + default seguro, variáveis descritas no rodapé):
   - `Recuperação de vendas - VTD/Checkpoint/Checkpoint.md`
   - `Onboarding - VTD/Checkpoint/Checkpoint.md`
   - `SDR pós-VTD/SDR pós-compra/Checkpoint/Checkpoint.md`
   - `SDR pós-VTD/SDR pós-aula 2/Checkpoint/Checkpoint.md`

## Próximo passo (retomar daqui)

1. Criar mensagens de abertura + FUPs das 4 campanhas (pastas `Mensagens/` de cada campanha, vazias ainda). As aberturas provisórias já estão embutidas na Seção 1 de cada checkpoint — as mensagens finais devem manter coerência com elas (ou atualizar o checkpoint junto). Abertura sem emoji; FUPs podem ter até 3.
2. Avaliar Follow-Up Inteligente vs FUP estático por campanha (se inteligente, criar `MENSAGENS_FOLLOWUP.md` com as orientações dos 3 campos).
3. Cobrar cliente/validar:
   - Zona cinzenta de capital R$ 3-5k (assumimos: ofertar FAS, call se pedir acompanhamento individual)
   - Gate do desconto FAS (assumimos: só após 2 objeções reais de preço + intenção de fechar na hora)
   - Prazo de estorno do reembolso; formas de pagamento do Assiny além de cartão (Pix/boleto?); elegibilidade exata do CNPJ grátis + 10 produtos
   - Aulas 12-15 do VTD ("Adicional"): comprador base tem acesso?
   - Docs citados e não recebidos: "Base de Conhecimento de Produto v1.4" e "Simulações de Conversa v1.0"
4. Quando a Awsales criar tools de agendamento/CRM (HighLevel via API), adicionar menção `@tool` no formato correto nos checkpoints SDR (hoje não há nenhuma tool nomeada — de propósito).
5. Go-live previsto: segunda 20/07 (100% das campanhas, combinado no grupo).

## Regras específicas deste cliente (não esquecer)

- Garantia do VTD: 7 dias incondicional + 120 dias de resultado (R$ 10 mil + loja ativa). NUNCA "30 dias" nem "primeira venda" (página de vendas está desatualizada).
- Preços só no checkpoint (base SDR é compartilhada): VTD 8x R$ 6,82 / R$ 47,90 · FAS 12x R$ 300,50 / R$ 2.997.
- Starter (R$ 5-10k) e Scale (R$ 15-25k): faixas são segredo interno do closer. IA nunca revela valor, faixa, piso nem meta de garantia.
- Bifurcação por capital: <R$ 1.500 CNPJ Gratuito · R$ 1.500-3.000 FAS venda direta · R$ 5.000+ call.
- SDR não quebra objeção de fechamento de Starter/Scale (vende a call de 30 min). No FAS ele fecha.
- Estrutura de objeção: ACOLHER → INVESTIGAR → REPOSICIONAR → AVANÇAR. Máx 2 insistências.
- Nunca perguntar limite de cartão. Nunca prometer Pix/boleto sem confirmação. Nunca falsa escassez. CNPJ grátis + 10 produtos sempre "sujeito às condições do programa".
- Horários de agendamento sempre picados (11h15, 15h25), 2 opções.
- Onboarding: ativação primeiro, relacionamento depois, ponte por último; nunca vender nas primeiras 48h.
