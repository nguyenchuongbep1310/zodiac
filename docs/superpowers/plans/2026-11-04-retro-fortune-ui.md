# Retro Fortune-Teller UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the violet-gradient "AI landing page" look of the AstroMind frontend with a Gen Z take on a vintage fortune-teller parlour: parchment paper, oxblood and gold, hard ink borders, tarot-card framing.

**Architecture:** Keep every `--am-*` CSS token name and re-point its values, so all pages re-theme at once; then rebuild the landing sections and UI primitives around a small set of retro components (`TarotCard`, `Stamp`, `Ornament`). Behaviour, routes, i18n structure and API calls do not change.

**Tech Stack:** Next.js 16 (App Router, `frontend/`), Tailwind v4, `next/font/google`, Vitest, Playwright (`frontend/e2e`).

**Spec:** No separate spec exists. The Design Brief below is the spec; it carries the user's request (Vietnamese, 2026-11-04): *"sửa lại UI phù hợp với genZ hơn mang vibe cổ điển giống web coi bói, không giống giao diện của UI AI làm ra"*.

## Design Brief

**What "not AI-looking" means here** (each item is something the current UI does and the new one must not): gradient text, backdrop-blur glass, soft blurred colour blobs, violet/indigo palette, uniformly rounded 24–32px cards, bento grid, sparkle-icon pill badges, floating pill navbar, Inter-style neutral sans headings.

**What replaces it:**
- **Paper:** parchment background with a faint grain overlay; cards are slightly lighter paper.
- **Ink:** 2px solid ink borders and hard offset shadows (no blur) on cards, buttons and inputs; corner radius 4px, except round stamps.
- **Tarot framing:** feature cards and the hero chart are framed like tarot cards: inner double border, Roman numeral top, title strip bottom, small rotation (±1–2°) on desktop only.
- **Type:** chunky vintage slab for display, mono for labels/stamps, a readable sans for body.
- **Tone:** playful parlour-sign copy, Gen Z in English, casual-teen in Vietnamese; SEO titles and descriptions do not change.

## Global Constraints

- Fonts (via `next/font/google`, all must include the `vietnamese` subset): display `Alfa Slab One` (CSS var `--font-display`), body `Be Vietnam Pro` weights 400/500/600/700 (`--font-body`), labels `Space Mono` weights 400/700 (`--font-mono`).
- Token values (names unchanged, plus three new: `--am-edge`, `--am-gold`, `--am-teal`):

  | token | light | dark |
  |---|---|---|
  | `--am-bg` | `#f3e6c8` | `#170e0b` |
  | `--am-surface` | `#fbf4e0` | `#241713` |
  | `--am-field` | `#fff8e6` | `#2d1d17` |
  | `--am-ink` | `#1c1410` | `#f3e6c8` |
  | `--am-muted` | `#5e4b3c` | `#c4ad8e` |
  | `--am-primary` | `#8b1e1e` | `#e0a526` |
  | `--am-primary-ink` | `#fbf4e0` | `#170e0b` |
  | `--am-sunset` | `#d9452b` | `#ef6a4c` |
  | `--am-gold` | `#d9a521` | `#e0a526` |
  | `--am-teal` | `#1f5148` | `#6fb8a6` |
  | `--am-lilac` (gold tint) | `#ead7a8` | `#3b2c14` |
  | `--am-peach` (rose tint) | `#f0c9b5` | `#4a2419` |
  | `--am-mint` (green tint) | `#c5d9c0` | `#1d3a33` |
  | `--am-line` | `rgba(28,20,16,0.25)` | `rgba(243,230,200,0.22)` |
  | `--am-edge` (hard borders) | `#1c1410` | `#e8d3a0` |

- Contrast: `ink`/`bg`, `ink`/`surface`, `muted`/`bg`, `muted`/`surface`, `primary-ink`/`primary` must each be ≥ 4.5:1 in both themes. `--am-sunset` is decoration and large text only.
- Hard shadow: `4px 4px 0 var(--am-edge)`; pressed state `1px 1px 0 var(--am-edge)` with `translate(3px, 3px)`. Borders: `2px solid var(--am-edge)`. Radius: `4px` (`--am-radius`).
- Forbidden on landing and shared components: `background-clip: text`, `backdrop-filter`, `blur-3xl`, any colour with a hue between 250° and 290° as a brand colour.
- Motion: marquee and any rotation/hover transform are disabled under `prefers-reduced-motion: reduce`; card rotation is applied only at `min-width: 768px`.
- No horizontal scroll at 320px width on `/`, `/vi`, `/learn`, `/synastry`.
- Vietnamese: display text `line-height` ≥ 1.15 so stacked diacritics are not clipped.
- Git: this repo has unrelated uncommitted backend changes. Every commit uses `git add <named paths>`, never `git add -A` or `git add .`. Work on branch `ui/retro-fortune`.
- Commands run from `frontend/` unless stated. E2E: `npm run test:e2e:frontend` (no Docker) and `npm run test:e2e` (full).

## Review Focus

1. Vietnamese diacritics at display size in Alfa Slab One (e.g. "Để các vì sao kể hết cho bạn") must not be clipped or collide between lines — pinned in Task 1 (line-height) and Task 4 (hero h1 box has no clipping).
2. Dark mode contrast of the gold primary button and muted text on dark paper — pinned by the contrast unit test in Task 1.
3. Very long names (100 chars, the API limit) typed into the name field must not break the tarot card title or the ticket layout — Task 4.
4. Rotated cards and hard shadows at 320px must not cause horizontal scroll — Task 5 (rotation is desktop-only) and the existing mobile overflow test.
5. `prefers-reduced-motion` must stop the marquee and remove card tilt — Task 5.

---

### Task 1: Design tokens, fonts, paper grain, and design guard tests

**Files:**
- Modify: `frontend/app/globals.css` (the `--am-*` blocks and `.am-gradient-text`, `.am-marquee`; the `--wheel-*` blocks; `--font-sans`/`--font-display` in `@theme`)
- Modify: `frontend/app/[lang]/layout.tsx` (font imports and variables; `themeColor`)
- Create: `frontend/lib/design/contrast.ts`, `frontend/lib/design/contrast.test.ts`
- Create: `frontend/e2e/frontend/design.e2e.ts`

**Interfaces:**
- Produces: CSS tokens per Global Constraints; utility classes `.paper-grain` (applied on `<body>`), `.ink-border`, `.hard-shadow`, `.hard-shadow-sm`, `.mono-label`; fonts as `--font-display`, `--font-body`, `--font-mono`; `contrastRatio(fg: string, bg: string): number` (hex in, WCAG ratio out) and `readTokens(css: string, theme: "light" | "dark"): Record<string, string>` in `lib/design/contrast.ts`.

- [ ] **Step 1: Write the failing unit test** `lib/design/contrast.test.ts`: read `app/globals.css` with `fs`; for both themes assert `contrastRatio(ink, bg)`, `(ink, surface)`, `(muted, bg)`, `(muted, surface)`, `(primaryInk, primary)` are each ≥ 4.5; assert `readTokens(css,"light")["--am-bg"] === "#f3e6c8"` and the dark `--am-bg` is `#170e0b`.
- [ ] **Step 2: Run** `npx vitest run lib/design` — Expected: FAIL (`contrast` module missing).
- [ ] **Step 3: Implement** `contrast.ts` (WCAG relative-luminance formula; `readTokens` parses the `:root` block for light and the `.dark` block for dark, resolving only plain hex values).
- [ ] **Step 4: Write the failing e2e** `design.e2e.ts` (project `frontend`, `test.use({ colorScheme: "light" })`): on `/` assert (a) `getComputedStyle(body).backgroundColor === "rgb(243, 230, 200)"`; (b) the `h1` computed `fontFamily` contains `Alfa Slab One` and `parseFloat(lineHeight)/parseFloat(fontSize) >= 1.15`; (c) `document.fonts.check('16px "Space Mono"')` is true after `document.fonts.ready`; (d) over all elements, zero have `backgroundClip === "text"`, zero have `backdropFilter !== "none"`; (e) the same `h1` check on `/vi`.
- [ ] **Step 5: Run** `npm run test:e2e:frontend -- e2e/frontend/design.e2e.ts` — Expected: FAIL.
- [ ] **Step 6: Implement.** Replace token values (including `--wheel-*`: borders and glyphs use `--am-edge`/`--am-ink` equivalents as plain colours, tracks use `--am-lilac`); delete `.am-gradient-text` (Hero and HowItWorks still reference it until Tasks 4 and 5; an unknown class only drops the effect) and keep `.am-marquee` (retimed in Task 5). Add the utility classes from Interfaces. Add `.paper-grain::before` (fixed, full-screen SVG `feTurbulence` data-URI, opacity 0.07 light / 0.05 dark, `pointer-events: none`, `z-index: 0`, `mix-blend-mode: multiply` in light only). In `layout.tsx` swap Bricolage for `Alfa_Slab_One` and add `Space_Mono`; set `themeColor` to `#f3e6c8` / `#170e0b`; add `paper-grain` to `<body>`. Update `@theme` `--font-display`/`--font-sans`/`--font-mono` to the new vars. Existing `font-display font-extrabold` usages must keep working (Alfa has a single weight: add `font-synthesis: none` on `.font-display`).
- [ ] **Step 7: Run** `npx vitest run && npm run test:e2e:frontend` — Expected: PASS except tests that assert old copy (fixed in Task 7). Note which fail; none may fail for layout reasons.
- [ ] **Step 8: Commit** `git add frontend/app/globals.css "frontend/app/[lang]/layout.tsx" frontend/lib/design frontend/e2e/frontend/design.e2e.ts && git commit -m "feat(ui): retro parchment tokens, slab/mono fonts, design guard tests"`

### Task 2: Shared UI primitives

**Files:**
- Modify: `frontend/components/ui/Button.tsx`, `Card.tsx`, `Input.tsx`, `Badge.tsx`, `Toast.tsx`, `Spinner.tsx`, `Accordion.tsx`
- Create: `frontend/components/ui/TarotCard.tsx`, `Stamp.tsx`, `Ornament.tsx`
- Test: `frontend/e2e/frontend/design.e2e.ts` (extend)

**Interfaces:**
- Produces:
  - `TarotCard({ numeral, title, tilt = 0, className, children }: { numeral: string; title: string; tilt?: number; className?: string; children: ReactNode })` — outer ink border + inner double border, numeral top-centre in `font-mono`, title strip bottom, `children` in the body. Tilt applies `rotate(${tilt}deg)` only at `md:` and up and not under reduced motion.
  - `Stamp({ children, className }: { children: ReactNode; className?: string })` — round, 2px dashed edge, `font-mono` uppercase, rotated −8°.
  - `Ornament({ className }: { className?: string })` — horizontal rule with a centred `✦` between two lines, `aria-hidden`.
- Consumes: tokens and utilities from Task 1.

- [ ] **Step 1: Write failing e2e** in `design.e2e.ts`: on `/`, the primary submit button has a 2px border, `box-shadow` matching `4px 4px 0` and `border-radius <= 6px`; pressing it (`mouse.down`) changes its transform.
- [ ] **Step 2: Run** the file — Expected: FAIL.
- [ ] **Step 3: Implement** the primitives: `Button` variants `primary` (primary bg, edge border, hard shadow, active translate), `secondary` (surface bg), `ghost`, `danger`, `gold` (gold bg); sizes keep their names. `Card` = surface bg, edge border, `hard-shadow` when `glow`, no blur. `Input` = field bg, edge border, focus shows a 3px primary outline offset 2px (never `outline: none` without replacement). `Badge`/`Toast`/`Spinner`/`Accordion` swap to tokens and square corners.
- [ ] **Step 4: Run** `npx tsc --noEmit && npm run test:e2e:frontend -- e2e/frontend/design.e2e.ts` — Expected: PASS.
- [ ] **Step 5: Commit** the named `components/ui` files and `design.e2e.ts`: `feat(ui): ink-border primitives and TarotCard/Stamp/Ornament`.

### Task 3: Navbar, brand mark and footer

**Files:**
- Modify: `frontend/components/landing/FloatingNavbar.tsx`, `FooterEnhanced.tsx`, `frontend/components/ui/BrandLogo.tsx`
- Test: `frontend/e2e/frontend/design.e2e.ts`, existing `layout.mobile.e2e.ts`

**Interfaces:**
- Consumes: `Ornament`, `Stamp`, `Button` from Task 2.
- Produces: unchanged public API of `FloatingNavbar`, `FooterEnhanced`, `BrandLogo({ className, iconOnly, size, onClick })`.

- [ ] **Step 1: Write failing e2e**: the `<header>` is full-width (its width equals the viewport), has a 2px bottom border and no `border-radius` above 6px; footer background equals `--am-ink` in light mode.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement.** Navbar: solid `--am-surface` bar pinned to the top, ink bottom border, links in `font-mono` uppercase, language switch as two square segmented buttons, theme toggle as a square button, mobile drawer keeps its behaviour (scroll-lock, Escape) with new styling. `BrandLogo`: replace the gold-sparkle circle with an inline SVG sun-and-eye emblem in `--am-ink`/`--am-gold`; wordmark "AstroMind" in `font-display`. Footer: `--am-ink` background, `--am-bg` text, `Ornament` above the columns, links in `font-mono`; keep the 4-column grid and all links via `localeHref`.
- [ ] **Step 4: Run** `npm run test:e2e:frontend` (focus on `design`, `layout.mobile`, `i18n-routing`) — Expected: PASS.
- [ ] **Step 5: Commit**: `feat(ui): ticket-style navbar, sun-eye brand mark, parlour footer`.

### Task 4: Hero — tarot card and ticket form

**Files:**
- Modify: `frontend/components/landing/HeroSection.tsx`
- Test: `frontend/e2e/frontend/design.e2e.ts`, `landing.e2e.ts`

**Interfaces:**
- Consumes: `TarotCard`, `Stamp` (Task 2). Form state, handlers and element ids `#hero-name`, `#hero-date`, `#hero-time`, `#hero-city`, `#hero-house` do not change.
- Produces: i18n keys unchanged (`home.hero.*`); the title split on `"|"` stays (lead / highlight).

- [ ] **Step 1: Write failing e2e**: at 1280px the hero shows a tarot card containing the chart wheel (`role="img"` name `Natal chart wheel preview`) and the form inside an element with a dashed perforation (`border-style: dashed` on a divider); the highlighted title part has a solid background (highlighter), not a gradient; typing 100 characters into `#hero-name` leaves `document.documentElement.scrollWidth <= innerWidth`.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement.** Left: eyebrow as a `Stamp`-style ticket line ("ADMIT ONE · FREE"/Vietnamese equivalent from Task 7 keys), h1 with the highlight part on a gold marker background (`bg-[var(--am-gold)]`, slight skew), body copy, trust line with a plain `✓`. Right: the form as a ticket (surface paper, edge border, hard shadow, perforated divider under the title, notched side corners via radial-gradient masks), the "Create" button primary. The decorative chart SVG moves into a `TarotCard` (numeral "I", title "THE BIRTH CHART") shown from `lg:` up, with `role="img"` and `aria-label="Natal chart wheel preview"`; it uses `currentColor` ink strokes and gold/vermilion accents, no gradients.
- [ ] **Step 4: Run** `npm run test:e2e:frontend` — Expected: PASS (copy-dependent assertions are handled in Task 7).
- [ ] **Step 5: Commit**: `feat(ui): tarot-card hero with ticket form`.

### Task 5: Landing sections — spread, steps, menu, ticker, articles, FAQ, CTA

**Files:**
- Modify: `frontend/components/landing/ZodiacMarquee.tsx`, `BentoFeatures.tsx` (keep file and export name), `HowItWorks.tsx`, `CapableSection.tsx`, `LearnSection.tsx`, `LearnArticleCard.tsx`, `FaqAccordion.tsx`, `ReadYourSkyCTA.tsx`; `frontend/app/[lang]/page.tsx` (section order and wrappers only)
- Test: `frontend/e2e/frontend/design.e2e.ts`, `layout.mobile.e2e.ts`

**Interfaces:**
- Consumes: `TarotCard`, `Stamp`, `Ornament`; existing i18n keys (`home.bento.*`, `home.steps.*`, `home.capable.*`, `home.learn.*`, `home.faq.*`, `home.cta.*`).
- Produces: section ids `#hero #features #how-it-works #astrology #learn #faq` unchanged (e2e and nav links depend on them).

- [ ] **Step 1: Write failing e2e**: on `/` at 1280px, `#features` contains exactly 5 elements with `data-tarot`, at least one with a non-zero rotation; at 375px none have rotation; with `page.emulateMedia({ reducedMotion: "reduce" })` the marquee element's `animationName` is `none` and no `[data-tarot]` has a rotation; zero elements on the page have `border-radius > 24px` except those matching `.stamp`.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement.** Ticker: a full-width ink band with ✦-separated sign names in `font-mono`, scrolling (40s linear) — same duplicated-row technique. Features: five `TarotCard`s (numerals I–V, tilts −2, 1.5, −1, 2, −1.5) in a flex-wrap spread, card art is a large glyph (☉ ☽ ♀ ☊ ☍), each card carries `data-tarot`. HowItWorks: three steps with Roman numerals in a round `Stamp`, connected by a dashed line. Capable: a "service menu" — rows with name, dotted leader, and a `font-mono` tag ("0đ" in Vietnamese / "FREE" in English) in place of price, plus a one-line description. Learn: article cards as paper cards with ink border and hard shadow, category as a mono label. FAQ: ruled list (ink rules, `+`/`−` as plain glyphs) instead of pill cards. CTA: full-bleed oxblood block (gold in dark) with `Ornament`, huge slab headline, square button.
- [ ] **Step 4: Run** `npm run test:e2e:frontend` — Expected: PASS apart from copy assertions.
- [ ] **Step 5: Commit**: `feat(ui): tarot spread, service menu, ticker and retro landing sections`.

### Task 6: Inner pages and chart colours

**Files:**
- Modify: `frontend/app/[lang]/(app)/layout.tsx`, `(app)/synastry/_components/SynastryClient.tsx`, `PersonForm.tsx`, `(app)/charts/[id]/_components/ChartViewerClient.tsx`, `(app)/learn/LearnPageContent.tsx`, `frontend/components/landing/LearnPageLayout.tsx`, `LearnCategoryFilter.tsx`, the seven article `page.tsx` files under `(app)/learn/`, `contact/page.tsx`, `privacy/page.tsx`, `terms/page.tsx`, `not-found.tsx`, `error.tsx` files, `frontend/components/chart/*Table.tsx`, `AspectGrid.tsx`
- Test: `frontend/e2e/frontend/design.e2e.ts`, `e2e/fullstack/birth-chart.e2e.ts`

**Interfaces:**
- Consumes: primitives from Task 2. No prop or route changes.

- [ ] **Step 1: Write failing e2e**: for each of `/learn`, `/learn/birth-chart/sun-moon`, `/synastry`, `/contact`, `/privacy`, `/404-page`: zero elements with `backdropFilter`, `backgroundClip: text`, or `border-radius > 24px` (stamps excepted), and the page background is `rgb(243, 230, 200)`.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement.** Replace remaining `rounded-[2rem]`/`rounded-3xl`, `dark:` colour pairs, `amber-*`/`violet-*`/`slate-*` accent classes (article colour maps become `teal`/`gold`/`sunset` tokens) with token-based ink-border cards. Synastry stepper becomes numbered stamps; the result score card becomes a ticket. Chart wheel stays functionally identical (only `--wheel-*` values change in Task 1).
- [ ] **Step 4: Run** `npm run test:e2e` (full, Docker running) — Expected: PASS (copy assertions aside).
- [ ] **Step 5: Commit**: `feat(ui): retro theme for learn, synastry, chart, legal and error pages`.

### Task 7: Copy and test strings (EN + VI)

**Files:**
- Modify: `frontend/lib/i18n/dictionaries.ts` (the keys below, both `en` and `vi`)
- Modify: `frontend/e2e/frontend/landing.e2e.ts`, `i18n-routing.e2e.ts`, `frontend/e2e/fullstack/birth-chart.e2e.ts`

**Interfaces:**
- Produces (exact strings; `|` splits lead and highlight in `home.hero.title`):

  | key | en | vi |
  |---|---|---|
  | `home.hero.eyebrow` | `Admit one · free · no appointment` | `Một vé · miễn phí · không cần hẹn` |
  | `home.hero.title` | `Let the stars \| spill the tea` | `Để các vì sao \| kể hết cho bạn` |
  | `home.hero.btn_submit` | `Read My Chart` | `Xem Bản Đồ Của Tôi` |
  | `home.cta.title` | `Your sky's been talking. Listen up.` | `Bầu trời đã nói rồi. Nghe thôi.` |
  | `home.cta.button` | `Read My Chart` | `Xem Bản Đồ Miễn Phí` |
  | `home.steps.title` | `Three steps. No crystal ball.` | `Ba bước. Không cần quả cầu pha lê.` |
  | `home.bento.title` | `Pull a card. Any card.` | `Rút một lá đi nào.` |

  All other keys, and all SEO titles/descriptions in `lib/seo.ts`, stay as they are.

- [ ] **Step 1: Update the tests first.** In `landing.e2e.ts` and `birth-chart.e2e.ts` replace the button name `"Reveal My Chart"` with `"Read My Chart"` and the h1 text check `"Your birth chart"` with `"Let the stars"`; in `i18n-routing.e2e.ts` replace `"Bản đồ sao của bạn"` with `"Để các vì sao"` and `"Your birth chart"` with `"Let the stars"`; the Vietnamese hero button check in `birth-chart.e2e.ts` stays `"Xem Bản Đồ Của Tôi"`.
- [ ] **Step 2: Run** `npm run test:e2e:frontend` — Expected: FAIL on the new strings.
- [ ] **Step 3: Edit the dictionary** with the table above.
- [ ] **Step 4: Run** `npm run test:e2e` (full) — Expected: all PASS.
- [ ] **Step 5: Commit**: `feat(copy): parlour-sign microcopy in English and Vietnamese`.

### Task 8: Social image, manifest and final verification

**Files:**
- Modify: `frontend/app/[lang]/opengraph-image.tsx`, `frontend/app/manifest.ts`
- Test: `frontend/e2e/frontend/seo.e2e.ts` (existing), `design.e2e.ts`

**Interfaces:**
- Consumes: palette from Global Constraints.

- [ ] **Step 1: Write failing test** in `design.e2e.ts`: `GET /manifest.webmanifest` has `theme_color === "#8b1e1e"` and `background_color === "#f3e6c8"`.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement.** Manifest colours per the test. OG image: parchment background, oxblood slab headline "Let the stars spill the tea", gold ✦ ornament row, ink border; no gradient. Keep size 1200×630 and the existing `alt` export.
- [ ] **Step 4: Verify everything:** `npx eslint app components lib e2e && npx tsc --noEmit && npx vitest run && npm run build && npm run test:e2e` — Expected: no ESLint errors, 71+ unit tests pass, build exits 0, all e2e pass.
- [ ] **Step 5: Look at it.** Run `npm run test:e2e:headed`, and open `/`, `/vi`, `/learn`, `/synastry` in light and dark at 1280px and 375px; confirm none of the forbidden items in the Design Brief appears.
- [ ] **Step 6: Commit**: `feat(ui): retro OG image and manifest colours`.
