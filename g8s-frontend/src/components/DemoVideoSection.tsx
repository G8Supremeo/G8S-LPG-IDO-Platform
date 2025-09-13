"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  Settings,
  Download,
  Share2,
  Heart,
  MessageCircle,
  Bookmark,
  Clock,
  Users,
  Eye
} from "lucide-react";

export default function DemoVideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
  };

  const videoSteps = [
    { time: 0, title: "Welcome to G8S LPG", description: "Introduction to our platform" },
    { time: 30, title: "Connect Your Wallet", description: "Link your crypto wallet securely" },
    { time: 60, title: "Browse Available Tokens", description: "Explore G8S token options" },
    { time: 90, title: "Make Your Investment", description: "Complete your token purchase" },
    { time: 120, title: "Track Your Portfolio", description: "Monitor your investment growth" },
    { time: 150, title: "Join the Community", description: "Connect with other investors" }
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">How to Invest in G8S LPG</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Watch our comprehensive guide to learn how to invest in the future of clean energy
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
              {/* Video Placeholder */}
              <div className="relative aspect-video bg-gradient-to-br from-blue-900 to-cyan-900">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePlayPause}
                    className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all duration-300"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white ml-1" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-1" />
                    )}
                  </motion.div>
                </div>
                
                {/* Video Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Video Info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold mb-2">G8S LPG Investment Guide</h3>
                  <p className="text-gray-300 text-sm">Complete walkthrough of our investment process</p>
                </div>
              </div>

              {/* Video Controls */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showControls ? 1 : 0 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
              >
                {/* Progress Bar */}
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handlePlayPause}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white" />
                      )}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                      )}
                    </motion.button>
                    
                    <div className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <RotateCcw className="w-5 h-5 text-white" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <Settings className="w-5 h-5 text-white" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <Maximize className="w-5 h-5 text-white" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Video Engagement */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center space-x-6">
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
                <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
              </motion.button>
            </div>
          </motion.div>

          {/* Video Chapters */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Video Chapters</h3>
              <div className="space-y-3">
                {videoSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                      Math.floor(currentTime / 30) === index
                        ? "bg-blue-500/20 border border-blue-400/30"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                    onClick={() => setCurrentTime(step.time)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        Math.floor(currentTime / 30) === index
                          ? "bg-blue-500 text-white"
                          : "bg-white/10 text-gray-300"
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                        <p className="text-xs text-gray-400">{step.description}</p>
                      </div>
                      <div className="text-xs text-gray-500">{formatTime(step.time)}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Video Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Video Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">Views</span>
                  </div>
                  <span className="text-white font-semibold">12.5K</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="text-gray-300">Likes</span>
                  </div>
                  <span className="text-white font-semibold">847</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Comments</span>
                  </div>
                  <span className="text-white font-semibold">156</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Share2 className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300">Shares</span>
                  </div>
                  <span className="text-white font-semibold">89</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl transition-all duration-300"
                >
                  <Play className="w-4 h-4 text-white" />
                  <span className="text-white font-medium">Start Investing Now</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center space-x-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span className="text-white font-medium">Download Guide</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
