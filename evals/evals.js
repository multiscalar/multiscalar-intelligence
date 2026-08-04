// Economic Agent Leaderboards: renders three benchmark cards from static JSON.
(function () {
  const BENCHES = ['exploitability', 'terms-bench', 'vending-bench-2'];
  const MAX_BARS = 12;

  // Colour follows the provider (the entity), never the rank. Hues are the seven
  // validated categorical slots; every other provider folds into the neutral slot.
  // Seven validated categorical hues carry the frequent providers; everyone else
  // takes the neutral slot. Identity is carried by the provider mark either way.
  const PROVIDERS = {
    anthropic: { label: 'Anthropic', color: '#eb6834', icon: 'anthropic' },
    openai: { label: 'OpenAI', color: '#1baf7a', icon: 'openai' },
    google: { label: 'Google', color: '#2a78d6', icon: 'google' },
    alibaba: { label: 'Alibaba', color: '#4a3aa7', icon: 'alibaba' },
    zai: { label: 'Z.ai', color: '#008300', mark: 'Z' },
    moonshot: { label: 'Moonshot', color: '#e87ba4', icon: 'moonshot' },
    deepseek: { label: 'DeepSeek', color: '#eda100', icon: 'deepseek' },
    xai: { label: 'xAI', color: '#8a8a80', icon: 'xai' },
    minimax: { label: 'MiniMax', color: '#8a8a80', icon: 'minimax' },
    meta: { label: 'Meta', color: '#8a8a80', icon: 'meta' },
    bytedance: { label: 'ByteDance', color: '#8a8a80', icon: 'bytedance' },
    other: { label: 'Other', color: '#8a8a80', mark: '•' },
    baseline: { label: 'Scripted baseline', color: '#b9b9b2', mark: 'fx' },
  };

  const PROVIDER_ALIASES = {
    anthropic: 'anthropic',
    openai: 'openai',
    google: 'google',
    'google deepmind': 'google',
    alibaba: 'alibaba',
    qwen: 'alibaba',
    'z.ai': 'zai',
    zhipu: 'zai',
    glm: 'zai',
    moonshot: 'moonshot',
    'moonshot ai': 'moonshot',
    deepseek: 'deepseek',
    xai: 'xai',
    minimax: 'minimax',
    meta: 'meta',
    bytedance: 'bytedance',
    doubao: 'bytedance',
    baseline: 'baseline',
  };

  function chipHTML(p) {
    const path = p.icon && (window.PROVIDER_ICONS || {})[p.icon];
    const inner = path
      ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}" fill="${p.color}"/></svg>`
      : `<span class="chip-mark" style="color:${p.color}">${p.mark || '•'}</span>`;
    return `<span class="bar-chip" title="${p.label}" aria-label="${p.label}">${inner}</span>`;
  }

  function providerOf(model) {
    const raw = (model.provider || '').toLowerCase().trim();
    const slug = PROVIDER_ALIASES[raw];
    if (slug) return PROVIDERS[slug];
    if (/^fixed /i.test(model.name)) return PROVIDERS.baseline;
    return PROVIDERS.other;
  }

  const listEl = document.getElementById('bench-list');
  const cardEl = document.getElementById('bench-card');

  const fromHash = location.hash.replace('#', '');
  const state = {
    data: {},
    active: BENCHES.includes(fromHash) ? fromHash : BENCHES[0],
    metric: null,
  };

  Promise.all(
    BENCHES.map((b) =>
      fetch(`data/${b}.json`).then((r) => {
        if (!r.ok) throw new Error(`${b}: HTTP ${r.status}`);
        return r.json();
      })
    )
  )
    .then((all) => {
      all.forEach((d) => (state.data[d.bench] = d));
      renderSidebar();
      select(state.active);
    })
    .catch((err) => {
      cardEl.innerHTML = `<div class="bench-loading">Could not load results (${err.message})</div>`;
    });

  function renderSidebar() {
    listEl.innerHTML = '';
    BENCHES.forEach((b) => {
      const d = state.data[b];
      const btn = document.createElement('button');
      btn.className = 'bench-item' + (b === state.active ? ' active' : '');
      btn.innerHTML = `<span class="dot"></span><span>${d.title}<span class="bench-item-q">${d.question}</span></span>`;
      btn.addEventListener('click', () => select(b));
      listEl.appendChild(btn);
    });
  }

  function select(bench) {
    state.active = bench;
    history.replaceState(null, '', '#' + bench);
    state.metric = state.data[bench].defaultMetric;
    renderSidebar();
    renderCard();
  }

  // ----- scoring -----

  // Exploitability: delta extracted surplus as % of the game's feasible surplus;
  // "overall" is the unweighted mean across the four games.
  function exploitScore(model, metric, games) {
    const norm = (g) => (model.deltaSurplus[g] / games[g].feasibleSurplus) * 100;
    if (metric === 'overall') {
      const keys = Object.keys(games);
      return keys.reduce((s, g) => s + norm(g), 0) / keys.length;
    }
    return norm(metric);
  }

  function scoredModels(d) {
    const metric = state.metric;
    const higherIsBetter = d.metrics.find((m) => m.id === metric).higherIsBetter !== false;
    const rows = d.models.map((m) => ({
      model: m,
      value: d.bench === 'exploitability'
        ? exploitScore(m, metric, d.games)
        : m.scores[metric],
    }));
    rows.sort((a, b) => (higherIsBetter ? b.value - a.value : a.value - b.value));
    return rows;
  }

  // ----- formatting -----

  function fmt(value, unit) {
    if (unit === '$') return '$' + Math.round(value).toLocaleString('en-US');
    return value.toFixed(value >= 100 ? 0 : 1) + '%';
  }

  function tipHTML(d, row) {
    const lines = [`<span class="tip-title">${row.model.name}</span>`];
    lines.push(`<span class="tip-row">${providerOf(row.model).label}</span>`);
    if (d.bench === 'exploitability') {
      Object.keys(d.games).forEach((g) => {
        const label = d.metrics.find((m) => m.id === g).label;
        lines.push(`<span class="tip-row">${label}: ${fmt(exploitScore(row.model, g, d.games), '%')}</span>`);
      });
    } else if (d.bench === 'vending-bench-2') {
      const se = row.model.stderr;
      lines.push(`<span class="tip-row">Net worth: ${fmt(row.value, '$')}${se ? ' ± $' + Math.round(se).toLocaleString('en-US') : ''}</span>`);
    } else {
      d.metrics.forEach((m) => {
        lines.push(`<span class="tip-row">${m.label}: ${fmt(row.model.scores[m.id], m.unit)}</span>`);
      });
    }
    return lines.join('<br>');
  }

  // ----- rendering -----

  function renderCard() {
    const d = state.data[state.active];
    const metricDef = d.metrics.find((m) => m.id === state.metric);
    const rows = scoredModels(d);

    const shown = rows.slice(0, MAX_BARS);
    const tail = rows.length > MAX_BARS ? rows[rows.length - 1] : null;
    const maxVal = Math.max(...rows.map((r) => Math.abs(r.value)));

    const sourceLabel = d.source.label || d.source.name;

    cardEl.innerHTML = `
      <div class="bench-head">
        <div class="bench-title-block">
          <h2>${d.title}</h2>
          <div class="bench-question">${d.question}</div>
          <span class="bench-source">by <a href="${d.source.url}" target="_blank" rel="noopener">${sourceLabel}</a></span>
        </div>
        ${d.metrics.length > 1 ? `<div class="metric-toggle" role="tablist">${d.metrics
          .map((m) => `<button role="tab" data-metric="${m.id}" class="${m.id === state.metric ? 'active' : ''}">${m.label}</button>`)
          .join('')}</div>` : ''}
      </div>
      <p class="metric-note">${metricDef.higherIsBetter === false ? '↓ lower is better' : '↑ higher is better'}</p>
      <div class="chart" id="chart"></div>
      <div class="bench-foot">
        <p class="bench-blurb">${d.blurb}${d.footnote ? `<span class="bench-footnote">${d.footnote}</span>` : ''}</p>
        <div class="bench-stamp">
          results as of ${d.source.snapshot}<br>
          ${rows.length > MAX_BARS ? `<a href="${d.source.url}" target="_blank" rel="noopener">+${rows.length - MAX_BARS - 1} more at source ↗</a>` : `<a href="${d.source.url}" target="_blank" rel="noopener">full results at source ↗</a>`}
        </div>
      </div>`;

    const chart = cardEl.querySelector('#chart');
    shown.forEach((row, i) => chart.appendChild(barCol(d, row, i + 1, maxVal, metricDef)));
    if (tail) {
      const sep = document.createElement('div');
      sep.className = 'tail-sep';
      chart.appendChild(sep);
      chart.appendChild(barCol(d, tail, rows.length, maxVal, metricDef, true));
    }

    cardEl.querySelectorAll('.metric-toggle button').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.metric = btn.dataset.metric;
        renderCard();
      });
    });
  }

  function barCol(d, row, rank, maxVal, metricDef, isTail) {
    const col = document.createElement('div');
    col.className = 'bar-col';
    const p = providerOf(row.model);
    const h = Math.max(9, (Math.abs(row.value) / maxVal) * 100);
    col.innerHTML = `
      <div class="chart-tip">${tipHTML(d, row)}</div>
      ${isTail ? `<span class="bar-rank">#${rank}</span>` : ''}
      <span class="bar-value">${fmt(row.value, metricDef.unit)}</span>
      <div class="bar" style="height:${h}%;background:${p.color}">${chipHTML(p)}</div>
      <span class="bar-name">${row.model.name}</span>`;
    return col;
  }
})();
