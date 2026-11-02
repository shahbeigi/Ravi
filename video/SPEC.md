# SPEC: Ravi / راوی pitch film

GOAL:    Iranian politicians and media leaders finish wanting Ravi: "this team can build an AI war room that tells me what is about to happen and what to say", and they want a collaboration meeting.
OUTPUT:  HyperFrames, 1920 × 1080, 30 fps, Persian VO, RTL Persian UI.
TIME:    ~142 s ≈ 4260 frames. The VO is the clock: each scene starts at its VO line, plus 0.6 s of lead.

LOOK:    Two worlds. The film flips from the first to the second at the logo.
  NOISE  (scenes noise, problem): ground #111312 with 4% grain. Fragments are #5E6360 / #8A8F8B, Vazirmatn 500 at 28–44 px.
         Full-frame density (never small floating objects). The born story is the only saffron element.
  CLARITY (reveal → close): ground #EEEBE4 (warm stone), ink #15171A, secondary ink #5C5F63.
         UI cards are #FFFFFF with a 1 px #DAD5CA border, 16 px radius, shadow 0 14 36 rgba(21,23,26,.08).
  ACCENT saffron #E39B2D, "Ravi's thread": the narrative line. One focus per frame.
  STATUS risk #D5402B (alerts only) · approve teal #1F7A6C · neutral #B9B4A8.
  TYPE   Vazirmatn (assets/fonts). Display 900 at 104–150 px, tracking 0. UI titles 700 at 34–44 px. Body 500 at 28–34 px.
         Never under 26 px. Persian digits throughout.
  MEDIUM Product UI on stone, plus photographic plates (Codex keyframes → MiniMax H3) in the first half.

OBJECTS:
  - post fragment: a handle, platform name and Persian text line
  - phone (brief): an 8 px dark bezel with rounded 54 px corners
  - Ravi app shell: a 300 px sidebar on the RIGHT holding the logo and 5 nav items; the active item has a saffron bar
  - narrative cluster: a dot swarm with a label pill and post count
  - agent: a 64 px circular monogram plus a role name
  - persona dot: 9 px, coloured by its reaction
  - cursor: a 72 px arrow

MOTION:  enter: expo.out at 0.5–0.7 s · move: power3.inOut at 0.6 s · exit: power2.in at 0.3 s · camera: power2.inOut at 0.8 s.
         Staggers are 3–5 frames. Text lands, then holds still. UI acts in place: dots gather, lines draw, numbers count, messages type.

SHOTS (slot seconds, Edge-TTS scratch timing):
  1 noise      11.0  Wall of post fragments accelerates. One saffron fragment lifts out → hands off to the reveal later.
  2 problem     9.0  Comms-team plate (H3). A trend line has already spiked. «۴۸ ساعت دیر».
  3 reveal     10.0  The saffron point draws a thread, the world flips to stone, the wordmark راوی performs in.
  4 brief      14.0  Tehran dawn plate + phone: 06:00 notification → brief with waveform and 3 cards (narrative, risk, opportunity).
  5 radar      20.5  App shell. 320 dots gather into 5 narrative clusters, red one selected → detail panel: lifecycle, 72% / 18h, sources, bots.
  6 council    15.0  4 agents debate in a thread (typing → message), then 3 options listed vertically with risk/reach.
  7 electorate 17.5  600 persona dots in 4 segments. Messages 1, 2 and 3 fire; dots recolour; M2 wins youth, M3 wins parents.
  8 studio     12.5  Reel preview (H3 leader plate) + ranked hooks with scores + format chips fanning + voice-match 94%.
  9 approve    12.5  Approval sheet checklist ticks, cursor clicks «تأیید و انتشار», then «نه حساب جعلی. نه ربات. نه جعل عمیق.»
 10 loop        5.5  Results count up; the saffron thread closes into a loop.
 11 close      14.0  Five verbs land around the loop → logo → «بیایید با هم بسازیم».

SOUND:  ACE-Step bed (tense pulse → builds at reveal → uplift at approve). VO on top with music around 0.14 under the voice.
        Few SFX: whoosh at world-flip, pops on cards, click on approve.

BANNED: glow, neon, bloom, lens flares, particles as decoration; purple/blue gradients, glass cards; three cards in a row
        (options are a vertical list); everything centred; everything fading up; HUD corner labels; logo docked in a corner;
        real politicians' faces or names; English UI copy (except "C2PA").

QA frames: 5 s (noise density), 23 s (logo), 40 s (brief cards), 60 s (radar detail), 80 s (council options),
           95 s (electorate result), 110 s (studio), 122 s (approve click), 138 s (end card).
