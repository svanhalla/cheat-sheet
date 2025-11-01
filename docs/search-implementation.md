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
      "sectionIcon": "🔧",
      "sectionColor": "green",
      "category": "Basic Commands",
      "type": "terminal",
      "typeIcon": "🖥️",
      "keywords": ["status", "check", "files", "changes"],
      "url": "/git#basic-commands"
    }
  ],
  "metadata": {
    "totalItems": 150,
    "sections": ["git", "seo", "install-software", "nextjs", "aws", "maggie-workflows"],
    "commandTypes": ["terminal", "instruction", "code"],
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
- Command type filtering (terminal/instruction/code)
- Recent searches (localStorage)
- Popular commands tracking
- Voice search (Web Speech API)
- Search suggestions and autocomplete

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
- Show: command, description, section badge, command type badge
- Section color coding (Git=green, CSS=blue, SEO=purple, etc.)
- Command type indicators (🖥️ terminal, 📋 instruction, 📝 code)
- Command prefix display ($ for terminal, 📁 for instructions)
- Click to navigate to specific section
- "Show all X results" link for extensive results
- Breadcrumb navigation: "Section > Category > Command"

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

## Enhanced User Experience Features

### Keyboard Shortcuts
```javascript
// Primary shortcuts
- Cmd/Ctrl + K: Open search modal
- Escape: Close search / Clear input
- Enter: Navigate to first result
- Cmd/Ctrl + Enter: Open result in new tab
- ↑↓ Arrow keys: Navigate results
- Tab / Shift+Tab: Navigate filters
- Cmd/Ctrl + /: Toggle search help

// Advanced shortcuts
- Cmd/Ctrl + 1-9: Jump to section filter
- Cmd/Ctrl + Shift + C: Copy command to clipboard
- Cmd/Ctrl + Shift + L: Copy command URL
- Alt + Enter: Add to bookmarks
```

### Command Type Filtering
- **Terminal Commands** (🖥️): Filter executable shell commands
- **Instructions** (📋): Filter file operations and setup steps  
- **Code Examples** (📝): Filter JSON, CSS, and configuration snippets
- **All Types**: Show everything (default)

### Visual Search Indicators
```css
/* Section color coding */
.section-git { border-left: 4px solid #10b981; } /* Green */
.section-css { border-left: 4px solid #3b82f6; } /* Blue */
.section-seo { border-left: 4px solid #8b5cf6; } /* Purple */
.section-install { border-left: 4px solid #f59e0b; } /* Orange */
.section-nextjs { border-left: 4px solid #000000; } /* Black */
.section-aws { border-left: 4px solid #ff9900; } /* AWS Orange */

/* Command type badges */
.type-terminal { background: #1f2937; color: #10b981; }
.type-instruction { background: #dbeafe; color: #1e40af; }
.type-code { background: #f3f4f6; color: #374151; }
```

### Search Analytics (Client-Side)
```javascript
// Track in localStorage
{
  "searchHistory": ["git status", "npm install", "css colors"],
  "popularCommands": {
    "git-status": 15,
    "npm-install": 12,
    "css-rgb": 8
  },
  "bookmarkedCommands": ["git-status", "brew-install"],
  "recentSessions": [
    {
      "timestamp": "2025-10-31T18:00:00Z",
      "commands": ["git-status", "git-commit"]
    }
  ]
}
```

### Mobile Experience Enhancements
- **Touch-friendly**: Large tap targets (44px minimum)
- **Swipe gestures**: Swipe left/right to navigate results
- **Voice search**: "Hey, find git commands" using Web Speech API
- **Haptic feedback**: Vibration on result selection (iOS/Android)
- **Pull-to-refresh**: Update search index
- **Offline indicator**: Show when search index is cached

### Search Context Awareness
```javascript
// Context-based features
- Recent commands from current session
- Section-specific search when on a section page
- Related commands suggestions
- "People also searched for" based on patterns
- Smart autocomplete based on typing patterns
- Typo correction with "Did you mean?" suggestions
```

### Export & Sharing Features
```javascript
// Export options
- Share search results as URL: /search?q=git&type=terminal
- Export command list as Markdown
- Export as plain text for documentation
- Print-friendly search results page
- Copy multiple commands to clipboard
- Generate shareable command collections

// Social sharing
- Share individual commands on Twitter/LinkedIn
- Generate command cards for social media
- Create custom cheat sheet collections
- Export as PDF for offline reference
```

### Progressive Enhancement
```javascript
// Fallback strategies
- Graceful degradation when JavaScript disabled
- Service worker for offline search capability
- Search index versioning for cache invalidation
- Lazy loading of search components
- Progressive loading of search index
- Fallback to section navigation if search fails
```

### Search Performance Optimization
```javascript
// Advanced performance features
- Virtual scrolling for large result sets
- Debounced search with smart delays
- Result caching and memoization
- Incremental search index loading
- Background index updates
- Search result prefetching
- Intelligent result ranking based on usage
```
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
- Build-time index generation with command types
- Simple text matching and fuzzy search
- Basic search component with keyboard shortcuts
- Command type filtering (terminal/instruction/code)
- Navigate to sections with deep linking
- Visual indicators and section color coding

### Phase 2: Enhanced Search
- Advanced fuzzy matching and typo correction
- Search analytics and popular commands tracking
- Search highlighting and breadcrumb navigation
- Mobile optimizations and touch gestures
- Voice search integration
- Result ranking and caching

### Phase 3: Advanced Features
- Export and sharing functionality
- Progressive enhancement and offline support
- Search suggestions and autocomplete
- Command bookmarking and collections
- Performance optimizations (virtual scrolling)
- Social sharing and PDF export

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
