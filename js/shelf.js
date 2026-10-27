/* ============================================================
   shelf.js —— 水位陈列的读出行
   七块立方体是链接，指针/焦点停在哪块，下面那行就报哪块。
   没有这个脚本，页面照样完整：读出行显示首块，立方体照常可点。
   ============================================================ */
(function () {
  'use strict';

  var shelf = document.querySelector('[data-shelf]');
  if (!shelf) { return; }

  var read = shelf.querySelector('.shelf__read');
  if (!read) { return; }

  var noEl = read.querySelector('[data-r-no]');
  var nameEl = read.querySelector('[data-r-name]');
  var metaEl = read.querySelector('[data-r-meta]');
  if (!noEl || !nameEl || !metaEl) { return; }

  var home = { no: noEl.textContent, name: nameEl.textContent, meta: metaEl.textContent };

  var show = function (cell) {
    noEl.textContent = cell.getAttribute('data-no') || '';
    nameEl.textContent = cell.getAttribute('data-name') || '';
    metaEl.textContent = cell.getAttribute('data-meta') || '';
  };

  var reset = function () {
    noEl.textContent = home.no;
    nameEl.textContent = home.name;
    metaEl.textContent = home.meta;
  };

  var cells = shelf.querySelectorAll('.shelf__cell');
  for (var i = 0; i < cells.length; i++) {
    (function (cell) {
      cell.addEventListener('mouseenter', function () { show(cell); });
      cell.addEventListener('focus', function () { show(cell); });
    }(cells[i]));
  }

  shelf.addEventListener('mouseleave', reset);
  shelf.addEventListener('focusout', function (e) {
    if (!shelf.contains(e.relatedTarget)) { reset(); }
  });
}());
