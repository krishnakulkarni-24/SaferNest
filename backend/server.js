// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:4200', // Angular dev server
  credentials: true
}));
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes (we'll define these next)
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/help-requests', require('./routes/helpRequestRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// Simple root route for health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'SaferNest API is running' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));