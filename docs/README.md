# Neuron Log Documentation

Welcome to the documentation for Neuron Log, a personal "Second Brain" application focused on capturing structured daily shutdown reflections.

## Documentation Structure

- **[Project Overview](./project-overview.md)**: High-level description of the project, its purpose, and current status
- **[Architecture](./architecture/README.md)**: Information about the technical architecture and data flow
- **[Components](./components/README.md)**: Documentation for the React components in the project
- **[Features](./features/README.md)**: Detailed descriptions of implemented and planned features
- **[Setup](./setup/README.md)**: Instructions for setting up the development environment and deploying the application

## Current Status

Neuron Log is currently in the MVP (Minimum Viable Product) phase, with the following features implemented:

- User authentication (email/password) using Supabase Auth
- Daily log form with structured sections for capturing:
  - Accomplished tasks
  - In-progress items with reasoning
  - Blockers with needed resources
  - Decisions needed with stakeholders
  - Tomorrow's priorities
  - Loose thoughts
  - Workspace cleanup checklist
  - Shutdown ritual
- History view for reviewing past logs
- Responsive design for mobile and desktop

## Next Steps

The following features are planned for future development:

1. **Reminder System**: Daily email reminders to complete shutdown logs
2. **Export Feature**: Ability to export logs as markdown or JSON
3. **AI Integration**: Implement GPT-4 summarization for insights
4. **Semantic Search**: Enable natural language search across logs
5. **Team Collaboration**: Allow sharing logs within teams

## Tech Stack

- **Frontend**: Next.js 15 (React 19) with App Router
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Hosting**: Vercel (recommended)
- **Type Safety**: TypeScript

For more detailed information, explore the documentation sections linked above. 