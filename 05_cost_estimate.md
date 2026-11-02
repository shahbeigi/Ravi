# Ravi: AI cost estimate (brief)
*2026-11-01 · ballpark for the meeting; all prices USD, list prices, before any negotiation*

## ⚠️ Read first: two blockers on the OpenAI route

1. **OpenAI's usage policies prohibit "political campaigning, lobbying, election interference"** (current version dated Oct 29, 2025). OpenAI's help centre defines campaigning as generating scaled messaging for or against a candidate, party or ballot measure. Ravi's studio, message lab and missions for politicians fall squarely inside that. Accounts doing this risk suspension, even if parts of Ravi (monitoring, fact-checking, analytics) are arguably fine.
2. **OpenAI does not serve Iran.** Using its API to serve Iranian customers is outside its terms and raises US sanctions issues. Get legal advice before building on it.

**Practical recommendation:** price the product on **open-weight models hosted on your own GPUs** (Qwen-class / DeepSeek-class / Gemma-class models handle Persian reasonably well). OpenAI prices are shown below as the reference you asked for, and as the benchmark for quality testing during development, where only synthetic or public test data goes out.

## 1. Architecture → where the AI cost goes

| Stage | What runs | Model tier | Share of cost |
|---|---|---|---|
| Ingest & filter | Embeddings on every item; the Compass relevance filter keeps about 15% | Embedding model | Low |
| Understand | Topic, stance and sentiment on relevant items; narrative clustering and labels | nano / mini | Medium |
| Brief & missions | Daily brief; agent council (4 agents, multi-turn, with retrieval) | Top model | Medium |
| Message lab | Thousands of persona reactions per test | nano / mini | **High** (volume) |
| Studio | Multi-format drafts in Voice DNA, hook scoring | Top + mini | Low |
| Ask Ravi | Chat over the data | mini | Low |
| Media | Speech-to-text for videos and podcasts, TTS for the audio brief, some images | Speech / image models | Medium |
| AI mirror | Daily queries to public chatbots about the customer and rivals | Third-party chatbots | Low–medium |

**Reference prices used.** These are OpenAI list prices per 1M tokens as published for the GPT-5 line. Third-party trackers list newer models (GPT-5.5/5.6) at $2–5 input and $12–30 output, so check before quoting.

| Model | Input | Output |
|---|---|---|
| Top (GPT-5 class) | $1.25 | $10 |
| mini | $0.25 | $2 |
| nano | $0.05 | $0.40 |
| Embeddings (small) | $0.02 | — |

The Batch API is about 50% off, which suits overnight classification. Speech-to-text is about $0.003–0.006/min and TTS about $0.015/min.

## 2. Production: monthly AI cost per customer (OpenAI-priced)

Assumptions for a **typical MP / council member**:
- 200k items/day ingested, about 15% relevant after the Compass filter
- 60 missions, 40 message-lab tests and 300 studio drafts a month
- 1,500 Ask Ravi questions a month
- 300 h of video/audio transcribed a month
- a daily audio brief

| Item | Calculation (rounded) | $/month |
|---|---|---|
| Embeddings | 6M items × 80 tokens = 480M tokens | 10 |
| Classification (nano, batch) | 900k relevant items × ~150 tokens | 15 |
| Narrative labels & summaries (mini) | ~2k clusters/day | 80 |
| Daily brief (top) + audio | 30 briefs + 90 min TTS | 5 |
| Missions (top) | 60 × ~$1 | 60 |
| Message lab (mini) | 40 tests × 2,400 personas × 3 messages | 80 |
| Studio (top) + images | 300 drafts + 100 images | 15 |
| Ask Ravi (mini) | 1,500 questions | 10 |
| Transcription | 300 h | 55–110 |
| AI mirror | ~6k chatbot queries | 40 |
| **AI subtotal** | | **≈ $370–430** |
| + data and infrastructure (crawlers, proxies, DB, vector index, storage, monitoring), shared across customers | per customer, at 20+ customers | 150–300 |
| **All-in running cost** | | **≈ $550–750 / month** |

By customer type:
- **Local official (council / mayor):** smaller data, about **$200–350/month** all-in.
- **Party HQ** (10+ seats, much more data and missions): about **$3k–6k/month**.
- **Newsroom** (radar + fact-check + mirror, little studio use): about **$800–1,500/month**.

Rule of thumb for pricing: **AI + infra ≈ 15–25% of the subscription price** leaves healthy margin for support, data partnerships and customer success.

## 3. Development: about 6 months to v1 (AI spend only)

| Activity | Estimate |
|---|---|
| Ingestion and classification experiments (re-running pipelines on sample corpora, prompt iterations) | $1.5k–3k |
| Agent / mission development (thousands of test runs on top models) | $3k–6k |
| Evaluation suites (LLM-as-judge on Persian quality, fact-check accuracy, red-line compliance), nightly | $1.5k–3k |
| Synthetic audience calibration (persona simulations vs real outcomes) | $1k–3k |
| Studio, Voice DNA, TTS and image tests | $0.5k–1.5k |
| **Total AI spend, development** | **≈ $8k–16k**, i.e. **$1.5k–2.5k/month** |

Team salaries, data-access deals (Instagram data providers, X API) and hosting are **not** included. They will be larger than the AI line.

## 4. The self-hosted alternative (recommended for these customers)

Run open-weight models in-country. Costs become mostly fixed hardware instead of per-token:

| Setup | Handles | Cost |
|---|---|---|
| **Dev box:** 2× RTX 4090/5090-class (or the existing 3090 for early work) | Development, embeddings, classification, mid-size LLM for agents | About $8k–12k one-off |
| **Production node:** 4–8 data-centre GPUs (A100/H100-class) or a domestic GPU cloud | ~20–40 typical customers: classification, agents, persona simulation, local TTS/STT (e.g. Gooya, Whisper) | About $4k–10k/month rented, or $80k–200k to buy |

**Effective cost per customer at 30 customers is about $150–350/month for AI.** That is comparable to or cheaper than OpenAI at scale. It also gives full data sovereignty, which is a selling point for government customers, and avoids both blockers above.

**Hybrid option.** Use OpenAI or other frontier models only for internal, non-political development work (code, evaluation design, synthetic test data), and run everything customer-facing on self-hosted models.

## Sources
- [OpenAI usage policies](https://openai.com/policies/usage-policies/) · [OpenAI: political campaigning restrictions](https://help.openai.com/en/articles/20001255-political-campaigning-restrictions)
- [GPT-5 pricing (pricepertoken)](https://pricepertoken.com/pricing-page/model/openai-gpt-5) · [OpenAI pricing overview 2026 (silicondata)](https://www.silicondata.com/use-cases/openai-api-pricing-per-1m-tokens) · [GPT-5.5 pricing (apidog)](https://apidog.com/blog/gpt-5-5-pricing/)
