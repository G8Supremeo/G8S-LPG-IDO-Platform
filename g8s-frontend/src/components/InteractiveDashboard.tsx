"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  TrendingDown,
  Star,
  Zap,
  Flame,
  Users,
  Eye,
  ThumbsUp,
  Bookmark,
  MoreHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX
} from "lucide-react";

export default function InteractiveDashboard() {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const stats = [
    { label: "Total Raised", value: "$2.4M", change: "+12.5%", trend: "up" },
    { label: "Active Investors", value: "1,247", change: "+8.2%", trend: "up" },
    { label: "Tokens Sold", value: "45.2M", change: "+15.3%", trend: "up" },
    { label: "Market Cap", value: "$156M", change: "-2.1%", trend: "down" }
  ];

  const activities = [
    {
      id: 1,
      user: "Alex Chen",
      action: "purchased",
      amount: "1,000 G8S",
      time: "2 minutes ago",
      avatar: "AC",
      verified: true
    },
    {
      id: 2,
      user: "Sarah Johnson",
      action: "joined the community",
      time: "5 minutes ago",
      avatar: "SJ",
      verified: false
    },
    {
      id: 3,
      user: "Mike Rodriguez",
      action: "purchased",
      amount: "5,000 G8S",
      time: "8 minutes ago",
      avatar: "MR",
      verified: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Interactive Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-900 p-8 border border-blue-400/30"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          mouseX.set(e.clientX - rect.left - rect.width / 2);
          mouseY.set(e.clientY - rect.top - rect.height / 2);
        }}
        onMouseLeave={() => {
          mouseX.set(0);
          mouseY.set(0);
        }}
        style={{ rotateX, rotateY }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0"
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold text-white mb-2"
              >
                G8S LPG Dashboard
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-blue-200"
              >
                Real-time insights and community activity
              </motion.p>
            </div>

            {/* Interactive Controls */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setVolume(!volume)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                {volume ? <Volume2 className="w-5 h-5 text-white" /> : <VolumeX className="w-5 h-5 text-white" />}
              </motion.button>
            </div>
          </div>

          {/* Live Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:border-blue-400/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-blue-200">{stat.label}</p>
                  <div className={`flex items-center space-x-1 ${
                    stat.trend === "up" ? "text-green-400" : "text-red-400"
                  }`}>
                    {stat.trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="text-xs">{stat.change}</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Interactive Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20"
      >
        <div className="flex space-x-2">
          {["overview", "activity", "analytics", "community"].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 capitalize ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Interactive Content Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0 }}
          className="lg:col-span-2 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Live Activity</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-300">Live</span>
            </div>
          </div>

          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 10 }}
                className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {activity.avatar}
                  </div>
                  {activity.verified && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <Star className="w-2 h-2 text-white fill-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-white">{activity.user}</p>
                    <span className="text-gray-400">
                      {activity.action} {activity.amount && (
                        <span className="text-blue-400 font-medium">{activity.amount}</span>
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{activity.time}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Heart className="w-4 h-4 text-gray-400 hover:text-red-400" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-gray-400 hover:text-blue-400" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Interactive Side Panel */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
          className="space-y-6"
        >
          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl transition-all duration-300"
              >
                <Zap className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Buy G8S Tokens</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center space-x-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300"
              >
                <Users className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Join Community</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center space-x-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300"
              >
                <Share2 className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Share Project</span>
              </motion.button>
            </div>
          </div>

          {/* Interactive Stats Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-bold text-white mb-4">Market Pulse</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Community Sentiment</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ delay: 1.5, duration: 1 }}
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                    />
                  </div>
                  <span className="text-green-400 text-sm font-medium">85%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Trading Volume</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "72%" }}
                      transition={{ delay: 1.7, duration: 1 }}
                      className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                    />
                  </div>
                  <span className="text-blue-400 text-sm font-medium">72%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Social Buzz</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "91%" }}
                      transition={{ delay: 1.9, duration: 1 }}
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                    />
                  </div>
                  <span className="text-purple-400 text-sm font-medium">91%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Interactive Engagement Bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
      >
        <div className="flex items-center justify-between">
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
              <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
              <span>{liked ? "Liked" : "Like"}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-gray-300 hover:bg-white/20 rounded-xl transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Comment</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-gray-300 hover:bg-white/20 rounded-xl transition-all duration-300"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
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
            <Bookmark className={`w-5 h-5 ${bookmarked ? "fill-current" : ""}`} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
