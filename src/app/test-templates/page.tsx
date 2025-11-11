"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import {
  SYSTEM_PERMISSION_TEMPLATES,
  RBACService,
  ORGANIZATION_ROLE_DEFINITIONS,
  type User,
  type Permission,
} from "@/lib/rbac"
import { Loader2, Plus, Minus, Check, Users, Shield, Eye, Settings } from "lucide-react"
import { toast } from "sonner"

// Test users with different roles
const testUsers: User[] = [
  {
    id: "test-1",
    name: "Alice Johnson",
    email: "alice@test.com",
    globalRole: "user",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-01",
    lastActive: "2024-01-20",
    organizationMemberships: [
      {
        organizationId: "1",
        organizationName: "TechCorp Solutions",
        role: "org_member",
        permissions: [],
        joinedAt: "2024-01-01",
      },
    ],
  },
  {
    id: "test-2",
    name: "Bob Smith",
    email: "bob@test.com",
    globalRole: "user",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-05",
    lastActive: "2024-01-19",
    organizationMemberships: [
      {
        organizationId: "1",
        organizationName: "TechCorp Solutions",
        role: "org_viewer",
        permissions: [],
        joinedAt: "2024-01-05",
      },
    ],
  },
  {
    id: "test-3",
    name: "Carol Davis",
    email: "carol@test.com",
    globalRole: "user",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-10",
    lastActive: "2024-01-18",
    organizationMemberships: [
      {
        organizationId: "1",
        organizationName: "TechCorp Solutions",
        role: "org_manager",
        permissions: [],
        joinedAt: "2024-01-10",
      },
    ],
  },
]

export default function TestTemplatesPage() {
  const { currentOrganizationId } = useAuth()
  const [selectedUser, setSelectedUser] = useState<User>(testUsers[0])
  const [appliedTemplates, setAppliedTemplates] = useState<Set<string>>(new Set())
  const [loadingTemplates, setLoadingTemplates] = useState<Set<string>>(new Set())

  const organizationId = currentOrganizationId || "1"
  const membership = selectedUser.organizationMemberships.find((m) => m.organizationId === organizationId)

  if (!membership) {
    return <div>No membership found for selected organization</div>
  }

  const availableTemplates = SYSTEM_PERMISSION_TEMPLATES.filter((template) =>
    template.applicableRoles.includes(membership.role),
  )

  const handleApplyTemplate = async (templateId: string) => {
    setLoadingTemplates((prev) => new Set(prev).add(templateId))

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const template = SYSTEM_PERMISSION_TEMPLATES.find((t) => t.id === templateId)
      if (template) {
        // Update the selected user's permissions
        const updatedMembership = RBACService.applyTemplate(membership, template)
        setSelectedUser((prev) => ({
          ...prev,
          organizationMemberships: prev.organizationMemberships.map((m) =>
            m.organizationId === organizationId ? updatedMembership : m,
          ),
        }))

        setAppliedTemplates((prev) => new Set(prev).add(templateId))

        toast("Template Applied",{
          description: `${template.name} template has been applied successfully.`,
        })
      }
    } catch (error) {
      console.error("Template application failed:", error)
      toast("Error",{
        description: "Failed to apply template",
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const template = SYSTEM_PERMISSION_TEMPLATES.find((t) => t.id === templateId)
      if (template) {
        // Update the selected user's permissions
        const updatedMembership = RBACService.removeTemplate(membership, template)
        setSelectedUser((prev) => ({
          ...prev,
          organizationMemberships: prev.organizationMemberships.map((m) =>
            m.organizationId === organizationId ? updatedMembership : m,
          ),
        }))

        setAppliedTemplates((prev) => {
          const newSet = new Set(prev)
          newSet.delete(templateId)
          return newSet
        })

        toast("Template Removed",{
          description: `${template.name} template has been removed successfully.`,
        })
      }
    } catch (error) {
      console.error("Template removal failed:", error)
      toast("Error",{
        description: "Failed to remove template",
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

  const handleUserChange = (userId: string) => {
    const user = testUsers.find((u) => u.id === userId)
    if (user) {
      setSelectedUser(user)
      setAppliedTemplates(new Set()) // Reset applied templates when switching users
    }
  }

  const getRolePermissions = (role: string): Permission[] => {
    const roleDefinition = ORGANIZATION_ROLE_DEFINITIONS[role as keyof typeof ORGANIZATION_ROLE_DEFINITIONS]
    return roleDefinition?.permissions || []
  }

  const rolePermissions = getRolePermissions(membership.role)
  const templatePermissions = membership.permissions || []
  const allPermissions = [...new Set([...rolePermissions, ...templatePermissions])]

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Permission Template Testing</h1>
        <p className="text-muted-foreground mt-2">
          Test applying different permission templates to users with various roles.
        </p>
      </div>

      {/* User Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Select Test User</span>
          </CardTitle>
          <CardDescription>Choose a user to test permission template application.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedUser.id} onValueChange={handleUserChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {testUsers.map((user) => {
                const userMembership = user.organizationMemberships.find((m) => m.organizationId === organizationId)
                return (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{userMembership?.role || "No role"}</div>
                      </div>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Current User Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Current User Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt={selectedUser.name} />
              <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-lg">{selectedUser.name}</div>
              <div className="text-muted-foreground">{selectedUser.email}</div>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline">{selectedUser.globalRole}</Badge>
                <Badge variant="secondary">{membership.role}</Badge>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2 flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Role Permissions ({rolePermissions.length})</span>
              </h4>
              <div className="flex flex-wrap gap-1">
                {rolePermissions.map((permission) => (
                  <Badge key={permission} variant="outline" className="text-xs">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Template Permissions ({templatePermissions.length})</span>
              </h4>
              <div className="flex flex-wrap gap-1">
                {templatePermissions.map((permission) => (
                  <Badge key={permission} variant="default" className="text-xs">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Total Permissions ({allPermissions.length})</h4>
            <div className="flex flex-wrap gap-1">
              {allPermissions.map((permission) => {
                const isFromRole = rolePermissions.includes(permission)
                const isFromTemplate = templatePermissions.includes(permission)

                return (
                  <Badge key={permission} variant={isFromTemplate ? "default" : "outline"} className="text-xs">
                    {permission}
                    {isFromRole && isFromTemplate && " (Both)"}
                    {isFromRole && !isFromTemplate && " (Role)"}
                    {!isFromRole && isFromTemplate && " (Template)"}
                  </Badge>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Available Permission Templates</CardTitle>
          <CardDescription>Templates compatible with the {membership.role} role.</CardDescription>
        </CardHeader>
        <CardContent>
          {availableTemplates.length === 0 ? (
            <p className="text-muted-foreground">
              No permission templates are available for the {membership.role} role.
            </p>
          ) : (
            <div className="grid gap-4">
              {availableTemplates.map((template) => {
                const isApplied = appliedTemplates.has(template.id)
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
                          onClick={() =>
                            isApplied ? handleRemoveTemplate(template.id) : handleApplyTemplate(template.id)
                          }
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : isApplied ? (
                            <>
                              <Minus className="h-4 w-4 mr-1" />
                              Remove Template
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-1" />
                              Apply Template
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
