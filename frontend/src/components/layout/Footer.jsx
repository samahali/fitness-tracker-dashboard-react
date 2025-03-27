import { useSelector } from "react-redux"
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"
import "./Footer.css"

const Footer = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)

  // Simple footer for authenticated users
  if (isAuthenticated) {
    return (
      <footer className="footer simple-footer">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <p className="mb-0">&copy; {new Date().getFullYear()} FitPulse. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  // Detailed footer for public pages
  return (
    <footer className="footer detailed-footer">
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4">
            <div className="footer-info">
              <h3>FitPulse</h3>
              <p>
                Your ultimate fitness companion for tracking workouts, setting goals, and achieving your fitness dreams.
              </p>
              <div className="social-links mt-3">
                <a href="#" className="twitter">
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="#" className="facebook">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="instagram">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="linkedin">
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="footer-contact">
              <h4>Contact Us</h4>
              <p>
                <FaMapMarkerAlt className="me-2" />
                123 Fitness Street, Health City, FC 12345
              </p>
              <p>
                <FaPhone className="me-2" />
                +1 (555) 123-4567
              </p>
              <p>
                <FaEnvelope className="me-2" />
                support@fitpulse.com
              </p>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="footer-map">
              <h4>Find Us</h4>
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425882426901!3d40.74076927138946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1698791293853!5m2!1sen!2sus"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-12 text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} FitPulse. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

