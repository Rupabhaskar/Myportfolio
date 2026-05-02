(function () {
    var navToggle = document.querySelector(".nav-toggle");
    var navLinks = document.querySelector(".nav-links");
    var topNav = document.querySelector(".top-nav");
    var progressFill = document.querySelector(".scroll-progress__fill");
    var backToTop = document.querySelector(".back-to-top");

    var sectionOrder = ["home", "projects", "skills", "about-me", "contact-me"];
    var navMarker = 130;

    function setActiveNav(id) {
        document.querySelectorAll(".nav-links a[data-nav]").forEach(function (a) {
            var match = a.getAttribute("data-nav") === id;
            a.classList.toggle("is-active", match);
            if (match) a.setAttribute("aria-current", "page");
            else a.removeAttribute("aria-current");
        });
    }

    function updateScrollUi() {
        var scrollY = window.scrollY;
        var doc = document.documentElement;
        var maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
        var ratio = scrollY / maxScroll;

        if (progressFill) {
            progressFill.style.transform = "scaleX(" + ratio + ")";
        }

        if (backToTop) {
            backToTop.hidden = scrollY < 420;
        }

        var activeId = "home";
        for (var i = 0; i < sectionOrder.length; i++) {
            var sid = sectionOrder[i];
            var el = document.getElementById(sid);
            if (!el) continue;
            var top = el.getBoundingClientRect().top;
            if (top <= navMarker) {
                activeId = sid;
            }
        }
        setActiveNav(activeId);

        if (topNav) {
            topNav.classList.toggle("scrolled", scrollY > 40);
        }
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", function () {
            var open = navLinks.classList.toggle("is-open");
            navToggle.classList.toggle("is-open", open);
            navToggle.setAttribute("aria-expanded", open ? "true" : "false");
            navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navLinks.classList.remove("is-open");
                navToggle.classList.remove("is-open");
                navToggle.setAttribute("aria-expanded", "false");
                navToggle.setAttribute("aria-label", "Open menu");
            });
        });
    }

    if (backToTop) {
        backToTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    window.addEventListener("scroll", updateScrollUi, { passive: true });
    updateScrollUi();

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
            { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
        );
        document.querySelectorAll(".reveal-on-scroll").forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        document.querySelectorAll(".reveal-on-scroll").forEach(function (el) {
            el.classList.add("is-visible");
        });
    }

    (function themeToggle() {
        var btn = document.querySelector("[data-theme-toggle]");
        if (!btn) return;

        function syncUi() {
            var isLight = document.documentElement.getAttribute("data-theme") === "light";
            btn.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
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
})();
