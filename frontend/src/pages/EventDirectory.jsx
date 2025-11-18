import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function EventDirectory() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.category === filter);

  if (loading) {
    return <div className="card">Loading events...</div>;
  }

  return (
    <div className="events-page">
      <div className="card">
        <h1 style={{ color: '#667eea', marginBottom: '1rem' }}>Event Directory</h1>
        <p style={{ marginBottom: '2rem' }}>Discover and register for upcoming campus events</p>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ marginRight: '1rem', fontWeight: '600' }}>Filter by Category:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '5px', border: '2px solid #e0e0e0' }}
          >
            <option value="all">All Events</option>
            <option value="technical">Technical</option>
            <option value="cultural">Cultural</option>
            <option value="sports">Sports</option>
            <option value="workshop">Workshop</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid">
        {filteredEvents.length === 0 ? (
          <div className="card">No events found</div>
        ) : (
          filteredEvents.map(event => (
            <Link key={event._id} to={`/events/${event._id}`} style={{ textDecoration: 'none' }}>
              <div className="event-card">
                <span className="event-category">{event.category}</span>
                <h3>{event.title}</h3>
                <p style={{ color: '#666', margin: '0.5rem 0' }}>
                  {event.description.substring(0, 100)}...
                </p>
                <p style={{ fontSize: '0.9rem', color: '#888' }}>
                  📅 {new Date(event.date).toLocaleDateString()}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#888' }}>
                  📍 {event.venue}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '0.5rem' }}>
                  👥 {event.participants?.length || 0}/{event.maxParticipants} registered
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default EventDirectory;