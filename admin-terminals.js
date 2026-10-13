// Admin Menu terminals for dashboard.html (Seedwave™ Admin Portal).
// The menu lists 16 admin views; the page itself only builds two of them (Quick View, Global Dashboard). Each other view
// already exists in the app as its own page, so it is opened here as a live terminal inside the admin portal, the same
// way the VaultRouter terminal buttons work. Adds 📜 Treaty Grid to the menu and the terminal row.
// Runs before DOMContentLoaded, so the page's own click handlers also bind to the items added here.
(function () {
    'use strict';
    var VIEWS = {
        'admin-signal-sync': ['📡 Signal Sync', 'signal.html'],
        'admin-node-index': ['🧩 Node Index', 'node-status.html'],
        'admin-sector-grid': ['🏙️ Sector Grid', 'sector-grid.html'],
        'admin-license-ledger': ['🔐 License Ledger', 'licensing.html'],
        'admin-faa-clauses': ['📜 FAA Clauses', 'clause-index.html'],
        'admin-scrollmap': ['🗺️ ScrollMap', 'scrollmap.html'],
        'admin-ecosystem-mesh': ['🌿 Ecosystem Mesh', 'ecosystem.html'],
        'admin-brand-metrics': ['🔍 Brand Metrics', 'brandmetrics.html'],
        'admin-scroll-layers': ['🧬 Scroll Layers', 'scroll-layers.html'],
        'admin-grid-index': ['📊 Grid Index', 'grid-index.html'],
        'admin-node-packs': ['📁 Node Packs', 'node-packs.html'],
        'admin-audit-tracker': ['📈 Audit Tracker', 'audit-tracker.html'],
        'admin-signal-zones': ['🛰️ Signal Zones', 'signal-zones.html'],
        'admin-ecosync-logs': ['📥 Ecosync Logs', 'ecosync-logs.html'],
        'admin-treaty-grid': ['📜 Treaty Grid', 'treaty-grid.html']
    };
    var area = document.getElementById('admin-portal-main-content-area');
    if (!area) return;

    // 1. the Treaty Grid joins both admin menus
    var lastSide = document.querySelector('#admin-portal-sidebar .admin-sidebar-link[data-admin-view="admin-ecosync-logs"]');
    if (lastSide && !document.querySelector('[data-admin-view="admin-treaty-grid"]')) {
        var li = lastSide.closest('li').cloneNode(true), a = li.querySelector('a');
        a.dataset.adminView = 'admin-treaty-grid';
        a.classList.remove('active');
        var spans = a.querySelectorAll('span');
        if (spans.length >= 2) { spans[0].textContent = '📜'; spans[spans.length - 1].textContent = 'Treaty Grid'; } else a.textContent = '📜 Treaty Grid';
        lastSide.closest('li').after(li);
        var lastTop = document.querySelector('.admin-nav-link[data-admin-view="admin-ecosync-logs"]');
        if (lastTop) {
            var t = lastTop.cloneNode(true); t.dataset.adminView = 'admin-treaty-grid'; t.textContent = '📜 Treaty Grid'; t.classList.remove('active');
            lastTop.after(t);
        }
    }

    // 2. a terminal panel for every view the page does not build itself
    Object.keys(VIEWS).forEach(function (id) {
        if (document.getElementById(id)) return;
        var label = VIEWS[id][0], page = VIEWS[id][1];
        var s = document.createElement('section');
        s.id = id;
        s.className = 'admin-view-panel content-block';
        s.innerHTML = '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:.5rem;margin-bottom:.75rem">' +
            '<h3 style="margin:0">' + label + '</h3><a href="' + page + '" style="font-size:.85rem;text-decoration:underline">Open full page ↗</a></div>' +
            '<iframe data-src="' + page + '" title="' + label + '" style="width:100%;height:78vh;border:0;border-radius:12px;background:transparent" ' +
            'sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>';
        area.appendChild(s);
        // load the terminal the first time its panel is shown
        new MutationObserver(function (m, obs) {
            if (!s.classList.contains('active')) return;
            var f = s.querySelector('iframe'); if (!f.getAttribute('src')) f.src = f.dataset.src;
            obs.disconnect();
        }).observe(s, { attributes: true, attributeFilter: ['class'] });
    });

    // the page binds its menu handlers before this script runs, so the Treaty Grid items get the same behaviour here
    document.querySelectorAll('[data-admin-view="admin-treaty-grid"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            if (typeof showMainContentView === 'function' && link.classList.contains('admin-sidebar-link')) showMainContentView('admin-portal-section');
            area.querySelectorAll('.admin-view-panel').forEach(function (v) { v.classList.remove('active'); });
            document.getElementById('admin-treaty-grid').classList.add('active');
            document.querySelectorAll('.admin-sidebar-link, .admin-nav-link').forEach(function (x) { x.classList.toggle('active', x.dataset.adminView === 'admin-treaty-grid'); });
        });
    });

    // 3. VaultRouter: the terminal buttons, plus the Treaty Grid, with a loader that works on page load as well as on click
    var row = document.querySelector('.terminal-btn') && document.querySelector('.terminal-btn').parentElement;
    if (row && !row.querySelector('[data-terminal="treaty-grid.html"]')) {
        var b = document.createElement('button');
        b.className = 'terminal-btn p-6'; b.dataset.terminal = 'treaty-grid.html'; b.textContent = '📜 Treaty Grid';
        b.setAttribute('onclick', "loadTerminal('treaty-grid.html')");
        row.appendChild(b);
    }
    window.loadTerminal = function (src) {
        var f = document.getElementById('vault-frame');
        if (!f) return;
        f.src = src;
        document.querySelectorAll('.terminal-btn').forEach(function (x) {
            x.classList.toggle('ring', (x.getAttribute('onclick') || '').indexOf("'" + src + "'") !== -1);
        });
    };
})();
