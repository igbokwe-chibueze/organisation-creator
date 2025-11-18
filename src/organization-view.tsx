// src/organization-view.tsx
"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Edit,
  Share,
  Download,
  Mail,
  Phone,
  MapPin,
  Globe,
  Copy,
  Check,
  Send,
  UserPlus,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

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
  members: Member[]
  revenue?: string
  country: string
  website?: string
  email: string
  phone: string
  address: string
  foundedYear?: string
  services?: string
  operatingHours?: string
  languages: string[]
  isPublic: boolean
  allowContact: boolean
  showRevenue: boolean
}

interface Member {
  id: string
  name: string
  email: string
  role: string
  joinedAt: string
  avatar?: string
  status: "active" | "pending" | "inactive"
}

const mockOrganization: Organization = {
  id: "1",
  name: "TechCorp Solutions",
  description:
    "Leading technology solutions provider specializing in cloud computing, artificial intelligence, and digital transformation services for enterprise clients worldwide.",
  industry: "Technology",
  organizationType: "Corporation",
  employeeCount: "51-200",
  status: "active",
  logo: "/placeholder.svg?height=80&width=80",
  createdAt: "2024-01-15",
  lastUpdated: "2024-01-20",
  completionPercentage: 85,
  revenue: "$1M - $5M",
  country: "United States",
  website: "https://techcorp.com",
  email: "contact@techcorp.com",
  phone: "+1 (555) 123-4567",
  address: "123 Tech Street, San Francisco, CA 94105",
  foundedYear: "2018",
  services: "Cloud Computing, AI Solutions, Digital Transformation, Software Development, IT Consulting",
  operatingHours: "Mon-Fri 9:00 AM - 6:00 PM PST",
  languages: ["English", "Spanish"],
  isPublic: true,
  allowContact: true,
  showRevenue: false,
  members: [
    {
      id: "1",
      name: "John Doe",
      email: "john@techcorp.com",
      role: "CEO",
      joinedAt: "2024-01-15",
      avatar: "/placeholder.svg?height=32&width=32",
      status: "active",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@techcorp.com",
      role: "CTO",
      joinedAt: "2024-01-16",
      avatar: "/placeholder.svg?height=32&width=32",
      status: "active",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@techcorp.com",
      role: "Developer",
      joinedAt: "2024-01-18",
      status: "pending",
    },
  ],
}

export default function OrganizationView() {
  const router = useRouter()
  const { toast } = useToast()
  const [organization] = useState<Organization>(mockOrganization)
  const [shareLink, setShareLink] = useState("")
  const [linkCopied, setLinkCopied] = useState(false)
  const [emailInvites, setEmailInvites] = useState("")
  const [inviteRole, setInviteRole] = useState("member")
  const [inviteMessage, setInviteMessage] = useState("")
  const [exportFormat, setExportFormat] = useState("json")

  useEffect(() => {
    // Generate unique share link
    const baseUrl = window.location.origin
    const uniqueId = Math.random().toString(36).substring(2, 15)
    setShareLink(`${baseUrl}/join/${organization.id}?token=${uniqueId}`)
  }, [organization.id])

  const handleBack = () => {
    router.push("/dashboard")
  }

  const handleEdit = () => {
    router.push(`/update?id=${organization.id}`)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setLinkCopied(true)
      toast({
        title: "Link Copied!",
        description: "Share link has been copied to clipboard.",
      })
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard.",
        //variant: "destructive",
      })
    }
  }

  const handleSendInvites = () => {
    const emails = emailInvites
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email)

    if (emails.length === 0) {
      toast({
        title: "No Email Addresses",
        description: "Please enter at least one email address.",
        //variant: "destructive",
      })
      return
    }

    // Simulate sending invites
    toast({
      title: "Invitations Sent!",
      description: `Sent ${emails.length} invitation${emails.length !== 1 ? "s" : ""} successfully.`,
    })

    // Clear form
    setEmailInvites("")
    setInviteMessage("")
  }

  const handleExport = () => {
    const exportData = {
      organization: {
        ...organization,
        members: organization.members.map((member) => ({
          name: member.name,
          email: member.email,
          role: member.role,
          status: member.status,
          joinedAt: member.joinedAt,
        })),
      },
      exportedAt: new Date().toISOString(),
      format: exportFormat,
    }

    let content: string
    let filename: string
    let mimeType: string

    switch (exportFormat) {
      case "csv":
        // Convert to CSV format
        const csvHeaders = ["Field", "Value"]
        const csvRows = [
          csvHeaders.join(","),
          `Name,"${organization.name}"`,
          `Description,"${organization.description}"`,
          `Industry,"${organization.industry}"`,
          `Type,"${organization.organizationType}"`,
          `Employees,"${organization.employeeCount}"`,
          `Country,"${organization.country}"`,
          `Website,"${organization.website || ""}"`,
          `Email,"${organization.email}"`,
          `Phone,"${organization.phone}"`,
          `Address,"${organization.address}"`,
          `Founded,"${organization.foundedYear || ""}"`,
          `Services,"${organization.services || ""}"`,
          `Languages,"${organization.languages.join("; ")}"`,
          `Members Count,"${organization.members.length}"`,
          `Status,"${organization.status}"`,
          `Completion,"${organization.completionPercentage}%"`,
        ]
        content = csvRows.join("\n")
        filename = `${organization.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_export.csv`
        mimeType = "text/csv"
        break

      case "json":
      default:
        content = JSON.stringify(exportData, null, 2)
        filename = `${organization.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_export.json`
        mimeType = "application/json"
        break
    }

    // Create and download file
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Export Complete!",
      description: `Organization data exported as ${exportFormat.toUpperCase()}.`,
    })
  }

  const getMemberStatusBadge = (status: Member["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "inactive":
        return <Badge variant="destructive">Inactive</Badge>
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" onClick={handleBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={organization.logo || "/placeholder.svg"} alt={organization.name} />
                <AvatarFallback className="text-2xl">{organization.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{organization.name}</h1>
                <p className="text-gray-600 mt-1">
                  {organization.industry} • {organization.organizationType}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge
                    variant={
                      organization.status === "active"
                        ? "default"
                        : organization.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {organization.status}
                  </Badge>
                  {!organization.isPublic && <Badge variant="outline">Private</Badge>}
                  <span className="text-sm text-gray-500">
                    {organization.members.length} member{organization.members.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Share Organization</DialogTitle>
                    <DialogDescription>
                      Invite members to join {organization.name} using a link or email invitations.
                    </DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue="link" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="link">Share Link</TabsTrigger>
                      <TabsTrigger value="email">Email Invites</TabsTrigger>
                    </TabsList>

                    <TabsContent value="link" className="space-y-4">
                      <div>
                        <Label htmlFor="shareLink">Invitation Link</Label>
                        <div className="flex gap-2 mt-2">
                          <Input id="shareLink" value={shareLink} readOnly className="flex-1" />
                          <Button onClick={handleCopyLink} variant="outline">
                            {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Anyone with this link can request to join the organization.
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="linkExpiry" />
                        <Label htmlFor="linkExpiry">Link expires in 7 days</Label>
                      </div>
                    </TabsContent>

                    <TabsContent value="email" className="space-y-4">
                      <div>
                        <Label htmlFor="emailInvites">Email Addresses</Label>
                        <Textarea
                          id="emailInvites"
                          placeholder="Enter email addresses separated by commas..."
                          value={emailInvites}
                          onChange={(e) => setEmailInvites(e.target.value)}
                          className="mt-2"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="inviteRole">Default Role</Label>
                        <Select value={inviteRole} onValueChange={setInviteRole}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="inviteMessage">Personal Message (Optional)</Label>
                        <Textarea
                          id="inviteMessage"
                          placeholder="Add a personal message to the invitation..."
                          value={inviteMessage}
                          onChange={(e) => setInviteMessage(e.target.value)}
                          className="mt-2"
                          rows={3}
                        />
                      </div>

                      <Button onClick={handleSendInvites} className="w-full">
                        <Send className="h-4 w-4 mr-2" />
                        Send Invitations
                      </Button>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export Organization Data</DialogTitle>
                    <DialogDescription>Download organization information in your preferred format.</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="exportFormat">Export Format</Label>
                      <Select value={exportFormat} onValueChange={setExportFormat}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Export will include:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Organization details and settings</li>
                        <li>• Member information (names, roles, status)</li>
                        <li>• Contact information</li>
                        <li>• Business details and metrics</li>
                      </ul>
                    </div>

                    <Button onClick={handleExport} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members ({organization.members.length})</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{organization.description}</p>

                    {organization.services && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Services</h4>
                        <p className="text-sm text-gray-600">{organization.services}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-gray-600">{organization.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">Phone</p>
                          <p className="text-sm text-gray-600">{organization.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">Address</p>
                          <p className="text-sm text-gray-600">{organization.address}</p>
                        </div>
                      </div>

                      {organization.website && (
                        <div className="flex items-center gap-3">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">Website</p>
                            <a
                              href={organization.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                            >
                              {organization.website}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Profile Completion</span>
                        <span>{organization.completionPercentage}%</span>
                      </div>
                      <Progress value={organization.completionPercentage} />
                    </div>

                    <Separator />

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Industry</span>
                        <span className="font-medium">{organization.industry}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type</span>
                        <span className="font-medium">{organization.organizationType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Employees</span>
                        <span className="font-medium">{organization.employeeCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Country</span>
                        <span className="font-medium">{organization.country}</span>
                      </div>
                      {organization.foundedYear && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Founded</span>
                          <span className="font-medium">{organization.foundedYear}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Languages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {organization.languages.map((language) => (
                        <Badge key={language} variant="secondary">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {organization.operatingHours && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Operating Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{organization.operatingHours}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Team Members</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Member</DialogTitle>
                    <DialogDescription>Invite a new member to join {organization.name}.</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="memberEmail">Email Address</Label>
                      <Input id="memberEmail" type="email" placeholder="member@example.com" className="mt-2" />
                    </div>

                    <div>
                      <Label htmlFor="memberRole">Role</Label>
                      <Select defaultValue="member">
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Send Invitation
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {organization.members.map((member) => (
                <Card key={member.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{member.role}</Badge>
                          {getMemberStatusBadge(member.status)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Organization Type</p>
                      <p className="font-medium">{organization.organizationType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Industry</p>
                      <p className="font-medium">{organization.industry}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Employee Count</p>
                      <p className="font-medium">{organization.employeeCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Country</p>
                      <p className="font-medium">{organization.country}</p>
                    </div>
                    {organization.foundedYear && (
                      <div>
                        <p className="text-gray-600">Founded</p>
                        <p className="font-medium">{organization.foundedYear}</p>
                      </div>
                    )}
                    {organization.revenue && (
                      <div>
                        <p className="text-gray-600">Revenue</p>
                        <p className="font-medium">{organization.revenue}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <div>
                        <p className="text-sm font-medium">Last Updated</p>
                        <p className="text-xs text-gray-600">
                          {new Date(organization.lastUpdated).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div>
                        <p className="text-sm font-medium">Organization Created</p>
                        <p className="text-xs text-gray-600">{new Date(organization.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control how your organization information is displayed and shared.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Public Profile</p>
                    <p className="text-sm text-gray-600">Make your organization visible in search results</p>
                  </div>
                  <Switch checked={organization.isPublic} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Allow Contact</p>
                    <p className="text-sm text-gray-600">Allow others to contact your organization</p>
                  </div>
                  <Switch checked={organization.allowContact} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Revenue</p>
                    <p className="text-sm text-gray-600">Display revenue information publicly</p>
                  </div>
                  <Switch checked={organization.showRevenue} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>Irreversible and destructive actions.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive">Delete Organization</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
