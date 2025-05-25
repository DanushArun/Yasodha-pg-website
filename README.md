# Yasodha PG Website

This is the website for Yasodha Residency PG accommodation.

## Running the Website

There are two ways to run this website locally:

### 1. Standard Python HTTP Server

This is the simplest method but may occasionally show broken pipe errors with large video files. Open your browser and go to `http://localhost:3000`.

```bash
python3 -m http.server 3000
```

### 2. Optimized Custom Server (Recommended)

This custom server handles large file transfers better and prevents broken pipe errors. The server will start, and you can access the website, typically at `http://localhost:8000` (or the port specified in `server.py`).

```bash
python3 server.py
```

## Optimizations Implemented

1. **Video Lazy Loading**: Videos only load when they're about to be viewed
2. **Chunked File Transfers**: Large files are sent in smaller chunks to prevent connection issues
3. **Error Handling**: Graceful handling of connection issues
4. **Loading Indicators**: Visual feedback for users during video loading
5. **Preload Attributes**: Videos set to `preload="none"` to prevent automatic loading

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
│   ├── form-handler.js
│   ├── gallery-slider.js
│   └── video-handler.js    # (Assuming this was from previous context, adjust if not present)
├── manifest.json           # Web app manifest for PWA features
├── offline.html            # Page to display when the user is offline (for PWA)
├── pg-photos/              # Images and videos for the PG
│   └── ...                 # (Contents of pg-photos directory)
├── robots.txt              # Instructions for web crawlers
├── sitemap.xml             # Sitemap for search engines
├── server.py               # Custom Python server for serving the website
├── service-account.json    # Google service account credentials (should be in .gitignore and not committed)
├── service-worker.js       # Service worker for PWA features (caching, offline support)
└── yasodha-colour-pallete.jpg # Image file for the color palette
```

**Note:**
- The contents of `assets/` and `pg-photos/` are not fully listed above but contain relevant media files.
- `service-account.json` should be in your `.gitignore` file and **never** committed to the repository.

## Troubleshooting

If you encounter "Broken pipe" errors when serving the website:

1. Use the custom server.py instead of the standard Python HTTP server
2. Ensure video files are optimized for web (compress if needed)
3. Check client connections and network stability