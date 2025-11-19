import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      await checkUserAuth();
      await fetchEventDetails();
    };
    loadData();
  }, [id]);

  const checkUserAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://localhost:5050/api/auth/me', {
          headers: { 'x-auth-token': token }
        });
        setCurrentUserId(response.data._id);
      } catch (err) {
        console.error('Error fetching user:', err);
        setCurrentUserId(null);
      }
    } else {
      setCurrentUserId(null);
    }
  };

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5050/api/events/${id}`);
      const eventData = response.data;
      setEvent(eventData);
    } catch (err) {
      console.error('Error fetching event:', err);
      setMessage(err.response?.data?.message || 'Event not found');
    } finally {
      setLoading(false);
    }
  };

  // Re-check registration status when currentUserId or event changes
  useEffect(() => {
    if (event && currentUserId) {
      const userIdString = currentUserId.toString();
      const registered = event.participants?.some(
        participant => participant.toString() === userIdString || 
                      (typeof participant === 'object' && participant._id && participant._id.toString() === userIdString)
      );
      setIsRegistered(registered || false);
    }
  }, [event, currentUserId]);

  const handleRegister = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    setRegistering(true);
    setMessage('');

    try {
      await axios.post(
        `http://localhost:5050/api/events/${id}/register`,
        {},
        { headers: { 'x-auth-token': token } }
      );
      setMessage('Successfully registered for the event!');
      setIsRegistered(true);
      fetchEventDetails(); // Refresh event data
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return <div className="card">Loading event details...</div>;
  }

  if (!event) {
    return <div className="card">Event not found</div>;
  }

  return (
    <div className="event-details-page">
      <div className="card">
        <span className="event-category">{event.category}</span>
        <h1 style={{ color: '#667eea', margin: '1rem 0' }}>{event.title}</h1>
        
        <div style={{ display: 'grid', gap: '1rem', margin: '2rem 0' }}>
          <p><strong>📅 Date:</strong> {new Date(event.date).toLocaleString()}</p>
          <p><strong>📍 Venue:</strong> {event.venue}</p>
          <p><strong>👤 Organizer:</strong> {event.organizer?.name || 'N/A'}</p>
          <p><strong>👥 Participants:</strong> {event.participants?.length || 0}/{event.maxParticipants}</p>
        </div>

        <h3 style={{ marginTop: '2rem' }}>Description</h3>
        <p style={{ lineHeight: '1.6', color: '#666' }}>{event.description}</p>

        {message && (
          <div className={`alert ${message.includes('Success') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        {!currentUserId ? (
          <button 
            onClick={() => navigate('/login')}
            className="btn btn-primary"
            style={{ marginTop: '2rem' }}
          >
            Login to Register
          </button>
        ) : isRegistered ? (
          <div className="alert alert-success" style={{ marginTop: '2rem' }}>
            ✓ You are registered for this event
          </div>
        ) : (
          <button 
            onClick={handleRegister}
            className="btn btn-primary"
            style={{ marginTop: '2rem' }}
            disabled={registering || event.participants?.length >= event.maxParticipants}
          >
            {registering ? 'Registering...' : 
             event.participants?.length >= event.maxParticipants ? 'Event Full' : 
             'Register for Event'}
          </button>
        )}
      </div>
    </div>
  );
}

export default EventDetails;