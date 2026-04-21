/**
 * Remove `will-change` (and the `data-aos` attribute)
 * from elements that have finished their AOS reveal animation.
 *
 * Strategy:
 *   • Listen for the first `transitionstart` event on each element that
 *     carries the `.aos-animate` class.
 *   • When such an event fires, start a 700 ms timer.
 *   • After 700 ms remove the `will-change` declaration and the
 *     `data-aos` attribute – both are no longer needed.
 *
 * This script assumes the CSS you just added (see the previous step):
 *   [data-aos] { transition: opacity 0.6s cubic‑bezier(...), transform 0.6s cubic‑bezier(...); }
 *   .aos-animate { opacity:1; transform:translate3d(0,0,0); }
 */
(function () {
  // Keep track of timers so we can clear them if a new transitionstart fires
  let pendingTimeout = null;

  document.addEventListener('transitionstart', function (e) {
    // We only care about transitions that involve opacity or transform –
    // those are the ones we animated.
    if (!e.target.classList.contains('aos-animate')) return;

    // Cancel any previously‑pending timeout (in case of rapid fire)
    if (pendingTimeout) clearTimeout(pendingTimeout);

    // After 700 ms remove the will‑change declaration and the data‑aos attr
    pendingTimeout = setTimeout(function () {
      // Remove the performance hint – it’s no longer needed
      if (e.target.style.willChange) {
        e.target.style.willChange = 'auto';
      }
      // Remove the marker attribute so it won’t be processed again
      e.target.removeAttribute('data-aos');
    }, 700);
  });
})();
</script>