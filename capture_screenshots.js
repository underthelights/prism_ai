const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const APP_URL = 'http://10.4.54.193:3000';
const ASSETS_DIR = path.join(__dirname, 'content', 'assets');
const wait = (ms) => new Promise(r => setTimeout(r, ms));

// sidebar label → markdown page name mapping
const pages = [
  { label: 'Home',        mdName: 'home' },
  { label: 'Devices',     mdName: 'devices' },
  { label: 'Record',      mdName: 'record' },
  { label: 'Training',    mdName: 'training' },
  { label: 'Inference',   mdName: 'inference' },
  { label: 'Calibration', mdName: 'calib' },
  { label: 'Kinematics',  mdName: 'kinematics' },
  { label: 'Data Tools',  mdName: 'datatools' },
  { label: 'Visualize',   mdName: 'visualize' },
  { label: 'Detection',   mdName: 'detection' },
  { label: 'SAM2',        mdName: 'sam2' },
  { label: 'Subtask',     mdName: 'subgoal' },
  { label: 'Augment',     mdName: 'augment' },
  { label: 'GraspPose',   mdName: 'foundationpose' },
  { label: 'Steering',    mdName: 'steering' },
  { label: 'RT-SAM',      mdName: 'rtsam' },
  { label: 'Custom VLA',  mdName: 'connect' },
  { label: 'RAIN',        mdName: 'rain' },
  { label: 'Pri4R',       mdName: 'pri4r' },
  { label: 'Embedding',   mdName: 'embedding' },
];

async function clickSidebarItem(page, label) {
  return await page.evaluate((lbl) => {
    const buttons = document.querySelectorAll('aside button');
    for (const btn of buttons) {
      const spans = btn.querySelectorAll('span');
      for (const span of spans) {
        if (span.textContent.trim() === lbl) {
          btn.click();
          return true;
        }
      }
    }
    return false;
  }, label);
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080'],
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();
  console.log('Loading PRISM app...');
  await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await wait(3000);

  // === Step 0: Capture Home BEFORE robot selection ===
  const homeDir = path.join(ASSETS_DIR, 'home');
  fs.mkdirSync(homeDir, { recursive: true });
  await page.screenshot({ path: path.join(homeDir, 'screenshot.png'), fullPage: false });
  console.log('✓ home');

  // === Step 1: Select a robot card and Launch PRISM ===
  console.log('Selecting robot and launching...');
  // Click the first robot card (buttons contain robot emoji + name like "BG2 Rev4")
  const robotSelected = await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('button')].filter(b => b.offsetParent !== null);
    for (const btn of buttons) {
      const text = btn.textContent;
      if (text.includes('Rev4') || text.includes('Rev1') || text.includes('BG2') || text.includes('SG2')) {
        btn.click();
        return text.trim().substring(0, 60);
      }
    }
    return null;
  });

  if (robotSelected) {
    console.log(`  Selected: ${robotSelected}`);
    await wait(1000);

    // Click "Launch PRISM" button
    const launched = await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('button')].filter(b => b.offsetParent !== null);
      for (const btn of buttons) {
        if (btn.textContent.includes('Launch PRISM')) {
          btn.click();
          return true;
        }
      }
      return false;
    });

    if (launched) {
      console.log('  Launched PRISM!');
      await wait(3000);
    } else {
      console.log('  Warning: Launch button not found');
    }
  } else {
    console.log('  Warning: No robot card found, proceeding anyway');
  }

  // === Step 2: Capture each page ===
  for (const { label, mdName } of pages) {
    if (mdName === 'home') continue;

    const dir = path.join(ASSETS_DIR, mdName);
    fs.mkdirSync(dir, { recursive: true });

    try {
      const clicked = await clickSidebarItem(page, label);
      if (!clicked) {
        console.error(`✗ ${mdName}: sidebar button "${label}" not found`);
        continue;
      }
      await wait(2500);
      await page.screenshot({
        path: path.join(dir, 'screenshot.png'),
        fullPage: false
      });
      console.log(`✓ ${mdName}`);
    } catch (err) {
      console.error(`✗ ${mdName}: ${err.message}`);
    }
  }

  await browser.close();
  console.log('\nDone! Screenshots saved to content/assets/*/screenshot.png');
})();
