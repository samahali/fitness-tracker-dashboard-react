import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchGoals } from "../redux/slices/goalSlice"
import GoalForm from "../components/goals/GoalForm"
import GoalList from "../components/goals/GoalList"
import Loader from "../components/common/Loader"
import { FaPlus, FaTimes } from "react-icons/fa"
import "../components/goals/GoalList.css"
import "../components/goals/GoalForm.css"

const GoalTracking = () => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.goals)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    dispatch(fetchGoals())
  }, [dispatch])

  const handleFormSuccess = () => {
    dispatch(fetchGoals())
    setShowForm(false)
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="goal-tracking">
      <div className="goal-tracking-header">
        <h1 className="page-title">Goal Tracking</h1>
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
              <FaPlus className="me-2" /> Add Goal
            </>
          )}
        </button>
      </div>

      {showForm && <GoalForm onSuccess={handleFormSuccess} />}

      <GoalList />
    </div>
  )
}

export default GoalTracking

