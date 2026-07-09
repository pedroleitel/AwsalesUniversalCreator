# Templates Meta (HSM) — FUPs das campanhas Nuestra RX

Estes templates só REABREM a janela de 24h quando o lead sumiu. É recuperação para VENDER:
formulário para vender, checkout para vender. Nada de passividade.

## Onde mora o cupom (regra dura da conta US)

Template Utility do Meta NÃO pode ter desconto/cupom (isso é Marketing, e a conta US só aprova
Utility). Então:
- CUPOM (TIRZE3 / SEMA3) = arma da CONVERSA livre (FUP inteligente), que dispara com a janela
  aberta. Ver `MENSAGENS_FOLLOWUP.md` de cada campanha.
- TEMPLATE = reabre a janela vendendo com o que Utility PERMITE: valor já incluído no pedido,
  risco zero e urgência real da reserva. Cada FUP é uma alavanca diferente, não a mesma coisa
  reescrita.
- Se conseguir aprovar 1 template Marketing, o cupom vira um FUP de Marketing; enquanto não,
  ele fica na conversa.

## Alavancas por FUP (a escada de venda)

1. Momentum: está a um passo, é rápido, fecha agora.
2. Risco zero / reframe: mata o medo (só paga se o médico aprovar + garantia; biologia).
3. Urgência real: a reserva/avaliação vence; agir agora ou perder o progresso e o valor incluído.

Regras: sem emoji, sem reapresentação (a abertura já foi enviada), continuação do fio, CTA
isolado, botão de resposta rápida. Nome: `nrx_[campanha]_fup[n]_[angulo]`.

---

## Recuperação de Vendas — recuperar o checkout para VENDER

Abertura já enviada (ref.): "Hola, tu tratamiento en Nuestra RX quedó reservado y a un paso de
terminar. Ahora no pagas nada; solo se cobra si el médico aprueba tu receta. ¿Damos el último paso?"

### nrx_venta_fup1_confirmar  (Utility — momentum)
```
Hola, tu tratamiento sigue reservado y a un solo paso de quedar confirmado.

Es cuestión de un minuto terminar y aseguras tu lugar.

¿Lo confirmamos ahora?
```

### nrx_venta_fup2_sinriesgo  (Utility — risco zero)
```
Sé que dar el paso da respeto, así que tranquilo: no se cobra nada hasta que un médico apruebe tu receta, y tienes garantía.

Tu tratamiento sigue reservado a tu nombre.

¿Lo dejamos confirmado hoy?
```

### nrx_venta_fup3_vence  (Utility — urgência real + valor incluído)
```
Tu reserva no queda abierta para siempre y está por vencer.

Si la confirmas hoy aseguras tu tratamiento con la consulta médica, el envío prioritario y el soporte ya incluidos; si vence, tendrías que empezar de cero.

¿La aseguramos ahora?
```

---

## Abandono — recuperar o formulário para VENDER

Abertura já enviada (ref.): "Hola, vi que empezaste tu evaluación en Nuestra RX y no llegaste a
terminarla... ¿Quieres que te explique cómo funciona la evaluación?"

### nrx_aband_fup1_retomar  (Utility — momentum)
```
Hola, tu evaluación quedó a un paso de terminar y sigue justo donde la dejaste.

Retomarla toma un par de minutos.

¿La terminamos ahora?
```

### nrx_aband_fup2_sinriesgo  (Utility — JÁ APROVADO, usar este)
```
Sigo por aquí para ayudarte a terminar tu evaluación.

La revisa un médico con licencia y solo pagas el tratamiento si él lo aprueba.

¿La retomamos donde quedó?
```
Nota: já aprovado como Utility. Torna desnecessários o antigo nrx_aband_fup2_reframe (Marketing) e o nrx_aband_fup2_pendiente. O reframe de biologia vai na conversa, não no template.

### nrx_aband_fup3_vence  (Utility — urgência + valor)
```
Tu evaluación sigue guardada, pero no queda abierta indefinidamente.

Si la terminas hoy, un médico revisa tu caso y desbloqueas tu tratamiento con la consulta incluida sin costo.

¿La dejamos lista ahora?
```

---

## Receptiva — levar o lead à avaliação para VENDER

Sem abertura de janela (o lead inicia). Estes só entram para REABRIR quando o lead sumiu.

### nrx_recep_fup1_pendiente  (Utility — nome novo; substitui nrx_recep_fup1_seguir)
```
Hola, quedó pendiente continuar con tu evaluación.

Son unos minutos y la revisa un médico con licencia.

¿Te comparto el enlace para seguir?
```

### nrx_recep_fup2_proceso  (Utility — nome novo; substitui nrx_recep_fup2_reframe)
```
Hola, sigue pendiente tu evaluación con nosotros.

La hace un médico con licencia y solo se cobra el tratamiento si él lo aprueba.

¿La retomamos hoy?
```

### nrx_recep_fup3_incompleta  (Utility — nome novo; substitui nrx_recep_fup3_ahora)
```
Hola, tu evaluación quedó sin completar.

Cuando quieras, un médico con licencia revisa tu caso y te dice si aplicas.

¿Seguimos con ella?
```

Nota Receptiva: como o lead frio não tem uma transação pendente clara, o Meta pode insistir em
Marketing mesmo assim. Estas versões ancoram na avaliação pendente e tiram gancho de oferta para
dar a melhor chance de Utility; se ainda cair em Marketing, é estrutural (lead sem transação) e
aceitamos Marketing nesses três.

---

## Mapa rápido (todos Utility, idioma es)

| Nome do modelo | Campanha | FUP | Alavanca |
|---|---|---|---|
| nrx_venta_fup1_confirmar | Vendas | 1 | momentum |
| nrx_venta_fup2_sinriesgo | Vendas | 2 | risco zero |
| nrx_venta_fup3_vence | Vendas | 3 | urgência real |
| nrx_aband_fup1_retomar | Abandono | 1 | momentum |
| nrx_aband_fup2_sinriesgo | Abandono | 2 | risco zero (já aprovado) |
| nrx_aband_fup3_vence | Abandono | 3 | urgência |
| nrx_recep_fup1_pendiente | Receptiva | 1 | pendiente |
| nrx_recep_fup2_proceso | Receptiva | 2 | proceso |
| nrx_recep_fup3_incompleta | Receptiva | 3 | incompleta |

O cupom NÃO está aqui de propósito (Utility não permite). Ele é o fechamento da CONVERSA.
