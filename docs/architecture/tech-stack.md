# Tech Stack

This document provides a detailed overview of the technologies used in Neuron Log and the rationale behind each choice.

## Core Technologies

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.2.4 | React framework with App Router for server components and routing |
| React | 19.1.0 | UI library for building component-based interfaces |
| TypeScript | 5.8.2 | Static typing for improved developer experience and code quality |
| Tailwind CSS | 4.1.1 | Utility-first CSS framework for rapid UI development |

### Backend (BaaS)

| Technology | Purpose |
|------------|---------|
| Supabase | Backend as a Service providing authentication, database, and storage |
| PostgreSQL | Relational database for structured data storage |

## Key Dependencies

```json
"dependencies": {
  "@supabase/auth-helpers-nextjs": "^0.10.0",
  "@supabase/ssr": "^0.6.1",
  "@supabase/supabase-js": "^2.49.4",
  "@types/node": "^22.14.0",
  "@types/react": "^19.1.0",
  "@types/react-dom": "^19.1.1",
  "autoprefixer": "^10.4.21",
  "next": "^15.2.4",
  "postcss": "^8.5.3",
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "tailwindcss": "^4.1.1",
  "typescript": "^5.8.2"
}
```

## Technology Selection Rationale

### Next.js and React

Next.js was chosen as the framework for several reasons:

1. **Server Components**: Allows for rendering components on the server for improved performance and SEO
2. **App Router**: Modern routing system with nested layouts and loading states
3. **TypeScript Integration**: First-class support for TypeScript
4. **API Routes**: Built-in API functionality for server-side operations
5. **Vercel Deployment**: Seamless deployment to Vercel

React 19 brings performance improvements and modern hooks, making it an ideal choice for building interactive UI components.

### TypeScript

TypeScript provides:

1. **Type Safety**: Catching type-related errors at compile time
2. **IntelliSense**: Improved developer experience with code completion
3. **Documentation**: Types serve as documentation for code
4. **Maintainability**: Easier refactoring and codebase navigation

### Tailwind CSS

Tailwind CSS was selected for:

1. **Productivity**: Rapid UI development with utility classes
2. **Consistency**: Predefined design tokens ensure consistent styling
3. **Customization**: Easy to extend and customize for project needs
4. **Performance**: Small bundle size with PurgeCSS optimization
5. **Responsive Design**: Built-in responsive utilities

### Supabase

Supabase offers a comprehensive backend solution:

1. **Authentication**: Pre-built authentication system with email/password and social login options
2. **PostgreSQL Database**: Powerful relational database with JSONB for flexible schemas
3. **Row-Level Security**: Fine-grained access control at the database level
4. **Realtime Subscriptions**: Real-time updates for collaborative features
5. **JavaScript SDK**: Easy integration with the frontend

## Configuration Files

### Tailwind Configuration

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... other shades
          950: '#082f49',
        },
      },
    },
  },
  plugins: [],
}
```

### PostCSS Configuration

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## Environment Variables

Neuron Log requires the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Development Tools

The recommended development setup includes:

- **Node.js**: v18 or newer
- **npm**: Package manager
- **VS Code**: Code editor with TypeScript and Tailwind extensions
- **Vercel CLI**: For local preview of production builds

## Future Tech Considerations

As the project evolves, we're considering:

1. **Server Actions**: For more efficient data mutations
2. **tRPC**: Type-safe API layer for frontend-backend communication
3. **Zod**: Runtime validation for data
4. **Zustand**: For more complex state management needs
5. **Playwright**: End-to-end testing
6. **OpenAI SDK**: For AI features 