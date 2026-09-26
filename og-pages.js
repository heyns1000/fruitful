/*
 * Shared renderer for OmniGrid detail pages (admin metrics and friends).
 * Each page sets window.OG_PAGE = { kind, figure, figureLabel, ... } and includes
 * <div id="og-page"></div>. Data comes from ecosystem-manifest.json and
 * omnigrid-pulse.json (counts only). Dashboard figures are shown as dashboard
 * figures; live counts are shown as the live snapshot. Nothing is invented.
 */
(function () {
    'use strict';
    var cfg = window.OG_PAGE || {};
    var root = document.getElementById('og-page');
    var base = cfg.base || '';
    var STATUS = { green: 'var(--secondary-color)', amber: 'var(--amber-color)', red: 'var(--tertiary-color)' };
    var LABEL = { built: 'Built', 'in-app': 'In-app', missing: 'Not built yet' };
    var CLASS = { built: 'ok', 'in-app': 'warn', missing: 'bad' };

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function fmt(n) { return n == null ? '—' : Number(n).toLocaleString('en-ZA'); }
    function get(url) {
        return fetch(base + url, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
            .catch(function () { return null; });
    }
    function card(title, body, extra) {
        return '<div class="card' + (extra ? ' ' + extra : '') + '"><h3>' + esc(title) + '</h3>' + body + '</div>';
    }
    function badge(cls, text) { return '<span class="badge ' + cls + '">' + esc(text) + '</span>'; }
    function led(status) { return '<i class="dot" style="background:' + (STATUS[status] || '#999') + '"></i>'; }
    function list(items) { return '<ul class="list">' + items.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>'; }
    function station(pulse, id) { return pulse && pulse.stations.filter(function (s) { return s.id === id; })[0]; }
    function stationCard(s) {
        if (!s) return '';
        return card(s.title, '<p class="big">' + led(s.status) + esc(s.headline) + '</p>' +
            list(s.lines.map(esc)));
    }
    function pageLink(file, text) { return '<a href="' + esc(base + file) + '">' + esc(text || file) + '</a>'; }

    var RENDER = {
        deployments: function (m, p) {
            var pages = m ? m.pages : [];
            return [stationCard(station(p, 'branches')),
                card('Deployable pages', '<p class="big">' + fmt(pages.length) + ' pages</p>' +
                    '<p class="muted">' + fmt(pages.filter(function (x) { return x.wired; }).length) + ' on the in-app OmniGrid layer. Hosting is paused by design until the ecosystem launch.</p>'),
                card('Release packages', list(['Fruitful WordPress Core 1.1.0: built and verified', 'Banimal Ecosystem Connector 5.1.1: built and verified']))];
        },
        audits: function (m, p) {
            return [card('Audits completed · 26 Sep 2026', list([
                'Live-key scan across every repository',
                'Public / private visibility review of every repository',
                'Banimal read-only release audit (5-state evidence model)',
                'Database access-policy review',
                'Claude Project consolidation check (nothing reduced)'])),
                stationCard(station(p, 'guardian')),
                card('Intelligence intakes', m && m.intelligence ? list([
                    'Claude: ' + fmt(m.intelligence.claude && m.intelligence.claude.chats) + ' chats indexed',
                    'Perplexity: ' + fmt(m.intelligence.perplexity && m.intelligence.perplexity.records) + ' records indexed',
                    'Applications: ' + fmt(m.intelligence.applications && m.intelligence.applications.applications) + ' in the registry']) : '<p class="muted">Snapshot unavailable.</p>')];
        },
        grid: function (m) {
            if (!m) return [card('Grid index', '<p class="muted">Snapshot unavailable.</p>')];
            var rows = m.pages.map(function (x) {
                return '<div class="row"><span>' + pageLink(x.file, x.title) + '<span class="sub">' + esc(x.file) + '</span></span>' +
                    (x.noodle ? badge('ok', 'Pulse') : '') + badge(x.wired ? 'ok' : 'warn', x.wired ? 'In-app' : 'Viewer') + '</div>';
            }).join('');
            var groups = m.groups.map(function (g) {
                var ok = g.items.filter(function (i) { return i.status !== 'missing'; }).length;
                return '<div class="row"><span><b>' + esc(g.id) + '</b> · ' + esc(g.name) + '</span>' + badge(ok === g.items.length ? 'ok' : 'warn', ok + ' / ' + g.items.length) + '</div>';
            }).join('');
            return [card('Portal pages · ' + m.pages.length, '<div class="rows">' + rows + '</div>', 'wide'),
                card('Launch groups · ' + m.readiness.total + ' items', '<div class="rows">' + groups + '</div>')];
        },
        logs: function (m, p) {
            var ev = (m && m.milestones || []).map(function (x) {
                return '<div class="milestone"><div class="d">' + esc(x.date) + '</div><strong>' + esc(x.title) + '</strong><div>' + esc(x.detail) + '</div></div>';
            }).join('');
            var snaps = [];
            if (m) snaps.push('Ecosystem manifest · ' + esc(m.generated_at.replace('T', ' ').replace('Z', ' UTC')));
            if (p) snaps.push('Pulse snapshot · ' + esc(p.generated_at.replace('T', ' ').replace('Z', ' UTC')));
            return [card('Sync events', '<div class="timeline">' + (ev || '<p class="muted">No events.</p>') + '</div>', 'wide'),
                card('Latest syncs', list(snaps.length ? snaps : ['Snapshot unavailable']))];
        },
        licenses: function (m) {
            var a = m && m.intelligence && m.intelligence.applications;
            return [card('License registry', '<p class="muted">The license registry is not connected to the grid yet. The dashboard figure above is shown as published.</p>'),
                card('Licensable surfaces', a ? '<p class="big">' + fmt(a.applications) + ' applications</p><p class="muted">' + fmt(a.instances) + ' instances across platforms, from the application registry.</p>' : '<p class="muted">Snapshot unavailable.</p>'),
                card('Release packages', list(['Fruitful WordPress Core 1.1.0', 'Banimal Ecosystem Connector 5.1.1']))];
        },
        zones: function (m, p) {
            var sectors = m ? m.sectors : [];
            var grid = sectors.map(function (s) {
                return '<a class="chip" href="' + esc(base + 'sectors/' + s.slug + '/index.html') + '">' + esc(s.name) + badge(CLASS[s.status], LABEL[s.status]) + '</a>';
            }).join('');
            var flow = p ? '<p class="big">' + led('green') + p.flow.green + ' green · ' + led('amber') + p.flow.amber + ' amber · ' + led('red') + p.flow.red + ' red</p>' : '';
            return [card('Global signal', flow + '<p class="muted">Across the six pulse stations. Hover the noodle for detail.</p>'),
                card('Sectors in the grid · ' + sectors.length, '<div class="chips">' + grid + '</div>', 'wide')];
        },
        nodes: function (m, p) {
            var i = (m && m.intelligence) || {};
            var st = p ? p.stations.map(stationCard) : [card('Pulse', '<p class="muted">Snapshot unavailable.</p>')];
            return [card('Grid nodes', list([
                fmt(i.repos && i.repos.total) + ' repositories',
                fmt(i.applications && i.applications.applications) + ' applications · ' + fmt(i.applications && i.applications.instances) + ' instances',
                fmt(m && m.pages.length) + ' portal pages · ' + fmt(m && m.sectors.length) + ' sectors']))].concat(st);
        },
        access: function () {
            var tiers = ['👨‍👩‍👧‍👦 Family Access', '📊 Shareholder Access', '🤝 Service Provider', '🪙 Loyalty Access'];
            return tiers.map(function (t) {
                return card(t, '<p class="muted">Requests are reviewed before access is granted.</p>' +
                    '<a class="cta" href="https://faa.zone/contact-us.html">Request access</a>');
            });
        }
    };

    Promise.all([get('ecosystem-manifest.json'), get('omnigrid-pulse.json')]).then(function (res) {
        var m = res[0], p = res[1];
        var head = '<section class="page-hero"><div class="container">' +
            '<p class="kicker"><a href="' + esc(base + 'dashboard.html') + '">⚙️ Dashboard</a> · <a href="' + esc(base + 'ecosystem.html') + '">🌍 Ecosystem</a></p>' +
            '<h1>' + esc(cfg.title) + '</h1>' + (cfg.intro ? '<p class="tagline">' + esc(cfg.intro) + '</p>' : '') +
            (cfg.figure ? '<div class="figure"><b>' + esc(cfg.figure) + '</b><span>Dashboard figure</span></div>' : '') +
            '</div></section>';
        var cards = (RENDER[cfg.kind] || function () { return []; })(m, p);
        root.innerHTML = head + '<section><div class="container"><div class="cards">' + cards.join('') + '</div>' +
            '<p class="snapshot">Live snapshot ' + esc(m ? m.generated_at.slice(0, 10) : 'unavailable') + ' · counts only</p></div></section>';
    });
})();
