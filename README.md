# FleetGuide.in - Interactive Node.js Website

Vehicle GPS, Transport Rules & Fleet Cost Calculators platform built with Node.js and Express. **Fully integrated with Google AdSense for monetization.**

## Features

- **Interactive Calculators**: Fuel cost, trip cost, distance, and cost per KM calculators
- **GPS Guides**: Comprehensive guides on vehicle GPS systems and implementation
- **Transport Rules**: Indian transport regulations and compliance information
- **Fleet Reviews**: Expert reviews of popular commercial vehicles in India
- **Google AdSense Integration**: Strategic ad placements for monetization
- **Privacy Compliance**: GDPR-compliant cookie consent and privacy policy
- **Responsive Design**: Modern, mobile-friendly interface
- **Real-time Calculations**: AJAX-powered calculators with instant results

## Monetization

This website is **pre-configured with Google AdSense** for monetization:

✅ **Ad Placements:**
- Top banner ads on all pages
- In-feed ads between calculators
- Mid-content ads in articles
- Strategic placements for optimal revenue

✅ **Compliance:**
- Privacy Policy page included
- Cookie consent banner implemented
- GDPR and CCPA ready
- AdSense policy compliant

📘 **See ADSENSE_SETUP_GUIDE.md** for complete setup instructions
📊 **See MONETIZATION_STRATEGY.md** for revenue projections and growth plan

### Quick AdSense Setup:
1. Get AdSense account approved
2. Replace `ca-pub-XXXXXXXXXXXXXXXXX` with your Publisher ID
3. Replace ad slot IDs (YYYYYYYYYY, ZZZZZZZZZZ, etc.)
4. Deploy and start earning!

## Tech Stack

- **Backend**: Node.js + Express.js
- **View Engine**: EJS (Embedded JavaScript)
- **Frontend**: Vanilla JavaScript, CSS3
- **Design**: Custom responsive design with animations

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   Or for production:
   ```bash
   npm start
   ```

3. **Access the Application**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
fleetguide-app/
├── public/
│   ├── css/
│   │   └── style.css          # Main stylesheet
│   └── js/
│       └── main.js            # Client-side JavaScript
├── views/
│   ├── index.ejs              # Homepage
│   ├── gps-guides.ejs         # GPS guides page
│   ├── transport-rules.ejs    # Transport rules page
│   ├── calculators.ejs        # Calculators page
│   └── fleet-reviews.ejs      # Fleet reviews page
├── server.js                  # Express server
├── package.json              # Dependencies
└── README.md                 # This file
```

## API Endpoints

### POST /api/calculate
Calculate various fleet costs based on input parameters.

**Request Body:**
```json
{
  "type": "fuel" | "trip" | "costperkm",
  "data": {
    // Type-specific parameters
  }
}
```

**Response:**
```json
{
  // Calculation results
}
```

## Calculators

### 1. Fuel Cost Calculator
- Input: Distance, Fuel Price, Mileage
- Output: Fuel required, Total fuel cost

### 2. Trip Cost Calculator
- Input: Distance, Fuel Price, Mileage, Driver Cost, Toll, Other expenses
- Output: Breakdown of all costs and total trip cost

### 3. Distance Calculator
- Input: From Location, To Location
- Output: Distance between locations (requires Google Maps API integration)

### 4. Cost Per KM Calculator
- Input: Total Cost, Total Distance
- Output: Average cost per kilometer

## Customization

### Adding New Pages
1. Create a new EJS file in the `views/` directory
2. Add a route in `server.js`
3. Update navigation in all EJS files

### Styling
All styles are in `public/css/style.css`. The design uses:
- CSS Variables for theming
- CSS Grid and Flexbox for layouts
- CSS Animations for interactivity
- Google Fonts (Syne and DM Sans)

### Adding Features
- Client-side code: `public/js/main.js`
- Server-side code: `server.js`
- API endpoints: Add in `server.js`

## Future Enhancements

- Integration with Google Maps API for distance calculation
- User authentication and saved calculations
- PDF report generation
- Vehicle tracking dashboard
- Mobile app version
- Multi-language support

## Documentation

- **README.md** - This file (setup and overview)
- **ADSENSE_SETUP_GUIDE.md** - Complete Google AdSense integration guide
- **MONETIZATION_STRATEGY.md** - Revenue projections and growth strategies

## Dependencies

- **express**: ^4.18.2 - Web framework
- **ejs**: ^3.1.9 - Template engine
- **nodemon**: ^3.0.1 - Development auto-reload (dev dependency)

## Production Deployment

For production deployment:

1. Set environment variable:
   ```bash
   export PORT=3000
   ```

2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name fleetguide
   ```

3. Configure reverse proxy (nginx/Apache) for domain mapping

## License

© 2026 FleetGuide.in | Informational Website

## Contact

For questions or support, please visit the website or contact through the provided channels.
