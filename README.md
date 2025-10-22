# 🔐 Next.js 15 Authentication System
Aplikasi web authentication lengkap dengan Next.js 15, TypeScript, MySQL, dan JWT token authentication.
Tampilkan Gambar
Tampilkan Gambar
Tampilkan Gambar
Tampilkan Gambar

## ✨ Features

✅ Secure Authentication - JWT token dengan HttpOnly cookies

✅ Password Hashing - Bcrypt dengan 10 rounds

✅ Rate Limiting - Maksimal 5 percobaan login per menit per IP

✅ Protected Routes - Middleware-based route protection

✅ Dark Mode - Toggle dark/light theme dengan persistent storage

✅ Responsive Design - Mobile-first design dengan TailwindCSS

✅ Form Validation - Client-side dan server-side validation

✅ Loading States - Smooth animations dan loading indicators

✅ MySQL Database - Relational database dengan connection pooling

✅ TypeScript - Full type safety


## 🛠️ Tech Stack
### Frontend

Next.js 15 - React framework dengan App Router

TypeScript - Type-safe JavaScript

TailwindCSS - Utility-first CSS framework

Lucide React - Modern icon library

### Backend

Next.js API Routes - Serverless API endpoints

MySQL 2 - MySQL database driver dengan Promise support

jsonwebtoken - JWT token generation untuk API routes

jose - JWT verification untuk Edge Runtime (middleware)

bcryptjs - Password hashing

## 🚀 Cara Menjalankan Project
### Prerequisites

Node.js 18+ dan npm

MySQL 8.0+

Git

#### 1. Clone atau Download Project
Clone dengan Git
```bash
git clone https://github.com/aldosuryak/auth-app.git
cd nextjs-auth-app
```
Atau download ZIP dan extract


#### 2. Install Dependencies
```bash
npm install
```

#### 3. Setup MySQL Database
Login ke MySQL
```sql
mysql -u root -p
```
Buat database
```sql
CREATE DATABASE auth_app;
```
Import schema
```bash
mysql -u root -p auth_app < database/schema.sql
```

## 🔧 Configuration
### Environment Variables

DATABASE_HOST=localhost

DATABASE_PORT=3306

DATABASE_USER=root

DATABASE_PASSWORD=

DATABASE_NAME=auth_app

JWT_SECRET=your-jwt-secret-here-minimum-64-characters

NODE_ENV=development

## 📝 Scripts
```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run start        # Start production server
```

## 👨‍💻 Author
Aldo Surya Kusuma

Email: aldosurya19@gmail.com

GitHub: @aldosuryak
