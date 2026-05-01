# Deployment Guide

This guide covers deploying your portfolio to Vercel, Netlify, and GitHub Pages.

## Prerequisites

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Portfolio website"
   git branch -M main
   git remote add origin https://github.com/Naveed-Ahmed-21/portfolio.git
   git push -u origin main
   ```

2. Replace your resume at `public/resume.pdf`

---

## Option 1: Deploy to Vercel (Recommended)

Vercel offers the best performance and easiest deployment for React/Vite apps.

### Steps:

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub

2. Click "Add New Project"

3. Import your GitHub repository

4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Click "Deploy"

6. Your site will be live at `https://your-portfolio.vercel.app`

### Custom Domain (Optional):

1. Go to Project Settings > Domains

2. Add your custom domain

3. Update DNS records as instructed

---

## Option 2: Deploy to Netlify

Netlify is another excellent option with similar features.

### Steps:

1. Go to [netlify.com](https://netlify.com) and sign in with GitHub

2. Click "Add new site" > "Import an existing project"

3. Connect to GitHub and select your repository

4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

5. Click "Deploy site"

6. Your site will be live at `https://your-portfolio.netlify.app`

### Custom Domain (Optional):

1. Go to Site Settings > Domain Management

2. Add your custom domain

3. Update DNS records as instructed

---

## Option 3: Deploy to GitHub Pages

Free hosting directly from your GitHub repository.

### Steps:

1. Install `gh-pages` package:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Update `package.json`:
   ```json
   {
     "homepage": "https://Naveed-Ahmed-21.github.io/portfolio",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Update `vite.config.js`:
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/portfolio/',
     server: {
       port: 3000,
       open: true
     }
   })
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

5. Go to repository Settings > Pages and ensure it's using the `gh-pages` branch

6. Your site will be live at `https://Naveed-Ahmed-21.github.io/portfolio`

---

## Option 4: Deploy to Render

Render offers free static site hosting.

### Steps:

1. Go to [render.com](https://render.com) and sign up

2. Click "New" > "Static Site"

3. Connect your GitHub repository

4. Configure:
   - **Name**: your-portfolio
   - **Branch**: main
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

5. Click "Create Static Site"

---

## Post-Deployment Checklist

After deploying, verify:

- [ ] All sections load correctly
- [ ] Navigation works (smooth scroll)
- [ ] Mobile responsiveness is intact
- [ ] Contact form works (or mailto fallback)
- [ ] Social links are correct
- [ ] Resume download works
- [ ] Animations play smoothly
- [ ] No console errors

---

## Performance Optimization

### Enable Compression

For Vercel/Netlify, compression is automatic. For custom hosting, enable gzip/brotli.

### Image Optimization

- Convert images to WebP format
- Use tools like TinyPNG or Squoosh
- Aim for images under 100KB

### Lazy Loading

Images and components are already optimized for lazy loading via React and AOS.

---

## Environment Variables (Optional)

If you add EmailJS for the contact form:

1. Create `.env` file:
   ```
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

2. Add environment variables to your hosting platform

3. Update `Contact.jsx` to use EmailJS

---

## Continuous Deployment

All platforms above support automatic deployments:
- Push to `main` branch = automatic deployment
- Pull requests create preview deployments
- Rollback to previous versions available

---

## Troubleshooting

### 404 on refresh

Add a `_redirects` file (Netlify) or `vercel.json` (Vercel):

**Netlify** (`public/_redirects`):
```
/*    /index.html   200
```

**Vercel** (`vercel.json`):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### Blank page after build

Check browser console for errors. Common issues:
- Incorrect `base` path in `vite.config.js`
- Missing dependencies
- Build errors

### Animations not working

- Ensure AOS is initialized
- Check that `aos` package is installed
- Verify CSS import in `App.jsx`

---

## Support

For issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Vite Documentation](https://vitejs.dev)
