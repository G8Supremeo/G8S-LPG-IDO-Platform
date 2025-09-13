"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Users,
  Building2,
  Globe,
  Handshake,
  Star,
  Award,
  Target,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function Partners() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("strategic");

  const partnerCategories = [
    { id: "strategic", label: "Strategic Partners", icon: Target },
    { id: "technology", label: "Technology Partners", icon: Zap },
    { id: "financial", label: "Financial Partners", icon: TrendingUp },
    { id: "community", label: "Community Partners", icon: Users }
  ];

  const strategicPartners = [
    {
      name: "TotalEnergies",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center",
      description: "Global energy company supporting clean energy initiatives",
      role: "Energy Infrastructure Partner",
      website: "https://totalenergies.com",
      status: "active"
    },
    {
      name: "Shell Energy",
      logo: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=200&fit=crop&crop=center",
      description: "Leading energy company with focus on sustainable solutions",
      role: "Distribution Partner",
      website: "https://shell.com",
      status: "active"
    },
    {
      name: "Clean Energy Foundation",
      logo: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=200&h=200&fit=crop&crop=center",
      description: "Non-profit organization promoting clean energy adoption",
      role: "Advocacy Partner",
      website: "https://cleanenergy.org",
      status: "active"
    }
  ];

  const technologyPartners = [
    {
      name: "Ethereum Foundation",
      logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&h=200&fit=crop&crop=center",
      description: "Blockchain infrastructure for decentralized applications",
      role: "Blockchain Infrastructure",
      website: "https://ethereum.org",
      status: "active"
    },
    {
      name: "Chainlink",
      logo: "https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=200&h=200&fit=crop&crop=center",
      description: "Decentralized oracle network for reliable data feeds",
      role: "Oracle Services",
      website: "https://chain.link",
      status: "active"
    }
  ];

  const financialPartners = [
    {
      name: "Binance Labs",
      logo: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=200&fit=crop&crop=center",
      description: "Leading cryptocurrency exchange and investment fund",
      role: "Investment Partner",
      website: "https://labs.binance.com",
      status: "active"
    },
    {
      name: "Coinbase Ventures",
      logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&h=200&fit=crop&crop=center",
      description: "Venture capital arm of Coinbase exchange",
      role: "Strategic Investor",
      website: "https://ventures.coinbase.com",
      status: "active"
    }
  ];

  const communityPartners = [
    {
      name: "DeFi Alliance",
      logo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&h=200&fit=crop&crop=center",
      description: "Community-driven DeFi education and adoption",
      role: "Community Builder",
      website: "https://defialliance.org",
      status: "active"
    },
    {
      name: "Web3 Foundation",
      logo: "https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=200&h=200&fit=crop&crop=center",
      description: "Supporting Web3 ecosystem development",
      role: "Ecosystem Partner",
      website: "https://web3.foundation",
      status: "active"
    }
  ];

  const getPartnersByCategory = (category: string) => {
    switch (category) {
      case "strategic": return strategicPartners;
      case "technology": return technologyPartners;
      case "financial": return financialPartners;
      case "community": return communityPartners;
      default: return strategicPartners;
    }
  };

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
              <Handshake className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Strategic Partnerships</span>
            </div>
            
            <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Our Partners
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Building the future of clean energy through strategic partnerships with industry leaders, 
              technology innovators, and community builders.
            </p>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {partnerCategories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span className="font-medium">{category.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Partners Grid */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {getPartnersByCategory(activeCategory).map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {partner.name}
                    </h3>
                    <p className="text-sm text-gray-400">{partner.role}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-400 capitalize">{partner.status}</span>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {partner.description}
                </p>
                
                <motion.a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span className="text-sm font-medium">Visit Website</span>
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              </motion.div>
            ))}
          </motion.div>

          {/* Partnership Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Partnership Benefits</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Our partnerships create mutual value through shared expertise, resources, and vision for a sustainable future.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Target, title: "Strategic Alignment", description: "Shared vision for clean energy" },
                { icon: TrendingUp, title: "Market Growth", description: "Expanded market reach" },
                { icon: Shield, title: "Risk Mitigation", description: "Reduced operational risks" },
                { icon: Users, title: "Community Building", description: "Stronger ecosystem" }
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
