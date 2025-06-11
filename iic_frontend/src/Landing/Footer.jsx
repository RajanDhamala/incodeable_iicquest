import {FaFacebookF,FaInstagram,FaLinkedinIn,FaXTwitter,} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* SkillBridge Column */}
        <div>
          <h3 className="text-white font-bold mb-3">SkillBridge</h3>
          <p className="text-sm mb-4">
            Connecting every skill to opportunity across Nepal. Built with{" "}
            <span className="text-red-500">❤️</span> by Team Incodeable.
          </p>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-white">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-white">
              <FaXTwitter />
            </a>
            <a href="#" className="hover:text-white">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-white">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Platform Column */}
        <div>
          <h3 className="text-white font-bold mb-3">Platform</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Find Work
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Post Projects
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Learn Skills
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Find Mentors
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Collaborate
              </a>
            </li>
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h3 className="text-white font-bold mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Safety
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Guidelines
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Bug Reports
              </a>
            </li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h3 className="text-white font-bold mb-3">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Cookie Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Accessibility
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 border-t border-gray-700 pt-4 flex flex-col sm:flex-row justify-between items-center text-sm">
        <p>© 2024 SkillBridge by Team Incodeable. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">
          Made in Nepal <span className="ml-1">🇳🇵</span>
        </p>
      </div>
    </footer>
  );
};
