# Fitness Tracker Dashboard

## 📌 Overview
The **Fitness Tracker Dashboard** is a full-stack web application built using **React.js (frontend)**, **Express.js (backend)**, and **MongoDB (database)**. The app allows users to track their workouts, monitor fitness progress, and visualize data using interactive charts.

## 🏗️ Tech Stack
### **Frontend:**
- React.js (Vite for fast builds)
- Yarn 4.6.0 (Package manager)
- Bootstrap 5 (Styling)
- Chartjs (Data visualization)

### **Backend:**
- Node.js (Express.js framework)
- MongoDB (Mongoose for database modeling)
- JWT Authentication
- Docker & Docker Compose

## 🚀 Features
- User authentication (Sign up, login, JWT-based authorization)
- Dashboard with fitness tracking data
- Interactive charts for progress monitoring
- RESTful API endpoints for managing workouts
- Dockerized deployment setup

---

## ⚙️ Installation & Setup
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/samahali/fitness-tracker-dashboard-react.git
cd fitness-tracker-dashboard-react
```

### **2️⃣ Environment Variables**
Create a `.env` file in the `backend/` folder and add:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### **3️⃣ Run the App with Docker**
Make sure **Docker** and **Docker Compose** are installed. Then, run:
```sh
docker-compose up --build
```
The app will be available at `http://localhost:80`.

### **4️⃣ Run the App without Docker**
#### **Backend:**
```sh
cd backend
yarn 
yarn dev
```
#### **Frontend:**
```sh
cd frontend
yarn 
yarn dev
```
The frontend will be available at `http://localhost:5173`.

---

## 🛠️ Authors
**Esraa Mostafa**  
**Mariam Helmy** 
**Omnya Tarek** 
**Samah Ali** 

> 🚀 If you like this project, don't forget to ⭐ the repo!

