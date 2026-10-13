// FruitfulLand: the land data every farming sector shares (🌱 Agriculture & Biotech, 🥦 Food, Soil & Farming, …).
// One farm register, one way to locate a place, one soil reader and one weather reader, so a farm added in any sector
// is the same farm everywhere. Public sources, no keys: Open-Meteo (geocoding, forecast, archive), ISRIC SoilGrids.
(function () {
    'use strict';
    // the Agriculture dashboard's register on this device (farm-register.js keeps it under this key when Firebase is not set up)
    const FARMS = 'fruitful.agri.register:artifacts/default-app-id/users/this-device/farms';
    const PRETORIA = { name: 'Pretoria', place: 'Pretoria, Gauteng, ZA', latitude: -25.7479, longitude: 28.2293 };

    function store(key, value) {
        try {
            if (value === undefined) return JSON.parse(localStorage.getItem(key) || 'null');
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) { return null; }
    }
    async function json(url) {
        const r = await fetch(url);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
    }

    /** Every farm in the shared register: [{id, name, location, primaryCrop, size (acres), status, …}] */
    function farms() {
        return Object.entries(store(FARMS) || {}).map(([id, f]) => Object.assign({ id }, f));
    }

    /** "Bethlehem, ZA" -> {latitude, longitude, place}; cached per name. */
    async function locate(name) {
        const text = String(name || '').trim();
        if (!text) return null;
        const hit = store('fruitful.agri.geo:' + text);
        if (hit) return hit;
        const cc = (text.match(/,\s*([A-Za-z]{2})\s*$/) || [])[1];
        const r = await json('https://geocoding-api.open-meteo.com/v1/search?count=1&language=en&name=' + encodeURIComponent(text.split(',')[0].trim()) + (cc ? '&countryCode=' + cc.toUpperCase() : ''));
        const g = r.results && r.results[0];
        if (!g) return null;
        const out = { latitude: g.latitude, longitude: g.longitude, place: [g.name, g.admin1, g.country_code].filter(Boolean).join(', ') };
        store('fruitful.agri.geo:' + text, out);
        return out;
    }

    /** The first registered farm that can be located, or Pretoria (marked as the default). */
    async function homeFarm() {
        for (const f of farms()) {
            try { const g = await locate(f.location); if (g) return Object.assign({ farm: f, label: f.name }, g); } catch (e) { /* next */ }
        }
        return Object.assign({ farm: null, label: 'Pretoria (add a farm to use yours)' }, PRETORIA);
    }

    /** SoilGrids mean values at a point. A built-up centre has no values, so the nearest farmland ~3 km out is used.
     *  Returns {values: {property: {depthLabel: number}}, units, latitude, longitude, shifted}. */
    async function soil(lat, lon, props, depths) {
        props = props || ['phh2o', 'soc', 'nitrogen', 'clay', 'sand', 'silt'];
        depths = depths || ['0-5cm'];
        const q = 'value=mean&' + depths.map(d => 'depth=' + d).join('&') + '&' + props.map(p => 'property=' + p).join('&');
        for (const [dy, dx] of [[0, 0], [0.03, 0], [-0.03, 0], [0, 0.03], [0, -0.03], [0.03, 0.03], [-0.03, -0.03], [0.03, -0.03], [-0.03, 0.03]]) {
            const r = await json('https://rest.isric.org/soilgrids/v2.0/properties/query?' + q + '&lon=' + (lon + dx) + '&lat=' + (lat + dy));
            const values = {}, units = {};
            let any = false;
            r.properties.layers.forEach(l => {
                values[l.name] = {}; units[l.name] = l.unit_measure.target_units;
                l.depths.forEach(d => { const v = d.values.mean; values[l.name][d.label] = v == null ? null : v / l.unit_measure.d_factor; if (v != null) any = true; });
            });
            if (any) return { values, units, latitude: lat + dy, longitude: lon + dx, shifted: !!(dx || dy) };
        }
        return null;
    }

    /** Daily weather for a point: {time[], et0[], rain[], soilMoisture[] (m³/m³, 3–9 cm, daily mean)} for past and forecast days. */
    async function daily(lat, lon, pastDays, forecastDays) {
        const r = await json('https://api.open-meteo.com/v1/forecast?timezone=auto&latitude=' + lat + '&longitude=' + lon +
            '&daily=et0_fao_evapotranspiration,precipitation_sum&hourly=soil_moisture_3_to_9cm&past_days=' + (pastDays || 0) + '&forecast_days=' + (forecastDays || 7));
        const sm = {};
        r.hourly.time.forEach((t, i) => { const d = t.slice(0, 10), v = r.hourly.soil_moisture_3_to_9cm[i]; if (v != null) (sm[d] = sm[d] || []).push(v); });
        return {
            time: r.daily.time, et0: r.daily.et0_fao_evapotranspiration, rain: r.daily.precipitation_sum,
            soilMoisture: r.daily.time.map(d => sm[d] ? sm[d].reduce((a, b) => a + b, 0) / sm[d].length : null)
        };
    }

    window.FruitfulLand = { farms, locate, homeFarm, soil, daily, store, json, FARMS };
})();
