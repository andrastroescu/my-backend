const express = require('express');
const axios = require('axios');
const cors = require('cors');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const authRoutes = require('./routes/auth');
const crudRoutes = require('./routes/crud');
const { sequelize, testConnection } = require('./config/database');

require('dotenv').config();

const app = express();

const passport = require('passport');
app.use(passport.initialize());


const PORT = process.env.PORT || 7000;

// Middleware
app.use(express.json()); // Parse JSON request bodies
// Allow requests from localhost:3000
const corsOptions = {
  origin: 'https://hammerhead-app-8vyv7.ondigitalocean.app', // Replace with your frontend domain
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Define routes
app.get('/', (req, res) => {
    testConnection();
    res.send('Hello from Express 2!');
});

app.post('/upload', (req, res) => {
    try {

        const file = req.body.image; // The uploaded file object
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = path.join(__dirname, 'uploads', file.name);
        fs.writeFileSync(filePath, file.data);

        res.status(200).json({ filePath }); // Return the file path
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/predict', async (req, res) => {
    try {
        const file = req.body.filePath; // Assuming the image is sent as a base64-encoded string
        if (!file) {
            return res.status(400).json({ error: 'No file path provided' });
        }

        const formData = new FormData();
        formData.append('image', fs.createReadStream(file));

        const response = await axios.post('http://localhost:5000/classify_image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...formData.getHeaders(),
            },
        });

        const prediction = response.data.prediction;
        res.json({ prediction });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// User authentication
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Incorrect username.' }); }
      if (!user.validPassword(password)) { return done(null, false, { message: 'Incorrect password.' }); }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.post('/login', 
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' })
);

app.post('/signup', function(req, res) {
  // Handle user registration
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


// Route that is accessible to all authenticated users
app.get('/profile', isAuthenticated, function(req, res) {
  // Render user profile
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Middleware function to check if the user has the admin role
function isAdmin(req, res, next) {
  // Assuming user role information is stored in req.user.role
  if (req.user && req.user.role === 'admin') {
      // User has the admin role, allow access to the route
      next();
  } else {
      // User does not have the admin role, return an unauthorized error
      res.status(403).json({ error: 'Unauthorized' });
  }
}

// Route that is protected and accessible only to admin users
app.get('/admin/dashboard', isAdmin, (req, res) => {
  // Route logic for admin dashboard
});

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/crud', crudRoutes);

module.exports = app;
