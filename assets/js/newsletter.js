// newsletter.js — Newsletter signup, validation, and success state

;(function () {
  const section = document.getElementById('newsletter')
  if (!section) return

  const form = document.getElementById('newsletter-form')
  const nameInput = document.getElementById('newsletter-name')
  const emailInput = document.getElementById('newsletter-email')
  const reassurance = section.querySelector('.newsletter-reassurance')
  const successEl = section.querySelector('.newsletter-success')
  const successTitle = successEl?.querySelector('.newsletter-success-title')
  const submitBtn = form?.querySelector('.newsletter-submit')

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  function canAnimate() {
    return typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  function showSuccess(name) {
    if (!successEl || !successTitle) return

    successTitle.textContent = name ? `You are all set, ${name}.` : 'You are all set.'

    const revealSuccess = () => {
      successEl.hidden = false
      if (canAnimate()) {
        gsap.fromTo(
          successEl,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
        )
      }
    }

    const targets = [form, reassurance].filter(Boolean)

    if (canAnimate() && targets.length) {
      gsap.to(targets, {
        opacity: 0,
        y: -8,
        duration: 0.3,
        ease: 'power2.in',
        stagger: 0.05,
        onComplete: () => {
          form?.classList.add('is-hidden')
          reassurance?.classList.add('is-hidden')
          revealSuccess()
        },
      })
    } else {
      form?.classList.add('is-hidden')
      reassurance?.classList.add('is-hidden')
      revealSuccess()
    }
  }

  function subscribeNewsletter(e) {
    e?.preventDefault()

    const email = emailInput?.value.trim() || ''
    const name = nameInput?.value.trim() || ''

    if (!email) {
      window.showToast?.('Almost there', 'Please enter your email address.', 'error')
      emailInput?.focus()
      return
    }

    if (!isValidEmail(email)) {
      window.showToast?.('Check your email', 'Please enter a valid email address.', 'error')
      emailInput?.focus()
      return
    }

    showSuccess(name)
    submitBtn?.setAttribute('disabled', 'true')

    const toastMsg = name
      ? `${name}, we will keep you posted on what's brewing.`
      : 'We will keep you posted on what is brewing.'
    window.showToast?.('You are subscribed', toastMsg, 'success')
  }

  function initScrollAnimations() {
    if (!canAnimate() || typeof ScrollTrigger === 'undefined') return

    gsap.registerPlugin(ScrollTrigger)

    const watermark = section.querySelector('.newsletter-watermark')
    if (watermark && window.matchMedia('(min-width: 769px)').matches) {
      gsap.to(watermark, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }

    gsap.from('.newsletter-inner > *', {
      y: 24,
      opacity: 0,
      duration: 0.75,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 82%', once: true },
    })
  }

  function init() {
    initScrollAnimations()

    form?.addEventListener('submit', subscribeNewsletter)
    emailInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        subscribeNewsletter(e)
      }
    })
  }

  init()
})()
