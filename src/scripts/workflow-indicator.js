// A shared underline follows the active workflow step on every screen size.
export function createWorkflowIndicator(tablist, tabs, reduced, mobile) {
  const indicator = document.createElement('span');
  indicator.className = 'workflow-indicator';
  indicator.setAttribute('aria-hidden', 'true');
  tablist.prepend(indicator);
  tablist.classList.add('has-indicator');
  const forced = window.matchMedia('(forced-colors: active)');
  let selected = tabs[0];
  let animation;
  let placed = false;

  function place(tab = selected, animate = false, fromResize = false) {
    selected = tab;
    if (forced.matches) {
      animation?.cancel();
      placed = false;
      return;
    }
    const previous = placed ? indicator.getBoundingClientRect() : null;
    const target = tab.getBoundingClientRect();
    const parent = tablist.getBoundingClientRect();
    const inset = mobile.matches ? 8 : 20;
    const targetLeft = target.left + inset;
    const targetTop = target.bottom - 3;
    const targetWidth = target.width - 2 * inset;
    const targetHeight = 2;
    const box = {
      left: targetLeft - parent.left - tablist.clientLeft + tablist.scrollLeft,
      top: targetTop - parent.top - tablist.clientTop + tablist.scrollTop,
      width: targetWidth,
      height: targetHeight
    };
    // Bold selection changes tab widths. Its ResizeObserver notification must not
    // cancel the spring when the destination was already measured by the click.
    if (fromResize && placed && Object.entries(box).every(([key, value]) => Math.abs(parseFloat(indicator.style[key]) - value) < .1)) return;
    const continueMotion = animate || (fromResize && animation?.playState === 'running');
    animation?.cancel();
    Object.entries(box).forEach(([key, value]) => { indicator.style[key] = `${value}px`; });
    placed = true;
    if (!continueMotion || reduced.matches || !previous) return;
    const x = previous.left - targetLeft;
    const y = previous.top - targetTop;
    const sx = previous.width / targetWidth - 1;
    const sy = previous.height / targetHeight - 1;
    if (Math.abs(x) + Math.abs(y) + Math.abs(sx) + Math.abs(sy) < .1) return;

    // A short, underdamped spring overshoots by about 8.5%, then settles.
    // Only transform animates; sizing is assigned once at the destination.
    const frames = Array.from({ length: 41 }, (_, n) => {
      const t = n / 40;
      const remaining = n === 40 ? 0 : Math.exp(-4.2 * t) * (Math.cos(5.35 * t) + (4.2 / 5.35) * Math.sin(5.35 * t));
      return { offset: t, transform: `translate(${x * remaining}px,${y * remaining}px) scale(${1 + sx * remaining},${1 + sy * remaining})` };
    });
    animation = indicator.animate(frames, { duration: 280, easing: 'linear' });
  }

  // Reposition on font/layout changes, never with a per-frame measurement loop.
  const resize = new ResizeObserver(() => place(selected, false, true));
  resize.observe(tablist);
  tabs.forEach(tab => resize.observe(tab));
  document.fonts.ready.then(() => place(selected, false, true));
  [mobile, reduced, forced].forEach(media => media.addEventListener('change', () => place()));
  return place;
}
