// src/organization-dashboard.tsx
"use client"

import { useState } from "react"
import {
  Building2,
  Users,
  TrendingUp,
  ActivityIcon,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Share,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface Organization {
  id: string
  name: string
  description: string
  industry: string
  employeeCount: string
  status: "active" | "pending" | "inactive"
  logo?: string
  createdAt: string
  lastUpdated: string
  completionPercentage: number
  members: number
  revenue?: string
}

interface DashboardStats {
  totalOrganizations: number
  activeOrganizations: number
  totalMembers: number
  avgCompletion: number
}

interface RecentActivity {
  id: string
  type: "created" | "updated" | "shared" | "member_added"
  organizationName: string
  timestamp: string
  user: string
}

const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "TechCorp Solutions",
    description: "Leading technology solutions provider",
    industry: "Technology",
    employeeCount: "51-200",
    status: "active",
    logo: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-15",
    lastUpdated: "2024-01-20",
    completionPercentage: 85,
    members: 12,
    revenue: "$1M - $5M",
  },
  {
    id: "2",
    name: "HealthFirst Medical",
    description: "Comprehensive healthcare services",
    industry: "Healthcare",
    employeeCount: "201-500",
    status: "active",
    logo: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-10",
    lastUpdated: "2024-01-18",
    completionPercentage: 92,
    members: 25,
    revenue: "$5M - $10M",
  },
  {
    id: "3",
    name: "EduLearn Academy",
    description: "Online education platform",
    industry: "Education",
    employeeCount: "11-50",
    status: "pending",
    logo: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-12",
    lastUpdated: "2024-01-16",
    completionPercentage: 45,
    members: 8,
    revenue: "$500K - $1M",
  },
]

const mockActivities: RecentActivity[] = [
  {
    id: "1",
    type: "created",
    organizationName: "TechCorp Solutions",
    timestamp: "2 hours ago",
    user: "John Doe",
  },
  {
    id: "2",
    type: "updated",
    organizationName: "HealthFirst Medical",
    timestamp: "4 hours ago",
    user: "Jane Smith",
  },
  {
    id: "3",
    type: "member_added",
    organizationName: "EduLearn Academy",
    timestamp: "1 day ago",
    user: "Mike Johnson",
  },
  {
    id: "4",
    type: "shared",
    organizationName: "TechCorp Solutions",
    timestamp: "2 days ago",
    user: "Sarah Wilson",
  },
]

export default function OrganizationDashboard() {
  const router = useRouter()
  //const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations)
  const organizations = mockOrganizations

  //const [activities, setActivities] = useState<RecentActivity[]>(mockActivities)
  const activities = mockActivities

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const stats: DashboardStats = {
    totalOrganizations: organizations.length,
    activeOrganizations: organizations.filter((org) => org.status === "active").length,
    totalMembers: organizations.reduce((sum, org) => sum + org.members, 0),
    avgCompletion: Math.round(
      organizations.reduce((sum, org) => sum + org.completionPercentage, 0) / organizations.length,
    ),
  }

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.industry.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || org.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleCreateNew = () => {
    router.push("/")
  }

  const handleViewOrganization = (id: string) => {
    router.push(`/organization/${id}`)
  }

  const handleEditOrganization = (id: string) => {
    router.push(`/update?id=${id}`)
  }

  const handleSearchOrganizations = () => {
    router.push("/search")
  }

  const handleTemplates = () => {
    router.push("/templates")
  }

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "created":
        return <Plus className="h-4 w-4 text-green-500" />
      case "updated":
        return <Edit className="h-4 w-4 text-blue-500" />
      case "shared":
        return <Share className="h-4 w-4 text-purple-500" />
      case "member_added":
        return <Users className="h-4 w-4 text-orange-500" />
      default:
        return <ActivityIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityText = (activity: RecentActivity) => {
    switch (activity.type) {
      case "created":
        return `${activity.user} created ${activity.organizationName}`
      case "updated":
        return `${activity.user} updated ${activity.organizationName}`
      case "shared":
        return `${activity.user} shared ${activity.organizationName}`
      case "member_added":
        return `${activity.user} was added to ${activity.organizationName}`
      default:
        return `Activity in ${activity.organizationName}`
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Building2 className="h-8 w-8" />
                Organization Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Manage and monitor your organizations</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleTemplates}>
                <Building2 className="h-4 w-4 mr-2" />
                Templates
              </Button>
              <Button variant="outline" onClick={handleSearchOrganizations}>
                <Search className="h-4 w-4 mr-2" />
                Advanced Search
              </Button>
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Create Organization
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrganizations}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Organizations</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeOrganizations}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.activeOrganizations / stats.totalOrganizations) * 100)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
              <p className="text-xs text-muted-foreground">+12 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgCompletion}%</div>
              <Progress value={stats.avgCompletion} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="organizations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="organizations" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search organizations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter: {filterStatus === "all" ? "All" : filterStatus}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setFilterStatus("all")}>All</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("active")}>Active</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("pending")}>Pending</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("inactive")}>Inactive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>

            {/* Organizations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrganizations.map((org) => (
                <Card key={org.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={org.logo || "/placeholder.svg"} alt={org.name} />
                          <AvatarFallback>{org.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{org.name}</CardTitle>
                          <CardDescription className="text-sm">{org.industry}</CardDescription>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleViewOrganization(org.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditOrganization(org.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 line-clamp-2">{org.description}</p>

                      <div className="flex items-center justify-between text-sm">
                        <Badge
                          variant={
                            org.status === "active" ? "default" : org.status === "pending" ? "secondary" : "destructive"
                          }
                        >
                          {org.status}
                        </Badge>
                        <span className="text-gray-500">{org.employeeCount} employees</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Profile Completion</span>
                          <span>{org.completionPercentage}%</span>
                        </div>
                        <Progress value={org.completionPercentage} />
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{org.members} members</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Updated {new Date(org.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Organizations by Industry
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Technology", "Healthcare", "Education", "Finance"].map((industry) => {
                      const count = organizations.filter((org) => org.industry === industry).length
                      const percentage = (count / organizations.length) * 100
                      return (
                        <div key={industry} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{industry}</span>
                            <span>
                              {count} ({percentage.toFixed(0)}%)
                            </span>
                          </div>
                          <Progress value={percentage} />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Completion Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { range: "90-100%", color: "bg-green-500" },
                      { range: "70-89%", color: "bg-blue-500" },
                      { range: "50-69%", color: "bg-yellow-500" },
                      { range: "0-49%", color: "bg-red-500" },
                    ].map(({ range, color }) => {
                      const [min, max] = range.split("-").map((s) => Number.parseInt(s.replace("%", "")))
                      const count = organizations.filter(
                        (org) => org.completionPercentage >= min && org.completionPercentage <= max,
                      ).length
                      const percentage = (count / organizations.length) * 100
                      return (
                        <div key={range} className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded ${color}`} />
                          <div className="flex-1">
                            <div className="flex justify-between text-sm">
                              <span>{range}</span>
                              <span>{count} organizations</span>
                            </div>
                            <Progress value={percentage} className="mt-1" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ActivityIcon className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates and changes across your organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                      <div className="mt-1">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{getActivityText(activity)}</p>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
