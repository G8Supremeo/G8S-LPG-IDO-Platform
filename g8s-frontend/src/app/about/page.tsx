"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Users,
  Target,
  Handshake,
  Star,
  ArrowRight,
  Flame,
  Globe,
  Shield,
  Zap,
  Award,
  TrendingUp,
  Heart,
  Eye
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Link from "next/link";

export default function AboutPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const aboutSections = [
    {
      id: "mission",
      title: "Mission & Vision",
      description: "Our purpose and vision for the future of clean energy",
      icon: Target,
      link: "/about/mission",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "team",
      title: "Our Team",
      description: "Meet the experts behind G8S LPG",
      icon: Users,
      link: "/about/team",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "partners",
      title: "Partners",
      description: "Strategic partnerships driving our success",
      icon: Handshake,
      link: "/about/partners",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const stats = [
    { label: "Years of Experience", value: "50+", icon: Award },
    { label: "Global Partners", value: "25+", icon: Globe },
    { label: "Countries Served", value: "15+", icon: TrendingUp },
    { label: "Team Members", value: "50+", icon: Users }
  ];

  const values = [
    {
      icon: Shield,
      title: "Security First",
      description: "We prioritize the security of our users' investments with audited smart contracts and robust security measures."
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="lg:ml-80">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 mb-6">
              <Flame className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">About G8S LPG</span>
            </div>
            
            <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Revolutionizing Clean Energy
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              G8S LPG is pioneering the future of clean energy investments through blockchain technology, 
              making sustainable energy solutions accessible to everyone, everywhere.
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* About Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Learn More About Us</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Explore our mission, meet our team, and discover our strategic partnerships
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {aboutSections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="group"
                >
                  <Link href={section.link}>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-blue-400/50 transition-all duration-300 h-full">
                      <div className={`w-16 h-16 bg-gradient-to-r ${section.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <section.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        {section.description}
                      </p>
                      <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                        <span className="font-medium">Learn More</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Our Core Values</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                The principles that guide everything we do at G8S LPG
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
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
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-6">
              Join Our Mission
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Be part of the clean energy revolution. Together, we can create a sustainable future 
              while building wealth through innovative blockchain technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Zap className="w-5 h-5" />
                  <span>Start Investing</span>
                </motion.button>
              </Link>
              <Link href="/about/mission">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border border-blue-400/30 text-blue-300 hover:bg-blue-500/10 hover:text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Eye className="w-5 h-5" />
                  <span>Learn More</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
