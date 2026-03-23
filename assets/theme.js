document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-scroll-target]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      const selector = trigger.getAttribute('data-scroll-target');
      const target = selector ? document.querySelector(selector) : null;
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
  }, { threshold: 0.14 }) : null;

  document.querySelectorAll('.reveal-on-scroll').forEach((item) => {
    if (observer) observer.observe(item);
    else item.classList.add('is-visible');
  });

  const announce = document.querySelector('[data-announcement-countdown]');
  if (announce) {
    const deadline = Date.now() + Number(announce.dataset.duration || 172800000);
    const format = (ms) => {
      const total = Math.max(0, Math.floor(ms / 1000));
      const d = Math.floor(total / 86400);
      const h = Math.floor((total % 86400) / 3600);
      const m = Math.floor((total % 3600) / 60);
      return `${d}j ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m`;
    };
    const tick = () => { announce.textContent = format(deadline - Date.now()); };
    tick();
    setInterval(tick, 60000);
  }
});
