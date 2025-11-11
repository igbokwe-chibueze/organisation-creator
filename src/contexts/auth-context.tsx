// src/contexts/auth-context.tsx
"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import {
  type User,
  type GlobalRole,
  type OrganizationRole,
  type Permission,
  type PermissionTemplate,
  RBACService,
  SYSTEM_PERMISSION_TEMPLATES,
  OrganizationMembership,
} from "@/lib/rbac"

interface AuthContextType {
  user: User | null
  currentOrganizationId: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  switchOrganization: (organizationId: string) => void
  hasPermission: (permission: Permission, organizationId?: string) => boolean
  hasAnyPermission: (permissions: Permission[], organizationId?: string) => boolean
  hasAllPermissions: (permissions: Permission[], organizationId?: string) => boolean
  updateUserGlobalRole: (userId: string, newRole: GlobalRole) => Promise<void>
  updateUserOrganizationRole: (userId: string, organizationId: string, newRole: OrganizationRole) => Promise<void>
  applyPermissionTemplate: (userId: string, organizationId: string, templateId: string) => Promise<void>
  removePermissionTemplate: (userId: string, organizationId: string, templateId: string) => Promise<void>
  getAvailableTemplates: (organizationId: string) => PermissionTemplate[]
  isLoading: boolean

  allUsers: User[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data with organization memberships
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    globalRole: "super_admin",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-01",
    lastActive: "2024-01-20",
    organizationMemberships: [
      {
        organizationId: "1",
        organizationName: "TechCorp Solutions",
        role: "org_admin",
        permissions: [],
        joinedAt: "2024-01-01",
      },
      {
        organizationId: "2",
        organizationName: "HealthFirst Medical",
        role: "org_manager",
        permissions: [],
        joinedAt: "2024-01-05",
      },
    ],
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    globalRole: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-05",
    lastActive: "2024-01-19",
    organizationMemberships: [
      {
        organizationId: "1",
        organizationName: "TechCorp Solutions",
        role: "org_manager",
        permissions: [],
        joinedAt: "2024-01-05",
      },
    ],
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    globalRole: "user",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-10",
    lastActive: "2024-01-18",
    organizationMemberships: [
      {
        organizationId: "1",
        organizationName: "TechCorp Solutions",
        role: "org_member",
        permissions: [],
        joinedAt: "2024-01-10",
      },
      {
        organizationId: "3",
        organizationName: "EduLearn Academy",
        role: "org_admin",
        permissions: [],
        joinedAt: "2024-01-12",
      },
    ],
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    globalRole: "user",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-15",
    lastActive: "2024-01-17",
    organizationMemberships: [
      {
        organizationId: "1",
        organizationName: "TechCorp Solutions",
        role: "org_viewer",
        permissions: [],
        joinedAt: "2024-01-15",
      },
    ],
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [currentOrganizationId, setCurrentOrganizationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading user from localStorage or API
    const savedUser = localStorage.getItem("currentUser")
    const savedOrgId = localStorage.getItem("currentOrganizationId")

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        // Ensure the user has the required structure
        if (parsedUser && parsedUser.id && parsedUser.globalRole) {
          setUser(parsedUser)

          // Safely set organization ID
          // if (savedOrgId && parsedUser.organizationMemberships?.some((m: any) => m.organizationId === savedOrgId)) {
          if (savedOrgId && parsedUser.organizationMemberships?.some((m: OrganizationMembership) => m.organizationId === savedOrgId)) {
            setCurrentOrganizationId(savedOrgId)
          } else if (parsedUser.organizationMemberships && parsedUser.organizationMemberships.length > 0) {
            setCurrentOrganizationId(parsedUser.organizationMemberships[0].organizationId)
          } else {
            setCurrentOrganizationId(null)
          }
        } else {
          // Invalid user data, use default
          const defaultUser = mockUsers[0]
          setUser(defaultUser)
          if (defaultUser.organizationMemberships && defaultUser.organizationMemberships.length > 0) {
            const defaultOrgId = defaultUser.organizationMemberships[0].organizationId
            setCurrentOrganizationId(defaultOrgId)
            localStorage.setItem("currentOrganizationId", defaultOrgId)
          }
          localStorage.setItem("currentUser", JSON.stringify(defaultUser))
        }
      } catch (error) {
        console.error("Error parsing saved user:", error)
        // Use default user on parse error
        const defaultUser = mockUsers[0]
        setUser(defaultUser)
        if (defaultUser.organizationMemberships && defaultUser.organizationMemberships.length > 0) {
          const defaultOrgId = defaultUser.organizationMemberships[0].organizationId
          setCurrentOrganizationId(defaultOrgId)
          localStorage.setItem("currentOrganizationId", defaultOrgId)
        }
        localStorage.setItem("currentUser", JSON.stringify(defaultUser))
      }
    } else {
      // Default to super admin user for demo
      const defaultUser = mockUsers[0]
      setUser(defaultUser)

      // Safely set default organization
      if (defaultUser.organizationMemberships && defaultUser.organizationMemberships.length > 0) {
        const defaultOrgId = defaultUser.organizationMemberships[0].organizationId
        setCurrentOrganizationId(defaultOrgId)
        localStorage.setItem("currentOrganizationId", defaultOrgId)
      } else {
        setCurrentOrganizationId(null)
      }

      localStorage.setItem("currentUser", JSON.stringify(defaultUser))
    }
    setIsLoading(false)
  }, [])

  // const login = async (email: string, _password: string) => {
  const login = async (email: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const foundUser = mockUsers.find((u) => u.email === email)
      if (foundUser) {
        setUser(foundUser)

        // Safely set organization ID
        if (foundUser.organizationMemberships && foundUser.organizationMemberships.length > 0) {
          const firstOrgId = foundUser.organizationMemberships[0].organizationId
          setCurrentOrganizationId(firstOrgId)
          localStorage.setItem("currentOrganizationId", firstOrgId)
        } else {
          setCurrentOrganizationId(null)
          localStorage.removeItem("currentOrganizationId")
        }

        localStorage.setItem("currentUser", JSON.stringify(foundUser))
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setCurrentOrganizationId(null)
    localStorage.removeItem("currentUser")
    localStorage.removeItem("currentOrganizationId")
  }

  const switchOrganization = (organizationId: string) => {
    if (user && user.organizationMemberships?.some((m) => m.organizationId === organizationId)) {
      setCurrentOrganizationId(organizationId)
      localStorage.setItem("currentOrganizationId", organizationId)
    }
  }

  const hasPermission = (permission: Permission, organizationId?: string): boolean => {
    const orgId = organizationId || currentOrganizationId
    return RBACService.hasPermission(user, permission, orgId || undefined)
  }

  const hasAnyPermission = (permissions: Permission[], organizationId?: string): boolean => {
    const orgId = organizationId || currentOrganizationId
    return RBACService.hasAnyPermission(user, permissions, orgId || undefined)
  }

  const hasAllPermissions = (permissions: Permission[], organizationId?: string): boolean => {
    const orgId = organizationId || currentOrganizationId
    return RBACService.hasAllPermissions(user, permissions, orgId || undefined)
  }

  const updateUserGlobalRole = async (userId: string, newRole: GlobalRole) => {
    if (!user || !RBACService.hasPermission(user, "users.manage_global")) {
      throw new Error("Insufficient permissions")
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Update mock data
    const userIndex = mockUsers.findIndex((u) => u.id === userId)
    if (userIndex !== -1) {
      mockUsers[userIndex].globalRole = newRole
    }

    // If updating current user, update state
    if (userId === user.id) {
      const updatedUser = { ...user, globalRole: newRole }
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    }
  }

  const updateUserOrganizationRole = async (userId: string, organizationId: string, newRole: OrganizationRole) => {
    if (!user || !hasPermission("org.members.manage", organizationId)) {
      throw new Error("Insufficient permissions")
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Update mock data
    const userIndex = mockUsers.findIndex((u) => u.id === userId)
    if (userIndex !== -1 && mockUsers[userIndex].organizationMemberships) {
      const membershipIndex = mockUsers[userIndex].organizationMemberships.findIndex(
        (m) => m.organizationId === organizationId,
      )
      if (membershipIndex !== -1) {
        mockUsers[userIndex].organizationMemberships[membershipIndex].role = newRole
      }
    }

    // If updating current user, update state
    if (userId === user.id && user.organizationMemberships) {
      const updatedMemberships = user.organizationMemberships.map((m) =>
        m.organizationId === organizationId ? { ...m, role: newRole } : m,
      )
      const updatedUser = { ...user, organizationMemberships: updatedMemberships }
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    }
  }

  const applyPermissionTemplate = async (userId: string, organizationId: string, templateId: string) => {
    if (!user || !hasPermission("org.members.manage", organizationId)) {
      throw new Error("Insufficient permissions")
    }

    const template = SYSTEM_PERMISSION_TEMPLATES.find((t) => t.id === templateId)
    if (!template) throw new Error("Template not found")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Update mock data
    const userIndex = mockUsers.findIndex((u) => u.id === userId)
    if (userIndex !== -1 && mockUsers[userIndex].organizationMemberships) {
      const membershipIndex = mockUsers[userIndex].organizationMemberships.findIndex(
        (m) => m.organizationId === organizationId,
      )
      if (membershipIndex !== -1) {
        const currentMembership = mockUsers[userIndex].organizationMemberships[membershipIndex]
        mockUsers[userIndex].organizationMemberships[membershipIndex] = RBACService.applyTemplate(
          currentMembership,
          template,
        )
      }
    }

    // If updating current user, update state
    if (userId === user.id && user.organizationMemberships) {
      const updatedMemberships = user.organizationMemberships.map((m) => {
        if (m.organizationId === organizationId) {
          return RBACService.applyTemplate(m, template)
        }
        return m
      })
      const updatedUser = { ...user, organizationMemberships: updatedMemberships }
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    }
  }

  const removePermissionTemplate = async (userId: string, organizationId: string, templateId: string) => {
    if (!user || !hasPermission("org.members.manage", organizationId)) {
      throw new Error("Insufficient permissions")
    }

    const template = SYSTEM_PERMISSION_TEMPLATES.find((t) => t.id === templateId)
    if (!template) throw new Error("Template not found")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Update mock data
    const userIndex = mockUsers.findIndex((u) => u.id === userId)
    if (userIndex !== -1 && mockUsers[userIndex].organizationMemberships) {
      const membershipIndex = mockUsers[userIndex].organizationMemberships.findIndex(
        (m) => m.organizationId === organizationId,
      )
      if (membershipIndex !== -1) {
        const currentMembership = mockUsers[userIndex].organizationMemberships[membershipIndex]
        mockUsers[userIndex].organizationMemberships[membershipIndex] = RBACService.removeTemplate(
          currentMembership,
          template,
        )
      }
    }

    // If updating current user, update state
    if (userId === user.id && user.organizationMemberships) {
      const updatedMemberships = user.organizationMemberships.map((m) => {
        if (m.organizationId === organizationId) {
          return RBACService.removeTemplate(m, template)
        }
        return m
      })
      const updatedUser = { ...user, organizationMemberships: updatedMemberships }
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    }
  }

  const getAvailableTemplates = (organizationId: string): PermissionTemplate[] => {
    if (!user || !user.organizationMemberships) return []
    const membership = user.organizationMemberships.find((m) => m.organizationId === organizationId)
    if (!membership) return []

    return RBACService.getApplicableTemplates(membership.role, organizationId)
  }

  const value: AuthContextType = {
    user,
    currentOrganizationId,
    login,
    logout,
    switchOrganization,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    updateUserGlobalRole,
    updateUserOrganizationRole,
    applyPermissionTemplate,
    removePermissionTemplate,
    getAvailableTemplates,
    isLoading,

    allUsers: mockUsers
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
