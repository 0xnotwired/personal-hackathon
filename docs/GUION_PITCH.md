# Guion del pitch — Autonomía Digital (versión final de ensayo)

Fecha: 2026-10-21. Registro de evidencia:
[EVIDENCE_LEDGER.md](EVIDENCE_LEDGER.md). Planificación y estructura de tiempos:
[DEMO_AND_PITCH.md](DEMO_AND_PITCH.md).

## Reglas de lectura

- Todas las cifras vienen de INDEC (Dosier de Personas Mayores 2025) y de una
  investigación de BTR Consulting (2026). Si preguntan de dónde salen:
  "de esos dos estudios; son contexto de terceros, no resultados nuestros".
- Juana no existe: representa el perfil que mide ese fondo. Si preguntan por
  la historia: "es una persona que representa ese perfil; todavía no hicimos
  el estudio con personas reales".
- El diferencial se dice una vez, en el beat asignado: "los demás lo explican
  o lo hacen por vos; acá lo practicás". No se repite con variantes.
- En pantalla, una sola cosa a la vez: el guion muestra el trámite completo,
  no una lista de funcionalidades.

---

## Versión de 3 minutos

### 0:00–0:30 — Escena y problema (con cifras)

> En Argentina, casi nueve de cada diez personas mayores usa celular, y el
> 76% se conecta a internet. Lo que se traba no es la conexión: cuatro de
> cada diez que no se conectan dicen "no sé cómo hacerlo", y solo dos de
> cada diez hace un trámite online.
>
> El teléfono le sirve a Juana — setenta y cuatro años, Castelar — para
> hablar con los nietos, no para pagar la luz. Y el miedo es racional: casi
> nueve de cada diez personas de su edad recibió este año un intento de
> estafa digital.

### 0:30–0:45 — La app en una frase

> Así nace Autonomía Digital: una app que elige la tarea, guía con un paso a
> la vez, te deja escuchar la ayuda en voz alta, volver atrás y retomar
> cuando quieras. Una sola tarjeta y pocas acciones a la vista. Nada se hace
> solo: hasta el último paso, la decisión es tuya.

### 0:45–1:40 — Demo: viaje e interrupción con Juana

*Pantalla: inicio de la app: una tarjeta grande “Pagar una factura” y una sola
acción visible; el resto vive en “Ayuda y opciones”.*

> Les muestro un pago real de práctica. Esta es una factura inventada: luz
> del barrio, dieciocho mil quinientos con cuarenta pesos. A Juana el código
> le llegó impreso en la boleta; lo escribe tal cual lo tiene, con espacios,
> y la app lo acomoda sola.

*Pantalla: número de factura, con el ejemplo señalado y el valor ya
normalizado.*

> ¿Y si mientras avanza el trámite se corta algo? ¿Se pierde todo? Miren:
> recargo la página... y ahí sigue, el mismo paso y el mismo código. Nada se
> pierde. Y nada se paga dos veces.

### 1:40–2:20 — Confirmación y recibo honesto

*Pantalla: revisión con el importe grande, empresa y mes; los detalles quedan en
“Ver todo”.*

> Antes de mover nada, la app muestra a quién se le paga y cuánto. Juana
> repite el importe en voz alta — así lo hace siempre con sus papeles — y si
> algo no coincide, vuelve atrás y lo corrige. Solo cuando lo decide, con un
> toque deliberado, confirma.

*Pantalla: confirmación, resultado y recibo con la etiqueta de práctica.*

> El resultado viene del proveedor simulado. Si queda pendiente o falla, la
> app lo dice: nunca disfraza nada ni dice "pagado" cuando no lo está.

### 2:20–2:45 — El diferencial y el alcance

> Acá está la diferencia: los demás lo explican o lo hacen por vos; acá lo
> practicás vos. No pide claves ni datos de tarjeta, no conecta bancos, y se
> repite las veces que haga falta — equivocarse acá no cuesta nada. Estamos
> convencidos de que practicar un trámite entero, con margen para errar, es
> lo que de a poco saca el miedo.

### 2:45–3:00 — Cierre

> Lo que les presentamos no es una idea ni una maqueta: una app que funciona
> hoy, donde una persona mayor puede practicar un trámite entero, perder la
> conexión, equivocarse y quedar en pie. Comprendé cada paso. Decidí vos.
> Autonomía Digital.

---

## Extensión para la versión de 5 minutos

**Dentro del viaje (0:45–2:40), además del recorte, la ventana de anulación y pendiente:**

> Si un pago queda pendiente, la app no dice "pagado": muestra "en revisión"
> y un camino claro para averiguar qué pasó. Y mientras el proveedor simulado
> lo permite, se puede anular — con un estado real, no con una pantalla que
> se esconde.

**2:40–3:25 — Seguridad (sobre el ejemplo "Me están apurando para pagar"):**

> Y si un mensaje le apura el pago a Juana, la app le muestra qué frases de
> ese mensaje conviene revisar y le deja redactar una respuesta que ella
> decide si enviar. No le promete adivinar todas las estafas; le devuelve el
> tiempo para pensar.

**3:25–4:05 — Alternativas (diferencial comparado):**

> Las opciones que existen hoy: un video le explica a todos lo mismo, al
> mismo ritmo; las apps de los servicios asumen lo que Juana todavía no
> sabe; y la ayuda humana le hace el trámite por ella, sin dejarla aprender.
> Esto es acompañamiento con conciencia de contexto: la app sabe en qué paso
> estás y qué ayuda corresponde ahí.

**4:05–4:35 — Viabilidad y operación:**

> Técnicamente es una app web que corre en el navegador que Juana ya usa.
> No pide claves ni mueve dinero real: un servidor simple, el borrador
> guardado en su teléfono, y la operación de práctica registrada.

**4:35–5:00 — Equipo y cierre:**

> Detrás hay un equipo pequeño, y piezas open source adaptadas con
> atribución — Ímpetu, Gambit, Wolf y Cronos. La contribución es concreta:
> una app que funciona hoy, donde una persona mayor puede practicar un
> trámite entero, equivocarse y quedar en pie. Comprendé cada paso. Decidí
> vos. Autonomía Digital.

---

## Si la demo falla en vivo

Una sola frase, sin disfrazar:

> "La demostración en vivo no está disponible; les muestro una grabación de
> la misma versión probada."

Se pasa a la grabación rotulada con su build y con la palabra "grabación".

## Chequeo previo (antes de salir)

1. Build que pasó `npm run verify`.
2. Rotulación "Modo práctica — no se mueve dinero" visible.
3. Inicio con una sola tarjeta y “Ayuda y opciones”; modal “Voz” con tres
   acciones visibles.
4. Sesión sintética limpia, sin datos de otros ensayos.
5. Navegadores y notificaciones ajenos cerrados.
6. Zoom del proyector probado al 200%.

---

## Nota de evidencia

- Afirmaciones del viaje demo, confirmación y estados honestos: verificadas
  en `npm run verify` (seed `npm test` + pruebas de navegador; ver
  [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)).
- La comprensión con personas del público objetivo queda sin observación
  (cero sesiones): si preguntan "¿eso prueba autonomía?", la respuesta es
  "la efectividad con usuarios es nuestra validación pendiente; el diseño
  contempla ese perfil".
- La voz: implementada con rutas de reemplazo probadas; no afirmar
  funcionamiento en teléfonos físicos ("falta comprobarla en teléfonos").
- La simplificación visual está comprobada por un test de navegador que cuenta
  acciones visibles por pantalla (máximo dos fuera de la barra fija) y por los
  chequeos de axe/teclado; no prueba que una persona la entienda más rápido.
