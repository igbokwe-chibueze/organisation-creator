import { UserManagement } from "@/components/rbac/user-management"

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Members</h1>
        <p className="text-muted-foreground">Manage organization members and their permissions</p>
      </div>
      <UserManagement organizationId="1" />
    </div>
  )
}
