/*
 * OmniGrid in-app layer.
 *
 * 1. Routes every OmniGrid button and link inside the app: local pages open in
 *    the in-app viewer; external sites open in the viewer with an "open in new
 *    tab" fallback; in-page anchors keep scrolling as before.
 * 2. Renders the 9 Sector Terminals in the existing #vault-frame, using the
 *    local page where one exists and a generated panel where it does not.
 * 3. Injects the global snapshot (omnigrid-pulse.json) on hover over the pulse
 *    noodle. The noodle's markup, CSS and animation are never touched: the card
 *    lives in its own fixed layer.
 */
(function () {
    'use strict';

    var DATA_URL = 'omnigrid-pulse.json';

    // External or broken targets -> in-app page. Keys are normalised (no scheme, no trailing slash).
    var ROUTES = {
        'faa.zone/omnigrid.html': 'omnigrid.html',
        'faa.zone': 'index.html',
        'fruitful.faa.zone': 'frontend/index.html',
        'vaultmesh.faa.zone/index.html': 'checkout.html',
        'baobab.faa.zone': 'baobab.html',
        'admin.faa.zone': 'seedwave_admin.html',
        'faa.zone/dashboard.html': 'dashboard.html',
        'faa.zone/legal/index.html': 'https://faa.zone/legal/index.html',
        '#admin-portal-section': 'seedwave_admin.html'
    };

    // Sector terminals: local page, or a station from the global snapshot.
    var TERMINALS = {
        'vault-master.html': { station: 'guardian', title: '🦍 VaultMaster Terminal' },
        'cube-lattice.html': { station: 'roots', title: '🧱 Cube Lattice GPT' },
        'global-view.html': { page: 'dashboard.html' },
        'freight-ops.html': { station: 'branches', title: '🚚 Freight Ops GPT' },
        'loop-watch.html': { station: 'seed', title: '♻️ Loop Watch GPT' },
        'seedwave.html': { page: 'seedwave_admin.html' },
        'distribution.html': { station: 'trunk', title: '📦 Distribution GPT' },
        'signal.html': { station: 'flow', title: '🔐 Signal GPT' },
        'faa-brands.html': { page: 'omnigrid_zone.html' }
    };

    // Sites that refuse to be shown inside another page: open them in a new tab.
    var NO_FRAME = /(^|\.)(github\.com|paypal\.com|google\.com|spotify\.com|facebook\.com|linkedin\.com|x\.com|twitter\.com)$/i;

    // True when this page is itself shown inside the OmniGrid viewer or a terminal frame.
    var IN_FRAME = (function () { try { return window.self !== window.top; } catch (e) { return true; } })();

    var STATUS = { green: '#30d158', amber: '#ff9f0a', red: '#ff453a' };

    var dataPromise = null;
    function loadData() {
        if (!dataPromise) {
            dataPromise = fetch(DATA_URL, { cache: 'no-cache' })
                .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
                .catch(function () { dataPromise = null; return null; });
        }
        return dataPromise;
    }

    function esc(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function isDark() {
        return document.body.classList.contains('dark-mode') || document.body.classList.contains('hyper-mode') ||
            (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches &&
             !document.body.classList.contains('light-mode'));
    }

    function normalise(href) {
        return href.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '');
    }

    function isLocalPage(href) {
        return !/^([a-z]+:)?\/\//i.test(href) && !/^[a-z]+:/i.test(href) &&
            href.charAt(0) !== '#' && !/\.(css|js|json|ico|png|jpe?g|svg|webp|pdf|zip)(\?|#|$)/i.test(href);
    }

    // ---------- styles (card + viewer only) ----------
    var css = document.createElement('style');
    css.textContent = [
        '.og-card{position:fixed;z-index:10000;width:280px;padding:14px 16px;border-radius:14px;',
        'font:13px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;',
        'box-shadow:0 12px 32px rgba(0,0,0,.18);opacity:0;transform:translateY(-4px);',
        'transition:opacity .15s ease,transform .15s ease;pointer-events:none}',
        '.og-card.on{opacity:1;transform:none;pointer-events:auto}',
        '.og-card{background:#fff;color:#1d1d1f;border:1px solid rgba(0,0,0,.08)}',
        '.og-card.dark{background:#1c1c1e;color:#f5f5f7;border-color:rgba(255,255,255,.12)}',
        '.og-card h4{margin:0 0 2px;font-size:12px;font-weight:600;letter-spacing:.02em;opacity:.7}',
        '.og-card .og-head{font-size:15px;font-weight:600;margin:0 0 8px;display:flex;gap:8px;align-items:baseline}',
        '.og-card .og-led{flex:none;width:8px;height:8px;border-radius:50%;transform:translateY(-1px)}',
        '.og-card ul{margin:0 0 8px;padding-left:16px}.og-card li{margin:1px 0}',
        '.og-card .og-foot{display:flex;justify-content:space-between;font-size:11px;opacity:.65}',
        '.og-card a{color:#0071e3;text-decoration:none;font-weight:600}',
        '.og-card.dark a{color:#64a8ff}',
        '.og-view{position:fixed;inset:0;z-index:10001;display:none;flex-direction:column;background:rgba(0,0,0,.55)}',
        '.og-view.on{display:flex}',
        '.og-bar{display:flex;align-items:center;gap:10px;padding:10px 16px;background:#111;color:#f5f5f7;',
        'font:14px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}',
        '.og-bar .og-title{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}',
        '.og-bar button,.og-bar a{background:#2c2c2e;color:#f5f5f7;border:0;border-radius:8px;padding:6px 12px;',
        'font:inherit;cursor:pointer;text-decoration:none;white-space:nowrap}',
        '.og-view iframe{flex:1;width:100%;border:0;background:#fff}',
        '@media (max-width:600px){.og-bar .og-ext-label{display:none}}'
    ].join('');
    document.head.appendChild(css);

    // ---------- in-app viewer ----------
    var view = document.createElement('div');
    view.className = 'og-view';
    view.setAttribute('role', 'dialog');
    view.setAttribute('aria-modal', 'true');
    view.innerHTML = '<div class="og-bar"><button type="button" data-og="close" aria-label="Back to OmniGrid">← OmniGrid</button>' +
        '<span class="og-title"></span><a class="og-ext" target="_blank" rel="noopener">↗<span class="og-ext-label"> Open in new tab</span></a></div>' +
        '<iframe title="OmniGrid view" referrerpolicy="no-referrer-when-downgrade"></iframe>';
    var viewFrame = view.querySelector('iframe');
    var viewTitle = view.querySelector('.og-title');
    var viewExt = view.querySelector('.og-ext');

    function missingPanel(url, title) {
        loadData().then(function (data) {
            viewFrame.removeAttribute('src');
            viewFrame.srcdoc = stationPanel(title || url, 'flow', data,
                '<p class="h">' + esc(url) + ' is not built yet. Global flow below.</p>');
        });
    }

    function openView(url, title, push) {
        viewFrame.removeAttribute('srcdoc');
        viewFrame.src = url;
        if (!/^([a-z]+:)?\/\//i.test(url)) {
            fetch(url, { method: 'HEAD' }).then(function (r) {
                if (r.status === 404 && viewFrame.getAttribute('src') === url) missingPanel(url, title);
            }).catch(function () {});
        }
        viewTitle.textContent = title || url;
        viewExt.href = url;
        view.classList.add('on');
        document.documentElement.style.overflow = 'hidden';
        if (push !== false) {
            try { history.pushState({ og: url, title: title }, '', '#app=' + encodeURIComponent(url)); } catch (e) {}
        }
    }

    function closeView() {
        if (!view.classList.contains('on')) return;
        view.classList.remove('on');
        viewFrame.removeAttribute('srcdoc');
        viewFrame.src = 'about:blank';
        document.documentElement.style.overflow = '';
        if (/^#app=/.test(location.hash)) {
            try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
        }
    }

    view.addEventListener('click', function (e) {
        if (e.target.closest('[data-og="close"]')) closeView();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeView(); });
    window.addEventListener('popstate', function (e) {
        if (e.state && e.state.og) openView(e.state.og, e.state.title, false);
        else closeView();
    });

    // ---------- routing ----------
    var PAGE = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

    // A route only applies when it is needed on this page: an anchor route only
    // when the anchor is missing here, and a link to the current page scrolls to top.
    function routeFor(href) {
        if (!href || href === '#') return null;
        var r = ROUTES[href] || ROUTES[normalise(href)];
        if (!r) return null;
        if (href.charAt(0) === '#' && document.querySelector(href)) return null;
        if (r.toLowerCase() === PAGE) return '#top';
        return r;
    }

    function resolve(href) {
        if (!href || href === '#') return null;
        return routeFor(href) || href;
    }

    function labelOf(a) {
        return (a.textContent || '').replace(/\s+/g, ' ').trim() || a.getAttribute('href');
    }

    function samePage(target) {
        try { return new URL(target, location.href).pathname === location.pathname; } catch (e) { return false; }
    }

    function hostOf(url) {
        var m = url.match(/^(?:https?:)?\/\/([^\/?#]+)/i);
        return m ? m[1].toLowerCase() : '';
    }

    function route(target, label) {
        if (target === '#top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return true; }
        if (target.charAt(0) === '#') {
            var el = document.querySelector(target);
            if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return true; }
            return false;
        }
        var host = hostOf(target);
        if (host && NO_FRAME.test(host)) { window.open(target, '_blank', 'noopener'); return true; }
        if (IN_FRAME) {
            // Already inside the app: local pages navigate this frame; external sites go to the top viewer.
            if (!host) { location.assign(target); return true; }
            try { if (window.top.__ogOpenView) { window.top.__ogOpenView(target, label); return true; } } catch (e) {}
            window.open(target, '_blank', 'noopener');
            return true;
        }
        openView(target, label);
        return true;
    }

    function onClick(e, capture) {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var a = e.target.closest('a[href]');
        if (!a || view.contains(a) || a.closest('.og-card')) return;
        var href = a.getAttribute('href');
        var routed = routeFor(href);
        // Capture phase: explicit routes win over the page's own handlers.
        if (capture) {
            if (routed && route(routed, labelOf(a))) { e.preventDefault(); e.stopPropagation(); }
            return;
        }
        if (e.defaultPrevented || routed) return;
        var target = resolve(href);
        if (!target || target.charAt(0) === '#') return; // plain anchors: page behaviour
        var external = /^([a-z]+:)?\/\//i.test(target);
        if (!external && !isLocalPage(target)) return;
        if (!external && !/#./.test(target) && samePage(target)) {
            e.preventDefault();
            route('#top');
            return;
        }
        if (route(target, labelOf(a))) e.preventDefault();
    }
    document.addEventListener('click', function (e) { onClick(e, true); }, true);
    document.addEventListener('click', function (e) { onClick(e, false); }, false);

    // ---------- sector terminals ----------
    function stationPanel(title, station, data, intro) {
        var dark = isDark();
        var bg = dark ? '#0d0d0d' : '#f5f5f7', fg = dark ? '#f5f5f7' : '#1d1d1f', card = dark ? '#1c1c1e' : '#fff';
        var body;
        if (!data) {
            body = '<p>Global snapshot unavailable right now.</p>';
        } else if (station === 'flow') {
            body = '<p class="h">Global flow · ' + data.stations.length + ' stations</p><div class="grid">' +
                data.stations.map(function (s) {
                    return '<div class="c"><span class="led" style="background:' + (STATUS[s.status] || '#999') + '"></span>' +
                        '<b>' + esc(s.title) + '</b><br>' + esc(s.headline) + '</div>';
                }).join('') + '</div>';
        } else {
            var s = data.stations.filter(function (x) { return x.id === station; })[0];
            body = s ? '<p class="h"><span class="led" style="background:' + (STATUS[s.status] || '#999') + '"></span>' +
                esc(s.title) + '</p><p class="big">' + esc(s.headline) + '</p><ul>' +
                s.lines.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>'
                : '<p>No data for this terminal yet.</p>';
        }
        var stamp = data ? 'Snapshot ' + esc(data.generated_at.replace('T', ' ').replace('Z', ' UTC')) : '';
        return '<!DOCTYPE html><html><head><meta charset="utf-8"><style>' +
            'body{margin:0;padding:40px;background:' + bg + ';color:' + fg + ';font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}' +
            'h1{font-size:28px;margin:0 0 24px}.h{font-weight:600;opacity:.75;display:flex;align-items:center;gap:8px}' +
            '.big{font-size:24px;font-weight:700;margin:4px 0 16px}ul{padding-left:20px}li{margin:4px 0}' +
            '.led{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:6px}' +
            '.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}' +
            '.c{background:' + card + ';border-radius:12px;padding:14px}.t{margin-top:32px;font-size:12px;opacity:.55}' +
            '</style></head><body><h1>' + esc(title) + '</h1>' + (intro || '') + body + '<p class="t">' + stamp + '</p></body></html>';
    }

    function markActive(name) {
        document.querySelectorAll('.terminal-btn').forEach(function (btn) {
            var oc = btn.getAttribute('onclick') || '';
            btn.classList.toggle('ring', oc.indexOf("'" + name + "'") !== -1);
        });
    }

    function renderTerminal(name) {
        var frame = document.getElementById('vault-frame');
        if (!frame) return;
        var t = TERMINALS[name];
        markActive(name);
        if (!t) { frame.removeAttribute('srcdoc'); frame.src = name; return; }
        if (t.page) { frame.removeAttribute('srcdoc'); frame.src = t.page; return; }
        loadData().then(function (data) {
            frame.removeAttribute('src');
            frame.srcdoc = stationPanel(t.title, t.station, data);
        });
    }
    window.loadTerminal = renderTerminal;

    // ---------- pulse noodle hover (global injection) ----------
    var card = document.createElement('div');
    card.className = 'og-card';
    card.setAttribute('role', 'tooltip');
    var hideTimer = null;

    function place(anchor) {
        var r = anchor.getBoundingClientRect();
        var w = 280, gap = 14;
        var left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), window.innerWidth - w - 8);
        card.style.left = left + 'px';
        card.style.top = (r.bottom + gap) + 'px';
    }

    function show(anchor, html) {
        clearTimeout(hideTimer);
        card.innerHTML = html;
        card.classList.toggle('dark', isDark());
        place(anchor);
        card.classList.add('on');
    }

    function hideSoon() {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(function () { card.classList.remove('on'); }, 150);
    }

    function stationHtml(s, data) {
        return '<h4>' + esc(s.title) + '</h4>' +
            '<div class="og-head"><span class="og-led" style="background:' + (STATUS[s.status] || '#999') + '"></span>' + esc(s.headline) + '</div>' +
            '<ul>' + s.lines.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>' +
            '<div class="og-foot"><span>' + esc(data.generated_at.slice(0, 10)) + '</span><a href="' + esc(s.link) + '">View more →</a></div>';
    }

    function flowHtml(data) {
        var f = data.flow;
        return '<h4>OmniGrid™ global flow</h4>' +
            '<div class="og-head">' + data.stations.length + ' stations live</div>' +
            '<ul><li><span class="og-led" style="display:inline-block;background:' + STATUS.green + '"></span> ' + f.green + ' green</li>' +
            '<li><span class="og-led" style="display:inline-block;background:' + STATUS.amber + '"></span> ' + f.amber + ' amber</li>' +
            '<li><span class="og-led" style="display:inline-block;background:' + STATUS.red + '"></span> ' + f.red + ' red</li></ul>' +
            '<div class="og-foot"><span>' + esc(data.generated_at.slice(0, 10)) + '</span><span>Hover a dot for detail</span></div>';
    }

    function wireNoodle() {
        var rope = document.querySelector('.pulse-grid-noodle-rope');
        if (!rope) return;
        var dots = Array.prototype.slice.call(rope.querySelectorAll('.noodle-dot'));

        // Stations follow the flow left to right, whatever the dot class names are.
        function orderOf(dot) {
            var sorted = dots.slice().sort(function (a, b) {
                return (parseFloat(getComputedStyle(a).left) || 0) - (parseFloat(getComputedStyle(b).left) || 0);
            });
            return sorted.indexOf(dot);
        }

        dots.forEach(function (dot) {
            dot.addEventListener('mouseenter', function (e) {
                e.stopPropagation();
                loadData().then(function (data) {
                    if (!data) return;
                    var s = data.stations[orderOf(dot)];
                    if (s) show(dot, stationHtml(s, data));
                });
            });
        });

        rope.addEventListener('mouseenter', function () {
            loadData().then(function (data) { if (data && !card.classList.contains('on')) show(rope, flowHtml(data)); });
        });
        rope.addEventListener('mouseleave', hideSoon);
        card.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
        card.addEventListener('mouseleave', hideSoon);
        window.addEventListener('scroll', function () { card.classList.remove('on'); }, { passive: true });
    }

    function init() {
        window.loadTerminal = renderTerminal;
        if (!IN_FRAME) window.__ogOpenView = openView;
        document.body.appendChild(view);
        document.body.appendChild(card);
        wireNoodle();
        // The default terminal file does not exist; render it in-app.
        var frame = document.getElementById('vault-frame');
        if (frame && TERMINALS[frame.getAttribute('src')]) renderTerminal(frame.getAttribute('src'));
        // Deep link: #app=<url>
        var m = location.hash.match(/^#app=(.+)$/);
        if (m) {
            var url = decodeURIComponent(m[1]);
            try { history.replaceState({ og: url, title: url }, '', location.href); } catch (e) {}
            openView(url, url, false);
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
