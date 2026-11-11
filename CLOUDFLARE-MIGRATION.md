# Cloudflare migration plan — BABS website

## Environment
- Repository: https://github.com/liberalreporters/babswebsite
- Staging branch: `cms-cloudflare-preview`
- Preview Worker: `babswebsite-preview`
- Preview URL: https://babswebsite-preview.liberalreporters.workers.dev
- CMS URL: https://babswebsite-preview.liberalreporters.workers.dev/admin/
- Production domain: https://babatundeogunlade.com

## Staging implementation
The staging branch contains a static multi-page website, Decap CMS configuration, GitHub content backend, Worker OAuth handler, four JSON feeds and validation tests.

The CMS writes to `liberalreporters/babswebsite` on `cms-cloudflare-preview`. Existing content from the repository's main branch has been copied into the four staging feeds with every item set to `draft`. The public feeds display only items whose status is `published`.

The Cloudflare preview Worker has the encrypted secret bindings `GITHUB_OAUTH_CLIENT_ID` and `GITHUB_OAUTH_CLIENT_SECRET`. Their values are never read or displayed by this workflow. The expected GitHub OAuth callback URL is:

`https://babswebsite-preview.liberalreporters.workers.dev/api/callback`

## Verified work
- CMS config points to the preview Worker and staging GitHub branch.
- Content migration: 11 press items, 6 news items, 10 announcements and 5 gallery entries; all drafts.
- News & Updates page added and linked in the primary navigation.
- Worker source updated with clean-URL resolution for directory index and `.html` pages, plus a `/profile` alias.
- Feed date parsing corrected and drafts excluded from all public feeds, including gallery.
- GitHub Actions validation on `cms-cloudflare-preview` passed for commit `0e4fab136f2a88d541f5fa321d3b22e8150be24f`.

## Critical Cloudflare routing finding — do not ignore
The Cloudflare zone's live Worker route list currently reports:

`*.babatundeogunlade.com/* → babswebsite-preview`

The existing production Worker `babs07` is present, but that route is not currently listed as its active zone route. The preview Worker adds `X-Robots-Tag: noindex, nofollow` to every response. This means the preview Worker is attached to a production subdomain wildcard and may be serving preview content to subdomains such as `www`.

Do not deploy the latest staging Worker code or perform a production cutover until this route is reviewed and the user explicitly approves restoring or changing production routing. The apex domain and www host must be tested separately before any DNS or route change.

## Remaining validation
1. Resolve the wildcard production route so staging is isolated to its `workers.dev` preview URL.
2. Confirm the GitHub OAuth App callback URL exactly matches the preview callback above.
3. Test browser-based CMS login and a disposable draft commit.
4. Verify every clean URL, asset, JSON feed and 404 behaviour on the preview host.
5. Organise Cloudinary assets and connect selected authorised media.
6. Complete SEO/AEO audit when the analyzer is accessible.
7. Obtain explicit approval before any production route, DNS, main-branch or deployment change.

## DNS and email
DNS Doctor ownership verification is pending. The required TXT challenge has not been published. The latest scan also found no SPF or DMARC record and no MX records; DKIM was not found among common selectors. Do not create SPF, MX or DKIM records until the actual email provider and legitimate sending services are confirmed. DMARC monitoring should be configured only after the domain owner approves the exact TXT record.

## Protection rules
- Keep all staging content as drafts until editorial review.
- Never expose OAuth secrets or commit them to Git.
- Do not alter production DNS, Worker routes, production OAuth apps or the `main` branch without explicit approval.
