const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Officer = require('../models/Officer');

// POST /api/auth/register
// For setup only: Create a new officer account
router.post('/register', async (req, res) => {
  try {
    const { badgeNumber, password, name } = req.body;

    const existingOfficer = await Officer.findOne({ badgeNumber });
    if (existingOfficer) {
      return res.status(400).json({ error: 'Badge number already registered' });
    }

    const officer = new Officer({ badgeNumber, password, name });
    await officer.save();

    res.status(201).json({ message: 'Officer registered successfully!' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register officer' });
  }
});

// POST /api/auth/login
// Login and get JWT token
router.post('/login', async (req, res) => {
  try {
    const { badgeNumber, password } = req.body;

    // 1. Find the officer
    const officer = await Officer.findOne({ badgeNumber });
    if (!officer) {
      return res.status(401).json({ error: 'Invalid badge number or password' });
    }

    // 2. Check the password
    const isMatch = await officer.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid badge number or password' });
    }

    // 3. Generate JWT Token
    const payload = {
      officer: {
        id: officer.id,
        badgeNumber: officer.badgeNumber,
        name: officer.name
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '12h' }, // Token valid for a 12 hour shift
      (err, token) => {
        if (err) throw err;
        res.json({ token, officer: payload.officer });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;
