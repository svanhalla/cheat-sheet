# Developer Cheat Sheet

A personal cheat sheet website built with Next.js for quick reference of development commands and techniques.

## Features

- **Git Commands** - Common git workflows and commands
- **SEO Techniques** - Meta tags, Open Graph, and optimization tips
- **Next.js Reference** - CLI commands and development patterns
- **AWS CLI** - Common AWS command line operations
- **Responsive Design** - Works on desktop and mobile
- **Easy Updates** - Add new commands via JSON file

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Adding New Commands

Edit `data/cheat-sheets.json` to add new sections or commands:

```json
{
  "command": "your-command",
  "description": "What this command does"
}
```

## Deployment

Automatically deploys to GitHub Pages when you push to main branch.

## Project Structure

```
├── data/cheat-sheets.json    # All cheat sheet content
├── src/app/                  # Next.js pages
├── .github/workflows/        # GitHub Actions deployment
└── README.md
```
