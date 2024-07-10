const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const router = express.Router();

// Dashboard route (protected)
router.get('/', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'Authorization denied' });

    const decoded = jwt.verify(token, 'jwtSecret');
    if (!decoded) return res.status(401).json({ msg: 'Token is not valid' });

    const weatherResponse = await axios.get('http://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: 'London,uk',
        appid: 'your-openweathermap-api-key',
        units: 'metric'
      }
    });

    const weatherData = weatherResponse.data;
    res.json({ weatherData });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
