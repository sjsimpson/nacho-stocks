import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { AccountBanners } from '@/components/account-banners'
import { AppSidebar } from '@/components/app-sidebar'
import { Attribution } from '@/components/attribution'
import { ThemeToggle } from '@/components/theme-toggle'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
    return { user: context.user }
  },
  component: AuthedLayout,
})

function AuthedLayout() {
  const { user } = Route.useRouteContext()
  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <AccountBanners user={user} />
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6">
          <Outlet />
        </div>
        <footer className="border-t px-4 py-3 md:px-6">
          <Attribution />
        </footer>
      </SidebarInset>
    </SidebarProvider>
  )
}
