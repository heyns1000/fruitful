# A1 Seedwave™ Admin Portal: the tail

**Tail = v13, `heyns1000/seedwave` `public/admin-portal.html` (27 Jun 2025, blob `1a1b603c`)**, now the content of
`admin-portal.html` at the head of this branch.

How it was chosen (all numbers from `index/atoms/A1-admin-portal*.json` in the superagent repo):

- Two independent traces over 52 repos, every branch: forward (name, title, visible text, function names) and
  reverse (element ids, function names, control labels only). 26 versions confirmed by both; 2 forward-only were
  false positives (text similarity 0.00); 5 reverse-only belong to the main dashboard system.
- Of the 26, the 16 here share the admin portal's structure (similarity ≥ 0.8, ≥ 60 % of its ids). The other
  confirmed ones split into **A1b Heyns Admin Panel** (6 versions) and the **main dashboard** (D group).
- v13 has the most working functions of any version (51 of 82 across all versions) and 77 of 100 labels,
  including PayPal sector deployment and subscriptions. Later copies (v15, v16) are trimmed versions of it (48 functions).

## Parts that exist only in other versions (to graft onto the tail)

| From | What | Detail |
|---|---|---|
| v14 `faa.zone/public/admin/admin-portal.html` (= omnigrid `admin-panel_full_arrays.html`) | Integrations panel and AI helpers | Spotify, Xero OAuth, Google Maps, PayPal SDK demo, webhooks; "✨ Generate brand description", "✨ Suggest subnodes"; functions `initSpotifyAPI`, `initMap`, `renderPayPalButtons`, `generateBrandDescription`, `suggestSubnodes`, `renderGlobalBrandTable`. Marked "(Conceptual)" in the source; needs keys. |
| v10 `faa.zone/public/admin-portal-8.html` | Confirmation dialog | "Yes, Clear All / Cancel", `showCustomConfirm` |
| v1 `faa.zone/public/admin/admin-portal.html` (May 2025) | Snapshot and sector tools | `showSnapshot`, `showSmartSnapshot`, `renderSectorOutput`, `updateSectorDashboard`, `loadScrollProfile`, "📌 Subnodes", "ℹ️ Admin Status Feedback" |
| v7 `faa.zone/public/admin-portal-5.html` | Deployment trigger | `initiateDeployment` |

## Tested (6 Oct 2026, local browser)

- Loads as "⚙️ Seedwave™ Admin Portal": 1,219 buttons, 128 elements with click handlers using 5 functions, all defined (0 dead handlers).
- Expects a backend at `http://localhost:3000/api` (`loadMainDashboardData`); without it the page shows
  "Backend Connection Error". No backend version has been found yet in the 52 repos.
- A block of CSS renders as text at the top of the page: an unclosed or misplaced `<style>` in the source
  (present in v13 as published). Fix belongs in the graft pass, taken from a version where it renders cleanly.
