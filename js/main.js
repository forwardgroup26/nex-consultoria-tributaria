// ===== NEX Consultoria Tributária — interactions =====

document.addEventListener('DOMContentLoaded', () => {
  // Opening preloader
  const preloader = document.getElementById('preloader');
  if (preloader) {
    document.body.classList.add('preloading');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hidePreloader = () => {
      preloader.classList.add('done');
      document.body.classList.remove('preloading');
      setTimeout(() => preloader.remove(), 550);
    };
    if (reduceMotion) {
      hidePreloader();
    } else {
      setTimeout(hidePreloader, 750);
    }
  }

  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const closePanel = document.getElementById('closePanel');
  const mobilePanel = document.getElementById('mobilePanel');
  const scrim = document.getElementById('scrim');

  // Sticky nav background on scroll
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const openMenu = () => {
    mobilePanel.classList.add('open');
    scrim.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    mobilePanel.classList.remove('open');
    scrim.classList.remove('open');
    document.body.style.overflow = '';
  };
  navToggle?.addEventListener('click', openMenu);
  closePanel?.addEventListener('click', closeMenu);
  scrim?.addEventListener('click', closeMenu);
  mobilePanel?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Scroll reveal
  const revealEls = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));

  // Smooth-scroll anchor offset for fixed nav
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // Process timeline scroll-fill rail
  const processList = document.querySelector('.process-list');
  const processFill = document.getElementById('processFill');
  if (processList && processFill) {
    let ticking = false;
    const updateRail = () => {
      const rect = processList.getBoundingClientRect();
      const viewportMid = window.innerHeight * 0.65;
      const progress = (viewportMid - rect.top) / rect.height;
      const clamped = Math.max(0, Math.min(1, progress));
      processFill.style.height = (clamped * 100) + '%';
      ticking = false;
    };
    updateRail();
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateRail);
        ticking = true;
      }
    }, { passive: true });
    window.addEventListener('resize', updateRail);
  }

  // Solutions carousel — drag to explore
  const viewport = document.getElementById('carouselViewport');
  const progressFill = document.getElementById('carouselProgressFill');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  if (viewport) {
    let isDown = false;
    let startX = 0;
    let scrollLeftStart = 0;
    let moved = false;

    const pointerDown = (x) => {
      isDown = true;
      moved = false;
      startX = x;
      scrollLeftStart = viewport.scrollLeft;
      viewport.classList.add('dragging');
    };
    const pointerMove = (x) => {
      if (!isDown) return;
      const dx = x - startX;
      if (Math.abs(dx) > 5) moved = true;
      viewport.scrollLeft = scrollLeftStart - dx;
    };
    const pointerUp = () => {
      isDown = false;
      viewport.classList.remove('dragging');
    };

    viewport.addEventListener('mousedown', (e) => { pointerDown(e.clientX); e.preventDefault(); });
    window.addEventListener('mousemove', (e) => pointerMove(e.clientX));
    window.addEventListener('mouseup', pointerUp);
    viewport.addEventListener('touchstart', (e) => pointerDown(e.touches[0].clientX), { passive: true });
    viewport.addEventListener('touchmove', (e) => pointerMove(e.touches[0].clientX), { passive: true });
    viewport.addEventListener('touchend', pointerUp);

    // Prevent accidental navigation when the click was actually a drag
    viewport.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', (e) => {
        if (moved) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }, true);
    });

    const updateProgress = () => {
      const max = viewport.scrollWidth - viewport.clientWidth;
      const pct = max > 0 ? (viewport.scrollLeft / max) * 100 : 0;
      if (progressFill) progressFill.style.width = pct + '%';
    };
    updateProgress();
    viewport.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    const cardStep = () => {
      const card = viewport.querySelector('.carousel-card');
      if (!card) return 300;
      const style = window.getComputedStyle(viewport.querySelector('.carousel-track'));
      const gap = parseFloat(style.gap) || 22;
      return card.getBoundingClientRect().width + gap;
    };
    prevBtn?.addEventListener('click', () => viewport.scrollBy({ left: -cardStep(), behavior: 'smooth' }));
    nextBtn?.addEventListener('click', () => viewport.scrollBy({ left: cardStep(), behavior: 'smooth' }));
  }
});
