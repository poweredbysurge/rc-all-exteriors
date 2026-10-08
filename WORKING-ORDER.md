# Working order: RC All Exteriors

## 2026-10-07 (repo seeded, no code yet)

**Done**
- Repo seeded from the workspace: `design/` (Gate A export, 27 artboards, padding amended), `copy/` (5 batches + SITEMAP), `brand/`, `adr/ADR-002`, `MASTER-WEBSITE-PROMPT.md` v1.2, `MODE-B-PROMPT.md`, four photo selects, README, CLAUDE.md, GATE-A.md (unsigned).

**Blocked**
- `GATE-A.md` needs Sam's signature and the four decisions confirmed before Mode B starts.
- Originals for photos: the four selects in `src/assets/photos/` are 2400px re-encodes. Pull the originals from the RC Drive folder (list in `src/assets/photos/PHOTO-INVENTORY.md`), including the unwatermarked hero source `colonial-home-roof-replacement-gray-shingle-01.jpg` and one finished-roof shot per job folder. The mansard yard-sign original is missing from the selects.
- Vercel project and env vars (`RESEND_API_KEY`, `LEAD_NOTIFY_TO`, `COMMAND_CENTER_URL`, `COMMAND_CENTER_TOKEN`, `GOOGLE_PLACES_KEY`, `GBP_PLACE_ID`): not yet set. Routes degrade gracefully without them.

**Next**
1. Sam signs `GATE-A.md`.
2. Open Claude Code at the repo root and paste `MODE-B-PROMPT.md`.

**Resume commands**
```
cd ~/Surge-Cowork/repos/rc-all-exteriors && git status && cat WORKING-ORDER.md
```
