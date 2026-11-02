# Ravi commercial-platform research session

Date: 2026-11-02 · Status: desk-research recommendation, pending partner interviews and integration tests.

The user has confirmed that the prospective media partner's strongest contribution is **brand clients and sales relationships**. Publisher inventory, negotiated rates, and analytics access are therefore unproven dependencies, not assets we can assume we already have.

## Read in this order

1. [Research and feasibility](01_research_and_feasibility.md): market, media-company model, channel constraints, product expansion, evidence register.
2. [Architecture and product design](02_architecture_and_product.md): workflows, measurement, agents, data, reliability, interface, delivery plan.
3. [Meeting brief](03_meeting_brief.md): positioning, partnership terms to explore, pilot, economics, and questions.
4. [Local agent fleet assessment](04_local_agent_fleet.md): 24/7 worker groups, authorized interaction, synthetic engagement, capacity, and comparative experiments.
5. [Desk-research gaps](05_desk_research_gaps.md): 2026 shutdowns and what they change, platform usage figures, ad pricing and fraud, Iranian ad networks, models from abroad.
6. [Field-sprint kit](06_field_sprint_kit.md): partner and Persian client interview guides, supplier quote template, pilot proposal template.
7. [Partner onboarding script](07_partner_onboarding_script.md) and its visual version, the [onboarding journey](../onboarding/index.html); the main [dashboard](../ravi/index.html).
8. [Decision Room](../decision-room/index.html): Persian, animated, seven chapters (problem, differentiation, campaign flow and the "100 agents" question, agent system, readiness map, unit-economics calculator, open decisions and pilot offer). Team and media-partner modes; open with `#partner` for the partner view.
9. [Animated technical walkthrough](../technical-walkthrough/walkthrough.html): six chapters with pause/scrub controls and implementation notes; fictional campaign and proposed screens.

## Session plan and research method

| Step | Question | Evidence and method | Decision produced |
|---|---|---|---|
| 1. Audit current concept | What is reusable? | Read original concept, platform design, costs, and UI entry point | Reuse Compass, Studio, approvals; change central workflow to commercial campaigns |
| 2. Map competition | Is this genuinely missing? | Iranian vendor product pages; international campaign and creator platforms | Compete on operational execution and verified local outcomes, not generic AI or channel breadth |
| 3. Study publisher business | What does a media company actually sell? | KhabarOnline advertising page and editorial charter; media-company reporting | Treat publishers as suppliers of audience/context/credibility; preserve editorial independence |
| 4. Audit channel access | Can we buy, publish, and measure? | Official APIs, provider documentation, vendor product claims | Separate API capability, account eligibility, buying rights, and verified measurement |
| 5. Define product promise | What can we commit to? | Metric definitions, contract design, failure scenarios | Per-channel targets and evidence rules; cautious guarantees only on contracted inventory |
| 6. Design execution | Where do agents help? | Map work from brief to settlement | AI drafts/recommends; deterministic services enforce budgets, permissions, and accounting |
| 7. Test commercial feasibility | Will customers pay enough? | Proposed paid pilot with real cost/time logs | Managed service first; platform expansion conditional on repeatability |
| 8. Validate in field | What remains unknown? | Client interviews, supplier quotes, account tests, historical campaigns | Go/no-go gates rather than assumed API access or invented market rates |

### Evidence discipline

- Public vendor claims establish advertised capability, not independently verified performance.
- Documentation establishes a possible integration, not approval for our company or access to customer accounts.
- Missing public documentation means **unverified**, not impossible.
- Recommendations, planning estimates, and illustrative economics are identified as such.
- No authenticated dashboards, private rate cards, partner contracts, production integrations, or customer interviews were available in this session.
- No exhaustive Iranian market census was performed. We cannot substantiate “first in Iran” or “nobody else does this.”

### Next source-gathering sprint: proposed ten working days

Days 1–2: Partner supplies three anonymized completed campaign packs, five candidate clients, current proposals and cost sheets. Interview sales and the person who actually operates campaigns.

Days 3–4: Interview five prospective buyers across consumer brands and industrial/B2B clients. Capture buying triggers, budgets, approved KPIs, procurement delays, dissatisfaction, and willingness to pay for a pilot. Do not ask only whether they like AI.

Days 3–6: Request comparable quotes from two intermediaries and at least ten direct publishers/creators. Compare formats, posting windows, minimum spends, deletion rules, evidence, cancellation, and shortfall remedies. Interviews and outreach require separate execution authorization; none were sent in this session.

Days 5–8: Test one authorized account per launch channel: publish or hand off, obtain post ID, collect evidence, retry after failure, revoke access, and export the result. Resolve provider availability, payments, and deployment eligibility for the actual operating entity.

Days 9–10: Build a real costed pilot proposal, review supplier capacity, and decide whether the evidence supports selling a target, an estimate, or only a fixed placement.

## Corrections to the earlier proposal

The earlier files contain broad competitive claims such as “nobody runs the full loop,” and precise forecast/cost assumptions without demonstrated data. They should not be repeated in the new pitch. Current vendor pages explicitly advertise integrated planning, content, publishing, measurement, and AI optimization. The old political-persona workflow, synthetic electorate, and GPU/customer cost estimates are not the baseline for this commercial product.

Existing proposal and demo files were preserved. The main dashboard in `ravi/` shows the commercial campaign flow on the cinematic UI (an earlier version is in `platform/`) (brief → objective → plan → creative → approval → booking/publish → evidence → settlement) with a fictional brand; the political version is archived at `platform/political.html`.
