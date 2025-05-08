const express = require('express');
const router = express.Router();
const { VehicleType, Vehicle, Booking, sequelize } = require('../models/index');
const { Op } = require('sequelize');

router.get('/vehicle-types', async (req, res) => {
  const types = await VehicleType.findAll({ where: { wheels: req.query.wheels } });
  res.json(types);
});

router.get('/vehicles', async (req, res) => {
  const vehicles = await Vehicle.findAll({ where: { VehicleTypeId: req.query.typeId } });
  res.json(vehicles);
});

router.post('/book', async (req, res) => {
  const { firstName, lastName, vehicleId, startDate, endDate } = req.body;
  const conflict = await Booking.findOne({
    where: {
      VehicleId: vehicleId,
      [Op.or]: [
        { startDate: { [Op.between]: [startDate, endDate] } },
        { endDate: { [Op.between]: [startDate, endDate] } }
      ]
    }
  });
  if (conflict) return res.status(409).json({ error: 'Vehicle already booked.' });
  await Booking.create({ firstName, lastName, VehicleId: vehicleId, startDate, endDate });
  res.json({ message: 'Booking successful' });
});

module.exports = router;