// Live data for the Global Agriculture Dashboard. Replaces the original's fixed sample numbers with public sources
// that need no key and allow browser calls:
//   World Bank indicators API      world cereal production, cereal yield by country
//   Open-Meteo forecast + archive   rainfall and FAO-56 reference evapotranspiration (ET0) at each farm
//   Open-Meteo geocoding            a farm's location name -> coordinates
//   ISRIC SoilGrids                 topsoil nitrogen, organic carbon, pH and clay at the first farm
// Farm figures come only from the farm register. Where nothing is known yet the chart stays empty and says why.
(function () {
    'use strict';
    const D = () => window.agriDashboardData;
    const HOME = { name: 'Pretoria (add a farm to use yours)', latitude: -25.7479, longitude: 28.2293 };
    const ACRE_HA = 0.404686;
    let farms = [];
    let located = []; // farms with coordinates
    const markers = [];

    function cache(key, value) {
        try {
            if (value === undefined) return JSON.parse(localStorage.getItem('fruitful.agri.' + key) || 'null');
            localStorage.setItem('fruitful.agri.' + key, JSON.stringify(value));
        } catch (e) { return null; }
    }
    async function json(url) {
        const r = await fetch(url);
        if (!r.ok) throw new Error(r.status + ' ' + url);
        return r.json();
    }
    function refresh() { if (window.agriRefresh) window.agriRefresh(); fixYieldText(); }
    function set(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }
    function heading(id, text) { const el = document.getElementById(id); const h = el && el.parentElement.querySelector('h4'); if (h) h.textContent = text; }
    const ymd = d => d.toISOString().slice(0, 10);

    async function locate(farm) {
        const q = String(farm.location || '').split(',')[0].trim();
        if (!q) return null;
        const hit = cache('geo:' + farm.location);
        if (hit) return hit;
        const cc = (String(farm.location).match(/,\s*([A-Za-z]{2})\s*$/) || [])[1]; // "Bethlehem, ZA" -> ZA
        const r = await json('https://geocoding-api.open-meteo.com/v1/search?count=1&language=en&name=' + encodeURIComponent(q) + (cc ? '&countryCode=' + cc.toUpperCase() : ''));
        const g = r.results && r.results[0];
        if (!g) return null;
        const out = { latitude: g.latitude, longitude: g.longitude, place: [g.name, g.admin1, g.country_code].filter(Boolean).join(', ') };
        cache('geo:' + farm.location, out);
        return out;
    }

    // ---- world figures (World Bank) ----
    async function worldBank() {
        const d = D();
        try {
            const prod = await json('https://api.worldbank.org/v2/country/WLD/indicator/AG.PRD.CREL.MT?format=json&per_page=60&date=2010:2030');
            const rows = (prod[1] || []).filter(x => x.value != null).sort((a, b) => a.date - b.date);
            // the newest year is often only partly reported; leave it out until it is within 15% of the year before
            while (rows.length > 1 && rows[rows.length - 1].value < 0.85 * rows[rows.length - 2].value) rows.pop();
            d.charts.globalYieldGrowth.labels = rows.map(x => x.date);
            d.charts.globalYieldGrowth.datasets[0].data = rows.map(x => Math.round(x.value / 1e6));
            d.charts.globalYieldGrowth.datasets[0].label = 'World cereal production (million tonnes) · World Bank / FAO';
        } catch (e) { d.charts.globalYieldGrowth.datasets[0].label = 'World cereal production: World Bank did not answer, try again later'; }
        try {
            const c = 'ZAF;USA;BRA;IND;NGA';
            const y = await json('https://api.worldbank.org/v2/country/' + c + '/indicator/AG.YLD.CREL.KG?format=json&mrnev=1&per_page=20');
            const rows = (y[1] || []).filter(x => x.value != null);
            d.charts.cropYieldTrend.labels = rows.map(x => x.country.value + ' (' + x.date + ')');
            d.charts.cropYieldTrend.datasets[0].data = rows.map(x => Math.round(x.value));
            d.charts.cropYieldTrend.datasets[0].label = 'Cereal yield (kg per hectare) · World Bank / FAO';
            const w = await json('https://api.worldbank.org/v2/country/WLD/indicator/AG.YLD.CREL.KG?format=json&mrnev=1');
            const v = w[1] && w[1][0];
            if (v) {
                heading('commodityPriceIndex', 'World cereal yield · World Bank / FAO, ' + v.date);
                d.metrics.commodityPrice = v.value; // shown by the page as $x.xx; corrected just below
            }
        } catch (e) { /* leave the charts empty */ }
        refresh();
        fixYieldText();
    }
    function fixYieldText() {
        const el = document.getElementById('commodityPriceIndex');
        const v = D().metrics.commodityPrice;
        if (el && v && /World cereal/.test(el.parentElement.querySelector('h4').textContent)) el.textContent = Math.round(v).toLocaleString() + ' kg/ha';
    }

    // ---- weather and water at the farms (Open-Meteo) ----
    async function water() {
        const d = D();
        const first = located[0] || HOME;
        const where = located[0] ? (located[0].farm.name + ', ' + located[0].place) : HOME.name;
        try {
            const f = await json('https://api.open-meteo.com/v1/forecast?daily=precipitation_sum,et0_fao_evapotranspiration&forecast_days=7&timezone=auto&latitude=' + first.latitude + '&longitude=' + first.longitude);
            d.charts.resourceConsumption.labels = f.daily.time.map(t => t.slice(5));
            d.charts.resourceConsumption.datasets[0].label = 'Rain forecast (mm) · ' + where;
            d.charts.resourceConsumption.datasets[0].data = f.daily.precipitation_sum;
            d.charts.resourceConsumption.datasets[1].label = 'Crop water demand, reference ET₀ (mm)';
            d.charts.resourceConsumption.datasets[1].data = f.daily.et0_fao_evapotranspiration;
            const need = f.daily.et0_fao_evapotranspiration.reduce((a, b) => a + b, 0) - f.daily.precipitation_sum.reduce((a, b) => a + b, 0);
            heading('forecastedYield', 'Irrigation gap, next 7 days (mm, ET₀ minus rain) · ' + (located[0] ? located[0].farm.name : 'Pretoria'));
            d.metrics.forecastedYield = Math.max(0, Math.round(need));
        } catch (e) { d.charts.resourceConsumption.datasets[0].label = 'Forecast unavailable right now'; }
        try {
            const end = new Date(Date.now() - 5 * 864e5), start = new Date(end.getFullYear(), end.getMonth() - 5, 1);
            const a = await json('https://archive-api.open-meteo.com/v1/archive?daily=precipitation_sum,et0_fao_evapotranspiration&timezone=auto&latitude=' + first.latitude + '&longitude=' + first.longitude + '&start_date=' + ymd(start) + '&end_date=' + ymd(end));
            const months = {};
            a.daily.time.forEach((t, i) => {
                const m = t.slice(0, 7);
                months[m] = months[m] || { rain: 0, et0: 0 };
                months[m].rain += a.daily.precipitation_sum[i] || 0;
                months[m].et0 += a.daily.et0_fao_evapotranspiration[i] || 0;
            });
            const keys = Object.keys(months).sort();
            const ch = d.charts.cropHealth;
            ch.labels = keys;
            ch.datasets[0].label = 'Monthly rainfall (mm) · ' + where;
            ch.datasets[0].data = keys.map(k => Math.round(months[k].rain));
            ch.datasets[1] = { label: 'Monthly reference ET₀ (mm)', data: keys.map(k => Math.round(months[k].et0)), borderColor: '#f6ad55', backgroundColor: 'rgba(246,173,85,0.15)', fill: false, tension: 0.4 };
        } catch (e) { d.charts.cropHealth.datasets[0].label = 'Rainfall history unavailable right now'; }
        // per-farm water need over the last 30 days: ET0 (mm) x area (ha) / 100 = megalitres
        const wu = d.charts.waterUsage;
        wu.labels = []; wu.datasets[0].data = [];
        wu.datasets[0].label = located.length ? 'Reference water need, last 30 days (ML) · Open-Meteo ET₀ × farm area' : 'Add farms with a location and size to see their water need';
        for (const l of located.slice(0, 10)) {
            try {
                const r = await json('https://api.open-meteo.com/v1/forecast?daily=et0_fao_evapotranspiration&past_days=30&forecast_days=1&timezone=auto&latitude=' + l.latitude + '&longitude=' + l.longitude);
                const et0 = r.daily.et0_fao_evapotranspiration.slice(0, 30).reduce((a, b) => a + (b || 0), 0);
                const ha = (parseFloat(l.farm.size) || 0) * ACRE_HA;
                wu.labels.push(l.farm.name);
                wu.datasets[0].data.push(Math.round(et0 * ha / 100 * 10) / 10);
            } catch (e) { /* skip this farm */ }
        }
        refresh();
        fixYieldText();
    }

    // ---- topsoil at the first farm (SoilGrids) ----
    async function soil() {
        const d = D();
        const first = located[0] || HOME;
        const s = d.charts.soilNutrientLevels;
        try {
            // a town centre is built-up land with no soil values; then the nearest farmland around it (about 3-4 km out) is used
            let r = null, val = {}, shifted = false;
            for (const [dy, dx] of [[0, 0], [0.03, 0], [-0.03, 0], [0, 0.03], [0, -0.03], [0.03, 0.03], [-0.03, -0.03], [0.03, -0.03], [-0.03, 0.03]]) {
                r = await json('https://rest.isric.org/soilgrids/v2.0/properties/query?depth=0-5cm&value=mean&property=nitrogen&property=soc&property=phh2o&property=clay&lon=' + (first.longitude + dx) + '&lat=' + (first.latitude + dy));
                val = {};
                r.properties.layers.forEach(l => { const v = l.depths[0].values.mean; val[l.name] = v == null ? null : v / l.unit_measure.d_factor; });
                if (Object.values(val).some(v => v != null)) { shifted = !!(dx || dy); break; }
            }
            s.labels = ['Nitrogen (g/kg)', 'Organic carbon (g/kg)', 'pH (water)', 'Clay (%)'];
            s.datasets[0].data = [val.nitrogen, val.soc, val.phh2o, val.clay].map(v => v == null ? 0 : Math.round(v * 10) / 10);
            s.datasets[0].label = 'Topsoil 0–5 cm · ISRIC SoilGrids · ' + (located[0] ? located[0].farm.name : 'Pretoria') + (shifted ? ' (nearest farmland, ~3 km)' : '');
            if (!Object.values(val).some(v => v != null)) { s.labels = []; s.datasets[0].data = []; s.datasets[0].label = 'No SoilGrids values around this location'; }
            s.datasets[0].backgroundColor = ['rgba(120,70,0,0.8)', 'rgba(56,161,105,0.8)', 'rgba(99,179,237,0.8)', 'rgba(246,173,85,0.8)'];
        } catch (e) { s.labels = []; s.datasets[0].data = []; s.datasets[0].label = 'SoilGrids did not answer, try again later'; }
        refresh();
    }

    // ---- what the register itself says ----
    function fromRegister() {
        const d = D();
        d.metrics.activeCropArea = farms.filter(f => f.status !== 'inactive').reduce((a, f) => a + (parseFloat(f.size) || 0), 0);
        const herd = {};
        farms.forEach(f => (f.subnodeMetrics || []).forEach(m => { if (m.livestockType) herd[m.livestockType] = (herd[m.livestockType] || 0) + (parseInt(m.count) || 0); }));
        const lh = d.charts.livestockHealth;
        lh.labels = Object.keys(herd);
        lh.datasets[0].data = Object.values(herd);
        lh.datasets[0].label = lh.labels.length ? 'Head of livestock (from your farms)' : 'No livestock groups recorded yet';
        const list = document.getElementById('topCropsList');
        if (list) {
            const byCrop = {};
            farms.forEach(f => { if (f.primaryCrop) byCrop[f.primaryCrop] = (byCrop[f.primaryCrop] || 0) + (parseFloat(f.size) || 0); });
            const rows = Object.entries(byCrop).sort((a, b) => b[1] - a[1]);
            list.innerHTML = rows.length ? rows.map(([c, a]) => '<li>' + c.replace(/</g, '&lt;') + ': ' + a.toLocaleString() + ' acres registered</li>').join('')
                : '<li>Add farms in Farm Management to rank your crops by area.</li>';
        }
    }

    async function onFarms(list) {
        farms = list || [];
        fromRegister();
        located = [];
        for (const f of farms) {
            try { const g = await locate(f); if (g) located.push({ ...g, farm: f }); } catch (e) { /* unknown place */ }
        }
        drawMarkers();
        refresh();
        water();
        soil();
    }

    function drawMarkers() {
        const map = window.agriLeafletMap;
        if (!map || !window.L) return;
        markers.splice(0).forEach(m => m.remove());
        located.forEach(l => {
            const m = L.marker([l.latitude, l.longitude]).addTo(map).bindPopup('<b>' + String(l.farm.name).replace(/</g, '&lt;') + '</b><br>' + l.place + '<br><span class="wx">Loading weather…</span>');
            m.on('popupopen', async () => {
                try {
                    const r = await json('https://api.open-meteo.com/v1/forecast?current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&latitude=' + l.latitude + '&longitude=' + l.longitude);
                    const c = r.current;
                    m.getPopup().setContent('<b>' + String(l.farm.name).replace(/</g, '&lt;') + '</b><br>' + l.place + '<br>' + c.temperature_2m + ' °C · humidity ' + c.relative_humidity_2m + '% · rain ' + c.precipitation + ' mm · wind ' + c.wind_speed_10m + ' km/h<br><small>Open-Meteo, now</small>');
                } catch (e) { m.getPopup().setContent('<b>' + l.farm.name + '</b><br>Weather unavailable right now'); }
            });
            markers.push(m);
        });
        if (located.length) map.fitBounds(L.latLngBounds(located.map(l => [l.latitude, l.longitude])), { maxZoom: 9, padding: [30, 30] });
    }

    document.addEventListener('agri:farms', e => onFarms(e.detail));
    document.addEventListener('agri:map', drawMarkers);
    function start() {
        if (!D()) return setTimeout(start, 100);
        const d = D();
        // nothing invented is shown while the live figures load
        ['cropHealth', 'resourceConsumption', 'globalYieldGrowth', 'cropYieldTrend', 'livestockHealth', 'waterUsage', 'soilNutrientLevels'].forEach(k => {
            d.charts[k].labels = [];
            d.charts[k].datasets.forEach(ds => { ds.data = []; ds.label = 'Loading live data…'; });
        });
        d.metrics.activeCropArea = 0; d.metrics.forecastedYield = 0; d.metrics.commodityPrice = 0;
        refresh();
        worldBank();
        if (farms.length) onFarms(farms); else { water(); soil(); }
    }
    start();
})();
