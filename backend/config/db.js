const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // No deprecated options needed
    });

    console.log("Connected to DB:", mongoose.connection.name);
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("Mongo Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
