const projectRows = [
  {
    year: '2026',
    type: 'Design Systems',
    title: 'OnePulse Connect Design System',
    description: "I built OnePulse Connect's token and component system solo — from scattered, undocumented Figma files to the shared source of truth design and engineering now build from.",
    href: 'onepulse-connect.html',
    video: {
      poster: 'videos/ds_siteoverview_poster.jpg',
      sources: [
        { src: 'videos/ds_siteoverview.webm', type: 'video/webm' },
        { src: 'videos/ds_siteoverview.mp4', type: 'video/mp4' },
      ],
    },
    imageAlt: "OnePulse Connect component library: clicking through the sidebar to load Alert, Data Table, Dialog, and Chip in the documentation viewer.",
  },
  {
    year: '2026',
    type: 'Coming Soon',
    title: 'Case Study Title',
    description: 'Description',
    href: null,
  },
  {
    year: '2026',
    type: 'Coming Soon',
    title: 'Case Study Title',
    description: 'Description',
    href: null,
  },
  {
    year: '2026',
    type: 'Coming Soon',
    title: 'Case Study Title',
    description: 'Description',
    href: null,
  },
];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const projectRowsHtml = projectRows
  .map((row, i) => {
    const index = String(i + 1).padStart(2, '0');
    const imageInner = row.video
      ? `<video class="project-row__image-inner project-row__image-inner--siteoverview" poster="${row.video.poster}"${reduceMotion ? '' : ' autoplay'} muted loop playsinline aria-label="${row.imageAlt}">${row.video.sources
          .map((s) => `<source src="${s.src}" type="${s.type}">`)
          .join('')}</video>`
      : row.image
      ? `<img class="project-row__image-inner" src="${row.image}" alt="${row.imageAlt}" loading="lazy">`
      : `<div class="project-row__image-inner"></div>`;
    const tag = row.href ? 'a' : 'div';
    const hrefAttr = row.href ? ` href="${row.href}"` : '';
    const modifierClass = row.href ? '' : ' project-row--upcoming';
    return `
<${tag} class="project-row${modifierClass}"${hrefAttr}>
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
</${tag}>`;
  })
  .join('');

const projectRowScript = document.currentScript;

projectRowScript.insertAdjacentHTML('afterend', `<div class="project-row-list">${projectRowsHtml}</div>`);

(function observeProjectRows() {
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
