// src/organization-templates.tsx
"use client"

import type React from "react"

import { useState } from "react"
import {
  Building2,
  Plus,
  ArrowLeft,
  Zap,
  Heart,
  GraduationCap,
  Briefcase,
  Factory,
  ShoppingCart,
  Users,
  Home,
  Gamepad2,
  Star,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Template {
  id: string
  name: string
  description: string
  industry: string
  icon: React.ReactNode
  color: string
  features: string[]
  popularity: "high" | "medium" | "low"
  estimatedTime: string
  prefilledFields: {
    organizationType: string
    industry: string
    employeeCount: string
    timeZone: string
    languages: string[]
    isPublic: boolean
    allowContact: boolean
  }
}

const templates: Template[] = [
  {
    id: "tech-startup",
    name: "Tech Startup",
    description: "Perfect for technology startups and software companies",
    industry: "Technology",
    icon: <Zap className="h-6 w-6" />,
    color: "bg-blue-500",
    features: ["Remote-first settings", "Agile workflows", "Developer tools integration", "Investor relations"],
    popularity: "high",
    estimatedTime: "5 minutes",
    prefilledFields: {
      organizationType: "Startup",
      industry: "Technology",
      employeeCount: "1-10",
      timeZone: "UTC-8",
      languages: ["English"],
      isPublic: true,
      allowContact: true,
    },
  },
  {
    id: "healthcare",
    name: "Healthcare Provider",
    description: "Designed for hospitals, clinics, and medical practices",
    industry: "Healthcare",
    icon: <Heart className="h-6 w-6" />,
    color: "bg-red-500",
    features: ["HIPAA compliance", "Patient management", "Medical certifications", "Emergency contacts"],
    popularity: "high",
    estimatedTime: "8 minutes",
    prefilledFields: {
      organizationType: "Healthcare",
      industry: "Healthcare",
      employeeCount: "51-200",
      timeZone: "UTC-5",
      languages: ["English", "Spanish"],
      isPublic: false,
      allowContact: true,
    },
  },
  {
    id: "education",
    name: "Educational Institution",
    description: "Ideal for schools, universities, and training centers",
    industry: "Education",
    icon: <GraduationCap className="h-6 w-6" />,
    color: "bg-green-500",
    features: ["Student management", "Course catalogs", "Academic calendar", "Faculty directory"],
    popularity: "medium",
    estimatedTime: "7 minutes",
    prefilledFields: {
      organizationType: "Educational",
      industry: "Education",
      employeeCount: "201-500",
      timeZone: "UTC-5",
      languages: ["English"],
      isPublic: true,
      allowContact: true,
    },
  },
  {
    id: "consulting",
    name: "Consulting Firm",
    description: "Tailored for professional services and consulting businesses",
    industry: "Consulting",
    icon: <Briefcase className="h-6 w-6" />,
    color: "bg-purple-500",
    features: ["Client management", "Project tracking", "Expertise showcase", "Case studies"],
    popularity: "medium",
    estimatedTime: "6 minutes",
    prefilledFields: {
      organizationType: "Partnership",
      industry: "Consulting",
      employeeCount: "11-50",
      timeZone: "UTC-5",
      languages: ["English"],
      isPublic: true,
      allowContact: true,
    },
  },
  {
    id: "manufacturing",
    name: "Manufacturing Company",
    description: "Built for manufacturing and industrial organizations",
    industry: "Manufacturing",
    icon: <Factory className="h-6 w-6" />,
    color: "bg-orange-500",
    features: ["Supply chain management", "Quality control", "Safety protocols", "Production tracking"],
    popularity: "medium",
    estimatedTime: "10 minutes",
    prefilledFields: {
      organizationType: "Corporation",
      industry: "Manufacturing",
      employeeCount: "501-1000",
      timeZone: "UTC-5",
      languages: ["English"],
      isPublic: false,
      allowContact: true,
    },
  },
  {
    id: "retail",
    name: "Retail Business",
    description: "Perfect for retail stores and e-commerce businesses",
    industry: "Retail",
    icon: <ShoppingCart className="h-6 w-6" />,
    color: "bg-pink-500",
    features: ["Inventory management", "Customer service", "Sales tracking", "Marketing tools"],
    popularity: "high",
    estimatedTime: "6 minutes",
    prefilledFields: {
      organizationType: "LLC",
      industry: "Retail",
      employeeCount: "11-50",
      timeZone: "UTC-5",
      languages: ["English", "Spanish"],
      isPublic: true,
      allowContact: true,
    },
  },
  {
    id: "nonprofit",
    name: "Non-Profit Organization",
    description: "Designed for charities and non-profit organizations",
    industry: "Non-Profit",
    icon: <Users className="h-6 w-6" />,
    color: "bg-teal-500",
    features: ["Donor management", "Volunteer coordination", "Grant tracking", "Impact reporting"],
    popularity: "medium",
    estimatedTime: "8 minutes",
    prefilledFields: {
      organizationType: "Non-Profit",
      industry: "Non-Profit",
      employeeCount: "11-50",
      timeZone: "UTC-5",
      languages: ["English"],
      isPublic: true,
      allowContact: true,
    },
  },
  {
    id: "real-estate",
    name: "Real Estate Agency",
    description: "Optimized for real estate agencies and property management",
    industry: "Real Estate",
    icon: <Home className="h-6 w-6" />,
    color: "bg-indigo-500",
    features: ["Property listings", "Client management", "Market analysis", "Transaction tracking"],
    popularity: "low",
    estimatedTime: "7 minutes",
    prefilledFields: {
      organizationType: "LLC",
      industry: "Real Estate",
      employeeCount: "1-10",
      timeZone: "UTC-5",
      languages: ["English"],
      isPublic: true,
      allowContact: true,
    },
  },
  {
    id: "entertainment",
    name: "Entertainment Company",
    description: "For media, entertainment, and creative organizations",
    industry: "Entertainment",
    icon: <Gamepad2 className="h-6 w-6" />,
    color: "bg-yellow-500",
    features: ["Content management", "Talent roster", "Event planning", "Media distribution"],
    popularity: "low",
    estimatedTime: "6 minutes",
    prefilledFields: {
      organizationType: "Corporation",
      industry: "Entertainment",
      employeeCount: "51-200",
      timeZone: "UTC-8",
      languages: ["English"],
      isPublic: true,
      allowContact: true,
    },
  },
]

export default function OrganizationTemplates() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  const handleBackToDashboard = () => {
    router.push("/dashboard")
  }

  const handleUseTemplate = (template: Template) => {
    // Store template data in localStorage for the creation form
    localStorage.setItem("selectedTemplate", JSON.stringify(template))

    toast({
      title: "Template Selected",
      description: `Using ${template.name} template. Redirecting to creation form...`,
    })

    // Redirect to creation form with template
    router.push("/?template=" + template.id)
  }

  const handleCreateFromScratch = () => {
    router.push("/")
  }

  const getPopularityBadge = (popularity: Template["popularity"]) => {
    switch (popularity) {
      case "high":
        return <Badge className="bg-green-100 text-green-800">Popular</Badge>
      case "medium":
        return <Badge variant="secondary">Trending</Badge>
      case "low":
        return <Badge variant="outline">New</Badge>
    }
  }

  const getPopularityIcon = (popularity: Template["popularity"]) => {
    switch (popularity) {
      case "high":
        return <Star className="h-4 w-4 text-yellow-500 fill-current" />
      case "medium":
        return <Star className="h-4 w-4 text-yellow-500" />
      case "low":
        return null
    }
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
                <Building2 className="h-8 w-8" />
                Organization Templates
              </h1>
              <p className="text-gray-600 mt-2">
                Choose from pre-configured templates to quickly set up your organization
              </p>
            </div>
            <Button variant="outline" onClick={handleCreateFromScratch}>
              <Plus className="h-4 w-4 mr-2" />
              Start from Scratch
            </Button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => setSelectedTemplate(template)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${template.color} text-white`}>{template.icon}</div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                        {template.name}
                      </CardTitle>
                      <CardDescription className="text-sm">{template.industry}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPopularityIcon(template.popularity)}
                    {getPopularityBadge(template.popularity)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{template.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{template.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{template.features.length} features</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Included Features:</h4>
                    <div className="space-y-1">
                      {template.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {template.features.length > 3 && (
                        <div className="text-xs text-gray-500">+{template.features.length - 3} more features</div>
                      )}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUseTemplate(template)
                    }}
                  >
                    Use This Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Template Details Modal */}
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${selectedTemplate.color} text-white`}>{selectedTemplate.icon}</div>
                    <div>
                      <CardTitle className="text-xl">{selectedTemplate.name}</CardTitle>
                      <CardDescription>{selectedTemplate.industry}</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedTemplate(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600">{selectedTemplate.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Setup time: {selectedTemplate.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPopularityIcon(selectedTemplate.popularity)}
                    {getPopularityBadge(selectedTemplate.popularity)}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">All Features Included:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedTemplate.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Pre-configured Settings:</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    <div>
                      <strong>Organization Type:</strong> {selectedTemplate.prefilledFields.organizationType}
                    </div>
                    <div>
                      <strong>Industry:</strong> {selectedTemplate.prefilledFields.industry}
                    </div>
                    <div>
                      <strong>Employee Count:</strong> {selectedTemplate.prefilledFields.employeeCount}
                    </div>
                    <div>
                      <strong>Time Zone:</strong> {selectedTemplate.prefilledFields.timeZone}
                    </div>
                    <div>
                      <strong>Languages:</strong> {selectedTemplate.prefilledFields.languages.join(", ")}
                    </div>
                    <div>
                      <strong>Public Profile:</strong> {selectedTemplate.prefilledFields.isPublic ? "Yes" : "No"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1" onClick={() => handleUseTemplate(selectedTemplate)}>
                    Use This Template
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
