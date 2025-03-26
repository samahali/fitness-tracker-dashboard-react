import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import Loader from "./Loader"

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, currentUser } = useSelector((state) => state.auth)

  // If we're still loading, show the loader
  if (loading) {
    return <Loader />
  }

  // Check if we have a token in localStorage even if isAuthenticated is false
  // This helps when refreshing the page
  const token = localStorage.getItem("token")

  // If we have a token or we're authenticated, render the children
  if (token || isAuthenticated) {
    return children
  }

  // Otherwise, redirect to login
  return <Navigate to="/login" />
}

export default PrivateRoute



