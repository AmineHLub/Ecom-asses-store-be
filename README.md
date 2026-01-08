# Products API

REST API for managing products with pagination, filtering, and search.

## Tech Stack
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Swagger (OpenAPI)

## Getting Started

### Install
npm install

### Environment
Create a `.env` file:

DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase  
PORT=3000

### Database
npx prisma generate  
npx prisma db push

### Run
npm run dev

## API Overview

### Products

| Method | Endpoint | Description |
|------|---------|-------------|
| GET | /api/products | List products (paginated) |
| GET | /api/products/:id | Get product by ID |
| POST | /api/products | Create product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |
| POST | /api/products/createbunchrandom | Seed demo products |

## Pagination & Filtering

List endpoints support pagination:

?page=1&per_page=20

Optional filters:
- category
- search (matches product title)

## API Documentation

Interactive Swagger documentation is available at:

http://server/api/docs