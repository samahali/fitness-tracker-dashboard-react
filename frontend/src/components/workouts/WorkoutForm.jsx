import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addWorkout } from "../../redux/slices/workoutSlice";
import { FaRunning, FaDumbbell, FaBalanceScale, FaEllipsisH, FaPlus } from "react-icons/fa";
import { GrYoga } from "react-icons/gr"
import "./WorkoutForm.css";

const WorkoutForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.workouts);

  const [formData, setFormData] = useState({
    type: "cardio",
    exercise: "",
    duration: "",
    caloriesBurned: "",
    notes: "",
  });

  const workoutTypes = [
    { id: "cardio", name: "Cardio", icon: FaRunning, color: "#4361ee" },
    { id: "strength", name: "Strength", icon: FaDumbbell, color: "#3a0ca3" },
    { id: "flexibility", name: "Flexibility", icon: GrYoga, color: "#7209b7" },
    { id: "balance", name: "Balance", icon: FaBalanceScale, color: "#f72585" },
    { id: "other", name: "Other", icon: FaEllipsisH, color: "#4cc9f0" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "duration" || name === "caloriesBurned" ? (value === "" ? "" : Number.parseInt(value, 10)) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(addWorkout(formData)).unwrap();
      setFormData({
        type: "cardio",
        exercise: "",
        duration: "",
        caloriesBurned: "",
        notes: "",
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Failed to add workout:", err);
    }
  };

  return (
    <div className="workout-form-card fade-in">
      <div className="workout-form-header">
        <h5 className="workout-form-title">Log New Workout</h5>
      </div>
      <div className="workout-form-body">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="workout-type-selection">
            <label className="form-label">Workout Type</label>
            <div className="workout-type-grid">
              {workoutTypes.map((type) => (
                <div className="workout-type-item" key={type.id}>
                  <input
                    type="radio"
                    id={`type-${type.id}`}
                    name="type"
                    value={type.id}
                    checked={formData.type === type.id}
                    onChange={handleChange}
                  />
                  <label htmlFor={`type-${type.id}`}>
                    <div className="workout-type-icon" style={{ color: type.color }}>
                      <type.icon />
                    </div>
                    <div className="workout-type-name">{type.name}</div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="exercise" className="form-label">
              Exercise Name
            </label>
            <input
              type="text"
              className="form-control"
              id="exercise"
              name="exercise"
              value={formData.exercise}
              onChange={handleChange}
              placeholder="e.g., Running, Bench Press, Yoga"
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="duration" className="form-label">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="caloriesBurned" className="form-label">
                  Calories Burned (optional)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="caloriesBurned"
                  name="caloriesBurned"
                  value={formData.caloriesBurned}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              Notes (optional)
            </label>
            <textarea
              className="form-control"
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Add any additional notes about your workout"
            ></textarea>
          </div>

          {/* Button aligned to the right */}
          <div className="form-actions text-end">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                "Log Workout"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutForm;
