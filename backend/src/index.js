require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

// Use connection string from .env
const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  logging: false,
});

// Define models
const VehicleType = sequelize.define('VehicleType', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  wheels: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

const Vehicle = sequelize.define('Vehicle', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

const Booking = sequelize.define('Booking', {
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  startDate: DataTypes.DATEONLY,
  endDate: DataTypes.DATEONLY,
});

// Set relationships
Vehicle.belongsTo(VehicleType, { foreignKey: { allowNull: false } });
Booking.belongsTo(Vehicle, { foreignKey: { allowNull: false } });

// Sync database
sequelize.sync({ alter: true })  // Use alter:true during dev only
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

// Export models and sequelize instance
module.exports = {
  sequelize,
  VehicleType,
  Vehicle,
  Booking,
};
