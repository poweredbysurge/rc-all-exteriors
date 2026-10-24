Updated Sept 30 by Surge. Revised Oct 19 with Ricardo's answers to the launch questions (Google Doc, 2026-10-19) and Sam's decisions: no price figures anywhere, one owner line used sparingly, 60-day repair warranty published, after-hours emergency calls published. No [CONFIRM] placeholders remain in page copy.

# RC All Exteriors Website Copy: Batch 1

Prepared by The Surge Agency · September 21, 2026

Built with the Surge /copy pipeline (competitor → research → persona → generate → humanizer → review)

Pages in this batch: Home · Roof Replacement · Roof Repair · Storm Damage Roof Repair · Free Roof Inspection

Revised September 22, 2026 against Ricardo's ICP questionnaire (the source of truth): service area, founding year (2025), and the free inspection offer.

---

## 0. How to use this doc (for Claude Code)

Every line of page copy starts with a tag in brackets. The tag tells Claude Code exactly which HTML element to build. Paste one page section at a time into Claude Code with this instruction: "Build this page. Each bracket tag maps to the element in the legend. Do not change the copy."

| Tag | Build as | Notes |
| :---- | :---- | :---- |
| **[URL]** | Page route | Final path, trailing slash |
| **[META TITLE]** | `<title>` | 50 to 60 characters |
| **[META DESCRIPTION]** | `<meta name="description">` | 150 to 160 characters |
| **[H1]** | `<h1>` | One per page, always the first heading |
| **[SUBHEAD]** | `<p class="lead">` under the H1 |  |
| **[H2]** | `<h2>` | Section heading |
| **[H3]** | `<h3>` | Card or sub-section heading |
| **[P]** | `<p>` | Body paragraph |
| **[LIST]** | `<ul>` | Each "-" line is an `<li>` |
| **[STEPS]** | `<ol>` | Numbered process; each item has a bold title \+ sentence |
| **[TRUST BAR]** | Icon row under hero | Items separated by "·" |
| **[CTA PRIMARY]** | Primary button | Opens the inspection form |
| **[CTA SECONDARY]** | Secondary button or tel: link |  |
| **[CARD]** | Linked card | Title, one line, link target |
| **[REVIEW]** | Review card | Pull real text from Google; never write fake reviews |
| **[FAQ Q] / [FAQ A]** | Accordion item | Also output as FAQPage schema |
| **[LINK]** | Inline internal link | Anchor text → target URL |
| **[IMAGE]** | Image slot | Description of the photo to use |
| **[FORM]** | Inspection form | Fields listed in the Free Inspection page |
| **[SCHEMA]** | JSON-LD in `<head>` | Types listed per page |
| **[CONFIRM: ...]** | Placeholder | Fact to confirm with Ricardo. Do not publish until replaced |

Site-wide elements (build once, reuse on every page):

- **Header:** logo · Services · Service Areas · Warranty · Financing · Reviews · About · phone (703) 677-1976 · [CTA PRIMARY] Book a Free Roof Inspection  
- **Footer:** RC All Exteriors LLC · Serving Woodbridge and Northern Virginia · (703) 677-1976 · [Info@rcallexteriors.com](mailto:Info@rcallexteriors.com) · Mon to Sat, 7am to 5pm · Virginia Class A Contractor · BBB Accredited · service area links  
- **Sticky mobile bar:** Call or text (703) 677-1976 · Free Roof Inspection

---

## 1. Copy foundation (pipeline steps 1 to 3\)

### Step 1: Competitor brief

| Competitor | What they do well | Gap we take |
| :---- | :---- | :---- |
| Summit Roofing (DR 9\) | Homepage ranks \#2 for "roof repair woodbridge va"; one page per city; two cost guides | Their Woodbridge page is thin (7 keywords). We build city pages for RC's real service area: Lorton, Fairfax, Springfield at launch; Alexandria, Fairfax Station, Arlington, McLean, Great Falls later |
| Pond Roofing (DR 45\) | City-by-service pages; strong brand | Overlaps our northern cities. We launch Lorton, Fairfax, Springfield pages first, then Alexandria, Fairfax Station, Arlington, McLean, Great Falls |
| NV Roofing (DR 24\) | Ranks \#1 for "northern virginia roofing contractors" | Blog traffic is off-topic |
| Woodbridge map pack: Top Dog Home Pro, MidAtlantic Contracting, Blanco A Construction | Hold the 3-pack today | None of them lead with an owner on every job plus a written, itemized price |

Positioning angle: the owner-run roofer with the fair price, the 10-year warranty, and 49 five-star reviews that say so.

### Step 2: Research brief

Sources used in this batch: Ricardo's ICP questionnaire (Sept 21, the source of truth), the current rcallexteriors.com copy (Home, Roof Replacement, Roof & Siding Repairs, About), Ahrefs keyword and competitor data (Sept 2026), Google Business Profile review themes, and the Sept 18 launch call with Ricardo. The web research step was not re-run for this batch. Every claim in the page copy traces to one of these sources or is marked [CONFIRM]. See section 1b.

| Finding | What it means for the copy |
| :---- | :---- |
| Top review themes: fair pricing (7), competitive pricing (5), quick work (4), polite staff (4), insurance process (3), thorough crew (3), clean-up (3) | Lead with price honesty and clean job sites. Use these exact words |
| Most roof work starts after a storm (launch call) | Storm page and insurance help get top-level placement |
| Buyers compare 3 quotes, reviews, license, warranty | Put license, warranty, and reviews next to every CTA |
| "roof repair woodbridge va" 200/mo, "roof replacement woodbridge va" 90/mo, "roofing contractor woodbridge va" 150/mo, "free roof inspection" 2,500/mo US | Keyword targets for this batch |

### Step 3: Reader persona

**Primary persona: "Dana," Northern Virginia homeowner** (composite, from Ricardo's ICP questionnaire)

- Owns a home in Woodbridge, Lake Ridge, Lorton, Fairfax Station, Fairfax, Springfield, Alexandria, McLean, Great Falls, or Arlington (Ricardo's service area)  
- Roof is 15 to 25 years old. Found shingle pieces in the yard or a stain on the ceiling  
- Getting 3 quotes. Worried about being overcharged, a crew that disappears, and a warranty that means nothing  
- Phrases Dana types: "roofer near me," "roof repair woodbridge va," "how much does a new roof cost," "does insurance cover roof replacement"  
- Conversion trigger: a free inspection with photos and one written price, from someone local with real reviews

**Voice rules (locked for this client)**

| Rule | Detail |
| :---- | :---- |
| Point of view | "We" for the company, "you" for the homeowner, Ricardo by name for ownership moments |
| Tone | Plain, direct, calm. A contractor talking in your driveway, not a brochure |
| Sentences | Mostly short. No sentence over 25 words |
| Punctuation | No em dashes anywhere. Use periods, commas, colons |
| Words we use | fair price, written price, straight answer, free inspection, 10-year warranty, clean-up, photos |
| Words we never use | premier, top-notch, best-in-class, state-of-the-art, seamless (except "seamless gutters," the product name), elevate, nestled, look no further, and every phrase on the humanizer list |
| Claims | Only facts from Ricardo's questionnaire, the current site, the Google profile, or the launch call. Anything else is a [CONFIRM] placeholder |

### Locked facts and open placeholders

| Fact | Status |
| :---- | :---- |
| RC All Exteriors LLC · (703) 677-1976 · [Info@rcallexteriors.com](mailto:Info@rcallexteriors.com) | Confirmed |
| Virginia Class A contractor license | Confirmed. License number [CONFIRM] |
| BBB accredited | Confirmed |
| 49 five-star Google reviews | Confirmed (GBP, Sept 2026). Update the number at launch |
| CertainTeed installer, 3-Star warranty level | Confirmed on call. Exact program name [CONFIRM] |
| 10-year workmanship warranty | Confirmed. Terms document coming from Ricardo |
| Financing available | Link sent by Ricardo. Partner and terms [CONFIRM] |
| Hours Mon to Sat, 7am to 5pm | From GBP |
| Years in business | RC All Exteriors started in 2025 (confirmed by Mario, Sept 22). The old site's "2015" and "9 years" are wrong and are dropped. The copy never leads with years; it leads with reviews, license, and warranty |
| Free inspection | Confirmed as the lead offer (Sept 22\) |
| Services | Current site: residential and commercial; asphalt shingle, metal, and flat roofing; tear-off and disposal; leak detection and waterproofing; ventilation and insulation upgrades; gutter and flashing replacement; siding crack and panel replacement; storm and hail damage restoration; insurance claim assistance and estimates; preventive inspections and maintenance |
| Typical install time, inspection lead time, price ranges, photo reports, attic checks, clean-up steps | [CONFIRM]. Not stated anywhere yet |

### 1b. What we kept from the current website

The new copy keeps the current site's facts and much of its wording. Nothing below is new information.

| Current site says | Where it lives now |
| :---- | :---- |
| "For over 9 years... Northern VA and the DMV" / "2015 Company Start" | Dropped. Company started in 2025 |
| "complete roof replacements, roof and siding repairs, gutters, windows, and doors" | Home service cards |
| "We also assist with insurance claims and storm damage inspections" | Home FAQ, Storm Damage page |
| "Residential and commercial" roofing | Roof Replacement subhead and trust bar |
| "Asphalt shingle, metal, and flat roofing systems" | Roof Replacement, CertainTeed bullet |
| "Roof tear-off and disposal of old materials" | Roof Replacement, Home "On time and cleaned up" |
| "Leak detection and waterproofing" · "Roof ventilation and insulation upgrades" · "Gutter and flashing replacement" | Roof Replacement bullets |
| Replacement process: inspection and consultation → customized plan and estimate → removal and replacement | Roof Replacement steps (same 3 steps \+ warranty) |
| Repair list: leak detection, shingles, flashing/vent/chimney, siding cracks and panels, storm and hail, gutters and flashing, preventive inspections | Roof Repair list, word for word |
| Repair process: inspection and damage assessment → repair plan and matching materials → repair execution | Roof Repair steps |
| "Quick, efficient repairs prevent small issues from turning into costly replacements" | Roof Repair, "Repair or replace" |
| "Transparent pricing" · "transparent proposal" · "honest pricing" | Every estimate line |
| "We keep communication clear from start to finish" | Home "owner-run" block, Roof Replacement FAQ |
| "We stand behind our work every single time" | Roof Replacement warranty bullet |
| "Durable and energy-efficient upgrades" (windows and doors) | Home service card |
| "Fully licensed and insured" · "Class A Contractor" | Trust bars, Home FAQ |
| "Based on 48 reviews" | Updated to 49 from the GBP (Sept 2026\) |

Dropped from the current site on purpose: the percentage bars (97%, 87%, 92%, 95%) because they have no source, "Comprehensive Solutions" and "top-quality materials" (humanizer list), and "Serving the metropolitan area (DC, MD, VA)" because Maryland and DC are out of scope.

---

## 2. Page: Home

**Page spec**

| Field | Value |
| :---- | :---- |
| [URL] | / |
| [META TITLE] | Roofing Contractor in Woodbridge, VA | RC All Exteriors |
| [META DESCRIPTION] | Roof replacement and repair in Woodbridge and Northern Virginia. Class A licensed, 10-year workmanship warranty, 49 five-star reviews. Free inspection. |
| Primary keyword | roofing contractor woodbridge va |
| Supporting keywords | roofing woodbridge va, roofing company woodbridge va, roofer woodbridge va, roofers woodbridge va |
| [SCHEMA] | RoofingContractor (LocalBusiness): name, address (locality Woodbridge, region VA, postal code 22192; no street address), phone, hours, areaServed (Woodbridge, Lake Ridge, Lorton, Fairfax Station, Fairfax, Springfield, Alexandria, Arlington, McLean, Great Falls), aggregateRating 5.0 / 49, sameAs (GBP, BBB, Instagram) |

**Hero**

**[H1]** Woodbridge Roofing Contractor With Fair Prices and a 10-Year Warranty

**[SUBHEAD]** Roof replacement and repair for homes across Northern Virginia, from Woodbridge to Fairfax, Alexandria, and Arlington. Class A licensed. Ricardo quotes every job and signs off on every roof.

**[P]** Roofing is most of what we do. We also handle [siding](/siding/), [gutters](/gutters/), and [windows and doors](/windows-doors/), often on the same job.

**[CTA PRIMARY]** Book a Free Roof Inspection

**[CTA SECONDARY]** Call or text (703) 677-1976

**[TRUST BAR]** 49 five-star Google reviews · Virginia Class A contractor · BBB accredited · Local to Woodbridge, not a storm chaser · 10-year workmanship warranty

**[IMAGE]** Ricardo on a finished roof in Woodbridge, crew and truck visible. Real photo, not stock.

**Problem opener**

**[H2]** Three roofing quotes shouldn't feel like a guessing game

**[P]** One roofer says patch it. Another says tear it all off. The third never calls back. If your roof is 15 or 20 years old and you're finding shingle pieces in the yard, you just want a straight answer.

**[P]** That's how Ricardo Castro runs RC All Exteriors. He does a detailed inspection, shows you the photos, explains what he found, and gives you a transparent written estimate.

**Why us**

**[H2]** Why Woodbridge homeowners choose RC All Exteriors

**[H3]** A price you can trust

**[P]** "Fair pricing" is the thing our customers mention most in their Google reviews. You get honest pricing and a clear estimate before any work starts. Our prices sit in the middle of the pack: not the cheapest, not the most expensive. The price on your estimate is the price you pay, with no surprise change orders. Up to five sheets of replacement decking are included in every roof replacement, and we show you anything beyond that before we touch it.

**[H3]** Backed for 10 years

**[P]** Every roof we install comes with our 10-year workmanship warranty. The CertainTeed shingles carry their own manufacturer warranty on top of that.

**[H3]** The owner on your job

**[P]** RC All Exteriors is owner-run, so the person who quotes your job is the person accountable for it. We keep communication clear from start to finish.

**[H3]** On time and cleaned up

**[P]** "Quick work" and a tidy crew show up again and again in our reviews. We tarp the landscaping, place the dumpster where you want it, haul away the old roof, run a magnetic sweep for nails, and finish when we say we will.

**Services**

**[H2]** Roofing and exterior services

**[CARD]** Roof Replacement | A full tear-off and a new CertainTeed roof, with a written price before we start. | /roof-replacement/

**[CARD]** Roof Repair | Leaks, missing shingles, flashing, and vent boots. Fixed right, with an honest read on how many years your roof has left. | /roof-repair/

**[CARD]** Storm Damage | Wind or hail got your roof? We inspect the damage and help with the insurance claim. | /storm-damage-roof-repair/

**[CARD]** Windows, Gutters, and Siding | Energy-efficient windows and doors, gutters, and siding installed to protect your home and improve how it looks. | /services/

**Reviews**

**[H2]** 49 five-star reviews from your neighbors

**[P]** Every review on our Google profile is five stars. People bring up the same things again and again: fair pricing, quick work, polite crews, and real help with insurance. Ask your neighbors who they used and whether the roof held up.

**[REVIEW]** [Pull from GBP: a review that mentions fair pricing]

**[REVIEW]** [Pull from GBP: a review that mentions the insurance process]

**[REVIEW]** [Pull from GBP: a review that mentions clean-up or the crew]

**[LINK]** Read all 49 reviews → /reviews/

**Process**

**[H2]** How it works

**[STEPS]**

1. **Free inspection and consultation.** We start with a detailed inspection of your roof and talk through your options. Most inspections are scheduled within 24 to 48 hours of your call.  
2. **A clear estimate.** You get a transparent proposal built around your roof, your materials, and your budget. No pressure to sign that day. If two of you make the decision, we'll walk you both through it.  
3. **Removal and replacement.** We remove the old roof, haul it away, and install the new one with care. Most roofs take one to three days.  
4. **Warranty in writing.** We walk the finished roof with you, register your CertainTeed warranty, and hand over your 10-year workmanship warranty in writing.

**Financing**

**[H2]** Need to spread out the cost?

**[P]** A roof that's failing can't always wait for savings to catch up. Financing is available through Enhancify on roof replacements, siding, windows, and doors. Checking your options takes about two minutes and uses a soft credit pull.

**[CTA SECONDARY]** See Financing Options → /financing/

**Service area**

**[H2]** Roofing across Woodbridge and Northern Virginia

**[P]** We're based in Woodbridge and work across Northern Virginia: Lake Ridge, Lorton, Fairfax Station, Fairfax, Springfield, Alexandria, McLean, Great Falls, and Arlington.

**[H3]** Local, not a storm chaser

**[P]** After a big storm, trucks from out of state knock on doors all over Northern Virginia. We live here. We'll still be here when you need the warranty. Too many homeowners have been burned by a contractor who took the insurance check and disappeared. We answer the phone and show up when we say we will.

**[LINK]** Lorton → /service-areas/lorton-va/ · Fairfax → /service-areas/fairfax-va/ · Springfield → /service-areas/springfield-va/ · All service areas → /service-areas/

**[IMAGE]** Map of the service area centered on Woodbridge, 22192

**FAQ**

**[H2]** Common questions

**[FAQ Q]** How much does a new roof cost in Woodbridge?

**[FAQ A]** It depends on the size of the roof, how steep it is, how many old layers come off, and the shingle you choose. A townhouse and a large colonial are very different jobs, so we do not quote ranges online. Your free inspection ends with a written estimate, so you know the real number before you decide.

**[FAQ Q]** Are you licensed and insured?

**[FAQ A]** Yes. RC All Exteriors holds Virginia Class A contractor license 2705196138, is fully insured, and is BBB accredited.

**[FAQ Q]** Do you help with insurance claims?

**[FAQ A]** Yes. Storm damage inspections and insurance claim assistance are part of what we do, including the estimate your insurance company needs. "Insurance process" is one of the things our reviews mention most. [LINK] storm damage help → /storm-damage-roof-repair/

**[FAQ Q]** What areas do you serve?

**[FAQ A]** Woodbridge, Lake Ridge, Lorton, Fairfax Station, Fairfax, Springfield, Alexandria, McLean, Great Falls, and Arlington. If you're nearby and not on that list, call or text us at (703) 677-1976 and ask.

**[FAQ Q]** Do I have to pay a deposit before you start?

**[FAQ A]** We know nobody wants to front money before they’ve seen any work. The schedule is simple: half when the job starts and half when it is finished. Larger projects are split in thirds at signing, start, and completion. It is spelled out in writing on your estimate before you sign.

**Footer CTA**

**[H2]** Find out what your roof actually needs

**[P]** One visit, a detailed inspection, and a straight answer. The inspection is free, and there's no pressure to book.

**[CTA PRIMARY]** Book a Free Roof Inspection

**[CTA SECONDARY]** Call or text (703) 677-1976

**Internal links on this page:** /roof-replacement/ · /roof-repair/ · /storm-damage-roof-repair/ · /services/ · /reviews/ · /financing/ · /service-areas/ · /free-roof-inspection/

---

## 3. Page: Roof Replacement

**Page spec**

| Field | Value |
| :---- | :---- |
| [URL] | /roof-replacement/ |
| [META TITLE] | Roof Replacement in Woodbridge, VA | RC All Exteriors |
| [META DESCRIPTION] | New CertainTeed roofs for Woodbridge and Northern Virginia homes. One written price, 10-year workmanship warranty, financing available. Book a free inspection. |
| Primary keyword | roof replacement woodbridge va |
| Supporting keywords | roof replacement northern virginia, new roof cost, certainteed shingles |
| [SCHEMA] | Service (serviceType: Roof Replacement, provider: RoofingContractor, areaServed) · FAQPage · BreadcrumbList |

**Hero**

**[H1]** Roof Replacement in Woodbridge, VA

**[SUBHEAD]** Complete roof replacements for homes and businesses across Northern Virginia, with a transparent estimate and our own 10-year workmanship warranty.

**[CTA PRIMARY]** Book a Free Roof Inspection

**[CTA SECONDARY]** Call or text (703) 677-1976

**[TRUST BAR]** 49 five-star reviews · Class A licensed · Residential and commercial · 10-year warranty · Financing available

**Intro**

**[P]** Patching a 20-year-old roof again usually buys you a season, not a decade. When the leaks keep coming back, a replacement is the fix that sticks.

**[P]** Maybe your roof has reached the end of its lifespan. Maybe a storm beat it up. Either way, a new roof protects your home, adds curb appeal, and helps with energy costs year-round. It should also come with a clear price and a warranty with a local name behind it.

**Signs**

**[H2]** Signs it's time to replace, not repair

**[LIST]**

- Shingles curling, cracking, or missing in more than one spot  
- Granules piling up in your gutters or at the bottom of the downspouts  
- The same leak coming back, or new leaks in different rooms  
- Water stains or daylight showing in the attic  
- A roof over 20 years old that's already been patched a few times

**[P]** Not sure which side you're on? That's what the free inspection is for. [LINK] roof repair → /roof-repair/

**What's included**

**[H2]** What comes with every RC All Exteriors roof

**[LIST]**

- **Tear-off and disposal.** The old roof comes off and gets hauled away. We inspect the decking underneath. Up to five sheets of replacement plywood are included; if the deck is in bad shape we tell you and quote a full re-deck before any work.  
- **CertainTeed shingles.** Landmark and Landmark Pro, the shingles Ricardo uses on most jobs, installed as a full CertainTeed Integrity Roof System with SureStart PLUS 3-Star coverage on top of our own warranty. Standing seam metal and flat roofing systems are available too. [LINK] CertainTeed roofing → /certainteed-roofing/  
- **Brava synthetic shake, slate, and tile.** For a cedar shake, slate, or Spanish tile look without the weight or the upkeep, we are a certified Brava installer. Brava is a composite that holds its color, takes hail and wind, and carries a 50-year limited warranty. Ask to see it at your inspection.  
- **Flashing and ventilation.** Flashing replacement and ventilation or insulation upgrades, where most leaks and heat problems start.  
- **Leak detection and waterproofing.** We find where water is getting in and seal the problem areas.  
- **10-year workmanship warranty.** We stand behind our work. If something fails because of how we installed it, we come back and fix it. [LINK] warranty details → /warranty/

**Process**

**[H2]** How a roof replacement works

**[STEPS]**

1. **Inspection and consultation.** We start with a detailed inspection of your existing roof and go over the best replacement options.  
2. **Custom plan and estimate.** You get a transparent proposal built around your needs, materials, and budget.  
3. **Removal and replacement.** Old materials are carefully removed, and the new roof is installed to professional safety standards. Most homes take one to three days.  
4. **Warranty.** Your 10-year workmanship warranty and the CertainTeed manufacturer warranty, in writing. We register the CertainTeed warranty for you.

**[IMAGE]** Before and after of a Northern Virginia home from the project gallery

**Paying for it**

**[H2]** Ways to pay for a new roof

**[H3]** Financing

**[P]** Monthly payments are available through Enhancify, so a failing roof doesn't have to wait. [LINK] financing options → /financing/

**[H3]** Insurance

**[P]** If wind or hail caused the damage, your homeowners policy may cover part or all of the replacement. We help with storm damage inspections, estimates, and the insurance claim. [LINK] storm damage and insurance → /storm-damage-roof-repair/

**FAQ**

**[H2]** Roof replacement questions

**[FAQ Q]** How much does a roof replacement cost in Woodbridge?

**[FAQ A]** The price depends on the roof's size, pitch, the number of old layers, the condition of the decking, and the shingle you pick, which is why we do not publish a range. Your free inspection comes with a written estimate, and Landmark and Landmark Pro quotes are usually ready on the spot.

**[FAQ Q]** How long does it take to replace a roof?

**[FAQ A]** Most homes take one to three days once materials arrive. Weather can move the start date. We'll give you the schedule before we start, and we work to finish on time.

**[FAQ Q]** Do I need to be home during the install?

**[FAQ A]** No. We need access to the outside of the house and room for a dumpster. We'll keep you updated from start to finish.

**[FAQ Q]** What does your 10-year warranty cover?

**[FAQ A]** Our workmanship warranty covers problems caused by how we installed the roof, for 10 years. The CertainTeed warranty covers the shingles themselves. You get both in writing at the final walk-through, and the workmanship warranty transfers once if you sell the house.

**[FAQ Q]** Will homeowners insurance pay for a new roof?

**[FAQ A]** Insurance usually pays when storm damage, like wind or hail, is the cause. It usually won't pay for normal wear and age. After an inspection we can tell you whether the damage looks like a claim worth filing.

**[FAQ Q]** Will the price go up once work starts?

**[FAQ A]** No surprise change orders. Our prices sit in the middle of the pack, not the cheapest and not the most expensive, and the written estimate is the price you pay. Up to five sheets of replacement decking are included. If we find more rot than that under the old roof, we show you before any extra work happens.

**[FAQ Q]** Do I have to pay a deposit before you start?

**[FAQ A]** We know nobody wants to front money before they’ve seen any work. Half is due when the job starts and half when it is finished; larger projects are split in thirds at signing, start, and completion. It is spelled out in writing on your estimate before you sign.

**CTA**

**[H2]** See what a new roof will really cost

**[P]** Free inspection, a straight answer, and a transparent written estimate. If a repair will do, we'll tell you.

**[CTA PRIMARY]** Book a Free Roof Inspection

**[CTA SECONDARY]** Call or text (703) 677-1976

**Internal links on this page:** /roof-repair/ · /certainteed-roofing/ · /warranty/ · /financing/ · /storm-damage-roof-repair/ · /free-roof-inspection/ · / (breadcrumb)

---

## 4. Page: Roof Repair

**Page spec**

| Field | Value |
| :---- | :---- |
| [URL] | /roof-repair/ |
| [META TITLE] | Roof Repair in Woodbridge, VA | RC All Exteriors LLC |
| [META DESCRIPTION] | Leaks, missing shingles, and flashing repairs in Woodbridge and Northern Virginia. Honest advice on repair vs. replace, and a free roof inspection. |
| Primary keyword | roof repair woodbridge va |
| Supporting keywords | roof repair northern virginia, roof leak repair, shingle repair |
| [SCHEMA] | Service (serviceType: Roof Repair) · FAQPage · BreadcrumbList |

**Hero**

**[H1]** Roof Repair in Woodbridge, VA

**[SUBHEAD]** Leaks, missing shingles, flashing, vents, and siding damage, fixed by a licensed local roofer who'll tell you straight if a repair is enough.

**[CTA PRIMARY]** Book a Free Roof Inspection

**[CTA SECONDARY]** Call or text (703) 677-1976

**[TRUST BAR]** 49 five-star reviews · Class A licensed · Fully insured · Quick work (from our reviews)

**Intro**

**[P]** A water stain on the ceiling. Shingles in the yard after a windy night. A drip that only shows up in heavy rain. Small roof problems turn into rotted wood and ruined drywall if they sit.

**[P]** We look for the hidden damage and the real cause of the leak, which isn't always right above the stain. Then we fix it with the most durable matching materials we can get.

**What we fix**

**[H2]** Roof repairs we handle

**[LIST]**

- Roof leak detection and repair  
- Missing or damaged shingle replacement  
- Flashing, vent, and chimney repairs  
- Siding crack and panel replacement  
- Storm and hail damage restoration  
- Gutter and flashing replacement  
- Preventive inspections and maintenance

**[P]** Water coming in right now? [LINK] emergency roof repair → /emergency-roof-repair/

**Repair or replace**

**[H2]** Repair or replace? We'll give you the honest answer

**[P]** Quick, well-done repairs keep small problems from turning into a costly replacement. If your roof has good years left and the problem is in one spot, a repair is the right call and the cheaper one.

**[P]** Sometimes a repair won't hold. The shingles are worn out across the whole roof, or the leaks keep moving. When that's the case, we'll explain why. The decision is yours. [LINK] roof replacement → /roof-replacement/

**Process**

**[H2]** How a roof repair works

**[STEPS]**

1. **Inspection and damage assessment.** We examine the roof and siding to find hidden damage and the root cause of the wear or leak.  
2. **Repair plan and materials.** You get a detailed repair plan and price, with the most durable matching materials.  
3. **The repair.** From shingle replacement to siding restoration, done right and on time. Most repairs are done within 24 hours of the call.

**[IMAGE]** Close-up before and after of a flashing or shingle repair

**Reviews**

**[H2]** What your neighbors say

**[REVIEW]** [Pull from GBP: a review that mentions a repair or a quick response]

**[REVIEW]** [Pull from GBP: a review that mentions fair pricing]

**FAQ**

**[H2]** Roof repair questions

**[FAQ Q]** How much does roof repair cost?

**[FAQ A]** Small repairs, like replacing a few shingles or a pipe boot, cost far less than bigger jobs like re-flashing a chimney or replacing rotted decking. We do not quote repair prices online because the fix depends on what we find. You'll get a written price after the inspection, and the repaired area carries a 60-day warranty.

**[FAQ Q]** Can you match my existing shingles?

**[FAQ A]** Usually close. Shingle colors fade over the years and some lines get discontinued, so an exact match isn't always possible on an older roof. We'll show you the closest option before we install it.

**[FAQ Q]** How do I know if my roof needs repair or replacement?

**[FAQ A]** Damage in one area on a roof under 15 years old usually means repair. Worn shingles everywhere, leaks in several spots, or a roof past 20 years usually means replacement. A free inspection will settle it.

**[FAQ Q]** Do you repair roofs after storm damage?

**[FAQ A]** Yes. Storm and hail damage restoration is part of what we do, and we help with the insurance claim. [LINK] storm damage help → /storm-damage-roof-repair/

**CTA**

**[H2]** Stop the leak before it spreads

**[P]** Tell us what you're seeing. We'll come look and give you a written repair price.

**[CTA PRIMARY]** Book a Free Roof Inspection

**[CTA SECONDARY]** Call or text (703) 677-1976

**Internal links on this page:** /emergency-roof-repair/ · /roof-replacement/ · /storm-damage-roof-repair/ · /free-roof-inspection/ · /reviews/ · / (breadcrumb)

---

## 5. Page: Storm Damage Roof Repair

**Page spec**

| Field | Value |
| :---- | :---- |
| [URL] | /storm-damage-roof-repair/ |
| [META TITLE] | Storm Damage Roof Repair Woodbridge VA | RC All Exteriors |
| [META DESCRIPTION] | Wind or hail damage? We inspect your roof, write the estimate, and help with your insurance claim. Licensed roofer serving Woodbridge and Northern Virginia. |
| Primary keyword | storm damage roof repair |
| Supporting keywords | wind damage roof repair, roof insurance claim, emergency roof tarp |
| [SCHEMA] | Service (serviceType: Storm Damage Roof Repair) · FAQPage · BreadcrumbList |

**Hero**

**[H1]** Storm Damage Roof Repair in Northern Virginia

**[SUBHEAD]** Wind tore off shingles or hail beat up the roof? We do storm damage inspections, repair the damage, and help with your insurance claim.

**[CTA PRIMARY]** Book a Storm Damage Inspection

**[CTA SECONDARY]** Call or text (703) 677-1976

**[TRUST BAR]** Local Woodbridge roofer · Class A licensed · Insurance claim assistance · 49 five-star reviews

**Intro**

**[P]** Most people don't know their roof is damaged until a storm shows them. A few shingles in the yard, a new stain on the ceiling, dented gutters.

**[P]** After a big storm, crews from out of the area often start knocking on doors. We're based in Woodbridge, and we'll still be here when you need the warranty. A lot of homeowners have been burned by a contractor who took the insurance check and disappeared. We want your claim handled and covered without a fight, and a roof that holds through the next storm season.

**First steps**

**[H2]** What to do right after a storm

**[STEPS]**

1. **Stay safe.** Don't climb on the roof. Watch for downed lines and loose branches.  
2. **Take photos.** Shoot the yard, the gutters, any fallen shingles, and inside stains, with the date.  
3. **Stop the water.** If it's coming inside, call us for an emergency tarp. [LINK] emergency roof repair → /emergency-roof-repair/  
4. **Get an inspection.** A roofer's report gives your adjuster the evidence they need.  
5. **Call your insurance company.** Open the claim once you know what's damaged.

**Signs**

**[H2]** Signs of wind and hail damage

**[LIST]**

- Missing or lifted shingles, especially along edges and ridges  
- Round dark spots where hail knocked granules off  
- Dents in gutters, vents, and downspouts  
- Creased shingles that flipped up in the wind and bent back  
- New leaks or stains after the storm

**[IMAGE]** Close-up photo of hail marks on shingles from a local job

**Insurance help**

**[H2]** How we help with your insurance claim

**[P]** Insurance claim assistance and estimates are part of our standard services. Our customers bring up the insurance process in their reviews.

**[LIST]**

- **Storm damage inspection.** We check the roof for wind and hail damage and photograph everything for your claim.  
- **Estimate for your claim.** What needs to be repaired or replaced, and why.  
- **Adjuster meeting.** We meet your adjuster on the roof to walk the damage together.  
- **Straight talk on your options.** If the damage looks too small for a claim, we'll say so and quote the repair directly.

**[P]** We never offer to cover or "waive" your deductible. A contractor who does that is putting you in a bad spot with your insurance company.

**FAQ**

**[H2]** Storm damage questions

**[FAQ Q]** Does homeowners insurance cover storm damage to a roof?

**[FAQ A]** Most policies cover sudden damage from wind and hail. They usually don't cover wear and age. Your policy, your deductible, and the age of your roof all affect what gets paid. Your adjuster makes the final call.

**[FAQ Q]** How soon should I file a claim after a storm?

**[FAQ A]** As soon as you know there's damage. Many policies have a deadline for reporting, so check yours. Getting an inspection first means you file with real evidence instead of a guess.

**[FAQ Q]** Can you tarp my roof right away?

**[FAQ A]** Yes. If water is coming in, we'll put a temporary tarp on to protect the house until the repair. Emergency calls are answered after hours and on weekends, and we tell you a real arrival time when you call. Call or text (703) 677-1976.

**[FAQ Q]** Will filing a claim raise my premium?

**[FAQ A]** It depends on your insurance company and your claim history. Ask your agent. We'll tell you honestly if the damage is small enough that paying for a repair yourself makes more sense.

**CTA**

**[H2]** Find out if the storm damaged your roof

**[P]** Free storm damage inspection, an estimate, and help with the claim if you need one.

**[CTA PRIMARY]** Book a Storm Damage Inspection

**[CTA SECONDARY]** Call or text (703) 677-1976

**Internal links on this page:** /emergency-roof-repair/ · /roof-repair/ · /roof-replacement/ · /free-roof-inspection/ · /guides/does-insurance-cover-roof-replacement/ (when published) · / (breadcrumb)

---

## 6. Page: Free Roof Inspection

**Page spec**

| Field | Value |
| :---- | :---- |
| [URL] | /free-roof-inspection/ |
| [META TITLE] | Free Roof Inspection in Woodbridge, VA | RC All Exteriors |
| [META DESCRIPTION] | Book a free roof inspection in Woodbridge and Northern Virginia. A detailed look at your roof, a straight answer, and a written estimate. No pressure. |
| Primary keyword | free roof inspection |
| Supporting keywords | roof inspection northern virginia, roof inspection woodbridge va |
| [SCHEMA] | Service (serviceType: Roof Inspection, offers price 0\) · FAQPage · BreadcrumbList |

**Hero**

**[H1]** Free Roof Inspection in Woodbridge, VA

**[SUBHEAD]** A detailed inspection of your roof and a straight answer. No cost and no pressure to book.

**[CTA PRIMARY]** Book a Free Roof Inspection

**[CTA SECONDARY]** Call or text (703) 677-1976

**[FORM]** Name · Phone · Street address and zip · What's going on? (Leak / Storm damage / Roof is getting old / Buying or selling a home / Other) · Best time to reach you. Button: "Book a Free Roof Inspection." Confirmation text: "Got it. We call back fast, usually within minutes during business hours, to set a time."

**Who it's for**

**[H2]** When a free inspection makes sense

**[LIST]**

- Your roof is 15 years old or more and you've never had it checked  
- A storm just came through and you want to know if there's damage  
- You found shingles in the yard or a stain on the ceiling  
- You're buying or selling a home and need to know what you're dealing with

**What we check**

**[H2]** What we check

**[LIST]**

- Shingles: wear, cracking, curling, and missing pieces  
- Flashing around chimneys, walls, and skylights  
- Vents and pipe boots  
- Gutters and drip edge  
- Ventilation, with an attic check when there is an active leak  
- Storm damage: hail marks and wind-lifted shingles

**What you get**

**[H2]** What you get afterward

**[P]** An honest read on your roof. If it needs work, you get a transparent written estimate. If it doesn't, we'll tell you that too, and you won't hear a sales pitch. Either way you get the inspection photos in a written report.

**[IMAGE]** Sample page from an inspection photo report

**Process**

**[H2]** How it works

**[STEPS]**

1. **Book online or call.** Pick a time that works. Most inspections happen within 24 to 48 hours.  
2. **We inspect.** Most inspections take about 30 minutes.  
3. **You get our answer.** Landmark and Landmark Pro quotes are usually ready on the spot; anything else within 24 hours, by call, text, or email, whichever you prefer.

**FAQ**

**[H2]** Free inspection questions

**[FAQ Q]** Is the inspection really free?

**[FAQ A]** Yes. There's no charge and no obligation. You get our honest read on the roof whether you hire us or not.

**[FAQ Q]** Do I need to be home?

**[FAQ A]** Not for the roof itself. Many homeowners like to be there so Ricardo can walk them through what he found. If two of you make the decision, we'll walk you both through it.

**[FAQ Q]** Will you try to sell me a new roof?

**[FAQ A]** Only if you need one. If a repair will do, we'll quote the repair. If nothing needs doing, we'll tell you that.

**[FAQ Q]** Can you inspect a roof before I buy a house?

**[FAQ A]** Not as part of a purchase. We don't do pre-purchase inspections for buyers. If you're selling, or you've just closed and want to know what you bought, book a free inspection and you'll get the same honest read.

**CTA**

**[H2]** Get a straight answer about your roof

**[CTA PRIMARY]** Book a Free Roof Inspection

**[CTA SECONDARY]** Call or text (703) 677-1976

**Internal links on this page:** /roof-repair/ · /roof-replacement/ · /storm-damage-roof-repair/ · /reviews/ · / (breadcrumb)

---

## 7. Humanizer pass (step 5\)

| Check | Result |
| :---- | :---- |
| Phrases from the elimination list | 0 found in page copy ("seamless gutters" kept as the product name) |
| Em dashes | 0 found |
| Sentences over 25 words | 0 in body copy |
| Adjective stacking (3+ in a row) | None |
| Lists forced into threes | Lists use 4 to 7 items |
| Invented facts | None. Every claim traces to Ricardo's questionnaire, the current site, the GBP, or the launch call, or is marked [CONFIRM] |

---

## 8. Review scores (step 6\)

| Page | Clarity | Persuasion | SEO | Human feel | Persona match | Total |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Home | 18 | 17 | 18 | 18 | 18 | **89** |
| Roof Replacement | 18 | 17 | 18 | 17 | 18 | **88** |
| Roof Repair | 19 | 17 | 18 | 18 | 17 | **89** |
| Storm Damage | 18 | 18 | 17 | 18 | 18 | **89** |
| Free Roof Inspection | 19 | 16 | 17 | 18 | 17 | **87** |

**Delivery decision: READY for client review.** All five pages clear the 80-point gate. Revised Sept 22 against Ricardo's ICP questionnaire; unsupported details remain [CONFIRM].

- **Persuasion (all pages):** the review cards are placeholders. Pulling three real Google reviews per page adds specific social proof.  
- **All pages:** [CONFIRM] placeholders for price ranges, timelines, and license number. Fill before launch.

---

## 9. Batch roadmap (max 5 pages per batch)

| Batch | Pages | Status |
| :---- | :---- | :---- |
| 1 | Home · Roof Replacement · Roof Repair · Storm Damage · Free Roof Inspection | This doc |
| 2 | Emergency Roof Repair · Warranty · Financing · About Ricardo · Contact | Done |
| 3 | Windows and Doors · Gutters · Siding · CertainTeed Roofing · Metal Roofing | Done |
| 4 | Commercial Roofing · Skylights · Services hub · Service Areas hub · Reviews | Done |
| 5 | Lorton · Fairfax · Springfield · Projects gallery · case study template | Done. Completes the 28 launch pages |
| 6+ | Alexandria, Fairfax Station (month 2\) · Arlington, McLean, Great Falls (month 3\) · service-by-city pages · guides via /blog | Post-launch |

---

## 10. Before this goes to Claude Code

- [ ] Ricardo confirms every [CONFIRM] item (price ranges, timelines, license number, warranty terms, financing partner)  
- [ ] Pull 3 real Google reviews per page into the [REVIEW] slots  
- [ ] Pick real project photos for each [IMAGE] slot from the 52 on the current site  
- [ ] Client approves the copy