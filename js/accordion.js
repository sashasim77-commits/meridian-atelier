'use strict';

/* Process — двухрежимный компонент.
   <1024: настоящий аккордеон — клик/Enter/Space, aria-expanded,
          одна панель одновременно, все могут быть закрыты.
   ≥1024: hover/selection-список — hover, фокус (A11y вариант Б)
          и Enter/Space активируют пункт; ровно один активен. */

(function () {
  var body = document.getElementById('process-body');
  if (!body) { return; }

  var items = Array.prototype.slice.call(body.querySelectorAll('.process__item'));
  var mqDesktop = window.matchMedia('(min-width: 1024px)');

  function setOpen(item, open) {
    item.classList.toggle('is-open', open);
    var btn = item.querySelector('.process__btn');
    var panel = item.querySelector('.process__panel');
    if (btn) { btn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
    // Закрытая панель не должна оставаться в accessibility tree
    // (визуально её прячет CSS-анимация, а не display:none)
    if (panel) {
      if (open) {
        panel.removeAttribute('aria-hidden');
      } else {
        panel.setAttribute('aria-hidden', 'true');
      }
    }
  }

  function activate(index) {
    items.forEach(function (item, i) { setOpen(item, i === index); });
  }

  function closeAll() {
    items.forEach(function (item) { setOpen(item, false); });
  }

  items.forEach(function (item, i) {
    var btn = item.querySelector('.process__btn');
    if (!btn) { return; }

    btn.addEventListener('click', function () {
      if (mqDesktop.matches) {
        activate(i);
      } else {
        var wasOpen = item.classList.contains('is-open');
        closeAll();
        if (!wasOpen) { setOpen(item, true); }
      }
    });

    // Вариант Б: на desktop фокус активирует пункт так же, как hover
    btn.addEventListener('focus', function () {
      if (mqDesktop.matches) { activate(i); }
    });

    item.addEventListener('mouseenter', function () {
      if (mqDesktop.matches) { activate(i); }
    });
  });

  function applyMode() {
    if (mqDesktop.matches) {
      activate(0);
    } else {
      closeAll();
    }
  }

  applyMode();
  if (mqDesktop.addEventListener) {
    mqDesktop.addEventListener('change', applyMode);
  }
})();
