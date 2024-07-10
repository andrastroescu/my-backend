const express = require('express');
const router = express.Router();
const { Class, Material, Component, Characteristic, ClassCharacteristic, Classification, Image } = require('../models/waste-products');
const authenticateToken = require('./auth'); // Import the authenticateToken middleware
const sequelize = require('../config/database');
const { User, UserFriends } = require('../models/user');
const nodemailer = require('nodemailer');

// Apply authentication middleware to the routes you want to protect
router.use(authenticateToken);

// Create a new class
router.post('/classes', async (req, res) => {
    try {
        const { className, characteristics } = req.body.name;
        const newClass = await Class.create({ name: className });

        // If characteristics are provided, add them to the class
        if (characteristics && characteristics.length > 0) {
            await Promise.all(characteristics.map(async (characteristic) => {
                // Create each ClassCharacteristic and associate it with the new class
                

                // Create associated Characteristic
                const newCharacteristic = await Characteristic.create({
                   
                    percentage: characteristic.percentage,
                });
                const newClassCharacteristic = await ClassCharacteristic.create({
                    spec: characteristic.spec,
                    Additional_Info: characteristic.Additional_Info,
                    CLASS_ID: newClass.id, // Associate the ClassCharacteristic with the newly created class
                    CHARACTERISTIC_ID: newCharacteristic.id // Associate the ClassCharacteristic with the newly created class

                });
            }));
        }

        res.status(201).json(newClass);
    } catch (error) {
        console.error('Error creating class:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Get all classes
router.get('/classes', async (req, res) => {
    try {
        const classes = await Class.findAll();
        res.json(classes);
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a class
router.put('/classes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updatedClass = await Class.update({ name }, { where: { id } });
        res.json(updatedClass);
    } catch (error) {
        console.error('Error updating class:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a class
router.delete('/classes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Class.destroy({ where: { id } });
        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting class:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new material
router.post('/materials', async (req, res) => {
    try {
        const { name } = req.body;
        const newMaterial = await Material.create({ name });
        res.status(201).json(newMaterial);
    } catch (error) {
        console.error('Error creating material:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all materials
router.get('/materials', async (req, res) => {
    try {
        const materials = await Material.findAll();
        res.json(materials);
    } catch (error) {
        console.error('Error fetching materials:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a material
router.put('/materials/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updatedMaterial = await Material.update({ name }, { where: { id } });
        res.json(updatedMaterial);
    } catch (error) {
        console.error('Error updating material:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a material
router.delete('/materials/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Material.destroy({ where: { id } });
        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting material:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new component
router.post('/components', async (req, res) => {
    try {
        const { name } = req.body;
        const newComponent = await Component.create({ name });
        res.status(201).json(newComponent);
    } catch (error) {
        console.error('Error creating component:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all components
router.get('/components', async (req, res) => {
    try {
        const components = await Component.findAll();
        res.json(components);
    } catch (error) {
        console.error('Error fetching components:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a component
router.put('/components/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updatedComponent = await Component.update({ name }, { where: { id } });
        res.json(updatedComponent);
    } catch (error) {
        console.error('Error updating component:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a component
router.delete('/components/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Component.destroy({ where: { id } });
        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting component:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new class characteristic
router.post('/classcharacteristics', async (req, res) => {
    try {
        const { spec, Additional_Info, characteristicId, classId } = req.body;
        const newClassCharacteristic = await ClassCharacteristic.create({ spec, Additional_Info, characteristicId, classId });
        res.status(201).json(newClassCharacteristic);
    } catch (error) {
        console.error('Error creating class characteristic:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all class characteristics
router.get('/classcharacteristics', async (req, res) => {
    try {
        const classCharacteristics = await ClassCharacteristic.findAll();
        res.json(classCharacteristics);
    } catch (error) {
        console.error('Error fetching class characteristics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a class characteristic
router.put('/classcharacteristics/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { spec, additionalInfo, characteristicId, classId } = req.body;
        const updatedClassCharacteristic = await ClassCharacteristic.update(
            { spec, additionalInfo, characteristicId, classId },
            { where: { id } }
        );
        res.json(updatedClassCharacteristic);
    } catch (error) {
        console.error('Error updating class characteristic:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a class characteristic
router.delete('/classcharacteristics/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await ClassCharacteristic.destroy({ where: { id } });
        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting class characteristic:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Backend API endpoint to fetch details of a class by ID
router.get('/class/:id/details', async (req, res) => {
    try {
        const classId = req.params.id;
        // Query the database to retrieve details of the class by its ID
        const classDetails = await Class.findByPk(classId, {
            include: [
                {
                    model: ClassCharacteristic,
                    include: [
                        {
                            model: Characteristic,
                            include: [Material, Component] // Include Material and Component through Characteristic
                        }
                    ]
                }
            ]
        });
        res.status(200).json(classDetails);
    } catch (error) {
        console.error('Error fetching class details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update Class Details
router.put('/class/:id/details', async (req, res) => {
    try {
        const classId = req.params.id;
        const updatedClassDetails = req.body;
        const updatedCharacteristics = updatedClassDetails.ClassCharacteristics;
        console.log("req body :");
        console.log(updatedClassDetails);
        console.log("req body end________");

        // Update class details
        await Class.update({ name: updatedClassDetails.name }, { where: { id: classId } });

        // Update associated ClassCharacteristics and their associated Characteristics
        for (const characteristic of updatedCharacteristics) {
            console.log("characteristic____________");
            console.log(characteristic);
            console.log("characteristic____________");

            // Update ClassCharacteristic
            await ClassCharacteristic.update(
                { spec: characteristic.spec, Additional_Info: characteristic.Additional_Info },
                { where: { id: characteristic.id } }
            );

            // Update associated Characteristic
            await Characteristic.update(
                { 
                    Material_Id: characteristic.Characteristic.Material_Id,
                    Component_Id: characteristic.Characteristic.Component_Id,
                    percentage: characteristic.Characteristic.percentage,
                    env_impact: characteristic.Characteristic.env_impact,
                    disposal_method: characteristic.Characteristic.disposal_method,
                    regulatory_compliance: characteristic.Characteristic.regulatory_compliance,
                    notes: characteristic.Characteristic.notes,
                    volume: characteristic.Characteristic.volume,
                    cost: characteristic.Characteristic.cost,
                    weight: characteristic.Characteristic.weight,
                    source: characteristic.Characteristic.source,
                    facility: characteristic.Characteristic.facility,
                    footprint: characteristic.Characteristic.footprint,
                    ecoType: characteristic.Characteristic.ecoType,
                    eco_type: characteristic.Characteristic.eco_type,
                },
                { where: { id: characteristic.Characteristic.id } }
            );

            // Update Material if exists
            if (characteristic.Characteristic.Material) {
                await Material.update(
                    {
                        name: characteristic.Characteristic.Material.name,
                        description: characteristic.Characteristic.Material.description,
                        cost_per_unit: characteristic.Characteristic.Material.cost_per_unit,
                        eco_type: characteristic.Characteristic.Material.eco_type,
                        eco_score: characteristic.Characteristic.Material.eco_score
                    },
                    { where: { id: characteristic.Characteristic.Material.id } }
                );
            }

            // Update Component if exists
            if (characteristic.Characteristic.Component) {
                await Component.update(
                    {
                        name: characteristic.Characteristic.Component.name,
                        description: characteristic.Characteristic.Component.description,
                        supplier: characteristic.Characteristic.Component.supplier,
                        cost: characteristic.Characteristic.Component.cost,
                        isrecyclable: characteristic.Characteristic.Component.isrecyclable,
                        status: characteristic.Characteristic.Component.status,
                        storage_location: characteristic.Characteristic.Component.storage_location
                    },
                    { where: { id: characteristic.Characteristic.Component.id } }
                );
            }
        }

        res.status(200).send({ message: 'Class details updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred while updating class details' });
    }
});


// Delete Class
router.delete('/class/:id', async (req, res) => {
    try {
        const classId = req.params.id;
        // Delete class from the database
        await Class.destroy({ where: { id: classId }});
        res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
        console.error('Error deleting class:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a New Class with Characteristics
router.post('/class', async (req, res) => {
    try {
        const newClassDetails = req.body;
        const newCharacteristics = newClassDetails.characteristics;

        // Create new class
        const newClass = await Class.create({ name: newClassDetails.className });

        // Create associated ClassCharacteristics and their associated Characteristics
        for (const characteristic of newCharacteristics) {
            // Create ClassCharacteristic
            const newClassCharacteristic = await ClassCharacteristic.create({
                classId: newClass.id,
                spec: characteristic.spec,
                Additional_Info: characteristic.Additional_Info
            });

            // Create associated Characteristic
            await Characteristic.create({
                ClassCharacteristicId: newClassCharacteristic.id,
                Material_Id: characteristic.Material_Id,
                Component_Id: characteristic.Component_Id,
                percentage: characteristic.percentage
            });
        }

        res.status(201).json({ message: 'Class and characteristics created successfully' });
    } catch (error) {
        console.error('Error creating class and characteristics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Authorization middleware
const isAdmin = (req, res, next) => {
    // Extract user role from JWT token or session
    const userRole = req.user.role; // Assuming the user role is stored in req.user
    console.log(userRole);
    // Check if the user is an admin
    if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized: Admin access required' });
    }

    // User is authorized, proceed to the next middleware
    next();
};

// Apply the isAdmin middleware to the product form route
router.get('/product-form', isAdmin, async (req, res) => {
    try {
        // Fetch any necessary data for rendering the form
        const formData = {}; // Add any necessary data here

        // Send back the data along with a success message
        res.status(200).json({ message: 'User is authorized', formData });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Fetch classification frequency data
router.get('/classification-frequency/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        // Query your database to fetch the user's classification frequency data
        const classificationFrequencyData = await Classification.findAll({
            attributes: [
                [sequelize.sequelize.fn('YEAR', sequelize.sequelize.col('timestamp')), 'year'],
                [sequelize.sequelize.fn('MONTH', sequelize.sequelize.col('timestamp')), 'month'],
                [sequelize.sequelize.fn('COUNT', sequelize.sequelize.col('*')), 'classificationCount']
            ],
            where: { USER_ID: userId },
            group: [sequelize.sequelize.fn('YEAR', sequelize.sequelize.col('timestamp')), sequelize.sequelize.fn('MONTH', sequelize.sequelize.col('timestamp'))],
            order: [[sequelize.sequelize.fn('YEAR', sequelize.sequelize.col('timestamp')), 'ASC'], [sequelize.sequelize.fn('MONTH', sequelize.sequelize.col('timestamp')), 'ASC']]
        });
        res.json(classificationFrequencyData);
    } catch (error) {
        console.error('Error fetching classification frequency data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Define the route handler for fetching stacked bar chart data
router.get('/stacked-bar-chart-data/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Fetch data from the database
      const userData = await User.findByPk(userId, {
        attributes: [
          'TotalRecognitionFrequency',
          'EcologicalFootprintScore',
          'EnvironmentalImpact'
        ]
      });
  
      if (!userData) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Extract stacked bar chart data from the user object
      const totalRecognitionFrequency = userData.TotalRecognitionFrequency;
      const ecologicalFootprintScore = userData.EcologicalFootprintScore;
      const environmentalImpact = userData.EnvironmentalImpact;
  
      // Prepare the data in the desired format
      const stackedBarData = {
        totalRecognitionFrequency: totalRecognitionFrequency,
        ecologicalFootprintScore: ecologicalFootprintScore,
        environmentalImpact: environmentalImpact
      };
  
      // Send the fetched data as JSON response
      res.json(stackedBarData);
    } catch (error) {
      console.error('Error fetching stacked bar chart data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });  

// Endpoint to retrieve images by User ID
router.get('/images/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        // Fetch image data from the database based on userId
        const images = await Image.findAll({ where: { USER_ID: userId } });

        // Construct an array to hold image blobs
        const imageBlobs = [];
        for (const image of images) {
            const imageData = image.file_path;
            imageBlobs.push(imageData);
        }

        // Set appropriate headers for the response
        res.setHeader('Content-Type', 'blob');

        // Send the array of image blobs in the response
        res.send(images[0].file_path);
    } catch (error) {
        console.error('Error retrieving images:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Fetch comparative ecological footprint data for all users
router.get('/footprint/comparative', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'TotalRecognitionFrequency', 'EcologicalFootprintScore', 'EnvironmentalImpact']
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching comparative footprint data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Fetch specific user's ecological footprint data
router.get('/footprint/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            total_recognition_frequency: user.TotalRecognitionFrequency,
            ecological_footprint_score: user.EcologicalFootprintScore,
            environmental_impact: user.EnvironmentalImpact
        });
    } catch (error) {
        console.error('Error fetching user footprint data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET endpoint to retrieve all data about a user
router.get('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        // Query the database to fetch all data about the user by their ID
        const userData = await User.findByPk(userId);
        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET endpoint to retrieve all materials recognized by a user
router.get('/materials/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const classifications = await Classification.findAll({
        where: { user_id: userId },
        include: {
          model: Class,
          include: {
            model: ClassCharacteristic,
            include: {
              model: Characteristic,
              include: {
                model: Material,
                attributes: ['name']
              }
            }
          }
        },
        attributes: []
      });
  
      const materialNames = new Set();
      classifications.forEach(classification => {
        classification.Class.ClassCharacteristics.forEach(classChar => {
          materialNames.add(classChar.Characteristic.Material.name);
        });
      });
  
      res.json(Array.from(materialNames));
    } catch (error) {
      console.error('Error fetching materials:', error);
      res.status(500).json({ error: error.message });
    }
  });

// Endpoint to fetch users ranked by environmental impact
router.get('/users-rankings', async (req, res) => {
    try {
        const users = await User.findAll({
            order: [['EnvironmentalImpact', 'DESC']],
            attributes: ['id', 'username', 'EnvironmentalImpact', 'first_name']
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching user rankings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to add a friend
router.post('/users/:id/add-friend', async (req, res) => {
    const userId = req.params.id;
    const { friendId } = req.body;
    try {
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const friend = await User.findByPk(friendId);
        if (!friend) return res.status(404).json({ error: 'Friend not found' });

        await user.addFriend(friend); // Many-to-Many relationship
        res.status(200).json({ message: 'Friend added successfully' });
    } catch (error) {
        console.error('Error adding friend:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use any email service you prefer
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

router.post('/invite-friend', async (req, res) => {
    const { email } = req.body;

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Invite to Join Our Platform',
        text: 'You have been invited to join our platform. Click the link to register.'
        // You can use HTML content here too
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Invite sent successfully!' });
    } catch (error) {
        console.error('Error sending invite:', error);
        res.status(500).json({ error: 'Error sending invite' });
    }
});

module.exports = router;