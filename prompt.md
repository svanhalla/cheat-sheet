# NextJS Portfolio Website - Development Guide

## Project Overview
Modern, responsive portfolio website built with Next.js 15, TypeScript, and Tailwind CSS. Designed for static site generation and deployment to GitHub Pages or similar hosting platforms.

## Key Architecture Decisions

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom color scheme
- **Deployment**: Static site generation for GitHub Pages
- **Content**: JSON-driven for easy management

### Directory Structure
```
project/
├── data/                      # JSON content files (root level)
│   ├── content.json          # Main content configuration
│   ├── navigation.json       # Site navigation structure
│   ├── home.json             # Homepage content
│   └── pages/                # Page-specific configurations
├── public/
│   ├── images/               # Static image assets
│   │   ├── gallery/          # Gallery/portfolio images
│   │   ├── covers/           # Cover/thumbnail images
│   │   └── assets/           # Site assets (logo, icons)
│   └── favicon.ico
└── src/
    ├── app/                  # Next.js app directory
    │   ├── page.tsx          # Homepage
    │   ├── portfolio/        # Portfolio pages
    │   │   ├── page.tsx      # Portfolio landing
    │   │   └── [id]/         # Dynamic portfolio routes
    │   ├── about/            # About page
    │   └── contact/          # Contact page
    ├── components/           # React components
    │   ├── Layout.tsx        # Main layout wrapper
    │   ├── Navigation.tsx    # Site navigation
    │   ├── ImageViewer.tsx   # Lightbox modal
    │   ├── GalleryGrid.tsx   # Gallery grid component
    │   └── PageRenderer.tsx  # JSON-driven page renderer
    └── utils/
        └── imagePath.ts      # Image path utilities
```

## Content Management System

### JSON-Driven Content
All content managed through JSON files for non-technical users:

```json
// data/content.json
{
  "site": {
    "title": "Portfolio Site",
    "description": "Professional portfolio website",
    "author": "Your Name"
  },
  "collections": [
    {
      "id": "recent-work",
      "title": "Recent Work",
      "description": "Latest projects and creations",
      "thumbnail": "/images/gallery/recent/thumb.jpg",
      "visible": true,
      "items": [
        {
          "path": "/images/gallery/recent/project1.jpg",
          "title": "Project Title",
          "year": "2025",
          "description": "Project description",
          "medium": "Digital/Photography/etc",
          "visible": true
        }
      ]
    }
  ]
}
```

### Metadata Structure
Each content item supports comprehensive metadata:
- `path` - Image file path (required)
- `title` - Item title (optional)
- `year` - Creation year (optional)
- `description` - Detailed description (optional)
- `medium` - Medium/technique used (optional)
- `visible` - Show/hide control (optional, defaults to true)

### Visibility Controls
- Set `visible: false` to hide items without deleting
- Supports both collection-level and item-level visibility
- Backward compatible with simple configurations

## Key Features

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Breakpoints: mobile (default), tablet (md:), desktop (lg:)
- Touch-friendly interactions for mobile devices

### Image Handling
- Lightbox modal for full-size viewing
- Hover effects with overlay icons
- Optimized loading with Next.js Image component
- Support for various aspect ratios

### Navigation System
- Sticky header with logo
- Mobile hamburger menu
- Configurable menu items via JSON
- Active page highlighting

### Static Site Generation
- Pre-rendered at build time for performance
- SEO-friendly with proper meta tags
- Deployable to any static hosting service

## Technical Implementation

### Dynamic Routes
Single dynamic route pattern for scalability:
```typescript
// app/portfolio/[id]/page.tsx
export async function generateStaticParams() {
  // Generate all portfolio routes at build time
  return collections.map(collection => ({
    id: collection.id
  }));
}
```

### Image Path Resolution
Environment-aware image paths:
```typescript
// utils/imagePath.ts
export function getImagePath(path: string): string {
  if (path.startsWith('http')) return path;
  const basePath = process.env.NODE_ENV === 'production' ? '/your-repo' : '';
  return `${basePath}${path}`;
}
```

### Component Architecture
- Server components for static content
- Client components for interactive features
- Reusable components for consistent UI
- TypeScript interfaces for type safety

## Styling Guidelines

### Color Scheme
Define consistent colors in Tailwind config:
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-primary-color',
        secondary: '#your-secondary-color',
        background: '#your-background-color'
      }
    }
  }
}
```

### Typography
- Consistent heading hierarchy (h1-h6)
- Readable font sizes and line heights
- Proper contrast ratios for accessibility

### Layout Patterns
- Grid layouts for galleries (responsive columns)
- Flexbox for navigation and components
- Consistent spacing using Tailwind utilities

## Deployment Configuration

### GitHub Pages Setup
```yaml
# .github/workflows/nextjs.yml
name: Deploy Next.js site to Pages
on:
  push:
    branches: ["main"]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out
  deploy:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
```

### Next.js Configuration
```javascript
// next.config.js
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/your-repo' : ''
};
```

## Content Management Workflow

### For Non-Technical Users
1. **Edit JSON files** in the `data/` directory
2. **Upload images** to appropriate `public/images/` folders
3. **Commit changes** to GitHub
4. **Automatic deployment** via GitHub Actions

### Common Updates
- **Add new portfolio item**: Edit collection JSON, upload image
- **Hide/show content**: Toggle `visible` field
- **Update descriptions**: Modify text in JSON files
- **Change navigation**: Edit `data/navigation.json`

### Simple Git Commands
```bash
# Update content
git add -A
git commit -m "Update portfolio content"
git push

# Check status
git status
git pull  # Get latest changes first if needed
```

## Performance Optimization

### Image Optimization
- Use appropriate image formats (WebP when possible)
- Compress images before uploading
- Implement lazy loading for galleries
- Provide alt text for accessibility

### Build Optimization
- Static generation for all pages
- Minimal JavaScript bundle size
- CSS purging with Tailwind
- Proper caching headers

## SEO Features

### Meta Tags
- Page-specific titles and descriptions
- Open Graph tags for social sharing
- Twitter Card support
- Canonical URLs

### Structured Data
- JSON-LD schema markup
- Proper heading hierarchy
- Semantic HTML elements
- Image alt attributes

### Sitemap Generation
Automatic sitemap for all pages and collections.

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build static site
npm run build

# Preview build locally
npm run start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive enhancement approach
- Graceful degradation for older browsers

## Accessibility Features
- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA labels
- Color contrast compliance
- Focus management in modals

## Security Considerations
- No sensitive data in client-side code
- External links open in new tabs with security attributes
- Input validation for any forms
- HTTPS deployment

## Maintenance Guidelines

### Regular Updates
- Keep dependencies updated
- Monitor build performance
- Review and optimize images
- Test across different devices

### Content Guidelines
- Consistent image dimensions within collections
- Descriptive file names
- Proper metadata for all items
- Regular content audits

## Customization Points

### Easy Customizations
- Colors via Tailwind config
- Typography and spacing
- Layout grid columns
- Navigation structure

### Advanced Customizations
- Custom components
- Animation effects
- Advanced image handling
- Third-party integrations

This guide provides a foundation for building modern, maintainable portfolio websites with Next.js while keeping content management simple for non-technical users.
