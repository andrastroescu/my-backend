// config/database.js

const { Sequelize } = require('sequelize');

require('dotenv').config(); // Load environment variables from .env file

// Initialize Sequelize with your MySQL database credentials
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'db-mysql-fra1-32128-do-user-16235664-0.a.db.ondigitalocean.com',
  port: 25060,
  username: 'doadmin',
  password: 'AVNS_46iBWiHB5iV9mWFd436',
  database: 'defaultdb',
});

// Test the database connection
async function testConnection() {
  try {
    console.log(sequelize.host);
    console.log(sequelize.port);
    console.log(sequelize.username);
    console.log(sequelize.password);
    console.log(sequelize.getDatabaseName);
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = { sequelize, testConnection };
