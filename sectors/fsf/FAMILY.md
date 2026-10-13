# Food, Soil & Farming family ledger

Every FSF version found and what happened to it. Built 2026-10-08 from the systems index, every branch of every repo
(`tools/sector_sweep.py`), the unpacked Replit export (`Claude_master/ReplitExport-heynsschoeman`, 31 apps), the Replit
register, the Claude export index and the Google Drive audit. The branch sweep found 908 files that mention FSF; only 9 distinct page versions are FSF pages (the dashboard and the app's own sector pages), the rest are sector lists that include FSF among the others.

**Home:** `sectors/fsf/` (🥦 Food, Soil & Farming, second sector in grid-data, sector-atlas and the ecosystem manifest).
**Hub:** `dashboard.html`. **Tools:** `tools.html`. **Shared with 🌱 Agriculture:** `sectors/shared/land.js`.

| First seen | Repo | Path | Title | Blob | Fate |
|---|---|---|---|---|---|
| 2025-06-29 | fsf.seedwave.faa.zone | `index.html` (8ad102e) | FSF \| CodeNest™ Dashboard - Food, Soil & Farming (AI Enhanced) | `3d843b0d` | **superseded** the same day by the tail |
| 2025-06-29 | fsf.seedwave.faa.zone | `index.html` (2d95935) | FSF \| CodeNest™ Dashboard - Food, Soil & Farming (AI Enhanced) | `e0f4768d` | **TAIL, added as the hub**: sectors/fsf/dashboard.html (page unchanged apart from cross-links and two script tags; live data from fsf-live.js) |
| 2025-12-26 | codenest | `packages/seedwave-sectors/fsf/index.html` | same | `e0f4768d` | **copy** of the tail |
| 2026-05-14 | fsf.seedwave.faa.zone | `HEATMAP.md` (branch claude/review-repos-heatmap-planning) | heatmap planning note | | **planning doc**, no page |
| 2025-12-26 | codenest | `packages/seedwave-sectors/nutrition/index.html` | FAA™ Nutrition & Food Chain Dashboard | `63f24394` | **other sector**: ✿ Nutrition & Food Chain |
| 2025-12-09 | Google Drive | `FSF_food.zip` (4.3 MB) | | | **to open** with the owner's yes (download from Drive) |
| 2026-02-25 | Google Drive | folder `soilpulse` | | | **to check**: SoilPulse is an Agriculture brand |
| 2026-03-02 | Replit | Frtuiful Kitchens (local zip, 214 MB) | Kitchen Configuration Engine | | **other sector**: kitchen cabinetry, 🏗️ Housing |
| 2026-09-27 | fruitful | `sectors/fsf/index.html` | 🥦 Food, Soil & Farming | in place | **kept**: the sector page (brands, nodes, tariff) |
| 2026-09-27 | fruitful | `sectors/food/index.html` (and its copy in the Banimal connector) | Food, Soil & Farming · Fruitful™ OmniGrid™ | 4 versions | **same sector, second address**: kept so old links work; it shows the same sector page |

## Brands, atom by atom

- `grid-data.json`, the FSF dashboard and the ecosystem index agree exactly: **83 entries, 81 distinct names**.
  `AgroTech` (entries 18 and 32) and `EcoFarm` (20 and 40) each appear twice with **different** subnodes, so these are
  four brand lines carrying two names. Subnodes: 332 entries, 322 distinct. Nothing was renamed here; the owner decides.
- FruitfulPlanetChange's sync scripts (repo and Replit export) carry six other FSF lists of 36 to 51 names with
  **38 names not in grid-data** (e.g. SoilPro, FarmCore, CropMax, SoilWise, HarvestSync, SeedTech); two of them, EcoSeed and
  SoilNet, belong to other sectors. Listed in `fruitful-superagent/.deps/runs/fsf-brand-variants.txt`; not added as brands
  until the owner confirms them.

## What changed on the way in

- **No invented data.** The page's 124 projects, 98 soil nodes, $8,450 royalties, 20 generated projects, sample charts and
  three made-up mailboxes are no longer shown. Projects come from the register; figures from the shared farm register and the
  harvest log; charts from Open-Meteo (soil moisture, ET0), ISRIC SoilGrids (texture) and the World Bank (South African crop,
  food and livestock production indices); DNS is looked up live.
- **"Create Project" works.** It did nothing before (the form had no handler).
- **Cross-pollination.** Agriculture and FSF read the same farms through `sectors/shared/land.js`; Agriculture links to the
  FSF tools and back. A farm added once drives water need, soil fit, rotation fields, harvest log and both dashboards.
- **AI** says when it is not connected (no key on the page).
