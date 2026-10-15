# H04 Heyns Admin Portal: the tail

**Tail = vaultmesh `fruitful-brand-packages.html` (2025-06-19, blob `836c339b`)**: highest score of 39 versions (functions ×2 + labels + buttons + link health ×25 + size). 23 functions, 69 labels.

## What other versions have that the tail lacks

- **8 version(s)** (2025-06-15 → 2025-06-15; seedwave `public/admin-panel.html`): labels: Audit Runs | ScrollGrid Index | Signal Zones | ⚙️ Admin Portal; functions: const, fetch, fetchPayPalPlanIDs, loadInitialBackendData, renderPayPalButtonsForContainer, uses
- **2 version(s)** (2025-06-15 → 2025-06-16; seedwave `public/admin-panel.html`): labels: Audit Runs | ScrollGrid Index | Signal Zones; functions: assumes, dynamically, loadMainDashboardData, seems, would
- **7 version(s)** (2025-06-16 → 2025-12-26; codenest `packages/apps/seedwave-core/public/heyns_admin_panel_paypal.html`, seedwave `public/admin-panel.html`): functions: displayAnnualPrice, displayPrice
- **3 version(s)** (2025-06-19 → 2025-06-19; vaultmesh `fruitful-brand-packages.html`): labels: Welcome to VaultMesh™
- **2 version(s)** (2025-06-22 → 2025-12-26; codenest `packages/apps/seedwave-core/public/admin-panel.html`, seedwave `public/admin-panel.html`): labels: Accounting | 📊 FAA™ Nexus; functions: displayAnnualPrice, displayPrice
- **1 version(s)** (2025-06-22 → 2025-06-22; seedwave `public/admin-panel.html`): labels: Accounting; functions: displayAnnualPrice, displayPrice
- **1 version(s)** (2025-07-20 → 2025-07-20; FruitfulPlanetChange `attached_assets/interns.seedwave.faa.zone-main/public/admin-portal.html`): labels: Select Sector for Snapshot: | Welcome, Intern! 👋 | 📸 Sector Snapshot | 📸 Sector Snapshot: All Brands Overview | 🚀 Internship Admin Portal; functions: displaySectorSnapshot, handleSectorSnapshotChange, hideCustomModal, populateSectorSnapshotSelect, showCustomModal
- **1 version(s)** (2025-07-20 → 2025-07-20; FruitfulPlanetChange `attached_assets/vaultmesh-main/heyns.html`): functions: hideCustomModal, showCustomModal
- **1 version(s)** (2026-09-04 → 2026-09-04; FGP--BlockBox `blockbox-admin/admin-portal.html`): labels: Block Box Admin Portal | Block Box License Activity Monitor | Select Sector for Snapshot: | Welcome back 👋 | 📈 Real-Time Block Box Metrics | 📸 Sector Snapshot | 📸 Sector Snapshot: All Brands Overview; functions: displaySectorSnapshot, handleSectorSnapshotChange, hideCustomModal, populateSectorSnapshotSelect, showCustomModal

## Graft list (each missing part once, from the newest version that has it)

| Part | Kind | Take from | First seen | Blob |
|---|---|---|---|---|
| assumes | function | seedwave `public/admin-panel.html` | 2025-06-16 | `7e334df2` |
| const | function | seedwave `public/admin-panel.html` | 2025-06-15 | `8077aae5` |
| displayAnnualPrice | function | codenest `packages/apps/seedwave-core/public/admin-panel.html` | 2025-12-26 | `b687330b` |
| displayPrice | function | codenest `packages/apps/seedwave-core/public/admin-panel.html` | 2025-12-26 | `b687330b` |
| displaySectorSnapshot | function | FGP--BlockBox `blockbox-admin/admin-portal.html` | 2026-09-04 | `ba211c2d` |
| dynamically | function | seedwave `public/admin-panel.html` | 2025-06-16 | `7e334df2` |
| fetch | function | seedwave `public/admin-panel.html` | 2025-06-15 | `8077aae5` |
| fetchPayPalPlanIDs | function | seedwave `public/admin-panel.html` | 2025-06-15 | `8077aae5` |
| handleSectorSnapshotChange | function | FGP--BlockBox `blockbox-admin/admin-portal.html` | 2026-09-04 | `ba211c2d` |
| hideCustomModal | function | FGP--BlockBox `blockbox-admin/admin-portal.html` | 2026-09-04 | `ba211c2d` |
| loadInitialBackendData | function | seedwave `public/admin-panel.html` | 2025-06-15 | `8077aae5` |
| loadMainDashboardData | function | seedwave `public/admin-panel.html` | 2025-06-16 | `7e334df2` |
| populateSectorSnapshotSelect | function | FGP--BlockBox `blockbox-admin/admin-portal.html` | 2026-09-04 | `ba211c2d` |
| renderPayPalButtonsForContainer | function | seedwave `public/admin-panel.html` | 2025-06-15 | `8077aae5` |
| seems | function | seedwave `public/admin-panel.html` | 2025-06-16 | `7e334df2` |
| showCustomModal | function | FGP--BlockBox `blockbox-admin/admin-portal.html` | 2026-09-04 | `ba211c2d` |
| uses | function | seedwave `public/admin-panel.html` | 2025-06-15 | `8077aae5` |
| would | function | seedwave `public/admin-panel.html` | 2025-06-16 | `7e334df2` |
| Accounting | label | codenest `packages/apps/seedwave-core/public/admin-panel.html` | 2025-12-26 | `b687330b` |
| Audit Runs | label | seedwave `public/admin-panel.html` | 2025-06-16 | `7e334df2` |
| Block Box Admin Portal | label | FGP--BlockBox `blockbox-admin/admin-portal.html` | 2026-09-04 | `ba211c2d` |
| Block Box License Activity Monitor | label | FGP--BlockBox `blockbox-admin/admin-portal.html` | 2026-09-04 | `ba211c2d` |
| ScrollGrid Index | label | seedwave `public/admin-panel.html` | 2025-06-16 | `7e334df2` |
| Select Sector for Snapshot: | label | FGP--BlockBox `blockbox-admin/admin-portal.html` | 2026-09-04 | `ba211c2d` |
| Signal Zones | label | seedwave `public/admin-panel.html` | 2025-06-16 | `7e334df2` |
| Welcome back 👋 | label | FGP--BlockBox `blockbox-admin/admin-portal.html` | 2026-09-04 | `ba211c2d` |
| Welcome to VaultMesh™ | label | vaultmesh `fruitful-brand-packages.html` | 2025-06-19 | `acdac4ce` |
| Welcome, Intern! 👋 | label | FruitfulPlanetChange `attached_assets/interns.seedwave.faa.zone-main/public/admin-portal.html` | 2025-07-20 | `9d509918` |
| ⚙️ Admin Portal | label | seedwave `public/admin-panel.html` | 2025-06-15 | `8077aae5` |
| 📈 Real-Time Block Box Metrics | label | FGP--BlockBox `blockbox-admin/admin-portal.html` | 2026-09-04 | `ba211c2d` |
| 📊 FAA™ Nexus | label | codenest `packages/apps/seedwave-core/public/admin-panel.html` | 2025-12-26 | `b687330b` |
| 📸 Sector Snapshot | label | FGP--BlockBox `blockbox-admin/admin-portal.html` | 2026-09-04 | `ba211c2d` |
| 📸 Sector Snapshot: All Brands Overview | label | FGP--BlockBox `blockbox-admin/admin-portal.html` | 2026-09-04 | `ba211c2d` |
| 🚀 Internship Admin Portal | label | FruitfulPlanetChange `attached_assets/interns.seedwave.faa.zone-main/public/admin-portal.html` | 2025-07-20 | `9d509918` |
