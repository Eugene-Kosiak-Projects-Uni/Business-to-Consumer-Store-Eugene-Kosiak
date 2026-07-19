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
https://business-to-consumer-store-eugene-k-ten.vercel.app/
```

Admin Application

```
https://business-to-consumer-store-eugene-k-iota.vercel.app/
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

# Customer Authentication API

## POST `/api/auth`

### Description

Logs in a user (admin or customer) and creates a session.

### Authentication (Web Access - Login)

- None Required

### Request Body

```json
{
  "email": "user@test.com",
  "password": "user123"
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

### Authentication (Admin Access - Login)

- None Required

### Request Body

```json
{
  "email": "admin@test.com",
  "password": "admin123"
}
```

### Response

```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Admin Mark",
    "email": "admin@test.com",
    "role": "ADMIN"
  }
}
```

```json
 Redirect to login page with failed login message
```

### Notes

- Password validated using bcrypt
- JWT stored in an httpOnly cookie
- Supports both CUSTOMER and ADMIN accounts

---

## DELETE `/api/auth`

### Description

Logs out the current user (customer/admin).

### Authentication

Required

### Response

```json
{
  "success": true
}
```
- deletes JWT and logs out user

---

## POST `/api/register`

### Description

Creates a new customer account.

### Status Codes
- 400 Bad Request — One or more required fields are missing. The name, email, and password are required.

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

- Registration was successful. The user is redirected to /register?success=true.

```json
{
  "success": true
}
```
- 400
```json
{
  "error": "Name, email and password are required"
}
```
- Acount already exists with the same email. The user is redirected to /register?error=exists.
```json
{
  "error": "User already exists"
}
```

---

# Product API - Customer

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

- Returns all active products
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

### Status Codes
- 404 Not Found — No active product exists with the supplied urlId.

### Authentication

None required.

### Response

- Returns a specific product
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

- 404
```json
{ 
  "error": "Not found" 
}
```

---

## POST `/api/create-checkout-session`

### Description

Creates a Stripe Checkout Session for the user's cart.

### Status Codes
- 200 OK — A Stripe Checkout Session was successfully created and its session ID is returned.
- 500 Internal Server Error — The Stripe secret key is missing.
- 500 Internal Server Error — An unexpected error occurred while creating the Stripe Checkout Session.

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
- 200
```json
{
  "url": "https://checkout.stripe.com/..."
}
```
- 500
```json
{
  "error": "Stripe key missing"
}
{
  "error": "Failed to create session"
}
```

### Notes

- Stripe Checkout handles payment processing
- Products are revalidated before session creation
- Checkout totals are calculated server-side

---

## POST `/api/purchase-from-stripe`

### Description

Verifies a Stripe Checkout Session, updates product stock, and creates a purchase record for the authenticated customer.

### Status Codes
- 500 Internal Server Error — An unexpected error occurred while creating the Stripe Checkout Session.

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

- 500
```json
{
  "error": "Stripe key missing"
}
{
  "error": "Failed to create session"
}
```

### Notes

- Stripe Checkout handles payment processing
- Products are revalidated before session creation
- Checkout totals are calculated server-side

---

# Purchase API - Customer

## GET `/api/purchases`

### Description

Returns all purchases belonging to the authenticated user.

### Status Codes
- 200 OK — A new purchase was successfully created and product stock was updated.
- 400 Bad Request — The submitted cart is empty.
- 401 Unauthorized — No valid authenticated user could be identified.
- 04 Not Found — The specified purchase does not exist or does not belong to the authenticated user. 
- 500 Internal Server Error — An unexpected error occurred while creating the purchase, including database errors or insufficient product stock.

### Authentication

CUSTOMER required.

### Response
- 200
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

- 400
```json
{
  "error": "Cart empty"
}
```

- 401
```json
{
  "error": "Unauthorized"
}

```

- 404
```json
{
  "error": "Purchase not found"
}

```

- 500
```json
{
  "error": "Failed to create purchase"
}
```

---

## DELETE `/api/purchase`

### Description

Deletes a purchase record owned by the authenticated user.

### Status Codes
- 401 Unauthorized — No valid authenticated user could be identified.
- 404 Not Found — The specified purchase does not exist or does not belong to the authenticated user.
- 500 Internal Server Error — An unexpected error occurred while deleting the purchase.

### Authentication

CUSTOMER required.

### Response

- 200
```json
{
  "success": true
}
```

- 401
```json
{
  "error": "Unauthorized"
}
```

- 404
```json
{
  "error": "Purchase not found"
}
```

- 500
```json
{
  "error": "Failed to delete purchase"
}
```

### Notes

Users can only delete purchases associated with their own account.

---

## POST '/api/purchase-from-stripe'

### Description

Returns all purchases belonging to the authenticated user, and directs user to Stripe to pay for products.

### Status Codes
- 200 OK — The Stripe purchase was successfully verified, stock was updated, and the purchase was saved to the database.
- 401 Unauthorized — No user_auth_token cookie was found.
- 500 Internal Server Error — The Stripe secret key is missing or an unexpected error occurred while processing the Stripe purchase.

### Authentication

CUSTOMER required.

### Response

- 200
```json
{
  "success": true
}
```

- 401
```json
{
  "error": "Unauthorized"
}
```

- 500
```json
{
  "error": "Failed"
}
```
---

# Cart & Checkout API - Customer

## Cart Behaviour

- Cart state is stored client-side
- Cart items are validated server-side
- Stock quantities are validated before purchase
- Purchase totals are calculated server-side

---

## GET /api/purchases

### Description
Retrieves all purchases for the administrative dashboard.

### Status Codes
- 200 OK — All purchases were successfully retrieved for the admin dashboard.
- 401 Unauthorized — No authentication cookie exists or the JWT token is invalid or expired.

### Authentication

ADMIN required.

### Response

- 401
```json
{ 
  "error": "Unauthorized" 
}
```

---
# Admin Authentication API

## POST '/api/auth'

### Description

Authenticates an administrator using their email and password.

### Authentication

None required.

### Response

- Successful login; creates an auth_token JWT cookie and redirects to the admin dashboard.
- Invalid email or password; redirects to /?error=invalid which displays an eror message of only admin access with valid email and passowrd is allowed access.

---

## DELETE /api/auth

### Description
Logs out the administrator and removes the authentication cookie.

### Authentication

None Required

### Response

- Redirects to the login page and expires the auth_token cookie to 0, so the cookie is deleted.
---

## POST `/api/products`

### Description

Creates a new product.

### Status Codes
- 200 OK — The product was successfully created and the newly created product is returned.
- 400 Bad Request — One or more required product fields are missing.
- 401 Unauthorized — The user is not logged in, the JWT is missing, invalid, or expired.

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

- 200
```json
{
  "success": true,
  "productId": 5
}
```

- 400
```json
{ 
  "error": "Missing required fields" 
}
```

- 401
```json
{ 
  "error": "Session expired" 
}
```
---

## PUT `/api/products/[id]`

### Description

Updates an existing product.

### Status Codes
- 200 OK — The product was successfully updated and the updated product is returned.
- 400 Bad Request — The request body contains invalid JSON or required product fields are missing.
- 401 Unauthorized — The user is not logged in, the JWT is missing, invalid, or expired.
- 404 Not Found — No product exists with the supplied ID.
- 500 Internal Server Error — An unexpected server or database error occurred while updating the product.

### Authentication

ADMIN required.

### Response
- 200
```json
{
  "success": true
}
```

- 400
```json
{ 
  "error": "Missing required fields" 
}

{ 
  "error": "Invalid JSON" 
}
```

- 401
```json
{ 
  "error": "Session expired" 
}
```

- 404
```json
{ 
  "error": "Product not found" 
}
```

- 500
```json
{ 
  "error": "Server Error" 
}
```
---

## DELETE `/api/products/[id]`

### Description

Deletes a product.

### Status Codes
- 200 OK — The product was successfully deleted.
- 401 Unauthorized — The user is not logged in, the JWT is missing, invalid, or expired.
- 404 Not Found — No product exists with the supplied ID.
- 500 Internal Server Error — An unexpected database or server error occurred while deleting the product.

### Authentication

ADMIN required.

### Response

- 200
```json
{
  "success": true
}
```

- 401
```json
{ 
  "error": "Session expired" 
}
```

- 404
```json
{ 
  "error": "Product not found" 
}
```

- 500
```json
{ 
  "error": "Server Error" 
}
```

---

## PATCH `/api/products/toggle`

### Description

Toggles a product between active and inactive states.

### Status Codes
- 401 Unauthorized — The user is not logged in, the JWT is missing, invalid, or expired.

### Authentication

ADMIN required.

### Response

- 401
```json
{ 
  "error": "Session expired" 
}
```

---

## GET `/api/purchases`

### Description

Gets all purchases made by customers in the web store.

### Status Codes
- 401 Unauthorized — The user is not logged in, the JWT is missing, invalid, or expired.

### Authentication

ADMIN required.

### Response

- 401
```json
{ 
  "error": "Session expired" 
}
```

- Purchase Details
```json
[
  {
    "id": 1,
    "userId": 1,
    "total": 348,
    "date": "2026-06-05T10:00:00.000Z",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@test.com",
      "role": "CUSTOMER"
    },
    "items": [
      {
        "id": 1,
        "purchaseId": 1,
        "productId": 1,
        "title": "Wireless Headphones",
        "price": 199,
        "quantity": 1,
        "imageUrl": "...",
        "product": {
          "id": 1,
          "urlId": "wireless-headphones",
          "title": "Wireless Headphones",
          "description": "Premium audio device...",
          "content": "# Wireless Headphones...",
          "imageUrl": "...",
          "category": "Electronics",
          "brand": "BrandX",
          "tags": "Audio,Wireless,Tech",
          "price": 199,
          "stock": 12,
          "rating": 4.8,
          "active": true
        }
      }
    ]
  }
]
```
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

### packages/db/.env:

```env
DATABASE_URL="postgresql://neondb_owner:npg_IlJkjTs34LeC@ep-billowing-credit-ap4jftat.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
```
### apps/web/.env:

```env
DATABASE_URL="postgresql://neondb_owner:npg_IlJkjTs34LeC@ep-billowing-credit-ap4jftat-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET=secret
STRIPE_SECRET_KEY=sk_test_51TdnJvA0moIFd3LAAqYKgZ13se45dQhfF5wgXSUaNCRloGU3ZiYwcFlHGJmCfZc0I5RySL713VuSxYxFTlaTaRAK00JOzBvmL6
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51TdnJvA0moIFd3LAho0qDIhRNKf6PkzN1DUBehinmYgQsqaibvpS1G63auDo17AlRZUxTYMAW5Xdoxjbj0EqU461006DusRJn8
```

### apps/admin/.env:

```env
PASSWORD=admin123
JWT_SECRET=super-secret-password
```
