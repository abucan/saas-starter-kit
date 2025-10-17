# Keyvaultify

## Project Overview

Keyvaultify is a secure secrets management platform designed for modern teams. It provides a centralized, encrypted solution for storing and managing API keys, credentials, and other sensitive data across different environments.

### Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Strict type safety
- **Drizzle ORM** - Type-safe SQL database toolkit
- **Better Auth** - Modern authentication solution
- **shadcn/ui** - Beautiful, accessible UI components
- **Tailwind CSS 4** - Utility-first CSS framework
- **Stripe** - Payment processing
- **Resend** - Email delivery
- **UploadThing** - File uploads

### Key Features

- Secure secrets management with encryption
- Team collaboration and role-based access control
- Multi-environment support (dev, staging, production)
- OAuth authentication (GitHub, Google)
- Team invitations and member management
- Subscription billing with Stripe
- Activity logging and audit trails

## Folder Structure

```
src/
├── app/              # Next.js App Router
│   ├── (auth)/       # Authentication routes
│   ├── (dashboard)/  # Protected dashboard routes
│   └── api/          # API routes and webhooks
├── features/         # Feature modules (domain-driven)
│   ├── auth/         # Authentication feature
│   ├── user/         # User management
│   ├── team/         # Team collaboration
│   ├── billing/      # Subscription & payments
│   └── [feature]/    # Other features
│       ├── actions/  # Server Actions (presentation layer)
│       ├── services/ # Business logic
│       └── queries/  # Data access layer
├── components/       # Shared UI components
│   ├── ui/           # Base UI components (shadcn)
│   └── [shared]/     # Custom shared components
├── lib/              # Core utilities
│   ├── db/           # Database client and schema
│   ├── auth/         # Auth configuration
│   ├── email/        # Email templates and sending
│   ├── errors/       # Error handling utilities
│   ├── validation/   # Input validation and sanitization
│   └── utils.ts      # Helper functions
└── types/            # TypeScript type definitions
    ├── result.ts     # Result pattern types
    └── common.ts     # Shared types
```

### Layered Architecture

Each feature module follows a layered architecture:

1. **Actions Layer** (`actions/`) - Server Actions for client-server communication
2. **Services Layer** (`services/`) - Business logic and orchestration
3. **Queries Layer** (`queries/`) - Database queries and data access

This separation ensures:

- Clear separation of concerns
- Testable business logic
- Reusable data access patterns
- Type-safe end-to-end

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/keyvaultify-app.git
cd keyvaultify-app
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` and fill in the required values. See `.env.example` for detailed documentation.

4. Set up the database:

```bash
# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate
```

5. Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run type checking
pnpm type-check

# Database operations
pnpm db:generate      # Generate Drizzle migrations from schema
pnpm db:migrate       # Run pending migrations
pnpm db:studio        # Open Drizzle Studio (database GUI)
pnpm db:push          # Push schema changes without migrations (dev only)

# Development with Stripe webhooks
pnpm dev:all          # Run Next.js + Stripe webhook listener

# Linting and formatting
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
```

## Architecture Principles

### Feature-First Organization

Code is organized by feature rather than technical layer. Each feature is self-contained with its own actions, services, and queries.

### Server Components by Default

Leverage React Server Components for better performance and security. Use Client Components only when necessary (interactivity, browser APIs).

### Type Safety

- Strict TypeScript mode enabled
- No `any` types allowed
- Zod schemas for runtime validation
- Type-safe database queries with Drizzle

### Result Pattern for Error Handling

Use the `R<T>` Result type for consistent error handling:

```typescript
type R<T> =
  | { ok: true; data: T }
  | { ok: false; code: string; message: string };
```

Benefits:

- Forces explicit error handling
- Type-safe error codes
- Consistent API across the application

### Layered Architecture

Follow the dependency rule: outer layers depend on inner layers, never the reverse.

```
Actions (Server Actions) → Services (Business Logic) → Queries (Data Access)
```

## Code Style Guidelines

### TypeScript

- Strict mode enabled with all checks
- No implicit `any` types
- Explicit return types for functions
- Use branded types for IDs (e.g., `UserId`, `TeamId`)

### Error Handling

- Always use the Result pattern (`R<T>`) for operations that can fail
- Use `AppError` class for application errors with error codes
- Use `handleError()` utility to convert any error to Result type
- Never throw errors in Server Actions - return Result instead

### Validation

- Use Zod schemas for input validation
- Sanitize user input with `sanitize*` functions
- Validate with `isValid*` functions before processing

### Server Actions

- Keep Server Actions thin - delegate to services
- Return `R<T>` Result type
- Validate input with Zod
- Handle errors with `handleError()`

Example:

```typescript
export async function createTeam(input: CreateTeamInput): ActionResponse<Team> {
  try {
    const validated = createTeamSchema.parse(input);
    const result = await teamService.createTeam(validated);
    return result;
  } catch (error) {
    return handleError(error);
  }
}
```

### Database

- Use Drizzle ORM for all database operations
- Write queries in the queries layer
- Use transactions for multi-table operations
- Define schema with proper types and constraints

### Components

- Server Components by default
- Use Client Components (`'use client'`) only when needed
- Co-locate related components
- Use shadcn/ui components as base

## Contributing

1. Create a feature branch
2. Follow the code style guidelines
3. Write tests for new features
4. Submit a pull request

## License

MIT
