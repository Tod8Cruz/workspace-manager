# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
- **Type**: Workspace Management System
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Database**: Neon PostgreSQL with Drizzle ORM

## Development Commands
- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm start`: Start production server
- `pnpm lint`: Run ESLint

## Database Commands
- `pnpm db:generate`: Generate database migration files
- `pnpm db:migrate`: Apply migrations to database
- `pnpm db:studio`: Open Drizzle Studio for database management
- `pnpm db:seed`: Seed database with sample data

## Key Architecture Notes
- Uses Next.js App Router
- Follows component-based architecture in `components/` directory
- Utility functions and database configuration in `lib/`
- Database schema and migrations managed via Drizzle ORM
- Shadcn/ui for UI components
- Tailwind CSS for styling
- Supports dark/light mode themes

## Important Environment Variables
- `DATABASE_URL`: Neon PostgreSQL connection string
- Sensitive variables should be added to `.env.local`

## Testing
- Refer to project documentation for specific testing instructions