"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBlockNumber } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import {
  Wallet,
  Send,
  Download,
  Upload,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Flame,
  DollarSign,
  BarChart3
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { ABI, CONTRACTS } from "@/lib/contracts";

function useContractAddress(addr?: string) {
  return addr && addr.length > 0 ? (addr as `0x${string}`) : undefined;
}

export default function Wallet() {
  const { address, chain } = useAccount();
  const [showBalances, setShowBalances] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [sendAddress, setSendAddress] = useState("");
  const [sendToken, setSendToken] = useState("G8S");
  const [showNGN, setShowNGN] = useState(true);

  const ido = useContractAddress(CONTRACTS.IDO_ADDRESS);
  const pusd = useContractAddress(CONTRACTS.PUSD_ADDRESS);
  const g8s = useContractAddress(CONTRACTS.G8S_TOKEN_ADDRESS);

  // Read real wallet balances
  const { data: g8sBalance } = useReadContract({
    abi: ABI.G8S,
    address: g8s,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address && g8s) }
  });

  const { data: pusdBalance } = useReadContract({
    abi: ABI.ERC20,
    address: pusd,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address && pusd) }
  });

  const { writeContract, data: txHash } = useWriteContract();
  const { isLoading: isPending, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });
  const { data: blockNumber } = useBlockNumber();

  // State for real transactions
  const [realTransactions, setRealTransactions] = useState<any[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  // Real wallet balances from contracts
  const walletBalances = [
    {
      token: "G8S",
      symbol: "G8S",
      balance: g8sBalance ? formatUnits(g8sBalance as bigint, 18) : "0",
      value: g8sBalance ? `$${(Number(formatUnits(g8sBalance as bigint, 18)) * 0.66667).toFixed(2)}` : "$0.00",
      ngnValue: g8sBalance ? convertToNGN(`$${(Number(formatUnits(g8sBalance as bigint, 18)) * 0.66667).toFixed(2)}`) : "₦0",
      change: "+12.5%",
      changeType: "positive",
      icon: Flame,
      color: "from-orange-500 to-red-500",
      contractAddress: g8s,
      decimals: 18
    },
    {
      token: "PUSD",
      symbol: "PUSD",
      balance: pusdBalance ? formatUnits(pusdBalance as bigint, 18) : "0",
      value: pusdBalance ? `$${formatUnits(pusdBalance as bigint, 18)}` : "$0.00",
      ngnValue: pusdBalance ? convertToNGN(`$${formatUnits(pusdBalance as bigint, 18)}`) : "₦0",
      change: "0%",
      changeType: "neutral",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
      contractAddress: pusd,
      decimals: 18
    }
  ];

  // Calculate total portfolio value
  const totalPortfolioValue = walletBalances.reduce((total, token) => {
    const value = token.value.replace('$', '').replace(',', '');
    return total + parseFloat(value);
  }, 0);

  // Calculate total G8S holdings
  const totalG8SHoldings = g8sBalance ? formatUnits(g8sBalance as bigint, 18) : "0";

  // USD to NGN conversion rate (approximate)
  const USD_TO_NGN = 1500; // 1 USD ≈ 1500 NGN

  // Utility function to convert USD to NGN
  const convertToNGN = (usdValue: string) => {
    const numericValue = parseFloat(usdValue.replace('$', '').replace(',', ''));
    return `₦${(numericValue * USD_TO_NGN).toLocaleString()}`;
  };

  // Function to fetch real transactions
  const fetchRealTransactions = async () => {
    if (!address || !chain) return;
    
    setIsLoadingTransactions(true);
    try {
      // Fetch recent transactions from Etherscan API
      const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || 'YourEtherscanAPIKey';
      const response = await fetch(
        `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${apiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        const transactions = data.result.map((tx: any) => {
          const isIncoming = tx.to.toLowerCase() === address.toLowerCase();
          const isTokenTransfer = tx.input && tx.input.startsWith('0xa9059cbb');
          
          // Determine token type based on contract address
          let tokenSymbol = 'ETH';
          let tokenName = 'Ethereum';
          let tokenIcon = DollarSign;
          let tokenColor = 'text-blue-400';
          
          if (tx.to.toLowerCase() === g8s?.toLowerCase()) {
            tokenSymbol = 'G8S';
            tokenName = 'G8S Token';
            tokenIcon = Flame;
            tokenColor = 'text-orange-400';
          } else if (tx.to.toLowerCase() === pusd?.toLowerCase()) {
            tokenSymbol = 'PUSD';
            tokenName = 'PUSD Token';
            tokenIcon = DollarSign;
            tokenColor = 'text-green-400';
          }
          
          const usdValue = isTokenTransfer ? 'Token Transfer' : `$${(parseFloat(tx.value) / 1e18 * 2000).toFixed(2)}`;
          const ngnValue = isTokenTransfer ? 'Token Transfer' : convertToNGN(usdValue);
          
          return {
            hash: tx.hash,
            type: isIncoming ? 'receive' : 'send',
            token: tokenSymbol,
            tokenName: tokenName,
            amount: isTokenTransfer ? 'Token Transfer' : `${(parseFloat(tx.value) / 1e18).toFixed(4)} ETH`,
            value: usdValue,
            ngnValue: ngnValue,
            status: tx.isError === '0' ? 'completed' : 'failed',
            time: new Date(parseInt(tx.timeStamp) * 1000).toLocaleString(),
            blockNumber: tx.blockNumber,
            gasUsed: tx.gasUsed,
            gasPrice: tx.gasPrice,
            icon: isIncoming ? Download : Send,
            color: tx.isError === '0' ? (isIncoming ? 'text-green-400' : 'text-blue-400') : 'text-red-400',
            tokenIcon: tokenIcon,
            tokenColor: tokenColor
          };
        });
        
        setRealTransactions(transactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  // Fetch transactions when wallet connects or block number changes
  useEffect(() => {
    if (address && chain) {
      fetchRealTransactions();
    }
  }, [address, chain, blockNumber]);

  const recentTransactions = [
    {
      type: "purchase",
      token: "G8S",
      amount: "+50,000",
      value: "$33,333.33",
      status: "completed",
      time: "2 minutes ago",
      txHash: "0x742d...35Cc",
      icon: TrendingUp,
      color: "text-green-400"
    },
    {
      type: "purchase",
      token: "G8S",
      amount: "+25,000",
      value: "$16,666.67",
      status: "completed",
      time: "1 hour ago",
      txHash: "0x8f3a...92Bd",
      icon: TrendingUp,
      color: "text-green-400"
    },
    {
      type: "transfer",
      token: "PUSD",
      amount: "-1,000",
      value: "$1,000.00",
      status: "completed",
      time: "3 hours ago",
      txHash: "0x1c7e...4F8a",
      icon: Send,
      color: "text-blue-400"
    },
    {
      type: "purchase",
      token: "G8S",
      amount: "+100,000",
      value: "$66,666.67",
      status: "pending",
      time: "5 hours ago",
      txHash: "0x9b2d...7E3f",
      icon: Clock,
      color: "text-yellow-400"
    }
  ];

  const portfolioStats = [
    {
      title: "Total Portfolio Value",
      value: `$${totalPortfolioValue.toFixed(2)}`,
      ngnValue: convertToNGN(`$${totalPortfolioValue.toFixed(2)}`),
      change: "+8.3%",
      changeType: "positive"
    },
    {
      title: "G8S Holdings",
      value: `${parseFloat(totalG8SHoldings).toLocaleString()} G8S`,
      ngnValue: g8sBalance ? convertToNGN(`$${(Number(formatUnits(g8sBalance as bigint, 18)) * 0.66667).toFixed(2)}`) : "₦0",
      change: "+12.5%",
      changeType: "positive"
    },
    {
      title: "Connected Wallet",
      value: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not Connected",
      ngnValue: "",
      change: chain?.name || "Unknown Network",
      changeType: "neutral"
    }
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "transactions", label: "Transactions", icon: Clock },
    { id: "send", label: "Send", icon: Send },
    { id: "receive", label: "Receive", icon: Download }
  ];

  const handleSend = () => {
    if (!sendAmount || !sendAddress || !address) return;
    
    const amount = parseUnits(sendAmount, 18);
    const tokenAddress = sendToken === "G8S" ? g8s : pusd;
    const tokenABI = sendToken === "G8S" ? ABI.G8S : ABI.ERC20;
    
    if (tokenAddress) {
      writeContract({
        abi: tokenABI,
        address: tokenAddress,
        functionName: "transfer",
        args: [sendAddress as `0x${string}`, amount]
      });
    }
  };

  // Show connection prompt if no wallet is connected
  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content */}
        <div className="lg:ml-80">
          {/* Header */}
          <Header onMenuClick={() => setSidebarOpen(true)} />
          
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto py-20"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <Wallet className="w-12 h-12 text-white" />
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-6">
                Connect Your Wallet
              </h1>
              
              <p className="text-xl text-gray-300 mb-8">
                Please connect your wallet to view your portfolio, manage tokens, and access wallet features.
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4">Supported Wallets</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "MetaMask", icon: "🦊" },
                    { name: "WalletConnect", icon: "🔗" },
                    { name: "Coinbase Wallet", icon: "🔵" },
                    { name: "Rainbow", icon: "🌈" }
                  ].map((wallet) => (
                    <div key={wallet.name} className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl">
                      <span className="text-2xl">{wallet.icon}</span>
                      <span className="text-white font-medium">{wallet.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

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
              <h1 className="text-4xl font-bold text-white mb-2">Wallet</h1>
              <p className="text-gray-300">Manage your G8S tokens and portfolio</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNGN(!showNGN)}
                className={`p-3 backdrop-blur-sm rounded-xl border transition-colors ${
                  showNGN 
                    ? 'bg-green-500/20 border-green-400/30 hover:bg-green-500/30' 
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
                title={showNGN ? "Hide NGN values" : "Show NGN values"}
              >
                <span className="text-white font-semibold text-sm">₦</span>
              </button>
              <button
                onClick={() => setShowBalances(!showBalances)}
                className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
              >
                {showBalances ? <EyeOff className="w-5 h-5 text-white" /> : <Eye className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Portfolio Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {portfolioStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/30 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-white mb-1">
                {showBalances ? stat.value : "••••••"}
              </h3>
              {stat.ngnValue && showNGN && (
                <h4 className="text-lg font-semibold text-green-400 mb-2">
                  {showBalances ? stat.ngnValue : "••••••"}
                </h4>
              )}
              <p className="text-sm text-gray-300 mb-2">{stat.title}</p>
              <div className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.change}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20 mb-8"
        >
          <div className="flex space-x-2">
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
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Token Balances */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Token Balances</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.location.reload()}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    title="Refresh balances"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <span className="text-xs text-gray-400">Live data from blockchain</span>
                </div>
              </div>
              
              {address ? (
                <div className="space-y-4">
                  {walletBalances.map((token, index) => (
                    <motion.div
                      key={token.symbol}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${token.color} rounded-xl flex items-center justify-center`}>
                          <token.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{token.token}</h3>
                          <p className="text-sm text-gray-400">{token.symbol}</p>
                          {token.contractAddress && (
                            <p className="text-xs text-gray-500 font-mono">
                              {token.contractAddress.slice(0, 6)}...{token.contractAddress.slice(-4)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold text-lg">
                          {showBalances ? parseFloat(token.balance).toLocaleString() : "••••••"}
                        </div>
                        <div className="text-sm text-gray-400">
                          {showBalances ? token.value : "••••••"}
                        </div>
                        {showNGN && (
                          <div className="text-sm text-green-400">
                            {showBalances ? token.ngnValue : "••••••"}
                          </div>
                        )}
                        {token.change !== "0%" && (
                          <div className={`text-xs ${
                            token.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {token.change}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Wallet Info */}
                  <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Wallet className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-400 font-semibold">Wallet Information</span>
                    </div>
                    <div className="text-sm text-gray-300 space-y-1">
                      <p><span className="text-gray-400">Address:</span> <span className="font-mono">{address}</span></p>
                      <p><span className="text-gray-400">Network:</span> <span className="text-green-400">{chain?.name || "Unknown"}</span></p>
                      <p><span className="text-gray-400">Chain ID:</span> <span className="font-mono">{chain?.id || "Unknown"}</span></p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Connect your wallet to view token balances</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "transactions" && (
          <motion.div
            key="transactions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Transactions</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={fetchRealTransactions}
                  disabled={isLoadingTransactions}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                  title="Refresh transactions"
                >
                  <svg className={`w-4 h-4 text-white ${isLoadingTransactions ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <span className="text-xs text-gray-400">Live blockchain data</span>
              </div>
            </div>
            
            {address ? (
              <div className="space-y-4">
                {isLoadingTransactions ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading transactions...</p>
                  </div>
                ) : realTransactions.length > 0 ? (
                  realTransactions.map((tx, index) => (
                    <motion.div
                      key={tx.hash}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          tx.status === 'completed' ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          <tx.icon className={`w-5 h-5 ${tx.color}`} />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold capitalize">{tx.type}</h3>
                          <p className="text-sm text-gray-400">{tx.tokenName}</p>
                          <p className="text-xs text-gray-500">Block #{tx.blockNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">{tx.amount}</div>
                        <div className="text-sm text-gray-400">{tx.value}</div>
                        {tx.ngnValue !== 'Token Transfer' && showNGN && (
                          <div className="text-sm text-green-400">{tx.ngnValue}</div>
                        )}
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{tx.time}</span>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(tx.hash);
                            }}
                            className="hover:text-white transition-colors"
                            title="Copy transaction hash"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <a
                            href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors"
                            title="View on Etherscan"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Gas: {tx.gasUsed} | Status: <span className={tx.status === 'completed' ? 'text-green-400' : 'text-red-400'}>{tx.status}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No transactions found</p>
                    <p className="text-sm text-gray-500 mt-2">Your transaction history will appear here</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Connect your wallet to view transactions</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "send" && (
          <motion.div
            key="send"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Send Tokens</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Recipient Address</label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={sendAddress}
                  onChange={(e) => setSendAddress(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Token</label>
                <select 
                  value={sendToken}
                  onChange={(e) => setSendToken(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                >
                  <option value="G8S">G8S</option>
                  <option value="PUSD">PUSD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={isPending || !address}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                {isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Tokens</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {activeTab === "receive" && (
          <motion.div
            key="receive"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Receive Tokens</h2>
            <div className="text-center">
              <div className="w-64 h-64 bg-white/5 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Wallet className="w-16 h-16 text-white" />
                  </div>
                  <p className="text-gray-400">QR Code</p>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <p className="text-white font-mono text-sm break-all">
                  {address || "Connect your wallet to see address"}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (address) {
                    navigator.clipboard.writeText(address);
                    // You could add a toast notification here
                  }
                }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Address</span>
              </motion.button>
            </div>
          </motion.div>
        )}
        </div>
      </div>
    </div>
  );
}
