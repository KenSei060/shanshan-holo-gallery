const listEl = document.getElementById('card-list');
const viewer = document.getElementById('viewer');
const stageTitle = document.getElementById('stage-title');
const openTab = document.getElementById('open-tab');

function resolvePath(p) {
  return new URL(p, window.location.href).href;
}

function selectCard(card, buttons) {
  buttons.forEach((b) => b.classList.toggle('active', b.dataset.id === card.id));
  const url = resolvePath(card.path);
  viewer.src = url;
  openTab.href = url;
  stageTitle.textContent = `${card.title} · ${card.subtitle} · ${card.technique}`;
  const hash = `#${card.id}`;
  if (location.hash !== hash) history.replaceState(null, '', hash);
}

async function main() {
  const res = await fetch('./cards.json', { cache: 'no-store' });
  const cards = await res.json();
  if (!Array.isArray(cards) || !cards.length) {
    stageTitle.textContent = '暂无卡片';
    return;
  }
  const buttons = [];
  for (const card of cards) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'card-btn';
    btn.dataset.id = card.id;
    btn.innerHTML = `<span class="t">${card.title}</span><span class="s">${card.subtitle}</span><span class="x">${card.technique}${card.tagline ? ' · ' + card.tagline : ''}</span>`;
    btn.addEventListener('click', () => selectCard(card, buttons));
    listEl.appendChild(btn);
    buttons.push(btn);
  }
  const fromHash = cards.find((c) => c.id === location.hash.slice(1));
  selectCard(fromHash || cards[0], buttons);
}

main().catch((err) => {
  console.error(err);
  stageTitle.textContent = '卡片列表加载失败';
});
