#!/bin/bash

# Optimized build script for Arithmetic Game
echo "🚀 Starting optimized build process..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run type checking
echo "🔍 Running TypeScript type checking..."
npx tsc --noEmit

# Run linting
echo "🔍 Running ESLint..."
npm run lint

# Build with optimizations
echo "🏗️ Building with optimizations..."
npm run build

# Check bundle size
echo "📊 Analyzing bundle size..."
npx vite-bundle-analyzer dist

# Optimize images (if ImageOptim CLI is available)
if command -v imageoptim &> /dev/null; then
    echo "🖼️ Optimizing images..."
    imageoptim public/avatars/*.png public/avatars/*.jpg public/avatars/*.jpeg 2>/dev/null || true
fi

# Compress assets
echo "🗜️ Compressing assets..."
if command -v gzip &> /dev/null; then
    find dist -name "*.js" -o -name "*.css" -o -name "*.html" | xargs gzip -k
fi

# Generate service worker
echo "⚙️ Generating service worker..."
cp public/sw.js dist/

# Copy manifest
echo "📋 Copying PWA manifest..."
cp public/manifest.json dist/

# Set proper permissions
echo "🔐 Setting file permissions..."
chmod 644 dist/*
chmod 755 dist

# Create .htaccess for Apache (if needed)
echo "📝 Creating .htaccess for Apache..."
cat > dist/.htaccess << 'EOF'
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType audio/mpeg "access plus 1 year"
    ExpiresByType audio/wav "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>

# Handle SPA routing
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
EOF

# Create nginx.conf for Nginx (if needed)
echo "📝 Creating nginx.conf for Nginx..."
cat > dist/nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
EOF

# Generate build report
echo "📋 Generating build report..."
{
    echo "Build Report - $(date)"
    echo "========================"
    echo "Build size: $(du -sh dist | cut -f1)"
    echo "Files: $(find dist -type f | wc -l)"
    echo "JavaScript files: $(find dist -name "*.js" | wc -l)"
    echo "CSS files: $(find dist -name "*.css" | wc -l)"
    echo "Image files: $(find dist -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.svg" | wc -l)"
    echo "Audio files: $(find dist -name "*.mp3" -o -name "*.wav" -o -name "*.ogg" | wc -l)"
} > dist/build-report.txt

echo "✅ Build completed successfully!"
echo "📁 Build output: dist/"
echo "📊 Build report: dist/build-report.txt"
echo "🌐 To preview: npm run preview" 