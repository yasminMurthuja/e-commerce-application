# 🛒 QuickCart — Full Stack E-Commerce Platform

> Built with **React 18 + Redux Toolkit** (Frontend) and **Spring Boot 3 + MySQL** (Backend)  

---

## 🎬 Live Demo

https://github.com/user-attachments/assets/309e76d9-b654-465f-bb12-1caad35693cf

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup & Run](#-setup--run)
- [API Endpoints](#-api-endpoints)
- [Redux State Management](#-redux-state-management)
- [Razorpay Integration](#-razorpay-integration)

---

## ✨ Features

### Customer Features
| Feature | Details |
|---|---|
| 🔐 JWT Auth | Register/Login with BCrypt + JWT token |
| 🛍️ Product Catalog | Paginated listing, category filter, search, sort |
| 📦 Product Detail | Images, rating, stock status, quantity selector |
| 🛒 Shopping Cart | Add/update/remove items, free shipping threshold |
| 💳 Checkout | Address form + Razorpay payment integration |
| 📋 Order Tracking | Full order history with status badges |

### Admin Features
| Feature | Details |
|---|---|
| 📊 Dashboard | Revenue, orders, products, users stats |
| ➕ Product CRUD | Create / Edit / Soft-delete products |
| 📦 Order Management | View all orders, update status |

---

## 🛠 Tech Stack

### Backend (Spring Boot)
```
Spring Boot 3.2       — REST API framework
Spring Security       — JWT authentication
Spring Data JPA       — ORM with Hibernate
MySQL 8               — Relational database
JJWT 0.12             — JWT token generation/validation
Lombok                — Boilerplate reduction
BCrypt                — Password hashing
```

### Frontend (React)
```
React 18              — UI library
Redux Toolkit         — Global state management
React Router DOM v6   — Client-side routing
Axios                 — HTTP client with interceptors
React Hot Toast       — Toast notifications
Google Fonts (Syne + DM Sans)
```

---

## 📁 Project Structure

```
quickcart/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/quickcart/
│       │   ├── QuickCartApplication.java       ← Entry point
│       │   ├── controller/
│       │   │   ├── AuthController.java         ← POST /auth/register, /login
│       │   │   ├── ProductController.java      ← GET /products/**
│       │   │   ├── CartController.java         ← /cart/**
│       │   │   ├── OrderController.java        ← /orders/**
│       │   │   └── AdminController.java        ← /admin/** (ADMIN only)
│       │   ├── service/                        ← Interfaces
│       │   ├── serviceimpl/                    ← Business logic implementations
│       │   │   ├── AuthServiceImpl.java
│       │   │   ├── ProductServiceImpl.java
│       │   │   ├── CartServiceImpl.java
│       │   │   ├── OrderServiceImpl.java       ← Razorpay logic
│       │   │   └── AdminServiceImpl.java
│       │   ├── model/                          ← JPA Entities
│       │   │   ├── User.java
│       │   │   ├── Product.java
│       │   │   ├── Cart.java / CartItem.java
│       │   │   └── Order.java / OrderItem.java
│       │   ├── repository/                     ← Spring Data JPA repos
│       │   ├── dto/request/                    ← Request DTOs
│       │   ├── dto/response/                   ← Response DTOs
│       │   ├── security/
│       │   │   ├── JwtUtil.java                ← Token generate/validate
│       │   │   ├── JwtAuthFilter.java          ← Request interceptor
│       │   │   └── CustomUserDetailsService.java
│       │   ├── config/
│       │   │   └── SecurityConfig.java         ← CORS + route protection
│       │   └── exception/
│       │       ├── GlobalExceptionHandler.java
│       │       ├── ResourceNotFoundException.java
│       │       └── BusinessException.java
│       └── resources/
│           ├── application.properties
│           └── seed-data.sql                   ← Sample products + users
│
└── frontend/
    ├── package.json
    └── src/
        ├── App.jsx                             ← Routes + Provider
        ├── index.js
        ├── index.css                           ← Design system (CSS vars)
        ├── services/
        │   └── api.js                          ← Axios + all API calls
        ├── store/
        │   ├── index.js                        ← Redux store
        │   └── slices/
        │       ├── authSlice.js                ← User session
        │       ├── cartSlice.js                ← Cart state
        │       ├── productSlice.js             ← Product catalog
        │       └── orderSlice.js               ← Orders + payment
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.jsx + .css
        │   │   └── Footer.jsx + .css
        │   ├── product/
        │   │   └── ProductCard.jsx + .css
        │   └── common/
        │       └── ProtectedRoute.jsx
        └── pages/
            ├── HomePage.jsx + .css
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── AuthPage.css                    ← Shared auth styles
            ├── ProductsPage.jsx + .css
            ├── ProductDetailPage.jsx + .css
            ├── CartPage.jsx + .css
            ├── CheckoutPage.jsx + .css
            ├── OrdersPage.jsx + .css
            └── admin/
                └── AdminDashboard.jsx + .css
```

---

## 🚀 Setup & Run

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8+
- Node.js 18+
- npm or yarn

---

### Step 1 — MySQL Database
```sql
CREATE DATABASE quickcart_db;
```

---

### Step 2 — Backend Configuration
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/quickcart_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Razorpay (get from dashboard.razorpay.com)
razorpay.key.id=YOUR_RAZORPAY_KEY_ID
razorpay.key.secret=YOUR_RAZORPAY_KEY_SECRET
```

---

### Step 3 — Run Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
✅ API starts at: `http://localhost:8080/api`

---

### Step 4 — Seed Database
```bash
# After backend starts (Hibernate creates tables automatically)
mysql -u root -p quickcart_db < src/main/resources/seed-data.sql
```

**Demo Credentials:**
| Role     | Email               | Password |
|----------|---------------------|----------|
| Admin    | admin@quickcart.com | admin123 |
| Customer | user@quickcart.com  | user123  |

---

### Step 5 — Run Frontend
```bash
cd frontend
npm install
npm start
```
✅ App starts at: `http://localhost:3000`

---

## 📡 API Endpoints

### Auth
| Method | URL                  | Auth   | Description        |
|--------|----------------------|--------|--------------------|
| POST   | `/api/auth/register` | Public | Register new user  |
| POST   | `/api/auth/login`    | Public | Login, returns JWT |

### Products (Public)
| Method | URL                                                       | Description |
|--------|-----------------------------------------------------------|----------------|
| GET    | `/api/products?page=0&size=12&sortBy=price&direction=asc` | Paginated list |
| GET    | `/api/products/{id}`                                      | Product detail |
| GET    | `/api/products/categories`                                | All categories |
| GET    | `/api/products/category/{cat}`                            | By category    |
| GET    | `/api/products/search?keyword=phone`                      | Search         |
| GET    | `/api/products/filter?minPrice=100&maxPrice=5000`         | Price filter   |

### Cart (JWT Required)
| Method | URL                                     | Description |
|--------|-----------------------------------------|-------------|
| GET    | `/api/cart`                             | Get cart    |
| POST   | `/api/cart/add`                         | Add item    |
| PUT    | `/api/cart/update/{itemId}?quantity=2`  | Update qty  |
| DELETE | `/api/cart/remove/{itemId}`             | Remove item |
| DELETE | `/api/cart/clear`                       | Clear cart  |

### Orders (JWT Required)
| Method | URL                        | Description           |
|--------|----------------------------|-----------------------|
| POST | `/api/orders/create`         | Create Razorpay order |
| POST | `/api/orders/verify-payment` | Verify & place order  |
| GET  | `/api/orders/my-orders`      | My order history      |
| GET  | `/api/orders/{id}`           | Order detail          |

### Admin (ADMIN role required)
| Method | URL                                            | Description    |
|--------|------------------------------------------------|----------------|
| GET    | `/api/admin/dashboard`                         | Stats          |
| POST   | `/api/admin/products`                          | Create product |
| PUT    | `/api/admin/products/{id}`                     | Update product |
| DELETE | `/api/admin/products/{id}`                     | Delete product |
| GET    | `/api/admin/orders`                            | All orders     |
| PATCH  | `/api/admin/orders/{id}/status?status=SHIPPED` | Update status  |

---

## 🔄 Redux State Management

```
Redux Store
├── auth
│   ├── user          (id, name, email, role)
│   ├── token         (JWT string)
│   └── loading
├── cart
│   ├── cartData      (items, subtotal, shipping, total)
│   └── loading
├── products
│   ├── items[]       (paginated product list)
│   ├── categories[]
│   ├── totalPages
│   └── loading
└── orders
    ├── orders[]      (user order history)
    ├── razorpayOrderData  (for payment modal)
    └── loading
```

---

## 💳 Razorpay Integration

### Payment Flow:
```
1. User clicks "Pay" on Checkout
       ↓
2. POST /orders/create
   → Backend creates Razorpay order
   → Returns: razorpayOrderId, amount, keyId
       ↓
3. Frontend opens Razorpay modal
   (window.Razorpay with order options)
       ↓
4. User completes payment
   → Razorpay calls handler with:
      razorpay_order_id
      razorpay_payment_id
      razorpay_signature
       ↓
5. POST /orders/verify-payment
   → Backend verifies HMAC-SHA256 signature
   → Marks order as PAID + CONFIRMED
   → Clears cart
       ↓
6. User redirected to /orders with success banner
```

### To enable real Razorpay:
1. Sign up at [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Get Key ID and Key Secret
3. Update `application.properties`
4. The SDK is already loaded in `public/index.html`

---

## 📝 Resume Line

> **Designed and implemented a scalable full-stack e-commerce platform** using React 18, Redux Toolkit, Spring Boot 3, and MySQL — featuring JWT-based authentication, cart management, paginated product catalog with search and filtering, Razorpay payment integration with HMAC signature verification, role-based admin dashboard for order and inventory management, and a responsive UI with a custom design system.

---

## 🎯 Why This Stands Out for MNC Interviews

| Aspect | Implementation |
|---|---|
| **Architecture** | Clean 3-tier: Controller → Service Interface → ServiceImpl → Repository |
| **Security** | Spring Security + JWT + BCrypt + Role-based access (`@PreAuthorize`) |
| **Design Patterns** | Repository pattern, DTO pattern, Builder pattern, Service layer pattern |
| **Error Handling** | Global `@RestControllerAdvice` with typed custom exceptions |
| **State Management** | Redux Toolkit with async thunks, selectors, and slice isolation |
| **API Design** | RESTful conventions, consistent `ApiResponse<T>` wrapper |
| **Database** | JPA relationships (OneToMany, ManyToOne, OneToOne), JPQL queries |
| **Payment** | Real Razorpay integration with HMAC-SHA256 signature verification |
| **Code Quality** | Interfaces + Impl separation, Lombok, validation annotations |

---

*quickcart — Built for production, designed for portfolios* 🚀
