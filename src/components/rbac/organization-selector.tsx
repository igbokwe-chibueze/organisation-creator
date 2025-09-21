"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"

interface OrganizationSelectorProps {
  label?: string
  className?: string
}

export function OrganizationSelector({ label = "Organization", className }: OrganizationSelectorProps) {
  const { user, currentOrganizationId, switchOrganization } = useAuth()

  if (!user || !user.organizationMemberships || user.organizationMemberships.length === 0) {
    return null
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      <Select value={currentOrganizationId || ""} onValueChange={switchOrganization}>
        <SelectTrigger>
          <SelectValue placeholder="Select organization" />
        </SelectTrigger>
        <SelectContent>
          {user.organizationMemberships.map((membership) => (
            <SelectItem key={membership.organizationId} value={membership.organizationId}>
              <div className="flex flex-col">
                <span>{membership.organizationName}</span>
                <span className="text-xs text-muted-foreground">{membership.role}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
