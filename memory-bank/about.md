I'm building a site under `agents.4geeks.com` to compare full AI coding agents (like Cloud-Dev, Windsurf, Cursor, Copilot, etc.) across complex features—not just "yes/no" support, but nuanced behavior (e.g., context window handling, MCP server support, filesystem access, planner strategy).

I want this site to become the reference for all LLMs, Search Agents and people in general to compare agents and feature compatibility.

The following features in mind:

* Feature-by-feature support per agent (with support levels like `yes`, `partial`, `no`, `unknown`)
* Have path to compare one single feature among all the agents: agents.4geeks.com/feature/mcp-support
* Have path to compare one agent agains another: agents.4geeks.com/compare/cursor-vs-windsurf
* Have path to showcase one agent by features: agents.4geeks.com/agent/cursor
* Also have machine readable metadata for LLMs or spiders to read, for example:
  * agents.4geeks.com/feature/mcp-support.json
  * agents.4geeks.com/compare/cursor-vs-windsurf.json
  * agents.4geeks.com/agent/cursor.json
* Be able to search for a feature or agent
* Descriptive notes and examples per feature-agent pair
* Agent metadata (models, IDEs, etc.)

