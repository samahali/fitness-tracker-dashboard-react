import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addGoal } from "../../redux/slices/goalSlice"
import { FaWeight, FaDumbbell, FaRunning, FaTrophy, FaEllipsisH, FaPlus } from "react-icons/fa"
import { GrYoga } from "react-icons/gr"

import "./GoalForm.css"

const GoalForm = ({ onSuccess }) => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.goals)

  const [formData, setFormData] = useState({
    goalType: "weight_loss",
    targetValue: "",
    unit: "kg",
    deadline: "",
    status: "in_progress",
  })

  const goalTypes = [
    { id: "weight_loss", name: "Weight Loss", icon: FaWeight, color: "#ef4444", unit: "kg" },
    { id: "muscle_gain", name: "Muscle Gain", icon: FaDumbbell, color: "#3a0ca3", unit: "kg" },
    { id: "endurance", name: "Endurance", icon: FaRunning, color: "#4361ee", unit: "km" },
    { id: "strength", name: "Strength", icon: FaTrophy, color: "#f59e0b", unit: "reps" },
    { id: "flexibility", name: "Flexibility", icon: GrYoga, color: "#10b981", unit: "minutes" },
    { id: "custom", name: "Custom Goal", icon: FaEllipsisH, color: "#8b5cf6", unit: "" },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "goalType") {
      const selectedGoalType = goalTypes.find((type) => type.id === value)
      setFormData({
        ...formData,
        [name]: value,
        unit: selectedGoalType?.unit || formData.unit,
      })
    } else {
      setFormData({
        ...formData,
        [name]: name === "targetValue" ? (value === "" ? "" : Number.parseFloat(value)) : value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await dispatch(addGoal(formData)).unwrap()
      setFormData({
        goalType: "weight_loss",
        targetValue: "",
        unit: "kg",
        deadline: "",
        status: "in_progress",
      })
      if (onSuccess) onSuccess()
    } catch (err) {
      console.error("Failed to add goal:", err)
    }
  }

  return (
    <div className="workout-form-card fade-in">
      <div className="workout-form-header">
        <h5 className="workout-form-title">Set New Goal</h5>
        <FaPlus className="workout-form-icon" />
      </div>
      <div className="workout-form-body">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="workout-type-selection">
            <label className="form-label">Goal Type</label>
            <div className="workout-type-grid">
              {goalTypes.map((type) => (
                <div className="workout-type-item" key={type.id}>
                  <input
                    type="radio"
                    id={`goalType-${type.id}`}
                    name="goalType"
                    value={type.id}
                    checked={formData.goalType === type.id}
                    onChange={handleChange}
                  />
                  <label htmlFor={`goalType-${type.id}`}>
                    <div className="workout-type-icon" style={{ color: type.color }}>
                      <type.icon />
                    </div>
                    <div className="workout-type-name">{type.name}</div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="targetValue" className="form-label">
                  Target Value
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="targetValue"
                  name="targetValue"
                  value={formData.targetValue}
                  onChange={handleChange}
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="unit" className="form-label">
                  Unit
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="deadline" className="form-label">
                  Deadline (Optional)
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
          </div>

          <div className="form-actions text-end">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                "Set Goal"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GoalForm

