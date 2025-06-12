import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import {Search,MapPin,Bookmark,Users,Briefcase,Building,Clock,Star,Filter,Bell,MessageCircle,Home,User,
} from 'lucide-react';

function JobApplication() {
  const { user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;

      try {
        const res = await axios.post('/api/getjobposts/', {
          userID: user.id,
        });
        const userJobs = res.data.data.filter((job) => job.userID === user.id);
        setJobs(userJobs);
      } catch (err) {
        setError("Failed to load jobs.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  if (loading)
    return (
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-48 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (jobs.length === 0) return <p className="p-4">No job applications found.</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600 mr-8">JobConnect</div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search jobs, companies..."
                    className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Location"
                    className="pl-10 pr-4 py-2 w-48 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
            <nav className="flex items-center space-x-8">
              <a href="#" className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors">
                <Home className="w-5 h-5" />
                <span className="text-xs mt-1">Home</span>
              </a>
              <a href="#" className="flex flex-col items-center text-blue-600 font-medium">
                <Briefcase className="w-5 h-5" />
                <span className="text-xs mt-1">Jobs</span>
              </a>
              <a href="#" className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors">
                <Users className="w-5 h-5" />
                <span className="text-xs mt-1">Network</span>
              </a>
              <a href="#" className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs mt-1">Messages</span>
              </a>
              <a href="#" className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="text-xs mt-1">Notifications</span>
              </a>
              <a href="#" className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors">
                <User className="w-5 h-5" />
                <span className="text-xs mt-1">Me</span>
              </a>
            </nav>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Filter className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Filters</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Job Type</h4>
                  <div className="space-y-2">
                    {["Full-time", "Part-time", "Remote", "On-site"].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                        />
                        <span className="text-sm text-gray-600">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">{jobs.length} Jobs Available</h2>
                <p className="text-blue-100 text-sm mt-1">Find your next opportunity</p>
              </div>
              <div className="divide-y divide-gray-200">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-6 hover:bg-gray-50 transition-all duration-200 cursor-pointer border-l-4 border-transparent hover:border-blue-500 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-3">🚀</span>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                              {job.jobTitle}
                            </h3>
                            <p className="text-gray-600 flex items-center">
                              <Building className="w-4 h-4 mr-1" /> {job.user}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" /> {job.location}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" /> {job.created_at}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3 line-clamp-2">{job.jobDescription}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {job.skillsRequired.slice(0, 3).map((req, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                              >
                                {req}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="font-semibold text-green-600">{job.salaryRange}</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col items-center space-y-2">
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobApplication;
