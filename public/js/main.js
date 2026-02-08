// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Fuel Cost Calculator
const fuelForm = document.getElementById('fuelForm');
if (fuelForm) {
  fuelForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const distance = parseFloat(document.getElementById('distance').value);
    const fuelPrice = parseFloat(document.getElementById('fuelPrice').value);
    const mileage = parseFloat(document.getElementById('mileage').value);
    
    if (!distance || !fuelPrice || !mileage) {
      alert('Please fill in all fields');
      return;
    }
    
    const btn = e.target.querySelector('.calculate-btn');
    const originalText = btn.textContent;
    btn.innerHTML = '<span class="loading"></span>';
    btn.disabled = true;
    
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'fuel',
          data: { distance, fuelPrice, mileage }
        })
      });
      
      const result = await response.json();
      
      document.getElementById('fuelResult').innerHTML = `
        <h4>Calculation Result</h4>
        <p>Fuel Required: <span class="result-value">${result.fuelRequired} L</span></p>
        <p>Total Fuel Cost: <span class="result-value">₹${result.fuelCost}</span></p>
      `;
      document.getElementById('fuelResult').classList.add('show');
    } catch (error) {
      alert('Error calculating fuel cost');
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}

// Trip Cost Calculator
const tripForm = document.getElementById('tripForm');
if (tripForm) {
  tripForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const tripDistance = parseFloat(document.getElementById('tripDistance').value);
    const tripFuelPrice = parseFloat(document.getElementById('tripFuelPrice').value);
    const tripMileage = parseFloat(document.getElementById('tripMileage').value);
    const driverCost = parseFloat(document.getElementById('driverCost').value) || 0;
    const toll = parseFloat(document.getElementById('toll').value) || 0;
    const other = parseFloat(document.getElementById('other').value) || 0;
    
    if (!tripDistance || !tripFuelPrice || !tripMileage) {
      alert('Please fill in required fields (Distance, Fuel Price, Mileage)');
      return;
    }
    
    const btn = e.target.querySelector('.calculate-btn');
    const originalText = btn.textContent;
    btn.innerHTML = '<span class="loading"></span>';
    btn.disabled = true;
    
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'trip',
          data: { tripDistance, tripFuelPrice, tripMileage, driverCost, toll, other }
        })
      });
      
      const result = await response.json();
      
      document.getElementById('tripResult').innerHTML = `
        <h4>Trip Cost Breakdown</h4>
        <p>Fuel Cost: <span class="result-value">₹${result.fuelCost}</span></p>
        <p>Driver Cost: <span class="result-value">₹${result.driverCost}</span></p>
        <p>Toll Charges: <span class="result-value">₹${result.tollCost}</span></p>
        <p>Other Expenses: <span class="result-value">₹${result.otherCost}</span></p>
        <p style="border-top: 2px solid var(--primary); padding-top: 0.5rem; margin-top: 0.5rem;">
          <strong>Total Trip Cost: <span class="result-value">₹${result.totalCost}</span></strong>
        </p>
      `;
      document.getElementById('tripResult').classList.add('show');
    } catch (error) {
      alert('Error calculating trip cost');
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}

// Distance Calculator (using Google Maps API would be ideal, but for now simple calculation)
const distanceForm = document.getElementById('distanceForm');
if (distanceForm) {
  distanceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const from = document.getElementById('fromLocation').value;
    const to = document.getElementById('toLocation').value;
    
    if (!from || !to) {
      alert('Please enter both locations');
      return;
    }
    
    // For demo purposes - In production, integrate with Google Maps Distance Matrix API
    document.getElementById('distanceResult').innerHTML = `
      <h4>Distance Calculation</h4>
      <p style="color: var(--secondary);">
        To get accurate distance between <strong>${from}</strong> and <strong>${to}</strong>, 
        please integrate with Google Maps API or similar service.
      </p>
      <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.8;">
        This is a demo version. Contact us to enable live distance calculation.
      </p>
    `;
    document.getElementById('distanceResult').classList.add('show');
  });
}

// Cost Per KM Calculator
const costPerKmForm = document.getElementById('costPerKmForm');
if (costPerKmForm) {
  costPerKmForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const totalCost = parseFloat(document.getElementById('totalCost').value);
    const totalDistance = parseFloat(document.getElementById('totalDistance').value);
    
    if (!totalCost || !totalDistance) {
      alert('Please fill in all fields');
      return;
    }
    
    const btn = e.target.querySelector('.calculate-btn');
    const originalText = btn.textContent;
    btn.innerHTML = '<span class="loading"></span>';
    btn.disabled = true;
    
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'costperkm',
          data: { totalCost, totalDistance }
        })
      });
      
      const result = await response.json();
      
      document.getElementById('costPerKmResult').innerHTML = `
        <h4>Calculation Result</h4>
        <p>Cost per Kilometer: <span class="result-value">₹${result.costPerKM}/km</span></p>
        <p style="font-size: 0.9rem; opacity: 0.8; margin-top: 0.5rem;">
          Based on total cost of ₹${totalCost} over ${totalDistance} km
        </p>
      `;
      document.getElementById('costPerKmResult').classList.add('show');
    } catch (error) {
      alert('Error calculating cost per KM');
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}

// Add intersection observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
    }
  });
}, observerOptions);

document.querySelectorAll('.calculator-card').forEach(card => {
  observer.observe(card);
});

// Animate feature cards on scroll
document.querySelectorAll('.feature-card').forEach((card, index) => {
  card.style.opacity = '0';
  observer.observe(card);
  card.addEventListener('animationend', () => {
    card.style.opacity = '1';
  });
});

// Animate step cards
document.querySelectorAll('.step-card').forEach((card, index) => {
  card.style.opacity = '0';
  card.style.animationDelay = `${index * 0.1}s`;
  observer.observe(card);
  card.addEventListener('animationend', () => {
    card.style.opacity = '1';
  });
});

// Animate stats when visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumber = entry.target.querySelector('.stat-number');
      if (statNumber && !statNumber.classList.contains('animated')) {
        animateNumber(statNumber);
        statNumber.classList.add('animated');
      }
    }
  });
}, observerOptions);

document.querySelectorAll('.stat-card').forEach(card => {
  statsObserver.observe(card);
});

// Animate numbers counting up
function animateNumber(element) {
  const text = element.textContent;
  const hasPlus = text.includes('+');
  const hasStar = text.includes('★');
  const value = parseFloat(text.replace(/[+,★]/g, ''));
  
  if (isNaN(value)) return;
  
  const duration = 2000;
  const steps = 60;
  const increment = value / steps;
  let current = 0;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= value) {
      current = value;
      clearInterval(timer);
    }
    
    let displayValue = Math.floor(current);
    if (text.includes(',')) {
      displayValue = displayValue.toLocaleString();
    }
    if (text.includes('.')) {
      displayValue = current.toFixed(1);
    }
    
    element.textContent = displayValue + (hasPlus ? '+' : '') + (hasStar ? '★' : '');
  }, duration / steps);
}

// FAQ toggle functionality (if you want to make them collapsible later)
document.querySelectorAll('.faq-item h3').forEach(question => {
  question.style.cursor = 'pointer';
  question.addEventListener('click', () => {
    const answer = question.nextElementSibling;
    const isOpen = answer.style.display === 'block';
    
    // Optional: Toggle answer visibility
    // answer.style.display = isOpen ? 'none' : 'block';
  });
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add hover effect to insight cards
document.querySelectorAll('.insight-card').forEach(card => {
  observer.observe(card);
});

// Add entrance animation to use case cards
document.querySelectorAll('.use-case-card').forEach((card, index) => {
  card.style.opacity = '0';
  card.style.animationDelay = `${index * 0.15}s`;
  observer.observe(card);
  card.addEventListener('animationend', () => {
    card.style.opacity = '1';
  });
});

// Track calculator usage (for analytics - optional)
document.querySelectorAll('.calculate-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const calculatorType = e.target.closest('.calculator-card').querySelector('h3').textContent;
    console.log(`Calculator used: ${calculatorType}`);
    // You can send this to Google Analytics if set up:
    // gtag('event', 'calculator_use', { calculator_type: calculatorType });
  });
});

