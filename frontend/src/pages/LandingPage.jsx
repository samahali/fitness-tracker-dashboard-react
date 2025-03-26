import { Link, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { FaDumbbell, FaChartLine, FaBullseye, FaMobileAlt, FaLock, FaUserFriends } from "react-icons/fa"
import "../styles/landing-page.css"

const LandingPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)

  // Redirect to dashboard if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />
  }

  return (
    <div className="landing-page public-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 hero-content">
              <h1 className="hero-title slide-in-right">Track Your Fitness Journey</h1>
              <p className="hero-subtitle slide-in-right" style={{ animationDelay: "0.2s" }}>
                FitPulse helps you monitor workouts, set goals, and visualize your progress all in one place. Take
                control of your fitness journey today.
              </p>
              <div className="hero-cta slide-in-right" style={{ animationDelay: "0.4s" }}>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline-primary btn-lg">
                  Login
                </Link>
              </div>
            </div>
            <div className="col-lg-6 hero-image slide-in-right" style={{ animationDelay: "0.6s" }}>
              <img
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Fitness Dashboard Preview"
                className="img-fluid rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Powerful Features</h2>
            <div className="title-underline"></div>
            <p className="lead text-muted">Everything you need to achieve your fitness goals</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaDumbbell />
                </div>
                <h4>Workout Tracking</h4>
                <p>Log your workouts with detailed information about exercises, duration, and calories burned.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon success">
                  <FaChartLine />
                </div>
                <h4>Progress Visualization</h4>
                <p>
                  See your progress with beautiful charts and analytics that help you understand your fitness journey.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon warning">
                  <FaBullseye />
                </div>
                <h4>Goal Setting</h4>
                <p>Set personalized fitness goals and track your progress toward achieving them.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon info">
                  <FaMobileAlt />
                </div>
                <h4>Mobile Friendly</h4>
                <p>Access your fitness data on any device with our responsive design.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon danger">
                  <FaLock />
                </div>
                <h4>Secure Data</h4>
                <p>Your fitness data is securely stored and protected with the latest security measures.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon secondary">
                  <FaUserFriends />
                </div>
                <h4>Community Support</h4>
                <p>Join a community of fitness enthusiasts to stay motivated and share your journey.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container py-4 text-center">
          <h2 className="display-5 fw-bold mb-4">Ready to Start Your Fitness Journey?</h2>
          <p className="lead mb-4">Join thousands of users who have transformed their lives with FitPulse</p>
          <Link to="/register" className="btn btn-light btn-lg px-5 py-3">
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  )
}

export default LandingPage

