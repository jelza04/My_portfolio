# Jiya Elza Jabi — Portfolio

Portfolio site structure:
- `index.html` — markup
- `css/style.css` — all styles
- `js/main.js` — animations, hero basketball game, scroll effects
- `assets/portrait.webp` — about-section line art
- `Jiya_Elza_Jabi_Resume.pdf` — public resume (phone redacted)

## Run locally
Just open `index.html` in a browser (internet needed once for fonts + GSAP/Lenis CDNs).

## Features
- Interactive hero: spring-field basketball mini-game (steer the ball with your cursor, sink the hoop)
- Lenis smooth scrolling + GSAP ScrollTrigger animations
- Word-by-word about reveal, pinned horizontal projects, trajectory timeline, pinned contact CTA
- Triangle-pattern cursor trail after the hero
- Live section indicator + scroll progress bar

## Before going live
1. Contact form is wired to Formspree (delivers to jabijiya04@gmail.com).
2. Keep the folder structure intact — index.html references css/, js/, and assets/.

## Deploy (free)
- **GitHub Pages**: push this folder to a repo → Settings → Pages → deploy from branch.
- **Netlify**: drag & drop this folder at https://app.netlify.com/drop
- **Vercel**: `vercel` in this folder, or import the repo at vercel.com.
