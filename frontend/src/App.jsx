import { Suspense, lazy } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import ThemeProvider from "./components/theme/ThemeProvider"
import PrivateRoute from "./components/common/PrivateRoute"
import Navbar from "./components/layout/Navbar"
import Sidebar from "./components/layout/Sidebar"
import MobileNavbar from "./components/layout/MobileNavbar"
import Footer from "./components/layout/Footer"
import Loader from "./components/common/Loader"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css"

// Lazy load components for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"))
const Login = lazy(() => import("./pages/Login"))
const Register = lazy(() => import("./pages/Register"))
const WorkoutLog = lazy(() => import("./pages/WorkoutLog"))
const GoalTracking = lazy(() => import("./pages/GoalTracking"))
const Profile = lazy(() => import("./pages/Profile"))
const LandingPage = lazy(() => import("./pages/LandingPage"))
const AboutUs = lazy(() => import("./pages/AboutUs"))
const ContactUs = lazy(() => import("./pages/ContactUs"))

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="content-wrapper">
            <Sidebar />
            <main className="main-content">
              <Suspense fallback={<Loader />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/workouts"
                    element={
                      <PrivateRoute>
                        <WorkoutLog />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/goals"
                    element={
                      <PrivateRoute>
                        <GoalTracking />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </Suspense>
            </main>
          </div>
          <Footer />
          <MobileNavbar />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App

