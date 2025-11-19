const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'name email').sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    console.error('Error fetching event:', err);
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message 
    });
  }
});

// Create event (protected route)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, date, venue, maxParticipants } = req.body;

    const newEvent = new Event({
      title,
      description,
      category,
      date,
      venue,
      maxParticipants,
      organizer: req.user._id
    });

    const event = await newEvent.save();
    res.status(201).json(event);
  } catch (err) {
    console.error('Error creating event:', err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors 
      });
    }
    
    // Handle other errors
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message 
    });
  }
});

// Register for event
router.post('/:id/register', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered - convert ObjectIds to strings for comparison
    const userIdString = req.user._id.toString();
    const isRegistered = event.participants.some(
      participant => participant.toString() === userIdString
    );
    
    if (isRegistered) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Check capacity
    if (event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' });
    }

    event.participants.push(req.user._id);
    await event.save();

    // Populate organizer before sending response
    await event.populate('organizer', 'name email');

    res.json({ message: 'Successfully registered for event', event });
  } catch (err) {
    console.error('Error registering for event:', err);
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message 
    });
  }
});

module.exports = router;