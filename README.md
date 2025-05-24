# Yasodha PG Website

This is the website for Yasodha Residency PG accommodation.

## Running the Website

There are two ways to run this website locally:

### 1. Standard Python HTTP Server

This is the simplest method but may occasionally show broken pipe errors with large video files:

```bash
python3 -m http.server 3000
```

### 2. Optimized Custom Server (Recommended)

This custom server handles large file transfers better and prevents broken pipe errors:

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

- `index.html` - Main website content
- `css/` - Stylesheets including the new video.css for video styling
- `js/` - JavaScript files including video-handler.js for optimized video loading
- `pg-photos/` - Images and videos of the PG
- `server.py` - Custom optimized server for handling large file transfers

## Troubleshooting

If you encounter "Broken pipe" errors when serving the website:

1. Use the custom server.py instead of the standard Python HTTP server
2. Ensure video files are optimized for web (compress if needed)
3. Check client connections and network stability