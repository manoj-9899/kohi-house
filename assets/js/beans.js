// beans.js — Floating coffee bean canvas animation with mouse parallax

;(function () {
  const c = document.getElementById('bean-canvas')
  const hero = document.getElementById('hero')
  if (!c || !hero) return

  const ctx = c.getContext('2d')
  let W = (c.width = window.innerWidth)
  let H = (c.height = window.innerHeight)
  let running = true
  let rafId = null

  let beanFill = 'rgba(92,61,32,0.15)'
  let beanStroke = 'rgba(13,9,6,0.5)'
  let beanOpacityMin = 0.08
  let beanOpacityMax = 0.25

  function readThemeColors() {
    const root = getComputedStyle(document.documentElement)
    beanFill = root.getPropertyValue('--bean-fill').trim() || beanFill
    beanStroke = root.getPropertyValue('--bean-stroke').trim() || beanStroke
    const isLight = document.documentElement.getAttribute('data-theme') === 'light'
    beanOpacityMin = isLight ? 0.04 : 0.08
    beanOpacityMax = isLight ? 0.12 : 0.25
    beans.forEach((b) => {
      b.opacity = Math.random() * (beanOpacityMax - beanOpacityMin) + beanOpacityMin
    })
  }

  window.addEventListener('resize', () => {
    W = c.width = window.innerWidth
    H = c.height = window.innerHeight
  })

  const N = window.matchMedia('(max-width:768px)').matches ? 8 : 18
  const beans = Array.from({ length: N }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 6 + 4,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.25 + 0.05,
    rot: Math.random() * Math.PI * 2,
    rotV: (Math.random() - 0.5) * 0.015,
    opacity: Math.random() * 0.25 + 0.08,
  }))

  function drawBean(ctx, x, y, r, rot) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rot)
    ctx.beginPath()
    ctx.ellipse(0, 0, r, r * 1.6, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(0, -r * 1.5)
    ctx.lineTo(0, r * 1.5)
    ctx.strokeStyle = beanStroke
    ctx.lineWidth = 0.8
    ctx.stroke()
    ctx.restore()
  }

  function beanFillStyle(opacity) {
    const match = beanFill.match(/rgba?\(([^)]+)\)/)
    if (!match) return `rgba(92,61,32,${opacity})`
    const parts = match[1].split(',').map((s) => s.trim())
    if (parts.length >= 3) {
      return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${opacity})`
    }
    return beanFill
  }

  function loop() {
    if (!running) {
      rafId = null
      return
    }
    ctx.clearRect(0, 0, W, H)
    beans.forEach((b) => {
      b.x += b.vx
      b.y += b.vy
      b.rot += b.rotV
      if (b.y > H + 20) b.y = -20
      if (b.x < -20) b.x = W + 20
      if (b.x > W + 20) b.x = -20
      ctx.fillStyle = beanFillStyle(b.opacity)
      drawBean(ctx, b.x, b.y, b.r, b.rot)
    })
    rafId = requestAnimationFrame(loop)
  }

  function startLoop() {
    if (!running || rafId !== null) return
    rafId = requestAnimationFrame(loop)
  }

  new IntersectionObserver(
    ([entry]) => {
      running = entry.isIntersecting
      if (running) startLoop()
    },
    { threshold: 0 }
  ).observe(hero)

  window.addEventListener('mousemove', (e) => {
    if (!running) return
    const mx = (e.clientX / W - 0.5) * 2
    const my = (e.clientY / H - 0.5) * 2
    beans.forEach((b, i) => {
      const depth = 0.5 + (i % 4) * 0.15
      b.vx += (mx * depth * 0.003 - b.vx) * 0.05
      b.vy += (my * depth * 0.002 - b.vy) * 0.03
    })
  })

  window.addEventListener('themechange', readThemeColors)
  readThemeColors()
  startLoop()
})()
