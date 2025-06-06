#!/usr/bin/env python
from flask import Flask, request, jsonify, send_from_directory
import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime
import re
import os
import time
import csv
import json

app = Flask(__name__, static_folder='.', static_url_path='')

# --- Google Sheets Configuration ---
SERVICE_ACCOUNT_FILE = 'service-account.json'
SPREADSHEET_ID = '1hvWPV9f9bvliF2OpAcSy1dHRkLQF84t_TDAHRa3xTuU'
SHEET_NAME = 'Sheet1'

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
        
        # Add some delay to handle timing issues
        time.sleep(1)
        
        # Create credentials with explicit scopes
        creds = Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, 
            scopes=SCOPE
        )
        
        # Authorize gspread client
        gc = gspread.authorize(creds)
        print(f"Google Sheets client authorized successfully")

        # Open the spreadsheet
        print(f"Attempting to open spreadsheet with ID: {SPREADSHEET_ID}")
        spreadsheet = gc.open_by_key(SPREADSHEET_ID)
        print("Spreadsheet opened successfully.")

        try:
            worksheet = spreadsheet.worksheet(SHEET_NAME)
            print(f"Found existing worksheet: '{SHEET_NAME}'")
        except gspread.exceptions.WorksheetNotFound:
            print(f"Worksheet '{SHEET_NAME}' not found. Creating it.")
            worksheet = spreadsheet.add_worksheet(title=SHEET_NAME, rows="100", cols="20")
        
        initialize_google_sheet(worksheet)
        print(f"Successfully connected to Google Sheet: '{spreadsheet.title}' -> Worksheet: '{worksheet.title}'")
        
    except (gspread.exceptions.APIError, gspread.exceptions.GSpreadException) as api_error:
        print(f"Google Sheets API Error: {api_error}")
        if 'Invalid JWT Signature' in str(api_error) or 'invalid_grant' in str(api_error):
            print("\n=== JWT Signature Error - Using CSV Fallback ===")
            print(f"Service account email: {service_account_email}")
            print("\nTo fix this issue:")
            print("1. Ensure your system clock is synchronized")
            print("2. Regenerate the service account key in Google Cloud Console")
            print("3. Share the Google Sheet with the service account email above")
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

@app.route('/submit_booking', methods=['POST'])
def handle_booking_submission():
    global worksheet, use_csv_fallback # Access the globally initialized worksheet

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
        
        # Try Google Sheets first, fall back to CSV
        if worksheet:
            try:
                worksheet.append_row(row_data, value_input_option='USER_ENTERED')
                print(f"Inquiry from {name} ({email}) appended to Google Sheet")
                # Also save to CSV as backup
                write_to_csv(row_data)
                return jsonify({"success": True, "message": "Inquiry received successfully!"}), 200
            except Exception as e:
                print(f"Failed to write to Google Sheets: {e}")
                if write_to_csv(row_data):
                    return jsonify({"success": True, "message": "Inquiry received successfully!"}), 200
                else:
                    return jsonify({"success": False, "message": "Failed to save inquiry. Please try again."}), 500
        else:
            # Use CSV fallback
            if write_to_csv(row_data):
                return jsonify({"success": True, "message": "Inquiry received successfully!"}), 200
            else:
                return jsonify({"success": False, "message": "Failed to save inquiry. Please try again."}), 500

    except gspread.exceptions.APIError as e:
        print(f"Google Sheets API Error: {e}")
        error_details = e.args[0] if e.args else {}
        if isinstance(error_details, dict):
            print(f"Google API error details: {error_details.get('message')}")
        return jsonify({"success": False, "message": "Error communicating with Google Sheets. Please try again."}), 503
    except Exception as e:
        print(f"Error processing inquiry: {e}")
        return jsonify({"success": False, "message": "An internal server error occurred."}), 500

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
    app.run(debug=True, port=5000, host='127.0.0.1')