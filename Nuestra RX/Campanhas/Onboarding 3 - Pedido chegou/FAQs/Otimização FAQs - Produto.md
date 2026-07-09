# Otimização FAQs — Produto (Onboarding 3 - Pedido chegou)

Motivo da edição (2026-06-26): a campanha vai usar APENAS o `whatsapp_suporte` como canal de
suporte. A variável `email_contato` (hello@nuestrarx.com) foi REMOVIDA das Variáveis da
Campanha no painel. Reembolso, pacote danificado e cadeia de frio passam todos pelo WhatsApp.

As FAQs vivem na plataforma AWSales (não há arquivo local). Aplicar as 3 edições abaixo
direto no painel, na base de conhecimento **Produto** desta campanha. A base Playbook NÃO
cita `email_contato`, então não precisa de ajuste.

---

## 1. FAQ "Como orientar conservação e cadeia de frio corretamente?"

**De:**
> De forma simples e humana: manter sempre refrigerado. Não invente números de temperatura
> nem de tempo fora da geladeira; siga só a informação oficial. Se houver suspeita de que
> pegou calor ou quebrou a refrigeração, isso é caso crítico: oriente a NÃO aplicar, peça
> fotos e relato, e aí sim acione **email_contato e whatsapp_suporte** pra avaliação antes de
> qualquer uso.

**Para:**
> De forma simples e humana: manter sempre refrigerado. Não invente números de temperatura
> nem de tempo fora da geladeira; siga só a informação oficial. Se houver suspeita de que
> pegou calor ou quebrou a refrigeração, isso é caso crítico: oriente a NÃO aplicar, peça
> fotos e relato, e aí sim acione o **whatsapp_suporte** pra avaliação antes de qualquer uso.

---

## 2. FAQ "Como confirmo que o cliente recebeu em boas condições e refrigerou?"

**De:**
> De forma natural, confirme se chegou completo e sem danos e se ele já colocou na geladeira.
> Se estiver tudo certo, siga acompanhando. Se o pacote veio danificado, quente, vazando ou
> com a refrigeração comprometida, é crítico: oriente a NÃO aplicar, peça fotos e relato e
> acione **email_contato e whatsapp_suporte** antes de qualquer uso.

**Para:**
> De forma natural, confirme se chegou completo e sem danos e se ele já colocou na geladeira.
> Se estiver tudo certo, siga acompanhando. Se o pacote veio danificado, quente, vazando ou
> com a refrigeração comprometida, é crítico: oriente a NÃO aplicar, peça fotos e relato e
> acione o **whatsapp_suporte** antes de qualquer uso.

---

## 3. FAQ "Como procedo sobre pausa, cancelamento e reembolso após envio?"

**De:**
> Se o ciclo já foi entregue, pausa ou cancelamento valem pra próxima renovação, e reembolso
> após o envio segue a política oficial: não prometa exceção. Como é o próprio cliente
> pedindo, direcione a solicitação pro **email_contato** e diga que ele pode acompanhar pelo
> whatsapp_suporte. Confirme sempre pela informação oficial antes de responder.

**Para:**
> Se o ciclo já foi entregue, pausa ou cancelamento valem pra próxima renovação, e reembolso
> após o envio segue a política oficial: não prometa exceção. Como é o próprio cliente
> pedindo, direcione a solicitação pro **whatsapp_suporte**. Confirme sempre pela informação
> oficial antes de responder.

---

## Checklist de aplicação

- [ ] Painel > Variáveis da Campanha: remover o card `email_contato`.
- [ ] Base Produto: editar as 3 FAQs acima (email_contato -> whatsapp_suporte).
- [ ] Checkpoint: recolar a versão atualizada (seção 3 "pacote danificado" já aponta para
      `{{whatsapp_suporte}}` em vez de e-mail).
