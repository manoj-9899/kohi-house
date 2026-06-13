// ux.js — Conversion UX: reservation FAB and drinks filters

;(function () {
  function initReserveFab() {
    const fab = document.getElementById('reserve-fab')
    if (!fab) return

    const hero = document.getElementById('hero')
    const reservation = document.getElementById('reservation')

    function update() {
      const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0
      const resTop = reservation ? reservation.getBoundingClientRect().top : Infinity
      const pastHero = heroBottom < 0
      const beforeForm = resTop > window.innerHeight * 0.5
      fab.classList.toggle('is-visible', pastHero && beforeForm)
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
  }

  function initDrinksFilters() {
    const filters = document.querySelectorAll('.drinks-filter')
    const cards = document.querySelectorAll('.drink-card')
    if (!filters.length || !cards.length) return

    filters.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter
        filters.forEach((b) => {
          b.classList.toggle('is-active', b === btn)
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false')
        })

        cards.forEach((card) => {
          const tags = (card.dataset.tags || '').split(',')
          const show = filter === 'all' || tags.includes(filter)
          card.style.display = show ? '' : 'none'
        })
      })
    })
  }

  function init() {
    initReserveFab()
    initDrinksFilters()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
