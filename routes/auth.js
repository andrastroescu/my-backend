const express = require('express');
const bcrypt = require('bcrypt');
const { User, UserFriends } = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const {  email, password, firstName, lastName } = req.body;
        
        console.log(req.body);

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        const userr = 'user';
        const registrationDate = new Date();
        const status = 'active';

        // Create a new user record in the database
        const newUser = await User.create({
            username: email,
            email,
            password: hashedPassword,
            role: userr,
            first_name: firstName,
            last_name: lastName,
            registration_date: registrationDate,
            status: status
        });

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ where: { username } });

        // Verify user and password
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        console.log(process.env.JWT_SECRET)
        const secretKey = process.env.JWT_SECRET;

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role, firstName: user.first_name }, // Payload
            secretKey, // Secret key
            { expiresIn: '1h' } // Expiration time
        );

        // Send JWT in the response
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Unauthorized: Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

router.get('/protected', authenticateToken, (req, res) => {
    // Access user information from req.user
    res.json({ message: 'Protected route', user: req.user });
});

// Define a POST route for logout
router.post('/logout', (req, res) => {
    // Perform logout operations here
    // For example, clear the user session or perform any other necessary tasks
  
    // Respond with a success message
    res.status(200).json({ message: 'User logged out successfully.' });
  });

// Route to fetch all user data
router.get('/users', async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to fetch user data based on user ID
router.get('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        // Fetch user data from the database based on user ID
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update user data
router.put('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    const userData = req.body; // Assuming the request body contains the updated user data
    
    try {
      // Find the user by userId
      const user = await User.findByPk(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update user data
      await user.update(userData);
  
      res.status(200).json({ message: 'User data updated successfully' });
    } catch (error) {
      console.error('Error updating user data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

module.exports = router;
