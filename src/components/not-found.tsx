import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function NotFound({
  message = 'That page does not exist.',
}: {
  message?: string
}) {
  return (
    <main className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Not found</h1>
      <p className="text-muted-foreground">{message}</p>
      <Button nativeButton={false} render={<Link to="/" />}>
        Go home
      </Button>
    </main>
  )
}
