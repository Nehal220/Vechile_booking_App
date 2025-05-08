import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Typography,
  Container,
  Grid,
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper
} from '@mui/material';

const MultiStepForm = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    wheels: '',
    typeId: '',
    vehicleId: '',
    dates: { start: '', end: '' }
  });
  const [types, setTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const steps = ['Personal Info', 'Wheel Type', 'Vehicle Type', 'Vehicle', 'Dates'];

  useEffect(() => {
    if (form.wheels) {
      axios.get(`http://localhost:3001/vehicle-types?wheels=${form.wheels}`)
        .then(res => setTypes(res.data))
        .catch(console.error);
    }
  }, [form.wheels]);

  useEffect(() => {
    if (form.typeId) {
      axios.get(`http://localhost:3001/vehicles?typeId=${form.typeId}`)
        .then(res => setVehicles(res.data))
        .catch(console.error);
    }
  }, [form.typeId]);

  const handleNext = () => {
    if (
      (step === 0 && (!form.firstName || !form.lastName)) ||
      (step === 1 && !form.wheels) ||
      (step === 2 && !form.typeId) ||
      (step === 3 && !form.vehicleId) ||
      (step === 4 && (!form.dates.start || !form.dates.end))
    ) {
      alert('Please fill in all required fields.');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    axios.post('http://localhost:3001/book', {
      firstName: form.firstName,
      lastName: form.lastName,
      vehicleId: form.vehicleId,
      startDate: form.dates.start,
      endDate: form.dates.end
    })
      .then(() => alert('Booking successful'))
      .catch(err => alert(err?.response?.data?.error || 'Submission failed'));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url('https://cdn.pixabay.com/photo/2024/07/13/07/40/cars-8891625_640.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        py: 6,
        px: 2,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(2px)',
          zIndex: 1
        }
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Paper elevation={10} sx={{
          borderRadius: 3,
          p: 4,
          background: 'linear-gradient(135deg, #ffffffcc, #e3f2fdcc)',
          backdropFilter: 'blur(10px)'
        }}>
          <Typography variant="h4" align="center" fontWeight="bold" gutterBottom color="primary">
            Book Your Ride
          </Typography>

          <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>
                  <Typography variant="body2" fontWeight="bold">{label}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step content */}
          {step === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="First Name" variant="outlined"
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Last Name" variant="outlined"
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                />
              </Grid>
            </Grid>
          )}

          {step === 1 && (
            <RadioGroup
              value={form.wheels}
              onChange={e => setForm({ ...form, wheels: e.target.value })}
            >
              <FormControlLabel value="2" control={<Radio />} label="2 Wheels" />
              <FormControlLabel value="4" control={<Radio />} label="4 Wheels" />
            </RadioGroup>
          )}

          {step === 2 && (
            <RadioGroup
              value={form.typeId}
              onChange={e => setForm({ ...form, typeId: e.target.value })}
            >
              {types.map(t => (
                <FormControlLabel
                  key={t.id}
                  value={t.id.toString()}
                  control={<Radio />}
                  label={t.name}
                />
              ))}
            </RadioGroup>
          )}

          {step === 3 && (
            <RadioGroup
              value={form.vehicleId}
              onChange={e => setForm({ ...form, vehicleId: e.target.value })}
            >
              {vehicles.map(v => (
                <FormControlLabel
                  key={v.id}
                  value={v.id.toString()}
                  control={<Radio />}
                  label={v.name}
                />
              ))}
            </RadioGroup>
          )}

          {step === 4 && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  InputLabelProps={{ shrink: true }}
                  value={form.dates.start}
                  onChange={e => setForm({ ...form, dates: { ...form.dates, start: e.target.value } })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="End Date"
                  InputLabelProps={{ shrink: true }}
                  value={form.dates.end}
                  onChange={e => setForm({ ...form, dates: { ...form.dates, end: e.target.value } })}
                />
              </Grid>
            </Grid>
          )}

          {/* Navigation buttons */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            {step > 0 && (
              <Button variant="outlined" onClick={handleBack}>
                Back
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button variant="contained" color="primary" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button variant="contained" color="success" onClick={handleSubmit}>
                Submit
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default MultiStepForm;
