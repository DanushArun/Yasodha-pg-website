# Yasodha Residency Server Setup

## Quick Start

1. **Install Requirements**
   ```bash
   pip install flask gspread google-auth google-auth-oauthlib google-auth-httplib2
   ```

2. **Start the Server**
   ```bash
   python server.py
   ```
   The server will run on `http://127.0.0.1:5001`

3. **Open the Website**
   - Open `index.html` in your browser
   - OR use a local HTTP server: `python -m http.server 8000`

## Troubleshooting

### Form Not Submitting?

1. **Check if server is running:**
   ```bash
   # In terminal 1
   python server.py
   ```
   You should see:
   ```
   === Starting Yasodha Residency Backend Server ===
   Server will run on: http://127.0.0.1:5001
   ```

2. **Test the server:**
   ```bash
   # In terminal 2
   python test_server.py
   ```

3. **Check browser console:**
   - Open Developer Tools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

### Common Issues

1. **Port 5001 already in use:**
   ```bash
   # Find process using port 5001
   lsof -i :5001
   # Kill the process
   kill -9 <PID>
   ```

2. **CORS errors:**
   - Make sure you're accessing the site via `http://localhost` or `http://127.0.0.1`
   - Not via `file://` protocol

3. **Google Sheets not working:**
   - Check if `service-account.json` exists
   - Verify the service account has access to the spreadsheet
   - The server will automatically fall back to CSV storage

## CSV Fallback

If Google Sheets fails, inquiries are saved to `inquiries.csv` in the project directory.

## Testing

1. Fill out the form on the website
2. Check the terminal running `server.py` for logs
3. Check `inquiries.csv` or your Google Sheet