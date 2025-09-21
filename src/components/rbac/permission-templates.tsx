"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { SYSTEM_PERMISSION_TEMPLATES, type OrganizationRole } from "@/lib/rbac"
//import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, Minus, Check } from "lucide-react"
import { toast } from "sonner"

interface PermissionTemplatesProps {
  userId: string
  organizationId: string
  userRole: OrganizationRole
  appliedTemplates?: string[]
  onTemplateApplied?: () => void
}

export function PermissionTemplates({
  userId,
  organizationId,
  userRole,
  appliedTemplates = [],
  onTemplateApplied,
}: PermissionTemplatesProps) {
  const { applyPermissionTemplate, removePermissionTemplate } = useAuth()
  //const { toast } = useToast()
  const [loadingTemplates, setLoadingTemplates] = useState<Set<string>>(new Set())

  const availableTemplates = SYSTEM_PERMISSION_TEMPLATES.filter((template) =>
    template.applicableRoles.includes(userRole),
  )

  const handleApplyTemplate = async (templateId: string) => {
    setLoadingTemplates((prev) => new Set(prev).add(templateId))
    try {
      await applyPermissionTemplate(userId, organizationId, templateId)
      toast("Template Applied", {
        description: "Permission template has been successfully applied.",
      })
      onTemplateApplied?.()
    } catch (error) {
      toast("Error",{
        description: error instanceof Error ? error.message : "Failed to apply template",
        //variant: "destructive",
      })
    } finally {
      setLoadingTemplates((prev) => {
        const newSet = new Set(prev)
        newSet.delete(templateId)
        return newSet
      })
    }
  }

  const handleRemoveTemplate = async (templateId: string) => {
    setLoadingTemplates((prev) => new Set(prev).add(templateId))
    try {
      await removePermissionTemplate(userId, organizationId, templateId)
      toast("Template Removed", {
        description: "Permission template has been successfully removed.",
      })
      onTemplateApplied?.()
    } catch (error) {
      toast("Error",{
        description: error instanceof Error ? error.message : "Failed to remove template",
        //variant: "destructive",
      })
    } finally {
      setLoadingTemplates((prev) => {
        const newSet = new Set(prev)
        newSet.delete(templateId)
        return newSet
      })
    }
  }

  if (availableTemplates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permission Templates</CardTitle>
          <CardDescription>No permission templates are available for the {userRole} role.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Permission Templates</h3>
        <p className="text-sm text-muted-foreground">
          Apply pre-configured permission sets to quickly grant specific access levels.
        </p>
      </div>

      <div className="grid gap-4">
        {availableTemplates.map((template) => {
          const isApplied = appliedTemplates.includes(template.id)
          const isLoading = loadingTemplates.has(template.id)

          return (
            <Card key={template.id} className={isApplied ? "border-green-200 bg-green-50" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    {isApplied && <Check className="h-4 w-4 text-green-600" />}
                  </div>
                  <Button
                    size="sm"
                    variant={isApplied ? "outline" : "default"}
                    onClick={() => (isApplied ? handleRemoveTemplate(template.id) : handleApplyTemplate(template.id))}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isApplied ? (
                      <>
                        <Minus className="h-4 w-4 mr-1" />
                        Remove
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-1" />
                        Apply
                      </>
                    )}
                  </Button>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
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
          )
        })}
      </div>
    </div>
  )
}
