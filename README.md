# The Only Retreats

The Only Retreats is a premium D2C commerce platform for Himalayan heritage products. The brand direction is calm, timeless, editorial, and luxurious, with an emphasis on provenance and restraint rather than aggressive retail visuals.

This repository is initialized as the application foundation only. UI composition, product flows, and business logic are intentionally deferred to later phases.

## Tech Stack

| Layer           | Technology                                    |
| --------------- | --------------------------------------------- |
| Framework       | Next.js 15, App Router, TypeScript            |
| Styling         | Tailwind CSS v4, shadcn/ui                    |
| Database        | PostgreSQL on Neon, Prisma ORM                |
| CMS             | Sanity                                        |
| Authentication  | Clerk                                         |
| Media           | Cloudinary                                    |
| Payments        | Razorpay, Stripe-ready                        |
| Email           | Resend                                        |
| Motion          | GSAP, Motion, Lenis                           |
| State and forms | React Hook Form, Zod, Zustand, TanStack Query |
| Utilities       | clsx, tailwind-merge, date-fns, Lucide React  |
| DX              | ESLint, Prettier, Husky, lint-staged          |

## Folder Structure

```text
app/                 Next.js App Router entry points
components/
  ui/                Base UI primitives
  layout/            App shell primitives
  shared/            Reusable shared building blocks
  sections/          Page sections for later phases
hooks/               Client-side hooks
lib/                 Core utilities, environment helpers, integrations
providers/           React providers
services/            External service adapters
types/               Shared TypeScript types
utils/               Generic helper functions
styles/              Global styles and design tokens
prisma/              Prisma schema and migrations
sanity/              Sanity schemas and studio assets
public/              Static assets
docs/                Internal documentation
```

Path aliases are configured in `tsconfig.json` so imports can resolve cleanly from the project root and common top-level folders.

## Installation

1. Install dependencies.

   ```bash
   npm install
   ```

2. Copy the environment template.

   ```bash
   copy .env.example .env
   ```

3. Fill in the service credentials required for your local environment.

4. Generate the Prisma client.

   ```bash
   npm run db:generate
   ```

## Development Commands

| Command                | Description                                        |
| ---------------------- | -------------------------------------------------- |
| `npm run dev`          | Start the development server                       |
| `npm run build`        | Build for production                               |
| `npm run start`        | Run the production server                          |
| `npm run lint`         | Run ESLint                                         |
| `npm run lint:fix`     | Run ESLint with auto-fix                           |
| `npm run format`       | Format the codebase with Prettier                  |
| `npm run format:check` | Check formatting with Prettier                     |
| `npm run typecheck`    | Run the TypeScript compiler without emitting files |
| `npm run db:generate`  | Generate Prisma Client                             |
| `npm run db:push`      | Push the Prisma schema to the database             |
| `npm run db:migrate`   | Create and apply Prisma migrations                 |
| `npm run db:studio`    | Open Prisma Studio                                 |

## Environment

Refer to `.env.example` for the complete list of required placeholders. Keep `.env` and all secrets out of version control.

## Notes

This repository is intentionally scaffolded for the initialization phase only. Additional modules, UI, and domain logic should be introduced in later increments once the architecture is approved.
