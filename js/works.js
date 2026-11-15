/* ============================================================
   works.js — 首页作品主卡的轻微指针视差
   只作用于 [data-spatial-stage]；精细指针 + 未减少动效时启用。
   ============================================================ */
(function () {
  'use strict';

  var stage = document.querySelector('[data-spatial-stage]');
  if (!stage) { return; }

  var scene = stage.querySelector('.spatial-scene');
  var field = stage.querySelector('.spatial-stage__inner');

  if (!scene || !field || !window.matchMedia || !window.requestAnimationFrame) { return; }

  var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var raf = 0;
  var tx = 0;
  var ty = 0;

  function active() { return fine.matches && !reduce.matches; }

  function write() {
    raf = 0;
    scene.style.setProperty('--tilt-x', ty.toFixed(2) + 'deg');
    scene.style.setProperty('--tilt-y', tx.toFixed(2) + 'deg');
  }

  function aim(event) {
    if (!active()) { return; }
    var rect = field.getBoundingClientRect();
    if (!rect.width || !rect.height) { return; }
    var nx = ((event.clientX - rect.left) / rect.width - .5) * 2;
    var ny = ((event.clientY - rect.top) / rect.height - .5) * 2;
    tx = Math.max(-2.4, Math.min(2.4, nx * 2.4));
    ty = Math.max(-1.8, Math.min(1.8, -ny * 1.8));
    if (!raf) { raf = requestAnimationFrame(write); }
  }

  function reset() {
    tx = 0;
    ty = 0;
    if (!raf) { raf = requestAnimationFrame(write); }
  }

  field.addEventListener('pointermove', aim, { passive: true });
  field.addEventListener('pointerleave', reset);
  window.addEventListener('blur', reset);

  if (fine.addEventListener) {
    fine.addEventListener('change', function () { if (!active()) { reset(); } });
  }
  if (reduce.addEventListener) {
    reduce.addEventListener('change', function () { if (!active()) { reset(); } });
  }
}());
