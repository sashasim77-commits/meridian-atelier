'use strict';

/* Заголовки карточек при pointer: coarse — прозрачность управляется
   прокруткой через CSS-переменную --view-opacity (0 → 1 по мере
   прохождения карточки через вьюпорт), как у референса.
   При prefers-reduced-motion: reduce не запускается — заголовки
   показываются статично (см. components.css). */

(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
  if (!cards.length) { return; }

  var mqCoarse = window.matchMedia('(pointer: coarse)');
  var mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var ticking = false;
  var enabled = false;

  function update() {
    ticking = false;
    var vh = window.innerHeight;
    cards.forEach(function (card) {
      var rect = card.getBoundingClientRect();
      // 0 — верх карточки у нижней кромки вьюпорта; 1 — карточка вошла целиком
      var progress = (vh - rect.top) / rect.height;
      progress = Math.max(0, Math.min(1, progress));
      card.style.setProperty('--view-opacity', progress.toFixed(3));
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  function enable() {
    if (enabled) { return; }
    enabled = true;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  function disable() {
    if (!enabled) { return; }
    enabled = false;
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    cards.forEach(function (card) {
      card.style.removeProperty('--view-opacity');
    });
  }

  function apply() {
    if (mqCoarse.matches && !mqReduced.matches) {
      enable();
    } else {
      disable();
    }
  }

  apply();
  if (mqCoarse.addEventListener) {
    mqCoarse.addEventListener('change', apply);
    mqReduced.addEventListener('change', apply);
  }
})();
