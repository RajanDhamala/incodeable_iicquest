"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, MapPin, Calendar, Phone, Code, CheckCircle, Clock } from "lucide-react"
import { useUser } from "@clerk/clerk-react"
import axios from "axios"

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { user, loading: dbload } = useUser()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const response = await axios.post(
          "/api/getprofile/",
          { userID: user.id },
          {
            headers: { "Content-Type": "application/json" },
            timeout: 10000,
          },
        )

        const data = response.data
        if (data.success) {
          setProfile(data.data)
        } else {
          throw new Error("Failed to get profile data")
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id && !dbload) {
      fetchProfile()
    }
  }, [dbload, user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || "Profile not found"}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.profilePicture || "/placeholder.svg"} />
                <AvatarFallback className="bg-blue-500 text-white text-xl">
                  {profile.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-gray-600 mt-1">{profile.email}</p>
                <div className="flex items-center mt-2 space-x-3">
                  <Badge variant="secondary">{profile.userType}</Badge>
                  {profile.verified ? (
                    <div className="flex items-center text-green-600 text-sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verified
                    </div>
                  ) : (
                    <div className="flex items-center text-amber-600 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      Pending
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="about" className="space-y-4">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{profile.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-3 text-gray-500" />
                  <span>{profile.phoneNumber}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-3 text-gray-500" />
                  <span>{profile.address}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-3 text-gray-500" />
                  <span>Born {formatDate(profile.dateOfBirth)}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-3 text-gray-500" />
                  <span>Joined {formatDate(profile.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.split(",").map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
