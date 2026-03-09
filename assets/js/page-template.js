(function () {
  const key = document.body.dataset.page;
  const doc = window.PAGE_DOCS && window.PAGE_DOCS[key];
  const root = document.getElementById('docRoot');
  if (!doc || !root) return;
  const guideOrder = [
    ['Pipeline', ['home', 'devices', 'record', 'training', 'inference', 'steering']],
    ['Tools', ['datatools', 'augment', 'visualize', 'sam2', 'rtsam', 'rain', 'detection', 'tt', 'kinematics', 'calib', 'foundationpose', 'embedding', 'subgoal']],
  ];

  const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const list = (arr) => (arr || []).map((v) => `<li>${escapeHtml(v)}</li>`).join('');
  const kv = Object.entries(doc.tech || {})
    .map(([k, v]) => `<div class="k">${escapeHtml(k)}</div><div class="v">${escapeHtml(v)}</div>`)
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
    doc.accessRule ? { label: 'Access rule', value: doc.accessRule } : null,
    doc.bestFor ? { label: 'Best for', value: doc.bestFor } : null,
    doc.runtimeMode ? { label: 'Runtime mode', value: doc.runtimeMode } : null,
  ].filter(Boolean);

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
              <span class="page-sidebar-link-state">${pageKey === key ? 'Now' : 'Open'}</span>
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
            <strong>PRISM Screens</strong>
            <span>App-like screen navigation</span>
          </div>
        </div>
        ${sidebarHtml}
      </aside>

      <div class="page-doc-main">
        <section class="hero">
          <div class="hero-premium page-doc-hero glass-strong nexus-glow" style="text-align:left;">
            <p class="eyebrow">Documentation</p>
            <h1 style="margin-top:.35rem; font-size:clamp(1.55rem,2.5vw,2.15rem);">${escapeHtml(doc.title)}</h1>
            <p class="subtitle" style="margin-top:.35rem;">${escapeHtml(doc.subtitle)}</p>
            <p>${escapeHtml(doc.purpose)}</p>
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
          </div>
        </section>

        <section class="section primary" id="guide">
          <h2>Operational Guide</h2>
          <div class="doc-intro-grid">
            <article class="glass">
              <h3>Who should use it</h3>
              <ul>${list(audience)}</ul>
            </article>
            <article class="glass">
              <h3>What success looks like</h3>
              <ul>${list(expected)}</ul>
            </article>
          </div>
          ${prerequisites.length ? `
            <div class="doc-callout info">
              <h3>Before you open this screen</h3>
              <ul>${list(prerequisites)}</ul>
            </div>
          ` : ''}
          ${doc.guideHtml || ''}
          ${artifacts.length ? `
            <div class="doc-callout accent">
              <h3>Files and artifacts created here</h3>
              <ul>${list(artifacts)}</ul>
            </div>
          ` : ''}
        </section>

        <section class="section" id="api">
          <h2>Connected services and topics</h2>
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
            <h3>Related pages</h3>
            <ul>${list(relatedPages)}</ul>
          ` : ''}
        </section>

        <section class="section" id="tech">
          <h2>Technical structure</h2>
          <div class="kv">${kv}</div>
          ${topFeatures.length ? `
            <h3>Capabilities</h3>
            <div class="cap-grid">
              ${topFeatures.map((v) => `<article class="cap-card"><p>${escapeHtml(v)}</p></article>`).join('')}
            </div>
          ` : ''}
          ${flow.length ? `
            <h3>Typical flow summary</h3>
            <ol class="ordered">${flow.map((v) => `<li>${escapeHtml(v)}</li>`).join('')}</ol>
          ` : ''}
        </section>

        <section class="section" id="io">
          <h2>Input and output data</h2>
          <div class="grid2">
            <div>
              <h3>Inputs</h3>
              <ul>${list(doc.inputs)}</ul>
            </div>
            <div>
              <h3>Outputs</h3>
              <ul>${list(doc.outputs)}</ul>
            </div>
          </div>
          ${tips.length ? `
            <div class="doc-callout warn">
              <h3>Operational notes and failure modes</h3>
              <ul>${list(tips)}</ul>
            </div>
          ` : ''}
        </section>
      </div>
    </div>
  `;
})();
