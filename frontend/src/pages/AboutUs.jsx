import {
  FaGithub,
  FaLinkedin,
  FaHeartbeat,
  FaChartLine,
  FaUsers,
  FaRocket,
  FaLightbulb,
  FaHandshake,
} from "react-icons/fa"
import "../styles/about-contact-pages.css"

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Samah Ali",
      role: "Sr.Software Engineer",
      bio: `Passionate about building intuitive and responsive UIs with React, modern CSS, and Node.js. Skilled in HTML5, Bootstrap, Tailwind CSS, and Django.`,
      initial: "SA",
      image: null, // Add image URL if available
      github: "https://github.com/samahali/",
      linkedin: "https://www.linkedin.com/in/samah-ali-software-developer/"
    },
    {
      name: "Omnya Tarek",
      role: "Software Engineer",
      bio: "Passionate about building intuitive and responsive UIs with React, modern CSS, and Node.js. Skilled in HTML5, Bootstrap, UI/UX.",
      initial: "OT",
      image: null, // Add image URL if available
      github: "https://github.com/omnyatarek",
      linkedin: "https://www.linkedin.com/in/omnya137/",
    },
    {
      name: "Esraa Mostafa",
      role: "Software Engineer",
      bio: "Passionate about crafting seamless and user-friendly interfaces with React, modern CSS, and Node.js. Experienced in HTML5, Bootstrap.",
      initial: "EM",
      image: null, // Add image URL if available,
      github: "https://github.com/EsraaMo24",
      linkedin: "https://www.linkedin.com/in/esraa-mostafa243/",
    },
    {
      name: "Mariam Helmy",
      role: "Software Engineer",
      bio: "Dedicated to creating engaging and accessible web experiences using React, modern CSS, and Node.js. Proficient in HTML5, Bootstrap.",
      initial: "MH",
      image: null, // Add image URL if available
      github: "https://github.com/MariamHelmy44",
      linkedin: "https://www.linkedin.com/in/mariam-helmy/",
    },
  ]

  return (
    <div className="public-page about-us-page fade-in">
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold">About Us</h1>
          <div className="title-underline"></div>
        </div>

        <div className="mission-section">
          <div className="mission-header">
            <h2>Our Mission</h2>
            <p className="mission-tagline">Empowering Your Fitness Journey</p>
          </div>

          <div className="mission-content">
            <div className="mission-text">
              <p className="mission-intro">
                At FitPulse, we believe that everyone deserves access to tools that help them achieve their fitness
                goals. Our mission is to provide a comprehensive, user-friendly platform that empowers individuals to
                take control of their health and fitness journey.
              </p>

              <div className="mission-values">
                <div className="mission-value-item">
                  <div className="mission-value-icon">
                    <FaRocket />
                  </div>
                  <div className="mission-value-content">
                    <h3>Innovation</h3>
                    <p>
                      We constantly evolve our platform with cutting-edge features to provide the best fitness tracking
                      experience.
                    </p>
                  </div>
                </div>

                <div className="mission-value-item">
                  <div className="mission-value-icon">
                    <FaLightbulb />
                  </div>
                  <div className="mission-value-content">
                    <h3>Simplicity</h3>
                    <p>
                      We believe in making fitness tracking accessible to everyone with an intuitive, easy-to-use
                      interface.
                    </p>
                  </div>
                </div>

                <div className="mission-value-item">
                  <div className="mission-value-icon">
                    <FaHandshake />
                  </div>
                  <div className="mission-value-content">
                    <h3>Community</h3>
                    <p>We foster a supportive environment where users can share experiences and motivate each other.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mission-points-container">
              <div className="mission-point">
                <div className="mission-point-icon">
                  <FaHeartbeat />
                </div>
                <div className="mission-point-text">
                  <h4>Inspire Healthy Habits</h4>
                  <p>
                    We aim to inspire and motivate users to develop sustainable fitness habits that last a lifetime.
                  </p>
                </div>
              </div>
              <div className="mission-point">
                <div className="mission-point-icon">
                  <FaChartLine />
                </div>
                <div className="mission-point-text">
                  <h4>Track Progress</h4>
                  <p>
                    Our intuitive tools help you visualize your progress and celebrate every milestone along the way.
                  </p>
                </div>
              </div>
              <div className="mission-point">
                <div className="mission-point-icon">
                  <FaUsers />
                </div>
                <div className="mission-point-text">
                  <h4>Build Community</h4>
                  <p>
                    We're creating a supportive community where fitness enthusiasts can share experiences and motivate
                    each other.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mission-image-container">
            <img
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt="Fitness journey"
              className="mission-image"
            />
          </div>
        </div>

        <h2 className="text-center mb-4 mt-5">Our Team</h2>
        <div className="title-underline mb-5"></div>

        <div className="row g-4">
          {teamMembers.map((member, index) => (
            <div className="col-md-6 col-lg-3" key={index}>
              <div className="team-member-card">
                <div className="team-member-avatar">
                  {member.image ? (
                    <img src={member.image || "/placeholder.svg"} alt={member.name} className="avatar-image" />
                  ) : (
                    member.initial
                  )}
                </div>
                <h3 className="team-member-name">{member.name}</h3>
                <p className="team-member-role">{member.role}</p>
                <p className="team-member-bio">{member.bio}</p>
                <div className="team-member-social">
                  <a href={member.github} target="_blank" className="social-icon">
                    <FaGithub />
                  </a>
                  <a href={member.linkedin} target="_blank" className="social-icon">
                    <FaLinkedin />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AboutUs

