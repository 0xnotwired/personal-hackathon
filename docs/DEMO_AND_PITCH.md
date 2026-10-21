# Demonstration, pitch and questions

Status: rehearsal material for the finished practice simulator on `final`
(commit `18a4bda`, pushed). The
simulation is the agreed product scope, not a prototype awaiting integration;
the pitch speaks about it in the affirmative. Internal claim discipline (which
word needs which evidence) lives in [EVIDENCE_LEDGER.md](EVIDENCE_LEDGER.md),
not in the spoken script. Date: 2026-10-21.

[Strategy](HACKATHON_PLAYBOOK.md) · [Product](PRODUCT.md) · [Claim register](EVIDENCE_LEDGER.md)

The user reports a 3–5-minute pitch and no published judging criteria. Prepare
both durations; confirm whether questions are inside the window with the
organizer. The spoken scripts below are intentionally es-AR; planning
instructions stay English.

## How to frame the product

- The product **is complete for its purpose**: a safe environment where a person
  practices a full everyday procedure with written and spoken guidance, saves
  progress, confirms deliberately, and recovers from interruption, pending
  states and errors. Do not call it "a prototype" or "a mockup": practice mode
  is the product, and "Modo práctica — no se mueve dinero" is its label, not a
  disclaimer.
- Finish the sentence about scope in one line and move on: "Es un entorno
  completo de práctica; no se conecta a bancos ni proveedores reales, y esa es
  una decisión de diseño, no una ausencia."
- Open on the problem and the person, never on mechanism, stack or caveats.
- Close on the concrete contribution; never end on future work.

## What the audience should remember

**"Entendé cada paso. Decidí vos."** The contribution is a procedure a person can
understand and control — including after an interruption, a lost response or a
mistake. Show that behavior on screen; a stack diagram, chatbot conversation or
grid of task icons cannot substitute for it.

One fictional scenario throughout: a synthetic utility bill, "Luz del Barrio
(ficticia)", ARS 18.500,40, code `100200300`. Attribution for reused ideas and
code goes to Ímpetu, Gambit and Wolf and Cronos, with links in the supporting
material; their deployments and tests are not ours.

## The evidenced problem (third-party data, Argentina)

These observations belong to their original studies. Cite them as context
published by their sources — they are background for the problem, never our own
findings, and they do not alter any C01–C17 register entry. If we ever cite a
number on a slide, the slide carries the source footnote.

| Observed (source) | What it implies for the person | How this product answers it |
| --- | --- | --- |
| ~88% of people 60+ use a cell phone; 76% access the internet ([INDEC, Dosier Personas Mayores 2025](https://biblioteca.indec.gob.ar/bases/minde/2mi610_20.pdf)) | Connectivity is NOT the barrier; skills and confidence are | The whole journey runs on the phone they already own: no account, no install step, no assumed vocabulary |
| Internet use falls to 63% at 70+; ~4 in 10 who don't use it say "no sé cómo" (INDEC 2025) | The stop is "I don't know how", not lack of interest | One step at a time, concrete examples, spoken help that explains the current step — built so the first attempt needs no prior training |
| Publicly educated gap: 94% internet use with university studies vs 67% without completed secondary school (INDEC 2025) | Our users live in the second number | Plain es-AR copy, no jargon, labeled controls; nothing assumes school-computer experience |
| Only 21.6% of seniors' online activity is personal procedures (INDEC 2025) | The phone serves the family, not the one activity that matters for independence | The practice journey is exactly that absent activity, made safe to repeat until it is understood |
| 63% feel fear or distrust online; 75% would turn to children/grandchildren for a risky digital situation ([BTR Consulting, mayo 2026](https://tn.com.ar/tecno/novedades/2026/05/16/estafas-digitales-9-de-cada-10-adultos-mayores-estuvieron-expuestos-a-intentos-de-fraude-en-internet/)) | The default "support" is someone else doing the procedure — dependence as the only alternative | The person does it themselves, with recovery at every step; the app guides but never commits on their behalf (I1) |
| 89% of Argentine seniors were exposed to fraud attempts; 78% received requests for data/codes, and 9% admitted sharing them (BTR 2026) | The fear is rational and exposure is near-universal | No credential/card field anywhere in the practice; safety help quotes the exact pressured phrases, without claiming to detect every scam |
| 81% want to learn to protect themselves online (BTR 2026) | The demand to learn exists and wants a safe place to do it | The simulator is that place: full procedure, unlimited repetitions, zero real cost for an error |

Rehearsal discipline: the pitch may use at most 2–3 of these numbers in the
opening so the story stays the carrier; the rest go to the deck appendix and Q&A.

## Demonstration beat — 3 minutes

Operate the Personal-inspired blue/cyan phone layout. In the 3-minute slot,
show one interruption/recovery and a confirmed result; reserve cancellation and
a pending-result for the 5-minute version or questions.

| Beat | Person's action | What this visibly proves |
| --- | --- | --- |
| Start | Select "Pagar una factura" at home | Simple, labeled task selection opens a working journey |
| Enter | Type the bill code; tap the example if stuck | Concrete examples without assuming digital vocabulary |
| Ask | Tap "Escuchar ayuda" or a supported spoken command | Spoken help matches the visible step; text and touch remain complete paths |
| Review | Inspect payee and amount; go back to correct if needed | The person decides; nothing submits itself |
| Interrupt | Reload mid-flow and resume | Same step, same entered values; nothing is lost, nothing is paid twice |
| Confirm | Activate confirmation deliberately | One provider operation with an authoritative simulated result |
| Resolve | Receipt on screen | A verified result, labeled practice receipt |

Optional 30-second addition while waiting at review: open the safety help on
"Me están apurando para pagar", show the quoted phrases and the unsent reply
draft, then return to the same review. Say: "La app marca frases para revisar;
la respuesta no se envía sola."

Day-of operator checklist (do in order, before stage time): pick a build known
to have passed `npm run verify`; check browser, audio and projector zoom at
200%; close unrelated apps and notifications; reset only test-owned synthetic
data with the tested script; start a fresh synthetic session; confirm the
practice label is visible.

Fallback order, prepared in advance: same-build labeled recording ("grabación"
+ build), then stills described as a walkthrough, then cue cards with the
honest statement "La demostración en vivo no está disponible". Keep real
duration or disclose editing; never present an edited video as one take.

## Three-minute structure — 180 seconds

| Time | Material | Intended takeaway |
| --- | --- | --- |
| 0:00–0:25 | Problem with owned numbers (INDEC/BTR) and Juana | The barrier is "no sé cómo" + fear, not connectivity |
| 0:25–0:45 | What changes for the person | Guidance in writing and voice, control, recovery |
| 0:45–1:55 | Live journey with one interruption | Data survives, decision stays with the person |
| 1:55–2:20 | Result and honest states | Verified receipt; pending and failed are distinct states |
| 2:20–2:45 | Practice scope, repeatable, safe | Understand the whole procedure; no real money, no credentials |
| 2:45–3:00 | Contribution and close | "Entendé cada paso. Decidí vos." |

## Three-minute spoken script

**Opening (with third-party numbers, ~30 s)**

> "En Argentina, casi nueve de cada diez personas mayores usa celular y el
> 76% se conecta a internet. Pero ahí se corta la historia: cuatro de cada
> diez mayores que no se conectan dicen 'no sé cómo hacerlo', y solo dos de
> cada diez hacen un trámite online. El teléfono le sirve a Juana para hablar
> con los nietos, no para pagar la luz. Y su miedo es racional: casi nueve de
> cada diez recibió este año un intento de estafa digital. Autonomía Digital
> acompaña el trámite completo, paso a paso, hasta que lo pueda hacer sola de
> nuevo."

**Product in one breath**

> "Es una app: elegís la tarea, te guía con un paso a la vez, podés escuchar la
> ayuda en voz alta, volver atrás y retomar cuando quieras. Nada se hace solo:
> hasta el último paso, la decisión es tuya."

**Demo narration (run the beats above while saying this)**

> "Les muestro un pago real de práctica. Esta es una factura inventada: luz
> del barrio, dieciocho mil quinientos con cuarenta pesos. Cargo el código…
> y miren esto: si recargo la página a mitad del trámite, todo sigue ahí.
> Antes de mover algo, la app me muestra el destino y el importe. Confirmo
> yo, con un toque deliberado, y el resultado viene del proveedor simulado:
> si queda pendiente o falla, la app lo dice, no disfraza nada."

**Safety beat (optional 30 seconds over the smaller-step help)**

> "Y si le llega un mensaje apurándola a pagar, la app le muestra qué frases
> conviene revisar y le deja redactar una respuesta que ella decide si
> enviar. No le promete adivinar todas las estafas; le devuelve el tiempo
> para pensar."

**Scope line**

> "El producto completo es un entorno de práctica. No pide claves ni datos de
> tarjeta, no conecta bancos, y se puede repetir las veces que haga falta:
> equivocarse acá no cuesta nada. Estamos convencidos de que practicar un
> trámite entero, con margen para errar, es lo que de a poco saca el miedo."

**Close**

> "Lo que les presentamos no es una idea ni una maqueta: una app que funciona
> hoy, donde una persona mayor puede practicar un trámite entero, perder la
> conexión, equivocarse y quedar en pie. Comprendé cada paso. Decidí vos.
> Autonomía Digital."

## Five-minute structure — 300 seconds

| Time | Material | Extra depth over the short version |
| --- | --- | --- |
| 0:00–0:35 | Problem with one vivid hypothetical situation | What it costs the person: abandoned procedures, self-blame |
| 0:35–1:00 | Product and home screen | Favorites, big cards, one task at a time |
| 1:00–2:40 | Journey, interruption/recovery, plus cancellation or pending | Distinct exits, honest states, capability-bound undo |
| 2:40–3:25 | Safety help and voice | Quoted-evidence message help; spoken help with full written alternative |
| 3:25–4:05 | Alternatives and distinction | Tutorials, service apps, human help — no invented competitor weaknesses |
| 4:05–4:35 | Viability and operation | Simple deployment, no live money flow, no credential handling |
| 4:35–5:00 | Team, attribution, close | What we built, what we adapted with attribution, the contribution again |

Five-minute script = the three-minute script including the safety beat, plus
the cancellation/pending window in place of one review beat:

> "Si un pago queda pendiente, la app no dice 'pagado': te muestra 'en
> revisión' y te da un camino claro para averiguar qué pasó. Y hasta que el
> proveedor lo permite, podés anular: con un estado real, no con una pantalla
> que se esconde."

And the alternatives beat:

> "Un video les explica a todos lo mismo; las apps de los servicios corren y
> hablan en jerga; y la ayuda humana impersonal no practica con vos. Esto es
> acompañamiento con conciencia de contexto: la app sabe en qué paso estás y
> qué ayuda corresponde ahí."

## Short deck (6 slides + appendix)

1. Problem — one sentence, one face, one number.
2. What we built — the home screen as the audience will see it.
3. Journey — 4 frames: choose, review, confirm, receipt.
4. Interruption/recovery — the reload beat as stills.
5. Honest states — success / in-review / failed, side by side.
6. Contribution — "Entendé cada paso. Decidí vos." with the attribution strip.
Appendix: contracts, security posture, cost assumptions, supported devices, sources.

Keep one idea per slide, large text, no table dumps.

## Questions to rehearse

| Question | Answer |
| --- | --- |
| "¿Qué hay funcionando hoy?" | "La app funciona de punta a punta: inicio, factura, borrador que persiste, revisión, confirmación deliberada, recibo, anulación y estados pendiente/fallido. Está verificada en pruebas automatizadas de navegador; nos falta la medición con personas del público objetivo." |
| "¿Paga servicios reales?" | "No, y no es una limitación: es el producto. Un entorno de práctica completo que no mueve dinero ni pide credenciales." |
| "¿Por qué otra app?" | "Porque las demás presuponen alfabetismo digital. Esta enseña el procedimiento en su contexto, con margen de error recuperable." |
| "¿Por qué no un tutorial?" | "El tutorial explica en abstracto; acá la ayuda está ligada al paso exacto en el que estás, y practicás con datos reales de forma simulada." |
| "¿La puede pagar por error una voz?" | "No: la voz no tiene autoridad de pago. La confirmación es un control que se activa deliberadamente; probado contra comandos y carillas." |
| "¿Cómo evitan pagar dos veces?" | "La operación se registra una vez y se recupera por búsqueda; una respuesta perdida no dispara un segundo pago — está testeado." |
| "¿Se puede anular?" | "Dentro del simulador, sí, mientras el proveedor simulado lo permite; dejamos en claro que no hablamos de pagos reales." |
| "¿Qué pasa sin internet?" | "El borrador queda guardado en el dispositivo; el trámite no avanza y después se retoma." |
| "¿Y si la voz no funciona?" | "Todo el trámite tiene su camino completo escrito y táctil; la voz es un extra, nunca un requisito." |
| "¿Escuchan todo el tiempo?" | "No: la escucha arranca cuando la persona la activa, se ve que está escuchando y se detiene con un control visible." |
| "¿Dónde se procesa el audio?" | "El navegador lo maneja; todavía nos falta el detalle exacto por navegador/nivel." |
| "¿Cuántas personas lo probaron?" | "Todavía no corrió con el público objetivo: ese es el paso de validación que nos reconocemos." |
| "¿Qué hicieron ustedes y qué reutilizaron?" | "Nosotros: dominio, redacción, interacción, integración. Con atribución: React Aria, XState, Dexie, Zod y adaptaciones de Ímpetu, Gambit y Wolf and Cronos." |
| "¿Cuánto cuesta?" | "Es un servidor simple sin integraciones de pago; aún no lo monetizamos ni tenemos un costo de hosting certificado." |
| "¿De dónde salen sus números?" | "Del INDEC (Dosier de Personas Mayores 2025) y de una investigación de BTR Consulting; los citamos como contexto de terceros, no como resultados nuestros." |

## Claim-to-register map

Every spoken sentence above draws on exactly one registered claim; the map
makes the predemo audit mechanical. A sentence may only leave the room with
the wording its register entry allows.

| Script line (es-AR) | Ledger claim | Boundary the allowed wording imposes |
| --- | --- | --- |
| "una app que funciona hoy" / the whole live journey | C02 (+C06) | The build shown must pass `npm run verify`; the date and commit go in the ledger before stage time |
| "si recargo la página a mitad del trámite, todo sigue ahí" | C06, C16 | Draft persistence and stale-tab conflict are browser-test observations, not a guarantee across every device |
| "el resultado viene del proveedor simulado; si queda pendiente o falla, la app lo dice" | C08 | Statuses come from the simulated provider; cancellation/pending behavior is capability-bound, never "anulá cualquier pago real" |
| "confirmo yo, con un toque deliberado" | C02, C13 (design) | The control is deliberate activation; we do not yet claim a person with low literacy completes it unassisted |
| "podés escuchar la ayuda en voz alta" | C05 | Implemented with tested fallbacks; NO physical-device speech observation — do not say "funciona en tu teléfono" |
| "marca frases para revisar… no promete adivinar todas las estafas" | C14 | Rule-based quoted evidence on authored examples, not measured fraud accuracy |
| "no pide claves ni datos de tarjeta" | C17 | Verified in the browser suite; no external penetration test or public deployment behind it |
| "se puede repetir las veces que haga falta; errar acá es gratis" | C02, C03 | Simulation scope: practice journeys repeat by design; no real money moves — this is the product, not a missing feature |
| "una app móvil con estilo azul/celeste inspirado en Personal" | C15 | Visual inspiration, not a partnership or store release |
| Deck slide on honest states | C08 | Same boundary as cancellation above |

Sentences deliberately NOT in the script: any participation count (C04: zero
sessions), real-device speech results (C05), accessibility certification (C07),
institutional distribution (C09), published judging criteria (C10), and any
"first/only/all older adults" quantifier.

## Rehearsal gate

One presenter and one demo operator where team capacity permits. Rehearse both
durations and the failure transition, with questions asked by a skeptical
listener. Time the actual speech and UI, ask the listener what they believe
works today, and reconcile any mismatch with [EVIDENCE_LEDGER.md](EVIDENCE_LEDGER.md)
before submission. The final sentence states a concrete contribution.

## External sources (context data)

- INDEC — Dosier estadístico de personas mayores 2025:
  <https://biblioteca.indec.gob.ar/bases/minde/2mi610_20.pdf>
- BTR Consulting survey reported by TN (2026):
  <https://tn.com.ar/tecno/novedades/2026/05/16/estafas-digitales-9-de-cada-10-adultos-mayores-estuvieron-expuestos-a-intentos-de-fraude-en-internet/>
- CEPAL — Las personas mayores de América Latina en la era digital (regional
  background for the deck appendix):
  <https://www.cepal.org/es/publicaciones/44580-personas-mayores-america-latina-la-era-digital-superacion-la-brecha-digital>
