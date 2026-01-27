// js/transition.js
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');

    // 初始加载时淡入内容
    if (container) {
        container.classList.add('fade-in');
    }

    // 拦截所有内部链接的点击事件
    document.body.addEventListener('click', e => {
        const link = e.target.closest('a');

        // 确保是有效的内部链接，且不是新标签页打开
        if (!link || link.target === '_blank' || link.protocol !== location.protocol || link.host !== location.host) {
            return;
        }

        // 排除特殊的非页面跳转链接
        if (link.href.includes('#') || link.hasAttribute('data-email') || link.closest('.project-tag') || link.closest('#show-more-container')) {
            return;
        }

        e.preventDefault();
        const destination = link.href;

        // 内容淡出
        if (container) {
            container.classList.remove('fade-in');
            container.classList.add('fade-out');
        }

        // 在动画结束后加载新页面
        setTimeout(() => {
            window.location.href = destination;
        }, 500); // 匹配CSS中的动画时间
    });

    // 监听 pageshow 事件，用于处理浏览器后退时的淡入
    window.addEventListener('pageshow', (event) => {
        // event.persisted 表示页面是否从缓存中加载
        if (event.persisted && container) {
            container.classList.remove('fade-out');
            container.classList.add('fade-in');
        }
    });
});
