# Project Analysis

Generated from the current codebase snapshot of the `ecommerce-store` project.

## 1. Project Overview

- Project name: `ecommerce-store`
- Project type: Full-stack e-commerce application
- Main purpose: Provide a simple storefront for browsing products, managing a cart, registering/logging in, and preparing checkout/order flows
- Target users: Customers, authenticated users, and future admins/developers extending the store
- Core features:
  - Browse product catalog
  - View product detail pages
  - Register, log in, log out, and view profile
  - Add products to a cart and update quantities
  - Checkout draft collection on the client side
  - Backend REST APIs for auth, products, cart, and orders
  - Seed script for sample product data

## 2. Technology Stack

### Frontend

| Area | Stack |
|---|---|
| Framework/library used | None. Vanilla HTML, CSS, and ES modules in browser JavaScript |
| CSS solution | Plain CSS files per page plus shared global styles |
| State management | `localStorage`, DOM state, and custom browser events |
| Routing | Multi-page static HTML navigation with links and query parameters |

### Backend

| Area | Stack |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Authentication | JWT bearer tokens with bcrypt password hashing |

### Database

| Area | Stack |
|---|---|
| Database type | MongoDB |
| ODM/ORM | Mongoose |

### Other packages and libraries

- Backend packages: `cors`, `dotenv`, `express-async-handler`, `express-rate-limit`, `helmet`, `jsonwebtoken`, `multer`, `nodemon`, `bcryptjs`
- Browser APIs: `fetch`, `localStorage`, `CustomEvent`, `URLSearchParams`, `document.querySelector`, `window.dispatchEvent`
- Note: `multer` is installed but there is no active upload flow in the current code.

## 3. Complete Folder Structure

```text
ecommerce-store/
├─ .env
├─ .gitignore
├─ package.json
├─ CHAT.md
├─ backend/
│  ├─ .env
│  ├─ .env.example
│  ├─ package.json
│  ├─ package-lock.json
│  ├─ server.js
│  ├─ config/
│  │  └─ db.js
│  ├─ controllers/
│  │  ├─ authController.js
│  │  ├─ cartController.js
│  │  ├─ orderController.js
│  │  └─ productController.js
│  ├─ legacy/
│  │  ├─ authController.js
│  │  ├─ authMiddleware.js
│  │  ├─ authRoutes.js
│  │  ├─ cartRoutes.js
│  │  ├─ db.js
│  │  ├─ jwt.js
│  │  ├─ orderRoutes.js
│  │  ├─ productRoutes.js
│  │  ├─ User.js
│  │  └─ userRoutes.js
│  ├─ middleware/
│  │  ├─ adminMiddleware.js
│  │  ├─ authMiddleware.js
│  │  └─ errorMiddleware.js
│  ├─ models/
│  │  ├─ Cart.js
│  │  ├─ Order.js
│  │  ├─ Product.js
│  │  └─ User.js
│  ├─ routes/
│  │  ├─ authRoutes.js
│  │  ├─ cartRoutes.js
│  │  ├─ orderRoutes.js
│  │  └─ productRoutes.js
│  ├─ scripts/
│  │  └─ seedProducts.js
│  └─ utils/
│     ├─ generateToken.js
│     └─ validators.js
└─ frontend/
   ├─ cart.html
   ├─ checkout.html
   ├─ index.html
   ├─ login.html
   ├─ product.html
   ├─ profile.html
   ├─ register.html
   ├─ css/
   │  ├─ auth.css
   │  ├─ cart.css
   │  ├─ checkout.css
   │  ├─ footer.css
   │  ├─ navbar.css
   │  ├─ products.css
   │  └─ style.css
   └─ js/
      ├─ api.js
      ├─ auth.js
      ├─ cart.js
      ├─ checkout.js
      ├─ login.js
      ├─ product.js
      ├─ products.js
      ├─ profile.js
      ├─ register.js
      └─ components/
         ├─ header.js
         └─ footer.js
```

## 4. Frontend Architecture

### Entry point

- The application is a static multi-page site, so each HTML file is its own entry point.
- The home page is [frontend/index.html](frontend/index.html).
- Every page loads a page-specific ES module from `frontend/js/`.
- Shared UI is injected by [frontend/js/components/header.js](frontend/js/components/header.js) and [frontend/js/components/footer.js](frontend/js/components/footer.js).

### Page structure

- Common structure across pages:
  - shared header mount point: `#site-header`
  - page-specific `<main>` content
  - shared footer mount point: `#site-footer`
  - a page-specific script loaded with `type="module"`
- Navigation is link-based, not router-based.
- Product detail navigation uses query params like `/product.html?id=<productId>`.

### Component structure

- [frontend/js/components/header.js](frontend/js/components/header.js)
  - Renders branding, search input, auth links, cart badge, and logout button
  - Reads auth state from `localStorage`
  - Emits `site:search` events from the search box
  - Updates cart badge counts and auth-related link visibility
- [frontend/js/components/footer.js](frontend/js/components/footer.js)
  - Renders a static footer with about, links, contact info, and social links
  - Mounts into `#site-footer`

### Shared utilities

- [frontend/js/api.js](frontend/js/api.js)
  - `fetchProducts()` and `fetchProductById(id)`
  - Uses `window.API_BASE || 'http://localhost:5000/api'`
- [frontend/js/auth.js](frontend/js/auth.js)
  - Token storage, login/register calls, profile retrieval, auth guards, and logout
  - Central place for auth headers and UI hydration

### CSS structure

- [frontend/css/style.css](frontend/css/style.css): global theme, layout, cards, shared buttons, container, hero, and grid styles
- [frontend/css/navbar.css](frontend/css/navbar.css): sticky header, search bar, cart badge, responsive navigation
- [frontend/css/footer.css](frontend/css/footer.css): footer layout and responsive footer styling
- [frontend/css/products.css](frontend/css/products.css): product listing page styles
- [frontend/css/auth.css](frontend/css/auth.css): login/register/profile shells and form cards
- [frontend/css/cart.css](frontend/css/cart.css): cart grid, items, and summary panel
- [frontend/css/checkout.css](frontend/css/checkout.css): checkout layout and form styling

### Navigation flow

- Home page lists products.
- Clicking a product opens the product detail page.
- Adding a product updates `localStorage.cart`.
- Cart page reads `localStorage.cart`, fetches product details, and renders quantity controls.
- Checkout page requires auth and saves a local draft.
- Login/register pages update auth state and redirect back to the storefront.
- Profile page fetches the authenticated user profile from the backend.

### Page-by-page analysis

| Page | Purpose | Main functionality | Imported files | User flow |
|---|---|---|---|---|
| [index.html](frontend/index.html) | Storefront landing page | Loads product grid and supports add-to-cart | `js/products.js`, shared header/footer, `js/api.js`, `js/auth.js` | Visitor browses products, searches via header input, adds items to cart |
| [product.html](frontend/product.html) | Product detail page | Loads one product by ID and lets user add it to cart | `js/product.js`, shared header/footer, `js/api.js`, `js/auth.js` | User opens a product, reads details, adds item to cart |
| [cart.html](frontend/cart.html) | Cart view | Renders cart contents, quantity controls, subtotal, and checkout link | `js/cart.js`, shared header/footer, `js/api.js`, `js/auth.js` | User reviews cart, updates quantities, removes items, proceeds to checkout |
| [checkout.html](frontend/checkout.html) | Checkout form | Requires auth, shows summary, and saves a local checkout draft | `js/checkout.js`, shared header/footer, `js/api.js`, `js/auth.js` | Logged-in user enters shipping info and stores a draft locally |
| [login.html](frontend/login.html) | Sign-in page | Posts credentials to backend and stores token + user | `js/login.js`, shared header/footer, `js/auth.js` | Guest signs in, is redirected to home or the `next` page |
| [register.html](frontend/register.html) | Sign-up page | Creates a new account and stores token + user | `js/register.js`, shared header/footer, `js/auth.js` | Guest creates account, is redirected to home |
| [profile.html](frontend/profile.html) | Profile page | Requires auth and fetches user profile from backend | `js/profile.js`, shared header/footer, `js/auth.js` | Logged-in user views profile summary and checkout link |

## 5. Backend Architecture

### Server startup flow

1. [backend/server.js](backend/server.js) loads environment variables with `dotenv`.
2. It calls [backend/config/db.js](backend/config/db.js) to connect to MongoDB through Mongoose.
3. Express middleware is registered:
   - `helmet()`
   - `express.json()`
   - `cors()`
   - global rate limiting via `express-rate-limit`
4. Route groups are mounted:
   - `/api/auth`
   - `/api/products`
   - `/api/cart`
   - `/api/orders`
5. Static uploads are served from `/uploads`.
6. The 404 and global error handlers are registered.
7. The server listens on `process.env.PORT || 5000`.

### Route registration

- [backend/routes/authRoutes.js](backend/routes/authRoutes.js)
- [backend/routes/productRoutes.js](backend/routes/productRoutes.js)
- [backend/routes/cartRoutes.js](backend/routes/cartRoutes.js)
- [backend/routes/orderRoutes.js](backend/routes/orderRoutes.js)

### Middleware flow

- `helmet()` adds security headers.
- `express.json()` parses JSON request bodies.
- `cors()` enables cross-origin requests.
- `rateLimit()` throttles requests.
- [backend/middleware/authMiddleware.js](backend/middleware/authMiddleware.js)
  - `protect` reads the JWT bearer token, verifies it, and attaches `req.user`
  - `admin` blocks non-admin users
- [backend/middleware/errorMiddleware.js](backend/middleware/errorMiddleware.js)
  - `notFound` turns unmatched routes into 404 errors
  - `errorHandler` formats JSON error responses

### Controller flow

- Controllers are organized by domain:
  - [backend/controllers/authController.js](backend/controllers/authController.js)
  - [backend/controllers/productController.js](backend/controllers/productController.js)
  - [backend/controllers/cartController.js](backend/controllers/cartController.js)
  - [backend/controllers/orderController.js](backend/controllers/orderController.js)
- They use `express-async-handler` to bubble errors into the global error handler.
- Auth controller returns JWTs on register/login and returns the authenticated profile.
- Product controller provides public read access and admin-only create/update/delete.
- Cart controller persists cart data in MongoDB per user.
- Order controller creates orders from the cart, decrements stock, and clears the cart.

### Database connection flow

- [backend/config/db.js](backend/config/db.js) reads `process.env.MONGO_URI`.
- On success, it logs the MongoDB host.
- On failure, it logs the error and terminates the process.

## 6. API Documentation

### Auth

| Method | Route | Purpose | Request body | Response body | Authentication required |
|---|---|---|---|---|---|
| POST | `/api/auth/register` | Create a new user | `{ name, email, password }` | `{ _id, name, email, role, token }` | No |
| POST | `/api/auth/login` | Authenticate a user and issue a token | `{ email, password }` | `{ _id, name, email, role, token }` | No |
| GET | `/api/auth/profile` | Return the authenticated user profile | None | User document without password | Yes |

### Products

| Method | Route | Purpose | Request body | Response body | Authentication required |
|---|---|---|---|---|---|
| GET | `/api/products` | Return all products | None | Array of products | No |
| POST | `/api/products` | Create a product | `{ title, description, price, category, stock, image }` | Created product | Yes, admin |
| GET | `/api/products/:id` | Return one product by ID | None | Product document | No |
| PUT | `/api/products/:id` | Update a product | Partial product fields | Updated product | Yes, admin |
| DELETE | `/api/products/:id` | Delete a product | None | `{ message: 'Product removed' }` | Yes, admin |

### Cart

| Method | Route | Purpose | Request body | Response body | Authentication required |
|---|---|---|---|---|---|
| POST | `/api/cart/add` | Add an item to the logged-in user's cart | `{ productId, quantity }` | Cart document | Yes |
| GET | `/api/cart` | Return the logged-in user's cart | None | Cart document with populated products | Yes |
| PUT | `/api/cart/update` | Update an item's quantity | `{ productId, quantity }` | Cart document | Yes |
| DELETE | `/api/cart/remove` | Remove an item from cart | `{ productId }` | Cart document | Yes |

### Orders

| Method | Route | Purpose | Request body | Response body | Authentication required |
|---|---|---|---|---|---|
| POST | `/api/orders` | Create an order from the cart | `{ shippingAddress }` | Created order | Yes |
| GET | `/api/orders/myorders` | Return the current user's orders | None | Array of orders | Yes |
| GET | `/api/orders` | Return all orders | None | Array of orders | Yes, admin |
| PUT | `/api/orders/:id` | Update order status | `{ status }` | Updated order | Yes, admin |

## 7. Authentication Flow

### Registration

1. The user opens [frontend/register.html](frontend/register.html).
2. [frontend/js/register.js](frontend/js/register.js) submits `name`, `email`, and `password`.
3. [frontend/js/auth.js](frontend/js/auth.js) sends `POST /api/auth/register`.
4. The backend checks whether the email already exists.
5. [backend/controllers/authController.js](backend/controllers/authController.js) creates a new user.
6. The `User` model hashes the password before save.
7. The backend returns a JWT plus basic user information.
8. The frontend stores `token` and `currentUser` in `localStorage`.
9. `auth:updated` is dispatched and the user is redirected to the home page.

### Login

1. The user opens [frontend/login.html](frontend/login.html).
2. [frontend/js/login.js](frontend/js/login.js) submits `email` and `password`.
3. [frontend/js/auth.js](frontend/js/auth.js) sends `POST /api/auth/login`.
4. The backend finds the user, compares the password hash, and returns a JWT.
5. The frontend stores `token` and `currentUser` in `localStorage`.
6. `auth:updated` is dispatched and the user is redirected.

### Token storage

- JWTs are stored in browser `localStorage` under `token`.
- The current user summary is stored in `localStorage` under `currentUser`.
- Requests add `Authorization: Bearer <token>` via [frontend/js/auth.js](frontend/js/auth.js).

### Authorization checks

- [frontend/js/auth.js](frontend/js/auth.js) uses `requireAuth()` to redirect unauthenticated users to login.
- The backend uses `protect` to verify the JWT.
- The backend uses `admin` to restrict product management and admin order routes.

### Logout

1. The header logout button calls `logout()`.
2. `logout()` removes `token` and `currentUser` from `localStorage`.
3. `auth:updated` is dispatched.
4. The browser is redirected to `/login.html`.

## 8. Database Design

### Users

- Schema: [backend/models/User.js](backend/models/User.js)
- Fields:
  - `_id`
  - `name`
  - `email`
  - `password` (hashed)
  - `role` (`user` or `admin`)
  - `address`
  - timestamps
- Relationships:
  - Referenced by carts and orders

### Products

- Schema: [backend/models/Product.js](backend/models/Product.js)
- Fields:
  - `_id`
  - `title`
  - `description`
  - `category`
  - `image`
  - `price`
  - `stock`
  - `ratings`
  - timestamps
- Relationships:
  - Referenced by cart items and order items

### Carts

- Schema: [backend/models/Cart.js](backend/models/Cart.js)
- Fields:
  - `_id`
  - `user` (unique reference to User)
  - `items[]`
    - `product` reference to Product
    - `quantity`
  - timestamps
- Relationships:
  - One cart per user
  - Each item references one product

### Orders

- Schema: [backend/models/Order.js](backend/models/Order.js)
- Fields:
  - `_id`
  - `user` reference to User
  - `orderItems[]`
    - `product` reference to Product
    - `name`
    - `qty`
    - `price`
  - `shippingAddress`
    - `address`
    - `city`
    - `postalCode`
    - `country`
  - `totalPrice`
  - `orderStatus`
  - `paymentStatus`
  - timestamps
- Relationships:
  - One user can have many orders
  - Order items store a snapshot of product information

## 9. Search Feature Analysis

- How search currently works:
  - The header renders a search input.
  - Typing into the input dispatches a `site:search` custom event with the typed value.
  - No product filtering is applied anywhere in the current code.
- Which file emits search events:
  - [frontend/js/components/header.js](frontend/js/components/header.js)
- Which file listens for search events:
  - No page or module consumes `site:search` at the moment.
- Whether search is fully implemented:
  - No. The UI field exists, but there is no search logic in [frontend/js/products.js](frontend/js/products.js) or elsewhere.
- Missing pieces:
  - Event listener and filtering logic
  - Case-insensitive matching against product titles/descriptions/categories
  - Empty-state UI when no products match
  - Optional backend search endpoint or client-side debounce

## 10. Cart System Analysis

- How products are added:
  - On the home page, [frontend/js/products.js](frontend/js/products.js) adds items directly to `localStorage.cart`.
  - On the product detail page, [frontend/js/product.js](frontend/js/product.js) also adds items directly to `localStorage.cart`.
- Where cart data is stored:
  - Browser `localStorage` key: `cart`
  - Format: product ID to quantity map
- Quantity updates:
  - [frontend/js/cart.js](frontend/js/cart.js) renders `+` and `-` controls.
  - Quantity changes update the `cart` object in `localStorage` and dispatch `cart:updated`.
- Remove item flow:
  - The cart page deletes the product ID from the `cart` object.
  - The updated cart is saved back to `localStorage`.
- Checkout flow:
  - [frontend/js/checkout.js](frontend/js/checkout.js) reads `localStorage.cart`, shows a summary, and stores `checkoutDraft`.
  - It does not call the backend order API yet.
- Important architectural note:
  - The backend has a full cart model and cart API, but the frontend currently does not use it.

## 11. Local Storage Usage

| Key | Purpose |
|---|---|
| `token` | Stores the JWT used for authenticated backend requests |
| `currentUser` | Stores a cached user summary for UI state and profile fallback |
| `cart` | Stores the cart as a product ID to quantity map |
| `checkoutDraft` | Stores shipping data and a cart snapshot from checkout form submission |

## 12. Event System

| Event | Dispatched from | Consumed by |
|---|---|---|
| `site:search` | [frontend/js/components/header.js](frontend/js/components/header.js) | No current consumer |
| `cart:updated` | [frontend/js/products.js](frontend/js/products.js), [frontend/js/product.js](frontend/js/product.js), [frontend/js/cart.js](frontend/js/cart.js), and `clearAuth` indirectly updates UI after auth changes | [frontend/js/components/header.js](frontend/js/components/header.js) and the cart page rerender flow |
| `auth:updated` | [frontend/js/auth.js](frontend/js/auth.js) after login/register/logout | [frontend/js/components/header.js](frontend/js/components/header.js) |
| `storage` (native browser event) | Browser storage changes in another tab | [frontend/js/components/header.js](frontend/js/components/header.js) |

## 13. Current Issues & Bugs

- Broken feature: Search input emits `site:search` but nothing listens, so search does not filter products.
- Broken feature: Frontend checkout stops at a local draft; it never calls `POST /api/orders`.
- Broken feature: Frontend cart is entirely localStorage-based and does not use the backend cart API.
- Broken feature: Product detail add-to-cart does not enforce stock on the client side.
- UI issue: Several pages still rely on inline styles in the HTML, which reduces maintainability.
- UI issue: External Unsplash images are hotlinked and may fail in restricted environments.
- Backend issue: The root `.env` file uses `MONGODB_URI`, but the server expects `MONGO_URI`.
- Backend issue: Starting the app from the repository root with the root `.env` is likely to fail unless the variable name is fixed.
- Backend issue: `backend/legacy/` contains duplicated older implementations and creates maintenance confusion.
- Backend issue: [backend/middleware/adminMiddleware.js](backend/middleware/adminMiddleware.js) duplicates the `admin` logic already present in `authMiddleware.js`.
- Backend issue: Validation is minimal; request bodies are not strongly validated before writes.
- Security issue: JWTs are stored in `localStorage`, which is vulnerable to XSS exposure.
- Security issue: Rendering with `innerHTML` in cart/product flows increases the XSS attack surface.
- Security issue: CORS is open and there is no CSRF strategy because auth is token-in-localStorage based.
- Security issue: `multer` is installed, but upload handling is not implemented, so the uploads pipeline is incomplete.

## 14. Code Quality Review

| Area | Score / 10 | Notes |
|---|---|---|
| Folder structure | 7 | Clear separation between frontend, backend, controllers, models, middleware, and scripts, but legacy duplication lowers clarity |
| Frontend architecture | 6 | Clean page/component split for a vanilla app, but state management and search/order flows are incomplete |
| Backend architecture | 7 | Reasonable Express/Mongoose layering with controllers and middleware, but validation and consistency need work |
| Maintainability | 6 | Common logic is partly shared, but some inline styles, duplicated middleware, and unused backend routes reduce maintainability |
| Scalability | 6 | Adequate for a small storefront, but not yet ready for large catalog/search/order workloads |

## 15. Missing Features

Compared with a production-ready e-commerce application, the project is missing:

- Full search and filtering UI
- Pagination or infinite scrolling for product lists
- Sort controls by price, rating, or newest
- Backend-powered cart syncing in the frontend
- Actual order submission from checkout to backend
- Payment gateway integration
- Order history and order detail pages
- Address book and shipping management
- Admin dashboard/UI for product and order management
- File upload flow for product images
- Password reset / forgot password flow
- Profile editing flow
- Wishlist/favorites
- Product reviews and ratings UI
- Better client-side validation and error messaging
- Loading skeletons/spinners for async views
- Stronger security hardening for auth and form rendering

## 16. Complete User Journey

1. Visitor opens [frontend/index.html](frontend/index.html).
2. Visitor browses the product grid.
3. Visitor clicks a product to open [frontend/product.html](frontend/product.html).
4. Visitor registers on [frontend/register.html](frontend/register.html) or logs in on [frontend/login.html](frontend/login.html).
5. JWT and user summary are stored in `localStorage`.
6. Visitor adds products to the cart from the listing page or product detail page.
7. Cart contents are reviewed on [frontend/cart.html](frontend/cart.html).
8. User changes quantities or removes items.
9. User proceeds to [frontend/checkout.html](frontend/checkout.html).
10. The checkout page currently stores a local draft rather than placing a backend order.
11. User can view [frontend/profile.html](frontend/profile.html) after authentication.
12. User logs out, which clears auth state and returns to login.

## 17. Project Completion Status

| Area | Completion % | Reasoning |
|---|---:|---|
| Frontend | 72% | Main pages exist and core browsing/cart/auth flows work, but search, checkout submission, and backend cart integration are incomplete |
| Backend | 82% | REST APIs, auth, cart, orders, models, and seed script are implemented, but validation, upload flow, and cleanup need work |
| Database | 78% | Core collections and relationships are present, but there is no migration strategy, no seeding automation beyond products, and limited validation |
| Overall project | 76% | The store is functional as a prototype, but several production-level flows are still missing |

## 18. Interview & Evaluation Readiness

### Internship

- Strengths:
  - Shows full-stack understanding across frontend, backend, auth, database, and API design
  - Demonstrates practical use of JWT, Mongoose, protected routes, and local state synchronization
  - Has a usable storefront with real product browsing and cart behavior
- Weaknesses:
  - Search, checkout submission, and admin UI are incomplete
  - Some logic is duplicated or still in legacy folders
  - Security and validation are basic
- Expected evaluator questions:
  - Why is the frontend using localStorage for the cart instead of the backend cart API?
  - How would you secure the JWT flow in a production app?
  - Why does checkout stop at a local draft?
  - How would you implement search and filtering?

### Final year project

- Strengths:
  - End-to-end data model and API structure are already in place
  - Clear separation of concerns in backend code
  - Good foundation for extending into admin, payments, and order management
- Weaknesses:
  - Missing production workflows such as payment, order history, and admin dashboard
  - Limited UX polish around async states and validation
- Expected evaluator questions:
  - How are product stock levels protected against overselling?
  - Why is there both a frontend cart model and a backend cart API?
  - How would you handle order status changes and email notifications?

### Portfolio project

- Strengths:
  - Easy to demo and understand quickly
  - Good-looking shared header/footer and responsive layout
  - Clear technical surface for discussion
- Weaknesses:
  - Not yet polished enough to feel production-grade
  - Several features are placeholders or partially wired
- Expected evaluator questions:
  - Which pieces are real production logic and which are demo scaffolding?
  - What would you prioritize to make this portfolio-ready?

## 19. Final Verdict

- What is implemented:
  - Static storefront pages
  - Product catalog and detail views
  - Registration, login, profile, and logout
  - Local cart management in the browser
  - Backend auth, product, cart, and order APIs
  - MongoDB schemas and product seeding
- What is partially implemented:
  - Search UI exists but has no filtering logic
  - Checkout exists but only saves a local draft
  - Backend cart/order APIs exist but are not wired into the frontend
- What is missing:
  - Payment processing
  - Backend-driven checkout submission
  - Full search/filter/sort experience
  - Admin dashboard
  - Order history and post-purchase workflow
  - Strong validation and security hardening
- What should be done next:
  1. Wire checkout to `POST /api/orders` and use backend cart/order data end to end.
  2. Implement real product search/filtering on the storefront.
  3. Fix the root environment variable mismatch so the root start script works consistently.
  4. Remove or archive the `legacy/` folder after verifying nothing depends on it.
  5. Add validation, loading states, and safer rendering for user-facing data.# Project Analysis: Ecommerce Store

## 1. Project Overview

**Project name:** Ecommerce Store

**Project type:** Full-stack ecommerce web application

**Main purpose:**
Provide a lightweight online store experience with a product catalog, product detail pages, authentication, cart management, checkout, and a backend API for products, users, carts, and orders.

**Target users:**
- Shoppers browsing and buying products
- Registered users managing profile and cart state
- Admin users managing catalog/orders through the backend API
- Developers extending or integrating the app

**Core features:**
- Product catalog and product detail pages
- User registration and login with JWT authentication
- Profile loading from the backend
- Cart add/update/remove flows
- Checkout form and order draft capture
- Backend product, cart, and order APIs
- MongoDB-backed persistence
- Product seed script for demo data

---

## 2. Technology Stack

### Frontend
- **Framework/library used:** None. The frontend is built with vanilla HTML, CSS, and ES modules.
- **CSS solution:** Plain CSS files per concern and per page/component.
- **State management:** No framework state manager. State is split between DOM state, `localStorage`, and custom browser events.
- **Routing:** File-based static page navigation using HTML links and query parameters such as `/product.html?id=<id>`.

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Authentication:** JWT bearer tokens with password hashing via `bcryptjs`

### Database
- **Database type:** MongoDB
- **ODM/ORM:** Mongoose

### Other packages and libraries used
- `dotenv` for environment variables
- `cors` for cross-origin requests
- `helmet` for HTTP security headers
- `express-rate-limit` for request throttling
- `express-async-handler` for async controller error handling
- `multer` is installed, but file upload routes are not implemented yet
- `nodemon` in backend dev dependencies

---

## 3. Complete Folder Structure

```text
.
├── .env
├── .gitignore
├── package.json
├── CHAT.md
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── productController.js
│   ├── legacy/
│   │   ├── authController.js
│   │   ├── authMiddleware.js
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── db.js
│   │   ├── jwt.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   ├── User.js
│   │   └── userRoutes.js
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   ├── scripts/
│   │   └── seedProducts.js
│   └── utils/
│       ├── generateToken.js
│       └── validators.js
└── frontend/
    ├── index.html
    ├── product.html
    ├── cart.html
    ├── checkout.html
    ├── login.html
    ├── register.html
    ├── profile.html
    ├── css/
    │   ├── auth.css
    │   ├── cart.css
    │   ├── checkout.css
    │   ├── footer.css
    │   ├── navbar.css
    │   ├── products.css
    │   └── style.css
    └── js/
        ├── api.js
        ├── auth.js
        ├── cart.js
        ├── checkout.js
        ├── login.js
        ├── product.js
        ├── products.js
        ├── profile.js
        ├── register.js
        └── components/
            ├── header.js
            └── footer.js
```

---

## 4. Frontend Architecture

### Entry point
The frontend is static and page-driven. Each HTML file loads a page-specific ES module and shared UI components.

- Home page: `frontend/index.html`
- Shared header: `frontend/js/components/header.js`
- Shared footer: `frontend/js/components/footer.js`

### Page structure
- Every page includes a header mount point: `#site-header`
- Every page includes a footer mount point: `#site-footer`
- Shared styling is layered with `style.css`, `navbar.css`, and `footer.css`
- Page-specific CSS is loaded per page

### Component structure
- `header.js` mounts a sticky navigation bar, search input, cart badge, and auth-aware links
- `footer.js` mounts a multi-column footer with static informational content
- Both components auto-mount when imported and guard against double mounting via `dataset` flags

### Shared utilities
- `js/api.js` wraps backend product fetch calls
- `js/auth.js` handles token storage, login, register, profile lookup, logout, route guards, and auth UI hydration

### CSS structure
- `style.css`: global layout, buttons, product cards, hero, grid, base typography
- `navbar.css`: sticky header and search/navigation layout
- `footer.css`: dark footer layout and responsive columns
- `auth.css`: login/register/profile shell styles
- `cart.css`: cart page layout and item rows
- `checkout.css`: checkout grid and form controls
- `products.css`: product listing styles

### Navigation flow
- Users move between static pages using anchors
- Product detail uses query strings: `/product.html?id=<productId>`
- Auth pages redirect away if already logged in
- `login.html` supports a `next` query parameter for post-login redirects
- Header links update based on auth state and cart state

### Page-by-page analysis

#### `index.html`
- **Purpose:** Product catalog homepage
- **Main functionality:** Loads featured products and renders product cards
- **Imported files:** `js/products.js`
- **User flow:** Visit home -> browse products -> click product card -> open product detail -> add item to cart

#### `product.html`
- **Purpose:** Single product detail page
- **Main functionality:** Loads a product by ID, renders details, and lets the user add it to the cart
- **Imported files:** `js/product.js`
- **User flow:** Open product from catalog -> review details -> add to cart -> continue browsing or go to cart

#### `cart.html`
- **Purpose:** Cart management page
- **Main functionality:** Reads cart data, fetches product details, shows quantities and totals, allows increment/decrement/remove
- **Imported files:** `js/cart.js`
- **User flow:** Open cart -> adjust items -> review total -> proceed to checkout

#### `checkout.html`
- **Purpose:** Checkout draft page
- **Main functionality:** Requires login, shows summary of cart items, collects shipping info, saves a local draft
- **Imported files:** `js/checkout.js`
- **User flow:** Require auth -> review order summary -> enter shipping info -> save draft locally

#### `login.html`
- **Purpose:** User sign-in page
- **Main functionality:** Posts credentials to backend and stores JWT/user profile locally
- **Imported files:** `js/login.js`
- **User flow:** Enter credentials -> receive token -> redirect to home or the `next` page

#### `register.html`
- **Purpose:** New account creation page
- **Main functionality:** Creates a user via backend API and stores JWT/user profile locally
- **Imported files:** `js/register.js`
- **User flow:** Fill registration form -> account created -> redirect to home

#### `profile.html`
- **Purpose:** Logged-in user profile page
- **Main functionality:** Requires auth, fetches the backend profile, and falls back to cached user data if needed
- **Imported files:** `js/profile.js`
- **User flow:** Open profile -> view name/email/role -> continue to checkout or logout through header

### Search behavior in the frontend
- The header search input dispatches a custom `site:search` event
- No page currently listens for that event
- No filtering logic is wired into `products.js` or the product grid
- Search is therefore present in the UI but not functionally implemented

### Cart behavior in the frontend
- Cart is stored in `localStorage` under the `cart` key
- Cart data is a map of `productId -> quantity`
- `products.js` and `product.js` add products directly to local cart state
- `cart.js` reads local cart state, fetches product details, and renders editable lines
- `checkout.js` reads the same local cart and saves a `checkoutDraft` object locally
- The frontend does not call the backend cart API

---

## 5. Backend Architecture

### Server startup flow
1. `server.js` loads environment variables with `dotenv`
2. It connects to MongoDB through `config/db.js`
3. Express middleware is attached:
   - `helmet()`
   - `express.json()`
   - `cors()`
   - `express-rate-limit`
4. Route groups are mounted:
   - `/api/auth`
   - `/api/products`
   - `/api/cart`
   - `/api/orders`
5. Static files under `/uploads` are exposed if the folder exists
6. 404 and error handlers are mounted
7. Server listens on `PORT` or `5000`

### Route registration
- `authRoutes.js` handles registration, login, and profile
- `productRoutes.js` handles catalog CRUD
- `cartRoutes.js` handles authenticated cart operations
- `orderRoutes.js` handles checkout/order operations

### Middleware flow
- Global middleware runs first (`helmet`, JSON parser, CORS, rate limiting)
- Route middleware such as `protect` and `admin` enforce auth/role checks
- `notFound` handles unknown routes
- `errorHandler` formats errors into JSON responses

### Controller flow
- Controllers use `express-async-handler`
- `authController.js` creates users, authenticates users, and fetches profiles
- `productController.js` manages product CRUD and listing
- `cartController.js` manages cart persistence in MongoDB
- `orderController.js` creates orders from a cart, updates inventory, and clears the cart

### Database connection flow
- `config/db.js` reads `process.env.MONGO_URI`
- `mongoose.connect()` establishes the database connection
- On failure, the process exits with status 1

---

## 6. API Documentation

### Auth API

#### `POST /api/auth/register`
- **Purpose:** Register a new user
- **Request body:** `{ name, email, password }`
- **Response body:** `{ _id, name, email, role, token }`
- **Authentication required:** No

#### `POST /api/auth/login`
- **Purpose:** Authenticate a user and issue a JWT
- **Request body:** `{ email, password }`
- **Response body:** `{ _id, name, email, role, token }`
- **Authentication required:** No

#### `GET /api/auth/profile`
- **Purpose:** Return the logged-in user profile
- **Request body:** None
- **Response body:** User document without password fields
- **Authentication required:** Yes

### Product API

#### `GET /api/products`
- **Purpose:** Return all products
- **Request body:** None
- **Response body:** Array of product documents
- **Authentication required:** No

#### `GET /api/products/:id`
- **Purpose:** Return a single product by ID
- **Request body:** None
- **Response body:** Product document
- **Authentication required:** No

#### `POST /api/products`
- **Purpose:** Create a new product
- **Request body:** `{ title, description, price, category, stock, image }`
- **Response body:** Created product document
- **Authentication required:** Yes, admin only

#### `PUT /api/products/:id`
- **Purpose:** Update an existing product
- **Request body:** Partial or full product fields
- **Response body:** Updated product document
- **Authentication required:** Yes, admin only

#### `DELETE /api/products/:id`
- **Purpose:** Delete a product
- **Request body:** None
- **Response body:** `{ message: 'Product removed' }`
- **Authentication required:** Yes, admin only

### Cart API

#### `POST /api/cart/add`
- **Purpose:** Add a product to the authenticated user cart
- **Request body:** `{ productId, quantity }`
- **Response body:** Cart document
- **Authentication required:** Yes

#### `GET /api/cart`
- **Purpose:** Return the authenticated user cart
- **Request body:** None
- **Response body:** Cart document or `{ items: [] }`
- **Authentication required:** Yes

#### `PUT /api/cart/update`
- **Purpose:** Update an item quantity in the authenticated user cart
- **Request body:** `{ productId, quantity }`
- **Response body:** Updated cart document
- **Authentication required:** Yes

#### `DELETE /api/cart/remove`
- **Purpose:** Remove a product from the authenticated user cart
- **Request body:** `{ productId }`
- **Response body:** Updated cart document
- **Authentication required:** Yes

### Order API

#### `POST /api/orders`
- **Purpose:** Place an order from the authenticated user cart
- **Request body:** `{ shippingAddress }`
- **Response body:** Created order document
- **Authentication required:** Yes

#### `GET /api/orders/myorders`
- **Purpose:** Return orders belonging to the authenticated user
- **Request body:** None
- **Response body:** Array of order documents
- **Authentication required:** Yes

#### `GET /api/orders`
- **Purpose:** Return all orders
- **Request body:** None
- **Response body:** Array of populated order documents
- **Authentication required:** Yes, admin only

#### `PUT /api/orders/:id`
- **Purpose:** Update an order status
- **Request body:** `{ status }`
- **Response body:** Updated order document
- **Authentication required:** Yes, admin only

---

## 7. Authentication Flow

### Registration flow
1. User opens `register.html`
2. `register.js` imports shared header/footer and auth helpers
3. `auth.js` checks whether the user is already signed in
4. The form submits `name`, `email`, and `password` to `POST /api/auth/register`
5. The backend creates the user, hashes the password in the `User` model pre-save hook, and returns a JWT
6. The frontend stores `token` and `currentUser` in `localStorage`
7. The `auth:updated` event is dispatched and the user is redirected to the homepage

### Login flow
1. User opens `login.html`
2. `login.js` posts `email` and `password` to `POST /api/auth/login`
3. Backend verifies the password with `bcrypt.compare()` and returns a JWT
4. The frontend stores `token` and `currentUser` in `localStorage`
5. The `auth:updated` event is dispatched
6. User is redirected either to the `next` page or to `/index.html`

### Token storage
- JWT is stored in browser `localStorage` under `token`
- Cached user profile is stored under `currentUser`
- No refresh token mechanism exists

### Authorization checks
- Frontend page guards are implemented with `requireAuth()` and `redirectIfAuthenticated()`
- Backend authorization is enforced by the `protect` middleware
- Admin-only endpoints additionally check `req.user.role === 'admin'`

### Logout flow
1. User clicks the logout button in the header
2. `logout()` removes `token` and `currentUser`
3. `auth:updated` is dispatched
4. User is redirected to `/login.html`

Note: logout does not clear `cart` or `checkoutDraft`

---

## 8. Database Design

### `User`
**Schema:** `backend/models/User.js`

**Fields:**
- `name`
- `email` (unique)
- `password` (hashed)
- `role` (`user` or `admin`)
- `address`
- timestamps

**Relationships:**
- Referenced by `Cart.user`
- Referenced by `Order.user`

### `Product`
**Schema:** `backend/models/Product.js`

**Fields:**
- `title`
- `description`
- `category`
- `image`
- `price`
- `stock`
- `ratings`
- timestamps

**Relationships:**
- Referenced by `Cart.items.product`
- Referenced by `Order.orderItems.product`

### `Cart`
**Schema:** `backend/models/Cart.js`

**Fields:**
- `user` (unique reference to `User`)
- `items[]`
  - `product` reference
  - `quantity`
- timestamps

**Relationships:**
- One cart per user
- Many cart items per cart

### `Order`
**Schema:** `backend/models/Order.js`

**Fields:**
- `user` reference
- `orderItems[]`
  - `product` reference
  - `name`
  - `qty`
  - `price`
- `shippingAddress`
  - `address`
  - `city`
  - `postalCode`
  - `country`
- `totalPrice`
- `orderStatus`
- `paymentStatus`
- timestamps

**Relationships:**
- Many orders per user
- Each order stores product snapshots so historical names/prices remain stable

---

## 9. Search Feature Analysis

### How search currently works
- The header search field captures input and dispatches a custom `site:search` event
- The event payload contains `{ value: <trimmed search string> }`

### Which file emits search events
- `frontend/js/components/header.js`

### Which file listens for search events
- No file in the current codebase listens for `site:search`

### Whether search is fully implemented
- No. Search is only wired at the event-emission level.

### Missing pieces
- A listener that filters the product grid or product list
- Search state synchronization with the catalog page
- Debounce or query handling
- Empty-result state for no matches

---

## 10. Cart System Analysis

### How products are added
- On the homepage: `products.js` adds items to `localStorage['cart']`
- On the product page: `product.js` adds items to the same key
- The cart is a map of product IDs to quantities

### Where cart data is stored
- Frontend browser `localStorage`, key: `cart`
- Backend also has a `Cart` collection, but the frontend does not use it

### Quantity updates
- `cart.js` provides increase/decrease buttons
- Quantities are updated locally and persisted back into `localStorage`
- `cart:updated` is dispatched after every change

### Remove item flow
- `cart.js` deletes the product ID from the cart object
- The cart is written back to `localStorage`
- The page rerenders immediately

### Checkout flow
- `checkout.js` reads the local cart
- The form saves shipping data and cart contents into `localStorage['checkoutDraft']`
- The backend order creation API is not called from the UI

Important note: the backend has a real cart/order system, but the current frontend is still using a local-storage cart draft model instead of the backend cart collection.

---

## 11. Local Storage Usage

### `token`
- Stores the JWT returned by login/register
- Used by `authHeaders()` for authenticated backend requests

### `currentUser`
- Stores a cached user object with `_id`, `name`, `email`, and `role`
- Used to hydrate header/profile UI without extra fetches

### `cart`
- Stores product quantity data as JSON
- Used by product, cart, and checkout pages

### `checkoutDraft`
- Stores the locally created checkout draft with shipping info and cart snapshot
- Used by `checkout.js` only

---

## 12. Event System

### Custom events

#### `site:search`
- **Dispatched by:** `frontend/js/components/header.js`
- **Consumed by:** none currently
- **Purpose:** Intended to broadcast search input changes

#### `cart:updated`
- **Dispatched by:** `frontend/js/products.js`, `frontend/js/product.js`, `frontend/js/cart.js`
- **Consumed by:** `frontend/js/components/header.js`
- **Purpose:** Refresh cart badge count and related header state

#### `auth:updated`
- **Dispatched by:** `frontend/js/auth.js`
- **Consumed by:** `frontend/js/components/header.js`
- **Purpose:** Refresh auth-aware navigation links and user display state

### Native event usage
#### `storage`
- **Dispatched by:** Browser when localStorage changes in another tab
- **Consumed by:** `frontend/js/components/header.js`
- **Purpose:** Keep header state in sync across tabs

---

## 13. Current Issues & Bugs

### Broken or incomplete features
- Search is not implemented beyond event emission
- Checkout does not place orders through the backend API
- Frontend cart is disconnected from backend cart/order persistence
- No payment integration exists
- No admin UI exists even though admin backend endpoints exist

### UI issues
- Social footer links are placeholders (`#`)
- No loading states or skeletons for async pages
- No dedicated empty states beyond basic text
- Product image URLs depend on external hosts and can fail under browser restrictions or network policy

### Backend issues
- No request-body validation middleware is enforced
- `validators.js` exists but is not used
- `multer` is installed but upload flows are not implemented
- `adminMiddleware.js` duplicates the `admin` logic already in `authMiddleware.js`
- `legacy/` contains old duplicated code and adds maintenance noise
- No pagination or filtering for large product/order datasets
- Cart/order workflows are not transactionally protected against concurrent inventory updates

### Security issues
- JWT stored in `localStorage`, which is vulnerable to XSS theft
- `cors()` is open without a visible origin allowlist
- No refresh-token flow
- No CSRF strategy is needed for header-based JWT auth, but the app still lacks broader browser hardening
- No rate limiting by route class, only a global limit

---

## 14. Code Quality Review

### Scores out of 10
- **Folder structure:** 7/10
- **Frontend architecture:** 6/10
- **Backend architecture:** 8/10
- **Maintainability:** 6/10
- **Scalability:** 6/10

### Why these scores
- The backend has a clean Express/Mongoose split and a reasonable route/controller/model layout
- The frontend is straightforward and readable, but many behaviors are duplicated between pages
- The app mixes localStorage state with server-side cart/order models, which makes behavior inconsistent
- Validation, pagination, and reusable data utilities are limited
- The legacy directory and duplicate middleware reduce clarity

---

## 15. Missing Features

### Missing compared to a production-ready ecommerce app
- Real backend-powered cart synchronization from the UI
- Actual order submission from checkout
- Payment gateway integration
- Order history page and order detail page
- Product search/filter/sort UI
- Category browsing and price filtering
- Pagination or infinite scrolling
- User address management
- Password reset and email verification
- Admin dashboard for products/orders/users
- Product reviews and ratings UI
- Inventory-aware add-to-cart warnings in the UI
- Loading/error-state components reused across pages
- Better form validation and feedback
- Image upload workflow for product administration

### Suggested improvements
- Replace localStorage cart with backend cart synchronization, or clearly formalize the app as a client-side cart prototype
- Connect checkout to `POST /api/orders`
- Implement a real search/filter pipeline
- Add reusable API helpers for products, cart, and orders
- Add schema validation on the backend with a library such as `joi` or `zod`
- Remove or archive the `legacy/` folder
- Consolidate duplicate middleware and duplicate add-to-cart logic
- Add unit/integration tests for controllers and auth helpers

---

## 16. Complete User Journey

### Visitor → Register
1. Visitor opens the home page
2. They click Register
3. They fill the registration form
4. Backend creates the account and returns a token
5. Frontend stores auth data and returns to the homepage

### Visitor → Login
1. Visitor or returning user opens Login
2. They submit email and password
3. Backend verifies credentials and returns a token
4. Frontend stores token/currentUser and redirects

### Browse Products
1. User loads the home page
2. `products.js` fetches products from the backend
3. Product cards are rendered in a grid
4. User opens product details or adds directly to cart

### Search
1. User types in the header search box
2. `site:search` event is emitted
3. No filter currently consumes it
4. Search input does not change product rendering yet

### Add To Cart
1. User clicks Add to cart on home or product page
2. Product ID and quantity are written to `localStorage['cart']`
3. `cart:updated` is dispatched
4. Header badge updates

### Checkout
1. User opens cart and proceeds to checkout
2. `checkout.js` requires authentication
3. Shipping form is filled in
4. Draft order data is saved locally under `checkoutDraft`
5. No backend order request is sent from the frontend

### Profile
1. User opens profile
2. `profile.js` requires auth
3. Backend profile API is called
4. Current user info is displayed

### Logout
1. User clicks Logout in the header
2. Token and currentUser are removed from localStorage
3. `auth:updated` is dispatched
4. User is redirected to login

---

## 17. Project Completion Status

### Frontend Completion: 70%
Reasoning:
- Home, product, cart, auth, profile, footer, and responsive layout exist
- Product loading and cart interaction work
- Search, checkout submission, and backend cart integration are incomplete

### Backend Completion: 80%
Reasoning:
- Auth, products, cart, and orders APIs are present
- JWT auth and role-based checks are implemented
- Validation, admin tooling, uploads, and payment integration are incomplete

### Database Completion: 75%
Reasoning:
- Core collections are modeled well
- Relations are in place
- The frontend does not fully exploit the cart/order schemas yet
- No migration or seed management beyond product seeding

### Overall Project Completion: 72%
Reasoning:
- The core ecommerce skeleton is functioning
- The application is usable for browsing, authentication, and cart drafting
- It is not yet a production-ready ecommerce system because order checkout, payment, search, admin UX, and data validation are incomplete

---

## 18. Interview & Evaluation Readiness

### If submitted for an internship
**Strengths:**
- Clear full-stack separation
- Clean Express/Mongoose backend structure
- JWT auth and password hashing implemented correctly
- Multiple front-end pages with reusable header/footer components

**Weaknesses:**
- Search and checkout are not fully wired
- Cart is client-side instead of backend-synchronized
- Limited validation and testing

**Expected evaluator questions:**
- Why did you use localStorage for cart state?
- Why is search only dispatching an event?
- Why does checkout not create an order?
- How would you secure JWT storage in a production app?

### If submitted for a final year project
**Strengths:**
- Demonstrates a full ecommerce domain model
- Shows auth, product, cart, and order design
- Includes backend role-based authorization and seed scripts

**Weaknesses:**
- Missing payment gateway and order lifecycle UX
- Missing admin dashboard and analytics
- Some backend capabilities are not surfaced in the UI

**Expected evaluator questions:**
- How do cart and orders relate in MongoDB?
- How would you prevent overselling stock?
- How would you implement search and filtering?
- Why are there legacy files in the backend?

### If submitted as a portfolio project
**Strengths:**
- Easy to understand and demo
- Good visual structure and reusable frontend components
- Functional product catalog and auth flow

**Weaknesses:**
- Not production-complete
- Checkout and search are incomplete
- UX polish and resiliency can be improved

**Expected evaluator questions:**
- Can the frontend place an actual order?
- How is auth state shared between pages?
- What happens if MongoDB is offline?
- How are products seeded?

---

## 19. Final Verdict

### What is implemented
- Product catalog and product detail pages
- Login, register, profile, and JWT-based backend authentication
- Local cart behavior in the frontend
- MongoDB-backed product, user, cart, and order models
- Backend APIs for auth, products, cart, and orders
- Header/footer reusable page components
- Product seeding script

### What is partially implemented
- Search UI exists, but filtering logic does not
- Checkout UI exists, but no backend order submission happens from the frontend
- Backend cart/order systems exist, but the frontend still uses localStorage cart state
- Admin APIs exist, but there is no frontend admin panel

### What is missing
- Payment gateway
- Full search/filter/sort experience
- Real order placement from the frontend
- Backend-backed frontend cart sync
- Admin UI
- Validation and better error handling
- Tests and pagination

### What should be done next
1. Connect checkout to `POST /api/orders`
2. Decide whether cart state should live in localStorage or in the backend, then unify the implementation
3. Implement search/filter behavior in the catalog page
4. Add input validation and better loading/error states
5. Build an admin dashboard or remove the unused admin endpoints until needed

---

## Quick Reference

### Main frontend files
- `frontend/index.html`
- `frontend/product.html`
- `frontend/cart.html`
- `frontend/checkout.html`
- `frontend/login.html`
- `frontend/register.html`
- `frontend/profile.html`
- `frontend/js/api.js`
- `frontend/js/auth.js`
- `frontend/js/components/header.js`
- `frontend/js/components/footer.js`

### Main backend files
- `backend/server.js`
- `backend/config/db.js`
- `backend/routes/*.js`
- `backend/controllers/*.js`
- `backend/models/*.js`
- `backend/middleware/*.js`
- `backend/utils/*.js`
- `backend/scripts/seedProducts.js`
