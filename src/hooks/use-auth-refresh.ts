import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'

/** After sign in/out/up: drop cached session data and re-run route guards. */
export function useAuthRefresh() {
  const router = useRouter()
  const queryClient = useQueryClient()
  return async () => {
    queryClient.clear()
    await router.invalidate()
  }
}
