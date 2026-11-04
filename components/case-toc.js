// "On this page" section nav for case studies. Fills the empty
// <nav class="case-toc"> with links built from the page's H2s, so each
// heading's text lives in one place (every H2 carries a stable id in the
// HTML). Without JS the nav stays empty and collapses, and the anchors
// still work.
//
// From 1100px the nav is a sticky column beside the article, and the
// section being read gets aria-current (the link color). No animation:
// the color swaps instantly.
//
// Below 1100px the nav sits after the hero as one closed "On this page"
// row: a real button with aria-expanded that shows and hides the list.
// The CSS shows either the plain label (wide) or the button (narrow).
(function () {
  const nav = document.querySelector('.case-toc');
  const headings = [...document.querySelectorAll('.case-section__heading[id]')];
  if (!nav || !headings.length) return;

  nav.innerHTML = `
<div class="case-toc__inner">
  <p class="case-toc__label">On this page</p>
  <button type="button" class="case-toc__toggle" aria-expanded="false" aria-controls="case-toc-list">On this page</button>
  <ul class="case-toc__list" id="case-toc-list">
    ${headings.map((h) => `<li><a class="case-toc__link" href="#${h.id}">${h.innerHTML}</a></li>`).join('')}
  </ul>
</div>`;

  const toggle = nav.querySelector('.case-toc__toggle');
  toggle.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', String(toggle.getAttribute('aria-expanded') !== 'true'));
  });

  const links = [...nav.querySelectorAll('.case-toc__link')];
  const wide = window.matchMedia('(min-width: 1100px)');
  let current = null;

  function render() {
    links.forEach((link) => {
      if (link === current && wide.matches) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function setCurrent(link) {
    if (link === current) return;
    current = link;
    render();
  }

  // The current section is the last one whose H2 has reached the top third
  // of the viewport. Measuring the headings, not the sections, keeps the
  // previous section's bottom padding and rule from holding on after the
  // next heading is already in view. Before the first H2 reaches the line
  // nothing is current. A short last section may never reach the top
  // third, so the bottom of the page marks it current.
  let queued = false;

  function update() {
    queued = false;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    const line = window.innerHeight / 3;
    let index = -1;
    if (atBottom) index = links.length - 1;
    else headings.forEach((heading, i) => {
      if (heading.getBoundingClientRect().top <= line) index = i;
    });
    setCurrent(index === -1 ? null : links[index]);
  }

  function queueUpdate() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }

  window.addEventListener('scroll', queueUpdate, { passive: true });
  window.addEventListener('resize', queueUpdate);
  update();

  wide.addEventListener('change', render);
})();
