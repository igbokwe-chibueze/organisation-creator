import { Suspense } from "react"
import { OrganizationAnalytics } from "@/organization-analytics"

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<div>Loading analytics...</div>}>
        <OrganizationAnalytics />
      </Suspense>
    </div>
  )
}
