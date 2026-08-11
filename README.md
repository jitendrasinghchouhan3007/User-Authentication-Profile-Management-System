# Avata - User Authentication & Profile Management System

A full-stack web application providing secure user registration, login, and profile management — built with **React**, **Node.js**, **Express.js**, **MongoDB**, and **JWT**.

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, React Router v7, Axios, Vite |
| **Backend** | Node.js ≥ 20, Express.js 5 |
| **Database** | MongoDB, Mongoose 8 |
| **Auth** | JSON Web Tokens (JWT), bcryptjs |
| **Dev Tools** | Nodemon, Concurrently, Postman |
| **Testing** | Node.js built-in test runner, Supertest, mongodb-memory-server |

---

## ✨ Features

### Authentication
- `POST /api/auth/register` — Register with name, email, password (and optional bio). Duplicate email prevention, bcrypt password hashing.
- `POST /api/auth/login` — Login with email/password. Returns signed JWT.
- `POST /api/auth/logout` — Logout (client-side token invalidation).

### Profile Management (Protected)
- `GET /api/users/profile` — Fetch authenticated user's profile. Password excluded from response.
- `PUT /api/users/profile` — Update `name` and/or `bio`.
- `PUT /api/users/change-password` — Change password with current password verification.

### Frontend
- JWT-protected routing (`ProtectedRoute`) and guest redirects
- User dashboard with session info & quick actions
- Profile view & edit form with real-time validation feedback
- Change password interface
- Persistent light/dark mode theme toggle

---

## 📁 Folder Structure

```
Profile-Management/
├── backend/                        # Express.js REST API
│   ├── scripts/
│   │   └── seed.js                 # Demo data seeder
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection (with Atlas fallback)
│   │   ├── controllers/
│   │   │   ├── authController.js   # register, login, logout
│   │   │   └── userController.js   # getProfile, updateProfile, changePassword
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT verification (protect middleware)
│   │   │   ├── errorHandler.js     # Centralised error handler
│   │   │   └── validation.js       # Request body validators
│   │   ├── models/
│   │   │   └── User.js             # Mongoose User schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js       # /api/auth/*
│   │   │   └── userRoutes.js       # /api/users/*
│   │   ├── utils/
│   │   │   ├── generateToken.js    # JWT signing helper
│   │   │   ├── httpError.js        # Error factory
│   │   │   └── jwt.js              # JWT verify helper
│   │   ├── app.js                  # Express app setup
│   │   └── server.js               # HTTP server entry point
│   ├── tests/
│   │   └── auth.smoke.test.js      # Smoke tests (in-memory MongoDB)
│   ├── .env.example                # Backend environment variable template
│   ├── package.json
│   └── vercel.json
│
├── frontend/                       # React + Vite SPA
│   ├── public/
│   ├── src/
│   │   ├── api/                    # Axios instances & API calls
│   │   ├── components/             # Shared UI components
│   │   ├── context/                # Auth & Theme React contexts
│   │   ├── hooks/                  # Custom hooks
│   │   ├── pages/                  # Route-level page components
│   │   └── main.jsx                # App entry point
│   ├── .env.example                # Frontend environment variable template
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── database/                       # Schema docs & migrations
│   ├── schema.md                   # MongoDB collection schema documentation
│   └── migrations/
│       ├── 001_create_users_collection.js
│       └── 002_add_bio_role_defaults.js
│
├── postman/                        # Postman testing
│   ├── Profile-Management.postman_collection.json
│   └── Profile-Management.postman_environment.json
│
├── .env.example                    # Root environment variable reference
├── .gitignore
├── package.json                    # Monorepo scripts (dev, seed, install:all)
└── README.md
```

---

## ⚙️ Prerequisites

Before you begin, ensure you have:

- **Node.js** ≥ 20.19.0 — [Download](https://nodejs.org/)
- **MongoDB** — either:
  - [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally on port `27017`, **or**
  - A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud cluster
- **npm** ≥ 10 (bundled with Node.js)
- **Git**

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Profile-Management.git
cd Profile-Management
```

### 2. Configure Environment Variables

**Backend** — copy the template and fill in your values:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/profile_management_system
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_ORIGIN=http://localhost:5173
```

**Frontend** — copy the template:

```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 3. Install Dependencies

Install all packages for the monorepo, backend, and frontend in one command:

```bash
npm run install:all
```

### 4. Seed Demo Data (Optional)

Populate the database with 3 ready-to-use demo accounts:

```bash
npm run seed
```

| Account | Email | Password | Role |
|---------|-------|----------|------|
| Maya Fernandes | maya@example.com | password123 | user |
| Arjun Mehta | arjun@example.com | password123 | user |
| Priya Sharma | priya@example.com | password123 | user |
| Site Admin | admin@example.com | password123 | admin |

### 5. Start the Development Server

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:5000 |

---

## 🌐 API Endpoints

All protected routes require the header: `Authorization: Bearer <token>`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | Register a new account |
| `POST` | `/api/auth/login` | ❌ | Login and receive JWT |
| `POST` | `/api/auth/logout` | ❌ | Logout (client-side token clear) |
| `GET` | `/api/users/profile` | ✅ | Get authenticated user profile |
| `PUT` | `/api/users/profile` | ✅ | Update name and/or bio |
| `PUT` | `/api/users/change-password` | ✅ | Change password |

---

## 📬 Postman Collection

Test all endpoints using the included Postman collection.

1. Open **Postman**
2. Click **Import** → select both files from the `postman/` folder:
   - `Profile-Management.postman_collection.json`
   - `Profile-Management.postman_environment.json`
3. Select **Profile Management - Local** from the environment dropdown (top-right)
4. Run **Auth → Login** — the JWT token is captured automatically via a test script
5. All protected routes will use `{{token}}` automatically

> **Tip:** Run **Auth → Register** or **Auth → Login** before any protected route.

---

## 🗄️ Database

See [`database/schema.md`](./database/schema.md) for full schema documentation.

### Run Migrations

```bash
# Apply migration
node database/migrations/001_create_users_collection.js

# Rollback migration
node database/migrations/001_create_users_collection.js down
```

---

## 🧪 Run Tests

```bash
cd backend
npm test
```

Tests use an in-memory MongoDB instance via `mongodb-memory-server` — no real database required.

---

## 🔐 Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | ❌ | `5000` | Port the API server listens on |
| `NODE_ENV` | ❌ | `development` | App environment (`development` / `production`) |
| `MONGO_URI` | ✅ | — | MongoDB connection string |
| `JWT_SECRET` | ✅ | — | Secret key for signing JWTs (use a long random string) |
| `CLIENT_ORIGIN` | ❌ | `http://localhost:5173` | Allowed CORS origin |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | ❌ | `http://localhost:5000` | Backend API base URL |

---

# *Author*

* Jitendra Singh Chouhan (jitendra, jsinghchouhan971@gmail.com)
  - [LinkedIn](https://www.linkedin.com/in/jitendra-singh-chouhan-309560316/)
