# Agent Detail Page Requirements — `/agent/[slug]`

## Overview

This document outlines the requirements for implementing dynamic agent detail pages that showcase individual AI coding agents with comprehensive feature support matrices, accessibility compliance, and optimal performance.

## 1. URL Structure & Routing

### 1.1 URL Pattern
- **Pattern**: `/agent/[slug]`
- **Example**: `https://agents.4geeks.com/agent/cursor`
- **Slug Format**: Lowercase, hyphenated (e.g., `claude-dev`, `cursor`, `windsurf`)

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
  - `aria-expanded` states for open/closed indicators
  - `aria-controls` linking triggers to content
  - Proper heading hierarchy within accordion items
  - Keyboard navigation support (Enter/Space to toggle, optional arrow key navigation)
- **Content structure**: Question as trigger, answer as expandable content
- **Default state**: All items collapsed on page load

## 4. Accessibility Requirements

### 4.1 ARIA Implementation
- **Tables**: `role="table"`, proper `scope` attributes
- **Accordions**: `aria-expanded`, `aria-controls`, `aria-labelledby`
- **Buttons**: Clear labels and states
- **Landmarks**: Proper section labeling with `aria-labelledby`

### 4.2 Keyboard Navigation
- **Tab Order**: Logical tab sequence
- **Enter/Space**: Activate buttons and links
- **Arrow Keys**: Navigate table cells (optional enhancement)
- **Escape**: Close expanded details (optional)

### 4.3 Screen Reader Support
- **Table Headers**: Proper `scope` attributes for row/column headers
- **Hidden Content**: Use `hidden` attribute, not CSS `display: none`
- **Live Regions**: Announce state changes when accordions expand

### 4.4 Lighthouse Accessibility Target
- **Minimum Score**: 95/100
- **Key Areas**: Color contrast, keyboard navigation, ARIA usage, semantic HTML

## 5. Performance Requirements

### 5.1 Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### 5.2 Lighthouse Performance Target
- **Minimum Score**: 90/100

### 5.3 Optimization Strategies
- **Lazy Loading**: Demo media with `loading="lazy"`
- **Image Optimization**: Next.js Image component for any images
- **Code Splitting**: Dynamic imports for heavy components
- **Caching**: Proper cache headers for static data

### 5.4 Lazy Loading Implementation
- **Images**: Use `loading="lazy"` attribute for demo images
- **Videos**: Implement lazy loading for demo videos with `preload="metadata"`
- **Alt text**: Provide descriptive alternative text for all images
- **Dimensions**: Specify width and height to prevent layout shift
- **Fallbacks**: Provide appropriate fallback content for unsupported media

## 6. Technical Implementation

### 6.1 Data Loading
- Load agent data from `data/agents/{slug}.json5`
- Load support matrix from `data/support/{slug}.json5`
- Implement caching for static data
- Handle missing data gracefully

### 6.2 Component Architecture
- **Main page component**: Central component that orchestrates the entire page
- **Modular components**: Break page into logical, reusable sections:
  - Header section for agent information
  - Metadata grid for technical details
  - Interactive support matrix table
  - FAQ accordion interface
  - Call-to-action section
- **Utility functions**: Schema.org generation and data processing helpers
- **Component separation**: Maintain clear separation of concerns between display and data logic

### 6.3 State Management
- Use React state for accordion expansion
- Implement keyboard event handlers
- Manage focus states for accessibility

### 6.4 Error Handling
- 404 page for invalid agent slugs
- Graceful degradation for missing data
- Error boundaries for component failures

## 7. Testing Requirements

### 7.1 Lighthouse Audits
- Run on development and production builds
- Test on both desktop and mobile
- Ensure accessibility score ≥ 95
- Ensure performance score ≥ 90

### 7.2 Accessibility Testing
- Screen reader testing (NVDA/JAWS/VoiceOver)
- Keyboard-only navigation testing
- Color contrast validation
- Focus management verification

### 7.3 Cross-Browser Testing
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)
- Test table responsiveness and accordion functionality

## 8. Future Enhancements

### 8.1 Interactive Features
- Filter support matrix by category
- Search within feature list
- Compare multiple agents side-by-side
- Export support matrix as PDF/CSV

### 8.2 Data Enhancements
- Version history tracking
- Community contributions for verification
- Screenshots/demos for each feature
- Performance benchmarks

## Implementation Priority

1. **Phase 1**: Basic page structure and data loading
2. **Phase 2**: Semantic table with accessibility features
3. **Phase 3**: FAQ accordion with proper ARIA
4. **Phase 4**: SEO and schema.org implementation
5. **Phase 5**: Performance optimization and lazy loading
6. **Phase 6**: Testing and Lighthouse compliance 