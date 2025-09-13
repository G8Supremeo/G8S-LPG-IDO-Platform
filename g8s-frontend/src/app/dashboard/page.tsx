"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  Wallet,
  Flame,
  Zap,
  Globe,
  Shield,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Star
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("7d");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    {
      title: "Total Raised",
      value: "$2,847,392",
      change: "+12.5%",
      changeType: "positive",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Tokens Sold",
      value: "4,271,088",
      change: "+8.3%",
      changeType: "positive",
      icon: Flame,
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Active Investors",
      value: "1,247",
      change: "+15.2%",
      changeType: "positive",
      icon: Users,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Market Cap",
      value: "$18.2M",
      change: "+5.7%",
      changeType: "positive",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500"
    }
  ];

  const recentActivity = [
    {
      type: "purchase",
      user: "0x742d...35Cc",
      amount: "50,000 G8S",
      value: "$33,333",
      time: "2 minutes ago",
      icon: ArrowUpRight,
      color: "text-green-400"
    },
    {
      type: "purchase",
      user: "0x8f3a...92Bd",
      amount: "25,000 G8S",
      value: "$16,667",
      time: "5 minutes ago",
      icon: ArrowUpRight,
      color: "text-green-400"
    },
    {
      type: "purchase",
      user: "0x1c7e...4F8a",
      amount: "100,000 G8S",
      value: "$66,667",
      time: "12 minutes ago",
      icon: ArrowUpRight,
      color: "text-green-400"
    },
    {
      type: "purchase",
      user: "0x9b2d...7E3f",
      amount: "15,000 G8S",
      value: "$10,000",
      time: "18 minutes ago",
      icon: ArrowUpRight,
      color: "text-green-400"
    }
  ];

  const topInvestors = [
    { rank: 1, address: "0x742d...35Cc", amount: "500,000 G8S", value: "$333,333" },
    { rank: 2, address: "0x8f3a...92Bd", amount: "250,000 G8S", value: "$166,667" },
    { rank: 3, address: "0x1c7e...4F8a", amount: "200,000 G8S", value: "$133,333" },
    { rank: 4, address: "0x9b2d...7E3f", amount: "150,000 G8S", value: "$100,000" },
    { rank: 5, address: "0x3a8c...6D9e", amount: "100,000 G8S", value: "$66,667" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="lg:ml-80">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-gray-300">Monitor your G8S LPG IDO performance and analytics</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white"
              >
                <option value="24h">24 Hours</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
                <option value="90d">90 Days</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change}
                  </div>
                  <div className="text-xs text-gray-400">vs last period</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-300">{stat.title}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
              <div className="flex items-center space-x-2 text-blue-400">
                <Activity className="w-5 h-5" />
                <span className="text-sm font-medium">Live</span>
              </div>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    <div>
                      <p className="text-white font-medium">{activity.user}</p>
                      <p className="text-sm text-gray-400">{activity.amount}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{activity.value}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Top Investors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Top Investors</h2>
              <div className="flex items-center space-x-2 text-yellow-400">
                <Star className="w-5 h-5" />
                <span className="text-sm font-medium">Leaderboard</span>
              </div>
            </div>
            <div className="space-y-4">
              {topInvestors.map((investor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' :
                      index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-white' :
                      index === 2 ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white' :
                      'bg-white/10 text-gray-300'
                    }`}>
                      {investor.rank}
                    </div>
                    <div>
                      <p className="text-white font-medium">{investor.address}</p>
                      <p className="text-sm text-gray-400">{investor.amount}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{investor.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Performance Overview</h2>
            <div className="flex items-center space-x-2 text-blue-400">
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm font-medium">Analytics</span>
            </div>
          </div>
          <div className="h-64 bg-white/5 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Performance chart will be displayed here</p>
              <p className="text-sm text-gray-500 mt-2">Real-time data visualization</p>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
}
