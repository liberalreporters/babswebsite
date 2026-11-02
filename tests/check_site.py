import json
import pathlib
import re
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
REQUIRED = [
    "index.html", "about.html", "priorities.html", "press-centre/index.html",
    "press-centre/article.html", "announcements/index.html", "gallery/index.html",
    "contact.html", "privacy.html", "404.html",
]


class SiteTests(unittest.TestCase):
    def test_routes_and_metadata(self):
        for route in REQUIRED:
            page = (ROOT / route).read_text()
            self.assertIn("Skip to content", page)
            self.assertIn("<main", page)
            self.assertRegex(page, r"<title>[^<]+</title>")
            self.assertRegex(page, r'<meta name="description" content="[^"]+"')

    def test_feeds(self):
        for filename in ["news.json", "press-centre.json", "announcements.json", "gallery.json"]:
            data = json.loads((ROOT / filename).read_text())
            self.assertIsInstance(data.get("items"), list)
            for item in data["items"]:
                if item.get("status") == "published":
                    self.assertTrue(item.get("title", "").strip())
                    self.assertRegex(item.get("date", ""), r"^\d{4}-\d{2}-\d{2}$")
                    self.assertNotRegex(item.get("title", ""), r"DRAFT|replace-with|placeholder", re.I)

    def test_assets_and_domain(self):
        css = (ROOT / "assets/css/site.css").read_text()
        self.assertIn(".site-nav.is-open{display:flex}", css)
        self.assertNotRegex(css, r"\.site-nav\[hidden\]\s*\{\s*display\s*:\s*flex\s*!important")
        for filename in ["assets/css/site.css", "assets/js/site.js", "sitemap.xml", "robots.txt"]:
            self.assertTrue((ROOT / filename).exists())
        sitemap = (ROOT / "sitemap.xml").read_text()
        self.assertIn("https://babatundeogunlade.com", sitemap)
        self.assertNotIn("https://www.babatundeogunlade.com", sitemap)

    def test_interactive_pages_and_accessibility(self):
        news = (ROOT / "news.html").read_text()
        press = (ROOT / "press-centre/index.html").read_text()
        announcements = (ROOT / "announcements/index.html").read_text()
        article = (ROOT / "press-centre/article.html").read_text()
        gallery = (ROOT / "gallery/index.html").read_text()
        contact = (ROOT / "contact.html").read_text()
        js = (ROOT / "assets/js/site.js").read_text()
        css = (ROOT / "assets/css/site.css").read_text()
        self.assertIn('data-feed-url="/news.json"', news)
        self.assertIn('data-feed-url="/press-centre.json"', press)
        self.assertIn('data-feed-url="/announcements.json"', announcements)
        self.assertIn('data-article-title', article)
        self.assertIn('<title>Photo Gallery | Babatunde Sunday Ogunlade</title>', gallery)
        self.assertIn('aria-current="page">Photo Gallery', gallery)
        self.assertIn('data-mailto-form', contact)
        self.assertNotIn('data-demo-form', contact)
        self.assertIn('prefers-reduced-motion', css)
        self.assertIn(':focus-visible', css)
        self.assertIn('aria-expanded', js)
        self.assertIn('data-feed', js)
        self.assertIn('reportValidity', js)

    def test_local_links(self):
        for page in ROOT.rglob("*.html"):
            for url in re.findall(r'(?:href|src)="(/[^"#?]+)', page.read_text()):
                if url.startswith(("/admin/", "/api/")):
                    continue
                local = ROOT / url.lstrip("/")
                if url.endswith("/"):
                    local = local / "index.html"
                if not local.exists() and not url.endswith((".html", ".css", ".js", ".json", ".svg", ".jpg", ".png", ".webp", ".xml", ".txt")):
                    local = ROOT / (url.lstrip("/") + ".html")
                self.assertTrue(local.exists(), f"{page.relative_to(ROOT)} references missing {url}")


if __name__ == "__main__":
    unittest.main(verbosity=2)
