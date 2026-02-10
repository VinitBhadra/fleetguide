const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/gps-guides', (req, res) => {
  res.render('gps-guides');
});

app.get('/transport-rules', (req, res) => {
  res.render('transport-rules');
});

app.get('/calculators', (req, res) => {
  res.render('calculators');
});

app.get('/fleet-reviews', (req, res) => {
  res.render('fleet-reviews');
});

app.get('/privacy-policy', (req, res) => {
  res.render('privacy-policy');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/terms', (req, res) => {
  res.render('terms');
});

// API endpoint for calculator
app.post('/api/calculate', (req, res) => {
  const { type, data } = req.body;
  let result = {};

  switch(type) {
    case 'fuel':
      const { distance, fuelPrice, mileage } = data;
      result = {
        fuelCost: ((distance / mileage) * fuelPrice).toFixed(2),
        fuelRequired: (distance / mileage).toFixed(2)
      };
      break;
    
    case 'trip':
      const { tripDistance, tripFuelPrice, tripMileage, driverCost, toll, other } = data;
      const fuelCost = (tripDistance / tripMileage) * tripFuelPrice;
      result = {
        fuelCost: fuelCost.toFixed(2),
        driverCost: parseFloat(driverCost || 0),
        tollCost: parseFloat(toll || 0),
        otherCost: parseFloat(other || 0),
        totalCost: (fuelCost + parseFloat(driverCost || 0) + parseFloat(toll || 0) + parseFloat(other || 0)).toFixed(2)
      };
      break;
    
    case 'costperkm':
      const { totalCost, totalDistance } = data;
      result = {
        costPerKM: (totalCost / totalDistance).toFixed(2)
      };
      break;
  }

  res.json(result);
});

// Start server
app.listen(PORT, () => {
  console.log(`FleetGuide.in server running on http://localhost:${PORT}`);
});
