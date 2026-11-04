# Ravi / راوی: project guide for Claude sessions

**What this is:** an agentic AI media and communications platform, pitched first to Iranian politicians and media, and now being reshaped with a media partner for **brands that need posts, reels and videos to hit view and engagement targets** across Iranian platforms. The current phase is research and feasibility. **Start with `research/README.md`**: it gives the reading order, the method, the corrections to earlier claims and the next 10-day field sprint.

## Map
| Path | What |
|---|---|
| `start-ravi.bat`, `index.html` | Windows launcher: serves the repo root on `0.0.0.0:7002` (needs Python 3) and opens the landing page linking the showcase, dashboard, onboarding and Decision Room |
| `research/` | **Current work** (2026-11-02): commercial pivot research, architecture, meeting brief, local agent-fleet assessment, Persian product guide |
| `showcase/` | **Short presentation** (`index.html`): one page, six features the speaker switches between (tabs or keys ۱–۶), dashboard button at the end. Recommended for partner meetings; talk track in `research/07` |
| `onboarding/` | **Partner onboarding journey** (`index.html`): cinematic 20-scene presentation of the campaign journey and the agent fleet; script in `research/07_partner_onboarding_script.md` |
| `ravi/` | **Main dashboard** on the cinematic teal UI: commercial campaign flow + agent fleet, market radar, supplier quality index. Political version at `ravi/political.html` |
| `decision-room/` | Decision Room (`index.html`): team appendix with readiness map, unit economics and open decisions (team/partner modes) |
| `technical-walkthrough/` | Animated technical walkthrough (HyperFrames + study player `walkthrough.html`) |
| `01_concept_and_research.md`, `03_v2_direction.md` | Original concept, research and v2 direction |
| `04_platform_design.md` | Platform v1 design (Compass personalisation, flows, architecture) |
| `05_cost_estimate.md` | AI cost brief. OpenAI prohibits political campaigning and doesn't serve Iran; self-hosted open-weight models are recommended |
| `platform/` | Earlier version of the commercial prototype in the original visual style (superseded by `ravi/`). Serve the repo root (`python -m http.server 8000`) so `ravi/`, `onboarding/` and `decision-room/` share fonts |
| `video/` | HyperFrames pitch film source (compositions, scripts). Rendered media, plates and voice takes are **not in git** |
| `tools/` | Local media scripts (ComfyUI, Codex, Persian VO pipeline). Need the user's local GPU PC |

## Rules
- Persian UI is right-to-left, uses the Vazirmatn font and Persian digits. The product language is Persian; docs can be English with Persian terms.
- **Integrity line:** no fake accounts, no undisclosed bots, no deepfakes of real people, no fake engagement. Agents may watch, analyse, create, simulate, and act only through the customer's own accounts and real paid placements.
- Cite every external fact with a source and date; flag vendor claims.
- Ask before any paid API usage. Media generation (ComfyUI, Codex images, TTS) only happens on the user's local PC.
- The user prefers concise, decision-ready outputs and being asked before big batches of work.
