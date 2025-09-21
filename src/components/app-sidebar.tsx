"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import type { LucideIcon } from "lucide-react"

import {
  Home,
  Users,
  Settings,
  Shield,
  BarChart3,
  Layout,
  FileType,
  Search,
  HelpCircle,
  TestTube,
  Building2,
} from "lucide-react"

import { OrganizationSelector } from "./rbac/organization-selector"
import { PermissionGuard } from "./rbac/permission-guard"
import { useAuth } from "@/contexts/auth-context"  // 👈 bring in auth context
import { Permission } from "@/lib/rbac"
import { Badge } from "./ui/badge"

const navigation = [
  {
    title: "Home",
    href: "/",
    icon: Home,
    permissions: ["organizations.create"],
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Layout,
    permissions: ["org.view"],
  },
  {
    title: "Templates",
    href: "/templates",
    icon: FileType,
    permissions: ["org.view"],
  },
  {
    title: "Search",
    href: "/search",
    icon: Search,
    permissions: ["org.view"],
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    permissions: ["org.analytics.view"],
  },
  {
    title: "Members",
    href: "/members",
    icon: Users,
    permissions: ["org.members.manage"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    permissions: ["org.settings.manage"],
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
    permissions: [], // 👈 no permissions needed
  },
  {
    title: "Test Templates",
    href: "/test-templates",
    icon: TestTube,
    permissions: ["org.members.manage"],
  },
] satisfies {
  title: string
  href: string
  icon: LucideIcon
  permissions: Permission[]
}[]

const adminNavigation = [
  { name: "Permissions", href: "/templates/permissions", icon: Shield },
  { name: "System Settings", href: "/admin/settings", icon: Settings },
]

export function AppSidebar() {
  const { user, currentOrganizationId, hasAnyPermission } = useAuth()

  if (!user) return null // 👈 hide entire sidebar if not logged in

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2">
          <Building2 className="h-6 w-6" />
          <span className="font-semibold">Organization Portal</span>
        </div>

        {/* Organization Switcher */}
        <OrganizationSelector />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const hasPermission =
                  item.permissions.length === 0 ||
                  hasAnyPermission(item.permissions, currentOrganizationId || undefined)

                if (!hasPermission) {
                  return null
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.href === "/test-templates" && (
                            <Badge variant="outline" className="ml-auto text-xs">
                                Test
                            </Badge>
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <PermissionGuard permission="users.manage_global">
          <SidebarGroup>
            <SidebarGroupLabel>Admin Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavigation.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <a href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </PermissionGuard>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  )
}
