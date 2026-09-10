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

MotionCanvas uses the paper's actual Figure 1, `figures/fig1_teaser.png`, from paper revision `95c4fb06783cb98e3547f592b468be91485c3d13` (Git blob `f0382162b844082a10b28c21cc4b614ea039b153`). The byte-identical website copy is `assets/motioncanvas-paper-teaser-f0382162.png`, used for both the figure and demo poster. Do not restore the retired `motioncanvas-teaser.png` presentation collage.

The hero montage includes MotionCanvas, GenTrack, PRISM, VersatileMotion and SyncLipMAE. MotionCanvas's three 3.8-second background variants come from the public `motioncanvas-v56-complete-1080p.mp4` demo at 32, 70 and 146 seconds (route control, jump, and basketball). Each has fast-start, muted desktop/mobile encodes and matching posters. The publication also plays the full V56 demo, without trimming. Reloads choose a different variant per project as well as a new order; this is a finite clip pool, not arbitrary runtime video editing. MCM and EnchantDance are excluded from the background pool.

Public preprint status uses arXiv release information, not submission or review status. Keep both `index.html` fallback copy and `script.js` translations in sync. Accepted publication venues and awards remain publication metadata.
