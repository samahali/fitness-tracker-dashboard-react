# 🏋️‍♀️ Fitness Tracker Dashboard

## 📌 Overview  
The **Fitness Tracker Dashboard** is a full-stack web application designed to help users **track workouts**, **monitor fitness progress**, and **visualize performance** over time through interactive charts and dashboards.

This project follows a modern development workflow using **React.js** for the frontend, **Express.js** and **MongoDB** for the backend, and **Docker** for containerized deployment.

---

## 🏗️ Tech Stack  

### **Frontend**  
- ⚛️ **React.js** (Vite for lightning-fast builds)  
- 🎨 **Bootstrap 5** + **Bootstrap Icons**  
- 📊 **Chart.js** & **Recharts** (Interactive visualizations)  
- 🌍 **React Router DOM**  
- 🔍 **Redux Toolkit** & **Redux Thunk**  
- 🧪 **Vitest**, **Testing Library**, **ESLint**

### **Backend**  
- 🚀 **Node.js** with **Express.js**  
- 📂 **MongoDB** with **Mongoose**  
- 🔐 **JWT Authentication**  
- ☁️ **Cloudinary** (Image storage)  
- 📦 **Docker & Docker Compose**  
- 📋 **Mocha**, **Chai**, **Sinon**, **Supertest**

---

## 🚀 Features  
✅ User registration & login (JWT authentication)  
✅ Secure image upload with Cloudinary  
✅ Dashboard displaying user workout data  
✅ Interactive data visualizations  
✅ RESTful API for workouts management  
✅ Volume-mounted local development via Docker  
✅ Testing setup with code coverage support  

---

## ⚙️ Installation & Setup  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/samahali/fitness-tracker-dashboard-react.git
cd fitness-tracker-dashboard-react
```

### 2️⃣ Set Up Environment Variables  
Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://mongo:27017/fitnessDB
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🐳 Running the App with Docker  

**Note:** This Docker setup is for **local development** only. For **production**, the app is deployed on **Render** using a `Dockerfile`.

### 3️⃣ Build & Start Containers  
Make sure Docker and Docker Compose are installed:

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`  
- Backend: `http://localhost:5000`

### 4️⃣ Auto-Reload (Volume Mounting)  
- ✅ Frontend and backend support **hot-reloading**  
- 🚨 For **new package installs**, do the following:

```bash
docker compose exec backend yarn add <package-name>
docker compose exec backend yarn install
docker compose down && docker compose up
```

---

## 🛠️ Running Without Docker  

### Backend  
```bash
cd backend
yarn
yarn dev
```

### Frontend  
```bash
cd frontend
yarn
yarn dev
```

- Frontend: `http://localhost:5173`  
- Backend: `http://localhost:5000`  

---

## 📟 MongoDB Access in Docker

Use this command to access the MongoDB shell:

```bash
docker exec -it fitness-tracker-dashboard-react-mongo-1 mongosh
```

Inside Mongo shell:
```js
use fitnessDB
show collections
db.users.find().pretty()
```

---

## 🧰 Package Highlights  

### **Backend Dependencies**
- 🔒 `bcryptjs`, `jsonwebtoken` (security)
- ☁️ `cloudinary`, `multer` (file/image handling)
- 📋 `winston` & `winston-daily-rotate-file` (logging)
- 🧪 `mocha`, `chai`, `supertest`, `sinon`, `esmock`

### **Frontend Dependencies**
- 🍜 `bootstrap`, `react-bootstrap`, `bootstrap-icons`
- 📊 `chart.js`, `react-chartjs-2`, `recharts`
- 🧵 `redux`, `react-redux`, `redux-thunk`
- 🗓️ `react-day-picker`, `date-fns`
- 📦 `axios`, `image-compression`

---

## 👥 Authors  
- **Esraa Mostafa**  
- **Mariam Helmy**  
- **Omnya Tarek**  
- **Samah Ali**  

---

## ⭐ Support  
If you found this project helpful, please consider giving it a **star**! 🌟  
We welcome contributions, feedback, and forks!