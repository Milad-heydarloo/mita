const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Copy HTML file and optimize it
function optimizeHTML() {
    const htmlContent = fs.readFileSync('index.html', 'utf8');
    
    // Remove comments and extra whitespace
    const optimizedHTML = htmlContent
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .trim();
    
    fs.writeFileSync(path.join(distDir, 'index.html'), optimizedHTML);
    console.log('✅ HTML optimized and copied to dist/');
}

// Optimize CSS
function optimizeCSS() {
    const cssContent = fs.readFileSync('styles.css', 'utf8');
    const result = new CleanCSS({
        level: 2,
        format: 'beautify'
    }).minify(cssContent);
    
    if (result.errors.length > 0) {
        console.error('CSS minification errors:', result.errors);
        return;
    }
    
    fs.writeFileSync(path.join(distDir, 'styles.css'), result.styles);
    console.log('✅ CSS optimized and copied to dist/');
}

// Optimize JavaScript
async function optimizeJS() {
    try {
        const jsContent = fs.readFileSync('scripts.js', 'utf8');
        const result = await minify(jsContent, {
            compress: {
                drop_console: true,
                drop_debugger: true
            },
            mangle: true,
            format: {
                comments: false
            }
        });
        
        fs.writeFileSync(path.join(distDir, 'scripts.js'), result.code);
        console.log('✅ JavaScript optimized and copied to dist/');
    } catch (error) {
        console.error('JavaScript minification error:', error);
    }
}

// Copy images if they exist
function copyImages() {
    const imagesDir = path.join(__dirname, 'images');
    const distImagesDir = path.join(distDir, 'images');
    
    if (fs.existsSync(imagesDir)) {
        if (!fs.existsSync(distImagesDir)) {
            fs.mkdirSync(distImagesDir);
        }
        
        const files = fs.readdirSync(imagesDir);
        files.forEach(file => {
            const srcPath = path.join(imagesDir, file);
            const destPath = path.join(distImagesDir, file);
            fs.copyFileSync(srcPath, destPath);
        });
        
        console.log('✅ Images copied to dist/images/');
    } else {
        console.log('ℹ️  No images directory found, skipping...');
    }
}

// Create .nojekyll file for GitHub Pages
function createNoJekyll() {
    fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
    console.log('✅ .nojekyll file created for GitHub Pages');
}

// Main build function
async function build() {
    console.log('🚀 Starting build process...\n');
    
    try {
        optimizeHTML();
        optimizeCSS();
        await optimizeJS();
        copyImages();
        createNoJekyll();
        
        console.log('\n🎉 Build completed successfully!');
        console.log('📁 Files are ready in the dist/ directory');
        console.log('🚀 Ready for GitHub Pages deployment!');
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

// Run the build
build();