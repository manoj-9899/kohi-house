// ux.js — Conversion UX: drinks filters

;(function () {
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
    initDrinksFilters()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
