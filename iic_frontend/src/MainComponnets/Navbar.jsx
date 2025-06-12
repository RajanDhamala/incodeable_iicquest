import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {Menu,X,HandHeart,User,LogOut,Home,Zap,HelpCircle,Users,UserCircle,MessageCircle,Briefcase,} from "lucide-react"
import {SignInButton,SignOutButton,useUser,UserButton,
} from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import useUserStore from "@/Zustand/UserStore"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isSignedIn, isLoaded } = useUser()
  const location = useLocation()
  const { userType } = useUserStore((state) => state)

  const isActiveLink = (href) => location.pathname === href

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Base links
  let navLinks = [
   
  ]

  // Conditional links based on userType
  if (userType === "student") {
    console.log(userType, "typehaaaai")
    navLinks.push(
      { href: "/latestTrends", label: "Tech Trends", icon: Zap },
      { href: "/chat", label: "Chat", icon: MessageCircle },
      { href: "/mentor", label: "Mentors", icon: Briefcase }
    )
  } else if (userType === "housewife") {
    navLinks.push(
      { href: "/chat", label: "Chat", icon: MessageCircle },
      { href: "/house_wife", label: "Services", icon: HelpCircle }
    )
  } else if (userType === "college") {
    navLinks.push(
      { href: "/vaccancy-post", label: "Post Job", icon: Briefcase },
      { href: "/chat", label: "Chat", icon: MessageCircle },
      { href: "/posts", label: "View Jobs", icon: Users }
    )
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg transition-shadow">
                <HandHeart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 transition-colors">
                SkillBridge
              </span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/50",
                    isActiveLink(link.href)
                    ? "text-green-600 bg-orange-50/80 shadow-sm"
                    : "text-g-600 hover:text-green-500"
                  )}
                  >
                  <Icon className="w-4 h-4 text-blue-500" />
                  <span>{link.label}</span>
                  </Link>
                )
                })}
              </nav>

              <div className="hidden lg:flex items-center space-x-3">
                {!isLoaded ? (
                <div className="w-24 h-9 rounded-lg bg-gray-200/50 animate-pulse" />
                ) : isSignedIn ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/50 rounded-lg">
                  <UserButton />
                  </div>
                  <SignOutButton>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                  </SignOutButton>
                </div>
                ) : (
                <SignInButton>
                  <Button className="bg-blue-500 text-white shadow-lg hover:shadow-xl transition-all">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                  </Button>
                </SignInButton>
                )}
              </div>

              <button
                onClick={toggleMenu}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-orange-500 hover:bg-white/50 transition-all"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              </div>
            </div>
            </header>

            {isMenuOpen && (
            <>
              <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
              />

              <div className="fixed top-0 right-0 bottom-0 w-80 bg-white/95 backdrop-blur-xl shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-out">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <HandHeart className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg text-gray-900">SkillBridge</span>
                </div>
                <button
                onClick={toggleMenu}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
                >
                <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-6 space-y-2">
                {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                      isActiveLink(link.href)
                        ? "text-orange-600 bg-gradient-to-r from-orange-50 to-teal-50 shadow-sm border border-orange-100"
                        : "text-gray-700 hover:text-orange-500 hover:bg-gray-50"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5",
                        isActiveLink(link.href) ? "text-orange-500" : "text-gray-400"
                      )}
                    />
                    <span>{link.label}</span>
                    {isActiveLink(link.href) && (
                      <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full" />
                    )}
                  </Link>
                )
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 bg-gray-50/50">
              {!isLoaded ? (
                <div className="w-full h-12 rounded-xl bg-gray-200 animate-pulse" />
              ) : isSignedIn ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm">
                    {user?.imageUrl && (
                      <img
                        src={user.imageUrl || "/placeholder.svg"}
                        alt={user.fullName || "User"}
                        className="w-10 h-10 rounded-full border-2 border-orange-200"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.fullName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>

                  <SignOutButton>
                    <Button
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 bg-white"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </SignOutButton>
                </div>
              ) : (
                <SignInButton>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-teal-600 hover:from-orange-600 hover:to-teal-700 text-white shadow-lg">
                    <User className="w-4 h-4 mr-2" />
                    Sign In to SkillBridge
                  </Button>
                </SignInButton>
              )}
            </div>
          </div>
        </>
      )}

      <div className="h-16" />
    </>
  )
}

export default Navbar
