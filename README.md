Tailwind migration — local build

Steps to build CSS:

1. Install dependencies:

```bash
npm install
```

2. Build production CSS:

```bash
npm run build:css
```

3. For development with auto-rebuild:

```bash
npm run dev:css
```

Notes:
- This project no longer uses the `https://cdn.tailwindcss.com` CDN in production.
- Custom Tailwind theme and fonts are defined in `tailwind.config.cjs`.
- The built stylesheet is `dist/styles.css` and is referenced from `index.html`.
