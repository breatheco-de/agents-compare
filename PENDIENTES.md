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

## Herramientas nuevas

### Celdas de soporte marcadas como `unknown`

Estas celdas están publicadas como `unknown` con la nota "Pending verification". Hay que buscar una fuente oficial para cada una.

| Herramienta | Características sin verificar |
|---|---|
| devin-desktop | context-window |
| kiro | automatic-context-awareness, broad-ide-integration, console-error-integration, interactive-element-selection, live-web-preview |
| google-antigravity | automatic-context-awareness, console-error-integration, context-window, interactive-element-selection |
| openai-codex | automatic-context-awareness, console-error-integration, context-window, interactive-element-selection, live-web-preview, planner-strategy |
| gemini-cli | automatic-context-awareness, console-error-integration, interactive-element-selection, live-web-preview, planner-strategy |
| opencode | automatic-context-awareness, console-error-integration, context-window, interactive-element-selection, live-web-preview |
| cline | automatic-context-awareness, console-error-integration, context-window, interactive-element-selection |

### Datos no publicados

| Herramienta | Dato | Estado | Referencia |
|---|---|---|---|
| Devin Desktop | Soporte de agentes de terceros vía ACP (Codex, Claude Agent, OpenCode) | ⚠️ | https://tech-insider.org/windsurf-devin-desktop-vs-cursor-2026/ |
| Devin Desktop | Versiones concretas de Claude/GPT disponibles | ❓ | https://docs.devin.ai/cli/models.md no las enumera |
| Kiro | Fecha formal de GA ("noviembre de 2025") | ❓ | Verificado solo: sin lista de espera desde la semana del 20/10/2025 (https://aws.amazon.com/blogs/aws/aws-weekly-roundup-kiro-waitlist-ebs-volume-clones-ec2-capacity-manager-and-more-october-20-2025) |
| Kiro | Base del IDE (¿Code OSS?) y sistemas operativos soportados | ❓ | — |
| Kiro | Qué es exactamente "Kiro Crew" (aparece en la página de precios) | ❓ | https://kiro.dev/pricing/ |
| Google Antigravity | Fecha de Antigravity 2.0 (19/05/2026) y nombre del comando de la CLI (`agy`) | ⚠️ | https://thenextweb.com/news/google-antigravity-2-desktop-cli-sdk-io-2026 |
| Google Antigravity | Precios en $ de Google AI Pro / Ultra para Antigravity | ❓ | https://antigravity.google/pricing no da cifras |
| OpenAI Codex | Si Codex está incluido en ChatGPT Free o Go | ❓ | https://github.com/openai/codex lista Plus, Pro, Business, Edu, Enterprise |
| OpenAI Codex | Modo de planificación | ❓ | No hay página dedicada en la documentación |
| Gemini CLI | Tarifas del uso de pago | ❓ | Solo "usage-based billing" |
| Gemini CLI | Si admite modelos que no sean Gemini | ❓ | — |
| OpenCode | Empresa detrás del proyecto (el repo pertenece a "anomalyco") y última versión publicada | ❓ | https://github.com/sst/opencode |
| OpenCode | Número de estrellas (≈211k el 30/09/2026) — cambiará con el tiempo | — | https://github.com/sst/opencode |
| Cline | Empresa proveedora, última versión y modelos Claude concretos | ❓ | https://docs.cline.bot/provider-config/anthropic.md no enumera versiones |

## Característica `claude-latest-support`

Sustituye a `claude3-support` y `claude-4-support`. Criterio: el agente permite usar modelos Claude 4.5 o posteriores.

| Herramienta | Estado publicado | Qué falta |
|---|---|---|
| devin-ai, devin-desktop | unknown | Hay modelos Claude disponibles, pero la documentación no dice qué versiones. |
| cline, opencode | unknown | Aceptan claves de Anthropic, pero la documentación no enumera versiones de Claude. |
| google-jules, openai-codex, gemini-cli | unknown | No se encontró documentación sobre Claude (probablemente `no`, pero sin fuente que lo diga). |

Otros efectos de este cambio:

- ✅ Resuelto: `/feature/claude3-support` y `/feature/claude-4-support` redirigen con un 301 a `/feature/claude-latest-support` (`next.config.js`).
- `overview.md` (inventario del apéndice y ejemplo de `index.json5`) y `memory-bank/v0-requirements.md` siguen citando las características antiguas y agentes como windsurf. Son documentos internos que ya estaban desactualizados antes de este cambio; no se modificaron.

## Enlaces y rutas

- ✅ Arreglado: los enlaces `/compare/<a>-vs-<b>` de la portada y el botón "Compare with another agent" de cada ficha de agente apuntaban a una ruta que no existe. Ahora usan `/compare?agents=a,b`, que la página de comparación ya interpreta.
- ❓ No arreglado (fuera del alcance): los rewrites `.json` de `next.config.js` apuntan a rutas de API que no existen. `/agent/:slug.json` va a `/api/agents/:slug` y `/feature/:slug.json` a `/api/features/:slug`, pero las carpetas se llaman `api/agent` y `api/feature`. `/compare/:slugs.json` va a `/api/compare/:slugs`, que no tiene ruta dinámica.
