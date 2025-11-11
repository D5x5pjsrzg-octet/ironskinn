const SCROLL_DURATION = 600;
const promoDurationMs = (5 * 60 + 42) * 60 * 1000; // 5h 42min
const checkoutLinks = {
  solo: 'https://buy.stripe.com/test_6oE7vjeBDc1g7ZSeUU',
  duo: 'https://buy.stripe.com/test_dR68yZfjx4cw2h66oo',
  'his-her': 'https://buy.stripe.com/test_bIY6qZ9hT07YdWocMN',
};

let promoCodeApplied = null;

const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

function smoothScrollTo(target) {
  const element = document.querySelector(target);
  if (!element) return;
  const start = window.scrollY || window.pageYOffset;
  const rect = element.getBoundingClientRect();
  const targetY = rect.top + start - 80;
  const startTime = performance.now();

  function scroll() {
    const now = performance.now();
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / SCROLL_DURATION, 1);
    const eased = easeInOutQuad(progress);
    window.scrollTo(0, start + (targetY - start) * eased);
    if (elapsed < SCROLL_DURATION) requestAnimationFrame(scroll);
  }
  requestAnimationFrame(scroll);
}

function updateTimer(deadline) {
  const timerEl = document.getElementById('promo-timer');
  if (!timerEl) return;

  const interval = setInterval(() => {
    const now = Date.now();
    const diff = Math.max(0, deadline - now);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    timerEl.textContent = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}min ${String(seconds).padStart(2, '0')}s`;

    if (diff <= 0) {
      clearInterval(interval);
      const newDeadline = Date.now() + promoDurationMs;
      updateTimer(newDeadline);
    }
  }, 1000);
}

function applyPromoCode(inputValue) {
  const promoMessage = document.getElementById('promo-message');
  const normalized = inputValue.trim().toUpperCase();
  if (!promoMessage) return;

  if (normalized === 'TEAM10') {
    promoCodeApplied = normalized;
    promoMessage.textContent = 'Code TEAM10 appliqué : -10 % sur ton pack.';
    promoMessage.style.color = 'var(--color-accent)';
    updateDisplayedPrices(0.9);
  } else if (normalized.length) {
    promoCodeApplied = null;
    promoMessage.textContent = 'Code invalide. Essaie TEAM10.';
    promoMessage.style.color = '#f87171';
    updateDisplayedPrices(1);
  } else {
    promoCodeApplied = null;
    promoMessage.textContent = '';
    promoMessage.style.color = '';
    updateDisplayedPrices(1);
  }
}

function updateDisplayedPrices(multiplier) {
  document.querySelectorAll('.pack-price').forEach((priceEl) => {
    const base = parseFloat(priceEl.dataset.basePrice);
    const finalPrice = (base * multiplier).toFixed(2).replace('.', ',');
    priceEl.textContent = `${finalPrice} €`;
  });
}

function initPromo() {
  const promoInput = document.getElementById('promo-input');
  const promoButton = document.getElementById('apply-promo');
  if (!promoInput || !promoButton) return;

  promoButton.addEventListener('click', () => applyPromoCode(promoInput.value));
  promoInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      applyPromoCode(promoInput.value);
    }
  });
}

function initCheckoutButtons() {
  document.querySelectorAll('.pack-cta').forEach((button) => {
    button.addEventListener('click', () => {
      const plan = button.dataset.plan;
      const baseUrl = checkoutLinks[plan];
      if (!baseUrl) return;
      const url = new URL(baseUrl);
      if (promoCodeApplied) {
        url.searchParams.set('prefilled_promo_code', promoCodeApplied);
      }
      window.open(url.toString(), '_blank');
    });
  });
}

function initScrollTriggers() {
  document.querySelectorAll('[data-scroll]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const target = trigger.getAttribute('data-scroll');
      smoothScrollTo(target);
    });
  });
}

function initStickyCart() {
  const stickyCart = document.getElementById('sticky-cart');
  const packsSection = document.getElementById('packs');
  if (!stickyCart || !packsSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          stickyCart.classList.add('hidden');
        } else {
          stickyCart.classList.remove('hidden');
        }
      });
    },
    {
      threshold: 0.35,
    }
  );

  observer.observe(packsSection);
}

function setCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const deadline = Date.now() + promoDurationMs;
  updateTimer(deadline);
  initPromo();
  initCheckoutButtons();
  initScrollTriggers();
  initStickyCart();
  setCurrentYear();
});
