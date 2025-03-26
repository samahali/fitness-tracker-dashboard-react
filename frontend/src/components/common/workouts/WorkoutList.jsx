import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { deleteWorkout } from "../../redux/slices/workoutSlice"
import {
  FaTrash,
  FaExpandAlt,
  FaCompressAlt,
  FaRunning,
  FaDumbbell,
  FaBalanceScale,
  FaEllipsisH,
  FaCalendarAlt,
  FaStopwatch,
  FaFireAlt,
  FaStickyNote,
  FaQuoteRight,
} from "react-icons/fa"
import { GrYoga } from "react-icons/gr"

import "./WorkoutList.css"

const WorkoutList = () => {
  const dispatch = useDispatch()
  const { workouts, loading } = useSelector((state) => state.workouts)
  const [expandedIds, setExpandedIds] = useState(new Set())

  const toggleExpand = (id) => {
    setExpandedIds((prevExpandedIds) => {
      const newExpandedIds = new Set(prevExpandedIds)
      if (newExpandedIds.has(id)) {
        newExpandedIds.delete(id)
      } else {
        newExpandedIds.add(id)
      }
      return newExpandedIds
    })
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      try {
        await dispatch(deleteWorkout(id)).unwrap()
      } catch (error) {
        console.error("Error deleting workout:", error)
      }
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getWorkoutTypeIcon = (type) => {
    switch (type) {
      case "cardio":
        return <FaRunning />
      case "strength":
        return <FaDumbbell />
      case "flexibility":
        return <GrYoga />
      case "balance":
        return <FaBalanceScale />
      default:
        return <FaEllipsisH />
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (workouts.length === 0) {
    return (
      <div className="empty-workouts-container">
        <div className="empty-workouts-icon">
          <FaDumbbell />
        </div>
        <h3>No workouts logged yet</h3>
        <p>Start by adding your first workout!</p>
      </div>
    )
  }

  return (
    <div className="workouts-list-container">
      {workouts.map((workout) => (
        <div key={workout._id} className="workout-card-wrapper">
          <div className={`workout-card ${workout.type}`}>
            <div className="workout-card-header">
              <div className={`workout-type-badge ${workout.type}`}>{getWorkoutTypeIcon(workout.type)}</div>
              <h5 className="workout-title">{workout.exercise}</h5>
              <div className="workout-actions">
                <button
                  className="btn-action btn-expand"
                  onClick={() => toggleExpand(workout._id)}
                  title={expandedIds.has(workout._id) ? "Collapse" : "Expand"}
                >
                  {expandedIds.has(workout._id) ? <FaCompressAlt /> : <FaExpandAlt />}
                </button>
                <button
                  className="btn-action btn-delete"
                  onClick={() => handleDelete(workout._id)}
                  title="Delete Workout"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <div className="workout-card-body">
              <div className="workout-info-grid">
                {/* Date on top row with background icon */}
                <div className="workout-info-item workout-info-date">
                  <div className={`info-icon date-icon ${workout.type}`}>
                    <FaCalendarAlt />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Date</div>
                    <div className="info-value">{formatDate(workout.createdAt)}</div>
                  </div>
                </div>

                {/* Duration and Calories side by side with simple colored icons */}
                <div className="workout-info-row">
                  <div className="workout-info-item">
                    <FaStopwatch className={`info-icon duration-icon ${workout.type}`} />
                    <div className="info-content">
                      <div className="info-label">Duration</div>
                      <div className="info-value">{workout.duration} min</div>
                    </div>
                  </div>

                  {workout.caloriesBurned > 0 ? (
                    <div className="workout-info-item">
                      <FaFireAlt className={`info-icon calories-icon ${workout.type}`} />
                      <div className="info-content">
                        <div className="info-label">Calories</div>
                        <div className="info-value">{workout.caloriesBurned}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="workout-info-item">
                      <FaFireAlt className={`info-icon calories-icon ${workout.type}`} />
                      <div className="info-content">
                        <div className="info-label">Calories</div>
                        <div className="info-value">Not tracked</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* New card-inside-card notes design */}
              {expandedIds.has(workout._id) && workout.notes && (
                <div className={`workout-notes-container ${workout.type}`}>
                  <div className="notes-card">
                    <div className="notes-card-header">
                      <div className={`notes-icon ${workout.type}`}>
                        <FaStickyNote />
                      </div>
                      <h6 className="notes-title">Workout Notes</h6>
                    </div>
                    <div className="notes-card-body">
                      <p className="notes-content">{workout.notes}</p>
                      <div className="notes-quote-mark">
                        <FaQuoteRight />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default WorkoutList

