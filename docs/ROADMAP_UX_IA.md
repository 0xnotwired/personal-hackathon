# Roadmap para un agente IA — simplificación visual de la UI/UX

Estado: **F1–F6 implementadas y verificadas el 2026-10-21** (`npm run verify`
verde: 26 unitarios, 29 e2e incluido el presupuesto de botones). La F5 quedó
cerrada: el modal "Voz" muestra tres acciones (Escuchar indicaciones,
Pausar/Continuar y Hablar con la app) y dentro de "Opciones de lectura" quedan
Repetir, Leer más despacio y Silenciar/Activar voz, para conservar los controles
que exige I10 sin sumar botones a la vista. El aviso anti-suplantación quedó en
el inicio y en la ayuda. La evidencia viva está en
`docs/IMPLEMENTATION_STATUS.md` y en `docs/EVIDENCE_LEDGER.md` (C18).

Fecha: 2026-10-21. Rama de entrega: `final` (commit `18a4bda`, pusheado). Este
documento es el encargo completo para que otro agente (Codex, Devin, o el propio
Command Code) implemente la [PROPUESTA_UX_VISUAL.md](PROPUESTA_UX_VISUAL.md). No
es un plan aspiracional: cada fase tiene cambios concretos y una prueba de salida.

La app actual funciona y está verificada (`npm run verify`: 26 unitarios, 29 e2e).
Este rediseño **no puede romper ningún comportamiento ni invariante existente**.

## Lectura obligatoria antes de tocar código

1. `AGENTS.md` (invariantes I1–I12, R4, números que son decisiones).
2. `docs/PROPUESTA_UX_VISUAL.md` (regla de botones, paleta, qué no hacer).
3. `docs/IMPLEMENTATION_STATUS.md` y `docs/SECURITY.md` (estado y riesgos).
4. Skills desde `.commandcode/skills/`, leídos desde el filesystem:
   `non-overwhelming-ux`, `frontend-accessibility-by-construction`,
   `frontend-component-boundaries`, `honest-degradation`, `red-team-auditing`,
   `falsifiable-testing`, `software-archaeology`, `git-discipline`.

## Reglas no negociables durante todo el roadmap

- Español argentino (voseo), una idea por oración, sin jerga.
- **Nunca** un ícono sin su palabra. **Nunca** más de 2 acciones visibles dentro
  del contenido de una pantalla (el encabezado y la barra inferior son shell).
- El aviso “Modo práctica — no se mueve dinero”, el aviso anti-suplantación y
  las señales de seguridad **no se esconden ni se animan**.
- Sin dependencias nuevas. Ilustraciones y animaciones son SVG + CSS propios.
- Toda animación respeta `prefers-reduced-motion: reduce`.
- Sin commit, push ni merge (R4). Sin segundo trámite (I9).
- Todo test nuevo es rojo primero: se escribe, falla, y después se arregla el
  código. No se debilita una aserción para llegar al verde.

## Fases

### F0 — Punto de partida verificable
- Correr `npm run verify` y registrar el resultado exacto.
- Anotar en `docs/IMPLEMENTATION_STATUS.md` la fecha y el estado base.
- Salida: suite verde sin tocar código. Si algo falla, se arregla antes de seguir.

### F1 — La regla de botones se vuelve mecánica
- Agregar `tests/e2e/button-budget.spec.ts`: recorre home, servicio, factura,
  revisión, esperando y resultado; cuenta `button`/`[role="button"]` visibles
  dentro de `main` (excluyendo el shell) y **falla si hay más de 2**.
- Al escribirlo tiene que fallar contra la UI actual (inicio tiene ~10).
- Salida: test rojo reproducido y registrado. Todavía no se arregla la UI.

### F2 — Inicio: una tarjeta y un solo botón de opciones
- `app/components/home-content.tsx` y `practice-app.tsx`: el inicio muestra la
  tarjeta con ilustración propia + “Quiero practicar” + “Ayuda y opciones”.
- “Ayuda y opciones” abre un diálogo con: escuchar la bienvenida, revisar un
  mensaje, mis prácticas anteriores y borrar mis datos.
- La estrella de favorito queda chica dentro de la tarjeta; la tarjeta
  acompañante y el párrafo de presentación se retiran.
- Salida: el test de F1 pasa en home; las pruebas existentes de favoritos,
  historial y borrado siguen pasando (los selectores que cambien se actualizan
  sin debilitar aserciones); captura a 390 px sin desborde.

### F3 — Pasos del flujo: sin panel lateral, con visuales
- Retirar el panel lateral (`flow-companion`); sus acciones van al diálogo de
  ayuda del paso, que queda en la misma posición en todas las pantallas.
- Servicio: tres tarjetas grandes luz/gas/agua con ilustración y selección
  marcada con tilde (animación corta, sin bucle).
- Factura: mini-factura ilustrada con el número señalado por un punto que pulsa
  **una sola vez**; el hint largo se reduce a “9 cifras” + “¿No encontrás el
  número?”.
- Revisión: importe dominante arriba, datos completos dentro de “Ver todo”, y
  la pastilla “Este es un ensayo…” fija bajo el botón de confirmar.
- Salida: presupuesto de botones verde en todos los pasos; teclado, axe y los
  tests de flujo/seguridad existentes siguen verdes; la confirmación sigue siendo
  la única acción primaria y sigue teniendo su retardo de 900 ms.

### F4 — Resultados y ayuda visuales
- Figuras de estado (reloj / tilde / cruz / flecha de vuelta) con transición
  corta y equivalente estático bajo `prefers-reduced-motion`.
- Resultado: título + una frase + acción principal; “¿Qué significa esto?”
  contiene la explicación larga.
- Ayuda: próximo paso con recuadro resaltado sobre el control correcto (se
  puede implementar como anillo de foco visible persistente mientras la ayuda
  está abierta; la miniatura es opcional), más “Escuchar” y “Cerrar”.
- Salida: presupuesto verde en resultado; test de voz/ayuda sigue verde;
  nada parpadea ni se mueve en bucle.

### F5 — Voz y seguridad simplificadas
- Controles de voz: Escuchar, Hablar con la app, y el control contextual de
  pausa/continuar. “Leer más despacio” es un único interruptor.
- Seguridad: una acción visible (“Revisar este mensaje”); ejemplos y respuestas
  solo si se piden; las palabras señaladas quedan subrayadas en el propio texto.
- Salida: presupuesto verde; los tests de voz y de seguridad siguen verdes sin
  cambiar sus aserciones de fondo (la voz nunca confirma, el mensaje no se
  persiste, el no-match sigue siendo inconcluso).

### F6 — Cierre verificable
- `npm run verify` completo en verde, incluido el presupuesto de botones.
- Capturas a 390 px de home, servicio, factura, revisión, resultado y ayuda;
  revisar a ojo que no haya solapamientos con la barra inferior.
- Actualizar `docs/IMPLEMENTATION_STATUS.md` (módulos M02/M07, capturas,
  cantidades reales) y `docs/EVIDENCE_LEDGER.md` (nueva entrada C18 con lo
  observado y lo NO RUN: comprensión humana, teléfonos físicos, lector de
  pantalla manual).
- Reporte final en español: qué cambió, qué se verificó, qué queda sin probar,
  estado Git real.

## Lo que está terminantemente prohibido

- Commit/push/merge sin autorización puntual (R4).
- Quitar o suavizar el aviso de modo práctica, la anti-suplantación o el
  lenguaje “sin conclusión” de la ayuda de seguridad.
- Iconos sin etiqueta, gestos ocultos, temporizadores, cuenta regresiva o
  animación decorativa permanente.
- Agregar turnos/transporte/compras, un chatbot, o cualquier proveedor real.
- Bajar una aserción existente para que pase. Si un cambio de UI rompe un
  selector, se actualiza el selector; si rompe una expectativa de comportamiento,
  el cambio está mal.

## Comandos de verificación

```bash
npm run verify            # typecheck + 26 unit + build + e2e + format
npm run test:e2e -- --grep "button-budget"
```

Un verde de `verify` prueba lo que prueban sus tests: nada más. No prueba que
una persona mayor lo entienda; esa verificación sigue pendiente y no se inventa.
