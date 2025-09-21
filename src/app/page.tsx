// src/app/page.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { PermissionGuard } from "@/components/rbac/permission-guard"
import { RoleBadge } from "@/components/rbac/role-badge"
import { Building2, Plus, Users, BarChart3, Settings, TestTube } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { user, currentOrganizationId } = useAuth()

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please log in to continue</h1>
        </div>
      </div>
    )
  }

  const currentMembership = user.organizationMemberships?.find((m) => m.organizationId === currentOrganizationId)

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground mt-2">Manage your organizations and access your dashboard.</p>
      </div>

      {/* User Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Your Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Global Role:</span>
                <RoleBadge role={user.globalRole} type="global" />
              </div>
              {currentMembership && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Organization Role:</span>
                  <RoleBadge role={currentMembership.role} type="organization" />
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                Member of {user.organizationMemberships?.length || 0} organizations
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PermissionGuard permission="org.view">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Dashboard</span>
              </CardTitle>
              <CardDescription>View organization overview and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button className="w-full">Go to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </PermissionGuard>

        <PermissionGuard permission="org.members.manage">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Manage Members</span>
              </CardTitle>
              <CardDescription>Invite and manage organization members</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/members">
                <Button className="w-full">Manage Members</Button>
              </Link>
            </CardContent>
          </Card>
        </PermissionGuard>

        <PermissionGuard permission="org.settings.manage">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </CardTitle>
              <CardDescription>Configure organization settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/settings">
                <Button className="w-full">Open Settings</Button>
              </Link>
            </CardContent>
          </Card>
        </PermissionGuard>

        <PermissionGuard permission="org.members.manage">
          <Card className="hover:shadow-md transition-shadow border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TestTube className="h-5 w-5 text-blue-600" />
                <span>Test Templates</span>
                <Badge variant="outline" className="text-xs">
                  New
                </Badge>
              </CardTitle>
              <CardDescription>Test permission template functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/test-templates">
                <Button className="w-full bg-transparent" variant="outline">
                  Test Templates
                </Button>
              </Link>
            </CardContent>
          </Card>
        </PermissionGuard>

        <PermissionGuard permission="organizations.create">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Create Organization</span>
              </CardTitle>
              <CardDescription>Start a new organization</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-transparent" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </CardContent>
          </Card>
        </PermissionGuard>
      </div>

      {/* Organizations List */}
      {user.organizationMemberships && user.organizationMemberships.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Organizations</CardTitle>
            <CardDescription>Organizations you are a member of</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user.organizationMemberships.map((membership) => (
                <div
                  key={membership.organizationId}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{membership.organizationName}</div>
                    <div className="text-sm text-muted-foreground">
                      Joined {new Date(membership.joinedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RoleBadge role={membership.role} type="organization" />
                    {membership.permissions.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        +{membership.permissions.length} custom
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
