const navScript = document.currentScript;

navScript.insertAdjacentHTML('afterend', `
<header class="site-header">
  <a class="site-header__brand" href="/">
    <img class="site-header__brand-mark" src="components/brand-mark.png" alt="" width="16" height="16">
    <span class="site-header__brand-text type-wordmark">Welcome</span>
  </a>
  <nav class="site-header__nav" aria-label="Primary">
    <a class="nav-pill type-nav-label" data-nav="work" href="/">01 / Work</a>
    <a class="nav-pill type-nav-label" data-nav="about" href="#">02 / About</a>
  </nav>
</header>
`);

(function cycleBrandText() {
  const greetings = ['Welcome', 'Bonjour', 'Hola', 'こんにちは', 'Willkommen'];
  const brandText = navScript.nextElementSibling.querySelector('.site-header__brand-text');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!brandText || reduceMotion) return;

  let index = 0;
  setInterval(() => {
    index = (index + 1) % greetings.length;
    brandText.textContent = greetings[index];
  }, 2500);
})();
