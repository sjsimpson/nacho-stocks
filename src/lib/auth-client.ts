import { createAuthClient } from 'better-auth/react'
import {
  inferAdditionalFields,
  organizationClient,
  usernameClient,
} from 'better-auth/client/plugins'
import type { auth } from '@/lib/server/auth'

export const authClient = createAuthClient({
  plugins: [
    usernameClient(),
    organizationClient(),
    inferAdditionalFields<typeof auth>(),
  ],
})
