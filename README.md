# StockFlow MVP

Minimal SaaS inventory system built with Next.js, Prisma, PostgreSQL, and server actions.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and set:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `SESSION_SECRET` (32+ characters)

3. Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

4. (Optional) Seed demo login:

```bash
npx prisma db seed
```

Demo credentials (from seed):
- Email: `demo@stockflow.local`
- Password: `DemoPass123!`

5. Start dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Vercel deployment

1. Push this project to GitHub.
2. Create a PostgreSQL database (Neon/Supabase/Render).
3. In Vercel project settings, add env vars:
   - `DATABASE_URL`
   - `SESSION_SECRET`
4. Deploy.
5. Run migrations against production DB:

```bash
npx prisma migrate deploy
```

6. (Optional) Seed production demo user:

```bash
npx prisma db seed
```
