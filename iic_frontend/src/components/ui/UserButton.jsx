import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, LogOut, Settings, CreditCard, Bell, ChevronDown, Loader2 } from 'lucide-react'
import { useUser, SignOutButton } from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

function UserButton({ className }) {
  const { user, isSignedIn, isLoaded } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [profileImageLoaded, setProfileImageLoaded] = useState(false)
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Reset profile image loaded state when user changes
  useEffect(() => {
    setProfileImageLoaded(false)
  }, [user?.imageUrl])

  // Loading skeleton while Clerk is loading
  if (!isLoaded) {
    return (
      <div className={cn("flex items-center space-x-3", className)}>
        <Skeleton className="w-8 h-8 rounded-full" />
        <div className="hidden md:block space-y-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-2 w-12" />
        </div>
      </div>
    )
  }

  // If user is not signed in, don't render anything
  if (!isSignedIn) {
    return null
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleImageLoad = () => {
    setProfileImageLoaded(true)
  }

  const handleImageError = () => {
    setProfileImageLoaded(true) // Still hide skeleton even if image fails to load
  }

  return (
    <div className={cn("relative", className)}>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        {/* Profile Image with Skeleton */}
        <div className="relative w-8 h-8">
          {!profileImageLoaded && (
            <Skeleton className="w-8 h-8 rounded-full absolute inset-0" />
          )}
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.fullName || 'User'}
              className={cn(
                "w-8 h-8 rounded-full border-2 border-orange-200 object-cover transition-opacity",
                profileImageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <div className="w-8 h-8 rounded-full border-2 border-orange-200 bg-orange-100 flex items-center justify-center">
              <User className="w-4 h-4 text-orange-600" />
            </div>
          )}
        </div>

        {/* User Info - Hidden on mobile */}
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-900">
            {user?.firstName || 'User'}
          </div>
          <div className="text-xs text-gray-500">
            {user?.primaryEmailAddress?.emailAddress}
          </div>
        </div>

        <ChevronDown 
          className={cn(
            "w-4 h-4 text-gray-400 transition-transform hidden md:block",
            isOpen && "transform rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 transform transition-all duration-200 ease-out opacity-100 scale-100"
        >
          {/* User Info in Dropdown - Always visible */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                {!profileImageLoaded && (
                  <Skeleton className="w-10 h-10 rounded-full absolute inset-0" />
                )}
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || 'User'}
                    className={cn(
                      "w-10 h-10 rounded-full border-2 border-orange-200 object-cover transition-opacity",
                      profileImageLoaded ? "opacity-100" : "opacity-0"
                    )}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full border-2 border-orange-200 bg-orange-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-orange-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {user?.fullName || 'User'}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {user?.primaryEmailAddress?.emailAddress}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4 mr-3 text-gray-400" />
              View Profile
            </Link>
            
            <Link
              to="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4 mr-3 text-gray-400" />
              Settings
            </Link>
            
            <Link
              to="/billing"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <CreditCard className="w-4 h-4 mr-3 text-gray-400" />
              Billing
            </Link>
            
            <Link
              to="/notifications"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Bell className="w-4 h-4 mr-3 text-gray-400" />
              Notifications
            </Link>
          </div>

          {/* Sign Out Section */}
          <div className="border-t border-gray-100 pt-1">
            <SignOutButton>
              <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserButton
