(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------
     Sticky header state
  --------------------------------------------------------------------- */
  var header = document.getElementById("siteHeader");
  var onScroll = function () {
    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------------------------------------------------------------
     Mobile nav toggle
  --------------------------------------------------------------------- */
  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");

  function closeMobileNav() {
    mobileNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  }

  function openMobileNav() {
    mobileNav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
  }

  navToggle.addEventListener("click", function () {
    var isOpen = navToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) { closeMobileNav(); } else { openMobileNav(); }
  });

  mobileNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMobileNav);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeMobileNav(); }
  });

  /* ---------------------------------------------------------------------
     Hero background video — reinforce the native autoplay attribute with
     an explicit play() call. Some browsers are inconsistent about
     honoring declarative autoplay on a video sitting inside an element
     GSAP transforms immediately on load; a scripted play() is honored
     more reliably. Muted, so this needs no user gesture. Silently no-ops
     if blocked — the poster frame is a fine resting state either way.
  --------------------------------------------------------------------- */
  var heroVideo = document.querySelector(".scroll-hero-video");
  if (heroVideo) {
    var kickHeroVideo = function () {
      var playPromise = heroVideo.play();
      if (playPromise && playPromise.catch) { playPromise.catch(function () {}); }
    };
    if (heroVideo.readyState >= 2) {
      kickHeroVideo();
    } else {
      heroVideo.addEventListener("loadeddata", kickHeroVideo, { once: true });
    }
    window.addEventListener("load", kickHeroVideo);
  }

  /* ---------------------------------------------------------------------
     Scroll reveal — GSAP + ScrollTrigger if available, IntersectionObserver
     fallback otherwise. Reduced-motion users see content immediately.
  --------------------------------------------------------------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  if (prefersReducedMotion) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    revealEls.forEach(function (el) {
      el.classList.add("is-visible"); /* let GSAP own opacity/transform instead of the CSS transition */
      gsap.fromTo(
        el,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true
          }
        }
      );
    });

    /* Eyebrow entrance above the scroll-expand hero */
    var heroEyebrow = document.querySelector(".scroll-hero-content [data-reveal]");
    if (heroEyebrow) {
      gsap.set(heroEyebrow, { opacity: 0, y: 24 });
      gsap.to(heroEyebrow, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", delay: 0.2 });
    }
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------------
     Scroll-expand hero — the Blue Shaka video/photo grows as you scroll
     through a pinned section, driven entirely by one CSS custom property
     (--p, 0 to 1) so a single onUpdate call does all the work. --p
     defaults to 1 in CSS, so with no JS, a blocked CDN, or reduced motion
     the hero simply renders already "expanded" — never a broken collapsed
     state. No wheel/touch hijacking: native scroll drives it both ways.
  --------------------------------------------------------------------- */
  var scrollHero = document.querySelector(".scroll-hero");
  var scrollHeroPin = document.querySelector(".scroll-hero-pin");

  if (scrollHero && scrollHeroPin && !prefersReducedMotion && window.gsap && window.ScrollTrigger) {
    var isMobileHero = window.matchMedia("(max-width: 768px)").matches;

    scrollHeroPin.style.setProperty("--p", 0);

    ScrollTrigger.create({
      trigger: scrollHero,
      start: "top top",
      end: "+=" + (isMobileHero ? 100 : 150) + "%",
      scrub: 0.6,
      pin: scrollHeroPin,
      anticipatePin: 1,
      onUpdate: function (self) {
        scrollHeroPin.style.setProperty("--p", self.progress);
      }
    });
  }

  /* ---------------------------------------------------------------------
     Our Waters — a pinned photo that clip-reveals from a centered inset
     rectangle out to full-bleed while zooming out, recreated from a
     framer-motion component using the same --p + ScrollTrigger pattern
     as the hero above. Same fallback: --p defaults to 1 (fully revealed,
     no zoom) so it's a normal photo section with no JS.
  --------------------------------------------------------------------- */
  var watersReveal = document.getElementById("watersReveal");
  var watersRevealPin = document.getElementById("watersRevealPin");

  if (watersReveal && watersRevealPin && !prefersReducedMotion && window.gsap && window.ScrollTrigger) {
    var isMobileWaters = window.matchMedia("(max-width: 768px)").matches;

    watersRevealPin.style.setProperty("--p", 0);

    ScrollTrigger.create({
      trigger: watersReveal,
      start: "top top",
      end: "+=" + (isMobileWaters ? 90 : 130) + "%",
      scrub: 0.6,
      pin: watersRevealPin,
      anticipatePin: 1,
      onUpdate: function (self) {
        watersRevealPin.style.setProperty("--p", self.progress);
      }
    });
  }

  /* ---------------------------------------------------------------------
     Fish school factory — a small school of glowing fish drifting over a
     section's background, flocking (separation/alignment/cohesion) and
     scattering away from the cursor. Canvas-only, pointer-events:none,
     paused off-screen and on a hidden tab. Skipped entirely under
     prefers-reduced-motion. Reused for both the Trips section (plain
     white "embers") and the hero reveal's reef background (a school of
     different tropical fish colors) rather than duplicating the sim.
  --------------------------------------------------------------------- */
  function hexToRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m
      ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
      : { r: 255, g: 255, b: 255 };
  }

  function createFishSchool(canvas, sectionSelector, options) {
    if (!canvas || prefersReducedMotion || !window.requestAnimationFrame) return;
    options = options || {};

    var section = canvas.closest(sectionSelector);
    if (!section) return;

    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width = 0;
    var height = 0;
    var fish = [];
    var rafId = null;
    var running = false;
    var isMobile = window.matchMedia("(max-width: 768px)").matches;
    var COUNT_DESKTOP = options.countDesktop || 42;
    var COUNT_MOBILE = options.countMobile || 22;
    var COUNT = isMobile ? COUNT_MOBILE : COUNT_DESKTOP;
    var MAX_SPEED = 1.5;
    var MAX_FORCE = 0.045;
    var NEIGHBOR_R = 68;
    var SEPARATION_R = 24;
    var POINTER_R = 130;
    var POINTER_FORCE = 1.1;
    var colors = options.colors || ["#ffffff"];

    var pointer = { x: -9999, y: -9999, active: false };
    var idleTimer = null;

    function makeGlowSprite(hex) {
      var rgb = hexToRgb(hex);
      var core = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.95)";
      var mid = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.55)";
      var edge = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0)";
      var size = 64;
      var c = document.createElement("canvas");
      c.width = c.height = size;
      var gctx = c.getContext("2d");
      var r = size / 2;
      var grad = gctx.createRadialGradient(r, r, 0, r, r, r);
      grad.addColorStop(0, core);
      grad.addColorStop(0.35, mid);
      grad.addColorStop(1, edge);
      gctx.fillStyle = grad;
      gctx.beginPath();
      gctx.arc(r, r, r, 0, Math.PI * 2);
      gctx.fill();
      return c;
    }
    var sprites = colors.map(makeGlowSprite);

    function rand(min, max) { return min + Math.random() * (max - min); }

    function resize() {
      width = section.clientWidth;
      height = section.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      fish = [];
      for (var i = 0; i < COUNT; i++) {
        var angle = rand(0, Math.PI * 2);
        fish.push({
          x: rand(0, width),
          y: rand(0, height),
          vx: Math.cos(angle) * 0.4,
          vy: Math.sin(angle) * 0.4,
          size: rand(1.6, 3.4),
          wander: rand(0, Math.PI * 2),
          twinkle: rand(0, Math.PI * 2),
          spriteIndex: Math.floor(rand(0, sprites.length))
        });
      }
    }

    function limitVec(v, max) {
      var magSq = v.x * v.x + v.y * v.y;
      if (magSq > max * max && magSq > 0) {
        var mag = Math.sqrt(magSq);
        v.x = (v.x / mag) * max;
        v.y = (v.y / mag) * max;
      }
      return v;
    }

    function step() {
      for (var i = 0; i < fish.length; i++) {
        var f = fish[i];
        var sepX = 0, sepY = 0;
        var aliX = 0, aliY = 0;
        var cohX = 0, cohY = 0;
        var neighborCount = 0;

        for (var j = 0; j < fish.length; j++) {
          if (i === j) continue;
          var o = fish[j];
          var dx = f.x - o.x;
          var dy = f.y - o.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d > 0 && d < NEIGHBOR_R) {
            if (d < SEPARATION_R) {
              sepX += dx / d;
              sepY += dy / d;
            }
            aliX += o.vx;
            aliY += o.vy;
            cohX += o.x;
            cohY += o.y;
            neighborCount++;
          }
        }

        var ax = 0, ay = 0;

        if (neighborCount > 0) {
          aliX /= neighborCount; aliY /= neighborCount;
          cohX = cohX / neighborCount - f.x;
          cohY = cohY / neighborCount - f.y;
          ax += sepX * 1.6 + aliX * 0.9 + cohX * 0.01;
          ay += sepY * 1.6 + aliY * 0.9 + cohY * 0.01;
        }

        /* gentle organic wander so motion never looks mechanical */
        f.wander += rand(-0.3, 0.3);
        ax += Math.cos(f.wander) * 0.04;
        ay += Math.sin(f.wander) * 0.04;

        /* scatter away from the cursor, stronger the closer it gets */
        if (pointer.active) {
          var pdx = f.x - pointer.x;
          var pdy = f.y - pointer.y;
          var pd = Math.sqrt(pdx * pdx + pdy * pdy);
          if (pd < POINTER_R && pd > 0) {
            var strength = (1 - pd / POINTER_R) * POINTER_FORCE;
            ax += (pdx / pd) * strength;
            ay += (pdy / pd) * strength;
          }
        }

        var steer = limitVec({ x: ax, y: ay }, MAX_FORCE);
        f.vx += steer.x * 0.6;
        f.vy += steer.y * 0.6;
        var vel = limitVec({ x: f.vx, y: f.vy }, MAX_SPEED);
        f.vx = vel.x;
        f.vy = vel.y;

        f.x += f.vx;
        f.y += f.vy;

        /* wrap at the edges so the school keeps flowing */
        if (f.x < -20) f.x = width + 20;
        if (f.x > width + 20) f.x = -20;
        if (f.y < -20) f.y = height + 20;
        if (f.y > height + 20) f.y = -20;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < fish.length; i++) {
        var f = fish[i];
        f.twinkle += 0.03;
        var alpha = 0.55 + Math.sin(f.twinkle) * 0.35;
        var s = f.size * 7;
        ctx.globalAlpha = Math.max(0.15, alpha);
        ctx.drawImage(sprites[f.spriteIndex], f.x - s / 2, f.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }

    function frame() {
      step();
      draw();
      rafId = window.requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      rafId = window.requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = null;
    }

    function updatePointer(clientX, clientY) {
      var rect = section.getBoundingClientRect();
      pointer.x = clientX - rect.left;
      pointer.y = clientY - rect.top;
      pointer.active = true;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(function () { pointer.active = false; }, 2500);
    }

    window.addEventListener("pointermove", function (e) {
      updatePointer(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener("resize", function () {
      isMobile = window.matchMedia("(max-width: 768px)").matches;
      COUNT = isMobile ? COUNT_MOBILE : COUNT_DESKTOP;
      resize();
    });

    if (window.ResizeObserver) {
      new ResizeObserver(resize).observe(section);
    }

    resize();
    seed();

    if (document.visibilityState !== "hidden") { start(); }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { stop(); } else { start(); }
    });

    if (window.IntersectionObserver) {
      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !document.hidden) { start(); } else { stop(); }
        });
      }, { threshold: 0.05 });
      sectionObserver.observe(section);
    }
  }

  createFishSchool(document.getElementById("tripsFishCanvas"), ".trips", {
    colors: ["#e0f0f5"]
  });

  createFishSchool(document.getElementById("experienceFishCanvas"), ".experience", {
    colors: ["#e0f0f5"]
  });

  createFishSchool(document.getElementById("heroReefFishCanvas"), ".scroll-hero-reveal", {
    countDesktop: 46,
    countMobile: 24,
    colors: ["#ff7a3d", "#ffd23f", "#3ec6ff", "#ff5da8", "#ffffff", "#4ee6a0"]
  });

  /* ---------------------------------------------------------------------
     Crew section — a single soft white glow that trails the cursor with
     a bit of lag, instead of the fish school. Fades in/out at the
     section edges, paused off-screen/hidden tab, skipped under
     prefers-reduced-motion.
  --------------------------------------------------------------------- */
  var crewGlow = document.getElementById("crewGlow");

  if (crewGlow && !prefersReducedMotion && window.requestAnimationFrame) {
    (function initCrewGlow() {
      var section = crewGlow.closest(".crew");
      var target = { x: 0, y: 0 };
      var current = { x: 0, y: 0 };
      var active = false;
      var rafId = null;
      var running = false;
      var initialized = false;

      function onPointerMove(e) {
        var rect = section.getBoundingClientRect();
        var inside =
          e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom;

        if (inside) {
          target.x = e.clientX - rect.left;
          target.y = e.clientY - rect.top;
          if (!active || !initialized) {
            current.x = target.x;
            current.y = target.y;
            initialized = true;
          }
          active = true;
          crewGlow.classList.add("is-active");
        } else if (active) {
          active = false;
          crewGlow.classList.remove("is-active");
        }
      }

      function frame() {
        current.x += (target.x - current.x) * 0.06;
        current.y += (target.y - current.y) * 0.06;
        crewGlow.style.transform = "translate3d(" + current.x + "px, " + current.y + "px, 0)";
        rafId = window.requestAnimationFrame(frame);
      }

      function start() {
        if (running) return;
        running = true;
        rafId = window.requestAnimationFrame(frame);
      }

      function stop() {
        running = false;
        if (rafId) window.cancelAnimationFrame(rafId);
        rafId = null;
      }

      // Listen for both — some tablet/hybrid browsers with an external
      // mouse attached don't reliably dispatch pointermove, but the older
      // mousemove event fires for real mouse movement almost everywhere.
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("mousemove", onPointerMove, { passive: true });

      if (document.visibilityState !== "hidden") { start(); }

      document.addEventListener("visibilitychange", function () {
        if (document.hidden) { stop(); } else { start(); }
      });

      if (window.IntersectionObserver) {
        var glowObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !document.hidden) { start(); } else { stop(); }
          });
        }, { threshold: 0.05 });
        glowObserver.observe(section);
      }
    })();
  }

  /* ---------------------------------------------------------------------
     Contact section background video — plays once (no loop attribute) as
     the section scrolls into view, then naturally rests on its last
     frame. `.contact-bg-fallback` shows that same last frame as a still
     image underneath, so prefers-reduced-motion users (video never
     triggered) and everyone else land on an identical resting visual.
  --------------------------------------------------------------------- */
  var contactBgVideo = document.getElementById("contactBgVideo");
  var contactSection = document.getElementById("contact");

  if (contactBgVideo && contactSection && !prefersReducedMotion) {
    var videoTriggered = false;

    function playContactVideo() {
      if (videoTriggered) return;
      videoTriggered = true;
      var playPromise = contactBgVideo.play();
      if (playPromise && playPromise.then) {
        playPromise
          .then(function () { contactBgVideo.classList.add("is-playing"); })
          .catch(function () { /* autoplay blocked; fallback still image stays visible */ });
      } else {
        contactBgVideo.classList.add("is-playing");
      }
    }

    if (window.IntersectionObserver) {
      var contactObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            playContactVideo();
            contactObserver.disconnect();
          }
        });
      }, { threshold: 0.2 });
      contactObserver.observe(contactSection);
    } else {
      playContactVideo();
    }
  }

  /* ---------------------------------------------------------------------
     Contact form — front-end only submission handoff (no backend wired up)
  --------------------------------------------------------------------- */
  var form = document.getElementById("contactForm");
  var formNote = document.getElementById("formNote");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        formNote.textContent = "Please fill in the required fields (name and email).";
        formNote.style.color = "#d9611f";
        form.reportValidity();
        return;
      }

      var name = form.querySelector("#name").value.trim();
      formNote.style.color = "";
      formNote.textContent = "Mahalo, " + (name || "friend") + "! This form isn't wired to a live inbox yet — connect it to your email/booking service to start receiving requests.";
      form.reset();
    });
  }

  /* ---------------------------------------------------------------------
     Footer year
  --------------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
})();
