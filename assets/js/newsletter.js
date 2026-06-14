// newsletter.js — Kōhī Club subscription (Supabase + Resend via Netlify Functions)

;(function () {
  const section = document.getElementById('newsletter')
  if (!section) return

  const form = document.getElementById('newsletter-form')
  const emailInput = document.getElementById('newsletter-email')
  const emailField = form?.querySelector('[data-field="email"]')
  const emailError = document.getElementById('newsletter-email-error')
  const honeypot = document.getElementById('newsletter-company')
  const submitBtn = document.getElementById('newsletter-submit')
  const submitLabel = submitBtn?.querySelector('.newsletter-submit-label')
  const submitLoading = submitBtn?.querySelector('.newsletter-submit-loading')
  const reassurance = section.querySelector('.newsletter-reassurance')
  const successEl = section.querySelector('.newsletter-success')
  const successAddress = successEl?.querySelector('.newsletter-success-address')
  const successNoteConfirm = successEl?.querySelector('.newsletter-success-note--confirm')

  const API_URL = '/api/newsletter/subscribe'

  function track(eventName, params) {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: eventName, ...params })
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params)
    }
    if (typeof window.posthog?.capture === 'function') {
      window.posthog.capture(eventName, params)
    }
  }

  track('newsletter_impression', { section: 'newsletter' })

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  function canAnimate() {
    return typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  function setFieldError(message) {
    emailField?.classList.toggle('is-error', Boolean(message))
    if (emailError) emailError.textContent = message || ''
    if (message) emailInput?.setAttribute('aria-invalid', 'true')
    else emailInput?.removeAttribute('aria-invalid')
  }

  function setLoading(loading) {
    if (!submitBtn) return
    submitBtn.disabled = loading
    submitBtn.setAttribute('aria-busy', loading ? 'true' : 'false')
    submitLabel?.toggleAttribute('hidden', loading)
    submitLoading?.toggleAttribute('hidden', !loading)
  }

  function showSuccess(email, doubleOptIn) {
    if (!successEl) return

    if (successAddress) successAddress.textContent = email
    if (successNoteConfirm) successNoteConfirm.hidden = !doubleOptIn

    const reveal = () => {
      successEl.hidden = false
      if (canAnimate()) {
        gsap.fromTo(
          successEl,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }
        )
        gsap.fromTo(
          '.newsletter-success-icon',
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, delay: 0.1, ease: 'back.out(1.6)' }
        )
      }
    }

    const hide = [form, reassurance].filter(Boolean)
    if (canAnimate() && hide.length) {
      gsap.to(hide, {
        opacity: 0,
        y: -10,
        duration: 0.28,
        ease: 'power2.in',
        stagger: 0.04,
        onComplete: () => {
          hide.forEach((el) => el.classList.add('is-hidden'))
          reveal()
        },
      })
    } else {
      hide.forEach((el) => el.classList.add('is-hidden'))
      reveal()
    }
  }

  async function subscribeNewsletter(e) {
    e?.preventDefault()
    setFieldError('')

    const email = emailInput?.value.trim().toLowerCase() || ''

    if (!email) {
      setFieldError('Please enter your email address.')
      emailInput?.focus()
      track('newsletter_failed', { reason: 'empty' })
      return
    }

    if (!isValidEmail(email)) {
      setFieldError('Please enter a valid email address.')
      emailInput?.focus()
      track('newsletter_failed', { reason: 'invalid_format' })
      return
    }

    track('newsletter_subscribe_click', { email_domain: email.split('@')[1] || '' })
    setLoading(true)

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          company: honeypot?.value || '',
          source: 'website',
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.status === 409 || data.error === 'already_subscribed') {
        setFieldError('You are already a member of The Kōhī Club.')
        track('newsletter_failed', { reason: 'duplicate' })
        return
      }

      if (!res.ok || !data.ok) {
        setFieldError(data.message || 'Something went wrong. Please try again.')
        track('newsletter_failed', { reason: data.error || 'api_error' })
        window.showToast?.('Something went wrong', 'Please try again in a moment.', 'error')
        return
      }

      track('newsletter_subscribed', {
        double_opt_in: Boolean(data.doubleOptIn),
        resubscribed: Boolean(data.resubscribed),
      })

      showSuccess(email, Boolean(data.doubleOptIn))

      const toastTitle = data.doubleOptIn ? 'Almost there' : 'Welcome to The Kōhī Club'
      const toastMsg = data.doubleOptIn
        ? 'Check your inbox to confirm your membership.'
        : 'Check your inbox for your welcome reward.'
      window.showToast?.(toastTitle, toastMsg, 'success')
    } catch (err) {
      console.error('Newsletter subscribe error:', err)
      setFieldError('Unable to connect. Please try again.')
      track('newsletter_failed', { reason: 'network' })
      window.showToast?.('Connection issue', 'Please check your connection and try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  function initScrollAnimations() {
    if (!canAnimate() || typeof ScrollTrigger === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)
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
    emailInput?.addEventListener('input', () => setFieldError(''))
  }

  init()
})()
