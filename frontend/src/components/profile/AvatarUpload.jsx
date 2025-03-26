import { useState, useRef, useCallback } from "react"
import { useDispatch } from "react-redux"
import { updateUserProfile } from "../../redux/slices/authSlice"
import { FaCamera } from "react-icons/fa"
import Cropper from "react-easy-crop"
import { Modal, Button, ProgressBar } from "react-bootstrap"
import "./AvatarUpload.css"

const AvatarUpload = ({ currentUser }) => {
  const [previewImage, setPreviewImage] = useState(currentUser?.profileImage || null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)
  const dispatch = useDispatch()

  // New state for cropping functionality
  const [showCropModal, setShowCropModal] = useState(false)
  const [imageToEdit, setImageToEdit] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file type
    if (!file.type.match("image.*")) {
      alert("Please select an image file")
      return
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size should not exceed 2MB")
      return
    }

    // Create a preview and show cropper
    const reader = new FileReader()
    reader.onload = (event) => {
      setImageToEdit(event.target.result)
      setShowCropModal(true)
    }
    reader.readAsDataURL(file)
  }

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createCroppedImage = async () => {
    try {
      setLoading(true)
      const { blob, previewUrl } = await getCroppedImg(imageToEdit, croppedAreaPixels)

      // Set preview image for immediate visual feedback
      setPreviewImage(previewUrl)
      setShowCropModal(false)

      // Upload the image to backend
      try {
        const imageUrl = await uploadImageToBackend(blob)

        // Update user profile with the image URL from backend
        dispatch(
          updateUserProfile({
            ...currentUser,
            profileImage: imageUrl,
          }),
        )
          .then(() => {
            alert("Profile picture updated successfully")
          })
          .catch((err) => {
            toast.error(err.message || "Failed to update profile picture")
          })
          .finally(() => {
            setLoading(false)
          })
      } catch (error) {
        alert(error.message || "Failed to upload image")
        setLoading(false)
      }
    } catch (e) {
      alert(e.message || "Error processing image")
      setLoading(false)
    }
  }

  // Function to crop the image using Canvas API and convert to WebP
  const getCroppedImg = (imageSrc, pixelCrop) => {
    const image = new Image()
    image.src = imageSrc

    return new Promise((resolve, reject) => {
      image.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        // Set canvas dimensions to the cropped size
        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height

        // Draw the cropped image onto the canvas
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height,
        )

        // Convert to WebP format with quality 0.8 (80%)
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas is empty"))
              return
            }
            // Create a preview URL for display
            const previewUrl = URL.createObjectURL(blob)
            // Return both the blob and preview URL
            resolve({ blob, previewUrl })
          },
          "image/webp",
          0.8,
        )
      }

      image.onerror = () => {
        reject(new Error("Error loading image"))
      }
    })
  }

  // Function to upload image to backend
  const uploadImageToBackend = async (imageBlob) => {
    try {
      setLoading(true)
      setUploadProgress(0)

      // Create a file from the blob
      const fileName = `avatar-${Date.now()}.webp`
      const imageFile = new File([imageBlob], fileName, { type: "image/webp" })

      // Create FormData
      const formData = new FormData()
      formData.append("avatar", imageFile)

      // Get the API base URL from environment variable
      const apiBaseUrl = process.env.VITE_API_BASE_URL
      const uploadUrl = `${apiBaseUrl}/api/users/avatar`

      // Use XMLHttpRequest to track upload progress
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100)
            setUploadProgress(percentComplete)
          }
        })

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText)
              resolve(response.imageUrl) // Assuming backend returns the stored image URL
            } catch (error) {
              reject(new Error("Invalid response from server"))
            }
          } else {
            let errorMessage = "Upload failed"
            try {
              const response = JSON.parse(xhr.responseText)
              errorMessage = response.message || errorMessage
            } catch (e) {
              // If parsing fails, use the default error message
            }
            reject(new Error(errorMessage))
          }
        }

        xhr.onerror = () => reject(new Error("Network error during upload"))

        xhr.open("POST", uploadUrl)

        // Add authorization header if needed
        const token = localStorage.getItem("token")
        if (token) {
          xhr.setRequestHeader("Authorization", `Bearer ${token}`)
        }

        xhr.send(formData)
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }
  return (
    <div className="avatar-upload-container">
      <div className="avatar-preview" onClick={triggerFileInput}>
        {previewImage ? (
          <img src={previewImage || "/placeholder.svg"} alt="Profile" className="avatar-image" />
        ) : (
          <div className="avatar-initials">
            {currentUser?.firstName?.charAt(0)}
            {currentUser?.lastName?.charAt(0)}
          </div>
        )}
        <div className="avatar-overlay">
          {loading ? (
            <div className="spinner-border spinner-border-sm text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <FaCamera />
          )}
        </div>
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="d-none" />

      {/* Cropping Modal */}
      <Modal show={showCropModal} onHide={() => setShowCropModal(false)} centered size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Crop Profile Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="crop-container"
            style={{
              position: "relative",
              height: "400px",
              background: "#f0f0f0",
            }}
          >
            {imageToEdit && (
              <Cropper
                image={imageToEdit}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>

          <div className="d-flex justify-content-center align-items-center mt-3">
            <Button
              variant="outline-secondary"
              className="me-2"
              onClick={() => setZoom(Math.max(zoom - 0.1, 1))}
              disabled={zoom <= 1}
            >
              -
            </Button>
            <div className="px-3">
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="form-range"
                style={{ width: "200px" }}
              />
            </div>
            <Button
              variant="outline-secondary"
              className="ms-2"
              onClick={() => setZoom(Math.min(zoom + 0.1, 3))}
              disabled={zoom >= 3}
            >
              +
            </Button>
          </div>

          {loading && uploadProgress > 0 && (
            <div className="mt-3">
              <p className="mb-1">Processing image: {uploadProgress}%</p>
              <ProgressBar now={uploadProgress} animated variant="primary" />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCropModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={createCroppedImage} disabled={loading}>
            {loading ? "Processing..." : "Apply"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default AvatarUpload

