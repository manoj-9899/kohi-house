// main.js — Lenis smooth scroll, scroll UI, map, and deferred setup

const MAP_COORDS = [19.1347, 72.8259]
const MOBILE_MQ = window.matchMedia('(max-width: 768px)')
const NAV_OFFSET = -80
const SCROLL_DURATION = 1.4

const MAP_TILES = {
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  light: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
}

let lenis = null

function getThemeColors() {
  const root = getComputedStyle(document.documentElement)
  return {
    caramel: root.getPropertyValue('--caramel').trim() || '#C8894A',
    cream: root.getPropertyValue('--cream').trim() || '#F5E6C8',
    darkRoast: root.getPropertyValue('--dark-roast').trim() || '#1A1108',
    cardBorder: root.getPropertyValue('--caramel-20').trim() || 'rgba(200,137,74,0.2)',
  }
}

function buildPopupHtml() {
  const c = getThemeColors()
  return `<div style="
        font-family:'DM Sans',sans-serif;
        background:${c.darkRoast};
        color:${c.cream};
        padding:0.75rem 1rem;
        border-radius:4px;
        font-size:0.82rem;
        line-height:1.6;
        border:1px solid ${c.cardBorder}
      ">
        <strong style="color:${c.caramel};display:block;margin-bottom:4px">
          Kōhī House
        </strong>
        12, Third Cross Street<br>
        Versova, Andheri West<br>
        Mumbai – 400 061
      </div>`
}

function isMobileNav() {
  return window.matchMedia('(max-width: 900px)').matches
}

function updateNavbarScrolled(scrollY) {
  const navbar = document.getElementById('navbar')
  if (!navbar) return
  if (isMobileNav()) navbar.classList.add('scrolled')
  else navbar.classList.toggle('scrolled', scrollY > 60)
}

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]')
  let current = ''

  sections.forEach((section) => {
    const top = section.getBoundingClientRect().top
    if (top <= 120) current = section.getAttribute('id')
  })

  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href')
    const isActive = href === `#${current}`
    link.classList.toggle('active', isActive)
    link.classList.toggle('is-active', isActive)
    if (isActive) link.setAttribute('aria-current', 'page')
    else link.removeAttribute('aria-current')
  })

  document.querySelectorAll('.mobile-nav a[data-nav]').forEach((link) => {
    const sectionId = link.dataset.nav || link.getAttribute('href')?.replace('#', '')
    const isActive = sectionId === current
    link.classList.toggle('is-active', isActive)
    if (isActive) link.setAttribute('aria-current', 'page')
    else link.removeAttribute('aria-current')
  })
}

function updateScrollProgress(progress) {
  const bar = document.getElementById('scroll-bar')
  if (!bar || typeof gsap === 'undefined') return
  gsap.set(bar, { scaleY: progress })
}

function getScrollProgress() {
  const doc = document.documentElement
  const max = doc.scrollHeight - window.innerHeight
  return max > 0 ? window.scrollY / max : 0
}

function bindAnchorLinks() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href')
      if (!href || href === '#') return

      const target = document.querySelector(href)
      if (!target) return

      e.preventDefault()
      window.closeMobileNav?.()
      window.lenisScrollTo(target)
    })
  })
}

function initNativeScrollFallback() {
  bindAnchorLinks()

  window.lenisScrollTo = (target, options = {}) => {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY + (options.offset ?? NAV_OFFSET)
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  window.addEventListener(
    'scroll',
    () => {
      updateNavbarScrolled(window.scrollY)
      updateActiveNav()
      updateScrollProgress(getScrollProgress())
    },
    { passive: true }
  )

  updateNavbarScrolled(window.scrollY)
  updateActiveNav()
  updateScrollProgress(getScrollProgress())

  if (window.initScrollEffects) window.initScrollEffects()
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh()
}

function initLenis() {
  if (typeof Lenis === 'undefined' || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    initNativeScrollFallback()
    return
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    initNativeScrollFallback()
    return
  }

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
  })

  window.lenis = lenis

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  lenis.on('scroll', (e) => {
    const progress = typeof e.progress === 'number' ? e.progress : lenis.progress
    updateScrollProgress(progress)
    updateNavbarScrolled(lenis.scroll)
    updateActiveNav()
  })

  bindAnchorLinks()

  window.lenisScrollTo = (target, options = {}) => {
    lenis.scrollTo(target, {
      offset: NAV_OFFSET,
      duration: SCROLL_DURATION,
      ...options,
    })
  }

  if (window.initScrollEffects) window.initScrollEffects()

  requestAnimationFrame(() => {
    ScrollTrigger.refresh()
  })

  window.addEventListener('resize', () => {
    ScrollTrigger.refresh()
  })
}

function initLeafletMap() {
  if (typeof L === 'undefined') return

  const container = document.getElementById('leaflet-map')
  if (!container) return

  const isMobile = MOBILE_MQ.matches
  const overlay = document.querySelector('.map-interact-overlay')
  const colors = getThemeColors()

  const map = L.map('leaflet-map', {
    center: MAP_COORDS,
    zoom: isMobile ? 14 : 15,
    zoomControl: false,
    scrollWheelZoom: false,
    dragging: !isMobile,
    tap: !isMobile,
    attributionControl: false,
  })

  const theme = document.documentElement.getAttribute('data-theme') || 'dark'
  const tileLayer = L.tileLayer(MAP_TILES[theme] || MAP_TILES.dark, {
    attribution: '© OpenStreetMap contributors © CARTO',
    maxZoom: 19,
  }).addTo(map)

  const icon = L.divIcon({
    html: `<div style="
      width:16px;height:16px;
      background:${colors.caramel};
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      border:2px solid ${colors.cream};
      box-shadow:0 0 20px var(--caramel-60)
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 16],
    className: '',
  })

  const marker = L.marker(MAP_COORDS, { icon }).addTo(map)
  marker.bindPopup(buildPopupHtml(), { className: 'kohi-popup' }).openPopup()

  function applyMapTheme(nextTheme) {
    tileLayer.setUrl(MAP_TILES[nextTheme] || MAP_TILES.dark)
    const c = getThemeColors()
    marker.setIcon(
      L.divIcon({
        html: `<div style="
          width:16px;height:16px;
          background:${c.caramel};
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          border:2px solid ${c.cream};
          box-shadow:0 0 20px var(--caramel-60)
        "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 16],
        className: '',
      })
    )
    marker.setPopupContent(buildPopupHtml())
  }

  window.addEventListener('themechange', (e) => {
    applyMapTheme(e.detail?.theme || 'dark')
  })

  if (overlay && !isMobile) {
    overlay.addEventListener('click', () => {
      overlay.classList.add('is-hidden')
      overlay.dataset.wasActivated = 'true'
      map.scrollWheelZoom.enable()
    })
  } else if (overlay) {
    overlay.classList.add('is-hidden')
  }

  const frame = container.closest('.map-frame')
  if (frame) {
    new ResizeObserver(() => {
      map.invalidateSize()
    }).observe(frame)
  }

  const locationSection = document.getElementById('location')
  if (locationSection) {
    new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          requestAnimationFrame(() => map.invalidateSize())
        }
      },
      { threshold: 0.1 }
    ).observe(locationSection)
  }

  MOBILE_MQ.addEventListener('change', (e) => {
    map.setZoom(e.matches ? 14 : 15)
    if (e.matches) {
      map.dragging.disable()
      map.scrollWheelZoom.disable()
      overlay?.classList.add('is-hidden')
    } else {
      map.dragging.enable()
      if (overlay?.classList.contains('is-hidden') && !overlay.dataset.wasActivated) {
        overlay.classList.remove('is-hidden')
      }
    }
    map.invalidateSize()
  })
}

function initCopyAddress() {
  const btn = document.getElementById('copy-address')
  if (!btn) return

  const address = '12, Third Cross Street, Versova, Andheri West, Mumbai – 400 061'

  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(address)
      window.showToast?.('Copied!', 'Address copied to clipboard.', 'success')
    } catch (_) {
      window.showToast?.('Copy failed', 'Please copy the address manually.', 'error')
    }
  })
}

function initImagePreloader() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]')
  if (!lazyImages.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const img = entry.target
        if (img.dataset.preloaded) return
        const preload = new Image()
        preload.src = img.currentSrc || img.src
        if (img.srcset) preload.srcset = img.srcset
        img.dataset.preloaded = '1'
        observer.unobserve(img)
      })
    },
    { rootMargin: '200px' }
  )

  lazyImages.forEach((img) => observer.observe(img))
}

document.addEventListener('DOMContentLoaded', () => {
  initLenis()
  initLeafletMap()
  initCopyAddress()
  initImagePreloader()
})

async function shareKohi() {
  const shareData = {
    title: 'Kōhī House — Where Time Slows Down',
    text: 'Found this amazing café in Mumbai. You have to visit.',
    url: 'https://www.kohihouse.in',
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
      return
    }
  } catch (err) {
    if (err?.name === 'AbortError') return
  }

  try {
    await navigator.clipboard.writeText(shareData.url)
    window.showToast?.('Link copied!', 'Share it with someone who needs good coffee.', 'success')
  } catch {
    window.showToast?.('Share', shareData.url, 'info', 5000)
  }
}

window.shareKohi = shareKohi
