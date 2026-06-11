# Rohit Portfolio (React + Vite)

Editorial portfolio with impact metrics on every project card. Built with **React 19** and **Vite**.

## Quick start

**You must install dependencies once before `npm run dev`.** If you see `'vite' is not recognized`, run install first.

```bash
npm install
npm run dev
```

On Windows you can also double-click `install.bat` in this folder, then run `npm run dev`.

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |

## Project structure

```
src/
  main.jsx          # React entry
  App.jsx           # Page layout
  index.css         # Global styles
  data/
    site.js         # Bio, nav, timeline, footer
    projects.js     # Projects + impact metrics
  components/       # Header, Hero, Work, ProjectCard, etc.
  hooks/
    useReveal.js    # Scroll reveal for cards
public/
  favicon.svg
```

## Customize

- **Site copy:** `src/data/site.js`
- **Projects & metrics:** `src/data/projects.js`
- **Styles:** `src/index.css` (`:root` variables)
- **New card visual:** add a case in `CardVisual.jsx` and a `mock` type in `projects.js`

## Deploy

```bash
npm run build
```

Upload the `dist/` folder to Vercel, Netlify, GitHub Pages, or any static host.
