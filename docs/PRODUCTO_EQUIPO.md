# Personal · Autonomía Digital — producto para el equipo

Documento para el equipo · 21 de octubre de 2026

**Estado actual:** ya existe una aplicación móvil web con el recorrido completo
para practicar el pago de una factura. Incluye guardado, favoritos, ayuda,
controles de voz, resultados, cancelación y comprobante de práctica. Las pruebas
con personas del público objetivo y de voz en teléfonos físicos siguen pendientes.
La simulación es el producto: no conectamos bancos ni proveedores reales.

**Diseño actual:** azul y celeste inspirado en Personal, una sola columna de
celular, botones grandes y navegación inferior con texto: Inicio, Ayuda y Voz.
Incluye metadatos para abrirse como app desde la pantalla de inicio en navegadores
compatibles; todavía no comprobamos esa instalación en un teléfono físico.

**Aportes incorporados:** de Ímpetu tomamos el tono adulto, un próximo paso concreto,
la pausa sin culpa y conservar el contexto. De Gambit, mostrar las frases que
respaldan una observación y ofrecer respuestas sin enviarlas. De Wolf and Cronos,
contrastar señales distintas antes de elevar la cautela. “Me están apurando para
pagar” permite practicar con ejemplos o revisar un mensaje localmente. Nunca dice
que un mensaje sea seguro por no encontrar señales y nunca confirma un pago.

[Diseño móvil](DESIGN_SYSTEM.md) · [Adaptación de Ímpetu](COMPANION_CONTRACT.md) ·
[Fuentes, código reutilizado y límites](REUSE_ANALYSIS.md) · [Cómo ejecutar](RUNBOOK.md)

[Plan por módulos](ACTION_PLAN.md) · [Arquitectura y repos](ARCHITECTURE.md) ·
[Estrategia del hackathon](HACKATHON_PLAYBOOK.md) · [Demo y pitch](DEMO_AND_PITCH.md)

## La idea en una frase

**Un acompañante digital que ayuda a las personas mayores a entender y completar
sus trámites en un entorno de práctica, con instrucciones claras, ayuda por voz
y decisiones que siguen siendo propias.**

La frase que proponemos para presentarlo es:

> **Entendé cada paso. Decidí vos.**

El objetivo es un **simulador completo y utilizable**. Se puede elegir una tarea,
practicarla de principio a fin, escuchar ayuda, revisar y confirmar, recuperar el
progreso, ver un resultado y comprobante de práctica, anular dentro del simulador
y volver a practicar. No alcanza con pantallas sueltas ni un botón que siempre
muestre éxito: esas funciones deben trabajar sobre datos y estados guardados.

**No vamos a conectar bancos, Mercado Pago, empresas de servicios ni APIs de
pagos.** Los servicios y las operaciones se simulan dentro de nuestra app.
“Completo” se refiere a la experiencia y su funcionamiento, no a mover dinero real.
La pantalla dirá **«Modo práctica — no se mueve dinero»** y el comprobante estará
identificado como comprobante de práctica.

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

### Diseñar para quien no sabe nada de tecnología

Ese es el caso de partida, no un usuario excepcional: alguien que no conoce las
palabras «sesión», «permiso» o «enlace», puede tocar varias veces y puede creer
que cerrar una pantalla cancela el pago. No debe necesitar una clase ni tener a
un familiar al lado para encontrar la primera acción.

El equipo tiene que comprobar, con personas de ese perfil, que:

- Cada pantalla dice qué hacer ahora, con una instrucción corta y un ejemplo cuando haga falta.
- Los botones dicen qué hacen; ni los íconos ni el color llevan información indispensable por sí solos.
- Tocar varias veces o mantener una tecla apretada no salta la revisión ni confirma un pago por accidente.
- «Volver y corregir», «Salir» y «Anular el pago» son acciones diferentes y se explican como tales.
- Cerrar después de confirmar no se presenta como una anulación; un pago incierto se consulta antes de volver a pagar.
- Se puede escuchar ayuda sin dar permiso al micrófono; negar ese permiso no bloquea los botones.
- Si no entiende, puede detenerse y pedir ayuda sin perder el trabajo ni entregar su contraseña.

Aplicamos la skill `red-team-auditing` para cuestionar estas suposiciones. La
[revisión](RED_TEAM_USABILITY.md) contiene cinco riesgos de diseño y veinte
escenarios para intentar romper el recorrido. Ya hay cobertura técnica de varios casos; el estado exacto está en IMPLEMENTATION_STATUS.md. Falta comprobar la comprensión con usuarios, incluyendo una primera
visita sin explicación previa y una segunda factura sin indicaciones.

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

## El primer trámite completo: practicar el pago de una factura

Construimos primero este recorrido simulado completo y luego incorporamos otras prácticas de trámites
con el mismo nivel de funcionamiento. Es un orden de construcción, no un recorte
de calidad ni un producto descartable para la demo.

| Paso | Qué hace la persona | Qué debe hacer el producto |
| --- | --- | --- |
| 1. Elegir | Toca «Pagar una factura» o usa una orden de voz admitida | Abrir el trámite correcto y explicar el siguiente paso |
| 2. Identificar | Elige el servicio e ingresa el dato solicitado de la factura | Mostrar un ejemplo, validar y permitir corregir sin borrar el trabajo |
| 3. Revisar | Comprueba servicio, destinatario e importe | Mostrar datos del servicio simulado, con una explicación comprensible |
| 4. Decidir | Confirma expresamente después de revisar | Ejecutar una única operación; ni la voz ni una sugerencia pueden pagar solas |
| 5. Saber | Consulta el resultado | Mostrar éxito, pendiente o fallo según el estado guardado del simulador; consultar si falta conocer el resultado |
| 6. Resolver | Guarda el comprobante, vuelve o pide ayuda | Ofrecer una salida útil, un comprobante de práctica y anulación real del estado simulado |

Si cierra o recarga antes de confirmar, recupera el paso y los datos guardados.
Si ya envió el pago y se corta la conexión, el producto consulta qué pasó con esa
operación. **No vuelve a pagar automáticamente.**

La factura y el dinero son ficticios, pero el recorrido funciona: guarda datos,
registra la operación simulada, responde a errores y permite recuperar y repetir.
No se pide una cuenta bancaria, PIN, tarjeta ni contraseña. No se abre otra app
para terminar el ejercicio. Completar la práctica nunca se presenta como haber
pagado una factura de verdad.

## Sí: el producto habla y escucha

La persona podrá elegir escuchar las instrucciones y activar el micrófono para
pedir ayuda o seleccionar una tarea. Ejemplos de la experiencia propuesta:

- «Buscá el número de cliente. Te mostramos un ejemplo de dónde aparece.»
- «En esta práctica, vas a pagar quince mil pesos a Luz Ejemplo. Revisá los datos antes de confirmar.»
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
pero no puede inventarlo. El «proveedor simulado» es un módulo interno nuestro,
no una empresa que debamos contratar o conectar. Es el motor de la versión final.

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
| Resultados y ayuda | Comprobantes de práctica, estados pendientes, recuperación y ayuda contextual que funciona |
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
de lo que hayamos construido y probado. Presentaremos el simulador como el
producto completo para practicar; estará identificado en pantalla y en el pitch.
No necesita conexiones financieras para cumplir el alcance acordado.

Usamos *Hackathons Unboxed*, de Alvin Chia, para mejorar el proceso: entender la
necesidad, poner a prueba las suposiciones más riesgosas, observar comportamiento
y explicar el valor con evidencia. El libro no garantiza ganar ni define las
reglas de nuestro evento. La decisión del equipo es construir un producto
utilizable; los experimentos ayudan a llegar a él.

## Cuándo podemos decir «está listo»

- Cada función habilitada completa su ejercicio simulado: inicio, revisión, confirmación, resultado y recuperación.
- No hay operaciones simuladas sin confirmación ni duplicados por reintentos o recargas; nunca se mueve dinero real.
- Se conserva el progreso y los errores tienen una salida comprensible.
- La voz funciona en los dispositivos admitidos y existe una alternativa completa sin voz.
- La interfaz se puede usar con teclado, lector de pantalla y aumento de texto; los controles y contrastes están comprobados.
- Los resultados y comprobantes corresponden al estado guardado del simulador; hay ayuda, privacidad y arranque probado.
- Las afirmaciones de la presentación corresponden a lo que efectivamente probamos.

Hoy siguen pendientes la implementación, las pruebas y la validación con personas.
No hay un proveedor real pendiente de conectar: está fuera del alcance. Los datos del evento que todavía
faltan —fecha de entrega, equipo completo y reglas de reutilización— deben
confirmarse para poner responsables y tiempos reales al trabajo.

**La meta compartida: que la persona pueda practicar una tarea completa,
entender qué hizo, conservar sus decisiones y aprender a recuperarse de errores.**
