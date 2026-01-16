/* particles.js config - Bubble Effect with Custom Image */
particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 30, // 减少粒子数量，避免过于拥挤
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#ffffff" // 颜色设置会被图片覆盖，但以防万一设为白色
    },
    "shape": {
      "type": "image",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "images/pic_lty.png",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.6, // 泡泡的透明度
      "random": true,
      "anim": {
        "enable": true,
        "speed": 0.5,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 20, // 泡泡的大小
      "random": true,
      "anim": {
        "enable": true, // 开启尺寸动画，实现大小脉动
        "speed": 4,
        "size_min": 10,
        "sync": false
      }
    },
    "line_linked": {
      "enable": false // 禁用连线
    },
    "move": {
      "enable": true,
      "speed": 2, // 向上漂浮的速度
      "direction": "top", // 向上移动
      "random": true, // 移动方向带点随机性
      "straight": false, // 非直线移动，模拟漂浮
      "out_mode": "bounce", // 粒子在边缘反弹
      "bounce": false,
      "attract": {
        "enable": false
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "bubble" // 鼠标悬浮时气泡膨胀
      },
      "onclick": {
        "enable": true,
        "mode": "push" // 鼠标点击时增加粒子
      },
      "resize": true
    },
    "modes": {
      "repulse": {
        "distance": 150,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
});