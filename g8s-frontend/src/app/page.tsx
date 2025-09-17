"use client";

import { useState, useEffect } from "react";
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Clock, 
  Users, 
  Zap, 
  Shield, 
  Star,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Wallet,
  Coins,
  Target,
  Globe,
  Lock,
  Unlock,
  Flame,
  Leaf,
  Award,
  BarChart3,
  Play,
  ChevronRight,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Eye,
  Sparkles,
  Menu,
  X,
  Twitter,
  Mail
} from "lucide-react";
import { ABI, CONTRACTS } from "@/lib/contracts";
import { formatUnits, parseUnits } from "viem";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import InteractiveDashboard from "@/components/InteractiveDashboard";
import ArtisticHero from "@/components/ArtisticHero";
import RealLPGSlideshow from "@/components/RealLPGSlideshow";
import EnhancedBusinessPlan from "@/components/EnhancedBusinessPlan";
import DemoVideoSection from "@/components/DemoVideoSection";
import RealTimeStats from "@/components/RealTimeStats";
import IDOPurchase from "@/components/IDOPurchase";

function useContractAddress(addr?: string) {
  return addr && addr.length > 0 ? (addr as `0x${string}`) : undefined;
}

export default function Page() {
  const { address, chain } = useAccount();
  const [pusdAmount, setPusdAmount] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  // Handle URL hash changes for direct navigation to invest section
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#invest") {
        setActiveSection("invest");
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const ido = useContractAddress(CONTRACTS.IDO_ADDRESS);
  const pusd = useContractAddress(CONTRACTS.PUSD_ADDRESS);
  const g8s = useContractAddress(CONTRACTS.G8S_TOKEN_ADDRESS);

  const { data: price } = useReadContract({ abi: ABI.IDO, address: ido, functionName: "pricePUSD", query: { enabled: Boolean(ido) } });
  const { data: tokensForSale } = useReadContract({ abi: ABI.IDO, address: ido, functionName: "tokensForSale", query: { enabled: Boolean(ido) } });
  const { data: tokensSold } = useReadContract({ abi: ABI.IDO, address: ido, functionName: "tokensSold", query: { enabled: Boolean(ido) } });
  const { data: startTime } = useReadContract({ abi: ABI.IDO, address: ido, functionName: "startTime", query: { enabled: Boolean(ido) } });
  const { data: endTime } = useReadContract({ abi: ABI.IDO, address: ido, functionName: "endTime", query: { enabled: Boolean(ido) } });
  const { data: paused } = useReadContract({ abi: ABI.IDO, address: ido, functionName: "paused", query: { enabled: Boolean(ido) } });

  const remaining = useMemo(() => {
    try {
      if (typeof tokensForSale === "bigint" && typeof tokensSold === "bigint") {
        const rem = (tokensForSale as bigint) - (tokensSold as bigint);
        return formatUnits(rem, 18);
      }
      return "—";
    } catch {
      return "—";
    }
  }, [tokensForSale, tokensSold]);

  const progressPercent = useMemo(() => {
    try {
      if (typeof tokensForSale === "bigint" && typeof tokensSold === "bigint") {
        return Number((tokensSold as bigint * BigInt(100)) / tokensForSale as bigint);
      }
      return 0;
    } catch {
      return 0;
    }
  }, [tokensForSale, tokensSold]);

  const isSaleActive = useMemo((): boolean => {
    try {
      if (typeof startTime === "bigint" && typeof endTime === "bigint") {
        const now = Math.floor(Date.now() / 1000);
        return now >= Number(startTime) && now <= Number(endTime);
      }
      return false;
    } catch {
      return false;
    }
  }, [startTime, endTime]);

  const { data: allowance } = useReadContract({
    abi: ABI.ERC20, address: pusd, functionName: "allowance",
    args: address && ido ? [address, ido] : undefined,
    query: { enabled: Boolean(address && ido && pusd) },
  });

  const { data: pusdBal, refetch: refetchPusdBal, error: pusdError } = useReadContract({ 
    abi: ABI.ERC20, 
    address: pusd, 
    functionName: "balanceOf", 
    args: address ? [address] : undefined, 
    query: { enabled: Boolean(address && pusd) } 
  });
  const { data: g8sBal, refetch: refetchG8sBal } = useReadContract({ abi: ABI.G8S, address: g8s, functionName: "balanceOf", args: address ? [address] : undefined, query: { enabled: Boolean(address && g8s) } });

  const { writeContract, data: txHash } = useWriteContract();
  const { isLoading: isPending, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  // USD to NGN conversion rate (approximate)
  const USD_TO_NGN = 1500; // 1 USD ≈ 1500 NGN

  // Utility function to convert USD to NGN
  const convertToNGN = (usdValue: string) => {
    const numericValue = parseFloat(usdValue.replace('$', '').replace(',', ''));
    return `₦${(numericValue * USD_TO_NGN).toLocaleString()}`;
  };

  const needApprove = useMemo((): boolean => {
    try {
      if (typeof allowance !== "bigint" || !pusdAmount) return true;
      const amount = parseUnits(pusdAmount || "0", 18);
      const current = allowance as bigint;
      return current < amount;
    } catch {
      return true;
    }
  }, [allowance, pusdAmount]);

  const onApprove = () => {
    if (!pusd || !ido || !pusdAmount) return;
    const amount = parseUnits(pusdAmount, 18);
    writeContract({ abi: ABI.ERC20, address: pusd, functionName: "approve", args: [ido, amount] });
  };

  const onBuy = () => {
    if (!ido || !pusdAmount) return;
    const amount = parseUnits(pusdAmount, 18);
    writeContract({ abi: ABI.IDO, address: ido, functionName: "buyWithPUSD", args: [amount] });
  };

  // Refresh balances after successful transaction
  const refreshBalances = async () => {
    await Promise.all([refetchPusdBal(), refetchG8sBal()]);
  };

  // Auto-refresh balances when transaction is confirmed
  React.useEffect(() => {
    if (isConfirmed) {
      refreshBalances();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [isConfirmed]);

  const formatTime = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  const g8sAmount = useMemo(() => {
    try {
      if (pusdAmount) {
        const pusdNum = parseFloat(pusdAmount);
        const tokensFloat = pusdNum / 2333; // 2333 PUSD per G8S
        return tokensFloat.toFixed(6).replace(/\.?0+$/, ''); // Remove trailing zeros
      }
      return "0";
    } catch {
      return "0";
    }
  }, [pusdAmount]);

  const features = [
    {
      icon: Shield,
      title: "Audited Smart Contracts",
      description: "Security-first approach with comprehensive audits",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Invest in clean energy from anywhere in the world",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Leaf,
      title: "Environmental Impact",
      description: "Support sustainable energy solutions",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: TrendingUp,
      title: "Growth Potential",
      description: "Be part of the clean energy revolution",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const socialStats = [
    { label: "Community Members", value: "12.5K", icon: Users },
    { label: "Social Mentions", value: "8.2K", icon: MessageCircle },
    { label: "Shares", value: "3.1K", icon: Share2 },
    { label: "Views", value: "45.7K", icon: Eye }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="lg:ml-80">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />
      
      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="sticky top-16 z-20 bg-white/5 backdrop-blur-sm border-b border-white/10"
      >
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: Star },
              { id: "stats", label: "Live Stats", icon: BarChart3 },
              { id: "video", label: "Demo Video", icon: Play },
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "invest", label: "Invest", icon: Zap },
              { id: "community", label: "Community", icon: Users }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-all duration-300 whitespace-nowrap ${
                  activeSection === tab.id
                    ? "border-blue-400 text-blue-400"
                    : "border-transparent text-gray-300 hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Content Sections */}
      <AnimatePresence mode="wait">
        {activeSection === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="space-y-12"
          >
            {/* Hero Slideshow */}
            <div className="container mx-auto px-4 py-12">
                     <RealLPGSlideshow />
            </div>
            
            {/* Business Plan */}
            <EnhancedBusinessPlan />
          </motion.div>
        )}

        {activeSection === "stats" && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <RealTimeStats />
          </motion.div>
        )}

        {activeSection === "video" && (
          <motion.div
            key="video"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <DemoVideoSection />
          </motion.div>
        )}

        {activeSection === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-12"
          >
            <InteractiveDashboard />
          </motion.div>
        )}

        {activeSection === "invest" && (
          <motion.div
            key="invest"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-12"
          >
            {/* Investment Section - Same as IDO Purchase */}
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 mb-6"
                >
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">Investment Portal</span>
                </motion.div>
                
                <div className="relative inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-2 border-green-400/40 rounded-full px-6 py-3 mb-6 shadow-lg shadow-green-500/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-emerald-400/10 to-green-400/10 rounded-full animate-pulse"></div>
                  <div className="relative flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
                    <span className="text-green-300 text-sm font-bold tracking-wide">FIXED v2.3 - 2333 PUSD = 1 G8S</span>
                    <div className="w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
                  </div>
                </div>
                
                <h2 className="text-4xl font-bold text-white mb-4">Invest in Clean Energy</h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                  Join the G8S LPG token sale and be part of the sustainable energy revolution
                </p>
              </div>

              {/* IDO Purchase Component */}
              <IDOPurchase />
            </div>
          </motion.div>
        )}

        {activeSection === "community" && (
          <motion.div
            key="community"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-12"
          >
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 mb-6"
                >
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Community Hub</span>
                </motion.div>
                
                <h2 className="text-4xl font-bold text-white mb-4">Join Our Community</h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Connect with like-minded investors and clean energy enthusiasts
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Discord Community</h3>
                  <p className="text-gray-300 mb-4">Join our Discord server for real-time discussions</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                  >
                    Join Discord
                  </motion.button>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Twitter className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Twitter Updates</h3>
                  <p className="text-gray-300 mb-4">Follow us for the latest news and updates</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                  >
                    Follow Us
                  </motion.button>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Newsletter</h3>
                  <p className="text-gray-300 mb-4">Get weekly updates delivered to your inbox</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                  >
                    Subscribe
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}