// import { PermissionTemplates } from "@/components/rbac/permission-templates"
import { TemplateLibrary } from "@/components/rbac/template-library"

export default function PermissionTemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Permission Templates</h1>
        <p className="text-muted-foreground">Create and manage permission templates for consistent role assignments</p>
      </div>
      {/* <PermissionTemplates organizationId="1" /> */}
      <TemplateLibrary />
    </div>
  )
}
