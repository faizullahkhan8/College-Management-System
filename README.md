# 🎓 UniCore – College Management System

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)](https://www.mongodb.com/mern-stack)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v14+-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-v17+-blue)](https://reactjs.org)

A comprehensive **MERN stack-based College Management System** that simplifies the administration and academic management of an educational institution.  
The platform provides distinct portals for **Administrators**, **Faculty**, and **Students**, helping streamline academic workflows.

---

## ✨ Features

### 🧑‍💼 Admin
- Manage faculty and student accounts with detailed profiles
- Manage academic branches and courses
- Handle subjects, timetables, and notices
- Update personal profile and credentials

### 👨‍🏫 Faculty
- View and edit personal profile with emergency contacts
- Upload and organize study materials (notes, assignments, syllabus)
- Manage student information by semester, branch, or enrollment
- Access and post notices
- Manage password reset and profile updates

### 🎓 Student
- View and edit personal profile
- Access study materials by subject, semester, or type
- View timetables and notices
- Manage password and profile updates

---

## 🛠️ Tech Stack

| Layer | Technology |
|--------|-------------|
| Frontend | React.js |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Authentication | JWT |
| File Uploads | Cloudinary |
| Mailing | Nodemailer |

---

## ⚙️ Prerequisites

- Node.js (v14+)
- MongoDB
- npm or yarn

---

## 🚀 Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone <https://github.com/anuska2027biswas/uniCore>
cd UniCore
```
### 2️⃣ Install dependencies
```
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```
### 3️⃣ Setup environment variables

### 📁 Backend .env
```
MONGODB_URI = mongodb://127.0.0.1:27017/College-Management-System
PORT = 4000
FRONTEND_API_LINK = http://localhost:3000
JWT_SECRET = THISISSECRET

NODEMAILER_EMAIL =
NODEMAILER_PASS =
```
### 📁 Frontend .env
```
REACT_APP_APILINK = http://localhost:4000/api
REACT_APP_MEDIA_LINK = http://localhost:4000/media
```
### 4️⃣ Run the development servers
# Backend
```
cd backend
npm run dev

# Frontend
cd ../frontend
npm start
```
### 📂 Folder Structure

### 🖥️ Backend Structure
```
UniCore/
├── backend/
│   ├── controllers/
│   │   └── details/
│   │       ├── admin-details.controller.js
│   │       ├── faculty-details.controller.js
│   │       ├── student-details.controller.js
│   │       ├── branch.controller.js
│   │       ├── exam.controller.js
│   │       ├── marks.controller.js
│   │       ├── material.controller.js
│   │       ├── notice.controller.js
│   │       ├── subject.controller.js
│   │       └── timetable.controller.js
│   │
│   ├── Database/
│   ├── media/
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── multer.middleware.js
│   │
│   ├── models/
│   │   └── details/
│   │       ├── admin-details.model.js
│   │       ├── faculty-details.model.js
│   │       ├── student-details.model.js
│   │       ├── branch.model.js
│   │       ├── exam.model.js
│   │       ├── marks.model.js
│   │       ├── material.model.js
│   │       ├── notice.model.js
│   │       ├── reset-password.model.js
│   │       └── subject.model.js
│   │
│   ├── routes/
│   │   └── details/
│   │       ├── admin-details.route.js
│   │       ├── faculty-details.route.js
│   │       ├── student-details.route.js
│   │       ├── branch.route.js
│   │       ├── subject.route.js
│   │       ├── marks.route.js
│   │       ├── exam.route.js
│   │       └── notice.route.js
│   │
│   ├── utils/
│   ├── server.js
│   └── package.json
```
### 🌐 Frontend Structure
```
UniCore/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   ├── Sidebar/
│   │   │   ├── Auth/
│   │   │   └── Shared/
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── AppContext.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Admin/
│   │   │   ├── Faculty/
│   │   │   ├── Student/
│   │   │   └── Auth/
│   │   │
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── helpers.js
│   │   │
│   │   ├── App.js
│   │   ├── index.js
│   │   └── styles/
│   │       └── global.css
│   │
│   ├── .env
│   └── package.json

```

### 🧠 Notes
```
Backend runs on http://localhost:4000

Frontend runs on http://localhost:3000

```

### 🤝 Contributing

Contributions are welcome!
Feel free to submit a Pull Request or open an Issue for discussion.
