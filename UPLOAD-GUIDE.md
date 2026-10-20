# Image and publishing guide

Repository: https://github.com/liberalreporters/babatundeogunladewebsite

## Image folders
- Homepage portrait and biography photos: `assets/images/profile/`.
- Press/news images: `assets/images/news/`.
- Announcement graphics: `assets/images/announcements/`.
- Gallery photos: `assets/images/gallery/`.

Use authorised images, descriptive filenames, accurate captions and alt text. Replace `portrait-placeholder.svg` with an approved image and update the corresponding image path.

## Publishing feeds
- `press-centre.json`: press releases and official statements.
- `announcements.json`: official notices and confirmed engagements.
- `news.json`: verified news items.
- `gallery.json`: authorised photographs.

Keep content as `draft` during review, then set `status` to `published` only after editorial approval. Public pages filter drafts. Gallery entries need a valid `YYYY-MM-DD` date, title, image URL, accurate caption, alt text and publication status.

## CMS setup
GitHub CMS authentication requires `GITHUB_OAUTH_CLIENT_ID` and `GITHUB_OAUTH_CLIENT_SECRET` in Vercel and the OAuth callback `https://babatundeogunlade.com/api/callback`. The optional Cloudinary picker requires the actual public cloud name and API key in `admin/config.yml`. Do not commit secrets. Configure these values before expecting the corresponding features to work.
