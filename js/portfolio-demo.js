const PORTFOLIO_THEMES = new Set(['blue', 'immune', 'red', 'ink']);

function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
}

function createMetaRow(label, values, separator) {
    const row = document.createElement('div');
    const term = createElement('dt', '', label);
    const description = createElement(
        'dd',
        '',
        Array.isArray(values) ? values.join(separator) : String(values || '')
    );
    row.append(term, description);
    return row;
}

function createProjectCase(project, index) {
    const theme = PORTFOLIO_THEMES.has(project.theme) ? project.theme : 'blue';
    const safeId = String(project.id || `case-${index + 1}`).replace(/[^a-z0-9_-]/gi, '-');
    const article = createElement('article', `case case--${theme} reveal`);
    article.id = `project-${safeId}`;

    if (index % 2 === 1) article.classList.add('case--reverse');

    const media = createElement('div', 'case-media');
    const image = document.createElement('img');
    image.src = project.image;
    image.alt = project.imageAlt || `${project.title} 项目图片`;
    if (index > 0) image.loading = 'lazy';
    media.append(image, createElement('span', 'case-stamp', project.badge || 'PROJECT'));

    const body = createElement('div', 'case-body');
    const caseNumber = String(index + 1).padStart(2, '0');
    const caseIndex = createElement('div', 'case-index', `CASE / ${caseNumber}`);
    const title = createElement('h3', '', project.title || 'Untitled Project');
    if ((project.title || '').length >= 12) title.classList.add('case-title--long');
    const type = createElement('p', 'case-type', project.type || '');
    const summary = createElement('p', 'case-summary', project.summary || '');

    const meta = createElement('dl', 'case-meta');
    meta.append(
        createMetaRow('负责', project.responsibility, ' / '),
        createMetaRow('技术', project.tech, ' · ')
    );

    const links = createElement('div', 'case-links');
    (Array.isArray(project.links) ? project.links : []).forEach(linkData => {
        if (!linkData?.url || !linkData?.label) return;
        try {
            const url = new URL(linkData.url, window.location.href);
            if (!['http:', 'https:'].includes(url.protocol)) return;
            const link = createElement('a', '', `${linkData.label} ↗`);
            link.href = url.href;
            link.target = '_blank';
            link.rel = 'noreferrer';
            links.appendChild(link);
        } catch (error) {
            console.warn('忽略无效的项目链接:', linkData.url, error);
        }
    });

    body.append(caseIndex, title, type, summary, meta, links);
    article.append(media, body);
    return article;
}

async function loadPortfolio() {
    const projectList = document.getElementById('project-list');
    const projectCount = document.querySelector('[data-project-count]');
    if (!projectList) return;

    try {
        const response = await fetch('data/portfolio.json', { cache: 'no-cache' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('portfolio.json 的根节点必须是数组');

        const projects = data
            .filter(project => project && project.published !== false)
            .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

        const fragment = document.createDocumentFragment();
        projects.forEach((project, index) => {
            fragment.appendChild(createProjectCase(project, index));
        });

        projectList.replaceChildren(fragment);
        if (projectCount) {
            projectCount.textContent = `${String(projects.length).padStart(2, '0')} CASE FILES`;
        }
    } catch (error) {
        console.error('读取作品集数据失败:', error);
        projectList.replaceChildren(
            createElement('p', 'project-error', '项目数据读取失败，请稍后刷新重试。')
        );
        if (projectCount) projectCount.textContent = '00 CASE FILES';
    }
}

function initializeRevealAnimations(reducedMotion) {
    const revealItems = document.querySelectorAll('.reveal');

    if (reducedMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach(item => item.classList.add('is-visible'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });

    revealItems.forEach(item => revealObserver.observe(item));
}

document.addEventListener('DOMContentLoaded', async () => {
    const year = document.querySelector('[data-current-year]');
    if (year) year.textContent = new Date().getFullYear();

    await loadPortfolio();

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    initializeRevealAnimations(reducedMotion);

    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.site-nav a');

    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                navLinks.forEach(link => {
                    link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
                });
            });
        }, { rootMargin: '-30% 0px -60% 0px' });

        sections.forEach(section => sectionObserver.observe(section));
    }

    const copyButton = document.querySelector('[data-copy-email]');
    if (copyButton) {
        const originalText = copyButton.textContent;
        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(copyButton.dataset.email);
                copyButton.textContent = '已复制 ✓';
            } catch {
                copyButton.textContent = '复制失败，请手动复制';
            }
            window.setTimeout(() => { copyButton.textContent = originalText; }, 1800);
        });
    }

    const stage = document.querySelector('[data-tilt]');
    if (stage && !reducedMotion && window.matchMedia('(pointer: fine)').matches) {
        stage.addEventListener('pointermove', event => {
            const bounds = stage.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;
            stage.style.transform = `perspective(900px) rotateX(${y * -2.5}deg) rotateY(${x * 2.5}deg)`;
        });
        stage.addEventListener('pointerleave', () => { stage.style.transform = ''; });
    }

    const easterEgg = document.querySelector('[data-easter-egg]');
    const easterTriggers = document.querySelectorAll('[data-easter-trigger]');
    const easterCloseButtons = document.querySelectorAll('[data-easter-close]');
    let lastFocusedElement = null;

    const openEasterEgg = () => {
        if (!easterEgg || easterEgg.classList.contains('is-open')) return;
        lastFocusedElement = document.activeElement;
        easterEgg.classList.add('is-open');
        easterEgg.setAttribute('aria-hidden', 'false');
        document.body.classList.add('signal-open');
        easterTriggers.forEach(trigger => trigger.setAttribute('aria-expanded', 'true'));
        easterEgg.querySelector('[data-easter-close]')?.focus();
    };

    const closeEasterEgg = () => {
        if (!easterEgg || !easterEgg.classList.contains('is-open')) return;
        easterEgg.classList.remove('is-open');
        easterEgg.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('signal-open');
        easterTriggers.forEach(trigger => trigger.setAttribute('aria-expanded', 'false'));
        lastFocusedElement?.focus();
    };

    easterTriggers.forEach(trigger => trigger.addEventListener('click', openEasterEgg));
    easterCloseButtons.forEach(button => button.addEventListener('click', closeEasterEgg));

    if (window.location.hash.toLowerCase() === '#66ccff') {
        openEasterEgg();
    }

    let secretBuffer = '';
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeEasterEgg();
            return;
        }
        if (event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) return;
        secretBuffer = `${secretBuffer}${event.key.toLowerCase()}`.slice(-6);
        if (secretBuffer === '66ccff') openEasterEgg();
    });
});
