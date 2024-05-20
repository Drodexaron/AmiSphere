const express = require('express');
const cookieParser = require('cookie-parser');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json')),
});

// Middleware to check authentication
const checkAuth = (req, res, next) => {
  const sessionCookie = req.cookies.session || '';
  admin.auth().verifySessionCookie(sessionCookie, true)
    .then(() => {
      next();
    })
    .catch(() => {
      res.redirect('/login.html');
    });
};

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Handle session login
app.post('/sessionLogin', (req, res) => {
  const idToken = req.body.idToken;
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  admin.auth().createSessionCookie(idToken, { expiresIn })
    .then((sessionCookie) => {
      const options = { maxAge: expiresIn, httpOnly: true, secure: true };
      res.cookie('session', sessionCookie, options);
      res.end(JSON.stringify({ status: 'success' }));
    })
    .catch((error) => {
      res.status(401).send('UNAUTHORIZED REQUEST!');
    });
});

// Protect the dashboard route
app.get('/dashboard.html', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
