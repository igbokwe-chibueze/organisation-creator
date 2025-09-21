"use client"

import { Badge } from "@/components/ui/badge"
import {
  type GlobalRole,
  type OrganizationRole,
  GLOBAL_ROLE_DEFINITIONS,
  ORGANIZATION_ROLE_DEFINITIONS,
} from "@/lib/rbac"

interface RoleBadgeProps {
  role: GlobalRole | OrganizationRole
  type: "global" | "organization"
  className?: string
}

export function RoleBadge({ role, type, className }: RoleBadgeProps) {
  const roleDefinition =
    type === "global"
      ? GLOBAL_ROLE_DEFINITIONS[role as GlobalRole]
      : ORGANIZATION_ROLE_DEFINITIONS[role as OrganizationRole]

  if (!roleDefinition) {
    return (
      <Badge variant="secondary" className={className}>
        Unknown Role
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className={`${roleDefinition.color} ${className}`}>
      {roleDefinition.name}
    </Badge>
  )
}
