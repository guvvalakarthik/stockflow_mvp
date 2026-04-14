# StockFlow MVP

StockFlow MVP is a scope-reduced multi-tenant inventory SaaS app with:
- email/password authentication
- organization-scoped product CRUD
- stock adjustments
- low-stock dashboard
- default threshold settings

Tech stack: Next.js, Prisma, PostgreSQL, Tailwind CSS.

## Features implemented

- Signup and login (single user per organization in MVP)
- Product model with SKU uniqueness per organization
- Product list, create, edit, delete
- Inline stock adjustment (+/- quantity with note)
- Dashboard cards (total products, total quantity)
- Low-stock detection using product threshold or org default
- Settings page for global default low-stock threshold

## Project structure

- `src/app/(auth)` - login and signup pages
- `src/app/(app)` - dashboard, products, settings
- `src/app/actions` - server actions (auth, products, settings, session)
- `src/lib` - Prisma client, auth/session helpers, stock logic
- `prisma/schema.prisma` - database schema
- `prisma/seed.ts` - optional demo data seed

## Local setup

### 1) Install dependencies

```bash
npm install
```

### 2) Create `.env`

Copy `.env.example` to `.env` and set:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require"
SESSION_SECRET="your-long-random-secret-at-least-32-characters"
```

### 3) Generate Prisma client and run migrations

```bash
npx prisma generate
npx prisma migrate dev
```

### 4) Optional demo user

```bash
npx prisma db seed
```

Demo credentials:
- Email: `demo@stockflow.local`
- Password: `DemoPass123!`

### 5) Run the app

```bash
npm run dev
```

Open: `http://localhost:3000`

## Build and lint

```bash
npm run lint
npm run build
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Create a PostgreSQL database (Neon recommended).
3. Import repo in Vercel.
4. Add env vars in Vercel:
   - `DATABASE_URL`
   - `SESSION_SECRET`
5. Deploy.
6. Run production migrations:

```bash
npx prisma migrate deploy
```

7. (Optional) Seed production data:

```bash
npx prisma db seed
```

## GitHub push commands

```bash
git add .
git commit -m "Add StockFlow MVP implementation and docs"
git push -u origin master
```
