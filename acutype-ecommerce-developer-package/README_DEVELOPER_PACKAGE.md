# Accutite Fasteners - Complete Developer Package

This package contains the complete, production-ready Accutite Fasteners e-commerce platform with AI chatbot integration.

## What's Included

### 1. accutite-developer-package.tar.gz (246 KB)
Complete source code with:
- Full React 19 frontend (10 pages)
- Express 4 + tRPC 11 backend
- Drizzle ORM database layer
- Claude 3.5 Sonnet AI chatbot
- 882 real products from inventory
- All configuration files

**Excluded (reduce download size):**
- node_modules/ (reinstall with pnpm install)
- dist/ (rebuild with pnpm build)
- .git/ (fresh repo)
- .manus-logs/ (dev logs)

### 2. DEVELOPER_SETUP.md
Quick start guide with:
- 5-minute installation steps
- Project structure overview
- Development commands
- Database management
- Troubleshooting

### 3. ENVIRONMENT_VARIABLES.md
Complete environment variable reference:
- Database connection
- Authentication keys
- API credentials
- Analytics setup

### 4. API_ENDPOINTS.md
Full tRPC API documentation:
- All 15+ endpoints
- Request/response formats
- Data type definitions
- Authentication requirements

### 5. README_DEVELOPER_PACKAGE.md (this file)
Package overview and contents

## Quick Start

```bash
# Extract
tar -xzf accutite-developer-package.tar.gz
cd accutite

# Install
pnpm install

# Configure
# Create .env.local with values from ENVIRONMENT_VARIABLES.md

# Setup database
pnpm db:push

# Run
pnpm dev
```

Access at: http://localhost:3000

## Technology Stack

### Frontend
- React 19 + TypeScript
- Tailwind CSS 4
- Wouter (routing)
- Framer Motion (animations)
- tRPC client

### Backend
- Express 4
- tRPC 11
- Drizzle ORM
- MySQL 8.0+
- Claude 3.5 Sonnet (AI)

### Database
- 8 tables
- 882 products
- Full order management
- Chat history tracking

## Key Features

✅ E-commerce catalog (882 products)
✅ Shopping cart with persistence
✅ Customer portal with order history
✅ AI chatbot (embedded + dedicated page)
✅ Contact & RFQ forms
✅ OAuth authentication
✅ Responsive design
✅ Full API documentation
✅ 12 passing tests
✅ Production-ready

## File Structure

```
accutite/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # 10 page components
│   │   ├── components/    # Reusable UI
│   │   ├── contexts/      # State management
│   │   ├── lib/           # tRPC setup
│   │   ├── App.tsx        # Router
│   │   └── index.css      # Styles
│   ├── index.html
│   └── public/
├── server/                 # Express backend
│   ├── _core/             # Framework
│   ├── db.ts              # Queries
│   ├── routers.ts         # tRPC procedures
│   ├── chatbot.ts         # AI service
│   └── storage.ts         # S3 integration
├── drizzle/               # Database
│   ├── schema.ts          # Tables
│   └── migrations/
├── shared/                # Types
├── package.json           # Dependencies
├── vite.config.ts         # Build config
├── tsconfig.json          # TypeScript
└── seed-products.mjs      # Data seeding
```

## Database Tables

1. **users** - User accounts & authentication
2. **products** - 882 fastener items
3. **orders** - Customer orders
4. **order_items** - Line items
5. **quotes** - RFQ quotes
6. **contact_messages** - Contact form submissions
7. **chatbot_conversations** - Chat sessions
8. **chatbot_messages** - Chat messages

## Pages Included

- **Home** - Hero, products, industries, testimonials
- **Products** - Catalog with filtering (882 items)
- **ProductDetail** - Individual product page
- **Shop** - Shopping cart & checkout
- **Portal** - Customer dashboard (requires login)
- **Chat** - Dedicated chatbot page
- **Contact** - Contact form
- **RequestQuote** - RFQ form
- **Industries** - Industry showcase
- **Services** - Service descriptions
- **About** - Company info & certifications

## API Endpoints

15+ tRPC endpoints covering:
- Products (list, search, details)
- Orders (create, list, details)
- Quotes (create, list, details)
- Contacts (submit form)
- Chatbot (create conversation, send message)
- Auth (login, logout, current user)
- Portal (dashboard, PO submission)

See API_ENDPOINTS.md for complete reference.

## Development Workflow

```bash
# Start dev server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Start production server
NODE_ENV=production node dist/index.js

# Format code
pnpm format

# Type check
pnpm check

# Sync database schema
pnpm db:push
```

## Environment Setup

Required environment variables (see ENVIRONMENT_VARIABLES.md):
- DATABASE_URL
- JWT_SECRET
- VITE_APP_ID
- OAUTH_SERVER_URL
- BUILT_IN_FORGE_API_KEY
- (+ 6 more optional)

## Deployment

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- Environment variables configured

### Steps
1. Extract package
2. Install: `pnpm install`
3. Build: `pnpm build`
4. Set environment variables
5. Run: `NODE_ENV=production node dist/index.js`

### Database
- Migrations run automatically on startup
- Backup before production deployment
- Use read replicas for scaling

## Support & Troubleshooting

See DEVELOPER_SETUP.md for:
- Installation issues
- Database connection errors
- Build problems
- Port conflicts
- Testing procedures

## Next Steps

1. Extract the package
2. Follow DEVELOPER_SETUP.md
3. Review API_ENDPOINTS.md
4. Check ENVIRONMENT_VARIABLES.md
5. Run `pnpm dev` to start
6. Access http://localhost:3000

## Notes

- This is a complete, production-ready application
- All source code is included
- Database schema is pre-defined
- 882 products are ready to seed
- AI chatbot is fully integrated
- Tests are included and passing
- No modifications needed to run locally

---

**Version:** 1.0.0  
**Last Updated:** May 2026  
**Status:** Production Ready
