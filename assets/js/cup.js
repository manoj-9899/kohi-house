// cup.js — Hero Three.js 3D animated coffee cup

;(function () {
  if (typeof THREE === 'undefined') return

  const canvas = document.getElementById('cup-canvas')
  if (!canvas) return

  const scene = new THREE.Scene()

  const cupMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a1508,
    roughness: 0.7,
    metalness: 0.1,
    emissive: 0x1a0a04,
    emissiveIntensity: 0.2,
  })

  const saucerMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a2010,
    roughness: 0.75,
    metalness: 0.08,
    emissive: 0x1a0a04,
    emissiveIntensity: 0.12,
  })

  const profile = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.34, 0),
    new THREE.Vector2(0.4, 0.05),
    new THREE.Vector2(0.46, 0.28),
    new THREE.Vector2(0.51, 0.58),
    new THREE.Vector2(0.55, 0.84),
    new THREE.Vector2(0.57, 0.98),
    new THREE.Vector2(0.53, 1.0),
    new THREE.Vector2(0.48, 0.9),
  ]

  const cup = new THREE.Mesh(new THREE.LatheGeometry(profile, 64), cupMaterial)

  const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.78, 0.07, 64), saucerMaterial)
  saucer.position.y = -0.03

  const coffee = new THREE.Mesh(
    new THREE.CircleGeometry(0.44, 48),
    new THREE.MeshStandardMaterial({
      color: 0x5c3d20,
      roughness: 0.3,
      metalness: 0.05,
    })
  )
  coffee.rotation.x = -Math.PI / 2
  coffee.position.y = 0.9

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.545, 0.014, 10, 64),
    new THREE.MeshStandardMaterial({
      color: 0xc8894a,
      emissive: 0xc8894a,
      emissiveIntensity: 0.55,
      roughness: 0.2,
      metalness: 0.6,
    })
  )
  rim.rotation.x = Math.PI / 2
  rim.position.y = 0.97

  const cupGroup = new THREE.Group()
  cupGroup.add(cup, saucer, coffee, rim)

  const steamParticles = []
  const steamGeo = new THREE.SphereGeometry(0.022, 8, 8)

  for (let i = 0; i < 8; i++) {
    const material = new THREE.MeshBasicMaterial({
      color: 0xf5e6c8,
      transparent: true,
      opacity: 0,
    })
    const particle = new THREE.Mesh(steamGeo, material)
    particle.userData = {
      phase: Math.random() * Math.PI * 2,
      speed: 0.0008 + Math.random() * 0.0005,
      offset: Math.random(),
      baseX: (Math.random() - 0.5) * 0.18,
      baseZ: (Math.random() - 0.5) * 0.12,
    }
    particle.position.set(particle.userData.baseX, 1.02, particle.userData.baseZ)
    steamParticles.push(particle)
    cupGroup.add(particle)
  }

  cupGroup.position.y = 0.05
  scene.add(cupGroup)

  const ambientLight = new THREE.AmbientLight(0xc8894a, 0.4)
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight(0xf5e6c8, 0.8)
  dirLight.position.set(3, 5, 4)
  scene.add(dirLight)

  const pointLight = new THREE.PointLight(0xc8894a, 0.3)
  pointLight.position.set(0, -0.8, 1.2)
  scene.add(pointLight)

  const rimLight = new THREE.PointLight(0xc8894a, 0.45, 4)
  rimLight.position.set(-0.3, 1.15, 1)
  scene.add(rimLight)

  const THEME_CUP = {
    dark: {
      cup: 0x2a1508,
      saucer: 0x3a2010,
      emissive: 0x1a0a04,
      coffee: 0x5c3d20,
      rim: 0xc8894a,
      steam: 0xf5e6c8,
      ambient: 0.4,
      dir: 0.8,
    },
    light: {
      cup: 0x8b6040,
      saucer: 0x6b4a30,
      emissive: 0x3a2518,
      coffee: 0x4a3020,
      rim: 0x8b5e2a,
      steam: 0x2a1a0a,
      ambient: 0.65,
      dir: 1.0,
    },
  }

  function applyCupTheme(theme) {
    const t = THEME_CUP[theme] || THEME_CUP.dark
    cupMaterial.color.setHex(t.cup)
    cupMaterial.emissive.setHex(t.emissive)
    saucerMaterial.color.setHex(t.saucer)
    saucerMaterial.emissive.setHex(t.emissive)
    coffee.material.color.setHex(t.coffee)
    rim.material.color.setHex(t.rim)
    rim.material.emissive.setHex(t.rim)
    steamParticles.forEach((p) => p.material.color.setHex(t.steam))
    ambientLight.intensity = t.ambient
    dirLight.intensity = t.dir
  }

  window.addEventListener('themechange', (e) => {
    applyCupTheme(e.detail?.theme || 'dark')
  })

  applyCupTheme(document.documentElement.getAttribute('data-theme') || 'dark')

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50)
  camera.position.set(0, 0.52, 2.6)
  camera.lookAt(0, 0.42, 0)

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  })

  function getPixelRatioCap() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    return Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)
  }

  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(getPixelRatioCap())
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15

  let targetRotX = 0
  let targetRotZ = 0
  let isActive = true
  let animationId = null

  function resize() {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h, false)
  }

  function checkActive() {
    isActive = !window.matchMedia('(max-width: 768px)').matches
  }

  function onMouseMove(e) {
    const mx = (e.clientX / window.innerWidth - 0.5) * 2
    const my = (e.clientY / window.innerHeight - 0.5) * 2
    targetRotZ = Math.max(-0.15, Math.min(0.15, -mx * 0.15))
    targetRotX = Math.max(-0.15, Math.min(0.15, my * 0.15))
  }

  function updateSteam() {
    const t = Date.now()
    steamParticles.forEach((p) => {
      const d = p.userData
      const life = (t * d.speed + d.offset) % 1
      p.position.y = 1.0 + life * 0.5
      p.position.x = d.baseX + Math.sin(t * 0.002 + d.phase) * 0.05
      p.position.z = d.baseZ + Math.cos(t * 0.0018 + d.phase) * 0.03

      let opacity
      if (life < 0.15) opacity = (life / 0.15) * 0.3
      else if (life < 0.55) opacity = 0.3
      else opacity = ((1 - life) / 0.45) * 0.3
      p.material.opacity = opacity
      p.scale.setScalar(0.7 + life * 0.8)
    })
  }

  function animate() {
    animationId = requestAnimationFrame(animate)
    if (!isActive) return

    cupGroup.rotation.y += 0.004
    cupGroup.rotation.x += (targetRotX - cupGroup.rotation.x) * 0.06
    cupGroup.rotation.z += (targetRotZ - cupGroup.rotation.z) * 0.06
    cupGroup.position.y = 0.05 + Math.sin(Date.now() * 0.001) * 0.08

    updateSteam()
    renderer.render(scene, camera)
  }

  function onResize() {
    resize()
    checkActive()
    renderer.setPixelRatio(getPixelRatioCap())
  }

  resize()
  checkActive()
  window.addEventListener('resize', onResize)
  window.addEventListener('mousemove', onMouseMove)
  animate()
})()
