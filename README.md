# Assignment 2 - B2C Store Application

The goal of this assignment is to design and develop a fully functional **Business-to-Consumer (B2C) Store application** that allows users to browse products, manage a shopping cart, and complete purchases, while administrators manage products and view purchase records.

The application builds on an existing monorepo structure from WSU Blog Post (Assignments 2.1, 2.2, 2.3) and extends it with full e-commerce functionality.

## Success Criteria

- ✅ All of the tests must be passing
- ✅ All existing functionality must remain working
- ✅ You must be able to explain any code in the codebase
- ✅ Database is fully integrated with Prisma and seeded correctly
- ✅ Admin and user flows work end-to-end (auth, cart, purchase, CRUD)

---

## 👾 Requirements - Assignment 2.1 - Client (Storefront)

### HOME SCREEN

- [ ] User must see all active products
- [ ] User must see product categories with navigation links
- [ ] User must be able to navigate to category pages (e.g. /category/electronics)
- [ ] User must see a cart navigation link
- [ ] User must be able to toggle dark and light mode using `data-theme` on `<html>`
- [ ] User must be able to search products via search input (redirects to `/search?q=`)
- [ ] Search filters products by title and/or description

### PRODUCT LIST / FILTERING

- [ ] User must see a list of products rendered as cards (`article`)
- [ ] Each product card includes:
  - title
  - image
  - description snippet
  - tags
  - category
  - active status
- [ ] User must be able to filter products by:
  - content/title
  - tags
  - category (via URL)
  - date created
- [ ] Filters must be combinable
- [ ] User must be able to sort products by:
  - title (asc/desc)
  - date (asc/desc)

### DETAIL SCREEN

- [ ] Product detail page shows full product information
- [ ] Product markdown content is rendered correctly
- [ ] User can add product to cart
- [ ] Product price, image, description, and features are visible

### CATEGORY SCREEN

- [ ] Displays products filtered by category from URL
- [ ] Shows "0 Products" when category has no matches

### TAG SCREEN

- [ ] Displays products filtered by tag from URL
- [ ] Shows "0 Products" when no products match tag

### SEARCH SCREEN

- [ ] Displays search results based on query string (`/search?q=`)
- [ ] Shows "0 Products" when no matches are found

### CART SCREEN

- [ ] User can add products to cart from detail page
- [ ] User can remove products from cart
- [ ] User can increase/decrease quantity
- [ ] Cart displays:
  - product name
  - price per item
  - quantity
  - total price
- [ ] Cart prevents exceeding stock limits
- [ ] Cart shows warning when max quantity is reached
- [ ] User can proceed to checkout
- [ ] Checkout triggers mock Stripe flow and success page

### PURCHASE FLOW

- [ ] Successful checkout creates a purchase record
- [ ] Purchase displays:
  - product names
  - images
  - quantity
  - totals
- [ ] User can view purchase history in `/purchases`
- [ ] User can remove purchase entries

---

## 👾 Requirements - Assignment 2.2 - Admin

### ADMIN HOME SCREEN

- [ ] Shows login screen when unauthenticated
- [ ] Shows dashboard when authenticated
- [ ] Uses `auth_token` httpOnly cookie
- [ ] Login uses hardcoded credentials validated on server
- [ ] Logout clears session and redirects to login

### ADMIN LIST SCREEN

- [ ] Displays all products (active and inactive)
- [ ] Products render as cards (`article`)
- [ ] Admin can filter by:
  - title/content
  - tags
  - category
  - date created
- [ ] Filters can be combined
- [ ] Admin can sort by:
  - title
  - date
- [ ] Each product shows:
  - image
  - title
  - category
  - tags
  - active status
- [ ] Admin can toggle active status
- [ ] Admin can delete products (with confirmation modal)
- [ ] Admin can navigate to:
  - create product screen
  - edit product screen

### ADMIN CREATE & UPDATE SCREEN

- [ ] Pages are protected (auth required)
- [ ] Fields include:
  - Title
  - Description
  - Content (Markdown)
  - Image URL
  - Tags
  - Category
  - Brand
- [ ] All fields must be validated
- [ ] Save shows success or error messages
- [ ] Update form preloads existing product data
- [ ] Create form adds new product to database
- [ ] Image preview is shown from URL
- [ ] Markdown content renders correctly

---

## 👾 Requirements - Assignment 2.3 (Backend Integration)

### BACKEND / STORE LOGIC

- [ ] All products are loaded from database (Prisma/PostgreSQL)
- [ ] Filtering is performed server-side
- [ ] Each product view increases view count
- [ ] Product ratings and stock are persisted
- [ ] Cart state is reflected in backend during checkout
- [ ] Purchase records are stored in database

### BACKEND / CART & CHECKOUT

- [ ] Products can be added to cart
- [ ] Cart persists per user session
- [ ] Checkout creates purchase via API
- [ ] Stripe flow is mocked for testing
- [ ] Stock is respected and enforced

### BACKEND / PURCHASES

- [ ] Purchase history is stored in relational schema:
  - User → Purchase → PurchaseItem
- [ ] Users can fetch purchase history
- [ ] Users can delete purchase records
- [ ] Error handling works for failed API calls

---

## 👾 ADMIN AUTHENTICATION

- [ ] Login uses POST `/api/auth`
- [ ] Logout uses DELETE `/api/auth`
- [ ] Password is verified server-side
- [ ] JWT stored in `auth_token` cookie
- [ ] Protected routes redirect to login when unauthenticated

---

## Prerequisites

First, make sure that "pnpm" and "turbo" is installed in your computer. If not, please follow installation instructions for pnpm. If turbo is not installed, please install it using pnpm with the following command:

Then, run the following command to install turborepo.

```
pnpm add -g turbo
```

## Installing the project

Once the pnpm is installed, in the root of the project install the packages

```
pnpm i or pnpm install
```

To run end to end tests you need to install headless browsers. Please run the following command in the `tests/playwright` directory

```
pnpx playwright install
```

## Environment

---
# .env files

Copy bellow in their respective folders:

packages/db/.env:
DATABASE_URL="postgresql://neondb_owner:npg_IlJkjTs34LeC@ep-billowing-credit-ap4jftat.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"

apps/web/.env:
DATABASE_URL="postgresql://neondb_owner:npg_IlJkjTs34LeC@ep-billowing-credit-ap4jftat-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET=secret
STRIPE_SECRET_KEY=sk_test_51TdnJvA0moIFd3LAAqYKgZ13se45dQhfF5wgXSUaNCRloGU3ZiYwcFlHGJmCfZc0I5RySL713VuSxYxFTlaTaRAK00JOzBvmL6
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51TdnJvA0moIFd3LAho0qDIhRNKf6PkzN1DUBehinmYgQsqaibvpS1G63auDo17AlRZUxTYMAW5Xdoxjbj0EqU461006DusRJn8

apps/admin/.env:
PASSWORD=admin123
JWT_SECRET=super-secret-password


## Running the project

To run the project, run the following command in the root directory of your project:

```
turbo dev
```

This will run:

- Client application at [http://localhost:3001](http://localhost:3001)
- Admin application at [http://localhost:3002](http://localhost:3002)

## Running tests

To run the tests please run the following in the tests/playwright folder:
- pnpm playwright test --grep @a1
- pnpm playwright test --grep @a2
- pnpm playwright test --grep @a3

For Playwright interface run:
- pnpm playwright test --grep @a1 --ui
- pnpm playwright test --grep @a2 --ui
- pnpm playwright test --grep @a3 --ui

## Project Structure

This project is a monorepo with shared packages and applications.

### Applications

- apps/web → Customer-facing B2C store  
- apps/admin → Admin dashboard  

### Packages

- packages/db → Prisma client, schema, seed data  
- packages/ui → Shared UI components  
- packages/utils → Shared utilities  
- packages/eslint-config → ESLint configuration  
- packages/tailwind-config → Tailwind configuration  
- packages/typescript-config → TypeScript configuration  

### Tests

- tests/playwright-web → Customer flow tests  
- tests/playwright-admin → Admin flow tests  

---

## Database Schema

Uses Prisma with PostgreSQL.

Core models:

- User → admin/customer authentication  
- Product → catalog items  
- Purchase → order records  
- PurchaseItem → line items  

---

## Application Notes

- Authentication uses JWT stored in httpOnly cookies  
- Products are seeded from `db/src/seed.ts`  
- Cart is session-based with backend validation  
- Purchases are persisted and linked to users  
- Admin features include full product CRUD + filtering  

---

## Final Notes

- All functionality is validated using Playwright E2E tests  
- The system is designed as a full-stack e-commerce application  
- Both admin and client systems share the same database layer  