/* Ravi prototype: hash-routed single page app. All agent behaviour is scripted (see data.js). */
(function () {
  const D = window.RAVI_DATA;
  const fa = (n) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  /* ---------- state (persisted per browser) ---------- */
  const KEY = "ravi-proto-v1";
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { saved = {}; }
  const S = {
    compass: saved.compass || JSON.parse(JSON.stringify(D.compass)),
    approvals: saved.approvals || D.approvals.map((a) => ({ ...a, status: a.stage === "متوقف" ? "blocked" : "pending" })),
    log: saved.log || [
      ["۰۶:۰۰", "راوی", "گزارش صبحگاهی تولید شد"],
      ["۰۵:۴۲", "عامل هشدار", "هشدار شایعه‌ی تعطیلی مدارس ارسال شد (بله)"],
      ["دیروز ۱۹:۱۰", "خانم رادمهر", "پست پایش هوای مدارس تأیید و منتشر شد"]
    ],
    suggestions: saved.suggestions || { night: null, aqi: null },
    focusOnly: true, cluster: "schools", compassTab: "topics", studioTab: "ریلز", mission: "rumour", option: "b",
    missionRun: null, labDone: false
  };
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify({ compass: S.compass, approvals: S.approvals, log: S.log, suggestions: S.suggestions })); } catch (e) {} };
  const now = () => { const d = new Date(); return fa(String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0")); };
  const addLog = (who, what) => { S.log.unshift([now(), who, what]); persist(); };

  /* ---------- icons ---------- */
  const P = {
    home: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
    radar: "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0M12 12L19 5",
    mission: "M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z",
    lab: "M9 3h6M10 3v6L4 19a1.5 1.5 0 0 0 1.3 2h13.4A1.5 1.5 0 0 0 20 19l-6-10V3",
    studio: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
    rival: "M4 20V10M10 20V4M16 20v-7M22 20H2",
    influence: "M6 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M18 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M12 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M7.5 7.5l3.5 9M16.5 7.5l-3.5 9M8 6h8",
    approve: "M9 12l2 2 4-4M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z",
    report: "M4 4h16v16H4zM8 15l3-3 3 2 4-5",
    compass: "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0M15.5 8.5l-2 5-5 2 2-5z",
    chat: "M4 5h16v11H8l-4 4z",
    play: "M8 5v14l11-7z", pause: "M7 5h4v14H7zM13 5h4v14h-4z", close: "M6 6l12 12M18 6L6 18"
  };
  const ic = (n, sw = 1.8) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="${P[n]}"/></svg>`;

  /* ---------- routes ---------- */
  const NAV = [
    { id: "home", t: "خانه · گزارش روزانه", ico: "home" },
    { id: "radar", t: "رادار روایت", ico: "radar", badge: 1 },
    { id: "missions", t: "مأموریت‌ها", ico: "mission" },
    { id: "lab", t: "آزمایشگاه پیام", ico: "lab" },
    { id: "studio", t: "استودیو", ico: "studio" },
    { h: "مزیت رقابتی" },
    { id: "rivals", t: "رقیب‌سنج و فضای خالی", ico: "rival" },
    { id: "influence", t: "نفوذ و آینه‌ی هوش مصنوعی", ico: "influence" },
    { h: "کنترل" },
    { id: "approvals", t: "صف تأیید", ico: "approve", badge: () => S.approvals.filter((a) => a.status === "pending").length },
    { id: "reports", t: "گزارش و یادگیری", ico: "report" },
    { id: "compass", t: "قطب‌نما", ico: "compass" }
  ];
  const TITLES = {
    home: ["گزارش روزانه", "پنجشنبه ۱۰ آبان · ساعت ۶ صبح آماده شد"], radar: ["رادار روایت", "روایت‌ها، نه کلمه‌ها · ۱٫۲ میلیون پست در ۲۴ ساعت"],
    missions: ["مأموریت‌ها", "یک تیم از عامل‌ها، برای یک تصمیم"], lab: ["آزمایشگاه پیام", "قبل از انتشار، روی جامعه‌ی مصنوعی بیازمایید"],
    studio: ["استودیو", "یک ایده، همه‌ی قالب‌ها، با لحن شما"], rivals: ["رقیب‌سنج و فضای خالی", "۳۰ روز گذشته · همه‌ی بسترها"],
    influence: ["نفوذ و آینه‌ی هوش مصنوعی", "صدای واقعی هر جامعه، و آنچه چت‌بات‌ها می‌گویند"], approvals: ["صف تأیید", "هیچ چیز بدون تأیید انسان منتشر نمی‌شود"],
    reports: ["گزارش و یادگیری", "هر انتشار، راوی را هوشمندتر می‌کند"], compass: ["قطب‌نما", "همه‌ی عامل‌ها و جست‌وجوها در این جهت کار می‌کنند"]
  };

  function shell() {
    const activeTopics = S.compass.topics.filter((t) => t.on).length;
    document.getElementById("app").innerHTML = `
      <aside class="side">
        <div class="brand"><i></i>راوی<small>RAVI</small></div>
        ${NAV.map((n) => n.h ? `<div class="nav-h">${n.h}</div>` :
          `<button class="nav-i" data-go="${n.id}">${ic(n.ico)}<span>${n.t}</span>${(() => { const b = typeof n.badge === "function" ? n.badge() : n.badge; return b ? `<span class="badge">${fa(b)}</span>` : ""; })()}</button>`).join("")}
        <div class="side-foot"><img src="img/leader_sm.jpg" alt="" /><div><b>${D.user.name}</b><span>${D.user.role}</span></div></div>
      </aside>
      <div class="main">
        <div class="top">
          <div><h1 id="tt"></h1><div class="sub" id="ts"></div></div>
          <div class="grow"></div>
          <button class="compass-chip" data-go="compass">${ic("compass")}قطب‌نما: ${fa(activeTopics)} تمرکز · ${fa(S.compass.goals.length)} جهت · ${fa(S.compass.rivals.length)} رقیب</button>
          <div class="live"><i></i>زنده</div>
          <button class="ask-btn" id="askOpen">${ic("chat")}از راوی بپرس <kbd>Ctrl K</kbd></button>
        </div>
        <div class="view" id="view"></div>
      </div>
      <div class="scrim" id="scrim"></div>
      <aside class="drawer" id="drawer">
        <header>${ic("chat")}<h3>از راوی بپرس</h3><div class="grow" style="flex:1"></div><button class="btn sm ghost" id="askClose">${ic("close")}</button></header>
        <div class="chat" id="chat"><div class="ai">سلام خانم رادمهر. هر سؤالی درباره‌ی روایت‌ها، رقبا، برنامه‌ی امروز یا پیش‌نویس‌ها دارید بپرسید. پاسخ‌ها با منبع و در جهت قطب‌نمای شما هستند.</div></div>
        <div class="sugs">${["امروز چی بگم؟", "رقیب الف این هفته چه کرد؟", "برای مصاحبه‌ی رادیو آماده‌ام کن", "وضعیت شایعه‌ی مدارس"].map((s) => `<button data-ask="${s}">${s}</button>`).join("")}</div>
        <form class="chat-in" id="askForm"><input type="text" id="askIn" placeholder="بپرسید…" autocomplete="off" /><button class="btn primary">ارسال</button></form>
      </aside>
      <div class="toast" id="toast"></div>`;
  }

  function toast(t) { const el = $("#toast"); el.textContent = t; el.classList.add("show"); clearTimeout(toast.h); toast.h = setTimeout(() => el.classList.remove("show"), 2200); }
  function go(id) { location.hash = "#/" + id; }
  function route() {
    const id = (location.hash.replace("#/", "") || "home").split("?")[0];
    const v = VIEWS[id] ? id : "home";
    shell();
    $$(".nav-i").forEach((b) => b.classList.toggle("on", b.dataset.go === v));
    $("#tt").textContent = TITLES[v][0]; $("#ts").textContent = TITLES[v][1];
    const view = $("#view"); view.innerHTML = ""; view.scrollTop = 0;
    VIEWS[v](view);
    bindGlobal();
  }

  /* ---------- views ---------- */
  const VIEWS = {};

  VIEWS.home = (el) => {
    const b = D.brief;
    el.innerHTML = `
      <div class="hello fade-in"><div><div class="muted small">صبح بخیر</div><h2>${D.user.short}، امروز ۳ چیز مهم است.</h2></div></div>
      <div class="grid g-main">
        <div class="stack">
          <div class="player fade-in"><button class="play" id="bPlay">${ic("play", 2.2)}</button>
            <div><b>گزارش صوتی ۳ دقیقه‌ای</b><div class="tiny" style="color:#B9B4A8">با صدای دستیار · بر اساس قطب‌نمای شما</div></div>
            <div class="wave" id="wave">${Array.from({ length: 48 }, () => "<i></i>").join("")}</div><b id="bTime">۳:۰۰</b></div>
          <div class="grid g3">${b.cards.map((c) => `<div class="card brief-card ${c.kind} fade-in"><span class="tag ${c.kind === "risk" ? "solid-risk" : c.kind === "opp" ? "solid-ok" : "acc"}">${c.tag}</span><p>${c.text}</p><div class="tiny muted">${c.meta}</div><div class="divider"></div>
            <button class="btn sm ${c.kind === "risk" ? "primary" : ""}" data-go="${c.go}">${c.go === "radar" ? "مشاهده در رادار" : c.go === "missions" ? "شروع مأموریت پاسخ" : "ساخت محتوا در استودیو"} ←</button></div>`).join("")}</div>
          <div class="card fade-in"><h3>هم‌راستایی با جهت‌های قطب‌نما <small>این هفته</small></h3>
            <div class="stack">${S.compass.goals.map((g, i) => `<div><div class="row small"><b class="grow">${g.t}</b><span>${fa([78, 64, 22][i] || 30)}٪</span></div><div class="bar"><u style="width:${[78, 64, 22][i] || 30}%"></u></div></div>`).join("")}</div>
            <div class="suggest" style="margin-top:14px"><p>«حمل‌ونقل شبانه» هنوز صاحبی ندارد و با جهت سوم شما هم‌راستاست. برنامه‌ی هفته بسازیم؟</p><button class="btn sm acc" data-go="rivals">فضای خالی ←</button></div>
          </div>
        </div>
        <div class="stack">
          <div class="card fade-in"><h3>برنامه‌ی امروز</h3><ul class="clean agenda">${b.agenda.map((a) => `<li><b>${a[0]}</b><span>${a[1]}</span></li>`).join("")}</ul></div>
          <div class="card fade-in"><h3>هشدارها <small>از شب گذشته</small></h3>${b.alerts.map((a) => `<div class="alert-i"><span class="dot" style="background:var(--${a.c === "acc" ? "acc" : a.c})"></span><div class="grow small">${a.t}</div><span class="tiny muted">${a.time}</span></div>`).join("")}</div>
          <div class="card dark fade-in"><h3>عامل‌ها در حال کار <small>همین حالا</small></h3>
            <div class="stack small">${["پایش ۴۸۰ کانال تلگرام و ایتا", "خواندن ۱۲ خبرگزاری", "رصد ۲ رقیب و ۱۴ خبرنگار", "بررسی پاسخ چت‌بات‌ها درباره‌ی شما"].map((t) => `<div class="row"><span class="dot" style="background:#7FC8B6;margin:0"></span>${t}</div>`).join("")}</div></div>
        </div>
      </div>`;
    let playing = false, t = 0, h;
    const bars = $$("#wave i");
    const tick = () => {
      t += 1;
      bars.forEach((b, i) => { b.style.height = (20 + 70 * Math.abs(Math.sin(t * 0.35 + i * 0.6) * Math.cos(t * 0.11 + i * 0.2))) + "%"; b.classList.toggle("done", i < (t / 360) * 48); });
      const left = Math.max(0, 180 - Math.floor(t / 2)); $("#bTime").textContent = fa(Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0"));
    };
    $("#bPlay").onclick = () => { playing = !playing; $("#bPlay").innerHTML = ic(playing ? "pause" : "play", 2.2); if (playing) h = setInterval(tick, 500); else clearInterval(h); };
    window.addEventListener("hashchange", () => clearInterval(h), { once: true });
  };

  VIEWS.radar = (el) => {
    const focus = S.compass.topics.filter((t) => t.on).map((t) => t.id);
    const vis = (c) => !S.focusOnly || focus.includes(c.topic);
    el.innerHTML = `
      <div class="grid g-main">
        <div class="card radar-wrap fade-in" id="radarCard"><svg viewBox="0 0 1000 560" id="radarSvg"></svg>
          <div class="row" style="position:absolute;top:14px;right:14px;left:14px">
            <button class="row small" id="focusT"><span class="toggle ${S.focusOnly ? "on" : ""}"></span><b>فقط تمرکزهای قطب‌نما</b></button>
            <div class="grow"></div><span class="tag">۲۴ ساعت گذشته</span><span class="tag">همه‌ی بسترها</span></div></div>
        <div class="stack">
          <div class="card fade-in" style="padding:10px"><div class="stack" style="gap:2px">${D.clusters.map((c) => `<button class="cl-item ${S.cluster === c.id ? "on" : ""}" data-cl="${c.id}" style="opacity:${vis(c) ? 1 : 0.35}">
            <span class="dot" style="margin:0;background:${c.hot ? "var(--risk)" : focus.includes(c.topic) ? "var(--acc)" : "#B9B4A8"}"></span><b class="grow small">${c.name}</b><span class="tiny muted">${fa(c.n.toLocaleString("en"))}</span><span class="tag ${c.hot ? "risk" : ""}">${c.growth}</span></button>`).join("")}</div></div>
          <div class="card fade-in" id="clDetail"></div>
        </div>
      </div>`;
    const svg = $("#radarSvg");
    let html = "";
    D.clusters.forEach((c, ci) => {
      const r = rng(ci * 97 + 13), cx = c.x * 1000, cy = c.y * 560, n = Math.round(c.n / 600), on = vis(c), isF = focus.includes(c.topic);
      const col = c.hot ? "#D5402B" : isF ? "#E39B2D" : "#B9B4A8";
      if (S.cluster === c.id) html += `<circle cx="${cx}" cy="${cy}" r="${c.r + 26}" fill="none" stroke="${col}" stroke-width="2" stroke-dasharray="6 6"/>`;
      for (let i = 0; i < n; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * c.r; html += `<circle cx="${(cx + Math.cos(a) * d).toFixed(1)}" cy="${(cy + Math.sin(a) * d * 0.8).toFixed(1)}" r="${3 + r() * 2.5}" fill="${col}" opacity="${on ? 0.85 : 0.18}"/>`; }
      html += `<g style="cursor:pointer" data-cl="${c.id}" opacity="${on ? 1 : 0.3}"><rect x="${cx - 80}" y="${cy - c.r - 40}" width="160" height="28" rx="8" fill="#fff" stroke="${c.hot ? "#D5402B" : "#DAD5CA"}"/><text class="cluster-label" x="${cx}" y="${cy - c.r - 21}" text-anchor="middle" fill="${c.hot ? "#D5402B" : "#15171A"}">${c.name}</text></g>`;
      html += `<circle cx="${cx}" cy="${cy}" r="${c.r}" fill="transparent" data-cl="${c.id}" style="cursor:pointer"/>`;
    });
    svg.innerHTML = html;
    const showDetail = () => {
      const c = D.clusters.find((x) => x.id === S.cluster);
      const stages = ["تولد", "شتاب", "اوج", "افول"];
      $("#clDetail").innerHTML = `<h3>${c.name} ${c.hot ? '<span class="tag solid-risk">هشدار</span>' : ""}</h3>
        <div class="life">${stages.map((s) => `<span>${s}</span>`).join("")}<i class="mark" style="right:${4 + c.stage * 31}%"></i></div>
        <div class="prob"><b>${fa(c.prob)}٪</b><span class="small"><b>احتمال فراگیر شدن</b><br/>تا ۱۸ ساعت آینده</span></div>
        <div class="tiny muted" style="margin-top:8px">سهم بسترها</div>${c.src.map((s) => `<div class="srcrow"><span>${s[0]}</span><div class="bar"><u style="width:${s[1]}%"></u></div><span>${fa(s[1])}٪</span></div>`).join("")}
        <div class="tiny muted" style="margin-top:10px">چه کسانی پیش می‌برند</div><ul class="clean small" style="line-height:2">${c.carriers.map((x) => `<li>• ${x}</li>`).join("")}</ul>
        ${c.bots > 5 ? `<div class="tag risk" style="margin:8px 0;padding:8px 10px;display:block">${fa(c.bots)}٪ حساب‌ها رفتار هماهنگ دارند · احتمال ربات</div>` : ""}
        <div class="row" style="margin-top:12px"><button class="btn primary grow" data-go="missions">شروع مأموریت پاسخ ←</button><button class="btn" id="askAbout">بپرس</button></div>`;
      $("#askAbout").onclick = () => openAsk("وضعیت شایعه‌ی مدارس");
    };
    showDetail();
    el.addEventListener("click", (e) => { const t = e.target.closest("[data-cl]"); if (t) { S.cluster = t.dataset.cl; route(); } });
    $("#focusT").onclick = (e) => { e.stopPropagation(); S.focusOnly = !S.focusOnly; route(); };
  };

  VIEWS.missions = (el) => {
    el.innerHTML = `
      <div class="grid" style="grid-template-columns:300px 1fr">
        <div class="stack">
          <div class="card flat"><h3>قالب مأموریت</h3><div class="stack">${D.missionTemplates.map((m) => `<button class="tpl ${S.mission === m.id ? "on" : ""}" data-m="${m.id}"><span class="ico">${m.ico}</span><span><b>${m.t}</b><div class="tiny muted">${m.d}</div></span></button>`).join("")}</div></div>
          <div class="card flat small"><h3>زمینه</h3><div class="stack"><span class="tag risk">شایعه‌ی تعطیلی مدارس · ۷۲٪</span><span class="muted">قطب‌نما: ۳ جهت، ۵ خط قرمز، ۴ منبع رسمی</span>
            <button class="btn sm" data-go="compass">تغییر قطب‌نما</button></div></div>
        </div>
        <div class="stack" id="mBody"></div>
      </div>`;
    $$(".tpl", el).forEach((b) => (b.onclick = () => { S.mission = b.dataset.m; S.missionRun = null; VIEWS.missions(el); bindGlobal(); }));
    const body = $("#mBody");
    const tpl = D.missionTemplates.find((m) => m.id === S.mission);
    if (S.mission !== "rumour") {
      body.innerHTML = `<div class="card"><h3>${tpl.ico} ${tpl.t}</h3>${S.mission === "interview" ? `
        <div class="stack"><div class="muted small">مصاحبه‌ی رادیویی ۱۱:۳۰ · برنامه‌ی «شهر من» · بر اساس ۴۰ برنامه‌ی قبلی مجری</div>
        ${[["چرا اطلاع‌رسانی درباره‌ی مدارس دیر انجام شد؟", "روال جدید ساعت ۱۸ را توضیح دهید؛ مسئولیت را بپذیرید، تقصیر را نه."], ["آیا مدارس فردا باز است؟", "عدد نگویید؛ به اطلاعیه‌ی ساعت ۱۸ ارجاع دهید."], ["برنامه‌ی شورا برای زمستان چیست؟", "پایش هوای مدارس در ۱۲۰ مدرسه؛ منبع: مصوبه‌ی کمیسیون سلامت."]].map((q, i) => `<div class="goal"><b>پرسش محتمل ${fa(i + 1)}: ${q[0]}</b><span class="small muted">پاسخ کوتاه: ${q[1]}</span></div>`).join("")}
        <div class="row"><button class="btn primary" id="sim">شروع شبیه‌ساز مجری منتقد</button><button class="btn">دانلود برگه‌ی تقلب</button></div></div>` : `
        <div class="stack"><div class="muted small">پیشنهاد عامل استراتژیست برای هفته‌ی آینده، هم‌راستا با جهت‌های قطب‌نما</div>
        ${[["شنبه", "ریلز: یک هفته روال ساعت ۱۸، چه تغییر کرد؟", "شفافیت"], ["دوشنبه", "بازدید ایستگاه مترو در ساعت ۱۱ شب", "حمل‌ونقل شبانه"], ["چهارشنبه", "جلسه‌ی آنلاین با انجمن اولیا", "خانواده‌ها"], ["پنجشنبه", "گزارش داده‌ای: هوای مدارس در یک هفته", "شفافیت"]].map((d) => `<div class="row goal"><b style="width:70px">${d[0]}</b><span class="grow">${d[1]}</span><span class="tag acc">${d[2]}</span></div>`).join("")}</div>`}</div>`;
      const sim = $("#sim"); if (sim) sim.onclick = () => toast("شبیه‌ساز مصاحبه در نسخه‌ی کامل فعال می‌شود");
      return;
    }
    body.innerHTML = `
      <div class="card"><h3>⚡ پاسخ به شایعه‌ی تعطیلی مدارس <span class="right"></span><button class="btn primary sm" id="mRun">${S.missionRun ? "اجرای دوباره" : "اجرای مأموریت"}</button></h3>
        <div class="grid g2"><div class="console" id="cons"><div class="tiny" style="color:var(--acc);font-weight:700">کنسول عامل‌ها</div>${S.missionRun ? "" : '<div class="ln" style="color:#8A8F8B">برای شروع، «اجرای مأموریت» را بزنید.</div>'}</div>
        <div class="stack" id="chatM"></div></div></div>
      <div class="card" id="optCard" style="display:none"><h3>گزینه‌ها برای تصمیم شما <small>امتیاز هم‌راستایی با قطب‌نما</small></h3><div class="grid g3" id="opts"></div>
        <div class="row" style="margin-top:12px"><span class="grow small muted" id="optHint"></span><button class="btn" data-go="studio">مستقیم به استودیو</button><button class="btn acc" data-go="lab">آزمودن در آزمایشگاه پیام ←</button></div></div>`;
    const renderOpts = () => {
      $("#optCard").style.display = "";
      $("#opts").innerHTML = D.missionOptions.map((o) => `<button class="opt ${S.option === o.id ? "on" : ""}" data-o="${o.id}"><b>${o.t}</b> ${o.rec ? '<span class="tag acc">پیشنهاد شورا</span>' : ""}<p>${o.d}</p>
        <div class="row wrap"><span class="tag ${o.risk.includes("بالا") ? "risk" : "ok"}">${o.risk}</span><span class="tag">${o.reach}</span><span class="tag ok">هم‌راستایی ${fa(o.fit)}٪</span></div></button>`).join("");
      $("#optHint").textContent = "انتخاب شما: گزینه‌ی " + D.missionOptions.find((o) => o.id === S.option).t;
      $$(".opt").forEach((b) => (b.onclick = () => { S.option = b.dataset.o; renderOpts(); }));
    };
    const renderStatic = () => {
      $("#cons").innerHTML = '<div class="tiny" style="color:var(--acc);font-weight:700">کنسول عامل‌ها</div>' + D.missionTrace.map((l) => `<div class="ln"><i style="background:${l.c}"></i>${l.t}<span>${l.d} ✓</span></div>`).join("");
      $("#chatM").innerHTML = D.missionChat.map((m) => `<div class="msg"><div class="av" style="background:${m.c}">${m.av}</div><div class="bub"><b>${m.who}</b>${m.t}</div></div>`).join("");
      renderOpts();
    };
    if (S.missionRun === "done") renderStatic();
    $("#mRun").onclick = async () => {
      const token = (S.missionRun = Math.random());
      $("#optCard").style.display = "none";
      const cons = $("#cons"), chat = $("#chatM");
      cons.innerHTML = '<div class="tiny" style="color:var(--acc);font-weight:700">کنسول عامل‌ها</div>'; chat.innerHTML = "";
      for (const l of D.missionTrace) {
        if (S.missionRun !== token || !document.body.contains(cons)) return;
        const ln = document.createElement("div"); ln.className = "ln fade-in"; ln.innerHTML = `<i style="background:${l.c}"></i>${l.t}<span class="run">در حال اجرا…</span>`; cons.appendChild(ln);
        await sleep(650); ln.querySelector("span").className = ""; ln.querySelector("span").textContent = l.d + " ✓";
      }
      for (const m of D.missionChat) {
        if (S.missionRun !== token || !document.body.contains(chat)) return;
        const ty = document.createElement("div"); ty.className = "msg"; ty.innerHTML = `<div class="av" style="background:${m.c}">${m.av}</div><div class="typing"><i></i><i></i><i></i></div>`; chat.appendChild(ty);
        await sleep(800); ty.outerHTML = `<div class="msg fade-in"><div class="av" style="background:${m.c}">${m.av}</div><div class="bub"><b>${m.who}</b>${m.t}</div></div>`;
      }
      S.missionRun = "done"; renderOpts(); addLog("شورای عامل‌ها", "مأموریت پاسخ به شایعه اجرا شد · ۳ گزینه");
    };
  };

  VIEWS.lab = (el) => {
    const msgs = D.missionOptions.map((o) => o.d.replace(/[«»]/g, ""));
    el.innerHTML = `
      <div class="grid" style="grid-template-columns:380px 1fr">
        <div class="stack">
          <div class="card"><h3>پیام‌ها</h3><div class="stack" style="gap:16px">${msgs.map((m, i) => `<div class="msg-in"><span class="lbl">پیام ${fa(i + 1)}</span><textarea id="m${i}" rows="2">${esc(m)}</textarea></div>`).join("")}</div>
            <button class="btn primary" style="width:100%;margin-top:14px" id="labRun">اجرای آزمون روی ۲٬۴۰۰ پرسونا</button>
            <div class="tiny muted" style="margin-top:10px;line-height:1.8">پرسوناها از ۲۴٬۰۰۰ نظر واقعی مخاطبان شما ساخته شده‌اند و با نتیجه‌ی ۳۸ کمپین گذشته کالیبره شده‌اند. نتیجه‌ها جهت‌نما هستند، نه نظرسنجی.</div></div>
          <div class="card" id="labRes"><h3>نتیجه</h3><div class="muted small">هنوز آزمونی اجرا نشده است.</div></div>
        </div>
        <div class="grid g2">${D.segments.map((s, i) => `<div class="card"><h3>${s.n}<span class="right tag ok" id="sp${i}">—</span></h3><div class="seg-dots" id="sd${i}">${Array.from({ length: 160 }, () => "<i></i>").join("")}</div></div>`).join("")}
          <div class="card flat" style="grid-column:1/-1"><div class="legend"><span><i style="background:var(--ok)"></i>قانع شد</span><span><i style="background:#B9B4A8"></i>بی‌تفاوت</span><span><i style="background:var(--risk)"></i>مخالف</span></div></div></div>
      </div>`;
    const R = D.segments.map((s, i) => { const r = rng(i * 31 + 7); return Array.from({ length: 160 }, () => r()); });
    const paint = (m) => D.segments.forEach((s, i) => {
      $$(`#sd${i} i`).forEach((d, k) => { const v = R[i][k]; d.style.background = v < s.P[m] ? "var(--ok)" : v > 1 - s.Q[m] ? "var(--risk)" : "#B9B4A8"; });
      $(`#sp${i}`).textContent = "پیام " + fa(m + 1) + " · " + fa(Math.round(s.P[m] * 100)) + "٪";
    });
    const results = () => {
      $("#labRes").innerHTML = `<h3>نتیجه <small>درصد قانع‌شده</small></h3><table class="res-table"><tr><th>بخش</th><th>پیام ۱</th><th>پیام ۲</th><th>پیام ۳</th></tr>
        ${D.segments.map((s) => { const best = s.P.indexOf(Math.max(...s.P)); return `<tr><td>${s.n}</td>${s.P.map((p, j) => `<td class="${j === best ? "win" : ""}">${fa(Math.round(p * 100))}٪</td>`).join("")}</tr>`; }).join("")}</table>
        <div class="suggest" style="margin-top:12px"><p><b>ترکیب پیشنهادی:</b> پیام ۲ برای ریلز جوانان، پیام ۳ برای کانال والدین.</p><button class="btn sm acc" data-go="studio">به استودیو ←</button></div>`;
      bindGlobal();
    };
    if (S.labDone) { paint(1); results(); }
    $("#labRun").onclick = async () => {
      const btn = $("#labRun"); btn.disabled = true;
      for (let m = 0; m < 3; m++) { btn.textContent = "در حال آزمون پیام " + fa(m + 1) + "…"; paint(m); await sleep(1100); if (!document.body.contains(btn)) return; }
      paint(1); results(); btn.disabled = false; btn.textContent = "اجرای دوباره"; S.labDone = true; addLog("آزمایشگاه پیام", "۳ پیام روی ۴ بخش آزموده شد");
    };
  };

  VIEWS.studio = (el) => {
    const f = D.studio.formats;
    el.innerHTML = `
      <div class="grid" style="grid-template-columns:1fr 360px">
        <div class="card"><div class="row" style="margin-bottom:12px"><input type="text" value="روال شفاف روزانه + همدلی با والدین (پیام ۲ + ۳)" /><button class="btn primary" id="regen">تولید دوباره</button></div>
          <div class="tabs">${Object.keys(f).map((k) => `<button class="tab ${S.studioTab === k ? "on" : ""}" data-tab="${k}">${k}</button>`).join("")}</div>
          <div class="grid" style="grid-template-columns:${S.studioTab === "ریلز" ? "1fr 230px" : "1fr"};align-items:start">
            <div class="draft" id="draft" contenteditable="true">${esc(f[S.studioTab])}</div>
            ${S.studioTab === "ریلز" ? `<div class="phone"><div style="background-image:url(img/leader.png);background-position:42% center"><p>من هم مادرم؛ و امروز صبح، هوای تهران را نفس کشیدم.</p></div></div>` : ""}
          </div>
          <div class="row" style="margin-top:14px"><span class="tag ok">۲ منبع رسمی پیوست شد</span><span class="tag">برچسب هوش مصنوعی ✓</span><div class="grow"></div><button class="btn" id="warm">گرم‌تر کن</button><button class="btn acc" id="toQ">ارسال به صف تأیید ←</button></div></div>
        <div class="stack">
          <div class="card"><h3>تطابق با لحن شما</h3><div class="kpi"><b style="color:var(--ok)">۹۴٪</b><span>بر اساس ۲۰ سخنرانی و ۲۰۰ پست</span></div>
            <div class="row wrap" style="margin-top:10px"><span class="tag ok">صمیمی</span><span class="tag ok">شفاف</span><span class="tag ok">بدون شعار</span><span class="tag">داده‌محور</span></div></div>
          <div class="card"><h3>قلاب‌ها <small>پیش‌بینی دیده‌شدن</small></h3>${D.studio.hooks.map((h) => `<div class="hook"><p>${h.t}</p><b>${fa(h.s)}</b></div>`).join("")}</div>
          <div class="card flat small"><h3>بررسی قطب‌نما</h3><div class="check"><i class="y">✓</i>هم‌راستا با «شفاف‌ترین مدیر شهری»</div><div class="check"><i class="y">✓</i>بدون عدد تأییدنشده</div><div class="check"><i class="y">✓</i>بدون اشاره به رقبا</div></div>
        </div>
      </div>`;
    $$(".tab", el).forEach((t) => (t.onclick = () => { S.studioTab = t.dataset.tab; VIEWS.studio(el); bindGlobal(); }));
    $("#regen").onclick = () => toast("نسخه‌ی تازه با همان لحن تولید شد");
    $("#warm").onclick = () => toast("لحن ۱۵٪ گرم‌تر شد · قطب‌نما همچنان رعایت شده");
    $("#toQ").onclick = () => { S.approvals.unshift({ id: Date.now(), t: S.studioTab + " · روال شفاف + همدلی", fmt: S.studioTab, by: "تیم رسانه", stage: "تأیید نهایی", checks: [1, 1, 1, 1, 1], status: "pending" }); addLog("تیم رسانه", "پیش‌نویس " + S.studioTab + " به صف تأیید ارسال شد"); persist(); toast("به صف تأیید رفت"); go("approvals"); };
  };

  VIEWS.rivals = (el) => {
    el.innerHTML = `
      <div class="row" style="margin-bottom:14px"><div class="legend"><span><i style="background:var(--acc)"></i>شما</span><span><i style="background:var(--a)"></i>رقیب الف</span><span><i style="background:var(--b)"></i>رقیب ب</span></div></div>
      <div class="grid g-main"><div class="card"><h3>سهم از گفت‌وگو <small>۳۰ روز</small></h3><svg viewBox="0 0 700 260" id="stream" style="width:100%"></svg><div class="row tiny muted"><span>امروز</span><div class="grow"></div><span>۳۰ روز پیش</span></div></div>
        <div class="card"><h3>مالکیت موضوع‌ها</h3><svg viewBox="-200 -170 400 340" id="spider" style="width:100%"></svg></div></div>
      <div class="grid g4" style="margin:16px 0">${[["۳۸٪", "سهم شما از گفت‌وگو", "acc"], ["۲ ساعت", "میانگین زمان پاسخ شما · رقیب الف: ۹ ساعت", ""], ["مسکن", "موضوعی که رقیب الف این هفته تصاحب کرد", "a"], ["۱", "موضوع بی‌صاحب با اهمیت بالا", "ok"]].map((k) => `<div class="card kpi"><b style="color:${k[2] ? "var(--" + k[2] + ")" : "inherit"}">${k[0]}</b><span>${k[1]}</span></div>`).join("")}</div>
      <div class="grid g-main"><div class="card"><h3>فضای خالی <small>اهمیت برای مردم × مالکیت سیاسی · روی حباب‌ها کلیک کنید</small></h3><div class="bubbles" id="bubs"></div></div>
        <div class="card dark" id="wsInfo"></div></div>`;
    const N = 31, W = 700, H = 260, you = [], ra = [], rb = [];
    for (let i = 0; i < N; i++) { you.push(0.22 + 0.16 * (i / N) + 0.05 * Math.sin(i * 0.7) + (i > 24 ? 0.06 : 0)); ra.push(0.34 - 0.06 * (i / N) + 0.05 * Math.cos(i * 0.5)); rb.push(0.24 + 0.04 * Math.sin(i * 0.9 + 1)); }
    const tot = you.map((v, i) => v + ra[i] + rb[i]), x = (i) => W - (i / (N - 1)) * W;
    const area = (lo, hi) => { let d = "M" + x(0) + " " + (H - hi[0] * H); for (let i = 1; i < N; i++) d += " L" + x(i).toFixed(1) + " " + (H - hi[i] * H).toFixed(1); for (let i = N - 1; i >= 0; i--) d += " L" + x(i).toFixed(1) + " " + (H - lo[i] * H).toFixed(1); return d + "Z"; };
    const s1 = you.map((v, i) => v / tot[i]), s2 = you.map((v, i) => (v + rb[i]) / tot[i]);
    $("#stream").innerHTML = [[you.map(() => 0), s1, "#E39B2D"], [s1, s2, "#8C3D5E"], [s2, you.map(() => 1), "#3D6B8C"]].map(([lo, hi, c]) => `<path d="${area(lo, hi)}" fill="${c}" stroke="#fff" stroke-width="2"/>`).join("");
    const axes = ["آلودگی هوا", "حمل‌ونقل", "مسکن", "اشتغال جوانان", "فضای سبز"], R = 120, ang = (k) => -Math.PI / 2 + (k * 2 * Math.PI) / 5;
    const poly = (v) => v.map((f, k) => (Math.cos(ang(k)) * R * f).toFixed(1) + "," + (Math.sin(ang(k)) * R * f).toFixed(1)).join(" ");
    let sp = [0.33, 0.66, 1].map((f) => `<polygon points="${poly([f, f, f, f, f])}" fill="none" stroke="#E7E2D7" stroke-width="1.5"/>`).join("");
    axes.forEach((a, k) => { sp += `<line x1="0" y1="0" x2="${Math.cos(ang(k)) * R}" y2="${Math.sin(ang(k)) * R}" stroke="#E7E2D7"/><text x="${Math.cos(ang(k)) * (R + 30)}" y="${Math.sin(ang(k)) * (R + 30) + 5}" text-anchor="middle" font-family="Vazirmatn" font-size="13" font-weight="700">${a}</text>`; });
    sp += `<polygon points="${poly([0.4, 0.5, 0.88, 0.35, 0.3])}" fill="rgba(61,107,140,.18)" stroke="#3D6B8C" stroke-width="3"/><polygon points="${poly([0.3, 0.8, 0.4, 0.45, 0.25])}" fill="rgba(140,61,94,.15)" stroke="#8C3D5E" stroke-width="3"/><polygon points="${poly([0.92, 0.35, 0.3, 0.55, 0.7])}" fill="rgba(227,155,45,.25)" stroke="#E39B2D" stroke-width="4"/>`;
    $("#spider").innerHTML = sp;
    const B = [
      { t: "حمل‌ونقل شبانه", o: "بدون صاحب", imp: 61, l: 30, tp: 25, s: 170, gold: true },
      { t: "آلودگی هوا", o: "شما", imp: 78, l: 62, tp: 6, s: 140, c: "#E39B2D" },
      { t: "مسکن", o: "رقیب الف", imp: 70, l: 70, tp: 52, s: 120, c: "#3D6B8C" },
      { t: "ترافیک", o: "رقیب ب", imp: 55, l: 50, tp: 62, s: 100, c: "#8C3D5E" },
      { t: "فضای سبز", o: "کم‌اهمیت", imp: 24, l: 84, tp: 18, s: 80, c: "#EFECE5" },
      { t: "ورزش محله", o: "کم‌اهمیت", imp: 18, l: 86, tp: 70, s: 70, c: "#EFECE5" }
    ];
    $("#bubs").innerHTML = B.map((b, i) => `<button data-b="${i}" style="left:${b.l}%;top:${b.tp}%;width:${b.s}px;height:${b.s}px;margin-left:-${b.s / 2}px;${b.gold ? "border:3px dashed #E39B2D;background:#FFF8EC" : "background:" + b.c + ";color:" + (b.c === "#EFECE5" ? "#5C5F63" : "#fff")}">${b.t}<br/><span style="font-weight:500;font-size:12px">${b.o}</span></button>`).join("");
    const info = (b) => { $("#wsInfo").innerHTML = `<h3>${b.t} ${b.gold ? '<span class="tag acc">فرصت طلایی</span>' : ""}</h3><div class="kpi"><b>${fa(b.imp)}٪</b><span style="color:#B9B4A8">مردم این موضوع را مهم می‌دانند</span></div><div class="divider" style="background:#2C3034"></div>
      <p class="small" style="line-height:1.9">${b.gold ? "هیچ سیاستمداری در ۳۰ روز گذشته درباره‌ی این موضوع حرف نزده است. با جهت «مالکیت موضوع حمل‌ونقل شبانه» در قطب‌نمای شما هم‌راستاست." : "مالک فعلی: " + b.o + "."}</p>
      ${b.gold ? `<button class="btn acc" style="width:100%" id="wsGo">ساخت برنامه‌ی هفته ←</button>` : ""}`;
      const g = $("#wsGo"); if (g) g.onclick = () => { S.mission = "weekly"; go("missions"); }; };
    info(B[0]);
    $$("#bubs button").forEach((b) => (b.onclick = () => info(B[+b.dataset.b])));
  };

  VIEWS.influence = (el) => {
    el.innerHTML = `<div class="grid g-main"><div class="card" style="padding:0;overflow:hidden"><svg viewBox="0 0 800 560" id="net" style="width:100%;display:block"></svg></div>
      <div class="stack"><div class="card"><h3>آینه‌ی هوش مصنوعی</h3><select id="mq"><option>برنامه‌ی خانم رادمهر برای آلودگی هوا چیست؟</option><option>چه کسی طرح پایش هوای مدارس را پیشنهاد داد؟</option></select>
        <div class="stack" style="margin-top:12px">${D.mirror.map((m) => `<div class="mirror-a"><b class="small">${m.who}</b><p>${m.t}</p><span class="tag ${m.v === "ok" ? "ok" : m.v === "bad" ? "risk" : ""}" style="${m.v === "warn" ? "background:#FBF0DD;color:#9A6514" : ""}">${m.vl}</span></div>`).join("")}</div>
        <div class="grid g2" style="margin-top:12px"><div class="card flat kpi"><b style="color:var(--acc)">۶۸</b><span>امتیاز آینه · شما</span></div><div class="card flat kpi"><b style="color:var(--a)">۷۴</b><span>رقیب الف</span></div></div>
        <button class="btn primary" style="width:100%;margin-top:12px" id="fix">اصلاح منبع: انتشار صفحه‌ی رسمی برنامه</button></div></div></div>`;
    const r = rng(21), g = () => Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r());
    const C = [[220, 170, "#E39B2D", "معلم‌های منطقه ۶"], [580, 150, "#3D6B8C", "کانال محله‌ی نارمک"], [250, 420, "#1F7A6C", "انجمن اولیا"], [600, 420, "#8C3D5E", "خبرنگار شهری"]];
    let e = "", n = "", l = "";
    C.forEach(([cx, cy, c, t]) => { for (let i = 0; i < 18; i++) { const x = cx + g() * 70, y = cy + g() * 55; e += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(0)}" y2="${y.toFixed(0)}" stroke="#DAD5CA" stroke-width="1.5"/>`; n += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(4 + r() * 5).toFixed(1)}" fill="${c}"/>`; }
      n += `<circle cx="${cx}" cy="${cy}" r="18" fill="${c}" stroke="#fff" stroke-width="5"/>`; l += `<g><rect x="${cx - 75}" y="${cy - 52}" width="150" height="26" rx="8" fill="#fff" stroke="#DAD5CA"/><text x="${cx}" y="${cy - 34}" text-anchor="middle" font-family="Vazirmatn" font-size="13" font-weight="700">${t}</text></g>`; });
    [[0, 1], [0, 2], [1, 3], [2, 3]].forEach(([a, b]) => (e += `<line x1="${C[a][0]}" y1="${C[a][1]}" x2="${C[b][0]}" y2="${C[b][1]}" stroke="#E39B2D" stroke-width="4" stroke-dasharray="2 0"/>`));
    $("#net").innerHTML = e + n + l + `<text x="20" y="540" font-family="Vazirmatn" font-size="13" fill="#5C5F63">خطوط نارنجی: پل‌های بین جامعه‌ها · بزرگ‌ترین گره‌ها: صدای واقعی هر جامعه</text>`;
    $("#fix").onclick = () => toast("پیش‌نویس صفحه‌ی رسمی در استودیو ساخته شد");
  };

  VIEWS.approvals = (el) => {
    const L = D.checksLabels;
    el.innerHTML = `<div class="grid g-main"><div class="stack">${S.approvals.map((a) => `
      <div class="q-item fade-in"><div><div class="row wrap"><b>${a.t}</b><span class="tag">${a.fmt}</span>${a.status === "published" ? '<span class="tag solid-ok">منتشر شد</span>' : a.status === "blocked" ? '<span class="tag solid-risk">متوقف شد</span>' : `<span class="tag acc">${a.stage}</span>`}</div>
        <div class="grid g2" style="gap:0 16px;margin-top:8px">${L.map((x, i) => `<div class="check"><i class="${a.checks[i] ? "y" : "n"}">${a.checks[i] ? "✓" : "✗"}</i>${x}</div>`).join("")}</div>
        ${a.note ? `<div class="tag risk" style="display:block;padding:8px 10px;margin-top:8px;line-height:1.7;white-space:normal">عامل یکپارچگی: ${a.note}</div>` : ""}</div>
        <div class="stack">${a.status === "pending" ? `<button class="btn ok" data-ap="${a.id}">تأیید و انتشار</button><button class="btn sm" data-back="${a.id}">برگشت برای اصلاح</button>` : a.status === "blocked" ? `<button class="btn sm" data-fixit="${a.id}">ارسال برای اصلاح</button>` : '<span class="tiny muted">از حساب رسمی</span>'}</div></div>`).join("")}</div>
      <div class="stack"><div class="card"><h3>دفتر ممیزی <small>چه کسی، چه چیزی را تأیید کرد</small></h3><ul class="clean log">${S.log.slice(0, 9).map((g) => `<li><b>${g[0]}</b><span><strong>${g[1]}</strong> · ${g[2]}</span></li>`).join("")}</ul></div>
        <div class="card dark small" style="line-height:1.9"><h3>اصول یکپارچگی</h3>نه حساب جعلی · نه ربات · نه جعل عمیق<br/>هر عدد، منبع رسمی دارد<br/>همه‌چیز برچسب‌دار و قابل ردیابی است<br/>انتشار فقط از حساب‌های رسمی شما</div></div></div>`;
    $$("[data-ap]", el).forEach((b) => (b.onclick = () => { const a = S.approvals.find((x) => String(x.id) === b.dataset.ap); a.status = "published"; addLog(D.user.short, "«" + a.t + "» تأیید و منتشر شد"); persist(); toast("منتشر شد · برچسب و امضای اصالت اضافه شد"); route(); }));
    $$("[data-back],[data-fixit]", el).forEach((b) => (b.onclick = () => { toast("برای اصلاح به تیم رسانه برگشت"); addLog("مدیر ارتباطات", "یک پیش‌نویس برای اصلاح برگشت"); route(); }));
  };

  VIEWS.reports = (el) => {
    const sg = S.suggestions;
    el.innerHTML = `<div class="grid g4" style="margin-bottom:16px">${[["−۶۴٪", "سرعت انتشار شایعه پس از پاسخ", "ok"], ["+۱۸٪", "اعتماد در بخش والدین", "ok"], ["۱٫۲ میلیون", "بازدید محتوای این هفته", ""], ["۲ ساعت", "میانگین زمان پاسخ", "acc"]].map((k) => `<div class="card kpi"><b style="color:${k[2] ? "var(--" + k[2] + ")" : "inherit"}">${k[0]}</b><span>${k[1]}</span></div>`).join("")}</div>
      <div class="grid g-main"><div class="card"><h3>منحنی شایعه‌ی تعطیلی مدارس <small>قبل و بعد از پاسخ ساعت ۱۸</small></h3><svg viewBox="0 0 700 240" id="curve" style="width:100%"></svg></div>
        <div class="stack"><div class="card"><h3>درس‌های این هفته <small>به پلی‌بوک اضافه شد</small></h3><ul class="clean small" style="line-height:2.1">
          <li>✓ «روال ثابت» بهتر از «تکذیب» شایعه را خاموش می‌کند (۳ بار از ۳ بار)</li><li>✓ قلاب‌های شخصی («من هم مادرم») در والدین ۲٫۳ برابر بهتر عمل کردند</li><li>✓ پست‌های ساعت ۱۸ تا ۱۹ بیشترین دسترسی را داشتند</li></ul></div>
          <div class="card"><h3>پیشنهاد برای قطب‌نما</h3><div class="stack">
            ${sg.night === null ? `<div class="suggest"><p>«حمل‌ونقل شبانه» در حال رشد است و با جهت سوم شما می‌خواند. به تمرکزها اضافه شود؟</p><button class="btn sm ok" data-sg="night:1">افزودن</button><button class="btn sm" data-sg="night:0">نه</button></div>` : `<div class="small muted">«حمل‌ونقل شبانه»: ${sg.night ? "به قطب‌نما اضافه شد ✓" : "رد شد"}</div>`}
            ${sg.aqi === null ? `<div class="suggest"><p>کانال «پزشکان هوای پاک» منبع معتبری برای موضوع آلودگی است. به منابع اضافه شود؟</p><button class="btn sm ok" data-sg="aqi:1">افزودن</button><button class="btn sm" data-sg="aqi:0">نه</button></div>` : `<div class="small muted">کانال «پزشکان هوای پاک»: ${sg.aqi ? "به منابع اضافه شد ✓" : "رد شد"}</div>`}</div></div></div></div>`;
    let pts = "", pts2 = "";
    for (let i = 0; i <= 48; i++) { const xx = (i / 48) * 700, base = i < 20 ? 30 + i * i * 0.45 : 0; const y1 = i < 20 ? base : 210 - (i - 20) * 2 + Math.sin(i) * 6, y2 = i < 20 ? base : 210 * Math.exp(-(i - 20) / 9) + 18; pts += `${xx.toFixed(0)},${(235 - Math.min(225, y1 * 0.95)).toFixed(0)} `; pts2 += `${xx.toFixed(0)},${(235 - Math.min(225, y2 * 0.95)).toFixed(0)} `; }
    $("#curve").innerHTML = `<polyline points="${pts}" fill="none" stroke="#B9B4A8" stroke-width="3" stroke-dasharray="6 6"/><polyline points="${pts2}" fill="none" stroke="#E39B2D" stroke-width="4"/><line x1="292" y1="0" x2="292" y2="240" stroke="#1F7A6C" stroke-width="2" stroke-dasharray="4 4"/>
      <text x="300" y="20" font-family="Vazirmatn" font-size="13" font-weight="700" fill="#1F7A6C">پاسخ ساعت ۱۸</text><text x="560" y="40" font-family="Vazirmatn" font-size="12" fill="#5C5F63">پیش‌بینی بدون پاسخ</text><text x="560" y="215" font-family="Vazirmatn" font-size="12" font-weight="700" fill="#9A6514">واقعی</text>`;
    $$("[data-sg]", el).forEach((b) => (b.onclick = () => { const [k, v] = b.dataset.sg.split(":"); S.suggestions[k] = v === "1";
      if (k === "night" && v === "1" && !S.compass.topics.some((t) => t.id === "night")) S.compass.topics.push({ id: "night", name: "حمل‌ونقل شبانه", stars: 2, on: true });
      if (k === "aqi" && v === "1") S.compass.sources.push({ n: "پزشکان هوای پاک", trust: "بالا", on: true });
      addLog("عامل یادگیری", "پیشنهاد قطب‌نما " + (v === "1" ? "پذیرفته شد" : "رد شد")); persist(); route(); }));
  };

  VIEWS.compass = (el) => {
    const C = S.compass;
    const tabs = [["topics", "موضوع‌های تمرکز", C.topics.filter((t) => t.on).length], ["goals", "جهت‌ها", C.goals.length], ["red", "خط قرمزها", C.red.length], ["watch", "فهرست پایش", C.rivals.length + C.journalists.length + C.channels.length],
      ["sources", "منابع", C.sources.filter((s) => s.on).length], ["tone", "لحن (Voice DNA)", ""], ["alerts", "هشدارها", C.alerts.filter((a) => a.on).length], ["team", "تیم و تأیید", C.team.length]];
    const crawl = 120 + C.topics.filter((t) => t.on).reduce((s, t) => s + t.stars * 60, 0) + C.channels.length * 20;
    el.innerHTML = `<div class="grid" style="grid-template-columns:260px 1fr 300px">
      <div class="card flat" style="padding:10px"><div class="c-tabs">${tabs.map((t) => `<button class="c-tab ${S.compassTab === t[0] ? "on" : ""}" data-ct="${t[0]}">${t[1]}<small>${t[2] !== "" ? fa(t[2]) : ""}</small></button>`).join("")}</div></div>
      <div class="card" id="cBody"></div>
      <div class="stack"><div class="card dark"><h3>قطب‌نما چه چیزی را هدایت می‌کند</h3><div class="stack small" style="line-height:1.9">
        <div>🕸 <b>خزنده‌ها</b>: ${fa(crawl)} منبع با اولویت بر اساس ستاره‌ها</div><div>📡 <b>رادار</b>: رتبه‌بندی روایت‌ها بر اساس تمرکزها</div><div>🧠 <b>عامل‌ها</b>: هر گزینه با جهت‌ها امتیاز می‌گیرد</div><div>✍️ <b>استودیو</b>: لحن شما و خط قرمزها در هر پیش‌نویس</div><div>🔔 <b>هشدارها</b>: فقط آنچه برای شما مهم است</div></div></div>
        <div class="card"><h3>پیشنهاد عامل‌ها <small>گسترش خودکار</small></h3><div class="small muted" style="margin-bottom:8px">کلیدواژه‌ها و موجودیت‌هایی که عامل‌ها از تمرکزهای شما استخراج کرده‌اند. روشن یا خاموش کنید:</div>
          <div class="row wrap">${C.expand.map((x, i) => `<button class="chip sug ${x.on ? "on" : ""}" data-ex="${i}">${x.on ? "✓ " : "+ "}${x.t}</button>`).join("")}</div></div></div></div>`;
    const body = $("#cBody");
    const T = {
      topics: () => `<h3>موضوع‌های تمرکز <small>اولویت با ستاره</small></h3><div class="stack">${C.topics.map((t, i) => `<div class="topic"><button class="toggle ${t.on ? "on" : ""}" data-tt="${i}"></button><span class="name">${t.name}</span>
        <span class="stars">${[1, 2, 3].map((s) => `<button class="${s <= t.stars ? "on" : ""}" data-st="${i}:${s}">★</button>`).join("")}</span><button class="btn sm ghost" data-rm="${i}">حذف</button></div>`).join("")}
        <form class="row" id="addT"><input type="text" id="newT" placeholder="موضوع تازه، مثلاً «ایمنی مسیر مدرسه»" /><button class="btn primary">افزودن</button></form></div>`,
      goals: () => `<h3>جهت‌ها <small>جایگاهی که می‌خواهید در ذهن مردم داشته باشید</small></h3><div class="stack">${C.goals.map((g, i) => `<div class="goal"><b>${fa(i + 1)}. ${g.t}</b><span class="small muted">${g.d}</span></div>`).join("")}
        <form class="stack" id="addG"><input type="text" id="gT" placeholder="جهت تازه، مثلاً «صدای رانندگان تاکسی در شورا»" /><input type="text" id="gD" placeholder="توضیح کوتاه برای عامل‌ها" /><button class="btn primary">افزودن جهت</button></form>
        <div class="steer"><div><b>۹۲٪</b>هم‌راستایی گزینه‌ی «روال شفاف»</div><div><b>۳</b>فرصت هم‌راستا این هفته</div></div></div>`,
      red: () => `<h3>خط قرمزها <small>عامل یکپارچگی هر پیش‌نویس را با این‌ها می‌سنجد</small></h3><div class="row wrap">${C.red.map((r, i) => `<span class="chip red">${r}<button data-rr="${i}">×</button></span>`).join("")}</div>
        <form class="row" id="addR" style="margin-top:14px"><input type="text" id="newR" placeholder="خط قرمز تازه" /><button class="btn primary">افزودن</button></form>
        <div class="goal" style="margin-top:14px"><b>نمونه‌ی اجرا</b><span class="small muted">رشته‌توییت «پاسخ به رقیب الف درباره‌ی مسکن» به دلیل نزدیکی به «حمله‌ی شخصی» و «عدد تأییدنشده» متوقف شد.</span></div>`,
      watch: () => `<h3>فهرست پایش</h3>${[["رقبا", C.rivals, "rivals"], ["خبرنگاران و رسانه‌ها", C.journalists, "journalists"], ["کانال‌ها و جامعه‌ها", C.channels, "channels"]].map(([h, arr, k]) => `<div class="tiny muted" style="margin:12px 0 6px">${h}</div><div class="row wrap">${arr.map((x, i) => `<span class="chip">${x}<button data-wr="${k}:${i}">×</button></span>`).join("")}</div>`).join("")}
        <form class="row" id="addW" style="margin-top:14px"><select id="wK" style="width:170px"><option value="rivals">رقیب</option><option value="journalists">خبرنگار</option><option value="channels">کانال</option></select><input type="text" id="wV" placeholder="نام یا شناسه" /><button class="btn primary">افزودن</button></form>`,
      sources: () => `<h3>منابع <small>سطح اعتماد برای راستی‌آزمایی</small></h3><div class="stack">${C.sources.map((s, i) => `<div class="topic"><button class="toggle ${s.on ? "on" : ""}" data-so="${i}"></button><span class="name">${s.n}</span><span class="tag ${s.trust === "رسمی" ? "ok" : s.trust === "حذف" ? "risk" : ""}">${s.trust}</span></div>`).join("")}</div>`,
      tone: () => `<h3>لحن شما <small>از ۲۰ سخنرانی و ۲۰۰ پست یاد گرفته شده</small></h3>
        ${[["formal", "رسمی", "صمیمی"], ["data", "قصه‌محور", "داده‌محور"], ["energy", "آرام", "پرانرژی"]].map(([k, a, b]) => `<div class="slider-row"><span>${a}</span><input type="range" min="0" max="100" value="${C.tone[k]}" data-tn="${k}" /><span style="text-align:left">${b}</span></div>`).join("")}
        <div class="goal"><b>پیش‌نمایش جمله با این لحن</b><span id="toneP" class="small"></span></div><button class="btn" style="margin-top:12px">بارگذاری سخنرانی یا پست تازه</button>`,
      alerts: () => `<h3>هشدارها <small>از طریق بله، تلگرام، پیامک و اپ</small></h3><div class="stack">${C.alerts.map((a, i) => `<div class="topic"><button class="toggle ${a.on ? "on" : ""}" data-al="${i}"></button><span class="name">${a.t}</span></div>`).join("")}</div>`,
      team: () => `<h3>تیم و زنجیره‌ی تأیید</h3><div class="stack">${C.team.map((t, i) => `<div class="topic"><span class="tag acc">${fa(i + 1)}</span><span class="name">${t.r}</span><span class="small muted">${t.n}</span></div>`).join("")}</div>`
    };
    body.innerHTML = T[S.compassTab]();
    const re = () => { persist(); route(); };
    $$("[data-ct]", el).forEach((b) => (b.onclick = () => { S.compassTab = b.dataset.ct; route(); }));
    $$("[data-ex]", el).forEach((b) => (b.onclick = () => { const x = C.expand[+b.dataset.ex]; x.on = !x.on; re(); }));
    $$("[data-tt]", el).forEach((b) => (b.onclick = () => { const t = C.topics[+b.dataset.tt]; t.on = !t.on; addLog(D.user.short, "تمرکز «" + t.name + "» " + (t.on ? "فعال" : "غیرفعال") + " شد"); re(); }));
    $$("[data-st]", el).forEach((b) => (b.onclick = () => { const [i, s] = b.dataset.st.split(":"); C.topics[+i].stars = +s; re(); }));
    $$("[data-rm]", el).forEach((b) => (b.onclick = () => { C.topics.splice(+b.dataset.rm, 1); re(); }));
    $$("[data-rr]", el).forEach((b) => (b.onclick = () => { C.red.splice(+b.dataset.rr, 1); re(); }));
    $$("[data-wr]", el).forEach((b) => (b.onclick = () => { const [k, i] = b.dataset.wr.split(":"); C[k].splice(+i, 1); re(); }));
    $$("[data-so]", el).forEach((b) => (b.onclick = () => { const s = C.sources[+b.dataset.so]; s.on = !s.on; re(); }));
    $$("[data-al]", el).forEach((b) => (b.onclick = () => { const a = C.alerts[+b.dataset.al]; a.on = !a.on; re(); }));
    const f = (id, fn) => { const x = $(id); if (x) x.onsubmit = (e) => { e.preventDefault(); fn(); }; };
    f("#addT", () => { const v = $("#newT").value.trim(); if (v) { C.topics.push({ id: "t" + Date.now(), name: v, stars: 2, on: true }); addLog(D.user.short, "تمرکز تازه: «" + v + "»"); toast("عامل‌ها از امشب این موضوع را هم پایش می‌کنند"); re(); } });
    f("#addG", () => { const t = $("#gT").value.trim(); if (t) { C.goals.push({ t, d: $("#gD").value.trim() || "—" }); addLog(D.user.short, "جهت تازه: «" + t + "»"); re(); } });
    f("#addR", () => { const v = $("#newR").value.trim(); if (v) { C.red.push(v); re(); } });
    f("#addW", () => { const v = $("#wV").value.trim(); if (v) { C[$("#wK").value].push(v); re(); } });
    const toneP = () => { const p = $("#toneP"); if (!p) return; const fm = C.tone.formal, dt = C.tone.data;
      p.textContent = (fm < 45 ? "می‌دانم نگرانید؛ من هم مادرم. " : "با توجه به نگرانی خانواده‌ها، ") + (dt > 55 ? "شاخص هوای امروز ۱۶۸ است و تصمیم فردا ساعت ۱۸ اعلام می‌شود." : "قول می‌دهم هر روز ساعت ۱۸، تصمیم فردا را خودم به شما بگویم."); };
    toneP();
    $$("[data-tn]", el).forEach((r) => (r.oninput = () => { C.tone[r.dataset.tn] = +r.value; toneP(); persist(); }));
  };

  /* ---------- ask ravi ---------- */
  function openAsk(q) { $("#drawer").classList.add("open"); $("#scrim").classList.add("open"); if (q) ask(q); else setTimeout(() => $("#askIn").focus(), 200); }
  function closeAsk() { $("#drawer").classList.remove("open"); $("#scrim").classList.remove("open"); }
  async function ask(q) {
    const chat = $("#chat");
    chat.insertAdjacentHTML("beforeend", `<div class="me">${esc(q)}</div>`);
    const ty = document.createElement("div"); ty.className = "ai"; ty.innerHTML = '<div class="typing"><i></i><i></i><i></i></div>'; chat.appendChild(ty); chat.scrollTop = 1e6;
    await sleep(900);
    const hit = D.ask.find((a) => a.k.some((k) => q.includes(k))) || { a: "در این نسخه‌ی نمایشی، پاسخ‌ها از پیش نوشته شده‌اند. در نسخه‌ی کامل، راوی با جست‌وجو در همه‌ی داده‌ها و در جهت قطب‌نمای شما پاسخ می‌دهد.", src: ["نسخه‌ی نمایشی"] };
    ty.innerHTML = ""; const p = document.createElement("div"); ty.appendChild(p);
    for (let i = 0; i <= hit.a.length; i += 3) { p.textContent = hit.a.slice(0, i); chat.scrollTop = 1e6; await sleep(12); }
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
