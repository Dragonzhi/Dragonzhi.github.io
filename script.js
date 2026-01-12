document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');

    // 1. 检查本地存储中用户的偏好
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    // 2. 为切换按钮添加点击事件
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        // 3. 更新图标并保存偏好到本地存储
        if (body.classList.contains('dark-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    // 4. 初始化 AOS 滚动动画库
    AOS.init({
        duration: 800, // 动画持续时间
        once: true, // 动画只播放一次
        offset: 50 // 触发动画的偏移量
    });
    
    // 获取当前日期并显示在页脚
    const dateSpan = document.getElementById('current-date');
    if (dateSpan) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        dateSpan.textContent = today.toLocaleDateString('zh-CN', options);
    }
});
