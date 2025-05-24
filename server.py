#!/usr/bin/env python
from flask import Flask, request, jsonify, send_from_directory
import gspread
from google.oauth2.service_account import Credentials # Explicitly use Credentials from google-auth
from datetime import datetime
import re
import os # To check for service account file

app = Flask(__name__, static_folder='.', static_url_path='')

# --- Google Sheets Configuration ---
SERVICE_ACCOUNT_FILE = 'service-account.json'
SPREADSHEET_ID = '1hvWPV9f9bvliF2OpAcSy1dHRkLQF84t_TDAHRa3xTuU'
SHEET_NAME = 'Sheet1'

# Define the scope for Google Sheets and Drive API
SCOPE = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']

# Updated SHEET_HEADERS
SHEET_HEADERS = ['Date', 'Time', 'Name', 'Email', 'Phone', 'VisitDate', 'Message']

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

# --- Authenticate and get worksheet ---
gc = None
worksheet = None

if os.path.exists(SERVICE_ACCOUNT_FILE):
    try:
        creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPE)
        gc = gspread.Client(auth=creds)
        print(f"Type of gc object: {type(gc)}")
        # print(f"Attributes of gc: {dir(gc)}") # Kept for future debug if needed

        # Using open_by_key as open_by_id is missing in this gspread version
        print(f"Attempting to open spreadsheet with ID: {SPREADSHEET_ID} using open_by_key...")
        spreadsheet = gc.open_by_key(SPREADSHEET_ID)
        print("Spreadsheet opened successfully.")

        try:
            worksheet = spreadsheet.worksheet(SHEET_NAME)
        except gspread.exceptions.WorksheetNotFound:
            print(f"Worksheet '{SHEET_NAME}' not found. Creating it.")
            worksheet = spreadsheet.add_worksheet(title=SHEET_NAME, rows="100", cols="20")
        
        initialize_google_sheet(worksheet)
        print(f"Successfully connected to Google Sheet: '{spreadsheet.title}' -> Worksheet: '{worksheet.title}'")
    except Exception as e:
        print(f"!!! CRITICAL ERROR: Could not connect to Google Sheets. Check credentials, sheet ID, and sharing. Error: {e}")
        worksheet = None
else:
    print(f"!!! CRITICAL ERROR: Service account file '{SERVICE_ACCOUNT_FILE}' not found. Google Sheets integration will not work.")

@app.route('/')
def index():
    """Serves the index.html file."""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/submit_booking', methods=['POST'])
def handle_booking_submission():
    global worksheet # Access the globally initialized worksheet
    if not worksheet:
        print("Error: Google Sheet not available. Cannot log inquiry.")
        return jsonify({"success": False, "message": "Server error: Could not connect to data storage."}), 500

    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "No data received."}), 400

        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        visit_date = data.get('visitDate', '') # Optional, no specific validation for now
        message = data.get('message', '').strip()

        if not name:
            return jsonify({"success": False, "message": "Name is required."}), 400
        if not email:
            return jsonify({"success": False, "message": "Email is required."}), 400
        if not message:
            return jsonify({"success": False, "message": "Message is required."}), 400
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return jsonify({"success": False, "message": "Invalid email format."}), 400
        if phone and (not phone.isdigit() or not (7 <= len(phone) <= 15)):
            return jsonify({"success": False, "message": "Invalid phone number. Please use 7-15 digits."}), 400

        # Generate Date and Time strings
        current_datetime = datetime.now()
        date_str = current_datetime.strftime("%d-%m-%Y")
        time_str = current_datetime.strftime("%I:%M:%S %p") # 12-hour format with AM/PM

        row_data = [date_str, time_str, name, email, phone, visit_date, message]
        
        worksheet.append_row(row_data, value_input_option='USER_ENTERED')
        print(f"Inquiry from {name} ({email}) appended to Google Sheet: '{worksheet.spreadsheet.title}' -> '{worksheet.title}'")
        return jsonify({"success": True, "message": "Inquiry received successfully!"}), 200

    except gspread.exceptions.APIError as e:
        print(f"Google Sheets API Error: {e}")
        error_details = e.args[0] if e.args else {}
        if isinstance(error_details, dict):
            print(f"Google API error details: {error_details.get('message')}")
        return jsonify({"success": False, "message": "Error communicating with Google Sheets. Please try again."}), 503
    except Exception as e:
        print(f"Error processing inquiry: {e}")
        return jsonify({"success": False, "message": "An internal server error occurred."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)