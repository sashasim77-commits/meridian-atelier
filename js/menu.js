'use strict';

/* Меню-оверлей: открытие/закрытие, Menu ↔ Close, Escape, фокус-ловушка,
   блокировка прокрутки. Без JS кнопка остаётся якорной ссылкой на #site-nav
   (навигация футера с теми же пунктами). */

(function () {
  var btn = document.getElementById('menu-btn');
  var overlay = document.getElementById('menu-overlay');
  if (!btn || !overlay) { return; }

  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-expanded', 'false');

  function isOpen() {
    return document.body.classList.contains('menu-open');
  }

  function focusables() {
    var links = overlay.querySelectorAll('a[href]');
    return [btn].concat(Array.prototype.slice.call(links));
  }

  // Вариант Б: при открытом оверлее фоновые области недоступны и для
  // клавиатуры, и для скринридера
  function setBackgroundInert(value) {
    ['main', '.page > footer', '.footer-reveal'].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) { el.inert = value; }
    });
  }

  function open() {
    document.body.classList.add('menu-open');
    btn.setAttribute('aria-expanded', 'true');
    btn.textContent = 'Close';
    setBackgroundInert(true);
  }

  function close(returnFocus) {
    document.body.classList.remove('menu-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = 'Menu';
    setBackgroundInert(false);
    if (returnFocus) { btn.focus(); }
  }

  btn.addEventListener('click', function (event) {
    event.preventDefault();
    if (isOpen()) { close(false); } else { open(); }
  });

  btn.addEventListener('keydown', function (event) {
    // роль button у ссылки: Space должен активировать
    if (event.key === ' ') {
      event.preventDefault();
      btn.click();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (!isOpen()) { return; }

    if (event.key === 'Escape') {
      close(true);
      return;
    }

    if (event.key === 'Tab') {
      var items = focusables();
      var first = items[0];
      var last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // Переход по пункту меню (якорные ссылки) закрывает оверлей
  overlay.addEventListener('click', function (event) {
    var link = event.target.closest('a[href]');
    if (link) { close(false); }
  });
})();
