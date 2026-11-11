# Babatunde Ogunlade public information website

Static-first multi-page website for biography, proposed priorities, press releases, news, official announcements and an authorised photo gallery.

## Development and validation
Run `python tests/check_site.py` to validate site structure, local links and content-feed publication rules.

## Cloudflare staging
- Repository: `liberalreporters/babswebsite`
- Staging branch: `cms-cloudflare-preview`
- Preview Worker: `babswebsite-preview`
- Preview URL: https://babswebsite-preview.liberalreporters.workers.dev
- CMS: https://babswebsite-preview.liberalreporters.workers.dev/admin/

All migrated content is currently marked Draft. Do not merge to `main`, publish the staging Worker to the production domain, or change production DNS/routing until browser tests pass and a separate production cutover is approved.

The production domain is https://babatundeogunlade.com.
