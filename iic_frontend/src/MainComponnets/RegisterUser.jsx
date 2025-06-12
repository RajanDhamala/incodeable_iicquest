"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"
import {
  Upload,
  User,
  Phone,
  MapPin,
  Camera,
  Check,
  AlertCircle,
  Calendar,
  FileText,
  X,
  Plus,
  Building2,
  Users,
  Sparkles,
  CheckCircle,
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
    estd: "",
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
              estd: formData.estd,
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-2">
      <div className="w-full max-w-7xl">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="grid lg:grid-cols-5 min-h-[650px]">
            {/* Left Side - Welcome Section */}
            <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 lg:p-8 flex flex-col justify-center text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h1 className="text-xl font-bold">SkillBridge</h1>
                </div>

                <h2 className="text-2xl lg:text-3xl font-bold mb-3 leading-tight">
                  {registrationType === "individual" ? "Join Our Community" : "Register Your Business"}
                </h2>

                <p className="text-white/90 mb-6 leading-relaxed text-sm">
                  {registrationType === "individual"
                    ? "Connect with learners, share knowledge, and grow together in a supportive environment."
                    : "Showcase your business, connect with professionals, and expand your network."}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-300" />
                    <span className="text-sm text-white/90">
                      {registrationType === "individual" ? "Expert-led courses" : "Business networking"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-300" />
                    <span className="text-sm text-white/90">
                      {registrationType === "individual" ? "Connect with learners" : "Showcase services"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-300" />
                    <span className="text-sm text-white/90">
                      {registrationType === "individual" ? "Share your skills" : "Find opportunities"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-300" />
                    <span className="text-sm text-white/90">
                      {registrationType === "individual" ? "Track progress" : "Build partnerships"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-8 right-8 w-16 h-16 bg-white/10 rounded-full"></div>
              <div className="absolute bottom-8 left-8 w-12 h-12 bg-white/10 rounded-full"></div>
              <div className="absolute top-1/2 right-16 w-8 h-8 bg-white/10 rounded-full"></div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="lg:col-span-3 p-4 lg:p-6 flex flex-col justify-center">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Header */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Create Your Account</h3>
                  <p className="text-gray-600 text-sm">Fill in your details to get started</p>
                </div>

                {/* Registration Type Toggle */}
                <div className="flex justify-center mb-4">
                  <div className="flex items-center space-x-1 bg-gray-50/80 backdrop-blur-sm rounded-xl p-1 border border-gray-200/50">
                    <button
                      type="button"
                      onClick={handleRegistrationTypeToggle}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                        registrationType === "individual"
                          ? "bg-white shadow-md text-indigo-600 border border-indigo-100"
                          : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>Individual</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRegistrationTypeToggle}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                        registrationType === "business"
                          ? "bg-white shadow-md text-indigo-600 border border-indigo-100"
                          : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Business</span>
                    </button>
                  </div>
                </div>

                {/* Profile/Logo Image Upload */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                      {(registrationType === "individual" ? imagePreview : logoPreview) ? (
                        <img
                          src={registrationType === "individual" ? imagePreview : logoPreview}
                          alt={registrationType === "individual" ? "Profile" : "Company Logo"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                          {registrationType === "individual" ? (
                            <Camera className="w-6 h-6 text-gray-400" />
                          ) : (
                            <Building2 className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                      )}
                    </div>
                    <label
                      htmlFor={registrationType === "individual" ? "profile-image" : "company-logo"}
                      className="absolute bottom-0 right-0 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg"
                    >
                      {isUploading ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Upload className="w-3 h-3 text-white" />
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
                </div>

                {errors[registrationType === "individual" ? "profilePicture" : "companyLogo"] && (
                  <p className="text-red-500 text-xs text-center flex items-center justify-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors[registrationType === "individual" ? "profilePicture" : "companyLogo"]}
                  </p>
                )}

                {/* Form Fields */}
                {registrationType === "individual" ? (
                  // Individual Registration Fields
                  <div className="grid grid-cols-6 gap-3">
                    {/* Name */}
                    <div className="col-span-6">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                            errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone and DOB */}
                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                            errors.phone ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth</label>
                      <div className="relative">
                        <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                            errors.dateOfBirth ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                    </div>

                    {/* User Type */}
                    <div className="col-span-6">
                      <label className="block text-xs font-medium text-gray-700 mb-1">I am a...</label>
                      <select
                        name="userType"
                        value={formData.userType}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
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
                      {errors.userType && <p className="text-red-500 text-xs mt-1">{errors.userType}</p>}
                    </div>

                    {/* Address */}
                    <div className="col-span-6">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-2 top-2 w-4 h-4 text-gray-400" />
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={2}
                          className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none ${
                            errors.address ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                          placeholder="Enter your complete address"
                        />
                      </div>
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>

                    {/* Description */}
                    <div className="col-span-6">
                      <label className="block text-xs font-medium text-gray-700 mb-1">About Yourself</label>
                      <div className="relative">
                        <FileText className="absolute left-2 top-2 w-4 h-4 text-gray-400" />
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={2}
                          className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none ${
                            errors.description ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                          placeholder="Tell us about yourself, your experience, interests, etc."
                        />
                      </div>
                      {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    {/* Skills */}
                    <div className="col-span-6">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Skills</label>

                      {formData.skills.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-1">
                          {formData.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200"
                            >
                              #{skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="ml-1 w-3 h-3 rounded-full bg-indigo-200 hover:bg-indigo-300 flex items-center justify-center transition-colors"
                              >
                                <X className="w-2 h-2 text-indigo-600" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="relative">
                        <Plus className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={handleSkillInput}
                          className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="Type a skill and press Enter"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // Business Registration Fields
                  <div className="grid grid-cols-6 gap-3">
                    {/* Company Name */}
                    <div className="col-span-6">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Company Name</label>
                      <div className="relative">
                        <Building2 className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                            errors.companyName ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                          placeholder="Enter your company name"
                        />
                      </div>
                      {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                    </div>

                    {/* Phone and Establishment Date */}
                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Company Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                            errors.phone ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Establishment Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="date"
                          name="estd"
                          value={formData.estd}
                          onChange={handleInputChange}
                          className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                            errors.estd ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.estd && <p className="text-red-500 text-xs mt-1">{errors.estd}</p>}
                    </div>

                    {/* Number of Employees */}
                    <div className="col-span-6">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Number of Employees</label>
                      <div className="relative">
                        <Users className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          name="numberOfEmployees"
                          value={formData.numberOfEmployees}
                          onChange={handleInputChange}
                          className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
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
                        <p className="text-red-500 text-xs mt-1">{errors.numberOfEmployees}</p>
                      )}
                    </div>

                    {/* Company Address */}
                    <div className="col-span-6">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Company Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-2 top-2 w-4 h-4 text-gray-400" />
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={2}
                          className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none ${
                            errors.address ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                          placeholder="Enter your company address"
                        />
                      </div>
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>

                    {/* Company Description */}
                    <div className="col-span-6">
                      <label className="block text-xs font-medium text-gray-700 mb-1">About Your Company</label>
                      <div className="relative">
                        <FileText className="absolute left-2 top-2 w-4 h-4 text-gray-400" />
                        <textarea
                          name="companyDescription"
                          value={formData.companyDescription}
                          onChange={handleInputChange}
                          rows={2}
                          className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none ${
                            errors.companyDescription ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                          placeholder="Describe your company, services, mission, etc."
                        />
                      </div>
                      {errors.companyDescription && (
                        <p className="text-red-500 text-xs mt-1">{errors.companyDescription}</p>
                      )}
                    </div>

                    {/* Company Skills */}
                    <div className="col-span-6">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Company Skills & Services</label>

                      {formData.companySkills.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-1">
                          {formData.companySkills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"
                            >
                              #{skill}
                              <button
                                type="button"
                                onClick={() => removeCompanySkill(skill)}
                                className="ml-1 w-3 h-3 rounded-full bg-green-200 hover:bg-green-300 flex items-center justify-center transition-colors"
                              >
                                <X className="w-2 h-2 text-green-600" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="relative">
                        <Plus className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={companySkillInput}
                          onChange={(e) => setCompanySkillInput(e.target.value)}
                          onKeyDown={handleCompanySkillInput}
                          className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="Type a service/skill and press Enter"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-xs flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.submit}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating {registrationType === "individual" ? "Profile" : "Business Profile"}...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Check className="w-4 h-4 mr-2" />
                      Complete {registrationType === "individual" ? "Registration" : "Business Registration"}
                    </div>
                  )}
                </button>
              </form>

              {/* Terms */}
              <div className="text-center mt-3">
                <p className="text-xs text-gray-500">
                  By completing your {registrationType} profile, you agree to our{" "}
                  <a href="#" className="text-indigo-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-indigo-600 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterUser
