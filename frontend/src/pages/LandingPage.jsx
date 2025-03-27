import { Link, Navigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { FaDumbbell, FaChartLine, FaBullseye, FaMobileAlt, FaLock, FaUserFriends } from "react-icons/fa"
import { useEffect, useState, useRef } from "react"
import "../styles/landing-page.css"

const LandingPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  const location = useLocation()
  const [key, setKey] = useState(0)
  const ctaSectionRef = useRef(null)

  // Ensures styles remain consistent when navigating back
  useEffect(() => {
    console.log("Current pathname:", location.pathname)
    document.body.classList.add("landing-page-style")

    return () => {
      document.body.classList.remove("landing-page-style")
    }
  }, [location.pathname])

  // Force re-render on navigation back
  useEffect(() => {
    setKey((prevKey) => prevKey + 1)
  }, [location.pathname])

  // Scroll to top when landing page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Force consistent CTA section size
  useEffect(() => {
    const enforceCTASize = () => {
      if (ctaSectionRef.current) {
        // Force the height to be exactly 350px
        ctaSectionRef.current.style.height = "350px"
        ctaSectionRef.current.style.maxHeight = "350px"
        ctaSectionRef.current.style.minHeight = "350px"

        // Apply these styles to ensure consistent rendering
        ctaSectionRef.current.style.display = "flex"
        ctaSectionRef.current.style.alignItems = "center"
        ctaSectionRef.current.style.justifyContent = "center"
        ctaSectionRef.current.style.width = "100%"
        ctaSectionRef.current.style.overflow = "hidden"
      }
    }

    // Apply immediately and on resize
    enforceCTASize()
    window.addEventListener("resize", enforceCTASize)

    // Apply again after a short delay to handle any dynamic content changes
    const timer = setTimeout(enforceCTASize, 100)

    return () => {
      window.removeEventListener("resize", enforceCTASize)
      clearTimeout(timer)
    }
  }, [key, location.pathname])

  // Redirect to dashboard if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />
  }

  return (
    <div key={key} className="landing-page public-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 hero-content">
              <h1 className="hero-title slide-in-right">Track Your Fitness Journey</h1>
              <p className="hero-subtitle slide-in-right" style={{ animationDelay: "0.2s" }}>
                FitPulse helps you monitor workouts, set goals, and visualize your progress all in one place.
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
            <h2 className="display-5 fw-bold fixed-size">Powerful Features</h2>
            <div className="title-underline"></div>
            <p className="lead text-muted">Everything you need to achieve your fitness goals</p>
          </div>
          <div className="row g-4">
            {[
              {
                icon: <FaDumbbell />,
                title: "Workout Tracking",
                desc: "Log your workouts with details on exercises, duration, and calories burned.",
              },
              {
                icon: <FaChartLine />,
                title: "Progress Visualization",
                desc: "See your progress with detailed charts and analytics.",
              },
              {
                icon: <FaBullseye />,
                title: "Goal Setting",
                desc: "Set personalized fitness goals and track your achievements.",
              },
              {
                icon: <FaMobileAlt />,
                title: "Mobile Friendly",
                desc: "Access your fitness data anywhere with our responsive design.",
              },
              { icon: <FaLock />, title: "Secure Data", desc: "Your data is securely stored and protected." },
              {
                icon: <FaUserFriends />,
                title: "Community Support",
                desc: "Join a fitness community for motivation and support.",
              },
            ].map((feature, index) => (
              <div key={index} className="col-md-4">
                <div className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h4>{feature.title}</h4>
                  <p>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - with ref for direct DOM manipulation */}
      <section ref={ctaSectionRef} className="cta-section">
        <div className="container py-4 text-center">
          <h2 className="display-5 fw-bold fixed-size">Ready to Start Your Fitness Journey?</h2>
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

