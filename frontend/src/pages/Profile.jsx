import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateUserProfile } from "../redux/slices/authSlice"
import Loader from "../components/common/Loader"
import AvatarUpload from "../components/profile/AvatarUpload"

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
  })
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        age: currentUser.age || "",
        gender: currentUser.gender || "",
        weight: currentUser.weight || "",
        height: currentUser.height || "",
      })
    }
  }, [currentUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: ["age", "weight", "height"].includes(name) && value !== "" ? Number.parseFloat(value) : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess("")

    try {
      await dispatch(
        updateUserProfile({
          ...formData,
          profileImage: currentUser.profileImage, // Preserve the profile image
        }),
      ).unwrap()
      setSuccess("Profile updated successfully")
    } catch (err) {
      console.error("Profile update failed:", err)
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Your Profile</h2>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}

            <AvatarUpload currentUser={currentUser} />

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="firstName" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="lastName" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled
                />
                <small className="text-muted">Email cannot be changed</small>
              </div>

              <h5 className="mt-4 mb-3">Physical Information</h5>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="age" className="form-label">
                    Age
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="1"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="gender" className="form-label">
                    Gender
                  </label>
                  <select
                    className="form-select"
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="weight" className="form-label">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    step="0.1"
                    min="1"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="height" className="form-label">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    step="0.1"
                    min="1"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 mt-3" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

