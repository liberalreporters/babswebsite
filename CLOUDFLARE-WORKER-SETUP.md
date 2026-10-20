# Cloudflare Worker and Decap CMS setup (staging)

Preview Worker name: `babswebsite-preview`  
Expected preview URL: `https://babswebsite-preview.liberalreporters.workers.dev`  
CMS route: `/admin/`  
OAuth callback: `/api/callback`

## Secrets required
Set these as **Worker secrets**, never in Git:
- `GITHUB_OAUTH_CLIENT_ID`
- `GITHUB_OAUTH_CLIENT_SECRET`

Create a separate GitHub OAuth App for the preview environment. Set its Authorization callback URL to:
`https://babswebsite-preview.liberalreporters.workers.dev/api/callback`

The existing production OAuth app should keep its production callback URL. A GitHub OAuth App has one configured callback URL, so reusing the production app for a different preview origin can break sign-in.

## Deploy the preview
From this repository's `cloudflare-prep` branch, use Cloudflare Workers Builds (Git integration) or Wrangler to deploy `wrangler.jsonc` and `worker.js`. The deployment must use the name `babswebsite-preview` and enable the workers.dev subdomain. Do not deploy this branch to `babs07` and do not change production DNS.

If using Wrangler locally:
1. Install Node.js and Wrangler.
2. Authenticate with `npx wrangler login`.
3. Run `npx wrangler deploy --config wrangler.jsonc`.
4. Set secrets with `npx wrangler secret put GITHUB_OAUTH_CLIENT_ID` and `npx wrangler secret put GITHUB_OAUTH_CLIENT_SECRET`.
5. Redeploy and check the preview URL.

## CMS repository
The preview CMS is configured to edit `liberalreporters/babatundeogunladewebsite` on branch `main`, which remains the authoritative content repository. Do not change the backend repository or branch without a separate decision.

## Tests before production
- Open the home page and each page linked from the navigation.
- Check CSS, JavaScript, JSON feeds and image loading.
- Open `/admin/`; confirm the Decap dashboard loads.
- Confirm OAuth opens GitHub and returns to the preview origin.
- Confirm the CMS can read the repository.
- Test publishing with a disposable draft and confirm the expected source repository commit.
- Confirm production domain, DNS and Worker `babs07` remain unchanged.

## Important limitation
The GitHub connector can commit source files but cannot execute a Cloudflare deployment without a configured deployment path and OAuth secrets. Do not describe the preview as live until the Worker deployment and CMS login have been tested.
