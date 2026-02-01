// Cookie Consent Banner
(function() {
  // Check if consent has already been given
  if (localStorage.getItem('cookieConsent') === 'accepted') {
    return;
  }

  // Create consent banner
  const banner = document.createElement('div');
  banner.id = 'cookieConsent';
  banner.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%);
    color: white;
    padding: 1.5rem 2rem;
    box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    animation: slideUp 0.5s ease-out;
  `;

  banner.innerHTML = `
    <div style="flex: 1; min-width: 300px;">
      <p style="margin: 0; line-height: 1.6; font-size: 0.95rem;">
        🍪 We use cookies to enhance your experience and show personalized ads. 
        By continuing, you consent to our use of cookies. 
        <a href="/privacy-policy" style="color: #FF6B35; text-decoration: underline;">Learn more</a>
      </p>
    </div>
    <div style="display: flex; gap: 1rem; flex-shrink: 0;">
      <button id="acceptCookies" style="
        background: linear-gradient(135deg, #FF6B35 0%, #F7B801 100%);
        color: white;
        border: none;
        padding: 0.75rem 2rem;
        border-radius: 25px;
        font-weight: 700;
        cursor: pointer;
        font-size: 0.95rem;
        transition: transform 0.2s ease;
      ">
        Accept All
      </button>
      <button id="declineCookies" style="
        background: transparent;
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.3);
        padding: 0.75rem 1.5rem;
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        font-size: 0.95rem;
        transition: all 0.2s ease;
      ">
        Decline
      </button>
    </div>
  `;

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    #acceptCookies:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 16px rgba(255, 107, 53, 0.4);
    }
    #declineCookies:hover {
      border-color: rgba(255, 255, 255, 0.6);
      background: rgba(255, 255, 255, 0.1);
    }
    @media (max-width: 768px) {
      #cookieConsent {
        flex-direction: column;
        text-align: center;
      }
    }
  `;
  document.head.appendChild(style);

  // Add banner to page
  document.body.appendChild(banner);

  // Handle accept button
  document.getElementById('acceptCookies').addEventListener('click', function() {
    localStorage.setItem('cookieConsent', 'accepted');
    banner.style.animation = 'slideDown 0.5s ease-out';
    setTimeout(() => banner.remove(), 500);
    
    // Enable Google Analytics or other tracking here if needed
    console.log('Cookies accepted');
  });

  // Handle decline button
  document.getElementById('declineCookies').addEventListener('click', function() {
    localStorage.setItem('cookieConsent', 'declined');
    banner.style.animation = 'slideDown 0.5s ease-out';
    setTimeout(() => banner.remove(), 500);
    
    // Disable non-essential cookies
    console.log('Cookies declined - only essential cookies will be used');
  });

  // Add slideDown animation
  const slideDownStyle = document.createElement('style');
  slideDownStyle.textContent = `
    @keyframes slideDown {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(slideDownStyle);
})();
