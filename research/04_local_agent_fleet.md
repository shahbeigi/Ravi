# Local agent fleet: feasibility and product value

2026-11-02 · Assessment of the user's optional idea, not an adopted architecture.

## Recommendation

Investigate a continuously available local worker service with specialized task queues. Scale the number of completed useful tasks, not the number of autonomous identities or model instances. Thousands of logical jobs can share a small, bounded pool of workers and model servers.

Use agents to win real distribution, improve content, serve interested customers, and verify delivery. Agents consuming or endorsing a client's content are not evidence that the desired human audience paid attention. Counting such traffic as campaign success would undermine the evidence-led product.

## What “push, view, and interact” can mean

| Interpretation | Assessment | Product treatment |
|---|---|---|
| Publish to authorized brand/publisher accounts | Useful when the platform supports the action and the exact asset/destination is approved | Connector workers with approval, rate limits, and idempotency |
| Deliver a campaign through contracted publishers or available paid inventory | Real distribution mechanism | Agents prepare orders and monitor fulfillment; buying permissions and budget gates apply |
| Inspect a post to confirm publication, rendering, or accessibility | Useful quality assurance | Prefer API/metadata checks; minimize necessary live checks and identify any first-party test traffic |
| Analyze authorized content, transcripts, comments, or exports | Useful research and creative diagnosis | Process copies locally where possible, rather than repeatedly loading live posts |
| Reply as a clearly identified brand assistant to genuine inbound questions | Potentially useful conversion/customer-service function | Platform-specific authorization, approved knowledge, disclosure, escalation and interaction limits |
| Prepare replies for a community manager | Useful even where automatic replying is unavailable | Human reviews and sends from an authorized account |
| Coordinate actual creators producing sponsored content | Valuable supply operation | Authentic publisher relationships, appropriate disclosure, no manufactured independent endorsements |
| Run thousands of viewers/likers/commenters to inflate apparent demand | Weak commercial foundation; artificial amplification rather than qualified attention | Exclude from sold outcomes and production distribution strategy |
| Simulate audience reactions internally | Useful for critique, edge cases, and UX testing | Keep in a sandbox; do not present as real opinions or a validated performance forecast |

Platform restrictions reinforce the commercial distinction. X prohibits artificial engagement and restricts automation, including non-API website scripting; its rules allow some useful automated interactions subject to conditions. Meta describes reducing distribution and monetization for accounts gaming engagement. Telegram prohibits spam. These are platform-specific sources, not a universal claim about every Iranian platform. [X authenticity](https://help.x.com/en/rules-and-policies/authenticity), [X automation](https://help.x.com/en/rules-and-policies/x-automation), [Meta anti-spam announcement](https://about.fb.com/news/2025/04/cracking-down-spammy-content-facebook/), [Telegram terms](https://www.telegram.org/tos)

No reliable evidence reviewed here establishes that artificial early engagement will produce sustained human distribution. It can also contaminate the performance data used to train forecasts. We should not design account farms, identity deception, or detection-evasion mechanisms into Ravi.

## Proposed worker groups across the pipeline

| Group | Work | Trigger | Suitable implementation |
|---|---|---|---|
| Intake | Extract objective, product facts, constraints, missing requirements | New brief/revision | Small model with typed output; escalate ambiguity |
| Research | Retrieve approved sources and supplier history; summarize relevant context | Brief or scheduled refresh | Retrieval plus bounded reasoning |
| Inventory | Refresh permitted rate sheets, availability, evidence terms | Quote expiry or supplier update | Mostly deterministic parsing; model for messy documents |
| Creative | Generate distinct hooks and platform adaptations | Approved brief | Model tasks plus template rendering and editorial review |
| Quality | Check factual claims, required labels, dimensions, subtitles, links | Asset revision | Rules plus selective vision/language checks |
| Planning | Compare feasible allocations and explain tradeoffs | Quotes and objectives available | Numeric optimizer plus model explanation |
| Execution | Queue approved publications and human handoffs | Booking/time trigger | Deterministic workflow, not continuous LLM deliberation |
| Delivery | Collect permitted metrics and reconcile source evidence | Webhook or scheduled observation | API workers, parsers, bounded extraction |
| Interaction | Classify genuine inbound requests, draft answers, route enquiries | Inbound message/comment | Brand-scoped assistant; human fallback |
| Recovery | Identify failed placements and suggest feasible replacements | Exception or pacing threshold | Rules/statistics plus bounded planning |
| Finance | Reconcile bookings, evidence, invoices, credits | Milestone or close | Deterministic ledger; model-assisted document extraction |
| Learning | Evaluate variants, forecasts, operator effort, supplier reliability | Campaign close | Statistical jobs and reviewed playbook proposals |

Not every group needs an agent. A timer, API fetch, image resize, or arithmetic check should usually be ordinary software. Use reasoning only where interpretation or adaptive tool selection improves a measured outcome.

## Fleet design

`Events → durable job queues → priority/concurrency scheduler → bounded workers → shared model service or deterministic tool → validated result → campaign state`

Each job includes tenant, campaign, task type, deadline, input version, permitted tools, output schema, maximum steps/tokens, and retry policy. Each worker leases a job and checkpoints progress. A failed worker can be replaced without losing the campaign.

Apply separate limits per tenant, platform, supplier, and model. Customer replies and publication failures take priority over overnight reports. Use queue-age alerts, dead-letter review, circuit breakers, and a global pause control. Separate read-only analysis from publication, messaging, and financial actions.

Thousands of saved task contexts do not require thousands of resident LLMs. Models can be shared, workers can wait without consuming inference, and expensive tasks can be batched when latency permits. Conversely, thousands of simultaneous browser sessions are resource-heavy and introduce account, platform, and reliability constraints. Local hosting does not remove any of those constraints.

For 24/7 service, plan power, cooling, storage, monitoring, backups, network outages, and recovery. A single local workstation is a pilot dependency and a single point of failure. Scale or add redundancy only after measuring demand. Do not promise continuous external publication when the platform or network is unavailable.

## Capacity and economics: an illustrative calculation

These numbers illustrate sizing; they are not benchmark results or hardware recommendations.

- 1,000 active campaigns × 24 small analysis jobs/day = 24,000 jobs/day.
- At 1,000 input and 200 output tokens/job: 24 million input and 4.8 million output tokens/day.
- Output demand alone averages roughly 56 tokens/second over 24 hours; a 5× arrival peak corresponds to roughly 278 output tokens/second if served immediately.
- Input processing, long contexts, retries, vision/audio workloads, and latency requirements add work. Do not infer GPU capacity from output rate alone.
- If average job service time were ten seconds, average concurrency at that arrival rate would be about 2.8 jobs; a 5× peak about 14. Longer-running tools change this substantially.

Thus “thousands of agents” can describe logical workload while needing far fewer concurrently executing workers. Benchmark actual task mixes on available hardware before choosing model sizes or buying machines.

Compare fully loaded cost: hardware amortization or rental, electricity, operations, idle capacity, models/licensing, failures, and human review. Measure cost per accepted deliverable and campaign contribution, not just token cost.

## Interaction and measurement boundaries

Keep a separate automation ledger recording our publications, replies, checks, and test events. Never count our generated replies as independent audience engagement. Client reporting should distinguish audience questions from assistant responses.

If live QA might increment a platform counter, disclose the measurement limitation; do not invent a subtraction factor. Exclude identifiable test events from first-party analytics. Prefer sandbox tests and metadata checks. A content-reading agent is not a potential buyer.

A useful interaction assistant can answer product specifications, clarify delivery details, provide approved comparison material, and hand a qualified request to sales. It must not invent product claims, impersonate customers, or fabricate endorsements. Private conversations require scoped authorization and retention controls.

## Comparative experiment before adoption

Run the same representative historical briefs through three approaches: human workflow baseline; deterministic automation plus one assistant; bounded specialist workers. Measure accepted output quality, factual accuracy, operator minutes, latency, compute cost, and failures.

Then test shadow operation on real campaign data: the workers propose actions but do not publish or spend. Enable limited real actions only after the workflow passes approval/retry/isolation tests and the account supports the action.

Success means lower total work and better execution at acceptable quality and cost. If the simpler assistant performs equally well, use it. If specialist workers improve specific stages, adopt those stages. A large fleet is an implementation option, not the product's selling proposition.
