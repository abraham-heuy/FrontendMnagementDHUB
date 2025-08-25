import { useNavigate } from "react-router-dom";
import heroImg from "../assets/react.svg"; // replace with your image

const Hero = () => {
  const navigate=useNavigate()

  return (
    <section className="w-full h-full bg-secondary mt-20 py-16 px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center justify-between">
      {/* Left Content */}
      <div className="flex-1 space-y-6 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 leading-tight">
          Dedan Kimathi <br /> Startup & Incubation Centre
        </h1>
        <p className="text-gray-700 text-lg md:text-xl max-w-xl mx-auto md:mx-0">
          Empowering students and innovators with resources, mentorship, and
          opportunities to bring their startup ideas to life.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <button 
          onClick={()=> navigate("/apply")}
          className="px-6 py-3 bg-green-700 text-white rounded-xl cursor-pointer shadow-md hover:bg-green-800 transition">
            Apply Now
          </button>
          <button className="px-6 py-3 border border-green-700 text-green-700 rounded-xl hover:bg-green-100 transition">
            Learn More
          </button>
        </div>
      </div>

      {/* Right Image */}
      <div className="flex-1 mt-10 md:mt-0 flex justify-center">
        <img
          src={heroImg}
          alt="DeSIC Innovation"
          className="w-full max-w-md md:max-w-lg lg:max-w-xl object-contain"
        />
      </div>
    </section>
  );
};

export default Hero;
