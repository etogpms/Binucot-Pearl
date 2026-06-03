(function () {
  var labels = { EN: "en", DE: "de", FR: "fr", TL: "tl", PL: "pl" };
  var included = "en,de,fr,tl,pl";
  var hideTimer;

  function injectStyles() {
    if (document.getElementById("bp-translate-hide-style")) return;
    var style = document.createElement("style");
    style.id = "bp-translate-hide-style";
    style.textContent = [
      "html.translated-ltr,html.translated-rtl,body{top:0!important;}",
      ".goog-te-banner-frame,.goog-te-banner-frame.skiptranslate,iframe.goog-te-banner-frame,",
      "iframe.skiptranslate,.VIpgJd-ZVi9od-ORHb-OEVmcd{display:none!important;visibility:hidden!important;height:0!important;}",
      "body>.skiptranslate{display:none!important;}",
      "#goog-gt-tt,.goog-te-balloon-frame,.goog-tooltip,.goog-tooltip:hover{display:none!important;}",
      ".goog-text-highlight{background:transparent!important;box-shadow:none!important;}"
    ].join("");
    document.head.appendChild(style);
  }

  function hideGoogleToolbar() {
    injectStyles();
    document.documentElement.style.top = "0px";
    document.body.style.top = "0px";
    document.querySelectorAll(
      ".goog-te-banner-frame, iframe.goog-te-banner-frame, iframe.skiptranslate, .VIpgJd-ZVi9od-ORHb-OEVmcd"
    ).forEach(function (el) {
      el.style.display = "none";
      el.style.visibility = "hidden";
      el.style.height = "0";
    });
  }

  function keepGoogleToolbarHidden() {
    hideGoogleToolbar();
    if (hideTimer) window.clearInterval(hideTimer);
    hideTimer = window.setInterval(hideGoogleToolbar, 250);
    window.setTimeout(function () {
      window.clearInterval(hideTimer);
      hideTimer = null;
      hideGoogleToolbar();
    }, 5000);
  }

  function ensureElement() {
    injectStyles();
    if (document.getElementById("google_translate_element")) return;
    var el = document.createElement("div");
    el.id = "google_translate_element";
    el.style.position = "fixed";
    el.style.left = "-9999px";
    el.style.bottom = "0";
    el.style.width = "1px";
    el.style.height = "1px";
    el.style.overflow = "hidden";
    document.body.appendChild(el);
  }

  function writeCookie(name, value, options) {
    options = options || {};
    var cookie = name + "=" + value + "; path=" + (options.path || "/") + "; ";
    if (options.expires) cookie += "expires=" + options.expires + "; ";
    if (options.domain) cookie += "domain=" + options.domain + "; ";
    document.cookie = cookie;
  }

  function clearTranslationCookies() {
    var past = "Thu, 01 Jan 1970 00:00:00 GMT";
    var domains = ["", location.hostname, "." + location.hostname];
    var paths = ["/", location.pathname || "/"];

    domains.forEach(function (domain) {
      paths.forEach(function (path) {
        writeCookie("googtrans", "", {
          domain: domain || undefined,
          path: path,
          expires: past
        });
      });
    });
  }

  function resetToEnglish() {
    try {
      localStorage.setItem("bp_lang", "EN");
    } catch (_) {}

    clearTranslationCookies();
    document.documentElement.lang = "en";

    var combo = document.querySelector(".goog-te-combo");
    if (combo) {
      combo.value = "";
      combo.dispatchEvent(new Event("change"));
    }

    window.setTimeout(function () {
      location.reload();
    }, 100);
  }

  function applyLanguage(code, tries) {
    document.documentElement.lang = code;
    keepGoogleToolbarHidden();

    if (code === "en") {
      resetToEnglish();
      return;
    }

    writeCookie("googtrans", "/en/" + code);

    var combo = document.querySelector(".goog-te-combo");
    if (combo) {
      combo.value = code;
      combo.dispatchEvent(new Event("change"));
      keepGoogleToolbarHidden();
      return;
    }

    if (tries < 30) {
      window.setTimeout(function () {
        applyLanguage(code, tries + 1);
      }, 200);
    }
  }

  window.BPTranslate = function (label) {
    var code = labels[label] || String(label || "EN").toLowerCase();
    try {
      localStorage.setItem("bp_lang", label);
    } catch (_) {}
    applyLanguage(code, 0);
  };

  window.BPGoogleTranslateInit = function () {
    ensureElement();
    new google.translate.TranslateElement(
      { pageLanguage: "en", includedLanguages: included, autoDisplay: false },
      "google_translate_element"
    );
    keepGoogleToolbarHidden();
    try {
      var saved = localStorage.getItem("bp_lang");
      if (saved && saved !== "EN") {
        window.setTimeout(function () {
          window.BPTranslate(saved);
        }, 500);
      }
    } catch (_) {}
  };

  document.addEventListener("DOMContentLoaded", function () {
    ensureElement();
    keepGoogleToolbarHidden();
    new MutationObserver(hideGoogleToolbar).observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"]
    });
    try {
      var saved = localStorage.getItem("bp_lang");
      if (saved && labels[saved]) document.documentElement.lang = labels[saved];
    } catch (_) {}
  });
})();
