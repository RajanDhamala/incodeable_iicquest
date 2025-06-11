import { Briefcase, BookOpen, Network, Users, Lightbulb, Brain, Check } from "lucide-react";

export default function KeyFeatures() {
  const features = [
    {
      icon: <Briefcase className="text-blue-500 w-6 h-6" />,
      title: "Onboarding & Profile Builder",
      description:
        "Create comprehensive profiles showcasing your skills, experiences, and aspirations with our guided setup process.",
      points: [
        "Skill assessment tools",
        "Portfolio showcase",
        "Verification badges"
      ]
    },
    {
      icon: <BookOpen className="text-orange-500 w-6 h-6" />,
      title: "Micro-Learning & Skill Tests",
      description:
        "Access bite-sized learning modules and skill assessments designed for busy schedules and varying literacy levels.",
      points: [
        "Multilingual content",
        "Offline capabilities",
        "Skill certificates"
      ]
    },
    {
      icon: <Network className="text-green-500 w-6 h-6" />,
      title: "Marketplace & Internships",
      description:
        "Explore gigs, internships, and job opportunities from verified employers across Nepal and beyond.",
      points: [
        "Remote inclusion",
        "Fair hiring system",
        "Local & remote work"
      ]
    },
    {
      icon: <Users className="text-blue-500 w-6 h-6" />,
      title: "Collaboration Hub",
      description:
        "Join idea boards, hackathons, and collaborate projects to build innovative solutions together.",
      points: [
        "Team formation",
        "Project management",
        "Innovation challenges"
      ]
    },
    {
      icon: <Lightbulb className="text-orange-500 w-6 h-6" />,
      title: "AI Suggestion Engine",
      description:
        "Get personalized recommendations for skills to learn, internships to pursue, and connections to make.",
      points: [
        "Smart matching",
        "Career pathways",
        "Market insights"
      ]
    },
    {
      icon: <Brain className="text-green-500 w-6 h-6" />,
      title: "Mentorship Pavilion",
      description:
        "Connect with experienced mentors and become a mentor yourself in your areas of expertise.",
      points: [
        "Personalized sessions",
        "Goal setting",
        "Progress tracking"
      ]
    }
  ];

  return (
    <section className="py-12 px-[110px] bg-gray-50 ">
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Key Features</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Everything you need to grow your skills, find opportunities, and build meaningful connections in one comprehensive platform.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-xl p-6 text-left">
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            <ul className="text-sm text-gray-700 space-y-2">
              {feature.points.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="text-green-500 w-4 h-4 mt-1" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
