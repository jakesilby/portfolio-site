const tokenChainScript = document.currentScript;

const tokenChainArrow = `
<span class="token-chain__arrow">
  <svg viewBox="0 0 14 14.7279" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M1 6.36396C0.447715 6.36396 0 6.81168 0 7.36396C0 7.91625 0.447715 8.36396 1 8.36396V7.36396V6.36396ZM13.7071 8.07107C14.0976 7.68054 14.0976 7.04738 13.7071 6.65685L7.34315 0.292893C6.95262 -0.097631 6.31946 -0.097631 5.92893 0.292893C5.53841 0.683418 5.53841 1.31658 5.92893 1.70711L11.5858 7.36396L5.92893 13.0208C5.53841 13.4113 5.53841 14.0445 5.92893 14.435C6.31946 14.8256 6.95262 14.8256 7.34315 14.435L13.7071 8.07107ZM1 7.36396V8.36396H13V7.36396V6.36396H1V7.36396Z" fill="currentColor"/>
  </svg>
</span>`;

tokenChainScript.insertAdjacentHTML('afterend', `
<div class="token-chain-wrap">
  <div class="token-chain">
    <div class="token-chain__card">
      <span class="token-chain__swatch"></span>
      <div class="token-chain__text">
        <p class="token-chain__label type-token-name">Primitive</p>
        <p class="token-chain__name type-token-name">Pulse-teal.700</p>
      </div>
    </div>
    ${tokenChainArrow}
    <div class="token-chain__card">
      <span class="token-chain__swatch"></span>
      <div class="token-chain__text">
        <p class="token-chain__label type-token-name">Semantic Alias</p>
        <p class="token-chain__name type-token-name">Primary.Dark</p>
      </div>
    </div>
    ${tokenChainArrow}
    <div class="token-chain__card">
      <span class="token-chain__swatch"></span>
      <div class="token-chain__text">
        <p class="token-chain__label type-token-name">Mapped Token</p>
        <p class="token-chain__name type-token-name">Accent.Primary.fg.fill</p>
      </div>
    </div>
  </div>
</div>
<p class="token-chain__caption type-body">accent-primary-fg-fill resolves through primary.dark, not primary.main: a deliberately darker shade for foreground contrast against the accent background.</p>
`);
