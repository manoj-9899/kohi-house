import { Hr, Link, Text } from '@react-email/components'
import * as React from 'react'

const siteUrl = 'https://kohi-house.netlify.app'
export const caramel = '#C8894A'
export const cream = '#F5E6C8'

export function KohiEmailLogo() {
  return (
    <Text style={{ fontSize: '22px', fontWeight: 700, color: cream, letterSpacing: '0.04em', margin: '0 0 28px' }}>
      Kō<span style={{ color: caramel }}>hī</span> House
    </Text>
  )
}

export function KohiEmailFooter({ unsubscribeUrl = `${siteUrl}/unsubscribe.html` }: { unsubscribeUrl?: string }) {
  return (
    <>
      <Hr style={{ borderColor: 'rgba(200, 137, 74, 0.2)', margin: '32px 0 24px' }} />
      <Text style={emailStyles.footerText}>Kōhī House · Versova, Mumbai</Text>
      <Text style={emailStyles.footerLinks}>
        <Link href="https://www.instagram.com/kohihouse" style={{ color: caramel }}>
          Instagram
        </Link>
        {' · '}
        <Link href={unsubscribeUrl} style={{ color: caramel }}>
          Unsubscribe
        </Link>
      </Text>
    </>
  )
}

export const emailStyles = {
  main: {
    backgroundColor: '#0D0906',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  container: {
    margin: '0 auto',
    padding: '40px 24px 48px',
    maxWidth: '560px',
    backgroundColor: '#1A1108',
    borderRadius: '4px',
  },
  eyebrow: {
    color: caramel,
    fontSize: '11px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    margin: '0 0 12px',
  },
  h1: {
    color: cream,
    fontSize: '26px',
    fontWeight: 700 as const,
    lineHeight: '1.25',
    margin: '0 0 16px',
  },
  meta: {
    color: 'rgba(245, 230, 200, 0.55)',
    fontSize: '14px',
    margin: '0 0 20px',
  },
  paragraph: {
    color: 'rgba(245, 230, 200, 0.85)',
    fontSize: '16px',
    lineHeight: '1.65',
    margin: '0 0 16px',
  },
  benefitItem: {
    color: 'rgba(245, 230, 200, 0.75)',
    fontSize: '15px',
    lineHeight: '1.8',
    margin: '0',
  },
  ctaRow: { textAlign: 'center' as const, margin: '28px 0' },
  buttonPrimary: {
    backgroundColor: caramel,
    color: '#0D0906',
    fontSize: '13px',
    fontWeight: 600 as const,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    padding: '14px 28px',
    borderRadius: '2px',
    textDecoration: 'none',
    display: 'inline-block',
  },
  footerText: {
    color: 'rgba(245, 230, 200, 0.45)',
    fontSize: '12px',
    lineHeight: '1.6',
    margin: '0 0 6px',
    textAlign: 'center' as const,
  },
  footerLinks: {
    textAlign: 'center' as const,
    fontSize: '12px',
    margin: '16px 0 0',
  },
}
