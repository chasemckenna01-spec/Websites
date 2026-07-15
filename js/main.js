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
