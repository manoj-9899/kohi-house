import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

const siteUrl = 'https://kohi-house.netlify.app'
const caramel = '#C8894A'
const cream = '#F5E6C8'
const obsidian = '#0D0906'
const darkRoast = '#1A1108'

export interface WelcomeEmailProps {
  firstName?: string
  siteUrl?: string
  unsubscribeUrl?: string
}

export function WelcomeEmail({
  firstName = 'there',
  siteUrl: base = siteUrl,
  unsubscribeUrl = `${siteUrl}/unsubscribe.html`,
}: WelcomeEmailProps) {
  const name = firstName && firstName !== 'there' ? firstName : 'there'

  return (
    <Html>
      <Head />
      <Preview>Slow mornings, seasonal drinks, and exclusive member rewards await.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={logo}>
            Kō<span style={{ color: caramel }}>hī</span> House
          </Text>
          <Heading style={h1}>Welcome to The Kōhī Club ☕</Heading>
          <Text style={paragraph}>Thank you for joining our community, {name}.</Text>
          <Text style={paragraph}>You now have access to:</Text>
          <Section style={benefits}>
            <Text style={benefitItem}>✓ Seasonal menu launches</Text>
            <Text style={benefitItem}>✓ Exclusive events</Text>
            <Text style={benefitItem}>✓ Coffee brewing workshops</Text>
            <Text style={benefitItem}>✓ Member-only updates</Text>
            <Text style={benefitItem}>✓ Special rewards</Text>
          </Section>
          <Section style={rewardBox}>
            <Text style={rewardLabel}>Your welcome reward</Text>
            <Text style={rewardText}>Enjoy 10% OFF your first specialty drink.</Text>
            <Text style={code}>WELCOME10</Text>
            <Text style={codeHint}>Show this code on your first visit.</Text>
          </Section>
          <Section style={ctaRow}>
            <Button style={buttonPrimary} href={`${base}/#reservation`}>
              Reserve a Table
            </Button>
          </Section>
          <Section style={ctaRow}>
            <Button style={buttonSecondary} href={`${base}/#menu`}>
              View Menu
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footerText}>Kōhī House</Text>
          <Text style={footerText}>
            12, Third Cross Street, Versova, Andheri West, Mumbai – 400 061
          </Text>
          <Text style={footerText}>Mon – Fri 7 AM – 10 PM · Sat 7 AM – 11 PM · Sun 8 AM – 9 PM</Text>
          <Text style={footerLinks}>
            <Link href="https://www.instagram.com/kohihouse" style={link}>
              Instagram
            </Link>
            {' · '}
            <Link href={unsubscribeUrl} style={link}>
              Unsubscribe
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeEmail

const main = {
  backgroundColor: obsidian,
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
}

const container = {
  margin: '0 auto',
  padding: '40px 24px 48px',
  maxWidth: '560px',
  backgroundColor: darkRoast,
  borderRadius: '4px',
}

const logo = {
  fontSize: '22px',
  fontWeight: '700' as const,
  color: cream,
  letterSpacing: '0.04em',
  margin: '0 0 28px',
}

const h1 = {
  color: cream,
  fontSize: '28px',
  fontWeight: '700' as const,
  lineHeight: '1.25',
  margin: '0 0 20px',
}

const paragraph = {
  color: 'rgba(245, 230, 200, 0.85)',
  fontSize: '16px',
  lineHeight: '1.65',
  margin: '0 0 16px',
}

const benefits = { margin: '0 0 24px' }

const benefitItem = {
  color: 'rgba(245, 230, 200, 0.75)',
  fontSize: '15px',
  lineHeight: '1.8',
  margin: '0',
}

const rewardBox = {
  backgroundColor: 'rgba(200, 137, 74, 0.12)',
  border: '1px solid rgba(200, 137, 74, 0.35)',
  borderRadius: '4px',
  padding: '24px',
  margin: '0 0 28px',
  textAlign: 'center' as const,
}

const rewardLabel = {
  color: caramel,
  fontSize: '11px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px',
}

const rewardText = {
  color: cream,
  fontSize: '17px',
  margin: '0 0 12px',
}

const code = {
  color: cream,
  fontSize: '28px',
  fontWeight: '700' as const,
  letterSpacing: '0.15em',
  margin: '0 0 8px',
}

const codeHint = {
  color: 'rgba(245, 230, 200, 0.5)',
  fontSize: '13px',
  margin: '0',
}

const ctaRow = { textAlign: 'center' as const, margin: '0 0 12px' }

const buttonPrimary = {
  backgroundColor: caramel,
  color: '#0D0906',
  fontSize: '13px',
  fontWeight: '600' as const,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  padding: '14px 28px',
  borderRadius: '2px',
  textDecoration: 'none',
}

const buttonSecondary = {
  backgroundColor: 'transparent',
  color: cream,
  border: '1px solid rgba(245, 230, 200, 0.35)',
  fontSize: '13px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  padding: '12px 24px',
  borderRadius: '2px',
  textDecoration: 'none',
}

const hr = { borderColor: 'rgba(200, 137, 74, 0.2)', margin: '32px 0 24px' }

const footerText = {
  color: 'rgba(245, 230, 200, 0.45)',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '0 0 6px',
  textAlign: 'center' as const,
}

const footerLinks = {
  textAlign: 'center' as const,
  fontSize: '12px',
  margin: '16px 0 0',
}

const link = { color: caramel, textDecoration: 'underline' }
