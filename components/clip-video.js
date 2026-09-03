(function () {
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

  // Rate schedule is a step function, not interpolated — playback rate should
  // snap at each boundary (real clicks stay crisp at 1x) rather than ramp.
  function getRate(time, schedule) {
    let rate = schedule[0].rate;
    for (let i = 0; i < schedule.length; i++) {
      if (time >= schedule[i].time) rate = schedule[i].rate;
      else break;
    }
    return rate;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

      if ((keyframes && keyframes.length) || (rateSchedule && rateSchedule.length)) {
        if (keyframes && keyframes.length) applyFrame(video, keyframes[0]);

        function updateCamera() {
          if (!video.paused && !video.ended) {
            if (keyframes && keyframes.length) {
              applyFrame(video, getFrame(video.currentTime, keyframes));
            }
            if (rateSchedule && rateSchedule.length) {
              const rate = getRate(video.currentTime, rateSchedule);
              if (video.playbackRate !== rate) video.playbackRate = rate;
            }
            requestAnimationFrame(updateCamera);
          }
        }
        video.addEventListener('play', () => requestAnimationFrame(updateCamera));
      }
    }

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
