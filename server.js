const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const serviceAccount = require('./Key.json'); // Update with your own service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://final-project-b681e.firebaseio.com' // Update with your Firestore database URL
});

const db = admin.firestore();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./auth');
const dashboardRoutes = require('./dashboard');
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
