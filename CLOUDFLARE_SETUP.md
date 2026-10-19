Every push to the production branch will automatically trigger a new deployment. Other branches get their own preview URLs.

Local preview
-------------
No build step is required. Open media/index.html directly in a browser, or serve the folder locally:

cd media
python3 -m http.server 8000 --directory .

Then visit http://localhost:8000.

Updating content
----------------
- News and page content: edit media/index.html
- Styling and responsive layout: edit media/media.css
- Images and posters: add or replace files in media/img/, then reference them from index.html
- Commit and push your changes to trigger an automatic redeploy.

Cloudflare Pages — quick setup (recommended)
-------------------------------------------
1. Create a Cloudflare account (https://dash.cloudflare.com/) if you don't have one.
2. In Cloudflare, go to Pages -> Create a project -> Connect to GitHub and authorize the liberalreporters/babswebsite repository.
3. When prompted for build settings:
   - Framework preset: None
   - Build command: (leave empty)
   - Output directory: media
   - Branch: main
4. Create the project. Cloudflare Pages will build and publish the site at a *.pages.dev subdomain (the project subdomain will be shown after the first deploy).

Add your custom domain (babatundeogunlade.com)
---------------------------------------------
Recommended (easiest, secure): use Cloudflare DNS for your domain
1. In Cloudflare dashboard, add your domain (Sites -> Add site) and follow the steps to change your GoDaddy nameservers to the Cloudflare nameservers shown.
2. After Cloudflare becomes authoritative for the domain, go to your Pages project -> Custom domains -> Add domain -> enter babatundeogunlade.com and follow verification prompts. Cloudflare will automatically provision TLS.

If you prefer to keep DNS at GoDaddy (alternate option)
1. In your Pages project, after adding babatundeogunlade.com as a custom domain, Cloudflare will show the DNS records you must add at your DNS provider.
2. Common, reliable pattern: (a) add a CNAME for the www subdomain pointing to the pages subdomain provided by Cloudflare (e.g. <project>.pages.dev). Host: www, Value: <your-project>.pages.dev, TTL: 1 hour. (b) For the root/apex domain (babatundeogunlade.com) either enable forwarding to https://www.babatundeogunlade.com at GoDaddy (domain forwarding), or use an ALIAS/ANAME record if your DNS provider supports it. Cloudflare Pages supports apex domains when Cloudflare is the authoritative DNS.

GoDaddy DNS quick steps (if keeping DNS at GoDaddy and using www CNAME + forwarding):
- Sign in to GoDaddy -> My Products -> DNS (for babatundeogunlade.com)
- Add Record -> Type: CNAME -> Host: www -> Points to: <your-project>.pages.dev -> Save
- Under "Forwarding", set the domain to forward (Permanent 301) to https://www.babatundeogunlade.com (enable forwarding with masking off)

After DNS changes propagate (may take up to 24 hours, often < 1 hour), Cloudflare Pages should validate the domain and serve the site with TLS.

If you want, I can:
- Commit this minimal site into the repo (I already added files in media/) and a Cloudflare setup guide (this README update).
- Walk you through changing GoDaddy nameservers to Cloudflare, or generate the exact CNAME value once your Pages project exists.

Notes
-----
- If you want the root domain (apex) to work without forwarding, the easiest reliable path is to use Cloudflare as your DNS provider (change nameservers at GoDaddy to the Cloudflare nameservers). Cloudflare will then let Pages attach the apex domain and issue certificates automatically.
- Optimize images before uploading to keep page loads fast on mobile connections.
