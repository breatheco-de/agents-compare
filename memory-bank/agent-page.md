# Agent Detail Page Requirements — `/agent/[slug]`

## Overview

This document outlines the requirements for implementing dynamic agent detail pages that showcase individual AI coding agents with comprehensive feature support matrices, accessibility compliance, and optimal performance.

## 1. URL Structure & Routing

### 1.1 URL Pattern
- **Pattern**: `/agent/[slug]`
- **Example**: `https://agents.4geeks.com/agent/cursor`
- **Slug Format**: Lowercase, hyphenated (e.g., `claude-code`, `cursor`, `windsurf`)

### 1.2 Dynamic Route Implementation
- Use Next.js dynamic routing with `app/agent/[slug]/page.tsx`
- Implement `generateStaticParams()` for SSG
- Add proper 404 handling for invalid agent slugs
- Ensure slug normalization (case-insensitive matching)

## 2. SEO & Structured Data

### 2.1 Schema.org Markup
- **Primary Schema**: `Product` schema.org markup
- **Include Properties**:
  - `name`: Primary agent name
  - `alternateName`: Array of aliases (e.g., "Cursor AI", "Cursor Editor", "Cursor.sh")
  - `description`: Agent description from JSON data
  - `manufacturer`: Provider/company name
  - `url`: Official website URL
  - `softwareVersion`: Current version (if available)

### 2.2 Embedded FAQPage Schema
- Include **FAQPage** schema within the Product schema
- Generate from `faq` array in agent JSON data
- Minimum 2-3 questions per agent
- Structure: `mainEntity` array with `Question` and `Answer` types

### 2.3 Meta Tags
- **Title**: `{Agent Name} - AI Coding Agent Features & Capabilities`
- **Description**: Agent-specific description (max 160 chars)
- **Open Graph**:
  - `og:title`: Include primary name + aliases
  - `og:description`: Agent description
  - `og:type`: `website`
  - `og:url`: Canonical page URL
- **Twitter Card**: `summary` type
- **Canonical URL**: Self-referencing canonical tag

### 2.4 Machine-Readable JSON Endpoint
- Generate JSON endpoint at `/agent/[slug].json`
- Include complete agent data with support matrix
- Proper `Content-Type: application/json` headers
- Enable CORS for external access

## 3. Page Content Layout

### 3.1 Header Section
- **Primary heading**: Agent name as main page title
- **Aliases display**: Show alternative names (e.g., "Also known as: Cursor AI, Cursor Editor, Cursor.sh")
- **Description**: Agent description pulled from JSON data
- **External links**: Links to official website, documentation, GitHub, and other relevant resources

### 3.2 Metadata Section
- **Section heading**: "Agent Information"
- **Key-value pairs** presented in a structured format:
  - Provider/Company name
  - Supported IDEs and editors
  - Current version (if available)
  - Last updated date
  - Verification status with visual indicator
- **Semantic markup**: Use appropriate heading hierarchy and description list structure
- **Accessibility**: Proper labeling for screen readers

### 3.3 Feature Support Matrix

#### 3.3.1 Table Structure Requirements
- **Section heading**: "Feature Support Matrix"
- **Semantic table**: Use proper table markup with column headers
- **Column structure**:
  - Feature name (with proper row headers)
  - Support level indicator
  - Details/Actions column
- **Category grouping**: Group features by category with visual separation
- **Expandable rows**: Allow expansion of feature details within table structure
- **Table accessibility**:
  - Proper scope attributes for headers
  - ARIA labels for complex table relationships
  - Screen reader friendly navigation

#### 3.3.2 Support Level Indicators
- **✅ Yes**: Full support (green)
- **⚠️ Partial**: Partial support (yellow/amber)
- **❌ No**: No support (red)
- **❓ Unknown**: Unknown/unverified (gray)

#### 3.3.3 Interactive Features
- **Hover Popovers**: Show support level definitions
- **Accordion Expansion**: Click to reveal notes, examples, sources
- **Keyboard Navigation**: Full keyboard accessibility
- **Sticky Headers**: Category headers remain visible during scroll

### 3.4 Call-to-Action Section
- **Primary action**: "Compare with another agent" link to comparison page
- **Secondary action**: "See all agents" link back to homepage
- **Navigation flow**: Clear pathways for users to continue exploring
- **Visual hierarchy**: Distinguish between primary and secondary actions

### 3.5 FAQ Section
- **Section heading**: "Frequently Asked Questions"
- **Accordion interface**: Expandable/collapsible questions
- **Data source**: Generated from `faq` array in agent JSON files
- **Accordion accessibility**:
  - `aria-expanded`