document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const docElement = document.documentElement;

    // 1. 同步初始图标状态
    // 根据 html 元素上是否已有 dark-mode 类来决定初始图标
    if (docElement.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    // 2. 为切换按钮添加点击事件
    themeToggle.addEventListener('click', () => {
        docElement.classList.toggle('dark-mode');

        // 3. 更新图标并保存偏好到本地存储
        if (docElement.classList.contains('dark-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
        // 当切换主题时，重新渲染图表以更新颜色
        if (typeof renderLanguageChart === 'function') {
            renderLanguageChart();
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

    // 6. 添加邮箱点击复制功能
    const emailButton = document.querySelector('.email-tooltip');
    if (emailButton) {
        const originalText = emailButton.querySelector('span').textContent;
        emailButton.addEventListener('click', (event) => {
            event.preventDefault(); // 阻止 <a> 标签的默认跳转行为
            const email = emailButton.getAttribute('data-email');
            navigator.clipboard.writeText(email).then(() => {
                const span = emailButton.querySelector('span');
                if (span) {
                    span.textContent = '已复制!';
                    // 2秒后恢复原来的文本
                    setTimeout(() => {
                        span.textContent = originalText;
                    }, 2000);
                }
            }).catch(err => {
                console.error('复制邮箱失败: ', err);
                // 可以在这里给用户一个失败的提示
            });
        });
    }
});

const CACHE_KEY = 'github_projects_cache';
const TIMESTAMP_KEY = 'github_projects_timestamp';
const CACHE_DURATION_MS = 3600 * 1000; // 1 小时

let allFetchedRepos = []; // 全局变量，用作“唯一数据源”
const projectsContainer = document.getElementById('projects-container');
const filtersContainer = document.getElementById('project-filters');

async function fetchGitHubProjects() {
    const cachedTimestamp = localStorage.getItem(TIMESTAMP_KEY);
    const cachedData = localStorage.getItem(CACHE_KEY);

    // 1. 检查是否存在有效缓存
    if (cachedTimestamp && cachedData && (new Date().getTime() - cachedTimestamp < CACHE_DURATION_MS)) {
        console.log('从缓存加载 GitHub 项目。');
        allFetchedRepos = JSON.parse(cachedData);
        setupFiltersAndRender();
        return;
    }

    console.log('从本地和API获取新的 GitHub 项目。');
    
    try {
        const [userReposRes, orgRepoRes] = await Promise.all([
            fetch('data/repos.json'),
            fetch('data/org-repo.json')
        ]);

        if (!userReposRes.ok) throw new Error(`加载本地 repos.json 失败: ${userReposRes.status}`);

        const userRepos = await userReposRes.json();
        let combinedRepos = [...userRepos];

        if (orgRepoRes.ok) {
            const orgRepo = await orgRepoRes.json();
            combinedRepos.push(orgRepo);
        } else {
            console.warn(`无法获取组织仓库，状态: ${orgRepoRes.status}。`);
        }

        const uniqueRepos = Array.from(new Map(combinedRepos.map(repo => [repo.id, repo])).values());
        allFetchedRepos = uniqueRepos
            .filter(repo => !repo.fork && repo.description)
            .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

        localStorage.setItem(CACHE_KEY, JSON.stringify(allFetchedRepos));
        localStorage.setItem(TIMESTAMP_KEY, new Date().getTime());

        setupFiltersAndRender();

    } catch (error) {
        console.error('获取 GitHub 项目失败:', error);
        if (cachedData) {
            console.warn('API 获取失败，回退到使用旧缓存。');
            allFetchedRepos = JSON.parse(cachedData);
            setupFiltersAndRender();
        } else {
            projectsContainer.innerHTML = '<p>无法加载 GitHub 项目。请稍后刷新重试。</p>';
        }
    }
}

function setupFiltersAndRender() {
    const languages = ['All', ...new Set(allFetchedRepos.map(repo => repo.language).filter(Boolean))];
    
    filtersContainer.innerHTML = languages.map(lang => 
        `<button class="filter-btn ${lang === 'All' ? 'active' : ''}" data-lang="${lang}">${lang}</button>`
    ).join('');

    filtersContainer.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') return;

        const selectedLang = e.target.dataset.lang;

        filtersContainer.querySelector('.active').classList.remove('active');
        e.target.classList.add('active');

        const filteredRepos = selectedLang === 'All' 
            ? allFetchedRepos 
            : allFetchedRepos.filter(repo => repo.language === selectedLang);
        
        renderProjects(filteredRepos);
    });

    renderProjects(allFetchedRepos);
    renderLanguageChart(); // 新增调用
}

const REPOS_TO_SHOW_INITIALLY = 4;

function renderProjects(repos) {
    const showMoreContainer = document.getElementById('show-more-container');
    projectsContainer.innerHTML = ''; // 清空现有项目
    showMoreContainer.innerHTML = ''; // 清空“显示更多”按钮

    if (!repos || repos.length === 0) {
        projectsContainer.innerHTML = '<p>没有找到符合条件的项目。</p>';
        return;
    }

    const projectCards = repos.map((repo, index) => {
        let iconClass = 'fa-code';
        if (repo.name.toLowerCase().includes('immunelink')) iconClass = 'fa-gamepad';
        else if (repo.name.toLowerCase().includes('counterstrikegrenades')) iconClass = 'fa-cube';

        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-aos', 'fade-up');
        if (index >= REPOS_TO_SHOW_INITIALLY) {
            card.classList.add('hidden');
        }

        card.innerHTML = `
            <div>
                <h3><i class="fas ${iconClass}"></i> ${repo.name}</h3>
                <p>${repo.description}</p>
            </div>
            <div class="project-meta">
                ${repo.language ? `<span class="language">${repo.language}</span>` : ''}
                <span class="stars"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                <span class="forks"><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
            </div>
            <div class="project-links-container">
                <a href="${repo.html_url}" target="_blank" class="project-link">查看项目</a>
                ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="project-link">在线游玩</a>` : ''}
            </div>
        `;
        return card;
    });

    projectCards.forEach(card => projectsContainer.appendChild(card));

    if (repos.length > REPOS_TO_SHOW_INITIALLY) {
        const showMoreBtn = document.createElement('button');
        showMoreBtn.textContent = '显示更多';
        showMoreBtn.classList.add('show-more-btn');
        showMoreContainer.appendChild(showMoreBtn);

        showMoreBtn.addEventListener('click', () => {
            const hiddenCards = projectsContainer.querySelectorAll('.project-card.hidden');
            
            if (showMoreBtn.textContent === '显示更多') {
                hiddenCards.forEach(card => card.classList.remove('hidden'));
                showMoreBtn.textContent = '收起';
            } else { 
                projectCards.forEach((card, index) => {
                    if (index >= REPOS_TO_SHOW_INITIALLY) {
                        card.classList.add('hidden');
                    }
                });
                showMoreBtn.textContent = '显示更多';
            }
            AOS.refresh();
        });
    }
}

let languageChartInstance = null;

// 设置 Chart.js 全局字体, 让图表字体与网站其他部分保持一致
Chart.defaults.font.family = "'Microsoft YaHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif";


// 设置 Chart.js 全局字体
Chart.defaults.font.family = "'Microsoft YaHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif";

function renderLanguageChart() {
    const ctx = document.getElementById('language-chart');
    if (!ctx) return;

    const langCount = allFetchedRepos.reduce((acc, repo) => {
        if (repo.language) {
            acc[repo.language] = (acc[repo.language] || 0) + 1;
        }
        return acc;
    }, {});

    const sortedLangs = Object.entries(langCount).sort((a, b) => b[1] - a[1]);
    const labels = sortedLangs.map(entry => entry[0]);
    const data = sortedLangs.map(entry => entry[1]);

    if (languageChartInstance) {
        languageChartInstance.destroy();
    }

    const isDarkMode = document.documentElement.classList.contains('dark-mode');
    const legendColor = isDarkMode ? '#e0e0e0' : '#4a4a4a';
    // 动态获取背景色以用作边框，产生“浮动”效果
    const sectionBgColor = getComputedStyle(document.documentElement).getPropertyValue('--section-bg').trim();

    // 新的蓝色主题调色板
    const colorPalette = [
        '#66CCFF', '#88D6FF', '#AADDFF', '#44BBEE', '#22AADD',
        '#B2E1FF', '#0099CC', '#77C3E1', '#50B3D9', '#9ED8F0'
    ];

    languageChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: '项目语言分布',
                data: data,
                backgroundColor: colorPalette,
                borderColor: sectionBgColor,
                borderWidth: 4,
                hoverOffset: 8,
                hoverBorderColor: sectionBgColor
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%', // 使环形更细
            plugins: {
                legend: {
                    position: 'bottom', // 图例置于底部
                    labels: {
                        color: legendColor,
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'rectRounded'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    padding: 10,
                    cornerRadius: 4
                }
            }
        }
    });
}

