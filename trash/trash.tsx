// src/organization-update.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { PermissionGuard } from "@/components/rbac/permission-guard"
import { OrganizationSelector } from "@/components/rbac/organization-selector"
import {
  Home,
  Search,
  BarChart3,
  Settings,
  HelpCircle,
  Users,
  BookTemplate as FileTemplate,
  TestTube,
  Building2,
  Layout,
} from "lucide-react"
import { Permission } from "@/lib/rbac"

const navigationItems : {
  title: string
  href: string
  icon: typeof Home
  permissions: Permission[]
}[] = [
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
    icon: FileTemplate,
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
    permissions: [],
  },
  {
    title: "Test Templates",
    href: "/test-templates",
    icon: TestTube,
    permissions: ["org.members.manage"],
  },
]

export function MainNavigation() {
  const pathname = usePathname()
  const { user, currentOrganizationId, hasAnyPermission } = useAuth()

  if (!user) {
    return null
  }

  return (
    <nav className="flex flex-col space-y-4 p-4">
      <div className="flex items-center space-x-2">
        <Building2 className="h-6 w-6" />
        <span className="font-semibold">Organization Portal</span>
      </div>

      <OrganizationSelector />

      <div className="flex flex-col space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          const hasPermission =
            item.permissions.length === 0 || hasAnyPermission(item.permissions, currentOrganizationId || undefined)

          if (!hasPermission) {
            return null
          }

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start", isActive && "bg-secondary")}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.title}
                {item.href === "/test-templates" && (
                  <Badge variant="outline" className="ml-auto text-xs">
                    Test
                  </Badge>
                )}
              </Button>
            </Link>
          )
        })}
      </div>

      <PermissionGuard permission="users.manage_global">
        <div className="pt-4 border-t">
          <div className="text-sm font-medium text-muted-foreground mb-2">Admin Tools</div>
          <Link href="/templates/permissions">
            <Button variant="ghost" className="w-full justify-start">
              <FileTemplate className="mr-2 h-4 w-4" />
              Permission Templates
            </Button>
          </Link>
        </div>
      </PermissionGuard>
    </nav>
  )
}
