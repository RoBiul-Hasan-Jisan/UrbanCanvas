import SocialMediaFooter from "./SocialMediaFooter";
import { HiChevronDown } from "react-icons/hi2";

const Footer = () => {
  const footerSections = [
    {
      title: "Client Service",
      links: ["After-sale Service", "Free Insurance", "Contact Us", "FAQ", "Shipping Info", "Returns"],
    },
    {
      title: "Our Brand",
      links: ["The Company", "The Excellence", "International Awards", "Our Story", "Sustainability", "Careers"],
    },
    {
      title: "Luxury Clothing",
      links: ["Special Edition", "Summer Collection", "Winter Collection", "New Arrivals", "Lookbook", "Size Guide"],
    },
    {
      title: "Customer Care",
      links: ["Store Locator", "Personal Shopping", "Alterations", "Gift Cards", "Wedding Service", "Contact Support"],
    },
  ];

  const legalLinks = ["Cookie Policy", "Privacy Policy", "Legal Notes", "Terms of Service", "Accessibility"];

  return (
    <>
      <SocialMediaFooter />
      <footer className="bg-black text-gray-200">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto pt-16 pb-12 px-6 md:px-8 lg:px-12">
          {/* Top Section - Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">
            {footerSections.map((section, index) => (
              <div key={index} className="group">
                <h3 className="text-lg font-semibold mb-6 text-white tracking-wide border-b border-gray-700 pb-2 group-hover:border-white transition-colors duration-300">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white cursor-pointer transition-all duration-200 hover:pl-2 block py-1 border-l-2 border-transparent hover:border-white"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Subscription */}
          <div className="bg-gray-900 rounded-lg p-8 mb-12 text-center">
            <h3 className="text-2xl font-light text-white mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Subscribe to receive updates on new collections, exclusive offers, and style inspiration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors duration-200"
              />
              <button className="px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 my-8"></div>

          {/* Bottom Section */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Side - Brand */}
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-light tracking-[6px] text-white mb-4">
                UrbanCanvas
              </h2>
              <p className="text-gray-400 text-sm max-w-md">
                Crafting timeless elegance through exceptional design and unparalleled quality since 2010.
              </p>
            </div>

            {/* Right Side - Legal & Language */}
            <div className="flex flex-col items-center lg:items-end gap-6">
              {/* Language Selector */}
              <div className="relative group">
                <button className="flex items-center gap-2 text-gray-300 group-hover:text-white transition-colors duration-200 px-4 py-2 border border-gray-700 rounded-lg hover:border-white">
                  <span>Worldwide / English</span>
                  <HiChevronDown className="group-hover:rotate-180 transition-transform duration-200" />
                </button>
              </div>

              {/* Legal Links */}
              <ul className="flex flex-wrap justify-center lg:justify-end gap-4 md:gap-6 text-sm text-gray-400">
                {legalLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="hover:text-white cursor-pointer transition-colors duration-200 hover:underline"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Copyright */}
              <p className="text-gray-500 text-sm text-center lg:text-right">
                © {new Date().getFullYear()} UrbanCanvas. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Security Badges */}
        <div className="bg-gray-900 py-4 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm">
              <span>SSL Secured</span>
              <span>•</span>
              <span>Trusted Partner</span>
              <span>•</span>
              <span>Secure Payments</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;