const FEED_DEFS = [
  { key: 'press', label: 'Press Centre', file: 'press-centre.json', defaultData: { schemaVersion: 1, items: [], publishingNote: 'Add only verified, approved media content.' } },
  { key: 'announcements', label: 'Announcements', file: 'announcements.json', defaultData: { schemaVersion: 1, items: [], publishingNote: 'Add only verified, approved content. Keep drafts out of the public site.' } },
  { key: 'news', label: 'News & Updates', file: 'news.json', defaultData: { schemaVersion: 1, items: [], publishingNote: 'Add only approved news items. Keep drafts out of the public site.' } },
  { key: 'gallery', label: 'Gallery', file: 'gallery.json', defaultData: { schemaVersion: 1, items: [], publishingNote: 'Add only authorised photographs with accurate dates and alt text.' } }
];

const STORAGE_PREFIX = 'babs_admin_';
const nav = document.getElementById('feed-nav');
const itemsContainer = document.getElementById('items-container');
const activeFeedTitle = document.getElementById('active-feed-title');
const publishingNote = document.getElementById('publishing-note');
const statusBox = document.getElementById('status-box');
const itemTemplate = document.getElementById('item-template');

const state = { activeKey: FEED_DEFS[0].key, data: {} };

function deepClone(value) { return JSON.parse(JSON.stringify(value)); }
function makeId(prefix = 'entry') { return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2,8)}`; }
function blankItem() {
  return {
    id: makeId('item'),
    title: '',
    date: '',
    category: '',
    summary: '',
    body: '',
    caption: '',
    image: '',
    imageAlt: '',
    alt: '',
    location: '',
    credit: '',
    author: '',
    source: '',
    url: '',
    status: 'draft'
  };
}

function normalizeFeed(feedKey, incoming) {
  const def = FEED_DEFS.find(f => f.key === feedKey) || FEED_DEFS[0];
  const safe = incoming && typeof incoming === 'object' ? incoming : {};
  const items = Array.isArray(safe.items) ? safe.items : [];
  return {
    schemaVersion: Number.isFinite(safe.schemaVersion) ? safe.schemaVersion : 1,
    items: items.map(item => ({ ...blankItem(), ...item })),
    publishingNote: typeof safe.publishingNote === 'string' ? safe.publishingNote : def.defaultData.publishingNote
  };
}

function renderNav() {
  nav.innerHTML = '';
  FEED_DEFS.forEach(feed => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `feed-button ${feed.key === state.activeKey ? 'active' : ''}`;
    button.textContent = feed.label;
    button.addEventListener('click', () => {
      state.activeKey = feed.key;
      renderNav();
      renderActiveFeed();
    });
    nav.appendChild(button);
  });
}

function renderActiveFeed() {
  const feedDef = FEED_DEFS.find(f => f.key === state.activeKey) || FEED_DEFS[0];
  const data = state.data[state.activeKey] || { schemaVersion: 1, items: [], publishingNote: feedDef.defaultData.publishingNote };
  activeFeedTitle.textContent = feedDef.label;
  publishingNote.value = data.publishingNote || '';

  itemsContainer.innerHTML = '';

  if (!data.items.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No entries yet. Add a new item to begin publishing.';
    itemsContainer.appendChild(empty);
    return;
  }

  data.items.forEach((item, index) => {
    const node = itemTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector('.item-index').textContent = `Entry ${index + 1}`;

    const fields = node.querySelectorAll('[data-field]');
    fields.forEach(input => {
      const fieldName = input.dataset.field;
      input.value = item[fieldName] ?? '';
      input.addEventListener('input', () => {
        state.data[state.activeKey].items[index][fieldName] = input.value;
      });
    });

    const removeButton = node.querySelector('.delete-item');
    removeButton.addEventListener('click', () => {
      state.data[state.activeKey].items.splice(index, 1);
      renderActiveFeed();
    });

    const uploadInput = node.querySelector('.image-upload');
    const previewHolder = node.querySelector('.image-preview');
    const imageValue = item.image || '';

    if (imageValue) {
      previewHolder.style.display = 'flex';
      previewHolder.innerHTML = `<img src="${imageValue}" alt="Preview">`;
    }

    uploadInput.addEventListener('change', event => {
      const [file] = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const value = String(reader.result || '');
        const current = state.data[state.activeKey];
        current.items[index].image = value;
        previewHolder.innerHTML = `<img src="${value}" alt="Uploaded preview">`;
        previewHolder.style.display = 'flex';
      };
      reader.readAsDataURL(file);
    });

    itemsContainer.appendChild(node);
  });
}

function loadLocalFeed(feedKey) {
  const raw = localStorage.getItem(`${STORAGE_PREFIX}${feedKey}`);
  if (!raw) return null;
  try { return normalizeFeed(feedKey, JSON.parse(raw)); } catch { return null; }
}

async function initialize() {
  for (const feed of FEED_DEFS) {
    const local = loadLocalFeed(feed.key);
    if (local) {
      state.data[feed.key] = local;
    } else {
      state.data[feed.key] = { schemaVersion: 1, items: [], publishingNote: feed.defaultData.publishingNote };
    }
  }

  renderNav();
  renderActiveFeed();
}

document.getElementById('save-all').addEventListener('click', () => {
  FEED_DEFS.forEach(feed => {
    const current = state.data[feed.key] || { schemaVersion: 1, items: [], publishingNote: feed.defaultData.publishingNote };
    localStorage.setItem(`${STORAGE_PREFIX}${feed.key}`, JSON.stringify(current));
  });
  statusBox.textContent = 'All feed data saved locally.';
});

document.getElementById('export-json').addEventListener('click', () => {
  const feed = state.data[state.activeKey];
  const blob = new Blob([JSON.stringify(feed, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${state.activeKey}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
});

document.getElementById('add-item').addEventListener('click', () => {
  const feed = state.data[state.activeKey];
  if (!feed.items) feed.items = [];
  feed.items.push(blankItem());
  renderActiveFeed();
});

publishingNote.addEventListener('input', () => {
  const current = state.data[state.activeKey];
  if (current) current.publishingNote = publishingNote.value.trim();
});

initialize();
