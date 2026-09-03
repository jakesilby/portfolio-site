(function () {
  const lightboxScript = document.currentScript;

  lightboxScript.insertAdjacentHTML('afterend', `
<div class="lightbox" id="lightbox" aria-hidden="true">
  <div class="lightbox__backdrop"></div>
  <button type="button" class="lightbox__close" aria-label="Close">&times;</button>
  <div class="lightbox__content" role="dialog" aria-modal="true" aria-label="Image preview">
    <img class="lightbox__image" src="" alt="">
  </div>
</div>
`);

  const lightbox = document.getElementById('lightbox');
  const backdrop = lightbox.querySelector('.lightbox__backdrop');
  const content = lightbox.querySelector('.lightbox__content');
  const closeButton = lightbox.querySelector('.lightbox__close');
  const image = lightbox.querySelector('.lightbox__image');

  let triggerEl = null;

  function open(trigger) {
    const src = trigger.getAttribute('data-lightbox-src');
    if (!src) return;

    triggerEl = trigger;
    image.src = src;
    image.alt = trigger.getAttribute('alt') || '';

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    closeButton.focus();

    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');

    document.removeEventListener('keydown', onKeydown);

    if (triggerEl) {
      triggerEl.focus();
      triggerEl = null;
    }
  }

  function onKeydown(event) {
    if (event.key === 'Escape') {
      close();
      return;
    }

    if (event.key === 'Tab') {
      // Only the close button is focusable inside the lightbox, so trap
      // focus on it rather than letting Tab escape to the page behind.
      event.preventDefault();
      closeButton.focus();
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

  backdrop.addEventListener('click', close);
  closeButton.addEventListener('click', close);

  content.addEventListener('click', (event) => {
    event.stopPropagation();
  });
})();
