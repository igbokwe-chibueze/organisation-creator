// src/organization-search.tsx
"use client"

import { useState, useEffect } from "react"
import {
  Search,
  ArrowLeft,
  Building2,
  MapPin,
  Users,
  Calendar,
  Eye,
  Share,
  Download,
  SlidersHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useRouter } from "next/navigation"

interface Organization {
  id: string
  name: string
  description: string
  industry: string
  organizationType: string
  employeeCount: string
  status: "active" | "pending" | "inactive"
  logo?: string
  createdAt: string
  lastUpdated: string
  completionPercentage: number
  members: number
  revenue?: string
  country: string
  website?: string
  isPublic: boolean
}

interface SearchFilters {
  industry: string[]
  organizationType: string[]
  employeeCount: string[]
  status: string[]
  country: string[]
  completionRange: [number, number]
  isPublic: boolean | null
}

type FilterValue<K extends keyof SearchFilters> = SearchFilters[K]


const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "TechCorp Solutions",
    description: "Leading technology solutions provider specializing in cloud computing and AI",
    industry: "Technology",
    organizationType: "Corporation",
    employeeCount: "51-200",
    status: "active",
    logo: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-15",
    lastUpdated: "2024-01-20",
    completionPercentage: 85,
    members: 12,
    revenue: "$1M - $5M",
    country: "United States",
    website: "https://techcorp.com",
    isPublic: true,
  },
  {
    id: "2",
    name: "HealthFirst Medical",
    description: "Comprehensive healthcare services with focus on patient care and medical innovation",
    industry: "Healthcare",
    organizationType: "Healthcare",
    employeeCount: "201-500",
    status: "active",
    logo: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-10",
    lastUpdated: "2024-01-18",
    completionPercentage: 92,
    members: 25,
    revenue: "$5M - $10M",
    country: "Canada",
    website: "https://healthfirst.ca",
    isPublic: true,
  },
  {
    id: "3",
    name: "EduLearn Academy",
    description: "Online education platform providing courses in technology and business",
    industry: "Education",
    organizationType: "Educational",
    employeeCount: "11-50",
    status: "pending",
    logo: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-12",
    lastUpdated: "2024-01-16",
    completionPercentage: 45,
    members: 8,
    revenue: "$500K - $1M",
    country: "United Kingdom",
    website: "https://edulearn.co.uk",
    isPublic: false,
  },
  {
    id: "4",
    name: "GreenEnergy Corp",
    description: "Renewable energy solutions for sustainable future",
    industry: "Energy",
    organizationType: "Corporation",
    employeeCount: "501-1000",
    status: "active",
    logo: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-08",
    lastUpdated: "2024-01-22",
    completionPercentage: 78,
    members: 45,
    revenue: "$10M - $50M",
    country: "Germany",
    website: "https://greenenergy.de",
    isPublic: true,
  },
  {
    id: "5",
    name: "FinanceFlow LLC",
    description: "Financial consulting and investment management services",
    industry: "Finance",
    organizationType: "LLC",
    employeeCount: "11-50",
    status: "active",
    logo: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-05",
    lastUpdated: "2024-01-19",
    completionPercentage: 67,
    members: 15,
    revenue: "$1M - $5M",
    country: "United States",
    website: "https://financeflow.com",
    isPublic: true,
  },
]

const industries = [
  "Technology",
  "Healthcare",
  "Education",
  "Finance",
  "Manufacturing",
  "Retail",
  "Energy",
  "Consulting",
]
const organizationTypes = ["Corporation", "LLC", "Partnership", "Non-Profit", "Healthcare", "Educational", "Startup"]
const employeeCounts = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]
const statuses = ["active", "pending", "inactive"]
const countries = ["United States", "Canada", "United Kingdom", "Germany", "France", "Australia", "Japan"]

export default function OrganizationSearch() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [organizations] = useState<Organization[]>(mockOrganizations)

  const [filteredOrganizations, setFilteredOrganizations] = useState<Organization[]>(mockOrganizations)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    industry: [],
    organizationType: [],
    employeeCount: [],
    status: [],
    country: [],
    completionRange: [0, 100],
    isPublic: null,
  })

  // Apply filters and search
  useEffect(() => {
    const filtered = organizations.filter((org) => {
      // Text search
      const matchesSearch =
        searchTerm === "" ||
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.industry.toLowerCase().includes(searchTerm.toLowerCase())

      // Industry filter
      const matchesIndustry = filters.industry.length === 0 || filters.industry.includes(org.industry)

      // Organization type filter
      const matchesOrgType =
        filters.organizationType.length === 0 || filters.organizationType.includes(org.organizationType)

      // Employee count filter
      const matchesEmployeeCount =
        filters.employeeCount.length === 0 || filters.employeeCount.includes(org.employeeCount)

      // Status filter
      const matchesStatus = filters.status.length === 0 || filters.status.includes(org.status)

      // Country filter
      const matchesCountry = filters.country.length === 0 || filters.country.includes(org.country)

      // Completion range filter
      const matchesCompletion =
        org.completionPercentage >= filters.completionRange[0] && org.completionPercentage <= filters.completionRange[1]

      // Public filter
      const matchesPublic = filters.isPublic === null || org.isPublic === filters.isPublic

      return (
        matchesSearch &&
        matchesIndustry &&
        matchesOrgType &&
        matchesEmployeeCount &&
        matchesStatus &&
        matchesCountry &&
        matchesCompletion &&
        matchesPublic
      )
    })

    setFilteredOrganizations(filtered)
  }, [searchTerm, filters, organizations])

  const handleBackToDashboard = () => {
    router.push("/dashboard")
  }

  const handleFilterChange = <K extends keyof SearchFilters>(filterType: K, value: FilterValue<K>) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const handleArrayFilterChange = (filterType: keyof SearchFilters, value: string, checked: boolean) => {
    setFilters((prev) => {
      const currentArray = prev[filterType] as string[]
      if (checked) {
        return {
          ...prev,
          [filterType]: [...currentArray, value],
        }
      } else {
        return {
          ...prev,
          [filterType]: currentArray.filter((item) => item !== value),
        }
      }
    })
  }

  const clearFilters = () => {
    setFilters({
      industry: [],
      organizationType: [],
      employeeCount: [],
      status: [],
      country: [],
      completionRange: [0, 100],
      isPublic: null,
    })
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.industry.length > 0) count++
    if (filters.organizationType.length > 0) count++
    if (filters.employeeCount.length > 0) count++
    if (filters.status.length > 0) count++
    if (filters.country.length > 0) count++
    if (filters.completionRange[0] > 0 || filters.completionRange[1] < 100) count++
    if (filters.isPublic !== null) count++
    return count
  }

  const handleViewOrganization = (id: string) => {
    router.push(`/organization/${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" onClick={handleBackToDashboard} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Search className="h-8 w-8" />
                Search Organizations
              </h1>
              <p className="text-gray-600 mt-2">
                Find and discover organizations across different industries and regions
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block w-80 space-y-6`}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  <div className="flex items-center gap-2">
                    {getActiveFilterCount() > 0 && <Badge variant="secondary">{getActiveFilterCount()}</Badge>}
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Industry Filter */}
                <div>
                  <Label className="text-sm font-medium">Industry</Label>
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                    {industries.map((industry) => (
                      <div key={industry} className="flex items-center space-x-2">
                        <Checkbox
                          id={`industry-${industry}`}
                          checked={filters.industry.includes(industry)}
                          onCheckedChange={(checked) =>
                            handleArrayFilterChange("industry", industry, checked as boolean)
                          }
                        />
                        <Label htmlFor={`industry-${industry}`} className="text-sm">
                          {industry}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Organization Type Filter */}
                <div>
                  <Label className="text-sm font-medium">Organization Type</Label>
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                    {organizationTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={filters.organizationType.includes(type)}
                          onCheckedChange={(checked) =>
                            handleArrayFilterChange("organizationType", type, checked as boolean)
                          }
                        />
                        <Label htmlFor={`type-${type}`} className="text-sm">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Employee Count Filter */}
                <div>
                  <Label className="text-sm font-medium">Employee Count</Label>
                  <div className="mt-2 space-y-2">
                    {employeeCounts.map((count) => (
                      <div key={count} className="flex items-center space-x-2">
                        <Checkbox
                          id={`count-${count}`}
                          checked={filters.employeeCount.includes(count)}
                          onCheckedChange={(checked) =>
                            handleArrayFilterChange("employeeCount", count, checked as boolean)
                          }
                        />
                        <Label htmlFor={`count-${count}`} className="text-sm">
                          {count}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-2 space-y-2">
                    {statuses.map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={filters.status.includes(status)}
                          onCheckedChange={(checked) => handleArrayFilterChange("status", status, checked as boolean)}
                        />
                        <Label htmlFor={`status-${status}`} className="text-sm capitalize">
                          {status}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Country Filter */}
                <div>
                  <Label className="text-sm font-medium">Country</Label>
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                    {countries.map((country) => (
                      <div key={country} className="flex items-center space-x-2">
                        <Checkbox
                          id={`country-${country}`}
                          checked={filters.country.includes(country)}
                          onCheckedChange={(checked) => handleArrayFilterChange("country", country, checked as boolean)}
                        />
                        <Label htmlFor={`country-${country}`} className="text-sm">
                          {country}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Completion Range Filter */}
                <div>
                  <Label className="text-sm font-medium">
                    Profile Completion ({filters.completionRange[0]}% - {filters.completionRange[1]}%)
                  </Label>
                  <div className="mt-2">
                    <Slider
                      value={filters.completionRange}
                      onValueChange={(value) =>
                        handleFilterChange("completionRange", value as [number, number])
                      }
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Public Profile Filter */}
                <div>
                  <Label className="text-sm font-medium">Profile Visibility</Label>
                  <Select
                    value={filters.isPublic === null ? "all" : filters.isPublic.toString()}
                    onValueChange={(value) => handleFilterChange("isPublic", value === "all" ? null : value === "true")}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Public</SelectItem>
                      <SelectItem value="false">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Search Bar */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search organizations by name, description, or industry..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {getActiveFilterCount() > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {getActiveFilterCount()}
                      </Badge>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {filteredOrganizations.length} organization{filteredOrganizations.length !== 1 ? "s" : ""} found
                </h2>
                {searchTerm && <p className="text-sm text-gray-600">Results for &quot;{searchTerm}&quot;</p>}
              </div>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Sort by Relevance</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="created">Sort by Created Date</SelectItem>
                  <SelectItem value="updated">Sort by Last Updated</SelectItem>
                  <SelectItem value="completion">Sort by Completion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredOrganizations.map((org) => (
                <Card key={org.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={org.logo || "/placeholder.svg"} alt={org.name} />
                          <AvatarFallback>{org.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{org.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <span>{org.industry}</span>
                            <span>•</span>
                            <span>{org.organizationType}</span>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            org.status === "active" ? "default" : org.status === "pending" ? "secondary" : "destructive"
                          }
                        >
                          {org.status}
                        </Badge>
                        {!org.isPublic && <Badge variant="outline">Private</Badge>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 line-clamp-2">{org.description}</p>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span>{org.country}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 text-gray-400" />
                          <span>{org.employeeCount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3 w-3 text-gray-400" />
                          <span>{org.members} members</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span>Updated {new Date(org.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Profile Completion</span>
                          <span>{org.completionPercentage}%</span>
                        </div>
                        <Progress value={org.completionPercentage} />
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleViewOrganization(org.id)}>
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredOrganizations.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No organizations found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search terms or filters to find what you&apos;re looking for.
                    </p>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
