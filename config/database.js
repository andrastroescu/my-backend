// config/database.js

const { Sequelize } = require('sequelize');

// Initialize Sequelize with your MySQL database credentials
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost', // Change this to your database host
  port: 3306, // Change this to your database port
  username: 'root', // Change this to your database username
  password: 'pass123db', // Change this to your database password
  database: 'andradb', // Change this to your database name
});

// Test the database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = { sequelize, testConnection };
