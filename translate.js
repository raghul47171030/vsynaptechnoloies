/* ============================================================
   Global site translation — free Google Translate widget.
   Self-contained: injects its own CSS, a floating button, a
   language panel, and the hidden Google Translate engine.
   Drop on any page with:  <script src="translate.js" defer></script>
   The chosen language persists across pages (Google sets a
   `googtrans` cookie), so it stays translated as you navigate.
   ============================================================ */
(function () {
    "use strict";

    /* languages shown in the panel (code = Google Translate code) */
    var LANGS = [
        { code: "en", name: "English", flag: "🇬🇧" },
        { code: "ta", name: "தமிழ் (Tamil)", flag: "🇮🇳" },
        { code: "hi", name: "हिन्दी (Hindi)", flag: "🇮🇳" },
        { code: "te", name: "తెలుగు (Telugu)", flag: "🇮🇳" },
        { code: "ml", name: "മലയാളം (Malayalam)", flag: "🇮🇳" },
        { code: "kn", name: "ಕನ್ನಡ (Kannada)", flag: "🇮🇳" },
        { code: "bn", name: "বাংলা (Bengali)", flag: "🇧🇩" },
        { code: "mr", name: "मराठी (Marathi)", flag: "🇮🇳" },
        { code: "gu", name: "ગુજરાતી (Gujarati)", flag: "🇮🇳" },
        { code: "ur", name: "اردو (Urdu)", flag: "🇵🇰" },
        { code: "ar", name: "العربية (Arabic)", flag: "🇸🇦" },
        { code: "fr", name: "Français (French)", flag: "🇫🇷" },
        { code: "es", name: "Español (Spanish)", flag: "🇪🇸" },
        { code: "de", name: "Deutsch (German)", flag: "🇩🇪" },
        { code: "pt", name: "Português (Portuguese)", flag: "🇵🇹" },
        { code: "ru", name: "Русский (Russian)", flag: "🇷🇺" },
        { code: "zh-CN", name: "中文 (Chinese)", flag: "🇨🇳" },
        { code: "ja", name: "日本語 (Japanese)", flag: "🇯🇵" },
        { code: "ko", name: "한국어 (Korean)", flag: "🇰🇷" },
        { code: "id", name: "Indonesia", flag: "🇮🇩" },
        { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
        { code: "th", name: "ไทย (Thai)", flag: "🇹🇭" },
        { code: "tr", name: "Türkçe (Turkish)", flag: "🇹🇷" },
        { code: "it", name: "Italiano (Italian)", flag: "🇮🇹" }
    ];

    /* ---- 1. inject styles ---- */
    var css = [
        "#gt-fab{position:fixed;right:22px;bottom:22px;z-index:99999;width:56px;height:56px;border:none;border-radius:50%;cursor:pointer;",
        "display:flex;align-items:center;justify-content:center;font-size:26px;color:#fff;",
        "background:linear-gradient(135deg,#5b9aff,#a78bfa);box-shadow:0 8px 24px rgba(91,154,255,.45);",
        "transition:transform .25s cubic-bezier(.16,1,.3,1),box-shadow .25s ease;}",
        "#gt-fab:hover{transform:translateY(-3px) scale(1.06);box-shadow:0 12px 32px rgba(167,139,250,.55);}",
        "#gt-fab:active{transform:scale(.96);}",
        "#gt-fab .gt-dot{position:absolute;top:8px;right:9px;min-width:16px;height:16px;padding:0 3px;border-radius:9px;",
        "background:#fff;color:#5b9aff;font-size:9px;font-weight:800;line-height:16px;text-align:center;text-transform:uppercase;",
        "box-shadow:0 2px 6px rgba(0,0,0,.25);}",
        "#gt-panel{position:fixed;right:22px;bottom:90px;z-index:99999;width:288px;max-height:62vh;overflow:hidden;",
        "border-radius:18px;background:rgba(20,22,34,.92);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);",
        "border:1px solid rgba(255,255,255,.12);box-shadow:0 24px 60px rgba(0,0,0,.5);",
        "opacity:0;transform:translateY(14px) scale(.96);transform-origin:bottom right;pointer-events:none;",
        "transition:opacity .25s ease,transform .25s cubic-bezier(.16,1,.3,1);}",
        "#gt-panel.open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}",
        "#gt-panel .gt-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;",
        "font:700 13px/1 system-ui,Segoe UI,Roboto,sans-serif;letter-spacing:1.5px;text-transform:uppercase;color:#fff;",
        "background:linear-gradient(95deg,rgba(91,154,255,.25),rgba(167,139,250,.25));border-bottom:1px solid rgba(255,255,255,.1);}",
        "#gt-panel .gt-close{background:none;border:none;color:#cdd3e6;font-size:18px;cursor:pointer;line-height:1;padding:2px 4px;border-radius:6px;}",
        "#gt-panel .gt-close:hover{color:#fff;background:rgba(255,255,255,.1);}",
        "#gt-list{list-style:none;margin:0;padding:6px;overflow-y:auto;max-height:calc(62vh - 48px);}",
        "#gt-list li{display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:11px;cursor:pointer;",
        "font:600 14px/1.2 system-ui,Segoe UI,Roboto,sans-serif;color:#e6e9f5;transition:background .18s ease,color .18s ease;}",
        "#gt-list li:hover{background:rgba(91,154,255,.16);}",
        "#gt-list li.active{background:linear-gradient(95deg,rgba(91,154,255,.3),rgba(167,139,250,.3));color:#fff;}",
        "#gt-list li .gt-flag{font-size:18px;line-height:1;}",
        "#gt-list li.active .gt-tick{margin-left:auto;color:#9ec4ff;font-weight:800;}",
        /* hide Google's own UI chrome but keep the engine working */
        "#google_translate_element{position:absolute;left:-9999px;top:-9999px;height:0;overflow:hidden;}",
        ".goog-te-banner-frame,.skiptranslate{display:none !important;}",
        "body{top:0 !important;}",
        "@media (max-width:480px){#gt-panel{right:12px;left:12px;width:auto;}#gt-fab{right:16px;bottom:16px;}}"
    ].join("");
    var style = document.createElement("style");
    style.id = "gt-style";
    style.textContent = css;
    document.head.appendChild(style);

    /* ---- 2. build the DOM ---- */
    var hidden = document.createElement("div");
    hidden.id = "google_translate_element";
    document.body.appendChild(hidden);

    var fab = document.createElement("button");
    fab.id = "gt-fab";
    fab.type = "button";
    fab.setAttribute("aria-label", "Translate this page");
    fab.setAttribute("title", "Translate this page");
    fab.innerHTML = '🌐<span class="gt-dot" id="gt-dot">EN</span>';
    document.body.appendChild(fab);

    var panel = document.createElement("div");
    panel.id = "gt-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Choose a language");
    var items = LANGS.map(function (l) {
        return '<li data-code="' + l.code + '"><span class="gt-flag">' + l.flag +
            '</span><span class="gt-name">' + l.name + '</span><span class="gt-tick">✓</span></li>';
    }).join("");
    panel.innerHTML =
        '<div class="gt-head"><span>🌍 Language</span>' +
        '<button class="gt-close" id="gt-close" aria-label="Close">✕</button></div>' +
        '<ul id="gt-list">' + items + "</ul>";
    document.body.appendChild(panel);

    /* ---- 3. helpers ---- */
    function currentLang() {
        var m = document.cookie.match(/googtrans=\/[^/]*\/([^;]+)/);
        return m ? decodeURIComponent(m[1]) : "en";
    }

    function setCookie(name, value) {
        var host = location.hostname;
        // set on the exact host and (if applicable) the parent domain so it survives across pages
        document.cookie = name + "=" + value + ";path=/";
        document.cookie = name + "=" + value + ";path=/;domain=" + host;
        if (host.indexOf(".") > -1) {
            document.cookie = name + "=" + value + ";path=/;domain=." + host.split(".").slice(-2).join(".");
        }
    }

    function applyLang(code) {
        if (code === "en") {
            // English = remove translation cookie and reload to original
            setCookie("googtrans", "");
            document.cookie = "googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        } else {
            setCookie("googtrans", "/en/" + code);
        }
        location.reload();
    }

    function markActive() {
        var cur = currentLang();
        var dot = document.getElementById("gt-dot");
        if (dot) dot.textContent = (cur.split("-")[0] || "en").toUpperCase();
        var lis = panel.querySelectorAll("#gt-list li");
        for (var i = 0; i < lis.length; i++) {
            lis[i].classList.toggle("active", lis[i].getAttribute("data-code") === cur);
        }
    }

    function togglePanel(open) {
        var willOpen = (typeof open === "boolean") ? open : !panel.classList.contains("open");
        panel.classList.toggle("open", willOpen);
    }

    /* ---- 4. events ---- */
    fab.addEventListener("click", function (e) { e.stopPropagation(); togglePanel(); });
    panel.querySelector("#gt-close").addEventListener("click", function () { togglePanel(false); });
    panel.addEventListener("click", function (e) {
        var li = e.target.closest("li[data-code]");
        if (li) applyLang(li.getAttribute("data-code"));
    });
    document.addEventListener("click", function (e) {
        if (!panel.contains(e.target) && e.target !== fab) togglePanel(false);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") togglePanel(false); });

    markActive();

    /* ---- 5. load the free Google Translate engine ---- */
    window.googleTranslateElementInit = function () {
        new google.translate.TranslateElement(
            { pageLanguage: "en", autoDisplay: false }, "google_translate_element");
    };
    var s = document.createElement("script");
    s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.defer = true;
    document.body.appendChild(s);
})();
