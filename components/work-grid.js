// Homepage work grid. Each item is one link: media, title, one outcome
// line, a "category / year" meta line, and a decorative "Read more" pill
// shown on mouse hover. Media fills a 16:10 box, the
// clips' native ratio. Videos are wrapped in
// [data-clip-video] so components/clip-video.js (loaded after this script)
// pauses them offscreen and keeps them on the poster under reduced motion.
// Media is decorative here: the link's name comes from the title, and the
// case study pages carry the full media descriptions.
const workItems = [
  {
    title: 'OnePulse Connect design system',
    outcome: 'The token and component system every OnePulse Connect screen was designed from.',
    category: 'Design systems',
    year: '2026',
    href: 'onepulse-connect.html',
    video: {
      poster: 'videos/ds_siteoverview_poster.jpg',
      sources: [
        { src: 'videos/ds_siteoverview.mp4', type: 'video/mp4' },
        { src: 'videos/ds_siteoverview.webm', type: 'video/webm' },
      ],
    },
  },
  {
    title: 'Linking documents & prescriptions',
    outcome: 'A linking interaction for pharmacy staff, redesigned after the first version failed testing.',
    category: 'Product design',
    year: '2026',
    href: 'linking-documents-prescriptions.html',
    video: {
      poster: 'videos/link-document-flow-short_poster.jpg',
      sources: [
        { src: 'videos/link-document-flow-short.mp4', type: 'video/mp4' },
        { src: 'videos/link-document-flow-short.webm', type: 'video/webm' },
      ],
    },
  },
  {
    title: 'Pre-infusion assessment flow',
    outcome: 'A framework for clinical assessments, tested against a 43-question form with hard safety stops.',
    category: 'Product design',
    year: '2026',
    href: 'pre-infusion-assessment-flow.html',
    video: {
      poster: 'videos/as_infectionscreening_poster.jpg',
      sources: [
        { src: 'videos/as_infectionscreening.mp4', type: 'video/mp4' },
      ],
    },
  },
  {
    title: 'Auditing Carbon for token drift',
    outcome: 'How much hardcoded spacing shows up in a mature, production design system.',
    category: 'Personal project',
    year: '2026',
    href: 'carbon-token-audit.html',
    image: 'images/carbon-classifier-flow.png',
  },
];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function workMedia(item) {
  if (item.video) {
    const sources = item.video.sources
      .map((s) => `<source src="${s.src}" type="${s.type}">`)
      .join('');
    return `<div class="work-grid__media" data-clip-video>
      <video class="work-grid__media-inner" poster="${item.video.poster}"${reduceMotion ? '' : ' autoplay'} muted loop playsinline preload="metadata" aria-hidden="true">${sources}</video>
    </div>`;
  }
  return `<div class="work-grid__media">
      <img class="work-grid__media-inner" src="${item.image}" alt="" loading="lazy">
    </div>`;
}

const workGridHtml = workItems
  .map(
    (item) => `
  <li class="work-grid__cell">
    <a class="work-grid__item" href="${item.href}">
      ${workMedia(item)}
      <h3 class="work-grid__title">${item.title}</h3>
      <p class="work-grid__outcome">${item.outcome}</p>
      <p class="work-grid__meta">${item.category} / ${item.year}</p>
      <span class="work-grid__pill" aria-hidden="true">Read more</span>
    </a>
  </li>`
  )
  .join('');

document.currentScript.insertAdjacentHTML('afterend', `<ul class="work-grid">${workGridHtml}</ul>`);

// "Read more" pill follows the cursor inside the hovered item. CSS only
// shows it for a fine pointer that can hover. The pill sits centered above
// the cursor point (see .work-grid__pill), so clamp the point to keep the
// whole pill inside the item: half its width from either side, and its
// height plus the offset from the top.
const pillOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--work-grid-pill-offset'));

document.querySelectorAll('.work-grid__item').forEach((item) => {
  const pill = item.querySelector('.work-grid__pill');
  item.addEventListener('mousemove', (event) => {
    const box = item.getBoundingClientRect();
    const halfWidth = pill.offsetWidth / 2;
    const above = pill.offsetHeight + pillOffset;
    const x = Math.min(Math.max(event.clientX - box.left, halfWidth), box.width - halfWidth);
    const y = Math.min(Math.max(event.clientY - box.top, above), box.height);
    pill.style.left = `${x}px`;
    pill.style.top = `${y}px`;
  });
});
