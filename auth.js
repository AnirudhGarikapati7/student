const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');

const router = express.Router();
const db = admin.firestore();

// Signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRef = db.collection('users').doc(email);
    const doc = await userRef.get();

    if (doc.exists) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userRef.set({ email, password: hashedPassword });

    res.status(201).json({ msg: 'User registered' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email });

  try {
    const userRef = db.collection('users').doc(email);
    const doc = await userRef.get();

    if (!doc.exists) {
      console.log('User not found:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, doc.data().password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: doc.data().email }, 'jwtSecret', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server Error');
  }
});

