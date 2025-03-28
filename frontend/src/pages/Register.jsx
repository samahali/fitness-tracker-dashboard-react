"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { registerUser, clearError } from "../redux/slices/authSlice"
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaUser,
  FaLock,
  FaRulerVertical,
  FaEnvelope,
  FaUserAlt,
  FaWeightHanging,
  FaRuler,
  FaVenusMars,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa"
import "../styles/auth-pages.css"

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate("/dashboard")
    }

    // Add class to body to remove sidebar space
    document.body.classList.add("auth-page")

    // Cleanup function
    return () => {
      document.body.classList.remove("auth-page")
    }
  }, [isAuthenticated, navigate])

  // Clear any previous errors when component mounts
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: ["age", "weight", "height"].includes(name) && value !== "" ? Number.parseFloat(value) : value,
    })
  }

  const validateStep = (step) => {
    setPasswordError("")

    switch (step) {
      case 1:
        return formData.firstName.trim() !== "" && formData.lastName.trim() !== "" && formData.email.trim() !== ""
      case 2:
        if (formData.password.trim() === "") {
          setPasswordError("Password is required")
          return false
        }
        if (formData.password.length < 6) {
          setPasswordError("Password must be at least 6 characters")
          return false
        }
        if (formData.password !== formData.confirmPassword) {
          setPasswordError("Passwords do not match")
          return false
        }
        return true
      case 3:
        return true // Optional fields, so always valid
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Ensure validation before proceeding
    if (!validateStep(currentStep)) {
      return
    }

    // Move to the next step if not on the final step
    if (currentStep < 3) {
      nextStep()
    }
  }

  const handleCompleteRegistration = async () => {
    try {
      // Clear any previous errors
      dispatch(clearError())
      setPasswordError("")

      // Prepare the data for API submission
      const { confirmPassword, ...userData } = formData

      // Convert empty strings to null for optional fields
      const processedData = Object.entries(userData).reduce((acc, [key, value]) => {
        // Only convert empty strings for optional fields
        if (["age", "gender", "weight", "height"].includes(key)) {
          acc[key] = value === "" ? null : value
        } else {
          acc[key] = value
        }
        return acc
      }, {})

      // Dispatch the registerUser action
      const resultAction = await dispatch(registerUser(processedData))

      if (registerUser.fulfilled.match(resultAction)) {
        // Registration successful - navigate to dashboard
        navigate("/dashboard")
      }
      // If rejected, the error will be handled by the reducer and displayed
    } catch (err) {
      console.error("Registration failed:", err)
      setPasswordError("An unexpected error occurred. Please try again.")
    }
  }

  // Add CSS for password toggle icon and button positioning
  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
    .input-with-icon {
      position: relative;
    }
    .input-icon {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: #6b7280;
    }
    .password-toggle-icon {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: #6b7280;
      cursor: pointer;
    }
    .input-with-icon input,
    .input-with-icon select {
      padding-left: 35px;
    }
    .input-with-icon input[type="password"],
    .input-with-icon input[type="text"].password-input {
      padding-right: 35px;
    }
    .stepper-buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
    }
    .stepper-buttons.end-button {
      justify-content: flex-end;
    }
  `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h3 className="step-title">Personal Information</h3>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <div className="input-with-icon">
                    <FaUserAlt className="input-icon" />
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <div className="input-with-icon">
                    <FaUserAlt className="input-icon" />
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </>
        )
      case 2:
        return (
          <>
            <h3 className="step-title">Security</h3>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control password-input"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control password-input"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <div className="password-toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>
          </>
        )
      case 3:
        return (
          <>
            <h3 className="step-title">Physical Information (Optional)</h3>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <div className="input-with-icon">
                    <FaUser className="input-icon" />
                    <input
                      type="number"
                      className="form-control"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      min="1"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <div className="input-with-icon">
                    <FaVenusMars className="input-icon" />
                    <select
                      className="form-select"
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="weight">Weight (kg)</label>
                  <div className="input-with-icon">
                    <FaWeightHanging className="input-icon" />
                    <input
                      type="number"
                      className="form-control"
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      step="0.1"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="height">Height (cm)</label>
                  <div className="input-with-icon">
                    <FaRuler className="input-icon" />
                    <input
                      type="number"
                      className="form-control"
                      id="height"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      step="0.1"
                      min="1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
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
          <h1>FitPulse</h1>
        </div>

        <h2 className="auth-title">Create Account</h2>

        <div className="stepper-container">
          <div className="stepper">
            <div className={`step ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`}>
              <div className="step-icon">{currentStep > 1 ? <FaCheck /> : <FaUser />}</div>
              <div className="step-label">Personal</div>
            </div>
            <div className="step-line"></div>
            <div className={`step ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`}>
              <div className="step-icon">{currentStep > 2 ? <FaCheck /> : <FaLock />}</div>
              <div className="step-label">Security</div>
            </div>
            <div className="step-line"></div>
            <div className={`step ${currentStep >= 3 ? "active" : ""} ${currentStep > 3 ? "completed" : ""}`}>
              <div className="step-icon">{currentStep > 3 ? <FaCheck /> : <FaRulerVertical />}</div>
              <div className="step-label">Physical</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {passwordError && (
          <div className="alert alert-danger" role="alert">
            {passwordError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {renderStepContent()}

          {currentStep === 1 ? (
            <div className="stepper-buttons end-button">
              <button type="button" className="btn btn-primary" onClick={nextStep}>
                Next <FaArrowRight className="ms-2" />
              </button>
            </div>
          ) : (
            <div className="stepper-buttons">
              {currentStep > 1 && (
                <button type="button" className="btn btn-outline-primary" onClick={prevStep}>
                  <FaArrowLeft className="me-2" /> Back
                </button>
              )}

              {currentStep < 3 ? (
                <button type="button" className="btn btn-primary" onClick={nextStep}>
                  Next <FaArrowRight className="ms-2" />
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleCompleteRegistration}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Registering...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </button>
              )}
            </div>
          )}
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register

