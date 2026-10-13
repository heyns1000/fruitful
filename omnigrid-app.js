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

    // Resolve the data next to this script, so pages in sub-folders find it too.
    var SCRIPT_SRC = (document.currentScript && document.currentScript.src) || location.href;
    var DATA_URL = new URL('omnigrid-pulse.json', SCRIPT_SRC).href;

    // External or broken targets -> in-app page. Keys are normalised (no scheme, no trailing slash).
    var ROUTES = {
        'faa.zone/omnigrid.html': 'omnigrid.html',
        'faa.zone': 'index.html',
        'fruitful.faa.zone': 'ecosystem.html',
        'fruitful.store': 'store.html', 'www.fruitful.store': 'store.html',
        'vaultmesh.faa.zone/index.html': 'checkout.html',
        'baobab.faa.zone': 'baobab.html',
        'admin.faa.zone': 'seedwave_admin.html',
        'faa.zone/dashboard.html': 'dashboard.html',
        'faa.zone/legal/index.html': 'legal-privacy.html',
        '#admin-portal-section': 'seedwave_admin.html',
        '/contact.html': 'contact-support.html',
        '/global-checkout.html': 'checkout.html'
    };

    // Pages that concept pages link to by another name.
    var PAGE_ALIASES = { 'owner-login.html': 'faa-owner.html', 'hardware-login.html': 'faa-hardware.html',
        'distributor-login.html': 'faa-distributor.html', 'contact.html': 'contact-support.html', 'global-checkout.html': 'checkout.html',
        'ci-guide.html': 'banimal-connector.html', 'connector-preview.html': 'banimal-connector.html',
        // faa.zone and portal.faa.zone are offline (Vercel paused, portal host not answering); their pages live here
        'payroll.html': 'sectors/payroll/overview.html', 'contact-us.html': 'contact-support.html', 'contact': 'contact-support.html',
        'support.html': 'contact-support.html', 'about-us.html': 'about-faa.html', 'securesign.html': 'compliance.html',
        'hiring-homepage.html': 'contact-support.html', 'vault-access.html': 'vault-master.html', 'treaty.html': 'treaty-grid.html',
        // footer.global.repo.seedwave.faa.zone, faa.faa.zone and seedwave.faa.zone pages
        'privacy.html': 'privacy-policy.html', 'terms.html': 'terms-of-service.html', 'copyright.html': 'legal-privacy.html',
        'accessibility.html': 'legal-privacy.html', 'developers.html': 'developer-api.html', 'vaultmesh.html': 'checkout.html',
        'fruitful.html': 'ecosystem.html', 'faa.zone.html': 'index.html', 'about.html': 'about-faa.html',
        'saas.html': 'sectors/saas/index.html', 'features.html': 'explore.html', 'admin_panel_xero.html': 'seedwave_admin.html' };

    // ---------- the owner's own domains live in this app ----------
    // All of them are offline by design (Vercel paused), so every link to one opens the matching page here.
    // Root-relative to where this app is served, so the 404 fallback below can check them.
    var SITE_PATH = (function () { try { return new URL('./', SCRIPT_SRC).pathname; } catch (e) { return '/'; } })();
    // Sector folders under sectors/ (a Seedwave sector subdomain X.seedwave.faa.zone opens sectors/X/).
    var SECTORS = ' agriculture ai-logic ai-logic-grid analytics banking community content-creation creative culture dance-movement design ' +
        'education education-ip education-youth event-management fashion finance financial food fsf gaming health health-hygiene housing ' +
        'justice knowledge logistics marketing media micromesh mining music-sound nft nutrition packaging packaging-logistics payroll ' +
        'payroll-mining pro-services professional quantum retail ritual saas sponsorship talent-development trade utilities voice webless wildlife zerowaste ';
    var SECTOR_ALIAS = { 'media-sonic': 'music-sound', 'interns': 'talent-development' };
    // Hosts shown by one page here, whatever path the link carries.
    var PAGE_HOSTS = {
        'banimal.co.za': 'banimal-connector.html', 'samfox.faa.zone': 'banimal-connector.html',
        'baobab.faa.zone': 'baobab.html', 'admin.faa.zone': 'seedwave_admin.html',
        'admin-panel.seedwave.faa.zone': 'seedwave_admin.html', 'portal.seedwave.faa.zone': 'seedwave.html',
        'index.menu.seedwave.faa.zone': 'sector-grid.html', 'menu.seedwave.faa.zone': 'sector-grid.html',
        'scrollmap.faa.zone': 'scrollmap.html', 'careers.faa.zone': 'contact-support.html',
        'api.faa.zone': 'developer-api.html', 'vault.faa.zone': 'vault-master.html',
        'fruitfulcratedance.com': 'sectors/dance-movement/index.html', 'noodle.juice': 'omnigrid.html',
        'home.fruitful.faa.zone': 'index.html', 'banimal-global-loop.vercel.app': 'banimal-connector.html',
        'fruitful.store': 'store.html', 'www.fruitful.store': 'store.html'
    };
    // Hosts whose paths map one-to-one onto this app (faa.zone/x -> /x); the value is the page for the bare host.
    var PATH_HOSTS = {
        'faa.zone': 'index.html', 'portal.faa.zone': 'index.html', 'faa.faa.zone': 'index.html',
        'fruitful.faa.zone': 'ecosystem.html', 'seedwave.faa.zone': 'seedwave.html',
        'footer.global.repo.seedwave.faa.zone': 'index.html', 'vaultmesh.faa.zone': 'checkout.html'
    };
    // The owner's own Vercel projects (brand-named), e.g. banimal-global-loop.vercel.app.
    var OWN_VERCEL = /^(fruitful|banimal|seedwave|faa|samfox|omnigrid|baobab|codenest|cornexconnect|hotstack|vaultmesh|blockbox|noodle)[a-z0-9-]*\.vercel\.app$/;
    function ownHost(host) {
        return /(^|\.)faa\.zone$/.test(host) || host === 'banimal.co.za' || host === 'fruitfulcratedance.com' || /(^|\.)fruitful\.store$/.test(host) ||
            host === 'noodle.juice' || OWN_VERCEL.test(host);
    }
    function ownSite(url) {
        var m = String(url).match(/^(?:https?:)?\/\/([^\/?#:]+)(?::\d+)?([^?#]*)(\?[^#]*)?(#.*)?$/i);
        if (!m) return null;
        var host = m[1].toLowerCase().replace(/^www\./, '');
        if (!ownHost(host)) return null;
        var p = m[2].replace(/^\/+/, ''), q = m[3] || '', h = m[4] || '', page;
        var routed = ROUTES[(host + '/' + p).replace(/\/+$/, '')];
        if (routed) return SITE_PATH + routed + h;
        if (PAGE_HOSTS[host]) return SITE_PATH + PAGE_HOSTS[host] + h;
        var sec = host.match(/^([a-z0-9-]+)\.seedwave\.faa\.zone$/);
        var slug = sec && (SECTOR_ALIAS[sec[1]] || sec[1]);
        if (slug && SECTORS.indexOf(' ' + slug + ' ') !== -1) return SITE_PATH + 'sectors/' + slug + '/' + (p || 'index.html') + q + h;
        if (PATH_HOSTS[host] !== undefined) page = p || PATH_HOSTS[host];
        // Any other owned host (regional hubs such as kenya.faa.zone, hub repos): the Global Hubs page, or its path here.
        else page = p || 'hubs.html';
        return SITE_PATH + page + (p ? q : '') + h;
    }
    var CONCEPT = !!(document.currentScript && document.currentScript.getAttribute('data-concept'));
    var SHOCK = !!(document.currentScript && document.currentScript.getAttribute('data-shock'));

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
        '.og-card{background:#fff;color:#231F20;border:1px solid rgba(35,31,32,.12)}',
        '.og-card.dark{background:#231F20;color:#FBF4E4;border-color:rgba(251,244,228,.18)}',
        '.og-card h4{margin:0 0 2px;font-size:12px;font-weight:600;letter-spacing:.02em;opacity:.7}',
        '.og-card .og-head{font-size:15px;font-weight:600;margin:0 0 8px;display:flex;gap:8px;align-items:baseline}',
        '.og-card .og-led{flex:none;width:8px;height:8px;border-radius:50%;transform:translateY(-1px)}',
        '.og-card ul{margin:0 0 8px;padding-left:16px}.og-card li{margin:1px 0}',
        '.og-card .og-foot{display:flex;justify-content:space-between;font-size:11px;opacity:.65}',
        '.og-card a{color:#577D60;text-decoration:none;font-weight:600}',
        '.og-card.dark a{color:#A7DACB}',
        '.og-view{position:fixed;inset:0;z-index:10001;display:none;flex-direction:column;background:rgba(0,0,0,.55)}',
        '.og-view.on{display:flex}',
        '.og-bar{display:flex;align-items:center;gap:10px;padding:10px 16px;background:#231F20;color:#FBF4E4;',
        'font:14px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}',
        '.og-bar .og-title{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}',
        '.og-bar button,.og-bar a{background:rgba(251,244,228,.12);color:#FBF4E4;border:0;border-radius:8px;padding:6px 12px;',
        'font:inherit;cursor:pointer;text-decoration:none;white-space:nowrap}',
        '.og-view iframe{flex:1;width:100%;border:0;background:#FBF4E4}',
        '@media (max-width:600px){.og-bar .og-ext-label{display:none}}'
    ].join('');
    document.head.appendChild(css);

    // ---------- Sam Fox™ CI master (Banimal Connector) ----------
    // brand/samfox-ci.css is the one visual source of truth; it loads after the page's own styles so its tokens win.
    // The OmniGrid pulse noodle is the owner's original: the colours it draws with are read now and pinned on the rope,
    // so the CI tokens never reach its markup, CSS or animation.
    var BRAND = new URL('brand/', SCRIPT_SRC).href;
    (function () {
        if (document.querySelector('link[data-sf-ci]')) return;
        var rope = document.querySelector('.pulse-grid-noodle-rope'), pin = '';
        if (rope) {
            var cs = getComputedStyle(rope);
            ['--primary-color', '--secondary-color', '--muted-text-light', '--muted-text-dark'].forEach(function (k) {
                var v = cs.getPropertyValue(k).trim(); if (v) pin += k + ':' + v + ';';
            });
        }
        if (pin) { var keep = document.createElement('style'); keep.setAttribute('data-noodle-keep', ''); keep.textContent = '.pulse-grid-noodle-rope{' + pin + '}'; }
        var font = document.createElement('link');
        font.rel = 'stylesheet'; font.href = 'https://fonts.googleapis.com/css2?family=Jost:wght@500;600;700&display=swap';
        var ci = document.createElement('link');
        ci.rel = 'stylesheet'; ci.href = BRAND + 'samfox-ci.css'; ci.setAttribute('data-sf-ci', '');
        document.head.appendChild(font); document.head.appendChild(ci);
        if (keep) document.head.appendChild(keep);
    })();
    // the canonical governance strip and bottom-right identity field: the pinned ink marks on cream, unchanged
    function governance() {
        if (window.top !== window || document.querySelector('.sf-governance') || !document.body) return;
        var g = document.createElement('div');
        g.className = 'sf-governance'; g.setAttribute('role', 'contentinfo'); g.setAttribute('aria-label', 'Brand and legal');
        g.innerHTML = '<div class="sf-row"><span class="sf-legal"><b>Fruitful™</b> · Banimal™ · Sam Fox™ · a Fruitful Shops (Pty) Ltd ecosystem</span>' +
            '<span class="sf-id"><img src="' + BRAND + 'banimal-logo-ink.png" alt="Banimal™" width="56" height="28">' +
            '<img class="sf-icon" src="' + BRAND + 'samfox-icon-verified-ink.png" alt="Sam Fox™" width="30" height="30"></span></div>';
        document.body.appendChild(g);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', governance); else governance();

    // ---------- the dock on every page: back to the Shock Launch, and fruitful.store ----------
    var HOME = new URL('welcome/shock-launch-v5/index.html', SCRIPT_SRC).href, STORE = new URL('store.html', SCRIPT_SRC).href;
    function dock() {
        if (window.top !== window || document.querySelector('.sf-dock') || !document.body) return;
        var here = location.pathname.replace(/\/+$/, '');
        var onHome = here.indexOf('/welcome/shock-launch') !== -1, onStore = /\/store\.html$/.test(here);
        var st = document.createElement('style');
        st.textContent = '.sf-dock{position:fixed;left:16px;bottom:16px;z-index:9990;display:flex;gap:8px;font:600 13px/1 Jost,Futura,-apple-system,"Segoe UI",sans-serif}' +
            '.sf-dock a{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 14px 0 4px;border-radius:999px;text-decoration:none;' +
            'background:#231F20;color:#FBF4E4;box-shadow:0 6px 18px -8px rgba(35,31,32,.6);border:1px solid rgba(251,244,228,.16);transition:transform .15s}' +
            '.sf-dock a:hover{transform:translateY(-2px)}.sf-dock a:focus-visible{outline:2px solid #1E9F97;outline-offset:2px}' +
            '.sf-dock img{width:32px;height:32px;border-radius:50%;object-fit:cover;display:block}' +
            '.sf-dock .sf-store{background:#FBF4E4;color:#231F20;border-color:rgba(35,31,32,.16);padding-left:12px}' +
            '.sf-dock .sf-store b{color:#577D60}' +
            '@media (max-width:520px){.sf-dock{left:10px;bottom:10px}.sf-dock .sf-t{display:none}.sf-dock a{padding-right:4px}.sf-dock .sf-store{padding:0 12px}}' +
            '@media print{.sf-dock{display:none}}';
        document.head.appendChild(st);
        var d = document.createElement('nav');
        d.className = 'sf-dock'; d.setAttribute('aria-label', 'Shock Launch and store');
        d.innerHTML = (onHome ? '' : '<a class="sf-back" href="' + HOME + '" title="Back to the Shock Launch"><img src="' + BRAND + 'shock-launch-icon.jpg" alt="" width="32" height="32"><span class="sf-t">Shock Launch</span></a>') +
            (onStore ? '' : '<a class="sf-store" href="' + STORE + '" title="fruitful.store: shop the makers"><span aria-hidden="true">🛒</span><span>fruitful<b>.store</b></span></a>');
        if (d.children.length) document.body.appendChild(d);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', dock); else dock();

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

    // When a local page is missing, try the page with the same name at the site root (or its alias) before the panel.
    function fallbackFor(url) {
        var name = url.split(/[?#]/)[0].split('/').pop();
        var alt = PAGE_ALIASES[name] || name;
        var root = new URL(SITE_PATH + alt, location.href).href;
        return root === new URL(url, location.href).href ? null : root;
    }

    function missingPanel(url, title) {
        loadData().then(function (data) {
            viewFrame.removeAttribute('src');
            viewFrame.srcdoc = stationPanel(title || url, 'flow', data,
                '<p class="h">' + esc(url) + ' is not built yet. Global flow below.</p>');
        });
    }

    function openView(url, title, push) {
        url = ownSite(url) || url;
        viewFrame.removeAttribute('srcdoc');
        viewFrame.src = url;
        if (!/^([a-z]+:)?\/\//i.test(url)) {
            fetch(url, { method: 'HEAD' }).then(function (r) {
                if (r.status !== 404 || viewFrame.getAttribute('src') !== url) return;
                // Clean URLs: "/admin/page" is served as "/admin/page.html" once hosted.
                var tries = [];
                if (!/\.[a-z0-9]+([?#]|$)/i.test(url)) tries.push(url.replace(/([?#].*)?$/, '.html$1'));
                var fb = fallbackFor(url);
                if (fb) tries.push(fb);
                (function next() {
                    if (viewFrame.getAttribute('src') !== url) return;
                    var t = tries.shift();
                    if (!t) { missingPanel(url, title); return; }
                    fetch(t, { method: 'HEAD' }).then(function (r2) { if (r2.ok) viewFrame.src = t; else next(); }).catch(next);
                })();
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
        // routes name pages at the app root; pages in sub-folders (sectors/...) must not resolve them relative to themselves
        return r.charAt(0) === '#' ? r : SITE_PATH + r.replace(/^\//, '');
    }

    // Pages link to sectors as /public/sectors/... in some builds; they are served from /sectors/...
    function rewrite(href) {
        var m = href.match(/^\/?public\/(sectors\/.*)$/);
        return m ? '/' + m[1] : null;
    }

    function resolve(href) {
        if (!href || href === '#') return null;
        href = ownSite(href) || href;
        return routeFor(href) || rewrite(href) || href;
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
        var routed = routeFor(href) || rewrite(href);
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

    // ---------- no dead clicks ----------
    // Any button or action link that does nothing within 350 ms is routed: an exact wiring map
    // (wiring.json, from the click tests), else the best-matching page by its words, else an
    // in-app feature panel with related pages. Controls that already work are never touched.
    var WIRE_URL = new URL('wiring.json', SCRIPT_SRC).href, MAN_URL = new URL('ecosystem-manifest.json', SCRIPT_SRC).href;
    var SITE_ROOT = new URL('./', SCRIPT_SRC).href, wirePromise = null;
    var UI_ONLY = /^(|×|x|✕|close.*|cancel|dismiss|menu|toggle.*|.*toggle navigation.*|.*dark mode.*|.*theme.*|.*sound.*|mute|unmute|play|pause|copy.*|back|previous|next|prev|‹|›|«|»|<|>|\d+)$/i;
    var STOP = ' the and for with from your you our this that into all of to in on by at is be as or now get view open more go see read learn launch run access explore inspect track review manage start show check enter try discover browse click submit create add new download export generate here today free ';
    function wireData() {
        if (!wirePromise) wirePromise = Promise.all([
            fetch(WIRE_URL, { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; }),
            fetch(MAN_URL, { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
        ]);
        return wirePromise;
    }
    function words(t) {
        return (t || '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(function (w) { return w.length > 2 && STOP.indexOf(' ' + w + ' ') === -1; });
    }
    function bestPages(label, man, n) {
        var q = words(label); if (!q.length || !man) return [];
        return (man.pages || []).map(function (p) {
            var hay = words(p.file.replace(/[\/._-]+/g, ' ') + ' ' + p.title), sc = 0;
            q.forEach(function (w) { hay.forEach(function (h) { if (h === w) sc += 3; else if (h.indexOf(w) === 0 || w.indexOf(h) === 0) sc += 1; }); });
            return { p: p, sc: sc };
        }).filter(function (x) { return x.sc >= 3 && x.p.file.toLowerCase() !== PAGE; })
          .sort(function (a, b) { return b.sc - a.sc; }).slice(0, n || 6);
    }
    // A control with no screen of its own: a styled header naming it, chips for the pages that already cover it,
    // and the best of those pages shown inline below (chips switch it; "Open page" gives it the whole viewer).
    var FP_CSS = [
        ':root{--bg:#FBF4E4;--card:#fff;--fg:#231F20;--muted:rgba(35,31,32,.66);--line:rgba(35,31,32,.13);--chip:#fff;--chip-on:#577D60;--accent:#577D60}',
        '.dark{--bg:#231F20;--card:#2f2a2b;--fg:#FBF4E4;--muted:rgba(251,244,228,.68);--line:rgba(251,244,228,.18);--chip:#2f2a2b;--chip-on:#1E9F97;--accent:#A7DACB}',
        '*{box-sizing:border-box}html,body{height:100%}',
        'body{margin:0;display:flex;flex-direction:column;background:var(--bg);color:var(--fg);',
        'font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;-webkit-font-smoothing:antialiased}',
        'h1{font-family:Jost,Futura,"Century Gothic",-apple-system,sans-serif}',
        '.fp{flex:none;padding:16px 16px 12px}',
        '.fp-card{max-width:1100px;margin:0 auto;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px 20px;',
        'box-shadow:0 1px 2px rgba(0,0,0,.04),0 8px 24px rgba(0,0,0,.06)}',
        '.k{margin:0;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}',
        '.k b{color:var(--fg);text-transform:none;letter-spacing:0}',
        'h1{margin:4px 0 6px;font-size:22px;line-height:1.25;font-weight:700;letter-spacing:-.01em;overflow-wrap:anywhere}',
        '.lead{margin:0 0 12px;color:var(--muted);font-size:14px}',
        '.row{display:flex;gap:10px;align-items:center}',
        '.chips{flex:1;min-width:0;display:flex;flex-wrap:wrap;gap:8px}',
        '.chip{appearance:none;border:1px solid var(--line);background:var(--chip);color:var(--fg);border-radius:999px;',
        'padding:7px 14px;font:inherit;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis;',
        'transition:background .15s,border-color .15s,color .15s}',
        '.chip:hover{border-color:var(--chip-on)}.chip.on{background:var(--chip-on);border-color:var(--chip-on);color:#fff}',
        '.chip:focus-visible,.cta:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
        '.cta{flex:none;display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:8px 16px;background:var(--accent);color:#fff;',
        'text-decoration:none;font-size:13px;font-weight:700;white-space:nowrap}',
        '.dark .cta{color:#111}',
        '.pv{flex:1;min-height:0;padding:0 16px 16px;display:flex}',
        '.pv iframe{flex:1;width:100%;max-width:1100px;margin:0 auto;border:1px solid var(--line);border-radius:16px;background:#fff}',
        '.empty{flex:1;display:flex;align-items:flex-start;justify-content:center}',
        // phone: a compact header (one-line kicker, no lead, chips scroll sideways) so the page below keeps the screen
        '@media (max-width:600px){.fp{padding:10px 12px}.fp-card{padding:12px 14px;border-radius:14px}',
        '.k{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}h1{font-size:17px;margin:2px 0 10px}.fp .lead{display:none}',
        '.chips{flex-wrap:nowrap;overflow-x:auto;padding-bottom:2px;scrollbar-width:none}.chips::-webkit-scrollbar{display:none}',
        '.chip{flex:none;max-width:70vw}.cta{padding:7px 12px}.pv{padding:0}.pv iframe{border-radius:0;border-width:1px 0 0}.empty .lead{display:block}}'
    ].join('');
    function featurePanel(label, related) {
        // Pages whose manifest title is just their file name are empty stubs: show real pages first, stubs only if nothing else.
        var stub = function (p) { return !p.title || p.title === p.file || /\.html?$/i.test(p.title); };
        var real = related.filter(function (p) { return !stub(p); });
        var pages = (real.length ? real : related).slice(0, 6).map(function (p) {
            var t = stub(p) ? p.file.split('/').pop().replace(/\.html?$/i, '').replace(/[-_]+/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }) : String(p.title).split(' · ')[0];
            return { url: SITE_ROOT + p.file, title: t };
        });
        var from = String(document.title || '').split(' · ')[0];
        var head = '<header class="fp"><div class="fp-card"><p class="k">Feature · from <b>' + esc(from) + '</b></p><h1>' + esc(label) + '</h1>';
        var html;
        if (pages.length) {
            html = head + '<p class="lead">Its own screen is on the build list. ' + (pages.length > 1 ? 'These pages already cover it; the closest one is open below.' : 'This page already covers it:') + '</p>' +
                '<div class="row"><div class="chips" role="tablist">' + pages.map(function (p, i) {
                    return '<button type="button" role="tab" class="chip' + (i ? '' : ' on') + '" aria-selected="' + (i ? 'false' : 'true') + '" data-src="' + esc(p.url) + '" title="' + esc(p.title) + '">' + esc(p.title) + '</button>';
                }).join('') + '</div><a class="cta" id="full" href="' + esc(pages[0].url) + '" target="_top">Open page ↗</a></div></div></header>' +
                '<main class="pv"><iframe id="pv" title="' + esc(pages[0].title) + '" src="' + esc(pages[0].url) + '"></iframe></main>' +
                '<script>(function(){var pv=document.getElementById("pv"),full=document.getElementById("full"),cur=' + JSON.stringify(pages[0].title).replace(/</g, '\\u003c') + ';' +
                'document.querySelectorAll(".chip").forEach(function(c){c.addEventListener("click",function(){' +
                'document.querySelectorAll(".chip").forEach(function(x){x.classList.toggle("on",x===c);x.setAttribute("aria-selected",x===c)});' +
                'pv.src=c.getAttribute("data-src");pv.title=cur=c.textContent;full.href=c.getAttribute("data-src")})});' +
                'full.addEventListener("click",function(e){try{parent.__ogOpenView(full.href,cur);e.preventDefault()}catch(x){}})})()<\/script>';
        } else {
            var hat = SITE_ROOT + 'hat.html';
            html = '<main class="empty">' + head.replace('<header class="fp">', '<div class="fp" style="width:100%">') +
                '<p class="lead">Its own screen is on the build list. Find the pages that cover it in the A–Z Ecosystem Index.</p>' +
                '<div class="row"><a class="cta" href="' + esc(hat) + '" target="_top" onclick="try{parent.__ogOpenView(this.href,\'A–Z Ecosystem Index\');return false}catch(e){}">Search the A–Z Ecosystem Index →</a></div></div></div></main>';
        }
        viewFrame.removeAttribute('src');
        viewFrame.srcdoc = '<!doctype html><html lang="en"' + (isDark() ? ' class="dark"' : '') + '><head><meta charset="utf-8">' +
            '<meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(label) + '</title><style>' + FP_CSS + '</style></head><body>' + html + '</body></html>';
        viewTitle.textContent = label;
        viewExt.href = pages.length ? pages[0].url : SITE_ROOT + 'hat.html';
        view.classList.add('on'); document.documentElement.style.overflow = 'hidden';
    }
    // background DOM change rate (clocks, tickers), sampled in 350 ms buckets
    // nodes that change on their own (clocks, tickers) are remembered, so their changes never count as a click's effect
    // (a node counts as noisy once it has changed in 3 different seconds without a click nearby)
    var SEEN = typeof WeakMap === 'function' ? new WeakMap() : null, NOISY = SEEN && new WeakMap(), lastClick = 0; // node -> {attribute or change type: noisy}
    try {
        // Start watching at the very start of the click (capture phase), before the page's own handlers run,
        // so a handler that changes the page synchronously is seen as working.
        document.addEventListener('click', function (e) {
            lastClick = Date.now();
            if (e.button !== 0) return;
            var w = { changed: 0, href: location.href, wasOpen: view.classList.contains('on'), paint0: canvasPrints() };
            w.mo = new MutationObserver(function (m) { m.forEach(function (x) { var nz = NOISY && NOISY.get(x.target); if (!(nz && nz[x.attributeName || x.type])) w.changed++; }); });
            w.mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true, characterData: true });
            w.onScroll = function () { w.changed++; }; // scrolling to a section is a real action
            document.addEventListener('scroll', w.onScroll, true);
            setTimeout(function () { w.mo.disconnect(); document.removeEventListener('scroll', w.onScroll, true); }, 400);
            e.__ogWatch = w;
        }, true);
        new MutationObserver(function (m) {
            var now = Date.now(), sec = Math.floor(now / 1000);
            if (!SEEN || now - lastClick < 1500) return;
            m.forEach(function (x) {
                var k = x.attributeName || x.type, rs = SEEN.get(x.target) || {}, r = rs[k] || (rs[k] = { s: -1, n: 0 });
                SEEN.set(x.target, rs);
                if (r.s !== sec) { r.s = sec; r.n++; if (r.n >= 3) { var nz = NOISY.get(x.target) || {}; nz[k] = 1; NOISY.set(x.target, nz); } }
            });
        })
            .observe(document.documentElement, { subtree: true, childList: true, attributes: true, characterData: true });
    } catch (e) { }
    document.addEventListener('pointerdown', function () { wireData(); }, { capture: true, once: true }); // warm the data before the first click lands
    setTimeout(function () { (window.requestIdleCallback || setTimeout)(function () { wireData(); }); }, 3000);
    // canvas drawing (charts, confetti) is invisible to the DOM; a canvas that changes after a click is a real effect
    var thumb = null, ANIM = typeof WeakMap === 'function' ? new WeakMap() : null; // canvas -> last time it changed on its own
    function canvasPrints() { // 16x16 thumbnail per canvas: cheap enough to take on every click
        var cs = document.querySelectorAll('canvas'), out = [];
        if (!cs.length) return out;
        try { thumb = thumb || document.createElement('canvas'); thumb.width = thumb.height = 16; var tx = thumb.getContext('2d', { willReadFrequently: true }); } catch (e) { return out; }
        Array.prototype.slice.call(cs, 0, 12).forEach(function (c) {
            if (c.closest('.og-view') || !c.width || !c.height) return;
            var v; try { tx.clearRect(0, 0, 16, 16); tx.drawImage(c, 0, 0, 16, 16); v = Array.prototype.join.call(tx.getImageData(0, 0, 16, 16).data, ''); } catch (e) { v = '?'; }
            out.push([c, v]);
        });
        return out;
    }
    function canvasMoved(before) { // true when a canvas that is normally still has changed since `before`
        var now = Date.now(), after = canvasPrints(), moved = false;
        before.forEach(function (b) {
            var a = after.filter(function (x) { return x[0] === b[0]; })[0];
            if (a && a[1] !== b[1] && !(ANIM && now - (ANIM.get(b[0]) || 0) < 4000)) moved = true;
        });
        return moved;
    }
    var lastPrints = [];
    setInterval(function () { // learn which canvases animate by themselves (charts, particles)
        if (!ANIM || Date.now() - lastClick < 1500 || document.hidden) return;
        var cur = canvasPrints();
        cur.forEach(function (x) { var p = lastPrints.filter(function (y) { return y[0] === x[0]; })[0]; if (p && p[1] !== x[1]) ANIM.set(x[0], Date.now()); });
        lastPrints = cur;
    }, 1000);
    // what a generic control ("View", "Deploy", "Open") is about: its table row, list item or card heading
    function contextOf(el) {
        var row = el.closest('tr');
        if (row) {
            var cells = Array.prototype.filter.call(row.cells || [], function (c) { return !c.contains(el) && words(c.textContent).length; });
            if (cells.length) return cells[0].textContent.replace(/\s+/g, ' ').trim().slice(0, 60);
        }
        var box = el.closest('li, article, .card, [class*="card"], section, .content-block');
        var h = box && box.querySelector('h1, h2, h3, h4, strong');
        return h && !h.contains(el) ? h.textContent.replace(/\s+/g, ' ').trim().slice(0, 60) : '';
    }
    function rescue(el, label) {
        window.__ogRescued = Date.now(); // lets the click tests tell a rescue from the page's own routing
        var ctx = contextOf(el), wireLabel = label;
        if (ctx && words(label).length < 2) label = label + ' · ' + ctx;
        wireData().then(function (d) {
            var wire = d[0] || {}, man = d[1];
            var hit = (wire[PAGE] && (wire[PAGE][label] || wire[PAGE][wireLabel])) || (wire['*'] && (wire['*'][label.toLowerCase()] || wire['*'][wireLabel.toLowerCase()]));
            if (hit) { route(hit.charAt(0) === '#' || /^([a-z]+:)?\/\//i.test(hit) ? hit : SITE_ROOT + hit, label); return; }
            var best = bestPages(label, man, 6);
            // go straight to a page only on a clear, strong match; otherwise show the feature panel with the candidates
            if (best.length && best[0].sc >= 6 && (best.length === 1 || best[0].sc >= 2 * best[1].sc)) { route(SITE_ROOT + best[0].p.file, label); return; }
            featurePanel(label, best.map(function (x) { return x.p; }));
        }).catch(function () { featurePanel(label, []); });
    }
    document.addEventListener('click', function (e) {
        if (e.button !== 0) return; // a cancelled click still counts as dead if nothing happens
        var el = e.target.closest('button, [role=button], [onclick], a, input[type=button], summary');
        if (!el || view.contains(el) || el.closest('.og-card')) return;
        if (el.form || el.closest('form')) { var t = (el.getAttribute('type') || (el.tagName === 'BUTTON' ? 'submit' : '')).toLowerCase(); if (t === 'submit' || t === 'image') return; } // submits belong to the form
        if (el.tagName === 'A') { var h = (el.getAttribute('href') || '').trim(); if (h && !/^#$|^#!$|^javascript:/i.test(h)) return; }
        if (el.disabled) return;
        var label = (el.getAttribute('aria-label') || el.textContent || el.value || el.title || '').replace(/\s+/g, ' ').trim().slice(0, 80);
        if (UI_ONLY.test(label)) return;
        var w = e.__ogWatch;
        if (!w) return;
        if (el.tagName === 'A') e.preventDefault(); // bare '#' link: no jump to top, no fake URL change
        setTimeout(function () {
            if (w.paint0.length && canvasMoved(w.paint0)) w.changed++;
            if (w.changed || location.href !== w.href || (!w.wasOpen && view.classList.contains('on'))) return;
            rescue(el, label);
        }, 350);
    }, false);

    // ---------- sector terminals ----------
    function stationPanel(title, station, data, intro) {
        var dark = isDark();
        var bg = dark ? '#231F20' : '#FBF4E4', fg = dark ? '#FBF4E4' : '#231F20', card = dark ? '#2f2a2b' : '#fff';
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

    // A page's own loadTerminal (e.g. the mining overview's hubs) keeps handling the terminals it defines;
    // the shared renderer only takes the shared terminal names in TERMINALS.
    var pageLoadTerminal = (typeof window.loadTerminal === 'function') ? window.loadTerminal : null;
    function renderTerminal(name) {
        if (!TERMINALS[name] && pageLoadTerminal && pageLoadTerminal !== renderTerminal) return pageLoadTerminal.apply(this, arguments);
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

    function conceptGuard() {
        var bar = document.createElement('div');
        bar.setAttribute('role', 'note');
        bar.style.cssText = 'position:sticky;top:0;z-index:9999;background:#231F20;color:#FBF4E4;font:13px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding:8px 14px;display:flex;gap:12px;align-items:center;justify-content:space-between';
        bar.innerHTML = '<span>🧪 <b>Concept preview</b> · forms on this page are not connected yet; nothing you type is sent.</span><a href="' + esc(new URL('ecosystem.html', SCRIPT_SRC).href) + '" style="color:#A7DACB;text-decoration:none;font-weight:600">🌍 Ecosystem</a>';
        document.body.insertBefore(bar, document.body.firstChild);
        document.addEventListener('submit', function (e) { e.preventDefault(); }, true);
        document.querySelectorAll('input[type="password"]').forEach(function (i) { i.disabled = true; i.placeholder = 'Not connected in the concept preview'; });
    }

    // Shock Launch: the sign-up form is not connected yet, so it is replaced by a notice (nothing is collected).
    function shockGuard() {
        // The Shock Launch sign-up is live (Supabase join_launch); nothing to hold back on this page any more.
    }

    function init() {
        window.loadTerminal = renderTerminal;
        if (CONCEPT) conceptGuard();
        if (SHOCK) shockGuard();
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
