// "On this page" section nav for case studies. Fills the empty
// <nav class="case-toc"> with links built from the page's H2s, so each
// heading's text lives in one place (every H2 carries a stable id in the
// HTML). Without JS the nav stays empty and collapses, and the anchors
// still work.
//
// From 1100px the nav is a sticky column beside the article, and the
// section being read gets aria-current (the link color). No animation:
// the color swaps instantly.
(function () {
  const nav = document.querySelector('.case-toc');
  const headings = [...document.querySelectorAll('.case-section__heading[id]')];
  if (!nav || !headings.length) return;

  nav.innerHTML = `
<div class="case-toc__inner">
  <p class="case-toc__label">On this page</p>
  <ul class="case-toc__list">
    ${headings.map((h) => `<li><a class="case-toc__link" href="#${h.id}">${h.innerHTML}</a></li>`).join('')}
  </ul>
</div>`;

  const links = [...nav.querySelectorAll('.case-toc__link')];
  const sections = headings.map((h) => h.closest('.case-section'));
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

  // A section is current while it overlaps the top third of the viewport.
  // When several do, the first in reading order wins. A short last section
  // may never reach the top third, so the bottom of the page marks it
  // current.
  const visible = new Set();

  function update() {
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    const index = atBottom ? links.length - 1 : sections.findIndex((section) => visible.has(section));
    setCurrent(index === -1 ? null : links[index]);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    });
    update();
  }, { rootMargin: '0px 0px -66% 0px' });
  sections.forEach((section) => observer.observe(section));
  window.addEventListener('scroll', update, { passive: true });

  wide.addEventListener('change', render);
})();
