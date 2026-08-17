import { chromium } from 'playwright';
import path from 'path';

const projects = [
  { url: 'https://customer-support-agent-hazel.vercel.app/', name: 'aperture' },
  { url: 'https://business-diectory.vercel.app/', name: 'directory' },
  { url: 'https://ecomsite-sand.vercel.app/', name: 'joycart' },
  { url: 'https://flavourz.vercel.app/', name: 'flavourz' }
];

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  for (const proj of projects) {
    console.log(`Taking screenshot for ${proj.name}...`);
    try {
      await page.goto(proj.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(3000); // Wait for initial animations
      const outPath = path.join(process.cwd(), 'public', 'assets', 'project', 'previews', `${proj.name}.png`);
      await page.screenshot({ path: outPath, type: 'png' });
      console.log(`Saved ${proj.name}.png`);
    } catch (e) {
      console.error(`Failed to screenshot ${proj.name}`, e);
    }
  }

  await browser.close();
}

run().catch(console.error);
