# Hosting Guide for FleetGuide.in

## Overview
This guide will help you deploy your Node.js FleetGuide.in website to a live server. We'll cover multiple hosting options from budget-friendly to enterprise-level.

## Prerequisites
✅ Domain: fleetguide.in (already owned)
✅ Website code (fleetguide-app folder)
✅ Basic terminal/command line knowledge

---

## OPTION 1: DigitalOcean (Recommended for Beginners) 💎

**Cost:** $6/month (Basic Droplet)
**Best for:** Full control, scalability, good performance

### Step 1: Create DigitalOcean Account
1. Go to https://www.digitalocean.com/
2. Sign up (use this link for $200 free credits for 60 days)
3. Verify email and add payment method

### Step 2: Create a Droplet (VPS)
1. Click **"Create"** → **"Droplets"**
2. Choose configuration:
   - **Image:** Ubuntu 22.04 LTS
   - **Plan:** Basic ($6/month - 1GB RAM, 1 vCPU, 25GB SSD)
   - **Datacenter:** Bangalore (closest to India)
   - **Authentication:** SSH Key (recommended) or Password
   - **Hostname:** fleetguide
3. Click **"Create Droplet"**
4. Note down the IP address (e.g., 123.45.67.89)

### Step 3: Connect to Your Server
**On Windows (use PowerShell or download PuTTY):**
```bash
ssh root@YOUR_DROPLET_IP
```

**On Mac/Linux:**
```bash
ssh root@YOUR_DROPLET_IP
```
Enter password when prompted.

### Step 4: Initial Server Setup
```bash
# Update system packages
apt update && apt upgrade -y

# Install Node.js (v18 LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install nginx (web server)
apt install nginx -y

# Install PM2 (process manager)
npm install -g pm2

# Install Git
apt install git -y

# Create application directory
mkdir -p /var/www/fleetguide
cd /var/www/fleetguide
```

### Step 5: Upload Your Code

**Method A: Using SCP (from your local machine)**
```bash
# Navigate to where you extracted fleetguide-app
cd /path/to/fleetguide-app

# Upload to server
scp -r * root@YOUR_DROPLET_IP:/var/www/fleetguide/
```

**Method B: Using Git (if code is on GitHub)**
```bash
# On the server
cd /var/www/fleetguide
git clone YOUR_GITHUB_REPO_URL .
```

**Method C: Using FileZilla (GUI)**
1. Download FileZilla: https://filezilla-project.org/
2. Connect using SFTP: `sftp://YOUR_DROPLET_IP`
3. Upload fleetguide-app folder contents

### Step 6: Install Dependencies
```bash
cd /var/www/fleetguide
npm install
```

### Step 7: Configure Nginx
```bash
# Create nginx configuration
nano /etc/nginx/sites-available/fleetguide.in
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name fleetguide.in www.fleetguide.in;

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
    }
}
```

Save and exit (Ctrl+X, then Y, then Enter).

```bash
# Enable the site
ln -s /etc/nginx/sites-available/fleetguide.in /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test nginx configuration
nginx -t

# Restart nginx
systemctl restart nginx
```

### Step 8: Start Your Application with PM2
```bash
cd /var/www/fleetguide

# Start application
pm2 start server.js --name fleetguide

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd
# Copy and run the command it outputs
```

### Step 9: Configure DNS (Point Domain to Server)

**Go to your domain registrar** (where you bought fleetguide.in):

Add these DNS records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | YOUR_DROPLET_IP | 3600 |
| A | www | YOUR_DROPLET_IP | 3600 |

**Example:**
- Type: A
- Name: @
- Value: 123.45.67.89
- TTL: 3600

Wait 10-60 minutes for DNS propagation.

### Step 10: Install SSL Certificate (HTTPS)
```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d fleetguide.in -d www.fleetguide.in

# Follow prompts:
# - Enter email address
# - Agree to terms
# - Choose redirect HTTP to HTTPS (option 2)

# Test auto-renewal
certbot renew --dry-run
```

### Step 11: Configure Firewall
```bash
# Enable UFW firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

### Step 12: Verify Deployment
1. Visit https://fleetguide.in in browser
2. Check if website loads correctly
3. Test all calculators
4. Verify AdSense ads appear (may take 30-60 mins)

---

## OPTION 2: Heroku (Easiest, No Server Management) 🚀

**Cost:** Free tier available, $7/month for basic dyno
**Best for:** Quick deployment, zero configuration

### Step 1: Prepare Your Code
Create `Procfile` in project root:
```
web: node server.js
```

Update `package.json` to include start script:
```json
"scripts": {
  "start": "node server.js"
}
```

### Step 2: Deploy to Heroku

**Using Heroku CLI:**
```bash
# Install Heroku CLI
# Windows: Download from https://devcenter.heroku.com/articles/heroku-cli
# Mac: brew install heroku/brew/heroku
# Linux: curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
cd fleetguide-app
heroku create fleetguide

# Deploy
git init
git add .
git commit -m "Initial commit"
git push heroku main

# Open app
heroku open
```

### Step 3: Configure Custom Domain
```bash
# Add domain to Heroku
heroku domains:add fleetguide.in
heroku domains:add www.fleetguide.in

# Heroku will give you DNS target (e.g., fleetguide.herokuapp.com)
```

**In your domain DNS settings, add:**
| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | fleetguide.herokuapp.com | 3600 |
| ALIAS or ANAME | @ | fleetguide.herokuapp.com | 3600 |

### Step 4: Enable SSL (Automatic on Heroku)
```bash
heroku certs:auto:enable
```

---

## OPTION 3: Render (Modern, Easy) 🎯

**Cost:** Free tier available, $7/month for paid
**Best for:** Simple setup, automatic deployments

### Step 1: Create Render Account
1. Go to https://render.com/
2. Sign up with GitHub/GitLab

### Step 2: Deploy
1. Push code to GitHub
2. In Render dashboard, click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** fleetguide
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free or Starter ($7/month)
5. Click **"Create Web Service"**

### Step 3: Add Custom Domain
1. In Render dashboard, go to **Settings** → **Custom Domain**
2. Add `fleetguide.in` and `www.fleetguide.in`
3. Render provides DNS instructions

**Update your domain DNS:**
| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | your-app.onrender.com | 3600 |
| A | @ | 216.24.57.1 | 3600 |

SSL is automatic on Render!

---

## OPTION 4: Railway (Fastest Setup) 🚄

**Cost:** Free tier with $5 credit, then pay-as-you-go
**Best for:** Instant deployment

### Steps:
1. Go to https://railway.app/
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Railway auto-detects Node.js and deploys
6. Add custom domain in settings
7. SSL automatic

---

## OPTION 5: Traditional Shared Hosting (Budget Option) 💵

**Cost:** $2-5/month
**Best for:** Tight budget
**Providers:** Hostinger, Namecheap, A2 Hosting

### Requirements:
- Node.js support (v16+)
- SSH access
- PM2 or similar process manager

### Steps:
1. Purchase hosting with Node.js support
2. Upload code via cPanel File Manager or FTP
3. SSH into server
4. Run `npm install`
5. Start with `node server.js` or PM2
6. Point domain to hosting (nameservers provided by host)

---

## Post-Deployment Checklist

### Immediate Tasks:
- [ ] Website loads on https://fleetguide.in
- [ ] All pages work correctly
- [ ] Calculators function properly
- [ ] Mobile responsive
- [ ] SSL certificate active (padlock icon)

### Within 24 Hours:
- [ ] Submit sitemap to Google Search Console
- [ ] Add site to Google AdSense
- [ ] Verify AdSense ads showing
- [ ] Test on multiple devices/browsers
- [ ] Check page load speed (aim for <3 seconds)

### Within 1 Week:
- [ ] Monitor server resources
- [ ] Check error logs
- [ ] Set up monitoring (UptimeRobot, Pingdom)
- [ ] Configure backups
- [ ] Test email functionality (if added)

---

## Monitoring & Maintenance

### Server Monitoring (DigitalOcean/VPS)
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs fleetguide

# Restart application
pm2 restart fleetguide

# Monitor server resources
htop
```

### Set Up Free Monitoring
1. **UptimeRobot** (https://uptimerobot.com/)
   - Free tier: Monitor every 5 minutes
   - Get alerts if site goes down

2. **Google Search Console**
   - Monitor search performance
   - Check for crawl errors

3. **Google Analytics**
   - Track visitor behavior
   - Monitor traffic sources

### Backup Strategy

**For DigitalOcean:**
```bash
# Enable automated backups ($1.20/month)
# OR create snapshots manually ($0.06/GB/month)
```

**For All Platforms:**
```bash
# Backup database (if added later)
# Backup uploaded files
# Keep code in Git repository
```

---

## Updating Your Website

### Method 1: Direct Update (DigitalOcean/VPS)
```bash
# SSH into server
ssh root@YOUR_IP

# Navigate to app directory
cd /var/www/fleetguide

# Pull latest changes (if using Git)
git pull

# OR upload new files via SCP/FTP

# Install any new dependencies
npm install

# Restart application
pm2 restart fleetguide
```

### Method 2: Automatic Deployment (Render/Railway/Heroku)
- Just push to GitHub
- Platform auto-deploys changes
- Zero downtime deployments

---

## Troubleshooting

### Website Not Loading?
```bash
# Check if app is running
pm2 status

# Check nginx
systemctl status nginx

# Check logs
pm2 logs fleetguide
tail -f /var/log/nginx/error.log

# Restart everything
pm2 restart fleetguide
systemctl restart nginx
```

### DNS Not Working?
- Wait 24-48 hours for full propagation
- Use DNS checker: https://dnschecker.org/
- Verify DNS records are correct
- Clear browser cache (Ctrl+Shift+Del)

### SSL Certificate Issues?
```bash
# Renew certificate
certbot renew

# Force renewal
certbot renew --force-renewal

# Check certificate status
certbot certificates
```

### High Server Load?
```bash
# Check resource usage
htop

# Restart server if needed
reboot

# Consider upgrading hosting plan
```

---

## Cost Comparison

| Platform | Free Tier | Paid Tier | SSL | Auto-Deploy | Best For |
|----------|-----------|-----------|-----|-------------|----------|
| DigitalOcean | No | $6/mo | ✅ | ❌ | Full control |
| Heroku | Yes (limited) | $7/mo | ✅ | ✅ | Easy setup |
| Render | Yes | $7/mo | ✅ | ✅ | Modern stack |
| Railway | $5 credit | Pay-as-go | ✅ | ✅ | Fast deploy |
| Shared Host | No | $3-5/mo | ✅ | ❌ | Budget |

---

## Recommended: Start with DigitalOcean

**Why?**
- ✅ Good balance of cost and control
- ✅ Scalable (upgrade as traffic grows)
- ✅ Indian datacenter (Bangalore) = faster for Indian users
- ✅ Industry standard
- ✅ Great documentation
- ✅ $200 free credit for 60 days

**Step-by-step for absolute beginners:**
1. Follow "OPTION 1: DigitalOcean" above
2. Copy-paste all commands
3. Take 30-60 minutes
4. Website will be live!

---

## Need Help?

**DigitalOcean Community:** https://www.digitalocean.com/community
**Node.js Deployment Guides:** https://nodejs.org/en/docs/guides/
**Stack Overflow:** Tag your questions with `nodejs`, `nginx`, `deployment`

---

## Next Steps After Deployment

1. ✅ Complete AdSense setup (replace placeholder IDs)
2. ✅ Submit to search engines
3. ✅ Start creating content (2-3 posts/week)
4. ✅ Share on social media
5. ✅ Join fleet management communities
6. ✅ Monitor analytics daily
7. ✅ Optimize based on data

**Your website will be live at:**
- https://fleetguide.in
- https://www.fleetguide.in

Good luck! 🚀
