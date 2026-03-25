# Goku X Cheat

## Current State
Full single-page app with auth, products, admin panel, and profile page. Admin manages products only. Profile page has fake stats (Rank, Status, Server). No site-wide settings (logo, theme) are configurable from admin.

## Requested Changes (Diff)

### Add
- `SiteSettings` type in backend: `{ logoUrl: Text; themeAccent: Text; discordUrl: Text; siteName: Text }`
- `getSiteSettings` public query
- `updateSiteSettings` admin-only shared function
- Admin panel "SITE SETTINGS" section: logo URL input, theme color picker (red/blue/purple/green/gold), site name input, discord URL input
- Frontend reads site settings on load, applies CSS variables for accent color and logo everywhere

### Modify
- Profile page: remove fake stats (Rank/Status/Server cards), keep only warrior name input + principal ID display
- Admin panel: add settings section above products

### Remove
- Profile page fake stat cards (Rank, Status, Server)

## Implementation Plan
1. Update backend main.mo to add SiteSettings type and CRUD
2. Update frontend to fetch settings, apply theme CSS vars, wire admin settings form, simplify profile
