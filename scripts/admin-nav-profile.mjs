/**
 * Profile admin navigation with ADMIN_DEV_TIMING=1 on the server.
 * Uses real Clerk testing auth + soft navigations via Playwright.
 */
import { chromium } from "playwright";
import { clerk, clerkSetup } from "@clerk/testing/playwright";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

dotenv.config({ path: ".env.local" });
dotenv.config();

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const OUT = path.resolve(
  "docs/design-review",
  `admin-nav-profile-${process.env.HIT_TEST_PHASE || "current"}.json`,
);

const ROUTES = [
  { name: "Products", path: "/admin/products" },
  { name: "Origins", path: "/admin/origins" },
  { name: "Inventory", path: "/admin/inventory" },
  { name: "Customers", path: "/admin/customers" },
  { name: "Create origin", path: "/admin/origins/new" },
];

async function getAdminEmail() {
  const userId = process.env.DEV_ADMIN_CLERK_USER_ID?.trim();
  const secret = process.env.CLERK_SECRET_KEY?.trim();
  const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const user = await response.json();
  return user.email_addresses?.[0]?.email_address;
}

async function measureGoto(page, routePath) {
  const started = Date.now();
  const responsePromise = page.waitForResponse(
    (res) =>
      res.url().includes(routePath) &&
      res.request().resourceType() === "document",
    { timeout: 120000 },
  ).catch(() => null);

  await page.goto(`${BASE}${routePath}`, {
    waitUntil: "domcontentloaded",
    timeout: 180000,
  });
  const response = await responsePromise;
  const serverTiming = response?.headers()?.["server-timing"] || null;
  await page.waitForSelector("aside a[href='/admin/origins']", {
    timeout: 60000,
  });
  return {
    path: routePath,
    clientMs: Date.now() - started,
    status: response?.status?.() ?? null,
    serverTiming,
  };
}

async function measureMouseNav(page, fromPath, linkSelector, expectPath) {
  await page.goto(`${BASE}${fromPath}`, {
    waitUntil: "domcontentloaded",
    timeout: 180000,
  });
  await page.waitForSelector(linkSelector, { timeout: 60000 });
  const point = await page.locator(linkSelector).first().evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  const started = Date.now();
  await Promise.all([
    page.waitForURL((url) => new URL(url).pathname.startsWith(expectPath), {
      timeout: 120000,
    }),
    page.mouse.click(point.x, point.y),
  ]);
  await page.waitForLoadState("domcontentloaded").catch(() => null);
  return {
    from: fromPath,
    to: expectPath,
    mouseClickToUrlMs: Date.now() - started,
    finalUrl: page.url(),
  };
}

async function main() {
  await clerkSetup();
  const email = await getAdminEmail();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 180000 });
  await clerk.signIn({ page, emailAddress: email });

  // Warm
  await measureGoto(page, "/admin");

  const results = {
    phase: process.env.HIT_TEST_PHASE || "current",
    startedAt: new Date().toISOString(),
    routes: [],
    mouseNav: [],
  };

  for (const route of ROUTES) {
    const measurement = await measureGoto(page, route.path);
    results.routes.push({ name: route.name, ...measurement });
    console.log(`${route.name}: ${measurement.clientMs}ms`);
  }

  // Edit origin: resolve an id from the origins table
  await page.goto(`${BASE}/admin/origins`, {
    waitUntil: "domcontentloaded",
    timeout: 180000,
  });
  const editHref = await page
    .locator('a[href^="/admin/origins/"]:not([href$="/new"])')
    .first()
    .getAttribute("href")
    .catch(() => null);
  if (editHref) {
    const edit = await measureGoto(page, editHref);
    results.routes.push({ name: "Edit origin", ...edit });
    console.log(`Edit origin: ${edit.clientMs}ms`);
  }

  results.mouseNav.push(
    await measureMouseNav(
      page,
      "/admin/products",
      'aside a[href="/admin/origins"]',
      "/admin/origins",
    ),
  );
  results.mouseNav.push(
    await measureMouseNav(
      page,
      "/admin/origins",
      'aside a[href="/admin/inventory"]',
      "/admin/inventory",
    ),
  );
  results.mouseNav.push(
    await measureMouseNav(
      page,
      "/admin/origins",
      'a[href="/admin/origins/new"], [data-slot="button"]:has-text("Create origin")',
      "/admin/origins/new",
    ),
  );

  for (const nav of results.mouseNav) {
    console.log(
      `mouse ${nav.from} -> ${nav.to}: ${nav.mouseClickToUrlMs}ms`,
    );
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(results, null, 2));
  console.log("Wrote", OUT);
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
