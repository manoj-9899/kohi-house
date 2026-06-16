// reveal.js — GSAP ScrollTrigger animations for scroll reveals and hero sequence

(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return

  gsap.registerPlugin(ScrollTrigger)

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

    function initHero() {
      const heroTitle = document.querySelector('.hero-title')
      heroTitle?.classList.add('will-animate')

      gsap.set('.hero-eyebrow', { y: 30, opacity: 0 })
      gsap.set('.hero-title .line span', { y: '110%', opacity: 0 })
      gsap.set('.hero-sub', { y: 30, opacity: 0 })
      gsap.set('.hero-ctas', { y: 30, opacity: 0 })
      gsap.set('.hero-scroll', { opacity: 0 })

      gsap.to('.hero-eyebrow', { y: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: 'power3.out' })

      gsap.to('.hero-title .line span', {
        y: '0%',
        opacity: 1,
        duration: 0.9,
        delay: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
        onComplete: () => heroTitle?.classList.remove('will-animate'),
      })

      gsap.to('.hero-sub', { y: 0, opacity: 1, duration: 0.8, delay: 1.2, ease: 'power3.out' })
      gsap.to('.hero-ctas', { y: 0, opacity: 1, duration: 0.8, delay: 1.4, ease: 'power3.out' })
      gsap.to('.hero-scroll', { opacity: 1, duration: 0.8, delay: 2, ease: 'power2.out' })
    }

    function initStory() {
      gsap.from('.story-eyebrow', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#story', start: 'top 80%', once: true },
      })

      gsap.from('.story-visual', {
        x: -60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.story-visual', start: 'top 80%', once: true },
      })

      gsap.from('.story-text h2', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.story-text', start: 'top 80%', once: true },
      })

      gsap.from('.story-text p', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.story-text', start: 'top 75%', once: true },
      })

      document.querySelectorAll('.stat-num').forEach((el) => {
        const raw = el.textContent.trim()
        const suffix = raw.includes('+') ? '+' : ''
        const isK = raw.includes('K')
        const end = isK ? parseFloat(raw) : parseInt(raw, 10)
        const counter = { val: 0 }

        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(counter, {
              val: end,
              duration: 1.8,
              ease: 'power2.out',
              onUpdate: () => {
                if (isK) el.textContent = Math.round(counter.val) + 'K' + suffix
                else el.textContent = Math.round(counter.val) + suffix
              },
            })
          },
        })
      })
    }

    function initDrinks() {
      gsap.from('#drinks .section-header', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#drinks', start: 'top 80%' },
      })

      gsap.from('.drink-card', {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.drinks-grid', start: 'top 80%' },
        mediaQuery: '(min-width: 769px)',
      })

      document.querySelectorAll('.drink-card').forEach((card) => {
        card.addEventListener('mouseenter', () => {
          card.classList.add('will-animate')
          gsap.to(card, {
            y: -8,
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
            borderColor: 'rgba(200,137,74,0.3)',
            duration: 0.4,
            ease: 'power2.out',
            onComplete: () => card.classList.remove('will-animate'),
          })
        })
        card.addEventListener('mouseleave', () => {
          card.classList.add('will-animate')
          gsap.to(card, {
            y: 0,
            boxShadow: '0 0 0 rgba(0,0,0,0)',
            borderColor: 'rgba(200,137,74,0.12)',
            duration: 0.4,
            ease: 'power2.out',
            onComplete: () => card.classList.remove('will-animate'),
          })
        })
      })
    }

    function initMenu() {
      gsap.from('.menu-tabs', {
        x: -60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#menu', start: 'top 80%' },
      })

      gsap.from('#menu .section-header', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#menu', start: 'top 85%' },
      })

      gsap.from('.menu-search-wrap', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#menu', start: 'top 82%' },
      })
    }

    function initGallery() {
      gsap.from('#atmosphere .section-header', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#atmosphere', start: 'top 80%' },
      })

      gsap.fromTo(
        '.gallery-cell:first-child',
        { scale: 0.95 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.gallery-cell:first-child',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )

      gsap.from('.gallery-cell:not(:first-child)', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.gallery-grid', start: 'top 80%' },
      })
    }

    function initTestimonials() {
      gsap.from('#testimonials .section-header', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#testimonials', start: 'top 80%' },
      })

      gsap.from('.testi-card', {
        y: 50,
        opacity: 0,
        duration: 0.85,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.testi-grid', start: 'top 80%' },
      })
    }

    function initJournal() {
      gsap.from('#journal .section-header', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#journal', start: 'top 80%' },
      })

      gsap.from('.journal-card', {
        y: 50,
        opacity: 0,
        duration: 0.85,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.journal-grid', start: 'top 85%' },
      })
    }

    function initLocation() {
      gsap.from('#location .section-header', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#location', start: 'top 80%' },
      })

      gsap.from('.location-grid > div:first-child', {
        x: -40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.location-grid', start: 'top 80%' },
      })

      gsap.from('.location-grid > div:last-child', {
        x: 40,
        opacity: 0,
        scale: 0.97,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.location-grid', start: 'top 80%' },
      })
    }

    function initFooter() {
      gsap.from('.footer-brand, .footer-col', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: 'footer', start: 'top 90%' },
      })
    }

    initHero()
    initStory()
    initDrinks()
    initMenu()
    initGallery()
    initTestimonials()
    initJournal()
    initLocation()
    initFooter()

    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })
  }
})()
