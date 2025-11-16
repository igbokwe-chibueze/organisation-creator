// src/organization-form.tsx
"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback, type DragEvent, type ChangeEvent } from "react"

import {
  Upload,
  X,
  ImageIcon,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Loader2,
  Check,
  Info,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface FormErrors {
  name?: string
  description?: string
  email?: string
  phone?: string
  country?: string
  address?: string
  logo?: string
}


interface FormData {
  name: string
  description: string
  email: string
  phone: string
  country: string
  address: string
  logo: File | null
}

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Australia",
  "Japan",
  "Brazil",
  "India",
  "Other",
]

const fieldTooltips = {
  name: "Enter your organization's official name (minimum 2 characters)",
  description: "Provide a brief description of your organization (minimum 10 characters)",
  email: "Enter a valid email address for contact purposes",
  phone: "Enter a valid phone number (minimum 10 characters)",
  country: "Select the country where your organization is based",
  address: "Enter your organization's complete address (minimum 10 characters)",
  logo: "Upload your organization's logo (PNG, JPG, SVG up to 5MB)",
}

export default function OrganizationForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    email: "",
    phone: "",
    country: "",
    address: "",
    logo: null,
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  //const [errors, setErrors] = useState<Partial<FormData>>({})
  const [errors, setErrors] = useState<FormErrors>({})

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessActions, setShowSuccessActions] = useState(false)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Calculate form completion progress
  const getFormProgress = () => {
    const fields = ["name", "description", "email", "phone", "country", "address", "logo"] as const
    const completedFields = fields.filter((field) => isFieldValid(field)).length
    return Math.round((completedFields / fields.length) * 100)
  }

  const getCompletedFieldsCount = () => {
    const fields = ["name", "description", "email", "phone", "country", "address", "logo"] as const
    return fields.filter((field) => isFieldValid(field)).length
  }

  const handleRemoveLogo = useCallback(() => {
    setFormData((prev) => ({ ...prev, logo: null }))
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview)
      setLogoPreview(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [logoPreview])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter to submit
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault()
        if (!isSubmitting) {
          const form = document.querySelector("form")
          if (form) {
            form.requestSubmit()
          }
        }
      }

      // Ctrl+R to reset form
      if ((e.ctrlKey || e.metaKey) && e.key === "r") {
        e.preventDefault()
        if (confirm("Are you sure you want to reset the form?")) {
          setFormData({
            name: "",
            description: "",
            email: "",
            phone: "",
            country: "",
            address: "",
            logo: null,
          })
          handleRemoveLogo()
          setErrors({})
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isSubmitting, handleRemoveLogo])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleLogoSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, logo: "File size must be less than 5MB" }))

        return
      }

      setFormData((prev) => ({ ...prev, logo: file }))
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

  const handleLogoClick = () => {
    fileInputRef.current?.click()
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormErrors> = {}

    if (!formData.name.trim()) newErrors.name = "Organization name is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.country) newErrors.country = "Please select a country"
    if (!formData.address.trim()) newErrors.address = "Address is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateField = (field: keyof FormData, value: string | File | null): string | undefined => {
    switch (field) {
      case "name":
        if (!value || (typeof value === "string" && !value.trim())) {
          return "Organization name is required"
        }
        if (typeof value === "string" && value.trim().length < 2) {
          return "Organization name must be at least 2 characters"
        }
        break

      case "description":
        if (!value || (typeof value === "string" && !value.trim())) {
          return "Description is required"
        }
        if (typeof value === "string" && value.trim().length < 10) {
          return "Description must be at least 10 characters"
        }
        break

      case "email":
        if (!value || (typeof value === "string" && !value.trim())) {
          return "Email is required"
        }
        if (typeof value === "string" && !/\S+@\S+\.\S+/.test(value)) {
          return "Please enter a valid email address"
        }
        break

      case "phone":
        if (!value || (typeof value === "string" && !value.trim())) {
          return "Phone number is required"
        }
        if (typeof value === "string" && value.trim().length < 10) {
          return "Please enter a valid phone number"
        }
        break

      case "country":
        if (!value || (typeof value === "string" && !value.trim())) {
          return "Please select a country"
        }
        break

      case "address":
        if (!value || (typeof value === "string" && !value.trim())) {
          return "Address is required"
        }
        if (typeof value === "string" && value.trim().length < 10) {
          return "Please enter a complete address"
        }
        break

      case "logo":
        // Logo validation is handled separately in handleLogoSelect
        break

      default:
        break
    }
    return undefined
  }

  const isFieldValid = (field: keyof FormData): boolean => {
    const value = field === "logo" ? formData.logo : formData[field]

    // Field must have content and no errors
    if (field === "logo") {
      return formData.logo !== null && !errors.logo
    }

    return typeof value === "string" && value.trim().length > 0 && !errors[field] && !validateField(field, value)
  }

  const handleFieldBlur = (field: keyof FormData) => {
    const value = field === "logo" ? formData.logo : formData[field]
    const error = validateField(field, value)

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      try {
        // Simulate API call - replace with actual API endpoint
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Here you would typically send the data to your API
        console.log("Form submitted:", formData)

        // Show success toast
        toast("Organization Created Successfully!",{
          description: `${formData.name} has been created and is ready to use.`,
          duration: 5000,
        })

        // Show success actions instead of resetting form
        setShowSuccessActions(true)
      } catch (error) {
        // Show error toast
        toast("Submission Failed",{
          description: "There was an error creating your organization. Please try again.",
          //variant: "destructive",
          duration: 5000,
        })
        console.error("Submission error:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleCompleteProfile = () => {
    // Store the created organization data in localStorage for the update page
    const dataToStore = {
      ...formData,
      logo: formData.logo
        ? {
            name: formData.logo.name,
            size: formData.logo.size,
            type: formData.logo.type,
            dataUrl: logoPreview, // This contains the base64 URL
          }
        : null,
    }
    localStorage.setItem("organizationData", JSON.stringify(dataToStore))
    router.push("/update")
  }

  const handleCreateAnother = () => {
    setFormData({
      name: "",
      description: "",
      email: "",
      phone: "",
      country: "",
      address: "",
      logo: null,
    })
    handleRemoveLogo()
    setErrors({})
    setShowSuccessActions(false)
  }

  const progress = getFormProgress()
  const completedFields = getCompletedFieldsCount()

  if (showSuccessActions) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-2xl mx-auto px-4">
            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <div className="space-y-6">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Organization Created Successfully!</h2>
                    <p className="text-gray-600">
                      {formData.name} has been created with the basic information. You can now complete your profile
                      with additional details.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={handleCompleteProfile} size="lg" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Complete Profile
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleCreateAnother} variant="outline" size="lg">
                      Create Another Organization
                    </Button>
                  </div>

                  <div className="text-sm text-gray-500">
                    <p>💡 Tip: Complete your profile to unlock additional features and improve discoverability</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Navigation */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Organizations</span>
              <span>/</span>
              <span className="text-gray-900 font-medium">Create New</span>
            </nav>
          </div>

          {/* Form Summary */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Form Progress</h3>
                  <span className="text-sm text-gray-600">{completedFields}/7 fields completed</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    <span>{completedFields} completed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-orange-500" />
                    <span>{7 - completedFields} remaining</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                Create Organization
              </CardTitle>
              <CardDescription>
                Set up your organization profile with logo and contact information
                <div className="mt-2 text-xs text-gray-500">
                  💡 Tip: Use <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+Enter</kbd> to submit,{" "}
                  <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+R</kbd> to reset
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Logo Upload Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="logo">Organization Logo</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{fieldTooltips.logo}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-300 ${
                      isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                    } ${
                      isDragOver
                        ? "border-primary bg-primary/5 scale-[1.02]"
                        : formData.logo && isFieldValid("logo")
                          ? "border-green-500 bg-green-50"
                          : formData.logo
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
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
                      id="logo"
                    />

                    {formData.logo && logoPreview ? (
                      <div className="space-y-3">
                        <div className="relative mx-auto w-32 h-32">
                          <Image
                            src={logoPreview || "/placeholder.svg"}
                            alt="Organization logo preview"
                            fill
                            className="object-cover rounded-lg transition-all duration-300"
                          />
                          <Button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveLogo()
                            }}
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 transition-all duration-200 hover:scale-110"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          {isFieldValid("logo") && (
                            <div className="absolute -bottom-2 -right-2 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-green-600 flex items-center justify-center gap-1">
                            {isFieldValid("logo") && <Check className="h-3 w-3 animate-in zoom-in duration-300" />}
                            {formData.logo.name}
                          </p>
                          <p className="text-xs text-gray-500">{(formData.logo.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-3">
                        <div className="mx-auto w-12 h-12 text-gray-400 transition-transform duration-200">
                          {isDragOver ? (
                            <Upload className="w-full h-full animate-bounce" />
                          ) : (
                            <ImageIcon className="w-full h-full" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {isDragOver ? "Drop your logo here" : "Upload organization logo"}
                          </p>
                          <p className="text-xs text-gray-500">Drag and drop or click to select</p>
                        </div>
                        <p className="text-xs text-gray-400">PNG, JPG, SVG up to 5MB</p>
                      </div>
                    )}
                  </div>
                  {errors.logo && (
                    <p className="text-sm text-red-600 animate-in slide-in-from-top duration-200">
                      {errors.logo as string}
                    </p>
                  )}
                </div>

                {/* Organization Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="name">Organization Name *</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{fieldTooltips.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="relative">
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        onBlur={() => handleFieldBlur("name")}
                        placeholder="Enter organization name"
                        className={`transition-all duration-200 ${
                          errors.name
                            ? "border-red-500 animate-pulse"
                            : isFieldValid("name")
                              ? "border-green-500 pr-10"
                              : ""
                        }`}
                        disabled={isSubmitting}
                      />
                      {isFieldValid("name") && (
                        <Check className="absolute right-3 top-3 h-4 w-4 text-green-500 animate-in zoom-in duration-300" />
                      )}
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-600 animate-in slide-in-from-top duration-200">{errors.name}</p>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="description">Description *</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{fieldTooltips.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="relative">
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        onBlur={() => handleFieldBlur("description")}
                        placeholder="Describe your organization"
                        rows={3}
                        className={`transition-all duration-200 ${
                          errors.description
                            ? "border-red-500 animate-pulse"
                            : isFieldValid("description")
                              ? "border-green-500 pr-10"
                              : ""
                        }`}
                        disabled={isSubmitting}
                      />
                      {isFieldValid("description") && (
                        <Check className="absolute right-3 top-3 h-4 w-4 text-green-500 animate-in zoom-in duration-300" />
                      )}
                    </div>
                    {errors.description && (
                      <p className="text-sm text-red-600 animate-in slide-in-from-top duration-200">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{fieldTooltips.email}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        onBlur={() => handleFieldBlur("email")}
                        placeholder="contact@organization.com"
                        className={`pl-10 transition-all duration-200 ${
                          errors.email
                            ? "border-red-500 animate-pulse"
                            : isFieldValid("email")
                              ? "border-green-500 pr-10"
                              : ""
                        }`}
                        disabled={isSubmitting}
                      />
                      {isFieldValid("email") && (
                        <Check className="absolute right-3 top-3 h-4 w-4 text-green-500 animate-in zoom-in duration-300" />
                      )}
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600 animate-in slide-in-from-top duration-200">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{fieldTooltips.phone}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        onBlur={() => handleFieldBlur("phone")}
                        placeholder="+1 (555) 123-4567"
                        className={`pl-10 transition-all duration-200 ${
                          errors.phone
                            ? "border-red-500 animate-pulse"
                            : isFieldValid("phone")
                              ? "border-green-500 pr-10"
                              : ""
                        }`}
                        disabled={isSubmitting}
                      />
                      {isFieldValid("phone") && (
                        <Check className="absolute right-3 top-3 h-4 w-4 text-green-500 animate-in zoom-in duration-300" />
                      )}
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-red-600 animate-in slide-in-from-top duration-200">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="country">Country *</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{fieldTooltips.country}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                      <Select
                        value={formData.country}
                        onValueChange={(value) => {
                          handleInputChange("country", value)
                          // Clear error immediately when a valid selection is made
                          setErrors((prev) => ({ ...prev, country: undefined }))
                        }}
                        onOpenChange={(open) => {
                          // Validate when dropdown closes
                          if (!open && formData.country) {
                            handleFieldBlur("country")
                          }
                        }}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger
                          className={`pl-10 transition-all duration-200 ${
                            errors.country
                              ? "border-red-500 animate-pulse"
                              : isFieldValid("country")
                                ? "border-green-500 pr-10"
                                : ""
                          }`}
                        >
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isFieldValid("country") && (
                        <Check className="absolute right-3 top-3 h-4 w-4 text-green-500 z-20 animate-in zoom-in duration-300" />
                      )}
                    </div>
                    {errors.country && (
                      <p className="text-sm text-red-600 animate-in slide-in-from-top duration-200">{errors.country}</p>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="address">Address *</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{fieldTooltips.address}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        onBlur={() => handleFieldBlur("address")}
                        placeholder="Enter full address"
                        rows={2}
                        className={`pl-10 transition-all duration-200 ${
                          errors.address
                            ? "border-red-500 animate-pulse"
                            : isFieldValid("address")
                              ? "border-green-500 pr-10"
                              : ""
                        }`}
                        disabled={isSubmitting}
                      />
                      {isFieldValid("address") && (
                        <Check className="absolute right-3 top-3 h-4 w-4 text-green-500 animate-in zoom-in duration-300" />
                      )}
                    </div>
                    {errors.address && (
                      <p className="text-sm text-red-600 animate-in slide-in-from-top duration-200">{errors.address}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 transition-all duration-200 hover:scale-[1.02]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Organization...
                      </>
                    ) : (
                      <>
                        <Building2 className="w-4 h-4 mr-2" />
                        Create Organization
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={isSubmitting}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}
