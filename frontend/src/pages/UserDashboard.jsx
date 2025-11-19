import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    // Fetch events on mount to show count
    fetchEventsForCount();
  }, [navigate]);

  const fetchEventsForCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get('http://localhost:5050/api/events', {
        headers: { 'x-auth-token': token }
      });
      // Sort events by date (newest first)
      const sortedEvents = response.data.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
      setEvents(sortedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const fetchEvents = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoadingEvents(true);
    try {
      const response = await axios.get('http://localhost:5050/api/events', {
        headers: { 'x-auth-token': token }
      });
      // Sort events by date (newest first)
      const sortedEvents = response.data.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
      setEvents(sortedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleNotificationsClick = () => {
    if (!showNotifications && events.length === 0) {
      fetchEvents();
    }
    setShowNotifications(!showNotifications);
  };

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
            {events.length > 0 ? `${events.length} event${events.length !== 1 ? 's' : ''} available` : 'Stay updated with new events'}
          </p>
          <button 
            className="btn btn-secondary" 
            style={{ marginTop: '1rem' }}
            onClick={handleNotificationsClick}
          >
            {showNotifications ? 'Hide Events' : 'View All Events'}
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

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: '#667eea' }}>📋 All Events</h3>
            <button 
              className="btn btn-secondary" 
              onClick={() => setShowNotifications(false)}
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            >
              Close
            </button>
          </div>

          {loadingEvents ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>Loading events...</p>
          ) : events.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No events available at the moment.</p>
          ) : (
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {events.map(event => (
                <div 
                  key={event._id} 
                  style={{ 
                    padding: '1rem', 
                    borderBottom: '1px solid #e0e0e0',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span 
                          className="event-category" 
                          style={{ 
                            fontSize: '0.75rem', 
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            textTransform: 'capitalize'
                          }}
                        >
                          {event.category}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: '#888' }}>
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 style={{ margin: '0.5rem 0', color: '#333' }}>{event.title}</h4>
                      <p style={{ 
                        color: '#666', 
                        fontSize: '0.9rem', 
                        margin: '0.5rem 0',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {event.description}
                      </p>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.85rem', color: '#888' }}>
                        <span>📍 {event.venue}</span>
                        <span>👥 {event.participants?.length || 0}/{event.maxParticipants}</span>
                        {event.organizer && (
                          <span>👤 {event.organizer.name || 'N/A'}</span>
                        )}
                      </div>
                    </div>
                    <Link to={`/events/${event._id}`}>
                      <button 
                        className="btn btn-primary" 
                        style={{ 
                          marginLeft: '1rem',
                          padding: '0.5rem 1rem',
                          fontSize: '0.9rem',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
