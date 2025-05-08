const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Fix: Explicitly define the dialect when using DB_URL
const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres', // Required when using connection URI
  logging: false,      // Optional: disable logging
});

// Define models
const VehicleType = sequelize.define('VehicleType', {
  name: DataTypes.STRING,
  wheels: DataTypes.INTEGER,
});

const Vehicle = sequelize.define('Vehicle', {
  name: DataTypes.STRING,
});

const Booking = sequelize.define('Booking', {
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  startDate: DataTypes.DATEONLY,
  endDate: DataTypes.DATEONLY,
});

// Set up relationships
Vehicle.belongsTo(VehicleType);
Booking.belongsTo(Vehicle);

// Export for use in app
module.exports = {
  sequelize,
  VehicleType,
  Vehicle,
  Booking,
};
