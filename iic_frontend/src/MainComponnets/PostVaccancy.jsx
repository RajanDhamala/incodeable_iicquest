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
        skills: formData.skills,
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Briefcase className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Job Posted Successfully!</h2>
            <p className="text-gray-600 mb-6">Your job posting is now live.</p>
            <Button onClick={() => setSuccess(false)} className="w-full">
              Post Another Job
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Briefcase className="h-6 w-6 mr-2 text-blue-600" />
              Post a New Job
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="h-4 w-4 inline mr-1" />
                  Job Title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4 inline mr-1" />
                  Job Description
                </label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="h-4 w-4 inline mr-1" />
                  Skills Required
                </label>
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillInput}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a skill and press Enter"
                />
                {formData.skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border"
                      >
                        #{skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 bg-blue-200 hover:bg-blue-300 rounded-full p-1"
                        >
                          <X className="w-3 h-3 text-blue-600" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Salary Range Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  Salary Range
                </label>
                <select
                  name="salaryRange"
                  value={formData.salaryRange}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Job Type
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              {/* Poster Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Upload className="h-4 w-4 inline mr-1" />
                  Job Poster (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
                {formData.poster && (
                  <div className="mt-2">
                    <img
                      src={formData.poster}
                      alt="Job poster"
                      className="w-32 h-32 object-cover border rounded-md"
                    />
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 p-2 rounded">
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading || uploading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Posting Job..." : "Post Job"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
