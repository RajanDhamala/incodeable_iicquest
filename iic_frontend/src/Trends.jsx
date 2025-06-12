import { useEffect, useState } from "react"
import { useUser } from "@clerk/clerk-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, AlertCircle, BarChart3, PieChartIcon, Sparkles } from "lucide-react"

const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export default function Trends() {
  const { user, isLoaded: userLoaded } = useUser()
  const [trendData, setTrendData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState("cards") // 'cards', 'bar', 'pie'

  useEffect(() => {
    const fetchTrends = async () => {
      if (!userLoaded || !user) return

      try {
        setIsLoading(true)
        const response = await fetch("api/gettrendtech/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: user.id,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch trends data")
        }

        const result = await response.json()

        if (result.success) {
          // Process the data to clean up skill names
          const processedData = result.data.map((item) => ({
            ...item,
            skill: parseSkillName(item.skill),
          }))

          setTrendData(processedData)
        } else {
          throw new Error("API returned unsuccessful response")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrends()
  }, [user, userLoaded])

  // Helper function to parse skill names from string format
  const parseSkillName = (skillString) => {
    try {
      // Handle empty array case
      if (skillString === "[]") return "Other"

      // Extract skill name from format like "['react']"
      const match = skillString.match(/\['(.+?)'\]/)
      if (match && match[1]) {
        return match[1].charAt(0).toUpperCase() + match[1].slice(1)
      }
      return skillString
    } catch (e) {
      return skillString
    }
  }

  // Format data for charts
  const chartData = trendData.map((item) => ({
    name: item.skill,
    value: item.count,
  }))

  if (!userLoaded) {
    return <LoadingState />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Market Trends
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the most in-demand skills and stay ahead of the curve with real-time market insights
          </p>
        </div>

    

        {/* Main Content */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl font-semibold text-gray-800">Latest Skills in Demand</CardTitle>
            <CardDescription className="text-base text-gray-600">
              Real-time analysis of the most sought-after skills in the market
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {isLoading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState message={error} />
            ) : trendData.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-8">
                {viewMode === "cards" && <CardsView trendData={trendData} />}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CardsView({ trendData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trendData.map((trend, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full -translate-y-10 translate-x-10"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <Badge
                variant="secondary"
                className="text-lg font-bold px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-0"
              >
                {trend.count}
              </Badge>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">{trend.skill}</h3>
            <p className="text-gray-600">Trending skill in the market</p>

            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min((trend.count / Math.max(...trendData.map((t) => t.count))) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

 
function LoadingState() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-gray-600">Loading market trends...</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-2xl bg-white p-6 shadow-lg">
            <Skeleton className="h-12 w-12 rounded-xl mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ErrorState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 bg-red-100 rounded-full mb-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:shadow-lg transition-all duration-200"
      >
        Try Again
      </button>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 bg-gray-100 rounded-full mb-4">
        <TrendingUp className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">No trends available</h3>
      <p className="text-gray-600 max-w-md">
        We're currently gathering market data. Check back soon for the latest skill trends and insights.
      </p>
    </div>
  )
}
