# Ravi / راوی: platform design (v1)
*2026-11-01 · the product behind the film*

## 1. Who buys it and what they actually need

| Customer | Daily reality | What they'd pay for |
|---|---|---|
| **MP / minister / city council member** and their 2–6 person media team | Telegram channels and Instagram set the agenda overnight; the team finds out from WhatsApp forwards; responses go out late and off-tone | Early warning on rumours, a 6 AM brief, fast drafts in the leader's voice, knowing what rivals are doing |
| **Ministry / municipality PR office (روابط عمومی)** | Dozens of daily mentions, official statements that must be correct, approval chains that slow everything | A single queue: what's rising, a fact-checked response draft, an approval chain, an audit trail |
| **Party / campaign HQ** | Many candidates, no shared picture, inconsistent messaging | One war room across all candidates, shared playbooks, coordinated (and honest) messaging |
| **Newsroom / PR agency** | Needs to know what's trending first, and what's true | Narrative radar, fact-check engine and AI-mirror as a service, plus an API |

What they all share: **speed** (hours, not days), **trust** (no embarrassing mistakes), **control** (a human approves everything), **direction** (the tool must serve *their* agenda, not a generic feed).

**What already exists.** Meltwater, Cision and Brandwatch now ship AI assistants (Meltwater's *Mira*, plus MCP tools so other AI assistants can act inside it). They are English-first monitoring dashboards. None of them does Persian platforms (Telegram, Eitaa, Rubika, Bale, Aparat), and none runs the full *listen → decide → create → approve → learn* loop with agents. That gap is Ravi.

## 2. The core idea: Compass, then agents

Everything in Ravi is steered by the customer's **Compass (قطب‌نما)**: a living definition of what matters to them. The crawlers, the ranking, the agents and the studio all read it.

**What the Compass contains**

| Section | Example | What it steers |
|---|---|---|
| **Focus topics** (موضوع‌های تمرکز), each with a priority | Air quality ★★★, public transport ★★, housing ★ | Crawler priority, radar ranking, brief order |
| **Direction goals** (جهت‌ها): the position they want to own | "Be known as the leader who is transparent on air quality" | Agents score every opportunity and draft against these goals |
| **Red lines** (خط قرمز) | No attacks on individuals; no unverified numbers; no ethnic or religious framing | The Integrity agent blocks or flags drafts; the studio never proposes them |
| **Watch lists** (فهرست پایش) | 2 rivals, 14 journalists, 40 channels, districts 4/6/15 | Dedicated tracking, rival radar, influence map |
| **Sources** (منابع) | Include: official channels, 12 news sites. Exclude: known fake-news channels. Trust levels | Fact-check weighting, crawler scope |
| **Voice DNA** (لحن) | Upload of 20 speeches and 200 posts; tone sliders (formal ↔ warm, data ↔ story) | Every draft in the studio |
| **Alert rules** (هشدار) | Notify if a focus narrative's probability is above 60% or it mentions me; quiet 23:00–06:00 except critical | Bale/Telegram bot, SMS, in-app |
| **Team and approvals** | Drafter → comms director → leader; legal review for numbers | Approval queue |

**Compass is alive.** Every week the Learning agent proposes changes, for example: «"night transport" is rising and matches your goals; add it to your focus?». The user accepts or rejects each one.

## 3. Information architecture (navigation)

```
راوی
├── خانه · گزارش روزانه      Home / Daily brief (6 AM audio + 3 cards + agenda)
├── رادار روایت              Narrative radar (clusters, lifecycle, probability, carriers, bots)
├── مأموریت‌ها               Missions: agent council runs (respond to rumour, interview prep, weekly plan)
├── آزمایشگاه پیام            Message lab: synthetic audience testing
├── استودیو                  Studio: multi-format drafts, hooks, voice match
├── مزیت رقابتی
│   ├── رقیب‌سنج             Rival radar + white space
│   └── نفوذ و آینه          Influence map + AI mirror
├── صف تأیید                 Approval queue + integrity checks + audit log
├── گزارش و یادگیری          Results, playbook, Compass suggestions
└── قطب‌نما                  Compass (personalisation)

Everywhere: «از راوی بپرس» (Ask Ravi, a chat drawer over all data) · mobile companion bot on Bale/Telegram
```

## 4. Key flows

**F1. Onboarding (day 0, about 20 minutes)**
1. A 5-step Compass wizard: role and constituency → focus topics → direction goals → red lines → watch lists.
2. Agents **expand** the Compass: they propose keywords, entities, channels and rival accounts, and the user ticks or unticks them.
3. Backfill of the last 30 days, then a first brief within about 1 hour.

**F2. Daily rhythm**
06:00 brief (audio and cards) → tap a *risk* → radar detail → **Start mission** → …

**F3. Rumour-response mission (the hero flow in the film)**
1. **Trigger:** an alert or a manual start.
2. **Agent council:** Analyst (sources, origin), Fact-checker (official records), Critic, Strategist. The trace is visible.
3. **Output:** 3 options, each with risk and reach.
4. **Message lab:** test the options on the synthetic audience, then pick a combination.
5. **Studio:** draft every format in Voice DNA.
6. **Approval chain:** integrity checks run automatically.
7. **Publish:** export, or post to the customer's own official accounts via their official APIs. Never via fake accounts.
8. **Monitor:** watch the effect on the narrative curve.

**F4. Interview / debate prep mission**
A briefing pack on likely questions (from the journalist's history and current narratives) → a hostile-interviewer simulator → a one-page cheat sheet.

**F5. Weekly strategy**
Rival radar + white space → the agents propose a content calendar against the direction goals → the team edits it.

**F6. Learning loop**
Post results → attribution (what moved which narrative) → playbook update → Compass suggestions.

## 5. Feature set by release

| | MVP (month 0–4) | v1 (month 5–8) | v2 |
|---|---|---|---|
| Listening | Telegram public channels, news sites, Aparat/YouTube transcripts | Instagram (via data provider), Eitaa, Rubika, Bale public channels, X | Podcasts, TV transcription |
| Understanding | Narrative clustering, lifecycle, carriers, bot flags | Early-warning probability, influence graph | Calibrated forecasting |
| Deciding | Missions: rumour response | Interview prep, weekly plan, Message lab | War-gaming |
| Creating | Studio text formats, Voice DNA | Hooks scoring, image cards, short-video scripts | Video and voice drafts |
| Competing | Rival share of voice | White space, AI mirror | Coalition suggestions |
| Control | Compass, approvals, audit log | Compass learning, team roles | On-prem / white-label |

Dropped: **constituency heatmap**. Reliable district-level data is hard to collect, and an inaccurate map would hurt trust.

## 6. Architecture (what the costs depend on)

```
Connectors (crawl) → Normalise (Persian text, dedupe, language) → Embed → Relevance filter (Compass)
   → Classify (topic, stance, sentiment) → Cluster into narratives → Label/summarise → Early-warning scorer
   → Store (Postgres + vector index + object store)
Agent layer (orchestrator + specialist agents + tools: search index, fetch source, simulate, draft)
   → Missions · Brief · Studio · Message lab · AI mirror
Integrity layer: red-line checks, citation requirement, AI-label + provenance, audit log, human approval
```

- **The Compass relevance filter is the main cost lever.** Only about 10–25% of ingested items reach the expensive models.
- **Model tiers:**
  - nano/small models: classification and persona simulation
  - mid models: narrative labels, summaries, chat
  - top model: briefs, missions, studio drafts

## 7. Integrity by design (a selling point, not a disclaimer)

- No fake accounts, no undisclosed bots, no deepfakes of real people. Publishing goes only to the customer's own official accounts.
- Every factual claim in a draft needs a source. The Integrity agent blocks unverified numbers.
- AI-assisted label and content provenance on every published asset. A full audit log of who approved what.
- Public data only, plus customer-provided data. No private messages, no doxxing.
