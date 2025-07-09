#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const JSON5 = require('json5');

const DATA_DIR = path.join(process.cwd(), 'data');
const TEMP_DIR = path.join(process.cwd(), 'temp');
const AGENTS_DIR = path.join(DATA_DIR, 'agents');

async function createAgentsJson() {
  try {
    console.log('🔍 Loading agents data...');
    
    // Ensure temp directory exists
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }
    
    // Load index to get agent IDs
    const indexPath = path.join(DATA_DIR, 'index.json5');
    const indexContent = fs.readFileSync(indexPath, 'utf-8');
    const index = JSON5.parse(indexContent);
    
    // Load all agents
    const agents = [];
    
    for (const agentId of index.agents) {
      const agentPath = path.join(AGENTS_DIR, `${agentId}.json5`);
      
      if (fs.existsSync(agentPath)) {
        const agentContent = fs.readFileSync(agentPath, 'utf-8');
        const agent = JSON5.parse(agentContent);
        agents.push(agent);
        console.log(`✓ Loaded agent: ${agent.name}`);
      } else {
        console.warn(`⚠️  Agent file not found: ${agentId}.json5`);
      }
    }
    
    // Write agents array directly to temp/agents.json
    const outputPath = path.join(TEMP_DIR, 'agents.json');
    fs.writeFileSync(outputPath, JSON.stringify(agents, null, 2));
    
    console.log(`\n✅ Successfully created agents.json with ${agents.length} agents`);
    console.log(`📁 File location: ${outputPath}`);
    console.log(`📊 File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ Error creating agents.json:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  createAgentsJson();
}

module.exports = { createAgentsJson }; 