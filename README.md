Every push to the production branch will automatically trigger a new deployment. Other branches get their own preview URLs.
💻 Local Preview
No build step is required. Open media/index.html directly in a browser, or serve the folder locally:
cd media
python3 -m http.server 8000
Then visit http://localhost:8000.
✏️ Updating Content
News and page content: edit media/index.html
Styling and responsive layout: edit media/media.css
Images and posters: add or replace files in media/img/, then reference them from index.html
Commit and push your changes to trigger an automatic redeploy.
📝 Notes
README-UPLOAD.txt contains reference notes from the Vercel-to-Cloudflare migration.
Optimize images before uploading to keep page loads fast on mobile connections.
