# **Fitness Tracker Dashboard**  

## 📌 Overview  
The **Fitness Tracker Dashboard** is a full-stack web application built using **React.js (frontend)**, **Express.js (backend)**, and **MongoDB (database)**. The app allows users to track their workouts, monitor fitness progress, and visualize data using interactive charts.

---

## 🏗️ Tech Stack  
### **Frontend:**  
- React.js (Vite for fast builds)  
- Yarn 4.6.0 (Package manager)  
- Bootstrap 5 (Styling)  
- Chart.js (Data visualization)  

### **Backend:**  
- Node.js (Express.js framework)  
- MongoDB (Mongoose for database modeling)  
- JWT Authentication  
- Docker & Docker Compose  

---

## 🚀 Features  
✅ User authentication (Sign up, login, JWT-based authorization)  
✅ Dashboard with fitness tracking data  
✅ Interactive charts for progress monitoring  
✅ RESTful API endpoints for managing workouts  
✅ Dockerized deployment setup  

---

## ⚙️ Installation & Setup  

### **1️⃣ Clone the Repository**  
```sh
git clone https://github.com/samahali/fitness-tracker-dashboard-react.git
cd fitness-tracker-dashboard-react
```

### **2️⃣ Set Up Environment Variables**  
Create a `.env` file inside the **backend/** folder and add:  
```env
PORT=5000
MONGO_URI=mongodb://mongo:27017/fitnessDB
JWT_SECRET=your_secret_key
```

---

## 🐳 Running the App with Docker  

### **3️⃣ Start the Docker Containers**  
Make sure **Docker** and **Docker Compose** are installed, then run:  
```sh
docker-compose up --build
```
or
```sh
docker compose up build
```
- The **frontend** will be available at: `http://localhost:3000`  
- The **backend** will be available at: `http://localhost:5000`  

### **4️⃣ Reflect Code Changes Inside Docker (Auto-Reload)**  
To make sure changes in your code reflect inside Docker without restarting, we have set up **volume mounting** in `docker-compose.yml`.  

✅ **For backend changes**, they will be reflected automatically. No need to restart Docker.  
✅ **For frontend changes**, they will also update automatically.  

However, **if you install new packages**, follow these steps:  
1. Install the package inside Docker:  
   ```sh
   docker-compose exec backend yarn add package-name
   ```
   or
   ```sh
   docker compose exec backend yarn add package-name
   ```
2. Ensure it's saved in `package.json`:  
   ```sh
   docker-compose exec backend yarn install
   ```
   or
   ```sh
   docker compose exec backend yarn install
   ```
3. If needed, restart the container:  
   ```sh
   docker-compose down && docker-compose up
   ```
    or
   ```sh
   docker compose down && docker compose up
   ```
---
To see record in mongo db
docker exec -it fitness-tracker-dashboard-react-mongo-1 mongosh
test> use fitnessDB
fitnessDB> show collections
fitnessDB> db.users.find().pretty()

## ⚡ Running the App Without Docker  
If you prefer to run the app without Docker:

### **Backend:**  
```sh
cd backend
yarn
yarn dev
```
### **Frontend:**  
```sh
cd frontend
yarn
yarn dev
```
- The frontend will run at `http://localhost:5173`.  
- The backend will run at `http://localhost:5000`.  

---

## 🛠️ Authors  
**Esraa Mostafa**  
**Mariam Helmy**  
**Omnya Tarek**  
**Samah Ali**  

🚀 If you like this project, don't forget to ⭐ the repo!  

