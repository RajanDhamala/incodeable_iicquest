import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  UserPlus,
  BadgeInfo,
  BookOpen,
  Briefcase,
  Wallet
} from "lucide-react";

const steps = [
  {
    id: 1,
    icon: <UserPlus className="text-3xl text-blue-500" />,
    title: "Sign Up",
    description: "Create your account with email, phone, or social login",
  },
  {
    id: 2,
    icon: <BadgeInfo className="text-3xl text-orange-500" />,
    title: "Build Profile",
    description: "Showcase your skills, experience, and what you're looking for",
  },
  {
    id: 3,
    icon: <BookOpen className="text-3xl text-green-500" />,
    title: "Learn",
    description: "Take micro-courses and skill tests to grow your capabilities",
  },
  {
    id: 4,
    icon: <Briefcase className="text-3xl text-blue-500" />,
    title: "Work",
    description: "Find gigs, internships, or collaborate on exciting projects",
  },
  {
    id: 5,
    icon: <Wallet className="text-3xl text-orange-500" />,
    title: "Get Paid",
    description: "Receive secure payments through eSewa, Khalti, or bank transfer",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-10 text-center bg-white">
      <h2 className="text-3xl font-bold mb-2">How It Works</h2>
      <p className="text-gray-500 mb-10 max-w-xl mx-auto">
        Get started in minutes with our simple, user-friendly process designed for everyone.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 px-4 md:px-20">
        {steps.map((step) => (
          <Card key={step.id} className="p-4 border-none shadow-none ">
            <CardContent className="flex flex-col items-center gap-2">
              <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center">
                {step.icon}
              </div>
              <h3 className="font-semibold text-lg mt-2">{step.title}</h3>
              <p className="text-sm text-gray-500">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;