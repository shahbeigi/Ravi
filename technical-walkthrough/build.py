from pathlib import Path
import json, shutil, re

P=Path(__file__).parent
(P/'compositions').mkdir(exist_ok=True)
(P/'assets/fonts').mkdir(parents=True,exist_ok=True)
for weight in [400,700]:
    shutil.copyfile(P.parent/f'platform/fonts/vazirmatn-{weight}.woff2',P/f'assets/fonts/vazirmatn-{weight}.woff2')

css='''
@font-face{font-family:Vazirmatn;src:url(assets/fonts/vazirmatn-400.woff2)}
@font-face{font-family:Vazirmatn;src:url(assets/fonts/vazirmatn-700.woff2);font-weight:700}
*{box-sizing:border-box}body{margin:0}#root{position:absolute;inset:0;width:100%;height:100%;background:#f3f0e8;color:#202c29;font-family:Vazirmatn,sans-serif;overflow:hidden}
.head{position:absolute;left:120px;top:74px;right:120px}.eyebrow{font-size:25px;letter-spacing:2px;color:#52645c}.head h1{font-size:62px;line-height:1.15;letter-spacing:-2px;margin:12px 0 0;font-weight:700}.sub{font-size:28px;margin-top:16px;color:#52645c}
.stage{position:absolute;left:120px;top:270px;width:1680px;height:625px}.bottom{position:absolute;left:120px;right:120px;bottom:105px;font-size:29px;line-height:1.4;border-top:2px solid #c9cec4;padding-top:20px}.tag{display:inline-block;font-size:23px;padding:7px 13px;background:#dce8df;border-radius:6px;color:#245741}.muted{color:#52645c}.amber{color:#975010}.red{color:#a13528}.green{color:#186248}.big{font-size:72px;line-height:1.1;font-weight:700}.label{font-size:24px;color:#52645c}.body{font-size:31px;line-height:1.45}.mono{font-family:monospace;font-size:27px}.panel{position:absolute;border:2px solid #c4cec3;border-radius:16px;background:#faf9f4;padding:30px}.dark{background:#233c34;color:#f4f3eb;border-color:#233c34}.dark .muted,.dark .label{color:#bfd5c9}.row{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #c4cec3;padding:14px 0;font-size:30px;gap:24px}.row:last-child{border:0}.rail{position:absolute;left:120px;right:120px;bottom:45px;display:flex;gap:12px}.rail span{height:5px;background:#c9cec4;flex:1}.rail span.active{background:#27694e}.pill{padding:8px 16px;background:#e5e8df;font-size:24px;border-radius:30px;display:inline-block}.pill.ok{background:#d9eadd;color:#245741}.pill.warn{background:#f5e2c8;color:#87420e}.line{stroke:#27694e;stroke-width:5;fill:none}.step{position:absolute;padding:20px;border:2px solid #bdc9be;border-radius:12px;background:#faf9f4;text-align:center;font-size:30px;line-height:1.3}.step small{display:block;font-size:24px;color:#52645c;margin-top:10px}.track{height:26px;background:#dfe4da;border-radius:4px;overflow:hidden}.fill{height:100%;background:#27694e;transform-origin:left center}.callout{font-size:29px;padding:20px 26px;background:#e3ebdf;border-radius:8px}.code{font-family:monospace;font-size:26px;line-height:1.8;white-space:pre-wrap}.screen-label{font-size:23px;letter-spacing:1px;color:#52645c;margin-bottom:20px}.status{position:absolute;right:0;top:0}.title{font-size:34px;font-weight:700}.num{font-variant-numeric:tabular-nums}.footer-note{font-size:24px;color:#52645c;margin-top:16px}
'''

css += '.draw{stroke:#27694e;stroke-width:5;fill:none;stroke-linecap:round}.row{padding:10px 0;line-height:1.35}.footer-note{line-height:1.35}'
scenes=[]
def add(id,title,sub,duration,body,beats,bottom,notes):
    scenes.append(dict(id=id,title=title,sub=sub,duration=duration,body=body,beats=beats,bottom=bottom,notes=notes))

add('brief','01 / A target becomes a contract','Proposed interface · fictional appliance launch · all figures illustrative',26,
'''<div class="panel" style="left:0;top:0;width:1020px;height:575px">
<div class="screen-label">RAVI / CAMPAIGNS / NEW CAMPAIGN</div>
<div class="title">Launch an air purifier in seven days</div>
<div class="row"><span>Campaign budget ceiling</span><strong>100m toman</strong></div>
<div class="row reveal" data-at="3"><span>Telegram post views / 72 hours</span><strong>300,000</strong></div>
<div class="row reveal" data-at="7"><span>Instagram creator posts</span><strong>2 placements</strong></div>
<div class="reveal callout" data-at="12" style="margin-top:26px">Telegram: conditional delivery commitment.<br>Instagram views: forecast only.</div>
</div>
<div class="panel dark" style="left:1060px;top:0;width:620px;height:575px">
<div class="label">BEHIND THE SCREEN</div>
<div class="reveal body" data-at="2" style="margin-top:24px">AI extracts the brief and asks for missing definitions.</div>
<div class="reveal code" data-at="8" style="margin-top:24px">metric: post_views\nwindow: 72h after posting\nevidence: agreed source\nunique_people: unknown</div>
<div class="reveal body" data-at="17" style="margin-top:26px">Human approves the objective, evidence rules and remedy.</div></div>''',[],
'Output: a versioned campaign brief. A view counter is not a count of unique Iranian buyers.',
'''The client does not start by selecting an AI model. They specify a business objective, budget, deadline and measurement target. The brief agent converts notes into structured fields and flags ambiguity. Application code validates dates, money and required fields. A human accepts the exact target definition.

Here the Telegram commitment means reported post views within 72 hours of each placement, with final campaign reconciliation after the last window closes. Geography and unique reach remain unknown unless separately evidenced. Two Instagram posts are a placement commitment; their views are only a forecast. These must never be combined into one unique-audience promise.

Build difficulty: moderate. Forms and workflow are routine; getting the commercial metric and remedies right requires media operations input.''')

add('supply','02 / Reach comes from purchased distribution','Supplier inventory is a prerequisite; AI does not create an audience.',32,
'''<div class="panel" style="left:0;top:0;width:1130px;height:575px">
<div class="screen-label">MEDIA PLAN / QUOTES AND CAPACITY</div>
<div class="row"><strong>Placement</strong><strong>Budget</strong><strong>Promise</strong></div>
<div class="row reveal" data-at="2"><span>Telegram channel bundle</span><strong>45m</strong><span>300k views*</span></div>
<div class="row reveal" data-at="6"><span>Two Instagram creators</span><strong>30m</strong><span>2 posts</span></div>
<div class="row reveal" data-at="10"><span>Delivery reserve</span><strong>10m</strong><span>Uncommitted</span></div>
<div class="row reveal" data-at="13"><span>Production + operations fee</span><strong>15m</strong><span>Service</span></div>
<div class="reveal callout" data-at="18" style="margin-top:20px">75m media + 10m reserve + 15m fee = 100m</div>
<div class="footer-note">*Only after supplier acceptance of evidence and shortfall terms.</div></div>
<div class="panel dark" style="left:1170px;top:0;width:510px;height:575px">
<div class="label">BUYER + SOFTWARE</div>
<div class="body reveal" data-at="3" style="margin-top:22px">AI compares real quotes and past delivery.</div>
<div class="body reveal" data-at="11" style="margin-top:24px">Code checks budget, available slots and concentration.</div>
<div class="body reveal" data-at="21" style="margin-top:24px">Buyer confirms capacity and books the inventory.</div></div>''',[],
'No confirmed inventory or acceptable evidence? Sell a placement or estimate, not guaranteed reach.',
'''The supply database contains verified publisher accounts, formats, prices, available slots, evidence access and cancellation terms. The agent can rank real quotes, but cannot invent available inventory. Initially a media buyer confirms rates and capacity directly; later some suppliers may provide booking APIs.

The Telegram bundle is priced at 45m in this fictional example. Its contractual delivery terms must match our client promise. Instagram costs 30m for two placements. The 10m reserve stays uncommitted; it is not free profit. The 15m service fee must cover production and operating costs. These are teaching numbers, not market quotes or a proven margin model.

Build difficulty: software is moderate; recruiting dependable supply and obtaining acceptable evidence is hard. Your sales partner brings brands, so this supply relationship is still a separate dependency.''')

add('workers','03 / Agents prepare; controlled services execute','Many campaign tasks share a bounded worker pool and local inference.',28,
'''<svg width="1680" height="550" style="position:absolute;left:0;top:0"><path class="draw" data-at="2" d="M330 100 H650 M330 275 H650 M330 450 H650"/><path class="draw" data-at="9" d="M1010 275 H1250"/></svg>
<div class="step reveal" data-at="1" style="left:0;top:45px;width:330px;height:110px">Research jobs<small>Facts + supplier history</small></div>
<div class="step reveal" data-at="4" style="left:0;top:220px;width:330px;height:110px">Creative jobs<small>Hooks + format variants</small></div>
<div class="step reveal" data-at="7" style="left:0;top:395px;width:330px;height:110px">Evidence jobs<small>Extract + reconcile</small></div>
<div class="panel dark reveal" data-at="3" style="left:650px;top:75px;width:360px;height:425px"><div class="label">DURABLE QUEUE</div><div class="big" style="margin-top:30px">Workers</div><div class="body" style="margin-top:28px">Shared model server</div><div class="body" style="margin-top:28px">Bounded tools, retries and tenant scopes</div></div>
<div class="panel reveal" data-at="11" style="left:1250px;top:75px;width:430px;height:425px"><div class="label">APPROVAL GATE</div><div class="body" style="margin-top:28px">Asset v3 approved</div><div class="mono" style="margin-top:28px">hash + destination<br>+ budget + time</div><div class="pill ok reveal" data-at="18" style="margin-top:30px">Ready for execution</div></div>''',[],
'1,000 logical jobs ≠ 1,000 running models. Ordinary code handles timers, budgets and accounting.',
'''Each job has a tenant, campaign, input version, permitted tools, deadline and retry budget. Workers lease jobs, call a shared model service if reasoning is needed, validate the output and checkpoint results. They do not need persistent social-media identities.

AI drafts research and creative variants. A person approves factual claims and the exact asset revision. The publishing service receives the asset hash, authorized destination, timing and budget scope. A material revision invalidates the old approval. Credentials remain inside connector services, not model prompts.

Build difficulty: moderate to hard for a reliable multi-tenant production service. Start with one shared inference endpoint and bounded workers. Benchmark actual task throughput before buying GPUs. Thousands of synthetic viewers are excluded from delivery; they are not evidence of real audience attention.''')

add('publish','04 / Publication has two execution paths','The operator sees one workflow, even when channel integrations differ.',30,
'''<div class="step" style="left:0;top:180px;width:330px;height:145px">Approved placement<small>Exact asset + account</small></div>
<svg width="1680" height="550" style="position:absolute;left:0;top:0"><path class="draw" data-at="2" d="M330 250 H450 V105 H580 M450 250 V395 H580"/><path class="draw" data-at="14" d="M1090 105 H1190 V250 H1310 M1090 395 H1190 V250"/></svg>
<div class="panel reveal" data-at="3" style="left:580px;top:15px;width:510px;height:240px"><div class="tag">CONNECTED ACCOUNT</div><div class="body" style="margin-top:18px">Official API → remote post ID</div><div class="footer-note">Only supported permissions and formats</div></div>
<div class="panel reveal" data-at="8" style="left:580px;top:300px;width:510px;height:255px"><div class="tag">PUBLISHER HANDOFF</div><div class="body" style="margin-top:18px">Task → human publishes → evidence</div><div class="footer-note">Unconnected publisher accounts</div></div>
<div class="panel dark reveal" data-at="15" style="left:1310px;top:120px;width:370px;height:370px"><div class="label">DELIVERY RECORD</div><div class="body" style="margin-top:25px">Post ID / URL<br>Publication time<br>Asset revision<br>Evidence source</div></div>
<div class="reveal pill warn" data-at="21" style="position:absolute;left:0;top:450px">Timeout? Verify before retrying.</div>''',[],
'Channel automation is conditional. WhatsApp +98 Business Platform delivery is excluded from this pilot.',
'''The same campaign state machine supports a connected-account adapter and a manual publisher adapter. The latter creates an assigned task, deadline and evidence requirement; it must not report success merely because a message was sent to a publisher.

After an ambiguous API timeout, check the remote state before retrying. Otherwise we risk duplicate posts or bookings. Use idempotency keys, spend reservations, explicit publication states and a review queue. A publisher's acceptance, publication and measured delivery are distinct events.

Instagram professional-account access must be validated for the actual account and login path. Telegram publication does not automatically confer detailed statistics. Rubika bot capabilities must not be confused with every social-feed surface. Eitaa/Bale and other channels can begin with verified manual workflows. WhatsApp Business delivery to +98 has documented restrictions; do not promise that route.

Build difficulty: hard and uneven by channel. Start with two or three tested routes, not a universal connector.''')

add('recover','05 / Detect the shortfall, then fund the remedy','One Telegram KPI · cumulative snapshots · source evidence required',34,
'''<div class="panel" style="left:0;top:0;width:1040px;height:575px"><div class="screen-label">CAMPAIGN / TELEGRAM DELIVERY</div>
<div class="row"><span>Target by measurement deadline</span><strong>300,000 views</strong></div>
<div class="reveal" data-at="3" style="margin-top:25px"><div class="row"><span>24h cumulative</span><strong>120k</strong></div><div class="track"><div class="fill" data-at="3" data-value="0.4"></div></div></div>
<div class="reveal" data-at="8" style="margin-top:18px"><div class="row"><span>48h cumulative</span><strong>220k</strong></div><div class="track"><div class="fill" data-at="8" data-value="0.7333"></div></div></div>
<div class="reveal" data-at="13" style="margin-top:18px"><div class="row"><span>72h measured / shortfall</span><strong class="amber">280k / 20k</strong></div><div class="track"><div class="fill" data-at="13" data-value="0.9333" style="background:#aa651f"></div></div></div>
<div class="reveal callout" data-at="25" style="margin-top:30px">280k + 25k replacement = 305k reported views</div></div>
<div class="panel dark" style="left:1080px;top:0;width:600px;height:575px"><div class="label">RECOVERY WORKFLOW</div>
<div class="body reveal" data-at="5" style="margin-top:25px">Store snapshots. Never add 120k + 220k + 280k.</div>
<div class="body reveal" data-at="16" style="margin-top:25px">Agent proposes a 6m replacement from the 10m reserve.</div>
<div class="body reveal" data-at="21" style="margin-top:25px">Approved extension + supplier acceptance + new evidence.</div>
<div class="body reveal" data-at="28" style="margin-top:25px">6m used; 4m reserve returned. Total client cost: 96m.</div></div>''',[],
'If replacement delivery fails, apply the agreed credit/refund. An estimate never becomes verified delivery.',
'''This is a deliberately simplified failure scenario. The same placement pool reports 120k, then 220k, then 280k cumulative views. The total is 280k, not 620k. The 20k gap triggers a remedy proposal. A replacement costing 6m delivers 25k additional reported views in an approved extension window. That yields 305k gross reported views, not 305k unique people.

The client or preapproved contract must allow the extension and replacement. If the original deadline is strict, later delivery does not retrospectively satisfy it: settle the missed commitment under its credit/refund rule. Reserve money and replacement supply may run out; the product must expose that risk, not hide it behind a green progress bar.

75m original media + 6m replacement + 15m service = 96m paid, with 4m unused reserve returned in this example. Supplier credits, if any, are reconciled separately and not double-counted. Instagram results remain separate.

Build difficulty: moderate for evidence storage and rules; hard for trustworthy forecasting, fraud triage and pricing guarantees. A source-verified counter is still not proof every view was human or geographically qualified.''')

add('build','06 / What we can build—and what must be proven','Recommended launch: a managed campaign service with a software control layer.',30,
'''<div class="panel" style="left:0;top:0;width:1060px;height:575px"><div class="screen-label">IMPLEMENTATION / DEPENDENCIES</div>
<div class="row reveal" data-at="1"><span>React UI + Python API</span><strong>Moderate</strong></div>
<div class="row reveal" data-at="4"><span>Postgres + evidence storage</span><strong>Moderate</strong></div>
<div class="row reveal" data-at="7"><span>Queues + workers + model server</span><strong>Moderate / hard</strong></div>
<div class="row reveal" data-at="10"><span>Platform access + supplier evidence</span><strong class="amber">Hard / external</strong></div>
<div class="row reveal" data-at="13"><span>Forecasts + profitable guarantees</span><strong class="amber">Data dependent</strong></div>
<div class="reveal callout" data-at="19" style="margin-top:26px">Planning range: 9–12 weeks to connected MVP*</div></div>
<div class="panel dark" style="left:1100px;top:0;width:580px;height:575px"><div class="label">THE DELIVERY COMMITMENT</div>
<div class="body reveal" data-at="3" style="margin-top:28px">Confirmed inventory</div><div class="body reveal" data-at="8" style="margin-top:24px">+ agreed metric and evidence</div><div class="body reveal" data-at="13" style="margin-top:24px">+ reserve and bounded remedy</div><div class="body reveal" data-at="21" style="margin-top:32px">AI lowers operating work.<br>Contracts define what we owe.</div></div>''',[],
'*Two engineers + technical lead + media operator; access delays can extend this. A prototype proves no reach.',
'''Planning estimate, not a fixed quote: two weeks for demand/supply/access discovery, three to four weeks for concierge pilot tooling, then four to six additional weeks for a connected MVP. Assumes two experienced engineers, a contributing technical lead and a media operator, plus part-time design/QA. Platform approvals and supplier onboarding may take longer.

The first product should track real budgets, approved assets, bookings, publication evidence and reconciled results. Forecasting and automatic reallocation come later, when sufficient comparable campaigns support evaluation. Measure operator time saved, evidence completeness, contribution margin and paid renewals.

A credible commitment is a commercial system: confirmed distribution, measurable definitions, supplier obligations, reserve funding, clear exclusions and a bounded remedy. It is not a technical guarantee of unique human attention or organic virality. If those dependencies cannot be secured, sell best-effort planning and fixed placements instead.

This walkthrough is a proposed interface and technical model. It is not a functioning ad-buying platform or a demonstration of live campaign performance.''')

start=0
for n,s in enumerate(scenes):
    s['start']=start; start+=s['duration']; s['index']=n
    rail=''.join(f'<span class="{"active" if j<=n else ""}"></span>' for j in range(6))
    content=f'''<div class="head"><div class="eyebrow">RAVI / TECHNICAL WALKTHROUGH / PROPOSED SYSTEM</div><h1>{s['title']}</h1><div class="sub">{s['sub']}</div></div><div class="stage">{s['body']}</div><div class="bottom">{s['bottom']}</div><div class="rail">{rail}</div>'''
    s['content']=content
    anim=f'''const root=document.querySelector('[data-composition-id="{s['id']}"]');
const tl=gsap.timeline({{paused:true}});
root.querySelectorAll('.reveal').forEach(el=>tl.fromTo(el,{{opacity:0,y:20}},{{opacity:1,y:0,duration:0.55,ease:'power2.out'}},Number(el.dataset.at)));
root.querySelectorAll('.draw').forEach(el=>{{const len=el.getTotalLength();tl.fromTo(el,{{strokeDasharray:len,strokeDashoffset:len}},{{strokeDashoffset:0,duration:1.1,ease:'power2.inOut'}},Number(el.dataset.at));}});
root.querySelectorAll('.fill').forEach(el=>tl.fromTo(el,{{scaleX:0}},{{scaleX:Number(el.dataset.value),duration:1.4,ease:'power2.out'}},Number(el.dataset.at)+0.3));
window.__timelines['{s['id']}']=tl;'''
    s['anim']=anim
    # line breaks are only explicit short field labels, never long body paragraphs
    out=f'''<template><style>{css}</style><div id="root" data-composition-id="{s['id']}" data-width="1920" data-height="1080" data-duration="{s['duration']}">{content}</div><script>{{{anim}}}</script></template>'''
    (P/'compositions'/f"{s['id']}.html").write_text(out,encoding='utf-8')

hosts=''.join(f'<div id="{s["id"]}" class="clip" data-composition-id="{s["id"]}" data-composition-src="compositions/{s["id"]}.html" data-start="{s["start"]}" data-duration="{s["duration"]}" data-width="1920" data-height="1080" data-track-index="{s["index"]}" data-track-kind="graphics"></div>' for s in scenes)
(P/'index.html').write_text(f'''<!doctype html><html><head><meta charset="utf-8"><script src="assets/gsap.min.js"></script><style>html,body{{margin:0;width:1920px;height:1080px;overflow:hidden}}#root{{width:100%;height:100%;background:#f3f0e8}}.clip{{position:absolute;inset:0}}</style></head><body><div id="root" data-composition-id="main" data-start="0" data-duration="180" data-width="1920" data-height="1080" data-fps="30">{hosts}</div><script>window.__timelines['main']=gsap.timeline({{paused:true}});</script></body></html>''',encoding='utf-8')

# Independent study player: the same exact scene content and timelines, plus user controls.
playercss=css.replace('#root{','.scene{')
sections=''.join(f'<section class="scene" data-composition-id="{s["id"]}">{s["content"]}</section>' for s in scenes)
chapters=''.join(f'<button class="chapter" data-i="{i}"><b>0{i+1}</b><span>{s["title"].split(" / ")[1]}</span></button>' for i,s in enumerate(scenes))
scriptdata=json.dumps([{k:s[k] for k in ['id','title','start','duration','notes']} for s in scenes])
player=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ravi — Technical walkthrough</title><script src="assets/gsap.min.js"></script><style>{playercss}
html,body{{background:#e7e9e1;color:#202c29;font-family:Vazirmatn,sans-serif}}header{{padding:22px 30px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #bdc9be}}header strong{{font-size:22px}}header span{{font-size:14px;color:#52645c}}main{{max-width:1550px;margin:auto;padding:24px;display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:24px}}.viewer{{min-width:0}}#screen{{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border-radius:12px;box-shadow:0 12px 35px #20392b15}}#canvas{{position:absolute;width:1920px;height:1080px;transform-origin:top left}}.scene{{display:none}}.controls{{display:flex;gap:14px;align-items:center;margin:16px 0}}button{{font:inherit;cursor:pointer;border:1px solid #aabcb0;border-radius:8px;background:#faf9f4;color:#20392b;padding:9px 15px}}button:hover{{background:#dce8df}}button:focus-visible,input:focus-visible,select:focus-visible{{outline:3px solid #bc6d21}}#play{{background:#27694e;color:#fff;min-width:90px}}#seek{{flex:1;min-width:60px;accent-color:#27694e}}#clock{{font-size:14px;font-variant-numeric:tabular-nums;min-width:92px}}select{{font:inherit;background:#faf9f4;padding:7px;border-radius:6px}}aside h2{{font-size:16px;margin:0 0 15px}}.chapter{{width:100%;display:flex;gap:12px;align-items:center;text-align:left;margin-bottom:10px;font-size:14px;padding:13px}}.chapter.active{{background:#27694e;color:#fff;border-color:#27694e}}.chapter b{{opacity:.7}}.hint{{font-size:14px;line-height:1.6;color:#52645c}}article{{background:#faf9f4;border:1px solid #c4cec3;border-radius:12px;padding:24px;margin-top:24px}}article h2{{font-size:21px;margin:0 0 16px}}article p{{font-size:16px;line-height:1.75;margin:0 0 17px;max-width:100ch}}.sources{{font-size:14px;line-height:1.8}}a{{color:#245741}}@media(max-width:1000px){{main{{grid-template-columns:1fr}}aside{{grid-row:2}}.chapter{{width:auto;display:inline-flex;margin-right:6px}}}}@media(max-width:600px){{main{{padding:10px}}header{{padding:16px}}header span{{display:none}}.controls{{gap:6px}}.controls button{{padding:8px}}}}
</style></head><body><header><strong>Ravi / How the system actually works</strong><span>Private technical study · proposed UI · illustrative figures · 3 minutes</span></header><main><div class="viewer"><div id="screen"><div id="canvas">{sections}</div></div><div class="controls"><button id="back" aria-label="Previous chapter">←</button><button id="play">Play</button><button id="next" aria-label="Next chapter">→</button><input id="seek" type="range" min="0" max="179.99" step="0.1" value="0" aria-label="Timeline"><span id="clock">0:00 / 3:00</span><select id="speed" aria-label="Playback speed"><option value="0.75">0.75×</option><option value="1" selected>1×</option><option value="1.5">1.5×</option></select></div><label class="hint"><input type="checkbox" id="autopause" checked> Pause at the end of each chapter to read its technical notes</label><article><h2 id="notes-title"></h2><div id="notes"></div></article></div><aside><h2>Follow one campaign</h2>{chapters}<p class="hint">Press Play, or select a chapter. Space pauses; ← / → move five seconds. Read the notes for implementation details and limitations.</p><p class="hint">Deliberately silent for study. No live posting, purchases or campaign data.</p><div class="sources"><a href="../research/02_architecture_and_product.md">Full architecture</a> · <a href="../research/01_research_and_feasibility.md">Research & sources</a><p>Key constraints: <a href="https://core.telegram.org/api/stats">Telegram statistics</a>, <a href="https://docs.x.com/x-api/fundamentals/metrics">X metrics</a>, <a href="https://www.twilio.com/docs/api/errors/63058">WhatsApp restrictions</a>.</p></div></aside></main><script>window.__timelines={{}};</script>
{''.join('<script>{'+s['anim']+'}</script>' for s in scenes)}
<script>const scenes={scriptdata};let t=0,playing=false,last=0,selected=-1;const duration=180;const $=s=>document.querySelector(s);function resize(){{$('#canvas').style.transform='scale('+($('#screen').clientWidth/1920)+')'}}new ResizeObserver(resize).observe($('#screen'));resize();function format(s){{return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0')}}function seek(value){{t=Math.max(0,Math.min(179.99,value));let i=scenes.findIndex(s=>t>=s.start&&t<s.start+s.duration);if(i<0)i=5;document.querySelectorAll('.scene').forEach((el,j)=>el.style.display=j===i?'block':'none');window.__timelines[scenes[i].id].seek(t-scenes[i].start,false);$('#seek').value=t;$('#clock').textContent=format(t)+' / 3:00';if(i!==selected){{selected=i;$('#notes-title').textContent=scenes[i].title;$('#notes').replaceChildren(...scenes[i].notes.split('\n\n').map(text=>{{const p=document.createElement('p');p.textContent=text;return p}}));document.querySelectorAll('.chapter').forEach((b,j)=>b.classList.toggle('active',i===j));}}}}function state(p){{playing=p;$('#play').textContent=p?'Pause':'Play'}}function jump(i){{state(false);seek(scenes[Math.max(0,Math.min(5,i))].start)}}$('#play').onclick=()=>{{if(!playing&&t>=179.98)seek(0);else if(!playing&&$('#autopause').checked&&Math.abs(t-(scenes[selected].start+scenes[selected].duration-.02))<.05&&selected<5)seek(scenes[selected+1].start);state(!playing)}};$('#back').onclick=()=>jump(selected-1);$('#next').onclick=()=>jump(selected+1);$('#seek').oninput=e=>{{state(false);seek(Number(e.target.value))}};document.querySelectorAll('.chapter').forEach(b=>b.onclick=()=>jump(Number(b.dataset.i)));document.addEventListener('keydown',e=>{{if(['INPUT','SELECT'].includes(e.target.tagName))return;if(e.code==='Space'){{e.preventDefault();$('#play').click()}}if(e.code==='ArrowRight'){{state(false);seek(t+5)}}if(e.code==='ArrowLeft'){{state(false);seek(t-5)}}}});function tick(now){{if(playing&&last){{let next=t+(now-last)/1000*Number($('#speed').value);const end=scenes[selected].start+scenes[selected].duration;if($('#autopause').checked&&next>=end){{next=end-.02;state(false)}}if(next>=180){{next=179.99;state(false)}}seek(next)}}last=now;requestAnimationFrame(tick)}}seek(0);requestAnimationFrame(tick);</script></body></html>'''
player=player.replace("split('\n\n')", "split('\\n\\n')")
(P/'walkthrough.html').write_text(player.replace('data-composition-id','data-scene-id'),encoding='utf-8')
(P/'chapters.json').write_text(scriptdata,encoding='utf-8')
(P/'SPEC.md').write_text('''# Technical walkthrough spec
Goal: understand the commercial and technical chain from brief to reconciled distribution.
Output: 1920×1080, 30 fps, 180 seconds; six editable sub-compositions and a chapter study player.
Look: warm paper #f3f0e8, ink #202c29, green #27694e, amber #975010 only for uncertainty. Vazirmatn embedded 400/700, headings 62px, body 29–31px, metadata 23–25px. Flat technical diagrams and a labelled proposed interface.
Motion: explicit y=20 to y=0 reveals, 0.55s power2.out; SVG paths 1.1s power2.inOut; progress fills 1.4s power2.out. Long holds intentional for technical reading.
Sound: deliberately silent, no narration; this private study player has pause, scrub, speed, chapter navigation and explanatory notes. No presentation soundtrack.
Data: one fictional 100m-toman campaign, 75m original media, 10m reserve, 15m fee; 6m replacement, 4m returned. Telegram 300k target, 280k delivered plus 25k replacement in approved extension = 305k gross reported views. Instagram 2 placements, separate forecast-only results.
Banned: unlabelled simulated results, bot-view promises, unsupported unique reach, neon decoration, fabricated product screenshots, marketing claims of implemented capabilities.
QA: inspect every scene at its final state and inspect entry/exit frames; verify budget arithmetic, interval labels and chapter controls. Desktop-first technical reading; mobile is secondary.
''',encoding='utf-8')
(P/'STORYLINES.md').write_text('''# Storyline choice
Selected: one client campaign travels through the proposed interface and backend, including a delivery failure and remedy. Directly answers the request for technical understanding.
Alternative: infrastructure-only exploded diagram. Less useful for explaining the business workflow.
Alternative: publisher/operator day-in-the-life. Less useful for showing measurement and guarantee boundaries.
''',encoding='utf-8')
(P/'STORYBOARD.md').write_text('\n\n'.join(f"## Frame {i+1}\nstatus: built\nsrc: compositions/{s['id']}.html\ntime: {s['start']}–{s['start']+s['duration']}s\nrules: svg-path-draw; stat-bars-and-fills (where applicable); explicit transform reveals\nbeat: {s['title']} — {s['bottom']}" for i,s in enumerate(scenes)),encoding='utf-8')
print('Built six scenes, 180 seconds, and chapter study player.')
