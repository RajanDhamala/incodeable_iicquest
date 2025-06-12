"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Star,
  MapPin,
  Mail,
  CheckCircle,
  AlertCircle,
  Search,
  Phone,
  Calendar,
  Hash,
  ShoppingCart,
  MessageCircle,
  TrendingUp,
  Award,
  Briefcase,
  Shield,
  Sparkles,
  GraduationCap,
  Target,
} from "lucide-react"

export default function MentorSection() {
  const [mentors, setMentors] = useState([])
  const [filteredMentors, setFilteredMentors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSkill, setSelectedSkill] = useState("all")

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("api/getmentors/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch mentors data")
        }

        const result = await response.json()

        if (result.success) {
          setMentors(result.data)
          setFilteredMentors(result.data)
        } else {
          throw new Error("API returned unsuccessful response")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMentors()
  }, [])

  const parseSkills = (skillString) => {
    try {
      if (!skillString || skillString === "[]") return []
      const match = skillString.match(/\[(.*?)\]/)
      if (match && match[1]) {
        return match[1]
          .split(",")
          .map((skill) => skill.trim().replace(/['"]/g, ""))
          .filter((skill) => skill.length > 0)
      }
      return []
    } catch (e) {
      return []
    }
  }

  const getAllSkills = () => {
    const allSkills = new Set()
    mentors.forEach((mentor) => {
      const skills = parseSkills(mentor.skills)
      skills.forEach((skill) => allSkills.add(skill.toLowerCase()))
    })
    return Array.from(allSkills)
  }

  useEffect(() => {
    let filtered = mentors

    if (searchTerm) {
      filtered = filtered.filter(
        (mentor) =>
          mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mentor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          parseSkills(mentor.skills).some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedSkill !== "all") {
      filtered = filtered.filter((mentor) =>
        parseSkills(mentor.skills).some((skill) => skill.toLowerCase() === selectedSkill.toLowerCase()),
      )
    }

    setFilteredMentors(filtered)
  }, [searchTerm, selectedSkill, mentors])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-pink-500 to-rose-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-transparent to-cyan-600/20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                <TrendingUp className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4">Unlock Your Growth Potential</h1>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
              Connect with industry-leading mentors who will accelerate your career and unlock new opportunities
            </p>
            <div className="flex items-center justify-center space-x-8 text-emerald-100">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Skill Development</span>
              </div>
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Career Growth</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>New Opportunities</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Section */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500" />
                  <Input
                    type="text"
                    placeholder="Search mentors by name, skills, or expertise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                  <SelectTrigger className="w-48 h-12 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500">
                    <SelectValue placeholder="Filter by skill" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Skills</SelectItem>
                    {getAllSkills().map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        {skill.charAt(0).toUpperCase() + skill.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-6 border-t border-emerald-100">
              <div className="flex items-center space-x-2 text-emerald-700">
                <Users className="h-5 w-5" />
                <span className="font-semibold">{filteredMentors.length}</span>
                <span>expert mentors ready to guide your growth</span>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                <Award className="h-3 w-3 mr-1" />
                Verified Professionals
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Mentors Grid */}
        {filteredMentors.length === 0 ? (
          <EmptyState searchTerm={searchTerm} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredMentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MentorCard({ mentor }) {
  const parseSkills = (skillString) => {
    try {
      if (!skillString || skillString === "[]") return []
      const match = skillString.match(/\[(.*?)\]/)
      if (match && match[1]) {
        return match[1]
          .split(",")
          .map((skill) => skill.trim().replace(/['"]/g, ""))
          .filter((skill) => skill.length > 0)
      }
      return []
    } catch (e) {
      return []
    }
  }

  const skills = parseSkills(mentor.skills)
  const joinDate = new Date(mentor.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  })

  return (
    <Card className="group relative overflow-hidden border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
      <div className="absolute inset-[1px] bg-white rounded-lg"></div>

      {/* Content */}
      <div className="relative">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-emerald-200 group-hover:border-emerald-400 transition-colors duration-300">
                  <img
                    src={mentor.profilePicture || "/placeholder.svg?height=64&width=64"}
                    alt={mentor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {mentor.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-white">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors duration-300">
                  {mentor.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
                    <Briefcase className="h-3 w-3 mr-1" />
                    {mentor.userType.charAt(0).toUpperCase() + mentor.userType.slice(1)}
                  </Badge>
                  {mentor.verified && (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium text-gray-700">4.9</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{mentor.description}</p>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-1 text-emerald-700">
                <Hash className="h-4 w-4" />
                <span className="text-sm font-medium">Skills</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200 hover:from-emerald-100 hover:to-teal-100 transition-colors duration-200 text-xs"
                  >
                    #{skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="h-4 w-4 text-teal-500" />
              <span className="truncate">{mentor.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone className="h-4 w-4 text-emerald-500" />
              <span>{mentor.phoneNumber}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="h-4 w-4 text-cyan-500" />
              <span className="truncate">{mentor.address}</span>
            </div>
          </div>

          {/* Join Date */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 pt-2 border-t border-gray-100">
            <Calendar className="h-4 w-4" />
            <span>Joined {joinDate}</span>
            <div className="flex-1"></div>
            <span className="text-xs text-emerald-600 font-medium">ID: {mentor.id}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <MessageCircle className="h-4 w-4 mr-2" />
              Connect
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Buy Course
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Skeleton className="h-12 w-12 rounded-2xl mx-auto mb-6 bg-white/20" />
            <Skeleton className="h-12 w-96 mx-auto mb-4 bg-white/20" />
            <Skeleton className="h-6 w-[600px] mx-auto mb-8 bg-white/20" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="mb-8 border-0 shadow-lg bg-white/80">
          <CardContent className="p-6">
            <div className="flex gap-6">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-48" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-0 shadow-xl bg-white/90">
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <Skeleton className="w-16 h-16 rounded-xl" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-14" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
                <div className="flex space-x-3">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function ErrorState({ message }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
      <Card className="max-w-md w-full text-center border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardContent className="pt-12 pb-8">
          <div className="p-4 bg-red-100 rounded-full mx-auto w-fit mb-6">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h3>
          <p className="text-gray-600 mb-8">{message}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function EmptyState({ searchTerm }) {
  return (
    <div className="text-center py-16">
      <Card className="max-w-md mx-auto border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardContent className="pt-12 pb-8">
          <div className="p-4 bg-emerald-100 rounded-full mx-auto w-fit mb-6">
            <Search className="h-12 w-12 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {searchTerm ? "No mentors found" : "Growing our mentor network"}
          </h3>
          <p className="text-gray-600 mb-8">
            {searchTerm
              ? `No mentors match your search for "${searchTerm}". Try different keywords or explore all skills.`
              : "We're onboarding amazing mentors to accelerate your growth. Check back soon for new opportunities!"}
          </p>
          {searchTerm && (
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Explore All Mentors
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
