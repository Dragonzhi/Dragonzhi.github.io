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

const CACHE_KEY = 'github_projects_cache';
const TIMESTAMP_KEY = 'github_projects_timestamp';
const CACHE_DURATION_MS = 3600 * 1000; // 1 小时

async function fetchGitHubProjects() {
    const container = document.getElementById('projects-container');
    const cachedTimestamp = localStorage.getItem(TIMESTAMP_KEY);
    const cachedData = localStorage.getItem(CACHE_KEY);

    // 1. 检查是否存在有效缓存
    if (cachedTimestamp && cachedData && (new Date().getTime() - cachedTimestamp < CACHE_DURATION_MS)) {
        console.log('从缓存加载 GitHub 项目。');
        renderProjects(JSON.parse(cachedData), container);
        return;
    }

    console.log('从 API 获取新的 GitHub 项目。');
    const username = 'Dragonzhi';
    const orgRepoPath = 'ThePiSquad/CounterStrikeGrenades';
    const TOKEN = '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';

    try {
        const headers = {
            'Authorization': `token ${TOKEN}`
        };
        
        const [userReposRes, orgRepoRes] = await Promise.all([
            fetch(`https://api.github.com/users/${username}/repos`, { headers }),
            fetch(`https://api.github.com/repos/${orgRepoPath}`, { headers })
        ]);

        if (!userReposRes.ok || !orgRepoRes.ok) {
            throw new Error(`网络响应错误: User: ${userReposRes.status}, Org: ${orgRepoRes.status}`);
        }

        const userRepos = await userReposRes.json();
        const orgRepo = await orgRepoRes.json();

        const allRepos = [...userRepos, orgRepo];
        const uniqueRepos = Array.from(new Map(allRepos.map(repo => [repo.id, repo])).values());

        const filteredAndSortedRepos = uniqueRepos
            .filter(repo => !repo.fork && repo.description)
            .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

        // 2. 成功获取后，存入缓存
        localStorage.setItem(CACHE_KEY, JSON.stringify(filteredAndSortedRepos));
        localStorage.setItem(TIMESTAMP_KEY, new Date().getTime());

        // 3. 渲染项目
        renderProjects(filteredAndSortedRepos, container);

    } catch (error) {
        console.error('获取 GitHub 项目失败:', error);
        // 如果获取失败，也尝试使用旧缓存（如果存在），避免在API失效时页面完全空白
        if(cachedData) {
            console.warn('API 获取失败，回退到使用旧缓存。');
            renderProjects(JSON.parse(cachedData), container);
        } else {
            container.innerHTML = '<p>无法加载 GitHub 项目。请稍后刷新重试。</p>';
        }
    }
}

function renderProjects(repos, container) {
    if (!repos || repos.length === 0) {
        container.innerHTML = '<p>在 GitHub 上没有找到符合条件的项目。</p>';
        return;
    }

    let projectsHtml = '';
    repos.forEach((repo, index) => {
        let iconClass = 'fa-code';
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
}
