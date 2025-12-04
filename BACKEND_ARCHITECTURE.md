# 🏗️ Backend Architecture cho Football Wiki

## 📋 **Tổng quan kiến trúc**

### **Hiện tại (Frontend Only):**
```
Frontend (Next.js) → External API (Football Data)
```

### **Mục tiêu (Full Stack):**
```
Frontend (Next.js) → Backend API → Database → External APIs
```

---

## 🎯 **Option 1: Mở rộng Next.js thành Full Stack**

### **1. Database Setup**
```bash
# Cài đặt ORM và Database
pnpm add prisma @prisma/client
pnpm add -D prisma

# Database options:
# - PostgreSQL (production) 
# - MySQL (popular)
# - SQLite (development)
```

### **2. Cấu trúc Database cho Football Wiki**
```sql
-- Teams table
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  external_id INTEGER UNIQUE, -- từ football-data.org
  name VARCHAR(255) NOT NULL,
  short_name VARCHAR(50),
  tla VARCHAR(3), -- Three Letter Abbreviation
  logo_url TEXT,
  founded_year INTEGER,
  venue VARCHAR(255),
  website VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Competitions table  
CREATE TABLE competitions (
  id SERIAL PRIMARY KEY,
  external_id INTEGER UNIQUE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(10),
  type VARCHAR(50), -- LEAGUE, CUP, etc
  emblem_url TEXT,
  country_name VARCHAR(100),
  current_season_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Matches table
CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  external_id INTEGER UNIQUE,
  competition_id INTEGER REFERENCES competitions(id),
  season VARCHAR(20),
  home_team_id INTEGER REFERENCES teams(id),
  away_team_id INTEGER REFERENCES teams(id),
  home_score INTEGER,
  away_score INTEGER,
  status VARCHAR(20), -- SCHEDULED, IN_PLAY, FINISHED
  utc_date TIMESTAMP,
  matchday INTEGER,
  venue VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Wiki Articles table (NEW)
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  content TEXT, -- Markdown content
  type VARCHAR(50), -- team, player, competition, match_analysis
  related_team_id INTEGER REFERENCES teams(id),
  related_competition_id INTEGER REFERENCES competitions(id),
  author_id INTEGER REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Users table (for CMS)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  role VARCHAR(20) DEFAULT 'user', -- admin, editor, user
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Categories for wiki organization
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE,
  description TEXT,
  parent_id INTEGER REFERENCES categories(id)
);

-- Many-to-many: articles and categories
CREATE TABLE article_categories (
  article_id INTEGER REFERENCES articles(id),
  category_id INTEGER REFERENCES categories(id),
  PRIMARY KEY (article_id, category_id)
);

-- Comments system
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES articles(id),
  user_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL,
  parent_id INTEGER REFERENCES comments(id), -- for replies
  created_at TIMESTAMP DEFAULT NOW()
);

-- Search and tagging
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE
);

CREATE TABLE article_tags (
  article_id INTEGER REFERENCES articles(id),
  tag_id INTEGER REFERENCES tags(id),
  PRIMARY KEY (article_id, tag_id)
);
```

### **3. API Routes Structure**
```
app/api/
├── auth/                    # Authentication
│   ├── login/route.ts
│   ├── register/route.ts
│   └── logout/route.ts
├── wiki/                    # Wiki CMS
│   ├── articles/
│   │   ├── route.ts        # GET, POST articles
│   │   ├── [slug]/
│   │   │   ├── route.ts    # GET, PUT, DELETE specific article
│   │   │   └── comments/route.ts
│   │   └── search/route.ts
│   ├── categories/route.ts
│   └── tags/route.ts
├── admin/                   # Admin panel
│   ├── articles/route.ts
│   ├── users/route.ts
│   └── analytics/route.ts
├── sync/                    # Data synchronization
│   ├── teams/route.ts
│   ├── matches/route.ts
│   └── competitions/route.ts
└── football/               # Existing football API proxy
    └── route.ts
```

### **4. Backend Services Layer**
```typescript
// services/wiki.service.ts
export class WikiService {
  static async createArticle(data: CreateArticleData): Promise<Article> {
    // Business logic for creating wiki articles
  }
  
  static async searchArticles(query: string): Promise<Article[]> {
    // Full-text search implementation
  }
  
  static async getRelatedArticles(articleId: number): Promise<Article[]> {
    // AI-powered content recommendations
  }
}

// services/football-sync.service.ts
export class FootballSyncService {
  static async syncTeams(): Promise<void> {
    // Sync teams from external API to local database
  }
  
  static async syncMatches(dateRange: DateRange): Promise<void> {
    // Sync match data and store locally
  }
}

// services/analytics.service.ts
export class AnalyticsService {
  static async trackPageView(articleId: number): Promise<void> {
    // Track article views for popular content
  }
  
  static async generateInsights(): Promise<AnalyticsData> {
    // Generate content performance insights
  }
}
```

---

## 🎯 **Option 2: Separate Backend (Node.js/Python)**

### **Tech Stack Options:**

#### **A. Node.js + Express**
```bash
mkdir football-wiki-backend
cd football-wiki-backend
npm init -y
npm install express prisma @prisma/client
npm install -D @types/express typescript nodemon
```

#### **B. Python + FastAPI**
```bash
mkdir football-wiki-backend
cd football-wiki-backend
python -m venv venv
pip install fastapi uvicorn sqlalchemy psycopg2-binary
```

#### **C. Go + Fiber**
```bash
mkdir football-wiki-backend
cd football-wiki-backend
go mod init football-wiki-api
go get github.com/gofiber/fiber/v2
```

---

## 🎯 **Option 3: Headless CMS Solution**

### **A. Strapi (Recommended)**
```bash
npx create-strapi-app@latest football-wiki-cms --quickstart
# Tự động tạo admin panel và API
```

### **B. Sanity.io**
```bash
npm install @sanity/client
# Cloud-based CMS với real-time collaboration
```

### **C. Ghost CMS**
```bash
# Specialized cho content management
# Có sẵn API và admin interface
```

---

## 📊 **So sánh các Options:**

| Feature | Next.js Full Stack | Separate Backend | Headless CMS |
|---------|-------------------|------------------|--------------|
| **Complexity** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Performance** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Flexibility** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Development Speed** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Scalability** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 🚀 **Recommended Implementation Plan:**

### **Phase 1: Database Setup (Week 1)**
1. Setup PostgreSQL + Prisma ORM
2. Create basic data models
3. Implement data sync from external API

### **Phase 2: Wiki CMS (Week 2-3)**
1. Article CRUD operations
2. Category and tag system  
3. User authentication
4. Admin panel

### **Phase 3: Advanced Features (Week 4+)**
1. Full-text search
2. Comment system
3. Analytics dashboard
4. AI-powered recommendations

---

## 🛠️ **Implementation Files Structure:**

```
football-match-dashboard/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── app/api/
│   ├── wiki/           # New wiki endpoints
│   ├── admin/          # Admin panel APIs  
│   ├── auth/           # Authentication
│   └── sync/           # Data synchronization
├── components/
│   ├── wiki/           # Wiki components
│   ├── admin/          # Admin components
│   └── auth/           # Auth components
├── app/wiki/           # Wiki pages
│   ├── page.tsx        # Wiki home
│   ├── [category]/     # Category pages
│   └── article/
│       └── [slug]/page.tsx
├── app/admin/          # Admin panel
│   ├── page.tsx
│   ├── articles/
│   ├── users/
│   └── analytics/
└── services/           # Business logic
    ├── wiki.service.ts
    ├── auth.service.ts
    └── sync.service.ts
```