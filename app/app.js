/* FlipSight HUD logic.
   v1: local deal deck, button / keyboard / swipe navigation.
   Integration points for the Meta Wearables Web Apps runtime are marked
   TODO(wearables) — fill from the Wearables Developer Center API reference. */
(function () {
  "use strict";

  var deals = [];
  var index = 0;

  var el = {
    tier: document.getElementById("tier"),
    counter: document.getElementById("counter"),
    title: document.getElementById("title"),
    ask: document.getElementById("ask"),
    market: document.getElementById("market"),
    margin: document.getElementById("margin"),
    meta: document.getElementById("meta"),
    why: document.getElementById("why"),
    prev: document.getElementById("prev"),
    next: document.getElementById("next"),
  };

  function tierClass(tier) {
    return tier.toLowerCase().replace(/\s+/g, "-"); // "GOOD DEAL" -> "good-deal"
  }

  function render() {
    if (!deals.length) return;
    var d = deals[index];
    el.tier.textContent = d.tier;
    el.tier.className = "badge " + tierClass(d.tier);
    el.counter.textContent = (index + 1) + " / " + deals.length;
    el.title.textContent = d.title;
    el.ask.textContent = "$" + d.price;
    el.market.textContent = "$" + d.market;
    var margin = d.market - d.price;
    el.margin.textContent = (margin >= 0 ? "+$" : "-$") + Math.abs(margin);
    el.meta.textContent =
      d.distance_mi + " mi · " + d.location + " · " + d.condition + " · score " + d.score;
    el.why.textContent = d.why + " — " + d.seller_note + ".";
  }

  function go(n) {
    if (!deals.length) return;
    index = (n + deals.length) % deals.length;
    render();
  }

  // --- Input: buttons now; Neural Band gestures when the runtime API lands ---
  el.prev.addEventListener("click", function () { go(index - 1); });
  el.next.addEventListener("click", function () { go(index + 1); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") go(index - 1);
    if (e.key === "ArrowRight") go(index + 1);
  });
  var touchX = null;
  document.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    touchX = null;
  }, { passive: true });

  // TODO(wearables): Neural Band gesture -> go(index ± 1).
  // TODO(wearables): phone GPS -> sort deals by distance_mi live.
  // TODO(wearables): localStorage is available in the Web Apps runtime —
  //   persist last-viewed index across sessions.

  // --- Data: embedded copy first (works over file://), then try live JSON ---
  function boot(data) {
    deals = (data && data.deals) || [];
    // Highest score first — the HUD leads with the best deal.
    deals.sort(function (a, b) { return b.score - a.score; });
    render();
  }

  if (window.FLIPSIGHT_DEALS) boot(window.FLIPSIGHT_DEALS);
  fetch("../data/deals.json")
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (json) { if (json) boot(json); })
    .catch(function () { /* file:// fallback already booted */ });
})();
