/* Five Seals — site interactions. Vanilla JS, no dependencies. */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const shot = (name, w) => `assets/img/shots/${name}-${w}.webp`;
  const srcset = (name) => `${shot(name, 480)} 480w, ${shot(name, 960)} 960w, ${shot(name, 1600)} 1600w`;

  /* ------------------------------------------------------------------ loader */
  const body = document.body;
  const loader = $(".loader");
  let loaded = false;
  const finishLoad = () => {
    if (loaded) return;
    loaded = true;
    loader && loader.classList.add("done");
    body.classList.remove("is-loading");
    // hero content reveals as the sigil fades
    $$(".hero .reveal").forEach((el) => el.classList.add("in"));
  };
  window.addEventListener("load", () => setTimeout(finishLoad, reduce ? 0 : 900));
  setTimeout(finishLoad, 3200); // never hold the page hostage

  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(Math.max(2026, new Date().getFullYear()));

  /* ------------------------------------------------------------------ nav */
  const nav = $("#nav");
  const toggle = $("#navToggle");
  const links = $("#navLinks");
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 40);
    const goingDown = y > lastY && y > 600;
    if (!document.documentElement.classList.contains("nav-open")) nav.classList.toggle("hidden", goingDown);
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    document.documentElement.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
  };
  toggle.addEventListener("click", () => setMenu(!document.documentElement.classList.contains("nav-open")));
  links.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  // active section highlight
  const navMap = new Map($$(".nav__links a[href^='#']").map((a) => [a.getAttribute("href").slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navMap.forEach((a) => a.classList.remove("active"));
      const a = navMap.get(en.target.id);
      a && a.classList.add("active");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  navMap.forEach((_, id) => { const s = document.getElementById(id); s && spy.observe(s); });

  /* ------------------------------------------------------------------ reveal on scroll */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); revealIO.unobserve(en.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  $$(".reveal, .reveal-img").forEach((el) => { if (!el.closest(".hero")) revealIO.observe(el); });

  /* ------------------------------------------------------------------ hero parallax */
  const heroBg = $(".hero__bg");
  const hero = $(".hero");
  let mx = 0, my = 0, tx = 0, ty = 0, heroVisible = true;
  if (!reduce && heroBg) {
    new IntersectionObserver(([en]) => { heroVisible = en.isIntersecting; }).observe(hero);
    window.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      mx = (e.clientX / window.innerWidth - 0.5);
      my = (e.clientY / window.innerHeight - 0.5);
    }, { passive: true });
    const tick = () => {
      if (heroVisible) {
        tx += (mx - tx) * 0.05;
        ty += (my - ty) * 0.05;
        const sy = window.scrollY * 0.25;
        heroBg.style.transform = `translate3d(${(-tx * 18).toFixed(2)}px, ${(sy - ty * 12).toFixed(2)}px, 0) scale(1.02)`;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------------ hero fx: embers, motes, lightning */
  const canvas = $("#heroFx");
  const flash = $("#heroFlash");
  if (canvas && !reduce) {
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, dpr = 1;
    const parts = [];
    const bolts = [];
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const count = () => Math.round(Math.min(90, (W * H) / 16000));
    const spawn = (initial) => {
      const gold = Math.random() < 0.55;
      parts.push({
        x: Math.random() * W,
        y: initial ? Math.random() * H : H + 10,
        r: Math.random() * 1.8 + 0.4,
        vy: -(Math.random() * 0.45 + 0.15),
        vx: (Math.random() - 0.5) * 0.25,
        a: Math.random() * 0.6 + 0.25,
        w: Math.random() * Math.PI * 2,
        c: gold ? "255,214,140" : "176,140,255",
      });
    };
    for (let i = 0; i < count(); i++) spawn(true);

    const makeBolt = () => {
      // jagged bolt from the sky over the castle side of the art
      const x0 = W * (0.12 + Math.random() * 0.4);
      const pts = [[x0, -10]];
      let x = x0, y = -10;
      const end = H * (0.35 + Math.random() * 0.3);
      while (y < end) {
        y += 14 + Math.random() * 26;
        x += (Math.random() - 0.5) * 46;
        pts.push([x, y]);
      }
      const branch = [];
      const bi = 2 + Math.floor(Math.random() * Math.max(1, pts.length - 3));
      let bx = pts[bi][0], by = pts[bi][1];
      branch.push([bx, by]);
      for (let k = 0; k < 5; k++) { by += 12 + Math.random() * 18; bx += (Math.random() < 0.5 ? -1 : 1) * (8 + Math.random() * 22); branch.push([bx, by]); }
      bolts.push({ pts, branch, life: 1 });
      if (flash) {
        flash.style.transition = "none";
        flash.style.opacity = "0.9";
        requestAnimationFrame(() => {
          flash.style.transition = "opacity 1.1s cubic-bezier(.2,.7,.1,1)";
          flash.style.opacity = "0";
        });
      }
    };
    let nextBolt = performance.now() + 2600;

    const strokePath = (pts, width, alpha) => {
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.lineWidth = width;
      ctx.strokeStyle = `rgba(214,236,255,${alpha})`;
      ctx.stroke();
    };

    let running = true;
    new IntersectionObserver(([en]) => { running = en.isIntersecting; if (running) requestAnimationFrame(loop); }).observe(hero);
    document.addEventListener("visibilitychange", () => { if (!document.hidden && running) requestAnimationFrame(loop); });

    function loop(now) {
      if (!running || document.hidden) return;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      while (parts.length < count()) spawn(false);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.w += 0.02;
        p.x += p.vx + Math.sin(p.w) * 0.25;
        p.y += p.vy;
        if (p.y < -12) { parts.splice(i, 1); continue; }
        const fade = Math.min(1, p.y / (H * 0.25));
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        g.addColorStop(0, `rgba(${p.c},${p.a * fade})`);
        g.addColorStop(1, `rgba(${p.c},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fill();
      }
      if (now > nextBolt) { makeBolt(); nextBolt = now + 5200 + Math.random() * 6000; }
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i];
        const a = b.life * b.life;
        ctx.shadowColor = "rgba(160,200,255,.9)";
        ctx.shadowBlur = 24;
        strokePath(b.pts, 6, a * 0.25);
        strokePath(b.pts, 1.8, a);
        strokePath(b.branch, 1, a * 0.7);
        ctx.shadowBlur = 0;
        b.life -= 0.045;
        if (b.life <= 0) bolts.splice(i, 1);
      }
      ctx.globalCompositeOperation = "source-over";
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  /* ------------------------------------------------------------------ the five seals */
  const ZONES = [
    {
      n: "I", color: "var(--z1)", region: "Kızıl Katedral", subtitle: "Kyrena'nın Mezarlığı",
      desc: "Taryan'ın vaftiz edildiği katedral artık çatısız bir mezar. Yıkık nef, çan kulesi tırmanışı, pusu salonu ve alev jetleriyle kaplı vitray geçidi.",
      boss: "Kyrena", bossTitle: "Kızıl Serafim", seal: "Kan Mührü", power: "Çifte Sıçrayış",
      quote: "Gel, yıldırım. Son bir kez yanıma gel.", cite: "Kyrena",
      shots: [["kyrena-sigil", "Kyrena'nın kızıl mührü"], ["cathedral-nave", "Yıkık nef"], ["cathedral-tower", "Çan kulesi"]],
    },
    {
      n: "II", color: "var(--z2)", region: "Donmuş Geçit", subtitle: "Frostelle'nin Soğuk Hesabı",
      desc: "Zamanın bile donduğu bir geçit. Çift zıplama isteyen yarıklar, düşen sarkıtların mağarası, tipide pusu ve buzdan bir kule.",
      boss: "Frostelle", bossTitle: "Buz Büyücüsü", seal: "Buz Mührü", power: "Fırtına Kalkanı · parry",
      quote: "Sayılar yalan söylemez. Mühür seni içeriden yiyordu.", cite: "Frostelle",
      shots: [["frostelle-lotus", "Frostelle'nin buz lotusu"], ["frozen-snowfield", "Kar alanı"], ["frozen-ambush", "Tipi pususu"]],
    },
    {
      n: "III", color: "var(--z3)", region: "Kutsal Sığınak", subtitle: "Sariel'in Kapalı Kapıları",
      desc: "Bir sığınak mı, bir hapishane mi? Dış avlu, yaldızlı koridorlar, iki katlı hücre blokları ve derin bir asansör kuyusu.",
      boss: "Sariel", bossTitle: "Sığınak Serafimi", seal: "Sığınak Mührü", power: "Altın Devre · iyileşme",
      quote: "Kapıları ben kilitlemedim. İçerideki herkes kalmayı seçti.", cite: "Sariel",
      shots: [["sariel-beams", "Sariel'in ışık sütunları"], ["sanctuary-courtyard", "Dış avlu"], ["sanctuary-cells", "Hücre blokları"]],
    },
    {
      n: "IV", color: "var(--z4)", region: "Fildişi Güneş Tapınağı", subtitle: "Aurelie'nin Yakıcı Şafağı",
      desc: "Taşların bile ısındığı bir çöl. Çöken köprüler, dikilitaş bahçesi, piramit tırmanışı ve güneş kapısının ardında bekleyen kıyamet.",
      boss: "Aurelie", bossTitle: "Güneş Rahibesi", seal: "Güneş Mührü", power: "Rezonans Teoremi · nihai",
      quote: "Işık dönüyor, Taryan. Işık seni de yakacak.", cite: "Aurelie",
      shots: [["aurelie-sunbeam", "Aurelie'nin güneş ışını"], ["sun-pyramid", "Piramit tırmanışı"], ["sun-ambush", "Avlu pususu"]],
    },
    {
      n: "V", color: "var(--z5)", region: "Mühürlü Kule", subtitle: "Vorthin'in Son Sınavı",
      desc: "Her şeyin başladığı yer. Yüzen kırıklar, obsidyen salonlar ve nefes alan duvarlar. Hocan seni zirvede bekliyor.",
      boss: "Vorthin", bossTitle: "Baş Büyücü", seal: "Hiçlik Mührü", power: "Final seçimi",
      quote: "Geldin. Dokuz yıl... Her şeyi tarttım, Taryan.", cite: "Vorthin",
      shots: [["vorthin-void", "Vorthin'in kara deliği"], ["tower-void", "Hiçliğin salonları"], ["tower-ambush", "Kule pususu"]],
    },
  ];

  const sealsSec = $(".seals");
  const stage = $("#seals");
  const screen = $("#sealScreen");
  const thumbs = $("#sealThumbs");
  const ringBtns = $$("#sealRing .seal-btn");
  const textBox = $("#sealText");
  const numeral = $("#sealNumeral");
  const DUR = 8000;
  let cur = -1, sub = 0, timer = null, inView = false, hovering = false;

  // build one <img> per zone shot, stacked and cross-faded
  const imgEls = ZONES.map((z, zi) => z.shots.map(([name, alt], si) => {
    const im = new Image();
    im.decoding = "async";
    im.loading = zi === 0 && si === 0 ? "eager" : "lazy";
    im.sizes = "(max-width: 960px) 92vw, 60vw";
    im.srcset = srcset(name);
    im.src = shot(name, 960);
    im.alt = `${z.region}: ${alt}`;
    im.width = 1600; im.height = 900;
    screen.insertBefore(im, numeral);
    return im;
  }));

  const showShot = (zi, si) => {
    imgEls.flat().forEach((im) => im.classList.remove("on"));
    const im = imgEls[zi][si];
    im.loading = "eager";
    im.classList.add("on");
    sub = si;
    $$("button", thumbs).forEach((b, i) => b.classList.toggle("on", i === si));
  };

  const fill = (z) => {
    $("#sealKicker").textContent = `${z.n} · Bölge`;
    $("#sealRegion").textContent = z.region;
    $("#sealSubtitle").textContent = z.subtitle;
    $("#sealDesc").textContent = z.desc;
    $("#sealBoss").innerHTML = `${z.boss} <span style="color:var(--ink-mute);font-weight:400">— ${z.bossTitle}</span>`;
    $("#sealPower").innerHTML = `${z.seal} · <b>${z.power}</b>`;
    $("#sealQuote").textContent = `“${z.quote}”`;
    $("#sealCite").textContent = `— ${z.cite}`;
    numeral.textContent = z.n;
    thumbs.innerHTML = "";
    z.shots.forEach(([name, alt], i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", alt);
      b.innerHTML = `<img src="${shot(name, 480)}" alt="" loading="lazy" decoding="async" width="480" height="270">`;
      b.addEventListener("click", () => { showShot(cur, i); restart(); });
      thumbs.appendChild(b);
    });
  };

  const select = (i, user) => {
    if (i === cur) return;
    const first = cur === -1;
    cur = (i + ZONES.length) % ZONES.length;
    const z = ZONES[cur];
    sealsSec.style.setProperty("--accent", z.color);
    ringBtns.forEach((b, k) => {
      const on = k === cur;
      b.classList.toggle("on", on);
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
      // restart the progress bar animation
      const bar = $(".bar", b);
      bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = "";
    });
    if (first || reduce) {
      fill(z); showShot(cur, 0);
    } else {
      textBox.classList.add("out"); numeral.classList.add("out");
      setTimeout(() => { fill(z); showShot(cur, 0); textBox.classList.remove("out"); numeral.classList.remove("out"); }, 300);
    }
    if (user) restart();
  };

  const stop = () => { clearInterval(timer); timer = null; };
  const restart = () => {
    stop();
    const playing = inView && !hovering && !reduce;
    sealsSec.classList.toggle("paused", !playing);
    if (playing) timer = setInterval(() => select(cur + 1), DUR);
  };
  sealsSec.style.setProperty("--dur", `${DUR}ms`);

  ringBtns.forEach((b, k) => {
    b.addEventListener("click", () => select(k, true));
    b.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const n = (cur + (e.key === "ArrowRight" ? 1 : -1) + ZONES.length) % ZONES.length;
        select(n, true);
        ringBtns[n].focus();
      }
    });
  });
  [stage, $("#sealRing")].forEach((el) => {
    el.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hovering = true; restart(); } });
    el.addEventListener("pointerleave", () => { hovering = false; restart(); });
  });
  // swipe on the screen to change region
  let sx = null;
  screen.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
  screen.addEventListener("touchend", (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) select(cur + (dx < 0 ? 1 : -1), true);
    sx = null;
  });
  new IntersectionObserver(([en]) => { inView = en.isIntersecting; restart(); }, { threshold: 0.35 }).observe(stage);
  select(0);

  /* ------------------------------------------------------------------ lightbox */
  const lb = $("#lightbox");
  const lbImg = $("#lbImg");
  const lbCap = $("#lbCap");
  const items = $$("[data-lb]");
  let li = 0, lastFocus = null;

  const lbShow = (i) => {
    li = (i + items.length) % items.length;
    const el = items[li];
    const name = el.dataset.lb;
    lbImg.src = shot(name, 1600);
    lbImg.srcset = srcset(name);
    lbImg.sizes = "(max-width: 1700px) 94vw, 1600px";
    lbImg.alt = (el.querySelector("img") || {}).alt || "";
    lbCap.textContent = el.dataset.caption || "";
  };
  const lbOpen = (i) => {
    lastFocus = document.activeElement;
    lb.hidden = false;
    lbShow(i);
    requestAnimationFrame(() => lb.classList.add("open"));
    document.documentElement.style.overflow = "hidden";
    $("#lbClose").focus();
  };
  const lbClose = () => {
    lb.classList.remove("open");
    document.documentElement.style.overflow = "";
    setTimeout(() => { lb.hidden = true; }, 450);
    lastFocus && lastFocus.focus();
  };
  items.forEach((el, i) => el.addEventListener("click", () => lbOpen(i)));
  $("#lbClose").addEventListener("click", lbClose);
  $("#lbPrev").addEventListener("click", () => lbShow(li - 1));
  $("#lbNext").addEventListener("click", () => lbShow(li + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) lbClose(); });
  window.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") lbClose();
    else if (e.key === "ArrowLeft") lbShow(li - 1);
    else if (e.key === "ArrowRight") lbShow(li + 1);
    else if (e.key === "Tab") {
      // keep focus inside the dialog
      const f = $$("button", lb);
      const idx = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(idx + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });
  let lsx = null;
  lb.addEventListener("touchstart", (e) => { lsx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (lsx === null) return;
    const dx = e.changedTouches[0].clientX - lsx;
    if (Math.abs(dx) > 50) lbShow(li + (dx < 0 ? 1 : -1));
    lsx = null;
  });

  /* ------------------------------------------------------------------ subtle 3D tilt on the phone mockup */
  const phone = $(".phone");
  if (phone && !reduce && window.matchMedia("(hover: hover) and (min-width: 961px)").matches) {
    phone.addEventListener("pointermove", (e) => {
      const r = phone.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      phone.style.transform = `perspective(1600px) rotateY(${(x * 10).toFixed(2)}deg) rotateX(${(-y * 8).toFixed(2)}deg)`;
    });
    phone.addEventListener("pointerleave", () => { phone.style.transform = ""; });
  }
})();
