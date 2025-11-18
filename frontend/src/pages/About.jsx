function About() {
  return (
    <div className="about-page">
      <div className="card">
        <h1 style={{ color: '#667eea', marginBottom: '1rem' }}>About EventEase</h1>
        <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#666' }}>
          EventEase is a modern event management platform designed to simplify how college 
          events are discovered, registered for, and managed. We eliminate the hassle of 
          manual registration and poor communication by digitizing the entire process.
        </p>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>Our Vision</h2>
        <p style={{ lineHeight: '1.8', color: '#666' }}>
          To create a one-stop solution for event discovery, participation, and management—all 
          within an elegant, mobile-friendly web application. We aim to increase student 
          engagement and make campus life more vibrant and connected.
        </p>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>Key Features</h2>
        <div className="grid">
          <div>
            <h4 style={{ color: '#667eea' }}>For Students</h4>
            <ul style={{ lineHeight: '2', color: '#666', marginTop: '0.5rem' }}>
              <li>Browse upcoming events</li>
              <li>One-click registration</li>
              <li>Real-time notifications</li>
              <li>Event calendar view</li>
              <li>Post-event feedback</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#667eea' }}>For Organizers</h4>
            <ul style={{ lineHeight: '2', color: '#666', marginTop: '0.5rem' }}>
              <li>Create and manage events</li>
              <li>Track participants</li>
              <li>Send announcements</li>
              <li>View analytics</li>
              <li>Export attendee lists</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>Technology Stack</h2>
        <p style={{ lineHeight: '1.8', color: '#666' }}>
          Built with modern web technologies including React.js, Node.js, Express.js, 
          and MongoDB. Our platform is designed to be fast, scalable, and user-friendly.
        </p>
      </div>

      <div className="card" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>Contact Us</h2>
        <p style={{ color: '#666' }}>Have questions or feedback?</p>
        <p style={{ color: '#667eea', fontSize: '1.2rem', marginTop: '0.5rem' }}>
          eventease@college.edu
        </p>
      </div>
    </div>
  );
}

export default About;