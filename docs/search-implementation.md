# Search Function Implementation Plan

## Overview
Implement client-side search for the cheat sheet static site to allow users to quickly find commands and tips across all sections.

## Architecture Decision: Build-Time Index Generation

**YES - Generate search index during build process**

### Why Build-Time Index?
- **Performance**: Pre-processed index loads instantly
- **Efficiency**: No runtime processing of all section files
- **Smaller Bundle**: Optimized search data structure
- **Better UX**: Instant search results as user types

## Implementation Strategy

### 1. Build-Time Index Generation

**Location**: `scripts/build-search-index.js`

**Process**:
1. Read all section files from `data/sections/`
2. Extract searchable content:
   - Command text
   - Description text
   - Section title
   - Category title
   - Keywords/tags
3. Create flattened search index with metadata
4. Generate `public/search-index.json`

**Index Structure**:
```json
{
  "items": [
    {
      "id": "git-basic-status",
      "command": "git status",
      "description": "Check repository status and see what files have changed",
      "section": "git",
      "sectionTitle": "Git",
      "category": "Basic Commands",
      "keywords": ["status", "check", "files", "changes"],
      "url": "/git#basic-commands"
    }
  ],
  "metadata": {
    "totalItems": 150,
    "sections": ["git", "seo", "install-software", "nextjs", "aws", "maggie-workflows"],
    "buildTime": "2025-10-30T05:22:00Z"
  }
}
```

### 2. Search Component

**Location**: `src/components/Search.tsx`

**Features**:
- Real-time filtering as user types
- Fuzzy matching for typos
- Highlight matching terms
- Keyboard navigation (↑↓ arrows, Enter)
- Category/section filtering
- Recent searches (localStorage)

**Search Algorithm**:
1. **Exact matches** (highest priority)
2. **Starts with** matches
3. **Contains** matches
4. **Fuzzy matches** (edit distance)

### 3. Search UI/UX

**Search Bar Placement**:
- Header component (always visible)
- Keyboard shortcut: `Cmd/Ctrl + K`
- Mobile-friendly with proper focus handling

**Results Display**:
- Dropdown overlay with results
- Show: command, description, section badge
- Click to navigate to specific section
- "Show all X results" link for extensive results

**Visual Design**:
- GitHub-style search interface
- Section color coding
- Command syntax highlighting
- Loading states and empty states

## Technical Implementation

### 1. Build Script Integration

**Update `package.json`**:
```json
{
  "scripts": {
    "build": "npm run build-search-index && next build",
    "build-search-index": "node scripts/build-search-index.js"
  }
}
```

### 2. Search Index Builder

**Key Functions**:
- `extractSearchableContent()` - Parse section files
- `generateKeywords()` - Extract relevant keywords
- `createSearchIndex()` - Build optimized index
- `writeIndexFile()` - Output to public directory

### 3. Client-Side Search

**Search Hook**: `useSearch()`
- Load search index on first use
- Debounced search (300ms)
- Memoized results
- Search history management

**Search Utilities**:
- `fuzzyMatch()` - Approximate string matching
- `highlightMatches()` - Highlight search terms
- `rankResults()` - Score and sort results

## Performance Considerations

### Index Size Optimization
- **Estimated size**: ~50KB for 150+ commands
- **Compression**: Gzip reduces to ~15KB
- **Lazy loading**: Load index only when search is used
- **Caching**: Browser caches index file

### Search Performance
- **Target**: <50ms search response time
- **Optimization**: Pre-computed keywords and metadata
- **Limits**: Show max 20 results, "show more" for rest
- **Debouncing**: Prevent excessive searches while typing

## Deep Linking to Specific Commands

### URL Structure for Command Selection

**Format**: `/[section]/[category]?selected=[command-id]`

**Examples**:
- `/install-software/homebrew?selected=brew-version`
- `/git/basic-commands?selected=git-status`
- `/seo/meta-tags?selected=title-tag`

### Implementation Requirements

#### 1. Command ID Generation
Each command needs a unique, URL-friendly identifier:

```javascript
// Build-time ID generation
function generateCommandId(command, index) {
  return command
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')         // Spaces to hyphens
    .substring(0, 50)             // Limit length
    + (index > 0 ? `-${index}` : ''); // Handle duplicates
}

// Examples:
// "git status" → "git-status"
// "brew --version" → "brew-version"
// "<title>Page Title</title>" → "title-page-title"
```

#### 2. Search Index Enhancement

**Updated Index Structure**:
```json
{
  "items": [
    {
      "id": "git-status",
      "command": "git status",
      "description": "Check repository status and see what files have changed",
      "section": "git",
      "category": "basic-commands",
      "categoryTitle": "Basic Commands",
      "url": "/git/basic-commands?selected=git-status",
      "anchor": "#git-status"
    }
  ]
}
```

#### 3. Component Updates Required

**CollapsibleSection Component**:
- Add `id` attribute to each command block
- Scroll to and highlight selected command on page load
- Handle URL parameter changes

**Search Results**:
- Link directly to specific commands, not just sections
- Show breadcrumb: "Git > Basic Commands > git status"

#### 4. URL Parameter Handling

**Page Component Updates**:
```typescript
// In [section]/page.tsx
export default async function SectionPage({ params, searchParams }: PageProps) {
  const { section: sectionId } = await params
  const selectedCommand = searchParams?.selected
  
  // Pass selectedCommand to components for highlighting
}
```

**Client-Side Navigation**:
```typescript
// Navigate to specific command
const navigateToCommand = (commandId: string, sectionId: string, categoryId: string) => {
  router.push(`/${sectionId}/${categoryId}?selected=${commandId}`)
}
```

#### 5. Visual Highlighting

**Selected Command Styling**:
- Yellow/blue highlight background
- Smooth scroll animation to command
- Temporary pulse effect on arrival
- Update URL without page reload

**CSS Classes**:
```css
.command-highlighted {
  background: #fef3c7; /* Light yellow */
  border-left: 4px solid #f59e0b; /* Orange border */
  animation: pulse-highlight 2s ease-out;
}

@keyframes pulse-highlight {
  0% { background: #fbbf24; }
  100% { background: #fef3c7; }
}
```

### Search Result Navigation Flow

1. **User searches** for "git status"
2. **Search shows result** with full path: "Git > Basic Commands > git status"
3. **User clicks result** → Navigate to `/git/basic-commands?selected=git-status`
4. **Page loads** with Git section, Basic Commands category expanded
5. **Command highlights** and scrolls into view
6. **URL is shareable** - others can access the exact same command

### Shareable Links Benefits

**Use Cases**:
- **Documentation**: Link to specific commands in guides
- **Support**: Share exact solutions with team members
- **Bookmarks**: Save frequently used commands
- **Social**: Share useful tips on social media

**SEO Benefits**:
- **Deep indexing**: Search engines can index individual commands
- **Better rankings**: More specific, targeted pages
- **Rich snippets**: Commands can appear in search results

### Implementation Priority

**Phase 1 (MVP)**:
- Generate command IDs during build
- Basic URL parameter handling
- Scroll to selected command

**Phase 2 (Enhanced)**:
- Smooth animations and highlighting
- Breadcrumb navigation in search results
- Share buttons for individual commands

**Phase 3 (Advanced)**:
- Command popularity tracking via URLs
- Related commands suggestions
- Command-specific meta tags for social sharing

## Technical Implementation

### Build Script Updates

**Enhanced Index Generation**:
```javascript
// In build-search-index.js
function processCommand(command, sectionId, categoryId, commandIndex) {
  const commandId = generateCommandId(command.command, commandIndex);
  const categorySlug = slugify(categoryId);
  
  return {
    id: commandId,
    command: command.command,
    description: command.description,
    section: sectionId,
    category: categorySlug,
    url: `/${sectionId}/${categorySlug}?selected=${commandId}`,
    anchor: `#${commandId}`
  };
}
```

### Component Architecture

**URL-Aware Components**:
- `<CommandBlock id={commandId} isSelected={selectedCommand === commandId} />`
- `<SearchResult onClick={() => navigateToCommand(item.url)} />`
- `<ShareButton url={window.location.href} command={command} />`

This deep linking system will make the cheat sheet much more useful for sharing, bookmarking, and referencing specific commands!

### Advanced Search
- **Filters**: By section, category, command type
- **Operators**: "git status" (exact), git* (wildcard)
- **Shortcuts**: Recent searches, popular commands

### Accessibility
- **Keyboard navigation**: Full keyboard support
- **Screen readers**: Proper ARIA labels
- **Focus management**: Logical tab order
- **High contrast**: Visible focus indicators

### Mobile Experience
- **Touch-friendly**: Large tap targets
- **Responsive**: Adapts to screen size
- **Performance**: Optimized for mobile networks

## Implementation Phases

### Phase 1: Basic Search (MVP)
- Build-time index generation
- Simple text matching
- Basic search component
- Navigate to sections

### Phase 2: Enhanced Search
- Fuzzy matching
- Keyboard shortcuts
- Search highlighting
- Result ranking

### Phase 3: Advanced Features
- Search filters
- Search history
- Popular commands
- Search analytics (client-side)

## File Structure

```
├── scripts/
│   └── build-search-index.js     # Build-time index generator
├── src/
│   ├── components/
│   │   ├── Search.tsx            # Main search component
│   │   └── SearchResults.tsx     # Results display
│   ├── hooks/
│   │   └── useSearch.ts          # Search logic hook
│   └── utils/
│       └── searchUtils.ts        # Search algorithms
├── public/
│   └── search-index.json         # Generated search index
└── docs/
    └── search-implementation.md  # This document
```

## Success Metrics

- **Usage**: Search utilization rate
- **Performance**: Search response time <50ms
- **Accuracy**: Relevant results in top 5
- **User Satisfaction**: Reduced bounce rate from search

## Future Enhancements

- **Search suggestions**: Auto-complete based on index
- **Command popularity**: Track most-searched commands
- **Search shortcuts**: Quick access to common searches
- **Export search**: Share search results as links
