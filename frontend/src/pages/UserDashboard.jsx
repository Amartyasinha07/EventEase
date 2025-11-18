import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function UserDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, [navigate]);

  if (!user) {
    return <div className="card">Loading...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="card">
        <h1 style={{ color: '#667eea' }}>Welcome, {user.name}!</h1>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          Role: <strong>{user.role}</strong>
        </p>
      </div>

      <div className="grid" style={{ marginTop: '2rem' }}>

        {/* My Registered Events */}
        <div className="card">
          <h3 style={{ color: '#667eea' }}>📅 My Registered Events</h3>
          <p style={{ marginTop: '1rem', color: '#666' }}>
            View and manage your registered events here
          </p>

          <Link to="/my-events">
            <button className="btn btn-secondary" style={{ marginTop: '1rem' }}>
              View Events
            </button>
          </Link>
        </div>

        {/* Notifications */}
        <div className="card">
          <h3 style={{ color: '#667eea' }}>🔔 Notifications</h3>
          <p style={{ marginTop: '1rem', color: '#666' }}>
            Stay updated with event changes and announcements
          </p>
          <button className="btn btn-secondary" style={{ marginTop: '1rem' }}>
            View All
          </button>
        </div>

        {/* Organizer-only: Create Event */}
        {user.role === 'organizer' && (
          <div className="card">
            <h3 style={{ color: '#667eea' }}>➕ Create Event</h3>
            <p style={{ marginTop: '1rem', color: '#666' }}>
              Organize a new campus event
            </p>
            <Link to="/create-event">
              <button className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Create New Event
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Account Information */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ color: '#667eea' }}>Account Information</h3>
        <div style={{ marginTop: '1rem' }}>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Account Type:</strong> {user.role}</p>
          <p><strong>Member Since:</strong> {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
