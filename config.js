// ===== 1. PASTE YOUR SUPABASE DETAILS (Project Settings > API) =====
const SUPABASE_URL = 'https://cawzmjinkedqsbmawrvm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_wW9GPIMte9_HTG3Gw4cfww_Jrs61o_h';
const PLATFORM_NAME = "Kings & Son's QR Platform";
// ===================================================================

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const BTN_META = {
  menu:      { color:'#e3f6e8', icon:'<path d="M5 3v7a2 2 0 0 0 2 2v9M9 3v7M13 3v7a2 2 0 0 1-2 2M19 3c-2 2-3 5-3 8h3v10"/>', stroke:'#15803d' },
  website:   { color:'#e0ecff', icon:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>', stroke:'#1d4ed8' },
  reviews:   { color:'#fff1d6', icon:'<path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.3l1.1-6.2L3 9.7l6.2-.9z"/>', stroke:'#b45309' },
  payment:   { color:'#dcf5e7', icon:'<path d="M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l12-4v4M16 14h2"/>', stroke:'#047857' },
  instagram: { color:'#fbe4ee', icon:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/>', stroke:'#be185d' },
  facebook:  { color:'#e3e8ff', icon:'<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>', stroke:'#1d4ed8' },
  whatsapp:  { color:'#dcf5e0', icon:'<path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3z"/>', stroke:'#15803d' }
};
const BTN_HINT = {
  menu:'Menu page URL', website:'Website URL', reviews:'Google review link',
  payment:'UPI ID (e.g. shop@upi)', instagram:'Username or URL', facebook:'Page URL',
  whatsapp:'Number with country code (e.g. 919876543210)'
};

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const svg = (key, size=26) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${BTN_META[key]?.stroke||'#333'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${BTN_META[key]?.icon||''}</svg>`;

function hrefFor(b, biz) {
  const v = (b.value || '').trim(); if (!v) return '';
  const url = u => /^(https?:|upi:|tel:|mailto:)/i.test(u) ? u : 'https://' + u;
  switch (b.key) {
    case 'whatsapp': { let d = v.replace(/\D/g,''); if (d.length === 10) d = '91' + d; return `https://wa.me/${d}?text=${encodeURIComponent('Hello ' + biz.name)}`; }
    case 'payment':  return /^(https?:|upi:)/i.test(v) ? v : `upi://pay?pa=${encodeURIComponent(v)}&pn=${encodeURIComponent(biz.name)}&cu=INR`;
    case 'instagram': return /[\/.]/.test(v) ? url(v) : `https://instagram.com/${v.replace('@','')}`;
    case 'facebook':  return /[\/.]/.test(v) ? url(v) : `https://facebook.com/${v}`;
    default: return url(v);
  }
}

// Renders the customer-facing card. opts.preview = show all visible buttons even without links.
function renderCard(root, biz, opts = {}) {
  const accent = biz.accent || '#16a34a';
  const btns = (biz.buttons || []).filter(b => b.visible && (opts.preview || b.value));
  const logo = biz.logo_url
    ? `<img src="${esc(biz.logo_url)}" alt="" style="border-color:${esc(accent)}">`
    : `<div class="ph" style="border-color:${esc(accent)}">${esc((biz.name||'?').trim().charAt(0).toUpperCase())}</div>`;
  const list = biz.layout === 'list';
  root.innerHTML = `
    <div class="logo">${logo}</div>
    <h1>${esc(biz.name)}</h1>
    <p class="tag">${esc(biz.tagline)}</p>
    <div class="tiles ${list ? 'list' : 'grid'}">
      ${btns.map((b, i) => {
        const m = BTN_META[b.key] || {};
        const odd = !list && btns.length % 2 === 1 && i === btns.length - 1;
        const href = hrefFor(b, biz);
        return `<a class="tile ${odd ? 'wide' : ''}" style="background:${m.color}" ${href && !opts.preview ? `href="${esc(href)}" target="_blank" rel="noopener"` : ''}>
          <span class="ic">${svg(b.key)}</span>
          <span class="tx"><b>${esc(b.label)}</b><small>${esc(b.sub)}</small></span></a>`;
      }).join('') || '<p class="tag">No links added yet.</p>'}
    </div>`;
}

const CARD_CSS = `
.card{max-width:460px;margin:0 auto;padding:28px 16px 40px;text-align:center}
.logo img,.logo .ph{width:92px;height:92px;border-radius:22px;object-fit:cover;border:2px solid;margin:0 auto}
.logo .ph{display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:800;background:#1b1f27;color:#fff}
.card h1{font-size:26px;margin:14px 0 4px;text-transform:uppercase;letter-spacing:.3px}
.card .tag{color:#9aa3b2;margin:0 0 20px}
.tiles{display:grid;gap:12px}
.tiles.grid{grid-template-columns:1fr 1fr}
.tile{color:#111;text-decoration:none;border-radius:18px;padding:16px 14px;display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;min-height:104px;justify-content:center;transition:transform .12s}
.tile:active{transform:scale(.97)}
.tile.wide{grid-column:1/-1}
.tile b{font-size:16px;display:block}.tile small{font-size:12.5px;color:#3b4350;display:block}
.tiles.list .tile{flex-direction:row;text-align:left;min-height:0;justify-content:flex-start;gap:14px;padding:14px 16px}
.tiles.list .tx{flex:1}
`;
