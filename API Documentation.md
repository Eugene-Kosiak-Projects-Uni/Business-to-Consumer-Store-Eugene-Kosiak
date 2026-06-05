# API Documentation

This project is based on WSU Blog Post. That has been modified to be a Business-to-Consumer (B2C) Store Application built using:

- Next.js
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- JWT Authentication
- Stripe Checkout
- Tailwind CSS

The API provides functionality for:

- User authentication
- Product browsing and search
- Shopping cart checkout
- Purchase history management
- Administrative product management

---

# Base URL

## Local Development

Customer Application

```
http://localhost:3001
```

Admin Application

```
http://localhost:3002
```

## Production

Customer Application

```
https://business-to-consumer-store-eugene-k.vercel.app/
```

Admin Application

```
https://business-to-consumer-store-eugene-k-seven.vercel.app
```


---

# API Conventions

## Response Format

### Successful Mutation Requests

```json
{
  "success": true
}
```

### Error Responses

```json
{
  "error": "Message"
}
```

### GET Requests

GET requests return:
- JWT Token from cookies
- Get product by urlId from query parameters

### POST Requests
POST requests creates:
- create login tokens for customer and admin
- register new customers to buy products
- create/update product form
- display active products
- create purchases for customer

## DELETE Requests
DELETE requests remove:
- login tokens for customer and admin
- delete products (admin only)
- delete purchases (customer only)

---

## Authentication

Authentication is handled using JWT tokens stored in an httpOnly cookie.

Cookie:
- Customer: user_auth_token
- Admin: auth_token

Protected routes validate:

- JWT signature
- User identity
- User role (where applicable)

---

## Role-Based Access Control

### CUSTOMER

Can:

- Browse products
- Search products
- Complete purchases
- View purchase history
- Delete their own purchase records

### ADMIN

Can:

- Create products
- Update products
- Delete products
- Activate/deactivate products
- View purchase records

---

# Authentication API

## POST `/api/auth`

### Description

Logs in a user and creates a session.

### Authentication

None required.

### Request Body

```json
{
  "email": "user@test.com",
  "password": "password123"
}
```

### Response

```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@test.com",
    "role": "CUSTOMER"
  }
}
```

### Notes

- Password validated using bcrypt
- JWT stored in an httpOnly cookie
- Supports both CUSTOMER and ADMIN accounts

---

## DELETE `/api/auth`

### Description

Logs out the current user.

### Authentication

Required

### Response

```json
{
  "success": true
}
```

---

## POST `/api/register`

### Description

Creates a new customer account.

### Authentication

None required.

### Request Body

```json
{
  "name": "Phill",
  "email": "newuser@test.com",
  "password": "test"
}
```

### Response

```json
{
  "success": true
}
```

### Errors

```json
{
  "error": "User already exists"
}
```

Status Code:

```text
409 Conflict
```

---

# Product API

## GET `/api/products`

### Description

Returns all active products.

Supports server-side searching, filtering and sorting.

### Authentication

None required.

### Query Parameters

| Parameter | Type   | Description                                |
| --------- | ------ | ------------------------------------------ |
| search    | string | Search title or description                |
| category  | string | Filter by category                         |
| tag       | string | Filter by tags                             |
| sort      | string | title-asc, title-desc, date-asc, date-desc |

### Example Request

```text
GET /api/products?category=Electronics&search=headphones
```

### Response

```json
[
  {
    "id": 1,
    "urlId": "wireless-headphones",
    "title": "Wireless Headphones",
    "description": "Premium audio device...",
    "price": 199,
    "imageUrl": "...",
    "category": "Electronics",
    "tags": "Audio,Wireless,Tech",
    "stock": 12,
    "rating": 4.8
  }
]
```

---

## GET `/api/products/[urlId]`

### Description

Returns a single product using its URL slug.

### Authentication

None required.

### Response

```json
{
  "id": 1,
  "urlId": "wireless-headphones",
  "title": "Wireless Headphones",
  "description": "Premium audio device...",
  "content": "# Wireless Headphones...",
  "price": 199,
  "stock": 12,
  "imageUrl": "..."
}
```

---

## POST `/api/products`

### Description

Creates a new product.

### Authentication

ADMIN required.

### Request Body

```json
{
  "title": "New Product",
  "description": "Short description",
  "content": "Markdown content",
  "imageUrl": "https://...",
  "category": "Electronics",
  "brand": "BrandX",
  "tags": "tag1,tag2",
  "price": 100,
  "stock": 10
}
```

### Response

```json
{
  "success": true,
  "productId": 5
}
```

---

## PUT `/api/products/[id]`

### Description

Updates an existing product.

### Authentication

ADMIN required.

### Response

```json
{
  "success": true
}
```

---

## DELETE `/api/products/[id]`

### Description

Deletes a product.

### Authentication

ADMIN required.

### Response

```json
{
  "success": true
}
```

---

## PATCH `/api/products/[id]/toggle`

### Description

Toggles a product between active and inactive states.

### Authentication

ADMIN required.

### Response

```json
{
  "success": true,
  "active": false
}
```

### Notes

Uses the Prisma field:

```text
active Boolean
```

This allows products to be hidden without deleting them.

---

# Cart & Checkout API

## Cart Behaviour

- Cart state is stored client-side
- Cart items are validated server-side
- Stock quantities are validated before purchase
- Purchase totals are calculated server-side

---

## POST `/api/cart/checkout`

### Description

Creates a Stripe Checkout Session for the user's cart.

### Authentication

CUSTOMER required.

### Request Body

```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 1
    }
  ]
}
```

### Response

```json
{
  "url": "https://checkout.stripe.com/..."
}
```

### Notes

- Stripe Checkout handles payment processing
- Products are revalidated before session creation
- Checkout totals are calculated server-side

---

# Purchase API

## GET `/api/purchases`

### Description

Returns all purchases belonging to the authenticated user.

### Authentication

CUSTOMER required.

### Response

```json
[
  {
    "id": 1,
    "date": "2026-06-05T10:00:00Z",
    "total": 348,
    "items": [
      {
        "productId": 1,
        "title": "Wireless Headphones",
        "price": 199,
        "quantity": 1
      }
    ]
  }
]
```

---

## DELETE `/api/purchases/[id]`

### Description

Deletes a purchase record owned by the authenticated user.

### Authentication

CUSTOMER required.

### Response

```json
{
  "success": true
}
```

### Notes

Users can only delete purchases associated with their own account.

---

# Error Responses

## 400 Bad Request

```json
{
  "error": "Invalid input"
}
```

## 401 Unauthorized

```json
{
  "error": "Unauthorized"
}
```

## 403 Forbidden

```json
{
  "error": "Insufficient permissions"
}
```

## 404 Not Found

```json
{
  "error": "Not found"
}
```

## 409 Conflict

```json
{
  "error": "User already exists"
}
```

---

# Database Schema Overview

The application uses:

- PostgreSQL hosted on Neon
- Prisma ORM
- Next.js Route Handlers

## User

Stores customer and administrator accounts.

Fields:

- id
- name
- email
- password
- role
- createdAt

Relationship:

```text
User 1 → Many Purchases
```

---

## Product

Stores product catalogue information.

Fields:

- id
- urlId
- title
- description
- content
- imageUrl
- category
- brand
- price
- stock
- rating
- tags
- featured
- active
- date

Relationship:

```text
Product 1 → Many PurchaseItems
```

---

## Purchase

Stores completed orders.

Fields:

- id
- userId
- date
- total

Relationship:

```text
Purchase 1 → Many PurchaseItems
```

---

## PurchaseItem

Stores individual products purchased within an order.

Fields:

- id
- purchaseId
- productId
- title
- price
- quantity

---

# Authentication Summary

- JWT stored in httpOnly cookie
- Protected routes validate JWT
- Role-based access enforced server-side

## Roles

### CUSTOMER

- Product browsing
- Checkout
- Purchase history

### ADMIN

- Product management
- Product activation/deactivation
- Purchase administration

---

# Constraints / Rules

- Product stock is enforced during checkout
- Purchase totals are calculated server-side
- Users can only access their own purchase records
- Filtering and searching are performed server-side using Prisma
- All purchase records are persisted in PostgreSQL
- Administrative routes require JWT authentication and ADMIN privileges
- Product activation status controls product visibility without deletion

---
# .env files

packages/db/.env:
![alt text](image-1.png)

apps/web/.env:
![alt text](image-3.png)

apps/admin/.env:
![alt text](image-2.png)
