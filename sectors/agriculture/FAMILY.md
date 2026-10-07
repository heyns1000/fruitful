# Agriculture & Biotech family ledger

Every agriculture page version found across the 127 repos and what happened to it. Built 2026-10-07 from `fruitful-superagent/index/systems/systems.json`, the history of `heyns1000/agriculture.seedwave.faa.zone`, the Replit register and the Claude export index.

**Home:** `sectors/agriculture/` in the Fruitful app (🌱 Agriculture & Biotech, first sector in 5 of the 6 sector lists). **Hub:** `dashboard.html`, the Global Agriculture Dashboard, with the farm register and live data. **Tools:** `tools.html`.

| First seen | Repo | Path | Title | Blob | Fate |
|---|---|---|---|---|---|
| 2025-06-29 | agriculture.seedwave.faa.zone | `index.html` (c135278) | Agriculture.Seedwave.FAA.zone™ - Global Agri-Grid | `25b4f51f` | **became overview.html**: the first index, moved to `overview.html` in the same repo on 2025-07-03 (same blob) |
| 2025-06-30 | agriculture.seedwave.faa.zone | `index.html` (17ff1c2) | Fruitful \| Global Agriculture Dashboard | `8f9291f7` | **superseded**: every id and heading is in the tail |
| 2025-07-02 | agriculture.seedwave.faa.zone | `index.html` (75f3cc4) | Fruitful \| Global Agriculture Dashboard | `fe738203` | **superseded**: every id and heading is in the tail |
| 2025-07-03 | agriculture.seedwave.faa.zone | `overview.html` | Agriculture.Seedwave.FAA.zone™ - Global Agri-Grid | `25b4f51f` | **TAIL, added**: sectors/agriculture/overview.html (key list emptied, 6 dead links wired to app pages) |
| 2025-07-11 | agriculture.seedwave.faa.zone | `index.html` (7aefee5) | Fruitful \| Global Agriculture Dashboard | `fe026d32` | **TAIL, added as the hub**: sectors/agriculture/dashboard.html (50 invented farms and sample charts replaced by the farm register and live data; keys removed) |
| 2025-07-02 | agriculture.seedwave.faa.zone | `about.html` | Fruitful™ \| About Us | `fe0989e2` | **TAIL, added**: sectors/agriculture/about.html |
| 2025-07-02 | agriculture.seedwave.faa.zone | `home.html` = `infographic.html` | Infographic: The Future of Farming is Fruitful™ | `b88cf21d` | **TAIL, added once**: sectors/agriculture/infographic.html (the two files are the same blob) |
| 2025-07-11 | agriculture.seedwave.faa.zone | `agridash_project_infographic.html` | AgriDash Project Infographic | `cb9cbbd9` | **TAIL, added**: sectors/agriculture/agridash.html |
| 2025-07-21 | FruitfulPlanetChange | `attached_assets/agriculture.seedwave.faa.zone-main/*.html` (6 files) | as above | same blobs | **copies**: identical to the repo heads; also in ThesisGallery and omnigrid (`fruitful-global-deployment/attached_assets`) |
| 2025-06-19 | faa.zone | `public/legal/vaultmesh-agri-checkout.html` | 🌐 VaultMesh™ \| AgroChain™ Core Protocol Overview | `842cfb48` | **related, not placed**: PayPal checkout for the sector licence; the app takes payment through Paystack (`checkout.html`) |
| 2025-06-20 | faa.zone | `public/legal/sectors/agriculture-biotech/agrichain/starter/paypal/manual.html` | same | `4dfccdb7` | **related, not placed**: as above |
| 2025-06-20 | FGP--samfox | `project/paypal/sectors/agriculture-biotech/agrichain/paypal/pricing.html` | same | `bf805736` | **related, not placed**: as above |
| 2025-10-17 | ThesisGallery | `generated_pages/agriculture/croplink/` (800 files: 400 pages and their copies, plus a sitemap) | FAA™ Agriculture - croplink #1 to #400 | 800 blobs | **not placed**: one template, made 400 times, with invented scores, users and uptime; nothing in them is real data |
| 2025-06-29 | fsf.seedwave.faa.zone, codenest | `index.html`, `packages/seedwave-sectors/fsf/index.html` | FSF \| CodeNest™ Dashboard - Food, Soil & Farming | `3d843b0d`, `e0f4768d` | **other sector**: 🥦 Food, Soil & Farming has its own home (`sectors/fsf/`) |
| 2026-03-02 | Replit | 🌱 Fruitful™ \| Global Agriculture Dashboard (app 7d097a12) | the Replit build of this dashboard | no local copy | **to fetch**: download it from Replit and compare with dashboard.html |
| 2026-03-02 | Replit | SeedShake (app 132c8c1e) | business-plan manager | local zip, 37.5 MB | **not agriculture**: same word only |
| 2026-09-27 | fruitful | `sectors/agriculture/index.html` | 🌱 Agriculture & Biotech | in place | **kept**: the sector page (84 core brands and their subnodes from grid-data) |

17 rows, every version accounted for: 6 pages placed, the rest copies, superseded, related or elsewhere.

## What changed on the way in

Pages were copied byte for byte from `agriculture.seedwave.faa.zone@7aefee5` and then changed only by `graft_agri.py`, which fails if any swap does not match exactly once:

- **No invented data.** The dashboard made up 50 farms and 7 charts. Farms now come only from the farm register; charts show World Bank, Open-Meteo and ISRIC SoilGrids data, or say plainly that nothing is recorded yet.
- **No keys in pages.** The Maps key in `index.html` and the shared key list in `overview.html` were removed. That list held PayPal, Google Maps, Spotify, Gemini and Xero values (including the Xero client secret and webhook key). The original repo is public, so these values should be rotated. The same list appears in about 80 files across the estate.
- **AI says when it is not connected.** Gemini calls need a server-side key; until one exists the buttons say so and point to Agri Tools.
- **Links.** Eight `example.com` links now go to the real products (farmOS, AGRIVI, Agromonitoring, ClimateAi, Taranis) or to the app's own pages. Six `href="#"` links on the overview go to app pages.
- Every page loads the app script; the dashboard and tools pages are not marked "concept" because their forms work.
