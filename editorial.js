(() => {
  "use strict";
  const search = document.querySelector("[data-search]");
  const filter = document.querySelector("[data-filter]");
  const cardsRoot = document.querySelector(".cards");
  const empty = document.querySelector("[data-empty]");
  const path = window.location.pathname.replace(/\\/+$/, "").replace(/\\.html$/i, "");
  const page = path.split("/").pop() || "home";
  const feeds = {
    gallery: { file: "/gallery.json", title: "No approved photographs are published yet.", mode: "gallery" },
    announcements: { file: "/announcements.json", title: "There are no approved announcements published at the moment.", mode: "published" },
    press: { file: "/press-centre.json", title: "There are no approved press items published at the moment.", mode: "published" },
    news: { file: "/news.json", title: "There are no approved news items published yet.", mode: "published" }
  };
  function txt(value) { return typeof value === "string" ? value.trim() : ""; }
  function validDate(value) { return /^\\d{4}-\\d{2}-\\d{2}$/.test(txt(value)) && !txt(value).startsWith("YYYY"); }
  function safeUrl(value) {
    const url = txt(value);
    if (url.startsWith("/") && !url.startsWith("//")) return url;
    try { const parsed = new URL(url); if (parsed.protocol === "https:") return parsed.href; } catch (_) {}
    return "";
  }
  function usable(item, mode) {
    if (!item || !txt(item.title) || !validDate(item.date)) return false;
    if (mode === "published" && item.status !== "published") return false;
    if (mode === "gallery" && (!txt(item.image) || /replace-with|placeholder|event title/i.test(txt(item.image) + " " + txt(item.title)))) return false;
    return true;
  }
  function formatDate(value) {
    if (!validDate(value)) return "";
    const p = value.split("-").map(Number);
    return new Date(Date.UTC(p[0], p[1]-1, p[2])).toLocaleDateString("en-NG", {day:"numeric",month:"long",year:"numeric",timeZone:"UTC"});
  }
  function node(tag, cls, value) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (value !== undefined && value !== null) el.textContent = String(value);
    return el;
  }
  function renderItem(item, mode) {
    const article = node("article", "card" + (mode === "gallery" ? " gallery-card" : ""));
    article.setAttribute("data-card", "");
    article.dataset.category = txt(item.category).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") || "all";
    const imageUrl = safeUrl(item.image);
    if (imageUrl) {
      const img = node("img", "feature-image");
      img.src = imageUrl; img.alt = txt(item.alt || item.imageAlt) || txt(item.title);
      img.loading = "lazy"; img.decoding = "async"; img.referrerPolicy = "no-referrer";
      article.appendChild(img);
    }
    const body = node("div", "card-body");
    body.appendChild(node("span","tag",txt(item.category) || (mode === "gallery" ? "Photo gallery" : "Official update")));
    body.appendChild(node("p","date",formatDate(item.date)));
    body.appendChild(node("h2","",item.title));
    const summary = txt(item.summary || item.caption || item.excerpt || item.description);
    if (summary) body.appendChild(node("p","",summary));
    const fullBody = txt(item.body);
    if (fullBody && mode !== "gallery") body.appendChild(node("p","",fullBody.length > 480 ? fullBody.slice(0,477).trimEnd()+"…" : fullBody));
    if (txt(item.location)) body.appendChild(node("p","note","Location: "+txt(item.location)));
    if (txt(item.credit)) body.appendChild(node("p","note","Photo: "+txt(item.credit)));
    const href = safeUrl(item.url);
    if (href) { const a = node("a","card-link","Read more →"); a.href=href; if (href.startsWith("http")) a.rel="noopener noreferrer"; body.appendChild(a); }
    article.appendChild(body);
    return article;
  }
  function applyFilters() {
    if (!cardsRoot) return;
    const q = txt(search && search.value).toLowerCase();
    const selected = txt(filter && filter.value) || "all";
    let count = 0;
    cardsRoot.querySelectorAll("[data-card]").forEach(card => {
      const category = card.dataset.category || "all";
      const show = (!q || card.textContent.toLowerCase().includes(q)) && (selected === "all" || category === selected || category === "all");
      card.classList.toggle("hidden", !show);
      if (show) count++;
    });
    if (empty) empty.classList.toggle("hidden", count > 0);
  }
  if (search) search.addEventListener("input", applyFilters);
  if (filter) filter.addEventListener("change", applyFilters);
  const feed = feeds[page];
  if (feed && cardsRoot) {
    fetch(feed.file, {cache:"no-store",headers:{"Accept":"application/json"}})
      .then(response => { if (!response.ok) throw new Error("Feed request failed: "+response.status); return response.json(); })
      .then(data => {
        const items = Array.isArray(data.items) ? data.items.filter(item => usable(item,feed.mode)) : [];
        cardsRoot.replaceChildren();
        items.sort((a,b) => txt(b.date).localeCompare(txt(a.date)));
        items.forEach(item => cardsRoot.appendChild(renderItem(item,feed.mode)));
        if (empty) {
          const heading = empty.querySelector("strong");
          if (heading) heading.textContent = feed.title;
          empty.classList.toggle("hidden",items.length>0);
        }
        applyFilters();
      })
      .catch(() => {
        if (empty) {
          empty.classList.remove("hidden");
          const heading = empty.querySelector("strong");
          if (heading) heading.textContent = "Content could not be loaded.";
        }
      });
  } else applyFilters();
  document.querySelectorAll("[data-current-year], #year").forEach(el => el.textContent = String(new Date().getFullYear()));
})();
