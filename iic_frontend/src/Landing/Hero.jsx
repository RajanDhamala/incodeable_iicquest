import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate=useNavigate()
  return (
    <section className="w-full py-10 md:py-16 lg:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div className="flex flex-col space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Connecting Every <br />
              <span className="text-[#0070f3]">Skill</span> to <br />
              <span className="text-[#0CD47A]">Opportunity</span>
            </h1>

            <p className="text-base md:text-lg text-gray-600 max-w-xl">
              Join Nepal's premier platform connecting students, professionals, homemakers, and tradespeople with skill-building opportunities, gigs, and meaningful collaborations.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button className="bg-[#0070f3] text-white px-10 py-3 text-md rounded-md hover:bg-blue-600">
                Join Now
              </Button>
              <Button className="bg-[#0CD47A] text-white px-10 py-3 text-md rounded-md ">
                 Post a Gig
              </Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="border-green-500 text-green-600 px-6 py-3 text-sm rounded-md">
                 Find Internship
              </Button>
              <Button
  variant="outline"
  className="border-blue-500 text-blue-600 px-6 py-3 text-sm rounded-md"
  onClick={() => navigate("/chat")}
>
  Start Collaboration
</Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center items-center">
            <div className="relative w-[700px] h-[500px]">
              <img
                src="/side%20image.svg"
                alt="Hero Side"
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
