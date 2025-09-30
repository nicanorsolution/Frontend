# ngx-extended-pdf-viewer Production Deployment Guide

## Issue Description
The ngx-extended-pdf-viewer works locally but fails to display PDFs when deployed to production server.

## Root Causes and Solutions

### 1. Missing PDF.js Scripts (CRITICAL)
**Problem**: PDF.js core scripts not included in build
**Solution**: Added required scripts to angular.json
```json
"scripts": [
  "node_modules/ngx-extended-pdf-viewer/assets/pdf.js",
  "node_modules/ngx-extended-pdf-viewer/assets/viewer.js"
]
```

### 2. Server MIME Type Configuration
**Problem**: Server doesn't recognize .mjs and .ftl files
**Solutions**: 

#### For IIS (Windows Server):
- Use the provided `web.config` file
- Ensures .mjs files served as 'text/javascript'
- Ensures .ftl files served as 'text/plain'

#### For Nginx:
- Use the provided `nginx-pdf-viewer.conf` configuration
- Add to your server block configuration

#### For Apache:
Add to .htaccess or virtual host:
```apache
<Files "*.mjs">
    ForceType text/javascript
</Files>
<Files "*.ftl">
    ForceType text/plain
</Files>
```

### 3. Asset Configuration
**Fixed**: Added PDF worker asset explicitly to ensure availability

### 4. Error Handling
**Enhanced**: Added proper error handling and fallback download option

## Testing Production Deployment

### 1. Build for Production
```bash
ng build --configuration production
```

### 2. Check Built Assets
Verify these files exist in `dist/frontend/assets/`:
- pdf.js
- viewer.js
- pdf.worker.js
- Various .mjs files
- Locale files (.ftl)

### 3. Server Configuration
- Deploy appropriate server config file (web.config for IIS, nginx config for Nginx)
- Ensure MIME types are properly configured
- Verify assets are served with correct headers

### 4. Browser Developer Tools Debugging
Check for these common errors:
- "Failed to load module script" → MIME type issue
- "pdf.worker.js not found" → Asset path issue
- "Cannot read property of undefined" → Missing PDF.js scripts

## Fallback Options
If PDF viewer still fails:
1. Component shows download link automatically
2. Users can download PDF to view locally
3. Error messages guide user actions

## Performance Optimization
- Server compression enabled for JavaScript files
- Cache headers set for asset files
- PDF worker loaded asynchronously

## Version Compatibility
- Current setup uses ngx-extended-pdf-viewer v21.4.6
- Compatible with Angular 15+
- PDF.js version automatically managed by library

## Support
If issues persist:
1. Check browser console for specific errors
2. Verify all asset files are accessible via direct URL
3. Test with different PDF files to isolate content issues
4. Consider using direct blob src instead of base64Src for large files
