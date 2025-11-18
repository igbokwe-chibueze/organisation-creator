// src/organization-update.tsx
"use client"

import type React from "react"

import { useState, useRef, useEffect, type DragEvent, type ChangeEvent } from "react"
import {
  X,
  ImageIcon,
  Building2,
  Mail,
  Phone,
  Loader2,
  CheckCircle2,
  Users,
  Calendar,
  FileText,
  Link,
  Save,
  RotateCcw,
  Eye,
  ArrowLeft,
  Home,
  Edit3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface OrganizationData {
  // Basic Information (from creation form)
  name: string | null
  description: string | null
  email: string | null
  phone: string | null
  country: string | null
  address: string | null
  logo: File | null

  // Additional Information
  website: string | null
  foundedYear: string | null
  organizationType: string | null
  industry: string | null
  employeeCount: string | null
  annualRevenue: string | null

  // Contact Details
  alternateEmail: string | null
  fax: string | null
  linkedinUrl: string | null
  twitterUrl: string | null
  facebookUrl: string | null

  // Business Details
  taxId: string | null
  registrationNumber: string | null
  businessLicense: string | null

  // Operational Information
  operatingHours: string | null
  timeZone: string | null
  languages: string[]
  services: string

  // Settings
  isPublic: boolean
  allowContact: boolean
  showRevenue: boolean
  newsletterOptIn: boolean
}

// const countries = [
//   "United States",
//   "Canada",
//   "United Kingdom",
//   "Germany",
//   "France",
//   "Australia",
//   "Japan",
//   "Brazil",
//   "India",
//   "Other",
// ]

const organizationTypes = [
  "Corporation",
  "LLC",
  "Partnership",
  "Non-Profit",
  "Government",
  "Educational",
  "Healthcare",
  "Startup",
  "Other",
]

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Real Estate",
  "Entertainment",
  "Other",
]

const employeeCounts = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]

const revenueRanges = ["Under $100K", "$100K - $500K", "$500K - $1M", "$1M - $5M", "$5M - $10M", "$10M - $50M", "$50M+"]

const timeZones = [
  "UTC-12",
  "UTC-11",
  "UTC-10",
  "UTC-9",
  "UTC-8",
  "UTC-7",
  "UTC-6",
  "UTC-5",
  "UTC-4",
  "UTC-3",
  "UTC-2",
  "UTC-1",
  "UTC+0",
  "UTC+1",
  "UTC+2",
  "UTC+3",
  "UTC+4",
  "UTC+5",
  "UTC+6",
  "UTC+7",
  "UTC+8",
  "UTC+9",
  "UTC+10",
  "UTC+11",
  "UTC+12",
]

const availableLanguages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Portuguese",
  "Russian",
  "Arabic",
  "Hindi",
  "Other",
]

type FormErrors = {
  [K in keyof OrganizationData]?: string;
};


export default function OrganizationUpdate() {
  const router = useRouter()
  const [formData, setFormData] = useState<OrganizationData | null>(null)
  const [originalData, setOriginalData] = useState<OrganizationData | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  //const [errors, setErrors] = useState<Partial<OrganizationData>>({})
  const [errors, setErrors] = useState<FormErrors>({})

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modifiedFields, setModifiedFields] = useState<Set<string>>(new Set())
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Helper function to check if a field has valid content
  const isFieldFilled = (field: keyof OrganizationData): boolean => {
    if (!formData) return false
    const value = formData[field]

    if (Array.isArray(value)) return value.length > 0
    if (typeof value === "boolean") return true
    if (field === "logo") return formData.logo !== null || logoPreview !== null
    return typeof value === "string" && value.trim().length > 0
  }

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem("organizationData")
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        const initialData: OrganizationData = {
          // Basic info from creation form
          name: parsedData.name || "",
          description: parsedData.description || "",
          email: parsedData.email || "",
          phone: parsedData.phone || "",
          country: parsedData.country || "",
          address: parsedData.address || "",
          logo: null, // Will be handled separately

          // Additional fields (empty by default)
          website: "",
          foundedYear: "",
          organizationType: "",
          industry: "",
          employeeCount: "",
          annualRevenue: "",
          alternateEmail: "",
          fax: "",
          linkedinUrl: "",
          twitterUrl: "",
          facebookUrl: "",
          taxId: "",
          registrationNumber: "",
          businessLicense: "",
          operatingHours: "",
          timeZone: "",
          languages: [],
          services: "",
          isPublic: true,
          allowContact: true,
          showRevenue: false,
          newsletterOptIn: false,
        }

        // Handle logo separately
        if (parsedData.logo && parsedData.logo.dataUrl) {
          setLogoPreview(parsedData.logo.dataUrl)
          // Create a virtual file object for consistency
          initialData.logo = {
            name: parsedData.logo.name,
            size: parsedData.logo.size,
            type: parsedData.logo.type,
          } as File
        }

        setFormData(initialData)
        setOriginalData(initialData)
      } catch (error) {
        console.error("Error parsing stored data:", error)
        router.push("/")
      }
    } else {
      router.push("/")
    }
  }, [router])

  // Track field modifications
  useEffect(() => {
    if (!formData || !originalData) return

    const modified = new Set<string>()
    Object.keys(formData).forEach((key) => {
      const typedKey = key as keyof OrganizationData
      if (Array.isArray(formData[typedKey])) {
        if (JSON.stringify(formData[typedKey]) !== JSON.stringify(originalData[typedKey])) {
          modified.add(key)
        }
      } else if (formData[typedKey] !== originalData[typedKey]) {
        modified.add(key)
      }
    })
    setModifiedFields(modified)
  }, [formData, originalData])

  const handleInputChange = (field: keyof OrganizationData, value: string | boolean | string[]) => {
    if (!formData) return
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleLanguageToggle = (language: string) => {
    if (!formData) return
    const currentLanguages = formData.languages
    const newLanguages = currentLanguages.includes(language)
      ? currentLanguages.filter((l) => l !== language)
      : [...currentLanguages, language]

    handleInputChange("languages", newLanguages)
  }

  const handleLogoSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, logo: "File size must be less than 5MB" }))
        return
      }

      setFormData((prev) => (prev ? { ...prev, logo: file } : null))
      const url = URL.createObjectURL(file)
      setLogoPreview(url)
      setErrors((prev) => ({ ...prev, logo: undefined }))
    } else {
      setErrors((prev) => ({ ...prev, logo: "Please select a valid image file" }))
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleLogoSelect(file)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleLogoSelect(files[0])
    }
  }

  const handleRemoveLogo = () => {
    setFormData((prev) => (prev ? { ...prev, logo: null } : null))
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview)
      setLogoPreview(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleLogoClick = () => {
    fileInputRef.current?.click()
  }

  const resetForm = () => {
    if (!originalData) return
    setFormData(originalData)
    setErrors({})

    // Reset logo to original state
    const storedData = localStorage.getItem("organizationData")
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        if (parsedData.logo && parsedData.logo.dataUrl) {
          setLogoPreview(parsedData.logo.dataUrl)
        } else {
          setLogoPreview(null)
        }
      } catch (error) {
        console.error(error);
        setLogoPreview(null)
      }
    }

    toast({
      title: "Form Reset",
      description: "All changes have been reverted to the original values.",
    })
  }

  const getModifiedData = (): Partial<OrganizationData> => {
    if (!formData) return {}

    const modified: Partial<OrganizationData> = {}

    modifiedFields.forEach((field) => {
      const key = field as keyof OrganizationData
      modified[key] = formData[key]
    })

    return modified
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (modifiedFields.size === 0) {
      toast({
        title: "No Changes Detected",
        description: "Please modify at least one field before saving.",
        //variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const modifiedData = getModifiedData()

      // Simulate API call with only modified fields
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Sending only modified fields:", modifiedData)
      console.log("Modified field count:", modifiedFields.size)

      // Update original data to reflect saved state
      if (formData) {
        setOriginalData(formData)
      }

      toast({
        title: "Organization Updated Successfully!",
        description: `${modifiedFields.size} field(s) have been updated.`,
        duration: 5000,
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating your organization. Please try again.",
        //variant: "destructive",
        duration: 5000,
      })
      console.error("Update error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCompletionPercentage = () => {
    if (!formData) return 0
    const totalFields = Object.keys(formData).length
    const completedFields = Object.values(formData).filter((value) => {
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === "boolean") return true
      return value !== null && value !== ""
    }).length
    return Math.round((completedFields / totalFields) * 100)
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  // Show loading state while data is being loaded
  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading organization data...</p>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Navigation */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
              <button onClick={handleBackToHome} className="hover:text-gray-900 flex items-center gap-1">
                <Home className="h-4 w-4" />
                Organizations
              </button>
              <span>/</span>
              <span className="text-gray-900 font-medium">Update Profile</span>
            </nav>
            <Button variant="outline" onClick={handleBackToHome} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Creation Form
            </Button>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Building2 className="h-8 w-8" />
              Update Organization Profile
            </h1>
            <p className="text-gray-600 mt-2">
              Complete your organization profile with additional information. Only modified fields will be saved.
            </p>
          </div>

          {/* Progress Summary */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Profile Completion</h3>
                  <p className="text-sm text-gray-600">{getCompletionPercentage()}% complete</p>
                </div>
                <div className="flex items-center gap-4">
                  {modifiedFields.size > 0 && (
                    <Badge variant="secondary" className="animate-pulse">
                      {modifiedFields.size} unsaved change{modifiedFields.size !== 1 ? "s" : ""}
                    </Badge>
                  )}
                  <Button variant="outline" size="sm" onClick={resetForm} disabled={isSubmitting}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
              <Progress value={getCompletionPercentage()} className="h-2" />
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>Core organization details from your initial setup</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label>Organization Logo</Label>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-300 ${
                      isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                    } ${
                      isDragOver
                        ? "border-primary bg-primary/5"
                        : logoPreview || formData.logo
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={isSubmitting ? undefined : handleLogoClick}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {logoPreview ? (
                      <div className="space-y-3">
                        <div className="relative mx-auto w-32 h-32">
                          <Image
                            src={logoPreview || "/placeholder.svg"}
                            alt="Organization logo"
                            fill
                            className="object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveLogo()
                            }}
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          {modifiedFields.has("logo") ? (
                            <div className="absolute -bottom-2 -right-2 h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <Edit3 className="h-3 w-3 text-white" />
                            </div>
                          ) : (
                            <div className="absolute -bottom-2 -right-2 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle2 className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-green-600">Logo uploaded successfully</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-3">
                        <ImageIcon className="mx-auto w-12 h-12 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">Upload organization logo</p>
                          <p className="text-xs text-gray-500">PNG, JPG, SVG up to 5MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Organization Name *</Label>
                    <div className="relative">
                      <Input
                        id="name"
                        value={formData.name ?? ""}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={`${
                          modifiedFields.has("name")
                            ? "border-blue-500"
                            : isFieldFilled("name")
                              ? "border-green-500"
                              : ""
                        }`}
                        disabled={isSubmitting}
                      />
                      {modifiedFields.has("name") ? (
                        <Edit3 className="absolute right-3 top-3 h-4 w-4 text-blue-500" />
                      ) : isFieldFilled("name") ? (
                        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <Link className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                        placeholder="https://www.example.com"
                        className={`pl-10 ${
                          modifiedFields.has("website")
                            ? "border-blue-500"
                            : isFieldFilled("website")
                              ? "border-green-500"
                              : ""
                        }`}
                        disabled={isSubmitting}
                      />
                      {modifiedFields.has("website") ? (
                        <Edit3 className="absolute right-3 top-3 h-4 w-4 text-blue-500" />
                      ) : isFieldFilled("website") ? (
                        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <div className="relative">
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={3}
                        className={`${
                          modifiedFields.has("description")
                            ? "border-blue-500"
                            : isFieldFilled("description")
                              ? "border-green-500"
                              : ""
                        }`}
                        disabled={isSubmitting}
                      />
                      {modifiedFields.has("description") ? (
                        <Edit3 className="absolute right-3 top-3 h-4 w-4 text-blue-500" />
                      ) : isFieldFilled("description") ? (
                        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Business Details
                </CardTitle>
                <CardDescription>Organization type, industry, and business information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizationType">Organization Type</Label>
                    <div className="relative">
                      <Select
                        value={formData.organizationType}
                        onValueChange={(value) => handleInputChange("organizationType", value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger
                          className={`${
                            modifiedFields.has("organizationType")
                              ? "border-blue-500"
                              : isFieldFilled("organizationType")
                                ? "border-green-500"
                                : ""
                          }`}
                        >
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizationTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {modifiedFields.has("organizationType") ? (
                        <Edit3 className="absolute right-8 top-3 h-4 w-4 text-blue-500" />
                      ) : isFieldFilled("organizationType") ? (
                        <CheckCircle2 className="absolute right-8 top-3 h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <div className="relative">
                      <Select
                        value={formData.industry}
                        onValueChange={(value) => handleInputChange("industry", value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger
                          className={`${
                            modifiedFields.has("industry")
                              ? "border-blue-500"
                              : isFieldFilled("industry")
                                ? "border-green-500"
                                : ""
                          }`}
                        >
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {modifiedFields.has("industry") ? (
                        <Edit3 className="absolute right-8 top-3 h-4 w-4 text-blue-500" />
                      ) : isFieldFilled("industry") ? (
                        <CheckCircle2 className="absolute right-8 top-3 h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="foundedYear">Founded Year</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="foundedYear"
                        value={formData.foundedYear}
                        onChange={(e) => handleInputChange("foundedYear", e.target.value)}
                        placeholder="2020"
                        className={`pl-10 ${
                          modifiedFields.has("foundedYear")
                            ? "border-blue-500"
                            : isFieldFilled("foundedYear")
                              ? "border-green-500"
                              : ""
                        }`}
                        disabled={isSubmitting}
                      />
                      {modifiedFields.has("foundedYear") ? (
                        <Edit3 className="absolute right-3 top-3 h-4 w-4 text-blue-500" />
                      ) : isFieldFilled("foundedYear") ? (
                        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employeeCount">Employee Count</Label>
                    <div className="relative">
                      <Select
                        value={formData.employeeCount}
                        onValueChange={(value) => handleInputChange("employeeCount", value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger
                          className={`${
                            modifiedFields.has("employeeCount")
                              ? "border-blue-500"
                              : isFieldFilled("employeeCount")
                                ? "border-green-500"
                                : ""
                          }`}
                        >
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          {employeeCounts.map((count) => (
                            <SelectItem key={count} value={count}>
                              {count}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {modifiedFields.has("employeeCount") ? (
                        <Edit3 className="absolute right-8 top-3 h-4 w-4 text-blue-500" />
                      ) : isFieldFilled("employeeCount") ? (
                        <CheckCircle2 className="absolute right-8 top-3 h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="annualRevenue">Annual Revenue</Label>
                    <div className="relative">
                      <Select
                        value={formData.annualRevenue}
                        onValueChange={(value) => handleInputChange("annualRevenue", value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger
                          className={`${
                            modifiedFields.has("annualRevenue")
                              ? "border-blue-500"
                              : isFieldFilled("annualRevenue")
                                ? "border-green-500"
                                : ""
                          }`}
                        >
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          {revenueRanges.map((range) => (
                            <SelectItem key={range} value={range}>
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {modifiedFields.has("annualRevenue") ? (
                        <Edit3 className="absolute right-8 top-3 h-4 w-4 text-blue-500" />
                      ) : isFieldFilled("annualRevenue") ? (
                        <CheckCircle2 className="absolute right-8 top-3 h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeZone">Time Zone</Label>
                    <div className="relative">
                      <Select
                        value={formData.timeZone}
                        onValueChange={(value) => handleInputChange("timeZone", value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger
                          className={`${
                            modifiedFields.has("timeZone")
                              ? "border-blue-500"
                              : isFieldFilled("timeZone")
                                ? "border-green-500"
                                : ""
                          }`}
                        >
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeZones.map((tz) => (
                            <SelectItem key={tz} value={tz}>
                              {tz}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {modifiedFields.has("timeZone") ? (
                        <Edit3 className="absolute right-8 top-3 h-4 w-4 text-blue-500" />
                      ) : isFieldFilled("timeZone") ? (
                        <CheckCircle2 className="absolute right-8 top-3 h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID</Label>
                    <div className="relative">
                      <Input
                        id="taxId"
                        value={formData.taxId}
                        onChange={(e) => handleInputChange("taxId", e.target.value)}
                        placeholder="XX-XXXXXXX"
                        className={`${
                          modifiedFields.has("taxId")
                            ? "border-blue-500"
                            : isFieldFilled("taxId")
                              ? "border-green-500"
                              : ""
                        }`}
                        disabled={isSubmitting}
                      />
                      {modifiedFields.has("taxId") ? (
                        <Edit3 className="absolute right-3 top-3 h-4 w-4 text-blue-500" />
                      ) : isFieldFilled("taxId") ? (
                        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">Registration Number</Label>
                    <div className="relative">
                      <Input
                        id="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                        className={`${
                          modifiedFields.has("registrationNumber")
                            ? "border-blue-500"
                            : isFieldFilled("registrationNumber")
                              ? "border-green-500"
                              : ""
                        }`}
                        disabled={isSubmitting}
                      />
                      {modifiedFields.has("registrationNumber") ? (
                        <Edit3 className="absolute right-3 top-3 h-4 w-4 text-blue-500" />
                      ) : isFieldFilled("registrationNumber") ? (
                        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessLicense">Business License</Label>
                    <div className="relative">
                      <Input
                        id="businessLicense"
                        value={formData.businessLicense}
                        onChange={(e) => handleInputChange("businessLicense", e.target.value)}
                        className={`${
                          modifiedFields.has("businessLicense")
                            ? "border-blue-500"
                            : isFieldFilled("businessLicense")
                              ? "border-green-500"
                              : ""
                        }`}
                        disabled={isSubmitting}
                      />
                      {modifiedFields.has("businessLicense") ? (
                        <Edit3 className="absolute right-3 top-3 h-4 w-4 text-blue-500" />
                      ) : isFieldFilled("businessLicense") ? (
                        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>Additional contact details and social media</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Primary Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`pl-10 ${
                          modifiedFields.has("email")
                            ? "border-blue-500"
                            : isFieldFilled("email")
                              ? "border-green-500"
                              : ""
                        }`}
                        disabled={isSubmitting}
                      />
                      {modifiedFields.has("email") ? (
                        <Edit3 className="absolute right-3 top-3 h-4 w-4 text-blue-500" />
                      ) : isFieldFilled("email") ? (
                        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alternateEmail">Alternate Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="alternateEmail"
                        type="email"
                        value={formData.alternateEmail}
                        onChange={(e) => handleInputChange("alternateEmail", e.target.value)}
                        placeholder="alternate@example.com"
                        className={`pl-10 ${
                          modifiedFields.has("alternateEmail")
                            ? "border-blue-500"
                            : isFieldFilled("alternateEmail")
                              ? "border-green-500"
                              : ""
                        }`}
                        disabled={isSubmitting}
                      />
                      {modifiedFields.has("alternateEmail") ? (
                        <Edit3 className="absolute right-3 top-3 h-4 w-4 text-blue-500" />
                      ) : isFieldFilled("alternateEmail") ? (
                        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className={`pl-10 ${
                          modifiedFields.has("phone")
                            ? "border-blue-500"
                            : isFieldFilled("phone")
                              ? "border-green-500"
                              : ""
                        }`}
                        disabled={isSubmitting}
                      />
                      {modifiedFields.has("phone") ? (
                        <Edit3 className="absolute right-3 top-3 h-4 w-4 text-blue-500" />
                      ) : isFieldFilled("phone") ? (
                        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fax">Fax</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="fax"
                        value={formData.fax}
                        onChange={(e) => handleInputChange("fax", e.target.value)}
                        placeholder="+1 (555) 123-4568"
                        className={`pl-10 ${
                          modifiedFields.has("fax") ? "border-blue-500" : isFieldFilled("fax") ? "border-green-500" : ""
                        }`}
                        disabled={isSubmitting}
                      />
                      {modifiedFields.has("fax") ? (
                        <Edit3 className="absolute right-3 top-3 h-4 w-4 text-blue-500" />
                      ) : isFieldFilled("fax") ? (
                        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Social Media Links</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedinUrl">LinkedIn</Label>
                      <div className="relative">
                        <Link className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="linkedinUrl"
                          value={formData.linkedinUrl}
                          onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                          placeholder="https://linkedin.com/company/..."
                          className={`pl-10 ${
                            modifiedFields.has("linkedinUrl")
                              ? "border-blue-500"
                              : isFieldFilled("linkedinUrl")
                                ? "border-green-500"
                                : ""
                          }`}
                          disabled={isSubmitting}
                        />
                        {modifiedFields.has("linkedinUrl") ? (
                          <Edit3 className="absolute right-3 top-3 h-4 w-4 text-blue-500" />
                        ) : isFieldFilled("linkedinUrl") ? (
                          <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                        ) : null}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twitterUrl">Twitter</Label>
                      <div className="relative">
                        <Link className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="twitterUrl"
                          value={formData.twitterUrl}
                          onChange={(e) => handleInputChange("twitterUrl", e.target.value)}
                          placeholder="https://twitter.com/..."
                          className={`pl-10 ${
                            modifiedFields.has("twitterUrl")
                              ? "border-blue-500"
                              : isFieldFilled("twitterUrl")
                                ? "border-green-500"
                                : ""
                          }`}
                          disabled={isSubmitting}
                        />
                        {modifiedFields.has("twitterUrl") ? (
                          <Edit3 className="absolute right-3 top-3 h-4 w-4 text-blue-500" />
                        ) : isFieldFilled("twitterUrl") ? (
                          <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                        ) : null}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="facebookUrl">Facebook</Label>
                      <div className="relative">
                        <Link className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="facebookUrl"
                          value={formData.facebookUrl}
                          onChange={(e) => handleInputChange("facebookUrl", e.target.value)}
                          placeholder="https://facebook.com/..."
                          className={`pl-10 ${
                            modifiedFields.has("facebookUrl")
                              ? "border-blue-500"
                              : isFieldFilled("facebookUrl")
                                ? "border-green-500"
                                : ""
                          }`}
                          disabled={isSubmitting}
                        />
                        {modifiedFields.has("facebookUrl") ? (
                          <Edit3 className="absolute right-3 top-3 h-4 w-4 text-blue-500" />
                        ) : isFieldFilled("facebookUrl") ? (
                          <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Operational Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Operational Information
                </CardTitle>
                <CardDescription>Services, languages, and operational details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="services">Services Offered</Label>
                  <div className="relative">
                    <Textarea
                      id="services"
                      value={formData.services}
                      onChange={(e) => handleInputChange("services", e.target.value)}
                      placeholder="Describe the services your organization offers..."
                      rows={3}
                      className={`${
                        modifiedFields.has("services")
                          ? "border-blue-500"
                          : isFieldFilled("services")
                            ? "border-green-500"
                            : ""
                      }`}
                      disabled={isSubmitting}
                    />
                    {modifiedFields.has("services") ? (
                      <Edit3 className="absolute right-3 top-3 h-4 w-4 text-blue-500" />
                    ) : isFieldFilled("services") ? (
                      <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operatingHours">Operating Hours</Label>
                  <div className="relative">
                    <Input
                      id="operatingHours"
                      value={formData.operatingHours}
                      onChange={(e) => handleInputChange("operatingHours", e.target.value)}
                      placeholder="Mon-Fri 9:00 AM - 5:00 PM"
                      className={`${
                        modifiedFields.has("operatingHours")
                          ? "border-blue-500"
                          : isFieldFilled("operatingHours")
                            ? "border-green-500"
                            : ""
                      }`}
                      disabled={isSubmitting}
                    />
                    {modifiedFields.has("operatingHours") ? (
                      <Edit3 className="absolute right-3 top-3 h-4 w-4 text-blue-500" />
                    ) : isFieldFilled("operatingHours") ? (
                      <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                    ) : null}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Languages Supported</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availableLanguages.map((language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`lang-${language}`}
                          checked={formData.languages.includes(language)}
                          onChange={() => handleLanguageToggle(language)}
                          className="rounded border-gray-300"
                          disabled={isSubmitting}
                        />
                        <Label htmlFor={`lang-${language}`} className="text-sm">
                          {language}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {modifiedFields.has("languages") && (
                    <p className="text-sm text-blue-600 flex items-center gap-1">
                      <Edit3 className="h-3 w-3" />
                      Languages selection has been modified
                    </p>
                  )}
                  {!modifiedFields.has("languages") && isFieldFilled("languages") && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {formData.languages.length} language{formData.languages.length !== 1 ? "s" : ""} selected
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Privacy & Settings
                </CardTitle>
                <CardDescription>Control how your organization information is displayed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Public Profile</Label>
                      <p className="text-sm text-gray-600">Make your organization profile visible to the public</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.isPublic}
                        onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
                        disabled={isSubmitting}
                      />
                      {modifiedFields.has("isPublic") && <Edit3 className="h-4 w-4 text-blue-500" />}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Contact</Label>
                      <p className="text-sm text-gray-600">Allow others to contact your organization</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.allowContact}
                        onCheckedChange={(checked) => handleInputChange("allowContact", checked)}
                        disabled={isSubmitting}
                      />
                      {modifiedFields.has("allowContact") && <Edit3 className="h-4 w-4 text-blue-500" />}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Revenue</Label>
                      <p className="text-sm text-gray-600">Display annual revenue information publicly</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.showRevenue}
                        onCheckedChange={(checked) => handleInputChange("showRevenue", checked)}
                        disabled={isSubmitting}
                      />
                      {modifiedFields.has("showRevenue") && <Edit3 className="h-4 w-4 text-blue-500" />}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Newsletter Subscription</Label>
                      <p className="text-sm text-gray-600">Receive updates and newsletters</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.newsletterOptIn}
                        onCheckedChange={(checked) => handleInputChange("newsletterOptIn", checked)}
                        disabled={isSubmitting}
                      />
                      {modifiedFields.has("newsletterOptIn") && <Edit3 className="h-4 w-4 text-blue-500" />}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {modifiedFields.size > 0 ? (
                      <span className="flex items-center gap-2">
                        <Edit3 className="h-4 w-4 text-blue-500" />
                        {modifiedFields.size} field{modifiedFields.size !== 1 ? "s" : ""} modified
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        No unsaved changes
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      disabled={isSubmitting || modifiedFields.size === 0}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset Changes
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || modifiedFields.size === 0}
                      className="min-w-[140px]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </TooltipProvider>
  )
}
