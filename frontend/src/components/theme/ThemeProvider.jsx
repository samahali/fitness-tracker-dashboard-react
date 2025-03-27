import { useEffect } from "react"
import { useSelector } from "react-redux"

const ThemeProvider = ({ children }) => {
  const { mode } = useSelector((state) => state.theme)

  useEffect(() => {
    // Apply dark mode class to body
    if (mode === "dark") {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }, [mode])

  return <>{children}</>
}

export default ThemeProvider