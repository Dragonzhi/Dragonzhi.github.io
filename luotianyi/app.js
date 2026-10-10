/* 洛天依歌单 · 精修编年目录交互脚本
   包含即时防抖搜索、快捷分类过滤、左侧年份刻度轨实时匹配计数联动、以及基于 IntersectionObserver 的滚动目录高亮。
*/

(function() {
    'use strict';

    var searchInput = document.getElementById('searchInput');
    var searchClear = document.getElementById('searchClear');
    var searchStatus = document.getElementById('searchStatus');
    var chipBtns = Array.prototype.slice.call(document.querySelectorAll('.chip-btn'));
    var railItems = Array.prototype.slice.call(document.querySelectorAll('.rail-item'));
    var yearSections = Array.prototype.slice.call(document.querySelectorAll('.year-section'));
    var emptyNotice = document.getElementById('emptyNotice');
    var emptyReset = document.getElementById('emptyReset');

    var currentFilter = 'all'; // all, legend, hall, time

    // 曲目总数从 DOM 统计，数据更新后无需改脚本
    var totalSongs = document.querySelectorAll('.song-row').length;

    function escapeHtml(s) {
        return s.replace(/[&<>"]/g, function(c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
        });
    }

    function filterRow(li, keyword, filter) {
        var title = li.getAttribute('data-title') || '';
        var isLegend = li.getAttribute('data-legend') === 'true';
        var isHall = li.getAttribute('data-hall') === 'true';
        var hasTime = li.getAttribute('data-has-time') === 'true';

        // Tag Filter
        if (filter === 'legend' && !isLegend) { li.hidden = true; return false; }
        if (filter === 'hall' && !isHall) { li.hidden = true; return false; }
        if (filter === 'time' && !hasTime) { li.hidden = true; return false; }

        var titleSpan = li.querySelector('.song-title');

        // Keyword filter
        if (!keyword) {
            titleSpan.textContent = title;
            li.hidden = false;
            return true;
        }

        // Special tag keywords
        if (keyword === '传说' || keyword === '传说曲') {
            titleSpan.textContent = title;
            li.hidden = !isLegend;
            return isLegend;
        }
        if (keyword === '殿堂' || keyword === '殿堂曲') {
            titleSpan.textContent = title;
            li.hidden = !isHall;
            return isHall;
        }

        var idx = title.toLowerCase().indexOf(keyword);
        if (idx < 0) {
            li.hidden = true;
            return false;
        }

        titleSpan.innerHTML =
            escapeHtml(title.slice(0, idx)) +
            '<mark>' + escapeHtml(title.slice(idx, idx + keyword.length)) + '</mark>' +
            escapeHtml(title.slice(idx + keyword.length));
        li.hidden = false;
        return true;
    }

    function applyFilters() {
        var keyword = (searchInput.value || '').trim().toLowerCase();
        searchClear.hidden = !keyword;

        var totalShown = 0;

        yearSections.forEach(function(sec) {
            var year = sec.getAttribute('data-year');
            var railItem = document.getElementById('rail-' + year);
            var railCount = railItem ? railItem.querySelector('.rail-count') : null;
            var railMatch = railItem ? railItem.querySelector('.rail-match-count') : null;

            var rows = Array.prototype.slice.call(sec.querySelectorAll('.song-row'));
            var yearShown = 0;

            rows.forEach(function(li) {
                if (filterRow(li, keyword, currentFilter)) {
                    yearShown++;
                }
            });

            sec.hidden = (yearShown === 0);
            totalShown += yearShown;

            if (railItem) {
                if (yearShown === 0) {
                    railItem.classList.add('is-empty');
                } else {
                    railItem.classList.remove('is-empty');
                }

                if (keyword || currentFilter !== 'all') {
                    if (railMatch) {
                        railMatch.textContent = yearShown;
                        railMatch.hidden = false;
                    }
                    if (railCount) railCount.hidden = true;
                } else {
                    if (railMatch) railMatch.hidden = true;
                    if (railCount) railCount.hidden = false;
                }
            }
        });

        if (emptyNotice) {
            emptyNotice.hidden = (totalShown > 0);
        }

        if (searchStatus) {
            if (!keyword && currentFilter === 'all') {
                searchStatus.textContent = '当前显示全部 ' + totalSongs + ' 首';
            } else {
                searchStatus.textContent = '匹配到 ' + totalShown + ' 首曲目';
            }
        }
    }

    var timer = null;
    searchInput.addEventListener('input', function() {
        clearTimeout(timer);
        timer = setTimeout(applyFilters, 40);
    });

    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchInput.value = '';
            applyFilters();
        }
    });

    searchClear.addEventListener('click', function() {
        searchInput.value = '';
        applyFilters();
        searchInput.focus();
    });

    if (emptyReset) {
        emptyReset.addEventListener('click', function() {
            searchInput.value = '';
            currentFilter = 'all';
            chipBtns.forEach(function(btn) {
                btn.classList.toggle('is-active', btn.getAttribute('data-filter') === 'all');
            });
            applyFilters();
        });
    }

    chipBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            chipBtns.forEach(function(b) { b.classList.remove('is-active'); });
            btn.classList.add('is-active');
            currentFilter = btn.getAttribute('data-filter');
            applyFilters();
        });
    });

    // IntersectionObserver 高亮左侧年份轨
    if ('IntersectionObserver' in window && yearSections.length) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var year = entry.target.getAttribute('data-year');
                    railItems.forEach(function(item) {
                        var match = (item.getAttribute('data-year') === year);
                        item.classList.toggle('is-active', match);
                        if (match) {
                            item.setAttribute('aria-current', 'true');
                        } else {
                            item.removeAttribute('aria-current');
                        }
                    });
                }
            });
        }, { rootMargin: '-10% 0px -70% 0px', threshold: 0 });

        yearSections.forEach(function(sec) {
            observer.observe(sec);
        });
    }

})();