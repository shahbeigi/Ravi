# Research and feasibility: Ravi for commercial campaigns

2026-11-02 · Recommendations unless explicitly attributed to a source.

## 1. Recommended product thesis

**Ravi should become an AI-assisted campaign operating platform that converts a brand's brief, budget, and measurable target into a media plan, executes through authorized accounts and contracted publishers, and reconciles delivery against evidence.**

Start as a managed service powered by software. The sales partner provides client access; we provide the workflow, intelligence, reporting, and automation. Buy distribution through existing networks and direct suppliers while building a curated supply base. A large open marketplace would create a second acquisition problem before we have proven demand.

The core loop is:

**Brief → measurable objective → inventory and forecast → creative variants → approval → booking/publication → evidence → adjustment → settlement and learning.**

“Get attention” is too vague to sell or optimize. The client must select one primary objective:

| Buyer job | Primary measure | Useful secondary measures |
|---|---|---|
| Consumer launch | Platform-specific exposure or video consumption | Qualified visits, saves, product enquiries |
| E-commerce campaign | Accepted purchases or qualified sessions | Cost per order, refunds, conversion rate |
| Industrial company | Sales-accepted enquiries or relevant event registrations | Relevant trade-media placements, document downloads |
| Corporate reputation | Documented coverage and measured audience response | Brand-lift research, appropriate share of voice |

A steel supplier may prefer ten relevant procurement enquiries to a million general views. The product should reveal that distinction before selling media.

## 2. What already exists

| Company/category | Observed public offering | Implication for Ravi |
|---|---|---|
| Jaryan | Publisher selection and advertising across Instagram, Telegram, LinkedIn, Rubika, Bale, Eitaa, Soroush Plus; reporting and campaign workflows [S1] | Direct local competitor and potential supply intermediary. Channel breadth alone is not differentiation |
| Yektanet | Web/app advertising, targeting, video, and other acquisition products; it publicly claims large distribution scale [S2] | Partner or benchmark for distribution; do not attempt to recreate its network for the pilot |
| Triboon | Advertorial placement, content production, media relations, podcasts, and monitoring tools [S3] | PR distribution is already productized; distinguish paid coverage, SEO goals, and attention goals |
| Dataak / Zelkaa | Public positioning around media/social listening and analysis [S4–S5] | Persian listening is an existing category, not an empty market |
| Sprinklr | Integrated campaigns and AI optimization; announced marketing AI agents beta, including budget recommendations [S6–S7] | “Agentic marketing” is already competitive internationally |
| Smartly | Creative variation and dynamic optimization [S8] | Adapt the production-and-testing pattern to local formats and inventory |
| CreatorIQ | Creator discovery, operations, and measurement products [S9] | Supplier quality, evidence, and benchmarks are substantial product categories |

These are descriptions of marketed products, not hands-on competitive tests. No evidence here establishes that a competitor lacks a feature simply because its website does not mention it.

### Defensible differentiation to test

1. A reliable execution layer across both API-connected and manually operated Iranian channels.
2. A campaign evidence ledger connecting spend to actual placements and defensible measurement.
3. Lower operator time per campaign through agents handling repetitive coordination and analysis.
4. Better selection from a proprietary history of publisher × format × creative × sector performance.
5. A Persian commercial workflow that handles approvals, invoices, rial/toman display, local calendars, and reporting to brand procurement teams.

The advantage compounds through **permissioned performance data and operational reliability**. A collection of prompts is readily copied. Distribution relationships and trust still matter even if creative generation becomes cheap.

## 3. How a media company works: KhabarOnline as a concrete case

### What we can verify

KhabarOnline's public advertising page offers advertorials, advertising, banners, SEO, and social-network placements [S10]. Its October 19, 2026 editorial charter says revenue comes mainly from display advertising, advertorials, and sponsored content; it describes editorial roles and states that commercial relationships should not control editorial decisions [S11]. Its website links to Telegram, Instagram, X, Aparat, Bale, and Rubika [S12].

This demonstrates a publisher with several distribution surfaces and commercial products. It does **not** establish its current prices, margins, booking systems, audience quality, or any guaranteed-delivery policy. Those require interviews and a media kit.

### Business-model interpretation

A publisher invests in reporting, editing, production, distribution, technology, and audience relationships. Its commercial team packages access to that audience and context. An agency buys across publishers and manages the client's objective. An ad network aggregates inventory. Ravi would initially coordinate those parties and improve campaign operations.

Typical campaign workflow to validate with the partner:

| Work | Human role today, as a working model | Ravi's proposed contribution |
|---|---|---|
| Qualify brief and budget | Sales/account manager | Extract missing requirements; prepare a structured brief |
| Select media and obtain quotes | Media planner/buyer | Search approved inventory, compare quotes, flag missing evidence |
| Produce content | Copywriter/editor/designer | Draft approved variations, maintain claim sources and format requirements |
| Book and approve | Buyer, publisher, client | Versioned booking and approval workflow |
| Publish and chase delivery | Publisher/social team/operator | Authorized posting or manual handoff, deadlines, reminders |
| Collect results | Analyst/account manager | Evidence ingestion, reconciliation, discrepancy queue |
| Invoice and renew | Finance/sales | Cost reconciliation and evidence-backed next proposal |

This is a proposed operational model, not a claim that we inspected KhabarOnline's internal process.

Large international media businesses also monetize subscriptions, professional information, licensing, and events; News Corp's reporting illustrates that broader model [S13]. Therefore “big media” is not one homogeneous competitor. Our near-term comparison should be **the cost and quality of running a brand campaign**, not total newsroom output or total media-company revenue.

**Partnership strategy:** Make established publishers useful supply partners. Their credibility and audience are assets AI cannot conjure. Offer brands independent planning and evidence, and offer publishers clear briefs, fewer revisions, predictable payment, and additional legitimate demand. Paid placements should be clearly distinguished from editorial coverage.

## 4. Channel feasibility

The following is a desk-research matrix. No integration is certified production-ready. For every connector separately validate publication rights, measurement rights, commercial buying access, account/entity eligibility, and network availability.

| Channel | Feasible initial route | Evidence and limitations | Initial decision |
|---|---|---|---|
| Instagram | Authorized professional accounts where API access is approved; otherwise creator/publisher handoff | Meta's own Postman collection documents professional-account publishing and account limitations. The Facebook-login path requires a linked Page; do not generalize that requirement to every login path. Metric coverage and account eligibility need a test [S14] | High commercial relevance; support manual delivery evidence from day one |
| Telegram | Contracted channel placements; bots for authorized publishing; admin-authorized statistics or exports | Detailed channel statistics use the user API, admin rights, and channel eligibility; an ordinary Bot API token does not give equivalent analytics [S15–S16] | Strong candidate for initial measurement, subject to supplier access |
| X | Authorized posting and API metrics or publisher evidence | Public versus owner-only metrics differ; non-public/organic/promoted metrics have a documented 30-day post-age limit [S17] | Add for relevant B2B/media campaigns; verify access and cost before committing |
| WhatsApp | Client-managed distribution and trackable destination links where appropriate | Twilio documents unsupported/restricted destinations including Iran and blocks +98 delivery. This is a concrete blocker for that Business Platform route, not proof that consumer WhatsApp cannot work [S18] | Exclude automated +98 Business Platform delivery from launch promise; no promise of comprehensive private forwarding analytics |
| Eitaa | Authorized EitaaYar service or contracted channel operators | EitaaYar advertises API access, scheduling, and removal after view thresholds; endpoint-level analytics access remains untested [S19] | Candidate domestic launch channel if evidence tests succeed |
| Bale | Contracted operators initially; investigate official developer route | Developer sites could not be retrieved in this session; Jaryan advertises Bale supply, which does not prove our API access [S1, S20] | Manual-first; analytics connector unverified |
| Rubika | Official bot API for supported bot/channel workflows; publisher handoff elsewhere | Official bot documentation exists, including updates and channel guidance. It does not establish universal analytics, ad buying, or Rubino publishing [S21] | Test the exact surface; keep messaging and social-feed capabilities separate |
| Aparat | Video placement/promotion via publisher or platform dashboard | Official help describes video promotion. Automated campaign buying/reporting APIs were not established [S22] | Include video pilot if buyer demand and evidence justify it |
| Soroush Plus | Supplier/intermediary | Jaryan lists it; direct API and metrics not validated [S1] | Later connector or manual adapter |
| LinkedIn / YouTube | Relevant authorized creators/accounts and supplier workflows | Not technically audited here | B2B/video expansion candidates; do not advertise API readiness |
| Other surfaces | Domestic video publishers, podcasts, news sites, specialist communities; later assess Gap, iGap, Shad, TikTok, Facebook where commercially relevant | No exhaustive usage ranking or connector audit completed | Demand-led evaluation; no universal “all platforms” promise |

Telegram's self-serve advertising is a separate product from buying a sponsored post in a channel. Its public guide describes CPM budgeting and Telegram destinations [S23]. Do not assume either route's account eligibility, payment path, measurement, or creative format applies to the other.

Network interruptions are a real planning consideration, supported by Internet Society's shutdown tracking [S24]. Treat current connectivity as an operational measurement, not a permanent nationwide assumption. A functioning API in a foreign data center does not prove that the audience can access the post.

## 5. What can be guaranteed?

Separate four promises:

1. **Execution:** a specified placement, asset, time window, and duration. Usually controllable through contracts.
2. **Reported delivery:** a defined platform metric, evidence method, deadline, and shortfall remedy. Possible on selected inventory with sufficient supply and reserve.
3. **Qualified attention or interaction:** needs an explicit definition and measurement access; availability varies by channel.
4. **Business effect:** sales, belief change, incremental reach, or brand lift. Requires measurement design; not a generic guarantee.

A view is not necessarily a unique person, a completed video, a positive reaction, or an incremental customer. Different platforms count differently. Cross-platform summed counters must be labelled **gross platform-reported events, potentially repeated and non-comparable**. Use separate target lines as the default contract.

Define engagements as separate counts of likes, comments, shares, saves, and clicks where available. A composite score can help internal ranking, but its weights are a product choice and it must not be presented as a platform-native metric. Track negative feedback separately so the optimizer does not reward outrage.

Example target schedule, illustrative only:

- Telegram: contracted number of reported post views by 72 hours, with timestamped source evidence.
- Instagram: specified creator placements, plus forecast ranges for account-reported views and saves over seven days.
- Website: valid tagged sessions and accepted enquiries during an agreed attribution window.

For a delivery commitment specify eligible accounts, geography evidence if available, exclusions, posting duration, reporting cut-off, delayed data handling, maximum make-good cost, and remedy. Unknown audience geography cannot be silently assumed Iranian. Never make fake engagement the remedy for a shortfall.

## 6. Product expansion and creative opportunities

These are hypotheses for differentiation, not verified “first in Iran” claims.

| Idea | Customer value | Prerequisite / experiment |
|---|---|---|
| Target-to-plan compiler | Turns “we want attention” into KPIs, budget scenarios, and specific placements | Compare proposal time and quality against the partner's current process |
| Evidence-backed delivery package | Client sees the source behind every billed outcome | Test evidence completeness and dispute reduction across a small supplier set |
| Campaign recovery assistant | Detects missed publication or slow delivery and prepares a replacement plan | Needs cancellable/unbooked inventory; cannot recover sunk spend automatically |
| Persian creative experimentation | Several distinct hooks, formats, and offers, tested on comparable placements | Real tests; synthetic audiences may critique clarity but cannot certify performance |
| B2B buying-community plans | Connects industrial brands to specialist channels and trade publishers | Measure accepted enquiries, not mass-market exposure |
| Publisher operations copilot | Cleans briefs, prepares versions, collects evidence, reconciles invoices | Suppliers must opt in and benefit through less administrative work |
| Marginal audience planning | Avoids spending repeatedly on nearly identical publisher audiences | Initially contextual similarity only; validate overlap estimates before making reach claims |
| Opt-in post-click assistant | Answers product questions and routes qualified enquiries to the brand | Approved knowledge, visible bot identity, CRM integration, available channel |
| Reusable sector playbooks | Makes later campaigns cheaper and more predictable | Customer permission for aggregated learning; no leakage of private rates or client data |

Internationally established patterns include dynamic creative optimization, creator operations, and cross-channel campaign orchestration [S6–S9]. Our local opportunity is to combine such patterns with Iranian supplier workflows and measurement constraints. Success abroad does not prove local profitability.

## 7. Feasibility judgment

**Buildable now:** brief extraction, creative adaptation, inventory database, proposals, approvals, booking tasks, evidence uploads, budget ledger, reports, constrained recommendations.

**Buildable with access and data:** connected-account analytics, channel-specific publishing, forecasts calibrated to local inventory, reliable anomaly triage, bounded optimization.

**Unproven:** cheap guaranteed qualified attention across every platform, robust cross-platform person deduplication, reliable virality prediction from content alone, full autonomous buying without partner agreements, profitable outcome guarantees before historical delivery data.

Proceed if the partner can help close paid pilots and we can secure evidence-bearing distribution at workable margins. If clients only want the cheapest opaque view counts, this product's proposed differentiation may not command a premium.

## Source register

All accessed or searched on 2026-11-02. Publication dates are noted only when surfaced. Vendor scale/performance statements were not independently audited. Links below support the bounded claims above; inferred product recommendations are ours.

| ID | Source | What it supports / limitation |
|---|---|---|
| S1 | [Jaryan](https://jaryan.net/) | Listed channels, publisher selection, campaign reporting; vendor claims |
| S2 | [Yektanet](https://www.yektanet.com/) | Distribution and advertising product categories; vendor claims |
| S3 | [Triboon](https://www.triboon.net/) | Advertorial, media relations, content and monitoring offerings |
| S4 | [Dataak's public channel](https://t.me/s/DataaKcom) | Self-described listening/analysis positioning |
| S5 | [Zelkaa](https://zelkaa.com/fa/) | Self-described media monitoring; search evidence, not product audit |
| S6 | [Sprinklr Marketing](https://www.sprinklr.com/products/marketing-and-advertising/) | Integrated campaign and AI capabilities |
| S7 | [Sprinklr marketing agents beta](https://investors.sprinklr.com/news/press-releases/detail/266/sprinklr-launches-marketing-ai-agents-beta-to-help) | Agentic offering is already marketed; beta availability is not demonstrated efficacy |
| S8 | [Smartly dynamic creative optimization](https://www.smartly.io/product-features/dynamic-creative-optimization) | Creative variation and optimization pattern |
| S9 | [CreatorIQ measurement announcement](https://www.creatoriq.com/press/releases/standardized-metrics-suite-measurement) | Creator measurement product category |
| S10 | [KhabarOnline advertising](https://www.khabaronline.ir/news/822019) | Commercial products; originally dated 2018, still linked from current site; not a current rate card |
| S11 | [KhabarOnline editorial charter](https://www.khabaronline.ir/news/2291377/) | October 19, 2026 charter: revenue categories, editorial roles/independence |
| S12 | [KhabarOnline home](https://www.khabaronline.ir/) | Official social-channel links |
| S13 | [News Corp annual report 2024](https://newscorp.com/app/uploads/2024/11/News-Corp-Annual-Report-2024.pdf) | Historical example of diversified media revenue, not current financial forecast |
| S14 | [Meta Instagram collection](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api) | Primary provider documentation; main Meta docs URL was inaccessible to the research tool |
| S15 | [Telegram channel statistics](https://core.telegram.org/api/stats) | Eligibility and admin-based statistics |
| S16 | [Telegram stats method](https://core.telegram.org/method/stats.getBroadcastStats) | User-only method and admin access requirements |
| S17 | [X metrics](https://docs.x.com/x-api/fundamentals/metrics) | Metric types, auth distinctions, time limitation, nonunique impressions |
| S18 | [Twilio error 63058](https://www.twilio.com/docs/api/errors/63058) | Provider's Iran/+98 WhatsApp delivery restrictions |
| S19 | [EitaaYar](https://eitaayar.ir/) | API advertised, scheduling/view-threshold functions; analytics schema unverified |
| S20 | [Bale developer portal](https://dev.bale.ai/) | Discovery lead only: inaccessible in this session; no verified capability inferred |
| S21 | [Rubika official bot docs](https://rubika.ir/botapi) | Bot API and event workflows; broader analytics not established |
| S22 | [Aparat advertising help](https://support.aparat.com/kb/articles/pdf/article-142) | Video promotion product; no automatic buying API established |
| S23 | [Telegram Ads guide](https://ads.telegram.org/getting-started) | Sponsored-ad CPM, budget/statistics concepts and destinations |
| S24 | [Internet Society Iran shutdown tracker](https://pulse.internetsociety.org/en/shutdowns?country_code=IR) | Historical/network disruption risk; not a live connectivity certification |

### Remaining evidence gaps

Current direct supplier rates; partner client budgets; local contracts and tax handling; operating-entity/provider eligibility; reliable per-channel geo/demographic evidence; actual invalid-traffic levels; publisher refunds and replacement terms; measured AI labor savings; and willingness to share performance data for learning. Resolve these before claiming commercial feasibility is proven.
