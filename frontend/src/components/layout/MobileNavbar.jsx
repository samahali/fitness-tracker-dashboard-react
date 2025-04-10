import { Link, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../redux/slices/authSlice"
import { FaTachometerAlt, FaDumbbell, FaBullseye, FaUser, FaSignOutAlt } from "react-icons/fa"
import "./MobileNavbar.css"

const MobileNavbar = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  // Only render the mobile navbar if the user is authenticated
  if (!isAuthenticated) return null

  return (
    <div className="mobile-navbar">
      <Link to="/dashboard" className={`mobile-nav-item ${isActive("/dashboard") ? "active" : ""}`}>
        <FaTachometerAlt className="mobile-nav-icon" />
        <span className="mobile-nav-text">Dashboard</span>
      </Link>
      <Link to="/workouts" className={`mobile-nav-item ${isActive("/workouts") ? "active" : ""}`}>
        <FaDumbbell className="mobile-nav-icon" />
        <span className="mobile-nav-text">Workouts</span>
      </Link>
      <Link to="/goals" className={`mobile-nav-item ${isActive("/goals") ? "active" : ""}`}>
        <FaBullseye className="mobile-nav-icon" />
        <span className="mobile-nav-text">Goals</span>
      </Link>
      <Link to="/profile" className={`mobile-nav-item ${isActive("/profile") ? "active" : ""}`}>
        <FaUser className="mobile-nav-icon" />
        <span className="mobile-nav-text">Profile</span>
      </Link>
      <Link to="/login" className="mobile-nav-item" onClick={handleLogout}>
        <FaSignOutAlt className="mobile-nav-icon" />
        <span className="mobile-nav-text">Logout</span>
      </Link>
    </div>
  )
}

export default MobileNavbar
