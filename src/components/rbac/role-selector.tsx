"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  type GlobalRole,
  type OrganizationRole,
  GLOBAL_ROLE_DEFINITIONS,
  ORGANIZATION_ROLE_DEFINITIONS,
} from "@/lib/rbac"

interface RoleSelectorProps {
  type: "global" | "organization"
  value: GlobalRole | OrganizationRole
  onValueChange: (value: GlobalRole | OrganizationRole) => void
  disabled?: boolean
  label?: string
}

export function RoleSelector({ type, value, onValueChange, disabled = false, label }: RoleSelectorProps) {
  const roleDefinitions = type === "global" ? GLOBAL_ROLE_DEFINITIONS : ORGANIZATION_ROLE_DEFINITIONS

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${type} role`} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(roleDefinitions).map(([key, definition]) => (
            <SelectItem key={key} value={key}>
              <div className="flex items-center space-x-2">
                <span className={`inline-block w-2 h-2 rounded-full ${definition.color.split(" ")[0]}`} />
                <span>{definition.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
