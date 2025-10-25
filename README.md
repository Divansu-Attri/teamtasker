# 🧩 TeamTasker — Project & Task Management App

**TeamTasker** is a lightweight, full-stack project and task management application that helps teams collaborate efficiently.  
Users can create projects, add and assign tasks, comment on them, and view real-time analytics — all in one place.

---

## 🚀 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React (React Router, Context API / Hooks) |
| **Backend** | Node.js + Express |
| **Database** | Postgresql (via Prisma ORM), MongoDB |
| **Auth** | JWT (Access Token) + bcrypt (password hashing) |
| **Visualization** | Charts / Tables on Analytics Dashboard |

---

## 📁 Project Structure

teamtasker/
│
├── teamtasker-frontend/ # React SPA
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── ...
│
├── teamtasker-backend/ # Express + PostgreSQL + MongoDB
│ ├── src/
│ │ ├── controllers/
│ │ ├── routes/
│ │ ├── middleware/
│ │ ├── prisma/
│ │ └── index.js
│ ├── prisma/schema.prisma
│ ├── package.json
│ └── ...
│
└── README.md


---

## ⚙️ Features

### 1. **Authentication**
- User signup/login using email & password  
- Passwords hashed with `bcrypt`  
- JWT-based authentication  
- Protected API routes for authenticated users  

### 2. **Projects & Tasks**
- CRUD operations for projects  
- CRUD for tasks within projects (with status, priority, due date)  
- Task assignment to users  
- Commenting system (per task)  

### 3. **Assignments & Notifications**
- Task assignment triggers a notification  
- Fetch and mark notifications as read  

### 4. **Activity Feed & Analytics**
- Records activity logs: project/task creation, updates, assignments, comments, user login  
- Analytics APIs:
  - Tasks created per day (last 7 days)
  - Top 5 users by tasks completed
  - Counts of tasks by status  

### 5. **Frontend (React SPA)**
- Login / Signup pages  
- Projects list & project detail with tasks  
- Task create/edit and assignment UI  
- Task detail view with comments  
- Notifications panel  
- Analytics dashboard (charts & tables)  

---

## 🧠 Architecture Overview

**Reasoning:**
- **React SPA** for smooth, client-side routing and dynamic updates.
- **Express.js** for lightweight, modular RESTful API design.
- **Prisma ORM** for type-safe PostgreSQL access with migrations and MongoDB for seeding.
- **JWT Auth** keeps authentication stateless.
- **PostgreSQL** ensures strong relational data modeling for users, tasks, projects, and comments.

---

## 🧩 Database Schema (Simplified)

- **users** → id, name, email, password  
- **projects** → id, title, description, ownerId  
- **tasks** → id, projectId, title, description, status, priority, assigneeId, dueDate  
- **comments** → id, taskId, authorId, text, createdAt  
- **notifications** → id, userId, type, payload, isRead  
- **activity_logs** → id, type, actorId, entityId, message, createdAt  

---

## 🧰 Setup & Run Instructions

### 1️⃣ Clone the repository
```bash
git clone "https://github.com/Divansu-Attri/teamtasker.git"
cd teamtasker

2️⃣ Backend Setup
cd teamtasker-backend
npm install

3️⃣ Set up environment variables
PORT=4000
DATABASE_URL="postgresql://postgres:Anjali@1234@localhost:5432/teamtasker?schema=public"
MONGO_URI="mongodb+srv://Attri:Divansu1234@clu-ster.cddjgd6.mongodb.net/teamtasker?retryWrites=true&w=majority&appName=clu-"
JWT_SECRET="supersecret"
JWT_EXPIRES_IN="1h"

4️⃣ Run Backend
npm run seed

5️⃣ Start the Backend Server
npm run dev

-- To view the DB in the Prisma Studio interface: --
npx prisma studio

6️⃣ Frontend Setup
cd ../teamtasker-frontend
npm install
npm run start
