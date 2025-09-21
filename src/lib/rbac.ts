// src/lib/rbac.ts
// ============================================================================
// Role-Based Access Control (RBAC) system
// ----------------------------------------------------------------------------
// This module defines types, constants, and helper services for implementing
// granular role-based and permission-based access control in a multi-tenant
// system (with global roles and organization-level roles).
//
// Key concepts:
// - Global roles (e.g. Super Admin, Admin, User) → apply across the entire platform.
// - Organization roles (e.g. Org Admin, Org Manager) → scoped to a single organization.
// - Permissions (fine-grained actions like "org.view", "org.members.manage").
// - Permission templates → pre-defined sets of permissions that can be applied
//   to members for convenience.
// - RBACService → utility functions for permission checks and template application.
// ============================================================================

// ---------------------------------------------------------------
// 1. Types: Roles, Permissions, Users, Memberships, Orgs definitions
// ---------------------------------------------------------------

// Global roles apply across the entire system
export type GlobalRole = "super_admin" | "admin" | "user"

// Organization roles apply within the scope of a single organization
export type OrganizationRole = "org_admin" | "org_manager" | "org_member" | "org_viewer"

// Fine-grained permissions — these are the "atomic units" of access control.
// They are divided into global-level and organization-level scopes.
export type Permission =
  // ---- Global permissions ----
  | "system.manage"             // Full system management (reserved for super_admins)
  | "users.manage_global"       // Manage all users across the system
  | "organizations.create"      // Create new organizations
  | "organizations.view_all"    // View all organizations across the system
  | "templates.manage_global"   // Manage system-wide permission templates

  // ---- Organization-level permissions ----
  | "org.manage"                // Full organization management (delete, transfer ownership, etc.)
  | "org.edit"                  // Edit organization details (profile, settings, etc.)
  | "org.delete"                // Delete an organization
  | "org.view"                  // View an organization
  | "org.share"                 // Share an organization (links, invites, etc.)
  | "org.export"                // Export organization data
  | "org.members.invite"        // Invite new members
  | "org.members.manage"        // Change roles/permissions of members
  | "org.members.remove"        // Remove members
  | "org.analytics.view"        // View organization analytics
  | "org.analytics.export"      // Export analytics data
  | "org.settings.manage"       // Change organization settings
  | "org.templates.create"      // Create organization-level permission templates
  | "org.templates.edit"        // Edit organization-level permission templates
  | "org.templates.delete"      // Delete organization-level permission templates

// ----------------------------------------------------------------------------
// Entity Interfaces
// ----------------------------------------------------------------------------

// Represents a system user (has global role and memberships in organizations)
export interface User {
  id: string
  name: string
  email: string
  globalRole: GlobalRole              // platform-level role
  avatar?: string
  createdAt: string
  lastActive: string
  organizationMemberships: OrganizationMembership[] // memberships in multiple orgs
}

// Represents a user's membership in a specific organization
export interface OrganizationMembership {
  organizationId: string
  organizationName: string
  role: OrganizationRole              // their role within the org
  permissions: Permission[]           // custom permissions (on top of role defaults)
  joinedAt: string
  invitedBy?: string                  // who invited them
}

// Represents an organization (tenant in a multi-tenant system)
export interface Organization {
  id: string
  name: string
  description: string
  ownerId: string
  createdAt: string
  settings: OrganizationSettings
}

// Settings that control how the organization behaves
export interface OrganizationSettings {
  allowMemberInvites: boolean
  requireApprovalForJoining: boolean
  defaultMemberRole: OrganizationRole
  customPermissions: Record<string, Permission[]> // per-role overrides
}

// A reusable "bundle" of permissions that can be applied to members
export interface PermissionTemplate {
  id: string
  name: string
  description: string
  permissions: Permission[]            // list of permissions granted
  applicableRoles: OrganizationRole[]  // which roles can use this template
  isSystem: boolean                    // true = built-in template, false = user-defined
  createdBy?: string
  createdAt: string
  organizationId?: string              // if set → org-specific, else → global
}

// Structure for describing a role (both global and org-level roles)
export interface RoleDefinition {
  name: string
  description: string
  permissions: Permission[] // default permissions for this role
  color: string             // UI tag color
  level: number             // hierarchy level (higher = more privileged)
}

// ---------------------------------------------------------------
// 2. Role Definitions (Global + Organization)
// ---------------------------------------------------------------

// Mapping of each global role → its definition
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

// Mapping of each org role → its definition
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

// ---------------------------------------------------------------
// 3. System Permission Templates (pre-defined reusable bundles)
// ---------------------------------------------------------------
// Preconfigured sets of permissions that can be applied to roles.
// Useful for speeding up onboarding or standardizing access levels.
// ---------------------------------------------------------------
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

// ----------------------------------------------------------------------------
// 4. RBAC Service (Core Permission Logic) → utility methods for permission checking
// ---------------------------------------------------------------
// Centralized class for checking and manipulating permissions.
// Always prefer using these helpers instead of re-implementing
// logic across the app.
// ----------------------------------------------------------------------------
export class RBACService {
  // -------------------
  // GLOBAL PERMISSIONS
  // Check whether a given global role has a global permission
  // -------------------
  static hasGlobalPermission(userGlobalRole: GlobalRole | undefined | null, permission: Permission): boolean {
    if (!userGlobalRole) return false
    const roleDefinition = GLOBAL_ROLE_DEFINITIONS[userGlobalRole]
    if (!roleDefinition || !roleDefinition.permissions) return false
    return roleDefinition.permissions.includes(permission)
  }

  // -------------------
  // ORGANIZATION PERMISSIONS
  // Check whether a given organization membership has a permission
  // -------------------
  static hasOrganizationPermission(
    membership: OrganizationMembership | undefined | null,
    permission: Permission,
  ): boolean {
    if (!membership) return false

    // First, Check explicit custom permissions first (overrides role)
    if (membership.permissions && membership.permissions.includes(permission)) return true

    // Fallback: Then check default role permissions
    if (!membership.role) return false
    const roleDefinition = ORGANIZATION_ROLE_DEFINITIONS[membership.role]
    if (!roleDefinition || !roleDefinition.permissions) return false

    return roleDefinition.permissions.includes(permission)
  }

  // -------------------
  // COMBINED CHECK
  // -------------------
  // 1. Check global role → if allowed, return true
  // 2. Else, check org membership role/permissions
  static hasPermission(user: User | null | undefined, permission: Permission, organizationId?: string): boolean {
    if (!user) return false

    // Global role check
    if (this.hasGlobalPermission(user.globalRole, permission)) return true

    // Org role check
    if (organizationId && user.organizationMemberships) {
      const membership = user.organizationMemberships.find((m) => m.organizationId === organizationId)
      return this.hasOrganizationPermission(membership, permission)
    }

    return false
  }

  // True if user has ANY of the listed permissions
  static hasAnyPermission(user: User | null | undefined, permissions: Permission[], organizationId?: string): boolean {
    if (!user || !permissions || permissions.length === 0) return false
    return permissions.some((permission) => this.hasPermission(user, permission, organizationId))
  }

  // True if user has ALL of the listed permissions
  static hasAllPermissions(user: User | null | undefined, permissions: Permission[], organizationId?: string): boolean {
    if (!user || !permissions || permissions.length === 0) return false
    return permissions.every((permission) => this.hasPermission(user, permission, organizationId))
  }

  // Get a user's role for a specific organization
  static getUserOrganizationRole(user: User | null | undefined, organizationId: string): OrganizationRole | null {
    if (!user || !user.organizationMemberships) return null
    const membership = user.organizationMemberships.find((m) => m.organizationId === organizationId)
    return membership?.role || null
  }

  // -------------------
  // ROUTE ACCESS GUARD
  // -------------------
  // Define required permissions for specific routes
  // and validate against the current user.
  // That is it determines if a user can access a given route based on permissions
  static canAccessRoute(user: User | null | undefined, route: string, organizationId?: string): boolean {
    if (!user) return false

    // Define required permissions for routes
    const routePermissions: Record<string, Permission[]> = {
      "/dashboard": ["org.view"],
      "/": ["organizations.create"],
      "/templates": ["org.view"],
      "/search": ["org.view"],
      "/analytics": ["org.analytics.view"],
      "/settings": ["org.settings.manage"],
      "/help": [], // public
      "/organization/[id]": ["org.view"],
      "/update": ["org.edit"],
      "/members": ["org.members.manage"],
    }

    const requiredPermissions = routePermissions[route] || []
    if (requiredPermissions.length === 0) return true // no restrictions

    return this.hasAnyPermission(user, requiredPermissions, organizationId)
  }

  // -------------------
  // TEMPLATE HELPERS
  // -------------------

  // Get applicable permission templates for a given role (and optionally org)
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

  // Apply a permission template → merge template perms into membership
  static applyTemplate(membership: OrganizationMembership, template: PermissionTemplate): OrganizationMembership {
    if (!membership || !template) return membership
    const currentPermissions = membership.permissions || []
    return {
      ...membership,
      permissions: [...new Set([...currentPermissions, ...template.permissions])], // dedup
    }
  }

  // Remove a permission template → strip its perms from membership
  static removeTemplate(membership: OrganizationMembership, template: PermissionTemplate): OrganizationMembership {
    if (!membership || !template) return membership
    const currentPermissions = membership.permissions || []
    return {
      ...membership,
      permissions: currentPermissions.filter((p) => !template.permissions.includes(p)),
    }
  }
}
