document.addEventListener('DOMContentLoaded', () => {
    const year = document.querySelector('[data-current-year]');
    if (year) year.textContent = new Date().getFullYear();

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealItems = document.querySelectorAll('.reveal');

    if (reducedMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach(item => item.classList.add('is-visible'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12 });

        revealItems.forEach(item => revealObserver.observe(item));
    }

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
});
