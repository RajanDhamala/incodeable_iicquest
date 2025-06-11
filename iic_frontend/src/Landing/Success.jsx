import React from "react";
import { Star} from "lucide-react";
import {SuccessStats} from './Successbanner'

const testimonials = [
  {
    name: "Rajan Shrestha",
    title: "Computer Science Student",
    image: "/images/rajan.jpg",
    message:
      "SkillBridge helped me find my first internship at a tech company in Kathmandu. The micro-learning modules prepared me perfectly for the interview!",
    rating: 5.0,
  },
  {
    name: "Sita Poudel",
    title: "Homemaker turned Freelancer",
    image: "/images/sita.jpg",
    message:
      "After 10 years at home, SkillBridge gave me the confidence to start freelancing. I now earn NPR 25,000 monthly from graphic design projects!",
    rating: 5.0,
  },
  {
    name: "Krishna Bahadur",
    title: "Retired Engineer, Mentor",
    image: "/images/krishna.jpg",
    message:
      "Through the mentorship program, I’ve guided 15 young engineers. It’s rewarding to share 30 years of experience and see them succeed.",
    rating: 5.0,
  },
];

export const Testimonials = () => (
  <section className="py-12 text-center bg-white">
    <h2 className="text-3xl font-bold mb-2">Success Stories</h2>
    <p className="text-gray-500 mb-10 max-w-2xl mx-auto">
      Real stories from our community members who found opportunities and
      built successful careers through SkillBridge.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-20">
      {testimonials.map((item, index) => (
        <div
          key={index}
          className="bg-gray-50 rounded-xl shadow-sm p-6 text-left"
        >
          <div className="flex items-center gap-4 mb-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">{item.title}</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-4">"{item.message}"</p>
          <div className="flex items-center gap-1 text-yellow-500">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
            <span className="text-sm text-gray-600 ml-1">{item.rating}</span>
          </div>
        </div>
      ))}
    </div>
    <SuccessStats />
  </section>
);
