# Desk-research gaps: platforms, prices, ad networks, models from abroad

Date: 2026-11-02 · Status: desk research from search-engine results (Persian and English). Several Iranian news sites (zoomit.ir, digiato.com) could not be opened from this cloud session. Where a figure comes only from a search-result excerpt, it is marked **[excerpt]** and should be checked against the original before it goes into a pitch. Vendor statements are marked **[vendor]**.

## 0. The headline: 2026 connectivity changes the channel mix

This is the most important finding and it was not in the morning's research.

| Date | Event | Source |
|---|---|---|
| Jan 2026 | About three weeks of nationwide shutdown during protests | [Iran International, 2026-01-12](https://www.iranintl.com/en/202601125931); a 2026-10-17 VPN guide citing Al Jazeera [excerpt, commercial page] |
| From Feb 28 2026 | International internet cut at the start of the war; NetBlocks called it the longest nationwide shutdown on record (over 2,000 hours, ~88 days) | [Al Jazeera, 2026-05-31](https://www.aljazeera.com/news/2026/5/31/iran-reinstates-some-internet-access-but-restrictions-remain-for-most); [RFE/RL](https://www.rferl.org/a/iran-internet-shutdown-censorship/33654841.html) |
| Late May 2026 | Partial restoration. Instagram, Telegram, WhatsApp, YouTube remain blocked and "not under consideration" for reinstatement; businesses return via VPN | [NPR, 2026-05-28](https://www.npr.org/2026/05/28/g-s1-124610/iranians-back-online); [Al Jazeera, 2026-05-31](https://www.aljazeera.com/news/2026/5/31/iran-reinstates-some-internet-access-but-restrictions-remain-for-most); [Bloomberg, 2026](https://www.bloomberg.com/features/2026-iran-internet/) |
| Policy | Head of the Digital Transformation Commission: "no place for restoring access to foreign messenger apps" | [RFE/RL](https://www.rferl.org/a/iran-internet-shutdown-censorship/33654841.html) |
| Oct 2026 | Users report slow, costly internet; VPNs (including paid) failing in several provinces; global platforms banned | [Iran International, 2026-10-24](https://www.iranintl.com/en/202610244351) |
| Cost | Chamber of Commerce official: shutdown cost $30–40M/day direct | [France 24 / AFP, 2026-04-19](https://www.france24.com/en/live-news/20260419-iran-entrepreneurs-angered-by-months-long-internet-blackout) |

**Implications for Ravi**

1. **Domestic platforms are no longer optional.** Rubika, Eitaa, Bale and Aparat must be launch channels, not "later connectors". Re-rank the channel matrix in `01_research_and_feasibility.md` §4.
2. **Instagram and Telegram remain commercially important but reach is VPN-dependent and volatile.** Any delivery target there needs a **connectivity clause**: a shutdown or a new block pauses the clock, and the target is renegotiated, not "made good" with cheap substitute views.
3. **Foreign-hosted infrastructure is a liability during a cut.** Plan hosting so the brand workspace and evidence store stay reachable inside Iran (domestic hosting or a domestic mirror), while the AI and model layer can degrade gracefully.
4. **New product promise:** "your campaign keeps running when the internet is cut." That means a pre-approved fallback plan on domestic channels, which the client signs in advance (see §2 of `02_architecture_and_product.md`: no automatic diversion without approved fallback rules).
5. **Audience-location evidence becomes harder** when Iranian users appear through VPN exits. Do not claim "Iranian views" from platform geo-reports on blocked platforms.

## 1. Platform user and usage figures

Survey shares and platform counts measure different things. Never sum them or compare them directly.

### Survey-based usage (share of adults who say they use the app)

| Platform | ISPA, Shahrivar 1403 (Aug–Sep 2024), n=3,990 face-to-face, 18+ [excerpt] | Earlier ISPA wave, same series [excerpt] | GAMAAN 2023 ("often"), online, diaspora-sensitive method |
|---|---|---|---|
| Instagram | 50.6% | 46.5% | ~65% |
| Telegram | 39.3% | 34.6% | ~43% |
| WhatsApp | 33.3% | 35.3% | ~46% |
| Eitaa | 28.9% | 25.2% | n/a |
| Rubika | 28.5% | 24.1% | ~8% |
| Bale | 9.7% | 8.7% | n/a |
| X/Twitter | n/a | n/a | ~8% |
| YouTube | n/a | n/a | ~17% |

Sources: ISPA figures as reported by [Zoomit](https://www.zoomit.ir/tech-iran/415586-popular-applications-in-iran-are-the-filtered-ones) and [Digiato](https://digiato.com/iran-technology-news/the-latest-ispa-survey-the-growth-of-bale-eitaa-and-rubika-is-due-to-the-intensification-of-filtering) [excerpt; neither page opened from this session, so the wave dates need checking]; [GAMAAN Media Survey 2023](https://results.gamaan.org/en/survey/iran-media-survey-1402). ISPA is a state-affiliated pollster with face-to-face interviews; GAMAAN is an online survey run from abroad. Expect method effects on politically sensitive questions, including admitting VPN use.

**No 1404 (2025–26) ISPA usage wave was found.** All survey figures predate the 2026 shutdowns.

### Platform-level active users (domestic messengers)

| Platform | Iran IT Organization (ITO), as of 26 Esfand 1404 (~17 Mar 2026), monthly active | Dataak research, Khordad 1405 (~Jun 2026), monthly active | Earlier ITO (1402) |
|---|---|---|---|
| Rubika | 55.5M | >42M (from ~28M in Farvardin 1404) | 44M |
| Eitaa | 40.4M | 34M | ~30M |
| Bale | 28.7M | 41M (from ~11M in Farvardin 1404) | n/a |

Sources: [Zoomit, Iranian messengers MAU](https://www.zoomit.ir/tech-iran/416187-iranian-messengers-monthly-users/); [Tejarat News](https://tejaratnews.com/بخش-استارتاپ-30/897265-جدیدترین-آمار-تعداد-کاربران-پیام-رسان-های-داخلی) [excerpt]. Rubika separately says ~70M SIM/phone numbers are registered, which counts registrations, not users [excerpt, [Zoomit](https://www.zoomit.ir/tech-iran/400125-unveiling-1649-system/)].

Reading: the ITO is a government body with an interest in high domestic numbers, while Dataak is a private listening firm. Both show **large growth tied to the Esfand 1404 cut-off**, with Bale growing fastest. Whether that use stays after partial restoration is unknown. Ask suppliers for post-level view data on these platforms rather than relying on MAU.

### Instagram scale

Dataak reports ~33M Iranian Instagram accounts (year unclear), and notes this counts accounts, not unique people; another research centre reported 48M for 1400 [excerpt, [Zoomit/Dataak](https://www.zoomit.ir/tech-iran/441663-dataak-annual-report/), [Entekhab](https://www.entekhab.ir/fa/news/683219/)]. Dataak's 1403 report: Iran holds ~5% of the world's influencers; 72% are nano (<10k followers), 0.4% mega [excerpt].

### Gaps still open
- Aparat: no credible current user figure found. Ask Aparat sales directly.
- X: only GAMAAN's 2023 figure; treat X as a niche B2B, media and policy channel.
- Post-shutdown (June–Oct 2026) usage of Instagram/Telegram inside Iran: **no data found**. This is the biggest unknown for the pitch.

## 2. Telegram channel ads and Instagram influencer pricing, and fraud

**No credible current (1404–1405) rate card was found publicly.** What exists:

| Item | Figure | Date | Source | Reliability |
|---|---|---|---|---|
| Telegram view-based ad | from ~2.5–3 toman per view; ordinary channels from ~20k toman | undated | [Faradars blog](https://blog.faradars.org/تبلیغات-پر-بازده-در-تلگرام/) | Low; pre-inflation |
| Large Telegram channel, time-slot ad | 1.4–1.5M toman per slot | 2019 | [Hamshahri Online](https://www.hamshahrionline.ir/news/445994/) | Historical only |
| Fake Telegram members | 30–80k toman per 1,000; "real" members 130–200k | undated | [Mashregh News](https://www.mashreghnews.ir/news/588827/) | Shows an open market for fake members |
| Telegram Ads (official) | CPM/CPC; paid in TON; channel-owner revenue share now enabled for Iranian channels | undated | [Telegram blog](https://telegram.org/blog/monetization-for-channels/fa); [Zoomit](https://www.zoomit.ir/software-application/418905-telegram-ads-split-channels/) [excerpt] | Primary for mechanism; payment from Iran is a sanctions/eligibility question |
| Instagram influencer rates | No Iranian figures found; global tier guides only | — | — | Not usable |

**Fraud:** a visible retail market sells views, members and followers (e.g. "panel" apps listed on Cafe Bazaar such as [IraniView](https://cafebazaar.ir/app/ir.iraniview)) [vendor]. Dataak itself warns that follower counts and engagement rates are unreliable because of fake followers [excerpt]. No independent measurement of invalid-traffic share in Iran was found.

**What this means:** prices must come from the field sprint (supplier quote template in `06_field_sprint_kit.md`). Ravi's evidence grades and baseline checks (views-per-follower curve, view velocity, comment quality) are a real selling point, because the buyer cannot otherwise tell paid views from bought views.

Inflation note: any toman figure older than 12 months is not a planning input.

## 3. Iranian ad networks: formats and pricing

| Network | Formats (as described publicly) | Pricing model | Source |
|---|---|---|---|
| Yektanet | Native ads, banners, video, push notification (including location-based), in-app, Telegram/content distribution | CPC, Enhanced CPC where the algorithm adjusts bids by conversion likelihood; CPM | [Digiato on Yektanet smart pricing](https://digiato.com/tech/yektanet-smart-pricing) [excerpt]; [Eghtesad Online](https://www.eghtesadonline.com/بخش-فناوری-64/338855-پوش-نوتیفیکیشن-چیست); [yektanet.com](https://www.yektanet.com/) [vendor] |
| Tapsell | In-app ads (mobile apps), video/rewarded | Not established in this session | Search found no usable page |
| Mediaad | Native/display | Not established in this session | Search found no usable page |
| Chanka | Instagram influencer campaigns via a network of "several thousand" influencers; claims to be the only formal influencer agency | Not public | [Zoomit PR piece](https://www.zoomit.ir/pr/265947-chanka-marketing-influencer/) [vendor, paid PR] |

**No public CPC/CPM numbers** were found for 1404–1405. Action: open advertiser accounts (no spend) on Yektanet and Tapsell during the sprint to read the minimum bids and format list from the dashboard; record them with screenshots and dates.

Product implication: Ravi should **plan across** these networks (web/app reach with first-party click data), not compete with them. Their click data is grade-A destination evidence; channel posts mostly are not.

## 4. Models from abroad not yet common in Iran

| Model | How it works | Evidence | What Ravi can borrow |
|---|---|---|---|
| **Douyin DOU+** (ByteDance, since 2018) | Creator or brand pays to boost an existing native video to a chosen audience; boosted posts look organic; tool shows an estimated audience before purchase | [WalkTheChat](https://walkthechat.com/douyin-advertising-a-step-by-step-guide/), [The Egg](https://www.theegg.com/social/china/how-should-you-advertise-on-douyin) [agency guides]. Current pricing and the exact "guaranteed" mechanics were **not verified**: the excerpts describe estimates, not guarantees | "Pay to boost a post that already works, with a pre-purchase estimate." On Iranian platforms only possible where the platform sells it (Rubika/Aparat ad products, Telegram Ads). Ravi equivalent: boost through real paid placements, with the estimate shown as a range |
| **Meta Advantage+ (sales campaigns)** | Goal-based buying: advertiser sets goal and budget; the system picks audience, placements and creative mix | Meta claims $4.52 revenue per $1, +22% vs business-as-usual [vendor, via [Haus](https://www.haus.io/blog/optimizing-meta-ads-a-playbook-for-brands)]. Independent: Haus's 640 incrementality tests found 58% of brands got higher incremental ROAS from manual campaigns ([Haus](https://www.haus.io/blog/the-meta-report-lessons-from-640-haus-incrementality-experiments)) | Goal-in, plan-out works as an interface. But the platform's own reported return overstates results. Ravi should show **reported vs incremental** separately and offer holdout tests |
| **TikTok One / Creator Marketplace + Spark Ads** | Brand finds creators, pays negotiated rate; creator authorises the brand to run the post as an ad under the creator's handle; TikTok Shop affiliates are paid commission on sales | [TikTok business blog](https://ads.tiktok.com/business/en-CA/blog/tiktok-one-creative-platform) (primary); performance bonuses "up to $1,500" only in third-party blogs [unverified] | Creator marketplace with **base fee + performance bonus** tied to evidence-grade metrics. Fits Iran's nano-heavy influencer market (72% nano) |
| **Affiliate-to-ad conversion (ShopMy Spotlights)** | Posts that already drive affiliate sales get promoted as ads; creator is paid their existing commission | [Affect Group](https://affectgroup.com/blog/tiktok-and-shopmy-integrate-spotlights-to-turn-creator-content-into-spark-ads/) [agency] | "Promote what already converts": pick winners by tagged-link sales, then pay for more distribution |
| **AI creative testing (DCO)** | Many variants generated and rotated; spend shifts to winners | Morning research [S8] Smartly | Already in plan; keep tests controlled (same slot, same publisher) |

**Pricing model to test in Iran (hypothesis, not a finding):** base placement fee + bonus per 1,000 grade-A/B views above a floor, capped, with a connectivity clause. The creator gets paid more for real delivery, and the brand only pays the bonus on evidence. No fake engagement can earn the bonus, because anomalies withhold it pending review.

## 5. Changes to make in the earlier files

1. `01_research_and_feasibility.md` §4: move Rubika, Eitaa, Bale, Aparat up to launch-candidate status; add a connectivity row; mark Instagram/Telegram as "VPN-dependent reach".
2. `03_meeting_brief.md`: add the question "what share of your clients' 2026 spend moved to domestic platforms during and after the cut-off?"
3. `02_architecture_and_product.md` §8: domestic hosting or mirror for the brand workspace and evidence store.

These edits are proposals; the files were not changed in this session.

## 6. Open questions for the field sprint (added)

- Post-May 2026 real view levels for Instagram and Telegram posts by Iranian brands, compared with 2025.
- Rubika, Eitaa, Bale: do they sell native ads or boosts directly? What evidence do channel admins provide?
- Current per-view and per-slot prices on all four messengers (use the quote template).
- Whether clients will accept a connectivity clause and a pre-signed fallback plan.
