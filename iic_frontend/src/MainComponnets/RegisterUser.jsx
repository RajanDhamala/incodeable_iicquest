"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"
import {Upload,User,Phone,MapPin,Camera,Check,AlertCircle,Calendar,FileText,X,Plus,Building2,Users,
} from "lucide-react"
import axios from "axios"

function RegisterUser() {
  const { user, isLoading: loading } = useUser()
  const navigate = useNavigate()

  const [isRegistered, setIsRegistered] = useState(false)

  const [registrationType, setRegistrationType] = useState("individual") // 'individual' or 'business'

  const [formData, setFormData] = useState({
    // Individual fields
name: user?.fullName || "",
phone: user?.phoneNumbers?.[0]?.phoneNumber || "",
userType: "",
address: "",
dateOfBirth: "",
description: "",
profilePicture: null,
skills: [],
// Business fields
companyName: "",
companyLogo: null,
companySkills: [],
numberOfEmployees: "",
companyDescription: "",
estd: "", // Add this line for establishment date
  })

  const [imagePreview, setImagePreview] = useState(user?.imageUrl || null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [skillInput, setSkillInput] = useState("")
  const [companySkillInput, setCompanySkillInput] = useState("")

  const userTypes = [
    "Teacher",
    "Student",
    "House Wife",
    "Business Owner",
    "Professional",
    "Freelancer",
    "Retired",
    "Job Seeker",
    "Developer",
    "Other",
  ]

  const employeeRanges = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]


  const checkRegistrationStatus = async () => {
    if (!user?.id) return

    try {
      const response = await axios.post("/api/checkprofile/", {
        userID: user.id,
      })

      if (response.data?.isRegistered) {
        setIsRegistered(true)
        navigate("/")
      }
    } catch (error) {
      console.log("User not registered yet")
    }
  }

  useEffect(() => {
    if (user && !loading) {
      checkRegistrationStatus()
    }
  }, [user, loading])

  useEffect(() => {
    if (!loading && user && isRegistered) {
      navigate("/")
    }
  }, [user, loading, isRegistered, navigate])

  const handleRegistrationTypeToggle = () => {
    setRegistrationType((prev) => (prev === "individual" ? "business" : "individual"))
    setErrors({}) 
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
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

  const handleCompanySkillInput = (e) => {
    if (e.key === "Enter" && companySkillInput.trim()) {
      e.preventDefault()
      const newSkill = companySkillInput.trim()
      if (!formData.companySkills.includes(newSkill)) {
        setFormData((prev) => ({
          ...prev,
          companySkills: [...prev.companySkills, newSkill],
        }))
      }
      setCompanySkillInput("")
    }
  }

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const removeCompanySkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      companySkills: prev.companySkills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const handleImageUpload = async (e, type = "profile") => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        [type === "profile" ? "profilePicture" : "companyLogo"]: "Please select a valid image file",
      }))
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [type === "profile" ? "profilePicture" : "companyLogo"]: "Image size must be less than 5MB",
      }))
      return
    }

    setIsUploading(true)
    setErrors((prev) => ({
      ...prev,
      [type === "profile" ? "profilePicture" : "companyLogo"]: "",
    }))

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (type === "profile") {
          setImagePreview(e.target.result)
        } else {
          setLogoPreview(e.target.result)
        }
      }
      reader.readAsDataURL(file)

      const cloudinaryFormData = new FormData()
      cloudinaryFormData.append("file", file)
      cloudinaryFormData.append("upload_preset", import.meta.env.VITE_PUBLIC_CLOUDINARY_UPLOAD_PRESET)
      cloudinaryFormData.append("cloud_name", import.meta.env.VITE_PUBLIC_CLOUDINARY_CLOUD_NAME)

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
          [type === "profile" ? "profilePicture" : "companyLogo"]: data.secure_url,
        }))
      }
    } catch (error) {
      console.error("Image upload error:", error)
      setErrors((prev) => ({
        ...prev,
        [type === "profile" ? "profilePicture" : "companyLogo"]: "Failed to upload image. Please try again.",
      }))
    } finally {
      setIsUploading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (registrationType === "individual") {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required"
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required"
      } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number"
      }

      if (!formData.userType) {
        newErrors.userType = "Please select a user type"
      }

      if (!formData.address.trim()) {
        newErrors.address = "Address is required"
      }

      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = "Date of birth is required"
      }

      if (!formData.description.trim()) {
        newErrors.description = "Description is required"
      } else if (formData.description.trim().length < 10) {
        newErrors.description = "Description must be at least 10 characters"
      }
    } else {
      // Business validation
      if (!formData.companyName.trim()) {
        newErrors.companyName = "Company name is required"
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required"
      } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number"
      }

      if (!formData.address.trim()) {
        newErrors.address = "Company address is required"
      }

      if (!formData.estd) {
        newErrors.estd = "Establishment date is required"
      }

      if (!formData.numberOfEmployees) {
        newErrors.numberOfEmployees = "Please select number of employees"
      }

      if (!formData.companyDescription.trim()) {
        newErrors.companyDescription = "Company description is required"
      } else if (formData.companyDescription.trim().length < 10) {
        newErrors.companyDescription = "Company description must be at least 10 characters"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const submitData = {
        userID: user?.id,
        email: user?.emailAddresses?.[0]?.emailAddress,
        registrationType: registrationType,
        ...(registrationType === "individual"
          ? {
              name: formData.name,
              phoneNumber: formData.phone,
              userType: formData.userType,
              address: formData.address,
              dateOfBirth: formData.dateOfBirth,
              description: formData.description,
              profilePicture: formData.profilePicture,
              skills: formData.skills,
            }
          : {
              companyName: formData.companyName,
              phoneNumber: formData.phone,
              address: formData.address,
              estd: formData.estd, // Add this line
              numberOfEmployees: formData.numberOfEmployees,
              companyDescription: formData.companyDescription,
              companyLogo: formData.companyLogo,
              companySkills: formData.companySkills,
            }),
      }

      const response = await axios.post("/api/createprofile/", submitData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false,
        timeout: 10000,
      })

      if (response.status === 200 || response.status === 201) {
        console.log("Registration successful", response.data)
      }
    } catch (error) {
      console.error("Registration error:", error)
      setErrors((prev) => ({
        ...prev,
        submit: error.response?.data?.message || "Registration failed. Please try again.",
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-8">
            {/* Registration Type Toggle */}
            <div className="flex flex-col items-center space-y-6 mb-8">
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  Create Your Account
                </h1>
                <p className="text-gray-600 text-lg">Join our professional community today</p>
              </div>

              <div className="flex items-center space-x-1 bg-gray-50/80 backdrop-blur-sm rounded-2xl p-1.5 border border-gray-200/50">
                <button
                  type="button"
                  onClick={handleRegistrationTypeToggle}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                    registrationType === "individual"
                      ? "bg-white shadow-lg text-blue-600 border border-blue-100"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Individual</span>
                </button>

                <button
                  type="button"
                  onClick={handleRegistrationTypeToggle}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                    registrationType === "business"
                      ? "bg-white shadow-lg text-blue-600 border border-blue-100"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span>Business</span>
                </button>
              </div>
            </div>

            {/* Profile/Logo Image Upload */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                  {(registrationType === "individual" ? imagePreview : logoPreview) ? (
                    <img
                      src={registrationType === "individual" ? imagePreview : logoPreview}
                      alt={registrationType === "individual" ? "Profile" : "Company Logo"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                      {registrationType === "individual" ? (
                        <Camera className="w-8 h-8 text-gray-400" />
                      ) : (
                        <Building2 className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                  )}
                </div>
                <label
                  htmlFor={registrationType === "individual" ? "profile-image" : "company-logo"}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
                >
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 text-white" />
                  )}
                </label>
                <input
                  id={registrationType === "individual" ? "profile-image" : "company-logo"}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, registrationType === "individual" ? "profile" : "logo")}
                  className="hidden"
                />
              </div>
              {errors[registrationType === "individual" ? "profilePicture" : "companyLogo"] && (
                <p className="text-red-500 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors[registrationType === "individual" ? "profilePicture" : "companyLogo"]}
                </p>
              )}
              <p className="text-sm text-gray-500 text-center">
                Upload your {registrationType === "individual" ? "profile picture" : "company logo"}
              </p>
            </div>

            {/* Conditional Form Fields */}
            {registrationType === "individual" ? (
              // Individual Registration Fields
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.phone ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.dateOfBirth ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                {/* User Type */}
                <div className="sm:col-span-2">
                  <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                    I am a...
                  </label>
                  <select
                    id="userType"
                    name="userType"
                    value={formData.userType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.userType ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select your profession</option>
                    {userTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.userType && (
                    <p className="mt-1 text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.userType}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                        errors.address ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="Enter your complete address"
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    About Yourself
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                        errors.description ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="Tell us about yourself, your experience, interests, etc."
                    />
                  </div>
                  {errors.description && (
                    <p className="mt-1 text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>

    
                <div className="sm:col-span-2">
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </label>

                  {formData.skills.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                        >
                          #{skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-2 w-4 h-4 rounded-full bg-blue-200 hover:bg-blue-300 flex items-center justify-center transition-colors"
                          >
                            <X className="w-2.5 h-2.5 text-blue-600" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="relative">
                    <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="skills"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillInput}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Type a skill and press Enter (e.g., Django, React, Python)"
                    />
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    Type your skills and press Enter to add them. Click the × to remove.
                  </p>
                </div>
              </div>
            ) : (
              // Business Registration Fields
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="sm:col-span-2">
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.companyName ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="Enter your company name"
                    />
                  </div>
                  {errors.companyName && (
                    <p className="mt-1 text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.companyName}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.phone ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Company Establishment Date */}
                <div>
                  <label htmlFor="estd" className="block text-sm font-medium text-gray-700 mb-2">
                    Establishment Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      id="estd"
                      name="estd"
                      value={formData.estd}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.estd ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.estd && (
                    <p className="mt-1 text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.estd}
                    </p>
                  )}
                </div>

                {/* Number of Employees */}
                <div>
                  <label htmlFor="numberOfEmployees" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Employees
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      id="numberOfEmployees"
                      name="numberOfEmployees"
                      value={formData.numberOfEmployees}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.numberOfEmployees ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select company size</option>
                      {employeeRanges.map((range) => (
                        <option key={range} value={range}>
                          {range} employees
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.numberOfEmployees && (
                    <p className="mt-1 text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.numberOfEmployees}
                    </p>
                  )}
                </div>

                {/* Company Address */}
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                        errors.address ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="Enter your company address"
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Company Description */}
                <div className="sm:col-span-2">
                  <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    About Your Company
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      id="companyDescription"
                      name="companyDescription"
                      value={formData.companyDescription}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                        errors.companyDescription ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="Describe your company, services, mission, etc."
                    />
                  </div>
                  {errors.companyDescription && (
                    <p className="mt-1 text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.companyDescription}
                    </p>
                  )}
                </div>

                {/* Company Skills */}
                <div className="sm:col-span-2">
                  <label htmlFor="companySkills" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Skills & Services
                  </label>

                  {/* Company Skills Display */}
                  {formData.companySkills.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {formData.companySkills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200"
                        >
                          #{skill}
                          <button
                            type="button"
                            onClick={() => removeCompanySkill(skill)}
                            className="ml-2 w-4 h-4 rounded-full bg-green-200 hover:bg-green-300 flex items-center justify-center transition-colors"
                          >
                            <X className="w-2.5 h-2.5 text-green-600" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="relative">
                    <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="companySkills"
                      value={companySkillInput}
                      onChange={(e) => setCompanySkillInput(e.target.value)}
                      onKeyDown={handleCompanySkillInput}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Type a service/skill and press Enter (e.g., Web Development, Marketing, Consulting)"
                    />
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    Type your company's skills/services and press Enter to add them. Click the × to remove.
                  </p>
                </div>
              </div>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.submit}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating {registrationType === "individual" ? "Profile" : "Business Profile"}...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Check className="w-5 h-5 mr-2" />
                  Complete {registrationType === "individual" ? "Registration" : "Business Registration"}
                </div>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            By completing your {registrationType} profile, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterUser
