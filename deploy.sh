#!/bin/bash

###############################################################################
# FleetGuide.in Automated Deployment Script for DigitalOcean/Ubuntu
# This script automates the entire deployment process
###############################################################################

set -e  # Exit on any error

echo "=========================================="
echo "FleetGuide.in Deployment Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}➜ $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run as root (use: sudo bash deploy.sh)"
    exit 1
fi

print_info "Starting deployment process..."
echo ""

# Step 1: Update system
print_info "Step 1/10: Updating system packages..."
apt update -qq && apt upgrade -y -qq
print_success "System updated"
echo ""

# Step 2: Install Node.js
print_info "Step 2/10: Installing Node.js 18 LTS..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs -qq
    print_success "Node.js installed ($(node -v))"
else
    print_success "Node.js already installed ($(node -v))"
fi
echo ""

# Step 3: Install Nginx
print_info "Step 3/10: Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    apt install nginx -y -qq
    print_success "Nginx installed"
else
    print_success "Nginx already installed"
fi
echo ""

# Step 4: Install PM2
print_info "Step 4/10: Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2 --silent
    print_success "PM2 installed"
else
    print_success "PM2 already installed"
fi
echo ""

# Step 5: Install Certbot for SSL
print_info "Step 5/10: Installing Certbot..."
if ! command -v certbot &> /dev/null; then
    apt install certbot python3-certbot-nginx -y -qq
    print_success "Certbot installed"
else
    print_success "Certbot already installed"
fi
echo ""

# Step 6: Create application directory
print_info "Step 6/10: Creating application directory..."
mkdir -p /var/www/fleetguide
print_success "Directory created at /var/www/fleetguide"
echo ""

# Step 7: Install application dependencies
print_info "Step 7/10: Installing application dependencies..."
cd /var/www/fleetguide

# Check if package.json exists
if [ -f "package.json" ]; then
    npm install --production --silent
    print_success "Dependencies installed"
else
    print_error "package.json not found! Please upload your code to /var/www/fleetguide first"
    echo ""
    echo "To upload your code, run from your local machine:"
    echo "scp -r fleetguide-app/* root@YOUR_SERVER_IP:/var/www/fleetguide/"
    exit 1
fi
echo ""

# Step 8: Configure Nginx
print_info "Step 8/10: Configuring Nginx..."
cat > /etc/nginx/sites-available/fleetguide.in << 'EOF'
server {
    listen 80;
    server_name fleetguide.in www.fleetguide.in;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site and remove default
ln -sf /etc/nginx/sites-available/fleetguide.in /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
if nginx -t -q; then
    systemctl restart nginx
    print_success "Nginx configured and restarted"
else
    print_error "Nginx configuration test failed"
    exit 1
fi
echo ""

# Step 9: Start application with PM2
print_info "Step 9/10: Starting application with PM2..."
cd /var/www/fleetguide

# Stop existing process if running
pm2 delete fleetguide 2>/dev/null || true

# Start application
pm2 start server.js --name fleetguide --time
pm2 save
pm2 startup systemd -u root --hp /root >/dev/null

print_success "Application started with PM2"
echo ""

# Step 10: Configure firewall
print_info "Step 10/10: Configuring firewall..."
ufw --force enable
ufw allow OpenSSH >/dev/null
ufw allow 'Nginx Full' >/dev/null
print_success "Firewall configured"
echo ""

# Display server info
echo "=========================================="
echo "Deployment Complete! 🎉"
echo "=========================================="
echo ""
SERVER_IP=$(curl -s ifconfig.me)
echo "Server IP: $SERVER_IP"
echo "Application running on: http://localhost:3000"
echo "Nginx proxying to: http://$SERVER_IP"
echo ""
echo "Next Steps:"
echo "1. Point your domain DNS to this IP: $SERVER_IP"
echo "   - Type: A, Name: @, Value: $SERVER_IP"
echo "   - Type: A, Name: www, Value: $SERVER_IP"
echo ""
echo "2. Wait for DNS propagation (10-60 minutes)"
echo ""
echo "3. Install SSL certificate:"
echo "   sudo certbot --nginx -d fleetguide.in -d www.fleetguide.in"
echo ""
echo "4. Check application status:"
echo "   pm2 status"
echo "   pm2 logs fleetguide"
echo ""
echo "5. Your website will be available at:"
echo "   https://fleetguide.in"
echo "   https://www.fleetguide.in"
echo ""
echo "=========================================="
echo "Useful Commands:"
echo "=========================================="
echo "View logs:          pm2 logs fleetguide"
echo "Restart app:        pm2 restart fleetguide"
echo "Stop app:           pm2 stop fleetguide"
echo "Nginx status:       systemctl status nginx"
echo "Restart Nginx:      systemctl restart nginx"
echo "Check SSL:          certbot certificates"
echo "Renew SSL:          certbot renew"
echo "=========================================="
echo ""
echo "For detailed instructions, see HOSTING_GUIDE.md"
echo ""
