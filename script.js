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

    // 5. 从 GitHub API 获取项目
    fetchGitHubProjects();
});

async function fetchGitHubProjects() {
    const container = document.getElementById('projects-container');
    const username = 'Dragonzhi';
    const apiUrl = `https://api.github.com/users/${username}/repos`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`网络响应错误: ${response.status}`);
        }
        const repos = await response.json();

        // 筛选和排序
        const filteredAndSortedRepos = repos
            .filter(repo => !repo.fork && repo.description) // 过滤掉fork的项目和没有描述的
            .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at)); // 按最近推送时间排序

        if (filteredAndSortedRepos.length === 0) {
            container.innerHTML = '<p>在 GitHub 上没有找到符合条件的项目。</p>';
            return;
        }

        let projectsHtml = '';
        filteredAndSortedRepos.forEach((repo, index) => {
            let iconClass = 'fa-code'; // 默认图标
            if (repo.name.toLowerCase().includes('immunelink')) {
                iconClass = 'fa-gamepad';
            } else if (repo.name.toLowerCase().includes('counterstrikegrenades')) {
                iconClass = 'fa-cube';
            }

            const animation = index % 2 === 0 ? 'fade-right' : 'fade-left';

            projectsHtml += `
                <div class="project-card" data-aos="${animation}">
                    <h3><i class="fas ${iconClass}"></i> ${repo.name}</h3>
                    <p>${repo.description}</p>
                    <a href="${repo.html_url}" target="_blank" class="project-link">查看项目</a>
                    ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="project-link">在线游玩</a>` : ''}
                </div>
            `;
        });

        container.innerHTML = projectsHtml;

    } catch (error) {
        console.error('获取 GitHub 项目失败:', error);
        container.innerHTML = '<p>无法加载 GitHub 项目。请稍后刷新重试。</p>';
    }
}
