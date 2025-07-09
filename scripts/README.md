# Data Export Scripts

This directory contains scripts to generate combined JSON files for features and agents data.

## Available Commands

### `npm run create-features`
Combines all feature data from `data/features/` into a single JSON array.

**Output**: `temp/features.json`

**Structure**:
```json
[
  {
    "id": "mcp-support",
    "name": "MCP Server Support",
    "aliases": ["Model Context Protocol", "MCP", "context protocol"],
    "category": "Execution",
    "description": "...",
    // ... rest of feature object
  },
  // ... more features
]
```

### `npm run create-agents`
Combines all agent data from `data/agents/` into a single JSON array.

**Output**: `temp/agents.json`

**Structure**:
```json
[
  {
    "id": "cursor",
    "name": "Cursor",
    "aliases": ["Cursor.sh", "Cursor AI", "Cursor Editor"],
    "provider": "Cursor.sh",
    "website": "https://cursor.com",
    // ... rest of agent object
  },
  // ... more agents
]
```

## Usage

```bash
# Generate features.json
npm run create-features

# Generate agents.json
npm run create-agents

# Generate both files
npm run create-features && npm run create-agents
```

## Output Directory

All generated files are saved to the `temp/` directory, which is excluded from git via `.gitignore`.

## Use Cases

- **API Development**: Use these arrays as data sources for external APIs
- **Data Analysis**: Export all data for analysis in external tools
- **Documentation**: Generate comprehensive documentation from all features/agents
- **Testing**: Use combined datasets for testing and validation
- **Integration**: Import data into other systems or databases

## File Format

The generated files are clean JSON arrays (not JSON5) for maximum compatibility with other tools and systems. No metadata wrapper is included - just the raw feature/agent data arrays. 