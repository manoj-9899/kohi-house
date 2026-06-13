// toast.js — Reusable toast notification system

;(function () {
  const MAX_TOASTS = 3
  const TYPE_CONFIG = {
    success: { icon: '✓', accent: '#5AAA7A' },
    error: { icon: '✕', accent: '#E05555' },
    info: { icon: 'ⓘ', accent: '#C8894A' },
    warning: { icon: '⚠', accent: '#E0A030' },
  }

  const toasts = []

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  }

  function getContainer() {
    return document.getElementById('toast-container')
  }

  function updateStackOffsets() {
    toasts.forEach(({ el }, i) => {
      const y = i * 4
      const scale = 1 - i * 0.02
      if (typeof gsap !== 'undefined') {
        gsap.set(el, { y, scale, transformOrigin: 'top right' })
      } else {
        el.style.transform = `translateY(${y}px) scale(${scale})`
        el.style.transformOrigin = 'top right'
      }
    })
  }

  function dismissToast(entry, animate = true) {
    const idx = toasts.indexOf(entry)
    if (idx === -1) return

    clearTimeout(entry.timer)
    toasts.splice(idx, 1)

    const finish = () => {
      entry.el.remove()
      updateStackOffsets()
    }

    if (animate && typeof gsap !== 'undefined') {
      gsap.to(entry.el, {
        x: 40,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: finish,
      })
    } else {
      entry.el.remove()
      updateStackOffsets()
    }
  }

  function showToast(title, message, type = 'info', duration = 4000) {
    const container = getContainer()
    if (!container) return null

    if (toasts.length >= MAX_TOASTS) {
      dismissToast(toasts[0], true)
    }

    const config = TYPE_CONFIG[type] || TYPE_CONFIG.info
    const el = document.createElement('div')
    el.className = `toast toast--${type}`
    el.setAttribute('role', 'alert')
    el.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${config.icon}</span>
      <div class="toast-content">
        <strong class="toast-title">${escapeHtml(title)}</strong>
        ${message ? `<span class="toast-msg">${escapeHtml(message)}</span>` : ''}
      </div>
      <button type="button" class="toast-close" aria-label="Dismiss">✕</button>
    `

    container.appendChild(el)
    const entry = { el, timer: null }
    toasts.push(entry)
    updateStackOffsets()

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(
        el,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.35, ease: 'power3.out' }
      )
    } else {
      el.style.opacity = '1'
    }

    if (duration > 0) {
      entry.timer = setTimeout(() => dismissToast(entry, true), duration)
    }

    el.querySelector('.toast-close')?.addEventListener('click', () => dismissToast(entry, true))

    return entry
  }

  window.showToast = showToast
})()
