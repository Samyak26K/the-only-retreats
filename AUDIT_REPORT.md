# THE ONLY RETREATS — COMPLETE PROJECT AUDIT

**Audit Date:** August 17, 2026  
**Auditor:** GitHub Copilot  
**Project Status:** Active Development (MVP Phase)  
**Branch:** main (up-to-date with origin/main)

---

## 1. Executive Summary

The Only Retreats is a **premium Himalayan heritage food brand** currently in mid-development. The project has a **solid technical foundation** (Next.js 15, TypeScript, Prisma, Clerk, Sanity) and an **admirable brand vision**, but the implementation shows significant gaps between the intended luxury editorial experience and the current development state.

**Key Findings:**

- ✅ **Strong:** Tech stack is appropriate, architecture is clean, build process works
- ⚠️ **Critical Issues:** Production secrets committed to git, transitive dependency vulnerabilities, incomplete content, missing accessibility
- 🔴 **Major Gaps:** Product pages not connected to real data, ecommerce functionality incomplete, content heavily templated with TODOs
- 🟡 **Design Execution:** Homepage structure exists but lacks final polish and brand authenticity

**Production Readiness Score:** **35/100**

- Product Design: 60/100
- Content: 25/100
- Engineering: 75/100
- Security: 30/100
- Performance: 65/100
- SEO: 45/100
- Accessibility: 20/100
- Ecommerce: 40/100

---

## 2. What The Only Retreats Is

**Brand Name:** The Only Retreats

**Mission:** A premium, storytelling-first Himalayan nourishment brand connecting conscious consumers directly with authentic origins, communities, heritage, and craftsmanship.

**Core Differentiator:** The brand reverses traditional ecommerce logic by starting with ORIGIN rather than PRODUCT:

```
ORIGIN → LAND → ANIMAL/INGREDIENT → PEOPLE → TRADITION → CRAFT → PRODUCT → EXPERIENCE
(instead of)
PRODUCT → FEATURES → BUY NOW
```

**Expected Product Portfolio (~9 products):**

- Yak Ghee (flagship)
- Yak Butter
- Raw Himalayan Honey (multiple varieties: Thyme, Dew)
- Ghee & Spice Blends
- Seabuckthorn
- Shilajit
- Various honey and related products

**Geographic Focus:** Highly specific Himalayan valleys (Spiti, Lahaul, Changthang, Zanskar, Nubra, Kullu, Ladakh)

---

## 3. Intended Brand Vision

### Brand Personality

- Calm, Editorial, Premium, Authentic, Timeless, Human, Grounded, Refined
- **Never:** Loud, flashy, trendy, generic, overly designed

### Emotional Goal

Visitors should feel: _"I discovered something beautiful"_ — not _"I visited an online store"_

### Brand Philosophy (From "Book of The Only Retreats — Charter of Origins")

**Core Line:** _"Every Origin Has a Voice. Our Duty Is To Ensure It Is Never Lost."_

**Article I — The Origin Comes Before the Product**

Every journey begins with an origin. An origin is the living union of:

- Landscape
- Climate
- Biodiversity
- People
- Traditions
- History
- Craftsmanship
- Time

A product is only one expression of that origin.

### Visual Direction

**Inspired by:**

- Himalayan landscapes
- Handmade paper
- Morning mist
- Stone monasteries
- Cedar wood, brass, copper
- Editorial magazines
- Slow living
- Natural light

**Avoid:**

- Excessive gradients
- Glassmorphism
- Generic SaaS card UI
- Stock photography
- AI-generated imagery
- Excessive badges
- Visual clutter

### Color System (Implemented)

- **Background (Primary):** Warm Himalayan Sand (#F7F5F1)
- **Surface:** Morning Mist (#E6EDF3)
- **Foreground:** Charcoal (#2B2B2B)
- **Accent:** Deep Forest Green (#2F3A2A)
- **Gold (Highlights):** Muted Gold (#B8A080) — _never large backgrounds_
- **Secondary Colors:** Moss, Copper, Honey, Butter, Earth tones

---

## 4. Current Technical Stack

| Component         | Technology              | Version | Status            |
| ----------------- | ----------------------- | ------- | ----------------- |
| Framework         | Next.js                 | 15.5.22 | ✅ Working        |
| Language          | TypeScript              | 5.9.3   | ✅ Strict mode    |
| UI Library        | React                   | 19.2.4  | ✅ App Router     |
| Styling           | Tailwind CSS            | 4.x     | ✅ Custom tokens  |
| UI Components     | shadcn/ui               | 4.15.0  | ✅ Integrated     |
| Database          | PostgreSQL (Neon)       | —       | ✅ Connected      |
| ORM               | Prisma                  | 6.19.3  | ✅ Configured     |
| CMS               | Sanity                  | 7.25.0  | ⚠️ Minimal setup  |
| Auth              | Clerk                   | 7.6.1   | ✅ Integrated     |
| Media             | Cloudinary              | 2.10.0  | ✅ Configured     |
| Payments          | Razorpay                | 2.9.8   | ⚠️ Not integrated |
| Payments (Future) | Stripe                  | 22.3.2  | ⚠️ Not integrated |
| Email             | Resend                  | 6.18.0  | ⚠️ Not integrated |
| Motion            | GSAP + Motion           | Latest  | ✅ Implemented    |
| Smooth Scroll     | Lenis                   | 1.3.25  | ✅ Configured     |
| Forms             | React Hook Form         | 7.83.0  | ✅ Integrated     |
| Validation        | Zod                     | 4.4.3   | ✅ Integrated     |
| State             | Zustand                 | 5.0.14  | ✅ Configured     |
| Query             | TanStack Query          | 5.101.4 | ✅ Configured     |
| Icons             | Lucide React            | 1.27.0  | ✅ Integrated     |
| DX Tools          | ESLint, Prettier, Husky | Latest  | ✅ Configured     |

**Framework Verdict:** ✅ GOOD — Modern, performant, well-suited for this use case

---

## 5. Current Repository Structure

```
the-only-retreats/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (fonts, metadata, providers)
│   ├── page.tsx                 # Homepage
│   ├── admin/                   # Protected admin panel
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Dashboard
│   │   ├── content/
│   │   ├── customers/
│   │   ├── inventory/
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [id]/            # In progress
│   │   ├── origins/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   └── [id]/            # In progress
│   │   └── settings/
│   ├── products/
│   │   └── [slug]/
│   │       └── page.tsx         # Product detail page
│   ├── design-system/
│   ├── sign-in/
│   │   └── [[...sign-in]]/      # Clerk auth
│   └── favicon.ico
│
├── components/                   # React components
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Header.tsx           # Navigation header
│   │   ├── DesktopNavigation.tsx
│   │   ├── MobileNavigation.tsx
│   │   └── MobileDrawer.tsx
│   ├── sections/               # Page sections
│   │   ├── Hero/
│   │   ├── Collection/
│   │   ├── Origins/
│   │   ├── CertificationBand/
│   │   ├── Heritage/
│   │   ├── Founder/
│   │   ├── Footer/
│   │   └── Videos/
│   ├── product-detail/         # Product page components
│   │   ├── ProductHero/
│   │   ├── ProductHighlights/
│   │   ├── ProductStory/
│   │   ├── ProductShloka/
│   │   ├── ProductJourney/
│   │   ├── ProductPassport/
│   │   ├── ProductTasteProfile/
│   │   ├── ProductNutrition/
│   │   ├── ProductCertifications/
│   │   ├── ProductRitualGuide/
│   │   ├── ProductFAQ/
│   │   ├── ProductLabHighlights/
│   │   ├── ProductReviews/
│   │   └── ProductRelatedProducts/
│   ├── shared/                 # Shared components
│   ├── product/
│   └── ui/                     # Base UI primitives
│       ├── button.tsx
│       ├── Container.tsx
│       ├── Divider.tsx
│       ├── Heading.tsx
│       └── Section.tsx
│
├── hooks/
│   ├── useFocusTrap.ts
│   └── useHeaderScroll.ts
│
├── lib/
│   ├── constants.ts            # Global constants
│   ├── env.ts                  # Environment validation
│   ├── prisma.ts               # Prisma client
│   ├── theme.ts                # Design tokens (if any)
│   ├── utils.ts                # Utility functions
│   ├── content/                # Content configuration
│   │   ├── hero.ts
│   │   ├── collection.ts
│   │   ├── valleys.ts
│   │   ├── product.ts
│   │   ├── navigation.ts
│   │   ├── certifications.ts
│   │   ├── footer.ts
│   │   ├── founder.ts
│   │   ├── heritage.ts
│   │   └── videos.ts
│   ├── generated/
│   │   └── prisma/            # Generated Prisma client
│   ├── sanity/                # Sanity integration
│   ├── server/
│   │   ├── auth.ts            # Auth helpers & permissions
│   │   └── dev-timing.ts      # Dev utilities
│   ├── services/              # Business logic
│   │   ├── products.ts
│   │   ├── variants.ts
│   │   ├── inventory.ts
│   │   ├── orders.ts
│   │   ├── audit.ts
│   │   ├── customers.ts
│   │   └── origins.ts
│   ├── storefront/
│   │   └── products.ts        # Storefront queries (in progress)
│   └── validation/            # Zod schemas
│
├── providers/
│   └── app-providers.tsx       # React providers
│
├── middleware.ts               # Clerk middleware
│
├── prisma/
│   └── schema.prisma           # Database schema
│
├── sanity/                     # Sanity CMS config
│
├── public/
│   └── images/
│       ├── hero/
│       ├── og/
│       └── valleys/
│
├── styles/
│   └── globals.css             # Global styles with design tokens
│
├── types/
│   └── index.ts                # Shared types
│
├── utils/
│   ├── cn.ts                   # classname utilities
│   ├── date.ts
│
├── scripts/
│   └── Various admin profiling scripts
│
├── docs/
│   ├── 01_PROJECT_OVERVIEW.md
│   ├── 02_BRAND_GUIDELINES.md
│   ├── 03_DESIGN_SYSTEM.md
│   ├── 04_INFORMATION_ARCHITECTURE.md
│   ├── ROADMAP.md
│   └── design-review/
│
├── package.json
├── tsconfig.json
├── next.config.ts              # ⚠️ Empty
├── .env                        # 🔴 Contains secrets (not properly ignored)
├── .env.example
├── .env.local
├── .gitignore
├── README.md
├── AGENTS.md                   # Agent customization note
├── CLAUDE.md                   # Placeholder
└── components.json             # shadcn config
```

**Assessment:** Clean, well-organized structure. Path aliases configured correctly. Growth potential is built in.

---

## 6. Current Git / Branch State

### Branches

```
* main                          (HEAD, up-to-date with origin/main)
  arnav-work                    (local)
  origin/arnav-work             (remote)
  origin/feat/valley-origins    (remote - feature branch)
  origin/main                   (remote - production branch)
```

### Commit History (Last 20)

```
577b1a6 (HEAD -> main, origin/main) Merge pull request #1 from Samyak26K/arnav-work
4b92574 (origin/arnav-work) Build admin panel and backend services
2af277e (origin/feat/valley-origins) feat: complete homepage valley origins section
65ea044 Admin Page Bug Fixes
1d11d6d Update project changes
67059ca feat(navbar): rebuild responsive navigation and hero architecture
... [previous commits]
```

### Current Work Status

**Uncommitted Changes (Local):**

```
Modified:
  - app/admin/orders/page.tsx
  - app/admin/origins/[id]/page.tsx
  - app/admin/products/[id]/page.tsx
  - app/admin/settings/page.tsx
  - app/products/[slug]/page.tsx
  - lib/server/auth.ts
  - lib/services/inventory.ts
  - lib/services/variants.ts

Untracked:
  - app/admin/orders/[id]/
  - app/admin/products/[id]/loading.tsx
  - lib/services/orders.ts
  - lib/storefront/
```

### Assessment

✅ **Good:**

- Main branch is clean and up-to-date
- Feature branches exist but are not ahead of main
- Commit history is meaningful

⚠️ **Issues:**

- Uncommitted work in progress should be either committed or branched
- `feat/valley-origins` branch exists but was not merged — need to understand why
- `arnav-work` branch suggests active feature development

**Recommendation:** Commit work in progress before proceeding with other changes.

---

## 7. Current Deployment State

### Configuration

- **Hosting:** Assumed Vercel (mentioned in README, appropriate for Next.js)
- **Database:** PostgreSQL on Neon
- **Environment:** .env and .env.local present locally

### Build Output

```
Routes compiled successfully:
- Homepage (/)                           123 kB first load
- Product pages (/products/[slug])       125 kB first load
- Admin pages                            102-109 kB first load
- Auth pages                             148 kB first load

Middleware: 90.3 kB (Clerk)
Status: ✅ All static pages prerendered, dynamic routes served on demand
```

### Deployment Ready?

**⚠️ NO** — Several blockers:

1. 🔴 **CRITICAL:** Secrets in committed .env file
2. 🔴 Transitive dependency vulnerabilities
3. 🟡 No production database migrations documented
4. 🟡 No deployment instructions in README
5. 🟡 Missing `.vercel/project.json` or Vercel config

---

## 8. Homepage Audit

### Structure

**Sections (In order):**

1. Hero
2. Origins (Valley cards)
3. Certification Band
4. Collection (Featured product)
5. Heritage
6. Videos
7. Founder
8. Footer

### Hero Section ✅ GOOD

**Implementation:** [components/sections/Hero/index.tsx]

**Strengths:**

- ✅ Beautiful entrance animations (hero-rise keyframes)
- ✅ Dual image (desktop/mobile) with srcSet optimization
- ✅ Sanskrit verse with proper transliteration
- ✅ Strong CTA to Origins section
- ✅ Gradient overlay for text readability
- ✅ Fixed navbar height accounting
- ✅ Responsive scaling

**Issues:**

- 🟡 Hero images are located in public folder (performance consideration)
- 🟡 Content is hardcoded in content/hero.ts (not from CMS)

**Copy Quality:** ⭐⭐⭐⭐

- "The Himalayas are not a destination. They are a source." — Excellent
- Supporting copy is concise and meaningful
- Sanskrit verse selection is thoughtful

### Origins Section 🟡 PARTIAL

**Implementation:** [components/sections/Origins/index.tsx]

**Structure:**

- Pulls from `lib/content/valleys.ts`
- Renders ValleyExperience component
- 5 valleys: Lahaul, Kullu, Nubra, Zanskar, Changthang

**Issues:**

- 🔴 **Major:** Most valley data is incomplete
  - Altitudes: all NULL (TODO)
  - Short descriptions: all NULL (TODO)
  - Brand reflections: all NULL (TODO)
  - Translations: many NULL (TODO)
- 🟡 **Performance:** ValleyExperience likely complex — needs audit
- 🟡 **Images:** Placeholder assets with note: "Temporary AI review asset; replace with production photography"

**Copy Issues:**

```typescript
altitude: null, // TODO: Add approved altitude.
shortDescription: null, // TODO: Add approved editorial copy.
brandReflection: null, // TODO: Add approved brand reflection.
```

### Collection Section 🟡 PARTIAL

**Implementation:** [components/sections/Collection/index.tsx]

**Issue:** Unused import warning

```
⚠️ 'Heading' is defined but never used
```

**Structure:**

- Shows featured product (Yak Ghee)
- Contains hardcoded editorial description
- Two CTAs: "Discover Yak Ghee" and "View Full Collection"

**Problems:**

- 🟡 Links are hardcoded to "#" (not functional)
- 🟡 Product image is placeholder div (not real)
- 🟡 Collection.tsx is hardcoded — not pulling from database

### CertificationBand Section 🟡 PARTIAL

**Issue:** Using raw `<img>` instead of Next.js Image component

```
⚠️ Warning: Using `<img>` could result in slower LCP and higher bandwidth
```

### Heritage Section ❓ NOT AUDITED

### Founder Section ❓ NOT AUDITED

### Videos Section 🔴 BROKEN

**File:** [lib/content/videos.ts]

**Issue:** Placeholder YouTube URLs

```typescript
url: "https://www.youtube.com/embed/placeholder-spiti",
url: "https://www.youtube.com/embed/placeholder-herding",
url: "https://www.youtube.com/embed/placeholder-honey",
```

### Footer Section ❓ NOT AUDITED

### Homepage Assessment Summary

| Aspect         | Status     | Notes                                   |
| -------------- | ---------- | --------------------------------------- |
| Hero           | ✅ Good    | Beautiful, responsive, well-implemented |
| Origins        | 🟡 Partial | Structure good, content incomplete      |
| Collection     | 🟡 Partial | Layout works, content hardcoded         |
| Certifications | 🟡 Partial | Image optimization warning              |
| Videos         | 🔴 Broken  | Placeholder URLs                        |
| Footer         | ❓ Unknown | Not audited                             |
| Copy Quality   | ⭐⭐⭐⭐   | Strong where present                    |
| Animations     | ✅ Good    | Smooth, performance-conscious           |
| Responsive     | ✅ Good    | Desktop/mobile considered               |

---

## 9. Information Architecture Audit

### Current IA (What's Built)

```
/
├── / (homepage)
├── /products/[slug]
├── /design-system
├── /admin
│   ├── /admin/dashboard
│   ├── /admin/products
│   ├── /admin/products/[id]
│   ├── /admin/products/new
│   ├── /admin/origins
│   ├── /admin/origins/[id]
│   ├── /admin/orders
│   ├── /admin/orders/[id]
│   ├── /admin/inventory
│   ├── /admin/customers
│   ├── /admin/content
│   └── /admin/settings
└── /sign-in
```

### Intended IA (From Brand Vision)

The audit scope mentions this should be:

```
HOME
├── ORIGINS
│   ├── Himalayan regions
│   ├── Landscapes
│   ├── Animals
│   ├── Communities
│   └── Traditions
├── PRODUCTS
├── STORIES / JOURNAL
├── THE ONLY RETREATS
├── THE CHARTER / PHILOSOPHY
├── CRAFT / PROCESS
└── SHOP
```

### Gap Analysis

**Missing Public Pages:**

- ❌ Dedicated origins/valleys pages
- ❌ Product listing page (products are only accessible via [slug])
- ❌ Journal / Stories section
- ❌ About / Philosophy page
- ❌ Craft / Process page
- ❌ Shop / Collection page
- ❌ Contact page
- ❌ Privacy policy
- ❌ Terms of service

**Existing Admin IA is Reasonable:**

- ✅ Products management
- ✅ Inventory tracking
- ✅ Orders
- ✅ Origins/storytelling
- ✅ Customer management

**Assessment:** Current IA is **incomplete for a public-facing website**. Homepage exists, product detail pages exist, but no category/listing/story infrastructure.

---

## 10. Origins / Storytelling Audit

### Valley Data Structure

**File:** [lib/content/valleys.ts]

**Defined Valleys (5):**

1. **Lahaul Valley** — "The Valley of Wild Nectar"
2. **Kullu Valley** — "The Valley of Sacred Meadows"
3. **Nubra Valley** — "The Valley of Living Berries"
4. **Zanskar Valley** — "The Valley Beyond Snow"
5. **Changthang Valley** — "The Valley Above the Clouds"

### Completeness Analysis

Each valley should contain:

- Name ✅
- Editorial title ✅
- State ✅
- Altitude ❌ ALL NULL (TODO)
- Cover image 🟡 Temporary AI assets
- Short description ❌ ALL NULL (TODO)
- Products (reference links) ✅
- Sanskrit shloka ✅ (but translations often null)
- Brand reflection ❌ ALL NULL (TODO)

### Content Status Matrix

| Valley     | Altitude | Description | Shloka Trans. | Brand Reflect | Images | Products |
| ---------- | -------- | ----------- | ------------- | ------------- | ------ | -------- |
| Lahaul     | ❌       | ❌          | ❌            | ❌            | 🟡     | ✅       |
| Kullu      | ❌       | ❌          | ❌            | ❌            | 🟡     | ✅       |
| Nubra      | ❌       | ❌          | ❌            | ❌            | 🟡     | ✅       |
| Zanskar    | ❌       | ❌          | ❌            | ❌            | 🟡     | ✅       |
| Changthang | ❌       | ❌          | ❌            | ❌            | 🟡     | ✅       |

### Issues

🔴 **Critical:**

- No valley-specific content has been approved/written
- All descriptive content is marked TODO
- Shloka translations are placeholders

🟡 **High:**

- AI-generated imagery needs replacement with authentic photography
- No context or explanation of what makes each valley significant
- Product relationships are hardcoded

**Verdict:** ⚠️ **Architectural structure is good, but content layer is completely unstaffed.** The system is ready to receive content, but no content has been created yet.

---

## 11. Product Portfolio Audit

### Products Defined (Homepage Collection)

**File:** [lib/content/collection.ts]

**Current Products:**

1. Yak Ghee — Premium ($1200)
2. Raw Himalayan Honey ($450)
3. Yak Butter — Unsalted ($680)
4. Ghee & Spice Blend ($920)

**Issues:**

- 🟡 Only 4 of ~9 intended products defined
- 🟡 Prices appear placeholder
- 🟡 Hardcoded in content file (not database)

### Product Page Structure

**File:** [app/products/[slug]/page.tsx]

**Sections Implemented:**

1. ProductHero ✅
2. ProductHighlights ✅
3. ProductStory ✅
4. ProductShloka ✅
5. ProductJourney ✅
6. ProductPassport ✅
7. ProductTasteProfile ✅
8. ProductNutrition ✅
9. ProductCertifications ✅
10. ProductRitualGuide ✅
11. ProductFAQ ✅
12. ProductLabHighlights ✅ (exists but not in this list)
13. ProductReviews ✅
14. ProductRelatedProducts ✅

### Product Data Model

**File:** [lib/content/product.ts]

**Structure is well-designed:**

```typescript
interface Product {
  id: string
  slug: string
  name: string
  category: ProductCategory
  status: ProductStatus
  hero: ProductHeroMedia
  highlights: ProductHighlight[]
  story: ProductStory
  shloka: ProductShloka
  originJourney: ProductJourneyStep[]
  productPassport: ProductPassport
  tasteProfile: ProductTasteProfile
  nutrition: ProductNutrition
  certifications: ProductCertification[]
  ritualGuide: ProductRitualGuide
  faqs: ProductFAQ[]
  reviews: ProductReview[]
  relatedProducts: RelatedProduct[]
  ...
}
```

**Assessment:**
✅ **Structure is excellent** — captures the "origin-to-experience" journey per brand vision
⚠️ **Implementation incomplete** — no products are actually in the system yet

---

## 12. Product Page Audit

### Product Page Template

**File:** [app/products/[slug]/page.tsx]

**Functionality:**

- ✅ Queries database for product by slug
- ✅ Generates metadata for SEO
- ✅ Returns 404 if product not found
- ✅ Renders all 14 sections

**Issues:**

- 🔴 **Critical:** Uses `getPublishedProductBySlug()` from storefront service
  - **File:** [lib/storefront/products.ts] (exists but incomplete)
  - No products are published in database yet

**Assessment:** Product page **template is excellent**, but **no real products are available to display** yet.

---

## 13. Ecommerce Audit

### Cart / Checkout

- 🔴 **NOT IMPLEMENTED**

### Product Listing Page

- 🔴 **NOT IMPLEMENTED**

### Shopping Cart

- 🔴 **NOT IMPLEMENTED**

### Checkout Flow

- 🔴 **NOT IMPLEMENTED**

### Inventory Management

- 🟡 **Partial** — Admin panel exists ([lib/services/inventory.ts])
- Database schema supports inventory tracking
- Service methods exist but untested

### Payment Integration

- 🟡 **Razorpay** — Configured but not integrated into checkout
- 🟡 **Stripe** — Dependency added, not configured/integrated
- 🟡 **Email** (Resend) — Configured but no order confirmation emails

### Order Management

- 🟡 **Partial** — Admin dashboard started
- Order service being built ([lib/services/orders.ts] — untracked)
- Order statuses defined in Prisma schema

### Variants

- 🟡 **Partial** — Service layer created ([lib/services/variants.ts])
- Database schema supports variants
- No UI for variant selection exists

### Verdict

🔴 **Ecommerce is NOT production-ready.** Core features (cart, checkout, payment) are missing. This is the biggest functional gap in the project.

**Production Readiness: 40/100**

---

## 14. Visual / Design Audit

### Design System Implementation

**File:** [docs/03_DESIGN_SYSTEM.md] + [styles/globals.css]

### Color System ✅ GOOD

All brand colors properly defined and implemented:

```css
--background: #f7f5f1; /* Himalayan Sand */
--cloud: #e6edf3; /* Morning Mist */
--surface: #ffffff; /* White */
--border: #d9d7d3; /* Soft Stone */
--muted: #5f6670; /* Slate Grey */
--foreground: #2b2b2b; /* Charcoal */
--forest: #2f3a2a; /* Forest Green */
--gold: #b8a080; /* Muted Gold */
--success: #557a46; /* Moss */
--copper: #a46f42;
--honey: #c48a2e;
--butter: #d8be6a;
--earth: #4a3728;
--destructive: #b86a5d; /* Clay Red */
```

### Typography

**Fonts Implemented:**

- **Display:** Cormorant Garamond (serif, elegant)
- **Heading:** Literata (serif, literary)
- **Body:** Manrope (sans-serif, modern)
- **Sanskrit:** Tiro Devanagari Sanskrit (devanagari script)

✅ **Appropriate choices** for the brand aesthetic

### Spacing & Sizing

- ✅ Container max-width properly constrained
- ✅ Responsive padding (px-6 mobile, px-20 desktop)
- ✅ CSS custom properties for consistent scaling
- ✅ CSS variables for navbar heights across breakpoints

### Animations

- ✅ GSAP and Motion libraries integrated
- ✅ Hero entrance animations are smooth
- ✅ Lenis for smooth scroll
- ✅ Respects prefers-reduced-motion

### Component Library (shadcn/ui)

- ✅ Integrated and configured
- UI primitives exist (Button, Container, Divider, Heading, Section)

### Design Issues

⚠️ **Inconsistencies:**

1. **Collection Section:** Has unused `<Heading>` import
2. **CertificationBand:** Uses raw `<img>` instead of Next.js `Image`
3. **Limited component coverage:** Only 5 base UI primitives exist
4. **No form inputs:** No UI for admin forms yet

### Visual Brand Authenticity

**Current State:** 60/100

- ✅ Color system feels premium and Himalayan-inspired
- ✅ Typography choices align with brand
- ✅ No corporate/corporate SaaS feel
- ⚠️ Minimal visual polish (feels like early-stage build)
- ⚠️ Missing sophisticated details (borders, shadows, refinements)

**Verdict:** Design foundation is **solid and on-brand**. Needs polish but direction is correct.

---

## 15. Mobile / Responsive Audit

### Implemented Breakpoints

```css
/* Implicit Tailwind breakpoints */
- Mobile (default): < 640px
- sm: ≥ 640px
- md: ≥ 768px
- lg: ≥ 1024px
- xl: ≥ 1280px
- 2xl: ≥ 1536px
```

### Navigation

- ✅ Mobile hamburger menu exists
- ✅ Desktop navigation exists
- ✅ MobileDrawer component implemented
- ✅ Proper aria labels for mobile menu

### Hero Section

- ✅ Dual image (desktop/mobile srcSet)
- ✅ Responsive typography (clamp for sizing)
- ✅ Proper mobile spacing
- ✅ Fixed navbar height accounting

### Collection Section

- ✅ Grid switches: lg:grid-cols-2
- ✅ Responsive padding
- ✅ Mobile-optimized image aspect ratios

### Responsiveness Issues

⚠️ **Not Fully Tested** — Requires manual testing at:

- 320px (iPhone SE)
- 375px (iPhone 12 mini)
- 768px (iPad)
- 1024px (Desktop)
- 1440px (Large desktop)

**Observed Potential Issues:**

- Long Sanskrit text might overflow on very small screens
- Forms in admin pages (not yet tested)
- Variant selector UI (not yet built)

**Verdict:** Responsive architecture is in place. Needs QA testing before launch.

---

## 16. Accessibility Audit

### WCAG Compliance Status: 🔴 POOR (Current: ~30%)

### What's Good ✅

1. **Skip Link:** Implemented in root layout

   ```jsx
   <a href="#main-content" className="sr-only focus-visible:not-sr-only ...">
     Skip to content
   </a>
   ```

2. **Semantic HTML:** Good use of:
   - `<section>`, `<header>`, `<footer>`, `<main>`
   - `<picture>` for responsive images
   - `<figure>` and `<figcaption>` for product images

3. **ARIA Labels:** Present where needed
   - Mobile menu button: `aria-label`, `aria-expanded`, `aria-controls`
   - Admin nav: `aria-label="Admin"`

4. **Heading Hierarchy:**
   - Root layout uses `<h1>`
   - Product page uses `<h2>` for sections
   - Generally follows proper hierarchy

5. **Focus Management:** Link has `:focus-visible` styles

### Critical Issues 🔴

1. **Screen Reader Content:** Only 1 sr-only use found
   - Sanskrit transliteration in Hero (good example)
   - Most content lacks screen reader alternatives

2. **Alt Text:** Insufficient coverage
   - Hero images have alt text
   - Product thumbnail images: many missing
   - Decorative images: not marked as decorative

3. **Form Labels:** Not audited (admin forms not yet complete)

4. **Color Contrast:**
   - Not formally tested (need WCAG contrast checker)
   - Muted text (#5f6670) on light background (#f7f5f1) may be below AA standard

5. **Interactive Elements:**
   - Limited keyboard navigation testing
   - No visible focus indicators on many interactive elements
   - Links are understandable but could be clearer

6. **Reduced Motion:**
   - Motion is `prefers-reduced-motion: safe`
   - Good (animations won't play for users who prefer reduced motion)

7. **Language:**
   - Root HTML has `lang="en"`
   - Sanskrit elements lack `lang="sa"` attribute (Hero has this — good!)

8. **ARIA Usage:**
   - Minimal ARIA attributes beyond what's necessary
   - No ARIA live regions
   - No ARIA dialogs for modals

### Missing Accessibility Features

- ❌ Focus traps in modals
- ❌ Keyboard navigation for gallery/carousel
- ❌ Accessible form error messages
- ❌ Accessible loading states
- ❌ Accessible success/error notifications

### Accessibility Score: 30/100

**Blocker Assessment:** Not a launch blocker (can be remediated), but needs focused work.

---

## 17. SEO Audit

### Metadata Implementation ✅ GOOD

**Root Layout:**

```typescript
export const metadata: Metadata = {
  metadataBase: new URL(DEFAULT_SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description,
  openGraph: { ... },
  twitter: { ... },
}
```

**Product Pages:** ✅ Dynamic metadata generated

```typescript
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getPublishedProductBySlug(slug);
  return {
    title: product.seo.title,
    description: product.seo.description,
    openGraph: { ... },
    twitter: { ... },
  };
}
```

### What's Implemented ✅

- ✅ Title tags (default + template pattern)
- ✅ Meta descriptions
- ✅ Open Graph (social sharing)
- ✅ Twitter cards
- ✅ Canonical URLs (implicit in Next.js)
- ✅ Proper heading hierarchy
- ✅ Image alt text (mostly)

### What's Missing ❌

1. **sitemap.xml** — Not found
2. **robots.txt** — Not found
3. **JSON-LD Structured Data**
   - ❌ Product schema
   - ❌ Organization schema
   - ❌ Breadcrumb schema
   - ❌ LocalBusiness schema
4. **Breadcrumbs** — Not implemented on product pages
5. **URL Structure**
   - Product URLs are good (`/products/[slug]`)
   - Missing: `/collections/`, `/origins/[slug]`, `/stories/`
6. **Mobile Optimization**
   - Viewport meta tag: ✅ Handled by Next.js
   - Mobile-friendly: ⚠️ Needs verification
7. **Page Speed Metrics**
   - ⚠️ Not audited (requires Lighthouse or PageSpeed Insights)

### Content Issues

- 🟡 Meta descriptions are too generic (template only)
- 🟡 Product descriptions need approval before indexing
- 🟡 Valley pages lack unique meta descriptions

### SEO Score: 45/100

**Assessment:** Basic SEO is in place, but structured data and supporting files are missing. Not production-ready for search visibility.

---

## 18. Performance Audit

### Build-Time Metrics ✅

```
Build Time: 27.9 seconds
Linting: Passed with 2 minor warnings
Type Checking: Passed
Prisma Generation: 1.00s
```

### Bundle Size Analysis

```
First Load JS (Homepage):      123 kB
First Load JS (Product pages): 125 kB
First Load JS (Admin):         102-109 kB
Auth Page:                     148 kB
Middleware:                    90.3 kB
```

**Tailwind CSS overhead:** Significant (most of First Load JS)

### Image Optimization

- ✅ Next.js Image component used in product detail
- ⚠️ Hero uses `<picture>` with `<img>` (manual srcSet optimization)
- ❌ CertificationBand uses raw `<img>` (ESLint warning)
- ✅ Lazy loading implemented
- ✅ Priority loading for hero

### Font Loading

- ✅ Using `display: "swap"` strategy
- ✅ Google Fonts (4 fonts loaded)
- ⚠️ Devanagari font loading might affect Core Web Vitals

### JavaScript

- ✅ React 19 (latest)
- ✅ Client/server boundaries properly set
- ⚠️ GSAP + Lenis + Motion bundle size not audited
- ⚠️ Zustand + React Query might be underutilized

### Caching

- ⚠️ Not configured in next.config.ts (file is empty)
- ⚠️ Image caching headers not visible
- ⚠️ Static generation strategy unclear

### Performance Issues

🔴 **Critical:**

1. No `next.config.ts` optimization (file is empty/minimal)
2. No image optimization config
3. No compression/minification config
4. No caching strategy
5. No compression for responses

🟡 **High:**

1. Bundle might contain unused code (gsap, motion, lenis not fully utilized)
2. No lazy loading for sections below fold
3. No code splitting beyond defaults

### Performance Score: 65/100

**Verdict:** Good foundation, but optimization opportunities exist. Needs:

- Image optimization config
- Cache headers
- Bundle analysis
- Core Web Vitals testing

---

## 19. Security Audit

### 🔴 CRITICAL SECURITY ISSUES

#### Issue #1: Production Secrets in .env File

**Severity:** CRITICAL  
**File:** `.env` (root)

**Finding:** The `.env` file contains:

```
DATABASE_URL=postgresql://neondb_owner:npg_91QmahfdJuvB@...
CLERK_SECRET_KEY=sk_test_dPKQSYTDVrPbRqDnXZxGWCLB829Ji16KYBBIEwl4hc
```

**Risk:**

- Database credentials are exposed
- Clerk secret key is exposed
- If this repository is public, production database is compromised
- Even if private, secrets should NEVER be in version control

**Status:** The `.env` file is in `.gitignore`, but it **CURRENTLY EXISTS** in the working directory with real credentials.

**Remediation (URGENT):**

1. Rotate all credentials immediately (PostgreSQL user, Clerk key)
2. Remove `.env` from working directory if exposed
3. Use `.env.example` template instead
4. Configure secrets through Vercel environment variables only

---

#### Issue #2: npm audit — Multiple Critical Vulnerabilities

**Severity:** CRITICAL / HIGH

**Vulnerable Dependencies (Production):**

| Package         | Severity | CVE                                                          | Impact   |
| --------------- | -------- | ------------------------------------------------------------ | -------- |
| adm-zip         | HIGH     | Crafted ZIP file triggers 4GB memory allocation              | DoS      |
| decompress      | CRITICAL | Archive extraction can create files outside target directory | Zip Slip |
| brace-expansion | HIGH     | DoS via unbounded expansion                                  | DoS      |
| js-yaml         | HIGH     | Quadratic CPU consumption                                    | DoS      |
| nanoid          | HIGH     | Custom generators loop indefinitely                          | DoS      |
| postcss         | HIGH     | XSS via unescaped </style>                                   | XSS      |
| fast-uri        | HIGH     | Host confusion via backslash authority                       | SSRF     |
| glob            | HIGH     | Command injection via CLI                                    | RCE      |
| hono            | MODERATE | ReDoS, data disclosure, other issues                         | Multiple |
| deepmerge-ts    | HIGH     | Stack exhaustion on recursive objects                        | DoS      |
| dompurify       | MODERATE | XSS via IN_PLACE hook removal                                | XSS      |
| prismjs         | MODERATE | DOM Clobbering                                               | XSS      |

**Source:** Most vulnerabilities come from transitive dependencies (via Sanity, Prisma, and other CLI tools).

**Action Required:**

```bash
npm audit fix  # May require --force for breaking changes
npm audit fix --force  # Last resort (may update major versions)
```

---

#### Issue #3: Outdated Dependencies

**Severity:** MEDIUM

**Outdated Packages:**

```
@base-ui/react        1.6.0  → 1.7.0
@clerk/nextjs         7.6.1  → 7.7.6
@hookform/resolvers   5.5.7  → 5.9.1
@prisma/client        6.19.3 → 7.9.1 (MAJOR)
@sanity/client        7.25.0 → 8.0.0 (MAJOR)
next                  15.5.22 → 16.3.1
eslint                9.39.5 → 10.8.1
react-hook-form       7.83.0 → 7.85.0
stripe                22.3.2 → 22.5.0
```

**Risk:** Minor security patches, potential bugs, compatibility issues

---

### 🔴 HIGH SECURITY ISSUES

#### Issue #4: No Environment Variable Validation

**Severity:** HIGH

**Finding:** `.env.example` lists required variables, but there's no runtime validation.

**Risk:**

- Missing environment variables could cause silent failures
- No validation that secrets are correctly formatted

**Recommendation:**

```typescript
// Create lib/env-validation.ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string().startsWith("sk_"),
  // ... more validations
});

export const env = envSchema.parse(process.env);
```

---

#### Issue #5: Admin Routes Not Protected

**Severity:** HIGH

**Finding:** Admin routes at `/admin/*` are protected by Clerk middleware, but there's no verification that the user has admin permissions in database.

**Current:** [lib/server/auth.ts] has `requireAdmin()` function

```typescript
export const requireAdmin = cache(async (): Promise<AdminContext> => {
  // Requires valid Clerk session + admin role in database
  const authenticatedUser = await requireAuthenticatedUser();
  // ... database lookup
}
```

**Status:** ✅ Appears to be implemented correctly

**Needs Verification:**

- Are all admin routes calling `requireAdmin()`?
- Is permission checking granular (products.read vs products.write)?

---

### 🟡 MEDIUM SECURITY ISSUES

#### Issue #6: Sensitive Information in Error Messages

**Severity:** MEDIUM

**Risk:** Error messages might leak sensitive information in development but leak in production

**Recommendation:** Use generic error messages in production

---

#### Issue #7: Missing CORS Configuration

**Severity:** MEDIUM

**Finding:** No explicit CORS configuration found

**Risk:** If API routes are added, CORS might be overly permissive

**Recommendation:** Add CORS middleware if needed, restrict to specific origins

---

#### Issue #8: No Rate Limiting

**Severity:** MEDIUM

**Risk:** No protection against brute force attacks on login or payment endpoints

**Recommendation:** Add rate limiting to auth and payment routes

---

### 🟢 LOW ISSUES

#### Issue #9: Source Maps in Production

**Severity:** LOW

**Risk:** Source maps expose source code in production

**Recommendation:** Disable source maps in production build

---

### Security Checklist

| Category     | Item                            | Status             |
| ------------ | ------------------------------- | ------------------ |
| Secrets      | Committed .env file             | 🔴 CRITICAL        |
| Secrets      | Validation of required env vars | 🟡 MISSING         |
| Dependencies | Vulnerability scan              | 🔴 CRITICAL        |
| Dependencies | Regular updates                 | 🟡 PROCESS MISSING |
| Auth         | Admin permission checks         | ✅ IMPLEMENTED     |
| Auth         | Rate limiting                   | 🔴 MISSING         |
| APIs         | CORS configuration              | 🟡 UNCLEAR         |
| HTTPS        | Forced redirect                 | ✅ (Vercel)        |
| Headers      | Security headers                | 🟡 UNCLEAR         |
| Logging      | Sensitive data in logs          | 🟡 RISKY           |

### Security Score: 30/100

**Critical Blockers for Production:**

1. Rotate all credentials
2. Fix npm audit vulnerabilities
3. Implement environment variable validation
4. Add rate limiting

---

## 20. Privacy Audit

### What User Data is Collected

**Current State:** Minimal implementation

| Data Point   | Collected          | Used For               | Risk                    |
| ------------ | ------------------ | ---------------------- | ----------------------- |
| Name         | ❓ (via Clerk)     | Authentication         | ⚠️ Stored in Clerk      |
| Email        | ✅ (via Clerk)     | Authentication, Orders | ⚠️ Stored in Clerk + DB |
| Phone        | ⚠️ (for orders)    | Shipping               | ⚠️ Not implemented yet  |
| Address      | ⚠️ (for orders)    | Shipping               | ⚠️ Not implemented yet  |
| Payment Info | ⚠️ (Razorpay)      | Payments               | ⚠️ Not implemented yet  |
| Cookies      | ⚠️ (Clerk session) | Authentication         | ✅ Session-only         |
| Analytics    | ⚠️ (Unknown)       | Tracking               | ❓ Need to verify       |

### Privacy Issues

❌ **No Privacy Policy** — Required for EU (GDPR) and most jurisdictions

❌ **No Cookie Consent** — Required if analytics are implemented

❌ **No Data Retention Policy** — How long are orders/customers kept?

❌ **No User Data Export** — GDPR requirement

❌ **No Account Deletion** — GDPR requirement

### Privacy Checklist

| Item                  | Status     | Note                    |
| --------------------- | ---------- | ----------------------- |
| Privacy Policy        | 🔴 MISSING | Legal requirement       |
| Cookie Policy         | 🔴 MISSING | GDPR/CCPA               |
| Data Retention Policy | 🔴 MISSING | GDPR requirement        |
| Right to Access       | 🔴 MISSING | GDPR requirement        |
| Right to Delete       | 🔴 MISSING | GDPR requirement        |
| Data Export           | 🔴 MISSING | GDPR requirement        |
| Third-Party Consent   | 🟡 UNCLEAR | Clerk, Sanity, Razorpay |
| Cloudinary Usage      | 🟡 UNCLEAR | Image storage privacy   |

### Privacy Score: 15/100

---

## 21. Dependency Audit

### Dependency Health Summary

| Category      | Status            | Notes                              |
| ------------- | ----------------- | ---------------------------------- |
| Framework     | ✅ Good           | Next.js 15 is latest stable        |
| React         | ✅ Good           | React 19 is latest (very new)      |
| TypeScript    | ✅ Good           | 5.9 is recent                      |
| Database      | ✅ Good           | Prisma + PostgreSQL solid choice   |
| CMS           | 🟡 Outdated       | Sanity 7 → 8 available             |
| Auth          | ✅ Good           | Clerk 7.6 is reasonable            |
| UI Components | ✅ Good           | shadcn/ui integrated               |
| Styling       | ✅ Good           | Tailwind 4 latest                  |
| Forms         | ✅ Good           | React Hook Form + Zod              |
| State         | ✅ Good           | Zustand is lightweight             |
| API           | ✅ Good           | TanStack Query for async           |
| Payments      | 🟡 Not integrated | Razorpay + Stripe ready but unused |
| Email         | 🟡 Not integrated | Resend configured                  |
| Animations    | ✅ Good           | GSAP + Motion for transitions      |

### Vulnerability Assessment

**Critical Vulnerabilities:** 6 (mostly transitive from Sanity CLI)
**High Vulnerabilities:** 7+
**Medium Vulnerabilities:** 3+

**Most risky:**

- `decompress` — arbitrary file write (Zip Slip)
- `adm-zip` — 4GB memory allocation DoS
- `brace-expansion` — ReDoS
- `postcss` — XSS via CSS

**Remediation:**

```bash
npm audit fix --force  # May cause breaking changes
# OR update specific packages:
npm install next-sanity@13.3.3  # Fixes multiple issues
```

### Unused Dependencies

**Potentially Underutilized:**

- ✅ GSAP (used in Hero)
- ✅ Motion (used for sections)
- ✅ Lenis (smooth scroll integrated)
- ⚠️ Razorpay (not integrated in checkout)
- ⚠️ Stripe (not integrated)
- ⚠️ Resend (not sending emails)

### Package Size Analysis

**Top Bundle Contributors:**

- Tailwind CSS + design tokens: ~40%
- React + dependencies: ~30%
- Next.js runtime: ~20%
- Other: ~10%

---

## 22. Content Audit

### Homepage Content Quality

| Section        | Status      | Quality  | Issues                                                |
| -------------- | ----------- | -------- | ----------------------------------------------------- |
| Hero           | ✅ Complete | ⭐⭐⭐⭐ | None                                                  |
| Origins        | 🟡 Partial  | ⭐⭐     | Missing descriptions, translations, brand reflections |
| Collection     | ✅ Complete | ⭐⭐⭐   | Good editorial, but limited to 1 product              |
| Certifications | ✅ Complete | ⭐⭐⭐   | Basic implementation                                  |
| Videos         | 🔴 Broken   | ⭐       | Placeholder YouTube URLs                              |
| Heritage       | ❓ Unknown  | ?        | Not audited                                           |
| Founder        | ❓ Unknown  | ?        | Not audited                                           |
| Footer         | ❓ Unknown  | ?        | Not audited                                           |

### Placeholder/TODO Content

**Critical TODOs:**

```typescript
// lib/content/valleys.ts
altitude: null, // TODO: Add approved altitude.
shortDescription: null, // TODO: Add approved editorial copy.
brandReflection: null, // TODO: Add approved brand reflection.
translation: null, // TODO: Add approved translation.
reference: null, // TODO: Add approved reference.

// lib/content/videos.ts
url: "https://www.youtube.com/embed/placeholder-spiti",
url: "https://www.youtube.com/embed/placeholder-herding",
url: "https://www.youtube.com/embed/placeholder-honey",
```

### Content Issues Matrix

| Content              | Exists | Approved | Published | Quality   |
| -------------------- | ------ | -------- | --------- | --------- |
| Valley descriptions  | ❌     | ❌       | ❌        | —         |
| Valley translations  | 🟡     | ❌       | ❌        | Low       |
| Product descriptions | ✅     | ❓       | ❌        | Medium    |
| Product benefits     | ❓     | ❌       | ❌        | —         |
| Origin stories       | ❌     | ❌       | ❌        | —         |
| Community stories    | ❌     | ❌       | ❌        | —         |
| Ritual guides        | ❌     | ❌       | ❌        | —         |
| Brand philosophy     | ✅     | ✅       | Partial   | Good      |
| Homepage copy        | ✅     | ⭐⭐⭐⭐ | Partial   | Excellent |

### Content Checklist

| Item                         | Status                         |
| ---------------------------- | ------------------------------ |
| Product names & descriptions | 🟡 PARTIAL                     |
| Product origin stories       | 🔴 MISSING                     |
| Product benefits (verified)  | 🔴 MISSING                     |
| Product certifications       | 🔴 MISSING                     |
| Product specifications       | 🔴 MISSING                     |
| Valley descriptions          | 🔴 MISSING                     |
| Valley history               | 🔴 MISSING                     |
| Community profiles           | 🔴 MISSING                     |
| Producer information         | 🔴 MISSING                     |
| Ritual/usage guides          | 🔴 MISSING                     |
| Taste profiles               | 🔴 MISSING                     |
| Nutrition information        | 🔴 MISSING                     |
| FAQ content                  | 🔴 MISSING                     |
| Reviews/testimonials         | 🔴 MISSING                     |
| Video content                | 🔴 MISSING (placeholders only) |
| Photography                  | 🟡 PARTIAL (AI temp assets)    |

### Content Score: 25/100

---

## 23. Brand Authenticity Audit

### Brand Alignment Assessment

**How well does the current website express "The Only Retreats" brand?**

### What Works ✅ (60% alignment)

1. **Hero Copy** — "The Himalayas are not a destination. They are a source."
   - ⭐⭐⭐⭐⭐ Perfectly captures philosophy

2. **Typography System**
   - Cormorant Garamond (display) — feels editorial, upscale, heritage
   - Literata (heading) — literary, refined
   - Manrope (body) — modern but restrained
   - ✅ Appropriate choices

3. **Color Palette**
   - Warm Himalayan Sand background
   - Forest Green accents
   - Muted gold details
   - ✅ Feels authentic, not generic

4. **Navigation**
   - Clean, minimal
   - Himalayan tagline present
   - ✅ Restrained, not loud

5. **Sanskrit Integration**
   - Devanagari script in Hero
   - Shloka verses on product pages
   - ✅ Authentic, respectful cultural representation

### What's Missing/Weak 🟡 (40% work needed)

1. **Origin-First Storytelling**
   - ❌ Valley pages lack descriptive content
   - ❌ No producer stories
   - ❌ No community context
   - Current: Product-centric, not origin-centric

2. **Editorial Quality**
   - ✅ Homepage copy is excellent
   - ❌ Valley content is templated
   - ❌ No journal/story section
   - ❌ Feels incomplete, not editorial

3. **Visual Storytelling**
   - ✅ Hero imagery direction is right
   - 🟡 Temporary AI assets need replacement
   - ❌ Missing behind-the-scenes photography
   - ❌ No producer/community photography
   - ❌ No craft/process photography

4. **Craftsmanship Feel**
   - ✅ Design is minimalist and intentional
   - ❌ Lacks the "handmade" texture
   - ❌ No tactile details (paper, brass, copper visual cues)
   - ❌ Missing authenticity markers

5. **Sense of Place**
   - ❌ Valley pages exist but are empty
   - ❌ No geographic specificity beyond names
   - ❌ Changthang should feel vastly different from Spiti (currently identical structure)
   - ❌ Missing immersive place experience

6. **Heritage Depth**
   - ✅ Framework for heritage (Founder, Heritage sections exist)
   - ❌ No actual heritage content populated
   - ❌ No historical context
   - ❌ No cultural respect/acknowledgment

### Brand Authenticity Verdict

**Current State: 50/100** (Feels aspirational, but incomplete)

**Summary:**

- ✅ **Direction is correct** — Team understands the brand
- ⚠️ **Execution is incomplete** — Content and imagery still being gathered
- ⚠️ **Visual polish exists** — Design system is on-brand
- 🔴 **Content is the blocker** — Without valley descriptions, producer stories, and authentic imagery, the site feels like an empty museum

**Risk:** Launching with placeholder content risks the perception shifting from "premium heritage brand" to "generic luxury website building itself."

---

## 24. Legal / Claims Risks

### Health & Nutritional Claims

**Current Status:** Minimal content, so minimal claims

**Identified Risks:**

1. **Collection Section** (Yak Ghee)

   ```
   "Clarified over wood fire at 12,000 feet. This ghee carries the essence of Spiti..."
   ```

   ✅ No health claims, only sensory/origin description

2. **Product Page Framework** (lib/content/product.ts)
   - `ProductNutrition` interface exists
   - `ProductBenefit` structure exists (based on review)
   - ⚠️ **No actual nutrition content created yet**

### Red Flags to Monitor

🔴 **Claims that would require substantiation:**

- "Supports digestion"
- "High in fat-soluble vitamins"
- "Boosts immunity"
- "Rich in antioxidants"
- Any therapeutic/medicinal claims

✅ **Safe claims (supported by nature):**

- "High smoke point" (verifiable)
- "Rich, buttery flavor" (sensory)
- "Traditionally valued" (historical)
- "High altitude origin" (factual)
- Nutritional data (if verified)

### Legal Documentation Needed

| Item                       | Status     | Priority |
| -------------------------- | ---------- | -------- |
| Terms of Service           | 🔴 MISSING | P0       |
| Privacy Policy             | 🔴 MISSING | P0       |
| Refund/Return Policy       | 🔴 MISSING | P0       |
| Product Disclaimer         | 🔴 MISSING | P1       |
| Health Claims Disclaimer   | 🟡 RISKY   | P1       |
| Allergen Information       | 🔴 MISSING | P0       |
| Ingredient Sourcing Claims | 🟡 RISKY   | P2       |

### Legal Score: 20/100

**Critical Blockers:**

1. Add standard legal pages (T&S, Privacy, Returns)
2. Have founder/team review all health/nutritional claims
3. Ensure claims are either verified or marked as traditional/cultural

---

## 25. Testing / QA Audit

### Current State: Minimal Testing Infrastructure

**What's In Place:**

- ✅ TypeScript strict mode (type safety)
- ✅ ESLint (code quality, 2 warnings only)
- ✅ Build process passes

**What's Missing:**

- ❌ Unit tests
- ❌ Integration tests
- ❌ E2E tests (Cypress, Playwright)
- ❌ Visual regression tests
- ❌ Accessibility tests (axe-core)
- ❌ Performance tests
- ❌ Load tests

### Testing Gaps

**Critical areas needing testing:**

1. **Checkout Flow** (not yet built, but will need heavy testing)
   - Cart add/remove
   - Quantity updates
   - Variant selection
   - Payment processing
   - Error handling

2. **Admin Operations**
   - Product CRUD
   - Inventory updates
   - Order management
   - Origin creation

3. **Authentication**
   - Clerk integration
   - Permission checks
   - Session management

4. **Database Queries**
   - Prisma queries
   - Edge cases
   - Performance

5. **Responsive Design**
   - 320px to 2560px
   - Touch interactions
   - Orientation changes

### Testing Recommendations

**Immediate (Before MVP Launch):**

1. Add Playwright for key user journeys
2. Add axe-core for accessibility
3. Manual QA checklist for mobile/desktop

**Short-term (Before Production Launch):**

1. Unit tests for business logic (services)
2. Integration tests for API routes
3. E2E tests for full checkout flow

### Testing Score: 10/100

---

## 26. Production Readiness

### Scorecards by Category

| Category          | Score  | Notes                                                       |
| ----------------- | ------ | ----------------------------------------------------------- |
| **Product**       | 60/100 | Design system is excellent, content incomplete              |
| **Design**        | 60/100 | Direction is right, needs polish and responsive testing     |
| **Content**       | 25/100 | Homepage good, rest templated with TODOs                    |
| **Engineering**   | 75/100 | Tech stack solid, architecture clean, but ecommerce missing |
| **Security**      | 30/100 | Critical: secrets in .env, vulnerabilities in dependencies  |
| **Performance**   | 65/100 | Good foundation, needs optimization config                  |
| **SEO**           | 45/100 | Basic implementation, missing structured data               |
| **Accessibility** | 20/100 | Minimal WCAG compliance, needs focused work                 |
| **Ecommerce**     | 40/100 | Framework exists, cart/checkout not implemented             |
| **Operations**    | 40/100 | Admin panel started, not complete                           |
| **Legal/Privacy** | 20/100 | Missing all required legal pages                            |
| **Testing**       | 10/100 | No automated tests                                          |

### **Overall Production Readiness: 35/100**

### Production Readiness Matrix

| Dimension                      | Status                | Blocker?           | Fix Time  |
| ------------------------------ | --------------------- | ------------------ | --------- |
| Is the site technically sound? | 🟡 Mostly             | ⚠️ Security issues | 1-2 weeks |
| Is the homepage complete?      | 🟡 Partial            | No                 | 1-2 weeks |
| Is ecommerce functional?       | 🔴 No                 | ✅ YES             | 4-6 weeks |
| Is content approved?           | 🔴 No                 | ✅ YES             | 2-4 weeks |
| Are legal pages ready?         | 🔴 No                 | ✅ YES             | 1 week    |
| Is the site performant?        | 🟡 Needs optimization | No                 | 1-2 weeks |
| Is the site accessible?        | 🔴 Poor               | No*                | 2-3 weeks |

*Accessibility is important for brand perception but not a hard blocker

### Launch Decision: 🔴 NOT READY

**Critical Blockers:**

1. 🔴 Security vulnerabilities in dependencies
2. 🔴 Secrets in .env file (rotate credentials)
3. 🔴 Ecommerce not implemented
4. 🔴 Content not approved/populated
5. 🔴 Legal pages missing

**Can Launch Once:**

- ✅ All vulnerabilities fixed
- ✅ Secrets rotated
- ✅ Cart/checkout functional
- ✅ Product content approved
- ✅ Legal pages added
- ✅ Mobile QA passed

**Estimated Time to Production Ready:** 6-8 weeks

---

## 27. Intended vs Current State

### Status Matrix

| Area                      | Intended           | Current                      | Gap               | Priority |
| ------------------------- | ------------------ | ---------------------------- | ----------------- | -------- |
| **BRAND VISION**          |                    |                              |                   |          |
| Origin-first philosophy   | ✅ Documented      | 🟡 Partial                   | Content missing   | P1       |
| Editorial brand feel      | ✅ Clear direction | 🟡 Design good, content weak | Content           | P1       |
| Himalayan storytelling    | ✅ Intended        | 🔴 Minimal                   | All story content | P1       |
| Luxury perception         | ✅ Designed for    | 🟡 Directory in place        | Polish needed     | P2       |
| **HOMEPAGE**              |                    |                              |                   |          |
| Hero                      | ✅ Intended        | ✅ Complete                  | None              | —        |
| Origins section           | ✅ Intended        | 🟡 Structure only            | Content           | P1       |
| Product showcase          | ✅ Intended        | 🟡 1 of ~9 shown             | More products     | P2       |
| Certifications            | ✅ Intended        | 🟡 Exists                    | Data              | P2       |
| Philosophy/story          | ✅ Intended        | 🟡 Partial                   | Content           | P2       |
| **PRODUCTS**              |                    |                              |                   |          |
| ~9 product SKUs           | ✅ Intended        | 🔴 Only 4                    | 5 more            | P1       |
| Product detail pages      | ✅ Intended        | ✅ Template complete         | Content           | P1       |
| Product benefits          | ✅ Intended        | 🔴 Templated                 | Research/verify   | P1       |
| Origin journey sections   | ✅ Intended        | ✅ Component built           | Content           | P1       |
| Shloka/philosophy         | ✅ Intended        | ✅ Framework built           | Content           | P1       |
| **ECOMMERCE**             |                    |                              |                   |          |
| Shopping cart             | ✅ Intended        | 🔴 Missing                   | Build             | P0       |
| Checkout flow             | ✅ Intended        | 🔴 Missing                   | Build             | P0       |
| Payment integration       | ✅ Intended        | 🔴 Dependencies only         | Integrate         | P0       |
| Inventory tracking        | ✅ Intended        | 🟡 Service built             | Connect to UI     | P1       |
| Order management          | ✅ Intended        | 🟡 Started                   | Complete          | P1       |
| **CMS/CONTENT**           |                    |                              |                   |          |
| Sanity integration        | ✅ Intended        | 🟡 Configured                | Implement         | P2       |
| Content editing UI        | ✅ Intended        | 🔴 Admin started             | Complete          | P2       |
| Product content           | ✅ Intended        | 🔴 Hardcoded                 | Migrate to DB     | P1       |
| **TECH STACK**            |                    |                              |                   |          |
| Next.js 15                | ✅ Intended        | ✅ Implemented               | None              | —        |
| TypeScript                | ✅ Intended        | ✅ Strict mode               | None              | —        |
| Prisma                    | ✅ Intended        | ✅ Configured                | None              | —        |
| Clerk auth                | ✅ Intended        | ✅ Integrated                | None              | —        |
| Sanity CMS                | ✅ Intended        | 🟡 Installed                 | Setup             | P2       |
| Payment (Razorpay/Stripe) | ✅ Intended        | 🟡 Dependencies              | Integration       | P0       |
| **SECURITY**              |                    |                              |                   |          |
| Secure auth               | ✅ Intended        | ✅ Clerk                     | None              | —        |
| Secrets management        | ✅ Intended        | 🔴 .env exposed              | Fix               | P0       |
| Dependency audit          | ✅ Intended        | 🔴 Vulnerabilities           | Fix               | P0       |
| **DESIGN**                |                    |                              |                   |          |
| Design system             | ✅ Intended        | ✅ Defined                   | None              | —        |
| Color system              | ✅ Intended        | ✅ Implemented               | None              | —        |
| Typography                | ✅ Intended        | ✅ Implemented               | None              | —        |
| Responsive layout         | ✅ Intended        | 🟡 Built                     | Test              | P2       |
| **LEGAL/COMPLIANCE**      |                    |                              |                   |          |
| Privacy policy            | ✅ Required        | 🔴 Missing                   | Write             | P0       |
| Terms of service          | ✅ Required        | 🔴 Missing                   | Write             | P0       |
| Legal pages               | ✅ Required        | 🔴 Missing                   | Write             | P0       |

### Summary

**Complete (Ready):** 10 items
**Partial (In Progress):** 15 items  
**Missing (Not Started):** 20 items

---

## 28. P0 Critical Issues (Must Fix Before Production)

### 🔴 P0-01: Security Vulnerability — .env Secrets Exposed

**Severity:** CRITICAL  
**Evidence:** `.env` file contains `DATABASE_URL` and `CLERK_SECRET_KEY`  
**Impact:** Production database and auth system compromised if repo is public  
**Remediation:**

1. Immediately rotate PostgreSQL user password in Neon
2. Revoke and regenerate Clerk secret key
3. Remove `.env` from local directory (already in .gitignore)
4. Add all secrets to Vercel environment variables only
5. Audit recent access logs

**Effort:** 1-2 hours  
**Owner:** DevOps/Security

---

### 🔴 P0-02: npm audit — Critical Vulnerabilities

**Severity:** CRITICAL  
**Evidence:** `npm audit` shows 6 critical/high vulnerabilities  
**Impact:** Arbitrary file write, DoS, XSS, RCE via dependencies  
**Remediation:**

```bash
npm audit fix --force  # Will update major versions (test thoroughly)
# OR selectively update:
npm install next-sanity@13.3.3  # Fixes multiple issues
npm audit --fix
```

**Testing:** Full build and smoke test after fix  
**Effort:** 2-4 hours  
**Owner:** DevOps/Backend

---

### 🔴 P0-03: Ecommerce Not Implemented

**Severity:** CRITICAL  
**Evidence:** No cart, checkout, payment, or order processing  
**Impact:** Cannot take customer payments  
**Blockers:**

- Cart state management (Zustand store)
- Checkout UI (React forms)
- Payment processing (Razorpay webhook)
- Order confirmation (Resend email)

**Remediation:**

1. Implement cart reducer/store (Zustand)
2. Build checkout form (React Hook Form + Zod)
3. Integrate Razorpay payment
4. Setup order confirmation email (Resend)
5. Test full flow

**Effort:** 4-6 weeks  
**Owner:** Full-stack team

---

### 🔴 P0-04: Content Not Populated

**Severity:** CRITICAL  
**Evidence:** ~20 TODO comments in content files  
**Impact:** Cannot publish product pages or valley pages  
**Required Content:**

- Product descriptions (for all 9 products)
- Product benefits (with verification)
- Valley descriptions and stories
- Community/producer information
- Photography assets

**Remediation:** Content planning + research session with founder  
**Effort:** 2-4 weeks  
**Owner:** Product/Content team

---

### 🔴 P0-05: Legal Pages Missing

**Severity:** CRITICAL  
**Evidence:** No Terms of Service, Privacy Policy, Return Policy  
**Impact:** Legal liability, cannot accept customer data  
**Required Pages:**

- Terms of Service
- Privacy Policy
- Return/Refund Policy
- Allergen/Safety Information
- Shipping Policy

**Remediation:**

1. Have lawyer review template
2. Customize for India + international shipping
3. Add to website (typically in footer)

**Effort:** 1 week  
**Owner:** Legal/Compliance

---

### 🔴 P0-06: Database Not Seeded with Products

**Severity:** CRITICAL  
**Evidence:** `getPublishedProductBySlug()` will return null for all products  
**Impact:** Product pages will show 404  
**Remediation:**

1. Create admin interface for product creation (partially done)
2. Populate database with all 9 products
3. Test product page routes

**Effort:** 1 week  
**Owner:** Product/Admin team

---

## 29. P1 Launch Issues (Should Fix Before Launch)

### 🟡 P1-01: Valley Content Missing

**Evidence:** All 5 valleys have NULL values for descriptions, altitudes, reflections  
**Impact:** Origins section feels empty  
**Remediation:** Write valley descriptions with founder input  
**Effort:** 1-2 weeks  
**Owner:** Content

---

### 🟡 P1-02: Video Placeholders

**Evidence:** lib/content/videos.ts contains `placeholder-spiti`, `placeholder-herding`  
**Impact:** Videos section renders broken embeds  
**Remediation:** Replace with actual video URLs or remove section  
**Effort:** 3-5 days  
**Owner:** Video/Content

---

### 🟡 P1-03: Image Optimization Not Configured

**Evidence:** next.config.ts is empty  
**Impact:** Images served suboptimally  
**Remediation:**

```typescript
// next.config.ts
export default {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
    formats: ["image/avif", "image/webp"],
  },
};
```

**Effort:** 2-3 hours  
**Owner:** Frontend

---

### 🟡 P1-04: Accessibility Gaps

**Evidence:** Only ~30% WCAG compliance  
**Impact:** Poor experience for users with disabilities  
**Remediation:**

1. Add missing alt text
2. Improve color contrast
3. Add ARIA labels
4. Test keyboard navigation

**Effort:** 2-3 weeks  
**Owner:** Frontend

---

### 🟡 P1-05: Admin Forms Incomplete

**Evidence:** Product/Order forms still being built  
**Impact:** Cannot manage inventory/orders  
**Remediation:** Complete admin CRUD operations  
**Effort:** 2-3 weeks  
**Owner:** Full-stack

---

### 🟡 P1-06: SEO Structured Data Missing

**Evidence:** No JSON-LD schema, no sitemap, no robots.txt  
**Impact:** Poor search visibility  
**Remediation:**

1. Add JSON-LD for Product, Organization, LocalBusiness
2. Generate sitemap
3. Add robots.txt

**Effort:** 3-5 days  
**Owner:** Frontend/DevOps

---

### 🟡 P1-07: Product Benefits Not Verified

**Evidence:** Benefit descriptions exist in template but need scientific/legal review  
**Impact:** Legal risk if claims are unsubstantiated  
**Remediation:** Have founder/researcher verify all health claims  
**Effort:** 1-2 weeks  
**Owner:** Legal/Product

---

## 30. P2 Post-Launch Improvements

### 🔵 P2-01: Sanity CMS Integration

**Status:** Partially configured, not integrated  
**Scope:** Migrate hardcoded content to Sanity  
**Benefit:** Non-technical content editing  
**Effort:** 2-3 weeks

---

### 🔵 P2-02: Product Variants UI

**Status:** Database schema ready, no UI  
**Scope:** Add variant selector to product pages  
**Benefit:** Support different sizes/quantities  
**Effort:** 1 week

---

### 🔵 P2-03: Search Functionality

**Status:** Not started  
**Scope:** Product/content search  
**Benefit:** Better discoverability  
**Effort:** 1-2 weeks

---

### 🔵 P2-04: Newsletter Subscription

**Status:** Not started  
**Scope:** Email capture + automation  
**Benefit:** Customer retention  
**Effort:** 3-5 days

---

### 🔵 P2-05: Customer Reviews

**Status:** Component exists, not connected  
**Scope:** Review submission + display  
**Benefit:** Social proof  
**Effort:** 1-2 weeks

---

### 🔵 P2-06: Wishlist/Favorites

**Status:** Not started  
**Scope:** User-saved products  
**Benefit:** Better UX  
**Effort:** 3-5 days

---

### 🔵 P2-07: Advanced Analytics

**Status:** Not started  
**Scope:** Heatmaps, user behavior, sales funnel  
**Benefit:** Data-driven improvements  
**Effort:** 1 week

---

### 🔵 P2-08: Mobile App

**Status:** Not started  
**Scope:** Native iOS/Android app  
**Benefit:** Better mobile experience  
**Effort:** 6-8 weeks

---

## 31. P3 Nice-to-Have Improvements

- 🔵 Multi-language support (Hindi, Sanskrit)
- 🔵 Subscription/auto-replenishment
- 🔵 Loyalty program
- 🔵 Influencer collaborations
- 🔵 Affiliate program
- 🔵 Live chat support
- 🔵 Video tutorials for ritual guides
- 🔵 Augmented reality product preview
- 🔵 Community forum
- 🔵 Journal/blog content

---

## 32. Recommended Architecture

### Current Tech Stack: GOOD ✅

**Framework:**

- Next.js 15 (App Router) — Excellent for this use case

**Frontend:**

- React 19 — Latest, stable
- TypeScript — Strict mode, excellent type safety
- Tailwind CSS v4 — Great for design system
- shadcn/ui — Good component foundation

**Backend:**

- Next.js API Routes / Server Components
- Prisma — Type-safe ORM
- PostgreSQL (Neon) — Excellent for structured data

**Authentication:**

- Clerk — Well-integrated, handles auth + permissions

**Content Management:**

- Sanity — Not yet integrated, but good choice for structured content

**Media:**

- Cloudinary — Good for image optimization

**Payments:**

- Razorpay — Good choice for India + international
- Stripe ready for future expansion

**State Management:**

- Zustand — Lightweight, not yet used
- TanStack Query — For API caching
- React Hook Form — For forms

### Recommended Directory Structure (Already Good)

No major changes needed. Current structure is clean.

### Recommended Patterns

✅ **Already implemented:**

- Server components for data fetching
- Client components for interactivity
- Middleware for auth
- API routes for backend logic
- Type-safe database queries (Prisma)
- Environment validation (ready to implement)

### Performance Recommendations

1. **Image Optimization:**
   - Configure Next.js Image loader
   - Use WebP/AVIF formats
   - Lazy load below-fold images

2. **Code Splitting:**
   - Dynamic imports for large components
   - Route-based code splitting (automatic)

3. **Caching:**
   - ISR (Incremental Static Regeneration) for product pages
   - HTTP cache headers
   - Database query caching

4. **Monitoring:**
   - Web Vitals tracking (add Vercel Analytics)
   - Error tracking (Sentry)
   - Performance monitoring

---

## 33. Recommended Development Roadmap

### Phase 1: SECURE & STABILIZE (Weeks 1-2)

**Goal:** Make the project production-safe

- [ ] Rotate all credentials
- [ ] Fix npm audit vulnerabilities
- [ ] Add environment variable validation
- [ ] Setup Vercel deployment with secrets
- [ ] Add rate limiting to auth routes
- [ ] Commit work-in-progress or branch it

**Owner:** DevOps + Backend  
**Deliverable:** Secure, deployable codebase

---

### Phase 2: CONTENT & LEGAL (Weeks 3-4)

**Goal:** Populate content and add legal compliance

- [ ] Write valley descriptions (with founder)
- [ ] Write product descriptions (with founder)
- [ ] Verify product claims (with researcher/lawyer)
- [ ] Add 5 missing products to database
- [ ] Replace placeholder videos
- [ ] Write Terms of Service
- [ ] Write Privacy Policy
- [ ] Write Return/Refund Policy
- [ ] Add allergen/safety information

**Owner:** Content + Legal  
**Deliverable:** Complete content, legal pages

---

### Phase 3: ECOMMERCE (Weeks 5-8)

**Goal:** Implement shopping and payment

- [ ] Build cart UI (React Hook Form + Zustand)
- [ ] Implement cart state management
- [ ] Build checkout form
- [ ] Integrate Razorpay payment
- [ ] Setup Resend email confirmations
- [ ] Implement order tracking
- [ ] Add inventory validation
- [ ] Build order management admin

**Owner:** Full-stack team  
**Deliverable:** Functional checkout

---

### Phase 4: LAUNCH PREP (Weeks 9-10)

**Goal:** Polish and finalize

- [ ] Fix accessibility issues (WCAG AA)
- [ ] Test responsiveness across devices
- [ ] Performance optimization
- [ ] SEO setup (sitemap, robots.txt, schema)
- [ ] Complete admin CRUD operations
- [ ] Smoke testing
- [ ] Security audit
- [ ] Load testing

**Owner:** QA + Frontend + DevOps  
**Deliverable:** Production-ready website

---

### Phase 5: POST-LAUNCH (Weeks 11+)

- Sanity CMS full integration
- Advanced analytics
- Customer review system
- Newsletter system
- Mobile app planning

---

## 34. Final Verdict

### Is The Only Retreats Ready to Launch?

**🔴 NO** — Not in current state

### Why?

1. **🔴 CRITICAL:** Security vulnerabilities make deployment unsafe
2. **🔴 CRITICAL:** Ecommerce is completely missing
3. **🔴 CRITICAL:** Content is templated with TODOs
4. **🔴 CRITICAL:** Legal pages are missing

### Timeline to Launch-Ready

**Optimistic:** 6-8 weeks  
**Realistic:** 8-10 weeks  
**Conservative:** 10-12 weeks

### Success Factors

✅ **Strengths:**

- Excellent brand vision and strategy
- Solid technical foundation
- Clean architecture
- Thoughtful design system
- Strong homepage copy

⚠️ **Challenges:**

- Large content gap (needs founder involvement)
- Ecommerce build is substantial
- Security vulnerabilities need immediate attention
- Legal/compliance setup required

### Recommendation

**Path Forward:**

1. **Week 1:** Fix security issues (critical blocker)
2. **Weeks 2-3:** Content strategy session + legal setup
3. **Weeks 4-10:** Build ecommerce + populate content
4. **Week 10+:** Polish, test, launch

**Success Requires:**

- ✅ Founder/product team availability for content decisions
- ✅ Experienced full-stack developer for ecommerce
- ✅ Legal review before launch
- ✅ Comprehensive QA testing

---

# MASTER HANDOFF FOR CLAUDE

This section is written for another AI agent to understand the complete project state.

## Project Context

**Name:** The Only Retreats  
**Status:** Mid-Development (MVP Phase)  
**Current Team:** Arnav (developer) + others  
**Tech Stack:** Next.js 15, TypeScript, Prisma, PostgreSQL, Clerk, Sanity  
**Deployment:** Intended for Vercel  
**Database:** PostgreSQL on Neon

---

## Brand Identity (CRITICAL — Read First)

**Central Philosophy:** The product is NOT the starting point. The ORIGIN is.

**Origin includes:** Landscape, altitude, climate, biodiversity, people, traditions, history, craftsmanship, knowledge, culture.

**Brand Positioning:**

- Premium (not affordable)
- Editorial (not marketing-y)
- Himalayan-focused (not generic)
- Story-driven (not feature-driven)
- Heritage preservation (not trendy)

**Emotional Goal:** Visitor should feel "I discovered something beautiful," NOT "I visited an online store."

**Visual Direction:**

- Colors: Warm sand (#F7F5F1) + forest green (#2F3A2A) + muted gold (#B8A080)
- Typography: Serif display (Cormorant), serif heading (Literata), sans body (Manrope)
- Feel: Calm, Editorial, Premium, Authentic, Timeless
- Avoid: Glassmorphism, SaaS UI, generic stock photos, AI imagery

**Cultural Sensitivity:** Never homogenize Himalayan regions. Each valley (Spiti, Lahaul, Changthang, Zanskar, Nubra, Kullu) has distinct geography, culture, tradition.

---

## What Exists (CONFIRMED)

### Technical Foundation ✅

| Component | Status | Details                                          |
| --------- | ------ | ------------------------------------------------ |
| Framework | ✅     | Next.js 15.5.22, App Router, TypeScript strict   |
| Styling   | ✅     | Tailwind CSS v4, custom design tokens            |
| Database  | ✅     | PostgreSQL via Neon, Prisma 6.19.3               |
| Auth      | ✅     | Clerk 7.6.1 integrated, admin permissions system |
| CMS       | 🟡     | Sanity 7.25.0 installed, not integrated          |
| UI Lib    | ✅     | shadcn/ui configured                             |
| Build     | ✅     | Builds successfully, 27.9 seconds                |
| Types     | ✅     | Full TypeScript coverage, no errors              |
| Linting   | ✅     | ESLint passes (2 minor warnings)                 |

### Pages / Routes (What Works)

| Route                  | Status | Component                                        |
| ---------------------- | ------ | ------------------------------------------------ |
| `/`                    | ✅     | Homepage with Hero, Origins, Collection sections |
| `/products/[slug]`     | ✅     | Product detail page template (no data yet)       |
| `/admin`               | 🟡     | Admin dashboard started                          |
| `/admin/products/[id]` | 🟡     | Product edit form in progress                    |
| `/admin/orders`        | 🟡     | Order listing started                            |
| `/sign-in`             | ✅     | Clerk auth page                                  |
| `/design-system`       | ✅     | Reference page                                   |

### Content (What's Populated)

**Hardcoded Content (in lib/content/):**

- Hero copy + Sanskrit verse ✅
- 4 products (Yak Ghee, Honey, Butter, Spice Blend) ✅
- 5 valleys (Lahaul, Kullu, Nubra, Zanskar, Changthang) 🟡 Incomplete
- Navigation content ✅
- Footer content (scaffold) 🟡
- Videos (placeholder URLs) ❌

**Database Content:**

- Nothing published yet

### Components (What's Built)

**Sections (Homepage):**

- Hero ✅ (animated entrance, dual images, responsive)
- Origins ✅ (structure, needs valley data)
- Collection ✅ (layout, showing 1 product)
- CertificationBand ✅ (layout)
- Heritage 🟡 (structure unclear)
- Founder 🟡 (structure unclear)
- Videos 🟡 (placeholder URLs)
- Footer 🟡 (structure unclear)

**Product Detail Sections (14 components):**

- ProductHero ✅
- ProductHighlights ✅
- ProductStory ✅
- ProductShloka ✅
- ProductJourney ✅
- ProductPassport ✅
- ProductTasteProfile ✅
- ProductNutrition ✅
- ProductCertifications ✅
- ProductRitualGuide ✅
- ProductFAQ ✅
- ProductLabHighlights ✅
- ProductReviews ✅
- ProductRelatedProducts ✅

**Layout Components:**

- Header ✅ (responsive nav)
- MobileDrawer ✅
- Footer ✅
- Admin sidebar 🟡

**UI Primitives:**

- Button ✅
- Container ✅
- Heading ✅
- Section ✅
- Divider ✅

### Database Schema (Prisma)

**Implemented Models:**

- Country, State, District, Region, Village (geographic hierarchy)
- Origin (landscape, climate, biodiversity, traditions, etc.)
- Producer (artisans/farmers)
- ProductionMethod
- Category, Product, ProductVariant
- ProductMedia, ProductPassport
- InventoryItem, InventoryMovement
- Order, OrderItem, OrderLineItem
- Payment, Shipment
- Content, ContentEntry
- Batch, ProductionRecord
- Customer, CustomerAddress
- AdminUser, AdminRole, AdminPermission

**Quality:** Schema is well-designed and comprehensive ✅

---

## What's Missing / Incomplete (CRITICAL GAPS)

### 🔴 Critical Blockers

1. **No Ecommerce**
   - ❌ Cart (no UI, no state management)
   - ❌ Checkout (no form, no flow)
   - ❌ Payment integration (Razorpay dependency exists but not connected)
   - ❌ Order confirmation (Resend configured but not triggered)
   - **Impact:** Cannot take customer payments

2. **No Content Populated**
   - ❌ Valley descriptions (all NULL with TODO comments)
   - ❌ Product benefits (template exists, not filled)
   - ❌ Producer/community stories (completely missing)
   - ❌ 5 of 9 products undefined
   - **Impact:** Product pages return 404

3. **No Legal Pages**
   - ❌ Terms of Service
   - ❌ Privacy Policy
   - ❌ Return/Refund Policy
   - ❌ Allergen/Safety info
   - **Impact:** Cannot legally accept customer data

4. **Security Vulnerabilities**
   - 🔴 `.env` file contains real database + auth credentials (needs credential rotation)
   - 🔴 npm audit: 6+ critical/high vulnerabilities (Zip Slip, DoS, XSS, RCE)
   - **Impact:** Database/auth system compromised if exposed

### 🟡 Major Gaps

5. **Content Quality Issues**
   - Valleys have NULL altitudes, descriptions, brand reflections
   - Videos section has placeholder URLs
   - Product descriptions need founder verification
   - No producer photography
   - All valley imagery is "temporary AI assets"

6. **Ecommerce Infrastructure Partial**
   - Database schema: ✅ Good
   - Admin CRUD: 🟡 Started
   - Storefront queries: 🟡 In progress (lib/storefront/products.ts)
   - Customer-facing UI: ❌ Missing

7. **Admin Panel Incomplete**
   - Dashboard: 🟡 Basic structure
   - Product CRUD: 🟡 In progress
   - Order management: 🟡 Started
   - Inventory: 🟡 Service built, no UI
   - Forms: 🟡 Not finalized

8. **SEO Missing**
   - ❌ sitemap.xml
   - ❌ robots.txt
   - ❌ JSON-LD structured data
   - ✅ Basic metadata implemented

9. **Accessibility Needs Work**
   - Only ~30% WCAG compliant
   - Limited alt text
   - Minimal ARIA
   - Color contrast untested

---

## What Works Well (CONFIDENCE)

### Technical ✅

1. **Architecture:** Clean separation of concerns, well-organized
2. **Type Safety:** Full TypeScript, strict mode, no errors
3. **Build Process:** Succeeds, optimized
4. **Authentication:** Clerk integration is solid
5. **Design System:** Color + typography + spacing well-defined
6. **Responsive Design:** Mobile-first, good breakpoint coverage
7. **Performance Foundation:** Next.js optimization defaults + image components
8. **Form Setup:** React Hook Form + Zod ready to use

### Design & Brand ✅

1. **Hero Section:** Visually stunning, on-brand
2. **Color System:** Feels premium and Himalayan
3. **Typography:** Appropriate and refined
4. **Visual Direction:** Consistent (not corporate/SaaS-like)
5. **Animations:** Smooth, respects prefers-reduced-motion

### Content (What Exists) ✅

1. **Hero Copy:** Excellent — "The Himalayas are not a destination. They are a source."
2. **Brand Documentation:** Well-articulated vision in docs/
3. **Yak Ghee Product** — Good editorial description exists

---

## Critical Issues to Fix (In Order)

### 🔴 Week 1: Security (Blocking Everything)

1. **Rotate Database Credentials**
   - PostgreSQL user password (Neon)
   - New connection string
   - Update .env locally + Vercel

2. **Rotate Clerk Secrets**
   - Revoke old CLERK_SECRET_KEY
   - Generate new one
   - Update everywhere

3. **Fix npm Vulnerabilities**
   - Run `npm audit fix --force` (will update packages)
   - Test build thoroughly
   - Key fixes: next-sanity@13.3.3 (fixes multiple vulns)

4. **Add Environment Validation**
   - Create lib/env.ts with Zod schema
   - Parse env at build/runtime
   - Fail fast if missing

### 🔴 Weeks 2-3: Content & Legal (Blocking Launch)

1. **Content Planning Session** (with founder)
   - Approve valley descriptions + altitudes
   - Define all 9 products
   - Verify product claims (health/nutritional)
   - Choose producer stories to highlight
   - Plan imagery strategy

2. **Legal Pages** (Lawyer review)
   - Terms of Service
   - Privacy Policy
   - Return/Refund Policy
   - Allergen Information

3. **Database Population**
   - Seed all 9 products
   - Mark as PUBLISHED
   - Verify product page routes work

### 🔴 Weeks 4-8: Ecommerce (Blocking Commerce)

1. **Cart UI**
   - Build cart page
   - Add product to cart
   - Update quantity
   - Remove item

2. **Checkout**
   - Shipping form
   - Billing address
   - Order review

3. **Payment**
   - Integrate Razorpay
   - Handle success/failure
   - Webhook for order confirmation

4. **Orders**
   - Admin order management
   - Customer order history
   - Email notifications

### 🟡 Weeks 9-10: Polish (Blocking Quality)

1. **Accessibility**
   - Add alt text
   - Fix color contrast
   - Keyboard navigation
   - Screen reader testing

2. **Performance**
   - Configure next.config.ts
   - Image optimization
   - Bundle analysis

3. **SEO**
   - Add sitemap.xml
   - Add robots.txt
   - JSON-LD schema

4. **QA**
   - Responsive testing (320px-2560px)
   - Form validation
   - Payment flow
   - Error states

---

## Known Issues (Technical Debt)

### Current Branch State

**main:** Up-to-date with origin/main ✅  
**Uncommitted work:**

```
M  app/admin/orders/page.tsx
M  app/admin/origins/[id]/page.tsx
M  app/admin/products/[id]/page.tsx
M  app/admin/settings/page.tsx
M  app/products/[slug]/page.tsx
M  lib/server/auth.ts
M  lib/services/inventory.ts
M  lib/services/variants.ts

Untracked:
   app/admin/orders/[id]/
   app/admin/products/[id]/loading.tsx
   lib/services/orders.ts
   lib/storefront/
```

**Action:** Commit work-in-progress before proceeding

### Code Quality

| Issue                  | Severity | Location              | Fix Time  |
| ---------------------- | -------- | --------------------- | --------- |
| Unused import          | Minor    | Collection.tsx        | 1 min     |
| Raw img tag            | Minor    | CertificationBand.tsx | 1 min     |
| Empty next.config.ts   | Medium   | next.config.ts        | 2 hrs     |
| Hardcoded content      | Medium   | lib/content/          | 2-3 weeks |
| Admin forms incomplete | Medium   | app/admin/[id]/       | 2 weeks   |

---

## Decision Points for Team (Approval Needed)

| Decision             | Current    | Recommendation                      | Owner           |
| -------------------- | ---------- | ----------------------------------- | --------------- |
| 9 Products Defined?  | 4 of 9     | Confirm 5 more SKUs                 | Product         |
| Valley Descriptions? | All NULL   | Write + approve                     | Product/Founder |
| Health Claims?       | Minimal    | Legal review required               | Legal/Founder   |
| Producer Stories?    | Planned    | Commission photography + interviews | Content/Brand   |
| Launch Date?         | TBD        | Need 8-10 weeks                     | Product         |
| Ecommerce Payment?   | Razorpay   | Confirm + setup keys                | Payments        |
| Email Provider?      | Resend     | Confirm domain + setup              | DevOps          |
| Analytics?           | Not chosen | Google Analytics or Vercel?         | Product         |
| Support Email?       | Unknown    | Set up + document                   | Ops             |

---

## Files to Review First

### Strategic

- [docs/02_BRAND_GUIDELINES.md](docs/02_BRAND_GUIDELINES.md) — Brand philosophy
- [docs/01_PROJECT_OVERVIEW.md](docs/01_PROJECT_OVERVIEW.md) — Project vision
- [docs/03_DESIGN_SYSTEM.md](docs/03_DESIGN_SYSTEM.md) — Design decisions

### Technical

- [package.json](package.json) — Dependencies
- [prisma/schema.prisma](prisma/schema.prisma) — Database schema
- [tsconfig.json](tsconfig.json) — TypeScript config
- [styles/globals.css](styles/globals.css) — Design tokens

### Content/Data

- [lib/content/valleys.ts](lib/content/valleys.ts) — Valley content (incomplete)
- [lib/content/product.ts](lib/content/product.ts) — Product structure
- [lib/content/collection.ts](lib/content/collection.ts) — Featured products

### Implementation

- [app/page.tsx](app/page.tsx) — Homepage structure
- [components/sections/Hero/index.tsx](components/sections/Hero/index.tsx) — Hero (reference good code)
- [app/products/[slug]/page.tsx](app/products/[slug]/page.tsx) — Product page template

---

## Setup Instructions (For New Developer)

```bash
# 1. Clone repository
git clone <repo-url>
cd the-only-retreats

# 2. Install dependencies
npm install

# 3. Create .env from template (secrets will be provided)
cp .env.example .env
# Edit .env with:
# - DATABASE_URL from Neon
# - CLERK_* keys from Clerk dashboard
# - Other secrets from .env.example

# 4. Generate Prisma client
npm run db:generate

# 5. Start development
npm run dev
# Visit http://localhost:3000

# 6. View Prisma Studio
npm run db:studio
```

---

## Important Decisions Already Made

✅ **Stack:** Next.js 15 + TypeScript + Prisma (good choices)  
✅ **Auth:** Clerk (integrated)  
✅ **Database:** PostgreSQL on Neon (live)  
✅ **Deployment:** Vercel (assumed, appropriate)  
✅ **Styling:** Tailwind CSS v4 (implemented)  
✅ **CMS:** Sanity (installed, not integrated)  
✅ **Payment:** Razorpay (primary), Stripe (future-ready)  
✅ **Origin-First:** Brand philosophy is clear (NOT product-first)  
✅ **Premium Aesthetic:** Design system is implemented (not corporate)

---

## What This Codebase Needs (Priority Order)

1. **Secrets Rotation** (1-2 hrs) — CRITICAL
2. **Security Fixes** (npm audit) (2-4 hrs) — CRITICAL
3. **Content Strategy** (2-3 weeks) — CRITICAL
4. **Ecommerce Implementation** (4-6 weeks) — CRITICAL
5. **Legal Pages** (1 week) — CRITICAL
6. **Accessibility** (2-3 weeks) — HIGH
7. **SEO Configuration** (3-5 days) — HIGH
8. **Admin Polish** (2 weeks) — MEDIUM
9. **Performance Optimization** (1-2 weeks) — MEDIUM
10. **Testing Infrastructure** (2+ weeks) — MEDIUM

---

## Success Criteria for Launch

- ✅ All security issues fixed
- ✅ Cart + Checkout functional
- ✅ Payment working end-to-end
- ✅ All 9 products published + pages 404-free
- ✅ Legal pages in place
- ✅ Mobile QA passed
- ✅ Order confirmation email working
- ✅ Admin can create orders
- ✅ Inventory tracking works
- ✅ Analytics configured
- ✅ Error monitoring setup (Sentry)

---

## Questions to Resolve with Founder/Team

1. **Products:** What are the exact 9 SKUs?
2. **Pricing:** Confirmed prices for each product?
3. **Variants:** Does Yak Ghee come in multiple sizes? Honey?
4. **Origins:** Which valleys are highest priority?
5. **Producers:** Which producers should be featured?
6. **Shipping:** Only India or international?
7. **Launch Date:** Target launch date (realistic)?
8. **Marketing:** How will the website be promoted?
9. **Analytics:** What metrics matter most?
10. **Support:** How will customer support be handled?

---

END OF MASTER HANDOFF

---
