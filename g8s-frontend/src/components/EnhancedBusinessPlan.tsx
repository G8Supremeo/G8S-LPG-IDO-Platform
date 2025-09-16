"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Target,
  TrendingUp,
  Users,
  Globe,
  Shield,
  Zap,
  Leaf,
  Award,
  BarChart3,
  DollarSign,
  Clock,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Star,
  Flame,
  Building,
  Truck,
  Home,
  Factory,
  Car,
  TreePine,
  Lightbulb,
  PieChart,
  LineChart,
  Activity
} from "lucide-react";

export default function EnhancedBusinessPlan() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const businessMetrics = [
    { 
      label: "Global Market Size", 
      value: "$180B", 
      description: "Total LPG market value", 
      icon: Globe,
      color: "from-blue-500 to-cyan-500",
      trend: "+4.2%"
    },
    { 
      label: "Annual Growth Rate", 
      value: "4.2%", 
      description: "Market expansion rate", 
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      trend: "+0.3%"
    },
    { 
      label: "Target Users", 
      value: "2.5B", 
      description: "Global LPG consumers", 
      icon: Users,
      color: "from-purple-500 to-pink-500",
      trend: "+2.1%"
    },
    { 
      label: "Carbon Reduction", 
      value: "40%", 
      description: "vs traditional fuels", 
      icon: Leaf,
      color: "from-teal-500 to-green-500",
      trend: "+5.2%"
    }
  ];

  const marketSegments = [
    {
      title: "Residential Cooking",
      description: "Clean LPG for household cooking needs",
      icon: Home,
      marketSize: "$45B",
      users: "1.2B households",
      growth: "+3.8%",
      color: "from-orange-500 to-red-500",
      features: ["Indoor air quality", "Cost efficiency", "Reliability"]
    },
    {
      title: "Home Heating",
      description: "Efficient heating solutions for residential properties",
      icon: Flame,
      marketSize: "$32B",
      users: "800M homes",
      growth: "+4.1%",
      color: "from-blue-500 to-cyan-500",
      features: ["Energy efficiency", "Environmental friendly", "Comfort"]
    },
    {
      title: "Industrial Applications",
      description: "Powering manufacturing and industrial processes",
      icon: Factory,
      marketSize: "$68B",
      users: "50M facilities",
      growth: "+4.5%",
      color: "from-gray-500 to-slate-500",
      features: ["High efficiency", "Process optimization", "Cost reduction"]
    },
    {
      title: "Transportation",
      description: "Clean fuel for vehicles and fleet operations",
      icon: Car,
      marketSize: "$35B",
      users: "25M vehicles",
      growth: "+5.2%",
      color: "from-green-500 to-emerald-500",
      features: ["Lower emissions", "Fuel economy", "Performance"]
    }
  ];

  const milestones = [
    {
      phase: "Phase 1",
      title: "Platform Launch & Foundation",
      timeline: "Q1 2024",
      status: "completed",
      description: "Establish core platform and initial token distribution",
      achievements: [
        "Smart contract deployment and auditing",
        "Frontend platform development",
        "Initial token sale launch",
        "Community building and marketing"
      ],
      metrics: {
        tokensSold: "50M G8S",
        raised: "$33.3M",
        users: "15K+"
      }
    },
    {
      phase: "Phase 2",
      title: "Global Expansion & Partnerships",
      timeline: "Q2-Q3 2024",
      status: "in-progress",
      description: "Expand to 50+ countries with strategic partnerships",
      achievements: [
        "Regional partnership agreements",
        "Local compliance and regulations",
        "Multi-language platform support",
        "Mobile application development"
      ],
      metrics: {
        tokensSold: "150M G8S",
        raised: "$100M",
        users: "50K+"
      }
    },
    {
      phase: "Phase 3",
      title: "Ecosystem Development",
      timeline: "Q4 2024",
      status: "planned",
      description: "Build comprehensive LPG ecosystem and integrations",
      achievements: [
        "DEX integration and liquidity pools",
        "API marketplace for developers",
        "Advanced analytics dashboard",
        "Institutional investor onboarding"
      ],
      metrics: {
        tokensSold: "250M G8S",
        raised: "$166.7M",
        users: "100K+"
      }
    },
    {
      phase: "Phase 4",
      title: "Sustainability & Innovation",
      timeline: "2025",
      status: "planned",
      description: "Achieve carbon neutrality and drive innovation",
      achievements: [
        "Carbon offset program implementation",
        "Green energy sourcing partnerships",
        "Sustainability reporting framework",
        "Research and development initiatives"
      ],
      metrics: {
        tokensSold: "300M G8S",
        raised: "$200M",
        users: "200K+"
      }
    }
  ];

  const competitiveAdvantages = [
    {
      title: "Blockchain Technology",
      description: "Transparent, secure, and efficient tokenization of LPG assets",
      icon: Shield,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Global Reach",
      description: "Access to worldwide LPG markets and consumers",
      icon: Globe,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Environmental Impact",
      description: "Promoting clean energy and reducing carbon footprint",
      icon: Leaf,
      color: "from-teal-500 to-green-500"
    },
    {
      title: "Community Driven",
      description: "Decentralized governance and community participation",
      icon: Users,
      color: "from-purple-500 to-pink-500"
    }
  ];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const tabs = [
    { id: "overview", label: "Overview & Business Plan", icon: PieChart },
    { id: "segments", label: "Market Segments", icon: BarChart3 },
    { id: "roadmap", label: "Roadmap", icon: LineChart },
    { id: "advantages", label: "Competitive Edge", icon: Star }
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 mb-6">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="text-white font-medium">Business Strategy</span>
          </div>
          
          <h2 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Overview & Business Plan
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Complete overview of the global LPG market, our business strategy, and comprehensive plan 
            to revolutionize clean energy investments through blockchain technology.
          </p>
        </motion.div>

        {/* Business Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {businessMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-green-400 text-sm font-medium">{metric.trend}</div>
                  <div className="text-xs text-gray-400">Growth</div>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{metric.value}</h3>
              <p className="text-sm text-gray-300 mb-1">{metric.label}</p>
              <p className="text-xs text-blue-300">{metric.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20 mb-12"
        >
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              {/* Market Overview */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-6">Global LPG Market Overview</h3>
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Globe className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-white mb-2">Market Size & Growth</h4>
                          <p className="text-gray-300">
                            The global LPG market is valued at $180 billion and growing at 4.2% annually. 
                            This represents a massive opportunity for tokenization and democratized investment.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-white mb-2">Consumer Base</h4>
                          <p className="text-gray-300">
                            Over 2.5 billion people worldwide use LPG for cooking, heating, and industrial applications, 
                            creating a vast and diverse market for our tokenized assets.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-white mb-2">Growth Drivers</h4>
                          <p className="text-gray-300">
                            Environmental concerns, energy security, and cost efficiency are driving increased 
                            LPG adoption, particularly in developing economies.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-8 border border-blue-400/30">
                      <h4 className="text-2xl font-bold text-white mb-6 text-center">Market Opportunity</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Total Addressable Market</span>
                          <span className="text-2xl font-bold text-white">$180B</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Serviceable Market</span>
                          <span className="text-2xl font-bold text-white">$45B</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Target Market Share</span>
                          <span className="text-2xl font-bold text-white">5%</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-4 mt-6">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "25%" }}
                            transition={{ duration: 2, delay: 1 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                          />
                        </div>
                        <p className="text-center text-sm text-gray-400 mt-2">Market Penetration Progress</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Plan Overview */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <h3 className="text-3xl font-bold text-white mb-8 text-center">G8S LPG Business Plan</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  {/* Vision */}
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-400/30">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">Our Vision</h4>
                    <p className="text-gray-300">
                      To revolutionize the global LPG market by making clean energy investments accessible 
                      to everyone through blockchain technology and tokenization.
                    </p>
                  </div>

                  {/* Mission */}
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-400/30">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">Our Mission</h4>
                    <p className="text-gray-300">
                      Democratize access to clean energy investments while promoting environmental 
                      sustainability and economic growth in underserved communities worldwide.
                    </p>
                  </div>

                  {/* Strategy */}
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-400/30">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">Our Strategy</h4>
                    <p className="text-gray-300">
                      Leverage blockchain technology to tokenize LPG assets, creating a transparent, 
                      efficient, and accessible investment platform for global clean energy markets.
                    </p>
                  </div>
                </div>

                {/* Key Objectives */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-2xl font-bold text-white mb-4">Key Objectives</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Tokenize $200M worth of LPG assets</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Reach 200K+ global investors</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Expand to 50+ countries</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Reduce carbon emissions by 40%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-2xl font-bold text-white mb-4">Value Proposition</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Secure blockchain infrastructure</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Globe className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Global market access</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Leaf className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Environmental impact</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Users className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">Community-driven governance</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "segments" && (
            <motion.div
              key="segments"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white mb-4">Market Segments Analysis</h3>
                <p className="text-lg text-gray-300">Detailed breakdown of key LPG market segments and opportunities</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {marketSegments.map((segment, index) => (
                  <motion.div
                    key={segment.title}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/30 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4 mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${segment.color} rounded-2xl flex items-center justify-center`}>
                        <segment.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white">{segment.title}</h4>
                        <p className="text-gray-300">{segment.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/5 rounded-xl p-4">
                        <p className="text-sm text-gray-400 mb-1">Market Size</p>
                        <p className="text-lg font-bold text-white">{segment.marketSize}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4">
                        <p className="text-sm text-gray-400 mb-1">Users</p>
                        <p className="text-lg font-bold text-white">{segment.users}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-300">Growth Rate</span>
                      <span className="text-green-400 font-semibold">{segment.growth}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400 mb-2">Key Features:</p>
                      {segment.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "roadmap" && (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white mb-4">Development Roadmap</h3>
                <p className="text-lg text-gray-300">Our strategic journey to revolutionize the LPG market</p>
              </div>
              
              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.phase}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden"
                  >
                    <div
                      className="p-8 cursor-pointer"
                      onClick={() => toggleSection(milestone.phase)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                            milestone.status === 'completed' 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                              : milestone.status === 'in-progress'
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                              : 'bg-gradient-to-r from-gray-500 to-gray-600'
                          }`}>
                            {milestone.status === 'completed' ? (
                              <CheckCircle className="w-8 h-8 text-white" />
                            ) : milestone.status === 'in-progress' ? (
                              <Activity className="w-8 h-8 text-white" />
                            ) : (
                              <Target className="w-8 h-8 text-white" />
                            )}
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-4 mb-2">
                              <span className="text-lg font-medium text-blue-400">{milestone.phase}</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                milestone.status === 'completed' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : milestone.status === 'in-progress'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {milestone.status.replace('-', ' ')}
                              </span>
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-2">{milestone.title}</h4>
                            <p className="text-gray-300 mb-4">{milestone.description}</p>
                            
                            {/* Metrics */}
                            <div className="grid grid-cols-3 gap-4">
                              <div className="bg-white/5 rounded-xl p-3">
                                <p className="text-xs text-gray-400 mb-1">Tokens Sold</p>
                                <p className="text-sm font-bold text-white">{milestone.metrics.tokensSold}</p>
                              </div>
                              <div className="bg-white/5 rounded-xl p-3">
                                <p className="text-xs text-gray-400 mb-1">Funds Raised</p>
                                <p className="text-sm font-bold text-white">{milestone.metrics.raised}</p>
                              </div>
                              <div className="bg-white/5 rounded-xl p-3">
                                <p className="text-xs text-gray-400 mb-1">Users</p>
                                <p className="text-sm font-bold text-white">{milestone.metrics.users}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-400">{milestone.timeline}</span>
                          {expandedSection === milestone.phase ? (
                            <ChevronUp className="w-6 h-6 text-white" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <motion.div
                      initial={false}
                      animate={{
                        height: expandedSection === milestone.phase ? "auto" : 0,
                        opacity: expandedSection === milestone.phase ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 border-t border-white/10">
                        <h5 className="text-lg font-semibold text-white mb-4">Key Achievements:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {milestone.achievements.map((achievement, idx) => (
                            <div key={idx} className="flex items-start space-x-3">
                              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-300">{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "advantages" && (
            <motion.div
              key="advantages"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white mb-4">Competitive Advantages</h3>
                <p className="text-lg text-gray-300">What sets G8S LPG apart in the market</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {competitiveAdvantages.map((advantage, index) => (
                  <motion.div
                    key={advantage.title}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-blue-400/30 transition-all duration-300 text-center"
                  >
                    <div className={`w-20 h-20 bg-gradient-to-r ${advantage.color} rounded-3xl flex items-center justify-center mx-auto mb-6`}>
                      <advantage.icon className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-4">{advantage.title}</h4>
                    <p className="text-gray-300 leading-relaxed">{advantage.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 mt-16"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-4xl font-bold text-white mb-6">Join the Clean Energy Revolution</h3>
            <p className="text-xl text-gray-300 mb-8">
              Be part of the transformation that&apos;s making clean energy accessible to everyone, 
              everywhere. Invest in the future of sustainable energy today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>Start Investing Now</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 border border-blue-400/30 text-blue-300 hover:bg-blue-500/10 hover:text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>Join Our Community</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
