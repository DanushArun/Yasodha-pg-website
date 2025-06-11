# Deployment Guide for Yasodha PG Website

## Deploying to Render (Recommended)

### Prerequisites
1. GitHub account
2. Render account (free at https://render.com)
3. Google Sheets service account JSON file

### Step 1: Prepare for Deployment

1. **Create a GitHub repository** and push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/yasodha-pg-website.git
   git push -u origin main
   ```

2. **IMPORTANT**: Do NOT commit your `service-account.json` file. It's already in `.gitignore`.

### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up for a free account (use GitHub for easy integration)

### Step 3: Deploy on Render

1. **From Render Dashboard**:
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub account if not already connected
   - Select your `yasodha-pg-website` repository

2. **Configure the Service**:
   - **Name**: yasodha-pg-website (or any name you prefer)
   - **Environment**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn server:app`
   - **Plan**: Free

3. **Environment Variables**:
   Click "Advanced" and add:
   - `PYTHON_VERSION`: 3.11.0
   - `FLASK_ENV`: production
   - `SPREADSHEET_ID`: (your Google Sheets ID)

4. Click "Create Web Service"

### Step 4: Upload Service Account JSON

Since we can't commit the service account file to GitHub:

1. After deployment, go to your Render service dashboard
2. Go to "Environment" tab
3. Under "Secret Files", click "Add Secret File"
4. Name: `service-account.json`
5. Contents: Copy and paste your entire service-account.json file content
6. Click "Save Changes"

### Step 5: Update Your Frontend

1. After deployment, Render will give you a URL like: `https://yasodha-pg-website.onrender.com`

2. Update `js/config.js`:
   ```javascript
   const config = {
       API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
           ? 'http://localhost:5001'
           : 'https://yasodha-pg-website.onrender.com' // Your Render URL
   };
   ```

3. Commit and push this change

### Step 6: Test Your Deployment

1. Visit your Render URL
2. Test the contact form
3. Check if gallery images load
4. Verify form submissions appear in Google Sheets

## Alternative Deployment Options

### Vercel (Frontend Only)
If you want to deploy just the frontend:
1. Remove backend dependencies
2. Deploy to Vercel: https://vercel.com/new
3. Forms won't work without backend

### Netlify + Render
1. Deploy frontend to Netlify
2. Deploy backend API to Render
3. Update API URLs accordingly

## Troubleshooting

### Common Issues:

1. **Form submissions failing**:
   - Check Render logs for errors
   - Verify service-account.json is uploaded correctly
   - Ensure Google Sheets is shared with service account email

2. **Gallery not loading**:
   - Check browser console for CORS errors
   - Verify API endpoint is accessible

3. **Site loads slowly**:
   - Free tier on Render spins down after inactivity
   - First visit after idle will be slow
   - Consider upgrading to paid tier for better performance

### Checking Logs:
1. Go to your Render dashboard
2. Click on your service
3. Click "Logs" to see real-time logs

## Local Development
To run locally after deployment:
```bash
python3 server.py
```
Then visit http://localhost:5001

## Next Steps
1. Set up a custom domain (optional)
2. Enable Google Analytics (optional)
3. Set up monitoring with UptimeRobot (optional)