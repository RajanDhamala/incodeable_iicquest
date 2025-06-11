import { useState } from "react";
import { Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";
import axios from "axios";

export default function SkillBridgeForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    interest: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
     console.log("formdata",formData)
    const response = await axios.post('/api/LandingForm/', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
   
    if (response.status === 201 || response.status === 200) {
      setSubmitted(true);
      setFormData({ fullName: "", email: "", interest: "" });
    } else {
      console.error("Unexpected response:", response);
    }
  } catch (error) {
    console.error("Error submitting the form:", error);
  }
};


  return (
    <section className="py-12 px-6 md:px-[110px] bg-gray-50">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-6 md:mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Ready to Bridge Your Skills?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Join thousands of Nepalis who are already growing their careers and
          creating opportunities through SkillBridge.
        </p>
      </div>

      {/* Form/Image Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 max-w-6xl mx-auto">
        {/* Image Section */}
        <div className="md:w-1/2 w-full">
          <img
            src="/skillbridege.avif"
            alt="Team Collaboration"
            className="object-cover rounded-xl w-full h-full"
          />
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 w-full p-6 bg-white rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Get Started Today</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="text-gray-900 text-md pb-2" htmlFor="fullName">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full border outline-none border-gray-100 rounded-lg px-4 py-2"
              required
            />

            <label className="text-gray-900 text-md pb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="w-full outline-none border border-gray-100 rounded-lg px-4 py-2"
              required
            />

            <label className="text-gray-900 text-md pb-2" htmlFor="interest">
              I'm interested in
            </label>
            <select
              name="interest"
              value={formData.interest}
              onChange={handleChange}
              className="w-full outline-none border border-gray-100 rounded-lg px-4 py-2"
              required
            >
              <option value="">Select your interest</option>
              <option value="web-development">Web Development</option>
              <option value="data-science">Data Science</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
            </select>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold"
            >
              🚀 Join SkillBridge Now
            </button>

            {submitted && (
              <p className="text-green-600">Thank you for signing up!</p>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">
              Or connect with us on social media
            </p>
            <div className="flex justify-center space-x-4">
              <a href="#" className="text-blue-600">
                <Facebook size={28} />
              </a>
              <a href="#" className="text-pink-500">
                <Instagram size={28} />
              </a>
              <a href="#" className="text-blue-700">
                <Linkedin size={28} />
              </a>
              <a href="#" className="text-green-500">
                <MessageCircle size={28} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
