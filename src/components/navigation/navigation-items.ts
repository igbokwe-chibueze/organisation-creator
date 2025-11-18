// src/components/navigation/navigation-items.ts
import {
  Home,
  Search,
  BarChart3,
  Settings,
  HelpCircle,
  Users,
  BookTemplate as FileTemplate,
  TestTube,
  Layout,
} from "lucide-react"
import { Permission } from "@/lib/rbac"

// Define the type for a navigation item
export interface NavigationItem {
  title: string
  href: string
  icon: typeof Home
  permissions: Permission[]
}

// Export the typed navigation items array
export const navigationItems: NavigationItem[] = [
  { title: "Home", href: "/", icon: Home, permissions: ["organizations.create"] },
  { title: "Dashboard", href: "/dashboard", icon: Layout, permissions: ["org.view"] },
  { title: "Templates", href: "/templates", icon: FileTemplate, permissions: ["org.view"] },
  { title: "Search", href: "/search", icon: Search, permissions: ["org.view"] },
  { title: "Analytics", href: "/analytics", icon: BarChart3, permissions: ["org.analytics.view"] },
  { title: "Members", href: "/members", icon: Users, permissions: ["org.members.manage"] },
  { title: "Settings", href: "/settings", icon: Settings, permissions: ["org.settings.manage"] },
  { title: "Help", href: "/help", icon: HelpCircle, permissions: [] }, // public route
  { title: "Test Templates", href: "/test-templates", icon: TestTube, permissions: ["org.members.manage"] },
]
