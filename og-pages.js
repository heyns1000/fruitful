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

    function sectorName(g, key) {
        var sl = (g && g.sectorList) || {};
        return sl[key] || (key.charAt(0).toUpperCase() + key.slice(1)).replace(/-/g, ' ');
    }
    function sectorRows(g) {
        return Object.keys((g && g.sectors) || {}).map(function (k) {
            var s = g.sectors[k], nodes = 0;
            (s.subNodes || []).forEach(function (x) { nodes += (x && x.length) || 0; });
            return { key: k, name: sectorName(g, k), brands: s.brands.length, nodes: nodes, zone: (g.zoneIndex || {})[k] || null, data: s };
        });
    }
    function table(head, rows) {
        return '<div class="tbl"><table><thead><tr>' + head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') +
            '</tr></thead><tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') +
            '</tbody></table></div>';
    }
    function bars(labels, data, suffix) {
        var max = Math.max.apply(null, data.concat([1]));
        return '<div class="bars">' + labels.map(function (l, i) {
            return '<div class="barrow"><span class="bl">' + esc(l) + '</span><span class="bt"><span style="width:' + (data[i] * 100 / max) + '%"></span></span><b>' + fmt(data[i]) + (suffix || '') + '</b></div>';
        }).join('') + '</div>';
    }
    function noGrid() { return [card('Catalogue', '<p class="muted">Catalogue data unavailable right now.</p>')]; }
    function joinCards() {
        return [card('Where to next', list([pageLink('admin/admin-portal-approval.html', '🔑 Request portal access'),
            pageLink('ecosystem.html', '🌍 Explore the Global Ecosystem'), pageLink('omnigrid.html', '🕸️ Enter the OmniGrid')]))];
    }

    var THIRD = ['Google Fonts and gstatic (typefaces)', 'jsDelivr, cdnjs and the Tailwind CDN (page libraries)',
        'PayPal (payments on the checkout page only)', 'Google Generative Language / Gemini (terminal chat, only when you use it)',
        'ExchangeRate-API (currency conversion on pages that show prices)', 'placehold.co (placeholder images)'];
    function legalCards(doc) {
        var draft = card('Draft · pending review', '<p class="muted">This page describes how the site works today. It is a draft awaiting review by the owner and legal counsel, and is not yet a binding agreement.</p>');
        var D = {
            privacy: [
                card('What we collect', list(['This site has <b>no sign-up or contact forms</b> and collects no personal information through its pages.',
                    'No analytics or advertising trackers are used.', 'Access requests are made through the FAA.zone contact channels, which have their own notice.'])),
                card('Stored in your browser', list(['Your light/dark theme choice (<code>eco-theme</code>).', 'The Seedwave™ Admin page keeps its working data in your own browser only.',
                    'You can clear this at any time from your browser settings.'])),
                card('Third-party services', list(THIRD.map(esc))),
                card('Your choices', list(['Clear site data in your browser to remove stored settings.', 'Contact us through ' + pageLink('contact-support.html', 'Contact Support') + ' with privacy questions.']))],
            terms: [
                card('Using the site', list(['The Fruitful™ Global Ecosystem pages are provided for information and navigation.', 'Figures marked "Dashboard figure" are published targets and display values, not audited results.',
                    'Payments, where offered, are handled by PayPal under its own terms.'])),
                card('Brands and content', list(['Fruitful™, FAA.zone™, OmniGrid™, Seedwave™, Baobab™ and related marks belong to their owner.', 'Catalogue content is shown as published by the owner.'])),
                card('Availability', list(['Some pages are marked "Not built yet" and open as placeholders until launch.', 'Hosting of the public domains is paused until the ecosystem launch.']))],
            cookies: [
                card('Cookies', list(['These pages set <b>no cookies of their own</b>.', 'Embedded services (PayPal on checkout, Google Fonts) may set their own cookies under their policies.'])),
                card('Browser storage', list(['<code>eco-theme</code>: remembers light or dark mode.', 'Seedwave™ Admin working data (that page only, on your device).'])),
                card('Third parties', list(THIRD.map(esc)))],
            'legal-privacy': [
                card('Legal & privacy', list([pageLink('privacy-policy.html', 'Privacy Policy'), pageLink('terms-of-service.html', 'Terms of Service'), pageLink('cookies.html', 'Cookies'), pageLink('compliance.html', 'Compliance')]))],
            compliance: [
                card('Security practice', list(['Every repository is scanned for live keys; exposed keys are removed and rotated.', 'Public repositories carry no secrets; private work stays private.',
                    'Database access policies are under review.'])),
                card('Data practice', list(['Public data files carry counts and published catalogue only.', 'No personal data is collected through these pages.'])),
                card('Related', list([pageLink('audit-tracker.html', '📈 Audit Tracker'), pageLink('privacy-policy.html', 'Privacy Policy')]))]
        };
        return [draft].concat(D[doc] || []);
    }

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
        brandmetrics: function (m, p, g) {
            if (!g) return noGrid();
            var a = g.admin || {}, gm = a.globalMetrics || {}, bd = a.brandDistribution;
            var rows = sectorRows(g).filter(function (r) { return r.brands; }).sort(function (x, y) { return y.brands - x.brands; });
            return [card('Global brand metrics', list(['<b>' + fmt(gm.totalBrands) + '</b> total brands', '<b>' + fmt(gm.coreBrands) + '</b> core brands',
                    '<b>' + fmt(gm.totalNodes) + '</b> nodes', '<b>' + fmt(gm.totalPages) + '</b> pages'])),
                bd ? card('Brand distribution', bars(bd.labels, bd.data)) : '',
                card('Catalogued brands by sector · ' + fmt(rows.reduce(function (t, r) { return t + r.brands; }, 0)), bars(rows.map(function (r) { return r.name; }), rows.map(function (r) { return r.brands; })), 'wide')];
        },
        clauses: function (m, p, g) {
            var c = g && g.admin && g.admin.licenseLedger && g.admin.licenseLedger.clauses;
            if (!c) return noGrid();
            var total = c.data.reduce(function (t, x) { return t + x; }, 0);
            return [card('FAA™ clause allocation · ' + fmt(total), bars(c.labels, c.data), 'wide'),
                card('Clause register', table(['Clause', 'Allocations', 'Share'], c.labels.map(function (l, i) {
                    return [esc(l), fmt(c.data[i]), Math.round(c.data[i] * 100 / total) + '%'];
                })), 'wide')];
        },
        distributor: function (m, p, g) {
            if (!g) return noGrid();
            var rows = sectorRows(g).filter(function (r) { return r.zone; });
            return [card('Distributor tariff index · ' + rows.length + ' sectors', table(['Sector', 'Monthly', 'Annual', 'Payout tier', 'Region', 'Brands'],
                rows.map(function (r) { return [esc(r.name), esc(r.zone.monthlyFee), esc(r.zone.annualFee), esc(r.zone.payoutTier), esc(r.zone.region), fmt(r.brands)]; })), 'wide')];
        },
        hardware: function (m, p, g) {
            var t = g && g.admin && g.admin.techStack;
            if (!t) return noGrid();
            return Object.keys(t).map(function (k) {
                var x = t[k];
                return card((x.icon ? x.icon + ' ' : '') + x.title, '<p class="muted">' + esc(x.details) + '</p>' + list((x.features || []).map(esc)));
            });
        },
        owner: function (m, p, g) {
            var r = m && m.readiness, i = (m && m.intelligence) || {};
            return [card('Launch readiness', r ? '<p class="big">' + (r.built + r.in_app) + ' of ' + r.total + ' reachable</p>' +
                    list([fmt(r.built) + ' built', fmt(r.in_app) + ' in-app', fmt(r.missing) + ' not built yet', pageLink('ecosystem.html#readiness', 'Open the launch board →')]) : '<p class="muted">Snapshot unavailable.</p>'),
                card('Owner tools', list([pageLink('dashboard.html', '⚙️ Dashboard'), pageLink('seedwave_admin.html', '🌱 Seedwave™ Admin'),
                    pageLink('audit-tracker.html', '📈 Audit Tracker'), pageLink('grid-index.html', '📊 Scroll Grid Index'), pageLink('quick-view.html', '🏁 Quick View')])),
                card('Estate', list([fmt(i.repos && i.repos.total) + ' repositories', fmt(i.applications && i.applications.applications) + ' applications',
                    fmt(g && g.admin && g.admin.globalMetrics && g.admin.globalMetrics.totalBrands) + ' brands', fmt(m && m.sectors.length) + ' sectors']))];
        },
        ledger: function (m, p, g) {
            var gr = g && g.admin && g.admin.licenseLedger && g.admin.licenseLedger.growth;
            if (!gr) return noGrid();
            var head = ['Tier'].concat(gr.labels);
            return [card('License growth by tier', table(head, gr.datasets.map(function (d) { return [esc(d.label)].concat(d.data.map(fmt)); })), 'wide'),
                card('Latest month', bars(gr.datasets.map(function (d) { return d.label; }), gr.datasets.map(function (d) { return d.data[d.data.length - 1]; }))),
                card('Related', list([pageLink('license-grid.html', '🔐 License Grid'), pageLink('clause-index.html', '📜 FAA Clauses')]))];
        },
        nodepacks: function (m, p, g) {
            if (!g) return noGrid();
            var rows = sectorRows(g).filter(function (r) { return r.brands; });
            var html = rows.map(function (r) {
                var packs = r.data.brands.map(function (b, i) {
                    var sub = r.data.subNodes[i] || [];
                    return '<li data-q="' + esc((b + ' ' + sub.join(' ')).toLowerCase()) + '"><b>' + esc(b) + '</b>' + (sub.length ? ' · ' + esc(sub.join(', ')) : '') + '</li>';
                }).join('');
                return '<details class="pack"><summary>' + esc(r.name) + ' <span class="badge">' + fmt(r.brands) + ' packs · ' + fmt(r.nodes) + ' nodes</span></summary><ul class="list">' + packs + '</ul></details>';
            }).join('');
            setTimeout(function () {
                var q = document.getElementById('pack-q');
                if (!q) return;
                q.addEventListener('input', function () {
                    var v = q.value.trim().toLowerCase();
                    document.querySelectorAll('details.pack').forEach(function (d) {
                        var any = false;
                        d.querySelectorAll('li').forEach(function (li) { var hit = !v || li.getAttribute('data-q').indexOf(v) !== -1; li.style.display = hit ? '' : 'none'; any = any || hit; });
                        d.style.display = any ? '' : 'none';
                        if (v) d.open = any;
                    });
                });
            }, 0);
            return [card('Node packs · ' + fmt(rows.reduce(function (t, r) { return t + r.brands; }, 0)) + ' brands',
                '<input id="pack-q" class="search" type="search" placeholder="Search brands and nodes…" aria-label="Search node packs">' + html, 'wide')];
        },
        nodestatus: function (m, p, g) {
            if (!g) return noGrid();
            var built = {}; (m ? m.sectors : []).forEach(function (s) { built[s.slug] = s.status; });
            var rows = sectorRows(g).sort(function (x, y) { return y.nodes - x.nodes; });
            return [card('Node index · ' + fmt(rows.reduce(function (t, r) { return t + r.nodes; }, 0)) + ' sub-nodes', table(['Sector', 'Brands', 'Sub-nodes', 'Sector page'],
                rows.map(function (r) { var st = built[r.key] || 'missing'; return [esc(r.name), fmt(r.brands), fmt(r.nodes), badge(CLASS[st], LABEL[st])]; })), 'wide')];
        },
        pulse: function (m, p) {
            if (!p) return [card('Signal', '<p class="muted">Pulse snapshot unavailable.</p>')];
            return [card('Signal sync', '<p class="big">' + led('green') + p.flow.green + ' · ' + led('amber') + p.flow.amber + ' · ' + led('red') + p.flow.red + '</p>' +
                list(['Pulse snapshot ' + esc(p.generated_at.replace('T', ' ').replace('Z', ' UTC')), m ? 'Ecosystem manifest ' + esc(m.generated_at.replace('T', ' ').replace('Z', ' UTC')) : 'Manifest unavailable']))]
                .concat(p.stations.map(stationCard));
        },
        quick: function (m, p, g) {
            var r = m && m.readiness, gm = g && g.admin && g.admin.globalMetrics;
            var tiles = [[r ? (r.built + r.in_app) + ' / ' + r.total : '—', 'launch items reachable'], [m ? m.pages.length : '—', 'pages'],
                [m ? m.sectors.length : '—', 'sectors'], [gm ? gm.totalBrands : '—', 'brands'], [p ? p.flow.green + p.flow.amber + p.flow.red : '—', 'pulse stations']];
            return [card('At a glance', '<div class="tiles">' + tiles.map(function (t) { return '<div class="tile"><b>' + (typeof t[0] === 'number' ? fmt(t[0]) : esc(t[0])) + '</b><span>' + esc(t[1]) + '</span></div>'; }).join('') + '</div>', 'wide'),
                card('Jump to', list([pageLink('ecosystem.html', '🌍 Ecosystem'), pageLink('dashboard.html', '⚙️ Dashboard'), pageLink('seedwave_admin.html', '🌱 Seedwave Admin'),
                    pageLink('sector-grid.html', '🏙️ Sector Grid'), pageLink('brandmetrics.html', '🔍 Brand Metrics'), pageLink('pulse-monitor.html', '📡 Signal Sync')]))];
        },
        layers: function (m, p, g) {
            if (!g) return noGrid();
            var ss = (g.admin && g.admin.sovereignScrolls) || {};
            var rows = sectorRows(g).filter(function (r) { return r.brands; });
            return [card('Sovereign scrolls', '<p class="big">' + fmt(ss.generated) + ' of ' + fmt(ss.total) + ' generated</p>' +
                    '<div class="bt big-bt"><span style="width:' + ((ss.generated || 0) * 100 / (ss.total || 1)) + '%"></span></div>'),
                card('Scroll layers by sector', table(['Sector', 'Brand layer', 'Node layer'], rows.map(function (r) { return [esc(r.name), fmt(r.brands), fmt(r.nodes)]; })), 'wide')];
        },
        scrollmap: function (m) {
            if (!m) return [card('ScrollMap', '<p class="muted">Snapshot unavailable.</p>')];
            var pages = m.pages.map(function (x) { return pageLink(x.file, x.title); });
            var groups = m.groups.map(function (gr) {
                return card(gr.id + ' · ' + gr.name, list(gr.items.map(function (i) { return pageLink(i.page, i.page) + ' ' + badge(CLASS[i.status], LABEL[i.status]); })));
            });
            return [card('Pages · ' + m.pages.length, list(pages), 'wide')].concat(groups);
        },
        sectorgrid: function (m, p, g) {
            if (!g) return noGrid();
            var built = {}; (m ? m.sectors : []).forEach(function (s) { built[s.slug] = s.status; });
            var rows = sectorRows(g);
            return [card('Sector grid · ' + rows.length + ' sectors', '<div class="chips">' + rows.map(function (r) {
                var z = r.zone || {};
                return '<a class="chip col" href="' + esc(base + 'sectors/' + r.key + '/index.html') + '"><span>' + esc(r.name) + '</span>' +
                    '<span class="sub">' + fmt(r.brands) + ' brands · ' + fmt(r.nodes) + ' nodes' + (z.payoutTier ? ' · tier ' + esc(z.payoutTier) : '') + (z.region ? ' · ' + esc(z.region) : '') + '</span></a>';
            }).join('') + '</div>', 'wide')];
        },
        signin: function () {
            return [card('Admin sign-in', '<p class="muted">Admin sign-in opens with the ecosystem launch. No credentials are collected on this page.</p>' +
                '<a class="cta" href="' + esc(base + 'admin/admin-portal-approval.html') + '">Request admin access</a>')].concat(joinCards());
        },
        signup: function () {
            return [card('Join the ecosystem', '<p class="muted">Sign-up opens with the ecosystem launch. Until then, choose an access tier and request access.</p>' +
                '<a class="cta" href="' + esc(base + 'admin/admin-portal-approval.html') + '">Choose an access tier</a>')].concat(joinCards());
        },
        about: function (m, p, g) {
            var gm = g && g.admin && g.admin.globalMetrics, i = (m && m.intelligence) || {};
            return [card('FAA Systems™', '<p class="muted">FAA.zone™ is the Fruitful™ grid of brands, sectors and portals, run as one OmniGrid™. Every brand sits in a sector, every sector in the grid, and every page is reachable in-app.</p>'),
                card('The grid in numbers', list([fmt(gm && gm.totalBrands) + ' brands (' + fmt(gm && gm.coreBrands) + ' core)', fmt(m && m.sectors.length) + ' sectors',
                    fmt(m && m.pages.length) + ' portal and detail pages', fmt(i.repos && i.repos.total) + ' repositories', fmt(i.applications && i.applications.applications) + ' applications'])),
                card('Explore', list([pageLink('ecosystem.html', '🌍 Global Ecosystem'), pageLink('omnigrid_zone.html', '📦 7,000+ brands'), pageLink('sector-grid.html', '🏙️ Sector Grid'), pageLink('faa-hardware.html', '🖥️ Infrastructure')]))];
        },
        archive: function (m) {
            var ev = (m && m.milestones || []).map(function (x) { return '<div class="milestone"><div class="d">' + esc(x.date) + '</div><strong>' + esc(x.title) + '</strong><div>' + esc(x.detail) + '</div></div>'; }).join('');
            return [card('Baobab network', list([pageLink('baobab.html', '🌳 Baobab portal'), pageLink('baobab_terminal.html', '🛡️ Baobab Security Terminal'), pageLink('https://baobab.faa.zone', '🌐 baobab.faa.zone')])),
                card('Archive of milestones', '<div class="timeline">' + (ev || '<p class="muted">No entries yet.</p>') + '</div>', 'wide')];
        },
        connect: function (m, p) {
            var r = m && m.readiness;
            return [card('Live grid status', (p ? '<p class="big">' + led('green') + p.flow.green + ' green · ' + led('amber') + p.flow.amber + ' amber · ' + led('red') + p.flow.red + ' red</p>' : '') +
                    (r ? '<p class="muted">' + (r.built + r.in_app) + ' of ' + r.total + ' launch items reachable.</p>' : '') + pageLink('pulse-monitor.html', '📡 Open Signal Sync →')),
                card('Ways to connect', list([pageLink('admin/admin-portal-approval.html', '🔑 Request portal access'), pageLink('partner-program.html', '🤝 Partner Program'),
                    pageLink('developer-api.html', '🧬 Developer API'), pageLink('contact-support.html', '🆘 Contact Support')]))].concat(p ? p.stations.map(stationCard) : []);
        },
        contact: function () {
            return [card('Contact', '<p class="muted">Reach the FAA.zone™ team through the official contact and support pages.</p>' +
                    list([pageLink('https://faa.zone/contact-us.html', '✉️ Contact us'), pageLink('https://faa.zone/support.html', '🆘 Support')])),
                card('Access requests', '<p class="muted">For portal access tiers (Family, Shareholder, Service Provider, Loyalty):</p>' + pageLink('admin/admin-portal-approval.html', '🔑 Portal Access Approval →'))];
        },
        devapi: function (m, p, g) {
            var eps = [
                ['ecosystem-manifest.json', 'Pages, launch groups and readiness, sectors, domains, intelligence counts, milestones', m ? m.generated_at : null],
                ['omnigrid-pulse.json', 'The six pulse stations and the global green/amber/red flow', p ? p.generated_at : null],
                ['grid-data.json', 'Sector catalogue: brands, sub-nodes, tariff index, license ledger, clauses, tech stack', null]];
            return [card('Public data endpoints', '<p class="muted">Static JSON files served next to the pages. Read-only, counts and public catalogue only, no keys required.</p>' +
                    table(['File', 'Contains', 'Snapshot'], eps.map(function (e) { return [pageLink(e[0], e[0]), esc(e[1]), esc(e[2] ? e[2].slice(0, 10) : '—')]; })), 'wide'),
                card('Example', '<pre class="code">fetch(\'/ecosystem-manifest.json\')\n  .then(r =&gt; r.json())\n  .then(d =&gt; console.log(d.readiness));</pre>'),
                card('Front-end layer', list(['<code>omnigrid-app.js</code>: in-app routing, terminals, pulse hover', '<code>og-pages.js</code>: detail-page renderer']))];
        },
        partners: function (m, p, g) {
            var gr = g && g.admin && g.admin.licenseLedger && g.admin.licenseLedger.growth;
            return [card('Partner tracks', list(['🤝 Service Providers and distributors', '📦 Brand owners joining a sector', '🧬 Developers building on the public data'])),
                card('Commercial terms', list([pageLink('faa-distributor.html', '🤝 Distributor tariff index'), pageLink('licensing.html', '🔐 License tiers') + (gr ? ' · ' + gr.datasets.map(function (d) { return esc(d.label); }).join(', ') : '')])),
                card('Apply', '<p class="muted">Partner applications go through portal access.</p><a class="cta" href="' + esc(base + 'admin/admin-portal-approval.html') + '">Apply as a partner</a>')];
        },
        modules: function (m) {
            if (!m) return [card('Modules', '<p class="muted">Snapshot unavailable.</p>')];
            return m.groups.filter(function (gr) { return gr.id !== 'G'; }).map(function (gr) {
                var ok = gr.items.filter(function (i) { return i.status !== 'missing'; }).length;
                return card(gr.id + ' · ' + gr.name + ' (' + ok + '/' + gr.items.length + ')', list(gr.items.map(function (i) { return pageLink(i.page, i.page.replace(/\.html$/, '')) + ' ' + badge(CLASS[i.status], LABEL[i.status]); })));
            });
        },
        brands: function (m, p, g) {
            if (!g) return noGrid();
            var rows = sectorRows(g).filter(function (r) { return r.brands; });
            var html = rows.map(function (r) {
                return '<details class="pack"><summary>' + esc(r.name) + ' <span class="badge">' + fmt(r.brands) + ' brands</span></summary><div class="chips">' +
                    r.data.brands.map(function (b) { return '<span class="chip" data-q="' + esc(String(b).toLowerCase()) + '">' + esc(b) + '</span>'; }).join('') + '</div></details>';
            }).join('');
            setTimeout(function () {
                var q = document.getElementById('brand-q'); if (!q) return;
                q.addEventListener('input', function () {
                    var v = q.value.trim().toLowerCase();
                    document.querySelectorAll('details.pack').forEach(function (d) {
                        var any = false;
                        d.querySelectorAll('.chip').forEach(function (c) { var hit = !v || c.getAttribute('data-q').indexOf(v) !== -1; c.style.display = hit ? '' : 'none'; any = any || hit; });
                        d.style.display = any ? '' : 'none'; if (v) d.open = any;
                    });
                });
            }, 0);
            return [card('Global brands · ' + fmt(rows.reduce(function (t, r) { return t + r.brands; }, 0)) + ' catalogued',
                '<input id="brand-q" class="search" type="search" placeholder="Search brands…" aria-label="Search brands">' + html, 'wide')];
        },
        codenest: function (m) {
            var r = m && m.intelligence && m.intelligence.repos;
            return [card('CodeNest™', '<p class="muted">The code behind the grid: every portal, page and tool lives in version control.</p>' +
                    (r ? list([fmt(r.total) + ' repositories', fmt(r.public) + ' public · ' + fmt(r.private) + ' private', 'Every repository scanned for live keys']) : '')),
                card('New project', '<span id="new-project"></span><p class="muted">New projects start with portal access, then a repository and a sector.</p><a class="cta" href="' + esc(base + 'admin/admin-portal-approval.html') + '">Start a new project</a>'),
                card('Build blocks', list([pageLink('developer-api.html', '🧬 Developer API'), pageLink('plotvault.html', '🧩 Modules'), pageLink('faa-hardware.html', '🖥️ Infrastructure')]))];
        },
        legal: function () { return legalCards(cfg.doc); },
        fse: function () {
            var sheet = [['Product ID', 'FRU-CRE-3102'], ['VaultID', 'VAULT-939V'], ['Zone', 'C 2'], ['Security', 'FAA-SEC A+'],
                ['Active nodes', '1,580'], ['Pulse activity', '43,792 / sec'], ['Latency', '109 ms'], ['Compliance', 'Active & Certified']];
            return [card('The behavioural nervous system of the ecosystem',
                    '<p class="muted">Not a feature product: a <b>Human Volatility Dampener™</b> embedded inside VaultMesh™. Without it, governance becomes mechanical; with it, governance becomes adaptive.</p>', 'wide'),
                card('Product sheet', table(['Field', 'Value'], sheet.map(function (r) { return [esc(r[0]), esc(r[1])]; })) +
                    '<p class="muted">Figures as published in the FAA Actuary Mastery™ Final Loop Directive (13 Feb 2026).</p>'),
                card('What it governs', list(['Trust Velocity', 'Conflict Containment', 'Authenticity Stability', 'Relational Risk'])),
                card('Strategic position', list(['ContractCast™ governs agreements', 'Heat Map governs capital', 'REI governs entropy', '<b>Fruitful Social Engin™ governs the human signal</b>'])),
                card('The final loop', '<p class="big">Code → Governance → Human Signal</p>' +
                    list(['Build Phase', 'Ecosystem Governance Phase', 'Signal Intelligence Phase'])),
                card('Related', list([pageLink('pulse-monitor.html', '📡 Signal Sync'), pageLink('compliance.html', '🛡️ Compliance'), pageLink('ecosystem.html', '🌍 Global Ecosystem')]))];
        },
        access: function () {
            var tiers = ['👨‍👩‍👧‍👦 Family Access', '📊 Shareholder Access', '🤝 Service Provider', '🪙 Loyalty Access'];
            return tiers.map(function (t) {
                return card(t, '<p class="muted">Requests are reviewed before access is granted.</p>' +
                    '<a class="cta" href="https://faa.zone/contact-us.html">Request access</a>');
            });
        }
    };

    var NEEDS_GRID = /^(brandmetrics|clauses|distributor|hardware|owner|ledger|nodepacks|nodestatus|quick|layers|sectorgrid|about|partners|brands)$/.test(cfg.kind || '');
    Promise.all([get('ecosystem-manifest.json'), get('omnigrid-pulse.json'), NEEDS_GRID ? get('grid-data.json') : Promise.resolve(null)]).then(function (res) {
        var m = res[0], p = res[1], g = res[2];
        var head = '<section class="page-hero"><div class="container">' +
            '<p class="kicker"><a href="' + esc(base + 'dashboard.html') + '">⚙️ Dashboard</a> · <a href="' + esc(base + 'ecosystem.html') + '">🌍 Ecosystem</a></p>' +
            '<h1>' + esc(cfg.title) + '</h1>' + (cfg.intro ? '<p class="tagline">' + esc(cfg.intro) + '</p>' : '') +
            (cfg.figure ? '<div class="figure"><b>' + esc(cfg.figure) + '</b><span>Dashboard figure</span></div>' : '') +
            '</div></section>';
        var cards = (RENDER[cfg.kind] || function () { return []; })(m, p, g).filter(Boolean);
        root.innerHTML = head + '<section><div class="container"><div class="cards">' + cards.join('') + '</div>' +
            '<p class="snapshot">Live snapshot ' + esc(m ? m.generated_at.slice(0, 10) : 'unavailable') + ' · counts only</p></div></section>';
    });
})();
