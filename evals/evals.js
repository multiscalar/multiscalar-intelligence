// Economic Agent Leaderboards: renders three benchmark cards from static JSON.
(function () {
  const BENCHES = ['economic-arena', 'treasury-bench', 'terms-bench', 'vending-bench-2'];
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

  // Hash is "#bench" or "#bench/metric", so a specific view is linkable.
  const [hashBench, hashMetric] = location.hash.replace('#', '').split('/');
  const state = {
    data: {},
    active: BENCHES.includes(hashBench) ? hashBench : BENCHES[0],
    metric: null,
    pendingMetric: hashMetric || null,
  };

  // A bench whose data file is absent is skipped rather than breaking the page,
  // so a card can be added to BENCHES before its run has finished.
  Promise.all(
    BENCHES.map((b) =>
      fetch(`data/${b}.json`)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null)
    )
  )
    .then((all) => {
      all.filter(Boolean).forEach((d) => (state.data[d.bench] = d));
      const available = BENCHES.filter((b) => state.data[b]);
      if (!available.length) throw new Error('no benchmark data found');
      BENCHES.length = 0;
      BENCHES.push(...available);
      if (!state.data[state.active]) state.active = available[0];
      renderSidebar();
      select(state.active);
    })
    .catch((err) => {
      console.error(err);
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
    const d = state.data[bench];
    const wanted = state.pendingMetric;
    state.pendingMetric = null;
    state.metric = (wanted && d.metrics.some((m) => m.id === wanted))
      ? wanted
      : d.defaultMetric;
    syncHash();
    renderSidebar();
    renderCard();
  }

  function syncHash() {
    const d = state.data[state.active];
    const suffix = state.metric && state.metric !== d.defaultMetric ? '/' + state.metric : '';
    history.replaceState(null, '', '#' + state.active + suffix);
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
    // Explicit tiebreak by name: two models with equal scores must not swap places
    // between renders or regenerations.
    rows.sort((a, b) => {
      const d = higherIsBetter ? b.value - a.value : a.value - b.value;
      return d !== 0 ? d : a.model.name.localeCompare(b.model.name);
    });
    return rows;
  }

  // ----- formatting -----

  function fmt(value, unit) {
    if (typeof value !== 'number' || !isFinite(value)) return '—';
    if (unit === '$') {
      const abs = Math.abs(Math.round(value)).toLocaleString('en-US');
      return (value < 0 ? '−$' : '$') + abs;
    }
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
      // Skip views that are not per-model scores (e.g. the head-to-head matrix).
      d.metrics
        .filter((m) => typeof row.model.scores[m.id] === 'number')
        .forEach((m) => {
          lines.push(`<span class="tip-row">${m.label}: ${fmt(row.model.scores[m.id], m.unit)}</span>`);
        });
    }
    return lines.join('<br>');
  }

  // ----- head-to-head heatmap -----

  // Diverging scale around the even split. Blue arm = takes more than half, red arm =
  // takes less, neutral gray at 50%. Arms are lightness-matched, equal step count.
  const DIVERGING = {
    mid: '#f0efec',
    more: ['#cde2fb', '#9ec5f4', '#5598e7', '#2a78d6'],
    less: ['#fad6d2', '#f1aea8', '#dd716a', '#c74845'],
  };

  // Colour encodes the advantage over the opponent *in that pairing*, not distance from
  // 50. The two shares in a pairing sum to its efficiency, so the balanced point is their
  // midpoint — centring on a flat 50 would paint everything red merely because the auction
  // destroys surplus and drags all shares below half.
  function cellColor(v, mirror) {
    if (mirror == null) return DIVERGING.mid;
    const d = (v - mirror) / 2;
    if (Math.abs(d) < 1.5) return DIVERGING.mid;
    const arm = d > 0 ? DIVERGING.more : DIVERGING.less;
    const i = Math.min(arm.length - 1, Math.floor((Math.abs(d) - 1.5) / 4));
    return arm[i];
  }

  const SHORT = {
    'Gemini 3.1 Pro': 'Gemini', 'Claude Opus 5': 'Opus 5', 'GPT-5.6 Terra': 'Terra',
    'Qwen 3.6 Plus': 'Qwen', 'Kimi K2.6': 'Kimi', 'Claude Sonnet 5': 'Sonnet 5',
    'GLM 5.1': 'GLM', 'DeepSeek V4 Pro': 'DeepSeek', 'GPT-OSS-120B': 'GPT-OSS',
    'Grok 4.20': 'Grok',
  };
  const short = (n) => SHORT[n] || n.split(' ')[0];

  function advantage(d, row, col) {
    const v = d.matrix[`${row.model_id}|${col.model_id}`];
    const w = d.matrix[`${col.model_id}|${row.model_id}`];
    if (v == null || w == null) return null;
    return { own: v, opp: w, adv: (v - w) / 2 };
  }

  function renderMatrix(d) {
    const ranked = [...d.models].sort((a, b) =>
      (b.scores.claim_share - a.scores.claim_share) || a.name.localeCompare(b.name));
    if (!state.focus || !ranked.some((m) => m.model_id === state.focus)) {
      state.focus = ranked[0].model_id;
    }
    const focus = ranked.find((m) => m.model_id === state.focus);

    const picker = ranked.map((m) => {
      const p = providerOf(m);
      const on = m.model_id === state.focus;
      return `<button class="h2h-pick${on ? ' active' : ''}" data-focus="${m.model_id}"
        title="${m.name}">${chipHTML(p)}<span>${short(m.name)}</span></button>`;
    }).join('');

    const rows = ranked
      .filter((m) => m.model_id !== focus.model_id)
      .map((m) => ({ m, ...advantage(d, focus, m) }))
      .filter((r) => r.adv != null)
      .sort((a, b) => (b.adv - a.adv) || a.m.name.localeCompare(b.m.name));

    const wins = rows.filter((r) => r.adv > 0.5).length;
    const losses = rows.filter((r) => r.adv < -0.5).length;
    const best = rows[0];
    const worst = rows[rows.length - 1];
    const maxAbs = Math.max(...rows.map((r) => Math.abs(r.adv)), 4);

    const bars = rows.map((r) => {
      const pct = (Math.abs(r.adv) / maxAbs) * 48;
      const win = r.adv > 0;
      const p = providerOf(r.m);
      const side = win ? `left:50%;width:${pct}%` : `right:50%;width:${pct}%`;
      return `
        <div class="h2h-row">
          <span class="h2h-name">${chipHTML(p)}<span>${short(r.m.name)}</span></span>
          <span class="h2h-track">
            <span class="h2h-zero"></span>
            <span class="h2h-bar ${win ? 'win' : 'lose'}" style="${side}"></span>
          </span>
          <span class="h2h-adv ${win ? 'win' : 'lose'}">${win ? '+' : '−'}${Math.abs(r.adv).toFixed(1)}</span>
          <span class="h2h-raw">${Math.round(r.own)} vs ${Math.round(r.opp)}</span>
        </div>`;
    }).join('');

    const record = losses === 0
      ? `Takes more surplus than <strong>all ${rows.length}</strong> opponents.`
      : wins === 0
        ? `Takes less surplus than <strong>all ${rows.length}</strong> opponents.`
        : `Ahead of <strong>${wins}</strong> opponents, behind <strong>${losses}</strong>.`;

    return `
      <div class="h2h">
        <div class="h2h-label">Pick a model</div>
        <div class="h2h-picker">${picker}</div>
        <p class="h2h-lead">${record}
          ${best.adv > 0 ? 'Biggest edge' : 'Smallest deficit'}
          <span class="h2h-inline ${best.adv > 0 ? 'win' : 'lose'}">${best.adv > 0 ? '+' : '−'}${Math.abs(best.adv).toFixed(1)} vs ${short(best.m.name)}</span>,
          ${worst.adv < 0 ? 'biggest deficit' : 'closest matchup'}
          <span class="h2h-inline ${worst.adv < 0 ? 'lose' : 'win'}">${worst.adv < 0 ? '−' : '+'}${Math.abs(worst.adv).toFixed(1)} vs ${short(worst.m.name)}</span>.
        </p>
        <div class="h2h-head">
          <span>Opponent</span><span class="h2h-axis"><i>opponent ahead</i><i>even</i><i>${short(focus.name)} ahead</i></span>
          <span class="h2h-adv-h">edge</span><span class="h2h-raw-h">shares</span>
        </div>
        <div class="h2h-chart">${bars}</div>
        <p class="h2h-note">Edge is how many points of the available surplus
        ${focus.name} takes above or below that opponent. Shares are the two mean
        percentages in that pairing.</p>
      </div>`;
  }

  // ----- rendering -----

  function renderCard() {
    const d = state.data[state.active];
    const metricDef = d.metrics.find((m) => m.id === state.metric);
    const isMatrix = metricDef.kind === 'matrix';
    const rows = isMatrix ? [] : scoredModels(d);

    const shown = rows.slice(0, MAX_BARS);
    const tail = rows.length > MAX_BARS ? rows[rows.length - 1] : null;
    const maxVal = rows.length ? Math.max(...rows.map((r) => Math.abs(r.value))) : 1;

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
      <p class="metric-note">${isMatrix ? '' : (metricDef.higherIsBetter === false ? '↓ lower is better' : '↑ higher is better')}</p>
      ${isMatrix ? renderMatrix(d) : '<div class="chart" id="chart"></div>'}
      <div class="bench-foot">
        <p class="bench-blurb">${d.blurb}${d.footnote ? `<span class="bench-footnote">${d.footnote}</span>` : ''}</p>
        <div class="bench-stamp">
          results as of ${d.source.snapshot}<br>
          <a href="${d.source.url}" target="_blank" rel="noopener">${d.source.linkText || (rows.length > MAX_BARS ? `+${rows.length - MAX_BARS - 1} more at source` : 'full results at source')} ↗</a>
        </div>
      </div>`;

    const chart = cardEl.querySelector('#chart');
    if (chart) {
    shown.forEach((row, i) => chart.appendChild(barCol(d, row, i + 1, maxVal, metricDef)));
    if (tail) {
      const sep = document.createElement('div');
      sep.className = 'tail-sep';
      chart.appendChild(sep);
      chart.appendChild(barCol(d, tail, rows.length, maxVal, metricDef, true));
    }
    }

    cardEl.querySelectorAll('.h2h-pick').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.focus = btn.dataset.focus;
        renderCard();
      });
    });

    cardEl.querySelectorAll('.metric-toggle button').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.metric = btn.dataset.metric;
        syncHash();
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
