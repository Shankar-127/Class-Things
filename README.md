# Class Things

Class Things is a responsive student resource portal built with plain HTML, CSS, and JavaScript. It has no React, Vite, build step, or npm runtime dependencies.

## Project files

- index.html — page shell and script/style references
- styles.css — responsive visual design
- script.js — navigation, search, filters, theme toggle, preview, downloads, sharing, and forms
- site-data.js — the local subject and PDF catalog
- Sources/ and Creator/ — real PDFs and images served by the site

## Run locally

Open index.html in a modern browser. If your browser blocks local PDF actions, serve the folder with any static web server, for example:

    python -m http.server 8000

Then open http://localhost:8000.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the branch you want to publish (currently master) and choose **/(root)**.
5. Save. GitHub Pages will publish the site without installing packages or running a build.

The site uses relative links for PDFs and images, so it works at both a custom domain and a project URL such as https://username.github.io/Class-Things/.
