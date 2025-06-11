import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from '@clerk/clerk-react'
import JobCard from './JobCard'

function JobApplication() {
  const { user } = useUser()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return

      try {
        const res = await axios.post('/api/getjobposts/',{
          "userID":user.id
        })
        const userJobs = res.data.data.filter(job => job.userID === user.id)
        setJobs(userJobs)
      } catch (err) {
        setError("Failed to load jobs.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [user])

  if (loading) return <p className="p-4">Loading jobs...</p>
  if (error) return <p className="p-4 text-red-600">{error}</p>
  if (jobs.length === 0) return <p className="p-4">No job applications found.</p>
  return (
    <div className="p-4 space-y-4">
      {jobs.map(job => (
       <JobCard key={job.id} jobData={job} userId={user.id}/>
      ))}
    </div>
  )
}

export default JobApplication
