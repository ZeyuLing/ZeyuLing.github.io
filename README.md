# Zeyu Ling · Personal Research Homepage

A bilingual, responsive research homepage for Zeyu Ling, focused on 3D human motion generation, multimodal learning, publications, and open-source work.

## Preview locally

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Content map

- `index.html` — page content and metadata
- `styles.css` — visual system and responsive layout
- `script.js` — language/theme toggles, mobile navigation, and publication filters
- `assets/` — public research visuals, MotionHub previews, and downloadable CV
- `avatar/avatar.jpg` — portrait used in the hero and contact section

The site has no build step. Update text directly in `index.html`; bilingual UI copy lives in `script.js`.

## Publish on GitHub Pages

The included workflow deploys the repository root whenever `main` is pushed. In the GitHub repository, open **Settings → Pages** and select **GitHub Actions** as the source.

For the canonical `https://zeyuling.github.io` address, use a repository named `ZeyuLing.github.io` under the `ZeyuLing` account.

## Public assets

Motion previews come from the public [MotionHub repository](https://github.com/ZeyuLing/MotionHub). Research figures are derived from the author's paper presentation assets.
