# Ravi technical walkthrough

Open `walkthrough.html` in a browser for the standalone study player. It uses local GSAP and fonts; no remote requests are needed for playback. The research links lead to the sibling research folder.

Local served version: http://127.0.0.1:8766/technical-walkthrough/walkthrough.html

The three-minute animation has six chapters:

| Time | Topic |
|---|---|
| 0:00 | Client brief and metric contract |
| 0:26 | Inventory, media plan and budget |
| 0:58 | Agent workers, shared inference and approval |
| 1:26 | API publication versus publisher handoff |
| 1:56 | Measurement, shortfall and funded remedy |
| 2:30 | Implementation difficulty and feasibility |

The player pauses at chapter ends by default. Press Play again to continue. Use chapter buttons, the scrubber, playback speed, or keyboard controls. Technical notes beneath the animation explain the details and limitations.

All interface screens are proposals. Campaign figures and outcomes are fictional teaching examples. This is deliberately silent, intended for study on a desktop rather than a marketing presentation.

`index.html` and `compositions/` are the editable HyperFrames source. `build.py` generates these and the player from one content definition. `qa_player.py` checks chapter navigation, play/pause and automatic chapter pauses. The original platform demo is unchanged.

The Windows render environment used installed Chrome and FFmpeg in `C:/Users/hsar72/bin`. If rerendering, make that directory available on PATH and set HYPERFRAMES_BROWSER_PATH to the installed Chrome executable before running the pinned package render command.
