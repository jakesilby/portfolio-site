const projectRows = [
  {
    year: '2026',
    type: 'Design Systems',
    title: 'OnePulse Connect Design System',
    description: 'A solo-built token and component system, taken from scattered Figma files to a governed architecture and bridged into code.',
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
    return `
<a class="project-row" href="${row.href}">
  <div class="project-row__header">
    <div class="project-row__title-group">
      <span class="project-row__index type-label-secondary">${index}</span>
      <h3 class="project-row__title type-case-title">${row.title}</h3>
    </div>
    <div class="project-row__meta">
      <span class="project-row__year type-meta">${row.year}</span>
      <span class="badge type-label-secondary">${row.type}</span>
    </div>
  </div>
  <div class="project-row__body">
    <div class="project-row__image">
      <div class="project-row__image-inner"></div>
    </div>
    <p class="project-row__description type-description">${row.description}</p>
  </div>
</a>`;
  })
  .join('');

document.currentScript.insertAdjacentHTML('afterend', `<div class="project-row-list">${projectRowsHtml}</div>`);
