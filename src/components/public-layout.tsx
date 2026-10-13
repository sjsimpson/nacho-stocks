import { Link } from '@tanstack/react-router'
import { Attribution } from '@/components/attribution'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import type { SessionUser } from '@/lib/fns/session'

export function PublicLayout({
  user,
  children,
}: {
  user: SessionUser | null
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span aria-hidden>🧀</span> Nacho Stocks
          </Link>
          <nav aria-label="Main" className="ml-auto flex items-center gap-1">
            <Button variant="ghost" render={<Link to="/about" />}>
              About
            </Button>
            {user ? (
              <Button render={<Link to="/portfolio" />}>My portfolio</Button>
            ) : (
              <>
                <Button variant="ghost" render={<Link to="/login" />}>
                  Log in
                </Button>
                <Button render={<Link to="/signup" />}>Sign up</Button>
              </>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <Attribution />
        </div>
      </footer>
    </div>
  )
}
