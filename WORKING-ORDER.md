# Working order: RC All Exteriors

## 2026-10-07 (repo seeded, no code yet)

**Done**
- Repo seeded from the workspace: `design/` (Gate A export, 27 artboards, padding amended), `copy/` (5 batches + SITEMAP), `brand/`, `adr/ADR-002`, `MASTER-WEBSITE-PROMPT.md` v1.2, `MODE-B-PROMPT.md`, four photo selects, README, CLAUDE.md, GATE-A.md (unsigned).

**Blocked**
- Originals for photos: the four selects in `src/assets/photos/` are 2400px re-encodes. Pull the originals from the RC Drive folder (list in `src/assets/photos/PHOTO-INVENTORY.md`), including the unwatermarked hero source `colonial-home-roof-replacement-gray-shingle-01.jpg` and one finished-roof shot per job folder. The mansard yard-sign original is missing from the selects.
- Vercel project and env vars (`RESEND_API_KEY`, `LEAD_NOTIFY_TO`, `COMMAND_CENTER_URL`, `COMMAND_CENTER_TOKEN`, `GOOGLE_PLACES_KEY`, `GBP_PLACE_ID`): not yet set. Routes degrade gracefully without them.

**Done (cont.)**
- `GATE-A.md` signed by Sam 2026-10-07, four decisions approved as written. `design/` is now read-only.

**Next**
1. Open Claude Code at the repo root and paste `MODE-B-PROMPT.md`.

**Resume commands**
```
cd ~/Surge-Cowork/repos/rc-all-exteriors && git status && cat WORKING-ORDER.md
```
