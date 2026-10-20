# Cloudflare migration plan — BABS website

This branch is a staging area only. It is not connected to the production domain and must not be merged into `main` until the complete website and CMS have been tested.

## Sources of truth
- Website and content: https://github.com/liberalreporters/babatundeogunladewebsite (branch `main`)
- Cloudflare staging repository: https://github.com/liberalreporters/babswebsite (branch `cloudflare-prep`)
- Production domain: https://babatundeogunlade.com

## Important architecture finding
The source website uses Decap CMS with the GitHub backend. It does not use Supabase. The existing `api/auth.js` and `api/callback.js` are Vercel-style Node serverless functions and cannot simply be deployed unchanged as Cloudflare Worker handlers. A Cloudflare-native OAuth handler must be implemented and tested before the CMS can authenticate.

The Supabase project `hgcwhzyyhnntbdipvqnp` currently has no schema and is not used by this source website. Do not put service-role keys or other secrets in client-side files.

## Safe migration sequence
1. Preserve the production website, DNS records, and existing Worker unchanged.
2. Copy the complete source tree, including every HTML page, CSS/JS file, JSON feed, image, test, and CMS configuration from the source repository. Do not copy only `index.html`; its asset paths and content feeds are required.
3. Configure Decap CMS to write to the intended repository and branch, and implement Cloudflare-compatible GitHub OAuth routes using Worker secrets (never commit OAuth secrets).
4. Configure Cloudflare's Git integration or Worker static assets and deploy only to a preview URL.
5. Test the home page, every internal page, assets, JSON feeds, `/admin/`, OAuth login, and a controlled draft/publish cycle.
6. Only after all tests pass, plan a separate, explicitly approved production cutover. DNS and the existing production Worker must not be changed as part of staging.

## Acceptance checklist
- [ ] Complete source tree copied; no missing assets or pages
- [ ] Preview website loads on desktop and mobile
- [ ] No broken internal links, CSS, JavaScript, or content feeds
- [ ] CMS loads at `/admin/`
- [ ] GitHub OAuth succeeds without exposing credentials
- [ ] CMS writes only to the intended repository/branch
- [ ] Drafts remain unpublished; publishing updates the public feed
- [ ] Production DNS and live site remain unchanged until cutover approval

## Current status
The `cloudflare-prep` branch was created from the existing placeholder repository. No production DNS changes, Worker deployments, Supabase schema changes, or production commits were made by this staging step.
