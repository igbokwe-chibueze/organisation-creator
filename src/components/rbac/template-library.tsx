// src/components/rbac/template-library.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SYSTEM_PERMISSION_TEMPLATES } from "@/lib/rbac"

export function TemplateLibrary() {
  if (SYSTEM_PERMISSION_TEMPLATES.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permission Templates</CardTitle>
          <CardDescription>No permission templates have been defined yet.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Available Permission Templates</h3>
        <p className="text-sm text-muted-foreground">
          These templates define reusable sets of permissions that can be applied to organization members.
        </p>
      </div>

      <div className="grid gap-4">
        {SYSTEM_PERMISSION_TEMPLATES.map((template) => (
          <Card key={template.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm font-medium">Applicable Roles</div>
                <div className="flex flex-wrap gap-1">
                  {template.applicableRoles.map((role) => (
                    <Badge key={role} variant="outline" className="text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2 mt-3">
                <div className="text-sm font-medium">Permissions ({template.permissions.length})</div>
                <div className="flex flex-wrap gap-1">
                  {template.permissions.map((permission) => (
                    <Badge key={permission} variant="secondary" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
