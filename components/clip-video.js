(function () {
  // Toggle to revert instantly without ripping the camera logic out —
  // false plays every clip at native 100% scale/position, no transform
  // applied at all. Playback-rate pacing is a separate concern and stays
  // active regardless of this flag.
  const CAMERA_ENABLED = false;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function getFrame(time, keyframes) {
    const first = keyframes[0];
    const last = keyframes[keyframes.length - 1];
    if (time <= first.time) return first;
    if (time >= last.time) return last;

    for (let i = 0; i < keyframes.length - 1; i++) {
      const a = keyframes[i];
      const b = keyframes[i + 1];
      if (time >= a.time && time <= b.time) {
        const span = b.time - a.time;
        const t = span === 0 ? 1 : easeOutCubic((time - a.time) / span);
        return {
          scale: a.scale + (b.scale - a.scale) * t,
          x: a.x + (b.x - a.x) * t,
          y: a.y + (b.y - a.y) * t,
        };
      }
    }
    return last;
  }

  function applyFrame(video, frame) {
    video.style.transform = `scale(${frame.scale}) translate(${frame.x}%, ${frame.y}%)`;
  }

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
      let keyframes = null;
      try {
        keyframes = JSON.parse(wrap.getAttribute('data-clip-keyframes') || 'null');
      } catch (e) {
        keyframes = null;
      }

      let rateSchedule = null;
      try {
        rateSchedule = JSON.parse(wrap.getAttribute('data-clip-rate-keyframes') || 'null');
      } catch (e) {
        rateSchedule = null;
      }

      if (rateSchedule && rateSchedule.length) {
        video.playbackRate = rateSchedule[0].rate;
      }

      if ((CAMERA_ENABLED && keyframes && keyframes.length) || (rateSchedule && rateSchedule.length)) {
        if (CAMERA_ENABLED && keyframes && keyframes.length) applyFrame(video, keyframes[0]);

        let currentTargetRate = rateSchedule && rateSchedule.length ? rateSchedule[0].rate : 1;
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

        function updateCamera(timestamp) {
          if (!video.paused && !video.ended) {
            if (CAMERA_ENABLED && keyframes && keyframes.length) {
              applyFrame(video, getFrame(video.currentTime, keyframes));
            }
            if (rateSchedule && rateSchedule.length) {
              updateRate(timestamp);
            }
            requestAnimationFrame(updateCamera);
          }
        }
        video.addEventListener('play', () => requestAnimationFrame(updateCamera));
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
