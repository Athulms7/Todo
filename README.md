# 📝 TaskList — To-Do App (Flask + React)

A full-stack to-do application built with **Flask** (Python) backend and **React.js** frontend. Features include JWT authentication, Google SSO, task creation/editing/deletion, due dates, priorities, email notifications, and more.

---

## 🚀 Features

### ✅ Task Management
- Add, edit, delete tasks
- Mark tasks as `COMPLETED` or `PENDING`
- Set priorities: `LOW`, `MEDIUM`, `HIGH`
- Set due dates

### 🔐 Authentication
- JWT-based login & registration
- Google OAuth login with Flask-Dance

### 📬 Email Notifications
- Task creation email using Flask-Mail

### 📊 Filtering
- Search by title
- Filter by priority or status
- Sort by due date (ascending/descending)

---

## 🖥️ Tech Stack

### Frontend:
- React + TypeScript
- Tailwind CSS & ShadCN UI
- Axios for API requests

### Backend:
- Flask
- Flask-JWT-Extended
- Flask-SQLAlchemy
- Flask-Mail
- Flask-Dance (Google OAuth)
- Flask-CORS
- PostgreSQL (via psycopg2)

---

## 📦 Installation

### 🔧 Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

pip install -r requirements.txt
