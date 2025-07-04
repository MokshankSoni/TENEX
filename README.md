# 🧩 TENEX

### SaaS Multi-Tenant Project Management Platform

---

## Overview

TENEX is a robust, schema-based **multi-tenant** project management platform supporting role-based access, modular task workflows, milestone tracking, and analytics. It's built with a modern Spring Boot backend and a React (Vite) frontend.

> 🔧 **Note**: Team Member and Client UIs (frontend) are currently under development.

---

## 🚀 Tech Stack

- **Backend:** Java 21, Spring Boot, Spring Security, Spring Data JPA, Hibernate, JWT, PostgreSQL, MinIO
- **Frontend:** React 18, Vite, Chart.js, Axios, React Router, React Toastify
- **Other:** Docker (for MinIO)

## 📦 Key Features

- Multi-tenancy (schema-based, per-tenant data isolation)
- Role-based access: Super Admin, Tenant Admin, Project Manager, Team Member, Client
- User, project, task, and milestone management
- File attachments (MinIO integration)
- Activity logs and analytics
- RESTful API with JWT authentication
- Modular, scalable frontend architecture

## 📁 Project Structure

```
TENEX/
  backend/ (Spring Boot Java)
    src/main/java/com/tenex/...
    src/main/resources/application.properties
    pom.xml
  frontend/ (React + Vite)
    src/
      components/, pages/, layouts/, config/, services/, ...
    package.json
    vite.config.js
```

---

## ⚙️ Backend Setup

### 🔧 Prerequisites

- Java 21+
- Maven
- PostgreSQL
- Docker (for MinIO)

### 🔌 Configuration

Edit `src/main/resources/application.properties`:

```properties
# PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/tenex
spring.datasource.username=your_user
spring.datasource.password=your_password

# MinIO
minio.url=http://localhost:9000
minio.accessKey=minioadmin
minio.secretKey=minioadmin
minio.bucketName=tenex-files

# JWT
tenex.app.jwtSecret=your_jwt_secret
tenex.app.jwtExpirationMs=3600000

```

## 🗃️ Run MinIO Locally

docker run -p 9000:9000 -p 9001:9001 \
 -e MINIO_ROOT_USER=minioadmin \
 -e MINIO_ROOT_PASSWORD=minioadmin \
 minio/minio server /data --console-address ":9001"

## 🌐 Frontend Setup

### 🔧 Prerequisites

- Node.js 18+

2. **Environment Variable:**
   - Create a `.env` file in `frontend/`:
     ```env
     VITE_API_BASE_URL=http://localhost:8080/api
     ```
3. **Install & Run:**
   ```sh
   cd frontend
   npm install
   npm run dev
   ```

## 📜 Scripts

- **Backend:**
  - `mvn spring-boot:run` — Start backend server
  - `mvn test` — Run backend tests
- **Frontend:**
  - `npm run dev` — Start dev server
  - `npm run build` — Build for production
  - `npm run lint` — Lint code
  - `npm run preview` — Preview production build

## 🔐 Environment Variables

### Backend (`src/main/resources/application.properties`)

- `server.port` — Backend port (default: 8080)
- `spring.datasource.url`, `spring.datasource.username`, `spring.datasource.password`
- `minio.url`, `minio.accessKey`, `minio.secretKey`, `minio.bucketName`
- `tenex.app.jwtSecret`, `tenex.app.jwtExpirationMs`

### Frontend (`.env`)

- `VITE_API_BASE_URL` — Base URL for backend API

## 🚧 Work in Progress

The following features are under active development:

- 🛠️ **Team Member UI** (React)
- 🛠️ **Client UI** (React)

These modules will be added soon with proper role-based routing, permissions, and UI components.
