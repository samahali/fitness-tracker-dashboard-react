import { createSlice } from "@reduxjs/toolkit"

// Get initial theme from localStorage or default to 'light'
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme")
  return savedTheme || "light"
}

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: getInitialTheme(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light"
      localStorage.setItem("theme", state.mode)
    },
    setTheme: (state, action) => {
      state.mode = action.payload
      localStorage.setItem("theme", action.payload)
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer

