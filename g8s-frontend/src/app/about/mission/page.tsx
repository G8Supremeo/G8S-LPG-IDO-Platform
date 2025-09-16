"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Target, 
  Eye, 
  Heart, 
  Globe, 
  Zap, 
  Shield, 
  Users, 
  TrendingUp,
  Leaf,
  Flame,
  Lightbulb,
  Award
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function MissionPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const values = [
    {
      icon: Shield,
      title: "Security First",
  description: "We prioritize the security of our users\' investments with audited smart contracts and robust security measures."
    },
    {
      icon: Globe,
      title: "Global Impact",
  description: "Our mission extends beyond borders, bringing clean energy solutions to communities worldwide."
    },
    {
      icon: Users,
      title: "Community Driven",
  description: "We believe in the power of community and work together to build a sustainable energy future."
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "We continuously innovate to provide cutting-edge solutions in the clean energy sector."
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "G8S LPG Launch",
      description: "Launch of our revolutionary LPG tokenization platform",
      status: "completed"
    },
    {
      year: "2025",
      title: "Global Expansion",
      description: "Expanding to 50+ countries with local LPG partnerships",
      status: "in-progress"
    },
    {
      year: "2026",
      title: "Carbon Neutral",
      description: "Achieving carbon neutrality across all operations",
      status: "planned"
    },
    {
      year: "2027",
      title: "1B Users",
      description: "Reaching 1 billion users worldwide",
      status: "planned"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="lg:ml-80">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative py-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 mb-8"
            >
              <Flame className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Our Mission & Vision</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Powering the Future
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                        We are revolutionizing the clean energy sector by democratizing access to LPG investments 
                        through blockchain technology, creating a sustainable future for generations to come.
                      </p>
          </div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Our Mission</h2>
              </div>
              
              <p className="text-lg text-gray-300 mb-6">
                To democratize access to clean energy investments by tokenizing LPG assets, 
                making sustainable energy solutions accessible to everyone, everywhere.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">
                    <strong className="text-white">Tokenize LPG Assets:</strong> Convert physical LPG infrastructure into tradeable digital assets
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">
                    <strong className="text-white">Global Access:</strong> Enable worldwide participation in clean energy investments
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">
                    <strong className="text-white">Secure & Transparent:</strong> Provide secure, transparent, and auditable investment opportunities
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl p-8 border border-blue-400/30">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Flame className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Clean Energy Revolution</h3>
                  <p className="text-gray-300">
                    Join us in transforming how the world invests in and accesses clean energy solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Vision Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="py-20 bg-white/5"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl p-8 border border-cyan-400/30">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Eye className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Future Vision</h3>
                  <p className="text-gray-300">
                    A world where clean energy investments are accessible to everyone, 
                    creating a sustainable future for all.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Our Vision</h2>
              </div>
              
              <p className="text-lg text-gray-300 mb-6">
                To become the world&apos;s leading platform for clean energy tokenization, 
                creating a global ecosystem where sustainable energy investments drive 
                environmental and economic prosperity.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Leaf className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">
                    <strong className="text-white">Environmental Impact:</strong> Reduce carbon footprint through widespread clean energy adoption
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">
                    <strong className="text-white">Economic Growth:</strong> Create new investment opportunities and economic value
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">
                    <strong className="text-white">Community Building:</strong> Foster a global community of clean energy advocates
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we do at G8S LPG
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Roadmap Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="py-20 bg-white/5"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Journey</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Milestones in our mission to revolutionize clean energy investments
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.1 + index * 0.1 }}
                  className={`flex items-center space-x-6 ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse space-x-reverse'
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      milestone.status === 'completed' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : milestone.status === 'in-progress'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                        : 'bg-gradient-to-r from-gray-500 to-gray-600'
                    }`}>
                      <Award className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <div className={`flex-1 ${
                    index % 2 === 0 ? 'text-left' : 'text-right'
                  }`}>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl font-bold text-white">{milestone.year}</span>
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
                      <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                      <p className="text-gray-300">{milestone.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Join Our Mission
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Be part of the clean energy revolution. Invest in a sustainable future 
              while earning returns on your investment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Start Investing</span>
              </button>
              <button className="px-8 py-4 border border-blue-400/30 text-blue-300 hover:bg-blue-500/10 hover:text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Join Community</span>
              </button>
            </div>
          </div>
        </div>
      </motion.section>
      </div>
    </div>
  );
}
