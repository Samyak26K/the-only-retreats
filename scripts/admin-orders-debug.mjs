/**
 * Focused Orders mouse-click debug against localhost admin.
 */
import { chromium } from "playwright";
import { clerk, clerkSetup } from "@clerk/testing/playwright";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

async function getAdminEmail() {
  const userId = process.env.DEV_ADMIN_CLERK_USER_ID?.trim();
  const secret = process.env.CLERK_SECRET_KEY?.trim();
  const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const user = await response.json();
  return user.email_addresses?.[0]?.email_address;
}

async function main() {
  await clerkSetup();
  const email = await getAdminEmail();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const logs = [];
  page.on("console", (msg) => logs.push(`[console:${msg.type()}] ${msg.text()}`));
  page.on("pageerror", (err) => logs.push(`[pageerror] ${err.message}`));
  page.on("framenavigated", (frame) => {
    if (frame === page.mainFrame()) logs.push(`[nav] ${frame.url()}`);
  });
  page.on("request", (req) => {
    if (req.url().includes("/admin")) logs.push(`[req] ${req.method()} ${req.url()}`);
  });

  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 120000 });
  await clerk.signIn({ page, emailAddress: email });
  await page.goto(`${BASE}/admin`, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForSelector('aside a[href="/admin/orders"]', { timeout: 60000 });

  const link = page.locator('aside a[href="/admin/orders"]').first();
  const rect = await link.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
  });

  await page.evaluate(({ x, y }) => {
    const el = document.elementFromPoint(x, y);
    el?.addEventListener(
      "click",
      (e) => {
        window.__ordersClick = {
          defaultPrevented: e.defaultPrevented,
          target: e.target?.tagName,
          currentTarget: e.currentTarget?.tagName,
          href: e.currentTarget?.getAttribute?.("href"),
        };
      },
      true,
    );
  }, rect);

  console.log("Clicking Orders at", rect);
  await page.mouse.click(rect.x, rect.y);
  await page.waitForTimeout(3000);
  const clickMeta = await page.evaluate(() => window.__ordersClick || null);
  console.log("URL after click:", page.url());
  console.log("Click meta:", clickMeta);
  console.log("Logs:\n" + logs.slice(-40).join("\n"));

  // Direct navigation control
  await page.goto(`${BASE}/admin/orders`, { waitUntil: "domcontentloaded", timeout: 120000 });
  console.log("Direct goto /admin/orders =>", page.url());
  const title = await page.locator("h1, h2").first().textContent().catch(() => null);
  console.log("Heading:", title);

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
