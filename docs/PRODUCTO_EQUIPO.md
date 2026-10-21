# Autonomía Digital — el producto que vamos a construir

Documento para el equipo · 21 de octubre de 2026

**Estado actual:** tenemos el diseño y la planificación. Todavía no hay una
aplicación implementada, pruebas con usuarios ni una integración de pagos reales.

[Plan por módulos](ACTION_PLAN.md) · [Arquitectura y repos](ARCHITECTURE.md) ·
[Estrategia del hackathon](HACKATHON_PLAYBOOK.md) · [Demo y pitch](DEMO_AND_PITCH.md)

## La idea en una frase

**Un acompañante digital que ayuda a las personas mayores a entender y completar
sus trámites, con instrucciones claras, ayuda por voz y decisiones que siguen
siendo propias.**

La frase que proponemos para presentarlo es:

> **Entendé cada paso. Decidí vos.**

El objetivo es un **producto utilizable**. Eso exige que las funciones que
ofrecemos sirvan de principio a fin: iniciar, entender, completar, conocer el
resultado y resolver una dificultad. Las pantallas, los bocetos y las
simulaciones ayudan a construirlo y probarlo; no alcanzan para darlo por terminado.

## Para quién y qué problema queremos resolver

Nos enfocamos inicialmente en una persona mayor que tiene acceso a un celular y
puede tomar sus decisiones, pero encuentra dificultades para entender un trámite
digital o teme cometer un error que después no pueda resolver.

No suponemos que todas las personas mayores tengan las mismas dificultades.
Algunas necesitan letras o controles más claros; otras, explicaciones; otras,
saber si realmente pagaron y qué hacer ante un resultado incierto. La voz puede
ayudar a algunas personas y molestar o no servir a otras.

Nuestra hipótesis principal es que **entender las consecuencias, conservar el
control y poder recuperarse** puede ayudar más que simplemente reducir botones.
Todavía debemos comprobarlo observando tareas reales de uso con datos de prueba.

El resultado que buscamos no es que un asistente haga todo por la persona. Es
que pueda terminar una tarea y entender qué decidió y qué pasó.

## Cómo se verá

Tomamos el diseño de nuestra compañera como punto de entrada:

> **¿Qué necesitás hacer?**
>
> 💡 Pagar una factura
>
> 🩺 Pedir un turno médico
>
> 🚌 Organizar un viaje
>
> 🛒 Hacer una compra
>
> ⭐ Mis favoritos
>
> 🎤 Contame qué necesitás · ❓ ¿Qué hago?

Este ejemplo muestra la visión del producto, no funciones ya construidas.
**Cada tarjeta habilitada deberá llevar a un recorrido completo y operativo.**
Los servicios todavía no disponibles no se presentarán como botones que funcionan.

Las tarjetas tendrán texto junto al ícono, letras legibles y controles grandes.
Los favoritos permitirán encontrar tareas frecuentes. La ayuda y la forma de
volver estarán en lugares predecibles.

## El primer trámite completo: pagar una factura

Construimos primero este recorrido completo y luego incorporamos otros trámites
con el mismo nivel de funcionamiento. Es un orden de construcción, no un recorte
de calidad ni un producto descartable para la demo.

| Paso | Qué hace la persona | Qué debe hacer el producto |
| --- | --- | --- |
| 1. Elegir | Toca «Pagar una factura» o usa una orden de voz admitida | Abrir el trámite correcto y explicar el siguiente paso |
| 2. Identificar | Elige el servicio e ingresa el dato solicitado de la factura | Mostrar un ejemplo, validar y permitir corregir sin borrar el trabajo |
| 3. Revisar | Comprueba servicio, destinatario e importe | Mostrar datos provenientes del proveedor, con una explicación comprensible |
| 4. Decidir | Confirma expresamente después de revisar | Ejecutar una única operación; ni la voz ni una sugerencia pueden pagar solas |
| 5. Saber | Consulta el resultado | Mostrar éxito, pendiente o fallo según la respuesta real; reconocer cuando todavía no sabemos el estado |
| 6. Resolver | Guarda el comprobante, vuelve o pide ayuda | Ofrecer una salida útil; permitir cancelación solo cuando el proveedor lo admita |

Si cierra o recarga antes de confirmar, recupera el paso y los datos guardados.
Si ya envió el pago y se corta la conexión, el producto consulta qué pasó con esa
operación. **No vuelve a pagar automáticamente.**

Para una factura real, el trámite no está completo hasta que una integración
autorizada efectivamente pague la deuda y permita verificar el resultado. Una
API que recibe dinero para un comercio no demuestra esa capacidad. Abrir Mercado
Pago u otra aplicación tampoco permite afirmar por sí solo que la factura se pagó.

## Sí: el producto habla y escucha

La persona podrá elegir escuchar las instrucciones y activar el micrófono para
pedir ayuda o seleccionar una tarea. Ejemplos de la experiencia propuesta:

- «Buscá el número de cliente. Te mostramos un ejemplo de dónde aparece.»
- «Vas a pagar quince mil pesos a Luz Ejemplo. Revisá los datos antes de confirmar.»
- «Todavía no pudimos confirmar el resultado. Vamos a revisar antes de volver a pagar.»

Las órdenes iniciales a implementar incluyen «quiero pagar la luz», «repetí»,
«más despacio» y «no entiendo». Una frase que el sistema no reconoce no debe
convertirse en una acción financiera ni en un importe adivinado.

Habrá controles para escuchar, pausar, repetir, bajar la velocidad, detener y
silenciar. El micrófono se activará por decisión de la persona y mostrará cuándo
está escuchando. No habrá escucha permanente ni almacenamiento de grabaciones o
transcripciones. Antes de elegir el motor de voz debemos verificar dónde procesa
el audio y explicarlo.

**Toda la tarea también se podrá realizar con texto, botones y teclado.** La
compatibilidad y calidad de voz deben comprobarse en teléfonos físicos; todavía
no están verificadas.

## Qué nos puede diferenciar

Queremos unir tres cosas durante el mismo trámite:

1. **Comprensión:** explicar qué dato hace falta y qué significa cada decisión.
2. **Control:** la persona revisa y confirma; el sistema acompaña.
3. **Recuperación:** conserva el progreso y ayuda a resolver errores o resultados inciertos.

La voz y los botones grandes apoyan esa experiencia. El diferencial no consiste
solo en agregarlos. Tendremos que comparar nuestro recorrido con alternativas
que las personas ya usan y observar si realmente mejora su autonomía.

## Con qué piezas lo construiremos

No vamos a pegar aplicaciones enteras. Reutilizaremos paquetes donde encajen y
tomaremos patrones de otros proyectos, conservando sus licencias y avisos.

| Pieza | Uso propuesto |
| --- | --- |
| [Next.js](https://github.com/vercel/next.js) + TypeScript | Una aplicación web para celular, con interfaz y servidor en el mismo proyecto |
| [React Aria](https://github.com/adobe/react-spectrum) | Controles accesibles, teclado, foco y diálogos |
| [XState](https://github.com/statelyai/xstate) | Organizar los pasos y evitar transiciones que no correspondan |
| [Zod](https://github.com/colinhacks/zod) y, si hace falta, [React Hook Form](https://github.com/react-hook-form/react-hook-form) | Validar datos y manejar formularios |
| [Dexie](https://github.com/dexie/Dexie.js) | Guardar borradores, favoritos y preferencias en el dispositivo |
| [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) | Registro durable de operaciones simuladas en un servidor; candidato a verificar |
| [Playwright](https://github.com/microsoft/playwright) y [axe](https://github.com/dequelabs/axe-core) | Probar recorridos y detectar problemas de accesibilidad |
| [MSW](https://github.com/mswjs/msw) | Probar respuestas inciertas y errores de red durante desarrollo |

Tomamos como referencias [GOV.UK](https://github.com/alphagov/govuk-frontend),
[Docassemble](https://github.com/jhpyle/docassemble),
[Assembly Line](https://github.com/SuffolkLITLab/docassemble-AssemblyLine) y
[AI Senior Assistant](https://github.com/mateo252/AI-Senior-Assistant) para trámites
claros, ayuda contextual y acompañamiento. [SurveyJS](https://github.com/surveyjs/survey-library)
queda como alternativa de formularios si demuestra encajar mejor; no se suma por
defecto a otro motor.

**Regla técnica importante:** el dispositivo guarda el borrador; el servidor y
el proveedor determinan el estado de una operación. La voz explica ese estado,
pero no puede inventarlo. El proveedor simulado se usa para verificar el sistema;
la integración real requiere otro adaptador y sus propios controles.

## Módulos a construir

| Módulo | Responsabilidad |
| --- | --- |
| Producto y validación | Definir las tareas, observar a usuarios y convertir hallazgos en cambios verificables |
| Base de aplicación | Instalación repetible, rutas, configuración y pruebas desde el inicio |
| Modelo del trámite | Pasos, reglas, estados, textos e importes |
| Interfaz accesible | Pantalla inicial, tarjetas, formularios, ayuda y navegación |
| Persistencia | Recuperar borradores, favoritos y preferencias sin confundirlos con pagos confirmados |
| Operaciones | Proveedor simulado, registro durable, prevención de duplicados y cancelación comprobable |
| Integración y autoridad | Validar solicitudes, proteger sesiones, confirmar y consultar operaciones |
| Voz | Leer ayuda, escuchar órdenes admitidas y manejar permisos/errores |
| Resultados y soporte | Comprobantes, estados pendientes, recuperación y una ayuda operativa real |
| Integración de servicios reales | Verificar capacidades, autorizaciones, liquidación y reconciliación del proveedor |
| Operación y entrega | Publicación, seguridad, privacidad, copias/restauración, seguimiento y responsables |

El [plan detallado](ACTION_PLAN.md) conserva los identificadores y dependencias
para implementar, probar e integrar cada módulo.

## Cómo vamos a saber si sirve

Vamos a observar si una persona puede completar una tarea, explicar a quién le
paga y cuánto, distinguir un pago pendiente de uno confirmado, recuperarse de
una interrupción y resolver después otra factura sin que alguien tome el control.

No alcanza con que diga «me gusta». Tampoco alcanza con que pasen los tests:
los tests comprueban comportamiento del software; la observación comprueba
comprensión y dificultades de uso.

El protocolo propone empezar con cinco participantes y reportar exactamente
cuántos terminaron, necesitaron ayuda o se detuvieron. Es una exploración pequeña,
no una prueba de que funcionará para toda la población. Todavía no se realizaron
esas sesiones. No usaremos dinero ni datos bancarios reales en investigación.

## Qué vamos a mostrar en el hackathon

Tenemos un pitch de **3 a 5 minutos** y no contamos con criterios publicados.
Prepararemos ambas duraciones, una demo del recorrido y un respaldo grabado de
la misma versión, identificado como grabación.

Queremos que se vea una tarea completa: elegir, escuchar ayuda, revisar,
interrumpir y recuperar, confirmar y conocer el resultado. Mostraremos evidencia
real de lo que hayamos construido y probado. Si usamos el simulador, lo diremos
en pantalla y al presentar; no lo describiremos como un pago real.

Usamos *Hackathons Unboxed*, de Alvin Chia, para mejorar el proceso: entender la
necesidad, poner a prueba las suposiciones más riesgosas, observar comportamiento
y explicar el valor con evidencia. El libro no garantiza ganar ni define las
reglas de nuestro evento. La decisión del equipo es construir un producto
utilizable; los experimentos ayudan a llegar a él.

## Cuándo podemos decir «está listo»

- Las funciones ofrecidas completan la tarea real declarada, con el proveedor autorizado que corresponda.
- No hay acciones financieras sin confirmación ni pagos duplicados por reintentos o recargas.
- Se conserva el progreso y los errores tienen una salida comprensible.
- La voz funciona en los dispositivos admitidos y existe una alternativa completa sin voz.
- La interfaz se puede usar con teclado, lector de pantalla y aumento de texto; los controles y contrastes están comprobados.
- Tenemos resultados verificados, soporte con responsable, privacidad, despliegue y recuperación operativa.
- Las afirmaciones de la presentación corresponden a lo que efectivamente probamos.

Hoy siguen pendientes la implementación, las pruebas, la validación con personas
y la elección/verificación del proveedor real. Los datos del evento que todavía
faltan —fecha de entrega, equipo completo y reglas de reutilización— deben
confirmarse para poner responsables y tiempos reales al trabajo.

**La meta compartida: que la persona termine una tarea entendiendo qué hizo,
conservando sus decisiones y sabiendo cómo seguir si algo no sale bien.**
