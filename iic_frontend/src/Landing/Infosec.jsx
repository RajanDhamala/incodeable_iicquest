// components/InfoSection.jsx
import { Lightbulb, Link, Heart } from 'lucide-react';

const items = [
  {
    icon: <Lightbulb className="h-12 w-12 text-blue-600 bg-blue-50 px-2 rounded-md " />,
    title: 'The Problem',
    description:
      "Skilled individuals in Nepal struggle to find relevant opportunities while businesses can't connect with the right talent, especially in rural and underserved communities.",
  },
  {
    icon: <Link className="h-12 w-12 text-orange-500 bg-orange-50 px-2 rounded-md  " />,
    title: 'Our Solution',
    description:
      'A comprehensive platform that connects skills with opportunities through micro-learning, gig marketplace, internships, and collaborative projects tailored for Nepal.',
  },
  {
    icon: <Heart className="h-12 w-12 text-green-500 bg-green-50 px-2 rounded-md  " />,
    title: 'Our Mission',
    description:
      'To democratize access to skills development and economic opportunities, empowering every Nepali to reach their full potential regardless of background or location.',
  },
];

export default function InfoSection() {
  return (
    <section className="py-10 px-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <div key={idx} className="p-6  ">
              <div className="mb-4 flex justify-center  ">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
