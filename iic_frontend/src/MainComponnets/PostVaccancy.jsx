'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/clerk-react"
import {
  Briefcase, MapPin, DollarSign, FileText,
  Upload, Users, Clock, X
} from "lucide-react"
import axios from "axios"

export default function PostVaccancy() {
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
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSkillInput = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault()
      const newSkill = skillInput.trim()
      if (!formData.skills.includes(newSkill)) {
        setFormData(prev => ({
          ...prev,
          skills: [...prev.skills, newSkill]
        }))
      }
      setSkillInput('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
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
      cloudinaryFormData.append('file', file)
      cloudinaryFormData.append('upload_preset', import.meta.env.VITE_PUBLIC_CLOUDINARY_UPLOAD_PRESET)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: cloudinaryFormData,
        }
      )

      const data = await response.json()
      if (data.secure_url) {
        setFormData(prev => ({
          ...prev,
          poster: data.secure_url
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

      const response = await axios.post('/api/createjobpost/', jobData)

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
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <Card className="w-full max-w-md text-center shadow-xl transform transition-all duration-300 hover:scale-105">
          <CardContent className="pt-8 pb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce">
              <Briefcase className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Job Posted Successfully!</h2>
            <p className="text-gray-600 mb-8 text-lg">Your job posting is now live and ready for candidates.</p>
            <Button 
              onClick={() => setSuccess(false)} 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              Post Another Job
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg py-4">
            <CardTitle className="flex items-center text-2xl font-bold">
              <Briefcase className="h-6 w-6 mr-2" />
              Post a New Job
            </CardTitle>
            <p className="text-blue-100 mt-1 text-sm">Fill in the details below to create your job posting</p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Job Title */}
                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    <Briefcase className="h-4 w-4 inline mr-1 text-blue-600" />
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>

                {/* Location */}
                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    <MapPin className="h-4 w-4 inline mr-1 text-blue-600" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="e.g. New York, NY or Remote"
                  />
                </div>

                {/* Salary Range Dropdown */}
                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    <DollarSign className="h-4 w-4 inline mr-1 text-blue-600" />
                    Salary Range
                  </label>
                  <select
                    name="salaryRange"
                    value={formData.salaryRange}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
                  >
                    <option value="negotiable">Negotiable</option>
                    <option value="0-5 LPA">0 - 5 LPA</option>
                    <option value="5-10 LPA">5 - 10 LPA</option>
                    <option value="10-20 LPA">10 - 20 LPA</option>
                    <option value="20-50 LPA">20 - 50 LPA</option>
                    <option value="50+ LPA">50+ LPA</option>
                  </select>
                </div>

                {/* Job Type */}
                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    <Clock className="h-4 w-4 inline mr-1 text-blue-600" />
                    Job Type
                  </label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>

              {/* Job Description */}
              <div className="transform transition-all duration-300 hover:scale-[1.01]">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  <FileText className="h-4 w-4 inline mr-1 text-blue-600" />
                  Job Description
                </label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Describe the role, responsibilities, and requirements..."
                />
              </div>

              {/* Skills */}
              <div className="transform transition-all duration-300 hover:scale-[1.01]">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  <Users className="h-4 w-4 inline mr-1 text-blue-600" />
                  Skills Required
                </label>
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillInput}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Type a skill and press Enter"
                />
                {formData.skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 shadow-sm"
                      >
                        #{skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 bg-white hover:bg-blue-50 rounded-full p-1 transition-colors duration-200"
                        >
                          <X className="w-3 h-3 text-blue-600" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Poster Upload */}
              <div className="transform transition-all duration-300 hover:scale-[1.01]">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  <Upload className="h-4 w-4 inline mr-1 text-blue-600" />
                  Job Poster (Optional)
                </label>
                <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-gray-200 border-dashed rounded-lg hover:border-blue-500 transition-colors duration-300">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </div>
                {uploading && (
                  <div className="mt-2 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-sm text-blue-600">Uploading...</span>
                  </div>
                )}
                {formData.poster && (
                  <div className="mt-2 flex justify-center">
                    <div className="relative group">
                      <img
                        src={formData.poster}
                        alt="Job poster"
                        className="w-32 h-32 object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, poster: "" }))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg animate-shake">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <X className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="ml-2">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading || uploading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Posting Job...
                  </div>
                ) : (
                  "Post Job"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
