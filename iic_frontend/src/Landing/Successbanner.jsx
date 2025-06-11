import { Users, CheckCircle, StarHalf } from "lucide-react";

export const SuccessStats = () => (
  <section className="bg-gradient-to-r from-blue-500 to-green-500 py-10 text-white text-center mt-12 rounded-xl mx-4 md:mx-20">
    <h3 className="text-2xl md:text-3xl font-bold">Join 10,000+ Success Stories</h3>
    <p className="mt-2 text-white/90">
      Be part of Nepal's growing community of skilled professionals and opportunity creators.
    </p>
    <div className="flex flex-col md:flex-row justify-center gap-6 mt-6 px-6">
      <div className="bg-white text-blue-600 rounded-full px-5 py-2 text-sm font-medium flex items-center gap-2">
        <Users size={16} /> 10,000+ Active Users
      </div>
      <div className="bg-white text-green-600 rounded-full px-5 py-2 text-sm font-medium flex items-center gap-2">
        <CheckCircle size={16} /> 5,000+ Projects Completed
      </div>
      <div className="bg-white text-orange-500 rounded-full px-5 py-2 text-sm font-medium flex items-center gap-2">
        <StarHalf size={16} /> 4.9/5 Average Rating
      </div>
    </div>
  </section>
);
