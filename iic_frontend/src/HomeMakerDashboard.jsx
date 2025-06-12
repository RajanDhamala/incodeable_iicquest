import { Bell, Heart, Calendar, Star, BookOpen, Users, MessageCircle, Award, User } from "lucide-react"
import { useUser } from "@clerk/clerk-react"

function HomeMakerDashboard() {
    const {user,loading}=useUser()
  const featuresForHomemakers = [
    {
      icon: Heart,
      title: "Service Marketplace",
      description: "Offer your services to local clients",
      buttonText: "List Services",
      iconColor: "text-pink-500",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-100",
    },
    {
      icon: Calendar,
      title: "Client Management",
      description: "Manage your bookings and clients",
      buttonText: "View Bookings",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
    },
    {
      icon: Star,
      title: "Skill Showcase",
      description: "Create portfolio of your work",
      buttonText: "Build Portfolio",
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-100",
    },
  ]

  const platformFeatures = [
    {
      icon: BookOpen,
      title: "Learning Hub",
      description: "Access courses, tutorials, and skill-building resources",
      buttonText: "Browse Courses",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
    },
    {
      icon: Users,
      title: "Mentoring",
      description: "Connect with mentors or become a mentor yourself",
      buttonText: "Find Mentors",
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-100",
    },
    {
      icon: MessageCircle,
      title: "Community",
      description: "Join discussions, forums, and networking events",
      buttonText: "Join Community",
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
    },
    {
      icon: Award,
      title: "Skill Assessment",
      description: "Test your skills and get certified",
      buttonText: "Take Assessment",
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-100",
    },
  ]

  const stats = [
    {
      number: "3",
      label: "Connections",
      color: "text-blue-500",
    },
    {
      number: "2",
      label: "Completed",
      color: "text-green-500",
    },
    {
      number: "1",
      label: "In Progress",
      color: "text-orange-500",
    },
    {
      number: "5",
      label: "Achievements",
      color: "text-purple-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.fullName}!</h2>
            <p className="text-gray-600">
              You're registered as a{" "}
              <span className="bg-gray-100 px-2 py-1 rounded text-sm font-medium">Homemaker</span>
            </p>
          </div>
          <button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
            Complete Profile
          </button>
        </div>

        {/* Features for Homemakers */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Features for Homemakers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresForHomemakers.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={index}
                  className={`bg-white rounded-xl border ${feature.borderColor} p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1`}
                >
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{feature.description}</p>
                  <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200 text-sm">
                    {feature.buttonText}
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        {/* Platform Features */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Platform Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={index}
                  className={`bg-white rounded-xl border ${feature.borderColor} p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1`}
                >
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{feature.description}</p>
                  <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200 text-sm">
                    {feature.buttonText}
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        {/* Stats Section */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
                <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
          <div className="flex justify-around">
            <a href="#" className="flex flex-col items-center py-2 text-blue-600">
              <User className="w-5 h-5" />
              <span className="text-xs mt-1">Dashboard</span>
            </a>
            <a href="#" className="flex flex-col items-center py-2 text-gray-600">
              <BookOpen className="w-5 h-5" />
              <span className="text-xs mt-1">Learning</span>
            </a>
            <a href="#" className="flex flex-col items-center py-2 text-gray-600">
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs mt-1">Community</span>
            </a>
            <a href="#" className="flex flex-col items-center py-2 text-gray-600">
              <Award className="w-5 h-5" />
              <span className="text-xs mt-1">Opportunities</span>
            </a>
          </div>
        </nav>
      </main>
    </div>
  )
}

export default HomeMakerDashboard
