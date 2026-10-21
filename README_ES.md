[English](README.md) · [Español](README_ES.md) · **[Arquitectura técnica](docs/ARCHITECTURE.md)**

# Autonomía Digital

**Entendé cada paso. Decidí vos.**

Proponemos un acompañante digital para personas mayores que necesitan ayuda para
entender y completar trámites cotidianos. Combina instrucciones claras, ayuda
por voz opcional y recuperación de errores, manteniendo las decisiones en manos
de la persona.

## Cómo será la experiencia

La persona elige una tarea entre tarjetas grandes, pide ayuda cuando la necesita,
revisa qué va a pasar, confirma personalmente y recibe un resultado verificado.
Si se interrumpe el trámite, recupera su borrador. Si el estado de un pago es
incierto, el sistema consulta qué pasó antes de permitir otro intento.

El primer objetivo operativo es pagar una factura de servicios de principio a
fin. Turnos, transporte y compras se incorporarán como capacidades completas.
El diseño de nuestra compañera aporta la pantalla inicial, las tarjetas y los favoritos.

## El valor que queremos comprobar

| Necesidad | Respuesta propuesta |
| --- | --- |
| Entender | Explicaciones escritas y habladas sobre el paso y sus consecuencias |
| Decidir | Confirmación explícita; la voz no puede ejecutar un pago |
| Recuperarse | Borrador guardado, consulta del estado real y una salida útil ante errores |

Son requisitos e hipótesis por validar. El objetivo es un producto utilizable:
un recorrido simulado o una pantalla atractiva no equivalen a resolver un trámite real.

## Estado actual

**Estamos en planificación: todavía no hay aplicación implementada, pruebas con
usuarios ni una integración verificada de pagos reales.** Hay documentos de
producto, arquitectura, ejecución y validación, junto con las skills del repo.
Todavía no existe un comando para iniciar la app.

El [registro de evidencia](docs/EVIDENCE_LEDGER.md) distingue lo propuesto de lo
construido y probado. Vamos a medir comprensión y uso independiente; una opinión
favorable no alcanza para afirmar que el producto funciona.

## Documentos para el equipo

- **Empezar por acá:** [Resumen completo del producto en español](docs/PRODUCTO_EQUIPO.md).
- **Qué construiremos:** [Definición de producto](docs/PRODUCT.md) y [plan por módulos](docs/ACTION_PLAN.md).
- **Cómo lo construiremos:** [Arquitectura y repos a combinar](docs/ARCHITECTURE.md).
- **Cómo lo comprobaremos:** [Investigación y validación](docs/VALIDATION.md).
- **Cómo lo presentaremos:** [Estrategia del hackathon](docs/HACKATHON_PLAYBOOK.md) y [demo y pitch de 3/5 minutos](docs/DEMO_AND_PITCH.md).
- **Referencia utilizada:** [Aplicación del libro de Alvin Chia](docs/BOOK_REFERENCE.md).

El pitch dura entre 3 y 5 minutos según la información del usuario. No contamos
con criterios publicados; las dimensiones de revisión propuestas son internas.
Todavía debemos confirmar fecha, requisitos de entrega y reglas de reutilización.

## Organización y referencias

`AGENTS.md` define las reglas e invariantes; `docs/` reúne las decisiones y planes;
`.commandcode/` contiene las metodologías del equipo. Los módulos de aplicación
que aparecen en la arquitectura todavía deben crearse.

Usamos *Hackathons Unboxed* como referencia para investigar, experimentar y
presentar con evidencia. El libro no se distribuye dentro del repo y sus consejos
no sustituyen las reglas del evento ni nuestras verificaciones.

Licencia del repo: [Apache-2.0](LICENSE). Las dependencias y los recursos reutilizados
conservan sus propias licencias. Para trabajar, leer [AGENTS.md](AGENTS.md).
