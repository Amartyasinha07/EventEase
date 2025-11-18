import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function MyRegisteredEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    loadEvents(token);
  }, [navigate]);

  const loadEvents = async (token) => {
    try {
      // Fetch REAL logged in user from backend (not localStorage)
      const userRes = await axios.get("http://localhost:5050/api/auth/me", {
        headers: { "x-auth-token": token }
      });

      const userId = userRes.data._id;

      console.log("Actual logged-in user ID:", userId);

      // Fetch all events
      const eventRes = await axios.get("http://localhost:5050/api/events", {
        headers: { "x-auth-token": token }
      });

      console.log("Events from backend:", eventRes.data);

      // Filter events where user is a participant
      const registered = eventRes.data.filter(event =>
        event.participants?.some(p => p.toString() === userId.toString())
      );

      console.log("Matched registered events:", registered);

      setEvents(registered);

    } catch (err) {
      console.error("Error fetching registered events:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="card">Loading your registered events...</div>;

  return (
    <div className="event-directory-page">
      <div className="card">
        <h1 style={{ color: "#667eea" }}>📅 My Registered Events</h1>
        <p style={{ marginTop: "0.5rem", color: "#666" }}>
          These are the events you've signed up for.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="card">
          <p style={{ color: "#666" }}>
            You haven't registered for any events yet.
          </p>
        </div>
      ) : (
        <div className="grid">
          {events.map(event => (
            <div className="card" key={event._id}>
              <span className="event-category">{event.category}</span>
              <h2 style={{ color: "#667eea", marginTop: "1rem" }}>{event.title}</h2>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
              <p><strong>Venue:</strong> {event.venue}</p>

              <Link to={`/events/${event._id}`}>
                <button className="btn btn-primary" style={{ marginTop: "1rem" }}>
                  View Details
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRegisteredEvents;
