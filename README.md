# Naveed Ahmed K - Personal Portfolio

A production-level personal portfolio website built with React + Vite for a Flutter Developer | Full Stack Engineer.

![Portfolio Preview](./public/images/preview.png)

## Features

- Fully responsive (mobile-first)
- Smooth animations (AOS)
- Fast loading, optimized assets
- Sticky navbar with active section highlight
- Clean modern dark UI (blue/purple gradient theme)
- Glassmorphism card design
- Professional typography and spacing
- Typing animation for hero roles
- Scroll-to-top button
- Page loading animation
- Smooth section transitions
- Hover animations on project cards

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS3 with custom properties
- **Animations**: AOS (Animate On Scroll)
- **Icons**: React Icons

## Project Structure

```
portfolio/
├── public/
│   ├── images/
│   │   └── projects/
│   └── resume.pdf          # Place your resume here
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Skills.jsx
│   │   ├── Projects.jsx
│   │   ├── Leadership.jsx
│   │   ├── Education.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── ScrollToTop.jsx
│   │   └── Preloader.jsx
│   ├── data/
│   │   └── content.js      # All content configuration
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd placements/portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production build will be generated in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Customization

### Update Personal Information

Edit `src/data/content.js` to update:
- Name and title
- Contact information
- Skills
- Projects
- Education details
- Leadership experience

### Add Your Resume

Place your resume PDF at `public/resume.pdf` for the download button to work.

### Add Project Images

Add project screenshots to `public/images/projects/` and reference them in the content file.

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub

2. Visit [Vercel](https://vercel.com)

3. Import your repository

4. Vercel will automatically detect Vite and deploy

5. Your site will be live at `https://your-project.vercel.app`

### Deploy to Netlify

1. Push your code to GitHub

2. Visit [Netlify](https://netlify.com)

3. Create a new site from Git

4. Select your repository

5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

6. Deploy

### Deploy Manually

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload the contents of `dist/` folder to your hosting provider

## Performance

Target Lighthouse scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

### Optimization Tips

- Compress images before adding
- Use WebP format for images
- Minimize external dependencies
- Enable gzip/brotli compression on hosting

## SEO

The portfolio includes:
- Meta description and keywords
- Open Graph tags for social sharing
- Twitter Card support
- Semantic HTML structure
- Proper heading hierarchy

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is open source and available under the MIT License.

## Contact

- **Email**: naveedsha269@gmail.com
- **GitHub**: https://github.com/Naveed-Ahmed-21
- **LinkedIn**: https://linkedin.com/in/naveedahmedk
