# PRISM AI Technical Documentation Site

GitHub Pages static site for PRISM AI Tools, with detailed screen-by-screen documentation.

## Structure

- `index.html`: main landing page with catalog, search, and screen overview
- `pages/*.html`: detailed per-screen documentation pages (16 total)
- `assets/js/page-data.js`: per-screen technical data (features, services, topics, I/O, failure modes)
- `assets/js/page-template.js`: shared renderer
- `assets/css/page.css`: shared styles with the A2Z font applied

## Font

The requested A2Z font is included as a local static asset.

- Source: https://freesentation.blog/a2z
- Original repository: https://github.com/Freesentation/A2Z
- Applied files: `assets/fonts/A2Z-*.woff2`

## Local Run

```bash
cd /Users/kyuhwan.shim/Documents/prism_ai
python3 -m http.server 8080
# http://localhost:8080
```

## GitHub Pages Deployment

1. Push the repository
2. Repository Settings > Pages
3. Source: `Deploy from a branch`
4. Branch: `main`, Folder: `/ (root)`
