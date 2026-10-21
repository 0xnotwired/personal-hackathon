# Propuesta: menos texto, más visual y simplificado

Fecha: 2026-10-21. **Implementada en `final` @ `18a4bda`**; este documento
conserva el fundamento de diseño y el [roadmap de ejecución](ROADMAP_UX_IA.md)
registra fases y evidencia. Método: skills `non-overwhelming-ux` y
`frontend-accessibility-by-construction`, con el público de adultos mayores con
muy baja familiaridad digital.

El problema no es que haya texto: es que hoy el texto compite con la acción.
La regla rectora de esta propuesta es: **la pantalla se entiende mirando, y el
texto confirma**. Lo que no se puede decir mirando (el aviso de modo práctica,
las advertencias de seguridad, los importes) **nunca se reemplaza por una imagen**.

## Principios (condiciones, no sugerencias)

1. **Nunca un ícono sin su palabra.** El usuario no sabe qué significa un ícono.
   Ícono + etiqueta, siempre (WCAG/COGA). Lo que hoy es ícono+texto se mantiene;
   la mejora es reducir el párrafo de apoyo, no el rótulo.
2. **Una idea por oración, una acción por pantalla.** El texto que queda se corta
   a la mitad. Lo que no sea indispensable en el paso pasa a “Ver más” o a la ayuda.
3. **Nada se mueve solo durante la lectura.** Las animaciones son solo feedback
   (apareció, cambió, terminó), duran 150–300 ms, respetan
   `prefers-reduced-motion: reduce` y nunca repiten en bucle.
4. **Las imágenes no cargan información.** Una ilustración decorativa tiene
   `aria-hidden`; si muestra dónde tocar, el texto también lo dice.
5. **El aviso “Modo práctica — no se mueve dinero”, el aviso anti-suplantación y
   las señales de seguridad no se simplifican ni se animan.** Se acortan, no se
   esconden.
6. **Pocos botones, siempre los mismos.** Una persona mayor no “elige entre
   botones”: se pierde. La regla es presupuesto, no gusto: como máximo **1 botón
   principal grande + 1 botón secundario** por pantalla. Todo lo demás se esconde
   detrás de un único “Más opciones”, y solo aparece cuando se lo pide.

## Menos botones visibles: el cambio de mayor impacto

Conteo real hoy vs. propuesta. “Shell” son los controles fijos que aparecen en
el mismo lugar en todas las pantallas (encabezado y barra inferior) y no se
cuentan: se mantienen iguales siempre para que se aprendan una sola vez.

| Pantalla | Botones visibles hoy | Propuesta (visibles) |
| --- | --- | --- |
| Inicio | ~10: practicar, favorito, escuchar bienvenida, revisar mensaje, prácticas anteriores, borrar datos, más shell | **2:** “Quiero practicar” + “Ayuda y opciones” |
| Elegir servicio | 2 + panel lateral (2) | **2:** “Seguir con …” + “Volver” |
| Buscar factura | 3 + desplegable + panel lateral | **2:** “Buscar factura” + “Usar este número de ejemplo” |
| Revisar | 3 + panel lateral | **2:** “Confirmar pago de práctica” + “Corregir” |
| Esperando | 3 | **1:** “Consultar resultado” |
| Resultado | 3–5 según el estado | **2:** acción principal + una alternativa |
| Controles de voz | 7 (escuchar, repetir, pausar, detener, velocidad, silenciar, hablar) | **3:** Escuchar, Hablar con la app, y uno según el momento (Pausar/Continuar) |

Qué pasa con los botones que salen de la vista:

- **Escuchar la bienvenida, revisar un mensaje, mis prácticas anteriores, borrar
  mis datos** → entran todos dentro de “Ayuda y opciones” en el inicio.
- **Guardar y salir, “me están apurando para pagar”** del panel lateral → pasan
  a la ayuda del paso (“¿Qué hago?”), que ya existe y está siempre arriba.
- **Favorito** queda como una estrella chica dentro de la tarjeta, no como un
  botón destacado más.
- **Repetir / velocidad / silenciar** de voz se simplifican: “Leer más despacio”
  es un único interruptor, y pausar/detener aparecen solo mientras está sonando.

Reglas de forma adicionales para este público:

- Los botones visibles son **grandes, de ancho completo y con mucho aire** entre
  ellos; nada de enlaces chicos subrayados como acciones.
- El botón principal siempre es el último de la pantalla y dice la acción con
  una palabra concreta (“Seguir”, “Confirmar”, “Borrar todo”), nunca “Enviar” ni
  “Aceptar”.
- Los desplegables (`details`) no cuentan como escondidos: el resumen debe decir
  qué hay adentro (“Probar otros resultados”) y no contener otra acción
  principal.
- No hay dos botones con el mismo color en una pantalla: el secundario es plano.


## Por pantalla

### Inicio (hoy: 5 bloques de texto + ~10 acciones)
- Un solo título “¿Qué necesitás hacer?” y **una** frase de apoyo:
  “Tocá la tarjeta y te guío paso a paso.”
- La tarjeta de Pagar una factura lleva una **ilustración propia** (factura con
  tilde) grande, centrada, sobre fondo celeste, y un solo botón “Quiero
  practicar”. Sin párrafo debajo del título.
- El aviso “Es un simulador. No es tu banco…” queda en **una línea con ícono de
  escudo**, en posición fija debajo del título. No se mueve ni se repite.
- Todo lo demás (bienvenida hablada, revisar mensaje, prácticas anteriores,
  borrar datos) entra en **un solo botón “Ayuda y opciones”** debajo de la
  tarjeta.
- “Más cosas para aprender” se muestra como **tarjetas apagadas** (luz tenue,
  ícono y nombre, candado) con la etiqueta “Próximamente”, sin párrafo.

### Elegir servicio (hoy: texto + radios)
- Tres tarjetas grandes luz/gas/agua: ícono ilustrado grande, nombre, color de
  acento por servicio. La selección marca la tarjeta entera con borde y tilde
  animada corta.
- El texto “Elegí un servicio…” desaparece: lo dice el título.

### Buscar la factura (hoy: párrafo + ejemplo + campo + ayuda)
- Una **mini-factura ilustrada** arriba con el número de ejemplo dibujado y un
  **punto que pulsa una vez** donde está el número (se detiene; sin bucle).
- El campo queda directo con su etiqueta y el botón “Usar este número de ejemplo”.
- El hint largo se convierte en “9 cifras” debajo del campo; el resto va a
  “¿No encontrás el número?”, que abre la mini-factura agrandada.

### Revisar antes de confirmar (hoy: lista de detalles + textos)
- Una tarjeta visual tipo comprobante: **importe grande arriba**, ícono del
  servicio, empresa, mes y cuenta. Los datos completos quedan en “Ver todo”.
- El aviso “Este es un ensayo…” queda como pastilla fija bajo el botón de
  confirmar, en una frase.

### Esperando y resultado (hoy: textos por estado)
- Cada estado tiene un **visual de una sola figura**: reloj quieto (en revisión),
  tilde (listo), círculo con cruz (rechazado), flecha de vuelta (cancelado).
- La transición es un cambio suave de color/forma de 200 ms; con
  `prefers-reduced-motion` aparece directo.
- El texto queda en título + una frase + la acción principal. La explicación
  larga va a “¿Qué significa esto?”. Como máximo hay una alternativa secundaria
  (“Volver a practicar” o “Pedir cancelación”); “Ir al inicio” vive en el shell.

### Ayuda “¿Qué hago?” (hoy: párrafo + 4 acciones)
- El próximo paso se muestra como **miniatura de la propia pantalla con un
  recuadro resaltado** sobre el botón correcto, más una frase, sin pedir nada más.
- Solo dos acciones: “Escuchar” y “Cerrar”. “Usar este número de ejemplo” aparece
  únicamente en el paso de la factura.

### Seguridad (mensaje sospechoso)
- El mensaje revisado se muestra con las **palabras señaladas subrayadas en
  color** en lugar de citas con formato largo, más una tarjeta por señal con
  ícono y una frase. El “no podemos confirmar” queda como pastilla fija.
- Una sola acción visible: “Revisar este mensaje”. Los ejemplos y las respuestas
  sugeridas se abren solo si se piden; las respuestas no tienen botón propio,
  el texto se selecciona y se copia con el gesto habitual.

## Biblioteca visual (sin dependencias)

- Ilustraciones SVG propias en `app/components/ui-icon.tsx` o un nuevo
  `app/components/illustrations/`, en la paleta existente (navy, azul, celeste).
  Nada de bancos de imágenes ni GIFs externos.
- Tamaños: ilustraciones de 80–120 px en tarjetas; 48–64 px en resultados;
  nada menor a 44 px si es interactivo.
- Todos los elementos visuales nuevos pasan por los mismos chequeos de axe,
  teclado y zoom 200% que el resto.

## Animaciones: qué sí y qué no

- **Sí:** aparición suave de un paso, tilde de selección, transición de estado
  de resultado, punto que señala una vez.
- **No:** parpadeo, rebote continuo, cuenta regresiva, scroll parallax, video
  con autoplay, íconos que “llaman la atención” todo el tiempo.
- Implementación: CSS con `@media (prefers-reduced-motion: no-preference)`;
  en `reduce`, todo estático. Sin librerías de animación.

## Qué NO hacer

- No convertir advertencias en íconos.
- No mostrar más de 2 acciones dentro del contenido; el panel lateral con
  botones desaparece y sus acciones se mudan a la ayuda.
- No usar imágenes que se parezcan a una app bancaria real (la suplantación es
  nuestro principal riesgo, ver `docs/SECURITY.md`).
- No sacar el texto sin un equivalente hablado: la voz lee el mismo contenido.
- No agregar la segunda práctica (turnos, transporte) con este rediseño; es
  I9 y queda para después.
- No depender de que la persona “descubra” un gesto (mantener apretado, deslizar,
  doble toque). Todo lo importante es un botón visible.

## Cómo medir que funcionó

- **Conteo mecánico:** un chequeo en los tests cuenta los botones visibles por
  paso (sin contar el shell) y falla si superan 2. Esto convierte la regla en un
  límite, no en una opinión.
- Capturas antes/después de cada pantalla a 390 px; `scrollWidth` sigue en 390
  y no hay solapamiento con la barra inferior.
- axe y teclado siguen en verde; la cuenta de acciones primarias por paso sigue
  en 1.
- Validación con personas (P1, aún NOT RUN): “¿qué harías acá?” sin explicar
  primero. Si la persona empieza a leer la pantalla en voz alta o recorre los
  botones buscando cuál toca, el diseño no bajó la carga.
