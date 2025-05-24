from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address # To get user's IP address for rate limiting
import json # For potential future use, though jsonify handles most cases
import os # For potential future use with environment variables
import csv
from datetime import datetime, date as dt_date # Import date for comparison
import re # For regex-based validation
import html # For sanitization

# Serve static files from the root directory (where index.html, css/, js/ are)
app = Flask(__name__, static_folder='.', static_url_path='')

# Initialize Limiter
limiter = Limiter(
    get_remote_address, # Key function to identify clients (by IP)
    app=app,
    default_limits=["200 per day", "50 per hour"], # Default limits for all routes (optional)
    storage_uri="memory://",  # Storage for rate limit data (memory, redis, memcached, etc.)
    # For production, consider a persistent storage like Redis if you have multiple server processes
)

# Configure CORS: Allow all origins for /api/* routes for simplicity during development.
# For production, you should restrict this to your actual frontend domain.
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5000"}}) # More specific for local dev

# --- Configuration ---
CSV_FILE_PATH = 'inquiries.csv'
CSV_HEADERS = ['Timestamp', 'Name', 'Email', 'Phone', 'Preferred Visit Date', 'Message']
MAX_MESSAGE_LENGTH = 1000  # Max characters for the message
PHONE_REGEX = r"^[\d\s\-\+\(\)]{7,20}$" # Simple regex for phone: digits, spaces, hyphens, plus, parens, 7-20 chars

# --- Helper Functions ---
def initialize_csv():
    """Create the CSV file with headers if it doesn't exist."""
    if not os.path.exists(CSV_FILE_PATH):
        with open(CSV_FILE_PATH, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(CSV_HEADERS)

# Initialize CSV on startup
initialize_csv()

@app.route('/')
def index():
    # Serve index.html from the root (which is now our static_folder)
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/submit-inquiry', methods=['POST'])
@limiter.limit("10 per minute")
def handle_inquiry():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "No data received."}), 400

        raw_name = data.get('name', '').strip()
        raw_email = data.get('email', '').strip()
        raw_message = data.get('message', '').strip()
        raw_phone = data.get('phone', '').strip()
        raw_visit_date_str = data.get('visitDate', '').strip()

        s_name = html.escape(raw_name)
        s_message = html.escape(raw_message)
        s_email = raw_email
        s_phone = html.escape(raw_phone)
        s_visit_date_str = raw_visit_date_str

        if not s_name or not s_email or not s_message:
            return jsonify({"success": False, "message": "Missing required fields: Name, Email, or Message."}), 400
        
        if not re.match(r"[^@]+@[^@]+\.[^@]+", s_email):
             return jsonify({"success": False, "message": "Invalid email format."}), 400

        if s_phone and not re.match(PHONE_REGEX, s_phone):
            return jsonify({"success": False, "message": f"Invalid phone number format. Please use 7-20 digits, spaces, or symbols like +, -, ()."}), 400

        if s_visit_date_str:
            try:
                visit_dt = datetime.strptime(s_visit_date_str, '%Y-%m-%d').date()
                if visit_dt < dt_date.today():
                    return jsonify({"success": False, "message": "Preferred visit date cannot be in the past."}), 400
            except ValueError:
                return jsonify({"success": False, "message": "Invalid date format for preferred visit date. Please use YYYY-MM-DD."}), 400

        if len(s_message) > MAX_MESSAGE_LENGTH:
            return jsonify({"success": False, "message": f"Message is too long. Maximum length is {MAX_MESSAGE_LENGTH} characters."}), 400

        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        row_data = [timestamp, s_name, s_email, s_phone, s_visit_date_str, s_message]

        with open(CSV_FILE_PATH, mode='a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(row_data)

        print(f"Inquiry from {s_name} ({s_email}) saved to CSV.")
        return jsonify({"success": True, "message": "Inquiry received successfully! We will get back to you soon."}), 200

    except Exception as e:
        print(f"Error processing inquiry: {e}")
        return jsonify({"success": False, "message": "An internal server error occurred. Please try again later."}), 500

# Custom error handler for rate limit exceeded
@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify(success=False, message="Rate limit exceeded. Please try again later."), 429

if __name__ == '__main__':
    # For development, you can run this with `python server.py`
    # For production, use a proper WSGI server like Gunicorn or Waitress.
    app.run(debug=True, port=5000)
    # Ensure debug=False in a production environment.