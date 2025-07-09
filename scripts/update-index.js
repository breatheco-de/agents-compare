#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const JSON5 = require('json5');

const DATA_DIR = path.join(process.cwd(), 'data');
const FEATURES_DIR = path.join(DATA_DIR, 'features');
const AGENTS_DIR = path.join(DATA_DIR, 'agents');
const INDEX_PATH = path.join(DATA_DIR, 'index.json5');

function getIdsFromDir(dir) {
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json5'))
    .map(f => f.replace('.json5', ''))
    .sort();
}

function updateIndex() {
  // Read current index.json5
  const indexContent = fs.readFileSync(INDEX_PATH, 'utf-8');
  const index = JSON5.parse(indexContent);

  // Get all feature and agent IDs
  const features = getIdsFromDir(FEATURES_DIR);
  const agents = getIdsFromDir(AGENTS_DIR);

  // Update index object
  index.features = features;
  index.agents = agents;

  // Write back as JSON5 (preserving comments if possible)
  const output = JSON.stringify(index, null, 2);
  fs.writeFileSync(INDEX_PATH, output + '\n');

  console.log(`✅ Updated index.json5 with ${features.length} features and ${agents.length} agents.`);
}

if (require.main === module) {
  updateIndex();
}

module.exports = { updateIndex }; 