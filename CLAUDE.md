# SalaPrenotazioni Development Guide

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Code Style
- **Imports**: Group imports by type (React, 3rd party, local)
- **Components**: Use functional components with named exports
- **Formatting**: Use 2-space indentation
- **TypeScript**: Enable strict type checking
- **Naming**: Use camelCase for variables/functions, PascalCase for components
- **File Structure**: Component files use `.jsx/.tsx` extension
- **Error Handling**: Use try/catch for async operations
- **CSS**: Use Tailwind CSS with className
- **State Management**: Use React hooks (useState, useEffect)
- **Component Library**: Use shadcn/ui components
- **Frontend Routes**: Use Next.js App Router conventions
- **Path Aliases**: Import using `@/*` path alias

## Tech Stack
- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase