const { VehicleType, Vehicle, sequelize } = require('../models/index');

(async () => {
  await sequelize.sync({ force: true });

  const carTypes = await VehicleType.bulkCreate([
    { name: 'Hatchback', wheels: 4 },
    { name: 'SUV', wheels: 4 },
    { name: 'Sedan', wheels: 4 },
    { name: 'Cruiser', wheels: 2 }
  ]);

  await Vehicle.bulkCreate([
    { name: 'Honda Jazz', VehicleTypeId: carTypes[0].id },
    { name: 'Hyundai Creta', VehicleTypeId: carTypes[1].id },
    { name: 'Skoda Slavia', VehicleTypeId: carTypes[2].id },
    { name: 'Royal Enfield Meteor', VehicleTypeId: carTypes[3].id }
  ]);

  console.log('Database seeded successfully');
})();
