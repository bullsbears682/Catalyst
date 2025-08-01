# Railway Environment Variables Setup

## Required Environment Variables:

### 1. In Railway Dashboard → Your Project → Variables Tab:

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-here-change-this
API_KEY=your-api-key-here-change-this
ADMIN_PASSWORD=your-admin-password-here

# Email Configuration (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# Database (SQLite will be created automatically)
DATABASE_PATH=./data/roi_calculator.db
```

### 2. Generate Secure Values:

**JWT_SECRET**: Use a random 64-character string
**API_KEY**: Use a random 32-character string  
**ADMIN_PASSWORD**: Use a strong password

### 3. Email Setup (Optional):
- Use Gmail App Password or other SMTP service
- This enables email notifications for leads

## After Setting Variables:
1. Click "Deploy" to restart with new environment
2. Your API will be available at: `https://your-app-name.up.railway.app`
3. Test health check: `https://your-app-name.up.railway.app/api/health`