import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventDirectory from './pages/EventDirectory';
import EventDetails from './pages/EventDetails';
import UserDashboard from './pages/UserDashboard';
import About from './pages/About';
import CreateEvent from './pages/CreateEvent';
import MyRegisteredEvents from "./pages/MyRegisteredEvents";


function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events" element={<EventDirectory />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/my-events" element={<MyRegisteredEvents />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;