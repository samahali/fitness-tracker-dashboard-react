import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { fetchWorkouts } from "../redux/slices/workoutSlice"
import { fetchGoals } from "../redux/slices/goalSlice"
import StatCard from "../components/dashboard/StatCard"
import WorkoutChart from "../components/dashboard/WorkoutChart"
import WorkoutTypeChart from "../components/dashboard/WorkoutTypeChart"
import GoalProgressChart from "../components/dashboard/GoalProgressChart"
import Loader from "../components/common/Loader"
import { FaDumbbell, FaClock, FaFire, FaTrophy, FaCalendarAlt, FaBullseye } from "react-icons/fa"

const Dashboard = () => {
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.auth)
  const { workouts, loading: workoutsLoading } = useSelector((state) => state.workouts)
  const { goals, loading: goalsLoading } = useSelector((state) => state.goals)

  useEffect(() => {
    dispatch(fetchWorkouts())
    dispatch(fetchGoals())
  }, [dispatch])

  if (workoutsLoading || goalsLoading) {
    return <Loader />
  }

  // Calculate stats directly
  const workoutStats = {
    totalWorkouts: workouts.length,
    totalDuration: workouts.reduce((sum, workout) => sum + workout.duration, 0),
    totalCalories: workouts.reduce((sum, workout) => sum + (workout.caloriesBurned || 0), 0),
  }

  // Calculate workout types
  const workoutTypes = {}
  workouts.forEach((workout) => {
    if (workoutTypes[workout.type]) {
      workoutTypes[workout.type]++
    } else {
      workoutTypes[workout.type] = 1
    }
  })

  // Get recent workouts
  const recentWorkouts = [...workouts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3)

  // Get active goals
  const activeGoals = goals.filter((goal) => goal.status === "in_progress")

  return (
    <div className="dashboard fade-in">
      <h1 className="page-title">Welcome, {currentUser?.firstName}!</h1>

      <div className="dashboard-grid">
        <div className="grid-col-3">
          <StatCard title="Total Workouts" value={workoutStats.totalWorkouts} icon={FaDumbbell} variant="primary" />
        </div>
        <div className="grid-col-3">
          <StatCard title="Total Minutes" value={workoutStats.totalDuration} icon={FaClock} variant="secondary" />
        </div>
        <div className="grid-col-3">
          <StatCard title="Calories Burned" value={workoutStats.totalCalories} icon={FaFire} variant="success" />
        </div>
        <div className="grid-col-3">
          <StatCard title="Active Goals" value={activeGoals.length} icon={FaBullseye} variant="warning" />
        </div>

        <div className="grid-col-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Weekly Workout Activity</h5>
              <div className="badge bg-light text-dark">Last 7 Days</div>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <WorkoutChart workouts={workouts} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid-col-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Workout Types</h5>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <WorkoutTypeChart workoutTypes={workoutTypes} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid-col-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Workouts</h5>
              <a href="/workouts" className="btn btn-sm btn-outline-primary">
                View All
              </a>
            </div>
            <div className="card-body">
              {recentWorkouts.length > 0 ? (
                <div>
                  {recentWorkouts.map((workout) => (
                    <div key={workout._id} className="premium-list-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <div
                              className="rounded-circle p-2"
                              style={{
                                backgroundColor: "rgba(99, 102, 241, 0.1)",
                                color: "var(--primary-color)",
                              }}
                            >
                              <FaDumbbell size={18} />
                            </div>
                          </div>
                          <div>
                            <h6 className="mb-0">{workout.exercise}</h6>
                            <small className="text-muted">
                              {workout.duration} minutes |{" "}
                              {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
                            </small>
                          </div>
                        </div>
                        <div>
                          <span className="badge bg-light text-dark">
                            <FaCalendarAlt className="me-1" />
                            {new Date(workout.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No workouts logged yet.</p>
                  <a href="/workouts" className="btn btn-primary mt-3">
                    Log Your First Workout
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid-col-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Active Goals</h5>
              <a href="/goals" className="btn btn-sm btn-outline-primary">
                View All
              </a>
            </div>
            <div className="card-body">
              {activeGoals.length > 0 ? (
                <div>
                  {activeGoals.map((goal) => (
                    <div key={goal._id} className="premium-list-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <div
                              className="rounded-circle p-2"
                              style={{
                                backgroundColor: "rgba(245, 158, 11, 0.1)",
                                color: "var(--warning-color)",
                              }}
                            >
                              <FaTrophy size={18} />
                            </div>
                          </div>
                          <div>
                            <h6 className="mb-0">
                              {goal.goalType
                                .split("_")
                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(" ")}
                            </h6>
                            <small className="text-muted">
                              Target: {goal.targetValue} {goal.unit}
                            </small>
                          </div>
                        </div>
                        <div>
                          {goal.deadline ? (
                            <span className="badge bg-light text-dark">
                              <FaCalendarAlt className="me-1" />
                              Due: {new Date(goal.deadline).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="badge bg-light text-dark">No deadline</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No active goals.</p>
                  <a href="/goals" className="btn btn-primary mt-3">
                    Set Your First Goal
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid-col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Goal Progress</h5>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <GoalProgressChart goals={goals} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

