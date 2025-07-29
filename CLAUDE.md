# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Strapi v3.6.11 backend for the District 21 Softball of Michigan website (https://d21softball.org/). It's an e-commerce platform that handles tournament registrations, training workshops, and serves historical information. The backend uses PostgreSQL in production and includes Stripe payment processing.

## Development Commands

```bash
# Switch to Node 14 (required for Strapi 3.6.11)
nvm use 14

# Install dependencies
yarn

# Start database (Docker)
yarn db:up

# Development server
yarn dev

# Build for production
yarn build

# Production build with memory optimization
NODE_ENV=production yarn build --no-optimization

# Start production server
yarn start
```

## Database Setup

For initial development setup:
1. Get a PostgreSQL dump from production using `pg_dump -bcv > d21.sql`
2. Restore to local Docker container: `docker exec -i postgres-d21-v3 psql -U strapi strapi-v3 < d21.sql`

## Architecture

### API Structure
The project follows Strapi's MVC pattern with these main content types:
- **tournament** - Tournament registrations with team management and payment status
- **order** - Stripe payment orders linked to tournaments
- **camp** - Training camps/workshops
- **hall-of-fame** - Historical member records
- **leagues** - League information and standings
- **motel** - Accommodation information
- **front-page** - Homepage content management

### Key Features
- **Stripe Integration**: Full payment processing in `/api/order/controllers/order.js`
- **Cookie Authentication**: Custom middleware in `/middlewares/cookieGetter/` handles token extraction from cookies
- **Custom Logout**: Custom endpoint in `/api/custom/controllers/Custom.js` for session management
- **Dynamic Components**: Reusable components in `/components/` for structured content

### Payment Flow
1. Order creation sets up Stripe checkout session
2. Success callback updates order status to "paid"
3. Team registration status is automatically updated when payment is confirmed

### Configuration
- Environment-specific configs in `/config/env/`
- Database, server, middleware, and plugin configurations
- CKEditor5 plugin for rich text editing
- Custom 404 responses

## Important Notes

- Uses older Node.js (14.x) and Strapi v3.6.11 - do not upgrade without careful testing
- Production environment uses domain-specific cookie settings
- Database migrations are in `/database/migrations/`
- Frontend is a separate Next.js project at https://github.com/mikecebul/d21softball-frontend