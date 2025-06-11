# Yasodha PG Website

A modern, responsive website for Yasodha Residency Ladies PG accommodation in Bangalore. Features include dynamic gallery loading, inquiry form with Google Sheets integration, and a beautiful user interface with smooth animations.

## Running the Website

There are two ways to run this website locally:

### 1. Standard Python HTTP Server

This is the simplest method but may occasionally show broken pipe errors with large video files. Open your browser and go to `http://localhost:3000`.

```bash
python3 -m http.server 3000
```

### 2. Full Stack Server with Backend (Recommended)

This Flask server provides API endpoints for form submissions and dynamic gallery loading. It integrates with Google Sheets for inquiry management.

```bash
python3 server.py
```

The server runs on `http://localhost:5001` by default.

## Features Implemented

1. **Dynamic Gallery**: Automatically loads all images from the pg-photos folder
2. **Gallery Lightbox**: Full-screen image viewing with navigation controls
3. **Google Sheets Integration**: Form submissions are saved to Google Sheets
4. **Smooth Animations**: GSAP-powered animations with scroll triggers
5. **Responsive Design**: Mobile-first design that works on all devices
6. **PWA Support**: Service worker for offline functionality
7. **Private Transport Service**: Dedicated auto service information
8. **Testimonials Carousel**: Swiper.js powered testimonials section
9. **Contact Form**: Advanced form handling with validation and feedback

## File Structure

Here's an overview of the project's directory structure:

```
.
├── .git/                   # Git version control files
├── .gitignore              # Specifies intentionally untracked files that Git should ignore
├── README.md               # This file, providing an overview and instructions
├── assets/                 # General static assets (e.g., icons, fonts)
│   └── ...                 # (Contents of assets directory)
├── css/                    # Stylesheets
│   ├── animations.css
│   ├── responsive.css
│   ├── style.css
│   └── video.css
├── index.html              # Main HTML file for the website
├── inquiries.csv           # CSV file for storing inquiries (if used by the backend)
├── js/                     # JavaScript files
│   ├── animations.js       # GSAP animations
│   ├── form-handler.js     # Contact form submission handling
│   ├── gallery-dynamic-loader.js  # Dynamic gallery image loading
│   ├── gallery-lightbox.js # Lightbox functionality
│   ├── gallery-slider.js   # Swiper.js gallery carousel
│   ├── interactive.js      # Interactive UI elements
│   ├── main.js            # Main JavaScript file
│   ├── sw-register.js     # Service worker registration
│   ├── testimonials-slider.js  # Testimonials carousel
│   └── video-handler.js   # Video handling
├── manifest.json           # Web app manifest for PWA features
├── offline.html            # Page to display when the user is offline (for PWA)
├── pg-photos/              # Images and videos for the PG
│   └── ...                 # (Contents of pg-photos directory)
├── robots.txt              # Instructions for web crawlers
├── sitemap.xml             # Sitemap for search engines
├── server.py               # Flask server with API endpoints
├── service-account.json    # Google service account credentials (should be in .gitignore and not committed)
├── service-worker.js       # Service worker for PWA features (caching, offline support)
├── test_form.html         # Form testing page (development only)
└── yasodha-colour-pallete.jpg # Image file for the color palette
```

**Note:**
- The contents of `assets/` and `pg-photos/` are not fully listed above but contain relevant media files.
- `service-account.json` should be in your `.gitignore` file and **never** committed to the repository.

## API Endpoints

### GET /api/gallery-images
Returns a JSON array of all images in the pg-photos directory:
```json
{
  "images": [
    {"filename": "image1.jpeg", "path": "/pg-photos/image1.jpeg"},
    {"filename": "image2.jpeg", "path": "/pg-photos/image2.jpeg"}
  ]
}
```

### POST /submit-inquiry
Submits inquiry form data to Google Sheets:
```json
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "1234567890",
  "visitDate": "2024-12-31",
  "message": "Inquiry message"
}
```

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   pip install flask flask-cors gspread google-auth
   ```

2. **Google Sheets Setup**:
   - Create a service account in Google Cloud Console
   - Download the service account JSON file and save as `service-account.json`
   - Share your Google Sheet with the service account email
   - Update the `SPREADSHEET_ID` in `server.py`

3. **Run the Server**:
   ```bash
   python3 server.py
   ```

## Troubleshooting

### Form Submission Issues
- Ensure the server is running on port 5001
- Check that service-account.json has proper permissions
- Verify the Google Sheet has a sheet named "2025"

### Gallery Not Loading
- Check that images are in the pg-photos directory
- Ensure the Flask server is running
- Check browser console for CORS errors