# 💪 Fitness Tracker Dashboard — Frontend

This is the **frontend** of the **Fitness Tracker Dashboard** — a modern web application that helps users monitor workouts and fitness goals visually and interactively. Built with **React 19**, **Vite**, and **Redux Toolkit**, this app uses a modular and scalable component structure for maintainability.

---

## 📁 Project Structure

```
frontend/
├── __tests__/                 # Unit and integration tests
├── dist/                     # Production build output
├── public/                   # Static assets
├── src/
│   ├── components/
│   │   ├── common/           # Shared components (e.g. buttons, inputs)
│   │   ├── dashboard/        # Dashboard-specific UI
│   │   ├── goals/            # Goal tracking components
│   │   ├── layout/           # Layout (navbar, sidebar)
│   │   ├── profile/          # User profile UI
│   │   ├── theme/            # Theming (dark/light mode)
│   │   └── workouts/         # Workout tracking UI
│   ├── pages/                # Pages/views with routing
│   ├── redux/                # Redux Toolkit slices/store
│   ├── services/             # API service layer (axios)
│   ├── styles/               # Global styling
│   ├── App.jsx               # Root component
│   ├── AppWrapper.jsx        # Context providers/wrappers
│   ├── main.jsx              # App entry point
│   └── setupTests.js         # Vitest test setup
├── .env.example              # Sample env config
├── Dockerfile                # For production deployment
├── Dockerfile.dev            # For local development (Docker)
├── vite.config.js            # Vite configuration
├── nginx.conf                # Used for Docker NGINX serving
├── index.html                # Main HTML entry point
└── README.md                 # You’re reading this!
```

---

## 🧪 Running Tests

We use **Vitest** and **React Testing Library** for frontend testing.

### Run All Tests:
```sh
docker compose exec frontend yarn test
```

### Run a Specific Test:
```sh
docker compose exec frontend yarn vitest run __tests__/pages/GoalTracking.test.jsx
```

### Test Coverage:
```sh
docker compose exec frontend yarn test:coverage
```

---

## ⚙️ Linting

```sh
yarn lint
```

The project uses **ESLint** with custom rules and React hooks best practices.

---

## 🛠️ Built With

- ⚛️ **React 19**
- ⚡ **Vite** for fast builds and dev server
- 🎨 **Bootstrap 5** + Icons
- 📊 **Chart.js** & **Recharts** for visualization
- 🌍 **React Router DOM v7**
- 🧠 **Redux Toolkit** + Thunks
- 📅 **react-day-picker** for calendars
- 🎯 **react-easy-crop** for profile images
- 📦 **Axios** for API calls

