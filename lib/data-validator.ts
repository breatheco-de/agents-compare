import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'
import JSON5 from 'json5'
import type { Agent, Feature, AgentFeatureSupport, Index, SupportLevel, Category } from '@/types'
import { SUPPORT_LEVELS, CATEGORIES } from '@/types'

const DATA_DIR = join(process.cwd(), 'data')

// Validation error class
export class ValidationError extends Error {
  constructor(public file: string, public field: string, public value: any, message: string) {
    super(`[${file}] ${field}: ${message}. Got: ${JSON.stringify(value)}`)
    this.name = 'ValidationError'
  }
}

// Type guards
function isSupportLevel(value: any): value is SupportLevel {
  return SUPPORT_LEVELS.includes(value)
}

function isCategory(value: any): value is Category {
  return CATEGORIES.includes(value)
}

// Validation functions
function validateAgent(agent: any, filename: string): Agent {
  const errors: ValidationError[] = []

  // Required fields
  if (!agent.id || typeof agent.id !== 'string') {
    errors.push(new ValidationError(filename, 'id', agent.id, 'must be a non-empty string'))
  }
  if (!agent.name || typeof agent.name !== 'string') {
    errors.push(new ValidationError(filename, 'name', agent.name, 'must be a non-empty string'))
  }
  if (!Array.isArray(agent.aliases)) {
    errors.push(new ValidationError(filename, 'aliases', agent.aliases, 'must be an array'))
  }
  if (!agent.provider || typeof agent.provider !== 'string') {
    errors.push(new ValidationError(filename, 'provider', agent.provider, 'must be a non-empty string'))
  }
  if (!agent.website || typeof agent.website !== 'string') {
    errors.push(new ValidationError(filename, 'website', agent.website, 'must be a non-empty string'))
  }
  if (!Array.isArray(agent.supported_ide)) {
    errors.push(new ValidationError(filename, 'supported_ide', agent.supported_ide, 'must be an array'))
  }
  if (!agent.description || typeof agent.description !== 'string') {
    errors.push(new ValidationError(filename, 'description', agent.description, 'must be a non-empty string'))
  }

  // Check ID matches filename
  const expectedId = filename.replace('.json5', '')
  if (agent.id !== expectedId) {
    errors.push(new ValidationError(filename, 'id', agent.id, `must match filename (expected: ${expectedId})`))
  }

  if (errors.length > 0) {
    throw errors
  }

  return agent as Agent
}

function validateFeature(feature: any, filename: string): Feature {
  const errors: ValidationError[] = []

  // Required fields
  if (!feature.id || typeof feature.id !== 'string') {
    errors.push(new ValidationError(filename, 'id', feature.id, 'must be a non-empty string'))
  }
  if (!feature.name || typeof feature.name !== 'string') {
    errors.push(new ValidationError(filename, 'name', feature.name, 'must be a non-empty string'))
  }
  if (!Array.isArray(feature.aliases)) {
    errors.push(new ValidationError(filename, 'aliases', feature.aliases, 'must be an array'))
  }
  if (!feature.category || !isCategory(feature.category)) {
    errors.push(new ValidationError(filename, 'category', feature.category, `must be one of: ${CATEGORIES.join(', ')}`))
  }
  if (!feature.description || typeof feature.description !== 'string') {
    errors.push(new ValidationError(filename, 'description', feature.description, 'must be a non-empty string'))
  }

  // Check ID matches filename
  const expectedId = filename.replace('.json5', '')
  if (feature.id !== expectedId) {
    errors.push(new ValidationError(filename, 'id', feature.id, `must match filename (expected: ${expectedId})`))
  }

  if (errors.length > 0) {
    throw errors
  }

  return feature as Feature
}

function validateAgentFeatureSupport(support: any, filename: string, index: number): AgentFeatureSupport {
  const errors: ValidationError[] = []
  const prefix = `feature_support[${index}]`

  // Required fields
  if (!support.feature_id || typeof support.feature_id !== 'string') {
    errors.push(new ValidationError(filename, `${prefix}.feature_id`, support.feature_id, 'must be a non-empty string'))
  }
  if (!support.support_level || !isSupportLevel(support.support_level)) {
    errors.push(new ValidationError(filename, `${prefix}.support_level`, support.support_level, `must be one of: ${SUPPORT_LEVELS.join(', ')}`))
  }
  if (typeof support.notes !== 'string') {
    errors.push(new ValidationError(filename, `${prefix}.notes`, support.notes, 'must be a string'))
  }
  if (!Array.isArray(support.examples)) {
    errors.push(new ValidationError(filename, `${prefix}.examples`, support.examples, 'must be an array'))
  }
  if (!Array.isArray(support.links)) {
    errors.push(new ValidationError(filename, `${prefix}.links`, support.links, 'must be an array'))
  }
  if (!support.last_verified || typeof support.last_verified !== 'string') {
    errors.push(new ValidationError(filename, `${prefix}.last_verified`, support.last_verified, 'must be a non-empty string'))
  }
  if (!Array.isArray(support.sources)) {
    errors.push(new ValidationError(filename, `${prefix}.sources`, support.sources, 'must be an array'))
  }

  if (errors.length > 0) {
    throw errors
  }

  return support as AgentFeatureSupport
}

function validateSupportFile(data: any, filename: string): void {
  const errors: ValidationError[] = []

  // Check agent_id
  if (!data.agent_id || typeof data.agent_id !== 'string') {
    errors.push(new ValidationError(filename, 'agent_id', data.agent_id, 'must be a non-empty string'))
  }

  // Check feature_support array
  if (!Array.isArray(data.feature_support)) {
    errors.push(new ValidationError(filename, 'feature_support', data.feature_support, 'must be an array'))
  } else {
    // Validate each support entry
    data.feature_support.forEach((support: any, index: number) => {
      try {
        validateAgentFeatureSupport(support, filename, index)
      } catch (e) {
        if (Array.isArray(e)) {
          errors.push(...e)
        } else {
          errors.push(e as ValidationError)
        }
      }
    })
  }

  // Check agent_id matches filename
  const expectedAgentId = filename.replace('.json5', '')
  if (data.agent_id !== expectedAgentId) {
    errors.push(new ValidationError(filename, 'agent_id', data.agent_id, `must match filename (expected: ${expectedAgentId})`))
  }

  if (errors.length > 0) {
    throw errors
  }
}

function validateIndex(index: any, filename: string): Index {
  const errors: ValidationError[] = []

  if (!Array.isArray(index.features)) {
    errors.push(new ValidationError(filename, 'features', index.features, 'must be an array'))
  }
  if (!Array.isArray(index.agents)) {
    errors.push(new ValidationError(filename, 'agents', index.agents, 'must be an array'))
  }
  if (!Array.isArray(index.comparisons)) {
    errors.push(new ValidationError(filename, 'comparisons', index.comparisons, 'must be an array'))
  }

  if (errors.length > 0) {
    throw errors
  }

  return index as Index
}

// Main validation function
export async function validateAllData(): Promise<{ valid: boolean; errors: ValidationError[] }> {
  const allErrors: ValidationError[] = []
  
  try {
    // Validate index.json5
    console.log('Validating index.json5...')
    const indexPath = join(DATA_DIR, 'index.json5')
    const indexContent = readFileSync(indexPath, 'utf-8')
    const index = validateIndex(JSON5.parse(indexContent), 'index.json5')
    console.log('✓ index.json5 is valid')

    // Validate all agents
    console.log('\nValidating agents...')
    const agentsDir = join(DATA_DIR, 'agents')
    const agentFiles = readdirSync(agentsDir).filter(f => f.endsWith('.json5'))
    
    for (const file of agentFiles) {
      const filePath = join(agentsDir, file)
      const content = readFileSync(filePath, 'utf-8')
      try {
        validateAgent(JSON5.parse(content), file)
        console.log(`✓ agents/${file} is valid`)
      } catch (errors) {
        if (Array.isArray(errors)) {
          allErrors.push(...errors)
        } else {
          allErrors.push(errors as ValidationError)
        }
        console.log(`✗ agents/${file} has errors`)
      }
    }

    // Validate all features
    console.log('\nValidating features...')
    const featuresDir = join(DATA_DIR, 'features')
    const featureFiles = readdirSync(featuresDir).filter(f => f.endsWith('.json5'))
    
    for (const file of featureFiles) {
      const filePath = join(featuresDir, file)
      const content = readFileSync(filePath, 'utf-8')
      try {
        validateFeature(JSON5.parse(content), file)
        console.log(`✓ features/${file} is valid`)
      } catch (errors) {
        if (Array.isArray(errors)) {
          allErrors.push(...errors)
        } else {
          allErrors.push(errors as ValidationError)
        }
        console.log(`✗ features/${file} has errors`)
      }
    }

    // Validate all support files
    console.log('\nValidating support files...')
    const supportDir = join(DATA_DIR, 'support')
    const supportFiles = readdirSync(supportDir).filter(f => f.endsWith('.json5'))
    
    for (const file of supportFiles) {
      const filePath = join(supportDir, file)
      const content = readFileSync(filePath, 'utf-8')
      try {
        validateSupportFile(JSON5.parse(content), file)
        console.log(`✓ support/${file} is valid`)
      } catch (errors) {
        if (Array.isArray(errors)) {
          allErrors.push(...errors)
        } else {
          allErrors.push(errors as ValidationError)
        }
        console.log(`✗ support/${file} has errors`)
      }
    }

    // Cross-reference validation
    console.log('\nValidating cross-references...')
    
    // Check that all agents in index exist
    for (const agentId of index.agents) {
      const agentFile = `${agentId}.json5`
      if (!agentFiles.includes(agentFile)) {
        allErrors.push(new ValidationError('index.json5', 'agents', agentId, `referenced agent file does not exist: agents/${agentFile}`))
      }
    }

    // Check that all features in index exist
    for (const featureId of index.features) {
      const featureFile = `${featureId}.json5`
      if (!featureFiles.includes(featureFile)) {
        allErrors.push(new ValidationError('index.json5', 'features', featureId, `referenced feature file does not exist: features/${featureFile}`))
      }
    }

    // Check that all feature_ids in support files exist
    const validFeatureIds = new Set(index.features)
    for (const file of supportFiles) {
      const filePath = join(supportDir, file)
      const content = readFileSync(filePath, 'utf-8')
      const data = JSON5.parse(content)
      
      if (data.feature_support && Array.isArray(data.feature_support)) {
        data.feature_support.forEach((support: any, index: number) => {
          if (support.feature_id && !validFeatureIds.has(support.feature_id)) {
            allErrors.push(new ValidationError(`support/${file}`, `feature_support[${index}].feature_id`, support.feature_id, 'references non-existent feature'))
          }
        })
      }
    }

    console.log('\n' + '='.repeat(50))
    if (allErrors.length === 0) {
      console.log('✅ All data files are valid!')
      return { valid: true, errors: [] }
    } else {
      console.log(`❌ Found ${allErrors.length} validation errors:`)
      allErrors.forEach(error => {
        console.error(`  - ${error.message}`)
      })
      return { valid: false, errors: allErrors }
    }

  } catch (error) {
    console.error('Unexpected error during validation:', error)
    return { valid: false, errors: [error as ValidationError] }
  }
}

// CLI runner
if (require.main === module) {
  validateAllData().then(result => {
    process.exit(result.valid ? 0 : 1)
  })
} 