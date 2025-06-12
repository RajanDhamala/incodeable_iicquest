"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@clerk/clerk-react"
import {
  Briefcase,
  MapPin,
  DollarSign,
  FileText,
  Upload,
  Users,
  Clock,
  X,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Building,
  Target,
  Zap,
  Star,
} from "lucide-react"
import axios from "axios"

export default function PostVacancy() {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [skillInput, setSkillInput] = useState("")
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    skills: [],
    location: "",
    salaryRange: "negotiable",
    poster: "",
    jobType: "full-time",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSkillInput = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault()
      const newSkill = skillInput.trim()
      if (!formData.skills.includes(newSkill)) {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, newSkill],
        }))
      }
      setSkillInput("")
    }
  }

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB")
      return
    }

    setUploading(true)
    setError("")

    try {
      const cloudinaryFormData = new FormData()
      cloudinaryFormData.append("file", file)
      cloudinaryFormData.append("upload_preset", import.meta.env.VITE_PUBLIC_CLOUDINARY_UPLOAD_PRESET)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: cloudinaryFormData,
        },
      )

      const data = await response.json()
      if (data.secure_url) {
        setFormData((prev) => ({
          ...prev,
          poster: data.secure_url,
        }))
      }
    } catch (err) {
      console.error("Image upload failed:", err)
      setError("Failed to upload image. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user?.id) {
      setError("Please log in to post a job")
      return
    }

    setLoading(true)
    setError("")

    try {
      const jobData = {
        userID: user.id,
        jobTitle: formData.jobTitle,
        jobDescription: formData.jobDescription,
        skillsRequired: formData.skills,
        location: formData.location,
        salaryRange: formData.salaryRange,
        poster: formData.poster,
        jobType: formData.jobType,
      }

      const response = await axios.post("/api/createjobpost/", jobData)

      if (response.data.success) {
        setSuccess(true)
        setFormData({
          jobTitle: "",
          jobDescription: "",
          skills: [],
          location: "",
          salaryRange: "negotiable",
          poster: "",
          jobType: "full-time",
        })
      } else {
        throw new Error(response.data.message || "Failed to create job post")
      }
    } catch (err) {
      console.error("Submit error:", err)
      setError(err.response?.data?.message || err.message || "Failed to create job post. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-blue-400/10 to-indigo-400/10"></div>
        <Card className="relative w-full max-w-lg text-center shadow-2xl border-0 bg-white/90 backdrop-blur-sm transform transition-all duration-500 hover:scale-105">
          <CardContent className="pt-12 pb-8 px-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg animate-bounce">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="h-4 w-4 text-yellow-800" />
              </div>
            </div>

            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              🎉 Job Posted Successfully!
            </h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Your job posting is now live and ready to attract top talent.
              <br />
              <span className="text-sm text-purple-600 font-medium">Get ready for amazing applications!</span>
            </p>

            <div className="space-y-4">
              <Button
                onClick={() => setSuccess(false)}
                className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-lg"
              >
                <Briefcase className="h-5 w-5 mr-2" />
                Post Another Job
              </Button>

              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-1 text-green-500" />
                  Live Now
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-blue-500" />
                  Visible to Candidates
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-8">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 via-blue-400/5 to-indigo-400/5"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Post Your Dream Job
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create an attractive job posting and connect with talented professionals who are perfect for your team
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-2xl font-bold mb-2">
                  <Building className="h-6 w-6 mr-3" />
                  Create Job Posting
                </CardTitle>
                <p className="text-purple-100 text-sm">Fill in the details below to attract the best candidates</p>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-300" />
                <Star className="h-5 w-5 text-yellow-300" />
                <Star className="h-5 w-5 text-yellow-300" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="h-5 w-5 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-800">Basic Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Job Title */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Briefcase className="h-4 w-4 inline mr-2 text-purple-600" />
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:border-purple-300 bg-white/80"
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>

                  {/* Location */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <MapPin className="h-4 w-4 inline mr-2 text-purple-600" />
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:border-purple-300 bg-white/80"
                      placeholder="e.g. New York, NY or Remote"
                    />
                  </div>

                  {/* Salary Range */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <DollarSign className="h-4 w-4 inline mr-2 text-purple-600" />
                      Salary Range
                    </label>
                    <select
                      name="salaryRange"
                      value={formData.salaryRange}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:border-purple-300 bg-white/80"
                    >
                      <option value="negotiable">💰 Negotiable</option>
                      <option value="0-5 LPA">💵 0 - 5 LPA</option>
                      <option value="5-10 LPA">💸 5 - 10 LPA</option>
                      <option value="10-20 LPA">💎 10 - 20 LPA</option>
                      <option value="20-50 LPA">🏆 20 - 50 LPA</option>
                      <option value="50+ LPA">👑 50+ LPA</option>
                    </select>
                  </div>

                  {/* Job Type */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Clock className="h-4 w-4 inline mr-2 text-purple-600" />
                      Job Type
                    </label>
                    <select
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:border-purple-300 bg-white/80"
                    >
                      <option value="full-time">🕘 Full Time</option>
                      <option value="part-time">⏰ Part Time</option>
                      <option value="contract">📋 Contract</option>
                      <option value="internship">🎓 Internship</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Job Description Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-800">Job Details</h3>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="h-4 w-4 inline mr-2 text-purple-600" />
                    Job Description
                  </label>
                  <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:border-purple-300 bg-white/80 resize-none"
                    placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity exciting..."
                  />
                </div>
              </div>

              {/* Skills Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-800">Required Skills</h3>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Users className="h-4 w-4 inline mr-2 text-purple-600" />
                    Add Skills (Press Enter to add)
                  </label>
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillInput}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:border-purple-300 bg-white/80"
                    placeholder="e.g. React, Node.js, Python..."
                  />
                  {formData.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {formData.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border-2 border-purple-200 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                        >
                          <span className="mr-2">#</span>
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-2 bg-white hover:bg-purple-50 rounded-full p-1 transition-colors duration-200 hover:scale-110"
                          >
                            <X className="w-3 h-3 text-purple-600" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Poster Upload Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Upload className="h-5 w-5 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-800">Visual Appeal</h3>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Upload className="h-4 w-4 inline mr-2 text-purple-600" />
                    Job Poster (Optional)
                  </label>
                  <div className="mt-2 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-200 border-dashed rounded-xl hover:border-purple-500 transition-all duration-300 group-hover:bg-purple-50/30 bg-white/50">
                    <div className="space-y-2 text-center">
                      <div className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mx-auto w-fit">
                        <Upload className="mx-auto h-8 w-8 text-purple-600" />
                      </div>
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500 px-2 py-1">
                          <span>Upload a file</span>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </div>

                  {uploading && (
                    <div className="mt-4 flex items-center justify-center p-4 bg-purple-50 rounded-xl">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                      <span className="ml-3 text-sm text-purple-600 font-medium">Uploading your image...</span>
                    </div>
                  )}

                  {formData.poster && (
                    <div className="mt-4 flex justify-center">
                      <div className="relative group">
                        <img
                          src={formData.poster || "/placeholder.svg"}
                          alt="Job poster"
                          className="w-40 h-40 object-cover rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, poster: "" }))}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-4 rounded-xl animate-pulse">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={loading || uploading}
                  className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Creating Your Job Post...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Post This Amazing Job
                      <Sparkles className="h-5 w-5 ml-2" />
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
