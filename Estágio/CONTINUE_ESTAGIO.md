# CONTINUE — Relatório Final de Estágio Pedro Henrique Leite Mendes

> **Para o Claude que está continuando este trabalho em outro computador.**
> Leia este arquivo INTEIRO antes de mexer em qualquer coisa. Ele tem todo o contexto que você precisa.

## Contexto do trabalho

O usuário (Pedro Henrique Leite Mendes) está fazendo estágio supervisionado obrigatório na **AwSales LTDA** desde 01/10/2025 e continua na empresa até hoje. Curso: **Engenharia de Controle e Automação**, **UNIFEI Campus Itabira**, Instituto de Ciências e Tecnologias.

Quem deveria fazer o relatório é o supervisor (Daniel Roscoe Oliveira, Gerente de Estratégia e Operações), mas ele autorizou Pedro a redigir e mandar para avaliação. O documento será compilado no **Overleaf** (pdfLaTeX). O destino final é a Coordenação Local de Estágios do Campus Itabira (Coordenador: Tiago Gaiba de Oliveira).

Orientador acadêmico: Prof. Ericson Marquiere Reis Silva (marquiere@unifei.edu.br).

## Arquivos existentes nesta pasta `Estágio/`

```
Estágio/
├── Arquivos que enviei/         # ENTRADA: PDFs ASSINADOS que o Pedro entregou na Coordenação
│   ├── 1._Termo_de_Compromisso_de_Estagio...pdf
│   ├── 3._Requerimento_de_Matricula...pdf
│   └── Modelo_de_atividades_-_Awsales...pdf
│
├── Arquivos templates/          # REFERÊNCIA: TEMPLATES OFICIAIS BRANCOS baixados do site da UNIFEI
│   ├── 6. Modelo de Declaração e Avaliação de Horas Estagiadas.doc
│   └── 7. Modelo de Relatório Final.pdf
│
├── Exemplos/                    # REFERÊNCIA: relatórios REAIS de outros alunos JÁ APROVADOS pela Coordenação
│   ├── Wesley/                       # Eng. Elétrica, formato mínimo (passou raspando)
│   │   └── RELATÓRIO_FINAL_DE_ESTÁGIO.pdf
│   └── Pedro Goias/                  # Eng. Elétrica, formato mais robusto — REFERÊNCIA CANÔNICA
│       ├── RELATÓRIO_FINAL_DE_ESTÁGIO___PEDRO_HENRIQUE_BARBOSA_OLIVEIRA.pdf
│       └── Declaração e Avaliação de Horas Estagiadas Signed.pdf
│
├── relatorio_estagio.tex        # SAÍDA: relatório em LaTeX que estamos construindo (compila no Overleaf)
├── declaracao_horas.tex         # SAÍDA: declaração pré-preenchida para o supervisor (Daniel) assinar
└── CONTINUE_ESTAGIO.md          # ESTE ARQUIVO
```

### Semântica das pastas (importante)

- **`Arquivos que enviei/`** → Documentos **já assinados** pelo Pedro, pela empresa e pela UNIFEI no momento do cadastro do estágio (02/12/2025). São a **fonte da verdade** para datas, jornada, CNPJ, dados pessoais, supervisor, atividades previstas (Cláusula 9 do TCE). Sempre que houver dúvida sobre algum dado oficial, é aqui.

- **`Arquivos templates/`** → Templates **em branco** disponibilizados pela Coordenação Geral de Estágios do Campus Itabira (fonte: https://graduacaoitabira.unifei.edu.br/coordenacao-geral-de-estagios/). Dois documentos finais precisam ser entregues seguindo esses templates:
  - **Relatório Final** (template `7.`) → o `relatorio_estagio.tex` segue esse template
  - **Declaração e Avaliação de Horas** (template `6.`, .doc) → o `declaracao_horas.tex` segue esse template, com tabela de avaliação que **só o supervisor preenche e assina**

- **`Exemplos/`** → Relatórios **reais de outros alunos** já aprovados pela Coordenação, usados como referência de forma e estilo (não de conteúdo). Pedro Goias é a referência canônica porque o documento dele é mais polido e tem Seção 7 (Referências). Wesley é mais cru e simples. **Não copiar conteúdo, só formato.**

- **`relatorio_estagio.tex` e `declaracao_horas.tex`** → São os arquivos que o Pedro vai compilar no Overleaf e entregar à Coordenação. **São os únicos `.tex` da pasta.**

## Dados-chave do estágio

- **Estagiário:** Pedro Henrique Leite Mendes, RA 2020030824, CPF 114.125.966-45
- **Email:** pedrohlmendes@hotmail.com / pedrohlmendes@gmail.com
- **Empresa:** AwSales LTDA, CNPJ 59.298.768/0001-36, Nova Lima/MG, Rua Min. Orozimbo Nonato, 102, Vila da Serra, CEP 34006-053
- **Site:** https://www.awsales.io/
- **Supervisor:** Daniel Roscoe Oliveira, Gerente de Estratégia e Operações, daniel@mambaculture.com, (31) 99979-1279
- **Orientador UNIFEI:** Ericson Marquiere Reis Silva, marquiere@unifei.edu.br
- **Coordenador de Estágio:** Tiago Gaiba de Oliveira
- **Período (TCE):** 01/10/2025 a 01/01/2026 (TCE original)
- **Período real:** 01/10/2025 a hoje (Pedro continua na empresa)
- **Jornada:** 13:00–20:00, 1h intervalo, 6h/dia, 5 dias/semana, 30h/semana, presencial
- **Tipo:** Estágio Obrigatório, não remunerado
- **Carga mínima curricular:** 175h
- **Projeto:** Desenvolvimento de Agentes de IA
- **Data cadastro/assinatura TCE:** 02/12/2025 (Itabira)

## ⚠️ Pendência crítica não resolvida

**TCE original vence 01/01/2026.** Pedro continua trabalhando depois disso, então tecnicamente precisa de **Termo Aditivo** (Cláusula 7 do TCE) para legitimar o período após 01/01/2026 perante a Coordenação. **Pergunte ao Pedro se ele tem Termo Aditivo assinado.** Se não tiver:

1. Opção A: limitar a declaração de horas e o relatório até 01/01/2026 (parcial, 384h)
2. Opção B: regularizar com Termo Aditivo via Coordenação ANTES de entregar
3. Opção C: declarar até a data real e arriscar a Coordenação aceitar (preferência do Pedro pelo que conversamos antes)

Hoje a versão do `.tex` está na **Opção C** (período 01/10/2025 → 25/05/2026, 966h). Confirme com Pedro qual caminho ele vai seguir antes de mexer.

## Cálculo de horas (referência)

Dias úteis no período, descontando feriados federais brasileiros + Carnaval em MG:

| Mês | Dias úteis | Observação |
|-----|------------|-----------|
| Out/2025 | 23 | 12/10 caiu domingo |
| Nov/2025 | 19 | -20/11 Consciência Negra (quinta) |
| Dez/2025 | 22 | -25/12 Natal (quinta) |
| Jan/2026 | 21 | -01/01 Ano Novo (quinta) |
| Fev/2026 | 18 | -16,17/02 Carnaval (seg/ter) |
| Mar/2026 | 22 | — |
| Abr/2026 | 20 | -03/04 Sexta Santa, -21/04 Tiradentes |
| Mai/2026 (até dia 25) | 16 | -01/05 Dia do Trabalho (sexta) |
| **Total** | **161** | × 6h = **966 horas** |

Se mudar a data de entrega, recalcule.

## O que JÁ foi feito (resumo)

1. **Pesquisa de modelos UNIFEI:** confirmado que o curso de ECA Itabira adota o **modelo SIGAA genérico** (`7. Modelo de Relatório Final.pdf`), não o modelo elaborado das Diretrizes ECA. Modelo aprovado pelo curso tem 6 seções:
   1. Introdução (com subseções 1.1 Objetivo, 1.2 Dados do aluno, 1.3 Dados da empresa, 1.4 Período, 1.5 Dados do supervisor)
   2. Atividades desenvolvidas (2.1 Descrição da empresa, 2.2 Cronologia)
   3. Metodologia e tecnologias envolvidas (3.1, 3.2, 3.3 subseções)
   4. Resultados obtidos
   5. Participação do estagiário (5.1 Disciplinas, 5.2 Conhecimentos complementares, 5.3 Contribuições, 5.4 Atividades que mais contribuíram)
   6. Conclusão
   7. Referências Bibliográficas (Pedro Goias incluiu, Wesley não)

2. **Formatação obrigatória (Diretrizes ECA Itabira):**
   - Times New Roman ou Arial **12**, espaçamento **1,5**
   - Margens **3 cm** em todas as direções
   - Parágrafos a **7 espaços** da margem esquerda (≈ 1,25 cm — implementado com `\setlength{\parindent}{1.25cm}`)
   - A4 branco
   - Encadernação espiral ou capa dura

3. **Relatório `.tex` escrito:** segue o modelo Pedro Goias (referência mais polida), com ótica de Engenharia de Controle e Automação. Cobre casos reais documentados no `CLAUDE.md` da raiz: SDR Lucas Firmino (D'Leon, -47% checkpoint), Falcão das Milhas (-58% checkpoint), refatoração tool deep link via n8n, padronização de docs universais.

4. **Declaração pré-preenchida (`declaracao_horas.tex`):** segue o template oficial `6. Modelo de Declaração e Avaliação de Horas Estagiadas.doc`. Daniel só precisa marcar X na tabela de avaliação (9 itens × 6 colunas) e assinar.

5. **Pesquisa atual sobre AwSales (consultada em 23/05/2026):**
   - Posicionamento atual: **Autonomous Service Builder**
   - 4 módulos: Agent Studio, AgentsCore, Memory Base, Cortex
   - +100 integrações, implantação em até 14 dias
   - Meta Business Partner
   - Clientes enterprise citados no site: Uniasselvi, G4 Educação, Emive
   - Fontes: https://www.awsales.io/ e https://awsales.io/meta
   - Cargo Daniel: "Gerente de Estratégia e Operações" (confirmado via RocketReach)

## O que o usuário disse que ainda tem coisa "errada"

Pedro afirmou que "quer corrigir muitas coisas que estão erradas ainda" mas não detalhou quais. **Pergunte a ele o que precisa corrigir** antes de assumir.

Itens conhecidos que podem ser ajustados:

- Conteúdo técnico das seções 3, 4 e 5 (revisão de tom, redução de "viagem" se ficar pretensioso demais)
- Possíveis números a ajustar (horas reais, datas)
- Cronograma — está bem genérico, pode precisar de mais especificidade por mês
- Capa e formatação visual (já corrigida a indentação dos blocos de dados com `itemize`)
- Conclusão — atualmente cita "Gerente de Operações" em vez do cargo completo

## Regras importantes do projeto AwSales (puxado do `CLAUDE.md` na raiz)

Estes pontos foram aplicados no relatório e devem ser preservados:
- A IA da AwSales é tratada como "IA" ou "agente de IA", nunca "bot"
- O checkpoint é o artefato mais crítico, mas deve ser ENXUTO (não duplicar FAQs)
- Tools sempre no formato `Utilize a tool para [ação] @nome_da_tool`
- Cargo correto Daniel: "Gerente de Estratégia e Operações"
- AwSales é Meta Business Partner

## Workflow para retomar (passo a passo)

1. Leia este arquivo
2. Leia o `.tex` atual: `Estágio/relatorio_estagio.tex`
3. Leia também `Estágio/declaracao_horas.tex`
4. Pergunte ao Pedro: **o que ainda está errado?** e **tem Termo Aditivo do TCE?**
5. Faça os ajustes que ele pedir, sem inventar mudanças não solicitadas
6. Se precisar reler os exemplos: `Estágio/Exemplos/Pedro Goias/` é a referência canônica
7. Compile mental ou pedir para Pedro compilar no Overleaf
8. Quando finalizar, commit + push para o repo `pedroleitel/AwsalesUniversalCreator`

## Comandos úteis

```bash
# extrair texto de PDFs (caso precise)
pdftotext -layout "Estágio/Exemplos/Pedro Goias/RELATÓRIO_FINAL_DE_ESTÁGIO___PEDRO_HENRIQUE_BARBOSA_OLIVEIRA.pdf" /tmp/exemplo.txt

# git status
git status

# após mudanças
git add Estágio/
git commit -m "feat(estágio): <descrição>"
git push origin main
```

## Tom de resposta esperado (preferência do Pedro)

Pedro usa **CAVEMAN MODE** (full). Respostas curtas, fragmentos OK, sem fluff. Mas código/commits/arquivos: escrita normal. Veja `~/.claude/plugins/cache/caveman/` se precisar do skill.

## Dados não verificados (não usar como fato sem confirmar)

- Número "R$ 3,5 milhões em faturamento" do AwSales — está no `CLAUDE.md` mas não bate com o site público. **Não use no relatório.** Já foi removido.
- "Margem líquida 40%", "80% recorrente" — mesma situação. Não use.

## Próximos passos sugeridos (se Pedro não disser nada)

1. Perguntar sobre Termo Aditivo
2. Perguntar quais correções específicas ele quer
3. Revisar a Conclusão (cargo desatualizado do supervisor)
4. Validar cronograma com Pedro (mês a mês está correto?)
5. Revisar se R$ 280–370 de economia da campanha SDR Lucas Firmino é número que Pedro quer manter no relatório oficial (é dado interno; ok citar?)
6. Confirmar se ele quer figuras (Wesley e Pedro Goias usaram). Pode adicionar screenshot da plataforma AwSales como Figura 1.
