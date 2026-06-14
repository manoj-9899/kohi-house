/**
 * Pre-renders React Email templates to HTML for Netlify Functions.
 */
import { render } from '@react-email/render'
import { mkdirSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { ConfirmEmail } from '../emails/templates/confirm.tsx'
import { WelcomeEmail } from '../emails/templates/welcome.tsx'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '../netlify/functions/_templates')

async function main() {
  mkdirSync(outDir, { recursive: true })

  const siteUrl = process.env.SITE_URL || 'https://kohi-house.netlify.app'

  const welcomeHtml = await render(
    WelcomeEmail({
      firstName: '{{firstName}}',
      siteUrl,
      unsubscribeUrl: '{{unsubscribeUrl}}',
    })
  )

  const confirmHtml = await render(
    ConfirmEmail({
      firstName: '{{firstName}}',
      confirmUrl: '{{confirmUrl}}',
      unsubscribeUrl: '{{unsubscribeUrl}}',
    })
  )

  writeFileSync(join(outDir, 'welcome.html'), welcomeHtml, 'utf8')
  writeFileSync(join(outDir, 'confirm.html'), confirmHtml, 'utf8')

  writeFileSync(
    join(outDir, 'manifest.json'),
    JSON.stringify(
      {
        welcome: {
          subject: 'Welcome to The Kōhī Club ☕',
          preview: 'Slow mornings, seasonal drinks, and exclusive member rewards await.',
        },
        confirm: {
          subject: 'Confirm your Kōhī Club membership ☕',
          preview: 'One click to confirm and receive your welcome reward.',
        },
      },
      null,
      2
    ),
    'utf8'
  )

  console.log('✓ Email templates built to netlify/functions/_templates/')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
