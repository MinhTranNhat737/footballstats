# 🚀 Quick Start: Add Backend to Football Dashboard

## Step 1: Install Dependencies

```bash
# Database & ORM
pnpm add prisma @prisma/client
pnpm add -D prisma

# Authentication 
pnpm add next-auth @auth/prisma-adapter
pnpm add bcryptjs
pnpm add -D @types/bcryptjs

# Additional utilities
pnpm add slugify markdown-it
pnpm add -D @types/markdown-it
```

## Step 2: Initialize Database

```bash
# Initialize Prisma
npx prisma init

# Create database schema
# Edit prisma/schema.prisma with the provided schema

# Generate Prisma client
npx prisma generate

# Run database migration
npx prisma db push

# Optional: Seed data
npx prisma db seed
```

## Step 3: Environment Variables

Add to `.env.local`:
```env
# Existing football API config...
NEXT_PUBLIC_FOOTBALL_API_KEY=3b243d728ed549a3b8dedfa5424f3304

# New database config
DATABASE_URL="postgresql://username:password@localhost:5432/football_wiki_db"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

## Step 4: Create Basic API Endpoints

Create these files:
- `app/api/wiki/articles/route.ts`
- `app/api/auth/[...nextauth]/route.ts` 
- `app/api/sync/teams/route.ts`

## Step 5: Add Wiki Pages

Create these pages:
- `app/wiki/page.tsx`
- `app/wiki/[category]/page.tsx`
- `app/wiki/article/[slug]/page.tsx`

## Step 6: Test Implementation

```bash
# Start development server
pnpm dev

# Test APIs
curl http://localhost:3000/api/wiki/articles
curl http://localhost:3000/api/sync/teams
```

---

**Estimated Development Time: 2-3 weeks**

**Benefits:**
✅ Keep existing frontend code
✅ Add powerful CMS capabilities  
✅ Store data locally for better performance
✅ Enable offline functionality
✅ Add user-generated content