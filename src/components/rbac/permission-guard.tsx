"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import type { Permission } from "@/lib/rbac"

interface PermissionGuardProps {
  children: React.ReactNode
  permission?: Permission
  permissions?: Permission[]
  organizationId?: string
  requireAll?: boolean
  fallback?: React.ReactNode
}

export function PermissionGuard({
  children,
  permission,
  permissions,
  organizationId,
  requireAll = false,
  fallback = null,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, user } = useAuth()

  // If no user is logged in, don't show content
  if (!user) {
    return <>{fallback}</>
  }

  let hasAccess = false

  try {
    if (permission) {
      hasAccess = hasPermission(permission, organizationId)
    } else if (permissions && permissions.length > 0) {
      if (requireAll) {
        hasAccess = hasAllPermissions(permissions, organizationId)
      } else {
        hasAccess = hasAnyPermission(permissions, organizationId)
      }
    } else {
      // If no permissions specified, allow access
      hasAccess = true
    }
  } catch (error) {
    console.error("Error checking permissions:", error)
    hasAccess = false
  }

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
