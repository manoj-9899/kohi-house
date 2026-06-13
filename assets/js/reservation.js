// reservation.js — Multi-step reservation wizard with GSAP transitions and validation

(function () {
  const CUSTOM_TIME_ID = '__custom__'
  const OPEN_MINUTES = 7 * 60 // 7:00 AM
  const CLOSE_MINUTES = 22 * 60 // 10:00 PM

  const TIME_SLOTS = [
    { time: '7:30 AM', mood: 'The quiet hour' },
    { time: '9:00 AM', mood: 'Brunch energy' },
    { time: '11:30 AM', mood: 'Mid-morning pause' },
    { time: '1:00 PM', mood: 'Afternoon stillness' },
    { time: '3:30 PM', mood: 'Golden light' },
    { time: '5:00 PM', mood: 'Evening unwind' },
    { time: '6:30 PM', mood: 'Golden hour' },
    { time: '8:00 PM', mood: 'Night cap' },
    { time: '9:30 PM', mood: 'Last seating' },
  ]

  const OCCASIONS = [
    { id: 'coffee', icon: '☕', label: 'Just coffee' },
    { id: 'celebration', icon: '🎂', label: 'Celebration' },
    { id: 'date', icon: '💫', label: 'Date' },
    { id: 'work', icon: '💼', label: 'Work' },
  ]

  const DIETARY = ['Vegan', 'Gluten-free', 'Nut allergy', 'Dairy-free']

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const state = {
    step: 1,
    date: null,
    time: null,
    customTime: '',
    guests: 2,
    occasion: 'coffee',
    fname: '',
    lname: '',
    email: '',
    phone: '',
    notes: '',
    dietary: [],
    bookingRef: '',
  }

  let calendarMonth = new Date().getMonth()
  let calendarYear = new Date().getFullYear()
  let isAnimating = false

  const wizard = document.getElementById('reservation-wizard')
  const successEl = document.getElementById('reservation-success')
  if (!wizard) return

  function canAnimate() {
    return typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  function formatDateLong(date) {
    if (!date) return ''
    const d = new Date(date + 'T12:00:00')
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }

  function formatDateShort(date) {
    if (!date) return ''
    const d = new Date(date + 'T12:00:00')
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  function generateRef() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let ref = ''
    for (let i = 0; i < 6; i++) ref += chars[Math.floor(Math.random() * chars.length)]
    return ref
  }

  function shakeEl(el) {
    if (!el || !canAnimate()) return
    gsap.fromTo(el, { x: 0 }, { x: 0, duration: 0.4, keyframes: [{ x: -8 }, { x: 8 }, { x: -6 }, { x: 6 }, { x: 0 }] })
  }

  function renderCalendar() {
    const grid = wizard.querySelector('.date-picker-grid')
    const monthLabel = wizard.querySelector('.date-picker-month')
    const selectedLabel = wizard.querySelector('.date-picker-selected')
    if (!grid || !monthLabel) return

    monthLabel.textContent = `${MONTHS[calendarMonth]} ${calendarYear}`
    grid.innerHTML = ''

    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay()
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < firstDay; i++) {
      grid.innerHTML += '<button type="button" class="date-picker-day is-empty" disabled></button>'
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(calendarYear, calendarMonth, day)
      const iso = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const isPast = dateObj < today
      const isToday = dateObj.getTime() === today.getTime()
      const isSelected = state.date === iso
      let cls = 'date-picker-day'
      if (isPast) cls += ' is-disabled'
      if (isToday) cls += ' is-today'
      if (isSelected) cls += ' is-selected'
      grid.innerHTML += `<button type="button" class="${cls}" data-date="${iso}" ${isPast ? 'disabled' : ''}>${day}</button>`
    }

    if (selectedLabel) {
      selectedLabel.innerHTML = state.date
        ? `Selected: <strong>${formatDateLong(state.date)}</strong>`
        : 'Choose a date for your visit'
    }

    grid.querySelectorAll('.date-picker-day:not(.is-empty):not(.is-disabled)').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.date = btn.dataset.date
        renderCalendar()
        hideStepError()
      })
    })
  }

  function formatTime12h(time24) {
    if (!time24 || !/^\d{2}:\d{2}$/.test(time24)) return ''
    const [h, m] = time24.split(':').map(Number)
    const pm = h >= 12
    const hour12 = h % 12 || 12
    return `${hour12}:${String(m).padStart(2, '0')} ${pm ? 'PM' : 'AM'}`
  }

  function highlightSelectedTimeSlot() {
    wizard.querySelectorAll('.time-slot').forEach((btn) => {
      btn.classList.toggle('is-selected', btn.dataset.time === state.time)
    })
  }

  function getEffectiveTimeLabel() {
    if (state.time === CUSTOM_TIME_ID) return formatTime12h(state.customTime)
    return state.time
  }

  function isCustomTimeValid() {
    if (!state.customTime) return false
    const [h, m] = state.customTime.split(':').map(Number)
    const minutes = h * 60 + m
    return minutes >= OPEN_MINUTES && minutes <= CLOSE_MINUTES
  }

  function toggleCustomTimeWrap(show) {
    const wrap = wizard.querySelector('.time-custom-wrap')
    if (wrap) wrap.hidden = !show
  }

  function renderTimeSlots() {
    const container = wizard.querySelector('.time-slots')
    if (!container) return
    const isCustom = state.time === CUSTOM_TIME_ID
    container.innerHTML =
      TIME_SLOTS.map(
        (slot) => `
      <button type="button" class="time-slot${state.time === slot.time ? ' is-selected' : ''}" data-time="${slot.time}">
        <span class="time-slot-time">${slot.time}</span>
        <span class="time-slot-mood">${slot.mood}</span>
      </button>`
      ).join('') +
      `
      <button type="button" class="time-slot time-slot--custom${isCustom ? ' is-selected' : ''}" data-time="${CUSTOM_TIME_ID}">
        <span class="time-slot-time">Custom time</span>
        <span class="time-slot-mood">Pick any time until 10 PM</span>
      </button>`

    toggleCustomTimeWrap(isCustom)

    container.querySelectorAll('.time-slot').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.time = btn.dataset.time
        if (state.time !== CUSTOM_TIME_ID) state.customTime = ''
        renderTimeSlots()
        hideStepError()
        if (state.time === CUSTOM_TIME_ID) {
          const input = wizard.querySelector('#custom-time')
          input?.focus()
        }
      })
    })
  }

  function renderGuestCounter() {
    const val = wizard.querySelector('.guest-counter-value')
    const minus = wizard.querySelector('.guest-counter-minus')
    const plus = wizard.querySelector('.guest-counter-plus')
    if (val) val.textContent = state.guests
    if (minus) minus.disabled = state.guests <= 1
    if (plus) plus.disabled = state.guests >= 10
  }

  function renderOccasions() {
    const container = wizard.querySelector('.occasion-cards')
    if (!container) return
    container.innerHTML = OCCASIONS.map(
      (o) => `
      <button type="button" class="occasion-card${state.occasion === o.id ? ' is-selected' : ''}" data-occasion="${o.id}">
        <span class="occasion-icon">${o.icon}</span>
        <span class="occasion-label">${o.label}</span>
      </button>`
    ).join('')

    container.querySelectorAll('.occasion-card').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.occasion = btn.dataset.occasion
        renderOccasions()
      })
    })
  }

  function renderDietary() {
    wizard.querySelectorAll('.dietary-option').forEach((opt) => {
      const val = opt.dataset.value
      opt.classList.toggle('is-checked', state.dietary.includes(val))
    })
  }

  function renderSummary() {
    const occasion = OCCASIONS.find((o) => o.id === state.occasion)
    const slot = TIME_SLOTS.find((s) => s.time === state.time)
    const timeLabel = getEffectiveTimeLabel()
    const dietary = state.dietary.length ? state.dietary.join(', ') : 'None specified'

    wizard.querySelector('.summary-date').textContent = formatDateLong(state.date)
    wizard.querySelector('.summary-time').textContent =
      state.time === CUSTOM_TIME_ID
        ? timeLabel || 'Custom time'
        : slot
          ? `${slot.time} — ${slot.mood}`
          : timeLabel
    wizard.querySelector('.summary-guests').textContent = `${state.guests} guest${state.guests > 1 ? 's' : ''}`
    wizard.querySelector('.summary-occasion').textContent = occasion ? `${occasion.icon} ${occasion.label}` : state.occasion
    wizard.querySelector('.summary-name').textContent = `${state.fname} ${state.lname}`
    wizard.querySelector('.summary-contact').textContent = `${state.email} · ${state.phone}`
    wizard.querySelector('.summary-dietary').textContent = dietary
    wizard.querySelector('.summary-notes').textContent = state.notes || 'None'
  }

  function updateProgress() {
    wizard.querySelectorAll('.wizard-dot').forEach((dot, i) => {
      const stepNum = i + 1
      dot.classList.remove('is-active', 'is-complete')
      if (stepNum < state.step) dot.classList.add('is-complete')
      else if (stepNum === state.step) dot.classList.add('is-active')
    })

    wizard.querySelectorAll('.wizard-line-fill').forEach((fill, i) => {
      fill.style.transform = i < state.step - 1 ? 'scaleX(1)' : 'scaleX(0)'
    })

    const backBtn = wizard.querySelector('.wizard-btn-back')
    const nextBtn = wizard.querySelector('.wizard-btn-next')
    if (backBtn) backBtn.hidden = state.step === 1
    if (nextBtn) {
      nextBtn.textContent = state.step === 3 ? 'Confirm booking' : 'Continue'
    }
  }

  function getActiveStep() {
    return wizard.querySelector(`.wizard-step[data-step="${state.step}"]`)
  }

  function transitionToStep(newStep, direction) {
    if (isAnimating || newStep === state.step) return
    const current = getActiveStep()
    const next = wizard.querySelector(`.wizard-step[data-step="${newStep}"]`)
    if (!current || !next) return

    hideStepError()
    isAnimating = true

    const finish = () => {
      current.classList.remove('is-active')
      next.classList.add('is-active')
      state.step = newStep
      updateProgress()
      if (newStep === 3) renderSummary()
      isAnimating = false
    }

    if (!canAnimate()) {
      finish()
      return
    }

    const outX = direction === 'forward' ? -40 : 40
    const inX = direction === 'forward' ? 40 : -40

    gsap.to(current, {
      x: outX,
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        gsap.set(current, { x: 0, opacity: 1 })
        current.classList.remove('is-active')
        next.classList.add('is-active')
        gsap.set(next, { x: inX, opacity: 0 })
        gsap.to(next, {
          x: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power3.out',
          onComplete: () => {
            state.step = newStep
            updateProgress()
            if (newStep === 3) renderSummary()
            isAnimating = false
          },
        })
      },
    })
  }

  function showStepError(msg) {
    const el = wizard.querySelector('.wizard-step-error')
    if (el) {
      el.textContent = msg
      el.classList.add('is-visible')
      shakeEl(el)
    }
    window.showToast?.('Required', 'Please fill in all required fields.', 'warning')
  }

  function hideStepError() {
    const el = wizard.querySelector('.wizard-step-error')
    if (el) el.classList.remove('is-visible')
  }

  function validateStep1() {
    if (!state.date) {
      showStepError('Please select a date for your visit.')
      shakeEl(wizard.querySelector('.date-picker'))
      return false
    }
    if (!state.time) {
      showStepError('Please choose a preferred time slot.')
      shakeEl(wizard.querySelector('.time-slots'))
      return false
    }
    if (state.time === CUSTOM_TIME_ID) {
      if (!isCustomTimeValid()) {
        showStepError('Please enter a time between 7:00 AM and 10:00 PM.')
        shakeEl(wizard.querySelector('.time-custom-wrap'))
        wizard.querySelector('#custom-time')?.focus()
        return false
      }
    }
    return true
  }

  function validateField(field) {
    const input = field.querySelector('input, textarea')
    if (!input) return true
    const id = input.id
    let valid = true
    let msg = ''

    if (id === 'fname') {
      const v = input.value.trim()
      valid = v.length >= 2
      msg = 'Please enter at least 2 characters.'
      state.fname = v
    } else if (id === 'lname') {
      const v = input.value.trim()
      valid = v.length >= 2
      msg = 'Please enter at least 2 characters.'
      state.lname = v
    } else if (id === 'email') {
      const v = input.value.trim()
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      msg = 'Please enter a valid email address.'
      state.email = v
    } else if (id === 'phone') {
      const digits = input.value.replace(/\D/g, '').slice(-10)
      valid = digits.length === 10
      msg = 'Please enter a 10-digit phone number.'
      state.phone = input.value.trim()
    } else if (id === 'notes') {
      state.notes = input.value.trim()
      return true
    }

    field.classList.toggle('is-error', !valid)
    field.classList.toggle('is-success', valid && input.value.trim().length > 0)
    const errEl = field.querySelector('.wizard-field-error')
    if (errEl) errEl.textContent = msg
    if (!valid) shakeEl(input)
    return valid
  }

  function validateStep2() {
    const fields = wizard.querySelectorAll('.wizard-step[data-step="2"] .wizard-field')
    let allValid = true
    fields.forEach((field) => {
      const input = field.querySelector('input, textarea')
      if (input && input.id !== 'notes') {
        if (!validateField(field)) allValid = false
      }
    })
    if (!allValid) showStepError('Please fix the highlighted fields before continuing.')
    return allValid
  }

  function buildReservationPayload(ref) {
    return {
      booking_ref: ref,
      reservation_date: state.date,
      reservation_time: getEffectiveTimeLabel(),
      is_custom_time: state.time === CUSTOM_TIME_ID,
      guests: state.guests,
      occasion: state.occasion,
      first_name: state.fname.trim(),
      last_name: state.lname.trim(),
      email: state.email.trim().toLowerCase(),
      phone: state.phone.replace(/\D/g, '').slice(-10),
      notes: state.notes.trim() || null,
      dietary: state.dietary,
    }
  }

  async function insertReservation(ref) {
    const client = window.kohiSupabase
    if (!client) return { ok: false, error: { message: 'not_configured' } }

    const { error } = await client.from('reservations').insert(buildReservationPayload(ref))
    return { ok: !error, error }
  }

  function setConfirmLoading(loading) {
    const nextBtn = wizard.querySelector('.wizard-btn-next')
    if (!nextBtn) return
    nextBtn.disabled = loading
    nextBtn.textContent = loading ? 'Confirming…' : state.step === 3 ? 'Confirm booking' : 'Continue'
    nextBtn.setAttribute('aria-busy', loading ? 'true' : 'false')
  }

  async function submitReservation() {
    if (isAnimating) return

    setConfirmLoading(true)
    hideStepError()

    let ref = generateRef()
    let result = await insertReservation(ref)

    if (!result.ok && result.error?.code === '23505') {
      ref = generateRef()
      result = await insertReservation(ref)
    }

    setConfirmLoading(false)

    if (!result.ok) {
      if (result.error?.message === 'not_configured') {
        showStepError('Reservations are not connected yet. Please call us to book.')
        window.showToast?.(
          'Booking unavailable',
          'Online reservations are being set up. Please contact us directly.',
          'warning'
        )
      } else {
        showStepError('We could not save your reservation. Please try again.')
        window.showToast?.('Something went wrong', 'Please try again or contact us by phone.', 'error')
        console.error('Reservation insert failed:', result.error)
      }
      return
    }

    state.bookingRef = ref
    showSuccess()
  }

  function showSuccess() {
    wizard.hidden = true
    successEl.hidden = false

    window.showToast?.('Confirmed!', 'Your table is confirmed. Check your email.', 'success')

    successEl.querySelector('.success-name').textContent = state.fname
    successEl.querySelector('.success-ref-code').textContent = state.bookingRef
    successEl.querySelector('.success-datetime').textContent = `We'll see you on ${formatDateShort(state.date)} at ${getEffectiveTimeLabel()}`

    const calBtn = successEl.querySelector('.success-btn-calendar')
    if (calBtn) {
      const title = encodeURIComponent('Kōhī House Reservation')
      const details = encodeURIComponent(`Booking ref: ${state.bookingRef}. ${state.guests} guests.`)
      const dateStr = state.date.replace(/-/g, '')
      const displayTime = getEffectiveTimeLabel()
      const timeMatch = displayTime.match(/(\d+):(\d+)\s*(AM|PM)/i)
      let hh = '12', mm = '00'
      if (timeMatch) {
        let h = parseInt(timeMatch[1], 10)
        mm = timeMatch[2]
        const pm = timeMatch[3].toUpperCase() === 'PM'
        if (pm && h !== 12) h += 12
        if (!pm && h === 12) h = 0
        hh = String(h).padStart(2, '0')
      } else if (state.customTime) {
        ;[hh, mm] = state.customTime.split(':')
      }
      const start = `${dateStr}T${hh}${mm}00`
      const end = `${dateStr}T${String(parseInt(hh) + 1).padStart(2, '0')}${mm}00`
      calBtn.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`
      calBtn.target = '_blank'
      calBtn.rel = 'noopener'
    }

    if (canAnimate()) {
      const circle = successEl.querySelector('.success-check-circle')
      const path = successEl.querySelector('.success-check-path')
      gsap.fromTo(successEl, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
      gsap.fromTo(circle, { strokeDashoffset: 166 }, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' })
      gsap.fromTo(path, { strokeDashoffset: 48 }, { strokeDashoffset: 0, duration: 0.4, delay: 0.5, ease: 'power2.out' })
    }
  }

  function bindEvents() {
    wizard.querySelector('.date-picker-prev')?.addEventListener('click', () => {
      calendarMonth--
      if (calendarMonth < 0) { calendarMonth = 11; calendarYear-- }
      renderCalendar()
    })
    wizard.querySelector('.date-picker-next')?.addEventListener('click', () => {
      calendarMonth++
      if (calendarMonth > 11) { calendarMonth = 0; calendarYear++ }
      renderCalendar()
    })

    wizard.querySelector('.guest-counter-minus')?.addEventListener('click', () => {
      if (state.guests > 1) { state.guests--; renderGuestCounter() }
    })
    wizard.querySelector('.guest-counter-plus')?.addEventListener('click', () => {
      if (state.guests < 10) { state.guests++; renderGuestCounter() }
    })

    wizard.querySelectorAll('.dietary-option').forEach((opt) => {
      opt.addEventListener('click', () => {
        const val = opt.dataset.value
        const idx = state.dietary.indexOf(val)
        if (idx >= 0) state.dietary.splice(idx, 1)
        else state.dietary.push(val)
        renderDietary()
      })
    })

    wizard.querySelectorAll('.wizard-step[data-step="2"] .wizard-field input').forEach((input) => {
      input.addEventListener('blur', () => validateField(input.closest('.wizard-field')))
    })

    wizard.querySelector('#notes')?.addEventListener('blur', (e) => {
      state.notes = e.target.value.trim()
    })

    wizard.querySelector('#custom-time')?.addEventListener('input', (e) => {
      state.customTime = e.target.value
      state.time = CUSTOM_TIME_ID
      hideStepError()
      highlightSelectedTimeSlot()
      toggleCustomTimeWrap(true)
    })

    wizard.querySelector('#custom-time')?.addEventListener('blur', (e) => {
      state.customTime = e.target.value
      if (state.customTime) state.time = CUSTOM_TIME_ID
    })

    wizard.querySelector('.wizard-btn-back')?.addEventListener('click', () => {
      if (state.step > 1) transitionToStep(state.step - 1, 'back')
    })

    wizard.querySelector('.wizard-btn-next')?.addEventListener('click', () => {
      if (state.step === 1 && validateStep1()) transitionToStep(2, 'forward')
      else if (state.step === 2 && validateStep2()) transitionToStep(3, 'forward')
      else if (state.step === 3) submitReservation()
    })
  }

  function init() {
    renderCalendar()
    renderTimeSlots()
    renderGuestCounter()
    renderOccasions()
    renderDietary()
    updateProgress()
    bindEvents()
  }

  init()
})()
