const navScript = document.currentScript;

navScript.insertAdjacentHTML('afterend', `
<header class="site-header">
  <a class="site-header__brand" href="/">
    <img class="site-header__brand-mark" src="components/brand-mark.png" alt="" width="16" height="16">
    <span class="site-header__brand-text-wrap">
      <span class="site-header__brand-text type-wordmark is-active">Welcome</span>
      <span class="site-header__brand-text type-wordmark"></span>
    </span>
  </a>
  <nav class="site-header__nav" aria-label="Primary">
    <a class="nav-pill type-nav-label" data-nav="work" href="/">Work</a>
    <a class="nav-pill type-nav-label" data-nav="about" href="#">About</a>
  </nav>
</header>
`);

(function cycleBrandText() {
  const greetings = [
    'Welcome',
    'Haere mai',
    'Bonjour',
    'Hola',
    'こんにちは',
    'Willkommen',
    '欢迎',
    '환영합니다',
    'أهلاً وسهلاً',
    'Karibu',
    'स्वागत है',
    'Benvenuto',
    'Bem-vindo',
  ];
  const wrap = navScript.nextElementSibling.querySelector('.site-header__brand-text-wrap');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!wrap || reduceMotion) return;

  const slots = wrap.querySelectorAll('.site-header__brand-text');
  let activeSlot = 0;
  let greetingIndex = 0;

  setInterval(() => {
    greetingIndex = (greetingIndex + 1) % greetings.length;
    const incoming = slots[1 - activeSlot];
    const outgoing = slots[activeSlot];
    incoming.textContent = greetings[greetingIndex];
    incoming.classList.add('is-active');
    outgoing.classList.remove('is-active');
    activeSlot = 1 - activeSlot;
  }, 2500);
})();
