#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const JSON5 = require('json5');

const DATA_DIR = path.join(process.cwd(), 'data');
const TEMP_DIR = path.join(process.cwd(), 'temp');
const FEATURES_DIR = path.join(DATA_DIR, 'features');

async function createFeaturesJson() {
  try {
    console.log('🔍 Loading features data...');
    
    // Ensure temp directory exists
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }
    
    // Load index to get feature IDs
    const indexPath = path.join(DATA_DIR, 'index.json5');
    const indexContent = fs.readFileSync(indexPath, 'utf-8');
    const index = JSON5.parse(indexContent);
    
    // Load all features
    const features = [];
    
    for (const featureId of index.features) {
      const featurePath = path.join(FEATURES_DIR, `${featureId}.json5`);
      
      if (fs.existsSync(featurePath)) {
        const featureContent = fs.readFileSync(featurePath, 'utf-8');
        const feature = JSON5.parse(featureContent);
        features.push(feature);
        console.log(`✓ Loaded feature: ${feature.name}`);
      } else {
        console.warn(`⚠️  Feature file not found: ${featureId}.json5`);
      }
    }
    
    // Write features array directly to temp/features.json
    const outputPath = path.join(TEMP_DIR, 'features.json');
    fs.writeFileSync(outputPath, JSON.stringify(features, null, 2));
    
    console.log(`\n✅ Successfully created features.json with ${features.length} features`);
    console.log(`📁 File location: ${outputPath}`);
    console.log(`📊 File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ Error creating features.json:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  createFeaturesJson();
}

module.exports = { createFeaturesJson }; 