import { FaCheckCircle, FaLightbulb, FaUsers, FaGlobe, FaHandshake, FaRocket } from "react-icons/fa";
import { FiUsers, FiBook, FiTarget, FiArrowRight } from "react-icons/fi";
import Navigation from "../components/Navigation";
import { useEffect, useRef } from "react";

const About = () => {
  const partnersScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set up the infinite scrolling for partners
    const scrollContainer = partnersScrollRef.current;
    if (!scrollContainer) return;

    const scrollWidth = scrollContainer.scrollWidth;
    const clientWidth = scrollContainer.clientWidth;
    const scrollAmount = 1; // Pixels to scroll each frame

    let animationId: number;
    let left = 0;

    const animateScroll = () => {
      left += scrollAmount;
      
      // Reset position when scrolled all the way
      if (left >= scrollWidth / 2) {
        left = 0;
      }
      
      scrollContainer.scrollLeft = left;
      animationId = requestAnimationFrame(animateScroll);
    };

    // Start the animation
    animationId = requestAnimationFrame(animateScroll);

    // Pause animation on hover
    const pauseAnimation = () => {
      cancelAnimationFrame(animationId);
    };

    const resumeAnimation = () => {
      animationId = requestAnimationFrame(animateScroll);
    };

    scrollContainer.addEventListener('mouseenter', pauseAnimation);
    scrollContainer.addEventListener('mouseleave', resumeAnimation);

    return () => {
      cancelAnimationFrame(animationId);
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', pauseAnimation);
        scrollContainer.removeEventListener('mouseleave', resumeAnimation);
      }
    };
  }, []);

  return (
    <main className=" bg-secondary text-gray-800 min-h-screen font-sans overflow-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32  wrapper  pb-20 px-4 text-center w-full mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-800 mb-6">
          DeKUT Startup and Incubation Centre
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
          Transforming ideas into sustainable businesses through mentorship, resources, and a collaborative ecosystem.
        </p>
        <div className="mt-12 flex justify-center">
          <div className="w-24 h-1 bg-green-600 rounded-full"></div>
        </div>
      </section>

      {/* Key Offerings Section */}
      <section className="py-16 px-4 wrapper w-full mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <FaRocket className="text-4xl text-green-600" />,
              title: "Startup Support",
              description: "From idea to commercialization, we guide startups through every phase of their journey.",
              color: "green"
            },
            {
              icon: <FiTarget className="text-4xl text-blue-600" />,
              title: "Mentorship",
              description: "Gain insights from our network of experienced industry professionals and entrepreneurs.",
              color: "blue"
            },
            {
              icon: <FaHandshake className="text-4xl text-teal-600" />,
              title: "Partnerships",
              description: "Connect with strategic partners and opportunities to help your business thrive.",
              color: "teal"
            }
          ].map((item, index) => (
            <div 
              key={index}
              className={`bg-white p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 border-${item.color}-500`}
            >
              <div className="mb-6">{item.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 bg-secondary">
        <div className="wrapper mx-auto grid md:grid-cols-2 gap-12">
          <div className="p-8 bg-green-50 rounded-2xl">
            <div className="flex items-center mb-6">
              <FaLightbulb className="text-3xl text-green-600 mr-4" />
              <h2 className="text-3xl font-bold text-green-800">Our Mission</h2>
            </div>
            <p className="text-gray-700 text-lg">
              To create a cohesive environment for entrepreneurs to operate, share ideas, and improve their chances of success by providing mentorship, resources, and support to transform innovations into sustainable businesses.
            </p>
          </div>
          
          <div className="p-8 bg-blue-50 rounded-2xl">
            <div className="flex items-center mb-6">
              <FiTarget className="text-3xl text-blue-600 mr-4" />
              <h2 className="text-3xl font-bold text-blue-800">Our Vision</h2>
            </div>
            <p className="text-gray-700 text-lg">
              To be a world-class center for inspiring creativity, nurturing innovations, and commercializing ideas that contribute to national development and economic growth.
            </p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-dark/80 mb-16">Our History & Legacy</h2>
        
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">DeSIC: A Unified Ecosystem</h3>
            <p className="text-gray-700 mb-4 indent-10">
              In May 2023, DeStaC and DeHUB merged to form DeSIC, creating a cohesive environment for entrepreneurs to operate, share ideas, and improve their chances of success.
            </p>
            <p className="text-gray-700 indent-10" >
              This integration enhanced collaboration between the two centers, providing a comprehensive support system for innovators from idea generation to commercialization.
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-200">
              <h4 className="text-xl font-bold text-green-200 mb-3 flex items-center">
                <FiBook className="mr-2 " size={20} /> DeHUB Legacy
              </h4>
              <p className="text-light italic indent-2">
                Launched in March 2015, DeHUB supported innovations up to commercialization, nurturing over 100 startups with training, mentorship, and hackathons.
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
              <h4 className="text-xl font-bold text-blue-800 mb-3 flex items-center">
                <FaRocket className="mr-2" /> DeStaC Legacy
              </h4>
              <p className="text-light italic indent-2">
                Focused on enhancing the entrepreneurial ecosystem and providing incubation spaces, consulting services, and investment connections for startups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 bg-secondary">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center  mb-16">Our Core Values</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <FaUsers className="text-3xl text-green-600" />, title: "Collaboration", description: "Working together to solve real-world problems through tech and teamwork." },
              { icon: <FaLightbulb className="text-3xl text-blue-600" />, title: "Innovation", description: "We support experimentation, creativity, and learning by doing." },
              { icon: <FaCheckCircle className="text-3xl text-purple-600" />, title: "Excellence", description: "We strive to deliver quality learning experiences for every student." },
              { icon: <FiUsers className="text-3xl text-orange-600" />, title: "Inclusion", description: "Supporting innovators from diverse backgrounds and disciplines." },
              { icon: <FaGlobe className="text-3xl text-teal-600" />, title: "Impact", description: "Focusing on solutions that create real-world value and positive change." },
              { icon: <FaHandshake className="text-3xl text-red-600" />, title: "Entrepreneurship", description: "Fostering a mindset of initiative, risk-taking, and value creation." },
            ].map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Success Stories</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg border-t border-green-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Adhome</h3>
            <p className="text-gray-700 mb-6">
              A digital platform that simplifies the search for student accommodation by connecting house hunters with verified rental properties around universities and TVETs in Kenya.
            </p>
            <button className="flex items-center text-green-600 font-semibold hover:text-green-800 transition-colors">
              Learn more <FiArrowRight className="ml-2" />
            </button>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg border-t border-blue-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Veenky Naturals</h3>
            <p className="text-gray-700 mb-6">
              An innovative natural hair care solution designed to nourish and strengthen hair from root to tip while treating and strengthening hair follicles.
            </p>
            <button className="flex items-center text-green-600 font-semibold hover:text-green-800 transition-colors">
              Learn more <FiArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-secondary">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Our Team</h2>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { name: "Dr. Jane Muthoni", role: "Director", expertise: "Innovation Strategy" },
              { name: "Prof. Michael Kamau", role: "Head of Incubation", expertise: "Business Development" },
              { name: "Dr. Sarah Wanjiku", role: "Mentorship Lead", expertise: "Entrepreneurship" },
              { name: "Eng. Robert Ochieng", role: "Tech Innovation", expertise: "Product Development" },
              { name: "Ms. Grace Auma", role: "Community Manager", expertise: "Partnerships" },
              { name: "Mr. David Njeru", role: "Startup Advisor", expertise: "Investment Readiness" },
            ].map((member, index) => (
              <div key={index} className="bg-secondary/20 p-6 rounded-xl text-center shadow-md hover:shadow-lg transition-shadow">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
                    <FiUsers className="text-4xl text-gray-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-green-600 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-500">{member.expertise}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners & Communities Section */}
      <section className="py-16 px-4 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Our Partners & Communities</h2>
          
          {/* Partners Slider */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Strategic Partners</h3>
            <div 
              ref={partnersScrollRef}
              className="flex overflow-x-hidden py-4"
              style={{ scrollBehavior: 'auto' }}
            >
              {[
                { name: "IEEE", logo: "/placeholder-ieee.png" },
                { name: "Kenya National Innovation Agency", logo: "/placeholder-knia.png" },
                { name: "TechBridge Ventures", logo: "/placeholder-techbridge.png" },
                { name: "GreenTech Africa", logo: "/placeholder-greentech.png" },
                { name: "Nairobi Business Hub", logo: "/placeholder-nairobi-hub.png" },
                { name: "Innovate Kenya", logo: "/placeholder-innovate-kenya.png" },
                { name: "African Development Bank", logo: "/placeholder-afdb.png" },
                { name: "Kenya Private Sector Alliance", logo: "/placeholder-kepsa.png" },
              ].map((partner, index) => (
                <div key={index} className="flex-shrink-0 mx-6 w-48 h-24 bg-gray-100 rounded-lg flex items-center justify-center p-4 shadow-sm">
                  <div className="text-center">
                    <div className="font-bold text-gray-700">{partner.name}</div>
                  </div>
                </div>
              ))}
              
              {/* Duplicate for seamless looping */}
              {[
                { name: "IEEE", logo: "/placeholder-ieee.png" },
                { name: "Kenya National Innovation Agency", logo: "/placeholder-knia.png" },
                { name: "TechBridge Ventures", logo: "/placeholder-techbridge.png" },
                { name: "GreenTech Africa", logo: "/placeholder-greentech.png" },
                { name: "Nairobi Business Hub", logo: "/placeholder-nairobi-hub.png" },
                { name: "Innovate Kenya", logo: "/placeholder-innovate-kenya.png" },
                { name: "African Development Bank", logo: "/placeholder-afdb.png" },
                { name: "Kenya Private Sector Alliance", logo: "/placeholder-kepsa.png" },
              ].map((partner, index) => (
                <div key={`dup-${index}`} className="flex-shrink-0 mx-6 w-48 h-24 bg-gray-100 rounded-lg flex items-center justify-center p-4 shadow-sm">
                  <div className="text-center">
                    <div className="font-bold text-gray-700">{partner.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Communities Section */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Communities We Work With</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                "IEEE Student Branch",
                "School of Engineering",
                "School of Business",
                "School of Computer Science",
                "Tech Community DeKUT",
                "Innovation Club",
                "Research Center",
                "Startup Kenya Community"
              ].map((community, index) => (
                <div key={index} className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100 transition-colors">
                  <div className="font-medium text-green-800">{community}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Idea into a Business?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join DeSIC today and get access to mentorship, resources, and a community of innovators.
          </p>
          <button className="bg-white text-green-700 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition-colors">
            Get Started Today
          </button>
        </div>
      </section>
    </main>
  );
};

export default About;