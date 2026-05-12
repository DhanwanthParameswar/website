/**
 * Visual parity helper for the Contact section.
 * Captures local + Framer at desktop and mobile widths into ./tmp/.
 *
 * Usage:
 *   node scripts/screenshot-contact.mjs
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const LOCAL = process.env.LOCAL_URL ?? 'http://localhost:4322/#contact';
const FRAMER = process.env.FRAMER_URL ?? 'https://www.dhanwanth.com/#contact';

const VIEWPORTS = [
	{ name: 'desktop', width: 1440, height: 900 },
	{ name: 'mobile', width: 390, height: 844 },
];

mkdirSync('tmp', { recursive: true });

const browser = await chromium.launch();
try {
	for (const vp of VIEWPORTS) {
		const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
		for (const [label, url] of [
			['local', LOCAL],
			['framer', FRAMER],
		]) {
			const page = await ctx.newPage();
			await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
			const target = page.locator('#contact');
			await target.waitFor({ state: 'visible', timeout: 30_000 });
			await target.scrollIntoViewIfNeeded();
			await page.waitForTimeout(800);
			const path = `tmp/contact-${label}-${vp.name}.png`;
			await target.screenshot({ path });
			console.log(`✓ wrote ${path}`);
			await page.close();
		}
		await ctx.close();
	}
} finally {
	await browser.close();
}
