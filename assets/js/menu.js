// menu.js — Interactive menu data, search, tab switching, and GSAP animations

const menuData = {
  coffee: [
    { name: 'Ethiopian Pour-Over', price: '₹340', desc: 'Light roast, jasmine florals, bright acidity.', tags: ['Single Origin'], isNew: true, isBestseller: false },
    { name: 'Ginger Honey Flat White', price: '₹290', desc: 'Two ristretto shots, steamed milk, raw honey, ginger.', tags: ['Seasonal'], isNew: false, isBestseller: false },
    { name: 'Masala Cappuccino', price: '₹260', desc: 'Cardamom, cinnamon, ginger — our take on tradition.', tags: ['Spiced'], isNew: false, isBestseller: false },
    { name: 'Origin Flight — Three Regions', price: '₹540', desc: 'Araku, Coorg, and Chikmagalur. Side by side.', tags: ['Tasting'], isNew: true, isBestseller: false },
  ],
  espresso: [
    { name: 'Double Espresso', price: '₹180', desc: 'Rich, full-bodied. Two shots of our house blend.', tags: ['Strong'], isNew: false, isBestseller: true },
    { name: 'Araku Gold Cortado', price: '₹280', desc: 'Equal parts espresso and steamed milk.', tags: ['Balanced'], isNew: true, isBestseller: true },
    { name: 'Saffron Fog Latte', price: '₹320', desc: 'House saffron syrup, double shot, oat microfoam.', tags: ['Signature'], isNew: false, isBestseller: true },
    { name: 'Monsoon Spice Latte', price: '₹350', desc: 'Seasonal. Wet-processed bean, black pepper, cardamom.', tags: ['Seasonal'], isNew: false, isBestseller: true },
  ],
  cold: [
    { name: 'Midnight Nitro Cold Brew', price: '₹340', desc: '18-hour cold brew, nitrogen-infused. Velvet smooth.', tags: ['Nitro'], isNew: false, isBestseller: true },
    { name: 'Deconstructed Iced Latte', price: '₹300', desc: 'Espresso on ice, oat milk on the side.', tags: ['Oat'], isNew: true, isBestseller: false },
    { name: 'Mango Cold Brew Float', price: '₹360', desc: 'House cold brew, Alphonso mango purée, ice cream.', tags: ['Seasonal'], isNew: false, isBestseller: true },
    { name: 'Hibiscus Tonic Espresso', price: '₹320', desc: 'Iced tonic water, hibiscus, double shot.', tags: ['Floral'], isNew: true, isBestseller: false },
    { name: 'Charcoal Lemonade', price: '₹240', desc: 'Activated charcoal, lemon, salt, sparkling water.', tags: ['Vegan'], isNew: false, isBestseller: false },
    { name: 'Rose Cold Brew Lemonade', price: '₹280', desc: 'Cold brew, rose syrup, fresh lemon, ice.', tags: ['Floral'], isNew: false, isBestseller: true },
  ],
  tea: [
    { name: 'Masala Chai', price: '₹180', desc: 'Slow-brewed Assam with cardamom, ginger, and clove.', tags: ['Spiced'], isNew: false, isBestseller: true },
    { name: 'Kashmiri Kahwa', price: '₹220', desc: 'Green tea, saffron, almond slivers, rose petals.', tags: ['Floral'], isNew: true, isBestseller: false },
    { name: 'Hibiscus Iced Tea', price: '₹200', desc: 'Tart hibiscus, mint, light honey. Refreshing.', tags: ['Vegan'], isNew: false, isBestseller: false },
    { name: 'Matcha Latte', price: '₹280', desc: 'Ceremonial grade matcha, steamed oat milk.', tags: ['Oat'], isNew: false, isBestseller: true },
  ],
  pastries: [
    { name: 'Almond Croissant', price: '₹180', desc: 'Twice-baked. Frangipane filling. Perfectly flaky.', tags: ['Pastry'], isNew: false, isBestseller: true },
    { name: 'Shakshuka Croissant', price: '₹380', desc: 'Spiced tomato eggs, baked into a buttery croissant.', tags: ['Brunch'], isNew: true, isBestseller: true },
    { name: 'Avocado Toast on Sourdough', price: '₹340', desc: 'Poached egg, microgreens, chilli flakes.', tags: ['Brunch'], isNew: false, isBestseller: true },
    { name: 'Dal Makhani Bruschetta', price: '₹290', desc: 'House-smoked tomatoes, slow-cooked dal on toast.', tags: ['Indian'], isNew: true, isBestseller: false },
    { name: "Chef's Brunch Thali", price: '₹520', desc: 'Rotating weekly. Eggs your way, sides, two drinks.', tags: ['Brunch'], isNew: true, isBestseller: false },
  ],
  desserts: [
    { name: 'Dark Chocolate Tart', price: '₹260', desc: '70% Coorg cacao ganache, sea salt, hazelnut base.', tags: ['Dessert'], isNew: false, isBestseller: false },
    { name: 'Banana Walnut French Toast', price: '₹320', desc: 'Thick brioche, caramelised banana, whipped cream.', tags: ['Sweet'], isNew: false, isBestseller: false },
    { name: 'The Kōhī Signature Board', price: '₹680', desc: 'Three espresso drinks, two pastries, one story.', tags: ['Sharing'], isNew: false, isBestseller: true },
  ],
}

const noteByName = {
  'Ethiopian Pour-Over': 'Single Origin · Ethiopia',
  'Origin Flight — Three Regions': 'Tasting Flight · Three Regions',
  'Araku Gold Cortado': 'Single Origin · Araku Valley',
  'Monsoon Spice Latte': 'Limited Roast · Seasonal',
  'The Kōhī Signature Board': 'Curated for the table',
}

const noteByTag = {
  'Single Origin': 'Single Origin',
  'Seasonal': 'Seasonal Feature',
  'Spiced': 'Spiced Blend',
  'Tasting': 'Tasting Flight',
  'Strong': 'House Espresso',
  'Balanced': 'Cortado Style',
  'Signature': 'House Signature',
  'Nitro': 'Nitro Tap',
  'Oat': 'Oat Milk',
  'Floral': 'Floral Notes',
  'Vegan': 'Plant-Based',
  'Pastry': 'Baked Daily',
  'Brunch': 'Brunch Plate',
  'Indian': 'Indian-Inspired',
  'Dessert': 'Pastry Case',
  'Sweet': 'Sweet Plate',
  'Sharing': 'For the Table',
}

const categoryLabels = {
  coffee: 'Coffee',
  espresso: 'Espresso',
  cold: 'Cold Drinks',
  tea: 'Tea',
  pastries: 'Pastries',
  desserts: 'Desserts',
}

let currentCategory = 'coffee'
let searchQuery = ''

function canAnimate() {
  return typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function highlightText(text, query) {
  const safe = escapeHtml(text)
  if (!query.trim()) return safe
  const re = new RegExp(`(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return safe.replace(re, '<mark class="menu-highlight">$1</mark>')
}

function getItemNote(item) {
  if (noteByName[item.name]) return noteByName[item.name]
  const tag = item.tags[0]
  return tag ? noteByTag[tag] || '' : ''
}

function renderMenuItemHTML(item, category, query) {
  const showCategory = searchQuery.trim().length > 0
  const note = getItemNote(item)
  return `
    <div class="menu-item" data-category="${category}">
      ${showCategory ? `<div class="menu-item-category">${categoryLabels[category]}</div>` : ''}
      <div class="menu-item-name">${highlightText(item.name, query)}</div>
      <div class="menu-item-desc">${highlightText(item.desc, query)}</div>
      <div class="menu-item-price">${escapeHtml(item.price)}</div>
      ${note ? `<p class="menu-item-note">${escapeHtml(note)}</p>` : ''}
    </div>
  `
}

function matchesSearch(item, query) {
  const q = query.toLowerCase().trim()
  if (!q) return true
  return (
    item.name.toLowerCase().includes(q) ||
    item.desc.toLowerCase().includes(q) ||
    item.tags.some((t) => t.toLowerCase().includes(q))
  )
}

function getItemsToRender() {
  if (searchQuery.trim()) {
    const results = []
    Object.keys(menuData).forEach((cat) => {
      menuData[cat].forEach((item) => {
        if (matchesSearch(item, searchQuery)) results.push({ item, category: cat })
      })
    })
    return results
  }
  return menuData[currentCategory].map((item) => ({ item, category: currentCategory }))
}

function animateOut(items, onComplete) {
  if (!items.length || !canAnimate()) {
    onComplete()
    return
  }
  gsap.to(items, {
    y: -20,
    opacity: 0,
    duration: 0.25,
    stagger: 0.03,
    ease: 'power2.in',
    onComplete,
  })
}

function animateIn(items) {
  if (!items.length) return
  if (!canAnimate()) {
    gsap.set(items, { clearProps: 'all', opacity: 1, y: 0 })
    return
  }
  gsap.fromTo(
    items,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.35, delay: 0.1, stagger: 0.05, ease: 'power2.out' }
  )
}

function bindMenuItemInteractions() {
  document.querySelectorAll('.menu-item').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      if (!canAnimate()) {
        item.style.background = 'rgba(200,137,74,0.08)'
        return
      }
      gsap.to(item, { backgroundColor: 'rgba(200,137,74,0.08)', duration: 0.3, ease: 'power2.out' })
    })

    item.addEventListener('mouseleave', () => {
      if (!canAnimate()) {
        item.style.background = 'transparent'
        return
      }
      gsap.to(item, { backgroundColor: 'rgba(0,0,0,0)', duration: 0.3, ease: 'power2.out' })
    })
  })
}

function updateMenuDOM(skipOut) {
  const grid = document.getElementById('menu-grid')
  const wrapper = document.querySelector('.menu-wrapper')
  const entries = getItemsToRender()
  const isSearching = searchQuery.trim().length > 0

  if (wrapper) wrapper.classList.toggle('is-searching', isSearching)

  const paint = () => {
    if (!entries.length) {
      grid.innerHTML = '<div class="menu-empty">Nothing found — try \'espresso\'</div>'
      return
    }
    grid.innerHTML = entries
      .map(({ item, category }) => renderMenuItemHTML(item, category, searchQuery))
      .join('')
    bindMenuItemInteractions()
    animateIn(grid.querySelectorAll('.menu-item'))
  }

  const existing = grid.querySelectorAll('.menu-item')
  if (!skipOut && existing.length && canAnimate()) {
    animateOut(existing, paint)
  } else {
    paint()
  }
}

function switchTab(el, key) {
  if (searchQuery.trim()) return
  document.querySelectorAll('.menu-tab').forEach((t) => {
    t.classList.remove('active')
    t.setAttribute('aria-selected', 'false')
  })
  el.classList.add('active')
  el.setAttribute('aria-selected', 'true')
  currentCategory = key
  updateMenuDOM(false)
}

function onSearchInput(e) {
  searchQuery = e.target.value
  updateMenuDOM(false)
}

function initMenu() {
  document.querySelectorAll('.menu-tab').forEach((tab) => {
    tab.addEventListener('click', () => switchTab(tab, tab.dataset.category))
  })
  const searchInput = document.getElementById('menu-search')
  if (searchInput) searchInput.addEventListener('input', onSearchInput)
  updateMenuDOM(true)
}

initMenu()
