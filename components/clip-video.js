(function () {
  // Rate schedule is a step function, not interpolated — the *target* rate
  // snaps at each boundary. Acceleration edges (slow->fast) apply that
  // target instantly (measured clean via requestVideoFrameCallback — pure
  // frame-skipping, no hiccup). Deceleration edges landing on 1x (fast->1x,
  // right before each real click) measured a genuine ~33-66ms elongated-
  // frame hitch when applied instantly, so those ramp video.playbackRate
  // smoothly over RAMP_MS of real time instead of stepping.
  const RAMP_MS = 150;

  function getRate(time, schedule) {
    let rate = schedule[0].rate;
    for (let i = 0; i < schedule.length; i++) {
      if (time >= schedule[i].time) rate = schedule[i].rate;
      else break;
    }
    return rate;
  }

  const PAUSE_ICON = '<svg class="clip-control__icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><rect x="3" y="2" width="3.5" height="12" fill="currentColor"/><rect x="9.5" y="2" width="3.5" height="12" fill="currentColor"/></svg>';
  const PLAY_ICON = '<svg class="clip-control__icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 2l10 6-10 6z" fill="currentColor"/></svg>';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Videos that autoplay natively through the HTML attribute (case study
  // heroes, the homepage grid): under reduced motion, drop the attribute and
  // stay on the poster frame, per CLAUDE.md's stated fallback.
  if (reduceMotion) {
    document.querySelectorAll('video[autoplay]').forEach((video) => {
      video.removeAttribute('autoplay');
      video.pause();
    });
  }

  // Case study heroes and section clips and the homepage work grid
  // (work-grid.js) all use this wrapper: play while at least half visible,
  // pause offscreen. The observer's first callback runs on load, so a clip
  // that starts on screen plays straight away.
  document.querySelectorAll('[data-clip-video]').forEach((wrap) => {
    const video = wrap.querySelector('video');
    if (!video) return;

    if (!reduceMotion) {
      let rateSchedule = null;
      try {
        rateSchedule = JSON.parse(wrap.getAttribute('data-clip-rate-keyframes') || 'null');
      } catch (e) {
        rateSchedule = null;
      }

      if (rateSchedule && rateSchedule.length) {
        video.playbackRate = rateSchedule[0].rate;

        let currentTargetRate = rateSchedule[0].rate;
        let rampStart = null;
        let rampFrom = null;
        let rampTo = null;

        function updateRate(timestamp) {
          const targetRate = getRate(video.currentTime, rateSchedule);
          if (targetRate !== currentTargetRate) {
            const isDeceleration = targetRate === 1 && currentTargetRate > targetRate;
            currentTargetRate = targetRate;
            if (isDeceleration) {
              rampStart = timestamp;
              rampFrom = video.playbackRate;
              rampTo = targetRate;
            } else {
              rampStart = null;
              video.playbackRate = targetRate;
            }
          }
          if (rampStart !== null) {
            const elapsed = timestamp - rampStart;
            if (elapsed >= RAMP_MS) {
              video.playbackRate = rampTo;
              rampStart = null;
            } else {
              video.playbackRate = rampFrom + (rampTo - rampFrom) * (elapsed / RAMP_MS);
            }
          }
        }

        function tick(timestamp) {
          if (!video.paused && !video.ended) {
            updateRate(timestamp);
            requestAnimationFrame(tick);
          }
        }
        video.addEventListener('play', () => requestAnimationFrame(tick));
      }
    }

    // Scroll-triggered play/pause is motion, same as the hero's autoplay —
    // stay on the poster frame under reduced motion instead of observing.
    // Nothing moves then, so no pause control either.
    if (reduceMotion) return;

    // Pause/play control (WCAG 2.2.2) on every case study clip, hero
    // included. The homepage grid clips sit inside links, where a button
    // can't go, so they keep scroll-only behavior. A clip the visitor
    // paused stays paused when it scrolls back into view.
    let userPaused = false;
    if (!wrap.closest('a')) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'clip-control';
      wrap.appendChild(button);

      const sync = () => {
        const playing = !video.paused;
        button.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
        button.innerHTML = playing ? PAUSE_ICON : PLAY_ICON;
      };
      video.addEventListener('play', sync);
      video.addEventListener('pause', sync);
      sync();

      button.addEventListener('click', () => {
        if (video.paused) {
          userPaused = false;
          video.play().catch(() => {});
        } else {
          userPaused = true;
          video.pause();
        }
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!userPaused) video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(wrap);
  });
})();
