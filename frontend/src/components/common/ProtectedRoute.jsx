import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthProvider"
import Navbar from "./layout/Navbar"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default ProtectedRoute

