// whatsapp.js — Shared WhatsApp helpers (contact vs reservation)

;(function () {
  const WHATSAPP_NUMBER = '918805348821'

  function isMobileDevice() {
    return (
      window.matchMedia('(max-width: 768px)').matches ||
      /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
    )
  }

  function buildContactMessage() {
    return 'Hello Kōhī House! I have a question.'
  }

  function contactUrl() {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildContactMessage())}`
  }

  function openWhatsApp(message) {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    if (isMobileDevice()) {
      window.location.href = url
    } else {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
    return url
  }

  window.kohiWhatsApp = {
    number: WHATSAPP_NUMBER,
    isMobileDevice,
    buildContactMessage,
    contactUrl,
    open: openWhatsApp,
  }
})()
