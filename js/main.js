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

    /* Hero entrance timeline */
    var heroEls = document.querySelectorAll(".hero [data-reveal]");
    if (heroEls.length) {
      gsap.set(heroEls, { opacity: 0, y: 24 });
      gsap.to(heroEls, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power2.out",
        stagger: 0.12,
        delay: 0.2
      });
    }

    /* Subtle parallax on the hero sun glow only (decorative layer, never text) */
    var heroSun = document.querySelector(".hero-sun");
    if (heroSun) {
      gsap.to(heroSun, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.5
        }
      });
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
