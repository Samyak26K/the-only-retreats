import { chromium } from "playwright";
import { clerk, clerkSetup } from "@clerk/testing/playwright";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const BASE = "http://localhost:3000";

async function getEmail() {
  const userId = process.env.DEV_ADMIN_CLERK_USER_ID.trim();
  const secret = process.env.CLERK_SECRET_KEY.trim();
  const user = await (
    await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: { Authorization: `Bearer ${secret}` },
    })
  ).json();
  return user.email_addresses[0].email_address;
}

async function main() {
  await clerkSetup();
  const email = await getEmail();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 120000 });
  await clerk.signIn({ page, emailAddress: email });

  for (const path of ["/admin", "/admin/products", "/admin/origins"]) {
    await page.goto(`${BASE}${path}`, {
      waitUntil: "domcontentloaded",
      timeout: 180000,
    });
    await page.waitForSelector('aside a[href="/admin/origins"]', {
      timeout: 180000,
    });
    const metrics = await page.evaluate(() => {
      const aside = document.querySelector("aside");
      const link = document.querySelector('aside a[href="/admin/origins"]');
      const ar = aside.getBoundingClientRect();
      const lr = link.getBoundingClientRect();
      const y = lr.top + lr.height / 2;
      const probe = (x) =>
        document.elementsFromPoint(x, y).slice(0, 8).map((el) => ({
          tag: el.tagName,
          href: el.getAttribute?.("href"),
          text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40),
          cls: (el.className || "").toString().slice(0, 100),
        }));
      return {
        path: location.pathname,
        aside: {
          width: ar.width,
          left: ar.left,
          right: ar.right,
          className: aside.className,
        },
        link: lr,
        probe120: probe(120),
        probe200: probe(200),
        probeCenter: probe(lr.left + lr.width / 2),
        mains: [...document.querySelectorAll("main")].map((el) => ({
          id: el.id,
          className: el.className,
          width: el.getBoundingClientRect().width,
        })),
        hasShrink0: aside.className.includes("shrink-0"),
        hasMinW0: !!document.querySelector(".min-w-0"),
        nestedButtons: [...document.querySelectorAll("a button, a [data-slot='button']")]
          .slice(0, 5)
          .map((el) => ({
            parentHref: el.closest("a")?.getAttribute("href"),
            text: (el.textContent || "").trim().slice(0, 40),
            tag: el.tagName,
          })),
      };
    });
    console.log(JSON.stringify(metrics, null, 2));
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
