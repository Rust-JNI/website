// RJNI site behaviour: theme persistence, mobile nav, code-compare tabs, copy buttons.
// No frameworks, no analytics, no tracking.

(function () {
  var root = document.documentElement;
  var STORAGE_KEY = "rjni-theme";

  function applyStoredTheme() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") {
        root.setAttribute("data-theme", stored);
      }
    } catch (e) {
      /* localStorage unavailable — fall back to system preference */
    }
  }
  applyStoredTheme();

  function currentTheme() {
    var attr = root.getAttribute("data-theme");
    if (attr === "light" || attr === "dark") return attr;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* ignore */
    }
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-theme-toggle]");
    if (!btn) return;
    setTheme(currentTheme() === "dark" ? "light" : "dark");
  });

  // Mobile nav
  document.addEventListener("click", function (e) {
    var toggle = e.target.closest("[data-nav-toggle]");
    if (!toggle) return;
    var panel = document.getElementById(toggle.getAttribute("aria-controls"));
    if (!panel) return;
    var open = panel.hasAttribute("hidden") === false;
    if (open) {
      panel.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", "false");
    } else {
      panel.removeAttribute("hidden");
      toggle.setAttribute("aria-expanded", "true");
    }
  });
  document.addEventListener("click", function (e) {
    if (e.target.closest("#mobileNav a")) {
      var panel = document.getElementById("mobileNav");
      var toggle = document.querySelector("[data-nav-toggle]");
      if (panel) panel.setAttribute("hidden", "");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }
  });

  // Code-compare tabs (before/after demos with more than one variant)
  document.querySelectorAll("[data-code-compare]").forEach(function (widget) {
    var tabs = widget.querySelectorAll(".code-tab[data-target]");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        if (tab.disabled) return;
        tabs.forEach(function (t) { t.setAttribute("aria-selected", "false"); });
        tab.setAttribute("aria-selected", "true");
        widget.querySelectorAll("[data-panel-group]").forEach(function (group) {
          group.querySelectorAll("[data-panel]").forEach(function (panel) {
            panel.hidden = panel.getAttribute("data-panel") !== tab.getAttribute("data-target");
          });
        });
      });
    });
  });

  // Copy-to-clipboard on documentation code blocks
  document.querySelectorAll(".pre-wrap").forEach(function (wrap) {
    var pre = wrap.querySelector("pre");
    if (!pre) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = "Copy";
    btn.addEventListener("click", function () {
      var text = pre.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = "Copied";
          setTimeout(function () { btn.textContent = "Copy"; }, 1600);
        });
      }
    });
    wrap.appendChild(btn);
  });
})();
