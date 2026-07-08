# Polska Liga Mahjonga - Website

Professional website for Polska Liga Mahjonga (Polish Mahjong League) non-profit organization.

## Features

- 🎨 Traditional Japanese-inspired design with red/gold color scheme
- 📱 Fully responsive layout (mobile, tablet, desktop)
- 🌐 Bilingual support (Polish/English structure ready)
- ♿ Accessible and user-friendly navigation
- ⚡ Modern, clean, and fast-loading
- 🎯 Optimized for tournament registration and member engagement

## CMS + Azure Backend (Current State)

- Frontend runs from `docs/` and is wired to CMS API endpoints (`/api/content...`).
- Admin panel is available at `docs/admin.html` and supports CRUD + seed operations.
- Backend is implemented in `api/` (Azure Functions v4 + TypeScript).
- Content is stored in Azure Cosmos DB (single container model).
- Azure deployment scaffolding is included via:
   - `azure.yaml`
   - `infra/main.bicep`
   - `docs/staticwebapp.config.json`

## Pages Included

- **index.html** - Home page with hero section, about preview, events, and news
- **about.html** - Organization history, mission, values, and timeline
- **events.html** - Tournament listings with registration information
- **contact.html** - Contact form and FAQ section
- **team.html** - Board members and team
- **join.html** - Membership registration
- **news.html** - News and updates

## File Structure

```
org_www/
├── index.html              # Home page
├── about.html              # About us page
├── contact.html            # Contact page
├── events.html             # Events/tournaments page
├── team.html               # Team page (to be created)
├── join.html               # Membership page (to be created)
├── news.html               # News page (to be created)
├── css/
│   ├── style.css           # Main stylesheet
│   └── pages.css           # Pages-specific styles
├── js/
│   └── script.js           # JavaScript functionality
├── images/                 # Placeholder for images
│   ├── news1.jpg
│   ├── news2.jpg
│   └── news3.jpg
└── README.md               # This file
```

## How to Use

### Local Development

1. Simply open `index.html` in your web browser
2. No server required - all files are static HTML/CSS/JS
3. All pages are interlinked and ready to use

### Local CMS/API Development

1. Go to `api/` and install packages:
   - `npm install`
2. Build the backend:
   - `npm run build`
3. Create local config from `api/local.settings.example.json` to `api/local.settings.json`.
4. Start Azure Functions host (requires Azure Functions Core Tools):
   - `npm start`
5. Start frontend from `docs/` using any static server.

### For Production

1. **Upload to web server:**
   - Upload all files maintaining the directory structure
   - Ensure the server supports HTML, CSS, and JavaScript
   - Set index.html as the default document

2. **Configure domain:**
   - Point your domain to the hosting location
   - Ensure HTTPS is enabled for security

3. **Customize content:**
   - Replace sample data with your actual information
   - Add real images to the `/images` directory
   - Update contact information and social media links

## Customization Guide

### Colors

The color scheme can be changed in `css/style.css`:

```css
:root {
    --primary-color: #c41e3a;      /* Main red */
    --secondary-color: #8b0000;    /* Dark red */
    --accent-color: #ffd700;        /* Gold */
    --dark-bg: #1a1a1a;            /* Dark background */
    --light-bg: #f5f5f5;           /* Light background */
}
```

### Adding Images

1. Place images in the `/images` directory
2. Update image references in HTML files
3. Recommended image sizes:
   - Hero backgrounds: 1920x600px
   - News images: 600x400px
   - Team photos: 400x400px

### Forms

Forms currently use basic HTML validation. To make them functional:

1. Add a backend service (PHP, Node.js, etc.) or
2. Use a form service like Formspree, FormSubmit, or Google Forms
3. Update the form `action` attributes accordingly

### Social Media

Update social media links in the footer of each HTML file:

```html
<div class="social-links">
    <a href="YOUR_FACEBOOK_URL"><i class="fab fa-facebook"></i></a>
    <a href="YOUR_TWITTER_URL"><i class="fab fa-twitter"></i></a>
    <a href="YOUR_INSTAGRAM_URL"><i class="fab fa-instagram"></i></a>
    <a href="YOUR_YOUTUBE_URL"><i class="fab fa-youtube"></i></a>
</div>
```

## Organization Information

- **Name:** Polska Liga Mahjonga
- **Founded:** 2010
- **KRS:** 0000356035
- **NIP:** 5222954731
- **Mission:** Propagowanie Mahjonga w Polsce

## Member Organizations

- European Mahjong Association (EMA)
- World Mahjong Organization (WMO)

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## Technologies Used

- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript (ES6+)
- Font Awesome 6.0 for icons
- Google Fonts compatible

## Future Enhancements

Potential features to add:

- [ ] Backend integration for forms
- [ ] Content Management System (CMS)
- [ ] Member login portal
- [ ] Online tournament registration system
- [ ] Photo gallery with lightbox
- [ ] Blog system for news
- [ ] Event calendar integration
- [ ] Newsletter subscription
- [ ] Multi-language switcher functionality
- [ ] Azure Active Directory integration (as requested)

## Converting to Hugo

If you want to convert this to Hugo static site generator:

1. Install Hugo: `https://gohugo.io/installation/`
2. Create new Hugo site: `hugo new site plm`
3. Create theme structure from these files
4. Convert HTML to Hugo templates
5. Move content to markdown files
6. Configure Hugo settings

## Support

For questions or issues:
- Email: kontakt@plm.org.pl
- Website: [Your domain]
- Phone: +48 123 456 789

## License

© 2024 Polska Liga Mahjonga. All rights reserved.

## Credits

Website designed with traditional Japanese aesthetics in mind, featuring:
- Red and gold color palette inspired by Japanese culture
- Mahjong tile emoji (🀄) as branding element
- Clean, modern layout with cultural sensitivity
- Accessibility and usability focus

---

**Note:** This is a static HTML website. All sample data should be replaced with actual organization information before deployment.
