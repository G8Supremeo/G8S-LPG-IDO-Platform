"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import {
  Flame,
  Zap,
  Star,
  Heart,
  Share2,
  MessageCircle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Eye,
  TrendingUp,
  Users,
  Globe,
  Leaf,
  Award,
  ChevronRight,
  Sparkles,
  Shield
} from "lucide-react";

export default function ArtisticHero() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

  const slides = [
    {
      title: "Clean Energy Revolution",
      subtitle: "Join the future of sustainable energy",
      image: "🌱",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Global Impact",
      subtitle: "Making clean energy accessible worldwide",
      image: "🌍",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Smart Investment",
      subtitle: "Tokenized LPG assets for everyone",
      image: "💎",
      color: "from-purple-500 to-pink-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const features = [
    { icon: Shield, text: "Audited Smart Contracts", color: "text-green-400" },
    { icon: Globe, text: "Global Access", color: "text-blue-400" },
    { icon: Leaf, text: "Eco-Friendly", color: "text-green-400" },
    { icon: TrendingUp, text: "Growth Potential", color: "text-purple-400" }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.4) 0%, rgba(6, 182, 212, 0.2) 50%, transparent 100%)",
              "radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.4) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 100%)",
              "radial-gradient(circle at 40% 80%, rgba(147, 51, 234, 0.4) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 100%)"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0"
        />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20"
            >
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Early Access IDO</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-6xl md:text-7xl font-bold text-white leading-tight"
            >
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                G8S LPG
              </span>
              <br />
              <span className="text-white">Token Sale</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-gray-300 max-w-lg"
            >
              Join the clean energy revolution. Invest in tokenized LPG assets and be part of 
              the sustainable future while earning attractive returns.
            </motion.p>

            {/* Interactive Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
              >
                <Zap className="w-5 h-5" />
                <span>Start Investing</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-8 py-4 border border-blue-400/30 text-blue-300 hover:bg-blue-500/10 hover:text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>Watch Demo</span>
              </motion.button>
            </motion.div>

            {/* Feature Tags */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="flex flex-wrap gap-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 hover:border-blue-400/30 transition-all duration-300"
                >
                  <feature.icon className={`w-4 h-4 ${feature.color}`} />
                  <span className="text-sm text-white">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Interactive Card */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <motion.div
              className="relative"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                mouseX.set(e.clientX - rect.left - rect.width / 2);
                mouseY.set(e.clientY - rect.top - rect.height / 2);
                setMousePosition({ x: e.clientX, y: e.clientY });
              }}
              onMouseLeave={() => {
                mouseX.set(0);
                mouseY.set(0);
              }}
              style={{ rotateX, rotateY }}
            >
              {/* Main Interactive Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center">
                      <Flame className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Live Sale</h3>
                      <p className="text-sm text-blue-300">Real-time updates</p>
                    </div>
                  </div>
                  
                  {/* Interactive Controls */}
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setVolume(!volume)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      {volume ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-white" />}
                    </motion.button>
                  </div>
                </div>

                {/* Animated Slideshow */}
                <div className="relative h-32 mb-6 overflow-hidden rounded-2xl">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                      className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].color} flex items-center justify-center`}
                    >
                      <div className="text-center text-white">
                        <div className="text-4xl mb-2">{slides[currentSlide].image}</div>
                        <h4 className="text-lg font-bold">{slides[currentSlide].title}</h4>
                        <p className="text-sm opacity-90">{slides[currentSlide].subtitle}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Slide Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentSlide ? "bg-white" : "bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-1">Progress</p>
                    <p className="text-2xl font-bold text-white">68%</p>
                    <div className="w-full bg-gray-700/50 rounded-full h-2 mt-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "68%" }}
                        transition={{ delay: 1, duration: 1.5 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-1">Price</p>
                    <p className="text-2xl font-bold text-white">666.67</p>
                    <p className="text-xs text-gray-400">PUSD per G8S</p>
                  </div>
                </div>

                {/* Interactive Engagement */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setLiked(!liked)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                        liked 
                          ? "bg-red-500/20 text-red-400 border border-red-400/30" 
                          : "bg-white/10 text-gray-300 hover:bg-white/20"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                      <span className="text-sm">{liked ? "Liked" : "Like"}</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-gray-300 hover:bg-white/20 rounded-xl transition-all duration-300"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">Comment</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-gray-300 hover:bg-white/20 rounded-xl transition-all duration-300"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm">Share</span>
                    </motion.button>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setBookmarked(!bookmarked)}
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      bookmarked 
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30" 
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    <Star className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
                  </motion.button>
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
                className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-4 h-4 text-white" />
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
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center"
              >
                <Leaf className="w-3 h-3 text-white" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
