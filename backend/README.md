# 💪 Fitness Tracker Dashboard — Backend

This is the **backend** of the **Fitness Tracker Dashboard**, responsible for handling API requests, authentication, data persistence, and business logic. Built with **Node.js**, **Express.js**, and **MongoDB**, it follows a modular architecture to keep logic organized and scalable.

## 📁 Project Structure

```
backend/
├── api/
│   ├── config/               # Database and app configurations
│   ├── controllers/          # Request handlers for routes
│   ├── middlewares/          # Custom Express middleware
│   ├── models/               # Mongoose models/schemas
│   ├── routes/               # API endpoints
│   └── index.js              # Entry point for API routing
├── logs/                     # Application logs
├── tests/                    # Unit and integration tests
├── utils/                    # Utility/helper functions
├── .env.example              # Example environment variables
├── .env.test                 # Test environment config
├── Dockerfile                # Production Docker setup
├── Dockerfile.dev            # Development Docker setup
├── server.js                 # Express app entry point
├── package.json              # NPM dependencies and scripts
├── README.md                 # You're reading this
```

---

## ⚙️ Running the Backend

### Start the Server:
```sh
docker compose up backend
```

Or manually:
```sh
yarn install
yarn dev
```

### Environment Setup:
Copy `.env.example` to `.env` and set up your MongoDB URI and other secrets.

---

## 🧪 Testing
We use **Mocha**, **Chai**, and **Supertest** for backend testing.

### Run All Tests:
```sh
yarn test
```

You can also test API endpoints via Postman or integration scripts.

---

## 🛠️ Built With

- 🟩 **Node.js**
- 🚂 **Express.js**
- 🍃 **MongoDB** with Mongoose
- 🔐 **JWT** for authentication
- 🧪 **Mocha** + **Chai** + **Supertest** for testing
- 🐳 **Docker** for containerized development
- 📜 **ESLint** for consistent code
- 📁 **Modular Folder Structure** for scalability


# Backend Service

## Development Setup

### Prerequisites
- Docker and Docker Compose installed
- Node.js/Yarn (if developing outside containers)

## Common Commands

### 🐳 Docker-Based Workflow

```sh
# Add a dependency
docker compose exec backend yarn add <package>

# Remove a dependency
docker compose exec backend yarn remove <package>

# Install all dependencies (if package.json changes)
docker compose exec backend yarn install
```
#### Run Tests
```sh
docker compose exec backend yarn test
```