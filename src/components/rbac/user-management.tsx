"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { RoleSelector } from "./role-selector"
import { PermissionTemplates } from "./permission-templates"
import { type User, type GlobalRole, type OrganizationRole, RBACService } from "@/lib/rbac"
import { Loader2, Users, Shield, Settings } from "lucide-react"
import { toast } from "sonner"

interface UserManagementProps {
  organizationId: string
}

export function UserManagement({ organizationId }: UserManagementProps) {
  const {
    user: currentUser,
    updateUserGlobalRole,
    updateUserOrganizationRole,
    hasPermission,
    // 🔑 add this once you expose mockUsers in AuthProvider
    allUsers,
  } = useAuth()

  const [loadingUsers, setLoadingUsers] = useState<Set<string>>(new Set())
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const canManageGlobalRoles = hasPermission("users.manage_global")
  const canManageOrgMembers = hasPermission("org.members.manage", organizationId)

  const handleGlobalRoleChange = async (userId: string, newRole: GlobalRole) => {
    setLoadingUsers((prev) => new Set(prev).add(userId))
    try {
      await updateUserGlobalRole(userId, newRole)
      toast("Role Updated", {
        description: "Global role has been successfully updated.",
      })
    } catch (error) {
      toast("Error", {
        description: error instanceof Error ? error.message : "Failed to update role",
      })
    } finally {
      setLoadingUsers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  const handleOrganizationRoleChange = async (userId: string, newRole: OrganizationRole) => {
    setLoadingUsers((prev) => new Set(prev).add(userId))
    try {
      await updateUserOrganizationRole(userId, organizationId, newRole)
      toast("Role Updated", {
        description: "Organization role has been successfully updated.",
      })
    } catch (error) {
      toast("Error", {
        description: error instanceof Error ? error.message : "Failed to update role",
      })
    } finally {
      setLoadingUsers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  const getUserOrgMembership = (user: User) =>
    user.organizationMemberships?.find((m) => m.organizationId === organizationId)

  const getUserPermissions = (user: User) => {
    const membership = getUserOrgMembership(user)
    const rolePermissions = membership ? RBACService.hasOrganizationPermission(membership, "org.view") : false
    const customPermissions = membership?.permissions || []
    return { rolePermissions, customPermissions }
  }

  if (!canManageGlobalRoles && !canManageOrgMembers) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>User Management</span>
          </CardTitle>
          <CardDescription>You do not have permission to manage users.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const orgUsers = allUsers.filter((u) => getUserOrgMembership(u))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>User Management</span>
          </CardTitle>
          <CardDescription>Manage user roles and permissions for this organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orgUsers.map((user) => {
              const membership = getUserOrgMembership(user)
              const isLoading = loadingUsers.has(user.id)
              const { customPermissions } = getUserPermissions(user)

              if (!membership) return null

              return (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{user.globalRole}</Badge>
                        <Badge variant="secondary">{membership.role}</Badge>
                        {customPermissions.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            +{customPermissions.length} custom
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {canManageOrgMembers && user.id !== currentUser?.id && ( //Current user cannot change their org role
                      <RoleSelector
                        type="organization"
                        value={membership.role}
                        onValueChange={(newRole) =>
                          handleOrganizationRoleChange(user.id, newRole as OrganizationRole)
                        }
                        disabled={isLoading}
                      />
                    )}
                    
                    {canManageGlobalRoles && (
                      <RoleSelector
                        type="global"
                        value={user.globalRole}
                        onValueChange={(newRole) => handleGlobalRoleChange(user.id, newRole as GlobalRole)}
                        disabled={isLoading}
                      />
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle>Manage Permissions: {selectedUser.name}</CardTitle>
            <CardDescription>Apply permission templates to grant specific access levels.</CardDescription>
          </CardHeader>
          <CardContent>
            <PermissionTemplates
              userId={selectedUser.id}
              organizationId={organizationId}
              userRole={getUserOrgMembership(selectedUser)?.role || "org_viewer"}
              appliedTemplates={[]} // TODO: connect real applied templates from user
              onTemplateApplied={() => {
                toast("Permissions Updated", {
                  description: "User permissions have been updated successfully.",
                })
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
