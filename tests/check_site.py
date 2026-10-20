import json,pathlib,re,unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
REQUIRED=['index.html','about.html','priorities.html','press-centre/index.html','press-centre/article.html','announcements/index.html','gallery/index.html','contact.html','privacy.html','404.html']
class SiteTests(unittest.TestCase):
 def test_routes_and_metadata(self):
  for route in REQUIRED:
   s=(ROOT/route).read_text();self.assertIn('Skip to content',s);self.assertIn('<main',s);self.assertRegex(s,r'<title>[^<]+</title>');self.assertRegex(s,r'<meta name="description" content="[^"]+"')
 def test_feeds(self):
  for f in ['news.json','press-centre.json','announcements.json','gallery.json']:
   data=json.loads((ROOT/f).read_text());self.assertIsInstance(data.get('items'),list)
   for item in data['items']:
    if item.get('status')=='published':
     self.assertTrue(item.get('title','').strip());self.assertRegex(item.get('date',''),r'^\d{4}-\d{2}-\d{2}$');self.assertNotRegex(item.get('title',''),r'DRAFT|replace-with|placeholder',re.I)
 def test_assets_and_domain(self):
  self.assertIn('.site-nav[hidden]{display:flex!important}',(ROOT/'assets/css/site.css').read_text())
  for f in ['assets/css/site.css','assets/js/site.js','sitemap.xml','robots.txt']:self.assertTrue((ROOT/f).exists())
  sitemap=(ROOT/'sitemap.xml').read_text();self.assertIn('https://babatundeogunlade.com',sitemap);self.assertNotIn('https://www.babatundeogunlade.com',sitemap)
 def test_local_links(self):
  for p in ROOT.rglob('*.html'):
   for url in re.findall(r'(?:href|src)="(/[^"#?]+)',p.read_text()):
    if url.startswith(('/admin/','/api/')): continue
    local=ROOT/url.lstrip('/')
    if url.endswith('/'): local=local/'index.html'
    if not local.exists() and not url.endswith(('.html','.css','.js','.json','.svg','.jpg','.png','.webp','.xml','.txt')): local=ROOT/(url.lstrip('/')+'.html')
    self.assertTrue(local.exists(),f'{p.relative_to(ROOT)} references missing {url}')
if __name__=='__main__':unittest.main(verbosity=2)
