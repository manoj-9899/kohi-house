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

export interface MonthlyEmailProps {
  monthLabel: string
  intro: string
  highlights: string[]
  ctaUrl: string
}

export function MonthlyEmail({ monthLabel, intro, highlights, ctaUrl }: MonthlyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Kōhī House — {monthLabel} newsletter</Preview>
      <Body style={emailStyles.main}>
        <Container style={emailStyles.container}>
          <KohiEmailLogo />
          <Text style={emailStyles.eyebrow}>{monthLabel}</Text>
          <Heading style={emailStyles.h1}>From the roastery</Heading>
          <Text style={emailStyles.paragraph}>{intro}</Text>
          <Section>
            {highlights.map((item) => (
              <Text key={item} style={emailStyles.benefitItem}>
                · {item}
              </Text>
            ))}
          </Section>
          <Section style={emailStyles.ctaRow}>
            <a href={ctaUrl} style={emailStyles.buttonPrimary}>
              Visit us
            </a>
          </Section>
          <KohiEmailFooter />
        </Container>
      </Body>
    </Html>
  )
}

export default MonthlyEmail
