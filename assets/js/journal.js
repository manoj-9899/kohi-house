// journal.js — Journal cards, article modal, reading progress, and share

;(function () {
  const ARTICLES = [
    {
      id: 1,
      slug: 'araku-valley-indias-best-kept-secret',
      title: "Why Araku Valley Coffee Is India's Best-Kept Secret",
      category: 'Origin Stories',
      excerpt:
        "Nestled in the Eastern Ghats at 900–1100m elevation, Araku Valley produces a coffee so complex it has won at World Coffee Championships...",
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80',
      author: 'Rahul Sharma',
      authorRole: 'Head Barista',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
      date: '2026-06-08',
      readTime: 6,
      body: `
        <p>Most coffee drinkers in India know the names of Brazilian or Ethiopian origins before they know their own. That is beginning to change — and Araku Valley is the reason why.</p>
        <p>Nestled in the Eastern Ghats at 900–1100 metres elevation, this tribal-led farming region in Andhra Pradesh produces a coffee of extraordinary complexity. Washed lots carry bright citrus and stone fruit; naturals deepen into dark chocolate and jaggery sweetness. It is not subtle coffee. It is confident coffee.</p>
        <h2>From forest floor to cup</h2>
        <p>What makes Araku different is not altitude alone. The valley's red laterite soil, shade-grown canopy, and organic farming cooperatives create conditions that mirror the best smallholder regions in Central America — but with a distinctly Indian terroir.</p>
        <p>At Kōhī House, we source directly through partners who pay above fair-trade minimums and invest in community health and education. When you drink our Araku Gold, you are tasting a supply chain built on dignity, not extraction.</p>
        <h2>Why it wins on the world stage</h2>
        <p>Araku lots have placed at World Coffee Championships and earned scores above 85 on the SCA scale — a threshold reserved for truly specialty grade. Judges note its balance: enough acidity to feel alive, enough body to satisfy, and a finish that lingers like monsoon rain on hot stone.</p>
        <p>We rotate our Araku offering seasonally. Visit the roastery on a cupping morning and ask Rahul to walk you through the current lot. He has cupped every harvest since we opened — and he never tires of the story.</p>
      `,
    },
    {
      id: 2,
      slug: 'pour-over-ritual-perfect-cup',
      title: 'The Pour-Over Ritual: How to Make Time for One Perfect Cup',
      category: 'Brew Guides',
      excerpt:
        'The pour-over is not just a brewing method. It is an act of presence. Here is how we approach it every single morning...',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
      author: 'Meera Iyer',
      authorRole: 'Roastery Manager',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80',
      date: '2026-05-28',
      readTime: 4,
      body: `
        <p>The pour-over is not just a brewing method. It is an act of presence — four minutes where the only thing that matters is water meeting ground coffee at the right temperature, in the right rhythm.</p>
        <p>At Kōhī House, we open every service day with a pour-over for the team. Not because we need caffeine — we have an espresso machine — but because the ritual sets the tone. Slow is not lazy here. Slow is intentional.</p>
        <h2>Our morning recipe</h2>
        <p>Start with 18g of freshly ground coffee, medium-fine — like sea salt between your fingers. Rinse your filter with hot water to remove paper taste and preheat the vessel. Add grounds, create a small well, and bloom with 40g of water at 93°C. Wait 30 seconds. Watch the coffee rise and fall like a breath.</p>
        <p>Pour in concentric circles, never flooding the edges. Total brew water: 300g. Total time: 3:30 to 4:00. If it drains too fast, grind finer. Too slow, coarser. The cup will tell you everything if you listen.</p>
        <h2>Why we teach this first</h2>
        <p>Every barista who joins Kōhī House learns pour-over before they touch the espresso machine. It teaches patience, observation, and respect for the bean. You cannot rush a good pour-over — and that is precisely the point.</p>
        <p>Join our Home Brewing 101 workshop or ask Meera at the roastery counter for a personal demo. Bring your questions. Leave with a brew guide and a bag of our house blend.</p>
      `,
    },
    {
      id: 3,
      slug: 'monsoon-malabar-wet-processed-coffee',
      title: 'Monsoon Malabar: Why Wet-Processed Coffee Tastes Like Rain',
      category: 'Café Culture',
      excerpt:
        'Every June, we switch our seasonal offering to Monsoon Malabar — a coffee deliberately exposed to monsoon winds for 12 weeks...',
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80',
      author: 'Kōhī Team',
      authorRole: '',
      authorAvatar: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=80&q=80',
      date: '2026-06-01',
      readTime: 5,
      body: `
        <p>Every June, as the first monsoon clouds gather over the Arabian Sea, we switch our seasonal espresso blend to Monsoon Malabar — a coffee that tastes, improbably, like the season itself.</p>
        <p>Monsoon Malabar is not an accident of weather. It is a process deliberately refined over centuries in the port cities of Malabar. Green coffee beans, harvested and processed, are spread in open warehouses along the coast and exposed to monsoon winds for twelve weeks. The beans swell, lose acidity, and take on a mellow, earthy character unlike anything else in the coffee world.</p>
        <h2>A flavour born of patience</h2>
        <p>The result is low-acid, heavy-bodied, and deeply savoury — notes of dark cocoa, cedar, and wet earth. It is the coffee equivalent of a well-aged spirit: smooth, contemplative, best sipped slowly while rain drums on the window.</p>
        <p>We serve Monsoon Malabar as our house espresso from June through August. It pairs beautifully with our monsoon menu — cardamom buns, pepper-caramel cookies, and the occasional hot masala chocolate.</p>
        <h2>Come taste the season</h2>
        <p>Ask any barista for a side-by-side: our usual Araku espresso against the Monsoon Malabar. The difference is striking — one bright and fruit-forward, the other round and brooding. Both distinctly Indian. Both worth savouring.</p>
        <p>Monsoon Malabar is available by the cup, as espresso drinks, and as retail bags while stocks last. When the rains end, so does the lot — until next June.</p>
      `,
    },
  ]

  const grid = document.getElementById('journal-grid')
  if (!grid) return

  let activeArticle = null

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  }

  function formatDate(iso) {
    const d = new Date(iso + 'T12:00:00')
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  function articleUrl(slug) {
    const base = window.location.href.split('#')[0]
    return `${base}#journal/${slug}`
  }

  function renderCard(article) {
    const authorLine = article.authorRole
      ? `${escapeHtml(article.author)} · ${escapeHtml(article.authorRole)}`
      : escapeHtml(article.author)

    return `
      <article class="journal-card" data-slug="${escapeHtml(article.slug)}">
        <div class="journal-card-image-wrap">
          <img
            class="journal-card-image"
            src="${escapeHtml(article.image)}"
            alt=""
            width="800"
            height="450"
            loading="lazy"
            decoding="async">
          <span class="journal-card-category">${escapeHtml(article.category)}</span>
        </div>
        <div class="journal-card-body">
          <span class="journal-card-read">${article.readTime} min read</span>
          <h3 class="journal-card-title">${escapeHtml(article.title)}</h3>
          <p class="journal-card-excerpt">${escapeHtml(article.excerpt)}</p>
          <div class="journal-card-author">
            <img
              class="journal-author-avatar"
              src="${escapeHtml(article.authorAvatar)}"
              alt=""
              width="32"
              height="32"
              loading="lazy"
              decoding="async">
            <div>
              <span class="journal-author-name">${authorLine}</span>
              <span class="journal-author-meta">${formatDate(article.date)}</span>
            </div>
          </div>
          <button type="button" class="journal-read-more" data-slug="${escapeHtml(article.slug)}">
            Read More <span class="journal-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </article>
    `
  }

  function ensureModal() {
    let backdrop = document.querySelector('.journal-modal-backdrop')
    let modal = document.querySelector('.journal-modal')

    if (!backdrop) {
      backdrop = document.createElement('div')
      backdrop.className = 'journal-modal-backdrop'
      backdrop.setAttribute('aria-hidden', 'true')
      document.body.appendChild(backdrop)

      backdrop.addEventListener('click', closeModal)
    }

    if (!modal) {
      modal = document.createElement('div')
      modal.className = 'journal-modal'
      modal.setAttribute('role', 'dialog')
      modal.setAttribute('aria-modal', 'true')
      modal.setAttribute('aria-hidden', 'true')
      modal.innerHTML = `
        <div class="journal-progress" aria-hidden="true"><div class="journal-progress-bar"></div></div>
        <button type="button" class="journal-modal-close" aria-label="Close article">✕</button>
        <button type="button" class="journal-modal-share">Share</button>
        <div class="journal-modal-scroll" data-lenis-prevent>
          <header class="journal-modal-header">
            <img class="journal-modal-hero" src="" alt="" width="1200" height="514">
            <div class="journal-modal-header-overlay">
              <span class="journal-modal-category"></span>
              <h1 class="journal-modal-title" id="journal-modal-title"></h1>
            </div>
          </header>
          <div class="journal-modal-content">
            <div class="journal-modal-meta"></div>
            <div class="journal-modal-body"></div>
          </div>
        </div>
      `
      document.body.appendChild(modal)

      modal.querySelector('.journal-modal-close')?.addEventListener('click', closeModal)
      modal.querySelector('.journal-modal-share')?.addEventListener('click', shareArticle)

      const scrollEl = modal.querySelector('.journal-modal-scroll')
      scrollEl?.setAttribute('data-lenis-prevent', '')
      scrollEl?.addEventListener('scroll', updateProgress, { passive: true })
      scrollEl?.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true })
    }

    return { backdrop, modal }
  }

  function updateProgress() {
    const modal = document.querySelector('.journal-modal')
    const bar = modal?.querySelector('.journal-progress-bar')
    const scrollEl = modal?.querySelector('.journal-modal-scroll')
    if (!bar || !scrollEl) return

    const max = scrollEl.scrollHeight - scrollEl.clientHeight
    const pct = max > 0 ? (scrollEl.scrollTop / max) * 100 : 0
    bar.style.width = `${pct}%`
  }

  function openModal(article) {
    activeArticle = article
    const { backdrop, modal } = ensureModal()

    modal.querySelector('.journal-modal-hero').src = article.image
    modal.querySelector('.journal-modal-hero').alt = article.title
    modal.querySelector('.journal-modal-category').textContent = article.category
    modal.querySelector('.journal-modal-title').textContent = article.title

    const roleLine = article.authorRole ? ` · ${article.authorRole}` : ''
    modal.querySelector('.journal-modal-meta').innerHTML = `
      <div class="journal-modal-meta-author">
        <img src="${escapeHtml(article.authorAvatar)}" alt="" width="36" height="36">
        <span>${escapeHtml(article.author)}${escapeHtml(roleLine)}</span>
      </div>
      <span>${formatDate(article.date)}</span>
      <span>${article.readTime} min read</span>
    `
    modal.querySelector('.journal-modal-body').innerHTML = article.body

    const scrollEl = modal.querySelector('.journal-modal-scroll')
    scrollEl?.setAttribute('data-lenis-prevent', '')
    scrollEl.scrollTop = 0
    updateProgress()

    if (window.lenis) window.lenis.stop()
    document.body.classList.add('journal-modal-open')
    document.body.style.overflow = 'hidden'
    backdrop.classList.add('is-open')
    backdrop.setAttribute('aria-hidden', 'false')
    modal.classList.add('is-open')
    modal.setAttribute('aria-hidden', 'false')

    history.replaceState(null, '', `#journal/${article.slug}`)
    document.addEventListener('keydown', onModalKeydown)

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' })
    }
  }

  function closeModal() {
    const backdrop = document.querySelector('.journal-modal-backdrop')
    const modal = document.querySelector('.journal-modal')
    if (!backdrop || !modal) return

    const finish = () => {
      backdrop.classList.remove('is-open')
      backdrop.setAttribute('aria-hidden', 'true')
      modal.classList.remove('is-open')
      modal.setAttribute('aria-hidden', 'true')
      document.body.classList.remove('journal-modal-open')
      document.body.style.overflow = ''
      if (window.lenis) window.lenis.start()
      document.removeEventListener('keydown', onModalKeydown)
      activeArticle = null

      const base = window.location.href.split('#')[0]
      history.replaceState(null, '', base + (window.location.search || ''))
    }

    if (typeof gsap !== 'undefined') {
      gsap.to(modal, { opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: finish })
    } else {
      finish()
    }
  }

  function onModalKeydown(e) {
    if (e.key === 'Escape') closeModal()
  }

  async function shareArticle() {
    if (!activeArticle) return
    const url = articleUrl(activeArticle.slug)
    const shareData = {
      title: `${activeArticle.title} — Kōhī House Journal`,
      text: activeArticle.excerpt,
      url,
    }

    try {
      if (navigator.share && window.matchMedia('(max-width: 768px)').matches) {
        await navigator.share(shareData)
        return
      }
    } catch (err) {
      if (err?.name === 'AbortError') return
    }

    try {
      await navigator.clipboard.writeText(url)
      window.showToast?.('Link copied', 'Share this article with fellow coffee lovers.', 'success')
    } catch {
      window.showToast?.('Share', url, 'info', 5000)
    }
  }

  function bindCardHovers() {
    if (typeof gsap === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    grid.querySelectorAll('.journal-card').forEach((card) => {
      const img = card.querySelector('.journal-card-image')
      if (!img) return

      card.addEventListener('mouseenter', () => {
        gsap.to(img, { scale: 1.04, duration: 0.55, ease: 'power2.out' })
      })
      card.addEventListener('mouseleave', () => {
        gsap.to(img, { scale: 1, duration: 0.55, ease: 'power2.out' })
      })
    })
  }

  function bindCards() {
    grid.querySelectorAll('.journal-read-more').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const slug = btn.dataset.slug
        const article = ARTICLES.find((a) => a.slug === slug)
        if (article) openModal(article)
      })
    })

    grid.querySelectorAll('.journal-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.journal-read-more')) return
        const slug = card.dataset.slug
        const article = ARTICLES.find((a) => a.slug === slug)
        if (article) openModal(article)
      })
    })

    bindCardHovers()
  }

  function handleDeepLink() {
    const hash = window.location.hash
    const match = hash.match(/^#journal\/([a-z0-9-]+)$/i)
    if (!match) return
    const article = ARTICLES.find((a) => a.slug === match[1])
    if (article) {
      requestAnimationFrame(() => openModal(article))
    }
  }

  function init() {
    grid.innerHTML = ARTICLES.map(renderCard).join('')
    bindCards()
    handleDeepLink()
    window.addEventListener('hashchange', handleDeepLink)
  }

  init()
})()
