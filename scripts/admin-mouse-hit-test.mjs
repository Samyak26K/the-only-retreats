/**
 * Real-coordinate Playwright mouse hit-tests for the admin panel.
 * Uses page.mouse.click(x, y) only — never locator.click() / element.click().
 */
import { chromium } from "playwright";
import { clerk, clerkSetup } from "@clerk/testing/playwright";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

dotenv.config({ path: ".env.local" });
dotenv.config();

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const OUT_DIR = path.resolve("docs/design-review");
const OUT_FILE = path.join(
  OUT_DIR,
  `admin-mouse-hit-test-${process.env.HIT_TEST_PHASE || "current"}.json`,
);
const NAV_TIMEOUT_MS = Number(process.env.HIT_TEST_NAV_TIMEOUT_MS || 120000);

async function getAdminEmail() {
  const userId = process.env.DEV_ADMIN_CLERK_USER_ID?.trim();
  const secret = process.env.CLERK_SECRET_KEY?.trim();
  const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const user = await response.json();
  const email = user.email_addresses?.[0]?.email_address;
  if (!email) {
    throw new Error("Could not resolve admin email from Clerk");
  }
  return email;
}

async function inspectAtPoint(page, x, y) {
  return page.evaluate(
    ({ x, y }) => {
      const top = document.elementFromPoint(x, y);
      const stack = document.elementsFromPoint(x, y).slice(0, 12).map((el) => {
        const cs = getComputedStyle(el);
        return {
          tag: el.tagName,
          id: el.id || null,
          className:
            typeof el.className === "string" ? el.className.slice(0, 160) : null,
          href: el.getAttribute?.("href") || null,
          text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 60),
          pointerEvents: cs.pointerEvents,
          position: cs.position,
          zIndex: cs.zIndex,
        };
      });
      const cs = top ? getComputedStyle(top) : null;
      return {
        top: top
          ? {
              tag: top.tagName,
              id: top.id || null,
              className:
                typeof top.className === "string"
                  ? top.className.slice(0, 160)
                  : null,
              href: top.getAttribute?.("href") || null,
              text: (top.textContent || "")
                .trim()
                .replace(/\s+/g, " ")
                .slice(0, 80),
              pointerEvents: cs.pointerEvents,
              position: cs.position,
              zIndex: cs.zIndex,
            }
          : null,
        stack,
      };
    },
    { x, y },
  );
}

async function hitTestControl(page, control) {
  const locator = page.locator(control.selector).first();
  const count = await locator.count();
  if (!count) {
    return {
      control: control.name,
      found: false,
      error: `Selector not found: ${control.selector}`,
    };
  }

  await locator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);

  const rect = await locator.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return {
      x: r.x,
      y: r.y,
      width: r.width,
      height: r.height,
      top: r.top,
      left: r.left,
      right: r.right,
      bottom: r.bottom,
    };
  });

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const viewport = await page.evaluate(() => ({
    w: window.innerWidth,
    h: window.innerHeight,
  }));
  const inViewport =
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < viewport.h &&
    rect.left < viewport.w &&
    rect.width > 0 &&
    rect.height > 0;

  const beforeUrl = page.url();
  const beforeInspect = await inspectAtPoint(page, centerX, centerY);

  // Probe the visual sidebar column (x≈200). When the aside is flex-crushed,
  // this coordinate hits overlapping main content instead of the nav link.
  const visualProbeX = 200;
  const visualProbe = await inspectAtPoint(page, visualProbeX, centerY);
  const asideMetrics = await page.evaluate(() => {
    const aside = document.querySelector("aside");
    if (!aside) return null;
    const r = aside.getBoundingClientRect();
    return {
      width: r.width,
      left: r.left,
      right: r.right,
      className: aside.className,
    };
  });

  const expectedHit = await locator.evaluate((el, point) => {
    const top = document.elementFromPoint(point.x, point.y);
    const interactive =
      top?.closest?.("a,button,[data-slot='button']") || null;
    return {
      expectedTag: el.tagName,
      expectedHref: el.getAttribute("href"),
      expectedText: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
      isSelfOrChild: !!(top && (top === el || el.contains(top))),
      interactiveHref: interactive?.getAttribute?.("href") || null,
      interactiveTag: interactive?.tagName || null,
      interactiveText: interactive
        ? (interactive.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80)
        : null,
    };
  }, { x: centerX, y: centerY });

  // Capture the real DOM node that receives the pointerdown from the physical mouse.
  await page.evaluate(({ x, y }) => {
    window.__lastPointerReceiver = null;
    const handler = (event) => {
      const el = event.target;
      const interactive = el?.closest?.("a,button,[data-slot='button']") || el;
      window.__lastPointerReceiver = {
        eventType: event.type,
        targetTag: el?.tagName || null,
        targetHref: el?.getAttribute?.("href") || null,
        targetText: (el?.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
        interactiveTag: interactive?.tagName || null,
        interactiveHref: interactive?.getAttribute?.("href") || null,
        interactiveText: interactive
          ? (interactive.textContent || "")
              .trim()
              .replace(/\s+/g, " ")
              .slice(0, 80)
          : null,
        clientX: event.clientX,
        clientY: event.clientY,
      };
      document.removeEventListener("pointerdown", handler, true);
    };
    document.addEventListener("pointerdown", handler, true);
    // Keep point for debugging.
    window.__lastClickPoint = { x, y };
  }, { x: centerX, y: centerY });

  const expectedPath = expectedHit.expectedHref || control.expectPath || null;
  const navPromise = expectedPath
    ? page
        .waitForURL(
          (url) => {
            try {
              const u = new URL(url.toString());
              return (
                u.pathname === expectedPath ||
                u.pathname.startsWith(`${expectedPath}/`)
              );
            } catch {
              return false;
            }
          },
          { timeout: NAV_TIMEOUT_MS },
        )
        .then(() => true)
        .catch(() => false)
    : page
        .waitForURL((url) => url.toString() !== beforeUrl, {
          timeout: NAV_TIMEOUT_MS,
        })
        .then(() => true)
        .catch(() => false);

  const t0 = Date.now();
  await page.mouse.click(centerX, centerY);
  const navigated = await navPromise;
  try {
    await page.waitForLoadState("domcontentloaded", { timeout: 30000 });
  } catch {
    // ignore
  }
  const t1 = Date.now();
  const afterUrl = page.url();

  let pointerReceiver = null;
  try {
    pointerReceiver = await page.evaluate(() => window.__lastPointerReceiver);
  } catch {
    pointerReceiver = {
      note: "Lost after navigation (context destroyed) — navigation occurred",
    };
  }

  return {
    control: control.name,
    found: true,
    selector: control.selector,
    boundingClientRect: rect,
    center: { x: centerX, y: centerY },
    viewport,
    inViewport,
    elementFromPoint: beforeInspect.top,
    elementsFromPoint: beforeInspect.stack,
    asideMetrics,
    visualSidebarProbe: {
      x: visualProbeX,
      y: centerY,
      elementFromPoint: visualProbe.top,
      elementsFromPoint: visualProbe.stack,
      hitsExpectedControl: !!(
        visualProbe.top &&
        ((expectedHit.expectedHref &&
          visualProbe.top.href === expectedHit.expectedHref) ||
          (visualProbe.top.text || "").includes(control.name))
      ),
    },
    expected: expectedHit,
    pointerEventReceiver: pointerReceiver,
    physicalHitMatchesControl: expectedHit.isSelfOrChild,
    interceptor: expectedHit.isSelfOrChild ? null : beforeInspect.top,
    beforeUrl,
    afterUrl,
    navigationStarted: navigated || afterUrl !== beforeUrl,
    finalUrl: afterUrl,
    clickToUrlMs: t1 - t0,
  };
}

const NAV_CONTROLS = [
  { name: "Products", selector: 'aside a[href="/admin/products"]', expectPath: "/admin/products" },
  { name: "Origins", selector: 'aside a[href="/admin/origins"]', expectPath: "/admin/origins" },
  { name: "Inventory", selector: 'aside a[href="/admin/inventory"]', expectPath: "/admin/inventory" },
  { name: "Orders", selector: 'aside a[href="/admin/orders"]', expectPath: "/admin/orders" },
  { name: "Customers", selector: 'aside a[href="/admin/customers"]', expectPath: "/admin/customers" },
  { name: "Content", selector: 'aside a[href="/admin/content"]', expectPath: "/admin/content" },
  { name: "Settings", selector: 'aside a[href="/admin/settings"]', expectPath: "/admin/settings" },
];

async function ensureAdminShell(page, path = "/admin") {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await page.goto(`${BASE}${path}`, {
        waitUntil: "domcontentloaded",
        timeout: 180000,
      });
      await page.waitForSelector('aside a[href="/admin/origins"]', {
        timeout: 90000,
      });
      return;
    } catch (error) {
      lastError = error;
      console.warn(
        `ensureAdminShell(${path}) attempt ${attempt} failed: ${error.message}`,
      );
      await page.waitForTimeout(2000 * attempt);
    }
  }
  throw lastError;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log("clerkSetup...");
  await clerkSetup();

  const email = await getAdminEmail();
  console.log("Signing in as configured admin...");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });

  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 180000 });
  await clerk.signIn({
    page,
    emailAddress: email,
  });

  await ensureAdminShell(page);
  console.log("Admin shell visible at", page.url());

  const results = {
    phase: process.env.HIT_TEST_PHASE || "current",
    startedAt: new Date().toISOString(),
    baseUrl: BASE,
    viewport: { width: 1440, height: 1000 },
    navTimeoutMs: NAV_TIMEOUT_MS,
    controls: [],
  };

  // Start from a different route than the target so URL change is meaningful.
  // Prefer a wide-table page (/admin/products) to exercise flex sidebar geometry.
  for (const control of NAV_CONTROLS) {
    const startPath =
      control.expectPath === "/admin/products"
        ? "/admin/origins"
        : "/admin/products";
    await ensureAdminShell(page, startPath);
    await page.waitForSelector(control.selector, { timeout: 60000 });
    const result = await hitTestControl(page, control);
    results.controls.push(result);
    const probeHit = result.visualSidebarProbe?.hitsExpectedControl;
    const asideW = result.asideMetrics?.width;
    console.log(
      `${control.name}: asideW=${asideW?.toFixed?.(1) ?? asideW} inViewport=${result.inViewport} hitCenter=${result.physicalHitMatchesControl} visualX200=${probeHit} interceptor=${result.interceptor?.tag || result.visualSidebarProbe?.elementFromPoint?.tag || "none"} nav=${result.navigationStarted} -> ${result.finalUrl} (${result.clickToUrlMs}ms)`,
    );
  }

  await page.goto(`${BASE}/admin/origins`, {
    waitUntil: "domcontentloaded",
    timeout: 180000,
  });
  await page.waitForTimeout(500);

  const createResult = await hitTestControl(page, {
    name: "Create origin",
    selector:
      'a[href="/admin/origins/new"], [data-slot="button"]:has-text("Create origin")',
    expectPath: "/admin/origins/new",
  });
  results.controls.push(createResult);
  console.log(
    `Create origin: hit=${createResult.physicalHitMatchesControl} nav=${createResult.navigationStarted} -> ${createResult.finalUrl} (${createResult.clickToUrlMs}ms)`,
  );

  await page.goto(`${BASE}/admin/origins`, {
    waitUntil: "domcontentloaded",
    timeout: 180000,
  });
  await page.waitForTimeout(500);

  let editResult = null;
  const editSelectors = [
    'a[href^="/admin/origins/"]:not([href$="/new"])',
    'table a[href^="/admin/origins/"]',
    '[data-slot="button"]:has-text("Edit")',
    'a:has-text("Edit")',
  ];
  for (const selector of editSelectors) {
    if (await page.locator(selector).count()) {
      editResult = await hitTestControl(page, {
        name: "Edit",
        selector,
        expectPath: "/admin/origins/",
      });
      break;
    }
  }
  if (!editResult) {
    editResult = {
      control: "Edit",
      found: false,
      error: "No Edit control present — seed an origin to test Edit",
    };
  }
  results.controls.push(editResult);
  console.log(
    `Edit: found=${editResult.found} hit=${editResult.physicalHitMatchesControl} nav=${editResult.navigationStarted} -> ${editResult.finalUrl || ""} (${editResult.clickToUrlMs || "n/a"}ms)`,
  );

  // Timing Products -> Origins
  await page.goto(`${BASE}/admin/products`, {
    waitUntil: "domcontentloaded",
    timeout: 180000,
  });
  await page.waitForSelector('aside a[href="/admin/origins"]');
  const orect = await page
    .locator('aside a[href="/admin/origins"]')
    .evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
  const timingStart = Date.now();
  const waitNav = page.waitForURL("**/admin/origins", {
    timeout: NAV_TIMEOUT_MS,
  });
  await page.mouse.click(orect.x, orect.y);
  await waitNav;
  try {
    await page.waitForLoadState("domcontentloaded", { timeout: 30000 });
  } catch {
    // ignore
  }
  results.navigationTiming = {
    from: "/admin/products",
    to: "/admin/origins",
    mouseClickToUrlMs: Date.now() - timingStart,
  };
  console.log(
    `Timing Products->Origins: ${results.navigationTiming.mouseClickToUrlMs}ms`,
  );

  fs.writeFileSync(OUT_FILE, JSON.stringify(results, null, 2));
  console.log("Wrote", OUT_FILE);

  const failures = results.controls.filter((c) => {
    if (!c.found) return true;
    if (!c.physicalHitMatchesControl) return true;
    if (!c.navigationStarted) return true;
    return false;
  });

  console.log(
    JSON.stringify(
      {
        phase: results.phase,
        total: results.controls.length,
        pass: results.controls.length - failures.length,
        fail: failures.length,
        failures: failures.map((f) => ({
          name: f.control,
          found: f.found,
          inViewport: f.inViewport,
          hit: f.physicalHitMatchesControl,
          nav: f.navigationStarted,
          interceptor: f.interceptor,
          pointerEventReceiver: f.pointerEventReceiver,
          asideHint: f.boundingClientRect,
          finalUrl: f.finalUrl,
        })),
        timingMs: results.navigationTiming?.mouseClickToUrlMs,
      },
      null,
      2,
    ),
  );

  await browser.close();
  process.exit(failures.length ? 2 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
