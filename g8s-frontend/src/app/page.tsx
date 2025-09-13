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
  X
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

function useContractAddress(addr?: string) {
  return addr && addr.length > 0 ? (addr as `0x${string}`) : undefined;
}

export default function Page() {
  const { address, chain } = useAccount();
  const [pusdAmount, setPusdAmount] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
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
      if (pusdAmount && typeof price === "bigint") {
        const pusd = parseUnits(pusdAmount, 18);
        const g8s = (pusd * BigInt(10**18)) / price as bigint;
        return formatUnits(g8s, 18);
      }
      return "0";
    } catch {
      return "0";
    }
  }, [pusdAmount, price]);

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
            {/* Investment Section */}
            <div className="max-w-6xl mx-auto">
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
                
                <h2 className="text-4xl font-bold text-white mb-4">Invest in Clean Energy</h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Join the G8S LPG token sale and be part of the sustainable energy revolution
                </p>
              </div>

              {address ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <div className="flex items-center space-x-3 mb-6">
                      <Wallet className="w-8 h-8 text-green-400" />
                      <h3 className="text-2xl font-bold text-white">Buy G8S Tokens</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Amount (PUSD)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            placeholder="Enter PUSD amount"
                            className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                            value={pusdAmount}
                            onChange={(e) => setPusdAmount(e.target.value)}
                          />
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            PUSD
                          </div>
                        </div>
                      </div>

                      {pusdAmount && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="bg-white/5 rounded-xl p-4 border border-white/10"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">You will receive:</span>
                            <span className="text-xl font-bold text-blue-400">
                              {g8sAmount} G8S
                            </span>
                          </div>
                        </motion.div>
                      )}

                      <div className="space-y-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={!needApprove || !address || !pusdAmount}
                          onClick={onApprove}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                          {isPending ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Approving...</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="w-5 h-5" />
                              <span>Approve PUSD</span>
                            </>
                          )}
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={needApprove || !address || !pusdAmount || !isSaleActive || Boolean(paused)}
                          onClick={onBuy}
                          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                          {isPending ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Buying...</span>
                            </>
                          ) : (
                            <>
                              <ArrowRight className="w-5 h-5" />
                              <span>Buy G8S Tokens</span>
                            </>
                          )}
                        </motion.button>
                      </div>

                      {txHash && (
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <p className="text-xs text-gray-400 break-all">Tx: {txHash}</p>
                          {isConfirmed && (
                            <div className="mt-2">
                              <p className="text-green-400 text-sm">✓ Transaction Confirmed</p>
                              <p className="text-green-400 text-xs mt-1">Balances updated automatically</p>
                            </div>
                          )}
                        </div>
                      )}

                      {showSuccess && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-green-500/10 border border-green-500/20 rounded-xl p-4"
                        >
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-green-400 font-semibold">Purchase Successful!</span>
                          </div>
                          <p className="text-green-300 text-sm mt-1">
                            Your G8S tokens have been added to your wallet. Balances have been updated.
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-white">Your Portfolio</h4>
                        <button
                          onClick={refreshBalances}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                          title="Refresh balances"
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <Coins className="w-4 h-4 text-green-400" />
                              </div>
                              <span className="text-gray-300">PUSD Balance</span>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-green-400">
                                {typeof pusdBal === "bigint" ? parseFloat(formatUnits(pusdBal as bigint, 18)).toFixed(2) : "0.00"}
                              </div>
                              <div className="text-sm text-gray-400">
                                ${typeof pusdBal === "bigint" ? parseFloat(formatUnits(pusdBal as bigint, 18)).toFixed(2) : "0.00"}
                              </div>
                              <div className="text-sm text-green-400">
                                {typeof pusdBal === "bigint" ? convertToNGN(`$${parseFloat(formatUnits(pusdBal as bigint, 18)).toFixed(2)}`) : "₦0"}
                              </div>
                              {/* Debug info */}
                              <div className="text-xs text-gray-500 mt-1">
                                Contract: {pusd?.slice(0, 6)}...{pusd?.slice(-4)}
                              </div>
                              {pusdError && (
                                <div className="text-xs text-red-400 mt-1">
                                  Error: {pusdError.message}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                <Flame className="w-4 h-4 text-orange-400" />
                              </div>
                              <span className="text-gray-300">G8S Balance</span>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-orange-400">
                                {typeof g8sBal === "bigint" ? parseFloat(formatUnits(g8sBal as bigint, 18)).toFixed(2) : "0.00"}
                              </div>
                              <div className="text-sm text-gray-400">
                                ${typeof g8sBal === "bigint" ? (parseFloat(formatUnits(g8sBal as bigint, 18)) * 0.66667).toFixed(2) : "0.00"}
                              </div>
                              <div className="text-sm text-green-400">
                                {typeof g8sBal === "bigint" ? convertToNGN(`$${(parseFloat(formatUnits(g8sBal as bigint, 18)) * 0.66667).toFixed(2)}`) : "₦0"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <h5 className="text-sm font-medium text-gray-300 mb-3">Sale Timeline</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Start:</span>
                          <span className="text-white">{startTime ? formatTime(startTime as bigint) : "TBD"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">End:</span>
                          <span className="text-white">{endTime ? formatTime(endTime as bigint) : "TBD"}</span>
                        </div>
                      </div>
                    </div>

                    {/* PUSD Token Info */}
                    <div className="bg-blue-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
                      <h5 className="text-sm font-medium text-blue-400 mb-3">PUSD Test Token</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Contract:</span>
                          <span className="text-white font-mono text-xs">{pusd}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Network:</span>
                          <span className="text-white">Sepolia Testnet</span>
                        </div>
                        <div className="mt-3 p-3 bg-blue-500/20 rounded-lg">
                          <p className="text-blue-300 text-xs">
                            💡 <strong>Need PUSD tokens?</strong> This is a test token on Sepolia. 
                            You may need to get some from a faucet or deploy your own test token.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20"
                >
                  <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h3>
                  <p className="text-gray-300 mb-8 max-w-md mx-auto">
                    Connect your wallet to participate in the G8S token sale and access exclusive pricing.
                  </p>
                  <ConnectButton />
                </motion.div>
              )}
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
            {/* Community Section */}
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 mb-6"
                >
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">Community Hub</span>
                </motion.div>
                
                <h2 className="text-4xl font-bold text-white mb-4">Join Our Community</h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Connect with like-minded investors and clean energy enthusiasts
                </p>
              </div>

              {/* Social Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {socialStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-purple-400/30 transition-all duration-300 text-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                    <p className="text-sm text-gray-300">{stat.label}</p>
                  </motion.div>
                ))}
        </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/30 transition-all duration-300 group text-center"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-md mx-4"
            >
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Purchase Successful!</h3>
                <p className="text-gray-300">
                  Your G8S tokens have been purchased successfully. Check your wallet balance.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}