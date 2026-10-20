# BABS CMS repair and deployment notes

Live domain: https://babatundeogunlade.com  
Connected website repository: https://github.com/liberalreporters/babatundeogunladewebsite  
Admin: https://babatundeogunlade.com/admin/

## Changes
- Pins Decap CMS to the absolute config path /admin/config.yml.
- Adds same-domain Vercel GitHub OAuth endpoints under /api/.
- Adds the Gallery collection and Cloudinary media-library settings.
- Fixes CSS/JS references in Press, Announcements and Gallery: the previous HTML requested files under /assets/css and /assets/js, but those files are at repository root.
- Connects the JSON feeds to public cards and hides draft/template records.
- Adds a News page.

## Required setup before CMS login works
1. In GitHub, go to Settings → Developer settings → OAuth Apps → New OAuth App.
2. Homepage URL: https://babatundeogunlade.com
3. Authorization callback URL: https://babatundeogunlade.com/api/callback
4. In Vercel project babatundeogunladewebsite, add Production environment variables:
   - GITHUB_OAUTH_CLIENT_ID — the OAuth App Client ID
   - GITHUB_OAUTH_CLIENT_SECRET — the OAuth App Client Secret
5. Redeploy after saving the variables.
6. In Cloudinary, copy the Cloud name and API key. Replace YOUR_CLOUDINARY_CLOUD_NAME and YOUR_CLOUDINARY_API_KEY in admin/config.yml.
7. Never place the Cloudinary API secret or GitHub OAuth client secret in GitHub files. CMS editors need push access to the content repository.

The OAuth endpoint requests the public_repo scope for this public repository. It uses a short-lived Secure, HttpOnly, SameSite=Lax state cookie and validates state before exchanging the authorization code.

## Deployment warning
Vercel reported the latest deployment as CANCELED with a link to its “verified commits” Git setting. A new commit may not deploy automatically until that setting or commit-verification issue is resolved. Check Vercel → project babatundeogunladewebsite → Settings → Git and the deployment details. Do not connect the domain to the empty babs2027 repository.

## Test checklist
- /admin/config.yml displays YAML, not a 404.
- /admin/ loads Decap CMS.
- GitHub login returns through /api/callback.
- Cloudinary media picker opens and saves HTTPS image URLs.
- Gallery, press and announcements pages display only real, approved records.
- Draft JSON records stay hidden.
- Verify a Vercel deployment is Ready before relying on the changes.
