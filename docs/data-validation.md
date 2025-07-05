# Data Validation System

## Overview

This project uses TypeScript types to enforce data integrity instead of relying on separate enum files. A comprehensive validation system ensures all data files conform to the defined types before deployment.

## TypeScript Enums

The project defines the following enum types in `types/index.ts`:

- **SupportLevel**: `'yes' | 'partial' | 'no' | 'unknown'`
- **Category**: `'Model Support' | 'Editor Integration' | 'Execution' | 'Planning'`

## Validation Features

The `lib/data-validator.ts` file provides comprehensive validation that:

1. **Type Validation**: Ensures all fields match their TypeScript types
2. **Enum Enforcement**: Validates that enum values match the defined constants
3. **File Naming**: Ensures IDs match their filename
4. **Cross-Reference Checking**: Validates that all referenced features and agents exist
5. **Required Fields**: Ensures all required fields are present

## When Validation Runs

### Automatic Validation

1. **Pre-build**: Runs automatically before `npm run build`
2. **Pre-commit**: Runs via Husky before any commit (local development)
3. **CI/CD**: Runs on every push and pull request via GitHub Actions

### Manual Validation

Run validation manually with:
```bash
npm run validate
```

## Validation Errors

When validation fails, you'll see detailed error messages like:

```
❌ Found 2 validation errors:
  - [test-feature.json5] category: must be one of: Model Support, Editor Integration, Execution, Planning. Got: "Invalid Category"
  - [support/cursor.json5] feature_support[0].support_level: must be one of: yes, partial, no, unknown. Got: "maybe"
```

## Adding New Enums

To add new enum values:

1. Update the type definition in `types/index.ts`
2. Update the corresponding constant array
3. The validation will automatically enforce the new values

Example:
```typescript
// types/index.ts
export type SupportLevel = 'yes' | 'partial' | 'no' | 'unknown' | 'planned'
export const SUPPORT_LEVELS = ['yes', 'partial', 'no', 'unknown', 'planned'] as const
```

## GitHub Actions

The `.github/workflows/validate.yml` workflow:
- Runs on every push to main/develop branches
- Runs on all pull requests
- Tests against Node.js 18.x and 20.x
- Performs validation, type checking, linting, and build

## Benefits

1. **Type Safety**: Enum values are enforced at the TypeScript level
2. **Early Detection**: Catches errors before they reach production
3. **No Runtime Overhead**: All validation happens during development/build
4. **Developer Experience**: Clear error messages help fix issues quickly
5. **CI/CD Integration**: Automated checks prevent bad data from being merged 