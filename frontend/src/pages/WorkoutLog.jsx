import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchWorkouts } from "../redux/slices/workoutSlice"
import WorkoutForm from "../components/workouts/WorkoutForm"
import WorkoutList from "../components/workouts/WorkoutList"
import Loader from "../components/common/Loader"
import { FaPlus, FaTimes } from "react-icons/fa"
import "../components/workouts/WorkoutForm.css"
import "../components/workouts/WorkoutList.css"

const WorkoutLog = () => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.workouts)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    dispatch(fetchWorkouts())
  }, [dispatch])

  const handleFormSuccess = () => {
    dispatch(fetchWorkouts())
    setShowForm(false)
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="workout-log">
      <div className="workout-log-header">
        <h1 className="page-title">Workout Log</h1>
        <button
          className={`btn ${showForm ? "btn-outline-danger" : "btn-primary"}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <>
              <FaTimes className="me-2" /> Cancel
            </>
          ) : (
            <>
              <FaPlus className="me-2" /> Add Workout
            </>
          )}
        </button>
      </div>

      {showForm && <WorkoutForm onSuccess={handleFormSuccess} />}

      <WorkoutList />
    </div>
  )
}

export default WorkoutLog

