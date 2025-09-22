import  { useEffect, useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaPlay } from "react-icons/fa";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    title: "Empowering Student Success",
    subtitle: "Join the LearnHub community and unlock your potential",
    cta: "Start Learning",
    accent: "from-purple-600 via-pink-600 to-red-600"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    title: "Innovate. Learn. Grow.",
    subtitle: "Your journey to excellence starts here with expert mentors",
    cta: "Explore Courses",
    accent: "from-emerald-600 via-teal-600 to-cyan-600"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    title: "Real Learning for Real Life",
    subtitle: "Practical skills, mentorship, and community support",
    cta: "Join Community",
    accent: "from-indigo-600 via-purple-600 to-pink-600"
  },
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };


  const goToSlide = (index: number) => {
    setCurrent(index);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto play with progress tracking
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            nextSlide();
            return 0;
          }
          return prev + 0.5;
        });
      }, 50);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [current, isPlaying]);

  const handleMouseEnter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            nextSlide();
            return 0;
          }
          return prev + 0.5;
        });
      }, 50);
    }
  };

  return (
    <section 
      className="relative w-full h-[100vh] overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #000 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Slides container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-out ${
              index === current
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-110 z-0"
            }`}
          >
            {/* Background image with parallax effect */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
              style={{ 
                backgroundImage: `url(${slide.image})`,
                transform: index === current ? 'scale(1)' : 'scale(1.1)'
              }}
            />
            
            {/* Dynamic overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent z-10`} />
            
            {/* Accent gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent} opacity-20 z-20`} />
            
            {/* Content */}
            <div className="absolute inset-0 z-30 flex flex-col justify-center items-center text-center px-6">
              <div className="max-w-5xl space-y-8">
                {/* Title with stagger animation */}
                <div className="space-y-4">
                  <h2 className={`text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight transition-all duration-1000 delay-300 ${
                    index === current ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}>
                    {slide.title}
                  </h2>
                  <p className={`text-xl md:text-2xl lg:text-3xl text-white/90 font-light transition-all duration-1000 delay-500 ${
                    index === current ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}>
                    {slide.subtitle}
                  </p>
                </div>
                
                {/* CTA Button */}
                <div className={`transition-all duration-1000 delay-700 ${
                  index === current ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}>
                  <button className={`group relative px-12 py-4 bg-gradient-to-r ${slide.accent} text-white rounded-full font-semibold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <span className="relative z-10">{slide.cta}</span>
                  </button>
                </div>
                
                {/* Floating elements */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${slide.accent} rounded-full opacity-20 blur-3xl transition-all duration-1000 ${
                  index === current ? "animate-pulse" : ""
                }`}></div>
                <div className={`absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-br ${slide.accent} rounded-full opacity-10 blur-3xl transition-all duration-1000 delay-300 ${
                  index === current ? "animate-pulse" : ""
                }`}></div>
              </div>
            </div>
            
            {/* Animated particles */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-1 h-1 bg-white rounded-full opacity-60 ${
                    index === current ? "animate-pulse" : ""
                  }`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Navigation Controls */}
      <div className="absolute bottom-12 left-0 right-0 z-40">
        <div className="flex justify-center items-center space-x-6">
          {/* Progress indicators */}
          <div className="flex space-x-4">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="group focus:outline-none relative"
                aria-label={`Go to slide ${index + 1}`}
              >
                <div className={`relative w-20 h-2 rounded-full overflow-hidden transition-all duration-300 ${
                  index === current ? "bg-white/30" : "bg-white/20 hover:bg-white/25"
                }`}>
                  {index === current && (
                    <div 
                      className={`h-full bg-gradient-to-r ${slides[current].accent} rounded-full transition-all duration-300`}
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </div>
                {/* Slide preview on hover */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                  <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
                    {slide.title.split(' ').slice(0, 2).join(' ')}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Play/Pause button */}
          <button
            onClick={togglePlayPause}
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-110"
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? (
              <div className="w-4 h-4 flex space-x-1">
                <div className="w-1.5 h-4 bg-white rounded"></div>
                <div className="w-1.5 h-4 bg-white rounded"></div>
              </div>
            ) : (
              <FaPlay className="w-4 h-4 text-white ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Enhanced Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 z-40 p-4 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm transition-all duration-300 group hover:scale-110"
        aria-label="Previous slide"
      >
        <FaChevronLeft className="w-6 h-6 text-white group-hover:text-emerald-300 transition-colors duration-300" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 z-40 p-4 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm transition-all duration-300 group hover:scale-110"
        aria-label="Next slide"
      >
        <FaChevronRight className="w-6 h-6 text-white group-hover:text-emerald-300 transition-colors duration-300" />
      </button>
      
      {/* Slide counter */}
      <div className="absolute top-8 right-8 z-40 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium">
        <span className="text-emerald-300">{current + 1}</span>
        <span className="mx-2 opacity-60">/</span>
        <span className="opacity-80">{slides.length}</span>
      </div>
    </section>
  );
};

export default Carousel;