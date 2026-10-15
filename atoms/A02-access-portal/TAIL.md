# A02 Access Portal: the tail

**Tail = omnigrid `public/admin/admin-portal-approval.html` (2026-09-05, blob `32bc4992`)**: highest score of 6 versions (functions ×2 + labels + buttons + link health ×25 + size). 7 functions, 35 labels.

## What other versions have that the tail lacks

- **2 version(s)** (2025-06-10 → 2025-12-26; codenest `packages/apps/seedwave-core/public/access-portal.html`, seedwave `public/access-portal.html`): labels: Ecosystem Dashboard | Home | Login | ✅ Submit Registration | 🤝 Service Provider Integration & deployment tools | 🦍 FAA.ZONE™; functions: checkUserSessionAndAccess, showForm
- **2 version(s)** (2025-09-06 → 2025-12-05; ThesisGallery `attached_assets/admin-portal-approval_1757168526806.html`, codenest `packages/faa-zone/public/admin/app.html`): labels: ✅ Submit Registration | 🌐 Seedwave™ Access Portal | 🤝 Service Provider Integration & deployment tools; functions: showForm, submitRegistration
- **1 version(s)** (2025-12-05 → 2025-12-05; codenest `packages/faa-zone/public/admin/admin-portal-approval.html`): labels: Account Login / Sign Up | Login | Need an account? Click here to Sign Up. | Sign Out | ✅ Submit Role Request | 🌐 Seedwave™ Access Portal | 🤝 Service Provider Integration & deployment tools; functions: initializeFirebase

## Graft list (each missing part once, from the newest version that has it)

| Part | Kind | Take from | First seen | Blob |
|---|---|---|---|---|
| checkUserSessionAndAccess | function | codenest `packages/apps/seedwave-core/public/access-portal.html` | 2025-12-26 | `34c91587` |
| initializeFirebase | function | codenest `packages/faa-zone/public/admin/admin-portal-approval.html` | 2025-12-05 | `e8ad568c` |
| showForm | function | codenest `packages/apps/seedwave-core/public/access-portal.html` | 2025-12-26 | `34c91587` |
| submitRegistration | function | codenest `packages/faa-zone/public/admin/app.html` | 2025-12-05 | `6c645cff` |
| Account Login / Sign Up | label | codenest `packages/faa-zone/public/admin/admin-portal-approval.html` | 2025-12-05 | `e8ad568c` |
| Ecosystem Dashboard | label | codenest `packages/apps/seedwave-core/public/access-portal.html` | 2025-12-26 | `34c91587` |
| Home | label | codenest `packages/apps/seedwave-core/public/access-portal.html` | 2025-12-26 | `34c91587` |
| Login | label | codenest `packages/apps/seedwave-core/public/access-portal.html` | 2025-12-26 | `34c91587` |
| Need an account? Click here to Sign Up. | label | codenest `packages/faa-zone/public/admin/admin-portal-approval.html` | 2025-12-05 | `e8ad568c` |
| Sign Out | label | codenest `packages/faa-zone/public/admin/admin-portal-approval.html` | 2025-12-05 | `e8ad568c` |
| ✅ Submit Registration | label | codenest `packages/apps/seedwave-core/public/access-portal.html` | 2025-12-26 | `34c91587` |
| ✅ Submit Role Request | label | codenest `packages/faa-zone/public/admin/admin-portal-approval.html` | 2025-12-05 | `e8ad568c` |
| 🌐 Seedwave™ Access Portal | label | codenest `packages/faa-zone/public/admin/admin-portal-approval.html` | 2025-12-05 | `e8ad568c` |
| 🤝 Service Provider Integration & deployment tools | label | codenest `packages/apps/seedwave-core/public/access-portal.html` | 2025-12-26 | `34c91587` |
| 🦍 FAA.ZONE™ | label | codenest `packages/apps/seedwave-core/public/access-portal.html` | 2025-12-26 | `34c91587` |
