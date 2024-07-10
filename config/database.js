// config/database.js

const { Sequelize } = require('sequelize');

require('dotenv').config(); // Load environment variables from .env file

// Initialize Sequelize with your MySQL database credentials
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test the database connection
async function testConnection() {
  try {
    console.log(sequelize.host);
    console.log(sequelize.port);
    console.log(sequelize.username);
    console.log(sequelize.password);
    console.log(sequelize.database);
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = { sequelize, testConnection };
