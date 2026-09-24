import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: import.meta.env.VITE_BLINK_PROJECT_ID || 'audit-express-landing-sgjojrhw',
  publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk_6q5hPIPHX9H73IkMcUg97WoLsWpBwQ3e',
  authRequired: false,
  auth: { mode: 'managed' },
})
