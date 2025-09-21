// src/help-center.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Search,
  Book,
  MessageCircle,
  FileText,
  Video,
  Download,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const faqData = [
  {
    id: "1",
    question: "How do I create a new organization?",
    answer:
      "To create a new organization, navigate to the dashboard and click the 'Create Organization' button. Fill in the required information including organization name, description, and upload a logo if desired.",
    category: "Getting Started",
    helpful: 24,
    notHelpful: 2,
  },
  {
    id: "2",
    question: "How can I invite team members to my organization?",
    answer:
      "Go to your organization settings, click on 'Members' tab, then click 'Invite Members'. Enter the email addresses of people you want to invite and select their roles.",
    category: "Team Management",
    helpful: 18,
    notHelpful: 1,
  },
  {
    id: "3",
    question: "What are the different user roles available?",
    answer:
      "We offer three main roles: Admin (full access), Editor (can modify content), and Viewer (read-only access). Admins can manage all aspects of the organization including member permissions.",
    category: "Permissions",
    helpful: 32,
    notHelpful: 3,
  },
  {
    id: "4",
    question: "How do I export my organization data?",
    answer:
      "Navigate to Settings > Data Export. Choose the format (CSV, JSON, or PDF) and select the data you want to export. The export will be emailed to you once ready.",
    category: "Data Management",
    helpful: 15,
    notHelpful: 0,
  },
  {
    id: "5",
    question: "Can I customize the organization profile?",
    answer:
      "Yes! You can customize your organization profile by adding a logo, banner image, description, contact information, and social media links in the organization settings.",
    category: "Customization",
    helpful: 21,
    notHelpful: 1,
  },
]

const documentationSections = [
  {
    title: "Getting Started Guide",
    description: "Learn the basics of using our platform",
    icon: Book,
    articles: [
      "Quick Start Tutorial",
      "Setting Up Your First Organization",
      "Understanding the Dashboard",
      "Basic Navigation",
    ],
  },
  {
    title: "User Management",
    description: "Managing users and permissions",
    icon: FileText,
    articles: ["Inviting Team Members", "Setting User Roles", "Managing Permissions", "User Profile Settings"],
  },
  {
    title: "Advanced Features",
    description: "Explore advanced functionality",
    icon: Video,
    articles: ["Analytics and Reporting", "API Integration", "Custom Templates", "Automation Features"],
  },
]

const supportTickets = [
  {
    id: "TICK-001",
    subject: "Unable to upload organization logo",
    status: "Open",
    priority: "Medium",
    created: "2024-01-15",
    lastUpdate: "2024-01-16",
  },
  {
    id: "TICK-002",
    subject: "Question about user permissions",
    status: "Resolved",
    priority: "Low",
    created: "2024-01-10",
    lastUpdate: "2024-01-12",
  },
]

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketDescription, setTicketDescription] = useState("")
  const [ticketPriority, setTicketPriority] = useState("medium")

  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...Array.from(new Set(faqData.map((faq) => faq.category)))]

  const handleSubmitTicket = () => {
    if (!ticketSubject || !ticketDescription) {
      toast("Error",{
        description: "Please fill in all required fields."
        //variant: "destructive",
      })
      return
    }

    toast("Support ticket created",{
      description: "We'll get back to you within 24 hours.",
    })

    setTicketSubject("")
    setTicketDescription("")
    setTicketPriority("medium")
  }

  const handleFeedback = (faqId: string, helpful: boolean) => {
    toast("Thank you for your feedback",{
     description: "Your feedback helps us improve our documentation.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions, browse our documentation, or contact our support team
        </p>

        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            Documentation
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Contact Support
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            My Tickets
          </TabsTrigger>
        </TabsList>

        {/* FAQ Section */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find quick answers to the most common questions</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Category Filter */}
              <div className="mb-6">
                <Label htmlFor="category">Filter by category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* FAQ Accordion */}
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-center justify-between w-full mr-4">
                        <span className="font-medium">{faq.question}</span>
                        <Badge variant="secondary" className="ml-2">
                          {faq.category}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p className="text-muted-foreground">{faq.answer}</p>

                      {/* Feedback */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Was this helpful?</span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFeedback(faq.id, true)}
                              className="flex items-center gap-1"
                            >
                              <ThumbsUp className="h-3 w-3" />
                              {faq.helpful}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFeedback(faq.id, false)}
                              className="flex items-center gap-1"
                            >
                              <ThumbsDown className="h-3 w-3" />
                              {faq.notHelpful}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredFAQs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No FAQs found matching your search criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentation Section */}
        <TabsContent value="docs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentationSections.map((section, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <section.icon className="h-5 w-5" />
                    {section.title}
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.articles.map((article, articleIndex) => (
                      <li key={articleIndex}>
                        <Button variant="ghost" className="w-full justify-start h-auto p-2 text-left">
                          <div className="flex items-center justify-between w-full mr-4">
                            <span className="text-sm">{article}</span>
                            <ExternalLink className="h-3 w-3" />
                          </div>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Helpful resources and downloads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="flex items-center gap-2 h-auto p-4 bg-transparent">
                  <Download className="h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">User Manual (PDF)</div>
                    <div className="text-sm text-muted-foreground">Complete guide to all features</div>
                  </div>
                </Button>
                <Button variant="outline" className="flex items-center gap-2 h-auto p-4 bg-transparent">
                  <Video className="h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">Video Tutorials</div>
                    <div className="text-sm text-muted-foreground">Step-by-step video guides</div>
                  </div>
                </Button>
                <Button variant="outline" className="flex items-center gap-2 h-auto p-4 bg-transparent">
                  <FileText className="h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">API Documentation</div>
                    <div className="text-sm text-muted-foreground">Developer resources</div>
                  </div>
                </Button>
                <Button variant="outline" className="flex items-center gap-2 h-auto p-4 bg-transparent">
                  <ExternalLink className="h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">Community Forum</div>
                    <div className="text-sm text-muted-foreground">Connect with other users</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Support Section */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Submit a Support Ticket</CardTitle>
                <CardDescription>Describe your issue and we will get back to you as soon as possible</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={ticketPriority} onValueChange={setTicketPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of your issue"
                    rows={5}
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                  />
                </div>

                <Button onClick={handleSubmitTicket} className="w-full">
                  Submit Ticket
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Reach out to us directly for immediate assistance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Email Support</h3>
                  <p className="text-muted-foreground">
                    Send us an email at <a href="mailto:support@example.com">support@example.com</a>
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Phone Support</h3>
                  <p className="text-muted-foreground">
                    Call us at <a href="tel:+15551234567">+1 (555) 123-4567</a>
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Live Chat</h3>
                  <p className="text-muted-foreground">
                    Chat with a support agent instantly (available during business hours)
                  </p>
                  <Button variant="outline">Start Chat</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* My Tickets Section */}
        <TabsContent value="tickets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Support Tickets</CardTitle>
              <CardDescription>View the status of your submitted support tickets</CardDescription>
            </CardHeader>
            <CardContent>
              {supportTickets.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ticket ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Update
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {supportTickets.map((ticket) => (
                        <tr key={ticket.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{ticket.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{ticket.subject}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="secondary">{ticket.status}</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{ticket.priority}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{ticket.created}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{ticket.lastUpdate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No support tickets found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
