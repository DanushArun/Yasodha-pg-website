# Setting Up Google Sheets on Render

## Quick Fix (Get Your Site Running Now)

Your site will now deploy successfully on Render even without Google Sheets. Form submissions will be saved to a CSV file that you can download.

## Setting Up Google Sheets (Optional)

To enable Google Sheets integration on Render:

### Step 1: Convert service-account.json to Base64

```bash
# On your local machine
base64 -i service-account.json -o service-account-base64.txt

# On Windows, use PowerShell:
[Convert]::ToBase64String([IO.File]::ReadAllBytes("service-account.json")) | Out-File service-account-base64.txt
```

### Step 2: Add Environment Variables in Render

1. Go to your Render dashboard
2. Click on your service
3. Go to **Environment** tab
4. Add these variables:

```
GOOGLE_CREDENTIALS = [paste the base64 content from service-account-base64.txt]
SPREADSHEET_ID = 1PbwSgLYvDl_FN3oUfwsFFTidS12c68yu8yRAOiZHiNY
SHEET_NAME = 2025
```

### Step 3: Update server.py to Use Environment Variables

Add this code at the beginning of server.py (after imports):

```python
import base64
import tempfile

# Check for Google credentials in environment
if os.environ.get('GOOGLE_CREDENTIALS'):
    # Decode and save credentials temporarily
    credentials_base64 = os.environ.get('GOOGLE_CREDENTIALS')
    credentials_json = base64.b64decode(credentials_base64)
    
    # Write to a temporary file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
        f.write(credentials_json.decode('utf-8'))
        SERVICE_ACCOUNT_FILE = f.name
else:
    SERVICE_ACCOUNT_FILE = 'service-account.json'
```

### Step 4: Share Google Sheet with Service Account

1. Open your Google Sheet
2. Click **Share** button
3. Add the service account email (found in service-account.json)
4. Give it **Editor** permissions

### Step 5: Redeploy

Push your changes to GitHub and Render will automatically redeploy.

## Using CSV Fallback

If you prefer to keep using CSV (simpler):

1. Form submissions are saved to `inquiries.csv`
2. Download the CSV periodically:
   - SSH into Render: `render ssh`
   - View data: `cat inquiries.csv`
   - Or use Render's shell to download

## Troubleshooting

If Google Sheets still doesn't work:
1. Check Render logs for specific error messages
2. Verify the service account has access to the spreadsheet
3. Ensure SPREADSHEET_ID is correct
4. The CSV fallback will always work as backup