// mobile.js — Mobile-specific interactions: drinks dots, gallery tap, footer accordions, input scroll

(function () {
  const MOBILE_MQ = window.matchMedia('(max-width: 768px)')

  function initDrinksCarousel() {
    const wrap = document.querySelector('.drinks-scroll-wrap')
    const grid = document.querySelector('.drinks-grid')
    const dotsContainer = document.querySelector('.drinks-dots')
    if (!wrap || !grid || !dotsContainer) return

    const cards = () => grid.querySelectorAll('.drink-card')

    function buildDots() {
      dotsContainer.innerHTML = ''
      cards().forEach((_, i) => {
        const dot = document.createElement('button')
        dot.type = 'button'
        dot.className = 'drinks-dot' + (i === 0 ? ' is-active' : '')
        dot.setAttribute('aria-label', `Go to drink ${i + 1}`)
        dot.addEventListener('click', () => {
          const card = cards()[i]
          if (card) wrap.scrollTo({ left: card.offsetLeft - wrap.offsetLeft, behavior: 'smooth' })
        })
        dotsContainer.appendChild(dot)
      })
    }

    function updateActiveDot() {
      const list = cards()
      if (!list.length) return
      let active = 0
      const scrollLeft = wrap.scrollLeft
      list.forEach((card, i) => {
        if (card.offsetLeft - wrap.offsetLeft <= scrollLeft + wrap.clientWidth * 0.2) active = i
      })
      dotsContainer.querySelectorAll('.drinks-dot').forEach((dot, i) => {
        dot.classList.toggle('is-active', i === active)
      })
    }

    buildDots()
    wrap.addEventListener('scroll', updateActiveDot, { passive: true })
    window.addEventListener('resize', () => {
      if (MOBILE_MQ.matches) buildDots()
    })
  }

  function initGalleryTap() {
    document.querySelectorAll('.gallery-cell').forEach((cell) => {
      cell.addEventListener('click', () => {
        if (!MOBILE_MQ.matches) return
        const wasTapped = cell.classList.contains('is-tapped')
        document.querySelectorAll('.gallery-cell.is-tapped').forEach((c) => c.classList.remove('is-tapped'))
        if (!wasTapped) cell.classList.add('is-tapped')
      })
    })
  }

  function initFooterAccordion() {
    document.querySelectorAll('.footer-col--collapsible').forEach((col) => {
      const toggle = col.querySelector('.footer-col-toggle')
      const panel = col.querySelector('.footer-col-panel')
      if (!toggle || !panel) return

      toggle.addEventListener('click', () => {
        const open = col.classList.toggle('is-open')
        toggle.setAttribute('aria-expanded', open)
      })
    })
  }

  function initReservationInputScroll() {
    const wizard = document.getElementById('reservation-wizard')
    if (!wizard) return

    wizard.querySelectorAll('input, textarea, select').forEach((input) => {
      input.addEventListener('focus', () => {
        if (!MOBILE_MQ.matches) return
        setTimeout(() => {
          const vh = window.visualViewport?.height ?? window.innerHeight
          const rect = input.getBoundingClientRect()
          if (rect.bottom > vh - 24) {
            input.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }, 320)
      })
    })

    window.visualViewport?.addEventListener('resize', () => {
      if (!MOBILE_MQ.matches) return
      const active = document.activeElement
      if (active && wizard.contains(active) && (active.matches('input, textarea, select'))) {
        active.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
  }

  initDrinksCarousel()
  initGalleryTap()
  initFooterAccordion()
  initReservationInputScroll()
})()
