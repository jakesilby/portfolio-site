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

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero video isn't wrapped in [data-clip-video] — it autoplays natively via
  // the HTML attribute. Under reduced motion, drop that attribute and stay on
  // the poster frame instead, per CLAUDE.md's stated fallback.
  if (reduceMotion) {
    document.querySelectorAll('video[autoplay]').forEach((video) => {
      video.removeAttribute('autoplay');
      video.pause();
    });
  }

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
    if (reduceMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
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
