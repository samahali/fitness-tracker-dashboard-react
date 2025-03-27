import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../../redux/slices/authSlice"
import { FaTachometerAlt, FaDumbbell, FaBullseye, FaUser, FaSignOutAlt, FaCog, FaTimes } from "react-icons/fa"
import "./Sidebar.css"

const Sidebar = () => {
  const { currentUser, isAuthenticated } = useSelector((state) => state.auth)
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false) // Starts closed
  const dispatch = useDispatch()

  useEffect(() => {
  // When the page changes, ensure the menu is closed on small screens
    if (window.innerWidth <= 992) {
      setIsOpen(false)
      document.body.classList.remove("sidebar-open")
    }
  }, [location.pathname, isAuthenticated])

  const isActive = (path) => location.pathname === path

  const handleToggle = () => {
    setIsOpen(!isOpen)
    document.body.classList.toggle("sidebar-open", isOpen)
  }

  const handleClose = () => {
    setIsOpen(false)
    document.body.classList.remove("sidebar-open")
  }

  const handleLinkClick = () => {
    if (window.innerWidth <= 992) handleClose()
  }

  if (!isAuthenticated) return null

  return (
    <>
      {/* Overlay when the menu is opened */}
      <div className={`sidebar-overlay ${isOpen ? "active" : ""}`} onClick={handleClose}></div>

      <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="sidebar-brand">
              <span className="logo-text">FitPulse</span>
            </div>
            <button className="sidebar-close" onClick={handleClose}>
              <FaTimes />
            </button>
          </div>

          <div className="sidebar-user">
            <div className="user-avatar">
              {currentUser?.profileImage ? (
                <img src={currentUser.profileImage || "/placeholder.svg"} alt="User Avatar" className="avatar-image" />
              ) : (
                <>
                  {currentUser?.firstName?.charAt(0)}
                  {currentUser?.lastName?.charAt(0)}
                </>
              )}
            </div>
            <div className="user-info">
              <h6>{currentUser?.firstName} {currentUser?.lastName}</h6>
              <p>{currentUser?.email}</p>
            </div>
          </div>

          <ul className="sidebar-nav">
            <li className={`sidebar-item ${isActive("/dashboard") ? "active" : ""}`}>
              <Link to="/dashboard" className="sidebar-link" onClick={handleLinkClick}>
                <FaTachometerAlt className="sidebar-icon" />
                <span className="sidebar-text">Dashboard</span>
              </Link>
            </li>
            <li className={`sidebar-item ${isActive("/workouts") ? "active" : ""}`}>
              <Link to="/workouts" className="sidebar-link" onClick={handleLinkClick}>
                <FaDumbbell className="sidebar-icon" />
                <span className="sidebar-text">Workouts</span>
              </Link>
            </li>
            <li className={`sidebar-item ${isActive("/goals") ? "active" : ""}`}>
              <Link to="/goals" className="sidebar-link" onClick={handleLinkClick}>
                <FaBullseye className="sidebar-icon" />
                <span className="sidebar-text">Goals</span>
              </Link>
            </li>
          </ul>

          <ul className="sidebar-nav">
            <li className={`sidebar-item ${isActive("/profile") ? "active" : ""}`}>
              <Link to="/profile" className="sidebar-link" onClick={handleLinkClick}>
                <FaUser className="sidebar-icon" />
                <span className="sidebar-text">Profile</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <Link
                to="/login"
                className="sidebar-link"
                onClick={() => {
                  handleLinkClick()
                  dispatch(logout())
                }}
              >
                <FaSignOutAlt className="sidebar-icon" />
                <span className="sidebar-text">Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default Sidebar
