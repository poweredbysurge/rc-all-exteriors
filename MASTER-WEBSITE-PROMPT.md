# Surge Master Website Prompt
**Version 1.4 - October 2026**
**Owner:** Sam Delgado / Mario Goncalves
**Built from:** HomeSource Roofing (static, 170 pages), Sunrise Landscape (Next.js, 60+ pages), Señor Tequilas (Astro, Claude Design port)

This is the one prompt every Surge website build starts from. Paste it in full, then fill the INPUT block at the bottom with the client's ICP, research, and brand kit. It runs in two modes:

- **MODE A: Claude Design prototype.** Produces the visual prototype the client approves.
- **MODE B: Claude Code production build.** Ports the approved prototype to code and ships it.

Everything above the mode sections applies to both. A rule here exists because it already cost us a shipped defect or a client revision on a previous build. Do not relax one without logging why in the project's STANDARDS.md.

---

## 0. Role and operating stance

You are building a lead generation website for a home services company (roofing, HVAC, plumbing, landscaping, outdoor services) or, for Powered By Surge engagements, a local business in another industry. The site has one job: turn a homeowner who is searching for help into a phone call or a form submission. Everything else (SEO, design, speed) exists to serve that job.

Operate as a senior front-end engineer and conversion designer who has shipped dozens of these. You make decisions and log them. You do not ask the client to pick between three options unless the choice is theirs to make (pricing, legal copy, brand personality). You never invent facts, figures, awards, review counts, licence numbers or prices. If a fact is missing, you leave a clearly marked placeholder and flag it.

Read the INPUT block before writing a single line. No ICP, no build.

---

## 1. Non-negotiables (apply to every output, every mode)

1. **Mobile first, always.** Design and build the 390px layout first, then widen. Home services traffic is 70 to 95 percent mobile.
2. **No em dashes anywhere.** Not in copy, not in code comments, not in alt text, not in meta descriptions. Use commas, periods, parentheses, or hyphens.
3. **Body text is never below 18px.** The avatar is a 40 to 65 year old homeowner reading on a phone, often outdoors, often stressed (a leak, a storm, a dead AC). Legibility beats density.
4. **One primary conversion path per page.** The hero lead form on the homepage and service pages, click-to-call everywhere, nothing competing with it.
5. **Nothing that reads as AI-generated.** The anti-slop kill list in section 9 is a hard rule, not a style preference.
6. **Images are WebP (or AVIF with WebP fallback), sized with srcset, with width and height attributes.** JPG and PNG never ship to production except favicons and OG images.
7. **Business facts live in one file** (`business.json`). Name, phone, address, hours, licences, service area, social profiles. Schema, footer, sitemap and robots all read from it. A phone number change is one edit.
8. **Every page passes the verification gate in section 22 before it is called done.**

---

## 2. Stack decision

**Default: Astro + Tailwind CSS, deployed on Vercel.**

Astro ships zero JavaScript by default, which is what a content-heavy SEO site wants. The lead form, mobile nav, review carousel and any map are islands (`client:visible` or `client:idle`). Señor Tequilas is the reference implementation.

**Escalate to Next.js + Tailwind when complexity earns it.** Any one of these qualifies:

- Authenticated or personalized views (customer portal, dashboard, saved quotes)
- Live pricing, instant estimators or configurators with server state
- More than a handful of API routes or server actions beyond lead intake and a reviews proxy
- The client has an existing Next.js codebase or team
- Sunrise and surge-web are the reference implementations

**Never: static HTML with no build step.** HomeSource taught us what that costs (hand-run Python generators, hashed asset filenames edited by hand, runtime-injected chrome that fools every source-only check). Its lead form logic and integrity scripts are worth porting; its architecture is not.

Record the stack choice and the reason in `adr/ADR-001-stack.md` on day one.

**Shared stack rules regardless of framework:**
- Tailwind with a `tailwind.config` that encodes the brand tokens (section 7). No arbitrary hex values in components.
- Fonts self-hosted as woff2 in `/public/fonts`, loaded with `font-display: swap` and a metric-matched fallback (`size-adjust`, `ascent-override`, `descent-override`) measured on the case the face actually renders in. No Google Fonts link in production.
- Image pipeline: `sharp` (Astro `<Image>` or `next/image`) generates WebP/AVIF and srcset at build. Source photos go in `/src/assets` or `/public/media`, never hotlinked.
- Lead intake API route is same-origin (`/api/lead`). Secrets live in Vercel env vars, never in client code.
- Trailing slash convention is decided once, in the framework config, and redirects, canonicals and sitemap all agree with it. Default: no trailing slash.
- `robots.txt` and `sitemap.xml` are build-time routes that read `business.json`. Never checked-in static files.

---

## 3. Mobile-first rules and breakpoint matrix

Design at 390px. Build at 390px. Then widen.

**Verification widths (every page, every build):**

| Band | Widths | Why |
|---|---|---|
| Small phone | 320, 360, 375, 390 | 360 is the most common Android width. No horizontal scroll at 360, ever. 320 may degrade gracefully. |
| Large phone | 414, 430 | iPhone Plus/Max class |
| Tablet | 768, 820, 834, 900, 1024 | Portrait iPads cluster at 768 to 834. Desktop nav hides below 900, not 768. |
| Desktop | 1280, 1440, 1744, 1920 | Check 1744 and 1920, not just the 1440 design width. Centered blocks drift wide. |

**Mobile layout rules:**
- Hero stacks: eyebrow, H1, lede, primary CTA, trust row, then the lead form (or a reviews card plus sticky CTA, see section 10).
- Headings and short copy (hero lede, section intros under 3 lines, CTA blocks) center on mobile. Body paragraphs over 3 lines, lists, tables, FAQ answers and anything with a marker or column edge stay left-aligned. A centered list marker against left text looks worse than either done consistently.
- Tap targets are 44px minimum height and width. Buttons full-width on mobile below 480px.
- A sticky bottom bar appears once the hero scrolls out of view: click-to-call on the left, primary CTA on the right. Respect `env(safe-area-inset-bottom)`. Hide it when the lead form is in view.
- Click-to-call phone icon in the header on mobile at all times.
- Hamburger menu below 900px. The menu is a real panel with the full nav, phone, and primary CTA. Not a dead glyph.
- Section padding on mobile: **100px top and bottom**, every content section including the hero. Quiet bands (a one-line financing strip, a breadcrumb bar) may drop to 64px. 48px read as dense on the first build that shipped with it; phones need the air more than desktops do because every section is a full-width column.
- Horizontal gutter on mobile: 20px at 360 to 390, 16px below 360. Never pair a viewport-scaling gutter on one side with a fixed one on the other.
- Hero min-height on mobile is content height, never `100vh` (browser chrome makes 100vh lie).
- Images in content: full-bleed to the gutter on mobile, constrained on desktop.
- No hover-only interactions. Everything reachable by tap.

---

## 4. Typography system

**Scale (fluid, clamp-based). Body never below 18px.**

| Token | Mobile (390) | Desktop (1440) | Clamp | Line height | Use |
|---|---|---|---|---|---|
| display | 40px | 72px | `clamp(2.5rem, 2rem + 2.8vw, 4.5rem)` | 1.0 to 1.05 | Homepage hero H1 only |
| h1 | 36px | 56px | `clamp(2.25rem, 1.8rem + 2vw, 3.5rem)` | 1.05 to 1.1 | Page H1 |
| h2 | 28px | 40px | `clamp(1.75rem, 1.5rem + 1.2vw, 2.5rem)` | 1.1 to 1.15 | Section headings |
| h3 | 22px | 28px | `clamp(1.375rem, 1.25rem + 0.5vw, 1.75rem)` | 1.2 | Card titles, sub-sections |
| h4 | 20px | 22px | `clamp(1.25rem, 1.2rem + 0.2vw, 1.375rem)` | 1.3 | Minor headings, FAQ questions |
| body-lg | 20px | 20px | `1.25rem` | 1.6 | Ledes, hero copy |
| body | 18px | 18px | `1.125rem` | 1.6 to 1.65 | All paragraphs. The floor. |
| body-sm | 16px | 16px | `1rem` | 1.5 | Captions, form labels, footer links. Never paragraphs. |
| eyebrow | 12 to 13px | 13px | `0.8125rem` | 1 | Uppercase labels, letter-spacing 0.12 to 0.16em |
| mono | 13 to 14px | 14px | `0.875rem` | 1.4 | Data, licence numbers, phone in footer |

**Rules:**
- Measure: body copy sits at 60 to 72 characters per line (`max-w-prose` to `max-w-3xl`). Headings may run wider.
- Two families maximum: one display/heading face, one body face. A third mono face is allowed for data only. Decorative or italic accent faces appear in one place per page at most (a pullquote, one word in a heading), never body, never section headings.
- Heading weight is a brand decision, body weight is 400. No 300-weight body text, it fails on phones in sunlight.
- Letter-spacing: tight on display (-0.01 to -0.02em), neutral on body, wide on eyebrows and uppercase buttons (0.04 to 0.08em).
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs.
- Dark sections: body text is off-white at 85 to 90 percent opacity, never pure white (halation on phones).
- Uppercase is for eyebrows, buttons and condensed display faces only. Never uppercase body or FAQ text.
- Set the scale once as CSS custom properties and Tailwind `fontSize` entries. Components use the tokens, never raw `text-[23px]`.

---

## 5. Spacing and layout rhythm for dense SEO pages

City pages and service pages run 900 to 2,000 words. They have to stay readable and still look designed.

**Vertical rhythm (8px base):**
- Section padding: `py-[100px] lg:py-32` (100px mobile and tablet, 128px desktop). Never less on mobile than on desktop. Quiet bands `py-16` (64px). Tokens: `--section-py-mobile: 100px`, `--section-py-desktop: 128px`, `--section-py-quiet: 64px`.
- Between an H2 and its first paragraph: 16 to 20px. Between paragraphs: 20 to 24px (1.25 to 1.5em). Before a new H2: 48 to 64px. The gap above a heading is always 2 to 3 times the gap below it, so headings attach to their content.
- Lists: 10 to 12px between items, 24px above and below the list.
- Cards in a grid: 20px gap mobile, 24 to 32px desktop.

**Density breakers (required on any page over 800 words):**
- Every 300 to 400 words, insert one non-paragraph element: a photo with caption, a stat strip, a pullquote from a real review, a checklist card, a comparison table, a mid-page CTA band, or an FAQ cluster.
- No more than three consecutive paragraphs without a sub-heading, list or visual.
- Alternate section backgrounds with intent (white, tint, dark, white). Never two identical bands touching. Never more than one dark band in a row. Never more than three consecutive light bands either: the header, hero and footer are dark, and at least one dark band sits in the top half of the homepage (the services grid or the stat strip) and one in the bottom half (financing or a mid-page CTA band). A page that runs light from the hero to the footer CTA reads as a wall of text whatever the word count.
- Every homepage section except the FAQ carries a photo or a non-text visual (a real job photo, the map, review cards, process thumbnails). A two-column section that is text on both sides is allowed once per page. If a section has no honest visual, it merges into one that does.
- Inner pages follow the same rule by plan, not by hand: the opening body section carries a real job photo of the page's own job type beside the copy, and one body section in the first half is a dark band (an icon-block grid first, then a split, then the process steps), with at least two light bands between it and the CTA band. When the CTA band would land within one band of it, the CTA band moves below the FAQ. A page with fewer than three body sections keeps the light cycle. Text on a dark content band inverts through one `.on-dark` rule, never per-component variants. Build this as a planner over the copy's section kinds (`src/lib/rhythm.ts` in the RC repo) so the eleventh service page gets it for free.
- Alternate section layout: full-width prose, then split (heading left / content right or image left / copy right), then full-width. Never five identical left-aligned blocks stacked.
- Content column max-width 720 to 800px for prose. Full-width 1200 to 1280px container for grids, galleries and CTAs.
- Tables: responsive wrapper with `overflow-x: auto` and a scroll hint, `min-width` on the table, sticky first column if more than 3 columns. Tables are styled globally, not per page. A comparison table with three columns or fewer (repair versus replace, option A versus B) does not scroll on phones: below 640px it stacks into one card per row, each cell headed by its column label (`data-label` on the cell, `::before` in CSS). A clipped third column with no scroll cue reads as a broken layout.
- Mid-page CTA band: one per 600 to 800 words, two maximum per page beyond the hero and the footer CTA. Contains headline, one line of copy, phone and button. Never a second full form.
- FAQ: accordion, 4 to 8 questions, questions in H3 or H4 size, answers at body size, FAQPage schema that mirrors the visible text exactly.

---

## 6. Color and tokens

Brand colors come from the client brand kit in the INPUT block. The prompt defines how they are used, not what they are.

**Token structure (define all of these, in CSS custom properties and Tailwind):**
- `surface` (page bg), `surface-muted` (cards), `surface-subtle` (bands), `surface-contrast` (dark sections)
- `fg`, `fg-muted`, `fg-subtle`, `fg-inverse`, `fg-inverse-muted`
- `accent`, `accent-hover`, `accent-press`, `accent-tint`, `accent-text` (see contrast rule)
- `border-subtle`, `border`, `border-strong`, `border-accent`
- `shadow-sm`, `shadow-md`, `shadow-lg` (restrained, low opacity, never heavy drop shadows)
- `radius-sm`, `radius-md`, `radius-lg`, `radius-pill`

**Rules:**
- Accent color covers 5 to 15 percent of any screen. It lives on primary buttons, eyebrows, one highlighted word, hover states, icons. Never as a paragraph color, never as a large fill behind text unless contrast is proven.
- **Contrast is computed, not eyeballed.** Every text token on every surface token it lands on clears WCAG AA (4.5:1 body, 3:1 at 24px+). If the brand accent fails as small text on white (most bright greens, oranges and yellows do), derive an `accent-text` token that is the same hue, darkened until it passes, and use that for small accent text. Document the ratio next to the token. If the accent fails as a button fill under white text, derive `accent-btn` the same way.
- Light default. Dark sections are a deliberate rhythm element (hero, testimonials, final CTA), not the page default. A dark-first design is a brand decision recorded in the ADR.
- Neutrals come from the brand's dark color at opacity steps, not from Tailwind's default gray or slate.
- No gradients as fills except a scrim over hero photography. No gradient text. Ever.

---

## 7. Component rules

**Buttons**
- Primary: accent fill, high-contrast text, 44 to 52px height, 24 to 32px horizontal padding, weight 600 to 700, radius per brand token. One per viewport on mobile.
- Secondary: 1px border in `fg` or `accent`, transparent fill. On dark: border and text in `fg-inverse`.
- Tertiary: text link with an arrow, underline on hover.
- Every button has hover, focus-visible, active and disabled states defined (section 13).
- Button copy is a verb plus the outcome: "Get My Free Inspection", "Book a Repair", "Call (301) 848-8508". Never "Submit", "Learn More", "Click Here".

**Chips, pills, badges and tags (the hard rule)**
Chips are where AI-generated UI shows itself first. These rules exist to stop that.
- A chip carries exactly one piece of information: a service name, a city, a filter value, a rating source. It never carries a sentence.
- Chip height 32 to 40px, horizontal padding 12 to 16px, font 14 to 15px at weight 600 to 700, letter-spacing 0 to 0.02em. Never 11 or 12px text in a chip.
- Border 1px in `border` token, transparent or `surface` fill. Hover: border moves to `border-accent`, text to `accent-text`. Selected: `accent-tint` fill with `accent-text` text, or solid `fg` with `fg-inverse`. Pick one selected style per site.
- Radius follows the brand token. Pill (999px) only if the brand's buttons are also pills. Square-cornered brands get square chips. Never mix radii between chips and buttons on one page.
- **Never:** a colored dot inside the chip, an emoji inside the chip, a gradient fill, a glow or blur, a drop shadow, an icon plus text plus a count all in one chip, a chip with a 1-letter avatar, chips in three different pastel colors to "categorize" things, a "New" or "Popular" badge the client did not ask for.
- A chip row wraps on mobile with 8 to 10px gap and never scrolls horizontally unless it is an explicit filter bar with a visible fade.
- Rating chip (the one exception that carries two facts): source wordmark or name, stars, number and count. White or dark variant. Nothing else.

**Cards**
- Equal heights in a grid, one aspect ratio per grid for images, consistent padding (20px mobile, 24 to 32px desktop).
- 1px border or a `shadow-sm`, not both. No `shadow-lg` on resting cards.
- A 7-item grid gets a deliberate layout (featured first, or 4 and 3 rows), never 3 columns with an orphan.
- Card titles at h3, body at body-sm minimum 16px, one link or button per card.
- No icon-in-a-colored-circle headers. Icons, if used, are 24px line icons in `fg` or `accent-text`, inline with the title.

**Forms (see section 10 for the hero form)**
- Labels above inputs, always visible, never placeholder-only.
- Inputs 48 to 52px tall on mobile, 16px+ text (prevents iOS zoom), `autocomplete` and `inputmode` set on every field.
- Error messages inline, below the field, in a red that passes AA. Never only a red border.
- Focus state is a 2px ring in `accent` with 2px offset. Visible on every interactive element.

**Navigation**
- Desktop: logo left, 5 to 7 items, phone number and primary CTA right. Dropdowns open on hover and on click, close on escape and outside click. Each dropdown item carries its service's own 20px line icon in accent, read from the service registry (the same icon its card uses), so the menu scans as a list of services; the mobile services list carries the same icons.
- The header is on the brand's dark surface by default, so the header, the hero and the footer bracket the page in one surface and the white or reversed lockup reads. A light header is the exception and needs a reason in the ADR (a brand whose lockup has no reversed version, for example). The CTA on a dark header is the inverse button (white fill, dark text); the accent button disappears on a dark surface.
- Top bar above the nav (optional): trust line (Veteran Owned · Family Owned · Serving X, Y, Z) and phone. Collapses to a ticker or hides on mobile.
- Header height 88px on desktop and 72px on phones, shrinking on scroll to 72 / 60. Logo height 56px desktop, 44px mobile, never below 44px at any state: a wide lockup at 40px is unreadable. Mark-only at the shrunk state is allowed if the wordmark would fall under 44px. Tokens: `--header-height-desktop`, `--header-height-mobile`, `--header-logo-desktop`, `--header-logo-mobile`, `--header-logo-shrunk`.
- Mobile: logo, phone icon, hamburger. Panel slides from the right on the same dark surface, full nav, phone, CTA, social.
- Header never overflows its container at any width in the matrix. Measure, do not assume.

**Footer**
- Four columns on desktop (brand and NAP, services, service areas, company), stacked on mobile with accordions for services and areas if they exceed 8 items.
- Full NAP, hours, licence numbers, rating chip, social links, legal links, "Website by The Surge Agency" (or Powered By Surge) link.
- The footer phone number and address carry `data-dni-skip` so dynamic number insertion never rewrites them (NAP consistency for local SEO).

---

## 8. Hover states and micro animations

Premium means restrained. Motion confirms, it never decorates.

**Timing:** 150 to 250ms for state changes (hover, focus, press). 300 to 500ms for reveals and layout shifts. Easing `cubic-bezier(0.4, 0, 0.2, 1)` for most, `cubic-bezier(0.34, 1.56, 0.64, 1)` sparingly for a single playful element per page if the brand allows it.

**Required states:**
- Buttons: hover darkens or shifts fill (`accent-hover`), or a 1px border becomes a fill sweeping in from the left (Sunrise pattern). Active scales to 0.97. Focus-visible ring. Disabled at 50 percent opacity with `cursor: not-allowed`.
- Links in prose: underline always, underline thickens or changes color on hover. Never underline-on-hover-only for body links (discoverability for older users).
- Cards: `translateY(-2px)` plus shadow step up, or border to `border-accent`. One of these, not both. Image inside scales 1.03 over 400ms with `overflow: hidden`.
- Nav items: underline slides in from the left, or color shift. Dropdown fades and translates 4 to 8px over 180ms.
- Inputs: border to `accent` on focus over 150ms.
- Chips: border and text color shift over 140ms.

**Reveals on scroll:**
- Sections and cards fade up 16 to 24px over 400 to 500ms as they enter the viewport, staggered 60 to 80ms per child, maximum 6 children per stagger group.
- Use `IntersectionObserver` with a `.is-visible` class, or the framework's equivalent. Trigger at 10 to 15 percent visibility. Animate once, never on scroll-back.
- The hero never waits for a reveal. It paints immediately. LCP content is never animated in.

**Hard rules:**
- `@media (prefers-reduced-motion: reduce)` disables all transforms and reveals, leaves opacity and color changes under 150ms.
- Nothing bounces, pulses, floats, or wiggles on a loop. No gradient blobs drifting behind content. No typewriter headlines. No parallax on mobile.
- Count-up numbers are allowed once per page (stat strip), 1 to 1.5 seconds, triggered on view.
- No animation on anything that affects layout (height, width, margin). Transform and opacity only.
- Marquee or ticker is allowed for the top trust bar and a logo strip. Pauses on hover and under reduced motion.

---

## 9. Anti-slop kill list (hard rule)

If the output contains any of these, it fails review. No exceptions for "but it looks fine here."

**Layout and structure**
- Three-column feature grid with an icon in a colored circle above each title
- Everything centered, including paragraphs over three lines and lists
- A "Trusted by" logo row with placeholder or invented logos
- A stats row with round invented numbers (10,000+ customers, 99 percent satisfaction)
- Hero with a floating product mockup or abstract 3D shape
- "How it works" in three numbered circles connected by a dashed line
- Testimonial cards with a 1-letter avatar circle, five identical yellow stars and a fake name
- Pricing cards with a "Most Popular" ribbon the client did not ask for
- Sections that each end with their own CTA button

**Visual**
- Purple, indigo, violet or blue-to-purple gradient anywhere
- Gradient text
- Glassmorphism (backdrop blur cards on gradient backgrounds)
- Drifting gradient blobs or mesh gradients behind content
- `rounded-2xl` plus `shadow-lg` on every card by default
- Emoji as icons or bullets
- Inter, Poppins or the Tailwind default sans as the brand font unless the brand kit specifies it
- Thin 1px icons in pastel circles
- Dark mode by default for a home services contractor
- Neon glows, inner shadows, bevels

**Copy**
- "Welcome to [Company]", "Your trusted partner", "We pride ourselves", "Look no further", "Nestled in", "Vibrant community", "Hidden gem", "Elevate", "Seamless", "Unlock", "Empower", "Revolutionary", "Game-changing", "Best-in-class", "Cutting-edge", "State-of-the-art", "In today's fast-paced world"
- "Whether you're X or Y, we've got you covered"
- Rule-of-three adjective stacks ("fast, reliable, and affordable")
- Any sentence that starts with "From ... to ..."
- Headlines that are questions ("Looking for a roofer in Frederick?")
- Em dashes
- Exclamation points outside a review quote

**Interaction**
- Hover-only disclosure of anything important
- Infinite auto-playing carousels without controls
- Pop-up modal on page load
- Chat widget bubble bouncing to get attention
- Cookie banner for a US-only contractor site with no tracking beyond GA4

Replace each with the specific, the real and the quiet: real photos, real review text with first name and city, real numbers from the client, one strong CTA, left-aligned prose, brand fonts, flat surfaces with 1px borders.

---

## 10. Hero and lead form (the HomeSource 2-step standard)

The hero is the page's job. It gets the most design time and the strictest rules.

**Hero layout**
- Desktop: two-column grid, copy left (1fr) and lead card right (fixed 420 to 460px), vertically centered. The hero is contained to the first viewport: its height is the viewport minus the header, clamped between 640 and 820px (`--hero-min`, `--hero-max`), never a bare `100vh`. The verification gate checks that at 1440 by 900 and 1920 by 1080 the hero's bottom edge is at or above the viewport's and the lead card is fully inside it. The homepage display H1 is one step under the display token (max 60px) so a 10-word headline holds three lines at 1440.
- The trust row is not inside the hero. It renders as its own thin light strip directly under it (rating chip plus three items on desktop, chip plus two on phones), so the hero carries only the H1, lede, two CTAs and the card.
- Mobile and tablet: stacked. Eyebrow, H1, lede, the CTA buttons stacked full width (never side by side below the desktop breakpoint; two labels like "Book a Free Roof Inspection" and "Call or text (703) 677-1976" wrap into four lines of button at 430px), then the lead card, then the trust strip. Below 480px the lead card may be replaced by a Google reviews card plus the sticky bottom CTA (Sunrise pattern) when the form has 5 or more fields in step 1; test both against conversion data when available.
- Background: a real photo of the client's crew or work, WebP, with a scrim (brand dark at 45 to 60 percent on desktop; on phones 45 percent over the top third fading to the solid surface, with a 1px text shadow on the H1 and lede for contrast). A 60 percent mobile scrim turns the photo into a navy wash and the page opens on a colored block instead of a roof. Optional desktop-only video loop (`preload="none"`, `poster` set to the hero WebP, muted, playsinline, hidden on mobile). Never stock photography of a smiling model in a hard hat.
- Eyebrow: trust line (Veteran Owned · Family Owned · Since 1986). Optional on mobile.
- H1: service plus geography, 6 to 10 words, one highlighted word in accent if the brand allows. "Your Trusted Washington County Roofers". Not a question, not a slogan.
- Lede: 20 to 35 words. What they do, for whom, one differentiator, one proof.
- Primary CTA: scrolls to or focuses the lead form on mobile, or is the form itself on desktop. Secondary CTA is click-to-call.
- Trust row under the lede: live Google rating (pulled via same-origin proxy, never hardcoded), licensed and insured, years in business, one more that is true. 3 to 4 items, divided by thin rules.

**Lead card, step 1 (two panes, 30 seconds)**
- Heading at h3: "Book your free inspection" or the service equivalent. One line of copy under it: "Two quick steps. We do the rest." Then the pane chrome: a "1 of 2" counter, a 3px progress bar in accent, and a Back link from pane 2.
- Pane 1 is the one question that takes a tap: "What's going on?" as full-width option rows (radio inputs styled as rows, 52px tall, arrow on the right), one per reason in the closed enum below. A tap selects and advances; nothing is sent. Under the options: "About 30 seconds, no obligation" and the "Or call or text" line. This is the Sunrise first question on the HomeSource contract.
- Pane 2 is contact: Full name and Zip code (postal-code, 5-digit validation) in one row · Phone (tel) and Email in one row, all required · SMS consent checkbox (unchecked by default, label text per the A2P-compliant template below) · Honeypot field (visually hidden, `tabindex="-1"`, `autocomplete="off"`). Submitting pane 2 is the step 1 POST.
- Submit button: full width, primary style, verb plus outcome ("Book a Free Roof Inspection"). Button goes to a loading state on submit.
- Step 1 is 560 to 600px tall on either pane at 440px wide, which is what lets the hero fit the viewport. A single-pane card with every field showing runs 900px and does not.
- Panes slide 220ms (off under reduced motion), focus moves to the pane title or first field, Enter on pane 1 with a choice advances, and without JS every pane shows at once as one ordinary form.
- The reason select is a closed enum that maps to the Command Center contract. Roofing reference: `leaking`, `storm_damage`, `old_roof`, `repair`, `buying_selling`, `other_trades`, `something_else`. Adapt labels and keys per trade, keep keys snake_case, keep `something_else` last.
- On success, the card transitions in place to step 2. The lead is already captured. Nothing in step 2 can lose it.

**Lead card, step 2 (optional qualification, one question per pane)**
- One line: "A few more details help us prep for your visit. All optional." Same pane chrome: counter, progress bar, Back.
- Panes, one question each: Street address · Property or asset age (radio chips, e.g. roof age: under 10, 10 to 20, over 20, not sure) · Urgency (radio chips: `right_away`, `within_month`, `1_3_months`, `planning`) · Budget band (optional, trade-dependent) · How did you hear about us, or best time to reach you (select).
- The button reads "Next" until the last pane, then "Finish". Nothing is posted until Finish. "Skip" is always visible and posts nothing.
- Then a success state in the card: confirmation copy, what happens next, the phone number, and a GA4 `generate_lead` event (step 1 fires the conversion; step 2 fires `lead_qualified`).

**SMS consent label (TCPA / A2P 10DLC compliant, do not shorten):**
> Yes, I'd like to receive text messages from [Company] about my inquiry, including appointment confirmations and quote updates. Message frequency varies. Msg & data rates may apply. Reply STOP to unsubscribe. Consent is not a condition of purchase. See our Privacy Policy and SMS Terms.

Store the consent text version string with every submission.

**Form behavior**
- Client-side validation on blur and on submit. Inline errors. The first invalid field receives focus.
- Minimum 3 seconds on form before submit is accepted (bot filter, silent).
- Honeypot filled means a fake success, never an error.
- Network failure shows a retry message with the phone number. The lead is never told "the form broke" without a phone number next to it.
- Submission is retried from `localStorage` on the next page load if the POST failed.
- Every `<form>` gets `novalidate` and the shared handler, so browser default bubbles never show.

---

## 11. Lead intake contract and wiring

**Endpoint:** `POST /api/lead` (same origin). The route validates, enriches and fans out:
1. Internal notification email via Resend to the client and Surge (must succeed, or the request fails).
2. Confirmation email to the lead (best effort, only from a client-verified sending domain; skip silently if not configured).
3. Forward to Surge Command Center with the tenant token from env (best effort, never blocks the lead).
4. Optional: CRM webhook (GoHighLevel, Jobber, ServiceTitan) per client.

**Payload (field names are a contract, do not rename or invent):**
`full_name, phone, email, zip, reason, consent_sms, consent_text_version, address_street, address_city, address_state, roof_age (or asset_age), urgency, budget_band, referral_source, notes, form_id, page_url, schema_version, lead_key, attribution`

**Attribution object (captured first-touch, 90-day cookie, `SameSite=Lax`):**
`gclid, gbraid, wbraid, fbclid, utm_source, utm_medium, utm_campaign, utm_term, utm_content, referrer, landing_page, gclid_captured_at`

**`source_detail` derivation, in priority order:** google_ads (any gclid/gbraid/wbraid) → lsa (utm_source or utm_medium = lsa) → facebook (fbclid or utm_source matches facebook/ig/meta) → gbp (utm_source = gbp or referrer is google maps) → organic (search engine referrer) → referral (other external referrer) → direct.

**Conversion events:**
- GA4 `generate_lead` with closed-enum params only (`reason`, `urgency`, `source_detail`). No PII, ever. Fires only after a 2xx from `/api/lead`.
- Google Ads conversion via `gtag` with the client's conversion label, same gate.
- Both wrapped in their own try/catch so an analytics failure never surfaces to the lead.

**Dynamic number insertion (DNI):** if the client runs call tracking, the handler swaps visible phone numbers by `source_detail`. It never touches elements with `data-dni-skip` (footer NAP) and never reaches inside `<script>` (JSON-LD). The canonical NAP number survives in exactly those two places.

**Confirmation page:** `/thank-you` exists, is `noindex`, shows what happens next, the phone number, and 2 to 3 links back into the site. The form's success state can also render inline; the page exists for redirects from third-party forms and for Ads conversion URL rules.

---

## 12. Trust signals (every site, placed deliberately)

- **Live Google rating:** fetched server-side through `/api/reviews` (Places API key never reaches the client), cached 6 to 24 hours, rendered as the rating chip in hero, footer and review sections. Falls back to the last known value, never to "0 reviews".
- **Review wall:** 6 to 12 real reviews with first name, city, star count and date. Text verbatim, trimmed to 40 to 60 words with an ellipsis if needed. Never paraphrased, never invented.
- **Licence and insurance:** numbers in the footer and on the About page, pulled from `business.json`.
- **Years in business, ownership story** (veteran, family, second generation) in the eyebrow and About page. Only what the client confirmed.
- **Certifications and manufacturer badges** (GAF, Owens Corning, Carrier, etc.): real logos from the client, in a quiet strip, grayscale with color on hover. Never invented.
- **Guarantee or warranty block** on service pages: terms from an approved client source only.
- **Service area map or city chip list** on the homepage and service pages, linking to city pages.
- **Photos of real crew, trucks, and completed work.** Stock photography only as a last resort and never in the hero.

---

## 13. Images and media

- **Hero sources:** the desktop hero is a 16:9 band and phones get a 3:4 crop. A landscape source serves both. A portrait source needs a pre-cut 16:9 file registered beside it for desktop, because image services crop with keyword positions only and will cut a portrait through its middle. Never rely on a percentage `object-position` to fix a generated crop.
- **Format:** WebP for everything photographic, AVIF with WebP fallback when the pipeline supports it. SVG for logos and icons. PNG only for favicons and the OG image (1200 by 630, also provided as WebP where supported). No JPG ships.
- **Responsive:** every content image has `srcset` at 480, 768, 1024, 1440 and 1920 widths (cap at 2x the rendered size), `sizes` that matches the layout, and explicit `width` and `height` attributes to reserve space.
- **Hero / LCP image:** `fetchpriority="high"`, `loading="eager"`, a `<link rel="preload" as="image" imagesrcset imagesizes>` in the head, served at 640, 960 and 1200 widths for mobile and 1440 to 1920 for desktop. One LCP preload per route, declared in a route-to-image map in the base layout.
- **Everything below the fold:** `loading="lazy"`, `decoding="async"`. Gallery and review avatars included.
- **Lazy sections:** heavy components (maps, carousels, embedded estimators, video) load on `client:visible` or an `IntersectionObserver` 200px before entering the viewport. Iframes get `loading="lazy"` and a fixed aspect-ratio box so nothing shifts.
- **Video:** desktop-only hero loops, `preload="none"`, `poster` set, `muted loop playsinline`, WebM with MP4 fallback, under 3MB, starts only after the LCP image has painted. Never on mobile.
- **People in photos:** no crop may take a face off. Every registered photo with a person in it names a crop anchor (`focus: top | bottom | left | right`, the edge the faces are nearest) and every generated crop (cards, figures, galleries, any ratio) passes it to the image service; the default centre anchor cuts a standing person at the chest in a landscape frame. Before the layout gate, screenshot every photo slot that shows a person at phone and desktop widths and check the heads. A face-safe crop beats a centered composition every time.
- **Nobody is named in a caption or alt:** people in work photos are "an [Client] professional", "the [Client] crew", "on site". Clients send photos of brothers-in-law, subcontractors and friends under the owner's name; a caption that names the wrong person is worse than one that names nobody, and the owner's own name belongs in the copy, not under a photo. Exception: a portrait the owner supplies of themselves for the About page, confirmed in writing.
- **Alt text:** descriptive, includes the city or service when honest ("Home Source Roofing crew installing architectural shingles in Hagerstown, MD"). Decorative images get `alt=""`. Never keyword lists.
- **Source hygiene:** originals in `/src/assets/<section>/`, kebab-case filenames, no spaces, no "final-v2". Build generates the derivatives. A `scripts/optimize-images` step converts any stray JPG/PNG dropped into assets.
- **OG image per page type:** homepage, service, city, blog. Real photo plus wordmark, generated once, verified to return 200 before launch.

---

## 14. Performance targets

Measured on the Vercel production URL with Lighthouse mobile (Moto G Power profile) and PageSpeed Insights field data once available. A page that misses any of these is not done.

**Lighthouse (mobile):**
- Performance: 95+
- SEO: 100
- Accessibility: 95+
- Best Practices: 95+

**Core Web Vitals:**
- LCP under 2.5 seconds
- INP under 200 milliseconds
- CLS under 0.1

**Surge internal budgets (how we hit the targets with room to spare):**

| Budget | Target |
|---|---|
| TTFB | under 400ms |
| Total JS shipped (homepage) | under 60KB gzipped |
| Total page weight (homepage, mobile) | under 900KB |
| Font files | 2 to 4 woff2, under 120KB total |
| Third-party scripts in critical path | zero |

**Rules that get you there:**
- Zero third-party scripts in the critical path. GA4 and any chat widget load after `load` or on first interaction.
- Fonts self-hosted, subsetted to Latin, `font-display: swap` with metric-matched fallbacks (CLS from font swap is the most common CLS source we have measured: 0.146 on one HomeSource page before the fallback fix).
- Header height is reserved in CSS so a sticky header never shifts content on hydration.
- Every image and iframe has reserved dimensions.
- No layout animation. Transform and opacity only.
- Static assets fingerprinted and served `immutable`. HTML served `no-cache` or short `s-maxage` with revalidation.
- Hand-maintained JS files that are not fingerprinted are never served `immutable` (HomeSource shipped a year of stale form code to returning visitors this way).

---

## 15. SEO foundation

**The checklist. Every site ships with all of these, no exceptions:**
- Server-rendered or statically generated HTML (no client-only rendering of content)
- One descriptive H1 per page
- Logical H2 to H4 hierarchy, no skipped levels
- Semantic HTML5 elements (`header`, `nav`, `main`, `article`, `section`, `aside`, `footer`)
- Unique title and meta description per page
- Canonical URL on every page
- Open Graph metadata
- Twitter/social metadata
- XML sitemap
- robots.txt
- Breadcrumbs where appropriate (every non-home page), with `BreadcrumbList` schema
- JSON-LD structured data
- Descriptive image alt text
- Internal linking strategy (hub and spoke, documented)
- Human-readable URL slugs
- 301 redirect map (migrations)
- Custom 404 page
- No orphan pages

**How each item is implemented is below. The checklist says what; the rules say how.**

**Per page**
- One `<h1>`, containing the primary keyword, within the first 100 words of visible copy.
- Title tag 50 to 60 characters, primary keyword first, ends with ` | [Brand]`. Meta description 140 to 160 characters: keyword, a reason to click, a CTA. No duplicates across the site.
- One primary keyword per page. It appears in title, H1, first 100 words, one H2 and the meta description. That is enough. Secondary keywords from the brief once per 150 to 200 words, naturally.
- Canonical set to the production URL. OG and Twitter card tags on every page with a real image.
- JSON-LD: `LocalBusiness` (or the specific subtype: `RoofingContractor`, `HVACBusiness`, `Plumber`, `LandscapingBusiness`) on every page via the layout, reading `business.json`, with `areaServed`, `openingHoursSpecification`, `sameAs`, `aggregateRating` (from the live reviews proxy, not hardcoded). `Service` on service pages. `FAQPage` on any page with an FAQ, one block per page, text identical to the visible accordion in the same order. `BreadcrumbList` on every non-home page. `Article` on blog posts.
- Schema mirrors visible copy exactly. When copy changes, the schema changes with it. Never edit the first grep match without confirming it is not inside a `<script>`.

**Site architecture**
- Hub and spoke: service hubs → service pages → city-by-service pages. Each city page links up to its service hub, sideways to its sibling city, and to 2 relevant service pages and 1 blog post. Every page is reachable from at least 3 distinct pages. Print an inlink count table before launch.
- **Intent lanes:** each keyword family is owned by exactly one URL. No two pages target the same primary keyword in title or H1. Run a collision audit before launch.
- **Anti-doorway rule for city pages:** two city pages may share a layout. They may not share the opening paragraph structure, the neighborhood list, the local proof block, more than 2 of 5 FAQ questions, or the local knowledge paragraph. **The swap test:** place two sibling city pages side by side and swap the city names. If 80 percent still reads true, the page fails.
- City page skeleton (900 to 1,200 words): H1 (service plus city) → opening with one hyper-local detail → H2 what we do here with specific inclusions → H2 local knowledge (assigned angle: housing stock, weather pattern, HOA density, permitting, soil) → local proof (one assigned review or project) → H2 neighborhoods we serve → FAQ (4 to 5, 3 unique to the city) → CTA → cross-link block.
- URLs: lowercase, hyphens, no stop words, no dates. `/service/` for hubs, `/service-city-st/` for city pages, `/blog/slug/` for posts. Decide trailing slash once.

**Plumbing**
- `sitemap.xml` generated at build from the route tree, `lastmod` from the last git commit touching each page (never filesystem mtime, never a hardcoded date), noindex pages excluded.
- `robots.txt` host-aware: `Allow: /` on the production domain only, `Disallow: /` on every preview host. Middleware adds `X-Robots-Tag: noindex` on non-production hosts as a second lock.
- A `LAUNCH` / `LIVE` domain pair in the base layout with a `rebase()` helper for canonical, OG URL, OG image and JSON-LD URL, so the build can be reviewed on a preview host and cut over with one line.
- Redirect map for migrations authored during the build, parked in `deploy/redirects.json`, wired at cutover. Every old URL maps to the closest live equivalent, never to the homepage in bulk.
- 404 page branded, with search or a service list, phone, and the primary CTA.
- `/thank-you`, `/privacy-policy` (with an SMS section), `/terms`, `/sms-terms` exist and are linked from the footer.
- GA4 via the framework's third-party helper, with Redact Data on. Google Search Console verified by DNS on launch day. One sitemap submitted.
- No URL, title or H1 changes for 4 weeks after launch (frozen SEO contract) unless a defect requires it, and then logged.

---

## 16. Copy rules

- Direct, plain language, written to one reader (the homeowner or property manager in that city). Short sentences. Trade owners and their customers read fast.
- Specifics over adjectives. "39 years", "core aeration in September", "same-day tarping", not "experienced" or "high quality".
- Every claim verifiable from the client brief. No invented stats, awards, project counts, response times.
- Contractions are fine. Corporate fluff is not.
- Sentence case for body copy and most headings. Uppercase only where the typography system allows it.
- Vary sentence length. Three consecutive sentences of similar length get one rewritten.
- Run every page through the humanizer kill list (section 9, Copy) before review. Meta descriptions and FAQ answers included.
- Pricing, warranty terms, financing terms and licence numbers come from an approved client source only. If unconfirmed, cut the sentence and flag it in the build log.
- Phone number formatted consistently site-wide: `(301) 848-8508` visible, `tel:+13018488508` in the href.

- **Placeholders have two modes.** In preview every unanswered fact, photo and review is a visible `[CONFIRM]` slot and the production gate fails while any remain. At launch, once the client has answered, the components that held slots render nothing rather than a label: no photo where none exists, no review card without a live review, no town in a caption until it is known. The gate stays in the build and must report zero; it is never deleted to get past it. City pages may publish without a local job only by a logged decision (research-backed local context, a general project named as such, no invented job or review).

---

**Empty states on the live site.** A section whose data is not wired yet (reviews before the Places key, a gallery before the photos) never renders empty under its heading. It shows the real alternative: a reviews wall with no reviews is one card that links to the client's Google profile; a gallery with no photos is the CTA band. Orphaned filter chips and headings over nothing are a launch blocker.

**Social links in copy.** Profile links in the contact list are markdown links on the handle or page name (`[@handle](url)`), never a bare URL after an arrow; the renderer prints the arrow form as text.

---

## 17. Accessibility floor

- WCAG 2.2 AA. Contrast computed per token pair and documented.
- Every interactive element reachable and operable by keyboard, with a visible focus ring.
- Skip-to-content link as the first focusable element.
- One `<h1>`, logical heading order, no skipped levels.
- Landmarks: `header`, `nav`, `main`, `footer`, `aside` where used. `aria-label` on duplicate navs.
- Forms: every input has a `<label for>`, errors announced with `aria-live="polite"`, required fields marked in the label not just by color.
- Accordions and dropdowns use `button` elements with `aria-expanded` and `aria-controls`.
- Carousels have pause, previous and next controls and do not auto-advance under reduced motion.
- Icons that convey meaning have text equivalents. Decorative icons are `aria-hidden`.
- Tap targets 44 by 44 minimum with 8px spacing between adjacent targets.
- Language set on `<html>`. Page titles unique.

---

## 18. Page templates (build all that apply)

1. **Homepage:** hero with lead card → trust strip → services grid, image-led, on the first dark band (4 to 8 cards, each with a real job photo at 16:10 above the title; icon-only cards are for hubs, not the homepage) → problem opener, if the copy has one (the page's one text-only two-column section) → why us / differentiators (split layout with a photo and the stat strip) → reviews wall → process (how it works, no numbered circles) → financing or offer band on the second dark band, with a photo → service area (map or city chips) → FAQ → final CTA band → footer. The services grid is always second: a visitor should know what the company does inside one scroll. Why us never precedes it.
A four-step process row with a photo per step is a 2,000px column on a phone. Below 768px only the first and last steps keep their photo; from two columns up every step has one.

2. **Service hub** (`/roof-replacement/`): hero with lead card → trust strip → intro with a job photo beside it → what is included → materials or options (table or cards) → pricing guidance if approved → process → gallery → reviews filtered to that service → FAQ → related services → city links → CTA.
3. **City by service** (`/frederick-md-roofing/`): skeleton in section 15.
4. **Service areas hub:** map, county and city grid with chips linking to city pages, coverage copy.
5. **About:** story, team with real photos, licences, certifications, community, CTA.
6. **Reviews:** live rating header, filterable review wall (chips by service), third-party links.
7. **Contact:** full form (same contract), phone, hours, address with map, service area summary.
8. **Financing** (if applicable): approved lender language only, calculator only if the lender permits.
9. **Blog index and post:** index with filter chips by category, post with TOC on desktop, author, date, related posts, mid-post CTA, `Article` schema.
10. **Legal:** privacy (with SMS section), terms, SMS terms, accessibility statement.
11. **Thank you** (`noindex`), **404**, **careers** (if applicable), **referral** (if applicable).

---

## 19. MODE A: Claude Design prototype

Use this mode to produce the client-facing prototype. Output is a set of artboards the client approves before any code is written.

**Inputs required:** INPUT block filled, brand kit (colors, fonts or font direction, logo files), 8 to 15 real client photos, the approved sitemap and page list, the ICP.

**Produce, in this order:**
1. **Design tokens page:** color tokens with computed contrast ratios, type scale rendered at 390 and 1440, spacing scale, radius, button and chip states, form field states. This page is the contract for Mode B.
2. **Homepage at 390 first**, then 1440. Hero with the 2-step lead card fully drawn (both steps and the success state). Every section from the homepage template.
3. **Service hub at 390 and 1440.**
4. **City page at 390 and 1440**, with real copy for one city so density rules are visible.
5. **Mobile nav open state, sticky bottom CTA state, footer, 404.**
6. **Component sheet:** every button, chip, card, input, accordion, rating chip, mid-page CTA band, in every state.

**Prototype rules:**
- Use real copy from the brief, never lorem. If copy is not written yet, write it to the rules in section 16 and mark it DRAFT in a note, not in the artboard.
- Use real client photos. Where none exists for a slot, use a flat brand-color placeholder block with the intended subject written in it ("crew on roof, Hagerstown"). Never stock.
- Nav labels and links are real paths from the approved sitemap, written in the artboard notes, because artboard exports carry `#` links and the port has to map every one of them.
- Draw the 360 and 1920 states for the header and hero in addition to 390 and 1440. These are where drift shows.
- Annotate every section with: section name, background token, padding token (`py-[100px]` mobile, `lg:py-32` desktop, `py-16` quiet), and which template it belongs to.
- Export: HTML plus assets per page, a `LINK-MAP.json` listing every link and its intended destination, a `DESIGN-DEBT.md` listing anything the design could not resolve (small-phone header, states not drawn, copy not final).
- Nothing on the kill list (section 9). Review the artboards against it before presenting.

**Client review gate (Gate A):** the client approves tokens page, homepage, one service page and one city page at both widths. Approval is recorded in `design/GATE-A.md` with the date and the export hash. The port in Mode B treats `design/pages/` as read-only after this.

---

## 20. MODE B: Claude Code production build

Use this mode after Gate A. Run from the client repo root.

**Read first, in order:** this prompt in full → `design/GATE-A.md` → `design/LINK-MAP.json` → `design/DESIGN-DEBT.md` → `business.json` → the client brand kit → any `briefs/` for pages being built.

**Setup (day one):**
1. Scaffold per the stack decision (section 2). Record it in `adr/ADR-001-stack.md`.
2. Create `business.json`, `tailwind.config` with tokens from the design tokens page, self-hosted fonts with metric-matched fallbacks, base layout with `LAUNCH`/`LIVE` and the LCP preload map, `robots.txt` and `sitemap.xml` routes, `/api/lead` and `/api/reviews`, middleware for preview noindex, `STANDARDS.md`, `DESIGN-DEBT.md`, `adr/`.
3. Port shared chrome first: header (all widths in the matrix), footer, sticky mobile CTA, mobile nav panel.
4. Port the lead card (both steps, success, error, retry) and wire it end to end to a test Resend inbox before any page is built. A site with pages and no working form is not progress.

**Porting rules:**
- `design/pages/` is never edited. Every deliberate deviation from the design lives in a small explicit overlay and a `DESIGN-DEBT.md` entry.
- Components, not copies. If two pages share a block, it is one component with props.
- Every link in `LINK-MAP.json` resolves to a real route. Zero `#` hrefs at launch. Zero links to `.html`.
- Copy comes from the brief and the approved design, run through the humanizer kill list. Schema copy is generated from the same source as the visible copy so they cannot drift.
- Images go through the pipeline. Any JPG or PNG in `public/` at build time fails the gate.
- Each page declares its LCP image in the preload map.
- Log anything that is not specific to this client in `STANDARDS.md` as a `candidate` entry, so it graduates into the next version of this prompt.

**Build order:** chrome and lead card → homepage → service hubs → city pages (one, run the swap test, then the rest) → about, reviews, contact → blog → legal, thank-you, 404 → redirect map → sitemap and robots → verification gate.

**Launch protocol:** verify on the Vercel preview host (noindex confirmed) → client review → DNS cutover → flip `LAUNCH` to `LIVE` → wire redirects → confirm `robots.txt` now allows → submit sitemap in GSC → verify assets on the bare URL (no cache-buster) → 24-hour check of leads, 404s and Core Web Vitals field data. No URL, title or H1 changes for 4 weeks.

---

## 21. Verification gate (every page, before done)

Automate as `scripts/check-integrity` and run it before every deploy. It exits non-zero on any failure and prints what failed and where. Silence is the defect.

**Structure**
- [ ] Exactly one `<h1>` per page
- [ ] Title 50 to 60 chars, unique; meta 140 to 160 chars, unique
- [ ] Canonical, OG, Twitter present and pointing at `LIVE`
- [ ] Every JSON-LD block parses; FAQPage text matches the visible accordion in order; one FAQPage per page
- [ ] NAP in footer and schema matches `business.json` exactly
- [ ] No link to `#`, `.html`, or a non-existent route; trailing slash convention consistent
- [ ] Every page has 3 or more inbound links; inlink table printed
- [ ] No two pages share a primary keyword in title or H1
- [ ] City pages pass the swap test against their nearest sibling

**Content**
- [ ] No em dashes anywhere in rendered HTML
- [ ] No kill-list phrase in visible copy, metas or FAQ answers
- [ ] Body text computed size 18px or larger on every paragraph
- [ ] No unapproved price, warranty, financing or licence figure (allowed set parsed from the approved source, scanned in visible text and JSON-LD)
- [ ] Word count within the brief's range

**Assets and performance**
- [ ] No JPG or PNG served except favicons and OG images
- [ ] Every `<img>` has width, height, alt, and (below the fold) `loading="lazy"`
- [ ] LCP image preloaded with `fetchpriority="high"` on every route
- [ ] Every image, OG image and iframe URL returns 200 on the production host
- [ ] Fonts self-hosted; no external font or asset requests
- [ ] Lighthouse mobile: Performance 95+, SEO 100, Accessibility 95+, Best Practices 95+
- [ ] Core Web Vitals on homepage, one service page, one city page: LCP under 2.5s, INP under 200ms, CLS under 0.1
- [ ] SEO foundation checklist (section 15) complete, every item

**Layout**
- [ ] No horizontal overflow at 320 (graceful), 360, 375, 390, 768, 900, 1024, 1440, 1744, 1920
- [ ] Header fits at every width above; hamburger below 900
- [ ] Hero fits the first viewport at 1440 by 900 and 1920 by 1080: hero bottom at or above the viewport bottom, lead card fully inside it, on every page with a photo hero
- [ ] Sticky CTA appears after hero and hides when the form is in view
- [ ] Screenshot diff of homepage, one service, one city page at 390 and 1440 against Gate A

**Lead form**
- [ ] Pane 1 tap advances without a request; pane 2 submits to `/api/lead` and produces the internal email in a test inbox
- [ ] Step 2 button reads Next until the last pane, then Finish; Skip posts nothing
- [ ] Honeypot filled produces fake success and no email
- [ ] Submit under 3 seconds is rejected silently
- [ ] Consent text matches the template and version string is stored
- [ ] GA4 `generate_lead` fires only after 2xx, with no PII params
- [ ] DNI (if present) skips footer NAP and all `<script>` content
- [ ] Network failure shows retry copy with the phone number

**Hygiene**
- [ ] `robots.txt` disallows on the preview host, allows on production
- [ ] Sitemap regenerated and matches the route tree; `lastmod` from git
- [ ] `STANDARDS.md` and `DESIGN-DEBT.md` updated; ADRs written for every decision made this session
- [ ] Baton pass: working-order doc updated with what is done, in flight, blocked, and the commands to resume

---

## 22. Project hygiene

Every client repo carries:
- `business.json` (single source of truth for NAP, hours, licences, service area, profiles)
- `adr/` with one ADR per decision, written the day it is made, superseded never deleted
- `STANDARDS.md`: every change that the next client would also need, with a `candidate` / `promoted` status. Candidates graduate into the next version of this prompt.
- `DESIGN-DEBT.md`: everything the port fixed in code that should be fixed upstream in Claude Design
- `design/` with the Gate A export, `LINK-MAP.json`, `GATE-A.md`
- `brand/tokens.overrides.css`: every token changed after Gate A, in the same format as `design/tokens.css`. `sync-tokens` reads it second so its values win and `design/` stays read-only. Each entry names its ADR.
- `briefs/` per page for anything content-heavy
- `scripts/check-integrity` and `scripts/optimize-images`
- `deploy/redirects.json` for migrations
- A `CLAUDE.md` at the repo root that points at this prompt, lists the client-specific constraints, and records the mistakes that already shipped so they are not repeated

---

## INPUT BLOCK (fill before running)

```
MODE: [A: Claude Design prototype | B: Claude Code production build]
BRAND: [The Surge Agency (home services) | Powered By Surge (other industry)]
CLIENT: [Legal name, dba, domain]
TRADE / INDUSTRY: [Roofing, HVAC, plumbing, landscaping, ...]
STACK: [Astro + Tailwind (default) | Next.js + Tailwind, with the reason]
ICP: [Paste the 6-step ICP output or link to it]
RESEARCH: [Keyword bank, competitor notes, GSC/Ahrefs pulls, review mining]
BRAND KIT: [brand.json / design-tokens.css / logo files / font files or direction]
PHOTOS: [Path to real client photos, count, what they show]
BUSINESS FACTS: [Phone, address, hours, licences, years in business, ownership story, service area cities, certifications, rating + count, lender if any]
APPROVED FIGURES: [Any price, warranty, financing or guarantee language the client has approved in writing. Nothing else gets published.]
SITEMAP: [Page list with primary keyword per page and intent lane]
INTEGRATIONS: [Command Center tenant? CRM? Call tracking / DNI? Chat? Estimator embed?]
LEAD ROUTING: [Notification recipients, confirmation sender domain status]
LAUNCH: [Migration from existing site? Preview host? Target cutover date]
CLIENT DECISIONS ALREADY MADE: [Anything that overrides a default in this prompt, with the reason]
```

---

## Changelog

- **1.4 (2026-10-23):** From the RC polish pass, ADR-008. A four-step process row keeps photos on the first and last step only below 768px (section 18). People in photos: every person photo names a crop anchor (`focus`) the image pipeline honors at every ratio, and captions and alts never name the person (section 13). Hero CTAs stack full width below the desktop breakpoint, mobile scrim lightened to 45 percent with a text shadow (section 10). Three-column comparison tables stack into cards on phones (section 5). Empty states on the live site show the real alternative, never a heading over nothing; social links in copy are markdown links (section 16).

- **1.3 (2026-10-19), fifth pass:** Placeholder modes, preview versus launch (section 16). From the RC launch pass, ADR-007.

- **1.3 (2026-10-19), fourth pass:** Portrait hero sources need a pre-cut 16:9 file (section 13). RC STANDARDS 37.

- **1.3 (2026-10-19), third pass:** Service icons in the services dropdown and the mobile services list, from the one registry (section 7).

- **1.3 (2026-10-19), second pass:** Inner pages get the homepage rhythm by plan (section 5 and 18): opening photo beside the first body section, one dark band in the first half with two light bands before the CTA band, which moves below the FAQ when needed; one `.on-dark` inversion rule instead of per-component dark variants. RC ADR-006.

- **1.3 (2026-10-19):** From the RC All Exteriors live review against the old rcallexteriors.com. Hero contained to the first viewport (section 10: viewport minus header, clamped 640 to 820px, gate check at 1440 by 900 and 1920 by 1080) with the trust row moved to its own strip under it. Lead card step 1 split into two panes, a one-tap reason question then contact (section 10), and step 2 shown one question per pane; the contract is unchanged. Dark header by default with header and logo size tokens (section 7: 88px / 56px logo, never below 44px; the old "not below 32px" allowed an unreadable lockup). Surface rhythm rules (section 5: no more than three consecutive light bands, a dark band in each half of the homepage, every homepage section except FAQ carries a visual, one text-only two-column section per page). Homepage order fixed with the services grid second and image-led (section 18). Post-Gate-A token changes live in `brand/tokens.overrides.css`, read by `sync-tokens` after `design/tokens.css`, so `design/` stays read-only (section 22).

- **1.2 (2026-10-07):** Mobile section padding raised to 100px top and bottom (was 48 to 64px), desktop to 128px, quiet bands 64px. From the RC All Exteriors Gate A review: 48px looked dense on the 390 artboards. Tokens named in section 5.

- **1.1 (2026-10-05):** Sam defined the SEO Foundation checklist and Performance Targets (Lighthouse 95/100/95/95, LCP under 2.5s, INP under 200ms, CLS under 0.1). DRAFT flags removed, verification gate aligned.

- **1.0 (2026-10-05):** First version. Sources: HomeSource `CLAUDE.md` and `00-CONTRACT.md` (lead form, integrity rules, asset caching, DNI, schema mirroring), Sunrise `PAGE-STANDARDS.md` and `sunrise-design/SKILL.md` (keyword lanes, anti-doorway, type floor, layout rhythm), Señor Tequilas `STANDARDS.md` (business.json, host-aware robots, LAUNCH/LIVE, LCP map, gutter drift, breakpoint matrix). Decisions this version: Astro default with Next.js escalation; HomeSource 2-step form as standard; 18px body floor with mobile centering of headings and short copy; one prompt, two modes.
