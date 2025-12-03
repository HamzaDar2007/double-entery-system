# Production Deployment Guide

## Overview

This guide covers deploying the Double-Entry Accounting System to production.

---

## Prerequisites

- Node.js 18+ or 20+
- PostgreSQL 14+ or 15+
- Redis 6+ (for background jobs)
- Nginx or similar reverse proxy
- SSL certificate
- Domain name

---

## Environment Setup

### 1. Server Requirements

**Minimum Specifications:**
- CPU: 2 cores
- RAM: 4GB
- Storage: 50GB SSD
- OS: Ubuntu 22.04 LTS or similar

**Recommended Specifications:**
- CPU: 4 cores
- RAM: 8GB
- Storage: 100GB SSD
- OS: Ubuntu 22.04 LTS

### 2. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL 15
sudo apt install -y postgresql postgresql-contrib

# Install Redis
sudo apt install -y redis-server

# Install Nginx
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

---

## Database Setup

### 1. Create Database User

```bash
sudo -u postgres psql

postgres=# CREATE USER accounting_user WITH PASSWORD 'your_secure_password';
postgres=# CREATE DATABASE accounting_production;
postgres=# GRANT ALL PRIVILEGES ON DATABASE accounting_production TO accounting_user;
postgres=# \q
```

### 2. Configure PostgreSQL

Edit `/etc/postgresql/15/main/postgresql.conf`:

```conf
# Performance tuning
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 2621kB
min_wal_size = 1GB
max_wal_size = 4GB
```

Edit `/etc/postgresql/15/main/pg_hba.conf`:

```conf
# Allow local connections
local   all             all                                     peer
host    accounting_production    accounting_user    127.0.0.1/32            md5
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

---

## Redis Configuration

Edit `/etc/redis/redis.conf`:

```conf
# Bind to localhost only
bind 127.0.0.1

# Enable persistence
save 900 1
save 300 10
save 60 10000

# Set max memory
maxmemory 512mb
maxmemory-policy allkeys-lru
```

Restart Redis:
```bash
sudo systemctl restart redis
```

---

## Application Deployment

### 1. Clone Repository

```bash
cd /var/www
sudo git clone https://github.com/your-repo/accounting-system.git
cd accounting-system/backend
sudo chown -R $USER:$USER /var/www/accounting-system
```

### 2. Install Dependencies

```bash
npm ci --production
```

### 3. Environment Variables

Create `.env` file:

```env
# Application
NODE_ENV=production
PORT=3000
APP_NAME="Accounting System"
APP_URL=https://accounting.yourdomain.com

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=accounting_user
DB_PASSWORD=your_secure_password
DB_DATABASE=accounting_production
DB_SYNCHRONIZE=false
DB_LOGGING=false

# Authentication
JWT_SECRET=your_very_long_random_secret_key_here_at_least_32_characters
JWT_EXPIRATION=1h
JWT_REFRESH_SECRET=your_refresh_token_secret_key_here
JWT_REFRESH_EXPIRATION=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Queue
QUEUE_HOST=localhost
QUEUE_PORT=6379
QUEUE_PASSWORD=

# Rate Limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=100

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=/var/log/accounting-system

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@yourdomain.com

# AWS S3 (for file storage - optional)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=accounting-documents
```

### 4. Build Application

```bash
npm run build
```

### 5. Run Migrations

```bash
npm run migration:run
```

### 6. Seed Initial Data

```bash
npm run seed:run
```

---

## Process Management with PM2

### 1. Create PM2 Ecosystem File

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'accounting-api',
    script: 'dist/main.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
    },
    error_file: '/var/log/accounting-system/error.log',
    out_file: '/var/log/accounting-system/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
  },
  {
    name: 'accounting-worker',
    script: 'dist/jobs/worker.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
    },
    error_file: '/var/log/accounting-system/worker-error.log',
    out_file: '/var/log/accounting-system/worker-out.log',
    autorestart: true,
    max_memory_restart: '512M',
  }],
};
```

### 2. Start Application

```bash
# Create log directory
sudo mkdir -p /var/log/accounting-system
sudo chown -R $USER:$USER /var/log/accounting-system

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd
# Run the command that PM2 outputs
```

### 3. PM2 Commands

```bash
# View status
pm2 status

# View logs
pm2 logs

# Restart
pm2 restart all

# Stop
pm2 stop all

# Monitor
pm2 monit
```

---

## Nginx Configuration

### 1. Create Nginx Config

Create `/etc/nginx/sites-available/accounting`:

```nginx
# Upstream
upstream accounting_api {
    least_conn;
    server 127.0.0.1:3000;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name accounting.yourdomain.com;
    
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name accounting.yourdomain.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/accounting.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/accounting.yourdomain.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Logging
    access_log /var/log/nginx/accounting-access.log;
    error_log /var/log/nginx/accounting-error.log;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;
    
    # Client body size
    client_max_body_size 10M;
    
    # Proxy settings
    location / {
        proxy_pass http://accounting_api;
        proxy_http_version 1.1;
        
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://accounting_api/health;
        access_log off;
    }
}
```

### 2. Enable Site

```bash
# Test configuration
sudo nginx -t

# Enable site
sudo ln -s /etc/nginx/sites-available/accounting /etc/nginx/sites-enabled/

# Restart Nginx
sudo systemctl restart nginx
```

---

## SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d accounting.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## Firewall Configuration

```bash
# Install UFW
sudo apt install -y ufw

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

---

## Monitoring & Logging

### 1. Application Logs

```bash
# View PM2 logs
pm2 logs

# View Nginx logs
sudo tail -f /var/log/nginx/accounting-access.log
sudo tail -f /var/log/nginx/accounting-error.log

# View application logs
tail -f /var/log/accounting-system/out.log
tail -f /var/log/accounting-system/error.log
```

### 2. System Monitoring

```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Monitor processes
pm2 monit
htop
```

### 3. Database Monitoring

```bash
# PostgreSQL stats
sudo -u postgres psql accounting_production -c "SELECT * FROM pg_stat_activity;"

# Long-running queries
sudo -u postgres psql accounting_production -c "SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state FROM pg_stat_activity WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';"
```

---

## Backup Strategy

### 1. Database Backup Script

Create `/opt/backup-accounting.sh`:

```bash
#!/bin/bash

BACKUP_DIR="/var/backups/accounting"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="accounting_production"
DB_USER="accounting_user"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U $DB_USER -h localhost $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Compress
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Delete backups older than 30 days
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete

# Optional: Upload to S3
# aws s3 cp $BACKUP_DIR/db_backup_$DATE.sql.gz s3://your-backup-bucket/accounting/

echo "Backup completed: db_backup_$DATE.sql.gz"
```

### 2. Schedule Backups

```bash
# Make script executable
sudo chmod +x /opt/backup-accounting.sh

# Add to crontab
sudo crontab -e

# Add this line (daily backup at 2 AM)
0 2 * * * /opt/backup-accounting.sh >> /var/log/accounting-backup.log 2>&1
```

---

## Performance Optimization

### 1. Database Indexing

```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_journal_entries_entry_date ON journal_entries(entry_date);
CREATE INDEX idx_journal_entries_status ON journal_entries(status);
CREATE INDEX idx_accounts_company_code ON accounts(company_id, code);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(status);
```

### 2. Redis Caching

The application uses Redis for:
- Session storage
- API rate limiting
- Background job queues
- Account balance caching

### 3. Connection Pooling

Already configured in TypeORM (max 10 connections).

---

## Security Checklist

✅ All endpoints require authentication
✅ JWT tokens with expiration
✅ Rate limiting enabled
✅ HTTPS enforced
✅ Security headers configured
✅ Database credentials secured
✅ Firewall configured
✅ Regular security updates
✅ SQL injection protection (TypeORM)
✅ XSS protection
✅ CSRF protection
✅ Input validation
✅ Audit logging

---

## Health Checks

### Application Health
```bash
curl https://accounting.yourdomain.com/health
```

Expected response:
```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    },
    "redis": {
      "status": "up"
    }
  }
}
```

---

## Troubleshooting

### Issue: Application won't start
```bash
# Check logs
pm2 logs

# Check environment variables
cat .env

# Verify database connection
psql -U accounting_user -h localhost accounting_production
```

### Issue: High memory usage
```bash
# Restart PM2
pm2 restart all

# Check memory
pm2 monit
free -h
```

### Issue: Slow queries
```bash
# Enable query logging in PostgreSQL
# Check slow query log
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

### Issue: SSL certificate renewal fails
```bash
# Renew manually
sudo certbot renew --force-renewal

# Check certificate status
sudo certbot certificates
```

---

## Scaling

### Horizontal Scaling

1. **Load Balancer**: Add multiple application servers behind a load balancer
2. **Database Replication**: Set up PostgreSQL read replicas
3. **Redis Cluster**: Use Redis cluster for high availability

### Vertical Scaling

1. Increase server resources (CPU, RAM)
2. Optimize database queries
3. Implement aggressive caching

---

## Maintenance

### Regular Tasks

**Daily:**
- Monitor logs for errors
- Check disk space
- Verify backups completed

**Weekly:**
- Review application performance
- Check for security updates
- Analyze slow queries

**Monthly:**
- Update dependencies
- Review access logs
- Database vacuum and analyze
- Test backup restoration

---

## Rollback Procedure

```bash
# Stop application
pm2 stop all

# Restore database from backup
gunzip /var/backups/accounting/db_backup_YYYYMMDD_HHMMSS.sql.gz
psql -U accounting_user accounting_production < /var/backups/accounting/db_backup_YYYYMMDD_HHMMSS.sql

# Revert code
git checkout <previous-commit-hash>
npm ci
npm run build

# Restart application
pm2 restart all
```

---

## Support & Maintenance

**Documentation:** See API_DOCUMENTATION.md and TESTING_GUIDE.md

**Monitoring Dashboard:** Configure PM2 Plus or similar

**Alerting:** Set up alerts for:
- Application downtime
- High error rates
- Database connection issues
- Disk space warnings
- SSL certificate expiration

---

## Production Checklist

Before going live:

✅ Database migrations run successfully
✅ Seed data populated
✅ All environment variables configured
✅ SSL certificate installed
✅ Firewall rules configured
✅ Backup system tested
✅ Monitoring configured
✅ Log rotation set up
✅ PM2 startup script configured
✅ Nginx configuration tested
✅ Health checks passing
✅ Load testing completed
✅ Security audit passed
✅ Documentation updated
✅ Rollback procedure tested
