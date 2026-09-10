// Deterministic regression tests for the real controller, without media/network.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const source = process.argv.includes('--baseline')
  ? execFileSync('git', ['show', 'HEAD:hero-montage.js'], { encoding: 'utf8' })
  : fs.readFileSync(require('node:path').join(__dirname, '..', 'hero-montage.js'), 'utf8');

function fixture() {
  const timers = new Map();
  let serial = 0;
  const element = () => ({
    dataset: {}, style: { setProperty() {} },
    classList: { add() {}, remove() {}, toggle() {} },
    setAttribute() {}, removeAttribute() {}, hasAttribute() { return false; }, getAttribute() { return null; },
    addEventListener() {}, removeEventListener() {},
    pause() { this.paused = true; }, load() {},
    play() { this.plays++; this.paused = false; return Promise.resolve(); },
    plays: 0, currentTime: 3.8, duration: 3.8, paused: true, ended: true, readyState: 3
  });
  const videos = [element(), element()];
  const hero = element();
  const root = element(); root.lang = 'en';
  const playlist = Array.from({ length: 5 }, (_, i) => ({
    id: `clip${i}`, projectId: `project${i}`, title: `Project ${i}`,
    desktop: `clip${i}.mp4`, mobile: `clip${i}-mobile.mp4`,
    posterDesktop: 'poster.jpg', posterMobile: 'poster.jpg', sourceIn: 0, sourceOut: 3.8
  }));
  const window = {
    __heroMontage: { playlist }, matchMedia: () => ({ matches: false }),
    setTimeout(fn, delay) { const id = ++serial; timers.set(id, { fn, delay }); return id; },
    clearTimeout(id) { timers.delete(id); }
  };
  const context = vm.createContext({
    window, document: { documentElement: root, hidden: false,
      querySelector: (selector) => selector === '.hero' ? hero : element(),
      querySelectorAll: () => videos }, navigator: {}, performance: { now: () => 0 },
    queueMicrotask, requestAnimationFrame: (fn) => fn(),
    HTMLMediaElement: { HAVE_METADATA: 1, HAVE_CURRENT_DATA: 2, HAVE_FUTURE_DATA: 3 }
  });
  const instrumented = source.replace(/  init\(\);\s*\}\)\(\);\s*$/, `
    initialized = true;
    slots[0].ready = true;
    slots[0].clip = playlist[0];
    window.test = {
      beginTransition, prepareIncoming, prepareSlot, pauseMontage,
      mockPreparation(fn) { prepareIncoming = fn; },
      mockSlotPreparation(fn) { prepareSlot = fn; },
      setPaused(value) { pausedByUser = value; },
      slots, failedSources
    };
  })();`);
  vm.runInContext(instrumented, context);
  return { api: window.test, videos, hero, timers, window };
}
async function flush() { for (let i = 0; i < 8; i++) await Promise.resolve(); }

(async () => {
  for (const reason of ['timeout', 'exhausted']) {
    const f = fixture();
    f.api.mockPreparation(async () => ({ ok: false, reason }));
    await f.api.beginTransition(); await flush();
    assert.equal(f.videos[0].currentTime, 0, `${reason}: replay the cached clip`);
    assert.equal(f.videos[0].plays, 1, `${reason}: do not freeze on the last frame`);
    assert.ok([...f.timers.values()].some(t => t.delay > 0), `${reason}: schedule another transition`);
  }
  {
    const f = fixture();
    f.videos[1].autoplay = true;
    await f.api.prepareSlot(f.api.slots[1], f.window.__heroMontage.playlist[1], 1);
    assert.equal(f.videos[1].autoplay, false, 'bootstrap autoplay must not leak into preloading');
    assert.equal(f.videos[1].plays, 0);
  }
  {
    const f = fixture(); let complete; let calls = 0;
    f.api.mockSlotPreparation(() => { calls++; return new Promise(resolve => { complete = resolve; }); });
    const preload = f.api.prepareIncoming();
    const transition = f.api.prepareIncoming();
    assert.equal(preload, transition, 'preload and transition share one preparation');
    assert.equal(calls, 1);
    complete({ ok: true }); await preload; await flush();
  }
  {
    const f = fixture(); let complete;
    f.api.mockPreparation(() => new Promise(resolve => { complete = resolve; }));
    const transition = f.api.beginTransition();
    f.api.setPaused(true); f.api.pauseMontage();
    complete({ ok: false, reason: 'timeout' }); await transition; await flush();
    assert.equal(f.videos[0].plays, 0, 'late failure cannot undo user pause');
  }
  {
    const f = fixture();
    f.api.slots[1].clip = { desktop: 'bad.mp4', mobile: 'bad.mp4' };
    f.api.mockPreparation(async () => ({ ok: true, position: 1 }));
    f.videos[1].play = () => new Promise(() => {});
    const transition = f.api.beginTransition(); await flush();
    const deadline = [...f.timers.values()].find(t => t.delay === 6000);
    assert.ok(deadline, 'a stuck play promise has a deadline');
    deadline.fn(); await transition; await flush();
    assert.equal(f.videos[0].plays, 1, 'recover from stuck incoming playback');
  }
  console.log('PASS: timeout, exhausted sources, bootstrap autoplay, concurrent preload, user pause, stuck play promise');
})().catch(error => { console.error(error); process.exitCode = 1; });
