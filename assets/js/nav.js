// nav.js — Navbar scroll state, mobile navigation, theme toggle, and section spy

document.body.classList.remove('nav-open')

const navbar = document.getElementById('navbar')
const mobileNav = document.getElementById('mobileNav')
const hamburger = document.querySelector('.hamburger')
const mobileLinks = mobileNav ? mobileNav.querySelectorAll('a[data-nav]') : []

const HERO_IMAGES = {
  dark: {
    img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1920&q=80',
    webp: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?fm=webp&w=1920&q=80',
  },
  light: {
    img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1920&q=80',
    webp: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?fm=webp&w=1920&q=80',
  },
}

function isMobileNav() {
  return window.matchMedia('(max-width: 900px)').matches
}

function getThemeIcons() {
  return document.querySelectorAll('.theme-icon')
}

function updateHeroForTheme(theme) {
  const img = document.querySelector('.hero-bg img')
  const source = document.querySelector('.hero-bg source[type="image/webp"]')
  const assets = HERO_IMAGES[theme] || HERO_IMAGES.dark
  if (img) img.src = assets.img
  if (source) source.srcset = assets.webp
}

function setTheme(theme) {
  const next = theme === 'light' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', next)
  localStorage.setItem('kohi-theme', next)

  getThemeIcons().forEach((icon) => {
    icon.textContent = next === 'light' ? '☀' : '☽'
    if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(icon, { scale: 0.6, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.45, ease: 'back.out(2)' })
    }
  })

  document.querySelectorAll('.theme-toggle').forEach((btn) => {
    btn.setAttribute('aria-label', next === 'light' ? 'Switch to dark mode' : 'Switch to light mode')
  })

  document.querySelectorAll('.theme-toggle-label').forEach((label) => {
    label.textContent = next === 'light' ? 'Dark mode' : 'Light mode'
  })

  updateHeroForTheme(next)
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }))
}

function initThemeToggle() {
  const saved = localStorage.getItem('kohi-theme')
  const initial = saved || 'dark'
  setTheme(initial)

  document.querySelectorAll('#theme-toggle, #theme-toggle-mobile').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark'
      setTheme(current === 'dark' ? 'light' : 'dark')
    })
  })
}

window.addEventListener('scroll', () => {
  if (window.lenis) return
  if (!navbar) return
  if (isMobileNav()) {
    navbar.classList.add('scrolled')
  } else {
    navbar.classList.toggle('scrolled', window.scrollY > 60)
  }
})

function animateMobileLinksIn() {
  if (typeof gsap === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  gsap.set(mobileLinks, { y: 24, opacity: 0 })
  gsap.to(mobileLinks, {
    y: 0,
    opacity: 1,
    duration: 0.45,
    stagger: 0.08,
    ease: 'power3.out',
    delay: 0.1,
  })
}

function resetMobileLinksAnim() {
  if (typeof gsap === 'undefined') return
  gsap.set(mobileLinks, { clearProps: 'all' })
}

function toggleMobileNav(forceClose) {
  if (!mobileNav) return
  const willOpen = forceClose === true ? false : !mobileNav.classList.contains('open')

  mobileNav.classList.toggle('open', willOpen)
  mobileNav.setAttribute('aria-hidden', !willOpen)
  hamburger?.classList.toggle('is-open', willOpen)
  hamburger?.setAttribute('aria-expanded', willOpen)
  hamburger?.setAttribute('aria-label', willOpen ? 'Close menu' : 'Open menu')
  document.body.classList.toggle('nav-open', willOpen)

  if (willOpen) {
    animateMobileLinksIn()
  } else {
    resetMobileLinksAnim()
    document.body.style.overflow = ''
    document.body.style.touchAction = ''
  }
}

initThemeToggle()

if (hamburger) {
  hamburger.setAttribute('aria-expanded', 'false')
  hamburger.addEventListener('click', () => toggleMobileNav())
}

document.querySelector('.mobile-close')?.addEventListener('click', () => toggleMobileNav(true))

mobileLinks.forEach((link) => {
  link.addEventListener('click', () => toggleMobileNav(true))
})

if (isMobileNav() && navbar) navbar.classList.add('scrolled')

window.setTheme = setTheme
window.closeMobileNav = () => toggleMobileNav(true)
