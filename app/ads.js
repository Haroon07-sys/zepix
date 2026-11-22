/* Zapix ads (Adsterra banners). Paste your Adsterra banner code below, then set enabled: true.
   - Banners show in the page slots.
   - In the app, a banner popup shows every 7-8 channel changes (never a redirect).
   Each ad runs in its own frame, and Zapix never redirects the page itself. */
(function () {
  var CONFIG = {
    enabled: true,
    every: [4, 6],            // popup appears after this many channel changes (random 7 or 8)
    closeDelay: 3,            // seconds before the popup's Close button works

    // Paste the FULL code Adsterra gives you (the <script>...</script> block) between the backticks.
    // w/h = the banner size you picked in Adsterra. "mobile" is optional (used under 740px wide).
    top:    { w: 728, h: 90,  code: `<script>atOptions = {'key' : '9b5e043a9c71a81a9d337300b5120c50','format' : 'iframe','height' : 90,'width' : 728,'params' : {}};</scr`+`ipt><script src="https://bancadeltempoidea.org/22/9b5e043a9c71a81a9d337300b5120c50"></scr`+`ipt>`, mobile: { w: 320, h: 50, code: `<script>atOptions = {'key' : '314da34cd8260f9457a8a1f43890d701','format' : 'iframe','height' : 50,'width' : 320,'params' : {}};</scr`+`ipt><script src="https://bancadeltempoidea.org/22/314da34cd8260f9457a8a1f43890d701"></scr`+`ipt>` } },
    bottom: { w: 728, h: 90,  code: `<script>atOptions = {'key' : '9b5e043a9c71a81a9d337300b5120c50','format' : 'iframe','height' : 90,'width' : 728,'params' : {}};</scr`+`ipt><script src="https://bancadeltempoidea.org/22/9b5e043a9c71a81a9d337300b5120c50"></scr`+`ipt>`, mobile: { w: 320, h: 50, code: `<script>atOptions = {'key' : '314da34cd8260f9457a8a1f43890d701','format' : 'iframe','height' : 50,'width' : 320,'params' : {}};</scr`+`ipt><script src="https://bancadeltempoidea.org/22/314da34cd8260f9457a8a1f43890d701"></scr`+`ipt>` } },
    popup:  { w: 300, h: 250, code: `<script>atOptions = {'key' : '586d5bc0a491848809d29cfc9aeb75af','format' : 'iframe','height' : 250,'width' : 300,'params' : {}};</scr`+`ipt><script src="https://bancadeltempoidea.org/22/586d5bc0a491848809d29cfc9aeb75af"></scr`+`ipt>` }
  };

  var inApp = /; wv\)|Zapix\//.test(navigator.userAgent) || !!window.ZAPIX_APP;
  var slots = document.querySelectorAll(".zx-ad");
  function hideSlots() { for (var i = 0; i < slots.length; i++) slots[i].style.display = "none"; }

  function frame(cfg) {
    var f = document.createElement("iframe");
    f.width = cfg.w; f.height = cfg.h;
    f.style.cssText = "border:0;display:block;margin:0 auto;max-width:100%";
    f.setAttribute("scrolling", "no");
    f.setAttribute("referrerpolicy", "unsafe-url"); // lets Adsterra see your real site address
    f.srcdoc = '<!doctype html><html><body style="margin:0;background:transparent">' + cfg.code + "</body></html>";
    return f;
  }
  function pick(cfg) {
    var m = cfg.mobile;
    return (window.innerWidth < 740 && m && m.code) ? m : cfg;
  }

  if (!CONFIG.enabled || inApp) { hideSlots(); return; }

  for (var i = 0; i < slots.length; i++) {
    var cfg = CONFIG[slots[i].getAttribute("data-slot")];
    if (!cfg) { slots[i].style.display = "none"; continue; }
    var use = pick(cfg);
    if (!use.code) { slots[i].style.display = "none"; continue; }
    slots[i].appendChild(frame(use));
  }

  // Popup ad every 7-8 channel changes (app only: it calls window.zxAdSwitch)
  if (!CONFIG.popup.code) return;
  var count = 0, limit = 0, shown = false;
  function nextLimit() { var a = CONFIG.every; limit = a[0] + Math.floor(Math.random() * (a[1] - a[0] + 1)); }
  nextLimit();

  var css = document.createElement("style");
  css.textContent =
    ".zx-pop{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.78);display:flex;align-items:center;justify-content:center;padding:16px}" +
    ".zx-pop-box{background:#0e1424;border:1px solid rgba(255,255,255,.14);border-radius:16px;padding:14px;max-width:100%;text-align:center;color:#8592ab;font:600 11px/1 system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase}" +
    ".zx-pop-box iframe{margin:10px auto 12px}" +
    ".zx-pop-close{font:700 14px/1 system-ui,sans-serif;letter-spacing:0;text-transform:none;padding:11px 20px;border-radius:999px;border:0;background:#19c37d;color:#fff;cursor:pointer}" +
    ".zx-pop-close[disabled]{background:#2a3350;color:#8592ab;cursor:default}";
  document.head.appendChild(css);

  function showPopup() {
    shown = true;
    var o = document.createElement("div"); o.className = "zx-pop";
    var b = document.createElement("div"); b.className = "zx-pop-box";
    b.appendChild(document.createTextNode("Advertisement"));
    b.appendChild(frame(CONFIG.popup));
    var btn = document.createElement("button"); btn.className = "zx-pop-close"; btn.disabled = true;
    b.appendChild(btn); o.appendChild(b); document.body.appendChild(o);
    var left = CONFIG.closeDelay;
    function tick() {
      if (left > 0) { btn.textContent = "Close in " + left; left--; setTimeout(tick, 1000); }
      else { btn.textContent = "Close"; btn.disabled = false; }
    }
    tick();
    function close() { if (btn.disabled) return; o.remove(); shown = false; document.removeEventListener("keydown", esc); }
    function esc(e) { if (e.key === "Escape") close(); }
    btn.onclick = close; document.addEventListener("keydown", esc);
  }

  window.zxAdSwitch = function () {
    if (shown) return;
    count++;
    if (count >= limit) { count = 0; nextLimit(); showPopup(); }
  };
})();
