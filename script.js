/**
 * Altai Jet Boat — Landing Page Scripts
 * Handles: scroll reveal, nav state, parallax, mobile menu, video embeds
 */

(function () {
  'use strict';

  /* ----------------------------------------------------------------
     1. NAVIGATION — scroll state + mobile menu
  ---------------------------------------------------------------- */
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile-menu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  function updateNav() {
    if (!nav) return;
    const isScrolled = window.scrollY > 40;
    nav.classList.toggle('nav--scrolled', isScrolled);
    nav.classList.toggle('nav--hero', !isScrolled);
  }

  function toggleMenu() {
    if (!hamburger || !mobileMenu) return;
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', String(isOpen));
  }

  function closeMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  if (hamburger) hamburger.addEventListener('click', toggleMenu);
  mobileLinks.forEach(function (link) { link.addEventListener('click', closeMenu); });

  /* ----------------------------------------------------------------
     2. SCROLL REVEAL — IntersectionObserver
  ---------------------------------------------------------------- */
  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything immediately
      document.querySelectorAll('[data-reveal]').forEach(function (el) {
        el.classList.add('revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    );

    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------------
     3. PARALLAX — subtle on media banners
  ---------------------------------------------------------------- */
  var parallaxItems = [];

  function initParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.querySelectorAll('.media-banner--parallax .media-banner__media').forEach(function (el) {
      parallaxItems.push(el);
    });
  }

  function tickParallax() {
    if (!parallaxItems.length) return;
    var scrollY = window.scrollY;
    parallaxItems.forEach(function (el) {
      var rect = el.closest('.media-banner').getBoundingClientRect();
      var center = rect.top + rect.height / 2;
      var viewCenter = window.innerHeight / 2;
      var offset = (center - viewCenter) * 0.18;
      el.style.transform = 'translateY(' + offset + 'px)';
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        tickParallax();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ----------------------------------------------------------------
     UTILITY — validate a URL is safe (https or protocol-relative)
  ---------------------------------------------------------------- */
  function isSafeUrl(url) {
    if (typeof url !== 'string') return false;
    // Only allow https:// and protocol-relative //
    return /^https:\/\//i.test(url) || /^\/\//i.test(url);
  }

  /* ----------------------------------------------------------------
     4. VIDEO PLAY BUTTON — poster → play
  ---------------------------------------------------------------- */
  function initVideoEmbeds() {
    document.querySelectorAll('.video-embed').forEach(function (embed) {
      var playBtn = embed.querySelector('.video-embed__play-btn');
      var iframe = embed.querySelector('.video-embed__iframe');
      var video = embed.querySelector('.video-embed__video');

      if (!playBtn) return;

      playBtn.addEventListener('click', function () {
        embed.classList.add('playing');

        if (iframe) {
          // Append autoplay param to src — validate URL before assigning
          var src = iframe.getAttribute('data-src') || iframe.src;
          if (src && isSafeUrl(src)) {
            if (src.indexOf('autoplay') === -1) {
              src += (src.indexOf('?') > -1 ? '&' : '?') + 'autoplay=1';
            }
            iframe.src = src;
          }
        }

        if (video) {
          video.play().catch(function () {});
        }
      });
    });
  }

  /* ----------------------------------------------------------------
     5. HERO VIDEO — autoplay with fallback
  ---------------------------------------------------------------- */
  function initHeroVideo() {
    var heroVideo = document.querySelector('.hero__video');
    if (!heroVideo) return;

    heroVideo.muted = true;
    heroVideo.playsInline = true;

    var playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(function () {
        // Autoplay blocked — show fallback image
        var fallback = document.querySelector('.hero__image-fallback');
        if (fallback) fallback.style.display = 'block';
        heroVideo.style.display = 'none';
      });
    }
  }

  /* ----------------------------------------------------------------
     6. LAZY LOADING — native + polyfill
  ---------------------------------------------------------------- */
  function initLazyLoad() {
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading: swap data-src to src
      document.querySelectorAll('img[data-src]').forEach(function (img) {
        var dataSrc = img.getAttribute('data-src');
        if (dataSrc && isSafeUrl(dataSrc)) {
          img.src = dataSrc;
        }
        img.removeAttribute('data-src');
        img.loading = 'lazy';
      });
    } else {
      // Fallback: IntersectionObserver-based lazy load
      if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('img[data-src]').forEach(function (img) {
          var dataSrc = img.getAttribute('data-src');
          if (dataSrc && isSafeUrl(dataSrc)) {
            img.src = dataSrc;
          }
        });
        return;
      }
      var imgObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            var dataSrc = img.getAttribute('data-src');
            if (dataSrc && isSafeUrl(dataSrc)) {
              img.src = dataSrc;
            }
            img.removeAttribute('data-src');
            obs.unobserve(img);
          }
        });
      }, { rootMargin: '200px' });

      document.querySelectorAll('img[data-src]').forEach(function (img) {
        imgObserver.observe(img);
      });
    }
  }

  /* ----------------------------------------------------------------
     7. SMOOTH SCROLL for anchor links (supplementary)
  ---------------------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        var offset = (nav ? nav.offsetHeight : 0) + 24;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
        closeMenu();
      });
    });
  }

  /* ----------------------------------------------------------------
     8. COUNTER ANIMATION for stats
  ---------------------------------------------------------------- */
  function animateCounters() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var duration = 1400;
        var start = null;
        var isDecimal = target % 1 !== 0;

        function step(timestamp) {
          if (!start) start = timestamp;
          var progress = Math.min((timestamp - start) / duration, 1);
          var ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
          var current = target * ease;
          el.textContent = isDecimal ? current.toFixed(1) : Math.round(current).toLocaleString();
          if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ----------------------------------------------------------------
     9. INIT
  ---------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initParallax();
    initVideoEmbeds();
    initHeroVideo();
    initLazyLoad();
    initSmoothScroll();
    animateCounters();
  });

})();
