(function () {
  const key = document.body.dataset.page;
  const doc = window.PAGE_DOCS && window.PAGE_DOCS[key];
  const root = document.getElementById('docRoot');
  if (!doc || !root) return;

  const list = (arr) => (arr || []).map((v) => `<li>${v}</li>`).join('');
  const kv = Object.entries(doc.tech || {})
    .map(([k, v]) => `<div class="k">${k}</div><div class="v">${v}</div>`)
    .join('');

  const audience = doc.audience || ['Platform operator', 'Dataset owner', 'Model experiment owner'];
  const flow = doc.userFlow || doc.checklist || [];
  const tips = doc.userTips || doc.failureModes || [];
  const expected = doc.expectedResult || doc.outputs || [];
  const topFeatures = (doc.features || []).slice(0, 4);

  root.innerHTML = `
    <section class="hero">
      <div class="hero-premium" style="text-align:left;">
        <div class="logo-row" style="justify-content:flex-start; margin-top:0;">
          <img src="../assets/images/logo_nexus.png" alt="PRISM" style="height:40px; opacity:1;" />
        </div>
        <h1 style="margin-top:.35rem; font-size:clamp(1.45rem,2.4vw,2rem);">${doc.title}</h1>
        <p class="subtitle" style="margin-top:.35rem;">${doc.subtitle}</p>
        <p>${doc.purpose}</p>
      </div>
    </section>

    <section class="section primary" id="guide">
      <h2>How to use this screen</h2>
      <h3>Who uses it</h3>
      <ul>${list(audience)}</ul>
      <h3>Typical flow</h3>
      <ol class="ordered">${(flow || []).map((v) => `<li>${v}</li>`).join('')}</ol>
      <h3>What you can do here</h3>
      <div class="cap-grid">${topFeatures.map((v) => `<article class="cap-card"><p>${v}</p></article>`).join('')}</div>
      <h3>Expected outcome</h3>
      <ul>${list(expected)}</ul>
      <h3>Operational notes</h3>
      <ul>${list(tips)}</ul>
    </section>

    <section class="section" id="api">
      <h2>Connected services and topics</h2>
      <h3>ROS Services</h3>
      <ul>${list(doc.services)}</ul>
      <h3>ROS Topics</h3>
      <ul>${list(doc.topics)}</ul>
    </section>

    <section class="section" id="tech">
      <h2>Technical structure</h2>
      <div class="kv">${kv}</div>
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
    </section>
  `;
})();
