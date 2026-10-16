import { createAuthClient } from 'better-auth/react'
import {
  adminClient,
  inferAdditionalFields,
  organizationClient,
  usernameClient,
} from 'better-auth/client/plugins'
import type { auth } from '@/lib/server/auth'

export const authClient = createAuthClient({
  plugins: [
    usernameClient(),
    adminClient(),
    organizationClient(),
    inferAdditionalFields<typeof auth>(),
  ],
})
