(function () {
  const lightboxScript = document.currentScript;

  lightboxScript.insertAdjacentHTML('afterend', `
<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" aria-hidden="true">
  <div class="lightbox__backdrop"></div>
  <button type="button" class="lightbox__zoom" aria-pressed="false" hidden>+</button>
  <button type="button" class="lightbox__close" aria-label="Close">&times;</button>
  <div class="lightbox__content">
    <img class="lightbox__image" src="" alt="">
  </div>
</div>
`);

  const lightbox = document.getElementById('lightbox');
  const backdrop = lightbox.querySelector('.lightbox__backdrop');
  const content = lightbox.querySelector('.lightbox__content');
  const zoomButton = lightbox.querySelector('.lightbox__zoom');
  const closeButton = lightbox.querySelector('.lightbox__close');
  const image = lightbox.querySelector('.lightbox__image');

  // Offer zoom only when the large file is at least this much bigger than
  // the fitted view, so it would show real extra detail.
  const ZOOM_THRESHOLD = 1.25;

  let triggerEl = null;

  function open(trigger) {
    const src = trigger.getAttribute('data-lightbox-src');
    if (!src) return;

    triggerEl = trigger;
    setZoom(false);
    setZoomable(false);
    image.src = src;
    image.alt = trigger.getAttribute('alt') || '';
    // The dialog wraps the buttons and the image, and takes its name from
    // the image's alt text.
    lightbox.setAttribute('aria-label', image.alt || 'Image viewer');

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    closeButton.focus();

    if (image.complete && image.naturalWidth) checkZoomable();

    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    setZoom(false);

    document.removeEventListener('keydown', onKeydown);

    if (triggerEl) {
      triggerEl.focus();
      triggerEl = null;
    }
  }

  function setZoomable(zoomable) {
    lightbox.classList.toggle('is-zoomable', zoomable);
    zoomButton.hidden = !zoomable;
  }

  function checkZoomable() {
    if (lightbox.classList.contains('is-zoomed')) return;
    const fitted = image.getBoundingClientRect().width;
    setZoomable(fitted > 0 && image.naturalWidth > fitted * ZOOM_THRESHOLD);
  }

  // Zooms to the image's own size. With a point (a click on the image),
  // that spot stays under the pointer; from the button, it zooms on the
  // center.
  function setZoom(zoomed, point) {
    let fx = 0.5;
    let fy = 0.5;
    if (zoomed && point) {
      const box = image.getBoundingClientRect();
      fx = (point.x - box.left) / box.width;
      fy = (point.y - box.top) / box.height;
    }

    lightbox.classList.toggle('is-zoomed', zoomed);
    zoomButton.setAttribute('aria-pressed', String(zoomed));
    zoomButton.setAttribute('aria-label', zoomed ? 'Zoom out' : 'Zoom in');
    zoomButton.textContent = zoomed ? '−' : '+';

    if (zoomed) {
      const anchorX = point ? point.x : content.clientWidth / 2;
      const anchorY = point ? point.y : content.clientHeight / 2;
      content.scrollLeft = image.offsetLeft + fx * image.offsetWidth - anchorX;
      content.scrollTop = image.offsetTop + fy * image.offsetHeight - anchorY;
    } else {
      content.scrollLeft = 0;
      content.scrollTop = 0;
    }
  }

  function onKeydown(event) {
    if (event.key === 'Escape') {
      close();
      return;
    }

    if (event.key === 'Tab') {
      // Keep focus on the lightbox's buttons rather than letting Tab
      // escape to the page behind.
      const buttons = [zoomButton, closeButton].filter((b) => !b.hidden);
      const i = buttons.indexOf(document.activeElement);
      const next = event.shiftKey ? i - 1 : i + 1;
      event.preventDefault();
      buttons[(next + buttons.length) % buttons.length].focus();
    }
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-lightbox-src]');
    if (trigger) {
      open(trigger);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const trigger = event.target.closest('[data-lightbox-src]');
    if (trigger) {
      event.preventDefault();
      open(trigger);
    }
  });

  image.addEventListener('load', () => {
    if (lightbox.classList.contains('is-open')) checkZoomable();
  });

  window.addEventListener('resize', () => {
    if (lightbox.classList.contains('is-open')) checkZoomable();
  });

  backdrop.addEventListener('click', close);
  closeButton.addEventListener('click', close);

  zoomButton.addEventListener('click', () => {
    setZoom(!lightbox.classList.contains('is-zoomed'));
  });

  image.addEventListener('click', (event) => {
    if (!lightbox.classList.contains('is-zoomable')) return;
    setZoom(!lightbox.classList.contains('is-zoomed'), { x: event.clientX, y: event.clientY });
  });

  content.addEventListener('click', (event) => {
    event.stopPropagation();
  });
})();
