# Zeyu Ling · Personal Research Homepage

A bilingual, responsive research homepage for Zeyu Ling, focused on 3D human motion generation, multimodal learning, publications, and open-source work.

## Preview locally

```bash
npx http-server . -p 4173 -a 0.0.0.0 -c-1
```

## Content map

- `index.html` — page content and metadata
- `styles.css` — visual system and responsive layout
- `script.js` — language/theme toggles, mobile navigation, publication filters, and figure/demo tabs
- `assets/` — public research figures, demo reels, and MotionHub previews
- `avatar/avatar.jpg` — portrait used in the hero and contact section

The site has no build step. Update text directly in `index.html`; bilingual UI copy lives in `script.js`.

## Publish on GitHub Pages

The included workflow deploys the repository root whenever `main` is pushed. In the GitHub repository, open **Settings → Pages** and select **GitHub Actions** as the source.

For the canonical `https://zeyuling.github.io` address, use a repository named `ZeyuLing.github.io` under the `ZeyuLing` account.

## Public assets

Motion previews come from the public [MotionHub repository](https://github.com/ZeyuLing/MotionHub). Research figures are derived from the author's paper presentation assets.

AnimateCanvas uses the author-approved v17 paper teaser, published as `figures/fig1_teaser.png` in Overleaf commit `068375945fdd870b8293e6e673024bf711f2b83b` on 2026-09-15. The byte-identical website copy is `assets/animatecanvas-paper-teaser-v17.png`, used for both the figure and demo poster. Source: `HYMotionM2M/figures/teaser_real/20260913/final_v17/animatecanvas_teaser_smpl_v17.png`. Do not restore the superseded teaser assets.

The hero montage includes AnimateCanvas, GenTrack, PRISM, VersatileMotion and SyncLipMAE. AnimateCanvas's three 3.8-second background variants come from the public `animatecanvas-demo-1080p.mp4` demo at 32, 70 and 146 seconds (route control, jump, and basketball). Each has fast-start, muted desktop/mobile encodes and matching posters. The publication also plays the full V56 demo, without trimming. Reloads choose a different variant per project as well as a new order; this is a finite clip pool, not arbitrary runtime video editing. MCM and EnchantDance are excluded from the background pool.

Public preprint status uses arXiv release information, not submission or review status. Keep both `index.html` fallback copy and `script.js` translations in sync. Accepted publication venues and awards remain publication metadata.
