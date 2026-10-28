/* cube.js · WebGL2 母题立方体 */
(function () {
  'use strict';

  var IX = 35.264*Math.PI/180, IY = Math.PI/4;

  var P = [
    -.5,-.5,.5, .5,-.5,.5, .5,.5,.5, -.5,.5,.5, .5,-.5,-.5, -.5,-.5,-.5, -.5,.5,-.5, .5,.5,-.5,
    .5,-.5,.5, .5,-.5,-.5, .5,.5,-.5, .5,.5,.5, -.5,-.5,-.5, -.5,-.5,.5, -.5,.5,.5, -.5,.5,-.5,
    -.5,.5,.5, .5,.5,.5, .5,.5,-.5, -.5,.5,-.5, -.5,-.5,-.5, .5,-.5,-.5, .5,-.5,.5, -.5,-.5,.5
  ];
  var N = [], F = [0,0,1, 0,0,-1, 1,0,0, -1,0,0, 0,1,0, 0,-1,0];
  for (var k = 0; k < 6; k++) for (var j = 0; j < 12; j++) N.push(F[k * 3 + j % 3]);
  var I = [];
  for (k = 0; k < 24; k += 4) I.push(k, k + 1, k + 2, k, k + 2, k + 3);

  var VS = `#version 300 es
in vec3 aPos;in vec3 aNor;
uniform mat4 uMVP;uniform mat3 uNrm;
out vec3 vN;
void main(){vN=uNrm*aNor;gl_Position=uMVP*vec4(aPos,1.0);}`;
  var FS = `#version 300 es
precision highp float;in vec3 vN;uniform vec3 uBase;out vec4 outColor;
void main(){
vec3 n=normalize(vN);
vec3 l=normalize(vec3(-0.52,0.72,0.46));
float lam=pow(max(dot(n,l),0.0),0.85);
vec3 b=pow(uBase,vec3(2.2));
vec3 c=b*(0.13+lam*0.94)+b*0.05;
outColor=vec4(pow(c,vec3(1.0/2.2)),1.0);
}`;
  function rx(a) { var c = Math.cos(a), s = Math.sin(a); return new Float32Array([1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]); }
  function ry(a) { var c = Math.cos(a), s = Math.sin(a); return new Float32Array([c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]); }
  function ortho(l, r, b, t, n, f) {
    var m = new Float32Array(16);
    m[0] = 2/(r-l); m[5] = 2/(t-b); m[10] = -2/(f-n);
    m[12] = -(r+l)/(r-l); m[13] = -(t+b)/(t-b); m[14] = -(f+n)/(f-n); m[15] = 1;
    return m;
  }
  function mul(a, b) {
    var o = new Float32Array(16);
    for (var c = 0; c < 4; c++) for (var r = 0; r < 4; r++)
      o[c*4+r] = a[r]*b[c*4] + a[r+4]*b[c*4+1] + a[r+8]*b[c*4+2] + a[r+12]*b[c*4+3];
    return o;
  }
  function hex(v) {
    var m = /^#(\w\w)(\w\w)(\w\w)$/.exec((v || '').trim());
    return m ? m.slice(1).map(function (x) { return parseInt(x, 16) / 255; }) : null;
  }

  function program(gl, vs, fs) {
    function mk(t, src) {
      var sh = gl.createShader(t);
      gl.shaderSource(sh, src); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { console.error('[cube]', gl.getShaderInfoLog(sh)); return null; }
      return sh;
    }
    var v = mk(gl.VERTEX_SHADER, vs), f = mk(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) { return null; }
    var p = gl.createProgram();
    gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { console.error('[cube]', gl.getProgramInfoLog(p)); return null; }
    return p;
  }

  function init(host) {
    var svg = host.querySelector('svg.cube');
    if (!svg) { return; }
    var w = parseFloat(getComputedStyle(host).getPropertyValue('--cw')) || svg.getBoundingClientRect().width;
    if (w < 72) { return; }

    var key = svg.classList.contains('cube--live') ? '--cube-live-base' : svg.classList.contains('cube--sunk') ? '--cube-sunk-base' : '--cube-base';
    var base = hex(getComputedStyle(svg).getPropertyValue(key));
    if (!base) { return; }

    var dpr = Math.min(window.devicePixelRatio || 1, 2), cv = document.createElement('canvas');
    cv.className = 'cube';
    cv.setAttribute('aria-hidden', 'true');
    cv.width = cv.height = Math.round(w * dpr);

    var gl = cv.getContext('webgl2', { antialias: true, alpha: true, premultipliedAlpha: false });
    if (!gl) { return; }
    var pg = program(gl, VS, FS);
    if (!pg) { return; }

    gl.bindVertexArray(gl.createVertexArray());
    var bufs = [[P, 'aPos'], [N, 'aNor']];
    for (var i = 0; i < 2; i++) {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufs[i][0]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(pg, bufs[i][1]);
      gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(I), gl.STATIC_DRAW);

    gl.enable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE); gl.clearColor(0,0,0,0);

    var uMVP = gl.getUniformLocation(pg, 'uMVP'), uNrm = gl.getUniformLocation(pg, 'uNrm'), uBase = gl.getUniformLocation(pg, 'uBase');
    var proj = ortho(-.94, .94, -.94, .94, -10, 10);
    var st = { yaw: IY, pitch: IX };

    function draw() {
      var m = mul(rx(st.pitch), ry(st.yaw));
      gl.viewport(0,0,cv.width,cv.height);
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.useProgram(pg);
      gl.uniformMatrix4fv(uMVP, false, mul(proj, m));
      gl.uniformMatrix3fv(uNrm, false, [m[0],m[1],m[2],m[4],m[5],m[6],m[8],m[9],m[10]]);
      gl.uniform3fv(uBase, base);
      gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }

    draw();

    svg.hidden = true; svg.style.display = 'none';
    host.appendChild(cv);
    if (host.hasAttribute('data-cube-drag')) { drag(host, st, draw); }
  }

  function drag(host, st, draw) {
    var K = 0.013, LIM = 85 * Math.PI / 180;
    var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var id = null, x = 0, y = 0, moved = false, queued = false;
    var vy = 0, vp = 0, last = 0, spin = 0, from = 0;

    host.style.touchAction = 'none'; host.style.cursor = 'grab'; host.style.userSelect = 'none';
    host.ondragstart = function (e) { e.preventDefault(); };
    function paint() { queued = false; draw(); }
    function tick(now) {
      var dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      st.yaw += vy * dt;
      st.pitch = Math.max(-LIM, Math.min(LIM, st.pitch + vp * dt));
      var d = Math.exp(-dt / 0.45);
      vy *= d; vp *= d;
      draw();
      spin = Math.hypot(vy, vp) > 0.05 && now - from < 4000 ? requestAnimationFrame(tick) : 0;
    }
    host.onpointerdown = function (e) {
      if (e.button !== 0) { return; }
      if (spin) { cancelAnimationFrame(spin); spin = 0; }
      id = e.pointerId; x = e.clientX; y = e.clientY;
      moved = false; vy = vp = 0; last = performance.now();
      host.style.cursor = 'grabbing';
      try { host.setPointerCapture(id); } catch (err) {}
    };
    host.onpointermove = function (e) {
      if (id === null || e.pointerId !== id) { return; }
      var dx = (e.clientX - x) * K, dy = (e.clientY - y) * K;
      if (Math.abs(e.clientX - x) + Math.abs(e.clientY - y) > 3) { moved = true; }
      var now = performance.now(), dt = Math.max(now - last, 1);
      vy = vy * 0.55 + (dx / dt * 1000) * 0.45;
      vp = vp * 0.55 + (dy / dt * 1000) * 0.45;
      st.yaw += dx;
      st.pitch = Math.max(-LIM, Math.min(LIM, st.pitch + dy));
      x = e.clientX; y = e.clientY; last = now;
      if (!queued) { queued = true; requestAnimationFrame(paint); }
    };
    function end(e) {
      if (e.pointerId !== id) { return; }
      id = null;
      host.style.cursor = 'grab';
      setTimeout(function () { moved = false; }, 300);
      if (calm) { return; }
      var idle = performance.now() - last;
      vy *= Math.exp(-idle / 160); vp *= Math.exp(-idle / 160);
      vy = Math.max(-12, Math.min(12, vy)); vp = Math.max(-8, Math.min(8, vp));
      if (Math.hypot(vy, vp) < 0.3) { return; }
      from = last = performance.now();
      spin = requestAnimationFrame(tick);
    }
    host.onpointerup = end; host.onpointercancel = end;
    host.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
    }, true);
  }

  document.querySelectorAll('[data-cube-host]').forEach(function (h) {
    try { init(h); } catch (e) { console.error('[cube]', e); }
  });

  /* ---- 入场：手写 2D 物理坠落（重力 + 触线反弹 + 角度回正）。
     物理只管「怎么落」，不管「落在哪」：终点是 CSS 设计位（transform 归零）。
     落定即停帧；落线瞬间派发 shelf-impact，water.js 借此起波。 ---- */
  function drop() {
    var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hosts = document.querySelectorAll('[data-cube-host]');
    var i;

    function reveal(el) { el.style.opacity = '1'; }

    if (calm || !hosts.length) {
      for (i = 0; i < hosts.length; i++) { reveal(hosts[i]); }
      return;
    }

    function fall(host, idx) {
      var shelf = host.closest('[data-shelf]');
      var deck = shelf ? shelf.querySelector('.shelf__deck') : null;
      var r = host.getBoundingClientRect();
      if (!r.width) { return; }

      var deckTop = deck ? deck.getBoundingClientRect().top : r.top - 160;
      var crossAt = null;                      // 底缘触到水线时的 y；无水（签名）为 null 不触发
      if (shelf) {
        var lineY = deckTop + (parseFloat(getComputedStyle(shelf).getPropertyValue('--line')) || 0);
        crossAt = lineY - r.bottom;
      }
      var y = -((r.top - deckTop) + 150 + (idx % 7) * 26 + Math.random() * 40);
      var vy = 0;
      var ang = (Math.random() - .5) * .22;
      var va = (Math.random() - .5) * 1.1;
      var G = 2600, REST = .34;
      var bounced = 0, crossed = false, ground = false;
      var last = 0;

      setTimeout(function () {
        reveal(host);
        last = performance.now();
        requestAnimationFrame(tick);
      }, 120 + idx * 90);

      function tick(now) {
        var dt = Math.min((now - last) / 1000, .032);
        last = now;

        if (!ground) {
          vy += G * dt;
          y += vy * dt;
          if (crossAt !== null && !crossed && y >= crossAt) {
            crossed = true;
            shelf.dispatchEvent(new CustomEvent('shelf-impact', {
              detail: { clientX: r.left + r.width / 2, force: -(1.4 + Math.min(2.8, vy / 340)) }
            }));
          }
          ang += va * dt;
          if (y >= 0) {
            y = 0;
            if (bounced < 2 && vy > 150) { vy = -vy * REST; va = -va * .5; bounced++; }
            else { vy = 0; ground = true; }
          }
        } else {
          va += (-ang * 140 - va * 9) * dt;
          ang += va * dt;
          if (Math.abs(ang) < .004 && Math.abs(va) < .05) {
            host.style.transform = '';
            return;                            // 落定，停帧
          }
        }
        host.style.transform = 'translateY(' + y.toFixed(2) + 'px) rotate(' + ang.toFixed(4) + 'rad)';
        requestAnimationFrame(tick);
      }
    }

    for (i = 0; i < hosts.length; i++) {
      (function (host, idx) {
        try { fall(host, idx); } catch (err) { reveal(host); }
      }(hosts[i], i));
    }
  }

  drop();
}());
