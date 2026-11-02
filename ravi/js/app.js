/* Ravi commercial campaign platform on the cinematic UI: hash-routed single page app.
   Flow: brief → objective → plan → creative → approval → booking/publish → evidence → settlement,
   plus the agent fleet, market radar and supplier quality index. All agent behaviour is scripted (see data.js).
   Numbers are illustrative. */
(function () {
  const D = window.RAVI_DATA;
  const fa = (n) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
  const num = (n) => fa(Number(n).toLocaleString("en-US")).replace(/,/g, "٬");
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- state (persisted per browser) ---------- */
  const KEY = "ravi-brand-v3";
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { saved = {}; }
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const S = {
    approvals: saved.approvals || D.approvals.map((a) => ({ ...a, status: "pending" })),
    evidence: saved.evidence || clone(D.evidence),
    plan: saved.plan || clone(D.plan),
    creatives: saved.creatives || clone(D.creatives),
    paid: saved.paid || [],
    log: saved.log || clone(D.home.log),
    scenario: saved.scenario || "s2",
    halted: false, studio: "v1", wizardRun: false, sector: 0, timers: []
  };
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify({ approvals: S.approvals, evidence: S.evidence, plan: S.plan, creatives: S.creatives, paid: S.paid, log: S.log, scenario: S.scenario })); } catch (e) {} };
  const now = () => { const d = new Date(); return fa(String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0")); };
  const addLog = (who, what) => { S.log.unshift([now(), who, what]); persist(); };
  const line = (id) => S.plan.find((l) => l.id === id);
  const every = (fn, ms) => { const h = setInterval(fn, ms); S.timers.push(h); return h; };
  const activeAgents = () => D.fleet.reduce((s, f) => s + f.active, 0);

  /* ---------- money (million toman, illustrative) ---------- */
  function money() {
    const budget = D.campaigns[0].budget;
    const committed = S.plan.filter((l) => l.state !== "reserve").reduce((s, l) => s + l.price, 0);
    const reserved = S.plan.filter((l) => l.state === "reserve").reduce((s, l) => s + l.price, 0);
    const paid = S.plan.filter((l) => S.paid.includes(l.id)).reduce((s, l) => s + l.price, 0);
    const billable = S.plan.filter((l) => S.evidence.some((e) => e.line === l.id && e.status === "accepted") && !S.paid.includes(l.id)).reduce((s, l) => s + l.price, 0);
    return { budget, committed, reserved, paid, billable, free: budget - committed - reserved };
  }

  /* ---------- icons ---------- */
  const P = {
    home: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
    fleet: "M5 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M12 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M19 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M5 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M19 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M12 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0",
    camp: "M4 20V10M10 20V4M16 20v-7M22 20H2",
    brief: "M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5",
    plan: "M3 5h18M3 12h18M3 19h18M8 3v4M15 10v4M11 17v4",
    studio: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
    approve: "M9 12l2 2 4-4M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z",
    book: "M4 5h16v15H4zM4 10h16M9 3v4M15 3v4",
    evidence: "M11 11m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0M16 16l5 5M8 11l2 2 4-4",
    finance: "M3 7h18v12H3zM3 11h18M7 15h3",
    radar: "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0M12 12L19 5",
    quality: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z",
    compass: "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0M15.5 8.5l-2 5-5 2 2-5z",
    film: "M4 5h16v14H4zM4 9h16M4 15h16M8 5v4M16 5v4M8 15v4M16 15v4",
    room: "M4 20V8l8-5 8 5v12M9 20v-6h6v6",
    chat: "M4 5h16v11H8l-4 4z", close: "M6 6l12 12M18 6L6 18", play: "M8 5v14l11-7z"
  };
  const ic = (n, sw = 1.8) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="${P[n]}"/></svg>`;

  /* ---------- routes ---------- */
  const pending = () => S.approvals.filter((a) => a.status === "pending").length;
  const review = () => S.evidence.filter((e) => e.status === "review").length;
  const NAV = [
    { id: "home", t: "خانه · امروز", ico: "home" },
    { id: "fleet", t: "ناوگان عامل‌ها", ico: "fleet" },
    { id: "campaigns", t: "کمپین‌ها", ico: "camp" },
    { h: "چرخه‌ی کمپین" },
    { id: "brief", t: "بریف و هدف", ico: "brief" },
    { id: "plan", t: "برنامه‌ی رسانه", ico: "plan" },
    { id: "studio", t: "استودیو", ico: "studio" },
    { id: "approvals", t: "تأییدها", ico: "approve", badge: pending },
    { id: "booking", t: "رزرو و انتشار", ico: "book" },
    { id: "evidence", t: "نتایج و شواهد", ico: "evidence", badge: review },
    { id: "finance", t: "مالی و تسویه", ico: "finance" },
    { h: "هوش بازار" },
    { id: "market", t: "رادار بازار", ico: "radar" },
    { id: "quality", t: "کیفیت رسانه", ico: "quality" },
    { id: "compass", t: "قطب‌نمای برند", ico: "compass" }
  ];
  const TITLES = {
    home: ["امروز", "چه چیزی امروز توجه می‌خواهد؟"], fleet: ["ناوگان عامل‌ها", "صدها کار موازی، زیر نظر شما"],
    campaigns: ["کمپین‌ها", "کدام هدف در مسیر است، کدام در خطر؟"], brief: ["بریف و هدف", "از نتیجه‌ی کسب‌وکار تا شاخص قابل سنجش"],
    plan: ["برنامه‌ی رسانه", "کجا خرج کنیم و بر اساس کدام شواهد؟"], studio: ["استودیو", "کدام نسخه برای کدام جایگاه تأیید شده است؟"],
    approvals: ["تأییدها", "دقیقاً چه تعهدی را تأیید می‌کنم؟"], booking: ["رزرو و انتشار", "از درخواست تا شناسه‌ی پست منتشرشده"],
    evidence: ["نتایج و شواهد", "چه تحویل شد و از کجا می‌دانیم؟"], finance: ["مالی و تسویه", "متعهد، قابل پرداخت، پرداخت‌شده، آزاد"],
    market: ["رادار بازار", "این هفته در صنعت شما چه جواب داده؟"], quality: ["کیفیت رسانه", "رفتار واقعی بازدید، پیش از خرج"],
    compass: ["قطب‌نمای برند", "واقعیت‌ها، لحن، مخاطب و خط قرمزها"]
  };
  const STEP_ROUTE = ["brief", "brief", "plan", "studio", "approvals", "booking", "evidence", "finance"];

  function shell() {
    const warn = D.connectivity.filter((c) => c.s === "warn").length;
    document.getElementById("app").innerHTML = `
      <aside class="side">
        <div class="brand"><i></i>راوی<small>RAVI</small></div>
        ${NAV.map((n) => n.h ? `<div class="nav-h">${n.h}</div>` :
          `<button class="nav-i" data-go="${n.id}">${ic(n.ico)}<span>${n.t}</span>${(() => { const b = typeof n.badge === "function" ? n.badge() : n.badge; return b ? `<span class="badge">${fa(b)}</span>` : ""; })()}</button>`).join("")}
        <div class="nav-h">ارائه</div>
        <a class="nav-i nav-ext" href="../onboarding/index.html">${ic("film")}<span>سفر راوی (معرفی به شریک)</span></a>
        <a class="nav-i nav-ext" href="../decision-room/index.html">${ic("room")}<span>اتاق تصمیم</span></a>
        <div class="side-foot"><div class="av">م</div><div><b>${D.user.name}</b><span>${D.user.role}</span></div></div>
      </aside>
      <div class="main">
        <div class="top"><button class="menu-toggle" type="button" aria-label="باز کردن فهرست" aria-expanded="false"><span aria-hidden="true">☰</span></button>
          <div><h1 id="tt"></h1><div class="sub" id="ts"></div></div>
          <div class="grow"></div>
          <button class="compass-chip" data-go="compass">${ic("compass")}${D.brand.name} · ${D.brand.product}</button>
          <button class="live ${warn ? "warn" : "ok"}" data-go="home" title="وضعیت اتصال بسترها"><i></i>اتصال: ${fa(D.connectivity.length - warn)} باز، ${fa(warn)} محدود</button>
          <button class="ask-btn" id="askOpen">${ic("chat")}از راوی بپرس <kbd>Ctrl K</kbd></button>
        </div>
        <div class="view" id="view"></div>
      </div>
      <div class="scrim" id="scrim"></div>
      <aside class="drawer" id="drawer">
        <header>${ic("chat")}<h3>از راوی بپرس</h3><div class="grow" style="flex:1"></div><button class="btn sm ghost" type="button" id="askClose" aria-label="بستن گفتگو">${ic("close")}</button></header>
        <div class="chat" id="chat"><div class="ai">سلام ${D.user.short}. درباره‌ی هدف‌ها، عامل‌ها، کیفیت رسانه، بودجه یا برنامه‌ی جایگزین بپرسید. هر عدد از داده‌های کمپین می‌آید و منبعش نشان داده می‌شود.</div></div>
        <div class="sugs">${["عامل‌ها الان چه می‌کنند؟", "چرا ایتا عقب است؟", "کدام کانال مشکوک است؟", "چه چیزی را تضمین کرده‌ایم؟", "اگر اینترنت قطع شود؟"].map((s) => `<button data-ask="${s}">${s}</button>`).join("")}</div>
        <form class="chat-in" id="askForm"><input type="text" id="askIn" placeholder="بپرسید…" autocomplete="off" aria-label="پرسش از راوی" /><button class="btn primary">ارسال</button></form>
      </aside>
      <div class="toast" id="toast"></div>`;
  }

  function toast(t) { const el = $("#toast"); el.textContent = t; el.classList.add("show"); clearTimeout(toast.h); toast.h = setTimeout(() => el.classList.remove("show"), 2400); }
  function go(id) { location.hash = "#/" + id; }
  function route() {
    S.timers.forEach(clearInterval); S.timers = [];
    const id = (location.hash.replace("#/", "") || "home").split("?")[0];
    const v = VIEWS[id] ? id : "home";
    shell();
    $$(".nav-i[data-go]").forEach((b) => { const on = b.dataset.go === v; b.classList.toggle("on", on); if (on) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current"); });
    $("#tt").textContent = TITLES[v][0]; $("#ts").textContent = TITLES[v][1];
    document.title = `${TITLES[v][0]} · راوی`;
    const view = $("#view"); view.innerHTML = ""; view.scrollTop = 0;
    VIEWS[v](view);
    bindGlobal();
    const menu = $(".menu-toggle");
    menu.onclick = () => { const on = $(".side").classList.toggle("mobile-open"); menu.setAttribute("aria-expanded", String(on)); };
    $$(".fade-in").forEach((node, i) => (node.style.animationDelay = Math.min(i * 45, 270) + "ms"));
  }
  const rerender = () => { const y = $("#view") ? $("#view").scrollTop : 0; route(); requestAnimationFrame(() => { const v = $("#view"); if (v) v.scrollTop = y; }); };

  /* ---------- shared pieces ---------- */
  const steps = (cur) => `<div class="steps fade-in">${D.steps.map((s, i) => `<button data-go="${STEP_ROUTE[i]}" class="${i + 1 < cur ? "done" : i + 1 === cur ? "cur" : ""}">${fa(i + 1)}. ${s}</button>`).join("<b>←</b>")}</div>`;
  const gradeTag = (g) => `<span class="tag ${g === "A" ? "ok" : g === "B" ? "" : "risk"}" title="${D.grades[g]}">شواهد ${g}</span>`;
  const kpiRow = (k) => {
    const pct = k.target ? Math.min(100, Math.round((k.now / k.target) * 100)) : 0;
    return `<div><div class="row small wrap"><b>${k.ch}</b><span class="muted tiny grow">${k.metric}</span>${gradeTag(k.grade)}
      <span class="tag ${k.status === "ok" ? "ok" : k.status === "risk" ? "risk" : ""}">${k.statusFa}</span></div>
      <div class="row small" style="margin-top:4px"><div class="bar grow">${k.target ? `<u style="width:${pct}%;${k.status === "risk" ? "background:var(--risk)" : ""}"></u>` : ""}</div>
      <b style="min-width:150px;text-align:left">${num(k.now)}${k.target ? ` / ${num(k.target)} · ${fa(pct)}٪` : " · بدون هدف"}</b></div></div>`;
  };
  const moneyBar = (m) => `<div class="stack-bar">${[[m.paid, "var(--ok)"], [m.committed - m.paid, "#10383a"], [m.reserved, "#e9b65f"], [m.free, "#e6ebe6"]].map(([v, c]) => `<i style="width:${(Math.max(0, v) / m.budget) * 100}%;background:${c}"></i>`).join("")}</div>
    <div class="row wrap tiny muted" style="margin-top:8px"><span><i class="dot" style="display:inline-block;margin:0;background:var(--ok)"></i> پرداخت‌شده ${num(m.paid)}</span><span><i class="dot" style="display:inline-block;margin:0;background:#10383a"></i> متعهد ${num(m.committed - m.paid)}</span><span><i class="dot" style="display:inline-block;margin:0;background:#e9b65f"></i> رزرو ${num(m.reserved)}</span><span><i class="dot" style="display:inline-block;margin:0;background:#cfd8d1"></i> آزاد ${num(m.free)}</span><span>میلیون تومان · نمایشی</span></div>`;
  const spark = (arr, bad) => `<svg class="spark ${bad ? "bad" : ""}" viewBox="0 0 110 30" aria-hidden="true"><polyline points="${arr.map((v, i) => `${(i / (arr.length - 1)) * 106 + 2},${28 - (v / 100) * 26}`).join(" ")}"/></svg>`;

  /* ---------- views ---------- */
  const VIEWS = {};

  VIEWS.home = (el) => {
    const c = D.campaigns[0], m = money(), agents = activeAgents();
    el.innerHTML = `
      <section class="signal-hero"><div class="signal-copy"><span class="eyebrow">RAVI / CAMPAIGN OPERATIONS</span><h2>از هدف برند،<br><em>تا عدد قابل اثبات.</em></h2><p>صدها عامل کار سنگین را انجام می‌دهند؛<br>شما فقط تصمیم‌های مهم را می‌گیرید.</p><div class="row wrap"><button class="btn acc" data-go="campaigns">ورود به کمپین ←</button><a class="btn" href="../onboarding/index.html" style="background:rgba(255,255,255,.08);color:#eef3ef;border-color:rgba(255,255,255,.18);text-decoration:none">${ic("play", 2)}سفر راوی</a></div><span class="hero-note">نسخه‌ی نمایشی · داده‌های سناریویی</span></div><div class="signal-art" aria-hidden="true"><div class="orbit o1"></div><div class="orbit o2"></div><div class="orbit o3"></div><div class="sweep"></div><span class="signal-center">راوی</span><i class="blip b1"></i><i class="blip b2"></i><i class="blip b3"></i><span class="orbit-label">برنامه · اجرا · اثبات</span></div><div class="hero-bottom"><span><b id="hAg">${fa(agents)}</b> عامل فعال</span><span>۴۱ جایگاه زیر پایش</span><span>${fa(S.evidence.length)} مدرک این کمپین</span></div></section>
      <div class="hello fade-in"><div><div class="muted small">صبح بخیر</div><h2>${D.user.short}، امروز ${fa(pending() + (review() ? 1 : 0))} کار منتظر شماست.</h2></div></div>
      <div class="grid g-main">
        <div class="stack">
          <div class="grid g3">${D.home.cards.map((k) => `<div class="card brief-card ${k.kind} fade-in"><span class="tag ${k.kind === "risk" ? "solid-risk" : k.kind === "opp" ? "solid-ok" : "acc"}">${k.tag}</span><p>${k.text}</p><div class="tiny muted">${k.meta}</div><div class="divider"></div><button class="btn sm ${k.kind === "risk" ? "primary" : ""}" data-go="${k.go}">${k.btn} ←</button></div>`).join("")}</div>
          <div class="card fade-in"><h3>${c.name} <small>${c.dates} · ${c.stateFa}</small><button class="btn sm right" data-go="campaigns">جزئیات ←</button></h3>
            <div class="stack">${c.kpis.map(kpiRow).join("")}</div>
            <div class="tiny muted" style="margin-top:10px">هر هدف جداگانه است؛ اعداد بسترها با هم جمع نمی‌شوند. بازدید گزارش‌شده یعنی عدد خود بستر، نه افراد یکتا.</div></div>
          <div class="card fade-in"><h3>بودجه <small>${num(m.budget)} میلیون تومان</small></h3>${moneyBar(m)}</div>
        </div>
        <div class="stack">
          <div class="card dark fade-in"><h3>عامل‌ها در حال کار <small>همین حالا</small><button class="btn sm right" data-go="fleet" style="background:rgba(255,255,255,.1);color:#eef3ef;border-color:rgba(255,255,255,.2)">ناوگان ←</button></h3>
            <div class="feed" id="miniFeed"></div></div>
          <div class="card fade-in"><h3>وضعیت اتصال بسترها <small>آبان ۱۴۰۵</small></h3>
            ${D.connectivity.map((x) => `<div class="alert-i"><i class="dot" style="background:${x.s === "ok" ? "var(--ok)" : "#e9b65f"}"></i><div class="grow"><b class="small">${x.p}</b><div class="tiny muted">${x.t}</div></div></div>`).join("")}
            <div class="suggest" style="margin-top:10px"><p>تعهد تحویل فقط روی بسترهای داخلی است. اگر اینترنت بین‌الملل قطع شود، فقط برنامه‌ی جایگزین امضاشده اجرا می‌شود.</p></div></div>
          <div class="card fade-in"><h3>کارهای اخیر</h3><ul class="clean log">${S.log.slice(0, 5).map((l) => `<li class="alert-i"><b class="tiny" style="min-width:64px;color:var(--acc-ink)">${l[0]}</b><div class="small"><b>${l[1]}</b>: ${l[2]}</div></li>`).join("")}</ul></div>
        </div>
      </div>`;
    startFeed($("#miniFeed"), 5);
  };

  function startFeed(box, max) {
    if (!box) return; let k = 0;
    const push = () => { const f = D.feed[k++ % D.feed.length]; if (S.halted && !["پایش تحویل", "رادار بازار", "کیفیت رسانه"].includes(f[0])) return;
      box.insertAdjacentHTML("afterbegin", `<div class="${f[2] || ""}"><b>${now()}</b><span><em>${f[0]}</em><br>${f[1]}</span></div>`);
      while (box.children.length > max) box.lastElementChild.remove(); };
    for (let i = 0; i < Math.min(max, 4); i++) push();
    every(push, reduce ? 6000 : 2200);
  }

  VIEWS.fleet = (el) => {
    const agents = activeAgents(), today = D.fleet.reduce((s, f) => s + f.today, 0), queue = D.fleet.reduce((s, f) => s + f.queue, 0);
    el.innerHTML = `
      <div class="fleet-kpis">
        <div class="card dark fade-in"><b id="fA">${fa(agents)}</b><span>کار هم‌زمان در جریان</span></div>
        <div class="card fade-in"><b id="fT">${num(today)}</b><span>کار انجام‌شده امروز</span></div>
        <div class="card fade-in"><b id="fQ">${num(queue)}</b><span>کار در صف</span></div>
        <div class="card fade-in"><b>${fa(pending())}</b><span>تصمیم انسانی در انتظار</span><button class="btn sm" data-go="approvals" style="margin-top:8px">تأییدها ←</button></div>
      </div>
      <div class="grid g-main">
        <div class="fleet">${D.fleet.map((f, i) => `<div class="ag fade-in ${f.active > 20 ? "busy" : ""}" data-f="${i}"><span class="model">${f.model}</span><h4><i></i>${f.n}</h4><p>${f.d}</p>
          <div class="swarm">${Array.from({ length: Math.min(42, f.active) }, (_, k) => `<u style="--k:${k}"></u>`).join("")}</div>
          <div class="nums"><div><b class="fa">${fa(f.active)}</b>فعال</div><div><b class="fq">${num(f.queue)}</b>در صف</div><div><b class="ft">${num(f.today)}</b>امروز</div></div>
          <div class="last">آخرین: ${f.last}</div></div>`).join("")}</div>
        <div class="stack">
          <div class="card dark fade-in"><h3>جریان زنده <small>هر اقدام ثبت می‌شود</small></h3><div class="feed" id="bigFeed"></div></div>
          <div class="card fade-in"><h3>سرویس مدل‌ها <small>مصرف لحظه‌ای</small></h3>
            ${D.models.map((m, i) => `<div class="mbar"><span>${m[0]}${m[2] ? ` <small>· ${m[2]}</small>` : ""}</span><div class="bar"><u id="mb${i}" style="width:${m[1]}%"></u></div><b id="mv${i}">${fa(m[1])}٪</b></div>`).join("")}
            <div class="tiny muted" style="margin-top:6px">مدل‌های متن‌باز روی سرور خودمان؛ داده‌ی مشتری بیرون نمی‌رود. تولید تصویر و ویدیو فقط روی سیستم محلی.</div></div>
          <div class="card fade-in"><h3>نرده‌های محافظ</h3>
            ${D.guards.map((g) => `<div class="alert-i"><i class="dot" style="background:var(--ok)"></i><div class="small">${g}</div></div>`).join("")}
            <button class="btn kill ${S.halted ? "on" : ""}" id="kill">${S.halted ? "اقدام‌های بیرونی متوقف است · ادامه" : "توقف سراسری اقدام‌های بیرونی"}</button>
            <div class="tiny muted" style="margin-top:6px">در حالت توقف، عامل‌ها فقط می‌خوانند و تحلیل می‌کنند؛ هیچ انتشار، پیام یا پرداختی انجام نمی‌شود.</div></div>
        </div>
      </div>`;
    startFeed($("#bigFeed"), 9);
    $("#kill").onclick = () => { S.halted = !S.halted; addLog(D.user.name, S.halted ? "توقف سراسری اقدام‌های بیرونی" : "ادامه‌ی اقدام‌های بیرونی"); toast(S.halted ? "همه‌ی اقدام‌های بیرونی متوقف شد" : "اقدام‌ها از سر گرفته شد"); rerender(); };
    const T = D.fleet.map((f) => ({ ...f }));
    every(() => {
      let tot = 0, q = 0, act = 0;
      T.forEach((f, i) => { const halt = S.halted && ["outreach", "publish", "interact", "finance"].includes(f.id);
        const inc = halt ? 0 : Math.max(0, Math.round(f.active * (0.15 + Math.random() * 0.35)));
        f.today += inc; f.queue = Math.max(0, f.queue + Math.round((Math.random() - .55) * Math.max(2, f.queue * .08)));
        const a = halt ? 0 : Math.max(1, f.active + Math.round((Math.random() - .5) * Math.max(1, f.active * .1)));
        const card = $(`.ag[data-f="${i}"]`); if (card) { card.querySelector(".ft").textContent = num(f.today); card.querySelector(".fq").textContent = num(f.queue); card.querySelector(".fa").textContent = fa(a); }
        tot += f.today; q += f.queue; act += a; });
      $("#fT") && ($("#fT").textContent = num(tot)); $("#fQ") && ($("#fQ").textContent = num(q)); $("#fA") && ($("#fA").textContent = fa(act));
      D.models.forEach((m, i) => { const v = Math.max(3, Math.min(96, m[1] + Math.round((Math.random() - .5) * 14))); const u = $("#mb" + i), b = $("#mv" + i); if (u) u.style.width = v + "%"; if (b) b.textContent = fa(v) + "٪"; });
    }, reduce ? 6000 : 1600);
  };

  VIEWS.campaigns = (el) => {
    const c = D.campaigns[0];
    el.innerHTML = `${steps(c.step)}
      <div class="grid g-main">
        <div class="card fade-in"><h3>${c.name} <small>${c.dates}</small><span class="tag acc right">${c.stateFa}</span></h3>
          <div class="stack">${c.kpis.map(kpiRow).join("")}</div>
          <div class="divider"></div>
          <div class="suggest"><p><b>اقدام بعدی پیشنهادی:</b> صبر تا انتشار L4 در ایتا (۱۱ آبان)؛ اگر کمتر از ۵۰ هزار آورد، رزرو جایگزین بله فعال شود. تا ۴۸ ساعت قبل قابل لغو است.</p><button class="btn sm acc" data-go="approvals">تأییدها ←</button></div>
        </div>
        <div class="stack">${D.campaigns.map((k) => `<div class="card flat fade-in"><div class="row"><b class="grow">${k.name}</b><span class="tag ${k.state === "live" ? "acc" : k.state === "closed" ? "ok" : ""}">${k.stateFa}</span></div>
          <div class="tiny muted" style="margin:6px 0">${k.dates} · بودجه ${num(k.budget)} میلیون تومان</div>
          <div class="row tiny muted">${D.steps.map((s, i) => `<i class="dot" style="margin:0;background:${i < k.step ? "var(--ok)" : "var(--line)"}" title="${s}"></i>`).join("")}<span class="grow"></span>${D.steps[k.step - 1]}</div></div>`).join("")}
          <div class="card flat tiny muted fade-in">چرخه‌ی وضعیت: پیش‌نویس ← واجد شرایط ← پیشنهاد ← تأیید مشتری ← تأمین بودجه ← رزرو ← زمان‌بندی ← اجرا ← سنجش ← تطبیق ← بسته. استثناها: نیاز به اصلاح، تحویل نامعلوم، توقف، اختلاف، لغو.</div>
        </div>
      </div>`;
  };

  VIEWS.brief = (el) => {
    const W = D.wizard;
    const chips = (arr, on) => `<div class="row wrap">${arr.map((x, i) => `<button class="chip sug ${on.includes(i) ? "on" : ""}" data-chip>${x}</button>`).join("")}</div>`;
    el.innerHTML = `${steps(2)}
      <div class="grid g2">
        <div class="card fade-in"><h3>بریف <small>از پیام مشتری استخراج شد · منتظر تأیید شما</small></h3>
          <div class="stack small">
            <div><b>۱. نتیجه‌ی کسب‌وکار</b>${chips(W.result, [0])}</div>
            <div><b>۲. شاخص اصلی (برای هر بستر جداگانه)</b>${chips(W.metric, [0, 1])}</div>
            <div><b>۳. مخاطب و زمینه</b><input type="text" value="${W.audience}" /></div>
            <div class="grid g2"><div><b>۴. مهلت</b><input type="text" value="${W.deadline}" /></div><div><b>۵. بودجه</b><input type="text" value="${W.budget}" /></div></div>
            <div><b>۶. بسترهای ترجیحی</b>${chips(W.channels, [0, 1, 3, 5, 6])}</div>
            <div><b>۷. سطح تعهد</b>${chips(W.commit, [1])}</div>
            <div class="suggest"><p><b>اطلاعات ناقص:</b> برای ادعای «مقاوم‌ترین میلگرد ایران» مقایسه‌ی مستقل ارائه نشده است. تا آن زمان این ادعا در محتوا استفاده نمی‌شود.</p></div>
            <button class="btn primary" id="runW">ساخت سه سناریو</button>
          </div></div>
        <div class="stack" id="scen">${S.wizardRun ? scenHTML() : `<div class="card flat empty fade-in">پس از تأیید بریف، عامل برنامه‌ریزی سه سناریو با فرض‌های صریح می‌سازد: محتاط، متعادل، آزمایشی. برای هر کدام ۱۰٬۰۰۰ بار شبیه‌سازی می‌شود.</div>`}</div>
      </div>`;
    $$("[data-chip]", el).forEach((b) => (b.onclick = () => b.classList.toggle("on")));
    $("#runW").onclick = async () => {
      const box = $("#scen");
      box.innerHTML = `<div class="console">${["خواندن پیشنهادهای قیمت معتبر (۲۳ پیشنهاد، تاریخ‌دار)", "محاسبه‌ی بازه از میانه‌ی ۱۰ پست آخر هر کانال", "۱۰٬۰۰۰ اجرای شبیه‌سازی برای هر سناریو", "اعمال محدودیت‌ها: بودجه، ظرفیت، درجه‌ی شواهد، اتصال"].map((t, i) => `<div class="ln" style="opacity:0" id="w${i}"><i style="background:var(--acc)"></i>${t}<span class="run">در حال اجرا</span></div>`).join("")}</div>`;
      for (let i = 0; i < 4; i++) { const n = $("#w" + i); if (!n) return; n.style.opacity = 1; await sleep(450); if (!$("#w" + i)) return; $("#w" + i + " span").textContent = "انجام شد"; $("#w" + i + " span").className = ""; }
      await sleep(250); if (!$("#scen")) return; S.wizardRun = true; box.innerHTML = scenHTML(); bindScen();
    };
    if (S.wizardRun) bindScen();
    function scenHTML() {
      return `${W.scenarios.map((s) => `<button class="opt fade-in ${S.scenario === s.id ? "on" : ""}" data-sc="${s.id}"><div class="row"><b class="grow">${s.t}</b><span class="tag">ریسک ${s.risk}</span><span class="tag acc">${s.cost} م.ت</span></div><p>${s.d}</p><div class="tiny"><b>${s.reach}</b> · ${s.note}</div></button>`).join("")}
        <div class="card flat tiny fade-in"><b>فرض‌ها</b><ul style="margin:6px 0 0;padding-right:18px;line-height:1.9">${W.assumptions.map((a) => `<li>${a}</li>`).join("")}</ul></div>
        <button class="btn acc" data-go="plan">رفتن به برنامه‌ی رسانه ←</button>`;
    }
    function bindScen() { $$("[data-sc]").forEach((b) => (b.onclick = () => { S.scenario = b.dataset.sc; persist(); $$("[data-sc]").forEach((x) => x.classList.toggle("on", x === b)); toast("سناریوی «" + W.scenarios.find((s) => s.id === b.dataset.sc).t + "» انتخاب شد"); })); bindGlobal(); }
  };

  VIEWS.plan = (el) => {
    const m = money();
    el.innerHTML = `${steps(3)}
      <div class="card fade-in"><h3>خطوط برنامه <small>سناریوی ${D.wizard.scenarios.find((s) => s.id === S.scenario).t} · قیمت‌ها میلیون تومان، نمایشی</small></h3>
        <table class="res-table"><thead><tr><th>کد</th><th>تأمین‌کننده</th><th>بستر</th><th>قالب</th><th>زمان</th><th>قیمت</th><th>بازه‌ی پیش‌بینی (هزار)</th><th>شواهد</th><th>تعهد</th><th>وضعیت</th></tr></thead>
        <tbody>${S.plan.map((l) => `<tr><td><b>${l.id}</b></td><td>${l.sup}</td><td>${l.ch}</td><td>${l.fmt}</td><td class="tiny">${l.slot}</td><td>${num(l.price)}</td>
          <td>${l.unit ? `${num(l.lo)} تا ${num(l.hi)} ${l.unit}` : `${num(l.lo)} تا ${num(l.hi)}`}</td><td>${gradeTag(l.grade)}</td><td><span class="tag ${l.commit === "تحویل" ? "acc" : ""}">${l.commit}</span></td><td class="tiny">${D.lineStates[l.state]}</td></tr>`).join("")}</tbody></table>
      </div>
      <div class="grid g2" style="margin-top:16px">
        <div class="card fade-in"><h3>بودجه</h3>${moneyBar(m)}</div>
        <div class="card fade-in"><h3>چرا این برنامه؟ <small>عامل برنامه‌ریزی</small></h3>
          <ul class="clean small" style="line-height:1.9">
            <li>• هر خط به یک پیشنهاد قیمت تاریخ‌دار و واقعی ارجاع دارد؛ موجودی ساختگی وجود ندارد.</li>
            <li>• فقط کانال‌هایی با شاخص کیفیت بالای ۷۵ تعهد تحویل گرفته‌اند. <button class="btn sm ghost" data-go="quality">کیفیت رسانه ←</button></li>
            <li>• اینستاگرام به‌دلیل وابستگی به فیلترشکن فقط برآورد است.</li>
            <li>• L8 در بله رزرو جایگزین است؛ بدون تأیید شما فعال نمی‌شود.</li></ul></div>
      </div>`;
  };

  VIEWS.studio = (el) => {
    const v = S.creatives.find((c) => c.id === S.studio);
    el.innerHTML = `${steps(4)}
      <div class="tabs">${S.creatives.map((c) => `<button class="tab ${c.id === S.studio ? "on" : ""}" data-cr="${c.id}">${c.name}</button>`).join("")}</div>
      <div class="grid g-main">
        <div class="card fade-in"><h3>${v.name} <small>${v.fmt} · نسخه‌ی ${fa(v.ver)}</small><span class="tag ${v.status === "approved" ? "ok" : v.status === "rejected" ? "risk" : "acc"} right">${v.status === "approved" ? "تأییدشده" : v.status === "rejected" ? "رد شده" : "منتظر تأیید"}</span></h3>
          <div class="draft">${esc(v.text)}</div>
          <div class="row wrap" style="margin-top:12px"><button class="btn sm" id="varB">ساخت نسخه‌ی جایگزین</button><span class="grow"></span><span class="tiny muted">تولید تصویر و ویدیو فقط روی سیستم محلی انجام می‌شود.</span></div>
          <div id="alt"></div></div>
        <div class="card fade-in"><h3>بررسی ادعا و حقوق</h3>
          ${v.checks.map((c) => `<div class="alert-i"><i class="dot" style="background:${c[1] === "ok" ? "var(--ok)" : "var(--risk)"}"></i><div><b class="small">${c[0]}</b><div class="tiny muted">${c[2]}</div></div></div>`).join("")}
          <div class="divider"></div><div class="tiny muted">هر ادعا باید به یک واقعیت تأییدشده در قطب‌نمای برند وصل باشد. نسخه‌ی اصلاح‌شده پس از تأیید، دوباره تأیید می‌خواهد.</div></div>
      </div>`;
    $$("[data-cr]", el).forEach((b) => (b.onclick = () => { S.studio = b.dataset.cr; rerender(); }));
    $("#varB").onclick = async () => {
      $("#alt").innerHTML = `<div class="typing"><i></i><i></i><i></i></div>`; await sleep(800); if (!$("#alt")) return;
      $("#alt").innerHTML = `<div class="suggest fade-in" style="margin-top:12px"><p><b>پیشنهاد:</b> «۳ اشتباه در خرید میلگرد که هزینه‌ی پروژه را بالا می‌برد. اشتباه سوم: برگه‌ی آزمون کشش محموله را نخواستن. #تبلیغ». ادعای برتری حذف شد؛ فقط واقعیت تأییدشده استفاده شده.</p><button class="btn sm acc" id="sendA">ارسال برای تأیید</button></div>`;
      $("#sendA").onclick = () => { S.approvals.unshift({ id: "a" + Date.now(), kind: "محتوا", t: "قلاب «۳ اشتباه در خرید میلگرد» نسخه‌ی ۱", d: "جایگزین بدون ادعای برتری برای L4.", who: "مدیر بازاریابی فولاد سپیدار", amount: 0, status: "pending" }); addLog(D.user.name, "نسخه‌ی «۳ اشتباه در خرید میلگرد» برای تأیید ارسال شد"); toast("به صف تأیید رفت"); rerender(); };
    };
  };

  VIEWS.approvals = (el) => {
    el.innerHTML = `${steps(5)}
      <div class="grid g-main"><div class="stack">${S.approvals.map((a) => `<div class="card fade-in"><div class="row wrap"><span class="tag ${a.kind === "هزینه" ? "acc" : a.kind === "تسویه" ? "ok" : ""}">${a.kind}</span><b class="grow">${a.t}</b>${a.amount ? `<b>${num(a.amount)} م.ت</b>` : ""}</div>
        <p class="small" style="line-height:1.8;margin:8px 0">${a.d}</p><div class="tiny muted">تأییدکننده: ${a.who}</div><div class="divider"></div>
        ${a.status === "pending" ? `<div class="row"><button class="btn sm ok" data-ap="${a.id}">تأیید</button><button class="btn sm" data-rj="${a.id}">رد یا اصلاح</button></div>` : `<span class="tag ${a.status === "approved" ? "ok" : "risk"}">${a.status === "approved" ? "تأیید شد" : "رد شد"}</span>`}</div>`).join("")}</div>
        <div class="card flat fade-in"><h3>پیش از هر اقدام بیرونی</h3><ul class="clean small" style="line-height:2">
          <li>✓ نسخه‌ی دقیق محتوا</li><li>✓ مقصد و بازه‌ی زمانی تأییدشده</li><li>✓ بودجه‌ی رزروشده</li><li>✓ دامنه‌ی مجوز کاربر</li><li>✓ کلید یکتایی برای جلوگیری از انتشار یا پرداخت تکراری</li></ul>
          <div class="divider"></div><div class="tiny muted">تأیید یک برنامه، اجازه‌ی خرج نامحدود یا اصلاح نامحدود نیست.</div></div></div>`;
    const act = (id, ok) => {
      const a = S.approvals.find((x) => x.id === id); a.status = ok ? "approved" : "rejected";
      if (ok && a.kind === "هزینه" && a.ref && line(a.ref)) line(a.ref).state = "requested";
      if (ok && a.kind === "تسویه" && a.ref && !S.paid.includes(a.ref)) S.paid.push(a.ref);
      const cr = S.creatives.find((c) => c.id === a.ref); if (cr) cr.status = ok ? "approved" : "rejected";
      addLog(D.user.name, (ok ? "تأیید: " : "رد: ") + a.t); toast(ok ? "تأیید ثبت شد" : "برای اصلاح برگشت"); rerender();
    };
    $$("[data-ap]", el).forEach((b) => (b.onclick = () => act(b.dataset.ap, true)));
    $$("[data-rj]", el).forEach((b) => (b.onclick = () => act(b.dataset.rj, false)));
  };

  VIEWS.booking = (el) => {
    const adapter = (l) => (l.ch === "آپارات" ? "API (حساب متصل)" : l.ch === "سایت‌ها" ? "پنل یکتانت" : "دستی: هماهنگی با ادمین");
    el.innerHTML = `${steps(6)}
      <div class="grid g-main"><div class="card fade-in"><h3>جایگاه‌ها <small>زمان تهران</small></h3>
        ${S.plan.map((l) => `<div class="alert-i"><i class="dot" style="background:${l.state === "published" || l.state === "live" ? "var(--ok)" : l.state === "reserve" ? "var(--line)" : "#e9b65f"}"></i>
          <div class="grow"><div class="row small wrap"><b>${l.id} · ${l.sup}</b><span class="tag">${l.ch}</span><span class="grow"></span><span class="tag ${l.state === "published" || l.state === "live" ? "ok" : ""}">${D.lineStates[l.state]}</span></div>
          <div class="tiny muted">${l.fmt} · ${l.slot} · مسیر: ${adapter(l)}</div>
          ${l.state === "scheduled" || l.state === "requested" ? `<div class="row" style="margin-top:6px"><input type="text" placeholder="پیوند یا شناسه‌ی پست منتشرشده" data-pid="${l.id}" style="max-width:300px" /><button class="btn sm" data-pub="${l.id}">ثبت انتشار</button></div>` : ""}</div></div>`).join("")}</div>
        <div class="card flat fade-in"><h3>قواعد اجرا</h3><ul class="clean small" style="line-height:2">
          <li>• مسیر دستی یک کار واقعی با مهلت است، نه «موفقیت API» ساختگی.</li>
          <li>• پس از پاسخ مبهم، اول وجود پست بررسی می‌شود، بعد تلاش دوباره.</li>
          <li>• در قطعی، کارهای وابسته متوقف و داده‌ها «کهنه» علامت می‌خورند.</li>
          <li>• انتشار فقط از حساب‌های خود مشتری یا جایگاه‌های پولی واقعی.</li>
          ${S.halted ? `<li style="color:var(--risk)">• توقف سراسری فعال است؛ ثبت انتشار غیرفعال است.</li>` : ""}</ul></div></div>`;
    $$("[data-pub]", el).forEach((b) => (b.onclick = () => {
      if (S.halted) { toast("توقف سراسری فعال است"); return; }
      const id = b.dataset.pub, v = $(`[data-pid="${id}"]`).value.trim();
      if (!v) { toast("پیوند یا شناسه‌ی پست لازم است"); return; }
      line(id).state = "published";
      S.evidence.push({ id: "e" + Date.now(), line: id, sup: line(id).sup, kind: "پیوند پست؛ منتظر خروجی آمار", grade: "C", val: "در انتظار ۷۲ ساعت", flag: "", status: "review" });
      addLog(D.user.name, `انتشار ${id} ثبت شد (${v})`); persist(); toast("انتشار ثبت شد؛ مدرک به صف شواهد رفت"); rerender();
    }));
  };

  VIEWS.evidence = (el) => {
    const c = D.campaigns[0];
    el.innerHTML = `${steps(7)}
      <div class="grid g-main"><div class="stack">
        <div class="card fade-in"><h3>هدف‌ها، جداگانه</h3><div class="stack">${c.kpis.map(kpiRow).join("")}</div></div>
        <div class="card fade-in"><h3>صف شواهد</h3>${S.evidence.map((e) => `<div class="alert-i"><i class="dot" style="background:${e.status === "accepted" ? "var(--ok)" : e.status === "rejected" ? "var(--risk)" : "#e9b65f"}"></i>
          <div class="grow"><div class="row small wrap"><b>${e.line} · ${e.sup}</b>${gradeTag(e.grade)}<span class="grow"></span><b>${e.val}</b></div>
          <div class="tiny muted">${e.kind}</div>${e.flag ? `<div class="tiny" style="color:var(--risk);margin-top:4px">⚑ ${e.flag}</div>` : ""}
          ${e.status === "review" ? `<div class="row" style="margin-top:6px"><button class="btn sm ok" data-ea="${e.id}">پذیرش</button><button class="btn sm" data-er="${e.id}">درخواست مدرک بهتر</button></div>` : `<span class="tag ${e.status === "accepted" ? "ok" : "risk"}" style="margin-top:6px">${e.status === "accepted" ? "پذیرفته" : "مدرک بهتر خواسته شد"}</span>`}</div></div>`).join("")}</div></div>
        <div class="card flat fade-in"><h3>درجه‌ی شواهد</h3>${Object.entries(D.grades).map(([g, t]) => `<div class="alert-i">${gradeTag(g)}<div class="tiny">${t}</div></div>`).join("")}
          <div class="divider"></div><div class="tiny muted" style="line-height:1.8">درجه یعنی قوت منشأ، نه تضمین نبود ترافیک نامعتبر. علامت ناهنجاری یعنی بررسی، نه اتهام. داده‌ی ناموجود صفر نیست، نامعلوم است.</div></div></div>`;
    const set = (id, st) => { const e = S.evidence.find((x) => x.id === id); e.status = st; addLog(D.user.name, (st === "accepted" ? "شواهد پذیرفته شد: " : "مدرک بهتر خواسته شد: ") + e.line); toast(st === "accepted" ? "پذیرفته شد؛ قابل تسویه" : "درخواست برای تأمین‌کننده رفت"); rerender(); };
    $$("[data-ea]", el).forEach((b) => (b.onclick = () => set(b.dataset.ea, "accepted")));
    $$("[data-er]", el).forEach((b) => (b.onclick = () => set(b.dataset.er, "rejected")));
  };

  VIEWS.finance = (el) => {
    const m = money();
    const ev = (id) => S.evidence.find((e) => e.line === id);
    el.innerHTML = `${steps(8)}
      <div class="grid g4">${[["بودجه", m.budget], ["متعهد", m.committed], ["قابل پرداخت (شواهد پذیرفته)", m.billable], ["پرداخت‌شده", m.paid]].map(([t, v]) => `<div class="card kpi fade-in"><b>${num(v)}</b><span>${t} · میلیون تومان</span></div>`).join("")}</div>
      <div class="card fade-in" style="margin-top:16px"><h3>تسویه‌ی خط به خط <small>فقط خط با شواهد پذیرفته قابل پرداخت است</small></h3>
        <table class="res-table"><thead><tr><th>خط</th><th>تأمین‌کننده</th><th>قیمت</th><th>شواهد</th><th>نتیجه در برابر برآورد</th><th>وضعیت</th></tr></thead><tbody>
        ${S.plan.map((l) => { const e = ev(l.id); const st = S.paid.includes(l.id) ? ["پرداخت شد", "ok"] : e && e.status === "accepted" ? ["قابل پرداخت", "acc"] : l.state === "reserve" ? ["رزرو، بدون تعهد", ""] : e && e.status === "review" ? ["شواهد در بررسی", ""] : ["منتظر شواهد", "risk"];
          return `<tr><td><b>${l.id}</b></td><td>${l.sup}</td><td>${num(l.price)}</td><td>${e ? gradeTag(e.grade) : "—"}</td><td class="tiny">${e ? e.val : "—"}</td><td><span class="tag ${st[1]}">${st[0]}</span></td></tr>`; }).join("")}
        </tbody></table>
        <div class="divider"></div><div class="tiny muted">کمبود تحویل با تکرار جایگاه یا بازپرداخت جبران می‌شود، هرگز با تعامل جعلی. مبالغ به تومان و تاریخ پیشنهاد قیمت ثبت می‌شود.</div></div>`;
  };

  VIEWS.market = (el) => {
    const M = D.market;
    const max = Math.max(...M.formats.map((f) => Math.abs(f[1])));
    el.innerHTML = `
      <div class="row wrap fade-in" style="margin-bottom:14px">${M.sectors.map((s, i) => `<button class="chip sug ${i === S.sector ? "on" : ""}" data-sec="${i}">${s}</button>`).join("")}<span class="grow"></span><span class="tag">فقط محتوای عمومی · اعداد نمایشی</span></div>
      <div class="grid g-main">
        <div class="stack">
          <div class="card fade-in"><h3>قالب‌های رو به رشد <small>تغییر بازدید میانه نسبت به ماه قبل</small></h3>
            ${M.formats.map((f) => `<div class="fbar"><span>${f[0]}</span><div class="bar"><u class="${f[1] < 0 ? "neg" : ""}" style="width:${(Math.abs(f[1]) / max) * 100}%"></u></div><b style="color:${f[1] < 0 ? "var(--risk)" : "var(--ok)"}">${f[1] > 0 ? "+" : "−"}${fa(Math.abs(f[1]))}٪</b></div>`).join("")}</div>
          <div class="card fade-in"><h3>تبلیغ رقبا <small>این ماه</small></h3>
            <table class="res-table"><thead><tr><th>رقیب</th><th>بستر</th><th>تبلیغ</th><th>قالب غالب</th></tr></thead><tbody>${M.rivals.map((r) => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${fa(r[2])}</td><td>${r[3]}</td></tr>`).join("")}</tbody></table></div>
        </div>
        <div class="stack">
          <div class="card dark fade-in"><h3>قلاب‌هایی که جواب داده‌اند</h3>${M.hooks.map((h) => `<div class="hook" style="background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.1);color:#eef3ef">${h}</div>`).join("")}
            <button class="btn sm acc" data-go="studio" style="margin-top:6px">ساخت نسخه در استودیو ←</button></div>
          <div class="card fade-in"><h3>کانال‌های تازه‌ی رو به رشد</h3>${M.channels.map((c) => `<div class="alert-i"><span class="score ${c[3] >= 80 ? "hi" : c[3] >= 60 ? "mid" : "lo"}">${fa(c[3])}</span><div class="grow"><b class="small">${c[0]}</b><div class="tiny muted">${c[1]} · رشد عضو ${c[2]} در ۳ ماه</div></div></div>`).join("")}
            <div class="tiny muted" style="margin-top:6px">عدد کنار هر کانال، شاخص کیفیت رسانه است.</div></div>
        </div>
      </div>`;
    $$("[data-sec]", el).forEach((b) => (b.onclick = () => { S.sector = +b.dataset.sec; toast(S.sector ? "در این نسخه‌ی نمایشی فقط داده‌ی صنعت فولاد موجود است" : "فولاد و مصالح ساختمانی"); S.sector = 0; }));
  };

  VIEWS.quality = (el) => {
    const Q = D.quality;
    const cls = (s) => (s >= 75 ? "hi" : s >= 50 ? "mid" : "lo");
    el.innerHTML = `
      <div class="grid g4" style="margin-bottom:16px">${[["۱٬۲۰۰", "کانال امتیازگرفته"], ["۸۷", "الگوی غیرعادی"], ["۶۰", "فهرست کوتاه این کمپین"], ["۷۵", "حداقل امتیاز برای تعهد تحویل"]].map(([v, t]) => `<div class="card kpi fade-in"><b>${v}</b><span>${t}</span></div>`).join("")}</div>
      <div class="card fade-in"><h3>شاخص کیفیت رسانه <small>منحنی: درصد بازدید ۷ روزه که در هر ساعت از ۲۴ ساعت اول رسیده</small></h3>
        <table class="res-table"><thead><tr><th>کانال</th><th>بستر</th><th>شاخص</th><th>منحنی بازدید</th><th>بازدید به عضو</th><th>علامت</th></tr></thead><tbody>
        ${Q.map((q) => `<tr><td><b>${q.n}</b></td><td>${q.ch}</td><td><span class="score ${cls(q.score)}">${fa(q.score)}</span></td><td>${spark(q.curve, q.score < 50)}</td><td>${q.ratio}</td><td class="tiny" style="color:${q.score < 50 ? "var(--risk)" : "var(--ink2)"}">${q.flag || "—"}</td></tr>`).join("")}
        </tbody></table>
        <div class="qlegend"><span>منحنی طبیعی: رشد تدریجی در ساعت‌های اول</span><span style="color:var(--risk)">منحنی مشکوک: بیشتر بازدید در ساعت اول، بعد صاف</span></div></div>
      <div class="grid g2" style="margin-top:16px">
        <div class="card fade-in"><h3>چه می‌سنجیم</h3><ul class="clean small" style="line-height:2"><li>• منحنی بازدید هر پست در ۲۴ ساعت اول</li><li>• نسبت بازدید به عضو و جهش‌های ناگهانی عضو</li><li>• کیفیت و تنوع نظرها</li><li>• سابقه‌ی انتشار به‌موقع و نوع مدرک</li></ul></div>
        <div class="card dark fade-in"><h3>اصل کار</h3><p class="small" style="line-height:1.9;margin:0">علامت قرمز یعنی بررسی انسانی، نه اتهام تقلب. کانال‌های زیر ۷۵ فقط با «برآورد» وارد برنامه می‌شوند و برایشان تعهد تحویل بسته نمی‌شود. همین شاخص می‌تواند به‌صورت اشتراک به برندها و آژانس‌های دیگر فروخته شود.</p></div>
      </div>`;
  };

  VIEWS.compass = (el) => {
    const C = D.compass;
    const box = (t, arr, cls) => `<div class="card fade-in"><h3>${t}</h3><div class="row wrap">${arr.map((x) => `<span class="chip ${cls}">${x}</span>`).join("")}</div></div>`;
    el.innerHTML = `<div class="grid g2">${box("واقعیت‌های تأییدشده‌ی محصول", C.facts, "")}${box("ادعاهای ممنوع", C.banned, "red")}${box("لحن", C.voice, "sug on")}${box("مخاطبان", C.audiences, "")}</div>
      <div class="card dark fade-in" style="margin-top:16px"><h3>خط اخلاقی راوی <small>غیرقابل تغییر برای همه‌ی مشتری‌ها</small></h3><div class="row wrap">${C.integrity.map((x) => `<span class="tag acc">${x}</span>`).join("")}</div></div>`;
  };

  /* ---------- ask ravi ---------- */
  function openAsk(q) { $("#drawer").classList.add("open"); $("#scrim").classList.add("open"); if (q) ask(q); else setTimeout(() => $("#askIn").focus(), 200); }
  function closeAsk() { $("#drawer").classList.remove("open"); $("#scrim").classList.remove("open"); }
  async function ask(q) {
    const chat = $("#chat");
    chat.insertAdjacentHTML("beforeend", `<div class="me">${esc(q)}</div>`);
    const ty = document.createElement("div"); ty.className = "ai"; ty.innerHTML = '<div class="typing"><i></i><i></i><i></i></div>'; chat.appendChild(ty); chat.scrollTop = 1e6;
    await sleep(800);
    const hit = D.ask.find((a) => a.k.some((k) => q.includes(k))) || { a: "در این نسخه‌ی نمایشی پاسخ‌ها از پیش نوشته شده‌اند. در نسخه‌ی کامل، هر عدد از پرس‌وجوی داده‌های کمپین ساخته می‌شود و منبعش نشان داده می‌شود.", src: ["نسخه‌ی نمایشی"] };
    ty.innerHTML = ""; const p = document.createElement("div"); ty.appendChild(p);
    for (let i = 0; i <= hit.a.length; i += 3) { p.textContent = hit.a.slice(0, i); chat.scrollTop = 1e6; await sleep(10); }
    ty.insertAdjacentHTML("beforeend", `<div class="src">${hit.src.map((s) => `<span class="tag">${s}</span>`).join("")}</div>`); chat.scrollTop = 1e6;
  }

  function bindGlobal() {
    $$("[data-go]").forEach((b) => (b.onclick = () => go(b.dataset.go)));
    const o = $("#askOpen"); if (o) o.onclick = () => openAsk();
    const c = $("#askClose"); if (c) c.onclick = closeAsk;
    const s = $("#scrim"); if (s) s.onclick = closeAsk;
    $$("[data-ask]").forEach((b) => (b.onclick = () => ask(b.dataset.ask)));
    const f = $("#askForm"); if (f) f.onsubmit = (e) => { e.preventDefault(); const v = $("#askIn").value.trim(); if (v) { $("#askIn").value = ""; ask(v); } };
  }
  document.addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openAsk(); } if (e.key === "Escape") closeAsk(); });
  window.addEventListener("hashchange", route);
  route();
})();
