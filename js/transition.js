// js/transition.js
document.addEventListener('DOMContentLoaded', () => {
    // 初始加载时淡入页面
    document.body.classList.add('page-fade-in');

    // 拦截所有内部链接的点击事件
    document.body.addEventListener('click', e => {
        const link = e.target.closest('a');

        // 确保是有效的内部链接，且不是新标签页打开
        if (!link || link.target === '_blank' || link.protocol !== location.protocol || link.host !== location.host) {
            return;
        }

        // 排除特殊的非页面跳转链接
        if (link.href.includes('#') || link.hasAttribute('data-email')) {
            return;
        }

        e.preventDefault();
        const destination = link.href;

        // 页面淡出
        document.body.classList.remove('page-fade-in');
        document.body.classList.add('page-fade-out');

        // 在动画结束后加载新页面
        setTimeout(() => {
            window.location.href = destination;
        }, 500); // 匹配CSS中的动画时间
    });
});
