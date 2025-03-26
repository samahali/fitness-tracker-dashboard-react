import { useDispatch, useSelector } from "react-redux"
import { toggleTheme } from "../../redux/slices/themeSlice"
import { FaSun, FaMoon } from "react-icons/fa"

const ThemeToggle = () => {
  const dispatch = useDispatch()
  const { mode } = useSelector((state) => state.theme)

  const handleToggle = () => {
    dispatch(toggleTheme())
  }

  return (
    <div
      className={`theme-toggle ${mode === "dark" ? "dark" : ""}`}
      onClick={handleToggle}
      role="button"
      aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
    >
      <div className="theme-toggle-handle">{mode === "dark" ? <FaMoon /> : <FaSun />}</div>
    </div>
  )
}

export default ThemeToggle

