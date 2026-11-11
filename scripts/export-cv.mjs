// Prints the /cv page to public/mohsen_ghaemmaghami-cv.pdf. Needs `pnpm vite preview --port 4173` running.
import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:4173/cv');
await page.waitForSelector('h1');
await page.emulateMedia({ media: 'print' });
await page.pdf({ path: 'public/mohsen_ghaemmaghami-cv.pdf', format: 'A4', printBackground: false, margin: { top: '16mm', bottom: '16mm', left: '16mm', right: '16mm' } });
await browser.close(); console.log('cv pdf written');
