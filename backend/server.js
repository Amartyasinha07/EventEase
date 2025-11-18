const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');   // ✅ You forgot this line
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Debug: show DB name to confirm correct database
mongoose.connection.on("connected", () => {
  console.log("Connected to DB:", mongoose.connection.name);
});

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'EventEase API Running' });
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
