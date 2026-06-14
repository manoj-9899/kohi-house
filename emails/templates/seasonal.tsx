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

export interface SeasonalEmailProps {
  drinkName: string
  description: string
  ctaUrl: string
}

export function SeasonalEmail({ drinkName, description, ctaUrl }: SeasonalEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New seasonal drink: {drinkName}</Preview>
      <Body style={emailStyles.main}>
        <Container style={emailStyles.container}>
          <KohiEmailLogo />
          <Text style={emailStyles.eyebrow}>Seasonal launch</Text>
          <Heading style={emailStyles.h1}>{drinkName}</Heading>
          <Text style={emailStyles.paragraph}>{description}</Text>
          <Section style={emailStyles.ctaRow}>
            <a href={ctaUrl} style={emailStyles.buttonPrimary}>
              Plan your visit
            </a>
          </Section>
          <KohiEmailFooter />
        </Container>
      </Body>
    </Html>
  )
}

export default SeasonalEmail
