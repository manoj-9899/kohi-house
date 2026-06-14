// interactions.js — Magnetic buttons, gallery lightbox, and hours display

;(function () {
  function initMagneticButtons() {
    document.querySelectorAll('.btn-primary,.btn-outline,.nav-cta').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect()
        const dx = e.clientX - r.left - r.width / 2
        const dy = e.clientY - r.top - r.height / 2
        btn.style.transform = `translate(${dx * 0.12}px,${dy * 0.12}px) scale(1.04)`
      })
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = ''
      })
    })
  }

  const galleryImages = [
    {
      src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1400&q=85',
      caption: 'Main Hall',
    },
    {
      src: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1400&q=85',
      caption: 'Brew Bar',
    },
    {
      src: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1400&q=85',
      caption: 'Garden Terrace',
    },
    {
      src: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=1400&q=85',
      caption: 'Roastery',
    },
    {
      src: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=1400&q=85',
      caption: 'Evening Lounge',
    },
  ]

  let currentLightboxIndex = 0

  function openLightbox(index) {
    const lb = document.getElementById('lightbox')
    const img = document.getElementById('lightbox-img')
    const caption = document.getElementById('lightbox-caption-text')
    const counter = document.getElementById('lightbox-counter')
    if (!lb || !img || !galleryImages[index]) return

    currentLightboxIndex = index
    const item = galleryImages[index]

    img.src = item.src
    img.alt = item.caption
    if (caption) caption.textContent = item.caption
    if (counter) counter.textContent = `${index + 1} / ${galleryImages.length}`

    lb.classList.add('open')
    document.body.style.overflow = 'hidden'
    if (window.lenis) window.lenis.stop()

    lb.querySelector('.lightbox-close')?.focus()
  }

  function closeLightbox() {
    const lb = document.getElementById('lightbox')
    if (!lb) return
    lb.classList.remove('open')
    document.body.style.overflow = ''
    if (window.lenis) window.lenis.start()
  }

  function lightboxNav(direction) {
    const img = document.getElementById('lightbox-img')
    const caption = document.getElementById('lightbox-caption-text')
    const counter = document.getElementById('lightbox-counter')
    if (!img) return

    const total = galleryImages.length
    currentLightboxIndex = (currentLightboxIndex + direction + total) % total
    const item = galleryImages[currentLightboxIndex]

    img.style.opacity = '0'
    img.style.transform = 'scale(0.97)'
    img.style.transition = 'opacity 0.18s ease, transform 0.18s ease'
    setTimeout(() => {
      img.src = item.src
      img.alt = item.caption
      if (caption) caption.textContent = item.caption
      if (counter) counter.textContent = `${currentLightboxIndex + 1} / ${total}`
      img.style.opacity = '1'
      img.style.transform = 'scale(1)'
    }, 180)
  }

  function initLightbox() {
    const lb = document.getElementById('lightbox')
    if (!lb) return

    document.querySelectorAll('.gallery-cell').forEach((cell, index) => {
      cell.style.cursor = 'pointer'
      cell.setAttribute('role', 'button')
      cell.setAttribute('aria-label', `View ${galleryImages[index]?.caption || 'image'} fullscreen`)
      cell.setAttribute('tabindex', '0')
      cell.addEventListener('click', () => openLightbox(index))
      cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openLightbox(index)
        }
      })
    })

    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') lightboxNav(1)
      if (e.key === 'ArrowLeft') lightboxNav(-1)
    })

    let touchStartX = 0
    lb.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.touches[0].clientX
      },
      { passive: true }
    )
    lb.addEventListener(
      'touchend',
      (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX
        if (Math.abs(diff) > 50) lightboxNav(diff > 0 ? 1 : -1)
      },
      { passive: true }
    )
  }

  function parseHoursRange(timeStr) {
    const match = timeStr.match(/(\d+)\s*(AM|PM)\s*–\s*(\d+)\s*(AM|PM)/i)
    if (!match) return null
    let openH = parseInt(match[1], 10)
    let closeH = parseInt(match[3], 10)
    const openMer = match[2].toUpperCase()
    const closeMer = match[4].toUpperCase()
    if (openMer === 'PM' && openH !== 12) openH += 12
    if (openMer === 'AM' && openH === 12) openH = 0
    if (closeMer === 'PM' && closeH !== 12) closeH += 12
    if (closeMer === 'AM' && closeH === 12) closeH = 0
    return { open: openH * 60, close: closeH * 60 }
  }

  function isOpenNow() {
    const now = new Date()
    const day = now.getDay()
    const minutes = now.getHours() * 60 + now.getMinutes()
    let hoursStr
    if (day === 0) hoursStr = '8 AM – 9 PM'
    else if (day === 6) hoursStr = '7 AM – 11 PM'
    else hoursStr = '7 AM – 10 PM'
    const range = parseHoursRange(hoursStr)
    if (!range) return false
    return minutes >= range.open && minutes < range.close
  }

  function initHoursTable() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const todayName = days[new Date().getDay()]

    document.querySelectorAll('.hours-row').forEach((row) => {
      const dayEl = row.querySelector('.hours-day')
      if (!dayEl) return
      const text = dayEl.textContent.trim()
      if (
        text === todayName ||
        (todayName !== 'Saturday' && todayName !== 'Sunday' && text === 'Mon – Fri')
      ) {
        row.classList.add('today')
        if (isOpenNow()) {
          const timeEl = row.querySelector('.hours-time')
          if (timeEl && !row.querySelector('.hours-live-dot')) {
            const dot = document.createElement('span')
            dot.className = 'hours-live-dot'
            dot.title = 'Open now'
            timeEl.insertAdjacentElement('afterend', dot)
          }
        }
      }
    })
  }

  function init() {
    initMagneticButtons()
    initLightbox()
    initHoursTable()
  }

  window.openLightbox = openLightbox
  window.closeLightbox = closeLightbox
  window.lightboxNav = lightboxNav
  window.openLightbox = openLightbox
  window.closeLightbox = closeLightbox

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
