import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h1 style={{ fontSize: '3rem', color: '#667eea', marginBottom: '1rem' }}>
          Welcome to EventEase
        </h1>
        <p style={{ fontSize: '1.3rem', color: '#666', marginBottom: '2rem' }}>
          Discover, Register, and Manage Campus Events with Ease
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/events">
            <button className="btn btn-primary">Explore Events</button>
          </Link>
          <Link to="/register">
            <button className="btn btn-secondary">Get Started</button>
          </Link>
        </div>
      </div>

      <div className="grid" style={{ marginTop: '3rem' }}>
        <div className="card">
          <h3 style={{ color: '#667eea' }}>📅 Easy Registration</h3>
          <p>Register for events with just one click and receive instant confirmation</p>
        </div>
        <div className="card">
          <h3 style={{ color: '#667eea' }}>🔔 Live Updates</h3>
          <p>Get real-time notifications about event changes and updates</p>
        </div>
        <div className="card">
          <h3 style={{ color: '#667eea' }}>📊 Event Management</h3>
          <p>Organizers can easily create, manage, and track event participation</p>
        </div>
      </div>
    </div>
  );
}

export default Home;