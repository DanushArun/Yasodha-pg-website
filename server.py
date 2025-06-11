#!/usr/bin/env python
from flask import Flask, request, jsonify, send_from_directory, make_response
import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime
import re
import os
import time
import csv
import json
import logging

app = Flask(__name__, static_folder='.', static_url_path='')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Helper function to add CORS headers
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, PUT, DELETE'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Accept, Authorization'
    response.headers['Access-Control-Max-Age'] = '86400'
    return response

# Add CORS to all responses
@app.after_request
def after_request(response):
    return add_cors_headers(response)

# --- Google Sheets Configuration ---
SERVICE_ACCOUNT_FILE = 'service-account.json'
SPREADSHEET_ID = os.environ.get('SPREADSHEET_ID', '1hvWPV9f9bvliF2OpAcSy1dHRkLQF84t_TDAHRa3xTuU')
SHEET_NAME = os.environ.get('SHEET_NAME', '2025')

# Define the scope for Google Sheets and Drive API
SCOPE = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']

# Updated SHEET_HEADERS
SHEET_HEADERS = ['Date', 'Time', 'Name', 'Email', 'Phone', 'VisitDate', 'Message']

# CSV Fallback file
CSV_FILE = 'inquiries.csv'

# --- Helper Function to Initialize Google Sheet and Add Headers ---
def initialize_google_sheet(worksheet):
    """Checks if the sheet is empty and adds headers if it is."""
    try:
        first_row_values = worksheet.row_values(1)
        # Check against new headers
        if not first_row_values or first_row_values != SHEET_HEADERS:
            if first_row_values and first_row_values != SHEET_HEADERS:
                print(f"First row of '{worksheet.title}' exists but doesn't match new headers. Overwriting.")
            # Update to new headers and range (A1:G1 for 7 columns)
            if not worksheet.row_values(1) == SHEET_HEADERS:
                worksheet.update('A1:G1', [SHEET_HEADERS]) # Updated range
                print(f"Headers set/updated in '{worksheet.title}' to: {SHEET_HEADERS}")
    except gspread.exceptions.APIError as e:
        if hasattr(e, 'response') and e.response.status_code == 400:
            print(f"Sheet '{worksheet.title}' appears empty or unformatted. Writing headers: {SHEET_HEADERS}")
            worksheet.update('A1:G1', [SHEET_HEADERS]) # Updated range
        else:
            print(f"API error during Google Sheet header initialization: {e}")
    except Exception as e:
        print(f"Error initializing Google Sheet headers: {e}")

# --- Helper Function to Initialize CSV File ---
def initialize_csv_file():
    """Creates CSV file with headers if it doesn't exist."""
    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, 'w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(SHEET_HEADERS)
        print(f"Created CSV file '{CSV_FILE}' with headers.")

# --- Helper Function to Write to CSV ---
def write_to_csv(row_data):
    """Writes data to CSV file."""
    try:
        with open(CSV_FILE, 'a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(row_data)
        print(f"Inquiry saved to CSV file: {row_data[2]} ({row_data[3]})")
        return True
    except Exception as e:
        print(f"Error writing to CSV: {e}")
        return False

# --- Authenticate and get worksheet ---
gc = None
worksheet = None
use_csv_fallback = False

# Initialize CSV file regardless
initialize_csv_file()

if os.path.exists(SERVICE_ACCOUNT_FILE):
    try:
        # Read service account file to get email
        with open(SERVICE_ACCOUNT_FILE, 'r') as f:
            service_account_info = json.load(f)
            service_account_email = service_account_info.get('client_email', 'Not found')
        
        print(f"Service account email: {service_account_email}")
        print(f"Project ID: {service_account_info.get('project_id', 'Not found')}")
        
        # Create credentials
        creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPE)
        
        # Authorize gspread client
        gc = gspread.authorize(creds)
        print(f"✓ Google Sheets client authorized successfully")

        # Open the spreadsheet
        print(f"Attempting to open spreadsheet with ID: {SPREADSHEET_ID}")
        spreadsheet = gc.open_by_key(SPREADSHEET_ID)
        print(f"✓ Spreadsheet opened: '{spreadsheet.title}'")

        # Get the worksheet
        try:
            worksheet = spreadsheet.worksheet(SHEET_NAME)
            print(f"✓ Found existing worksheet: '{SHEET_NAME}'")
        except gspread.exceptions.WorksheetNotFound:
            print(f"Creating new worksheet: '{SHEET_NAME}'")
            worksheet = spreadsheet.add_worksheet(title=SHEET_NAME, rows="100", cols="20")
        
        # Initialize headers
        initialize_google_sheet(worksheet)
        print(f"✓ Google Sheets integration ready!")
        use_csv_fallback = False
        
    except (gspread.exceptions.APIError, gspread.exceptions.GSpreadException) as api_error:
        print(f"Google Sheets API Error: {api_error}")
        if 'Invalid JWT Signature' in str(api_error) or 'invalid_grant' in str(api_error):
            print("\n=== JWT Signature Error - Using CSV Fallback ===")
            print(f"Service account email: {service_account_email}")
            print("\nTo fix this issue:")
            print("1. Check system time synchronization:")
            print(f"   Current system time: {datetime.now()}")
            print("2. In Google Cloud Console:")
            print("   - Go to IAM & Admin > Service Accounts")
            print("   - Find your service account and create a new key")
            print("   - Download the JSON key and replace service-account.json")
            print("3. Share the Google Sheet with the service account email:")
            print(f"   {service_account_email}")
            print("   Give it 'Editor' permissions")
            print("4. Check that the spreadsheet ID is correct:")
            print(f"   {SPREADSHEET_ID}")
            print("\n=== Using CSV file for storing inquiries ===")
        use_csv_fallback = True
        worksheet = None
    except Exception as e:
        print(f"!!! ERROR: Could not connect to Google Sheets. Error: {e}")
        print("=== Using CSV file for storing inquiries ===")
        use_csv_fallback = True
        worksheet = None
else:
    print(f"!!! ERROR: Service account file '{SERVICE_ACCOUNT_FILE}' not found.")
    print("=== Using CSV file for storing inquiries ===")
    use_csv_fallback = True

@app.route('/')
def index():
    """Serves the index.html file."""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/test', methods=['GET', 'POST'])
def test_endpoint():
    """Test endpoint to verify server is running."""
    global worksheet, use_csv_fallback
    
    if request.method == 'POST':
        return jsonify({
            "success": True, 
            "message": "POST test successful",
            "data_received": request.get_json() or request.form.to_dict(),
            "content_type": request.content_type
        }), 200
    else:
        return jsonify({
            "success": True, 
            "message": "Server is running",
            "google_sheets_connected": worksheet is not None,
            "csv_fallback_active": use_csv_fallback,
            "worksheet_title": worksheet.title if worksheet else None,
            "service_account_file_exists": os.path.exists(SERVICE_ACCOUNT_FILE)
        }), 200

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    """Serves files from the assets directory."""
    return send_from_directory('assets', filename)

@app.route('/css/<path:filename>')
def serve_css(filename):
    """Serves CSS files."""
    return send_from_directory('css', filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    """Serves JavaScript files."""
    return send_from_directory('js', filename)

@app.route('/pg-photos/<path:filename>')
def serve_photos(filename):
    """Serves photo files."""
    return send_from_directory('pg-photos', filename)

@app.route('/api/gallery-images', methods=['GET'])
def get_gallery_images():
    """Returns a list of all images in the pg-photos directory."""
    try:
        import os
        import mimetypes
        
        images = []
        photo_dir = 'pg-photos'
        
        # Supported image extensions
        supported_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'}
        
        if os.path.exists(photo_dir):
            for filename in sorted(os.listdir(photo_dir)):
                # Get file extension
                _, ext = os.path.splitext(filename.lower())
                
                # Check if it's an image file
                if ext in supported_extensions:
                    # Skip video files
                    if not filename.lower().endswith(('.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm')):
                        images.append({
                            'filename': filename,
                            'url': f'/pg-photos/{filename}',
                            'alt': f'Yasodha Residency - {filename.replace("-", " ").replace("_", " ").split(".")[0]}'
                        })
        
        return jsonify({
            'success': True,
            'images': images,
            'count': len(images)
        })
    except Exception as e:
        print(f"Error loading gallery images: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'images': []
        }), 500

@app.route('/submit_booking', methods=['POST', 'OPTIONS'])
def handle_booking_submission():
    global worksheet, use_csv_fallback # Access the globally initialized worksheet
    
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response, 200

    try:
        # Debug logging
        print(f"\n=== NEW BOOKING SUBMISSION ===")
        print(f"Time: {datetime.now()}")
        print(f"Request method: {request.method}")
        print(f"Request content type: {request.content_type}")
        print(f"Request headers: {dict(request.headers)}")
        print(f"Request data: {request.data}")
        print(f"Request form: {request.form}")
        print(f"Request JSON: {request.json if request.is_json else 'Not JSON'}")
        
        # Get data based on content type
        data = None
        if request.is_json:
            data = request.get_json()
            print(f"JSON data received: {data}")
        elif request.form:
            data = request.form.to_dict()
            print(f"Form data received: {data}")
        else:
            # Try to parse as JSON even if content-type is wrong
            try:
                import json
                data = json.loads(request.data.decode('utf-8'))
                print(f"Manually parsed JSON: {data}")
            except:
                print("Failed to parse request data")
                return jsonify({"success": False, "message": "Invalid data format received"}), 400
                
        if not data:
            print("No data found in request")
            return jsonify({"success": False, "message": "No data received"}), 400
            
        print(f"Final parsed data: {data}")

        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        visit_date = data.get('visitDate', '') # Optional, no specific validation for now
        message = data.get('message', '').strip()

        if not name:
            return add_cors_headers(jsonify({"success": False, "message": "Name is required."})), 400
        if not email:
            return add_cors_headers(jsonify({"success": False, "message": "Email is required."})), 400
        if not message:
            return add_cors_headers(jsonify({"success": False, "message": "Message is required."})), 400
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return add_cors_headers(jsonify({"success": False, "message": "Invalid email format."})), 400
        # More flexible phone validation - allow spaces, dashes, and parentheses
        if phone:
            phone_digits = re.sub(r'[^\d]', '', phone)  # Extract only digits
            if not phone_digits or not (7 <= len(phone_digits) <= 15):
                return add_cors_headers(jsonify({"success": False, "message": "Invalid phone number. Please use 7-15 digits."})), 400
            phone = phone_digits  # Store only digits

        # Generate Date and Time strings
        current_datetime = datetime.now()
        date_str = current_datetime.strftime("%d-%m-%Y")
        time_str = current_datetime.strftime("%I:%M:%S %p") # 12-hour format with AM/PM

        row_data = [date_str, time_str, name, email, phone, visit_date, message]
        
        # Try Google Sheets first, fall back to CSV
        success_response = jsonify({"success": True, "message": "Thank you! Your inquiry has been submitted successfully."})
        error_response = jsonify({"success": False, "message": "Failed to save inquiry. Please try again."})
        
        # Check if Google Sheets is available
        if worksheet is not None and not use_csv_fallback:
            try:
                print(f"Attempting to write to Google Sheets...")
                worksheet.append_row(row_data, value_input_option='USER_ENTERED')
                print(f"✓ Inquiry from {name} ({email}) successfully written to Google Sheet")
                print(f"  Row data: {row_data}")
                print(f"  Google Sheet URL: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}")
                # Also save to CSV as backup
                write_to_csv(row_data)
                return add_cors_headers(success_response), 200
            except Exception as e:
                print(f"✗ Failed to write to Google Sheets: {e}")
                print(f"Falling back to CSV...")
                if write_to_csv(row_data):
                    print(f"✓ Successfully saved to CSV fallback")
                    return add_cors_headers(success_response), 200
                else:
                    return add_cors_headers(error_response), 500
        else:
            # Use CSV fallback
            print(f"Using CSV storage (Google Sheets not available)")
            if write_to_csv(row_data):
                print(f"✓ Inquiry saved to CSV")
                return add_cors_headers(success_response), 200
            else:
                print(f"✗ Failed to save to CSV")
                return add_cors_headers(error_response), 500

    except gspread.exceptions.APIError as e:
        print(f"Google Sheets API Error: {e}")
        error_details = e.args[0] if e.args else {}
        if isinstance(error_details, dict):
            print(f"Google API error details: {error_details.get('message')}")
        return add_cors_headers(jsonify({"success": False, "message": "Error communicating with Google Sheets. Please try again."})), 503
    except Exception as e:
        print(f"Error processing inquiry: {e}")
        import traceback
        traceback.print_exc()
        return add_cors_headers(jsonify({"success": False, "message": "An internal server error occurred."})), 500

@app.route('/subscribe_email', methods=['POST'])
def handle_subscription():
    """Handle email subscription requests."""
    global worksheet, use_csv_fallback

    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "No data received."}), 400

        email = data.get('email', '').strip()

        # Validation
        if not email:
            return jsonify({"success": False, "message": "Email is required."}), 400
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return jsonify({"success": False, "message": "Invalid email format."}), 400

        # Check if already subscribed (simple check - could be improved)
        try:
            # Get all emails from the sheet (assuming email is in column 4 for bookings)
            if worksheet:
                all_values = worksheet.get_all_values()
                existing_emails = [row[3] for row in all_values[1:] if len(row) > 3]  # Skip header
                
                if email in existing_emails:
                    return jsonify({"success": True, "message": "You're already subscribed!"}), 200
        except Exception as e:
            print(f"Error checking existing subscriptions: {e}")

        # Generate Date and Time strings
        current_datetime = datetime.now()
        date_str = current_datetime.strftime("%d-%m-%Y")
        time_str = current_datetime.strftime("%I:%M:%S %p")

        # Add subscription entry with empty fields for unused columns
        row_data = [date_str, time_str, "Newsletter Subscriber", email, "", "", "Subscribed to newsletter"]
        
        # Try Google Sheets first, fall back to CSV
        if worksheet:
            try:
                worksheet.append_row(row_data, value_input_option='USER_ENTERED')
                print(f"Newsletter subscription from {email} added to Google Sheet")
                write_to_csv(row_data)
                return jsonify({"success": True, "message": "Successfully subscribed! We'll keep you updated."}), 200
            except Exception as e:
                print(f"Failed to write to Google Sheets: {e}")
                if write_to_csv(row_data):
                    return jsonify({"success": True, "message": "Successfully subscribed! We'll keep you updated."}), 200
                else:
                    return jsonify({"success": False, "message": "Failed to save subscription. Please try again."}), 500
        else:
            # Use CSV fallback
            if write_to_csv(row_data):
                return jsonify({"success": True, "message": "Successfully subscribed! We'll keep you updated."}), 200
            else:
                return jsonify({"success": False, "message": "Failed to save subscription. Please try again."}), 500

    except Exception as e:
        print(f"Error processing subscription: {e}")
        return jsonify({"success": False, "message": "An error occurred. Please try again."}), 500

if __name__ == '__main__':
    # Get port from environment variable (Render sets this)
    port = int(os.environ.get('PORT', 5001))
    host = os.environ.get('HOST', '0.0.0.0')
    debug = os.environ.get('FLASK_ENV', 'development') == 'development'
    
    print("\n=== Starting Yasodha Residency Backend Server ===")
    print(f"Server will run on: http://{host}:{port}")
    print(f"Service account file exists: {os.path.exists(SERVICE_ACCOUNT_FILE)}")
    print(f"Google Sheets connected: {worksheet is not None}")
    print(f"CSV fallback active: {use_csv_fallback}")
    print(f"Environment: {os.environ.get('FLASK_ENV', 'development')}")
    print("\nPress Ctrl+C to stop the server\n")
    
    app.run(debug=debug, port=port, host=host)