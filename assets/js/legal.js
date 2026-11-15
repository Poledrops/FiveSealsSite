/* Five Seals — legal pages: nav, collapsible table of contents with scroll-spy, back-to-top. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(Math.max(2026, new Date().getFullYear()));

  /* nav: solid on scroll, hides while reading downward, mobile overlay menu */
  const nav = $("#nav");
  const toggle = $("#navToggle");
  const links = $("#navLinks");
  const backTop = $("#backTop");
  const root = document.documentElement;
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 40);
    if (!root.classList.contains("nav-open")) nav.classList.toggle("hidden", y > lastY && y > 600);
    backTop.classList.toggle("show", y > 900);
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    root.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
  };
  toggle.addEventListener("click", () => setMenu(!root.classList.contains("nav-open")));
  links.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* table of contents: open on desktop, collapsed on phones; closes after a pick on phones */
  const toc = $("#toc");
  const mq = window.matchMedia("(max-width: 960px)");
  const syncToc = () => { toc.open = !mq.matches; };
  syncToc();
  mq.addEventListener("change", syncToc);
  toc.addEventListener("click", (e) => { if (e.target.closest("a") && mq.matches) toc.open = false; });

  const tocLinks = new Map($$("a[href^='#']", toc).map((a) => [a.getAttribute("href").slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      tocLinks.forEach((a) => a.classList.remove("active"));
      const a = tocLinks.get(en.target.id);
      if (a) a.classList.add("active");
    });
  }, { rootMargin: "-20% 0px -70% 0px" });
  tocLinks.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
})();
