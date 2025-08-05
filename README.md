# Project Management Tool

A full-stack Project Management Tool built with **Node.js**, **Express**, **SQLite** (Sequelize), and **ReactJS** (Tailwind CSS). It supports role-based access (Admin, Manager, Developer), project/task management, team assignment, and commenting.

---

## Features

- **User Roles:**
  - **Admin:** Full access to manage users, projects, and tasks.
  - **Manager:** Can create/edit projects, assign tasks, and view project status.
  - **Developer:** Can view assigned tasks, update task status, and add comments.
- **Project Management:**
  - Create, edit, delete projects
  - Assign team members
  - Track project completion
- **Task Management:**
  - Create, edit, delete tasks
  - Assign tasks to users
  - Set deadlines, update status
  - Add comments to tasks
- **Authentication:**
  - JWT-based, stored in cookies
  - Role-based access control
- **Dashboard:**
  - Task count by status
  - Overdue tasks
  - Project completion percentage
- **API Documentation:** Swagger UI and Postman collection
- **Responsive Frontend:** ReactJS + Tailwind CSS

---

## Tech Stack

- **Backend:** Node.js, Express, Sequelize, SQLite
- **Frontend:** ReactJS, Tailwind CSS
- **Authentication:** JWT (stored in cookies)
- **API Docs:** Swagger, Postman

---

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- Git

### Backend Setup

1. Navigate to backend:
   ```bash
   cd project-management-tool/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` in `backend/`:
   ```env
   PORT=3000
   JWT_SECRET=your_jwt_secret
   DATABASE_URL=sqlite:./database.sqlite
   ```
4. Start the backend:
   ```bash
   npm start
   ```
5. Access API at `http://localhost:3000` and Swagger at `http://localhost:3000/api-docs`

### Frontend Setup

1. Navigate to frontend:
   ```bash
   cd project-management-tool/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` in `frontend/`:
   ```env
   REACT_APP_API_URL=http://localhost:3000
   ```
4. Start the frontend:
   ```bash
   npm start
   ```
5. Access the app at `http://localhost:3001`

---

## Usage

- **Login as one of the users below**
- **Admin** can manage users, projects, and tasks
- **Manager** can manage projects and tasks
- **Developer** can view and update assigned tasks, add comments
- **Assign team members** to projects (Admin/Manager)
- **Assign tasks** to project team members
- **Comment** on tasks

---

## User Credentials (Demo)

| Role      | Email                 | Password      |
| --------- | --------------------- | ------------- |
| Admin     | Admin@example.com     | Admin@123     |
| Manager   | Manager@example.com   | Manager@123   |
| Developer | Developer@example.com | Developer@123 |

---

## API Endpoints (Summary)

### Authentication

- `POST /api/auth/register` (Admin only)
- `POST /api/auth/login`
- `GET /api/auth/me`

### Users

- `GET /api/users` (Admin/Manager)
- `GET /api/users/:id` (Admin or self)
- `PUT /api/users/:id` (Admin or self)
- `DELETE /api/users/:id` (Admin only)

### Projects

- `POST /api/projects` (Admin, Manager)
- `GET /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id` (Admin, Manager)
- `DELETE /api/projects/:id` (Admin, Manager)
- `POST /api/projects/:id/assign` (Admin, Manager)

### Tasks

- `POST /api/tasks` (Admin, Manager)
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id` (Admin, Manager, Assigned Developer)
- `DELETE /api/tasks/:id` (Admin, Manager)
- `POST /api/tasks/:id/comments`

### Reporting

- `GET /api/reports/tasks`
- `GET /api/reports/overdue`
- `GET /api/reports/projects/:id/progress`

---

## Not Implemented

- **AI User Story Generator** (Groq API integration) is not implemented.
- **Unit tests** (backend/frontend) are not implemented.

---
