import { useState, useEffect, useRef } from "react";
import { FaInstagram, FaTiktok, FaYoutube, FaXTwitter } from "react-icons/fa6";

/* ─────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --black: #080808;
      --charcoal: #111111;
      --grey-dark: #1a1a1a;
      --grey-mid: #2a2a2a;
      --grey-light: #888888;
      --silver: #c0c0c0;
      --silver-light: #e8e8e8;
      --white: #f5f5f5;
      --font-display: 'Cormorant Garamond', serif;
      --font-body: 'DM Sans', sans-serif;
    }

    html { scroll-behavior: smooth; }
    body {
      background: var(--black);
      color: var(--white);
      font-family: var(--font-body);
      cursor: none;
      overflow-x: hidden;
    }
    ::selection { background: rgba(192,192,192,0.2); color: var(--white); }
    ::-webkit-scrollbar { width: 2px; }
    ::-webkit-scrollbar-track { background: var(--black); }
    ::-webkit-scrollbar-thumb { background: var(--silver); }

    /* ── Cursor ── */
    .cursor-dot {
      width: 6px; height: 6px; background: var(--silver);
      border-radius: 50%; position: fixed; pointer-events: none;
      z-index: 9999; transform: translate(-50%,-50%);
    }
    .cursor-ring {
      width: 32px; height: 32px;
      border: 1px solid rgba(192,192,192,0.45);
      border-radius: 50%; position: fixed; pointer-events: none;
      z-index: 9998; transform: translate(-50%,-50%);
      transition: width .3s, height .3s, border-color .3s;
    }
    .cursor-ring.hovered { width: 52px; height: 52px; border-color: var(--silver); }

    /* ── Loader ── */
    .loader {
      position: fixed; inset: 0; background: var(--black);
      z-index: 9000; display: flex; align-items: center;
      justify-content: center; flex-direction: column;
      transition: opacity .8s ease, visibility .8s ease;
    }
    .loader.hidden { opacity: 0; visibility: hidden; }
    .loader-logo {
      font-family: var(--font-display);
      font-size: clamp(64px,12vw,120px); font-weight: 300;
      letter-spacing: .3em; color: transparent;
      -webkit-text-stroke: 1px var(--silver);
      animation: logoReveal 1.6s cubic-bezier(.16,1,.3,1) forwards;
    }
    .loader-tagline {
      font-size: 11px; letter-spacing: .45em; text-transform: uppercase;
      color: var(--grey-light); margin-top: 16px;
      opacity: 0; animation: fadeIn 1s .9s ease forwards;
    }
    .loader-line {
      width: 0; height: 1px;
      background: linear-gradient(90deg, transparent, var(--silver), transparent);
      margin-top: 12px;
      animation: lineExpand 1.6s .4s cubic-bezier(.16,1,.3,1) forwards;
    }

    /* ── Keyframes ── */
    @keyframes logoReveal {
      from { opacity:0; letter-spacing:.8em; -webkit-text-stroke:1px transparent; }
      to   { opacity:1; letter-spacing:.3em; -webkit-text-stroke:1px var(--silver); }
    }
    @keyframes lineExpand { from { width:0 } to { width:200px } }
    @keyframes fadeUp     { from { opacity:0; transform:translateY(30px) } to { opacity:1; transform:translateY(0) } }
    @keyframes fadeIn     { from { opacity:0 } to { opacity:1 } }
    @keyframes scrollPulse {
      0%,100% { opacity:.3; transform:scaleY(1) }
      50%     { opacity:1;  transform:scaleY(1.1) }
    }

    /* ── Nav ── */
    nav {
      position: fixed; top:0; left:0; right:0; z-index:100;
      padding: 28px 60px;
      display: flex; align-items: center; justify-content: space-between;
      transition: all .4s ease;
    }
    nav.scrolled {
      padding: 18px 60px;
      background: rgba(8,8,8,.92);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(192,192,192,.06);
    }
    .nav-logo {
      font-family: var(--font-display); font-size: 28px;
      font-weight: 300; letter-spacing: .25em;
      color: var(--white); text-decoration: none;
    }
    .nav-links { display: flex; gap: 40px; list-style: none; }
    .nav-links a {
      font-size: 12px; letter-spacing: .2em; text-transform: uppercase;
      color: var(--grey-light); text-decoration: none; transition: color .3s;
    }
    .nav-links a:hover { color: var(--white); }

    /* ── Hero ── */
    .hero {
      height: 100vh; min-height: 700px;
      display: flex; align-items: center; justify-content: center;
      position: relative; overflow: hidden;
    }
    .hero-bg {
      position: absolute; inset: 0;
      background:
        radial-gradient(ellipse 80% 60% at 50% 40%, rgba(70,70,70,.15) 0%, transparent 60%),
        radial-gradient(ellipse 40% 40% at 80% 20%, rgba(192,192,192,.04) 0%, transparent 50%),
        linear-gradient(180deg, #080808 0%, #0d0d0d 50%, #080808 100%);
    }
    .hero-grid {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px);
      background-size: 80px 80px;
      mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
    }
    .hero-content { text-align: center; position: relative; z-index: 2; padding: 0 20px; }
    .hero-eyebrow {
      font-size: 11px; letter-spacing: .4em; text-transform: uppercase;
      color: var(--grey-light); margin-bottom: 32px;
      opacity: 0; animation: fadeUp 1s .2s ease forwards;
    }
    .hero-title {
      font-family: var(--font-display);
      font-size: clamp(52px,9vw,110px); font-weight: 300;
      line-height: .95; color: var(--white); margin-bottom: 28px;
      opacity: 0; animation: fadeUp 1s .5s ease forwards;
    }
    .hero-title em {
      font-style: italic; color: transparent;
      -webkit-text-stroke: 1px rgba(192,192,192,.6);
    }
    .hero-sub {
      font-size: clamp(14px,1.5vw,17px); font-weight: 300;
      color: var(--grey-light); letter-spacing: .08em; margin-bottom: 52px;
      opacity: 0; animation: fadeUp 1s .8s ease forwards;
    }
    .btn-primary {
      display: inline-flex; align-items: center; gap: 12px;
      padding: 16px 44px; border: 1px solid rgba(192,192,192,.3);
      background: transparent; color: var(--white);
      font-family: var(--font-body); font-size: 12px;
      letter-spacing: .25em; text-transform: uppercase;
      text-decoration: none; cursor: none;
      transition: all .4s ease; position: relative; overflow: hidden;
      opacity: 0; animation: fadeUp 1s 1.1s ease forwards;
    }
    .btn-primary::before {
      content: ''; position: absolute; inset: 0;
      background: rgba(192,192,192,.06);
      transform: translateX(-100%); transition: transform .4s ease;
    }
    .btn-primary:hover::before { transform: translateX(0); }
    .btn-primary:hover { border-color: rgba(192,192,192,.6); }
    .scroll-indicator {
      position: absolute; bottom: 48px; left: 50%; transform: translateX(-50%);
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      opacity: 0; animation: fadeIn 1s 1.8s ease forwards;
    }
    .scroll-line {
      width: 1px; height: 60px;
      background: linear-gradient(180deg, transparent, var(--silver), transparent);
      animation: scrollPulse 2s ease-in-out infinite;
    }
    .scroll-text { font-size: 9px; letter-spacing: .3em; text-transform: uppercase; color: var(--grey-light); }

    /* ── Shared ── */
    section { padding: 120px 60px; }
    .section-label {
      font-size: 10px; letter-spacing: .5em; text-transform: uppercase;
      color: var(--grey-light); margin-bottom: 20px;
      display: flex; align-items: center; gap: 16px;
    }
    .section-label::before { content: ''; display: block; width: 30px; height: 1px; background: var(--silver); }
    .section-title {
      font-family: var(--font-display);
      font-size: clamp(36px,5vw,64px); font-weight: 300; line-height: 1.1; margin-bottom: 24px;
    }
    .section-title em { font-style: italic; color: var(--silver); }

    /* ── About ── */
    .about { background: var(--charcoal); }
    .about-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 80px;
      align-items: center; max-width: 1200px; margin: 0 auto;
    }
    .about-text p { font-size: 16px; line-height: 1.8; color: var(--grey-light); margin-bottom: 20px; font-weight: 300; }
    .about-pillars { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
    .pillar-card {
      background: var(--grey-dark); padding: 40px 32px;
      border: 1px solid rgba(192,192,192,.06);
      position: relative; overflow: hidden; transition: all .4s ease;
    }
    .pillar-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(192,192,192,.25), transparent);
      transform: scaleX(0); transform-origin: center; transition: transform .5s ease;
    }
    .pillar-card:hover { border-color: rgba(192,192,192,.15); background: #1e1e1e; }
    .pillar-card:hover::before { transform: scaleX(1); }
    .pillar-glyph { font-size: 22px; margin-bottom: 20px; color: var(--silver); opacity: .5; transition: opacity .3s; }
    .pillar-card:hover .pillar-glyph { opacity: 1; }
    .pillar-title { font-family: var(--font-display); font-size: 20px; font-weight: 400; color: var(--silver-light); margin-bottom: 10px; }
    .pillar-desc { font-size: 13px; color: var(--grey-light); line-height: 1.75; font-weight: 300; }

    /* ── Services ── */
    .services-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(300px,1fr));
      gap: 2px; max-width: 1400px; margin: 60px auto 0;
    }
    .service-card {
      background: var(--charcoal); padding: 52px 40px;
      border: 1px solid rgba(192,192,192,.06);
      position: relative; overflow: hidden; transition: all .4s ease; cursor: none;
    }
    .service-card::after {
      content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent, var(--silver), transparent);
      transform: scaleX(0); transform-origin: center; transition: transform .4s ease;
    }
    .service-card:hover { background: var(--grey-dark); transform: translateY(-4px); }
    .service-card:hover::after { transform: scaleX(1); }
    .service-num { font-family: var(--font-display); font-size: 13px; color: var(--grey-light); letter-spacing: .2em; margin-bottom: 28px; }
    .service-icon { font-size: 28px; margin-bottom: 20px; opacity: .7; }
    .service-title { font-family: var(--font-display); font-size: 26px; font-weight: 400; margin-bottom: 16px; }
    .service-desc { font-size: 14px; color: var(--grey-light); line-height: 1.7; font-weight: 300; }

    /* ── Platforms ── */
    .platforms { background: var(--charcoal); }
    .platforms-row {
      display: flex; gap: 2px; justify-content: center;
      flex-wrap: wrap; max-width: 1200px; margin: 60px auto 0;
    }
    .platform-card {
      flex: 1; min-width: 180px; background: var(--grey-dark); padding: 48px 28px;
      display: flex; flex-direction: column; align-items: center; gap: 12px;
      border: 1px solid rgba(192,192,192,.06); transition: all .4s ease; cursor: none;
    }
    .platform-card:hover { background: var(--grey-mid); border-color: rgba(192,192,192,.2); transform: translateY(-6px); }
    .platform-icon { font-size: 30px; transition: transform .3s; }
    .platform-card:hover .platform-icon { transform: scale(1.15); }
    .platform-name { font-size: 11px; letter-spacing: .3em; text-transform: uppercase; color: var(--grey-light); }
    .platform-note { font-size: 10px; color: rgba(136,136,136,.4); letter-spacing: .1em; text-align: center; }

    /* ── Strategy ── */
    .strategy-flow {
      display: flex; align-items: stretch;
      max-width: 1100px; margin: 70px auto 0; flex-wrap: wrap;
    }
    .strategy-step {
      flex: 1; min-width: 200px; padding: 48px 36px;
      background: var(--charcoal); border: 1px solid rgba(192,192,192,.06);
      position: relative; text-align: center; transition: all .4s ease;
    }
    .strategy-step:hover { background: var(--grey-dark); border-color: rgba(192,192,192,.15); }
    .strategy-step:not(:last-child)::after {
      content: '→'; position: absolute; right: -18px; top: 50%;
      transform: translateY(-50%); color: var(--silver); font-size: 18px; z-index: 2;
    }
    .step-num { font-family: var(--font-display); font-size: 72px; font-weight: 300; color: rgba(192,192,192,.08); line-height: 1; margin-bottom: 8px; }
    .step-title { font-family: var(--font-display); font-size: 22px; font-weight: 400; margin-bottom: 12px; color: var(--silver); }
    .step-desc { font-size: 13px; color: var(--grey-light); line-height: 1.7; font-weight: 300; }

    /* ── Portfolio ── */
    .portfolio { background: var(--charcoal); }
    .portfolio-grid {
      display: grid; grid-template-columns: repeat(3,1fr);
      gap: 2px; max-width: 1400px; margin: 60px auto 0;
    }
    .portfolio-card { position: relative; overflow: hidden; aspect-ratio: 4/3; cursor: none; }
    .portfolio-card img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s ease; filter: grayscale(30%); }
    .portfolio-card:hover img { transform: scale(1.08); filter: grayscale(0%); }
    .portfolio-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(180deg, transparent 40%, rgba(8,8,8,.9) 100%);
      display: flex; flex-direction: column; justify-content: flex-end;
      padding: 32px; opacity: 0; transition: opacity .4s ease;
    }
    .portfolio-card:hover .portfolio-overlay { opacity: 1; }
    .portfolio-tag { font-size: 10px; letter-spacing: .3em; text-transform: uppercase; color: var(--silver); margin-bottom: 8px; }
    .portfolio-name { font-family: var(--font-display); font-size: 24px; font-weight: 400; }

    /* ── Founding Creators ── */
    .founding-wrap {
      max-width: 1100px; margin: 0 auto;
      display: grid; grid-template-columns: 1fr 1fr; gap: 2px;
    }
    .founding-statement {
      grid-column: 1 / -1; padding: 80px 72px;
      background: var(--charcoal); border: 1px solid rgba(192,192,192,.08);
      text-align: center; position: relative; overflow: hidden;
    }
    .founding-statement::before {
      content: ''; position: absolute; inset: 0;
      background: radial-gradient(ellipse 60% 60% at 50% 50%, rgba(192,192,192,.03) 0%, transparent 70%);
      pointer-events: none;
    }
    .founding-glyph { font-family: var(--font-display); font-size: 80px; line-height: 1; color: rgba(192,192,192,.07); margin-bottom: 24px; letter-spacing: .3em; }
    .founding-quote { font-family: var(--font-display); font-size: clamp(26px,3.5vw,48px); font-weight: 300; font-style: italic; line-height: 1.2; color: var(--silver-light); margin-bottom: 28px; }
    .founding-sub { font-size: 13px; color: var(--grey-light); letter-spacing: .08em; line-height: 1.8; max-width: 540px; margin: 0 auto 48px; font-weight: 300; }
    .founding-perks { display: flex; justify-content: center; gap: 2px; flex-wrap: wrap; margin-bottom: 52px; }
    .perk { padding: 14px 28px; border: 1px solid rgba(192,192,192,.1); font-size: 11px; letter-spacing: .25em; text-transform: uppercase; color: var(--grey-light); background: rgba(255,255,255,.02); }
    .founding-cta {
      display: inline-flex; align-items: center; gap: 12px;
      padding: 18px 52px; border: 1px solid rgba(192,192,192,.35);
      background: transparent; color: var(--white);
      font-family: var(--font-body); font-size: 11px;
      letter-spacing: .3em; text-transform: uppercase;
      text-decoration: none; cursor: none; transition: all .4s ease;
      position: relative; overflow: hidden;
    }
    .founding-cta::before {
      content: ''; position: absolute; inset: 0;
      background: rgba(192,192,192,.06);
      transform: translateX(-100%); transition: transform .4s ease;
    }
    .founding-cta:hover::before { transform: translateX(0); }
    .founding-cta:hover { border-color: var(--silver); }
    .founding-note { margin-top: 24px; font-size: 11px; color: rgba(136,136,136,.45); letter-spacing: .1em; }
    .founding-cards { display: contents; }
    .founding-card {
      padding: 48px 40px; background: var(--grey-dark);
      border: 1px solid rgba(192,192,192,.06);
      display: flex; flex-direction: column; gap: 16px; transition: border-color .3s;
    }
    .founding-card:hover { border-color: rgba(192,192,192,.15); }
    .founding-card-icon { font-size: 22px; color: var(--silver); opacity: .6; }
    .founding-card-title { font-family: var(--font-display); font-size: 22px; font-weight: 400; color: var(--silver-light); }
    .founding-card-desc { font-size: 13px; color: var(--grey-light); line-height: 1.8; font-weight: 300; }

    /* ── Contact ── */
    .contact { background: var(--black); }
    .contact-inner { max-width: 700px; margin: 0 auto; text-align: center; }
    .contact-form { margin-top: 52px; text-align: left; }
    .form-group { margin-bottom: 24px; }
    .form-label { display: block; font-size: 10px; letter-spacing: .3em; text-transform: uppercase; color: var(--grey-light); margin-bottom: 10px; }
    .form-input,
    .form-textarea,
    .form-select {
      width: 100%; background: transparent;
      border: none; border-bottom: 1px solid rgba(192,192,192,.2);
      color: var(--white); font-family: var(--font-body);
      font-size: 15px; font-weight: 300; padding: 12px 0;
      outline: none; transition: border-color .3s;
      appearance: none;
    }
    .form-select option { background: var(--charcoal); color: var(--white); }
    .form-input:focus,
    .form-textarea:focus,
    .form-select:focus { border-color: var(--silver); }
    .form-textarea { resize: none; height: 100px; }
    .form-submit {
      width: 100%; padding: 20px; background: transparent;
      border: 1px solid rgba(192,192,192,.3); color: var(--white);
      font-family: var(--font-body); font-size: 11px;
      letter-spacing: .4em; text-transform: uppercase;
      cursor: none; transition: all .4s ease; margin-top: 12px;
      position: relative; overflow: hidden;
    }
    .form-submit::before {
      content: ''; position: absolute; inset: 0;
      background: rgba(192,192,192,.06);
      transform: translateY(100%); transition: transform .4s ease;
    }
    .form-submit:hover::before { transform: translateY(0); }
    .form-submit:hover { border-color: var(--silver); }

    /* ── Footer ── */
    footer {
      padding: 52px 60px; background: var(--charcoal);
      border-top: 1px solid rgba(192,192,192,.06);
      display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px;
    }
    .footer-logo { font-family: var(--font-display); font-size: 22px; letter-spacing: .25em; font-weight: 300; }
    .footer-links { display: flex; gap: 32px; }
    .footer-links a { font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: var(--grey-light); text-decoration: none; transition: color .3s; }
    .footer-links a:hover { color: var(--white); }
    .footer-copy { font-size: 11px; color: rgba(136,136,136,.5); letter-spacing: .1em; }

    /* ── Reveal ── */
    .reveal { opacity: 0; transform: translateY(40px); transition: opacity .8s ease, transform .8s ease; }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-delay-1 { transition-delay: .1s; }
    .reveal-delay-2 { transition-delay: .2s; }
    .reveal-delay-3 { transition-delay: .3s; }
    .reveal-delay-4 { transition-delay: .4s; }
    .blob { position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none; z-index: 0; }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      nav { padding: 24px; }
      nav.scrolled { padding: 16px 24px; }
      .nav-links { display: none; }
      section { padding: 80px 24px; }
      .about-grid { grid-template-columns: 1fr; gap: 48px; }
      .portfolio-grid { grid-template-columns: 1fr 1fr; }
      .strategy-step:not(:last-child)::after { display: none; }
      .strategy-flow { flex-direction: column; }
      footer { flex-direction: column; align-items: flex-start; }
      .founding-statement { padding: 52px 28px; }
      .founding-wrap { grid-template-columns: 1fr; }
      .founding-statement { grid-column: 1 / -1; }
    }
    @media (max-width: 480px) {
      .portfolio-grid { grid-template-columns: 1fr; }
      .platforms-row { flex-direction: column; }
      .about-pillars { grid-template-columns: 1fr; }
    }
  `}</style>
);

/* ─────────────────────────────────────────
   CURSOR
───────────────────────────────────────── */
function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const pos  = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top  = `${e.clientY}px`;
      }
    };
    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);

    window.addEventListener("mousemove", move);
    const targets = document.querySelectorAll("a, button, [data-hover]");
    targets.forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    let raf;
    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.1;
      ring.current.y += (pos.current.y - ring.current.y) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`;
        ringRef.current.style.top  = `${ring.current.y}px`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("mousemove", move);
      targets.forEach(el => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot" />
      <div ref={ringRef} className={`cursor-ring${hovered ? " hovered" : ""}`} />
    </>
  );
}

/* ─────────────────────────────────────────
   LOADER
───────────────────────────────────────── */
function Loader({ done }) {
  return (
    <div className={`loader${done ? " hidden" : ""}`}>
      <div className="loader-logo">GREY</div>
      <div className="loader-line" />
      <div className="loader-tagline">Creator Branding Agency</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─────────────────────────────────────────
   NAV
───────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={scrolled ? "scrolled" : ""}>
      <a href="#hero" className="nav-logo">GREY</a>
      <ul className="nav-links">
        {["About","Services","Work","Apply"].map(label => (
          <li key={label}>
            <a href={`#${label.toLowerCase()}`}>{label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ─────────────────────────────────────────
   HERO
───────────────────────────────────────── */
function Hero() {
  return (
    <div className="hero" id="hero">
      <div className="hero-bg" />
      <div className="hero-grid" />
      <div
        className="blob"
        style={{ width: 600, height: 600, background: "rgba(80,80,80,.06)", top: "10%", left: "60%" }}
      />
      <div className="hero-content">
        <div className="hero-eyebrow">Creator Branding Agency — Est. 2026</div>
        <h1 className="hero-title">
          Your Face.<br /><em>Your Empire.</em>
        </h1>
        <p className="hero-sub">
          We turn models and influencers into iconic personal brands that dominate every platform.
        </p>
        <a href="#apply" className="btn-primary">
          Apply to Work With Us
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
      <div className="scroll-indicator">
        <div className="scroll-line" />
        <span className="scroll-text">Scroll</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ABOUT
───────────────────────────────────────── */
function About() {
  const pillars = [
    { glyph: "◈", title: "Creator-First Thinking",  desc: "We don't treat you like a business — we treat you like a brand. Everything is built around your identity, your audience, and your vision." },
    { glyph: "◎", title: "Platform Intelligence",    desc: "We live inside these platforms. We know what the algorithm rewards, what audiences connect with, and how to engineer your rise." },
    { glyph: "⬡", title: "Monetisation Focused",     desc: "Followers are a vanity metric. We build systems that convert your audience into consistent, scalable income across every channel." },
    { glyph: "✦", title: "Discreet & Professional",  desc: "Your privacy is non-negotiable. We operate with absolute discretion — your strategy, your rates, and your personal life stay protected." },
  ];
  return (
    <section className="about" id="about">
      <div className="about-grid">
        <div className="about-text">
          <div className="section-label reveal">About GREY</div>
          <h2 className="section-title reveal reveal-delay-1">
            Built for creators<br />who refuse to be<br /><em>ordinary</em>
          </h2>
          <p className="reveal reveal-delay-2">
            GREY is a specialist branding agency for models, influencers, and digital creators.
            We don't do generic — we build carefully constructed personal brands that command
            attention, grow audiences, and generate real income.
          </p>
          <p className="reveal reveal-delay-3">
            Whether you're an Instagram model building your name, a creator scaling your
            subscription earnings, or an influencer ready to turn your following into an
            empire — GREY is the strategic partner you've been missing.
          </p>
        </div>
        <div className="about-pillars reveal reveal-delay-2">
          {pillars.map(p => (
            <div key={p.title} className="pillar-card">
              <div className="pillar-glyph">{p.glyph}</div>
              <div className="pillar-title">{p.title}</div>
              <div className="pillar-desc">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   SERVICES
───────────────────────────────────────── */
function Services() {
  const services = [
    { num: "01", icon: "◈", title: "Personal Brand Strategy",      desc: "We build your brand identity from the ground up — positioning, aesthetic direction, tone of voice, and a clear roadmap to becoming a recognised name in your space." },
    { num: "02", icon: "◎", title: "Instagram Growth & Management", desc: "Profile optimisation, content strategy, posting cadence, hashtag engineering, and community management — everything needed to grow a loyal, engaged following." },
    { num: "03", icon: "⬡", title: "Content Direction & Creation",  desc: "We direct your content shoots, write your captions, plan your feed aesthetic, and produce multimedia content that is premium, on-brand, and designed to perform." },
    { num: "04", icon: "◐", title: "Creator Monetisation",          desc: "Subscription platform growth strategy, pricing optimisation, fan engagement systems, and exclusive content planning — built to maximise your monthly earnings." },
    { num: "05", icon: "⊞", title: "Meta Ads Management",           desc: "Paid campaigns across Instagram and Facebook to accelerate your follower growth, promote your offers, and put your brand in front of exactly the right audience." },
    { num: "06", icon: "⬚", title: "Portfolio & Brand Kit",         desc: "A complete digital presence built for you: bespoke personal website, custom domain, professional logo, and unified social profiles — one premium brand kit, delivered." },
    { num: "07", icon: "✦", title: "Brand Deal & Collab Strategy",  desc: "We position you for paid partnerships — identifying the right brands, crafting your media kit, and negotiating collaborations that align with your image and pay what you deserve." },
  ];
  return (
    <section id="services">
      <div className="section-label reveal">What We Do</div>
      <h2 className="section-title reveal reveal-delay-1">Our <em>Services</em></h2>
      <div className="services-grid">
        {services.map((s, idx) => (
          <div
            key={s.num}
            className={`service-card reveal reveal-delay-${Math.min(idx + 1, 4)}`}
            data-hover="true"
          >
            <div className="service-num">{s.num}</div>
            <div className="service-icon">{s.icon}</div>
            <h3 className="service-title">{s.title}</h3>
            <p className="service-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PLATFORMS
───────────────────────────────────────── */

// Custom OnlyFans SVG icon (not available in react-icons)
function OnlyFansIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12s12-5.372 12-12C24 5.373 18.627 0 12 0zm0 3.103c2.285 0 4.236.794 5.748 2.168L6.2 14.405A8.875 8.875 0 0 1 3.103 12c0-4.905 3.992-8.897 8.897-8.897zm0 17.794c-2.284 0-4.355-.892-5.892-2.34l11.56-9.108A8.86 8.86 0 0 1 20.897 12c0 4.905-3.992 8.897-8.897 8.897z"/>
    </svg>
  );
}

function Platforms() {
  const platforms = [
    {
      name: "Instagram",
      note: "Your primary stage",
      icon: <FaInstagram size={36} />,
    },
    {
      name: "OnlyFans",
      note: "Monetise your fanbase",
      icon: <OnlyFansIcon size={36} />,
    },
    {
      name: "TikTok",
      note: "Short-form dominance",
      icon: <FaTiktok size={34} />,
    },
    {
      name: "YouTube",
      note: "Long-form authority",
      icon: <FaYoutube size={38} />,
    },
    {
      name: "X (Twitter)",
      note: "Build your voice",
      icon: <FaXTwitter size={34} />,
    },
  ];
  return (
    <section className="platforms">
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="section-label reveal">Platforms</div>
        <h2 className="section-title reveal reveal-delay-1">
          Every platform.<br /><em>One strategy.</em>
        </h2>
        <p className="reveal reveal-delay-2" style={{ color: "var(--grey-light)", maxWidth: 520, marginBottom: 0, fontWeight: 300, lineHeight: 1.8 }}>
          Your audience lives across multiple platforms. We make sure your presence is
          powerful, consistent, and growing on every single one of them.
        </p>
        <div className="platforms-row">
          {platforms.map((p, idx) => (
            <div
              key={p.name}
              className={`platform-card reveal reveal-delay-${Math.min(idx + 1, 4)}`}
              data-hover="true"
            >
              <div className="platform-icon" style={{ color: "var(--silver)", opacity: 0.75, transition: "opacity .3s" }}>
                {p.icon}
              </div>
              <span className="platform-name">{p.name}</span>
              <span className="platform-note">{p.note}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   STRATEGY
───────────────────────────────────────── */
function Strategy() {
  const steps = [
    { num: "01", title: "Audit",    desc: "We deep-dive your current presence, content, and income streams to find exactly what's working and what's holding you back." },
    { num: "02", title: "Position", desc: "We define your niche, brand voice, visual identity, and the exact story your audience will connect with and stay for." },
    { num: "03", title: "Execute",  desc: "We roll out your content strategy, platform management, ad campaigns, and monetisation systems with precision." },
    { num: "04", title: "Scale",    desc: "We amplify what's working, introduce new revenue streams, and compound your growth until your brand is impossible to ignore." },
  ];
  return (
    <section>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="section-label reveal">Our Process</div>
        <h2 className="section-title reveal reveal-delay-1">The GREY<br /><em>Method</em></h2>
        <p className="reveal reveal-delay-2" style={{ color: "var(--grey-light)", maxWidth: 560, marginBottom: 60, fontWeight: 300, lineHeight: 1.8 }}>
          Four focused stages — from understanding exactly where you are today,
          to building the brand you deserve tomorrow.
        </p>
        <div className="strategy-flow">
          {steps.map((s, idx) => (
            <div key={s.num} className={`strategy-step reveal reveal-delay-${Math.min(idx + 1, 4)}`}>
              <div className="step-num">{s.num}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PORTFOLIO
───────────────────────────────────────── */
function Portfolio() {
  const works = [
    { tag: "Instagram Model",   name: "Aesthetic Rebuild",      img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80" },
    { tag: "Content Creator",   name: "Monetisation Scale",     img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80" },
    { tag: "Personal Brand",    name: "Identity Launch",        img: "https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=800&q=80" },
    { tag: "Influencer",        name: "Brand Deal Pipeline",    img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80" },
    { tag: "Creator Brand Kit", name: "Full Digital Presence",  img: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&q=80" },
    { tag: "Meta Ads Campaign", name: "Audience Acceleration",  img: "https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=800&q=80" },
  ];
  return (
    <section className="portfolio" id="work">
      <div className="section-label reveal">Our Work</div>
      <h2 className="section-title reveal reveal-delay-1">
        The kind of growth<br />we <em>engineer</em>
      </h2>
      <p className="reveal reveal-delay-2" style={{ color: "var(--grey-light)", maxWidth: 520, marginBottom: 0, fontWeight: 300, lineHeight: 1.8 }}>
        A look at the types of transformations we build — from aesthetic overhauls
        to monetisation systems to full brand launches.
      </p>
      <div className="portfolio-grid">
        {works.map((w, idx) => (
          <div key={w.name} className={`portfolio-card reveal reveal-delay-${Math.min((idx % 3) + 1, 4)}`} data-hover="true">
            <img src={w.img} alt={w.name} loading="lazy" />
            <div className="portfolio-overlay">
              <div className="portfolio-tag">{w.tag}</div>
              <div className="portfolio-name">{w.name}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   FOUNDING CREATORS
───────────────────────────────────────── */
function FoundingClients() {
  const perks = ["Priority Onboarding", "Locked-In Rates", "Direct Founder Access", "Co-Built Strategy"];
  const cards = [
    { icon: "◈", title: "We Let Our Work Talk",  desc: "GREY is new — and we're not going to pretend otherwise. What we bring is sharp strategy, genuine platform expertise, and our complete focus on making your brand undeniable." },
    { icon: "◎", title: "You Shape How We Work", desc: "Founding creators get more than a service — they get a real partnership. Your feedback, your goals, and your growth directly inform how GREY operates from day one." },
  ];
  return (
    <section style={{ background: "var(--black)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="section-label reveal">Founding Creators</div>
        <h2 className="section-title reveal reveal-delay-1" style={{ marginBottom: 60 }}>
          Be Among<br /><em>The First</em>
        </h2>
        <div className="founding-wrap">
          <div className="founding-statement reveal reveal-delay-1">
            <div className="founding-glyph">✦</div>
            <p className="founding-quote">"We let our work<br />do the talking."</p>
            <p className="founding-sub">
              GREY is launching — and instead of faking credibility, we're offering something
              rarer: the chance to be first. Founding creators get exceptional attention,
              locked-in rates, and a partnership built at the very beginning of something great.
              Limited to 5 spots only.
            </p>
            <div className="founding-perks">
              {perks.map(p => <div key={p} className="perk">{p}</div>)}
            </div>
            <a href="#apply" className="founding-cta">
              Apply for a Founding Spot
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <p className="founding-note">5 founding partnerships only — each reviewed personally by the GREY team.</p>
          </div>
          <div className="founding-cards">
            {cards.map((c, idx) => (
              <div key={c.title} className={`founding-card reveal reveal-delay-${idx + 2}`}>
                <div className="founding-card-icon">{c.icon}</div>
                <div className="founding-card-title">{c.title}</div>
                <div className="founding-card-desc">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   CONTACT / APPLY
───────────────────────────────────────── */
function Contact() {
  const [status, setStatus]   = useState("idle"); // idle | submitting | success | error
  const [platform, setPlatform] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    const form = e.target;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/mgoraeek", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
        setPlatform("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="contact" id="apply">
      <div className="contact-inner">
        <div className="section-label reveal" style={{ justifyContent: "center" }}>Apply</div>
        <h2 className="section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>
          Ready to Build<br /><em>Your Empire?</em>
        </h2>
        <p className="reveal reveal-delay-2" style={{ color: "var(--grey-light)", textAlign: "center", fontWeight: 300, lineHeight: 1.8, marginBottom: 0 }}>
          Tell us about yourself. We review every application personally and only work
          with creators we know we can genuinely transform.
        </p>

        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 48, color: "var(--silver)" }}>✦</div>
            <p style={{ marginTop: 16, color: "var(--silver-light)", fontFamily: "var(--font-display)", fontSize: 22, fontStyle: "italic" }}>
              Application received.
            </p>
            <p style={{ marginTop: 8, color: "var(--grey-light)", fontSize: 13, letterSpacing: ".1em" }}>
              We'll be in touch within 48 hours.
            </p>
          </div>
        ) : (
          <form className="contact-form reveal reveal-delay-3" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input
                className="form-input"
                type="text"
                name="name"
                placeholder="First and last name"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Primary Platform</label>
              <select
                className="form-select"
                name="platform"
                required
                value={platform}
                onChange={e => setPlatform(e.target.value)}
              >
                <option value="" disabled>Select your main platform</option>
                <option value="Instagram">Instagram</option>
                <option value="OnlyFans">OnlyFans</option>
                <option value="TikTok">TikTok</option>
                <option value="YouTube">YouTube</option>
                <option value="Multiple Platforms">Multiple Platforms</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Your Handle / Profile Link</label>
              <input
                className="form-input"
                type="text"
                name="handle"
                placeholder="@yourhandle or profile URL"
              />
            </div>
            <div className="form-group">
              <label className="form-label">What are you looking to achieve?</label>
              <textarea
                className="form-textarea"
                name="message"
                placeholder="Tell us where you are now and where you want to be..."
                required
              />
            </div>

            {status === "error" && (
              <p style={{ color: "#c0392b", fontSize: 13, letterSpacing: ".05em", marginBottom: 12, textAlign: "center" }}>
                Something went wrong. Please try again or email us directly.
              </p>
            )}

            <button
              type="submit"
              className="form-submit"
              disabled={status === "submitting"}
              style={{ opacity: status === "submitting" ? 0.6 : 1 }}
            >
              {status === "submitting" ? "Submitting..." : "Submit Your Application"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   FOOTER
───────────────────────────────────────── */
function Footer() {
  return (
    <footer>
      <div className="footer-logo">GREY</div>
      <div className="footer-links">
        {["About", "Services", "Work", "Apply"].map(label => (
          <a key={label} href={`#${label.toLowerCase()}`}>{label}</a>
        ))}
      </div>
      <div className="footer-copy">© 2026 GREY Agency. All rights reserved.</div>
    </footer>
  );
}

/* ─────────────────────────────────────────
   APP
───────────────────────────────────────── */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  useReveal();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <FontLink />
      <Cursor />
      <Loader done={loaded} />
      <Nav />
      <Hero />
      <About />
      <Services />
      <Platforms />
      <Strategy />
      <Portfolio />
      <FoundingClients />
      <Contact />
      <Footer />
    </>
  );
}
