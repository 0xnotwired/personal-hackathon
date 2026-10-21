[English](README.md) · [Español](README_ES.md) · [Producto para el equipo](docs/PRODUCTO_EQUIPO.md)

# Autonomía Digital

**Entendé cada paso. Decidí vos.**

Una app móvil web para que personas mayores con muy poca familiaridad tecnológica
practiquen trámites con calma. Diseño azul y celeste inspirado en Personal,
indicaciones claras, un paso a la vez y voz opcional. **Es una práctica: no se mueve dinero.**

Ya funciona el recorrido de una factura ficticia de luz, gas o agua: elegir,
ingresar un ejemplo, revisar los datos, confirmar personalmente y recibir un
resultado verificado y un comprobante de práctica. Incluye borrador guardado,
favoritos, recuperación al recargar, historial, rechazo, resultado en revisión
y cancelación comprobada mientras la operación siga pendiente. La pantalla de
inicio muestra una sola tarjeta activa y “Ayuda y opciones”; cada pantalla del
trámite deja como máximo dos acciones visibles. Podés borrar tus datos de
práctica del navegador y del registro de la sesión; la app no pide claves ni
datos de tarjeta.

La ayuda incorpora el tono adulto y el próximo paso concreto de Ímpetu. “Me están
apurando para pagar” muestra frases para revisar y respuestas de ejemplo que la
app nunca envía, con adaptaciones de Gambit y Wolf and Cronos. No encontrar señales
no equivale a decir que un mensaje es seguro. [Análisis, fuentes y límites](docs/REUSE_ANALYSIS.md).
No conectamos bancos, proveedores de pagos, Google ni modelos externos de IA.

## Ejecutar

Con Node 24 y npm, desde la raíz:

```bash
npm ci
npm run dev
```

Para la versión de producción: `npm run build` y después `npm run start`.
Los comandos de verificación, ejemplos de facturas y requisitos de guardado están
en [RUNBOOK.md](docs/RUNBOOK.md). El [estado de implementación](docs/IMPLEMENTATION_STATUS.md)
distingue pruebas ejecutadas de verificaciones pendientes.

## Qué falta comprobar

Voz en teléfonos físicos, lector de pantalla y zoom manual completo, instalación
desde el navegador, uso sin indicaciones por personas del público objetivo y un
despliegue público con almacenamiento persistente. Los tests técnicos no prueban
por sí solos comprensión ni autonomía. No presentamos la marca visual como una
alianza oficial, ni esta app web como un binario nativo o una publicación en tiendas.

## Para el equipo y las próximas IAs

La rama de entrega es **`final`** (commit `18a4bda`, pusheada); `ai-1` queda como
rama de implementación anterior. No hace falta Devin. Leer [AGENTS.md](AGENTS.md) y
[AGENT_HANDOFF.md](docs/AGENT_HANDOFF.md), inspeccionar el código y continuar lo
pendiente. Las skills relevantes están en `.commandcode/skills/`.

- [Resumen completo del producto](docs/PRODUCTO_EQUIPO.md)
- [Diseño móvil](docs/DESIGN_SYSTEM.md) y [adaptación de Ímpetu](docs/COMPANION_CONTRACT.md)
- [Arquitectura y repos reutilizados](docs/ARCHITECTURE.md) y [plan por módulos](docs/ACTION_PLAN.md)
- [Validación](docs/VALIDATION.md), [red team de usabilidad](docs/RED_TEAM_USABILITY.md) y [evidencia](docs/EVIDENCE_LEDGER.md)
- [Hackathon](docs/HACKATHON_PLAYBOOK.md), [pitch de 3–5 minutos](docs/DEMO_AND_PITCH.md) y [referencia del libro](docs/BOOK_REFERENCE.md)

Licencia del proyecto: [Apache-2.0](LICENSE). [NOTICE](NOTICE) y `third_party/licenses/`
conservan las atribuciones y licencias del código adaptado. No distribuimos el libro.

[Continuar en GitHub Codespaces con la IA](docs/CODESPACES.md) · [Crear Codespace en final](https://codespaces.new/0xnotwired/personal-hackathon?ref=final)
