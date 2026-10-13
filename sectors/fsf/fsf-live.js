// Live layer for the FSF dashboard (sectors/fsf/dashboard.html). The page is kept as designed; this script replaces its
// sample numbers with real ones by overriding the page's own global functions and data before it first draws:
//   projects          the FSF project register (this browser); "Create Project" now saves
//   farms             the farm register shared with 🌱 Agriculture (FruitfulLand, sectors/shared/land.js)
//   soil health chart soil moisture (3–9 cm) and reference ET0 at the first farm, Open-Meteo
//   texture chart     topsoil clay / sand / silt at the first farm, ISRIC SoilGrids
//   production chart  South Africa's crop, food and livestock production indices, World Bank / FAO
//   DNS               live records for fsf.seedwave.faa.zone (Cloudflare DNS over HTTPS)
//   harvest figure    the harvest log on tools.html
/* global appData, fsfBrands, fsfSubNodes, FruitfulLand */
(function () {
    'use strict';
    const L = window.FruitfulLand;
    const PKEY = 'fruitful.fsf.projects', HKEY = 'fruitful.fsf.harvests';
    const projects = () => L.store(PKEY) || [];
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const current = () => (location.hash.slice(1) || 'dashboard');
    const redraw = () => { try { renderViewContent(document.querySelector('.view:not(.view-hidden)')?.id.replace(/-view$/, '') || current()); } catch (e) { /* page not ready */ } };
    function heading(id, text) { const el = document.getElementById(id); const h = el && el.parentElement.querySelector('h4'); if (h) h.textContent = text; }

    // ---- nothing invented while live data loads ----
    appData.projects = projects();
    appData.emailAccounts = [];
    appData.dnsRecords = [];
    const sh = appData.dashboard.systemHealth;
    sh.labels = []; sh.datasets.forEach(d => { d.data = []; d.label = 'Loading live data…'; });
    ['deploymentTrends', 'royaltyDistribution', 'projectDistribution'].forEach(k => { appData.analytics[k].labels = []; appData.analytics[k].datasets.forEach(d => { d.data = []; }); });

    // ---- projects: a real register ----
    window.generateMockProjects = function () { appData.projects = projects(); };
    const baseRenderProjects = window.renderProjects;
    window.renderProjects = function () {
        baseRenderProjects();
        const box = document.getElementById('projectsList');
        if (!box) return;
        if (!appData.projects.length) {
            box.innerHTML = '<p class="text-gray-400">No FSF projects yet. Open <b>New Project</b> to create the first one; it is saved in this browser.</p>';
            return;
        }
        box.querySelectorAll('.project-card').forEach((card, i) => {
            const p = appData.projects[i];
            const meta = document.createElement('p');
            meta.className = 'text-xs text-gray-400 mt-2';
            meta.innerHTML = esc(p.template || '') + (p.description ? ' · ' + esc(p.description).slice(0, 160) : '') + '<br>Last activity: ' + esc(p.lastActivity);
            card.insertBefore(meta, card.querySelector('.mt-4'));
            const bar = card.querySelector('.mt-4');
            const next = { draft: 'pending', pending: 'live', live: 'draft' }[p.status] || 'draft';
            bar.insertAdjacentHTML('beforeend', '<button class="form-action-button secondary text-xs px-2 py-1" data-fsf-status="' + esc(p.id) + '">Mark ' + next + '</button>' +
                '<button class="form-action-button secondary text-xs px-2 py-1" data-fsf-delete="' + esc(p.id) + '">Delete</button>' +
                (p.tool ? '<a class="form-action-button secondary text-xs px-2 py-1" href="' + esc(p.tool) + '">Open tool</a>' : ''));
        });
    };
    document.addEventListener('click', e => {
        const s = e.target.closest('[data-fsf-status]'), d = e.target.closest('[data-fsf-delete]');
        if (!s && !d) return;
        const all = projects();
        const i = all.findIndex(p => p.id === (s || d).getAttribute(s ? 'data-fsf-status' : 'data-fsf-delete'));
        if (i < 0) return;
        if (d) { if (!confirm('Delete project "' + all[i].name + '"?')) return; all.splice(i, 1); }
        else { all[i].status = { draft: 'pending', pending: 'live', live: 'draft' }[all[i].status] || 'draft'; all[i].lastActivity = new Date().toLocaleDateString(); }
        L.store(PKEY, all); appData.projects = all; renderProjects();
    });
    // each template opens the tool that does that job
    const TOOL = { 'Soil Analysis Dashboard': 'tools.html#soil-fit', 'Crop Rotation Planner': 'tools.html#rotation',
        'Harvest & Yield Log': 'tools.html#harvest', 'Farm-to-Table Marketplace': '../trade/index.html' };
    function wireForm() {
        const form = document.getElementById('newProjectForm');
        if (!form || form.dataset.live) return;
        form.dataset.live = '1';
        form.addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('projectName').value.trim(), template = document.getElementById('template').value;
            if (!name || !template) { showStandardModal('Input Required', 'Please provide a project name and select a template.', true); return; }
            const all = projects();
            const p = { id: 'FSF-' + Date.now().toString(36).toUpperCase(), name, template, description: document.getElementById('description').value.trim(),
                status: 'draft', lastActivity: new Date().toLocaleDateString(), created: new Date().toISOString(), tool: TOOL[template] || '' };
            all.unshift(p); L.store(PKEY, all); appData.projects = all;
            form.reset();
            showStandardModal('Project created', '"' + esc(name) + '" is saved as a draft.' + (p.tool ? ' Its tool: <a href="' + p.tool + '" style="text-decoration:underline">open</a>.' : ''), true);
            showView('projects');
        });
    }

    // ---- headline figures ----
    const baseMetrics = window.updateDashboardMetrics;
    window.updateDashboardMetrics = function () {
        appData.dashboard.totalProjects = appData.projects.length;
        appData.dashboard.liveScrolls = L.farms().length;
        const tons = (L.store(HKEY) || []).reduce((a, h) => a + (h.unit === 'kg' ? h.qty / 1000 : +h.qty || 0), 0);
        appData.dashboard.monthlyRoyalties = tons;
        baseMetrics();
        heading('liveScrollsCount', 'Farms in the shared register');
        heading('monthlyRoyalties', 'Harvest logged (tonnes)');
        const m = document.getElementById('monthlyRoyalties');
        if (m) m.textContent = tons.toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' t';
    };
    const projDist = () => {
        const c = {};
        appData.projects.forEach(p => { c[p.template || 'Other'] = (c[p.template || 'Other'] || 0) + 1; });
        appData.analytics.projectDistribution.labels = Object.keys(c);
        appData.analytics.projectDistribution.datasets[0].data = Object.values(c);
    };

    // ---- AI says when it is not connected ----
    window.callGeminiAPI = async function (prompt, statusElementId) {
        const s = document.getElementById(statusElementId);
        if (s) { s.innerHTML = 'AI is not connected yet (it needs a server-side key). The rotation planner, harvest log and soil fit in <a href="tools.html" style="text-decoration:underline">FSF Tools</a> work now.'; s.classList.remove('hidden'); }
        return null;
    };

    // ---- settings: real DNS, no invented mailboxes ----
    window.renderDnsRecords = async function () {
        const body = document.getElementById('dnsRecordsTableBody');
        if (!body) return;
        body.innerHTML = '<tr><td colspan="3">Looking up fsf.seedwave.faa.zone…</td></tr>';
        const rows = [];
        for (const type of ['A', 'AAAA', 'CNAME', 'MX', 'TXT']) {
            try {
                const r = await fetch('https://cloudflare-dns.com/dns-query?name=fsf.seedwave.faa.zone&type=' + type, { headers: { accept: 'application/dns-json' } }).then(x => x.json());
                (r.Answer || []).forEach(a => rows.push('<tr><td>' + esc({ 1: 'A', 28: 'AAAA', 5: 'CNAME', 15: 'MX', 16: 'TXT' }[a.type] || a.type) + '</td><td>' + esc(a.name) + '</td><td>' + esc(a.data) + '</td></tr>'));
            } catch (e) { /* skip this type */ }
        }
        body.innerHTML = (rows.length ? [...new Set(rows)].join('') : '<tr><td colspan="3">No public DNS records found for fsf.seedwave.faa.zone.</td></tr>') +
            '<tr><td colspan="3" class="text-xs text-gray-400">Live from public DNS (Cloudflare 1.1.1.1). Changes are made with the domain\'s DNS host, not here.</td></tr>';
    };
    window.renderEmailAccounts = function () {
        const body = document.getElementById('emailAccountsTableBody');
        if (body) body.innerHTML = '<tr><td colspan="3">No mailboxes are connected to this dashboard yet.</td></tr>';
    };

    // ---- live charts ----
    async function live() {
        const home = await L.homeFarm();
        try {
            const d = await L.daily(home.latitude, home.longitude, 14, 7);
            sh.labels = d.time.map(t => t.slice(5));
            sh.datasets[0].label = 'Soil moisture 3–9 cm (% by volume) · ' + home.label;
            sh.datasets[0].data = d.soilMoisture.map(v => v == null ? null : Math.round(v * 1000) / 10);
            sh.datasets[1].label = 'Crop water demand, reference ET₀ (mm/day)';
            sh.datasets[1].data = d.et0;
        } catch (e) { sh.datasets[0].label = 'Weather data unavailable right now'; }
        try {
            const s = await L.soil(home.latitude, home.longitude, ['clay', 'sand', 'silt'], ['0-5cm']);
            const t = appData.analytics.royaltyDistribution;
            if (s) {
                t.labels = ['Clay', 'Sand', 'Silt'];
                t.datasets[0].data = ['clay', 'sand', 'silt'].map(k => Math.round(s.values[k]['0-5cm'] * 10) / 10);
                t.datasets[0].backgroundColor = ['#a16207', '#facc15', '#84cc16'];
                t.datasets[0].label = 'Topsoil texture (%)';
            }
            const h = [...document.querySelectorAll('#analytics-view h4')].find(x => /Nutrient/.test(x.textContent));
            if (h) h.textContent = 'Topsoil texture, 0–5 cm (%) · SoilGrids · ' + home.label + (s && s.shifted ? ' (nearest farmland)' : '');
        } catch (e) { /* SoilGrids busy: chart stays empty */ }
        try {
            const ids = [['AG.PRD.CROP.XD', 'Crop production', '#22c55e'], ['AG.PRD.FOOD.XD', 'Food production', '#f59e0b'], ['AG.PRD.LVSK.XD', 'Livestock production', '#ef4444']];
            const series = await Promise.all(ids.map(([id]) => L.json('https://api.worldbank.org/v2/country/ZAF/indicator/' + id + '?format=json&per_page=30&date=2010:2030')));
            const years = [...new Set(series.flatMap(s => (s[1] || []).filter(x => x.value != null).map(x => x.date)))].sort();
            const p = appData.analytics.deploymentTrends;
            p.labels = years;
            p.datasets = ids.map(([, label, color], i) => ({ label, backgroundColor: color, data: years.map(y => { const r = (series[i][1] || []).find(x => x.date === y); return r ? Math.round(r.value * 10) / 10 : null; }) }));
            const h = [...document.querySelectorAll('#analytics-view h4')].find(x => /Crop Yield/.test(x.textContent));
            if (h) h.textContent = 'South Africa: production indices (2014–2016 = 100) · World Bank / FAO';
        } catch (e) { /* World Bank unavailable */ }
        redraw();
    }

    function start() {
        wireForm(); projDist();
        // the brand count in the ecosystem map text comes from the list itself
        const intro = document.querySelector('#ecosystem-map-view .section-intro');
        if (intro) intro.textContent = intro.textContent.replace(/all \d+ brands/, 'all ' + fsfBrands.length + ' brands');
        live();
    }
    const baseRender = window.renderViewContent;
    window.renderViewContent = function (v) { projDist(); return baseRender(v); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
