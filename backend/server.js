require("dns").setServers(["8.8.8.8", "1.1.1.1"]);
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./src/routes/authRoutes');
const screeningRoutes = require('./src/routes/screeningRoutes');
const blockchainRoutes = require('./src/routes/blockchainRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/screening', screeningRoutes);
app.use('/api/blockchain', blockchainRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SeemaPrahari Backend is running!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
