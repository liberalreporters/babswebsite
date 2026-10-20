# Cloudflare Worker and Decap CMS setup (staging)

**Preview URL:** https://babswebsite-preview.liberalreporters.workers.dev  
**Worker:** `babswebsite-preview`  
**CMS route:** `/admin/`  
**OAuth callback:** `/api/callback`

## Current implementation
A separate Cloudflare Worker has been deployed for preview. It proxies static files from the public `cloudflare-prep` branch of this repository and adds `X-Robots-Tag: noindex, nofollow`. This is a temporary preview approach to avoid touching the production Worker or DNS while testing. It is not the recommended final production hosting path; production should use a proper Worker static-assets or Git-integrated build.

The preview CMS configuration writes to the authoritative source repository `liberalreporters/babatundeogunladewebsite`, branch `main`. The staging mirror workflow preserves the preview-specific `admin/config.yml`, Worker code, and Wrangler config.

## Secrets still required for CMS login
The Worker is deployed but **GitHub OAuth is not configured yet**. Add these as Worker secrets:
- `GITHUB_OAUTH_CLIENT_ID`
- `GITHUB_OAUTH_CLIENT_SECRET`

Create a separate GitHub OAuth App for the preview environment. Set its Authorization callback URL to:
`https://babswebsite-preview.liberalreporters.workers.dev/api/callback`

The existing production OAuth app should keep its production callback URL. A GitHub OAuth App has one configured callback URL, so reusing the production app for a different preview origin can break sign-in. Do not put either secret in Git or `admin/config.yml`.

## Verify the preview
1. Open the preview URL above.
2. Open `/about.html`, `/priorities.html`, `/press-centre/`, `/announcements/`, and `/gallery/`.
3. Open `/admin/`; confirm Decap CMS loads.
4. After OAuth secrets and the separate app are configured, test GitHub login.
5. Confirm the CMS can read the source repository.
6. Test publishing with a disposable draft and confirm the expected source repository commit.

## Production protection
Do not merge the draft pull request, switch production DNS, change the existing `babs07` Worker, or alter the production OAuth app as part of preview testing. Production cutover requires a separate explicit approval after preview validation.

## Limitations
- The preview URL and Worker deployment exist, but the browser-level page test has not been verified from this environment.
- OAuth login and CMS publishing are not yet tested because the preview Worker secrets and preview OAuth App are not configured.
- The GitHub Actions site test is being used to identify and repair broken local links before the preview is considered validated.
