// scroll.js — Parallax, horizontal journey pin, and scroll-driven effects

;(function () {
  let initialized = false

  function initParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return

    gsap.to('.hero-bg', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })

    gsap.to('.story-img', {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: '#story',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    gsap.to('.gallery-cell:first-child .gallery-img', {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: '#atmosphere',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  }

  function initJourneyStagger() {
    gsap.from('.journey-step', {
      opacity: 0,
      y: 30,
      stagger: 0.12,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.journey-row',
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true,
      },
    })
  }

  window.initScrollEffects = function initScrollEffects() {
    if (initialized) return
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    initialized = true
    initParallax()
    initJourneyStagger()
    ScrollTrigger.refresh()
  }
})()
