# Ravi v2: richer platform, stronger visuals, better Persian VO
*Draft for approval, 2026-10-31*

## 1. Persian voiceover: what was wrong and the fix

**Why v1 sounded off**
- Edge-TTS (Farid) reads flat and "news-robot": no phrase breaks and a uniform pitch.
- Gooya ran with no voice reference, so it picked a random timbre, rushed and slurred (Whisper accuracy 0.73–0.89).
- The script itself is literary written Persian («می‌گذارند», «آزموده می‌شود»), which no TTS reads naturally.

**The fix: a VO pipeline instead of one TTS call**
1. **Rewrite the script for the ear.** Use spoken-formal register (رسمیِ گفتاری), short phrases of 4–8 words, and spell numbers out. Mark ezafe where TTS drops it (آینده‌ی ارتباطات → آیندهٔ ارتباطات), and avoid clusters that trip TTS.
2. **Generate phrase by phrase.** Every phrase gets 4 takes from Gooya, cloned from a **clean narrator reference** (15–20 s), with exaggeration 0.6 for livelier intonation and cfg 0.3 for a slower, calmer pace.
3. **Pick takes automatically.** Whisper character-error rate plus pitch-contour scoring choose the best take of each phrase.
4. **Assemble with designed pauses.** Comma = 0.22 s, sentence = 0.45 s, before a key number = 0.3 s. Then a gentle de-ess, loudness −16 LUFS, and a light room reverb.
5. **Human gate.** You listen to the phrase sheet and swap any take you don't like (I keep all takes).

**Voice reference: your choice**
- (a) **A human records the whole script.** This is the best result for a live pitch and takes about 15 min with any decent mic. I time the film to the recording.
- (b) **You give me 15–20 s of a voice you own or have rights to.** Gooya clones it and the pipeline above runs.
- (c) **OpenAI gpt-4o-mini-tts, which takes tone/pacing instructions in text.** It's paid, and your credits are limited, so I'd only use it if you say so.

---

## 2. The "leverage" layer: what makes a politician pay for this

v1 sold *awareness* (radar, brief) and *production* (studio). v2 adds **advantage over rivals and the field**. Everything stays inside public data, with no bots, no fake accounts and no deepfakes. That makes it sellable to any party without becoming a liability.

| # | Feature (Persian name) | The leverage it gives | Visual in the film |
|---|---|---|---|
| L1 | **Rival Radar (رقیب‌سنج)** | Share of voice vs each rival per issue; who "owns" which topic; rivals' narrative shifts and response times | Stream graph of 30 days of share of voice + an issue-ownership spider chart (you vs 2 fictional rivals) |
| L2 | **White Space Finder (فضای خالی)** | Issues voters care about that **no one owns yet**, the cheapest wins in politics | Issues as bubbles; one big unclaimed bubble glows saffron: «حمل‌ونقل شبانه: ۶۱٪ اهمیت، ۰٪ مالکیت» |
| L3 | **Constituency Heatmap (نقشه‌ی حوزه)** | District-by-district concerns and sentiment, where to show up this week | Stylised hex map of Tehran's 22 districts heating by issue, with the leader's next 3 visits pinned |
| L4 | **Attack Forecast + Pre-bunk (پیش‌بینی حمله)** | Predicts the attack lines rivals are likely to launch, from their past patterns and public record, so you answer *before* it lands | Rival's past patterns, then a predicted attack card, then a pre-bunk post ready |
| L5 | **War-Gaming (شبیه‌ساز سناریو)** | Simulates 72 h ahead for each option: how press, rivals and segments react | A branching scenario tree with probability per branch; the best branch lights up |
| L6 | **Live Debate Copilot (دستیار زنده‌ی مناظره)** | During a live TV debate or interview: live audience sentiment, instant fact-check of the opponent's claims with sources, a suggested comeback on a discreet prompter | Dark "on-air" scene: fictional TV studio plate, live sentiment line, «ادعای رقیب: نادرست ✗ — منبع: مرکز آمار», teleprompter line |
| L7 | **Influence & Coalition Map (نقشه‌ی نفوذ)** | Who the real amplifiers are in each community; allies to brief; journalists who cover your issues | A force-directed network graph drawing itself; bridges highlighted |
| L8 | **AI Mirror (آینه‌ی هوش مصنوعی)** | What ChatGPT, Gemini and local chatbots say about you vs rivals, and which sources they cite. The new front page. | Chat answer panels side by side with a score |
| L9 | **Ask Ravi (از راوی بپرس)** | A personal AI chief-of-staff on Telegram/Bale and by voice: «امروز چی بگم؟» | Phone voice query with a streamed answer |
| L10 | **Promise Tracker (وعده‌سنج)** | Tracks your own public promises and progress. It turns accountability into a trust asset. | Progress bars with sourced milestones |

**Agentic behaviour made visible.** A new "agent console" beat shows the swarm working in real time, with tool calls streaming:
- «🔎 خواندن ۴۸۰ کانال…»
- «📊 اجرای مدل پیش‌بینی…»
- «⚖️ بررسی صحت ادعا…»

This shows it is a team of agents, not a chatbot, and that's our speciality.

## 3. Business layer: plans (for the subscription conversation)

| Plan | For | Includes |
|---|---|---|
| **راوی محلی** (Local) | city council members, mayors, local officials | Brief, Radar, Studio, Heatmap of own district |
| **راوی پارلمان** (Pro) | MPs, ministers, candidates | + Council, Synthetic Electorate, Rival Radar, Attack Forecast, Ask Ravi |
| **راوی حزب** (Party HQ) | parties and campaign HQs | Multi-seat war room, every candidate on one map, War-Gaming, coalition map, team approval chains |
| **راوی رسانه** (Newsroom) | media outlets, PR agencies | Narrative Radar + AI Mirror + fact-check engine, API |

White-label and on-premise deployment for data sovereignty is mentioned on the plans card.

## 4. Visual upgrade

- **Camera language.** Real push-ins onto UI parts (2×) and pull-backs to the workspace. Containers morph (a card becomes a panel) instead of cutting.
- **Richer data visuals.**
  - stream graph (L1)
  - spider chart (L1)
  - bubble field (L2)
  - hex map (L3)
  - scenario tree (L5)
  - force network (L7)
  - live sentiment line (L6)
- **A third world, "on-air" dark.** Used only for the Live Debate scene, so the film has three looks: noise → clarity → on-air → back to clarity.
- **Agent console.** A monospace-free streaming trace in Persian with tool icons and timing chips.
- **Better plates (MiniMax H3).** A fictional TV debate studio, a war-room team at a big screen at night, and the leader walking a neighbourhood.

## 5. New storyboard (~3:25)

| # | Scene | s |
|---|---|---|
| 1 | Cold open: noise → the rumour is born | 10 |
| 2 | Problem: 48 h late | 8 |
| 3 | Reveal: راوی | 8 |
| 4 | Morning Brief | 11 |
| 5 | Narrative Radar + Early Warning | 16 |
| 6 | **Agent console** → Strategy Council | 16 |
| 7 | Synthetic Electorate | 13 |
| 8 | Creative Studio | 10 |
| 9 | Title beat: «و حالا، مزیت شما» | 3 |
| 10 | **Rival Radar + White Space** | 16 |
| 11 | **Constituency Heatmap** | 11 |
| 12 | **Attack Forecast → War-Gaming tree** | 15 |
| 13 | **Live Debate Copilot** (on-air) | 16 |
| 14 | **Influence map + AI Mirror** | 12 |
| 15 | Approve + Integrity | 9 |
| 16 | Learning loop | 5 |
| 17 | **Plans** | 11 |
| 18 | Close: «بیایید با هم بسازیم» | 9 |
