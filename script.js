(function () {
  const DISCOUNT_CODE = 'TEAM10';
  const DEFAULT_COUNTDOWN = '06:42:00';
  const COUNTDOWN_STORAGE_KEY = 'ironskin-countdown-end';
  const SHOPIFY_DOMAIN = window.SHOPIFY_DOMAIN || 'https://yourshop.myshopify.com';

  const formatCountdown = (milliseconds) => {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours >= 1) {
      return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}min`;
    }
    return `${String(minutes).padStart(2, '0')}min ${String(seconds).padStart(2, '0')}s`;
  };

  const parseTimerToMs = (timer) => {
    const [hours = '0', minutes = '0', seconds = '0'] = timer.split(':');
    return (Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)) * 1000;
  };

  const getCountdownDeadline = (durationMs) => {
    try {
      const stored = window.localStorage.getItem(COUNTDOWN_STORAGE_KEY);
      if (stored) {
        const value = Number(stored);
        if (!Number.isNaN(value) && value > Date.now()) {
          return value;
        }
      }
    } catch (error) {
      console.warn('LocalStorage inaccessible', error);
    }
    const deadline = Date.now() + durationMs;
    try {
      window.localStorage.setItem(COUNTDOWN_STORAGE_KEY, String(deadline));
    } catch (error) {
      console.warn('Impossible de stocker le compte à rebours', error);
    }
    return deadline;
  };

  const initCountdowns = () => {
    const bars = document.querySelectorAll('.promo-bar');
    if (!bars.length) return;
    const durationMs = parseTimerToMs(bars[0].dataset.timer || DEFAULT_COUNTDOWN);
    let deadline = getCountdownDeadline(durationMs);

    const update = () => {
      const remaining = deadline - Date.now();
      const label = formatCountdown(remaining);
      document.querySelectorAll('#promo-timer').forEach((el) => {
        el.textContent = label;
      });
      if (remaining <= 0) {
        deadline = Date.now() + durationMs;
        try {
          window.localStorage.setItem(COUNTDOWN_STORAGE_KEY, String(deadline));
        } catch (error) {
          console.warn('Impossible de réinitialiser le timer', error);
        }
      }
    };

    update();
    setInterval(update, 1000);
  };

  const smoothScroll = (target) => {
    if (!target) return;
    const element = document.querySelector(target);
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const initScrollLinks = () => {
    document.querySelectorAll('a[href^="#"], [data-scroll]').forEach((link) => {
      const target = link.dataset.scroll || link.getAttribute('href');
      if (!target || target === '#') return;
      link.addEventListener('click', (event) => {
        const isSamePageAnchor = target.startsWith('#');
        if (!isSamePageAnchor) return;
        event.preventDefault();
        smoothScroll(target);
      });
    });
  };

  const toggleStickyCart = () => {
    const sticky = document.getElementById('sticky-cart');
    const hero = document.getElementById('hero') || document.getElementById('top');
    if (!sticky || !hero) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            sticky.classList.remove('visible');
          } else {
            sticky.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(hero);
  };

  const addToCartUrl = (variantId, quantity = 1) => {
    if (!variantId) return null;
    const sanitizedDomain = SHOPIFY_DOMAIN.endsWith('/') ? SHOPIFY_DOMAIN.slice(0, -1) : SHOPIFY_DOMAIN;
    if (!sanitizedDomain || sanitizedDomain.includes('yourshop')) {
      console.warn('Définis SHOPIFY_DOMAIN pour activer le checkout.');
      return null;
    }
    let url = `${sanitizedDomain}/cart/${variantId}:${quantity}`;
    if (DISCOUNT_CODE) {
      url += `?discount=${encodeURIComponent(DISCOUNT_CODE)}`;
    }
    return url;
  };

  const handlePackButtons = () => {
    document.querySelectorAll('.pack-card .pack-cta').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.pack-card');
        const variantId = card?.dataset.variant;
        const url = addToCartUrl(variantId);
        if (url) {
          window.open(url, '_blank');
        } else {
          alert('Connecte la boutique Shopify pour finaliser la commande.');
        }
      });
    });
  };

  const initAccordions = () => {
    document.querySelectorAll('[data-accordion]').forEach((accordion) => {
      const items = accordion.querySelectorAll('.accordion-item');
      items.forEach((item) => {
        const trigger = item.querySelector('.accordion-trigger');
        trigger?.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          items.forEach((i) => i.classList.remove('active'));
          if (!isActive) {
            item.classList.add('active');
          }
        });
      });
      const first = items[0];
      if (first) first.classList.add('active');
    });
  };

  const initProductPage = () => {
    const productForm = document.querySelector('.product-form');
    if (!productForm) return;

    const mainImage = document.getElementById('product-main');
    const priceValue = document.getElementById('product-price');
    const thumbs = document.querySelectorAll('.product-thumbs .thumb');

    productForm.querySelectorAll('.option-button').forEach((button) => {
      button.addEventListener('click', () => {
        productForm.querySelectorAll('.option-button').forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');
        const thumb = document.querySelector(`.product-thumbs .thumb[data-color="${button.dataset.value}"]`);
        if (mainImage && thumb) {
          thumbs.forEach((t) => t.classList.remove('active'));
          thumb.classList.add('active');
          mainImage.src = thumb.dataset.image;
          mainImage.alt = `IronGrip ${thumb.dataset.color}`;
        }
      });
    });

    productForm.querySelectorAll('.option-card input[type="radio"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        const price = radio.dataset.price;
        if (priceValue && price) {
          priceValue.textContent = `${Number(price).toFixed(2).replace('.', ',')} €`;
        }
      });
    });

    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        thumbs.forEach((t) => t.classList.remove('active'));
        thumb.classList.add('active');
        if (mainImage) {
          mainImage.src = thumb.dataset.image;
          mainImage.alt = `IronGrip ${thumb.dataset.color}`;
        }
      });
    });

    productForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const selected = productForm.querySelector('input[name="pack"]:checked');
      const variantId = selected?.dataset.variant;
      const url = addToCartUrl(variantId);
      if (url) {
        window.open(url, '_blank');
      } else {
        alert('Configure ton domaine Shopify pour activer ce bouton.');
      }
    });
  };

  const initPlaceholders = () => {
    document.querySelectorAll('form[data-shopify-tracking], form[data-shopify-login]').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Connecte ce formulaire à Shopify pour le rendre fonctionnel.');
      });
    });
  };

  const setCurrentYear = () => {
    const yearElements = document.querySelectorAll('#current-year');
    yearElements.forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    initCountdowns();
    initScrollLinks();
    toggleStickyCart();
    handlePackButtons();
    initAccordions();
    initProductPage();
    initPlaceholders();
    setCurrentYear();
  });
})();
