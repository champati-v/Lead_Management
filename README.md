# Smart Leads Dashboard CRM

A modern full-stack Lead Management CRM dashboard built with the MERN stack using TypeScript, featuring authentication, role-based access control, lead management, advanced filtering, pagination, CSV export, and a polished SaaS-style UI.

---

## 🚀 Features

### Authentication & Authorization

* JWT Authentication
* Secure Login & Registration
* Password Hashing with bcrypt
* Protected Routes
* Role-Based Access Control (Admin & Sales)

### Leads Management

* Create Lead
* View Leads
* Update Lead
* Delete Lead
* Lead Detail Sidebar

### Advanced Features

* Search Leads
* Filter by Status
* Filter by Source
* Sort by Latest / Oldest
* Debounced Search
* Pagination
* CSV Export
* Dark Mode Support

### UI/UX

* Responsive Design
* shadcn/ui Components
* Loading States
* Empty States
* Toast Notifications
* Skeleton Loaders

---

# 🛠️ Tech Stack

## Frontend

* React.js
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* Axios
* React Hook Form
* Zod

## Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT Authentication

---

# 📁 Project Structure

## Frontend

```bash
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── services/
│   ├── hooks/
│   ├── routes/
│   ├── context/
│   ├── types/
│   └── lib/
```

## Backend

```bash
backend/
├── src/
│   ├── config/
│   ├── controller/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validations/
│   ├── utils/
│   └── types/
```

---

# ⚙️ Environment Variables

## Backend `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/champati-v/Lead_Management.git
```

---

# Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# 🐳 Docker Setup

```bash
docker compose up --build
```

---

# 🔐 Demo Credentials

## Admin

```txt
Email: admin@gmail.com
Password: 123456
```

## Sales

```txt
Email: sales1@gmail.com
Password: 123456
```

---

# 📊 Core Functionalities

## Authentication

* Register
* Login
* Logout
* Protected Routes

## Leads Dashboard

* Create Leads
* Edit Leads
* Delete Leads
* View Lead Details

## Filters

* Search by Name/Email
* Filter by Status
* Filter by Source
* Sort by Latest/Oldest

## Export

* CSV Export for Admin Users

---

# 🔒 RBAC Rules

## Admin

* Full access
* Delete leads
* Export CSV

## Sales

* Cannot delete leads
* Cannot export CSV

---

# 📱 Responsive Design

The application is fully responsive across:

* Desktop
* Laptop
* Tablet
* Mobile Devices

---

# 👨‍💻 Author

Vibekananda Champati
MERN Stack Intern Assignment for Service Hive.
