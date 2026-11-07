import { initContactForm } from './contact-form';
import { createWorkflowIndicator } from './workflow-indicator';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const mobile = window.matchMedia('(max-width: 760px)');
const lang = document.documentElement.lang;
const ease = 'cubic-bezier(.22,1,.36,1)';

// Section links navigate; briefly acknowledge a phone tap without a lasting selection.
let sectionFeedback;
for (const link of document.querySelectorAll('.article-index a')) {
  link.addEventListener('click', event => {
    if (!mobile.matches || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    sectionFeedback?.cancel();
    sectionFeedback = link.animate([{ backgroundColor: '#c8eb65' }, { backgroundColor: '#ffffff' }], { duration: reduced.matches ? 140 : 260, easing: ease });
  });
}
mobile.addEventListener('change', () => sectionFeedback?.cancel());

// Old public hash URLs remain usable in the local static route structure.
if (location.hash.startsWith('#/')) {
  const old = decodeURIComponent(location.hash.slice(2));
  const [path, query = ''] = old.split('?');
  const [key, service] = path.split('/');
  const mapping = { services: 'leistungen', wissen: 'leistungen', quality: 'qualitaet', laboratories: 'labore', about: 'ueber-mich', contact: 'kontakt' };
  if (!key || mapping[key]) location.replace((key ? '/' + mapping[key] + (service ? '/' + service : '') + '/' : '/') + (query ? '?' + query : ''));
}

const menu = document.querySelector('#menu-dialog');
const menuToggle = document.querySelector('#menu-toggle');
const sheet = menu?.querySelector('.menu-sheet');
let menuAnimation;
let opening = false;

function closeMenu() {
  if (!menu?.open || !sheet || opening) return;
  opening = true;
  menuAnimation?.cancel();
  const finish = () => {
    menu.close();
    document.body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.focus({ preventScroll: true });
    opening = false;
  };
  if (reduced.matches) return finish();
  menuAnimation = sheet.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-102%)' }], { duration: 240, easing: ease, fill: 'forwards' });
  menuAnimation.finished.then(finish).catch(() => { opening = false; });
}

menuToggle?.addEventListener('click', () => {
  if (!menu || !sheet || menu.open) return;
  // A previous close animation must not keep the sheet translated offscreen.
  menuAnimation?.cancel();
  menu.showModal();
  document.body.classList.add('menu-open');
  menuToggle.setAttribute('aria-expanded', 'true');
  if (!reduced.matches) {
    menuAnimation = sheet.animate([{ transform: 'translateY(-102%)' }, { transform: 'translateY(0)' }], { duration: 440, easing: 'cubic-bezier(.16,1,.3,1)' });
    menu.querySelectorAll('.menu-link').forEach((link, n) => link.animate([{ transform: 'translateY(-20px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 300, delay: 110 + n * 38, easing: ease, fill: 'backwards' }));
  }
  menu.querySelector('.menu-close')?.focus({ preventScroll: true });
});
menu?.querySelector('.menu-close')?.addEventListener('click', closeMenu);
menu?.addEventListener('cancel', event => { event.preventDefault(); closeMenu(); });

// A bounded magnetic interaction: only transform a button after the pointer is inside it.
for (const button of document.querySelectorAll('.magnetic')) {
  let frame = 0;
  let bounds;
  let nextX = 0;
  let nextY = 0;
  const reset = () => { cancelAnimationFrame(frame); frame = 0; button.style.transform = ''; bounds = undefined; };
  button.addEventListener('pointerenter', () => { if (pointer.matches && !reduced.matches) bounds = button.getBoundingClientRect(); });
  button.addEventListener('pointermove', event => {
    if (!pointer.matches || reduced.matches || !bounds || event.pointerType === 'touch') return;
    nextX = Math.max(-6, Math.min(6, (event.clientX - bounds.left - bounds.width / 2) * .13));
    nextY = Math.max(-5, Math.min(5, (event.clientY - bounds.top - bounds.height / 2) * .13));
    if (!frame) frame = requestAnimationFrame(() => { button.style.transform = `translate(${nextX}px,${nextY}px)`; frame = 0; });
  });
  button.addEventListener('pointerleave', reset);
  button.addEventListener('blur', reset);
  button.addEventListener('pointerdown', () => { if (!reduced.matches) button.animate([{ opacity: 1 }, { opacity: .8 }, { opacity: 1 }], { duration: 140 }); });
  reduced.addEventListener('change', reset);
}

// Enhance a complete, readable no-script workflow into a keyboard-operable tab interface.
for (const workflow of document.querySelectorAll('[data-workflow]')) {
  const tabs = [...workflow.querySelectorAll('[data-step]')];
  const panels = [...workflow.querySelectorAll('[data-panel]')];
  const tablist = workflow.querySelector('.workflow-tabs');
  if (!tablist) continue;
  tablist.hidden = false;
  workflow.classList.add('enhanced');
  const moveIndicator = createWorkflowIndicator(tablist, tabs, reduced, mobile);
  function select(index, focus = false, persist = true) {
    tabs.forEach((tab, n) => { tab.setAttribute('aria-selected', String(n === index)); tab.tabIndex = n === index ? 0 : -1; });
    moveIndicator(tabs[index], persist && !focus);
    panels.forEach((panel, n) => {
      panel.hidden = n !== index;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tabs[n].id);
      panel.tabIndex = 0;
    });
    if (!reduced.matches && persist && !focus) panels[index].animate([{ opacity: .2, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 240, easing: ease });
    if (focus) tabs[index].focus({ preventScroll: true });
    if (persist) { const url = new URL(location.href); url.searchParams.set('ablauf', String(index + 1)); history.replaceState(null, '', url); }
  }
  const initial = Number(new URL(location.href).searchParams.get('ablauf') || 1) - 1;
  select(Number.isInteger(initial) && initial >= 0 && initial < tabs.length ? initial : 0, false, false);
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); select(next, true); }
    });
  });
}

// Preserve the original desktop entrances; phone content stays visible on scroll.
if (!reduced.matches) {
  // The header arrives from the same upper edge as the menu; brief, once per page.
  document.querySelectorAll('.header-inner > .wordmark, .header-actions').forEach((element, index) => { element.style.animationDelay = `${index * 45}ms`; element.classList.add('header-arrive'); });
  const hero = document.querySelector('[data-hero-title]');
  hero?.classList.add('hero-arrive');
  document.querySelector('.hero-photo img')?.classList.add('photo-arrive');
}
const revealTargets = [...document.querySelectorAll('[data-reveal]')];
const revealed = new WeakSet();
let revealObserver;
function syncScrollEntrances() {
  revealObserver?.disconnect();
  if (mobile.matches || reduced.matches) {
    revealTargets.forEach(target => {
      target.classList.remove('arrive-rise', 'arrive-side');
      target.style.removeProperty('animation-delay');
    });
    return;
  }
  revealObserver = new IntersectionObserver(entries => {
    let stagger = 0;
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const target = entry.target;
      target.style.animationDelay = `${stagger++ * 55}ms`;
      target.classList.add(target.dataset.reveal === 'side' ? 'arrive-side' : 'arrive-rise');
      revealed.add(target);
      revealObserver.unobserve(target);
    }
  }, { threshold: .16 });
  revealTargets.filter(target => !revealed.has(target)).forEach(target => revealObserver.observe(target));
}
syncScrollEntrances();
mobile.addEventListener('change', syncScrollEntrances);
reduced.addEventListener('change', syncScrollEntrances);
reduced.addEventListener('change', () => { if (reduced.matches) document.getAnimations().forEach(animation => animation.finish()); });

initContactForm(document.querySelector('[data-contact-form]'), lang);
const plume = document.querySelector('.map-check input');
plume?.addEventListener('change', () => document.querySelectorAll('.plume-map').forEach(element => { element.style.opacity = plume.checked ? '1' : '0'; }));
