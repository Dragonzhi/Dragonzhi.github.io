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

    console.log('从本地和API获取新的 GitHub 项目。');
    const orgRepoPath = 'ThePiSquad/CounterStrikeGrenades';

    try {
        // 并行获取本地的 repos.json 和特定组织的仓库信息
        const [userReposRes, orgRepoRes] = await Promise.all([
            fetch('repos.json'), // 从工作流生成的本地文件获取
            fetch('org-repo.json') // 从工作流生成的本地文件获取组织仓库
        ]);

        if (!userReposRes.ok) {
            throw new Error(`加载本地 repos.json 失败: ${userReposRes.status}`);
        }

        const userRepos = await userReposRes.json();
        let allRepos = [...userRepos];

        // 优雅地处理组织仓库的获取结果
        if (orgRepoRes.ok) {
            const orgRepo = await orgRepoRes.json();
            allRepos.push(orgRepo);
            console.log(`成功获取组织仓库: ${orgRepoPath}`);
        } else {
            console.warn(`无法从 API 获取组织仓库 ${orgRepoPath}，状态: ${orgRepoRes.status}。将仅显示用户仓库。`);
        }

        // 去重、过滤和排序
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
        if (cachedData) {
            console.warn('API 获取失败，回退到使用旧缓存。');
            renderProjects(JSON.parse(cachedData), container);
        } else {
            container.innerHTML = '<p>无法加载 GitHub 项目。请稍后刷新重试。</p>';
        }
    }
}

const REPOS_TO_SHOW_INITIALLY = 4;

function renderProjects(repos, container) {
    if (!repos || repos.length === 0) {
        container.innerHTML = '<p>在 GitHub 上没有找到符合条件的项目。</p>';
        return;
    }

    // 1. 生成所有项目卡片的 HTML
    let projectsHtml = repos.map((repo, index) => {
        let iconClass = 'fa-code';
        if (repo.name.toLowerCase().includes('immunelink')) {
            iconClass = 'fa-gamepad';
        } else if (repo.name.toLowerCase().includes('counterstrikegrenades')) {
            iconClass = 'fa-cube';
        }

        // Add 'hidden' class to projects that should be initially hidden
        const isHidden = index >= REPOS_TO_SHOW_INITIALLY ? 'hidden' : '';
        const animation = 'fade-up';

        return `
            <div class="project-card ${isHidden}" data-aos="${animation}">
                 <div>
                    <h3><i class="fas ${iconClass}"></i> ${repo.name}</h3>
                    <p>${repo.description}</p>
                </div>
                <div class="project-links-container">
                    <a href="${repo.html_url}" target="_blank" class="project-link">查看项目</a>
                    ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="project-link">在线游玩</a>` : ''}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = projectsHtml;

    // 2. 如果项目总数超过初始显示数，则添加“显示更多”按钮
    if (repos.length > REPOS_TO_SHOW_INITIALLY) {
        const showMoreContainer = document.getElementById('show-more-container');
        const showMoreBtn = document.createElement('button');
        showMoreBtn.textContent = '显示更多';
        showMoreBtn.classList.add('show-more-btn');
        showMoreContainer.appendChild(showMoreBtn);

        let isShowingAll = false;

        showMoreBtn.addEventListener('click', () => {
            isShowingAll = !isShowingAll;
            const hiddenCards = container.querySelectorAll('.project-card.hidden');
            
            hiddenCards.forEach(card => {
                // We just toggle display, a CSS transition can make it smooth
                if (isShowingAll) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            showMoreBtn.textContent = isShowingAll ? '收起' : '显示更多';

            // Re-initialize AOS on the newly displayed items
            if(isShowingAll) {
                AOS.refresh();
            }
        });
    }

    // Since we dynamically add 'hidden' which sets display:none, we need to adjust how AOS is fired.
    // Let's hide the elements via JS first after AOS has animated them.
    // A simpler way is to just refresh AOS after showing, which is what is done above.
}
