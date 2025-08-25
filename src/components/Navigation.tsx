import { Link } from "react-router-dom";
import { NavbarMenu } from "../data/data";
import { useEffect, useState } from "react";
import { FiX as X, FiMenu as Menu, FiChevronDown } from "react-icons/fi";
import logo from '../assets/images/Logo.png';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const toggleDropdown = (id: number) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/50 backdrop-blur-md shadow-md py-2"
          : "bg-secondary shadow-sm py-2 backdrop-blur-md "
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl shadow-2xs backdrop-blur-md">
            <img src={logo} alt="logo" className="w-24 h-12 rounded-2xl object-contain" />
            {/* <span
              className={`text-sm font-bold tracking-wide transition-colors duration-300 ${
                scrolled ? "text-green-700" : "text-dark"
              }`}
            >
              DeSIC
            </span> */}
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:justify-center md:flex-1">
            <ul className="flex space-x-4 lg:space-x-8">
              {NavbarMenu.map((item) => (
                <li key={item.id} className="relative group">
                  {item.children ? (
                    <>
                      <button
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                          scrolled
                            ? "text-gray-700 hover:bg-green-50"
                            : "text-dark hover:bg-white/10"
                        }`}
                      >
                        <item.icon size={18} />
                        {item.title}
                        <FiChevronDown
                          size={16}
                          className="transition-transform group-hover:rotate-180"
                        />
                      </button>
                      {/* Dropdown */}
                      <ul
                        className={`absolute left-1/2 transform -translate-x-1/2 mt-1 w-44 bg-white shadow-lg rounded-md p-2 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 ${
                          scrolled ? "shadow-md" : "shadow-xl"
                        }`}
                      >
                        {item.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              to={child.link}
                              className="block px-4 py-2.5 text-gray-700 rounded-md hover:bg-green-50 hover:text-green-600 transition-colors"
                            >
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link
                      to={item.link}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                        scrolled
                          ? "text-gray-700 hover:bg-green-50"
                          : "text-dark hover:bg-white/10"
                      }`}
                    >
                      <item.icon size={18} />
                      {item.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Sign In Button */}
          <div className="hidden md:flex">
            <Link
              to="/signIn"
              className={`ml-6 px-5 py-2 rounded-full font-medium transition-colors duration-300 ${
                scrolled
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-white text-green-700 hover:bg-gray-100"
              }`}
            >
              Sign In
            </Link>
          </div>

          {/* Mobile menu Button */}
          <div className="md:hidden">
            <button
              className={`rounded-md p-2 ${
                scrolled
                  ? "text-gray-700 bg-gray-100 hover:bg-gray-200"
                  : "text-dark cursor-pointer bg-white/10 hover:bg-white/20"
              }`}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isOpen ? "max-h-screen" : "max-h-0"
          } ${
            scrolled
              ? "bg-white/90 shadow-2xl mx-3 rounded-2xl"
              : "bg-primary/20 mx-3 rounded-2xl"
          }`}
        >
          <ul className="px-4 pt-2 pb-4 space-y-1">
            {NavbarMenu.map((item) => (
              <li key={item.id} className="border-b border-white/10 last:border-0">
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.id)}
                      className={`flex justify-between items-center w-full text-left py-3 ${
                        scrolled ? "text-gray-700" : "text-dark hover:bg-dark/20 px-2 rounded-md"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <item.icon size={18} />
                        {item.title}
                      </span>
                      <FiChevronDown
                        size={16}
                        className={`transform transition ${
                          activeDropdown === item.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {activeDropdown === item.id && (
                      <ul className="ml-6 mb-3 space-y-2.5">
                        {item.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              to={child.link}
                              className={`block py-2 pl-3 rounded-md ${
                                scrolled
                                  ? "text-gray-600 hover:bg-green-50"
                                  : "text-dark/80 hover:bg-green-200/20"
                              }`}
                              onClick={() => setIsOpen(false)}
                            >
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.link}
                    className={`flex items-center gap-2 py-3 ${
                      scrolled ? "text-gray-700" : "text-dark px-2 hover:bg-dark/20 rounded-md"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon size={18} />
                    {item.title}
                  </Link>
                )}
              </li>
            ))}

            {/* Mobile Sign In Button */}
            <li className="pt-2">
              <Link
                to="/signIn"
                className={`block w-full text-center px-5 py-2 rounded-full font-medium transition-colors duration-300 ${
                  scrolled
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-white text-green-700 hover:bg-gray-100"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
