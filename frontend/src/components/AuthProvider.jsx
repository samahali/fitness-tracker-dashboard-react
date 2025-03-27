import { createContext, useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"

export const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check for user in localStorage on initial load
    const storedUser = localStorage.getItem("fitnessUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem("fitnessUser", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("fitnessUser")
    navigate("/login")
  }

  const isAuthenticated = () => {
    return !!user
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>{children}</AuthContext.Provider>
  )
}

