"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { PermissionGuard } from "@/components/rbac/permission-guard"
import { OrganizationSelector } from "@/components/rbac/organization-selector"
import { RBACService } from "@/lib/rbac"
import { FileIcon } from "lucide-react"
import { NavigationItem, navigationItems } from "./navigation-items"

export function MainNavigation() {
  const pathname = usePathname()
  const { user, currentOrganizationId } = useAuth()

  if (!user) return null

  return (
    <nav className="flex flex-col space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <FileIcon className="h-6 w-6" />
        <span className="font-semibold">Organization PortalX</span>
      </div>

      {/* Organization Selector */}
      <OrganizationSelector />

      {/* Navigation Links */}
      <div className="flex flex-col space-y-1">
        {navigationItems.map((item: NavigationItem) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          // Type-safe permission check
          const hasPermission =
            item.permissions.length === 0 ||
            RBACService.hasAnyPermission(user, item.permissions, currentOrganizationId || undefined)

          if (!hasPermission) return null

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

      {/* Admin Tools */}
      <PermissionGuard permission="users.manage_global">
        <div className="pt-4 border-t">
          <div className="text-sm font-medium text-muted-foreground mb-2">Admin Tools</div>
          <Link href="/templates/permissions">
            <Button variant="ghost" className="w-full justify-start">
              <FileIcon className="mr-2 h-4 w-4" />
              Permission Templates
            </Button>
          </Link>
        </div>
      </PermissionGuard>
    </nav>
  )
}

