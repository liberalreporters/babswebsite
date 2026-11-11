# BABS website CMS — GitHub-backed Decap CMS

## Architecture
The staging website uses Decap CMS with the GitHub backend. Content is stored in the liberalreporters/babswebsite repository on the cms-cloudflare-preview branch and published through JSON feeds consumed by the static website.

**Supabase is not part of this implementation.** Do not create a Supabase project, add Supabase keys, or follow setup instructions for a different or older admin build.

## Staging addresses
- Preview website: https://babswebsite-preview.liberalreporters.workers.dev
- CMS dashboard: https://babswebsite-preview.liberalreporters.workers.dev/admin/
- CMS configuration: https://babswebsite-preview.liberalreporters.workers.dev/admin/config.yml
- OAuth start: https://babswebsite-preview.liberalreporters.workers.dev/api/auth
- Expected OAuth callback for a dedicated preview OAuth app: https://babswebsite-preview.liberalreporters.workers.dev/api/callback

## CMS collections
The CMS manages Press Centre, News & Updates, Announcements and Photo Gallery. The public website displays only entries with status: published. Existing migrated entries are intentionally marked draft pending editorial review. Do not bulk-publish them.

## GitHub OAuth configuration
The Cloudflare preview Worker reads encrypted Worker secrets named GITHUB_OAUTH_CLIENT_ID and GITHUB_OAUTH_CLIENT_SECRET. Never place the secret in this repository or expose it in logs.

A GitHub OAuth App used for preview must have:
- Homepage URL: https://babswebsite-preview.liberalreporters.workers.dev
- Authorization callback URL: https://babswebsite-preview.liberalreporters.workers.dev/api/callback

GitHub OAuth Apps use a configured callback URL. If the currently stored OAuth App was created for the production hostname, do not assume it can authenticate the preview hostname. Use a dedicated preview OAuth App and set its client ID and secret as preview Worker secrets, or deliberately configure a supported shared callback flow. Do not replace production secrets during staging work.

Authorised editors also need write access to liberalreporters/babswebsite. The CMS requests the public_repo scope because the repository is public.

## Troubleshooting
1. Open /admin/config.yml on the preview hostname and confirm it returns YAML.
2. Open /admin/ and confirm the Decap CMS interface loads.
3. Confirm the CMS config points to liberalreporters/babswebsite, branch cms-cloudflare-preview, and the preview OAuth endpoint.
4. Confirm the preview Worker has both OAuth secrets configured without revealing their values.
5. Confirm the GitHub OAuth App callback URL matches the preview callback exactly.
6. Sign in using an authorised GitHub account.
7. Save a test draft and verify that the change appears only on the staging branch.
8. Confirm public feeds continue to hide draft entries.

## Production safety
The production website and its OAuth configuration must remain separate from staging. Do not merge the staging branch into the production branch, change production Worker secrets, or publish unreviewed content without explicit approval.
