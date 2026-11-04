/* ============================================================
   POKÉSPIRE — game logic
   ============================================================ */
import {
  TYPES, CARDS, STARTERS, SPECIES, TIER_POOLS, ELITE_POOL, RELICS, RELIC_POOL,
  MAP_NODES, NODE_META, COMMON_POOL, UNCOMMON_POOL, RARE_POOL,
  icon, getStats, cardDescription, typeLabel, typeColor
} from './data.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const esc = (s = '') => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function uniquePicks(pool, n, filter = () => true) {
  return shuffle(pool.filter(filter)).slice(0, n);
}
function setImg(el, src) {
  if (el && el.getAttribute('src') !== src) el.src = src;
}

const BALLS = {
  poke:   { name: 'Poké Ball', short: 'Poké', bonus: 12, cls: 'ball-poke', price: 18 },
  great:  { name: 'Great Ball', short: 'Great', bonus: 26, cls: 'ball-great', price: 42 },
  ultra:  { name: 'Ultra Ball', short: 'Ultra', bonus: 42, cls: 'ball-ultra', price: 80 },
  master: { name: 'Master Ball', short: 'Master', bonus: 100, cls: 'ball-master', price: 160 }
};
const MAX_PARTY = 6;
const SAVE_KEY = 'pokespire_save_v1';
const SOUND_KEY = 'pokespire_sound';

const state = {
  screen: 'title',
  run: null,
  battle: null,
  node: null,
  shop: null,
  camp: null,
  treasure: null,
  overlay: null,
  uid: 1,
  sound: localStorage.getItem(SOUND_KEY) !== 'off',
  audio: null,
  reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

const NODE_BY_ID = Object.fromEntries(MAP_NODES.map(n => [n.id, n]));
const MAP_EDGES = [];
for (const n of MAP_NODES) {
  if (n.row >= 11) continue;
  for (const m of MAP_NODES) {
    if (m.row === n.row + 1 && Math.abs(m.col - n.col) <= 1) MAP_EDGES.push([n.id, m.id]);
  }
}

/* ============================================================
   Audio
   ============================================================ */
function ensureAudio() {
  if (!state.sound) return null;
  if (!state.audio) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    state.audio = new AC();
  }
  if (state.audio.state === 'suspended') state.audio.resume();
  return state.audio;
}
function tone(freq, duration = .08, type = 'sine', vol = .035, slideTo = null) {
  const ac = ensureAudio();
  if (!ac) return;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, ac.currentTime);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), ac.currentTime + duration);
  g.gain.setValueAtTime(.0001, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(vol, ac.currentTime + .012);
  g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + duration);
  o.connect(g); g.connect(ac.destination);
  o.start(); o.stop(ac.currentTime + duration + .02);
}
function sfx(name) {
  if (!state.sound) return;
  switch (name) {
    case 'click': tone(520, .05, 'triangle', .025); break;
    case 'card': tone(330, .09, 'triangle', .03, 440); break;
    case 'hit': tone(120, .13, 'sawtooth', .045, 55); break;
    case 'block': tone(210, .1, 'square', .025, 260); break;
    case 'heal': tone(620, .14, 'sine', .03, 840); break;
    case 'coin': tone(1040, .08, 'triangle', .03, 1320); break;
    case 'buy': tone(760, .08, 'triangle', .03, 990); setTimeout(() => tone(1140, .1, 'triangle', .025), 70); break;
    case 'error': tone(140, .12, 'square', .03, 100); break;
    case 'turn': tone(390, .1, 'sine', .025, 520); break;
    case 'catch': [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, .14, 'triangle', .03), i * 80)); break;
    case 'fail': tone(180, .18, 'sawtooth', .03, 90); break;
    case 'victory': [392, 523, 659, 784].forEach((f, i) => setTimeout(() => tone(f, .22, 'sine', .03), i * 110)); break;
    case 'lose': [330, 262, 196, 147].forEach((f, i) => setTimeout(() => tone(f, .25, 'sine', .035), i * 140)); break;
    default: tone(440, .06, 'sine', .02);
  }
}
function updateSoundButtons() {
  const label = state.sound ? 'Sound: on' : 'Sound: off';
  const btn = $('#btn-title-sound');
  if (btn) btn.textContent = label;
  $$('.sound-toggle').forEach(b => { b.classList.toggle('sound-off', !state.sound); });
}
function toggleSound() {
  state.sound = !state.sound;
  localStorage.setItem(SOUND_KEY, state.sound ? 'on' : 'off');
  updateSoundButtons();
  if (state.sound) sfx('click');
}

/* ============================================================
   Ambient fireflies
   ============================================================ */
function setupAmbient() {
  const canvas = $('#ambient');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1;
  const parts = [];
  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = canvas.width = Math.floor(innerWidth * dpr);
    h = canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
  }
  function make() {
    parts.length = 0;
    const count = Math.max(26, Math.min(70, Math.floor(innerWidth / 24)));
    for (let i = 0; i < count; i++) {
      parts.push({
        x: Math.random() * w, y: Math.random() * h,
        r: rand(.7, 2.1) * dpr, vx: rand(-.07, .07) * dpr, vy: rand(-.16, -.03) * dpr,
        a: rand(.12, .6), p: rand(0, Math.PI * 2), sp: rand(.005, .02)
      });
    }
  }
  resize(); make();
  addEventListener('resize', () => { resize(); make(); });
  let last = performance.now();
  function frame(t) {
    const dt = Math.min(2, (t - last) / 16.67); last = t;
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.x += p.vx * dt; p.y += p.vy * dt; p.p += p.sp * dt;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      const alpha = p.a * (0.55 + 0.45 * Math.sin(p.p));
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
      g.addColorStop(0, `rgba(240,219,151,${alpha})`);
      g.addColorStop(.35, `rgba(190,220,160,${alpha * .35})`);
      g.addColorStop(1, 'rgba(190,220,160,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(255,244,195,${alpha})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  if (!state.reduced) requestAnimationFrame(frame);
}

/* ============================================================
   Boot
   ============================================================ */
function init() {
  setupAmbient();
  bindGlobal();
  updateSoundButtons();
  refreshContinueButton();
  setScreen('title');
  if (state.run) updateHud();
}

function bindGlobal() {
  $('#btn-start')?.addEventListener('click', () => { sfx('click'); openStarterSelect(); });
  $('#btn-continue')?.addEventListener('click', () => { sfx('click'); continueRun(); });
  $('#btn-how')?.addEventListener('click', () => { sfx('click'); openHowToPlay(); });
  $('#btn-title-sound')?.addEventListener('click', toggleSound);
  $('#hud-brand')?.addEventListener('click', () => { if (state.run) openMenu(); });
  $$('.hud-btn[data-open]').forEach(btn => btn.addEventListener('click', () => {
    sfx('click');
    const what = btn.dataset.open;
    if (what === 'deck') openDeckModal();
    else if (what === 'party') openPartyModal();
    else if (what === 'menu') openMenu();
  }));
  $('#btn-end-turn')?.addEventListener('click', endTurn);
  $('#btn-battle-help')?.addEventListener('click', openBattleHelp);
  $('#btn-view-deck-battle')?.addEventListener('click', () => openDeckModal());
  $('#pile-draw')?.addEventListener('click', () => openPileModal('draw'));
  $('#pile-discard')?.addEventListener('click', () => openPileModal('discard'));
  $('#btn-shop-leave')?.addEventListener('click', () => { if (state.shop) { sfx('click'); completeNode(state.shop.node); state.shop = null; } });
  $('#btn-shop-remove')?.addEventListener('click', shopRemoveCard);
  $('#btn-shop-heal')?.addEventListener('click', shopHeal);
  $('#btn-camp-rest')?.addEventListener('click', campRest);
  $('#btn-camp-train')?.addEventListener('click', campTrain);
  $('#btn-camp-leave')?.addEventListener('click', () => { if (state.camp) { sfx('click'); completeNode(state.camp.node); state.camp = null; } });

  document.addEventListener('click', (e) => {
    if (!state.audio) ensureAudio();
    const t = e.target.closest('[data-close]');
    if (t) { closeOverlay(); sfx('click'); }
  }, { capture: true });

  $('#overlay-root')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('overlay') && state.overlay?.dismissible) closeOverlay();
  });

  document.addEventListener('mouseover', (e) => {
    const t = e.target.closest('[data-tip]');
    if (t) showTooltip(t.dataset.tip, e.clientX, e.clientY);
  });
  document.addEventListener('mousemove', (e) => {
    const t = e.target.closest('[data-tip]');
    if (t) positionTooltip(e.clientX, e.clientY);
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('[data-tip]')) hideTooltip();
  });

  document.addEventListener('keydown', onKeyDown);
  addEventListener('resize', () => {
    if (state.battle && state.screen === 'battle') renderHand();
  });
}

function onKeyDown(e) {
  if (e.key === 'Escape') {
    if (state.overlay?.dismissible) { closeOverlay(); e.preventDefault(); }
    else if (!state.overlay && state.run && state.screen !== 'title') { openMenu(); e.preventDefault(); }
    return;
  }
  if (state.overlay || state.screen !== 'battle' || !state.battle) return;
  if (e.code === 'Space') {
    e.preventDefault();
    if (!state.battle.busy && !state.battle.over) endTurn();
  } else if (/^[1-9]$/.test(e.key)) {
    const card = state.battle.hand[Number(e.key) - 1];
    if (card) playCard(card.uid);
  } else if (e.key.toLowerCase() === 'd') {
    openDeckModal();
  } else if (e.key.toLowerCase() === 'p') {
    openPartyModal();
  }
}

/* ============================================================
   Screen / title / save
   ============================================================ */
function setScreen(name) {
  state.screen = name;
  $$('.screen').forEach(el => el.classList.toggle('active', el.id === 'screen-' + name));
  $('#hud').classList.toggle('hidden', name === 'title');
  document.body.dataset.screen = name;
  if (name !== 'battle') $('#screen-battle')?.classList.remove('boss-fight');
  if (name === 'battle') { const bs = $('#screen-battle'); if (bs) { bs.scrollLeft = 0; bs.scrollTop = 0; } }
}
function showTitle() {
  state.run = null;
  state.battle = null;
  state.node = null;
  state.shop = null;
  state.camp = null;
  state.treasure = null;
  closeOverlay();
  refreshContinueButton();
  setScreen('title');
  updateSoundButtons();
}
function refreshContinueButton() {
  const btn = $('#btn-continue');
  if (!btn) return;
  btn.classList.toggle('hidden', !hasSave());
}
function hasSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    return data && data.version === 1 && data.deck?.length;
  } catch { return false; }
}
function saveRun() {
  if (!state.run) return;
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state.run)); } catch { /* storage may be full */ }
}
function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch {} }
function continueRun() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (!data || data.version !== 1) throw new Error('bad save');
    state.run = data;
    state.uid = Math.max(1, ...data.deck.map(c => parseInt(String(c.uid).replace('c', ''), 10) || 0)) + 1;
    if (!state.run.path) state.run.path = [...(state.run.visited || ['start'])];
    if (!state.run.balls) state.run.balls = { poke: 5, great: 1, ultra: 0, master: 0 };
    if (!state.run.relics) state.run.relics = [];
    if (!state.run.party) state.run.party = [state.run.starter];
    showMap();
    toast(`Expedition resumed — floor ${Math.min(12, state.run.floor + 1)}.`, 'good');
  } catch {
    clearSave();
    refreshContinueButton();
    toast('That save could not be read.', 'bad');
  }
}

function openStarterSelect() {
  const cards = Object.values(STARTERS).map(st => {
    const types = st.types.map(t => `<span class="type-${t}">${TYPES[t].label}</span>`).join(' · ');
    const deckText = st.deck.map(([id, n]) => `${n}× ${CARDS[id].name}`).join(', ');
    return `
      <button class="starter-card" data-starter="${st.key}" style="--sc:${st.color}">
        <img src="assets/pokemon/${st.key}.gif" alt="${st.name}">
        <h3>${st.name}</h3>
        <div class="starter-type">${types}</div>
        <div class="starter-style">${st.style}</div>
        <p>${st.blurb}</p>
        <div class="starter-hp"><span>HP <b>${st.hp}</b></span><span>Deck <b>12</b></span></div>
        <div class="starter-deck">${deckText}</div>
        <div class="starter-pick btn btn-primary btn-small">Choose ${st.name}</div>
      </button>`;
  }).join('');
  openOverlay(`
    <div class="modal-head">
      <div class="section-kicker">Choose a partner</div>
      <h2>Who climbs with you?</h2>
      <p>Your partner defines your starting deck and your approach to every fight.</p>
    </div>
    <div class="starter-grid">${cards}</div>
    <div class="modal-actions"><button class="btn btn-ghost" data-close>Not yet</button></div>
  `, {
    wide: true, dismissible: true, onMount(root) {
      $$('[data-starter]', root).forEach(btn => btn.addEventListener('click', () => {
        sfx('click');
        startNewRun(btn.dataset.starter);
      }));
    }
  });
}

function startNewRun(starterKey) {
  const st = STARTERS[starterKey];
  if (!st) return;
  closeOverlay();
  state.uid = 1;
  const run = {
    version: 1, starter: starterKey, partner: starterKey,
    hp: st.hp, maxHp: st.hp, gold: 80,
    deck: [], party: [starterKey],
    balls: { poke: 5, great: 1, ultra: 0, master: 0 },
    relics: [], current: 'start', visited: ['start'], path: ['start'],
    floor: 0, caught: 0, battles: 0, kills: 0, startedAt: Date.now()
  };
  state.run = run;
  for (const [id, count] of st.deck) {
    for (let i = 0; i < count; i++) run.deck.push(makeCard(id));
  }
  saveRun();
  showMap();
  toast(`The climb begins with ${st.name}.`, 'good');
}

/* ============================================================
   HUD & map
   ============================================================ */
function makeCard(id, upgraded = false) {
  return { uid: 'c' + state.uid++, id, upgraded };
}
function addCard(id, upgraded = false) {
  const c = makeCard(id, upgraded);
  state.run.deck.push(c);
  return c;
}
function updateHud() {
  const run = state.run;
  if (!run) return;
  const hpPct = clamp((run.hp / run.maxHp) * 100, 0, 100);
  $('#hud-hp-text').textContent = `${Math.max(0, run.hp)} / ${run.maxHp}`;
  const fill = $('#hud-hp-fill');
  fill.style.width = hpPct + '%';
  fill.classList.toggle('low', hpPct <= 30);
  $('#hud-gold').querySelector('b').textContent = run.gold;
  const balls = (run.balls.poke || 0) + (run.balls.great || 0) + (run.balls.ultra || 0) + (run.balls.master || 0);
  $('#hud-balls').querySelector('b').textContent = balls;
  $('#hud-floor').querySelector('b').textContent = Math.min(12, run.floor + 1);
  $('#hud-deck-count').textContent = run.deck.length;
  $('#hud-party-count').textContent = run.party.length;
}

function showMap() {
  if (!state.run) { showTitle(); return; }
  closeOverlay();
  state.battle = null;
  setScreen('map');
  updateHud();
  renderMap();
  renderSidePanel();
}
function availableNodes() {
  const run = state.run;
  if (!run) return [];
  const cur = NODE_BY_ID[run.current] || NODE_BY_ID.start;
  const next = MAP_NODES.filter(n => n.row === cur.row + 1 && Math.abs(n.col - cur.col) <= 1);
  return next.filter(n => !run.visited.includes(n.id));
}
function renderMap() {
  const run = state.run;
  if (!run) return;
  const nodesEl = $('#map-nodes');
  const svg = $('#map-lines');
  if (!nodesEl || !svg) return;
  const pos = (n) => ({ x: 18 + n.col * 32, y: 94 - n.row * 8.15 });
  const avail = new Set(availableNodes().map(n => n.id));
  const pathSet = new Set(run.path || run.visited);
  const cur = NODE_BY_ID[run.current] || NODE_BY_ID.start;

  let svgHtml = '';
  for (const [a, b] of MAP_EDGES) {
    const na = NODE_BY_ID[a], nb = NODE_BY_ID[b];
    const pa = pos(na), pb = pos(nb);
    const d = `M ${pa.x} ${pa.y} C ${pa.x} ${pa.y - 3.2}, ${pb.x} ${pb.y + 3.2}, ${pb.x} ${pb.y}`;
    let cls = '';
    if (pathSet.has(a) && pathSet.has(b)) cls = 'route';
    else if (a === cur.id && avail.has(b)) cls = 'available';
    svgHtml += `<path class="${cls}" d="${d}"/>`;
  }
  svg.innerHTML = svgHtml;

  nodesEl.innerHTML = MAP_NODES.map(n => {
    const p = pos(n);
    const meta = NODE_META[n.type] || NODE_META.wild;
    const visited = run.visited.includes(n.id);
    const isCurrent = run.current === n.id;
    const isAvailable = avail.has(n.id);
    const cls = ['map-node', `type-${n.type}`,
      visited ? 'visited' : '', isCurrent ? 'current' : '',
      isAvailable ? 'available' : (!visited && !isCurrent ? 'locked' : '')
    ].filter(Boolean).join(' ');
    const badge = isCurrent ? '<span class="node-badge">✦</span>' : '';
    return `<button class="${cls}" style="left:${p.x}%;top:${p.y}%" data-node="${n.id}"
      data-tip="<b>${meta.label}</b>${meta.desc}" aria-label="${meta.label}">
      ${icon(meta.icon)}${n.row > 0 ? `<span class="node-floor">${n.row + 1}</span>` : ''}${badge}
    </button>`;
  }).join('');

  $$('.map-node.available', nodesEl).forEach(btn => btn.addEventListener('click', () => {
    const n = NODE_BY_ID[btn.dataset.node];
    if (n) handleNodeClick(n);
  }));

  requestAnimationFrame(() => {
    const vp = $('#map-viewport');
    const curEl = nodesEl.querySelector('.current');
    if (vp && curEl) {
      const top = curEl.offsetTop - vp.clientHeight * .56;
      vp.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
  });
}

function renderSidePanel() {
  const run = state.run;
  if (!run) return;
  const sp = SPECIES[run.partner] || SPECIES[run.starter];
  setImg($('#side-partner'), `assets/pokemon/${sp ? run.partner : 'bulbasaur'}.gif`);
  $('#side-partner-name').textContent = sp?.name || 'Partner';
  $('#side-partner-type').textContent = sp ? typeLabel(sp.types) : '';
  $('#side-level').textContent = 5 + Math.floor(run.floor / 2);
  $('#side-floor').textContent = `${Math.min(12, run.floor + 1)} / 12`;
  $('#side-deck').textContent = run.deck.length;
  $('#side-caught').textContent = run.caught;
  $('#side-gold').textContent = run.gold;
  $('#side-party-cap').textContent = `${run.party.length} / ${MAX_PARTY}`;

  const partyRow = $('#side-party-row');
  if (partyRow) {
    let html = '';
    for (let i = 0; i < MAX_PARTY; i++) {
      const key = run.party[i];
      if (key) {
        const s = SPECIES[key];
        html += `<div class="party-chip" data-tip="<b>${s.name}</b>${s.flavor}">${s ? `<img src="assets/pokemon/${key}.gif" alt="${s.name}">` : ''}</div>`;
      } else html += '<div class="party-chip empty">+</div>';
    }
    partyRow.innerHTML = html;
  }

  const ballRow = $('#side-ball-row');
  if (ballRow) {
    const types = ['poke', 'great', 'ultra'];
    if (run.balls.master > 0) types.push('master');
    ballRow.innerHTML = types.map(t => `<div class="ball-mini"><span class="ball-icon ${BALLS[t].cls}"></span><b>${run.balls[t] || 0}</b><span>${BALLS[t].short}</span></div>`).join('');
  }

  const relicRow = $('#side-relic-row');
  if (relicRow) {
    $('#side-relic-cap').textContent = run.relics.length;
    relicRow.innerHTML = run.relics.length
      ? run.relics.map(id => { const r = RELICS[id]; return `<div class="relic-chip" data-tip="<b>${r.name}</b>${r.desc}">${r.glyph}</div>`; }).join('')
      : '<span style="font-size:9px;color:var(--muted-2)">None yet</span>';
  }
}

function handleNodeClick(node) {
  sfx('click');
  state.node = node;
  if (['wild', 'grass', 'elite', 'boss'].includes(node.type)) startBattle(node);
  else if (node.type === 'shop') openShop(node);
  else if (node.type === 'camp') openCamp(node);
  else if (node.type === 'treasure') openTreasure(node);
}

function completeNode(node) {
  if (!node) return;
  const run = state.run;
  if (!run.visited.includes(node.id)) run.visited.push(node.id);
  if (!run.path.includes(node.id)) run.path.push(node.id);
  run.current = node.id;
  run.floor = node.row;
  saveRun();
  updateHud();
  showMap();
}

/* ============================================================
   Tooltip / toast / overlay
   ============================================================ */
function showTooltip(html, x, y) {
  const el = $('#tooltip');
  if (!el) return;
  el.innerHTML = html;
  el.classList.add('visible');
  positionTooltip(x, y);
}
function positionTooltip(x, y) {
  const el = $('#tooltip');
  if (!el || !el.classList.contains('visible')) return;
  const pad = 12;
  const w = el.offsetWidth, h = el.offsetHeight;
  let left = x + 14, top = y + 14;
  if (left + w > innerWidth - pad) left = x - w - 14;
  if (top + h > innerHeight - pad) top = y - h - 14;
  el.style.left = Math.max(pad, left) + 'px';
  el.style.top = Math.max(pad, top) + 'px';
}
function hideTooltip() { $('#tooltip')?.classList.remove('visible'); }

function toast(text, kind = '', ms = 2600) {
  const root = $('#toast-root');
  if (!root) return;
  const el = document.createElement('div');
  el.className = 'toast ' + kind;
  el.innerHTML = text;
  root.appendChild(el);
  setTimeout(() => { el.classList.add('leaving'); setTimeout(() => el.remove(), 320); }, ms);
}

function openOverlay(html, opts = {}) {
  const root = $('#overlay-root');
  if (!root) return;
  root.classList.add('active');
  root.innerHTML = `<div class="overlay"><div class="modal ${opts.wide ? 'modal-wide' : ''} ${opts.narrow ? 'modal-narrow' : ''} ${opts.modalClass || ''}">
    ${opts.dismissible ? '<button class="modal-close" data-close aria-label="Close">×</button>' : ''}
    ${html}
  </div></div>`;
  state.overlay = { dismissible: !!opts.dismissible, onClose: opts.onClose };
  if (opts.onMount) opts.onMount(root);
  hideTooltip();
}
function closeOverlay() {
  const root = $('#overlay-root');
  const cb = state.overlay?.onClose;
  state.overlay = null;
  if (root) { root.classList.remove('active'); root.innerHTML = ''; }
  hideTooltip();
  if (cb) cb();
}

/* ============================================================
   Battle — setup & rendering
   ============================================================ */
function chooseEnemySpecies(node) {
  const run = state.run;
  if (node.type === 'boss') return 'mewtwo';
  if (node.type === 'elite') {
    const pool = ELITE_POOL.filter(k => k !== run.lastElite);
    const key = pick(pool.length ? pool : ELITE_POOL);
    run.lastElite = key;
    return key;
  }
  if (node.type === 'grass' && Math.random() < .065) return 'mew';
  const tier = node.row <= 2 ? 1 : node.row <= 4 ? 2 : node.row <= 7 ? 3 : 4;
  const pool = (TIER_POOLS[tier] || TIER_POOLS[3]).filter(k => k !== run.lastWild);
  const key = pick(pool.length ? pool : TIER_POOLS[tier]);
  run.lastWild = key;
  return key;
}

function logBattle(html, kind = '') {
  const el = $('#combat-log');
  if (!el) return;
  const line = document.createElement('div');
  line.className = 'log-line ' + kind;
  line.innerHTML = html;
  el.replaceChildren(line);
  if (state.battle) state.battle.lastLog = html;
}

function startBattle(node) {
  const run = state.run;
  const key = chooseEnemySpecies(node);
  const sp = SPECIES[key];
  const isElite = node.type === 'elite';
  const isBoss = node.type === 'boss';
  let hp = Math.round(sp.baseHp * (1 + node.row * .012));
  if (node.type === 'grass') hp = Math.max(12, Math.round(hp * .55));
  if (isBoss) hp = sp.baseHp;
  if (isElite) hp = Math.round(sp.baseHp * 1.06);

  const enemy = {
    key, name: sp.name, types: sp.types, maxHp: hp, hp, block: 0,
    statuses: { poison: 0, burn: 0, weak: 0, vulnerable: 0 },
    strength: 0, moveIndex: 0, intent: null,
    level: 3 + node.row, isElite, isBoss, flavor: sp.flavor
  };
  const player = {
    block: 0, statuses: { poison: 0, burn: 0, weak: 0, vulnerable: 0 },
    energy: 3, maxEnergy: 3, strength: 0
  };
  if (hasRelic('choice_band')) player.strength += 2;
  if (hasRelic('bicycle')) player.energy += 1;

  const battle = {
    node, speciesKey: key, enemy, player,
    hand: [], drawPile: shuffle(run.deck.map(c => ({ ...c }))), discardPile: [], exhaustPile: [],
    turn: 1, busy: false, over: false, focusUsed: false, bossPhase: false,
    catchBonus: node.type === 'grass' ? 12 : 0,
    lastLog: null, rewards: null
  };
  state.battle = battle;
  state.node = node;
  run.battles++;
  enemy.intent = getEnemyIntent(battle);
  setScreen('battle');
  $('#screen-battle')?.classList.toggle('boss-fight', isBoss);
  drawCards(5 + drawBonus());
  renderBattle();
  renderHand();
  const intro = isBoss ? 'The air turns to glass. Mewtwo descends.' :
    node.type === 'grass' ? `Something rustles in the tall grass... ${sp.name} appears, already weary.` :
    isElite ? `An elite ${sp.name} blocks the way!` :
    `A wild ${sp.name} appears!`;
  logBattle(intro);
  if (isBoss) toast('The Spire Heart awakens.', 'bad', 3200);
  if (node.type === 'grass') toast('It is already weakened — catch odds improved.', 'good');
  if (key === 'mew') { toast('A rare shimmer... Mew!', 'good', 3600); fxBanner('A RARE SHIMMER'); }
}

function drawBonus() {
  return (hasRelic('silph_scope') ? 1 : 0) + (hasRelic('quick_claw') ? 1 : 0);
}
function hasRelic(id) { return !!state.run?.relics?.includes(id); }

function renderBattle() {
  const b = state.battle;
  const run = state.run;
  if (!b || !run) return;
  const psp = SPECIES[run.partner] || SPECIES[run.starter];
  const esp = SPECIES[b.speciesKey];
  setImg($('#player-mon'), `assets/pokemon/back/${run.partner}.gif`);
  setImg($('#enemy-mon'), `assets/pokemon/${b.speciesKey}.gif`);
  $('#player-mon').alt = `Your ${psp.name}`;
  $('#enemy-mon').alt = `Wild ${esp.name}`;
  $('#player-name').textContent = psp.name;
  $('#player-level').textContent = `Lv. ${5 + Math.floor(run.floor / 2)}`;
  $('#enemy-name').textContent = esp.name;
  $('#enemy-level').textContent = `Lv. ${b.enemy.level}`;
  $('#enemy-types').textContent = typeLabel(esp.types);
  $('#enemy-types').className = 'type-line ' + esp.types.map(t => 'type-' + t).join(' ');

  const pHp = clamp((run.hp / run.maxHp) * 100, 0, 100);
  const eHp = clamp((b.enemy.hp / b.enemy.maxHp) * 100, 0, 100);
  const pFill = $('#player-hp-fill'), eFill = $('#enemy-hp-fill');
  pFill.style.width = pHp + '%'; pFill.classList.toggle('low', pHp <= 30);
  eFill.style.width = eHp + '%';
  $('#player-hp-text').textContent = `${Math.max(0, run.hp)} / ${run.maxHp}`;
  $('#enemy-hp-text').textContent = `${Math.max(0, b.enemy.hp)} / ${b.enemy.maxHp}`;

  const pb = $('#player-block'), eb = $('#enemy-block');
  pb.classList.toggle('hidden', b.player.block <= 0);
  eb.classList.toggle('hidden', b.enemy.block <= 0);
  pb.querySelector('b').textContent = b.player.block;
  eb.querySelector('b').textContent = b.enemy.block;

  $('#player-statuses').innerHTML = statusPills(b.player.statuses, b.player.strength);
  $('#enemy-statuses').innerHTML = statusPills(b.enemy.statuses, b.enemy.strength);
  $('#battle-turn').textContent = `Turn ${b.turn}`;
  $('#battle-energy-text').textContent = `${b.player.energy} / ${b.player.maxEnergy}`;
  $('#battle-location').textContent = `${NODE_META[b.node.type]?.label || 'Wilds'} · Floor ${b.node.row + 1}`;
  $('#draw-count').textContent = b.drawPile.length;
  $('#discard-count').textContent = b.discardPile.length;
  $('#battle-deck-count').textContent = run.deck.length;
  $('#btn-end-turn').disabled = b.busy || b.over;

  renderIntent();
  renderBallDock();
  const best = bestCatchChance();
  const hint = $('#catch-hint');
  if (hint) {
    if (b.enemy.isBoss) hint.textContent = b.enemy.hp / b.enemy.maxHp < .25 ? 'It is barely contained...' : 'A vast mind. It cannot be caught yet.';
    else if (b.enemy.isElite) hint.textContent = `Elite catch odds: ${best}%`;
    else hint.textContent = `Catch odds: ${best}% — weaken it to improve them`;
    hint.classList.toggle('best', best >= 65);
    hint.classList.toggle('good', best >= 40 && best < 65);
  }
  updateHud();
}

function statusPills(statuses, strength = 0) {
  const list = [];
  const map = [
    ['poison', 'Poison', '☠'], ['burn', 'Burn', '♨'], ['weak', 'Weak', '↓'], ['vulnerable', 'Vuln', '◇']
  ];
  for (const [k, label, glyph] of map) {
    if (statuses?.[k] > 0) list.push(`<span class="status-pill ${k}">${glyph} ${label} <b>${statuses[k]}</b></span>`);
  }
  if (strength > 0) list.push(`<span class="status-pill strength">↑ Str <b>${strength}</b></span>`);
  return list.join('');
}

function getEnemyIntent(b) {
  const sp = SPECIES[b.enemy.key];
  const idx = sp.pattern[b.enemy.moveIndex % sp.pattern.length];
  return { ...sp.moves[idx], index: b.enemy.moveIndex };
}
function calcEnemyHit(b, move) {
  let d = (move.dmg || 0) + b.enemy.strength;
  if (b.enemy.statuses.weak > 0) d = Math.floor(d * .75);
  if (b.player.statuses.vulnerable > 0) d = Math.floor(d * 1.5);
  return Math.max(0, d);
}
function renderIntent() {
  const b = state.battle;
  const move = b.enemy.intent;
  if (!move) return;
  const card = $('#enemy-intent');
  const iconEl = $('#intent-icon');
  const copy = $('#intent-value');
  let kind = move.kind || 'attack';
  let iconName = 'sword';
  let value = '';
  let label = 'Attack';
  if (kind === 'attack') {
    const per = calcEnemyHit(b, move);
    value = (move.hits || 1) > 1 ? `${per}×${move.hits}` : String(per);
    label = 'Attack';
  } else if (kind === 'defend') {
    iconName = 'shield'; value = String(move.block || 0); label = 'Defend';
  } else if (kind === 'buff') {
    iconName = 'arrowUp'; value = move.strength ? `+${move.strength}` : `+${move.block || 0}`; label = 'Power up';
  } else if (kind === 'debuff') {
    iconName = 'arrowDown'; value = String(Math.max(...Object.values(move.playerStatus || { weak: 1 }))); label = 'Hex';
  } else if (kind === 'heal') {
    iconName = 'heal'; value = `+${move.heal || 0}`; label = 'Recover';
  }
  card.className = 'intent-card ' + kind;
  iconEl.innerHTML = icon(iconName);
  copy.textContent = value;
  copy.closest('.intent-copy').querySelector('span').textContent = label;
  let nameEl = card.querySelector('.intent-name');
  if (!nameEl) {
    nameEl = document.createElement('span');
    nameEl.className = 'intent-name';
    card.querySelector('.intent-copy').appendChild(nameEl);
  }
  nameEl.textContent = move.name;
  card.dataset.tip = `<b>${move.name}</b>${intentTip(move)}`;
}

function intentTip(move) {
  const bits = [];
  if (move.dmg) bits.push(`Deals ${move.dmg}${move.hits > 1 ? `×${move.hits}` : ''} damage.`);
  if (move.block) bits.push(`Gains ${move.block} Block.`);
  if (move.strength) bits.push(`Gains ${move.strength} Strength.`);
  if (move.heal) bits.push(`Heals ${move.heal} HP.`);
  if (move.playerStatus) bits.push('Applies ' + Object.entries(move.playerStatus).map(([k, v]) => `${v} ${k}`).join(', ') + '.');
  if (move.stealGold) bits.push(`Steals ${move.stealGold} gold.`);
  if (move.selfDamage) bits.push(`Hurts itself for ${move.selfDamage}.`);
  return bits.join(' ');
}

function renderBallDock() {
  const b = state.battle;
  if (!b) return;
  const row = $('#ball-buttons');
  if (!row) return;
  const types = ['poke', 'great', 'ultra'];
  if ((state.run.balls.master || 0) > 0) types.push('master');
  row.innerHTML = '';
  for (const t of types) {
    const count = state.run.balls[t] || 0;
    const chance = ballChance(t);
    const btn = document.createElement('button');
    btn.className = 'ball-btn';
    btn.disabled = b.busy || b.over || b.player.energy < 1 || count <= 0;
    btn.dataset.tip = `<b>${BALLS[t].name}</b>${count} remaining. Catch chance: ${chance}%. Throwing costs 1 Energy.`;
    btn.innerHTML = `<span class="ball-icon ${BALLS[t].cls}"></span>
      <span class="ball-btn-copy"><b>${BALLS[t].short}</b><span>${chance}%</span></span>
      <span class="ball-count">×${count}</span>`;
    btn.addEventListener('click', () => throwBall(t, btn));
    row.appendChild(btn);
  }
}

function ballChance(type) {
  const b = state.battle;
  if (!b) return 0;
  if (type === 'master') return 100;
  const e = b.enemy;
  let c = 5 + (1 - e.hp / e.maxHp) * 72 + BALLS[type].bonus + b.catchBonus;
  if (hasRelic('lucky_egg')) c += 12;
  if (e.statuses.poison > 0) c += 4;
  if (e.statuses.burn > 0) c += 2;
  if (e.key === 'mew') c += 12;
  if (e.isBoss) c = e.hp / e.maxHp < .25 ? Math.min(c, 52) : Math.min(c, 6);
  else if (e.isElite) c = Math.min(c, 78);
  return Math.round(clamp(c, 2, 96));
}
function bestCatchChance() {
  if (!state.battle) return 0;
  let best = 0;
  for (const t of ['poke', 'great', 'ultra', 'master']) {
    if ((state.run.balls[t] || 0) > 0) best = Math.max(best, ballChance(t));
  }
  return best;
}

/* ============================================================
   Battle — cards & hand
   ============================================================ */
function makeCardEl(card, opts = {}) {
  const def = CARDS[card.id];
  if (!def) return document.createElement('span');
  const stats = getStats(card.id, card.upgraded);
  const color = TYPES[def.type]?.color || TYPES.normal.color;
  const typeIcon = icon(TYPES[def.type]?.icon || 'star');
  const art = def.artMon
    ? `<span class="art-glow"></span><img class="art-mon" src="assets/pokemon/${def.artMon}.gif" alt="">`
    : `<span class="art-glow"></span><span class="art-icon">${typeIcon}</span>`;
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'card ' + (opts.className || '') + (card.upgraded ? ' upgraded' : '') + (def.exhaust ? ' exhaust' : '');
  el.style.setProperty('--c', color);
  el.dataset.uid = card.uid;
  el.setAttribute('aria-label', `${def.name}, costs ${stats.cost} energy. ${cardDescription(card.id, card.upgraded).replace(/<[^>]+>/g, '')}`);
  el.innerHTML = `
    ${card.upgraded ? '<span class="card-upgraded">+</span>' : ''}
    <div class="card-inner">
      <div class="card-top">
        <span class="card-cost">${stats.cost}</span>
        <span class="card-name">${def.name}</span>
        <span class="card-type">${typeIcon}</span>
      </div>
      <div class="card-art">${art}</div>
      <div class="card-text">${cardDescription(card.id, card.upgraded)}</div>
      <div class="card-foot"><span>${TYPES[def.type]?.label || def.type}</span><span class="rarity">${def.rarity === 'signature' ? 'Bond' : def.rarity}</span></div>
    </div>`;
  if (opts.disabled) { el.classList.add('disabled'); el.disabled = true; }
  if (opts.onClick) el.addEventListener('click', (e) => { e.stopPropagation(); opts.onClick(card, el); });
  return el;
}

function renderHand() {
  const b = state.battle;
  const handEl = $('#hand');
  if (!b || !handEl) return;
  handEl.innerHTML = '';
  if (!b.hand.length) {
    handEl.innerHTML = '<div style="font-size:10px;letter-spacing:.08em;color:var(--muted-2);padding:18px 0">No cards in hand — end your turn.</div>';
    return;
  }
  for (const card of b.hand) {
    const stats = getStats(card.id, card.upgraded);
    const el = makeCardEl(card, {
      disabled: b.busy || b.over || stats.cost > b.player.energy,
      onClick: (c) => playCard(c.uid)
    });
    handEl.appendChild(el);
  }
  const count = b.hand.length;
  const cardW = innerWidth <= 760 ? 106 : (innerHeight <= 680 ? 124 : 138);
  const gap = 6;
  const needed = count * cardW + Math.max(0, count - 1) * gap;
  const avail = Math.max(200, handEl.clientWidth - 10);
  const overlap = needed > avail ? -(needed - avail) / Math.max(1, count - 1) : 0;
  handEl.style.setProperty('--overlap', overlap.toFixed(1) + 'px');
}

async function playCard(uid) {
  const b = state.battle;
  if (!b || b.busy || b.over) return;
  const idx = b.hand.findIndex(c => c.uid === uid);
  if (idx < 0) return;
  const card = b.hand[idx];
  const stats = getStats(card.id, card.upgraded);
  if (stats.cost > b.player.energy) {
    toast('Not enough energy.', 'bad', 1400); sfx('error');
    return;
  }
  const el = $(`#hand .card[data-uid="${uid}"]`);
  b.busy = true;
  b.player.energy -= stats.cost;
  b.hand.splice(idx, 1);
  el?.classList.add('playing');
  renderBattle();
  sfx('card');
  if (stats.dmg || stats.special === 'flail' || stats.special === 'metronome') {
    animateLunge($('#player-mon'), 28);
  }
  await wait(state.reduced ? 30 : 230);
  el?.remove();
  await resolveCard(card);
  if (!b.over) {
    b.busy = false;
    renderBattle();
    renderHand();
  }
}

async function resolveCard(card) {
  const b = state.battle;
  const def = CARDS[card.id];
  const stats = getStats(card.id, card.upgraded);
  let dmg = stats.dmg;
  let hits = stats.hits;
  let block = stats.block;
  let heal = stats.heal;

  if (def.type === 'fire' && hasRelic('charcoal')) dmg += 2;
  if (def.type === 'water' && hasRelic('mystic_water')) block += 2;

  if (stats.special === 'flail') {
    dmg = 5 + (card.upgraded ? 2 : 0) + Math.floor((state.run.maxHp - state.run.hp) / 4);
  }
  if (stats.special === 'metronome') {
    await metronomeEffect(card.upgraded);
  } else {
    for (let i = 0; i < hits; i++) {
      if (b.enemy.hp <= 0) break;
      if (dmg > 0) {
        const raw = playerCardDamage(dmg);
        damageEnemy(raw, { pierce: stats.pierce });
        sfx('hit');
      }
      if (hits > 1 && i < hits - 1) await wait(state.reduced ? 20 : 130);
    }
    if (block > 0) { b.player.block += block; spawnFloat($('#player-side'), `+${block}`, 'block'); sfx('block'); }
    if (heal > 0) { healPlayer(heal); }
    if (stats.strength > 0) { b.player.strength += stats.strength; spawnFloat($('#player-side'), `+${stats.strength} STR`, 'status'); }
    for (const [k, v] of Object.entries(stats.statuses || {})) {
      if (v > 0) applyEnemyStatus(k, v);
    }
    if (stats.draw > 0) drawCards(stats.draw);
    if (stats.energy > 0) { b.player.energy += stats.energy; spawnFloat($('#player-side'), `+${stats.energy} ENERGY`, 'status'); }
    if (stats.gold > 0) { state.run.gold += stats.gold; toast(`Found <b>${stats.gold} gold</b>.`, 'good', 1500); sfx('coin'); }
    if (stats.cleanse) cleansePlayer();
  }

  if (def.exhaust) b.exhaustPile.push(card);
  else b.discardPile.push(card);

  renderBattle();
  if (b.enemy.hp <= 0 && !b.over) await winBattle(false);
}

function playerCardDamage(base) {
  const b = state.battle;
  let d = base + b.player.strength;
  if (b.player.statuses.weak > 0) d = Math.floor(d * .75);
  if (b.enemy.statuses.vulnerable > 0) d = Math.floor(d * 1.5);
  return Math.max(0, d);
}

async function metronomeEffect(upgraded) {
  const b = state.battle;
  const roll = Math.floor(Math.random() * 4);
  fxBanner('METRONOME');
  sfx('card');
  await wait(240);
  if (roll === 0) {
    const d = upgraded ? 26 : 20;
    toast('It became <b>Fire Blast</b>!', 'good', 1800);
    damageEnemy(playerCardDamage(d));
    applyEnemyStatus('burn', upgraded ? 5 : 3);
    sfx('hit');
  } else if (roll === 1) {
    const bl = upgraded ? 21 : 16;
    toast('It became <b>Iron Defense</b>!', 'good', 1800);
    b.player.block += bl;
    spawnFloat($('#player-side'), `+${bl}`, 'block');
    sfx('block');
  } else if (roll === 2) {
    toast('It became <b>Giga Drain</b>!', 'good', 1800);
    damageEnemy(playerCardDamage(upgraded ? 18 : 14));
    healPlayer(upgraded ? 9 : 7);
    sfx('heal');
  } else {
    toast('It became <b>Calm Mind</b>!', 'good', 1800);
    b.player.strength += upgraded ? 3 : 2;
    drawCards(2);
    spawnFloat($('#player-side'), `+${upgraded ? 3 : 2} STR`, 'status');
  }
  renderBattle();
}

function drawCards(n) {
  const b = state.battle;
  if (!b) return;
  for (let i = 0; i < n; i++) {
    if (!b.drawPile.length) {
      if (!b.discardPile.length) break;
      b.drawPile = shuffle(b.discardPile);
      b.discardPile = [];
    }
    const card = b.drawPile.pop();
    if (b.hand.length < 10) b.hand.push(card);
    else b.discardPile.push(card);
  }
  renderBattle();
  if (state.screen === 'battle') renderHand();
}

function damageEnemy(raw, opts = {}) {
  const b = state.battle;
  if (!b || b.over) return { blocked: 0, hpLoss: 0 };
  let amount = Math.max(0, Math.round(raw));
  let blocked = 0;
  if (!opts.pierce) {
    blocked = Math.min(b.enemy.block, amount);
    b.enemy.block -= blocked;
    amount -= blocked;
  }
  if (blocked > 0) spawnFloat($('#enemy-side'), `-${blocked}`, 'block');
  if (amount > 0) {
    b.enemy.hp = Math.max(0, b.enemy.hp - amount);
    spawnFloat($('#enemy-side'), `-${amount}`, 'damage');
    shakeEl($('#enemy-side'));
    flashEl($('#enemy-mon'));
  }
  renderBattle();
  return { blocked, hpLoss: amount };
}

function damagePlayer(raw, opts = {}) {
  const b = state.battle;
  if (!b || b.over) return { blocked: 0, hpLoss: 0 };
  let amount = Math.max(0, Math.round(raw));
  let blocked = 0;
  if (!opts.pierce) {
    blocked = Math.min(b.player.block, amount);
    b.player.block -= blocked;
    amount -= blocked;
  }
  if (blocked > 0) { spawnFloat($('#player-side'), `-${blocked}`, 'block'); sfx('block'); }
  if (amount > 0) {
    state.run.hp = Math.max(0, state.run.hp - amount);
    spawnFloat($('#player-side'), `-${amount}`, 'damage');
    shakeEl($('#player-side'));
    flashEl($('#player-mon'));
    if (opts.fromEnemy && hasRelic('rocky_helmet') && b.enemy.hp > 0) {
      damageEnemy(3, { pierce: true });
    }
  }
  renderBattle();
  return { blocked, hpLoss: amount };
}

function healPlayer(amount) {
  const run = state.run;
  const before = run.hp;
  run.hp = Math.min(run.maxHp, run.hp + amount);
  const gained = run.hp - before;
  if (gained > 0) { spawnFloat($('#player-side'), `+${gained}`, 'heal'); sfx('heal'); }
  renderBattle();
}
function cleansePlayer() {
  const s = state.battle.player.statuses;
  for (const k of Object.keys(s)) s[k] = 0;
  spawnFloat($('#player-side'), 'CLEANSED', 'heal');
}
function applyEnemyStatus(key, amount) {
  const b = state.battle;
  if (!b || b.enemy.hp <= 0) return;
  let amt = amount;
  if (key === 'poison' && hasRelic('miracle_seed')) amt += 2;
  b.enemy.statuses[key] = (b.enemy.statuses[key] || 0) + amt;
  spawnFloat($('#enemy-side'), `${key.toUpperCase()} +${amt}`, 'status');
  renderBattle();
}
function applyPlayerStatus(key, amount) {
  const b = state.battle;
  if (!b) return;
  b.player.statuses[key] = (b.player.statuses[key] || 0) + amount;
  spawnFloat($('#player-side'), `${key.toUpperCase()} +${amount}`, 'status');
  renderBattle();
}
function decayStatus(obj, key, n = 1) {
  if (obj[key] > 0) obj[key] = Math.max(0, obj[key] - n);
}

/* ============================================================
   Battle — enemy turn
   ============================================================ */
async function endTurn() {
  const b = state.battle;
  if (!b || b.busy || b.over) return;
  b.busy = true;
  b.discardPile.push(...b.hand);
  b.hand = [];
  decayStatus(b.player.statuses, 'weak');
  decayStatus(b.enemy.statuses, 'vulnerable');
  renderBattle();
  renderHand();
  sfx('turn');
  await wait(state.reduced ? 40 : 260);
  if (b.over) return;
  await enemyTurn();
  if (b.over) return;
  startPlayerTurn();
  b.busy = false;
  renderBattle();
  renderHand();
}

async function enemyTurn() {
  const b = state.battle;
  if (!b || b.over) return;
  b.enemy.block = 0;
  renderBattle();
  await tickEnemyStatuses();
  if (b.over) return;
  const move = b.enemy.intent;
  logBattle(`${b.enemy.name} uses <b>${move.name}</b>.`);
  await executeEnemyMove(move);
  if (b.over) return;

  if (b.enemy.isBoss && !b.bossPhase && b.enemy.hp <= b.enemy.maxHp * .5) {
    b.bossPhase = true;
    b.enemy.strength += 2;
    b.enemy.block += 10;
    fxBanner('PSYCHIC SURGE');
    logBattle('Mewtwo’s aura flares. <b>+2 Strength</b>.');
    toast('Mewtwo tears open the air.', 'bad', 2200);
    renderBattle();
    await wait(600);
  }

  decayStatus(b.enemy.statuses, 'weak');
  decayStatus(b.player.statuses, 'vulnerable');
  b.enemy.moveIndex++;
  b.enemy.intent = getEnemyIntent(b);
  renderBattle();
  await wait(state.reduced ? 20 : 260);
}

async function tickEnemyStatuses() {
  const b = state.battle;
  for (const key of ['poison', 'burn']) {
    const amount = b.enemy.statuses[key];
    if (amount > 0) {
      b.enemy.hp = Math.max(0, b.enemy.hp - amount);
      spawnFloat($('#enemy-side'), `${key === 'poison' ? '☠' : '♨'} -${amount}`, key === 'poison' ? 'status' : 'damage');
      logBattle(`${b.enemy.name} suffers <b>${amount}</b> ${key} damage.`);
      b.enemy.statuses[key] = Math.max(0, amount - 1);
      renderBattle();
      await wait(state.reduced ? 20 : 240);
      if (b.enemy.hp <= 0) { await winBattle(false); return; }
    }
  }
}

async function executeEnemyMove(move) {
  const b = state.battle;
  const mon = $('#enemy-mon');
  if (move.kind === 'attack') {
    animateLunge(mon, -28, true);
    for (let i = 0; i < (move.hits || 1); i++) {
      if (b.over || state.run.hp <= 0) break;
      const dmg = calcEnemyHit(b, move);
      const res = damagePlayer(dmg, { fromEnemy: true });
      sfx('hit');
      if (res.hpLoss > 0) logBattle(`${b.enemy.name} hits for <b>${res.hpLoss}</b>.`, 'damage');
      if (res.blocked > 0) logBattle(`Your Block absorbs <b>${res.blocked}</b>.`, 'heal');
      await wait(state.reduced ? 20 : 170);
      if (state.run.hp <= 0) { await handlePlayerDeath(); return; }
    }
    if (move.selfDamage) {
      b.enemy.hp = Math.max(0, b.enemy.hp - move.selfDamage);
      spawnFloat($('#enemy-side'), `-${move.selfDamage}`, 'damage');
      logBattle(`${b.enemy.name} is caught in the blast.`, 'damage');
      if (b.enemy.hp <= 0) { await winBattle(false); return; }
    }
  } else if (move.kind === 'defend') {
    b.enemy.block += move.block || 0;
    spawnFloat($('#enemy-side'), `+${move.block || 0}`, 'block');
    sfx('block');
    logBattle(`${b.enemy.name} raises <b>${move.block || 0} Block</b>.`, 'heal');
  } else if (move.kind === 'buff') {
    if (move.strength) { b.enemy.strength += move.strength; spawnFloat($('#enemy-side'), `+${move.strength} STR`, 'status'); }
    if (move.block) { b.enemy.block += move.block; spawnFloat($('#enemy-side'), `+${move.block}`, 'block'); }
    if (!move.strength && !move.block) {
      fxBanner('...');
      logBattle(move.flavor || `${b.enemy.name} gathers power.`);
    } else {
      logBattle(`${b.enemy.name} grows stronger.`);
    }
    renderBattle();
  } else if (move.kind === 'debuff') {
    for (const [k, v] of Object.entries(move.playerStatus || {})) applyPlayerStatus(k, v);
    logBattle(`${b.enemy.name} lays a hex on you.`);
  } else if (move.kind === 'heal') {
    const before = b.enemy.hp;
    b.enemy.hp = Math.min(b.enemy.maxHp, b.enemy.hp + (move.heal || 0));
    spawnFloat($('#enemy-side'), `+${b.enemy.hp - before}`, 'heal');
    sfx('heal');
    logBattle(`${b.enemy.name} recovers <b>${b.enemy.hp - before}</b> HP.`, 'heal');
    renderBattle();
  }
  if (move.stealGold) {
    const stolen = Math.min(state.run.gold, move.stealGold);
    if (stolen > 0) { state.run.gold -= stolen; toast(`It stole <b>${stolen} gold</b>!`, 'bad', 1700); }
  }
  await wait(state.reduced ? 20 : 180);
}

async function handlePlayerDeath() {
  const b = state.battle;
  if (!b || b.over) return;
  if (hasRelic('focus_band') && !b.focusUsed && state.run.hp <= 0) {
    b.focusUsed = true;
    state.run.hp = 1;
    fxBanner('FOCUS BAND');
    logBattle('The Focus Band holds. You survive at <b>1 HP</b>.', 'heal');
    renderBattle();
    await wait(700);
    return;
  }
  if (state.run.hp > 0) return;
  b.over = true;
  b.busy = true;
  sfx('lose');
  renderBattle();
  await wait(600);
  showEndScreen(false);
}

function startPlayerTurn() {
  const b = state.battle;
  if (!b || b.over) return;
  b.turn++;
  b.player.block = 0;
  tickPlayerStatuses();
  if (state.run.hp <= 0) { handlePlayerDeath(); return; }
  if (hasRelic('leftovers')) {
    const before = state.run.hp;
    state.run.hp = Math.min(state.run.maxHp, state.run.hp + 3);
    if (state.run.hp > before) spawnFloat($('#player-side'), '+3', 'heal');
  }
  b.player.energy = b.player.maxEnergy;
  drawCards(5 + drawBonus());
  logBattle('Your turn.');
  renderBattle();
}

function tickPlayerStatuses() {
  const b = state.battle;
  if (!b) return;
  for (const key of ['poison', 'burn']) {
    const amount = b.player.statuses[key];
    if (amount > 0) {
      state.run.hp = Math.max(0, state.run.hp - amount);
      spawnFloat($('#player-side'), `${key === 'poison' ? '☠' : '♨'} -${amount}`, key === 'poison' ? 'status' : 'damage');
      logBattle(`You suffer <b>${amount}</b> ${key} damage.`, 'damage');
      b.player.statuses[key] = Math.max(0, amount - 1);
      renderBattle();
    }
  }
}

/* ============================================================
   Battle — win, catch, rewards
   ============================================================ */
async function winBattle(captured = false) {
  const b = state.battle;
  if (!b || b.over) return;
  b.over = true;
  b.busy = true;
  const run = state.run;
  run.kills++;
  if (hasRelic('oran_berry')) {
    const before = run.hp;
    run.hp = Math.min(run.maxHp, run.hp + 6);
    if (run.hp > before) toast('Oran Berry restores <b>6 HP</b>.', 'good', 1800);
  }
  renderBattle();
  sfx('victory');
  fxBanner(captured ? 'GOTCHA!' : 'VICTORY');
  await wait(state.reduced ? 60 : 850);
  if (captured) return;
  const node = b.node;
  if (node.type === 'boss') { showEndScreen(true); return; }
  let gold = node.type === 'elite' ? 46 : Math.round(13 + node.row * 2 + rand(0, 7));
  if (hasRelic('amulet_coin')) gold += 20;
  run.gold += gold;
  updateHud();
  const isElite = node.type === 'elite';
  if (isElite) {
    openRelicChoice('The elite falls — claim a relic', 3, (picked) => {
      showCardReward(node, gold, true);
    });
  } else {
    showCardReward(node, gold, false);
  }
}

function rollRarity() {
  const floor = state.run.floor;
  const rare = Math.min(22, 5 + floor * 1.5);
  const r = Math.random() * 100;
  if (r < rare) return 'rare';
  if (r < rare + 38) return 'uncommon';
  return 'common';
}
function rollCardChoices(count = 3) {
  const out = [];
  const pools = { common: COMMON_POOL, uncommon: UNCOMMON_POOL, rare: RARE_POOL };
  let guard = 0;
  while (out.length < count && guard++ < 50) {
    const pool = pools[rollRarity()];
    const id = pick(pool);
    if (id && !out.includes(id)) out.push(id);
  }
  if (out.length < count) {
    for (const id of shuffle(COMMON_POOL)) if (!out.includes(id)) out.push(id);
  }
  return out;
}

function showCardReward(node, gold, elite) {
  const ids = rollCardChoices(3);
  openOverlay(`
    <div class="modal-head">
      <div class="section-kicker">${elite ? 'Elite spoils' : 'The wild falls quiet'}</div>
      <h2>${elite ? 'A hard-won victory' : 'Victory'}</h2>
      <p>Choose a move to add to your deck, or leave it behind.</p>
    </div>
    <div class="reward-summary">
      <span>Gold <b>+${gold}</b></span>
      ${elite ? '<span>Relic <b>claimed</b></span>' : ''}
      <span>Cards <b>${state.run.deck.length}</b></span>
    </div>
    <div class="reward-cards" id="reward-cards"></div>
    <div class="reward-skip"><button class="btn btn-ghost btn-small" id="btn-reward-skip">Skip reward</button></div>
  `, {
    wide: true, dismissible: false, onMount(root) {
      const wrap = $('#reward-cards', root);
      ids.forEach(id => {
        const card = { uid: 'preview-' + id + '-' + Math.random(), id, upgraded: false };
        const el = makeCardEl(card, { className: 'reward-card', onClick: () => {
          addCard(id);
          sfx('coin');
          toast(`<b>${CARDS[id].name}</b> added to your deck.`, 'good');
          closeOverlay();
          completeNode(node);
        }});
        wrap.appendChild(el);
      });
      $('#btn-reward-skip', root).addEventListener('click', () => { sfx('click'); closeOverlay(); completeNode(node); });
    }
  });
}

function openRelicChoice(title, count, onPick) {
  const owned = new Set(state.run.relics);
  let ids = uniquePicks(RELIC_POOL, count, id => !owned.has(id));
  if (!ids.length) {
    toast('You already carry every relic. The Peddler pays you 50 gold instead.', 'good', 3000);
    state.run.gold += 50;
    updateHud();
    closeOverlay();
    onPick(null);
    return;
  }
  openOverlay(`
    <div class="modal-head">
      <div class="section-kicker">A relic among the roots</div>
      <h2>${title}</h2>
      <p>Relics change how you climb. Choose one to carry.</p>
    </div>
    <div class="relic-pick-grid" id="relic-pick-grid"></div>
  `, {
    wide: true, dismissible: false, onMount(root) {
      const wrap = $('#relic-pick-grid', root);
      ids.forEach(id => {
        const r = RELICS[id];
        const btn = document.createElement('button');
        btn.className = 'relic-pick';
        btn.innerHTML = `<span class="relic-glyph">${r.glyph}</span><b>${r.name}</b><small>${r.desc}</small>`;
        btn.addEventListener('click', () => {
          addRelic(id);
          closeOverlay();
          onPick(id);
        });
        wrap.appendChild(btn);
      });
    }
  });
}

function addRelic(id) {
  if (!id || state.run.relics.includes(id)) return;
  state.run.relics.push(id);
  sfx('catch');
  const r = RELICS[id];
  toast(`<b>${r.name}</b> acquired.`, 'good', 3000);
  if (id === 'poke_flute') {
    state.run.balls.poke += 1; state.run.balls.great += 1; state.run.balls.ultra += 1;
    toast('The flute calls in <b>one of each ball</b>.', 'good', 3000);
  }
  if (id === 'master_ball') {
    state.run.balls.master = (state.run.balls.master || 0) + 1;
    toast('A <b>Master Ball</b> rests in your pouch.', 'good', 3000);
  }
  updateHud();
  renderSidePanel();
}

async function throwBall(type, btn) {
  const b = state.battle;
  if (!b || b.busy || b.over) return;
  if (b.player.energy < 1) { toast('Not enough energy to throw.', 'bad', 1600); sfx('error'); return; }
  if ((state.run.balls[type] || 0) <= 0) { toast('You are out of those balls.', 'bad', 1600); sfx('error'); return; }
  b.busy = true;
  b.player.energy -= 1;
  state.run.balls[type]--;
  renderBattle();
  sfx('card');
  const chance = ballChance(type);
  logBattle(`You throw a <b>${BALLS[type].name}</b>...`);
  const anim = await animateBall(type, btn);
  const success = type === 'master' || Math.random() * 100 < chance;
  if (success) {
    if (anim) {
      const burst = document.createElement('div');
      burst.className = 'catch-burst';
      burst.style.left = anim.x + 'px'; burst.style.top = anim.y + 'px';
      $('#fx-layer').appendChild(burst);
      setTimeout(() => burst.remove(), 900);
      anim.el.remove();
    }
    sfx('catch');
    fxBanner('GOTCHA!');
    sparkBurst($('#enemy-side'), '#f1d792');
    await wait(state.reduced ? 80 : 900);
    handleCapture();
  } else {
    anim?.el.remove();
    sfx('fail');
    fxBanner('BROKE FREE');
    b.enemy.strength += 2;
    spawnFloat($('#enemy-side'), '+2 STR', 'status');
    shakeEl($('#enemy-side'));
    logBattle('It breaks free and grows furious. <b>+2 Strength</b>.', 'damage');
    toast('It broke free! It is angrier now.', 'bad', 2300);
    renderBattle();
    await wait(state.reduced ? 40 : 600);
    if (!b.over) { b.busy = false; renderBattle(); renderHand(); }
  }
}

async function animateBall(type, btn) {
  if (state.reduced) return null;
  const layer = $('#fx-layer');
  const target = $('#enemy-mon');
  if (!layer || !target || !btn) return null;
  const lr = layer.getBoundingClientRect();
  const br = btn.getBoundingClientRect();
  const tr = target.getBoundingClientRect();
  const startX = br.left - lr.left + br.width / 2;
  const startY = br.top - lr.top + br.height / 2;
  const endX = tr.left - lr.left + tr.width / 2;
  const endY = tr.top - lr.top + tr.height * .45;
  const el = document.createElement('div');
  el.className = 'ball-projectile ' + (BALLS[type].cls || '');
  el.style.left = startX + 'px';
  el.style.top = startY + 'px';
  el.style.transform = 'translate(-50%,-50%)';
  layer.appendChild(el);
  const anim = el.animate([
    { left: startX + 'px', top: startY + 'px', transform: 'translate(-50%,-50%) scale(.8) rotate(0deg)' },
    { left: (startX + endX) / 2 + 'px', top: Math.min(startY, endY) - 70 + 'px', transform: 'translate(-50%,-50%) scale(1.1) rotate(220deg)', offset: .55 },
    { left: endX + 'px', top: endY + 'px', transform: 'translate(-50%,-50%) scale(1) rotate(360deg)' }
  ], { duration: 560, easing: 'cubic-bezier(.2,.8,.2,1)' });
  await anim.finished.catch(() => {});
  el.style.left = endX + 'px'; el.style.top = endY + 'px';
  el.classList.add('ball-wobble');
  await wait(950);
  return { el, x: endX, y: endY };
}

function handleCapture() {
  const b = state.battle;
  if (!b || !b.enemy) return;
  b.over = true;
  b.busy = true;
  const run = state.run;
  const key = b.speciesKey;
  const sp = SPECIES[key];
  const node = b.node;
  const wasCaught = run.party.includes(key);
  run.caught++;
  let gold = node.type === 'elite' ? 26 : node.type === 'boss' ? 80 : 9 + node.row * 2;
  if (hasRelic('amulet_coin')) gold += 20;
  run.gold += gold;
  addCard(sp.signature);
  if (hasRelic('exp_share')) {
    run.maxHp += 5; run.hp += 5;
    toast('Exp. Share grants <b>+5 max HP</b>.', 'good', 2200);
  }
  const full = !wasCaught && run.party.length >= MAX_PARTY;
  if (!wasCaught && !full) run.party.push(key);
  updateHud();
  renderBattle();
  sfx('victory');

  const sigCard = { uid: 'preview-' + sp.signature, id: sp.signature, upgraded: false };
  const releaseHtml = full ? `
    <div class="release-wrap">
      <div class="catch-note" style="margin-top:14px">Your party is full. Release a companion to make room for ${sp.name}.</div>
      <div class="release-grid" id="release-grid">
        ${run.party.map((k, i) => i === 0 ? '' : `<button class="release-choice" data-release="${i}"><img src="assets/pokemon/${k}.gif" alt=""><b>${SPECIES[k].name}</b><small>Release</small></button>`).join('')}
      </div>
    </div>` : '';

  openOverlay(`
    <div class="catch-modal">
      <div class="modal-head" style="margin-bottom:4px">
        <div class="section-kicker">${node.type === 'boss' ? 'The spire yields' : 'A new bond'}</div>
        <h2 style="margin-top:4px">${sp.name} was caught!</h2>
      </div>
      <div class="catch-hero">
        <div class="catch-stars"><span>✦</span><span>✦</span><span>✦</span></div>
        <img src="assets/pokemon/${key}.gif" alt="${sp.name}">
        <div class="catch-stars"><span>✦</span><span>✦</span><span>✦</span></div>
      </div>
      <div class="catch-info">
        <div class="catch-types">#${String(sp.dex).padStart(3, '0')} · ${typeLabel(sp.types)}</div>
        <p style="max-width:420px;margin:8px auto 0;font-size:11px;line-height:1.5">${sp.flavor}</p>
        <div class="catch-note">${wasCaught ? 'Already a companion — its bond grows deeper.' : full ? 'Choose who to release below.' : 'Added to your party.'} <b style="color:var(--gold-2)">+${gold} gold</b></div>
      </div>
      <div class="catch-card-added" id="catch-card-slot"></div>
      <div class="catch-note">Signature card added to your deck: <b style="color:var(--cream)">${CARDS[sp.signature].name}</b></div>
      ${releaseHtml}
      <div class="modal-actions">
        <button class="btn btn-primary" id="btn-catch-continue" ${full ? 'disabled' : ''}>${node.type === 'boss' ? 'See how the story ends' : 'Continue the climb'}</button>
      </div>
    </div>
  `, {
    dismissible: false, onMount(root) {
      const slot = $('#catch-card-slot', root);
      slot.appendChild(makeCardEl(sigCard, { className: 'reward-card card-preview' }));
      if (full) {
        $$('[data-release]', root).forEach(btn => btn.addEventListener('click', () => {
          const i = Number(btn.dataset.release);
          const released = run.party[i];
          run.party.splice(i, 1);
          run.party.push(key);
          sfx('click');
          toast(`<b>${SPECIES[released].name}</b> was released. ${sp.name} joins the party.`, 'good', 3000);
          $('#release-grid', root).innerHTML = `<div class="catch-note" style="color:var(--gold-2)">${sp.name} joined the party.</div>`;
          $('#btn-catch-continue', root).disabled = false;
          updateHud();
          renderSidePanel();
        }));
      }
      $('#btn-catch-continue', root).addEventListener('click', () => {
        sfx('click');
        closeOverlay();
        if (node.type === 'boss') showEndScreen(true, true);
        else completeNode(node);
      });
    }
  });
}

/* ============================================================
   Shop
   ============================================================ */
const SHOP_GREETINGS = [
  '“Fresh balls, rare moves, and absolutely no questions about where they came from.”',
  '“You look like someone who has been hit by a Caterpie. I can help with that.”',
  '“The spire is hungry today. Buy something before it notices you.”',
  '“I only stock the finest moves. Mostly. Some are merely interesting.”',
  '“A wise trainer carries more balls than potions. A living trainer carries both.”'
];

function openShop(node) {
  state.shop = {
    node,
    cards: rollShopCards(),
    items: [
      { key: 'poke', type: 'ball', name: 'Poké Ball ×3', desc: 'Three more throws.', icon: 'ball-poke', price: 18, qty: 3, sold: false },
      { key: 'great', type: 'ball', name: 'Great Ball', desc: '+26% base catch chance.', icon: 'ball-great', price: 42, qty: 1, sold: false },
      { key: 'ultra', type: 'ball', name: 'Ultra Ball', desc: '+42% base catch chance.', icon: 'ball-ultra', price: 80, qty: 1, sold: false },
      { key: 'potion', type: 'card', name: 'Potion', desc: 'Add a Potion card to your deck.', icon: 'heal', price: 30, sold: false },
      { key: 'maxhp', type: 'maxhp', name: 'Protein', desc: 'Gain +10 max HP.', icon: 'heart', price: 70, sold: false }
    ],
    removeUsed: false,
    healUsed: false,
    greeting: pick(SHOP_GREETINGS)
  };
  if (node.row >= 4) {
    state.shop.items.push({ key: 'master', type: 'ball', name: 'Master Ball', desc: 'One guaranteed catch.', icon: 'ball-master', price: 160, qty: 1, sold: false });
  }
  setScreen('shop');
  renderShop();
  sfx('click');
}

function rollShopCards() {
  const owned = new Set();
  const out = [];
  const make = (pool, priceBase) => {
    const id = pick(pool.filter(x => !owned.has(x)));
    if (!id) return;
    owned.add(id);
    out.push({ id, upgraded: false, sold: false, price: Math.round(priceBase + rand(-4, 6)) });
  };
  make(UNCOMMON_POOL, 62);
  make(Math.random() < .55 ? RARE_POOL : UNCOMMON_POOL, 92);
  make(COMMON_POOL, 42);
  return out;
}

function renderShop() {
  const s = state.shop;
  if (!s) return;
  $('#shop-gold').textContent = state.run.gold;
  $('#shop-greeting').textContent = s.greeting;
  const cards = $('#shop-cards');
  cards.innerHTML = '';
  s.cards.forEach((item, i) => {
    const unit = document.createElement('div');
    unit.className = 'shop-card-unit';
    const cardEl = makeCardEl({ uid: 'shop-' + i, id: item.id, upgraded: item.upgraded }, {
      className: 'shop-card' + (item.sold ? ' sold' : ''),
      onClick: () => buyShopCard(i)
    });
    const price = document.createElement('button');
    price.className = 'shop-price';
    price.disabled = item.sold;
    price.innerHTML = item.sold ? 'SOLD' : `<span class="pill-icon coin"></span>${item.price}`;
    price.addEventListener('click', () => buyShopCard(i));
    unit.appendChild(cardEl); unit.appendChild(price);
    cards.appendChild(unit);
  });

  const items = $('#shop-items');
  items.innerHTML = '';
  for (const item of s.items) {
    const btn = document.createElement('button');
    btn.className = 'shop-item' + (item.sold ? ' sold' : '');
    btn.disabled = item.sold;
    const ico = item.icon.startsWith('ball-')
      ? `<span class="ball-icon ${item.icon}"></span>`
      : `<span>${icon(item.icon === 'heart' ? 'heal' : item.icon)}</span>`;
    btn.innerHTML = `<span class="shop-item-icon">${ico}</span>
      <span class="shop-item-copy"><b>${item.name}</b><span>${item.desc}</span></span>
      <span class="shop-item-price">${item.sold ? 'sold' : item.price + ' g'}</span>`;
    btn.addEventListener('click', () => buyShopItem(item));
    items.appendChild(btn);
  }

  const removeBtn = $('#btn-shop-remove');
  const removePrice = $('#remove-price');
  removePrice.textContent = s.removeUsed ? 'used' : '75 g';
  removeBtn.disabled = s.removeUsed || state.run.gold < 75;
  const healBtn = $('#btn-shop-heal');
  healBtn.disabled = s.healUsed || state.run.gold < 35 || state.run.hp >= state.run.maxHp;
  updateHud();
}

function buyShopCard(i) {
  const s = state.shop;
  const item = s?.cards[i];
  if (!item || item.sold) return;
  if (state.run.gold < item.price) { sfx('error'); toast('Not enough gold.', 'bad', 1500); return; }
  state.run.gold -= item.price;
  item.sold = true;
  addCard(item.id);
  sfx('buy');
  toast(`<b>${CARDS[item.id].name}</b> added to your deck.`, 'good', 2200);
  renderShop();
}

function buyShopItem(item) {
  const s = state.shop;
  if (!s || item.sold) return;
  if (state.run.gold < item.price) { sfx('error'); toast('Not enough gold.', 'bad', 1500); return; }
  state.run.gold -= item.price;
  item.sold = true;
  if (item.type === 'ball') {
    state.run.balls[item.key] = (state.run.balls[item.key] || 0) + (item.qty || 1);
    toast(`<b>${item.name}</b> added to your pouch.`, 'good', 2000);
  } else if (item.type === 'card') {
    addCard('potion');
    toast('<b>Potion</b> added to your deck.', 'good', 2000);
  } else if (item.type === 'maxhp') {
    state.run.maxHp += 10; state.run.hp += 10;
    toast('Max HP increased by <b>10</b>.', 'good', 2200);
  }
  sfx('buy');
  renderShop();
}

function shopRemoveCard() {
  const s = state.shop;
  if (!s || s.removeUsed) return;
  if (state.run.gold < 75) { sfx('error'); toast('Not enough gold.', 'bad', 1500); return; }
  if (state.run.deck.length <= 5) { toast('Your deck is too small to prune further.', 'bad', 2200); return; }
  openDeckModal({
    mode: 'remove',
    title: 'Choose a card to remove',
    subtitle: 'The Peddler will burn it for 75 gold.',
    onPick(card) {
      if (state.run.gold < 75) return;
      state.run.gold -= 75;
      const idx = state.run.deck.findIndex(c => c.uid === card.uid);
      if (idx >= 0) state.run.deck.splice(idx, 1);
      s.removeUsed = true;
      closeOverlay();
      sfx('coin');
      toast(`<b>${CARDS[card.id].name}</b> removed from your deck.`, 'good', 2200);
      renderShop();
    }
  });
}

function shopHeal() {
  const s = state.shop;
  if (!s || s.healUsed) return;
  if (state.run.gold < 35) { sfx('error'); toast('Not enough gold.', 'bad', 1500); return; }
  if (state.run.hp >= state.run.maxHp) { toast('You are already at full health.', '', 1600); return; }
  state.run.gold -= 35;
  s.healUsed = true;
  const before = state.run.hp;
  state.run.hp = Math.min(state.run.maxHp, state.run.hp + 20);
  sfx('heal');
  toast(`The broth restores <b>${state.run.hp - before} HP</b>.`, 'good', 2000);
  renderShop();
}

/* ============================================================
   Camp
   ============================================================ */
function openCamp(node) {
  state.camp = { node, used: false };
  setScreen('camp');
  renderCamp();
}
function renderCamp() {
  const c = state.camp;
  if (!c) return;
  const run = state.run;
  const companions = $('#camp-companions');
  if (companions) {
    companions.innerHTML = run.party.map(k => `<img src="assets/pokemon/${k}.gif" alt="${SPECIES[k].name}" data-tip="<b>${SPECIES[k].name}</b>${SPECIES[k].flavor}">`).join('');
  }
  const restValue = Math.ceil(run.maxHp * .3);
  $('#camp-rest-value').textContent = `+${Math.min(restValue, run.maxHp - run.hp)} HP`;
  const rest = $('#btn-camp-rest'), train = $('#btn-camp-train');
  rest.disabled = c.used || run.hp >= run.maxHp;
  train.disabled = c.used || !run.deck.some(x => !x.upgraded);
  if (c.used) {
    rest.classList.add('used'); train.classList.add('used');
  }
  updateHud();
}
function campRest() {
  const c = state.camp;
  if (!c || c.used) return;
  const amount = Math.min(Math.ceil(state.run.maxHp * .3), state.run.maxHp - state.run.hp);
  if (amount <= 0) return;
  state.run.hp += amount;
  c.used = true;
  sfx('heal');
  toast(`You rest by the fire and recover <b>${amount} HP</b>.`, 'good', 2600);
  renderCamp();
}
function campTrain() {
  const c = state.camp;
  if (!c || c.used) return;
  if (!state.run.deck.some(x => !x.upgraded)) { toast('Every card is already upgraded.', '', 1800); return; }
  openDeckModal({
    mode: 'upgrade',
    title: 'Choose a card to train',
    subtitle: 'Upgrade one card in your deck.',
    onPick(card) {
      const target = state.run.deck.find(x => x.uid === card.uid);
      if (!target) return;
      target.upgraded = true;
      c.used = true;
      closeOverlay();
      sfx('catch');
      toast(`<b>${CARDS[target.id].name}</b> upgraded.`, 'good', 2400);
      renderCamp();
    }
  });
}

/* ============================================================
   Treasure
   ============================================================ */
function openTreasure(node) {
  const owned = new Set(state.run.relics);
  const ids = uniquePicks(RELIC_POOL, 3, id => !owned.has(id));
  state.treasure = { node, ids, chosen: null, goldFallback: false };
  if (!ids.length) {
    state.treasure.goldFallback = true;
    state.run.gold += 60;
    toast('The cache is empty of relics — you find <b>60 gold</b>.', 'good', 2600);
  }
  setScreen('treasure');
  renderTreasure();
  setTimeout(() => $('#chest')?.classList.add('open'), 380);
}
function renderTreasure() {
  const t = state.treasure;
  if (!t) return;
  const wrap = $('#relic-choices');
  if (t.goldFallback) {
    $('#treasure-copy').textContent = 'Only coins and dust remain.';
    wrap.innerHTML = '<button class="btn btn-primary" id="btn-treasure-continue">Continue the climb</button>';
    $('#btn-treasure-continue')?.addEventListener('click', () => { closeTreasure(); });
    return;
  }
  if (t.chosen) {
    $('#treasure-copy').textContent = `${RELICS[t.chosen].name} is yours.`;
    wrap.innerHTML = `<button class="btn btn-primary" id="btn-treasure-continue">Continue the climb</button>`;
    $('#btn-treasure-continue')?.addEventListener('click', () => { closeTreasure(); });
    return;
  }
  $('#treasure-copy').textContent = 'Choose a relic to carry up the spire.';
  wrap.innerHTML = '';
  for (const id of t.ids) {
    const r = RELICS[id];
    const btn = document.createElement('button');
    btn.className = 'relic-choice';
    btn.innerHTML = `<span class="relic-glyph">${r.glyph}</span><b>${r.name}</b><small>${r.desc}</small>`;
    btn.addEventListener('click', () => {
      t.chosen = id;
      addRelic(id);
      renderTreasure();
    });
    wrap.appendChild(btn);
  }
  updateHud();
}
function closeTreasure() {
  const t = state.treasure;
  if (!t) return;
  state.treasure = null;
  completeNode(t.node);
}

/* ============================================================
   Deck / party / relics / piles
   ============================================================ */
function sortedDeck() {
  return [...state.run.deck].sort((a, b) => {
    const da = CARDS[a.id], db = CARDS[b.id];
    return (da.type.localeCompare(db.type)) || da.name.localeCompare(db.name);
  });
}
function openDeckModal(opts = {}) {
  const mode = opts.mode || 'view';
  let cards = sortedDeck();
  if (mode === 'upgrade') cards = cards.filter(c => !c.upgraded);
  const clickable = mode !== 'view';
  openOverlay(`
    <div class="modal-head">
      <div class="section-kicker">${mode === 'view' ? 'Your arsenal' : 'Make a choice'}</div>
      <h2>${opts.title || 'Your deck'}</h2>
      <p>${opts.subtitle || `${state.run.deck.length} cards · ${state.run.deck.filter(c => c.upgraded).length} upgraded`}</p>
    </div>
    <div class="deck-summary">${clickable ? 'Click a card to select it.' : 'Every card in your deck, in draw order after shuffling.'}</div>
    <div class="deck-grid" id="deck-grid"></div>
    ${clickable ? '<div class="modal-actions"><button class="btn btn-ghost btn-small" data-close>Cancel</button></div>' : ''}
  `, {
    wide: true, dismissible: true, onMount(root) {
      const grid = $('#deck-grid', root);
      if (!cards.length) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:24px;color:var(--muted)">No cards match.</div>';
        return;
      }
      cards.forEach(card => {
        const el = makeCardEl(card, {
          className: 'card-small' + (clickable ? ' card-selectable' : ' card-preview'),
          onClick: clickable ? () => opts.onPick(card) : null
        });
        grid.appendChild(el);
      });
    }
  });
}
function openPartyModal() {
  const run = state.run;
  if (!run) return;
  let html = '';
  for (let i = 0; i < MAX_PARTY; i++) {
    const key = run.party[i];
    if (key) {
      const sp = SPECIES[key];
      html += `<div class="party-card">
        <img src="assets/pokemon/${key}.gif" alt="${sp.name}">
        <div><b>${sp.name}</b><small>${typeLabel(sp.types)}</small><span class="party-card-tag">${i === 0 ? 'Partner' : 'Bond'}</span><small>${sp.flavor}</small></div>
      </div>`;
    } else {
      html += `<div class="party-card empty">Empty slot</div>`;
    }
  }
  openOverlay(`
    <div class="modal-head">
      <div class="section-kicker">Bonds made on the climb</div>
      <h2>Your party</h2>
      <p>${run.party.length} of ${MAX_PARTY} companions. Each caught Pokémon adds its signature card to your deck.</p>
    </div>
    <div class="party-grid">${html}</div>
  `, { wide: true, dismissible: true });
}
function openRelicsModal() {
  const run = state.run;
  if (!run) return;
  const html = run.relics.length ? run.relics.map(id => {
    const r = RELICS[id];
    return `<div class="relic-detail"><span class="relic-glyph">${r.glyph}</span><div><b>${r.name}</b><small>${r.desc}</small></div></div>`;
  }).join('') : '<div style="text-align:center;padding:20px;color:var(--muted);grid-column:1/-1">No relics yet. Elites, caches, and bosses hold them.</div>';
  openOverlay(`
    <div class="modal-head">
      <div class="section-kicker">Small wonders</div>
      <h2>Relics</h2>
      <p>Passive charms that change how the spire treats you.</p>
    </div>
    <div class="relic-grid">${html}</div>
  `, { wide: true, dismissible: true });
}
function openPileModal(which) {
  const b = state.battle;
  if (!b) return;
  const pile = which === 'draw' ? b.drawPile : b.discardPile;
  openOverlay(`
    <div class="modal-head">
      <div class="section-kicker">${which === 'draw' ? 'Still to come' : 'Spent moves'}</div>
      <h2>${which === 'draw' ? 'Draw pile' : 'Discard pile'}</h2>
      <p>${pile.length} cards</p>
    </div>
    <div class="deck-grid" id="pile-grid"></div>
  `, {
    wide: true, dismissible: true, onMount(root) {
      const grid = $('#pile-grid', root);
      if (!pile.length) grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:24px;color:var(--muted)">Empty.</div>';
      const ordered = which === 'draw' ? [...pile].sort((a, b2) => CARDS[a.id].name.localeCompare(CARDS[b2.id].name)) : pile;
      ordered.forEach(c => grid.appendChild(makeCardEl(c, { className: 'card-small card-preview' })));
    }
  });
}

/* ============================================================
   Menu / help / end screens
   ============================================================ */
function openMenu() {
  if (!state.run) return;
  const inBattle = state.screen === 'battle';
  openOverlay(`
    <div class="modal-head">
      <div class="section-kicker">Pause</div>
      <h2>${inBattle ? 'Hold the line' : 'The climb waits'}</h2>
      <p>${inBattle ? 'You cannot save mid-battle. Finish the fight or close the tab.' : 'Take a breath. The spire is patient.'}</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;max-width:360px;margin:0 auto">
      <button class="btn btn-primary" data-menu="resume">Resume</button>
      <button class="btn btn-ghost" data-menu="help">How to play</button>
      <button class="btn btn-ghost" data-menu="sound">${state.sound ? 'Sound: on' : 'Sound: off'}</button>
      ${!inBattle ? '<button class="btn btn-ghost" data-menu="save">Save & quit to title</button>' : ''}
      <button class="btn btn-ghost" data-menu="abandon" style="color:#e0a09a;border-color:rgba(216,98,88,.22)">Abandon run</button>
    </div>
  `, {
    narrow: true, dismissible: true, onMount(root) {
      $$('[data-menu]', root).forEach(btn => btn.addEventListener('click', () => {
        const action = btn.dataset.menu;
        if (action === 'resume') closeOverlay();
        if (action === 'help') openHowToPlay();
        if (action === 'sound') { toggleSound(); btn.textContent = state.sound ? 'Sound: on' : 'Sound: off'; }
        if (action === 'save') { saveRun(); closeOverlay(); showTitle(); toast('Expedition saved.', 'good'); }
        if (action === 'abandon') {
          confirmAction('Abandon this run?', 'Your deck, catches, and relics will be lost. The save is deleted.', () => {
            clearSave(); closeOverlay(); showTitle(); toast('Run abandoned.', '', 1800);
          });
        }
      }));
    }
  });
}
function confirmAction(title, body, onYes) {
  openOverlay(`
    <div class="modal-head"><div class="section-kicker">Are you sure?</div><h2>${title}</h2><p>${body}</p></div>
    <div class="modal-actions">
      <button class="btn btn-ghost" data-confirm="no">Keep going</button>
      <button class="btn btn-primary" data-confirm="yes">Yes, do it</button>
    </div>
  `, {
    narrow: true, dismissible: true, onMount(root) {
      $$('[data-confirm]', root).forEach(btn => btn.addEventListener('click', () => {
        if (btn.dataset.confirm === 'yes') { closeOverlay(); onYes(); }
        else closeOverlay();
      }));
    }
  });
}
function openHowToPlay() {
  openOverlay(`
    <div class="modal-head">
      <div class="section-kicker">Trainer's field guide</div>
      <h2>How to climb</h2>
      <p>A short run. A small deck. A spire full of things that bite.</p>
    </div>
    <div class="how-grid">
      <div class="how-step"><span class="how-num">1</span><div><b>Play cards with Energy</b><p>You draw 5 cards and get 3 Energy each turn. Spend it on attacks, Block, statuses, and draw.</p></div></div>
      <div class="how-step"><span class="how-num">2</span><div><b>Read the intent</b><p>The foe shows what it will do next. Block early, or race it down before it lands.</p></div></div>
      <div class="how-step"><span class="how-num">3</span><div><b>Weaken, then throw</b><p>Catch odds rise as HP falls. Throwing costs 1 Energy. A failed throw enrages the wild Pokémon.</p></div></div>
      <div class="how-step"><span class="how-num">4</span><div><b>Catch to grow</b><p>A caught Pokémon joins your party and adds a signature card to your deck. Party max: 6.</p></div></div>
      <div class="how-step"><span class="how-num">5</span><div><b>Choose your path</b><p>Camps heal or upgrade. Shops trade gold for cards and balls. Caches hold relics.</p></div></div>
      <div class="how-step"><span class="how-num">6</span><div><b>Reach the Spire Heart</b><p>Mewtwo waits at the summit. Defeat it — or do something far more ambitious.</p></div></div>
    </div>
    <div class="how-tip">Keyboard: <kbd>1</kbd>–<kbd>9</kbd> play cards · <kbd>Space</kbd> end turn · <kbd>Esc</kbd> menu</div>
    <div class="modal-actions"><button class="btn btn-primary" data-close>Understood</button></div>
  `, { wide: true, dismissible: true });
}
function openBattleHelp() {
  openOverlay(`
    <div class="modal-head"><div class="section-kicker">Battle primer</div><h2>Turn order</h2></div>
    <div class="how-grid">
      <div class="how-step"><span class="how-num">✦</span><div><b>Energy</b><p>Cards cost Energy. You refill to 3 at the start of each turn.</p></div></div>
      <div class="how-step"><span class="how-num">◆</span><div><b>Block</b><p>Block absorbs damage, then vanishes at the start of your next turn.</p></div></div>
      <div class="how-step"><span class="how-num">☠</span><div><b>Poison & Burn</b><p>Both tick at the start of the afflicted side’s turn, ignoring Block, then fade by 1.</p></div></div>
      <div class="how-step"><span class="how-num">◇</span><div><b>Weak & Vulnerable</b><p>Weak cuts damage by 25%. Vulnerable increases damage taken by 50%.</p></div></div>
      <div class="how-step"><span class="how-num">●</span><div><b>Throwing</b><p>Catch chance rises as the foe weakens. A failed throw gives the foe +2 Strength.</p></div></div>
      <div class="how-step"><span class="how-num">↑</span><div><b>Strength</b><p>Adds flat damage to every hit. It lasts for the whole battle.</p></div></div>
    </div>
    <div class="modal-actions"><button class="btn btn-primary" data-close>Back to the fight</button></div>
  `, { wide: true, dismissible: true });
}

function showEndScreen(victory, captured = false) {
  clearSave();
  const run = state.run;
  if (!run) return;
  const minutes = Math.max(1, Math.round((Date.now() - (run.startedAt || Date.now())) / 60000));
  const title = victory ? (captured ? 'Mewtwo chooses you' : 'The summit is quiet') : 'The spire keeps its secrets';
  const quote = victory
    ? captured ? '“You did not climb to conquer. You climbed to ask.”' : '“The tower exhales. Somewhere below, the wilds keep singing.”'
    : '“Every trainer falls. The good ones learn what the fall was made of.”';
  const emblem = victory ? (captured ? '◉' : '✦') : '☠';
  openOverlay(`
    <div class="end-screen-modal">
      <div class="end-emblem">${emblem}</div>
      <div class="section-kicker" style="justify-content:center">${victory ? 'Expedition complete' : 'Expedition ended'}</div>
      <h2 class="overlay-title" style="margin-top:6px">${title}</h2>
      <p class="end-quote">${quote}</p>
      <div class="end-stats">
        <div><span>Floor</span><b>${Math.min(12, run.floor + 1)}</b></div>
        <div><span>Caught</span><b>${run.caught}</b></div>
        <div><span>Battles</span><b>${run.battles}</b></div>
        <div><span>Deck</span><b>${run.deck.length}</b></div>
        <div><span>Gold</span><b>${run.gold}</b></div>
        <div><span>Relics</span><b>${run.relics.length}</b></div>
        <div><span>Party</span><b>${run.party.length}</b></div>
        <div><span>Time</span><b>${minutes}m</b></div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-primary" data-end="new">Begin a new climb</button>
        <button class="btn btn-ghost" data-end="title">Return to title</button>
      </div>
    </div>
  `, {
    narrow: true, dismissible: false, onMount(root) {
      $$('[data-end]', root).forEach(btn => btn.addEventListener('click', () => {
        sfx('click');
        closeOverlay();
        if (btn.dataset.end === 'new') { showTitle(); openStarterSelect(); }
        else showTitle();
      }));
    }
  });
  if (victory) sfx('victory'); else sfx('lose');
}

/* ============================================================
   FX
   ============================================================ */
function spawnFloat(target, text, cls = '') {
  const layer = $('#fx-layer');
  if (!layer || !target) return;
  const lr = layer.getBoundingClientRect();
  const tr = target.getBoundingClientRect();
  const el = document.createElement('span');
  el.className = 'float-text ' + cls;
  el.textContent = text;
  el.style.left = (tr.left - lr.left + tr.width / 2) + 'px';
  el.style.top = (tr.top - lr.top + tr.height * .32) + 'px';
  el.style.transform = 'translate(-50%,0)';
  layer.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}
function sparkBurst(target, color = '#f1d792') {
  const layer = $('#fx-layer');
  if (!layer || !target) return;
  const lr = layer.getBoundingClientRect();
  const tr = target.getBoundingClientRect();
  const cx = tr.left - lr.left + tr.width / 2;
  const cy = tr.top - lr.top + tr.height * .4;
  for (let i = 0; i < 16; i++) {
    const p = document.createElement('span');
    p.className = 'spark-particle';
    p.style.left = cx + 'px'; p.style.top = cy + 'px';
    p.style.background = color;
    const ang = Math.random() * Math.PI * 2;
    const dist = rand(30, 100);
    p.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
    p.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
    layer.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
}
function shakeEl(el) {
  if (!el || state.reduced) return;
  el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
}
function flashEl(el) {
  if (!el || state.reduced) return;
  el.classList.remove('hit-flash'); void el.offsetWidth; el.classList.add('hit-flash');
}
function animateLunge(el, dx, reverse = false) {
  if (!el || state.reduced) return;
  const from = reverse ? `translateX(0) scaleX(1)` : `translateX(0) scaleX(-1)`;
  const to = reverse ? `translateX(${dx}px) scaleX(1)` : `translateX(${dx}px) scaleX(-1)`;
  el.animate([
    { transform: from },
    { transform: to, offset: .4 },
    { transform: from }
  ], { duration: 380, easing: 'ease-out' });
}
function fxBanner(text) {
  const layer = $('#fx-layer');
  if (!layer) return;
  const el = document.createElement('div');
  el.className = 'fx-banner';
  el.textContent = text;
  layer.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

/* ============================================================
   Debug / boot
   ============================================================ */
window.__PS = {
  state, startNewRun, showMap, openStarterSelect, startBattle, handleNodeClick,
  showCardReward, openRelicChoice, addRelic, completeNode, showEndScreen
};

init();


