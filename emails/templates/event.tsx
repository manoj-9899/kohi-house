import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'
import { KohiEmailFooter, KohiEmailLogo, emailStyles } from './components/kohi-layout'

/** Reusable template for event announcements */
export interface EventEmailProps {
  title: string
  description: string
  eventDate: string
  ctaUrl: string
  ctaLabel?: string
}

export function EventEmail({
  title,
  description,
  eventDate,
  ctaUrl,
  ctaLabel = 'Reserve your spot',
}: EventEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{title} — Kōhī House</Preview>
      <Body style={emailStyles.main}>
        <Container style={emailStyles.container}>
          <KohiEmailLogo />
          <Heading style={emailStyles.h1}>{title}</Heading>
          <Text style={emailStyles.meta}>{eventDate}</Text>
          <Text style={emailStyles.paragraph}>{description}</Text>
          <Section style={emailStyles.ctaRow}>
            <a href={ctaUrl} style={emailStyles.buttonPrimary}>
              {ctaLabel}
            </a>
          </Section>
          <KohiEmailFooter />
        </Container>
      </Body>
    </Html>
  )
}

export default EventEmail
