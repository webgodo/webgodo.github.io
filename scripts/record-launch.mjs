// Records the homepage (attract → takeover → Konami win) as PNG frames for the launch GIF. Needs `pnpm vite preview --port 4173` running.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const out = process.argv[2]; fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 720 }, deviceScaleFactor: 1 });
await page.goto('http://localhost:4173/');
await page.waitForTimeout(800);
let i = 0; const frames = [];
const snap = async () => { const b = await page.screenshot({ type: 'png' }); fs.writeFileSync(`${out}/f${String(i++).padStart(4, '0')}.png`, b); };
const rec = async (ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { await snap(); await page.waitForTimeout(60); } };
await rec(6500);                                   // attract mode demo
const c = page.locator('canvas.game__canvas'); const box = await c.boundingBox();
await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);   // take over
await rec(400);
// play: sweep the paddle a bit
for (let k = 0; k < 10; k++) { await page.mouse.move(box.x + box.width * (0.2 + 0.6 * (k % 2)), box.y + box.height - 20, { steps: 6 }); await rec(260); }
for (const key of ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']) await page.keyboard.press(key);
await rec(3200);                                   // win overlay + revealed job card
await browser.close(); console.log('frames', i);
