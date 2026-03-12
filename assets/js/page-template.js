(async function () {
  const key = document.body.dataset.page;
  const doc = window.PAGE_DOCS && window.PAGE_DOCS[key];
  const root = document.getElementById('docRoot');
  if (!doc || !root) return;

  const guideOrder = [
    ['Start', ['home', 'connect', 'devices']],
    ['Operation', ['record', 'training', 'inference', 'steering']],
    ['Data Tools', ['datatools', 'augment', 'visualize', 'kinematics']],
    ['Annotation', ['sam2', 'detection', 'tt', 'subgoal', 'embedding']],
    ['Online', ['rtsam', 'rain', 'foundationpose', 'calib', 'pri4r']],
  ];

  /* ── Markdown frontmatter parser ── */
  function parseFrontmatter(raw) {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) return { meta: {}, body: raw };
    const meta = {};
    let currentKey = null;
    let currentList = null;
    const unquote = (s) => s.replace(/^"(.*)"$/, '$1');
    for (const line of match[1].split('\n')) {
      /* list item: "  - name: ..." */
      const listItem = line.match(/^\s+-\s+(\w+):\s*"?(.*?)"?\s*$/);
      if (listItem && currentList) {
        currentList.push({ [listItem[1]]: unquote(listItem[2]) });
        continue;
      }
      /* continuation property: "    desc: ..." (same indent, no dash) */
      const contProp = line.match(/^\s+(\w+):\s*"?(.*?)"?\s*$/);
      if (contProp && currentList && currentList.length) {
        const last = currentList[currentList.length - 1];
        if (typeof last === 'object') {
          last[contProp[1]] = unquote(contProp[2]);
          continue;
        }
      }
      /* top-level key */
      const kvMatch = line.match(/^(\w+):\s*(.*)$/);
      if (kvMatch) {
        currentKey = kvMatch[1];
        const val = kvMatch[2].trim();
        if (val === '') {
          currentList = [];
          meta[currentKey] = currentList;
        } else {
          meta[currentKey] = unquote(val);
          currentList = null;
        }
      }
    }
    return { meta, body: match[2] };
  }

  /* ── Load guide from markdown file ── */
  async function loadGuideKo(pageKey) {
    try {
      const res = await fetch(`../content/ko/${pageKey}.md`);
      if (!res.ok) return null;
      const raw = await res.text();
      const { meta, body } = parseFrontmatter(raw);
      const steps = [];
      const bodyClean = body.replace(/<!--[\s\S]*?-->/g, '').trim();
      const lines = bodyClean.split('\n');
      let currentStep = '';
      for (const line of lines) {
        const stepMatch = line.match(/^\d+\.\s+(.+)/);
        if (stepMatch) {
          if (currentStep) steps.push(currentStep.trim());
          currentStep = stepMatch[1];
        } else if (currentStep && line.trim()) {
          currentStep += ' ' + line.trim();
        }
      }
      if (currentStep) steps.push(currentStep.trim());
      return {
        headline: meta.headline || '',
        summary: meta.summary || '',
        goal: meta.goal || '',
        done: meta.done || '',
        caution: meta.caution || '',
        layoutMap: Array.isArray(meta.layout) ? meta.layout : [],
        steps: steps,
      };
    } catch (e) {
      return null;
    }
  }

  const loadedGuide = await loadGuideKo(key);

  const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  const renderInlineCode = (value) => escapeHtml(value).replace(/`([^`]+)`/g, '<code>$1</code>');
  const renderGuideMarkup = (value) => renderInlineCode(value)
    .replace(/\[btn:([^\]]+)\]/g, '<span class="ui-btn">$1</span>')
    .replace(/\[area:([^\]]+)\]/g, '<span class="ui-area">$1</span>')
    .replace(/\[screenshot:([^\]]+)\]/g, '<span class="screenshot-btn">$1</span>');

  const list = (arr) => (arr || []).map((value) => `<li>${escapeHtml(value)}</li>`).join('');
  const kv = Object.entries(doc.tech || {})
    .map(([field, value]) => `<div class="k">${escapeHtml(field)}</div><div class="v">${escapeHtml(value)}</div>`)
    .join('');

  const audience = doc.audience || ['Platform operator', 'Dataset owner', 'Model experiment owner'];
  const flow = doc.userFlow || doc.checklist || [];
  const tips = doc.userTips || doc.failureModes || [];
  const expected = doc.expectedResult || doc.outputs || [];
  const topFeatures = (doc.features || []).slice(0, 6);
  const prerequisites = doc.prerequisites || [];
  const relatedPages = doc.relatedPages || [];
  const artifacts = doc.artifacts || [];

  const quickMeta = [
    doc.accessRule ? { label: '들어가기 순서', value: doc.accessRule } : null,
    doc.bestFor ? { label: '이럴 때 사용', value: doc.bestFor } : null,
    doc.runtimeMode ? { label: '화면 성격', value: doc.runtimeMode } : null,
  ].filter(Boolean);

  const flatGuideOrder = guideOrder.flatMap(([, keys]) => keys)
    .map((pageKey) => ({ pageKey, pageDoc: window.PAGE_DOCS[pageKey] }))
    .filter(({ pageDoc }) => Boolean(pageDoc));
  const currentIndex = flatGuideOrder.findIndex(({ pageKey }) => pageKey === key);
  const prevEntry = currentIndex > 0 ? flatGuideOrder[currentIndex - 1] : null;
  const nextEntry = currentIndex >= 0 && currentIndex < flatGuideOrder.length - 1 ? flatGuideOrder[currentIndex + 1] : null;

  const quickGuide = loadedGuide || {
    headline: '이 화면을 빠르게 이해하는 구역',
    summary: '핵심 목적과 순서만 먼저 보고, 아래 상세 문서를 필요할 때 참고하면 됩니다.',
    goal: '무엇을 하는 화면인지 먼저 파악합니다.',
    done: '다음 단계로 넘어갈 기준을 잡습니다.',
    steps: [
      '화면 목적을 먼저 확인합니다.',
      '필요한 입력이나 연결 상태를 봅니다.',
      '결과가 맞는지 확인한 뒤 다음 단계로 넘어갑니다.',
    ],
    caution: '입력과 상태를 확인하지 않고 바로 실행하면 디버깅이 오래 걸릴 수 있습니다.',
  };
  const introCards = [
    {
      label: '먼저 볼 것',
      value: quickGuide.steps[0] || doc.accessRule || '화면 목적과 현재 상태를 먼저 확인합니다.',
    },
    {
      label: '끝나면 좋은 상태',
      value: quickGuide.done || expected[0] || '다음 단계로 넘어갈 기준이 정리됩니다.',
    },
    {
      label: '주의할 점',
      value: quickGuide.caution,
    },
  ];

  const actionButtons = [
    { href: '../index.html', label: 'Docs Home', tone: 'primary' },
    { href: '#introduction', label: 'Introduction', tone: 'secondary' },
    { href: '#quickstart', label: 'Quick Start', tone: 'secondary' },
    { href: '#guide', label: '상세 참고', tone: 'secondary' },
    { href: '#io', label: '입출력', tone: 'secondary' },
  ];

  if (prevEntry) {
    actionButtons.push({
      href: `./${prevEntry.pageKey}.html`,
      label: `이전: ${prevEntry.pageDoc.title}`,
      tone: 'ghost',
    });
  }

  if (nextEntry) {
    actionButtons.push({
      href: `./${nextEntry.pageKey}.html`,
      label: `다음: ${nextEntry.pageDoc.title}`,
      tone: 'ghost',
    });
  }

  const sidebarHtml = guideOrder.map(([group, keys]) => {
    const items = keys
      .map((pageKey) => ({ pageKey, pageDoc: window.PAGE_DOCS[pageKey] }))
      .filter(({ pageDoc }) => Boolean(pageDoc));

    return `
      <section class="page-sidebar-section">
        <span class="page-sidebar-label">${escapeHtml(group)}</span>
        <div class="page-sidebar-list">
          ${items.map(({ pageKey, pageDoc }) => `
            <a class="page-sidebar-link${pageKey === key ? ' is-active' : ''}" href="./${pageKey}.html">
              <span class="page-sidebar-link-copy">
                <strong>${escapeHtml(pageDoc.title)}</strong>
                <em>${escapeHtml(pageDoc.subtitle)}</em>
              </span>
              <span class="page-sidebar-link-state">${pageKey === key ? '현재' : '열기'}</span>
            </a>
          `).join('')}
        </div>
      </section>
    `;
  }).join('');

  root.innerHTML = `
    <div class="page-doc-layout">
      <aside class="page-doc-sidebar glass-strong">
        <div class="page-doc-sidebar-head">
          <img src="../assets/images/logo_nexus.png" alt="PRISM" />
          <div>
            <strong>PRISM Manuals</strong>
            <span>Quick page navigation</span>
          </div>
        </div>
        ${sidebarHtml}
      </aside>

      <div class="page-doc-main">
        <section class="hero">
          <div class="hero-premium page-doc-hero glass-strong nexus-glow" style="text-align:left;">
            <p class="eyebrow">Manual</p>
            <h1 style="margin-top:.35rem; font-size:clamp(1.55rem,2.5vw,2.15rem);">${escapeHtml(doc.title)}</h1>
            <p class="subtitle" style="margin-top:.35rem;">${escapeHtml(doc.subtitle)}</p>
            <p>${renderGuideMarkup(quickGuide.summary)}</p>
            ${quickMeta.length ? `
              <div class="meta-chip-grid">
                ${quickMeta.map((item) => `
                  <article class="meta-chip-card">
                    <span>${escapeHtml(item.label)}</span>
                    <strong>${escapeHtml(item.value)}</strong>
                  </article>
                `).join('')}
              </div>
            ` : ''}
            <div class="hero-action-row">
              ${actionButtons.map((button) => `
                <a class="hero-action ${button.tone}" href="${escapeHtml(button.href)}">${escapeHtml(button.label)}</a>
              `).join('')}
            </div>
          </div>
        </section>

        <section class="section" id="introduction">
          <h2>Introduction</h2>
          <p class="section-lead">${renderGuideMarkup(quickGuide.summary)}</p>
          <article class="intro-spotlight glass">
            <span>${escapeHtml(doc.runtimeMode || 'Guide page')}</span>
            <strong>${renderGuideMarkup(quickGuide.headline)}</strong>
            <p>${renderGuideMarkup(quickGuide.goal)}</p>
          </article>
          <div class="intro-card-grid">
            ${introCards.map((item) => `
              <article class="intro-card glass">
                <span>${escapeHtml(item.label)}</span>
                <p>${renderGuideMarkup(item.value)}</p>
              </article>
            `).join('')}
          </div>
        </section>

        <section class="section primary" id="quickstart">
          <h2>쉬운 사용 가이드</h2>
          <p class="section-lead">처음 보는 사람 기준으로 핵심만 짧게 정리했다. 바로 아래 순서만 따라가도 화면 목적을 빠르게 이해할 수 있다.</p>
          <div class="quick-guide-grid">
            <article class="quick-guide-card glass">
              <span>이 화면에서 하는 일</span>
              <strong>${renderGuideMarkup(quickGuide.headline)}</strong>
              <p>${renderGuideMarkup(quickGuide.goal)}</p>
            </article>
            <article class="quick-guide-card glass">
              <span>끝나면 좋은 상태</span>
              <strong>${escapeHtml(doc.title)} ready</strong>
              <p>${renderGuideMarkup(quickGuide.done)}</p>
            </article>
          </div>
          ${(quickGuide.layoutMap || []).length ? `
            <h3 style="margin-top:1.2rem;">화면 구성 한눈에 보기</h3>
            <div class="ui-layout-map">
              ${quickGuide.layoutMap.map((area) => `
                <div class="area-label">
                  <strong>${escapeHtml(area.name)}</strong>
                  ${area.desc ? renderGuideMarkup(area.desc) : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          <ol class="step-list">
            ${quickGuide.steps.map((step, index) => `
              <li>
                <span class="step-title">Step ${index + 1}</span>
                <span class="step-detail">${renderGuideMarkup(step)}</span>
              </li>
            `).join('')}
          </ol>
          <div class="doc-callout warn">
            <h3>실수하기 쉬운 점</h3>
            <p>${renderGuideMarkup(quickGuide.caution)}</p>
          </div>
        </section>

        <section class="section" id="guide">
          <h2>상세 참고</h2>
          <p class="section-lead">아래 내용은 원문 설명과 기술 메모를 함께 보여준다. 빠른 사용은 위 한국어 가이드를 먼저 보면 충분하다.</p>
          <div class="doc-intro-grid">
            <article class="glass">
              <h3>추천 사용자</h3>
              <ul>${list(audience)}</ul>
            </article>
            <article class="glass">
              <h3>완료되면 기대하는 상태</h3>
              <ul>${list(expected)}</ul>
            </article>
          </div>
          ${prerequisites.length ? `
            <div class="doc-callout info">
              <h3>열기 전에 확인할 점</h3>
              <ul>${list(prerequisites)}</ul>
            </div>
          ` : ''}
          ${doc.guideHtml ? `
            <details class="doc-details">
              <summary>영문 상세 설명 펼치기</summary>
              <div class="doc-details-body">
                ${doc.guideHtml}
              </div>
            </details>
          ` : ''}
          ${artifacts.length ? `
            <div class="doc-callout accent">
              <h3>이 화면에서 남는 결과물</h3>
              <ul>${list(artifacts)}</ul>
            </div>
          ` : ''}
        </section>

        <section class="section" id="api">
          <h2>연결된 서비스와 토픽</h2>
          <div class="grid2">
            <div>
              <h3>ROS Services</h3>
              <ul>${list(doc.services)}</ul>
            </div>
            <div>
              <h3>ROS Topics</h3>
              <ul>${list(doc.topics)}</ul>
            </div>
          </div>
          ${relatedPages.length ? `
            <h3>관련 화면</h3>
            <ul>${list(relatedPages)}</ul>
          ` : ''}
        </section>

        <section class="section" id="tech">
          <h2>기술 구조</h2>
          <div class="kv">${kv}</div>
          ${topFeatures.length ? `
            <h3>주요 기능</h3>
            <div class="cap-grid">
              ${topFeatures.map((value) => `<article class="cap-card"><p>${escapeHtml(value)}</p></article>`).join('')}
            </div>
          ` : ''}
          ${flow.length ? `
            <h3>일반 흐름</h3>
            <ol class="ordered">${flow.map((value) => `<li>${escapeHtml(value)}</li>`).join('')}</ol>
          ` : ''}
        </section>

        <section class="section" id="io">
          <h2>입력과 출력</h2>
          <div class="grid2">
            <div>
              <h3>입력</h3>
              <ul>${list(doc.inputs)}</ul>
            </div>
            <div>
              <h3>출력</h3>
              <ul>${list(doc.outputs)}</ul>
            </div>
          </div>
          ${doc.ioHtml ? `
            <div class="doc-block">
              ${doc.ioHtml}
            </div>
          ` : ''}
          ${tips.length ? `
            <div class="doc-callout warn">
              <h3>운영 메모와 주의점</h3>
              <ul>${list(tips)}</ul>
            </div>
          ` : ''}
        </section>
      </div>
    </div>
  `;
})();
