import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Building2,
  ExternalLink,
  Info
} from "lucide-react"

export default function JobCard({ jobData, userId }) {
  const [expanded, setExpanded] = useState(false)

  const handleApply = async () => {
    try {
      const payload = {
        userID: userId,
        companyUserID: jobData.userID,
        jobPostID: jobData.id,
        status: "applied"
      }

      console.log("payload:", payload)

      const response = await axios.post("/api/jobapplications/", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Application submitted:", response.data)
      toast.success("Successfully applied to the job!")
    } catch (error) {
      console.error("Error applying for job:", error)
      toast.error("Failed to apply for the job.")
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  const getJobTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "full-time":
        return "bg-green-100 text-green-700 hover:bg-green-200"
      case "part-time":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200"
      case "contract":
        return "bg-orange-100 text-orange-700 hover:bg-orange-200"
      case "internship":
        return "bg-purple-100 text-purple-700 hover:bg-purple-200"
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {jobData.poster && (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={jobData.poster}
                  alt="Company logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {jobData.jobTitle}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-1" />
                  <span>Company</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(jobData.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
          <Badge className={`${getJobTypeColor(jobData.jobType)} border-0 capitalize`}>
            {jobData.jobType}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-gray-700 leading-relaxed">{jobData.jobDescription}</p>
        </div>

        <Separator className="bg-gray-200" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium text-gray-900">{jobData.location}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Salary</p>
              <p className="font-medium text-gray-900">{jobData.salaryRange}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Job Type</p>
              <p className="font-medium text-gray-900 capitalize">{jobData.jobType}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Posted</p>
              <p className="font-medium text-gray-900">{formatDate(jobData.created_at)}</p>
            </div>
          </div>
        </div>

        {jobData.skillsRequired && jobData.skillsRequired.trim() && (
          <>
            <Separator className="bg-gray-200" />
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {jobData.skillsRequired.split(",").map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {jobData.remarks && (
          <>
            <Separator className="bg-gray-200" />
            {expanded && (
              <div className="text-sm text-gray-700 space-y-1">
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4 text-muted-foreground" />
                  <span><strong>Remarks:</strong> {jobData.remarks}</span>
                </div>
              </div>
            )}
            <div className="pt-2">
              <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
                {expanded ? "See Less" : "See More"}
              </Button>
            </div>
          </>
        )}

        <Separator className="bg-gray-200" />

        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-gray-500">Job ID: #{jobData.id}</div>
          <Button
            onClick={handleApply}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
          >
            <span>Join Now</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
