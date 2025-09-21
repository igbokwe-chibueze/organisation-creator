// src/lib/rbac.ts
// Role-Based Access Control (RBAC) System with Organization-level permissions

export type GlobalRole = "super_admin" | "admin" | "user"
export type OrganizationRole = "org_admin" | "org_manager" | "org_member" | "org_viewer"

export type Permission =
  // Global permissions
  | "system.manage"
  | "users.manage_global"
  | "organizations.create"
  | "organizations.view_all"
  | "templates.manage_global"
  // Organization-level permissions
  | "org.manage"
  | "org.edit"
  | "org.delete"
  | "org.view"
  | "org.share"
  | "org.export"
  | "org.members.invite"
  | "org.members.manage"
  | "org.members.remove"
  | "org.analytics.view"
  | "org.analytics.export"
  | "org.settings.manage"
  | "org.templates.create"
  | "org.templates.edit"
  | "org.templates.delete"

export interface User {
  id: string
  name: string
  email: string
  globalRole: GlobalRole
  avatar?: string
  createdAt: string
  lastActive: string
  organizationMemberships: OrganizationMembership[]
}

export interface OrganizationMembership {
  organizationId: string
  organizationName: string
  role: OrganizationRole
  permissions: Permission[]
  joinedAt: string
  invitedBy?: string
}

export interface Organization {
  id: string
  name: string
  description: string
  ownerId: string
  createdAt: string
  settings: OrganizationSettings
}

export interface OrganizationSettings {
  allowMemberInvites: boolean
  requireApprovalForJoining: boolean
  defaultMemberRole: OrganizationRole
  customPermissions: Record<string, Permission[]>
}

export interface PermissionTemplate {
  id: string
  name: string
  description: string
  permissions: Permission[]
  applicableRoles: OrganizationRole[]
  isSystem: boolean
  createdBy?: string
  createdAt: string
  organizationId?: string // null for global templates
}

export interface RoleDefinition {
  name: string
  description: string
  permissions: Permission[]
  color: string
  level: number // for hierarchy
}

export const GLOBAL_ROLE_DEFINITIONS: Record<GlobalRole, RoleDefinition> = {
  super_admin: {
    name: "Super Administrator",
    description: "Full system access across all organizations",
    color: "bg-purple-100 text-purple-800",
    level: 100,
    permissions: [
      "system.manage",
      "users.manage_global",
      "organizations.create",
      "organizations.view_all",
      "templates.manage_global",
    ],
  },
  admin: {
    name: "Administrator",
    description: "Can manage users and create organizations",
    color: "bg-red-100 text-red-800",
    level: 50,
    permissions: ["users.manage_global", "organizations.create", "organizations.view_all"],
  },
  user: {
    name: "User",
    description: "Standard user with organization access",
    color: "bg-blue-100 text-blue-800",
    level: 10,
    permissions: ["organizations.create"],
  },
}

export const ORGANIZATION_ROLE_DEFINITIONS: Record<OrganizationRole, RoleDefinition> = {
  org_admin: {
    name: "Organization Admin",
    description: "Full control over the organization",
    color: "bg-red-100 text-red-800",
    level: 100,
    permissions: [
      "org.manage",
      "org.edit",
      "org.delete",
      "org.view",
      "org.share",
      "org.export",
      "org.members.invite",
      "org.members.manage",
      "org.members.remove",
      "org.analytics.view",
      "org.analytics.export",
      "org.settings.manage",
      "org.templates.create",
      "org.templates.edit",
      "org.templates.delete",
    ],
  },
  org_manager: {
    name: "Organization Manager",
    description: "Can manage organization and invite members",
    color: "bg-blue-100 text-blue-800",
    level: 75,
    permissions: [
      "org.edit",
      "org.view",
      "org.share",
      "org.export",
      "org.members.invite",
      "org.analytics.view",
      "org.analytics.export",
      "org.templates.create",
      "org.templates.edit",
    ],
  },
  org_member: {
    name: "Organization Member",
    description: "Can edit organization content",
    color: "bg-green-100 text-green-800",
    level: 50,
    permissions: ["org.edit", "org.view", "org.share", "org.analytics.view", "org.templates.create"],
  },
  org_viewer: {
    name: "Organization Viewer",
    description: "Read-only access to organization",
    color: "bg-gray-100 text-gray-800",
    level: 25,
    permissions: ["org.view"],
  },
}

export const SYSTEM_PERMISSION_TEMPLATES: PermissionTemplate[] = [
  {
    id: "template-full-access",
    name: "Full Access",
    description: "Complete access to all organization features",
    permissions: [
      "org.manage",
      "org.edit",
      "org.delete",
      "org.view",
      "org.share",
      "org.export",
      "org.members.invite",
      "org.members.manage",
      "org.members.remove",
      "org.analytics.view",
      "org.analytics.export",
      "org.settings.manage",
      "org.templates.create",
      "org.templates.edit",
      "org.templates.delete",
    ],
    applicableRoles: ["org_admin"],
    isSystem: true,
    createdAt: "2024-01-01",
  },
  {
    id: "template-content-manager",
    name: "Content Manager",
    description: "Can manage organization content and basic analytics",
    permissions: [
      "org.edit",
      "org.view",
      "org.share",
      "org.export",
      "org.analytics.view",
      "org.templates.create",
      "org.templates.edit",
    ],
    applicableRoles: ["org_manager", "org_member"],
    isSystem: true,
    createdAt: "2024-01-01",
  },
  {
    id: "template-analytics-viewer",
    name: "Analytics Viewer",
    description: "Read-only access with analytics viewing",
    permissions: ["org.view", "org.analytics.view"],
    applicableRoles: ["org_viewer", "org_member"],
    isSystem: true,
    createdAt: "2024-01-01",
  },
  {
    id: "template-member-manager",
    name: "Member Manager",
    description: "Can manage organization members and content",
    permissions: [
      "org.edit",
      "org.view",
      "org.share",
      "org.members.invite",
      "org.members.manage",
      "org.analytics.view",
    ],
    applicableRoles: ["org_manager"],
    isSystem: true,
    createdAt: "2024-01-01",
  },
  {
    id: "template-read-only",
    name: "Read Only",
    description: "Basic read-only access to organization",
    permissions: ["org.view"],
    applicableRoles: ["org_viewer"],
    isSystem: true,
    createdAt: "2024-01-01",
  },
]

export class RBACService {
  // Global permission checks with proper null/undefined handling
  static hasGlobalPermission(userGlobalRole: GlobalRole | undefined | null, permission: Permission): boolean {
    if (!userGlobalRole) return false

    const roleDefinition = GLOBAL_ROLE_DEFINITIONS[userGlobalRole]
    if (!roleDefinition || !roleDefinition.permissions) return false

    return roleDefinition.permissions.includes(permission)
  }

  // Organization permission checks with proper null/undefined handling
  static hasOrganizationPermission(
    membership: OrganizationMembership | undefined | null,
    permission: Permission,
  ): boolean {
    if (!membership) return false

    // Check custom permissions first
    if (membership.permissions && membership.permissions.includes(permission)) return true

    // Check role-based permissions
    if (!membership.role) return false

    const roleDefinition = ORGANIZATION_ROLE_DEFINITIONS[membership.role]
    if (!roleDefinition || !roleDefinition.permissions) return false

    return roleDefinition.permissions.includes(permission)
  }

  // Combined permission check with proper null/undefined handling
  static hasPermission(user: User | null | undefined, permission: Permission, organizationId?: string): boolean {
    if (!user) return false

    // Check global permissions first
    if (this.hasGlobalPermission(user.globalRole, permission)) return true

    // Check organization-specific permissions
    if (organizationId && user.organizationMemberships) {
      const membership = user.organizationMemberships.find((m) => m.organizationId === organizationId)
      return this.hasOrganizationPermission(membership, permission)
    }

    return false
  }

  static hasAnyPermission(user: User | null | undefined, permissions: Permission[], organizationId?: string): boolean {
    if (!user || !permissions || permissions.length === 0) return false
    return permissions.some((permission) => this.hasPermission(user, permission, organizationId))
  }

  static hasAllPermissions(user: User | null | undefined, permissions: Permission[], organizationId?: string): boolean {
    if (!user || !permissions || permissions.length === 0) return false
    return permissions.every((permission) => this.hasPermission(user, permission, organizationId))
  }

  static getUserOrganizationRole(user: User | null | undefined, organizationId: string): OrganizationRole | null {
    if (!user || !user.organizationMemberships) return null
    const membership = user.organizationMemberships.find((m) => m.organizationId === organizationId)
    return membership?.role || null
  }

  static canAccessRoute(user: User | null | undefined, route: string, organizationId?: string): boolean {
    if (!user) return false

    const routePermissions: Record<string, Permission[]> = {
      "/dashboard": ["org.view"],
      "/": ["organizations.create"],
      "/templates": ["org.view"],
      "/search": ["org.view"],
      "/analytics": ["org.analytics.view"],
      "/settings": ["org.settings.manage"],
      "/help": [],
      "/organization/[id]": ["org.view"],
      "/update": ["org.edit"],
      "/members": ["org.members.manage"],
    }

    const requiredPermissions = routePermissions[route] || []
    if (requiredPermissions.length === 0) return true

    return this.hasAnyPermission(user, requiredPermissions, organizationId)
  }

  static getApplicableTemplates(
    role: OrganizationRole | null | undefined,
    organizationId?: string,
  ): PermissionTemplate[] {
    if (!role) return []

    return SYSTEM_PERMISSION_TEMPLATES.filter(
      (template) =>
        template.applicableRoles.includes(role) &&
        (!organizationId || !template.organizationId || template.organizationId === organizationId),
    )
  }

  static applyTemplate(membership: OrganizationMembership, template: PermissionTemplate): OrganizationMembership {
    if (!membership || !template) return membership

    const currentPermissions = membership.permissions || []
    return {
      ...membership,
      permissions: [...new Set([...currentPermissions, ...template.permissions])],
    }
  }

  static removeTemplate(membership: OrganizationMembership, template: PermissionTemplate): OrganizationMembership {
    if (!membership || !template) return membership

    const currentPermissions = membership.permissions || []
    return {
      ...membership,
      permissions: currentPermissions.filter((p) => !template.permissions.includes(p)),
    }
  }
}
