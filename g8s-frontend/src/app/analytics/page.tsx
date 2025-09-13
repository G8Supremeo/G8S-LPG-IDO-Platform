"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Globe,
  Activity,
  PieChart,
  LineChart,
  Target,
  Zap,
  Flame,
  Calendar,
  Filter
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("volume");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const analyticsMetrics = [
    {
      title: "Total Volume",
      value: "$2,847,392",
      change: "+12.5%",
      changeType: "positive",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Active Users",
      value: "1,247",
      change: "+8.3%",
      changeType: "positive",
      icon: Users,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Transactions",
      value: "3,456",
      change: "+15.2%",
      changeType: "positive",
      icon: Activity,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Avg. Transaction",
      value: "$824",
      change: "-2.1%",
      changeType: "negative",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500"
    }
  ];

  const topCountries = [
    { country: "United States", percentage: 28.5, volume: "$812,000", users: 356 },
    { country: "Nigeria", percentage: 22.3, volume: "$635,000", users: 278 },
    { country: "United Kingdom", percentage: 15.7, volume: "$447,000", users: 196 },
    { country: "Germany", percentage: 12.1, volume: "$345,000", users: 151 },
    { country: "Canada", percentage: 8.9, volume: "$254,000", users: 111 },
    { country: "Others", percentage: 12.5, volume: "$356,000", users: 155 }
  ];

  const transactionTypes = [
    { type: "Token Purchases", count: 2847, percentage: 82.4, color: "from-blue-500 to-cyan-500" },
    { type: "Wallet Connections", count: 456, percentage: 13.2, color: "from-green-500 to-emerald-500" },
    { type: "Contract Interactions", count: 153, percentage: 4.4, color: "from-purple-500 to-pink-500" }
  ];

  const hourlyData = [
    { hour: "00:00", volume: 12000, users: 45 },
    { hour: "04:00", volume: 8500, users: 32 },
    { hour: "08:00", volume: 25000, users: 89 },
    { hour: "12:00", volume: 35000, users: 125 },
    { hour: "16:00", volume: 28000, users: 98 },
    { hour: "20:00", volume: 18000, users: 67 }
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
              <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
              <p className="text-gray-300">Comprehensive insights into G8S LPG IDO performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white"
              >
                <option value="24h">24 Hours</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
                <option value="90d">90 Days</option>
              </select>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white"
              >
                <option value="volume">Volume</option>
                <option value="users">Users</option>
                <option value="transactions">Transactions</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {analyticsMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium flex items-center ${
                    metric.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {metric.changeType === 'positive' ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {metric.change}
                  </div>
                  <div className="text-xs text-gray-400">vs last period</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
              <p className="text-sm text-gray-300">{metric.title}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Geographic Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Geographic Distribution</h2>
              <div className="flex items-center space-x-2 text-blue-400">
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">Global</span>
              </div>
            </div>
            <div className="space-y-4">
              {topCountries.map((country, index) => (
                <motion.div
                  key={country.country}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{country.country}</span>
                    <span className="text-gray-300">{country.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${country.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{country.volume}</span>
                    <span>{country.users} users</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Transaction Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Transaction Types</h2>
              <div className="flex items-center space-x-2 text-purple-400">
                <PieChart className="w-5 h-5" />
                <span className="text-sm font-medium">Breakdown</span>
              </div>
            </div>
            <div className="space-y-4">
              {transactionTypes.map((type, index) => (
                <motion.div
                  key={type.type}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${type.color}`} />
                    <span className="text-white font-medium">{type.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">{type.count}</div>
                    <div className="text-sm text-gray-400">{type.percentage}%</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Hourly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">24-Hour Activity</h2>
            <div className="flex items-center space-x-2 text-green-400">
              <LineChart className="w-5 h-5" />
              <span className="text-sm font-medium">Live Data</span>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4">
            {hourlyData.map((data, index) => (
              <motion.div
                key={data.hour}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="text-center"
              >
                <div className="bg-white/5 rounded-lg p-4 mb-2">
                  <div className="text-white font-semibold">${data.volume.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">{data.users} users</div>
                </div>
                <div className="text-xs text-gray-500">{data.hour}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Conversion Rate</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-2">12.4%</div>
            <p className="text-sm text-gray-300">Visitor to investor conversion</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Avg. Session</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-2">4m 32s</div>
            <p className="text-sm text-gray-300">Average session duration</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Peak Hours</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-2">12-16</div>
            <p className="text-sm text-gray-300">Highest activity period</p>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
}
