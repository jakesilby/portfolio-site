const projectRows = [
  {
    year: '2026',
    type: 'Design Systems',
    title: 'OnePulse Connect Design System',
    description: 'A solo-built token and component system, taken from scattered Figma files to a governed architecture and bridged into code.',
    href: '#',
    image: 'images/onepulse-case-study.webp',
    imageAlt: 'Screenshot of the Data Table component page from the OnePulse Connect design system.',
  },
  {
    year: '2026',
    type: 'Project Type',
    title: 'Case Study Title',
    description: 'Description',
    href: '#',
  },
  {
    year: '2026',
    type: 'Project Type',
    title: 'Case Study Title',
    description: 'Description',
    href: '#',
  },
  {
    year: '2026',
    type: 'Project Type',
    title: 'Case Study Title',
    description: 'Description',
    href: '#',
  },
];

const projectRowsHtml = projectRows
  .map((row, i) => {
    const index = String(i + 1).padStart(2, '0');
    const imageInner = row.image
      ? `<img class="project-row__image-inner" src="${row.image}" alt="${row.imageAlt}" loading="lazy">`
      : `<div class="project-row__image-inner"></div>`;
    return `
<a class="project-row" href="${row.href}">
  <div class="project-row__header">
    <div class="project-row__title-group">
      <span class="project-row__index type-label-secondary">${index}</span>
      <h3 class="project-row__title type-case-title">${row.title}</h3>
    </div>
    <div class="project-row__meta">
      <span class="badge type-label-secondary">${row.type}</span>
      <span class="project-row__year type-meta">${row.year}</span>
    </div>
  </div>
  <div class="project-row__body">
    <div class="project-row__image">
      ${imageInner}
    </div>
    <p class="project-row__description type-description">${row.description}</p>
  </div>
</a>`;
  })
  .join('');

const projectRowScript = document.currentScript;

projectRowScript.insertAdjacentHTML('afterend', `<div class="project-row-list">${projectRowsHtml}</div>`);

(function observeProjectRows() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) return;

  const rows = projectRowScript.nextElementSibling.querySelectorAll('.project-row');
  rows.forEach((row) => row.classList.add('js-stagger'));

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  rows.forEach((row) => observer.observe(row));
})();
