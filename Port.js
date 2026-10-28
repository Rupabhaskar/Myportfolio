(function () {
    var navToggle = document.querySelector(".nav-toggle");
    var navLinks = document.querySelector(".nav-links");
    var topNav = document.querySelector(".top-nav");
    var progressFill = document.querySelector(".scroll-progress__fill");
    var backToTop = document.querySelector(".back-to-top");

    var sectionOrder = ["home", "projects", "case-study", "experience", "skills", "about-me", "contact-me"];
    var navMarker = 140;
    var ticking = false;

    function setActiveNav(id) {
        document.querySelectorAll(".nav-links a[data-nav]").forEach(function (a) {
            var match = a.getAttribute("data-nav") === id;
            a.classList.toggle("is-active", match);
            if (match) a.setAttribute("aria-current", "location");
            else a.removeAttribute("aria-current");
        });
    }

    function updateScrollUi() {
        ticking = false;
        var scrollY = window.scrollY;
        var doc = document.documentElement;
        var maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);

        if (progressFill) {
            progressFill.style.transform = "scaleX(" + Math.min(1, scrollY / maxScroll) + ")";
        }

        if (backToTop) {
            backToTop.hidden = scrollY < 600;
        }

        var activeId = "home";
        for (var i = 0; i < sectionOrder.length; i++) {
            var el = document.getElementById(sectionOrder[i]);
            if (el && el.getBoundingClientRect().top <= navMarker) {
                activeId = sectionOrder[i];
            }
        }
        if (window.innerHeight + scrollY >= doc.scrollHeight - 4) {
            activeId = sectionOrder[sectionOrder.length - 1];
        }
        setActiveNav(activeId);

        if (topNav) {
            topNav.classList.toggle("scrolled", scrollY > 24);
        }
    }

    window.addEventListener(
        "scroll",
        function () {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(updateScrollUi);
            }
        },
        { passive: true }
    );
    updateScrollUi();

    if (navToggle && navLinks) {
        var setMenu = function (open) {
            navLinks.classList.toggle("is-open", open);
            navToggle.classList.toggle("is-open", open);
            if (topNav) topNav.classList.toggle("menu-open", open);
            navToggle.setAttribute("aria-expanded", open ? "true" : "false");
            navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        };

        navToggle.addEventListener("click", function () {
            setMenu(!navLinks.classList.contains("is-open"));
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                setMenu(false);
            });
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && navLinks.classList.contains("is-open")) {
                setMenu(false);
                navToggle.focus();
            }
        });

        document.addEventListener("click", function (e) {
            if (!navLinks.classList.contains("is-open")) return;
            if (navLinks.contains(e.target) || navToggle.contains(e.target)) return;
            setMenu(false);
        });
    }

    if (backToTop) {
        backToTop.addEventListener("click", function () {
            var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
            var skip = document.querySelector(".skip-link");
            if (skip) skip.focus({ preventScroll: true });
        });
    }

    var revealTargets = document.querySelectorAll(".reveal-on-scroll");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion && "IntersectionObserver" in window) {
        var revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                });
            },
            { rootMargin: "0px 0px -6% 0px", threshold: 0.04 }
        );
        revealTargets.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        revealTargets.forEach(function (el) {
            el.classList.add("is-visible");
        });
    }

    // Reveal a section immediately when it is targeted by an in-page link or URL hash.
    function revealHashTarget() {
        if (!location.hash) return;
        var target = document.getElementById(location.hash.slice(1));
        var section = target && target.closest(".reveal-on-scroll");
        if (section) section.classList.add("is-visible");
    }
    window.addEventListener("hashchange", revealHashTarget);
    revealHashTarget();

    (function themeToggle() {
        var btn = document.querySelector("[data-theme-toggle]");
        var themeMeta = document.querySelector('meta[name="theme-color"]');
        if (!btn) return;

        function syncUi() {
            var isLight = document.documentElement.getAttribute("data-theme") === "light";
            btn.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
            if (themeMeta) themeMeta.setAttribute("content", isLight ? "#f7f6fa" : "#07070a");
        }

        btn.addEventListener("click", function () {
            var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
            document.documentElement.setAttribute("data-theme", next);
            try {
                localStorage.setItem("theme", next);
            } catch (e) {}
            syncUi();
        });

        syncUi();
    })();

    var yearEl = document.querySelector("[data-year]");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
