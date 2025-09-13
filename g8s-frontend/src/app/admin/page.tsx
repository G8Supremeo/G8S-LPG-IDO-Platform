"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ABI, CONTRACTS } from "@/lib/contracts";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, 
  DollarSign, 
  Pause, 
  Play, 
  ArrowUpRight, 
  Trash2,
  Shield,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Zap,
  BarChart3,
  Users,
  TrendingUp,
  Activity,
  Clock,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Upload,
  Bell,
  Search,
  Filter,
  MoreVertical,
  Copy,
  ExternalLink,
  Flame,
  Globe,
  Target,
  Star
} from "lucide-react";
import { parseUnits, formatUnits } from "viem";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

function useAddr(a?: string) { return a && a.length ? (a as `0x${string}`) : undefined; }

export default function AdminPage() {
  const { address } = useAccount();
  const ido = useAddr(CONTRACTS.IDO_ADDRESS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Hooks must always run; use enabled flags to control execution
  const { data: owner } = useReadContract({ abi: ABI.IDO, address: ido, functionName: "owner", query: { enabled: Boolean(ido) } });
  const { data: paused } = useReadContract({ abi: ABI.IDO, address: ido, functionName: "paused", query: { enabled: Boolean(ido) } });
  const { data: pricePUSD } = useReadContract({ abi: ABI.IDO, address: ido, functionName: "pricePUSD", query: { enabled: Boolean(ido) } });
  const { data: tokensForSale } = useReadContract({ abi: ABI.IDO, address: ido, functionName: "tokensForSale", query: { enabled: Boolean(ido) } });
  const { data: tokensSold } = useReadContract({ abi: ABI.IDO, address: ido, functionName: "tokensSold", query: { enabled: Boolean(ido) } });
  const { data: startTime } = useReadContract({ abi: ABI.IDO, address: ido, functionName: "startTime", query: { enabled: Boolean(ido) } });
  const { data: endTime } = useReadContract({ abi: ABI.IDO, address: ido, functionName: "endTime", query: { enabled: Boolean(ido) } });

  const isOwner = useMemo(() => owner && address && (owner as string).toLowerCase() === address.toLowerCase(), [owner, address]);

  const { writeContract, data: txHash } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const [newPrice, setNewPrice] = useState("");
  const [withdrawTo, setWithdrawTo] = useState("");
  const [sweepTo, setSweepTo] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-refresh data every 60 seconds (reduced frequency)
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 60000); // Increased from 30s to 60s
    return () => clearInterval(interval);
  }, []);

  const idoMissing = !ido;
  const notOwner = !isOwner;

  const formatTime = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  const formatUnits = (value: bigint, decimals: number = 18) => {
    return (Number(value) / Math.pow(10, decimals)).toFixed(2);
  };

  const handleAction = async (action: () => void) => {
    try {
      action();
      if (isSuccess) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "controls", label: "Controls", icon: Settings },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "transactions", label: "Transactions", icon: Activity }
  ];

  const adminStats = [
    {
      title: "Total Raised",
      value: tokensSold && pricePUSD ? `$${(Number(formatUnits(tokensSold as bigint, 18)) * Number(formatUnits(pricePUSD as bigint, 18))).toFixed(2)}` : "$0.00",
      change: "+12.5%",
      changeType: "positive",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Tokens Sold",
      value: tokensSold ? formatUnits(tokensSold as bigint, 18) : "0",
      change: "+8.2%",
      changeType: "positive",
      icon: Flame,
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Active Users",
      value: "1,247",
      change: "+15.3%",
      changeType: "positive",
      icon: Users,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Sale Status",
      value: paused ? "Paused" : "Active",
      change: paused ? "Paused" : "Running",
      changeType: paused ? "negative" : "positive",
      icon: paused ? Pause : Play,
      color: paused ? "from-red-500 to-pink-500" : "from-green-500 to-emerald-500"
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
          {/* Admin Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 mb-4">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Admin Panel</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  G8S LPG Control Center
                </h1>
                <p className="text-gray-300">
                  Manage your IDO sale, monitor performance, and control all aspects of the platform
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRefreshKey(prev => prev + 1)}
                  className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-blue-400/50 transition-all duration-300"
                >
                  <RefreshCw className="w-5 h-5 text-white" />
                </motion.button>
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-300"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Dashboard</span>
                  </motion.button>
                </Link>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions, addresses, or actions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center space-x-2 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:border-blue-400/50 transition-all duration-300"
              >
                <Filter className="w-5 h-5 text-white" />
                <span className="text-white">Advanced</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {adminStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    stat.changeType === 'positive' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-gray-300 text-sm">{stat.title}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Quick Actions */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {isOwner ? (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAction(() => {
                            if (ido) {
                              writeContract({
                                abi: ABI.IDO,
                                address: ido,
                                functionName: paused ? "resumeSale" : "pauseSale"
                              });
                            }
                          })}
                          disabled={isLoading}
                          className="p-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                          {paused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                          <span>{paused ? "Resume Sale" : "Pause Sale"}</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveTab("controls")}
                          className="p-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                          <DollarSign className="w-5 h-5" />
                          <span>Set Price</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveTab("controls")}
                          className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                          <ArrowUpRight className="w-5 h-5" />
                          <span>Withdraw</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveTab("analytics")}
                          className="p-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                          <BarChart3 className="w-5 h-5" />
                          <span>Analytics</span>
                        </motion.button>
                      </>
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">Connect owner wallet to access admin controls</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}