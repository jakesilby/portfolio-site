const navScript = document.currentScript;
// Case studies sit under Work, so they mark Work as the current section.
const currentPage = document.body.dataset.page === 'case-study' ? 'work' : document.body.dataset.page;

navScript.insertAdjacentHTML('afterend', `
<header class="site-header">
  <div class="site-header__inner">
    <a class="site-header__brand" href="/">Jake Silby</a>
    <nav class="site-header__nav" aria-label="Primary">
      <a class="site-header__link" data-nav="work" href="/">Work</a>
      <a class="site-header__link" data-nav="about" href="/about.html">About</a>
    </nav>
  </div>
</header>
`);

const activeLink = navScript.nextElementSibling.querySelector(`[data-nav="${currentPage}"]`);
if (activeLink) {
  activeLink.classList.add('is-active');
  if (currentPage === document.body.dataset.page) activeLink.setAttribute('aria-current', 'page');
}
