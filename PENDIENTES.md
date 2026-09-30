# Datos pendientes de verificar

Actualización de agentes de septiembre de 2026 (rama `update-agents-2026-09`).

Aquí están los datos que **no** se han publicado en la web por no estar confirmados en una fuente oficial.
Leyenda:

- ⚠️ **Fuente secundaria**: prensa, blogs o resultados de búsqueda; no confirmado en la página oficial.
- ❓ **Pendiente**: no encontrado en ninguna fuente, o fuentes contradictorias.

Cuando se verifique un dato, añádelo al JSON5 correspondiente con su enlace en `sources` y bórralo de esta lista.

## Herramientas eliminadas

| Herramienta | Dato | Estado | Referencia |
|---|---|---|---|
| Windsurf → Devin Desktop | Fecha exacta del cambio de nombre (02/06/2026) | ⚠️ | https://tech-insider.org/windsurf-devin-desktop-vs-cursor-2026/ |
| Amazon Q Developer | Q Developer en la consola de AWS no se retira; solo se retiran los plugins de IDE y las suscripciones de pago. Si en el futuro se quiere comparar la versión de consola, habría que crear un registro nuevo. | — | https://aws.amazon.com/blogs/devops/amazon-q-developer-end-of-support-announcement/ |

## Herramientas actualizadas

| Herramienta | Dato | Estado | Qué se hizo / referencia |
|---|---|---|---|
| Claude Code | Soporte de Neovim (claude-code.nvim) | ❓ | No aparece en la documentación oficial; se quitó de `supported_ide` y de las notas. |
| Claude Code | Nombre "Agent Teams" | ❓ | La documentación habla de subagentes y agentes en segundo plano; se quitó la FAQ "What is Agent Teams". |
| Claude Code | Precio exacto de Max 20x | ❓ | https://claude.com/pricing solo indica "From $100"; se publica "Max (from $100/month)". |
| Claude Code | FAQ de buenas prácticas ("/think", memoria con "#tags") | ❓ | Texto anterior no reverificado; no se modificó. |
| Cursor | Plan Teams Premium ($120/usuario) | ⚠️ | https://www.lowcode.agency/blog/cursor-ai-pricing — no publicado. |
| Cursor | Proveedor / "operación con SpaceX" (Grok como modelo propio) | ⚠️ | Solo prensa; `provider` sin cambios. |
| Cursor | Multiplicadores de crédito "3x" (Pro+) y "20x" (Ultra) | ❓ | No aparecen en la página oficial; se quitaron. |
| Cursor | FAQ "Background Agents" (la página de precios ahora dice "Cloud agents") | ❓ | No modificada. |
| Cursor | Tamaño de la ventana de contexto por modelo | ❓ | La nota de `context-window` ya no da cifras. |
| Devin | `mcp-support: no` | ❓ | La documentación de Devin CLI/Desktop tiene páginas de MCP (https://docs.devin.ai/llms.txt); falta confirmar para el agente en la nube. |
| GitHub Copilot | Versiones exactas de los modelos | ❓ | La documentación de planes solo lista familias; se publican las familias. |
| GitHub Copilot | Estado de Copilot Workspace | ❓ | Fuentes contradictorias; se quitaron las menciones. |
| GitHub Copilot | `supported_ide` Neovim / Emacs y la entrada `context-window` (last_verified 2024-01-15) | ❓ | Datos antiguos no reverificados. |
| Google Jules | Límites de tareas por plan (Google AI Pro / Ultra) | ❓ | Solo consta que "unlock higher task limits". |
| Google Jules | Disponibilidad por región | ❓ | — |
| Replit Agent | Nombre o versión actual del Agent (Agent 3, 4…) | ❓ | No figura en precios ni en novedades. |
| Replit Agent | Plan Teams | ❓ | No aparece en https://replit.com/pricing; se quitó la mención. |
| Replit Agent | `mcp-support: no` | ❓ | No reverificado. |
| Aider | Lista completa de modelos soportados | ❓ | El README aún recomienda Claude 3.7 / GPT-4o; se publica lo verificado en los commits de 2026. |
| Aider | Actividad del proyecto | — | Última versión 0.86.2 (12/02/2026); último commit en main el 22/05/2026. Revisar si sigue activo. https://pypi.org/project/aider-chat/#history |
| Aider | `mcp-support: no` | ❓ | No reverificado. |
