# Continuation prompt for Codex or another coding agent

This is a human-facing Spanish task prompt. It does not launch an agent or grant
standing Git authorization. Paste it as the task after making these files
available in the assigned checkout; provide any commit/push authorization explicitly.

```text
Repositorio: 0xnotwired/personal-hackathon
Rama de trabajo: ai-1

Continuá la aplicación existente de Autonomía Digital siguiendo el AGENTS.md de la raíz. Antes de actuar,
leé docs/AGENT_HANDOFF.md, las skills que indica para la fase correspondiente,
docs/IMPLEMENTATION_STATUS.md y el código/estado Git reales. Si tu herramienta no
descubre .commandcode/skills, abrí los SKILL.md directamente desde el filesystem.

El encargo es construir y verificar un simulador completo y utilizable para
personas mayores con muy baja familiaridad tecnológica. No hagas solo otro plan
ni pantallas sueltas. No conectes bancos, APIs de pagos ni proveedores reales.
No pidas credenciales financieras. El proveedor simulado es un módulo interno.

Consultá el estado real de M00–M10; no vuelvas a crear lo que ya funciona. Mantené el pago de una factura ficticia
de principio a fin, con inicio/favoritos, ayuda, voz opcional, progreso guardado,
revisión y confirmación explícita, resultados y comprobantes de práctica,
cancelación comprobable, recuperación de errores y repetición del ejercicio.
Mostrá «Modo práctica — no se mueve dinero». Los demás trámites se incorporan
después como simulaciones completas, sin botones que aparenten funcionar.

La interfaz y las explicaciones deben estar en español argentino. La app habla
y escucha con controles claros; toda la tarea también funciona sin micrófono.
Tocar varias veces, volver, recargar o mantener una tecla no puede confirmar por
accidente, perder el progreso ni duplicar la operación simulada.

Aplicá red-team-auditing a los veinte casos de docs/RED_TEAM_USABILITY.md y
verificá los invariantes I1–I12. Mantené el diseño móvil azul/celeste inspirado en Personal, el tono adulto de Ímpetu y la ayuda local contra presión con sus límites y atribuciones. Leé DESIGN_SYSTEM.md, COMPANION_CONTRACT.md y REUSE_ANALYSIS.md. Ejecutá la app y sus checks relevantes; no
declares terminada la tarea al instalar dependencias. Actualizá los comandos
probados, IMPLEMENTATION_STATUS.md y EVIDENCE_LEDGER.md con evidencia real.
No inventes pruebas con personas ni verificaciones de voz en teléfonos físicos.
Si una comprobación externa está bloqueada, completá el trabajo independiente
y explicá exactamente qué falta.

Respetá cambios ajenos, skills y preferencias. Trabajá en ai-1 y seguí R4:
sin commit, push ni merge a main salvo autorización explícita para esa acción.
Informá en español qué implementaste, cómo lo verificaste, qué queda pendiente
y cuál es el estado Git real.
```
