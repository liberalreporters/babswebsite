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

const state = {
  activeKey: FEED_DEFS[0].key,
  data: {} 
};

function getStorageKey(key) {
  return `${STORAGE_PREFIX}${key}`;
}

function setStatus(message) {
  statusBox.textContent = message;
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function makeId(prefix = 'entry') {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2,8)}`;
}

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

function readLocalFeed(feedKey) {
  const raw = localStorage.getItem(getStorageKey(feedKey));
  if (!raw) return null;
  try {
    return normalizeFeed(feedKey, JSON.parse(raw));
  } catch {
    return null;
  }
}

async function loadRemoteFeed(feedDef) {
  try {
    const response = await fetch(`/${feedDef.file}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('not found');
    const data = await response.json();
    return normalizeFeed(feedDef.key, data);
  } catch {
    return null;
  }
}

async function hydrateFeed(feedKey) {
  const feedDef = FEED_DEFS.find(f => f.key === feedKey) || FEED_DEFS[0];
  const saved = readLocalFeed(feedKey);
  const remote = await loadRemoteFeed(feedDef);
  const chosen = remote || saved || deepClone(feedDef.defaultData);
  state.data[feedKey] = normalizeFeed(feedKey, chosen);
  localStorage.setItem(getStorageKey(feedKey), JSON.stringify(state.data[feedKey]));
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
  const data = state.data[state.activeKey] || deepClone(feedDef.defaultData);
  activeFeedTitle.textContent = feedDef.label;
  publishingNote.value = data.publishingNote || '';

  itemsContainer.innerHTML = '';
  const items = Array.isArray(data.items) ? data.items : [];

  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No entries yet. Add a new item to begin publishing.';
    itemsContainer.appendChild(empty);
    return;
  }

  items.forEach((item, index) => {
    const node = itemTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector('.item-index').textContent = `Entry ${index + 1}`;

    const fields = node.querySelectorAll('[data-field]');
    fields.forEach(input => {
      const fieldName = input.dataset.field;
      input.value = item[fieldName] ?? '';
      input.addEventListener('input', () => {
        const current = state.data[state.activeKey];
        current.items[index][fieldName] = input.value;
      });
      input.addEventListener('change', () => {
        const current = state.data[state.activeKey];
        current.items[index][fieldName] = input.value;
      });
    });

    const uploadInput = node.querySelector('.image-upload');
    const previewHolder = node.querySelector('.image-preview');
    const imageValue = item.image || '';
    if (imageValue) {
      previewHolder.style.display = 'flex';
      previewHolder.innerHTML = `<img src="${imageValue}" alt="Preview">`;
    }
    uploadInput.addEventListener('change', event => {
      const [file] = event.target.files;
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const value = String(reader.result || '');
        const current = state.data[state.activeKey];
        current.items[index].image = value;
        previewHolder.innerHTML = `<img src="${value}" alt="Uploaded preview">`;
        previewHolder.style.display = 'flex';
        const imageField = node.querySelector('[data-field="image"]');
        if (imageField) imageField.value = value;
      };
      reader.readAsDataURL(file);
    });

    const removeButton = node.querySelector('.delete-item');
    removeButton.addEventListener('click', () => {
      const current = state.data[state.activeKey];
      current.items.splice(index, 1);
      renderActiveFeed();
    });

    itemsContainer.appendChild(node);
  });
}

function collectState() {
  const feedDef = FEED_DEFS.find(f => f.key === state.activeKey) || FEED_DEFS[0];
  const current = state.data[state.activeKey] || deepClone(feedDef.defaultData);
  current.publishingNote = publishingNote.value.trim();
  state.data[state.activeKey] = normalizeFeed(state.activeKey, current);
  return state.data[state.activeKey];
}

function saveCurrentFeed() {
  const current = collectState();
  localStorage.setItem(getStorageKey(state.activeKey), JSON.stringify(current));
  setStatus(`${FEED_DEFS.find(f => f.key === state.activeKey)?.label || 'Feed'} saved locally.`);
}

function saveAllFeeds() {
  FEED_DEFS.forEach(feed => {
    const current = state.data[feed.key] || deepClone(feed.defaultData);
    current.publishingNote = current.publishingNote || feed.defaultData.publishingNote;
    state.data[feed.key] = normalizeFeed(feed.key, current);
    localStorage.setItem(getStorageKey(feed.key), JSON.stringify(state.data[feed.key]));
  });
  setStatus('All content feeds saved in this browser.');
}

function addItem() {
  const feedDef = FEED_DEFS.find(f => f.key === state.activeKey) || FEED_DEFS[0];
  const current = state.data[state.activeKey] || deepClone(feedDef.defaultData);
  current.items = Array.isArray(current.items) ? current.items : [];
  current.items.push(blankItem());
  state.data[state.activeKey] = normalizeFeed(state.activeKey, current);
  renderActiveFeed();
}

function exportCurrentFeed() {
  const feed = collectState();
  const blob = new Blob([JSON.stringify(feed, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${state.activeKey}.json`;
  link.click();
  URL.revokeObjectURL(url);
  setStatus(`JSON exported for ${state.activeKey}.`);
}

async function initialize() {
  for (const feed of FEED_DEFS) {
    await hydrateFeed(feed.key);
  }
  renderNav();
  renderActiveFeed();
}

document.getElementById('save-all').addEventListener('click', saveAllFeeds);
document.getElementById('export-json').addEventListener('click', exportCurrentFeed);
document.getElementById('add-item').addEventListener('click', addItem);
publishingNote.addEventListener('input', () => {
  const current = state.data[state.activeKey];
  if (current) current.publishingNote = publishingNote.value.trim();
});

initialize();
