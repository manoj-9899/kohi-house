// events.js — Events calendar, filters, cards, modal, and ICS export

;(function () {
  if (typeof gsap !== 'undefined' && typeof Flip !== 'undefined') {
    gsap.registerPlugin(Flip)
  }

  const EVENTS = [
    {
      id: 1,
      title: 'Jazz in the Garden — Trio Noir',
      date: '2026-06-14',
      time: '8:00 PM',
      venue: 'Garden Terrace',
      type: 'music',
      price: 'Free with reservation',
      description:
        'Trio Noir returns for a summer evening set among the garden terrace vines. Live jazz, candlelight, and our signature cold brew on tap. Reservation required — walk-ins subject to capacity.',
      capacity: 40,
      spotsLeft: 12,
      image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80',
    },
    {
      id: 2,
      title: 'Coffee Cupping: Araku Valley Edition',
      date: '2026-06-18',
      time: '10:00 AM',
      venue: 'Roastery',
      type: 'workshop',
      price: '₹500 per person',
      description:
        'A guided cupping session through three lots from Araku Valley — washed, natural, and honey process. Learn to identify origin notes, acidity, and body with our head roaster. Includes three cups and tasting notes.',
      capacity: 16,
      spotsLeft: 6,
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    },
    {
      id: 3,
      title: 'Solstice Brunch — DJ Set by Meera',
      date: '2026-06-21',
      time: '11:00 AM',
      venue: 'Main Hall',
      type: 'special',
      price: 'Ticketed event',
      description:
        'Celebrate the solstice with an extended brunch service and a downtempo DJ set by Meera. Seasonal brunch plates, spritz bar, and the full coffee menu until 3 PM. Tickets include one brunch plate and a drink.',
      capacity: 60,
      spotsLeft: 18,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    },
    {
      id: 4,
      title: 'Latte Art Competition — Open Entry',
      date: '2026-06-28',
      time: '3:00 PM',
      venue: 'Brew Bar',
      type: 'community',
      price: 'Free entry',
      description:
        'Baristas and enthusiasts welcome. Three rounds: hearts, tulips, and free pour. Judges from our brew team. Prizes include a month of free cortados and Kōhī House merch. Register at the counter by June 26.',
      capacity: 24,
      spotsLeft: 0,
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80',
    },
    {
      id: 5,
      title: 'Acoustic Sundays — Unplugged Sessions',
      date: '2026-07-05',
      time: '6:00 PM',
      venue: 'Garden Terrace',
      type: 'music',
      price: 'Free with reservation',
      description:
        'Intimate acoustic sets every first Sunday. This month: Mumbai singer-songwriter Ananya Rao. Limited seating on the terrace — arrive early for the golden hour set.',
      capacity: 35,
      spotsLeft: 22,
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
    },
    {
      id: 6,
      title: 'Home Brewing 101',
      date: '2026-07-12',
      time: '4:00 PM',
      venue: 'Roastery',
      type: 'workshop',
      price: '₹750 per person',
      description:
        'Learn pour-over fundamentals: grind size, water temp, bloom, and pour technique. Take home a bag of our house blend and a brew guide. Perfect for beginners.',
      capacity: 12,
      spotsLeft: 4,
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80',
    },
  ]

  const FILTERS = [
    { id: 'all', label: 'All', icon: '✦' },
    { id: 'music', label: 'Music', icon: '♫' },
    { id: 'workshop', label: 'Workshop', icon: '⚗' },
    { id: 'special', label: 'Special', icon: '✹' },
    { id: 'community', label: 'Community', icon: '◎' },
  ]

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  let calYear = 2026
  let calMonth = 5
  let selectedDate = null
  let activeFilter = 'all'
  let activeModalEvent = null

  const calGrid = document.getElementById('cal-grid')
  const calMonthYear = document.querySelector('.cal-month-year')
  const eventsList = document.getElementById('events-list')
  const filtersEl = document.getElementById('event-filters')

  if (!calGrid || !eventsList) return

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  }

  function pad(n) {
    return String(n).padStart(2, '0')
  }

  function toIso(y, m, d) {
    return `${y}-${pad(m + 1)}-${pad(d)}`
  }

  function parseDate(iso) {
    const [y, m, d] = iso.split('-').map(Number)
    return new Date(y, m - 1, d)
  }

  function isEventPast(dateStr, timeStr) {
    const [year, month, day] = dateStr.split('-').map(Number)
    const [timePart, meridiem] = timeStr.split(' ')
    let [hours, minutes] = timePart.split(':').map(Number)
    if (meridiem === 'PM' && hours !== 12) hours += 12
    if (meridiem === 'AM' && hours === 12) hours = 0
    const eventDate = new Date(year, month - 1, day, hours, minutes)
    return eventDate < new Date()
  }

  function isDateBeforeToday(iso) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const d = parseDate(iso)
    d.setHours(0, 0, 0, 0)
    return d < today
  }

  function isEventLive(event) {
    const today = new Date()
    const todayIso = toIso(today.getFullYear(), today.getMonth(), today.getDate())
    return event.date === todayIso && !isEventPast(event.date, event.time)
  }

  function getEventsForDate(date) {
    return EVENTS.filter((e) => e.date === date)
  }

  function datesWithEvents(year, month) {
    const prefix = `${year}-${pad(month + 1)}-`
    return new Set(EVENTS.filter((e) => e.date.startsWith(prefix)).map((e) => e.date))
  }

  function getFilteredEvents() {
    let list = EVENTS.slice()
    if (activeFilter !== 'all') list = list.filter((e) => e.type === activeFilter)
    if (selectedDate) list = list.filter((e) => e.date === selectedDate)
    return list.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
  }

  function filterCount(type) {
    if (type === 'all') return EVENTS.length
    return EVENTS.filter((e) => e.type === type).length
  }

  function renderCalendar(year, month) {
    if (!calGrid) return
    calGrid.innerHTML = ''

    if (calMonthYear) calMonthYear.textContent = `${MONTHS[month]} ${year}`

    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrev = new Date(year, month, 0).getDate()
    const today = new Date()
    const todayIso = toIso(today.getFullYear(), today.getMonth(), today.getDate())

    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrev - i
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'cal-day is-other'
      btn.textContent = day
      btn.disabled = true
      calGrid.appendChild(btn)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const iso = toIso(year, month, day)
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'cal-day'
      btn.textContent = day
      btn.dataset.date = iso

      const dayEvents = getEventsForDate(iso)
      const hasUpcoming = dayEvents.some((e) => !isEventPast(e.date, e.time))
      const isPastDay = isDateBeforeToday(iso)

      if (iso === todayIso) btn.classList.add('is-today')
      if (hasUpcoming) btn.classList.add('has-event')
      else if (dayEvents.length) btn.classList.add('has-event-past')
      if (selectedDate === iso) btn.classList.add('is-selected')
      if (isPastDay) {
        btn.classList.add('is-past')
        btn.disabled = true
      } else {
        btn.addEventListener('click', () => selectDate(iso))
      }

      calGrid.appendChild(btn)
    }

    const totalCells = firstDay + daysInMonth
    const trailing = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)
    for (let i = 1; i <= trailing; i++) {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'cal-day is-other'
      btn.textContent = i
      btn.disabled = true
      calGrid.appendChild(btn)
    }
  }

  function selectDate(date) {
    if (isDateBeforeToday(date)) return
    selectedDate = selectedDate === date ? null : date
    renderCalendar(calYear, calMonth)
    renderEventList()
  }

  function prevMonth() {
    calMonth--
    if (calMonth < 0) {
      calMonth = 11
      calYear--
    }
    renderCalendar(calYear, calMonth)
  }

  function nextMonth() {
    calMonth++
    if (calMonth > 11) {
      calMonth = 0
      calYear++
    }
    renderCalendar(calYear, calMonth)
  }

  function isFreeEvent(event) {
    const price = event.price.toLowerCase()
    return price.includes('free') && !price.includes('₹')
  }

  function getRsvpLabel(event) {
    if (event.spotsLeft === 0) return 'Sold Out'
    if (event.spotsLeft <= 10) return `Only ${event.spotsLeft} left →`
    if (isFreeEvent(event)) return "I'll be there →"
    return 'Reserve a spot →'
  }

  function getRsvpAriaLabel(event) {
    if (event.spotsLeft === 0) return `Sold out: ${event.title}`
    if (isFreeEvent(event)) return `RSVP for ${event.title}`
    return `Reserve a spot for ${event.title}`
  }

  function getModalActionLabel(event) {
    if (isFreeEvent(event)) return "I'll be there"
    return 'Reserve a spot'
  }

  function rsvpButton(event) {
    if (isEventPast(event.date, event.time)) {
      return '<span class="event-past-label">Event Ended</span>'
    }

    const spots = event.spotsLeft
    let cls = 'event-rsvp'
    const label = getRsvpLabel(event)
    const disabled = spots === 0

    if (spots === 0) {
      cls += ' event-rsvp--sold'
    } else if (spots <= 10) {
      cls += ' event-rsvp--urgent'
    } else {
      cls += ' event-rsvp--open'
    }

    return `<button type="button" class="${cls}" data-rsvp="${event.id}" ${disabled ? 'disabled' : ''} aria-label="${escapeHtml(getRsvpAriaLabel(event))}">${label}</button>`
  }

  function renderEventCard(event) {
    const d = parseDate(event.date)
    const day = d.getDate()
    const month = MONTHS_SHORT[d.getMonth()]
    const past = isEventPast(event.date, event.time)
    const liveBadge = isEventLive(event)
      ? '<span class="event-tag event-tag--live"><span class="event-dot"></span>Tonight</span>'
      : ''

    return `
      <article class="event-card${past ? ' event--past' : ''}" data-event-id="${event.id}"${past ? '' : ' tabindex="0" role="button"'} aria-label="View ${escapeHtml(event.title)}">
        <div class="event-card-date">
          <div class="event-card-day">${day}</div>
          <div class="event-card-month">${month}</div>
        </div>
        <div class="event-card-main">
          <img class="event-card-image" src="${escapeHtml(event.image)}" alt="" width="80" height="80" loading="lazy" decoding="async">
          <div class="event-card-info">
            <h4 class="event-card-title">${escapeHtml(event.title)}</h4>
            <p class="event-card-meta">${escapeHtml(event.time)} · ${escapeHtml(event.venue)} · ${escapeHtml(event.type)}</p>
          </div>
        </div>
        <div class="event-card-side">
          ${liveBadge}
          <span class="event-card-price">${escapeHtml(event.price)}</span>
          ${rsvpButton(event)}
        </div>
      </article>
    `
  }

  function renderEventList(animate) {
    const list = getFilteredEvents()
    const prevCards = eventsList.querySelectorAll('.event-card')
    const useFlip = animate && typeof Flip !== 'undefined' && prevCards.length > 0 && list.length > 0

    let state
    if (useFlip) state = Flip.getState(prevCards)

    if (!list.length) {
      eventsList.innerHTML = `<div class="events-empty">${selectedDate ? 'No events on this date. Try another day or clear the selection.' : 'No events match this filter.'}</div>`
    } else {
      eventsList.innerHTML = list.map(renderEventCard).join('')
    }

    if (useFlip && list.length) {
      Flip.from(state, { duration: 0.45, ease: 'power2.out', stagger: 0.04, absolute: true })
    }

    bindEventCards()
  }

  function bindEventCards() {
    eventsList.querySelectorAll('.event-card').forEach((card) => {
      const id = Number(card.dataset.eventId)
      const event = EVENTS.find((e) => e.id === id)
      if (!event) return

      if (isEventPast(event.date, event.time)) return

      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-rsvp]')) return
        openModal(event)
      })

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openModal(event)
        }
      })

      card.querySelector('[data-rsvp]')?.addEventListener('click', (e) => {
        e.stopPropagation()
        if (event.spotsLeft === 0) return
        window.lenisScrollTo?.('#reservation')
      })
    })
  }

  function renderFilters() {
    if (!filtersEl) return
    filtersEl.innerHTML = FILTERS.map(
      (f) => `
      <button type="button" class="event-filter${activeFilter === f.id ? ' is-active' : ''}" data-filter="${f.id}">
        <span aria-hidden="true">${f.icon}</span>
        ${f.label}
        <span class="event-filter-count">[${filterCount(f.id)}]</span>
      </button>
    `
    ).join('')

    filtersEl.querySelectorAll('.event-filter').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter
        renderFilters()
        renderEventList(true)
      })
    })
  }

  function formatModalDate(event) {
    const d = parseDate(event.date)
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }

  function openModal(event) {
    if (isEventPast(event.date, event.time)) return

    activeModalEvent = event
    let backdrop = document.querySelector('.event-modal-backdrop')

    if (!backdrop) {
      backdrop = document.createElement('div')
      backdrop.className = 'event-modal-backdrop'
      backdrop.innerHTML = `
        <button type="button" class="modal-close event-modal-close" aria-label="Close">✕</button>
        <div class="event-modal" role="dialog" aria-modal="true" aria-labelledby="event-modal-title" data-lenis-prevent>
          <img class="event-modal-image" src="" alt="" width="800" height="450">
          <div class="event-modal-body">
            <div class="event-modal-date"></div>
            <h3 class="event-modal-title" id="event-modal-title"></h3>
            <p class="event-modal-desc"></p>
            <div class="event-modal-meta"></div>
            <div class="event-modal-actions">
              <button type="button" class="btn-primary event-modal-reserve">RSVP</button>
              <button type="button" class="btn-outline event-modal-calendar">Add to Calendar</button>
            </div>
          </div>
        </div>
      `
      document.body.appendChild(backdrop)

      backdrop.querySelector('.event-modal-close')?.addEventListener('click', closeModal)
      const scrollEl = backdrop.querySelector('.event-modal')
      scrollEl?.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true })
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal()
      })
      backdrop.querySelector('.event-modal-reserve')?.addEventListener('click', () => {
        closeModal()
        window.lenisScrollTo?.('#reservation')
        window.showToast?.('Almost there', 'Pick a date and time below.', 'info')
      })
      backdrop.querySelector('.event-modal-calendar')?.addEventListener('click', () => {
        if (activeModalEvent) generateICS(activeModalEvent)
      })
    }

    const modal = backdrop.querySelector('.event-modal')
    modal?.setAttribute('data-lenis-prevent', '')
    modal.scrollTop = 0

    backdrop.querySelector('.event-modal-image').src = event.image
    backdrop.querySelector('.event-modal-image').alt = event.title
    backdrop.querySelector('.event-modal-date').textContent = `${formatModalDate(event)} · ${event.time}`
    backdrop.querySelector('.event-modal-title').textContent = event.title
    backdrop.querySelector('.event-modal-desc').textContent = event.description
    backdrop.querySelector('.event-modal-meta').textContent = `${event.venue} · ${event.time} · ${event.price} · ${event.spotsLeft > 0 ? `${event.spotsLeft} spots left` : 'Sold out'}`
    const reserveBtn = backdrop.querySelector('.event-modal-reserve')
    if (reserveBtn) {
      const past = isEventPast(event.date, event.time)
      reserveBtn.disabled = past || event.spotsLeft === 0
      reserveBtn.textContent = past ? 'Event Ended' : event.spotsLeft === 0 ? 'Sold Out' : getModalActionLabel(event)
    }

    if (window.lenis) window.lenis.stop()
    document.body.classList.add('events-modal-open')
    backdrop.classList.add('is-open')

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(backdrop, { backgroundColor: 'rgba(0,0,0,0)' }, { backgroundColor: 'rgba(0,0,0,0.8)', duration: 0.35, ease: 'power2.out' })
      gsap.fromTo(modal, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.2)' })
    } else {
      backdrop.style.backgroundColor = 'rgba(0,0,0,0.8)'
      modal.style.opacity = '1'
      modal.style.transform = 'scale(1)'
    }

    document.addEventListener('keydown', onModalKeydown)
  }

  function onModalKeydown(e) {
    if (e.key === 'Escape') closeModal()
  }

  function closeModal() {
    const backdrop = document.querySelector('.event-modal-backdrop')
    if (!backdrop) return
    const modal = backdrop.querySelector('.event-modal')

    const remove = () => {
      backdrop.classList.remove('is-open')
      document.body.classList.remove('events-modal-open')
      if (window.lenis) window.lenis.start()
      document.removeEventListener('keydown', onModalKeydown)
      activeModalEvent = null
    }

    if (typeof gsap !== 'undefined') {
      gsap.to(backdrop, { backgroundColor: 'rgba(0,0,0,0)', duration: 0.25, ease: 'power2.in' })
      gsap.to(modal, {
        scale: 0.92,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: remove,
      })
    } else {
      remove()
    }
  }

  function parseTimeTo24(timeStr) {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
    if (!match) return { h: 12, m: 0 }
    let h = parseInt(match[1], 10)
    const m = parseInt(match[2], 10)
    const pm = match[3].toUpperCase() === 'PM'
    if (pm && h !== 12) h += 12
    if (!pm && h === 12) h = 0
    return { h, m }
  }

  function toICSLocal(dateIso, timeStr, addHours = 0) {
    const [y, mo, d] = dateIso.split('-').map(Number)
    let { h, m } = parseTimeTo24(timeStr)
    h += addHours
    return `${y}${pad(mo)}${pad(d)}T${pad(h)}${pad(m)}00`
  }

  function generateICS(event) {
    const dtStart = toICSLocal(event.date, event.time)
    const dtEnd = toICSLocal(event.date, event.time, 2)
    const now = new Date()
    const dtStamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}T${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
    const desc = event.description.replace(/\r?\n/g, '\\n').replace(/,/g, '\\,')
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Kohi House//Events//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:event-${event.id}@kohihouse.in`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${event.title} — Kōhī House`,
      `DESCRIPTION:${desc}`,
      'LOCATION:Kōhī House, 12 Third Cross Street, Versova, Mumbai',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kohi-house-${event.date}.ics`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    window.showToast?.('Saved', 'Event added to your calendar file.', 'success')
  }

  function init() {
    document.querySelector('.cal-prev')?.addEventListener('click', prevMonth)
    document.querySelector('.cal-next')?.addEventListener('click', nextMonth)
    renderFilters()
    renderCalendar(calYear, calMonth)
    renderEventList(false)
  }

  init()
})()
