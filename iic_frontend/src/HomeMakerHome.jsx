"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {Heart,Users,Trophy,MessageCircle,Share2,Camera,Video,Calendar,Plus,ChefHat,Home,Palette,Award,Monitor,X,Send,ImageIcon,MapPin,ChevronUp,Smile,Loader2,Check,
} from "lucide-react"
import { useUser } from "@clerk/clerk-react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function HomeMaker({ userName = "Guest User", userType }) {
  const { user, loading } = useUser()
  const navigate = useNavigate()
  const { type: usrTYpe } = useParams()

  // State for image upload
  const [imgurl, setImgurl] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  // State for posts and interactions

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Maria Rodriguez",
      role: "Home Chef & Blogger",
      time: "1h",
      content:
        "Just finished teaching my online cooking class! 👩‍🍳 Today we made authentic Italian pasta from scratch. The students were amazing!",
      likes: 156,
      comments: 23,
      shares: 8,
      liked: false,
      image: null,
      commentList: [
        {
          id: 101,
          author: "Sarah Johnson",
          avatar: "SJ",
          content: "Your pasta class was incredible! Can't wait for the next one.",
          time: "45m",
          likes: 12,
        },
        {
          id: 102,
          author: "Michael Chen",
          avatar: "MC",
          content: "I've been trying to perfect my pasta technique. Any tips for beginners?",
          time: "30m",
          likes: 5,
        },
      ],
      showComments: false,
    },
    {
      id: 2,
      author: "Jennifer Kim",
      role: "Interior Designer",
      time: "3h",
      content:
        "Completed my first home makeover project! 🏠 Transforming spaces and helping families create their dream homes is so rewarding.",
      likes: 203,
      comments: 31,
      shares: 12,
      liked: false,
      image: null,
      commentList: [
        {
          id: 201,
          author: "David Wilson",
          avatar: "DW",
          content: "The before and after photos are stunning! You have such an eye for design.",
          time: "2h",
          likes: 18,
        },
        {
          id: 202,
          author: "Emma Roberts",
          avatar: "ER",
          content: "Would love to see more pictures of the kitchen transformation!",
          time: "1h",
          likes: 7,
        },
        {
          id: 203,
          author: "Alex Thompson",
          avatar: "AT",
          content: "What paint color did you use for the living room? It's perfect!",
          time: "45m",
          likes: 3,
        },
      ],
      showComments: false,
    },
  ])

  // State for new post creation
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPost, setNewPost] = useState({
    content: "",
    image: null,
    type: "text",
  })
  const [imagePreview, setImagePreview] = useState(null)

  // State for comments
  const [newComments, setNewComments] = useState({})
  const [isPostingComment, setIsPostingComment] = useState({})

  // State for user stats
  const [userStats, setUserStats] = useState({
    skillsShared: 38,
    studentsHelped: 156,
    recipesShared: 25,
    peopleHelped: 156,
    skillsTaught: 12,
    workshops: 8,
  })

  const validUserTypes = ["student", "housewife", "college"]

  if (!validUserTypes.includes(usrTYpe)) {
    navigate("/")
  }

  const getInitials = (name) => {
    if (!name || typeof name !== "string") {
      return "GU"
    }
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const communities = [
    {
      name: "Home Cooking",
      members: "8.5k",
      status: "Joined",
      color: "bg-orange-500",
      icon: ChefHat,
    },
    {
      name: "Interior Design",
      members: "6.2k",
      status: "Join",
      color: "bg-pink-500",
      icon: Home,
    },
    {
      name: "Crafts & DIY",
      members: "12.1k",
      status: "Joined",
      color: "bg-purple-500",
      icon: Palette,
    },
  ]

  // Handle post creation
  const handleCreatePost = async () => {
    if (!newPost.content.trim() && !newPost.image) return

    try {
      // Create optimistic post for UI
      const optimisticPost = {
        id: Date.now(),
        author: user?.fullName || userName,
        role: `${usrTYpe} | Skill Sharer`,
        time: "now",
        content: newPost.content,
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
        image: imagePreview,
        type: newPost.type,
        commentList: [],
        showComments: false,
        isPosting: true,
      }

      // Add optimistic post to UI
      setPosts([optimisticPost, ...posts])

      // Send to backend
      const response = await axios.post(
        "/api/addgeneralpost/",
        {
          userID: user.id,
          content: newPost.content,
          title: "123",
          image: imgurl, // Send the secure URL to backend
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      // Update post with real data from backend
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === optimisticPost.id
            ? {
                ...post,
                id: response.data.id || post.id,
                isPosting: false,
                // Add any other fields from the response
              }
            : post,
        ),
      )

      // Update user stats
      setUserStats((prev) => ({
        ...prev,
        skillsShared: prev.skillsShared + 1,
        peopleHelped: prev.peopleHelped + Math.floor(Math.random() * 5) + 1,
      }))

      // Reset form
      setNewPost({ content: "", image: null, type: "text" })
      setImagePreview(null)
      setImgurl(null)
      setShowCreatePost(false)
    } catch (error) {
      console.error("Error creating post:", error)
      // Remove failed optimistic post
      setPosts(posts.filter((post) => !post.isPosting))
      alert("Failed to create post. Please try again.")
    }
  }

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Preview the image
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
      setNewPost({ ...newPost, image: file, type: "photo" })
    }
    reader.readAsDataURL(file)

    try {
      setIsUploading(true)

      // Prepare the upload
      const cloudinaryFormData = new FormData()
      cloudinaryFormData.append("file", file)
      cloudinaryFormData.append("upload_preset", import.meta.env.VITE_PUBLIC_CLOUDINARY_UPLOAD_PRESET)
      cloudinaryFormData.append("cloud_name", import.meta.env.VITE_PUBLIC_CLOUDINARY_CLOUD_NAME)

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: cloudinaryFormData,
        },
      )

      const data = await response.json()

      if (data.secure_url) {
        setImgurl(data.secure_url)
        console.log("Image uploaded successfully:", data.secure_url)
      } else {
        console.error("Upload failed:", data)
        alert("Failed to upload image. Please try again.")
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Error uploading image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  // Handle post interactions
  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    )
  }

  // Toggle comment section visibility
  const toggleComments = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              showComments: !post.showComments,
            }
          : post,
      ),
    )
  }

  // Handle adding a new comment
  const handleAddComment = async (postId) => {
    if (!newComments[postId] || !newComments[postId].trim()) return

    try {
      setIsPostingComment({ ...isPostingComment, [postId]: true })

      // Create optimistic comment
      const newComment = {
        id: `temp-${Date.now()}`,
        author: user?.fullName || userName,
        avatar: getInitials(user?.fullName || userName),
        content: newComments[postId],
        time: "now",
        likes: 0,
        isOptimistic: true,
      }

      // Update UI optimistically
      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentList: [...post.commentList, newComment],
            comments: post.comments + 1,
            showComments: true,
          }
        }
        return post
      })

      setPosts(updatedPosts)

      // Send to backend (if needed)
      // const response = await axios.post('/api/addcomment/', {
      //   postId,
      //   userId: user.id,
      //   content: newComments[postId],
      // })

      // Clear input
      setNewComments({ ...newComments, [postId]: "" })

      // Update with real data from backend (if needed)
      // const realCommentId = response.data.id
      // setPosts(currentPosts =>
      //   currentPosts.map(post =>
      //     post.id === postId
      //       ? {
      //           ...post,
      //           commentList: post.commentList.map(comment =>
      //             comment.id === newComment.id
      //               ? { ...comment, id: realCommentId, isOptimistic: false }
      //               : comment
      //           )
      //         }
      //       : post
      //   )
      // )

      // For now, just remove the optimistic flag after a delay
      setTimeout(() => {
        setPosts((currentPosts) =>
          currentPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  commentList: post.commentList.map((comment) =>
                    comment.id === newComment.id ? { ...comment, isOptimistic: false } : comment,
                  ),
                }
              : post,
          ),
        )
      }, 1000)
    } catch (error) {
      console.error("Error adding comment:", error)
      // Revert optimistic update
      setPosts(posts)
      alert("Failed to add comment. Please try again.")
    } finally {
      setIsPostingComment({ ...isPostingComment, [postId]: false })
    }
  }

  // Handle comment like
  const handleCommentLike = (postId, commentId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentList: post.commentList.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  likes: comment.likes + 1,
                }
              }
              return comment
            }),
          }
        }
        return post
      }),
    )
  }

  const handleShare = (postId) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, shares: post.shares + 1 } : post)))
  }

  // Get user type specific content
  const getUserTypeContent = () => {
    switch (usrTYpe) {
      case "student":
        return {
          button: "Find Study Groups",
          icon: Monitor,
          placeholder: "Share your study tips, ask questions, or find study partners...",
        }
      case "housewife":
        return {
          button: "Share Recipe",
          icon: ChefHat,
          placeholder: "Share your home tips, recipes, or creative projects...",
        }
      case "college":
        return {
          button: "Post Opportunity",
          icon: Award,
          placeholder: "Post job opportunities, internships, or academic announcements...",
        }
      default:
        return {
          button: "Add Services",
          icon: Plus,
          placeholder: "Share your thoughts and connect with others...",
        }
    }
  }

  const userTypeContent = getUserTypeContent()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
                    <AvatarFallback className="bg-white text-pink-600 font-semibold">
                      {getInitials(user?.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{user?.fullName}</h3>
                    <p className="text-pink-100 text-sm">{usrTYpe} | Skill Sharer</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{userStats.skillsShared}</div>
                    <div className="text-xs text-pink-100">Skills Shared</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{userStats.studentsHelped}</div>
                    <div className="text-xs text-pink-100">People Helped</div>
                  </div>
                </div>

                <Button
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                  onClick={() => setShowCreatePost(true)}
                >
                  <userTypeContent.icon className="w-4 h-4 mr-2" />
                  {userTypeContent.button}
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="w-5 h-5 mr-2" />
                  Communities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {communities.map((community, index) => {
                  const IconComponent = community.icon
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-lg ${community.color} flex items-center justify-center shadow-lg`}
                        >
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{community.name}</div>
                          <div className="text-xs text-gray-500">{community.members} members</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={community.status === "Joined" ? "secondary" : "default"}
                        className="text-xs"
                      >
                        {community.status}
                      </Button>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Post Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-pink-100 text-pink-600">
                      {getInitials(user?.fullName || userName)}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="text"
                    placeholder={userTypeContent.placeholder}
                    className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
                    onClick={() => setShowCreatePost(true)}
                    readOnly
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:bg-blue-50"
                      onClick={() => setShowCreatePost(true)}
                    >
                      <Camera className="w-4 h-4 mr-1" />
                      Photo
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-green-600 hover:bg-green-50"
                      onClick={() => setShowCreatePost(true)}
                    >
                      <Video className="w-4 h-4 mr-1" />
                      Video
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-600 hover:bg-purple-50"
                      onClick={() => setShowCreatePost(true)}
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      Event
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowCreatePost(true)}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Share Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            {posts.map((post) => (
              <Card
                key={post.id}
                className={`shadow-lg border-0 bg-white/80 backdrop-blur-sm ${post.isPosting ? "opacity-70" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white font-semibold">
                        {post.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{post.author}</div>
                      <div className="text-xs text-gray-500">
                        {post.role} • {post.time}{" "}
                        {post.isPosting && <span className="text-blue-500">(Posting...)</span>}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-4">{post.content}</p>

                  {post.image && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt="Post content"
                        className="w-full h-auto max-h-96 object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`${
                        post.liked ? "text-red-500 bg-red-50" : "text-gray-500 hover:text-red-500 hover:bg-red-50"
                      } transition-all duration-200`}
                      onClick={() => handleLike(post.id)}
                      disabled={post.isPosting}
                    >
                      <Heart className={`w-4 h-4 mr-1 ${post.liked ? "fill-current" : ""}`} />
                      {post.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`${
                        post.showComments
                          ? "text-blue-500 bg-blue-50"
                          : "text-gray-500 hover:text-blue-500 hover:bg-blue-50"
                      } transition-all duration-200`}
                      onClick={() => toggleComments(post.id)}
                      disabled={post.isPosting}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.comments}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-green-500 hover:bg-green-50 transition-all duration-200"
                      onClick={() => handleShare(post.id)}
                      disabled={post.isPosting}
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      {post.shares}
                    </Button>
                  </div>

                  {/* Comments Section */}
                  {post.showComments && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      {/* Comment Input */}
                      <div className="flex items-center space-x-2 mb-4">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-pink-100 text-pink-600 text-xs">
                            {getInitials(user?.fullName || userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={newComments[post.id] || ""}
                            onChange={(e) => setNewComments({ ...newComments, [post.id]: e.target.value })}
                            placeholder="Write a comment..."
                            className="w-full bg-gray-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 pr-10"
                            disabled={isPostingComment[post.id]}
                          />
                          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500">
                            <Smile className="w-4 h-4" />
                          </button>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddComment(post.id)}
                          disabled={!newComments[post.id] || !newComments[post.id].trim() || isPostingComment[post.id]}
                          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-full w-8 h-8 p-0 flex items-center justify-center disabled:opacity-50"
                        >
                          {isPostingComment[post.id] ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </Button>
                      </div>

                      {/* Comments List */}
                      <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                        {post.commentList.map((comment) => (
                          <div
                            key={comment.id}
                            className={`flex space-x-2 ${comment.isOptimistic ? "animate-pulse" : "animate-fadeIn"}`}
                          >
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback
                                className={`${
                                  comment.author === (user?.fullName || userName)
                                    ? "bg-pink-100 text-pink-600"
                                    : "bg-gradient-to-br from-purple-500 to-indigo-600 text-white"
                                } text-xs`}
                              >
                                {comment.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-gray-50 rounded-2xl px-3 py-2">
                                <div className="font-medium text-xs">{comment.author}</div>
                                <p className="text-sm text-gray-700">{comment.content}</p>
                              </div>
                              <div className="flex items-center mt-1 text-xs text-gray-500 space-x-3">
                                <span>{comment.time}</span>
                                <button
                                  onClick={() => handleCommentLike(post.id, comment.id)}
                                  className="font-medium hover:text-pink-500 transition-colors"
                                  disabled={comment.isOptimistic}
                                >
                                  Like ({comment.likes})
                                </button>
                                <button
                                  className="font-medium hover:text-blue-500 transition-colors"
                                  disabled={comment.isOptimistic}
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Show More/Less Comments */}
                      {post.commentList.length > 3 && (
                        <button
                          className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                          onClick={() => toggleComments(post.id)}
                        >
                          <ChevronUp className="w-4 h-4 mr-1" />
                          Hide comments
                        </button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-orange-200 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg text-orange-700">
                  <Trophy className="w-5 h-5 mr-2" />
                  Today's Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-sm">Recipe of the Day</div>
                    <div className="text-xs text-gray-600">Share your family recipe</div>
                  </div>
                  <Progress value={60} className="h-2" />
                  <div className="text-xs text-gray-500">60% complete</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg text-green-700">
                  <Award className="w-5 h-5 mr-2" />
                  Your Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{userStats.recipesShared}</div>
                    <div className="text-xs text-gray-600">Recipes Shared</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">{userStats.peopleHelped}</div>
                    <div className="text-xs text-gray-600">People Helped</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{userStats.skillsTaught}</div>
                    <div className="text-xs text-gray-600">Skills Taught</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{userStats.workshops}</div>
                    <div className="text-xs text-gray-600">Workshops</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-lg mx-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Create Post</h3>
              <button
                onClick={() => {
                  setShowCreatePost(false)
                  setNewPost({ content: "", image: null, type: "text" })
                  setImagePreview(null)
                  setImgurl(null)
                }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-pink-100 text-pink-600">
                    {getInitials(user?.fullName || userName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-sm">{user?.fullName || userName}</div>
                  <div className="text-xs text-gray-500">{usrTYpe} | Skill Sharer</div>
                </div>
              </div>

              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder={userTypeContent.placeholder}
                className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                disabled={isUploading}
              />

              {imagePreview && (
                <div className="mt-4 relative">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => {
                      setImagePreview(null)
                      setNewPost({ ...newPost, image: null, type: "text" })
                      setImgurl(null)
                    }}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                    disabled={isUploading}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {isUploading && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-xl">
                      <div className="bg-white/90 px-4 py-2 rounded-lg flex items-center">
                        <Loader2 className="w-5 h-5 text-pink-600 animate-spin mr-2" />
                        <span className="text-sm font-medium">Uploading...</span>
                      </div>
                    </div>
                  )}

                  {imgurl && !isUploading && (
                    <div className="absolute bottom-2 right-2 bg-green-500/80 text-white text-xs px-2 py-1 rounded-lg flex items-center">
                      <Check className="w-3 h-3 mr-1" />
                      Uploaded
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  <label className={`cursor-pointer ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <div className="p-2 rounded-full hover:bg-blue-50 text-blue-600 transition-colors">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  </label>
                  <button
                    className="p-2 rounded-full hover:bg-green-50 text-green-600 transition-colors"
                    disabled={isUploading}
                  >
                    <Video className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-purple-50 text-purple-600 transition-colors"
                    disabled={isUploading}
                  >
                    <MapPin className="w-5 h-5" />
                  </button>
                </div>

                <Button
                  onClick={handleCreatePost}
                  disabled={(!newPost.content.trim() && !newPost.image) || isUploading || (newPost.image && !imgurl)}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Post
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
