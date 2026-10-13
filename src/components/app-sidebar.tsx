import { Link, useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import {
  BriefcaseIcon,
  LogOutIcon,
  SchoolIcon,
  SearchIcon,
  UserIcon,
  UsersIcon,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { authClient } from '@/lib/auth-client'
import type { SessionUser } from '@/lib/fns/session'

export function AppSidebar({ user }: { user: SessionUser }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const nav = [
    { to: '/portfolio', label: 'Portfolio', icon: BriefcaseIcon },
    { to: '/stocks', label: 'Find stocks', icon: SearchIcon },
    user.accountType === 'teacher'
      ? { to: '/classes', label: 'Classes', icon: UsersIcon }
      : { to: '/join', label: 'My class', icon: SchoolIcon },
    { to: '/account', label: 'Account', icon: UserIcon },
  ] as const

  async function signOut() {
    await authClient.signOut()
    queryClient.clear()
    await router.invalidate()
    await router.navigate({ to: '/login' })
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to="/portfolio" />}>
              <span aria-hidden className="text-xl">
                🧀
              </span>
              <span className="font-semibold">Nacho Stocks</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <nav aria-label="Main">
              <SidebarMenu>
                {nav.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      render={
                        <Link
                          to={item.to}
                          activeProps={{
                            'data-active': true,
                            'aria-current': 'page',
                          }}
                        />
                      }
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </nav>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sign out" onClick={signOut}>
              <LogOutIcon />
              <span className="truncate">
                Sign out{' '}
                <span className="text-muted-foreground">
                  @{user.displayUsername ?? user.username}
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
