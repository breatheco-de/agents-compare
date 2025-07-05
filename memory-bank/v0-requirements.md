Requirements

* Use next js SSR, typescript and SchaCN with tailwind.
* This project has to be built thinking of SEO and LLM Discoverability in mind with lots of use of Semantic HTML + schema.org.
* All the project database has to be in static json files that support comments and that can be pull requested via github.
* Feature-by-feature support per agent (with support levels: `yes`, `partial`, `no`, `unknown`)
* Have path to compare one single feature among all the agents: agents.4geeks.com/feature/mcp-support
  * Use FAQPage schema.org to include possible questions that may araise about the feature
* Have path to compare one agent agains another: agents.4geeks.com/compare/cursor-vs-windsurf
  * Slug normalization: Use alphabetical ordering to build the comparison slug urls to avoid duplication in cursor-vs-windsurf and windsurf-vs-cursor
  * Use FAQPage schema.org to include possible questions that may araise on this comparison
* Have path to showcase one agent by features: agents.4geeks.com/agent/cursor
  * Use Product schema.org for the agent and make sure to include the aliases as "alternateName"
  * In the `<meta>` tags include `meta[property="og:title"]` for agent aliases
  * Use FAQPage schema.org to include possible questions that may araise about the agent
* Also have machine readable metadata for LLMs or spiders to read, for example:
  * agents.4geeks.com/feature/mcp-support.json
  * agents.4geeks.com/compare/cursor-vs-windsurf.json
  * agents.4geeks.com/agent/cursor.json
* Be able to search for a feature or agent, including the aliases
* Descriptive notes and examples per feature-agent pair

## Database Models

### Index json

```json
{
  "features": ["mcp-support", "context-window", "claude3-support"],
  "agents": ["cursor", "windsurf", "devin"],
  "comparisons": ["cursor-vs-windsurf"]
}
```

### Enumerates (enums.json)

```json
{
  "support_levels": ["yes", "partial", "no", "unknown"],
  "categories": ["Model Support", "Editor Integration", "Execution", "Planning"]
}
```


### Agent

```json
{
  "id": "cursor",
  "name": "Cursor",
  "aliases": ["Cursor.sh", "Cursor AI", "Cursor Editor"],
  "provider": "Cursor.sh",
  "website": "https://www.cursor.sh",
  "supported_ide": ["VSCode (fork)"],
  "description": "A VSCode-based AI agent for editing, refactoring, and task-based coding."
}

```


### Feature

```json
{
  "id": "mcp_support",
  "name": "MCP Server Support",
  "alias": ["token limit", "max context", "context length"],
  "category": "Execution",
  "description": "Ability to connect to and interact with an MCP (multi-code process) server, including task delegation and code execution."
}
```

```json
{
  "id": "model_support_gpt4",
  "name": "GPT-4 Support",
  "alias": [],
  "category": "Model Support",
  "description": "Ability to use GPT-4 (Turbo or legacy) for completions and task execution."
}
```

```json
{
  "id": "model_support_claude3_opus",
  "name": "Claude 3 Opus Support",
  "alias": [],
  "category": "Model Support",
  "description": "Ability to use Claude 3 Opus as the backend model."
}
```


### AgentFeatureSupport

```json
{
  "agent_id": "cursor",
  "feature_id": "mcp_support",
  "support_level": "partial",     // enum: yes, partial, no, unknown
  "notes": "Can integrate with an MCP server via user-specified script hooks, but lacks native protocol understanding.",
  "examples": [
    "Using the CLI script in the MCP repo, Cursor can run jobs and monitor output."
  ],
  "links": [
    "https://docs.cursor.sh/mcp-integration"
  ],
  "last_verified": "2025-07-04",
  "sources": ["https://docs.cursor.sh/mcp-integration"]
}
```

```json
{
  "agent_id": "cursor",
  "feature_id": "model_support_claude3_opus",
  "support_level": "partial",
  "notes": "Can use Claude 3 via OpenAI-compatible proxy by manually configuring `OPENAI_API_BASE`, but not officially supported.",
  "examples": [
    "Set `OPENAI_API_BASE=https://api.anthropic-proxy.example.com` to use Claude 3."
  ],
  "last_verified": "2025-07-04",
  "sources": ["https://docs.cursor.sh/mcp-integration"]
}
```

## UX/UI Patterns to Support

- Comparison view: like agents.4geeks.com/compare/cursor-vs-devin
- Expandable table cells for notes or examples
- Filter by feature (e.g. "Show only agents that support context > 100k")
- Sort by capability (e.g. agents with native file access)
- Searchable glossary of feature definitions (for terms like "planner", "context trimming", "ephemeral memory")