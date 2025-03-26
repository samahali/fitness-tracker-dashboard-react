import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchCurrentUser } from "./redux/slices/authSlice"

// This component will handle all Redux-related logic
const AppWrapper = ({ children }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [dispatch])

  return children
}

export default AppWrapper