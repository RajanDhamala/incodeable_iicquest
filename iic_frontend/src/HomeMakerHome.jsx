import {Card,CardContent,CardHeader,CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {Heart,Users,Trophy,MessageCircle,Share2,Camera,Video,Calendar,Plus,ChefHat,Home,Palette,Award,Monitor
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function HomeMaker({ userName = "Guest User", userType }) {

  const navigate=useNavigate()

  const {user,loading}=useUser()
  const {type:usrTYpe}=useParams()

  const validUserTypes = ["student", "housewife", "college"];

if (!validUserTypes.includes(usrTYpe)) {
  navigate('/')
}

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') {
      return 'GU';
    }
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const posts = [
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
    },
  ];

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
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          
          <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white">
  <CardContent className="p-6">
    <div className="flex items-center space-x-3 mb-4">
      <Avatar className="h-12 w-12 border-2 border-white">
        <AvatarFallback className="bg-white text-pink-600 font-semibold">
          {getInitials(user?.fullName)}
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-semibold text-lg">{user?.fullName}</h3>
        <p className="text-pink-100 text-sm">
          {usrTYpe} | Skill Sharer
        </p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="text-center">
        <div className="text-2xl font-bold">38</div>
        <div className="text-xs text-pink-100">Skills Shared</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">156</div>
        <div className="text-xs text-pink-100">Students Helped</div>
      </div>
    </div>

    {/* Conditionally render button based on usrTYpe */}
    {usrTYpe === "student" && (
      <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
        <Monitor className="w-4 h-4 mr-2" />
        Collaborate
      </Button>
    )}

    {usrTYpe === "housewife" && (
      <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
        Right Now
      </Button>
    )}

    {usrTYpe === "college" && (
      <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
        Post Vacancy
      </Button>
    )}

    {/* Optional: fallback if no matching usrTYpe */}
    {!["student", "housewife", "college"].includes(usrTYpe) && (
      <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
        Add Services
      </Button>
    )}
  </CardContent>
</Card>


          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Users className="w-5 h-5 mr-2" />
                Communities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {communities.map((community, index) => {
                const IconComponent = community.icon;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-lg ${community.color} flex items-center justify-center`}
                      >
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {community.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {community.members} members
                        </div>
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
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-pink-100 text-pink-600">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
                <input
                  type="text"
                  placeholder="Share your home tips, recipes, or creative projects..."
                  className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    <Camera className="w-4 h-4 mr-1" />
                    Photo
                  </Button>
                  <Button variant="ghost" size="sm" className="text-green-600">
                    <Video className="w-4 h-4 mr-1" />
                    Video
                  </Button>
                  <Button variant="ghost" size="sm" className="text-purple-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    Event
                  </Button>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Share Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {post.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{post.author}</div>
                    <div className="text-xs text-gray-500">
                      {post.role} • {post.time}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-4">{post.content}</p>

                <div className="flex items-center justify-between pt-3 border-t">
                  <Button variant="ghost" size="sm" className="text-red-500">
                    <Heart className="w-4 h-4 mr-1" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-blue-500">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-green-500">
                    <Share2 className="w-4 h-4 mr-1" />
                    {post.shares}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-orange-200">
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
                  <div className="text-xs text-gray-600">
                    Share your family recipe
                  </div>
                </div>
                <Progress value={60} className="h-2" />
                <div className="text-xs text-gray-500">60% complete</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg text-green-700">
                <Award className="w-5 h-5 mr-2" />
                Your Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">25</div>
                  <div className="text-xs text-gray-600">Recipes Shared</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">156</div>
                  <div className="text-xs text-gray-600">People Helped</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <div className="text-xs text-gray-600">Skills Taught</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-xs text-gray-600">Workshops</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}