// mobile.js — Mobile-specific interactions: drinks carousel, gallery tap, input scroll

;(function () {
  const MOBILE_MQ = window.matchMedia('(max-width: 768px)')

  function scrollCardToCenter(wrap, card) {
    const offset = card.offsetLeft - (wrap.clientWidth - card.offsetWidth) / 2
    wrap.scrollTo({ left: offset, behavior: 'smooth' })
  }

  function initDrinksCarousel() {
    const wrap = document.querySelector('.drinks-scroll-wrap')
    const grid = document.querySelector('.drinks-grid')
    const dotsContainer = document.querySelector('.drinks-dots')
    if (!wrap || !grid || !dotsContainer) return

    const cards = () => grid.querySelectorAll('.drink-card')

    function buildDots() {
      if (!MOBILE_MQ.matches) {
        dotsContainer.innerHTML = ''
        return
      }
      dotsContainer.innerHTML = ''
      cards().forEach((_, i) => {
        const dot = document.createElement('button')
        dot.type = 'button'
        dot.className = 'drinks-dot' + (i === 0 ? ' is-active' : '')
        dot.setAttribute('aria-label', `Go to drink ${i + 1}`)
        dot.addEventListener('click', () => {
          const card = cards()[i]
          if (card) scrollCardToCenter(wrap, card)
        })
        dotsContainer.appendChild(dot)
      })
    }

    function updateActiveDot() {
      if (!MOBILE_MQ.matches) return
      const list = cards()
      if (!list.length) return
      const center = wrap.scrollLeft + wrap.clientWidth / 2
      let active = 0
      let minDist = Infinity
      list.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2
        const dist = Math.abs(cardCenter - center)
        if (dist < minDist) {
          minDist = dist
          active = i
        }
      })
      dotsContainer.querySelectorAll('.drinks-dot').forEach((dot, i) => {
        dot.classList.toggle('is-active', i === active)
      })
    }

    buildDots()
    wrap.addEventListener('scroll', updateActiveDot, { passive: true })
    window.addEventListener('resize', buildDots)
  }

  function initGalleryTap() {
    document.querySelectorAll('.gallery-cell').forEach((cell, index) => {
      cell.addEventListener(
        'click',
        (e) => {
          if (!MOBILE_MQ.matches) return

          const wasTapped = cell.classList.contains('is-tapped')
          document.querySelectorAll('.gallery-cell.is-tapped').forEach((c) => {
            if (c !== cell) c.classList.remove('is-tapped')
          })

          if (!wasTapped) {
            e.preventDefault()
            e.stopPropagation()
            cell.classList.add('is-tapped')
            return
          }
        },
        true
      )

      const zoom = cell.querySelector('.gallery-zoom-hint')
      zoom?.addEventListener('click', (e) => {
        if (!MOBILE_MQ.matches) return
        e.stopPropagation()
        if (typeof window.openLightbox === 'function') {
          window.openLightbox(index)
          cell.classList.remove('is-tapped')
        }
      })
    })

    document.addEventListener('click', (e) => {
      if (!MOBILE_MQ.matches) return
      if (!e.target.closest('.gallery-cell')) {
        document.querySelectorAll('.gallery-cell.is-tapped').forEach((c) => c.classList.remove('is-tapped'))
      }
    })
  }

  function initReservationInputScroll() {
    const wizard = document.getElementById('reservation-wizard')
    if (!wizard) return

    wizard.querySelectorAll('input, textarea, select').forEach((input) => {
      input.addEventListener('focus', () => {
        if (!MOBILE_MQ.matches) return
        setTimeout(() => {
          input.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 320)
      })
    })

    window.visualViewport?.addEventListener('resize', () => {
      if (!MOBILE_MQ.matches) return
      const active = document.activeElement
      if (active && wizard.contains(active) && active.matches('input, textarea, select')) {
        active.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
  }

  initDrinksCarousel()
  initGalleryTap()
  initReservationInputScroll()
})()
