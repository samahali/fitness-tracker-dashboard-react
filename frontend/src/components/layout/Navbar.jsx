import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { toggleTheme } from "../../redux/slices/themeSlice";
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const { currentUser, isAuthenticated } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  // The desktop menu is always visible on large screens.
  // The mobile menu is rendered below the header and toggled with the mobile toggle button.

  return (
    <header className="navbar-premium">
      <div className="navbar-container">
        <div className="navbar-logo-container">
          {/* Always visible logo */}
          <Link
            to="/"
            className="navbar-logo"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="logo-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="logo-svg"
              >
                <path
                  d="M6.5 14.5V9.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.5 12.5V6.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.5 12.5V3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.5 9.5V6.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.5 11.5V3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.5 19.5L6.5 14.5L9.5 17.5L12.5 12.5L15.5 15.5L18.5 11.5L21.5 14.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="logo-text">FitPulse</span>
          </Link>
        </div>

        {/* Mobile toggle button (visible only on small screens) */}
        <button
          className="mobile-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle Mobile Menu"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop menu: visible only on large screens */}
        <nav role="navigation" className="navbar-menu-desktop" aria-label="desktop navigation">
          {isAuthenticated ? (
            <>
              <div className="navbar-actions">
                <button
                  className="theme-toggle-btn"
                  onClick={handleThemeToggle}
                  aria-label={`Switch to ${
                    mode === "dark" ? "light" : "dark"
                  } mode`}
                >
                  {mode === "dark" ? <FaSun /> : <FaMoon />}
                </button>
              </div>
              <div className="navbar-user">
                <div className="dropdown">
                  <button
                    className="user-profile dropdown-toggle"
                    type="button"
                    onClick={toggleDropdown}
                    aria-expanded={dropdownOpen}
                  >
                    <div className="user-avatar">
                      {currentUser?.profileImage ? (
                        <img
                          src={currentUser.profileImage}
                          alt={`${currentUser.firstName} ${currentUser.lastName}`}
                          className="avatar-image"
                        />
                      ) : (
                        <>
                          {currentUser?.firstName?.charAt(0)}
                          {currentUser?.lastName?.charAt(0)}
                        </>
                      )}
                    </div>
                    <div className="user-name">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </div>
                  </button>
                  <ul className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaUserCircle className="me-2" /> Profile
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <FaSignOutAlt className="me-2" /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="navbar-nav">
                <div className="nav-links-container">
                  <Link to="/about" className="nav-link">
                    About
                  </Link>
                  <Link to="/contact" className="nav-link">
                    Contact
                  </Link>
                </div>
              </div>
              <div className="navbar-actions">
                <button
                  className="theme-toggle-btn"
                  onClick={handleThemeToggle}
                  aria-label={`Switch to ${
                    mode === "dark" ? "light" : "dark"
                  } mode`}
                >
                  {mode === "dark" ? <FaSun /> : <FaMoon />}
                </button>
              </div>
              <div className="navbar-auth">
                <Link to="/login" className="navbar-auth-link">
                  Login
                </Link>
                <Link to="/register" className="navbar-auth-btn">
                  Register
                </Link>
              </div>
            </>
          )}
        </nav>
      </div>

      {/* Mobile menu: visible only on small screens when toggled */}
      <nav className={`navbar-menu-mobile ${mobileMenuOpen ? "active" : ""}`}>
        {isAuthenticated ? (
          <>
            <div className="navbar-actions">
              <button
                className="theme-toggle-btn"
                onClick={handleThemeToggle}
                aria-label={`Switch to ${
                  mode === "dark" ? "light" : "dark"
                } mode`}
              >
                {mode === "dark" ? <FaSun /> : <FaMoon />}
              </button>
            </div>
            <div className="navbar-user">
              <div className="dropdown">
                <button
                  className="user-profile dropdown-toggle"
                  type="button"
                  onClick={toggleDropdown}
                  aria-expanded={dropdownOpen}
                >
                  <div className="user-avatar">
                    {currentUser?.profileImage ? (
                      <img
                        src={currentUser.profileImage}
                        alt={`${currentUser.firstName} ${currentUser.lastName}`}
                        className="avatar-image"
                      />
                    ) : (
                      <>
                        {currentUser?.firstName?.charAt(0)}
                        {currentUser?.lastName?.charAt(0)}
                      </>
                    )}
                  </div>
                  <div className="user-name">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </div>
                </button>
                <ul className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/profile"
                      onClick={() => {
                        setDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <FaUserCircle className="me-2" /> Profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <FaSignOutAlt className="me-2" /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="navbar-nav">
              <div className="nav-links-container">
                <Link
                  to="/about"
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </div>
            <div className="navbar-actions">
              <button
                className="theme-toggle-btn"
                onClick={handleThemeToggle}
                aria-label={`Switch to ${
                  mode === "dark" ? "light" : "dark"
                } mode`}
              >
                {mode === "dark" ? <FaSun /> : <FaMoon />}
              </button>
            </div>
            <div className="navbar-auth">
              <Link
                to="/login"
                className="navbar-auth-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="navbar-auth-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
