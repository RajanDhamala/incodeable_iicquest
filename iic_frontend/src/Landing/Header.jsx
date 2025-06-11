import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <header className="w-full py-4 px-4 md:px-8 bg-white">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-gray-900">
              <span className="text-[#0070f3]">Skill</span>Bridge
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">
            About
          </Link>
          <Link href="/features" className="text-sm text-gray-600 hover:text-gray-900">
            Features
          </Link>
          <Link href="/how-it-works" className="text-sm text-gray-600 hover:text-gray-900">
            How it Works
          </Link>
          <Link href="/success-stories" className="text-sm text-gray-600 hover:text-gray-900">
            Success Stories
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 hidden md:inline-block">
            Log in
          </Link>
          <Button variant="primary">Sign Up</Button>
        </div>
      </div>
    </header>
  )
}

