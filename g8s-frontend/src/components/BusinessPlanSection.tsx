"use client";

import { motion } from "framer-motion";
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
  Truck
} from "lucide-react";

export default function BusinessPlanSection() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const businessMetrics = [
    { label: "Market Size", value: "$180B", description: "Global LPG market value", icon: Globe },
    { label: "Growth Rate", value: "4.2%", description: "Annual market growth", icon: TrendingUp },
    { label: "Target Users", value: "2.5B", description: "Global LPG consumers", icon: Users },
    { label: "Carbon Reduction", value: "40%", description: "vs traditional fuels", icon: Leaf }
  ];

  const milestones = [
    {
      phase: "Phase 1",
      title: "Platform Launch",
      timeline: "Q1 2024",
      status: "completed",
      description: "Launch G8S token and IDO platform",
      achievements: ["Smart contract deployment", "Frontend launch", "Initial token sale"]
    },
    {
      phase: "Phase 2",
      title: "Global Expansion",
      timeline: "Q2-Q3 2024",
      status: "in-progress",
      description: "Expand to 50+ countries with local partnerships",
      achievements: ["Regional partnerships", "Local compliance", "Multi-language support"]
    },
    {
      phase: "Phase 3",
      title: "Ecosystem Growth",
      timeline: "Q4 2024",
      status: "planned",
      description: "Build comprehensive LPG ecosystem",
      achievements: ["DEX integration", "Mobile app", "API marketplace"]
    },
    {
      phase: "Phase 4",
      title: "Carbon Neutral",
      timeline: "2025",
      status: "planned",
      description: "Achieve carbon neutrality across operations",
      achievements: ["Carbon offset program", "Green energy sourcing", "Sustainability reporting"]
    }
  ];

  const useCases = [
    {
      title: "Household Cooking",
      description: "Clean, efficient LPG for daily cooking needs",
      icon: "🍳",
      market: "$45B",
      users: "1.2B households"
    },
    {
      title: "Home Heating",
      description: "Reliable heating solutions for residential properties",
      icon: "🏠",
      market: "$32B",
      users: "800M homes"
    },
    {
      title: "Industrial Applications",
      description: "Powering manufacturing and industrial processes",
      icon: "🏭",
      market: "$68B",
      users: "50M facilities"
    },
    {
      title: "Transportation",
      description: "Clean fuel for vehicles and fleet operations",
      icon: "🚛",
      market: "$35B",
      users: "25M vehicles"
    }
  ];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

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
          <h2 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Business Strategy & Vision
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transforming the global LPG market through blockchain technology, 
            creating a sustainable and accessible energy ecosystem for everyone.
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
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/30 transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{metric.value}</h3>
              <p className="text-sm text-gray-300 mb-1">{metric.label}</p>
              <p className="text-xs text-blue-300">{metric.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Use Cases Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">LPG Market Applications</h3>
            <p className="text-lg text-gray-300">Diverse use cases driving global LPG demand</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-400/30 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h4 className="text-xl font-bold text-white mb-3">{useCase.title}</h4>
                <p className="text-gray-300 mb-4">{useCase.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Market Size:</span>
                    <span className="text-green-400 font-semibold">{useCase.market}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Users:</span>
                    <span className="text-blue-400 font-semibold">{useCase.users}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Roadmap Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Development Roadmap</h3>
            <p className="text-lg text-gray-300">Our journey to revolutionize the LPG market</p>
          </div>
          
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.phase}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden"
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleSection(milestone.phase)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        milestone.status === 'completed' 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                          : milestone.status === 'in-progress'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                          : 'bg-gradient-to-r from-gray-500 to-gray-600'
                      }`}>
                        {milestone.status === 'completed' ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : milestone.status === 'in-progress' ? (
                          <Clock className="w-6 h-6 text-white" />
                        ) : (
                          <Target className="w-6 h-6 text-white" />
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <span className="text-sm font-medium text-blue-400">{milestone.phase}</span>
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
                        <h4 className="text-xl font-bold text-white">{milestone.title}</h4>
                        <p className="text-gray-300">{milestone.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-400">{milestone.timeline}</span>
                      {expandedSection === milestone.phase ? (
                        <ChevronUp className="w-5 h-5 text-white" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-white" />
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
                  <div className="px-6 pb-6 border-t border-white/10">
                    <h5 className="text-sm font-medium text-gray-300 mb-3">Key Achievements:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {milestone.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
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

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20"
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">Join the Clean Energy Revolution</h3>
            <p className="text-lg text-gray-300 mb-8">
              Be part of the transformation that&apos;s making clean energy accessible to everyone, 
              everywhere. Invest in the future of sustainable energy today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>Start Investing</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border border-blue-400/30 text-blue-300 hover:bg-blue-500/10 hover:text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>Join Community</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
