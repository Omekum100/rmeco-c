# RM Finance Medical Bill Records

A mobile-first Next.js app for a medical shop to record purchase bills, parties, bill photos, payment status, and supplier totals.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- Supabase PostgreSQL
- React Hook Form
- Zod

## Environment

Copy `.env.example` to `.env` and set these values:

```env
DATABASE_URL="postgresql://postgres.PROJECT_ID:DB_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.PROJECT_ID:DB_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://PROJECT_ID.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your_publishable_key"
RM_ADMIN_USERNAME="admin@RM"
RM_ADMIN_PASSWORD="change-this-password"
RM_AUTH_TOKEN="replace-with-a-long-random-session-token"
```

Use a long random value for `RM_AUTH_TOKEN` in production.

## Local Setup

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run build
npm run start -- --hostname 0.0.0.0 --port 3002
```

Open http://localhost:3002.

## Useful Scripts

- `npm run dev` - start local development server
- `npm run build` - production build
- `npm run start` - start the production server after build
- `npm run lint` - lint the codebase
- `npm run typecheck` - run TypeScript checks
- `npm run prisma:generate` - generate Prisma Client
- `npm run prisma:migrate` - create/apply database migrations
- `npm run prisma:deploy` - apply existing migrations in production
- `npm run prisma:seed` - add sample bills

## Vercel Deployment

Add these Environment Variables in Vercel Project Settings before deploying:

```env
DATABASE_URL="postgresql://postgres.PROJECT_ID:DB_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.PROJECT_ID:DB_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://PROJECT_ID.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your_publishable_key"
RM_ADMIN_USERNAME="admin@RM"
RM_ADMIN_PASSWORD="change-this-password"
RM_AUTH_TOKEN="replace-with-a-long-random-session-token"
```

Use Vercel's default build command:

```bash
npm run build
```

Before the first production deploy, run migrations once from a trusted terminal with the same production `.env` values:

```bash
npm run prisma:deploy
```

## Current Production Notes

- Login is a simple single-admin cookie system. Replace it with Supabase Auth before adding staff or multi-user roles.
- Bill photos are currently stored in the database as data URLs. Move them to Supabase Storage before heavy real-world usage.
- Keep `.env` private. It contains database credentials and must not be committed.
