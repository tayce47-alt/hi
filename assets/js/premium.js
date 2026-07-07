(function () {
  'use strict';

  /* =============================================
     HELPERS
     ============================================= */
  function add(el, classes) {
    if (!el) return;
    classes.trim().split(/\s+/).forEach(function (c) { el.classList.add(c); });
  }

  function qs(sel) { return document.querySelector(sel); }
  function qsa(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  /* =============================================
     INTERSECTION OBSERVER — fires once per element
     ============================================= */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px'
  });

  function watch(el) { if (el) observer.observe(el); }

  /* =============================================
     SECTION ONE — content slides up, icons after
     ============================================= */
  function initSectionOne() {
    var h2 = qs('#one header.major h2');
    var p  = qs('#one header.major p');
    var icons = qs('#one .icons.major');

    add(h2,    'reveal heading delay-0');
    add(p,     'reveal para delay-2');
    add(icons, 'reveal from-up delay-4');

    watch(h2); watch(p); watch(icons);
  }

  /* =============================================
     SECTION TWO — spotlights: image floats in,
     heading slides, paragraph follows
     ============================================= */
  function initSectionTwo() {
    qsa('#two .spotlight').forEach(function (row, i) {
      var img     = row.querySelector('.image');
      var h2      = row.querySelector('.content h2');
      var p       = row.querySelector('.content p');
      var isEven  = i % 2 === 1;

      // images float in from alternating sides, very slow
      add(img, 'reveal ' + (isEven ? 'img-right' : 'img-left') + ' delay-0');

      // heading slides up after image starts
      add(h2, 'reveal heading delay-2');

      // paragraph follows heading
      add(p, 'reveal para delay-3');

      watch(img); watch(h2); watch(p);
    });
  }

  /* =============================================
     SECTION THREE — header, then cards one by one
     ============================================= */
  function initSectionThree() {
    var hdr = qs('#three header.major h2');
    var hdp = qs('#three header.major p');

    add(hdr, 'reveal heading delay-0');
    add(hdp, 'reveal para delay-2');
    watch(hdr); watch(hdp);

    qsa('#three .features li').forEach(function (card, i) {
      // each card rises with increasing delay — storytelling stagger
      add(card, 'reveal from-up delay-' + Math.min(i + 2, 8));
      watch(card);
    });
  }

  /* =============================================
     CTA — heading, paragraph, buttons separately
     ============================================= */
  function initCTA() {
    var h2  = qs('#cta header h2');
    var p   = qs('#cta header p');
    var btn1 = qs('#cta .actions li:nth-child(1)');
    var btn2 = qs('#cta .actions li:nth-child(2)');

    add(h2,   'reveal heading delay-0');
    add(p,    'reveal para delay-2');
    add(btn1, 'reveal from-up delay-3');
    add(btn2, 'reveal from-up delay-4');

    watch(h2); watch(p); watch(btn1); watch(btn2);
  }

  /* =============================================
     FOOTER — scale in slowly
     ============================================= */
  function initFooter() {
    var icons = qs('#footer .icons');
    var copy  = qs('#footer .copyright');

    add(icons, 'reveal scale-in delay-0');
    add(copy,  'reveal scale-in delay-2');

    watch(icons); watch(copy);
  }

  /* =============================================
     PARALLAX — hero video + header scroll state
     ============================================= */
  function initParallax() {
    var video  = document.getElementById('banner-video');
    var header = document.getElementById('header');

    window.addEventListener('scroll', function () {
      var scrollY = window.pageYOffset;

      // hero video drifts at 30% scroll speed — deep parallax
      if (video && scrollY < window.innerHeight * 1.2) {
        video.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
      }

      // header glass state
      if (header) {
        if (scrollY > 60) header.classList.add('scrolled');
        else              header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* =============================================
     CURSOR GLOW
     ============================================= */
  function initCursorGlow() {
    var glow = document.createElement('div');
    glow.style.cssText = [
      'position:fixed', 'pointer-events:none', 'z-index:99999',
      'width:400px', 'height:400px', 'border-radius:50%',
      'background:radial-gradient(circle, rgba(33,178,166,0.07) 0%, transparent 70%)',
      'transform:translate(-50%,-50%)',
      'transition:left 0.12s linear, top 0.12s linear, opacity 0.4s ease',
      'top:0', 'left:0', 'opacity:0'
    ].join(';');
    document.body.appendChild(glow);

    document.addEventListener('mousemove', function (e) {
      glow.style.left    = e.clientX + 'px';
      glow.style.top     = e.clientY + 'px';
      glow.style.opacity = '1';
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      glow.style.opacity = '0';
    });
  }

  /* =============================================
     SMOOTH ANCHOR SCROLL
     ============================================= */
  function initSmoothScroll() {
    qsa('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = qs(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* =============================================
     INIT
     ============================================= */
  document.addEventListener('DOMContentLoaded', function () {
    initSectionOne();
    initSectionTwo();
    initSectionThree();
    initCTA();
    initFooter();
    initParallax();
    initCursorGlow();
    initSmoothScroll();
  });

})();
