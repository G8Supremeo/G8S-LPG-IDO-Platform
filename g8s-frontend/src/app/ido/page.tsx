"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Flame,
  Zap,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  Shield,
  Globe,
  Star,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Play,
  Pause
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import IDOPurchase from "@/components/IDOPurchase";

export default function IDOSale() {
  const [isSaleActive, setIsSaleActive] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 45,
    hours: 12,
    minutes: 30,
    seconds: 15
  });

  const saleStats = [
    {
      label: "Total Supply",
      value: "1,000,000,000",
      unit: "G8S",
      description: "Maximum token supply"
    },
    {
      label: "IDO Allocation",
      value: "300,000,000",
      unit: "G8S",
      description: "30% of total supply"
    },
    {
      label: "Price per Token",
      value: "2333",
      unit: "PUSD",
      description: "Fixed price during IDO"
    },
    {
      label: "Minimum Purchase",
      value: "1,000",
      unit: "G8S",
      description: "Minimum investment amount"
    }
  ];

  const salePhases = [
    {
      phase: "Phase 1",
      title: "Early Bird",
      status: "completed",
      discount: "6%",
      price: "2200 PUSD",
      allocation: "50M G8S",
      description: "Exclusive early access with discount"
    },
    {
      phase: "Phase 2",
      title: "Public Sale",
      status: "active",
      discount: "0%",
      price: "2333 PUSD",
      allocation: "200M G8S",
      description: "Open to all investors at standard price"
    },
    {
      phase: "Phase 3",
      title: "Final Round",
      status: "upcoming",
      discount: "0%",
      price: "2333 PUSD",
      allocation: "50M G8S",
      description: "Final opportunity to participate"
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Audited Smart Contracts",
      description: "All contracts have been professionally audited for security"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Available to investors worldwide with no restrictions"
    },
    {
      icon: TrendingUp,
      title: "Growth Potential",
      description: "Early access to a revolutionary clean energy platform"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join a growing community of clean energy advocates"
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
        
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 mb-6">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-white font-medium">IDO Sale</span>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
            G8S Token Sale
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Participate in the revolutionary G8S LPG token sale and be part of the clean energy future. 
            Limited time offer with exclusive benefits for early investors.
          </p>
        </motion.div>

        {/* Sale Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-4 h-4 rounded-full ${isSaleActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                <span className={`text-lg font-semibold ${isSaleActive ? 'text-green-400' : 'text-red-400'}`}>
                  {isSaleActive ? 'Sale Active' : 'Sale Paused'}
                </span>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">Sale Progress</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Tokens Sold</span>
                  <span className="text-2xl font-bold text-white">127,450,000 G8S</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Funds Raised</span>
                  <span className="text-2xl font-bold text-white">$84,966,667</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "42.5%" }}
                    transition={{ duration: 2, delay: 1 }}
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                  />
                </div>
                <p className="text-center text-sm text-gray-400">42.5% of IDO allocation sold</p>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-6">Time Remaining</h3>
              <div className="grid grid-cols-4 gap-4">
                {Object.entries(timeRemaining).map(([unit, value]) => (
                  <div key={unit} className="bg-white/5 rounded-xl p-4">
                    <div className="text-3xl font-bold text-white">{value}</div>
                    <div className="text-sm text-gray-400 capitalize">{unit}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sale Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {saleStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-orange-400/30 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-white mb-2">{stat.value}</h3>
              <p className="text-orange-400 font-semibold mb-1">{stat.unit}</p>
              <p className="text-sm text-gray-300 mb-2">{stat.label}</p>
              <p className="text-xs text-gray-400">{stat.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Sale Phases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Sale Phases</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {salePhases.map((phase, index) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 ${
                  phase.status === 'active' 
                    ? 'border-orange-400/50 shadow-lg shadow-orange-400/20' 
                    : 'border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-orange-400">{phase.phase}</span>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    phase.status === 'completed' 
                      ? 'bg-green-500/20 text-green-400' 
                      : phase.status === 'active'
                      ? 'bg-orange-500/20 text-orange-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {phase.status}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{phase.title}</h3>
                <p className="text-gray-300 mb-4">{phase.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price:</span>
                    <span className="text-white font-semibold">{phase.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Allocation:</span>
                    <span className="text-white font-semibold">{phase.allocation}</span>
                  </div>
                  {phase.discount !== "0%" && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Discount:</span>
                      <span className="text-green-400 font-semibold">{phase.discount}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Invest in G8S?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/30 transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Purchase Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-8"
        >
          <IDOPurchase />
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20"
        >
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Invest?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of investors who are already part of the clean energy revolution. 
            Secure your G8S tokens today and be part of the future.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 border border-orange-400/30 text-orange-300 hover:bg-orange-500/10 hover:text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </motion.button>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
}
