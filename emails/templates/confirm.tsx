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

const caramel = '#C8894A'
const cream = '#F5E6C8'
const obsidian = '#0D0906'
const darkRoast = '#1A1108'

export interface ConfirmEmailProps {
  firstName?: string
  confirmUrl: string
  unsubscribeUrl?: string
}

export function ConfirmEmail({
  firstName = 'there',
  confirmUrl,
  unsubscribeUrl = 'https://kohi-house.netlify.app/unsubscribe.html',
}: ConfirmEmailProps) {
  const name = firstName && firstName !== 'there' ? firstName : 'there'

  return (
    <Html>
      <Head />
      <Preview>Confirm your membership to The Kōhī Club.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={logo}>
            Kō<span style={{ color: caramel }}>hī</span> House
          </Text>
          <Heading style={h1}>Confirm your membership</Heading>
          <Text style={paragraph}>Hi {name},</Text>
          <Text style={paragraph}>
            Please confirm your email to join The Kōhī Club and receive your welcome reward.
          </Text>
          <Section style={ctaRow}>
            <Button style={buttonPrimary} href={confirmUrl}>
              Confirm membership
            </Button>
          </Section>
          <Text style={small}>
            If you did not sign up, you can safely ignore this email.
          </Text>
          <Hr style={hr} />
          <Text style={footerLinks}>
            <Link href={unsubscribeUrl} style={link}>
              Unsubscribe
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default ConfirmEmail

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
  fontSize: '26px',
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

const ctaRow = { textAlign: 'center' as const, margin: '28px 0' }

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

const small = {
  color: 'rgba(245, 230, 200, 0.45)',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '0',
}

const hr = { borderColor: 'rgba(200, 137, 74, 0.2)', margin: '32px 0 24px' }

const footerLinks = { textAlign: 'center' as const, fontSize: '12px', margin: '0' }

const link = { color: caramel, textDecoration: 'underline' }
