# Cloudflare Worker and Decap CMS setup — staging

**Worker:** `babswebsite-preview`  
**Preview URL:** https://babswebsite-preview.liberalreporters.workers.dev  
**CMS:** https://babswebsite-preview.liberalreporters.workers.dev/admin/  
**GitHub repository:** `liberalreporters/babswebsite`  
**Branch:** `cms-cloudflare-preview`  
**OAuth callback:** https://babswebsite-preview.liberalreporters.workers.dev/api/callback

## Current implementation
The preview Worker serves the static site from the `cms-cloudflare-preview` branch and provides the GitHub OAuth endpoints used by Decap CMS. The CMS stores content in the same repository and branch. The four content feeds have been populated from the existing repository with all imported entries set to Draft.

The Worker has two encrypted secret bindings:
- `GITHUB_OAUTH_CLIENT_ID`
- `GITHUB_OAUTH_CLIENT_SECRET`

Secret names and types were verified in Cloudflare. Secret values were not accessed. Confirm the GitHub OAuth App's Authorization callback URL is exactly the URL above.

## Important routing warning
The Cloudflare zone's current active route list assigns `*.babatundeogunlade.com/*` to `babswebsite-preview`. The preview Worker sets `X-Robots-Tag: noindex, nofollow` on all responses. This is a production-routing conflict, not a safe isolated preview arrangement.

Do not deploy updated staging Worker code, merge the branch, or change production DNS until the wildcard route has been explicitly reviewed and corrected with the user's approval. The existing `babs07` Worker is present, but it is not currently listed as the active route target in the zone route list.

## Staging tests
- GitHub Actions site validation passed on the staging branch.
- Browser-based preview and CMS sign-in are not yet confirmed from this environment.
- No test content has been published; imported content remains Draft.
- No Cloudinary assets have been moved or deleted.

## Next steps
1. Resolve the production wildcard route with explicit approval.
2. Test the preview website and CMS in a browser.
3. Complete a disposable draft-save test.
4. Verify image uploads and publish only after editorial review.
5. Complete SEO/AEO and accessibility checks.
6. Plan production rollout separately and obtain explicit approval.
