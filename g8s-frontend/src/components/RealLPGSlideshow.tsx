"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Circle,
  Flame,
  Home,
  Factory,
  Truck,
  Users,
  Leaf,
  Zap,
  ArrowRight
} from "lucide-react";

export default function RealLPGSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const slides = [
    {
      id: 1,
      title: "Clean Cooking Solutions",
      subtitle: "LPG for Healthy Family Meals",
      description: "Transform your kitchen with clean, efficient LPG cooking. Reduce indoor air pollution and create healthier meals for your family with our sustainable energy solution.",
      image: "/images/lpg/cooking.jpg",
      category: "Household",
      stats: "1.2B households worldwide",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-900/20 to-red-900/20"
    },
    {
      id: 2,
      title: "Efficient Home Heating",
      subtitle: "Comfortable Living with LPG",
      description: "Keep your home warm and cozy with reliable LPG heating systems. Energy-efficient, cost-effective, and environmentally friendly heating solutions for modern homes.",
      image: "/images/lpg/heating.jpg",
      category: "Residential",
      stats: "800M homes globally",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-900/20 to-cyan-900/20"
    },
    {
      id: 3,
      title: "Industrial Power",
      subtitle: "LPG for Manufacturing Excellence",
      description: "Power your industrial operations with clean LPG energy. From manufacturing to processing, LPG provides reliable, efficient energy for industrial applications.",
      image: "/images/lpg/industrial.jpg",
      category: "Industrial",
      stats: "50M facilities worldwide",
      color: "from-gray-500 to-slate-500",
      bgColor: "from-gray-900/20 to-slate-900/20"
    },
    {
      id: 4,
      title: "Clean Transportation",
      subtitle: "LPG Fuel for Vehicles",
      description: "Drive cleaner with LPG-powered vehicles. Reduce emissions, lower fuel costs, and contribute to a cleaner environment with our transportation fuel solutions.",
      image: "/images/lpg/transportation.jpg",
      category: "Transportation",
      stats: "25M vehicles globally",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-900/20 to-emerald-900/20"
    },
    {
      id: 5,
      title: "Rural Energy Access",
      subtitle: "Bringing Power to Remote Areas",
      description: "Connect rural communities with reliable LPG energy. Our solutions bring clean energy to remote areas, improving quality of life and economic opportunities.",
      image: "/images/lpg/rural.jpg",
      category: "Rural Development",
      stats: "500M rural residents",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-900/20 to-pink-900/20"
    },
    {
      id: 6,
      title: "Environmental Impact",
      subtitle: "Reducing Carbon Footprint",
      description: "Join the fight against climate change with LPG. Our clean energy solutions help reduce carbon emissions and create a more sustainable future for generations to come.",
      image: "/images/lpg/environmental.jpg",
      category: "Sustainability",
      stats: "40% less emissions",
      color: "from-teal-500 to-green-500",
      bgColor: "from-teal-900/20 to-green-900/20"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && !isHovered) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, isHovered, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative w-full h-[700px] overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
      
      {/* Dynamic Background */}
      <motion.div
        key={currentSlide}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.bgColor}`}
      />

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Category Badge */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20"
              >
                <Flame className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">{currentSlideData.category}</span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl font-bold text-white leading-tight"
              >
                {currentSlideData.title}
              </motion.h1>

              {/* Subtitle */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className={`text-2xl font-semibold bg-gradient-to-r ${currentSlideData.color} bg-clip-text text-transparent`}
              >
                {currentSlideData.subtitle}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-lg text-gray-300 leading-relaxed max-w-lg"
              >
                {currentSlideData.description}
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-semibold">{currentSlideData.stats}</span>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-4 bg-gradient-to-r ${currentSlideData.color} hover:opacity-90 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2`}
                >
                  <Flame className="w-5 h-5" />
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Users className="w-5 h-5" />
                  <span>Join Community</span>
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Content - Real Image */}
            <motion.div
              key={`visual-${currentSlide}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative">
                {/* Main Image */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl"
                >
                  <img
                    src={currentSlideData.image}
                    alt={currentSlideData.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to a gradient background if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.style.background = `linear-gradient(135deg, ${currentSlideData.color.replace('from-', '').replace('to-', ', ')})`;
                    }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Image Badge */}
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-sm font-medium">Real LPG Usage</span>
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Zap className="w-8 h-8 text-white" />
                </motion.div>
                
                <motion.div
                  animate={{
                    y: [0, 15, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Leaf className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-50">
        {/* Play/Pause Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer shadow-lg"
          style={{ pointerEvents: 'auto' }}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white" />
          )}
        </motion.button>

        {/* Slide Indicators */}
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide ? "bg-white scale-125 shadow-lg" : "bg-white/30 hover:bg-white/50 hover:scale-110"
              }`}
              style={{ pointerEvents: 'auto' }}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevSlide}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer shadow-lg"
            style={{ pointerEvents: 'auto' }}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextSlide}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer shadow-lg"
            style={{ pointerEvents: 'auto' }}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <motion.div
          key={currentSlide}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 6, ease: "linear" }}
          className="h-full bg-gradient-to-r from-blue-400 to-cyan-400"
        />
      </div>
    </div>
  );
}
