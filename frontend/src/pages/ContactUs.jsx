import { useState } from "react"
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaHeadset, FaComments } from "react-icons/fa"
import "../styles/about-contact-pages.css"

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Simulate form submission
    setFormStatus({
      submitted: true,
      success: true,
      message: "Thank you for your message! We will get back to you soon.",
    })

    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
  }

  return (
    <div className="public-page contact-us-page fade-in">
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold">Contact Us</h1>
          <div className="title-underline"></div>
        </div>

        <div className="row g-5">
          <div className="col-lg-5">
            <div className="contact-info-card">
              <div className="contact-header">
                <FaHeadset className="contact-header-icon" />
                <h2>Get In Touch</h2>
              </div>
              <p className="contact-intro">
                Have questions about FitPulse? Want to provide feedback or report an issue? We'd love to hear from you!
                Fill out the form or use one of the contact methods below.
              </p>

              <div className="contact-methods">
                <div className="contact-method">
                  <div className="contact-icon">
                    <FaEnvelope />
                  </div>
                  <div>
                    <h5>Email</h5>
                    <p>
                      <a href="mailto:support@fitpulse.com">support@fitpulse.com</a>
                    </p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="contact-icon">
                    <FaPhone />
                  </div>
                  <div>
                    <h5>Phone</h5>
                    <p>
                      <a href="tel:+15551234567">+1 (555) 123-4567</a>
                    </p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="contact-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h5>Address</h5>
                    <p>123 Fitness Street, Health City, FC 12345</p>
                  </div>
                </div>
              </div>

              <div className="contact-social">
                <h5>Connect With Us</h5>
                <div className="social-icons">
                  <a href="#" className="social-icon" aria-label="Facebook">
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a href="#" className="social-icon" aria-label="Twitter">
                    <i className="bi bi-twitter"></i>
                  </a>
                  <a href="#" className="social-icon" aria-label="Instagram">
                    <i className="bi bi-instagram"></i>
                  </a>
                  <a href="#" className="social-icon" aria-label="LinkedIn">
                    <i className="bi bi-linkedin"></i>
                  </a>
                </div>
              </div>

              <div className="contact-map mt-4">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425882426901!3d40.74076927138946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1698791293853!5m2!1sen!2sus"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Our Location"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="contact-form-card">
              <div className="contact-header">
                <FaComments className="contact-header-icon" />
                <h2>Send a Message</h2>
              </div>

              {formStatus.submitted && (
                <div className={`alert ${formStatus.success ? "alert-success" : "alert-danger"} mb-4`}>
                  {formStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <div className="form-group mb-3">
                      <label htmlFor="name">Your Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group mb-3">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group mb-3">
                      <label htmlFor="subject">Subject</label>
                      <input
                        type="text"
                        className="form-control"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group mb-3">
                      <label htmlFor="message">Message</label>
                      <textarea
                        className="form-control"
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-primary btn-lg">
                      <FaPaperPlane className="me-2" /> Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
