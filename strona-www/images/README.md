# Images Directory

This directory is for storing website images.

## Recommended Image Sizes

### News Images
- **Filename:** news1.jpg, news2.jpg, news3.jpg, etc.
- **Size:** 600x400px
- **Format:** JPG or PNG
- **Usage:** News article thumbnails

### Hero Background
- **Filename:** hero-bg.jpg
- **Size:** 1920x600px
- **Format:** JPG
- **Usage:** Hero section background (optional)

### Team Photos
- **Filename:** team-member-name.jpg
- **Size:** 400x400px (square)
- **Format:** JPG or PNG
- **Usage:** Team member photos

### Event Images
- **Filename:** event-name.jpg
- **Size:** 800x500px
- **Format:** JPG or PNG
- **Usage:** Event detail pages

### Logo
- **Filename:** logo.png
- **Size:** 200x200px (transparent background)
- **Format:** PNG
- **Usage:** Organization logo

## Current Setup

The website currently uses emoji placeholders:
- 🀄 for the mahjong tile symbol
- 🏆, 📚, 👥 etc. for icons
- Gradient backgrounds for image placeholders

## How to Add Real Images

1. Place your images in this directory
2. Update the image references in HTML files:
   - Replace `<div class="news-image">🀄</div>` with `<img src="images/your-image.jpg" alt="Description">`
   - Update paths in CSS if adding background images

## Image Optimization Tips

- Compress images before uploading (use tools like TinyPNG or ImageOptim)
- Use appropriate file formats:
  - JPG for photos
  - PNG for images with transparency
  - WebP for better compression (modern browsers)
- Consider responsive images for different screen sizes
- Add descriptive alt text for accessibility

## Note

The website is fully functional without real images - it uses emoji and gradient placeholders that maintain the design integrity.
