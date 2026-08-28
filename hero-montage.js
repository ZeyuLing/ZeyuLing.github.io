(() => {
  "use strict";

  const root = document.documentElement;
  const hero = document.querySelector(".hero");
  const heroVideos = [...document.querySelectorAll(".hero-video[data-hero-slot]")];
  const heroToggle = document.querySelector(".hero-reel-toggle");
  const heroTitle = document.querySelector("[data-hero-reel-title]");
  const heroIndex = document.querySelector("[data-hero-reel-index]");
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileHeroQuery = window.matchMedia("(max-width: 760px)");
  const connection = navigator.connection;
  const montage = window.__heroMontage;
  const playlist = Array.isArray(montage?.playlist)
    ? montage.playlist.filter(
        (clip) =>
          clip &&
          typeof clip.id === "string" &&
          typeof clip.projectId === "string" &&
          typeof clip.title === "string" &&
          typeof clip.desktop === "string" &&
          typeof clip.mobile === "string" &&
          typeof clip.posterDesktop === "string" &&
          typeof clip.posterMobile === "string" &&
          Number.isFinite(clip.sourceIn) &&
          Number.isFinite(clip.sourceOut) &&
          clip.sourceOut > clip.sourceIn
      )
    : [];

  const CROSSFADE_MS = 560;
  const CROSSFADE_SECONDS = CROSSFADE_MS / 1000;
  const PREPARE_TIMEOUT_MS = 12000;
  const slots = heroVideos.map((element) => ({
    element,
    clip: null,
    position: -1,
    mode: "",
    ready: false,
    revision: 0,
    cancel: null,
    promise: null
  }));

  let initialized = false;
  let generation = 0;
  let transitionRevision = 0;
  let activeSlotIndex = 0;
  let playlistPosition = 0;
  let inView = true;
  let pausedByUser = false;
  let starting = false;
  let transitionPending = false;
  let transitioning = false;
  let unavailable = false;
  let policyIsStatic = false;
  let advanceTimer = 0;
  let captionTimer = 0;
  let transitionTimer = 0;
  let resumePosition = 0;
  let resumeTime = 0;
  const failedSources = new Set();
  const unavailableModes = new Set();

  const emptyController = {
    init() {},
    syncControl() {},
    getState: () => ({ state: "unavailable" })
  };

  if (!hero || heroVideos.length !== 2 || !heroToggle || !heroTitle || !heroIndex) {
    window.heroMontageController = emptyController;
    return;
  }

  function sourceMode() {
    return mobileHeroQuery.matches ? "mobile" : "desktop";
  }

  function sourceFor(clip) {
    return sourceMode() === "mobile" ? clip.mobile : clip.desktop;
  }

  function posterFor(clip, mode = sourceMode()) {
    return mode === "mobile" ? clip.posterMobile : clip.posterDesktop;
  }

  function prefersStaticMedia() {
    return reduceMotionQuery.matches || Boolean(connection?.saveData);
  }

  function normalizePosition(position) {
    if (!playlist.length) return 0;
    return ((position % playlist.length) + playlist.length) % playlist.length;
  }

  function activeSlot() {
    return slots[activeSlotIndex];
  }

  function standbySlot() {
    return slots[1 - activeSlotIndex];
  }

  function setHeroState(state) {
    hero.dataset.heroState = state;
  }

  function applyPoster(clip) {
    if (!clip) return;
    root.style.setProperty("--hero-reel-poster-desktop", `url("${clip.posterDesktop}")`);
    root.style.setProperty("--hero-reel-poster-mobile", `url("${clip.posterMobile}")`);
  }

  function syncPlanMetadata() {
    hero.dataset.heroPlanId = montage?.planId || "";
    hero.dataset.heroContentSignature = montage?.contentSignature || "";
    hero.dataset.heroOrderSignature = montage?.orderSignature || "";
    hero.dataset.heroSourceMode = sourceMode();
  }

  function updateCaption(position) {
    const clip = playlist[normalizePosition(position)];
    if (!clip) return;
    heroTitle.textContent = clip.title;
    heroIndex.textContent = `${String(normalizePosition(position) + 1).padStart(2, "0")} / ${String(playlist.length).padStart(2, "0")}`;
  }

  function updateActiveClip(position, state = hero.dataset.heroState || "idle", updateVisibleCaption = true) {
    if (!playlist.length) return;

    playlistPosition = normalizePosition(position);
    const clip = playlist[playlistPosition];
    const nextClip = playlist[normalizePosition(playlistPosition + 1)];
    applyPoster(clip);
    root.dataset.heroClipId = clip.id;
    if (updateVisibleCaption) updateCaption(playlistPosition);
    hero.dataset.heroCycleIndex = String(playlistPosition + 1);
    hero.dataset.heroActiveProject = clip.projectId;
    hero.dataset.heroActiveClip = clip.id;
    hero.dataset.heroActiveSourceIn = String(clip.sourceIn);
    hero.dataset.heroActiveSourceOut = String(clip.sourceOut);
    hero.dataset.heroActiveSlot = heroVideos[activeSlotIndex].dataset.heroSlot;
    if (activeSlot().element.dataset.heroSourceRevision) {
      hero.dataset.heroSourceRevision = activeSlot().element.dataset.heroSourceRevision;
    }
    hero.dataset.heroNextProject = nextClip.projectId;
    hero.dataset.heroNextClip = nextClip.id;
    hero.dataset.heroSourceMode = sourceMode();
    setHeroState(state);
  }

  function syncControl() {
    const isPlaying = slots.some(
      (slot) =>
        (slot.element.dataset.heroSlotRole === "active" || slot.element.dataset.heroSlotRole === "outgoing") &&
        !slot.element.paused &&
        !slot.element.ended
    );
    const isChinese = root.lang.toLowerCase().startsWith("zh");
    const label = isPlaying
      ? isChinese
        ? "暂停研究短片"
        : "Pause research reel"
      : isChinese
        ? "播放研究短片"
        : "Play research reel";

    heroToggle.innerHTML = `<i data-lucide="${isPlaying ? "pause" : "play"}" aria-hidden="true"></i>`;
    heroToggle.setAttribute("aria-label", label);
    heroToggle.setAttribute("title", label);
    hero.classList.toggle("is-reel-paused", !isPlaying);
    if (window.lucide) window.lucide.createIcons();
  }

  function clearAdvanceTimer() {
    window.clearTimeout(advanceTimer);
    advanceTimer = 0;
  }

  function clearCaptionTimer() {
    window.clearTimeout(captionTimer);
    captionTimer = 0;
  }

  function clearTransitionTimer() {
    window.clearTimeout(transitionTimer);
    transitionTimer = 0;
  }

  function clearClipDataset(video) {
    delete video.dataset.heroProject;
    delete video.dataset.heroClip;
    delete video.dataset.heroSourceIn;
    delete video.dataset.heroSourceOut;
    delete video.dataset.heroSource;
    delete video.dataset.heroSourceRevision;
    video.dataset.heroReady = "false";
  }

  function releaseSlot(slot) {
    slot.cancel?.();
    slot.cancel = null;
    slot.promise = null;
    slot.revision += 1;
    slot.ready = false;
    slot.clip = null;
    slot.position = -1;
    slot.mode = "";

    const video = slot.element;
    video.pause();
    video.classList.remove("is-ready", "is-active", "is-transition-disabled");
    video.style.zIndex = "";
    video.dataset.heroSlotRole = "idle";
    clearClipDataset(video);
    if (video.hasAttribute("src")) {
      video.removeAttribute("src");
      video.load();
    }
    video.removeAttribute("poster");
  }

  function prepareSlot(slot, clip, position, restoreTime = 0, role = "loading") {
    releaseSlot(slot);
    const revision = ++slot.revision;
    const mode = sourceMode();
    const source = sourceFor(clip);
    const video = slot.element;

    slot.clip = clip;
    slot.position = position;
    slot.mode = mode;
    video.muted = true;
    video.preload = "auto";
    video.poster = posterFor(clip, mode);
    video.dataset.heroSlotRole = role;
    video.dataset.heroProject = clip.projectId;
    video.dataset.heroClip = clip.id;
    video.dataset.heroSourceIn = String(clip.sourceIn);
    video.dataset.heroSourceOut = String(clip.sourceOut);
    video.dataset.heroSource = source;
    video.dataset.heroSourceRevision = String(revision);
    video.dataset.heroReady = "false";

    const promise = new Promise((resolve) => {
      let settled = false;
      let metadataReady = false;
      let seekReady = restoreTime <= 0.04;
      let targetTime = Math.max(0, restoreTime);
      let timeout = 0;

      const events = ["loadedmetadata", "durationchange", "loadeddata", "canplay", "seeked", "error"];
      const cleanup = () => {
        events.forEach((eventName) => video.removeEventListener(eventName, onMediaEvent));
        window.clearTimeout(timeout);
        if (slot.cancel === cancel) slot.cancel = null;
      };
      const settle = (ok, reason) => {
        if (settled) return;
        settled = true;
        cleanup();
        const current = revision === slot.revision && slot.clip?.id === clip.id && slot.mode === mode;
        if (ok && current) {
          slot.ready = true;
          video.dataset.heroReady = "true";
          resolve({ ok: true, reason: "ready", source });
          return;
        }
        if (current) {
          slot.ready = false;
          video.dataset.heroReady = "false";
        }
        resolve({ ok: false, reason, source });
      };
      const checkReady = () => {
        if (revision !== slot.revision) {
          settle(false, "cancelled");
          return;
        }
        if (metadataReady && seekReady && video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
          settle(true, "ready");
        }
      };
      function onMediaEvent(event) {
        if (event.type === "error") {
          settle(false, "error");
          return;
        }

        if (event.type === "loadedmetadata" || event.type === "durationchange") {
          if (!Number.isFinite(video.duration)) return;
          metadataReady = true;
          targetTime = Math.min(targetTime, Math.max(0, video.duration - 0.05));
          if (targetTime <= 0.04) {
            seekReady = true;
          } else if (!seekReady) {
            try {
              video.currentTime = targetTime;
              if (!video.seeking && Math.abs(video.currentTime - targetTime) < 0.12) seekReady = true;
            } catch {
              targetTime = 0;
              seekReady = true;
            }
          }
        }

        if (
          metadataReady &&
          !seekReady &&
          targetTime > 0.04 &&
          (event.type === "loadeddata" || event.type === "canplay")
        ) {
          const targetIsSeekable = Array.from({ length: video.seekable.length }, (_, index) => index).some(
            (index) => video.seekable.start(index) <= targetTime + 0.04 && video.seekable.end(index) >= targetTime - 0.04
          );
          if (targetIsSeekable) {
            try {
              video.currentTime = targetTime;
              if (!video.seeking && Math.abs(video.currentTime - targetTime) < 0.12) seekReady = true;
            } catch {
              targetTime = 0;
              seekReady = true;
            }
          } else if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
            // Some simple/static hosts do not advertise byte ranges. Keep the
            // same clip and restart it instead of timing out into another clip.
            targetTime = 0;
            video.currentTime = 0;
            seekReady = true;
          }
        }

        if (event.type === "seeked") {
          seekReady = Math.abs(video.currentTime - targetTime) < 0.16;
        }
        checkReady();
      }
      const cancel = () => settle(false, "cancelled");

      events.forEach((eventName) => video.addEventListener(eventName, onMediaEvent));
      slot.cancel = cancel;
      timeout = window.setTimeout(() => settle(false, "timeout"), PREPARE_TIMEOUT_MS);
      video.src = source;
      video.load();
      checkReady();
    });

    slot.promise = promise;
    promise.then(() => {
      if (slot.promise === promise) slot.promise = null;
    });
    return promise;
  }

  function canPlayNow() {
    return (
      initialized &&
      !policyIsStatic &&
      !unavailable &&
      !pausedByUser &&
      inView &&
      !document.hidden &&
      activeSlot().ready
    );
  }

  function sourceFailureKey(clip) {
    return `${sourceMode()}:${sourceFor(clip)}`;
  }

  async function prepareIncoming() {
    if (!playlist.length || !canPlayNow() || transitioning) return { ok: false, reason: "suspended" };

    const localGeneration = generation;
    const incomingSlot = standbySlot();
    for (let offset = 1; offset <= playlist.length; offset += 1) {
      const position = normalizePosition(playlistPosition + offset);
      const clip = playlist[position];
      const failureKey = sourceFailureKey(clip);
      if (failedSources.has(failureKey)) continue;

      hero.dataset.heroNextProject = clip.projectId;
      hero.dataset.heroNextClip = clip.id;
      if (
        incomingSlot.clip?.id === clip.id &&
        incomingSlot.position === position &&
        incomingSlot.mode === sourceMode()
      ) {
        const result = incomingSlot.ready
          ? { ok: true, reason: "ready", source: sourceFor(clip) }
          : await incomingSlot.promise;
        if (localGeneration !== generation) return { ok: false, reason: "cancelled" };
        if (result?.ok) return { ...result, position };
        if (result && (result.reason === "error" || result.reason === "timeout")) {
          failedSources.add(failureKey);
        }
        continue;
      }

      const result = await prepareSlot(incomingSlot, clip, position, 0, "incoming");
      if (localGeneration !== generation) return { ok: false, reason: "cancelled" };
      if (result.ok) {
        incomingSlot.element.dataset.heroSlotRole = "incoming";
        return { ...result, position };
      }
      if (result.reason === "error" || result.reason === "timeout") failedSources.add(failureKey);
      if (result.reason === "cancelled") return result;
    }

    return { ok: false, reason: "exhausted" };
  }

  function scheduleAdvance() {
    clearAdvanceTimer();
    if (!canPlayNow() || transitioning) return;

    const video = activeSlot().element;
    if (!Number.isFinite(video.duration)) return;
    const delay = Math.max(0, (video.duration - video.currentTime - CROSSFADE_SECONDS) * 1000);
    if (delay <= 24) {
      queueMicrotask(() => void beginTransition());
      return;
    }
    advanceTimer = window.setTimeout(() => void beginTransition(), delay);
  }

  function finishTransition(revision = transitionRevision, snap = false, reschedule = true) {
    if (!transitioning || revision !== transitionRevision) return;

    clearTransitionTimer();
    clearCaptionTimer();
    transitionPending = false;
    const incoming = activeSlot().element;
    const outgoing = standbySlot().element;
    if (snap) {
      incoming.classList.add("is-transition-disabled");
      outgoing.classList.add("is-transition-disabled");
    }
    incoming.classList.add("is-ready", "is-active");
    incoming.dataset.heroSlotRole = "active";
    updateCaption(playlistPosition);
    releaseSlot(standbySlot());
    transitioning = false;

    if (snap) {
      requestAnimationFrame(() => incoming.classList.remove("is-transition-disabled"));
    }
    if (canPlayNow()) {
      setHeroState("playing");
      if (reschedule) {
        void prepareIncoming();
        scheduleAdvance();
      }
    } else {
      setHeroState(pausedByUser ? "paused" : "suspended");
    }
    syncControl();
  }

  async function beginTransition() {
    if (!canPlayNow() || transitionPending || transitioning) return;

    clearAdvanceTimer();
    transitionPending = true;
    const localGeneration = generation;
    const revision = ++transitionRevision;
    setHeroState("waiting-next");
    const prepared = await prepareIncoming();
    if (localGeneration !== generation || revision !== transitionRevision || !prepared.ok) {
      if (localGeneration === generation && revision === transitionRevision) transitionPending = false;
      if (prepared.reason === "exhausted" && localGeneration === generation) {
        activeSlot().element.pause();
        setHeroState("waiting-next");
        syncControl();
      }
      return;
    }
    if (!canPlayNow()) {
      transitionPending = false;
      return;
    }

    const outgoingIndex = activeSlotIndex;
    const incomingIndex = 1 - outgoingIndex;
    const outgoing = slots[outgoingIndex].element;
    const incoming = slots[incomingIndex].element;
    try {
      await incoming.play();
    } catch {
      if (localGeneration === generation && revision === transitionRevision) {
        transitionPending = false;
        if (canPlayNow()) {
          setHeroState("paused");
          syncControl();
        }
      }
      return;
    }
    if (localGeneration !== generation || revision !== transitionRevision || !canPlayNow()) {
      if (localGeneration === generation && revision === transitionRevision) transitionPending = false;
      incoming.pause();
      return;
    }

    transitionPending = false;
    transitioning = true;
    activeSlotIndex = incomingIndex;
    playlistPosition = prepared.position;
    outgoing.style.zIndex = "0";
    incoming.style.zIndex = "1";
    outgoing.dataset.heroSlotRole = "outgoing";
    incoming.classList.add("is-ready", "is-active");
    incoming.dataset.heroSlotRole = "active";
    updateActiveClip(playlistPosition, "transitioning", false);
    captionTimer = window.setTimeout(() => {
      if (transitioning && revision === transitionRevision) updateCaption(playlistPosition);
    }, CROSSFADE_MS / 2);
    syncControl();
    transitionTimer = window.setTimeout(
      () => finishTransition(revision),
      CROSSFADE_MS + 80
    );
  }

  async function playMontage() {
    if (!initialized || policyIsStatic || unavailable || pausedByUser || !inView || document.hidden) return;
    if (!activeSlot().ready) {
      if (!starting) void startMontage(playlistPosition, 0);
      return;
    }

    const localGeneration = generation;
    try {
      await activeSlot().element.play();
    } catch {
      setHeroState("paused");
      syncControl();
      return;
    }
    if (localGeneration !== generation || !canPlayNow()) return;

    setHeroState(transitioning ? "transitioning" : "playing");
    hero.classList.remove("is-reel-static");
    heroToggle.hidden = false;
    syncControl();
    void prepareIncoming();
    scheduleAdvance();
  }

  function pauseMontage({ releaseIncoming = true } = {}) {
    clearAdvanceTimer();
    clearCaptionTimer();
    if (transitionPending) {
      transitionRevision += 1;
      transitionPending = false;
    }
    if (transitioning) finishTransition(transitionRevision, true, false);
    slots.forEach((slot) => slot.element.pause());
    if (releaseIncoming && standbySlot().clip) releaseSlot(standbySlot());
    setHeroState(pausedByUser ? "paused" : "suspended");
    syncControl();
  }

  function enterStaticMode({ permanent = false, preservePosition = true } = {}) {
    if (preservePosition && activeSlot().ready) {
      resumePosition = playlistPosition;
      resumeTime = Number.isFinite(activeSlot().element.currentTime) ? activeSlot().element.currentTime : 0;
    }
    generation += 1;
    transitionRevision += 1;
    starting = false;
    transitionPending = false;
    transitioning = false;
    unavailable = permanent;
    clearAdvanceTimer();
    clearCaptionTimer();
    clearTransitionTimer();
    if (playlist.length) updateCaption(playlistPosition);
    slots.forEach(releaseSlot);
    hero.classList.add("is-reel-static");
    heroToggle.hidden = true;
    setHeroState(permanent ? "unavailable" : "static");
    syncControl();
  }

  async function startMontage(position = 0, restoreTime = 0) {
    if (!playlist.length || policyIsStatic || unavailable) return;
    const requestedMode = sourceMode();
    if (unavailableModes.has(requestedMode)) {
      enterStaticMode({ permanent: unavailableModes.size >= 2, preservePosition: false });
      return;
    }

    const localGeneration = ++generation;
    transitionRevision += 1;
    starting = true;
    transitionPending = false;
    transitioning = false;
    clearAdvanceTimer();
    clearCaptionTimer();
    clearTransitionTimer();
    slots.forEach(releaseSlot);
    activeSlotIndex = 0;
    heroToggle.hidden = true;
    hero.classList.add("is-reel-static");

    let prepared = null;
    let selectedPosition = normalizePosition(position);
    for (let attempt = 0; attempt < playlist.length; attempt += 1) {
      selectedPosition = normalizePosition(position + attempt);
      const clip = playlist[selectedPosition];
      updateActiveClip(selectedPosition, "loading");
      prepared = await prepareSlot(slots[0], clip, selectedPosition, attempt === 0 ? restoreTime : 0, "loading");
      if (localGeneration !== generation) return;
      if (prepared.ok) break;
      if (prepared.reason === "error" || prepared.reason === "timeout") {
        failedSources.add(sourceFailureKey(clip));
      }
    }

    if (!prepared?.ok || localGeneration !== generation) {
      unavailableModes.add(requestedMode);
      enterStaticMode({ permanent: unavailableModes.size >= 2, preservePosition: false });
      return;
    }
    unavailableModes.delete(requestedMode);

    playlistPosition = selectedPosition;
    const slot = slots[0];
    const video = slot.element;
    video.style.zIndex = "1";
    video.classList.add("is-ready", "is-active");
    video.dataset.heroSlotRole = "active";
    hero.classList.remove("is-reel-static");
    heroToggle.hidden = false;
    starting = false;
    updateActiveClip(playlistPosition, "paused");
    syncControl();
    await playMontage();
  }

  function reconcileMotionPolicy() {
    const nextPolicy = prefersStaticMedia();
    if (nextPolicy === policyIsStatic) return;
    policyIsStatic = nextPolicy;
    if (policyIsStatic) {
      enterStaticMode({ permanent: false, preservePosition: true });
      return;
    }

    const position = resumePosition;
    const time = resumeTime;
    resumeTime = 0;
    void startMontage(position, time);
  }

  function switchResponsiveSource() {
    syncPlanMetadata();
    const clip = playlist[playlistPosition];
    if (clip) applyPoster(clip);
    if (!initialized || policyIsStatic || unavailable) return;

    if (transitioning) finishTransition(transitionRevision, true, false);
    const position = playlistPosition;
    const time = activeSlot().ready && Number.isFinite(activeSlot().element.currentTime)
      ? activeSlot().element.currentTime
      : 0;
    void startMontage(position, time);
  }

  function handleRuntimeMediaError(slot) {
    if (!slot.ready) return;
    failedSources.add(`${slot.mode}:${slot.element.dataset.heroSource}`);
    if (slot === activeSlot()) {
      const fallbackPosition = standbySlot().ready
        ? standbySlot().position
        : normalizePosition(playlistPosition + 1);
      void startMontage(fallbackPosition, 0);
    } else {
      releaseSlot(slot);
    }
  }

  function init() {
    if (initialized) return;
    initialized = true;
    policyIsStatic = prefersStaticMedia();
    const initialBounds = hero.getBoundingClientRect();
    inView = initialBounds.bottom > 0 && initialBounds.top < window.innerHeight;
    syncPlanMetadata();

    slots.forEach((slot) => {
      const video = slot.element;
      video.dataset.heroSlotRole = "idle";
      video.dataset.heroReady = "false";
      video.addEventListener("play", syncControl);
      video.addEventListener("pause", () => {
        if (slot === activeSlot()) clearAdvanceTimer();
        syncControl();
      });
      video.addEventListener("playing", () => {
        if (slot === activeSlot()) {
          setHeroState(transitioning ? "transitioning" : "playing");
          scheduleAdvance();
        }
        syncControl();
      });
      video.addEventListener("timeupdate", () => {
        if (
          slot === activeSlot() &&
          !transitioning &&
          Number.isFinite(video.duration) &&
          video.duration - video.currentTime <= CROSSFADE_SECONDS + 0.08
        ) {
          void beginTransition();
        }
      });
      video.addEventListener("ended", () => {
        if (slot === activeSlot() && !transitioning) void beginTransition();
      });
      video.addEventListener("error", () => handleRuntimeMediaError(slot));
    });

    heroToggle.addEventListener("click", () => {
      const isPlaying = slots.some((slot) => !slot.element.paused && !slot.element.ended);
      if (isPlaying) {
        pausedByUser = true;
        pauseMontage({ releaseIncoming: true });
      } else {
        pausedByUser = false;
        void playMontage();
      }
    });

    const onReducedMotionChange = () => reconcileMotionPolicy();
    if (reduceMotionQuery.addEventListener) {
      reduceMotionQuery.addEventListener("change", onReducedMotionChange);
      mobileHeroQuery.addEventListener("change", switchResponsiveSource);
    } else {
      reduceMotionQuery.addListener(onReducedMotionChange);
      mobileHeroQuery.addListener(switchResponsiveSource);
    }
    connection?.addEventListener?.("change", reconcileMotionPolicy);

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
          if (inView) void playMontage();
          else pauseMontage({ releaseIncoming: true });
        },
        { threshold: 0.08 }
      );
      observer.observe(hero);
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) pauseMontage({ releaseIncoming: true });
      else if (inView) void playMontage();
    });

    if (!playlist.length) {
      enterStaticMode({ permanent: true, preservePosition: false });
      return;
    }

    updateActiveClip(0, policyIsStatic ? "static" : "idle");
    if (policyIsStatic) enterStaticMode({ permanent: false, preservePosition: false });
    else if (inView && !document.hidden) void startMontage(0, 0);
    else setHeroState("suspended");
  }

  window.heroMontageController = {
    init,
    syncControl,
    getState: () => ({
      state: hero.dataset.heroState,
      planId: hero.dataset.heroPlanId,
      contentSignature: hero.dataset.heroContentSignature,
      orderSignature: hero.dataset.heroOrderSignature,
      position: playlistPosition,
      clipId: playlist[playlistPosition]?.id || "",
      sourceMode: sourceMode(),
      activeSlot: hero.dataset.heroActiveSlot,
      pausedByUser,
      inView,
      transitioning,
      transitionPending,
      activeSources: slots.filter((slot) => slot.element.hasAttribute("src")).length
    })
  };
})();
