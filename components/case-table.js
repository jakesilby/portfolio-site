// Case study tables: a tab stop only when there's something to scroll.
// Each .case-table wrapper ships with tabindex="0" so the keyboard can
// scroll it sideways without JS. Here the tab stop is kept only while the
// table is wider than its wrapper, and rechecked whenever the wrapper
// resizes (window resize, font load, rotation).
(function () {
  const tables = document.querySelectorAll('.case-table');
  if (!tables.length || !('ResizeObserver' in window)) return;

  function update(table) {
    if (table.scrollWidth > table.clientWidth) table.setAttribute('tabindex', '0');
    else table.removeAttribute('tabindex');
  }

  const observer = new ResizeObserver((entries) => {
    entries.forEach((entry) => update(entry.target));
  });
  tables.forEach((table) => {
    update(table);
    observer.observe(table);
  });
})();
