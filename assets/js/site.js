:root {
  --green: #008751;
  --green-deep: #006d42;
  --green-soft: #eaf7f1;
  --navy: #0A2540;
  --gold: #D4AF37;
  --white: #F8FAFC;
  --paper: #f4f7f8;
  --ink: #14263d;
  --muted: #5e6d7b;
  --line: #dfe7eb;
  --shadow: 0 18px 42px rgba(10, 37, 64, 0.12);
  --radius: 22px;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: "Inter", Arial, Helvetica, sans-serif;
  background: var(--paper);
  color: var(--ink);
  line-height: 1.6;
}
img { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
button, input, textarea, select { font: inherit; }
:focus-visible {
  outline: 3px solid rgba(212, 175, 55, 0.75);
  outline-offset: 3px;
}
.container {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
}
.utility-bar {
  background: var(--navy);
  color: rgba(248, 250, 252, 0.9);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.utility-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 36px;
}
.site-header {
  position: sticky;
  top: 0;
  background: rgba(248, 250, 252, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
  z-index: 50;
}
.nav-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  min-height: 84px;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.brand-mark {
  display: inline-grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--green) 0%, var(--green-deep) 100%);
  color: var(--white);
  font-weight: 900;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
  box-shadow: var(--shadow);
}
.brand-copy {
  display: grid;
  line-height: 1.1;
}
.brand-copy strong {
  font-size: 0.96rem;
  letter-spacing: 0.02em;
  color: var(--navy);
}
.brand-copy small {
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}
.site-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--navy);
}
.site-nav a {
  position: relative;
  padding: 0.2rem 0;
}
.site-nav a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 100%;
  height: 2px;
  background: var(--gold);
  border-radius: 999px;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.2s ease;
}
.site-nav a:hover::after,
.site-nav a:focus-visible::after,
.site-nav a[aria-current="page"]::after {
  transform: scaleX(1);
}
.nav-cta, .button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-weight: 700;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.nav-cta {
  background: var(--green);
  color: var(--white);
  padding: 0.85rem 1.2rem;
  box-shadow: 0 12px 26px rgba(0, 135, 81, 0.18);
}
.nav-cta:hover, .button:hover { transform: translateY(-1px); }
.button {
  padding: 0.94rem 1.4rem;
}
.button-primary {
  background: var(--green);
  color: var(--white);
  box-shadow: 0 16px 30px rgba(0, 135, 81, 0.18);
}
.button-secondary {
  background: var(--white);
  color: var(--navy);
  border: 1px solid var(--line);
}
.skip-link {
  position: absolute;
  left: 16px;
  top: -48px;
  z-index: 100;
  background: var(--navy);
  color: var(--white);
  padding: 0.7rem 0.9rem;
  border-radius: 0 0 10px 10px;
}
.skip-link:focus { top: 0; }
.hero-shell {
  background: radial-gradient(circle at top left, rgba(255,255,255,0.9), rgba(255,255,255,0) 32%), linear-gradient(135deg, #ebf5f0 0%, #edf3f6 45%, #f8fafc 100%);
  padding: 54px 0 34px;
}
.hero-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: 36px;
}
.eyebrow, .section-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 135, 81, 0.08);
  color: var(--green-deep);
  border: 1px solid rgba(0, 135, 81, 0.12);
  border-radius: 999px;
  padding: 7px 12px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.hero-copy h1, .section-heading h2, .two-column h2, .page-hero h1 {
  letter-spacing: -0.04em;
  line-height: 1.06;
  margin: 1rem 0;
  color: var(--navy);
}
.hero-copy h1 { font-size: clamp(2.5rem, 5vw, 4.5rem); }
.hero-copy p { font-size: 1.08rem; color: var(--muted); max-width: 62ch; }
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin: 1.8rem 0;
}
.hero-points {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.8rem;
  color: var(--navy);
  font-weight: 600;
  font-size: 0.95rem;
}
.hero-points li { position: relative; padding-left: 1.2rem; }
.hero-points li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.65rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gold);
}
.hero-visual {
  position: relative;
  min-height: 500px;
  display: grid;
  place-items: center;
}
.ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(10, 37, 64, 0.12);
}
.ring-one { width: 440px; height: 440px; }
.ring-two { width: 360px; height: 360px; }
.portrait-wrap {
  position: relative;
  width: min(440px, 92%);
  aspect-ratio: 0.9;
  background: linear-gradient(135deg, rgba(0, 135, 81, 0.14), rgba(212, 175, 55, 0.18));
  border-radius: 34px;
  overflow: hidden;
  box-shadow: var(--shadow);
  border: 10px solid rgba(255,255,255,0.8);
}
.portrait-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.badge {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--navy);
  color: var(--white);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 700;
  padding: 0.52rem 0.75rem;
  box-shadow: 0 12px 20px rgba(10, 37, 64, 0.2);
}
.badge-top { top: 24px; right: 8%; }
.badge-left { left: 8%; bottom: 70px; }
.badge-right { right: 4%; bottom: 26px; }
.stats-strip { margin-top: -12px; }
.stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
.stat-card {
  background: var(--white);
  border-radius: 20px;
  border: 1px solid var(--line);
  padding: 1.6rem 1.2rem;
  display: grid;
  gap: 8px;
  box-shadow: 0 10px 24px rgba(10, 37, 64, 0.04);
}
.stat-card strong { font-size: clamp(1.3rem, 2vw, 1.8rem); color: var(--navy); }
.stat-card span { color: var(--muted); font-weight: 600; }
.section { padding: 86px 0; }
.section-soft { background: #edf5f2; }
.section-highlight {
  background: linear-gradient(135deg, rgba(0, 135, 81, 0.9), rgba(10, 37, 64, 0.98));
  color: var(--white);
}
.section-heading { margin-bottom: 2rem; }
.section-heading.center { text-align: center; }
.section-heading h2, .two-column h2, .page-hero h1 { font-size: clamp(2rem, 4vw, 3rem); }
.two-column {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 24px;
  align-items: start;
}
.two-column p, .feature-card p, .priority-card p, .content-card p, .page-hero p, .contact-card p {
  color: var(--muted);
  font-size: 1.02rem;
}
.quote-box {
  background: linear-gradient(135deg, var(--navy), #10355d);
  color: var(--white);
  padding: 2rem 1.6rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
.quote-box p {
  font-size: clamp(1.4rem, 2vw, 2rem);
  line-height: 1.25;
  color: var(--white);
  margin-top: 0;
}
.quote-box span {
  display: inline-block;
  margin-top: 1rem;
  color: rgba(255,255,255,0.8);
  font-weight: 600;
}
.feature-grid { display: grid; gap: 22px; }
.three-up { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.feature-card, .priority-card, .content-card, .contact-card, .news-card, .gallery-card {
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: 0 12px 22px rgba(10, 37, 64, 0.04);
}
.feature-card { position: relative; }
.icon {
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  background: var(--green-soft);
  color: var(--green-deep);
  border-radius: 12px;
  font-size: 0.78rem;
  font-weight: 800;
  margin-bottom: 1rem;
}
.feature-card h3, .priority-card h3, .content-card h3, .news-card h3, .gallery-card h3, .contact-card h3 {
  margin-top: 0;
  margin-bottom: 0.6rem;
  color: var(--navy);
  font-size: 1.4rem;
}
.priority-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; }
.home-priority-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.priority-card { background: linear-gradient(180deg, #ffffff 0%, #f4faf7 100%); }
.standout-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 2rem 2.2rem;
  border-radius: var(--radius);
  border: 1px solid rgba(255,255,255,0.15);
}
.standout-box h2 {
  margin: 0.9rem 0 0;
  color: var(--white);
  font-size: clamp(1.7rem, 3vw, 2.5rem);
}
.standout-actions { display: flex; flex-wrap: wrap; gap: 14px; }
.page-hero {
  background: linear-gradient(135deg, rgba(0, 135, 81, 0.08), rgba(10, 37, 64, 0.06));
  padding: 72px 0 42px;
}
.page-hero .container { max-width: 960px; }
.page-hero h1 { margin: 0.8rem 0 0.7rem; }
.content-stack { display: grid; gap: 22px; padding: 46px 0; }
.content-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px; }
.contact-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 22px; }
.contact-card form { display: grid; gap: 16px; }
.contact-card label { display: grid; gap: 8px; font-weight: 600; color: var(--navy); }
.contact-card input, .contact-card textarea, .contact-card select {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--white);
  padding: 0.9rem 1rem;
  color: var(--ink);
}
.contact-card textarea { min-height: 130px; resize: vertical; }
.site-footer { background: var(--navy); color: rgba(248,250,252,0.8); padding: 2.5rem 0 1rem; }
.footer-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 22px; }
.brand-footer .brand-mark { width: 46px; height: 46px; }
.site-footer h3 { margin-top: 0; margin-bottom: 0.9rem; color: var(--white); font-size: 0.98rem; }
.site-footer ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
}
.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255,255,255,0.12);
  color: rgba(248,250,252,0.72);
  font-size: 0.92rem;
}
.menu-toggle {
  display: none;
  background: var(--green-soft);
  color: var(--navy);
  border: 1px solid rgba(0, 135, 81, 0.16);
  border-radius: 12px;
  padding: 0.7rem 0.9rem;
  font-weight: 700;
}
.site-nav[hidden] { display: flex !important; }
@media (max-width: 980px) {
  .hero-grid, .two-column, .contact-grid, .content-grid, .footer-grid, .priority-grid, .three-up, .stats-grid { grid-template-columns: 1fr 1fr; }
  .priority-grid, .home-priority-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 760px) {
  .menu-toggle { display: inline-flex; }
  .nav-wrap { flex-wrap: wrap; padding: 0.8rem 0; }
  .site-nav {
    display: none;
    order: 3;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    background: rgba(255,255,255,0.98);
    border: 1px solid var(--line);
    border-radius: 18px;
    padding: 1rem;
    box-shadow: 0 18px 38px rgba(10, 37, 64, 0.08);
    margin-top: 0.25rem;
  }
  .nav-cta { display: none; }
  .hero-grid, .two-column, .contact-grid, .content-grid, .priority-grid, .three-up, .stats-grid, .footer-grid { grid-template-columns: 1fr; }
  .hero-points { grid-template-columns: 1fr; }
  .standout-box, .footer-bottom, .utility-inner { flex-direction: column; align-items: flex-start; }
  .brand-copy strong { font-size: 0.84rem; }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { transition: none !important; animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
}
