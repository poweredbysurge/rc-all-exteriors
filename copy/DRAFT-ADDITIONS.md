# DRAFT additions: copy on the site that is not in batches 1 to 5

Everything here needs the humanizer pass and Sam's sign-off before launch. The approved copy in `batch-*.md` is rendered verbatim by the parser and is not repeated here.

## Kept by Gate A decision (2026-10-07)

| Where | Text | Source |
|---|---|---|
| Service hub, city row | "Based in Woodbridge. Serving Lake Ridge and the neighborhoods around our home base, plus:" | Design. Gate A decision 2. |
| Service hub, city row heading | "[Service] across Northern Virginia" (for example "Roof replacement across Northern Virginia") | Design. Generated per service from its nav label. |
| Offer page timeline | "We confirm a time." with "Ricardo will call you within [CONFIRM: hours] to set a time." | Built from the copy's confirmation sentence. Gate A decision 3. |
| Section eyebrows | Why us, Services, Reviews, Service area, What is included, Recent work | The copy's own section labels. Gate A decision 4. |

## From the design, DRAFT

| Where | Text |
|---|---|
| Lead card heading and sub | "Book your free inspection" / "Schedule online in under a minute. We'll do the rest." (master prompt section 10) |
| Lead card step 2 heading | "A few more details help us prep for your visit. All optional." |
| Lead card success, thank-you page | "What happens next: we confirm a time, inspect the roof, and give you a straight answer with a written estimate if work is needed." / "Need us sooner? Call or text (703) 677-1976." |
| 404 | "That page is not here" / "The address may have changed when we rebuilt the site. Pick a service below, or call or text us and we'll point you the right way." |
| Stat strip labels | "five-star Google reviews", "workmanship warranty", "Virginia licensed", "7am to 5pm" |
| Roof replacement | "Repair or replace" table (phrases lifted from batch-1 section 3 and 4 FAQs), material cards ("The shingles Ricardo uses on most jobs.", "Metal roofing systems are available too.", "Flat roofing systems are available too."), "Pricing guidance" card with "Your free inspection ends with a written estimate." |
| Related services heading | "Related services" |
| City pages | "Recent work" eyebrow, "[City] neighborhoods we serve", "Nearby service areas" |

## Written at build, DRAFT

| Where | Text | Why it exists |
|---|---|---|
| Lead card step 2 | Best time options: Morning, Afternoon, Evening, Any time | The copy names the field, not its choices. |
| Form validation | "Enter your name so we know who to ask for." / "Enter a 10-digit phone number so we can call you back." / "Enter an email address, like name@example.com." / "Enter a 5-digit zip code." / "Choose the option that fits best." / "Check the [field] field above. Or call or text us at (703) 677-1976." | Inline errors. The phone one is from the lead-card-error artboard. |
| Form retry | "We could not send that just now. Call or text us at (703) 677-1976, or press the button to try again." | Network failure state, not drawn. |
| Map captions | "Our service area across Northern Virginia, from our Woodbridge base. Solid dots have their own page. Schematic, not to scale." and the shorter variants | The artboard caption was a note to the builder. |
| Projects page | "All work" filter label, "Town for each photo: [CONFIRM]. Until then every photo files under Other." | Batch-5 build note, made visible. |
| Photo alt text | Five alts in `src/data/photos.ts` | No town in any of them. |
| Legal pages | All of `/privacy-policy/`, `/terms/`, `/sms-terms/` | No `templates/legal` exists in the workspace. Written to the A2P 10DLC requirements. Each page carries a CONFIRM slot and cannot ship until RC approves the text. |
| Page titles and descriptions | Legal pages, `/thank-you/`, 404 | Not in the copy. |
| Lead confirmation email | Subject and two sentences in `src/lib/lead.ts` | Only sent once `LEAD_REPLY_FROM` is set. |
