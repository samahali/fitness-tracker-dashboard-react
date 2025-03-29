import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateGoalStatus, deleteGoal } from "../../redux/slices/goalSlice"
import {
  FaTrash,
  FaRedo,
  FaCalendarAlt,
  FaFlag,
  FaWeight,
  FaDumbbell,
  FaRunning,
  FaHandRock,
  FaRegSadTear,
  FaTrophy,
  FaEllipsisH,
  FaExpandAlt,
  FaCompressAlt,
  FaStopwatch,
  FaStickyNote,
  FaQuoteRight,
  FaBullseye,
} from "react-icons/fa"
import { GrYoga } from "react-icons/gr";

import "./GoalList.css"

const GoalList = () => {
  const dispatch = useDispatch()
  const { goals, loading } = useSelector((state) => state.goals)
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

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline"
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const handleStatusChange = async (id, status) => {
    try {
      await dispatch(updateGoalStatus({ id, status })).unwrap()
    } catch (error) {
      console.error("Error updating goal status:", error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        await dispatch(deleteGoal(id)).unwrap()
      } catch (error) {
        console.error("Error deleting goal:", error)
      }
    }
  }

  const getGoalTypeIcon = (type) => {
    switch (type) {
      case "weight_loss":
        return <FaWeight />
      case "muscle_gain":
        return <FaDumbbell />
      case "endurance":
        return <FaRunning />
      case "strength":
        return <FaHandRock />
      case "flexibility":
        return <GrYoga />
      default:
        return <FaEllipsisH />
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "in_progress":
        return "In Progress"
      case "achieved":
        return "Achieved"
      case "failed":
        return "Failed"
      default:
        return "Unknown"
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

  if (goals.length === 0) {
    return (
      <div className="empty-goals-container">
        <div className="empty-goals-icon">
          <FaFlag />
        </div>
        <h3>No goals set yet</h3>
        <p>Start by setting your first fitness goal!</p>
      </div>
    )
  }

  return (
    <div className="goals-list-container">
      {goals.map((goal) => (
        <div key={goal._id} className="goal-card-wrapper">
          <div className={`goal-card ${goal.goalType}`}>
            <div className="goal-card-header">
              <div className="goal-type-container">
                <div className={`goal-type-badge ${goal.goalType}`}>{getGoalTypeIcon(goal.goalType)}</div>
                <div className="goal-type-text">
                  {goal.goalType
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </div>
              </div>
              <div className="goal-title-spacer"></div>
              <div className="goal-actions">
                <button
                  className="btn-action btn-expand"
                  onClick={() => toggleExpand(goal._id)}
                  title={expandedIds.has(goal._id) ? "Collapse" : "Expand"}
                >
                  {expandedIds.has(goal._id) ? <FaCompressAlt /> : <FaExpandAlt />}
                </button>
                <button className="btn-action btn-delete" onClick={() => handleDelete(goal._id)} title="Delete Goal">
                  <FaTrash />
                </button>
              </div>
            </div>

            <div className="goal-card-body">
              <div className="goal-info-grid">
                {/* Target value in its own section */}
                <div className="goal-info-item goal-info-target">
                  <div className={`info-icon target-icon ${goal.goalType}`}>
                    <FaBullseye />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Target</div>
                    <div className="info-value target-value">
                      <span className="value-number">{goal.targetValue}</span>
                      <span className="value-unit">{goal.unit}</span>
                    </div>
                  </div>
                </div>

                {/* Date on top row with background icon */}
                <div className="goal-info-item goal-info-date">
                  <div className={`info-icon date-icon ${goal.goalType}`}>
                    <FaCalendarAlt />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Deadline</div>
                    <div className="info-value">{formatDate(goal.deadline)}</div>
                  </div>
                </div>

                {/* Status with simple colored icons */}
                <div className="goal-info-item">
                  <FaStopwatch className={`info-icon status-icon ${goal.goalType}`} />
                  <div className="info-content">
                    <div className="info-label">Status</div>
                    <div className="info-value">{getStatusLabel(goal.status)}</div>
                  </div>
                </div>
              </div>

              {/* Status change buttons */}
              {expandedIds.has(goal._id) && (
                <div className={`goal-status-container ${goal.goalType}`}>
                  <div className="status-card">
                    <div className="status-card-header">
                      <div className={`status-icon ${goal.goalType}`}>
                        <FaStickyNote />
                      </div>
                      <h6 className="status-title">Update Status</h6>
                    </div>
                    <div className="status-card-body">
                      <div className="status-actions-expanded">
                        <button
                          className="btn-status-expanded btn-achieved"
                          onClick={() => handleStatusChange(goal._id, "achieved")}
                          disabled={goal.status === "achieved"}
                        >
                          <FaTrophy /> <span>Mark as Achieved</span>
                        </button>
                        <button
                          className="btn-status-expanded btn-failed"
                          onClick={() => handleStatusChange(goal._id, "failed")}
                          disabled={goal.status === "failed"}
                        >
                          <FaRegSadTear /> <span>Mark as Failed</span>
                        </button>
                        {(goal.status === "achieved" || goal.status === "failed") && (
                          <button
                            className="btn-status-expanded btn-reset"
                            onClick={() => handleStatusChange(goal._id, "in_progress")}
                          >
                            <FaRedo /> <span>Reset to In Progress</span>
                          </button>
                        )}
                      </div>
                      <div className="status-quote-mark">
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

export default GoalList

