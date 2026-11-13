# ADR-025: Brava credential matches the certificate

**Date:** 2026-11-13
**Status:** Accepted. Publishes when main is pushed.

## Context

The site said "certified Brava installer", and the About list and brand strip added "synthetic shake, slate and Spanish tile". Ricardo's certificate (PDF in RC Drive > Media > Company) is narrower: Brava Cedar Shake Installation Training, Level 1, issued by Brava Roof Tile to Ricardo Castro, RC All Exteriors LLC, awarded 2026-05-18, refresher due by 2027-05-18. There is no certificate number. RC is not on Brava's preferred contractor list.

## Decision

1. Two wordings only. Short (trust bars, lists, footer, brand strip): "Brava Cedar Shake Level 1 certified installer". Long (About, credentials sections, prose): "Ricardo completed Brava's Cedar Shake Installation Training, Level 1, in May 2026." Never "preferred". No claim about slate or tile certification.
2. Product mentions (Brava synthetic shake, captions, alt text) are unchanged.
3. The credential lives once in `business.json` `ownerCredentials`. `schema.ts` maps it to `hasCredential` (EducationalOccupationalCredential) on the About Person node and on the Article author on every guide.
4. No certificate number is ever added. After 2027-05-18, check the refresher before keeping the claim.

## Consequences

Brava logo stays in the brand strip (ADR-011); its title and aria label now carry the short wording. The fact ledger row is in `copy/batch-1.md` locked facts.
