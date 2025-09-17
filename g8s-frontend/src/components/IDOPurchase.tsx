"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  useAccount, 
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt,
  useChainId
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { parseUnits, formatUnits } from "viem";
import { 
  Zap, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Wallet,
  Coins,
  Clock,
  X
} from "lucide-react";
import { CONTRACTS, ABI } from "@/lib/contracts";

interface IDOPurchaseProps {
  onPurchaseSuccess?: () => void;
}

export default function IDOPurchase({ onPurchaseSuccess }: IDOPurchaseProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [pusdAmount, setPusdAmount] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [approvalHash, setApprovalHash] = useState<`0x${string}` | undefined>();
  const [purchaseHash, setPurchaseHash] = useState<`0x${string}` | undefined>();
  const [approvalCompleted, setApprovalCompleted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [networkStatus, setNetworkStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Check network status
  useEffect(() => {
    const checkNetwork = async () => {
      try {
        setNetworkStatus('checking');
        // Try to read a simple contract call to test network
        if (chainId) {
          setNetworkStatus('connected');
        } else {
          setNetworkStatus('disconnected');
        }
      } catch (error) {
        console.error('Network check failed:', error);
        setNetworkStatus('disconnected');
      }
    };

    checkNetwork();
  }, [chainId]);

  // Reset approval state when amount changes
  useEffect(() => {
    setApprovalCompleted(false);
    setError("");
    setSuccess("");
    setRetryCount(0);
    setShowSuccessModal(false);
  }, [pusdAmount]);

  // Contract reads
  const { data: pusdBalance } = useReadContract({
    address: CONTRACTS.PUSD_ADDRESS as `0x${string}`,
    abi: ABI.ERC20,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) }
  });

  const { data: pusdDecimals } = useReadContract({
    address: CONTRACTS.PUSD_ADDRESS as `0x${string}`,
    abi: ABI.ERC20,
    functionName: "decimals",
  });

  const { data: pusdAllowance } = useReadContract({
    address: CONTRACTS.PUSD_ADDRESS as `0x${string}`,
    abi: ABI.ERC20,
    functionName: "allowance",
    args: address ? [address, CONTRACTS.IDO_ADDRESS as `0x${string}`] : undefined,
    query: { enabled: Boolean(address) }
  });

  const { data: idoPrice } = useReadContract({
    address: CONTRACTS.IDO_ADDRESS as `0x${string}`,
    abi: ABI.IDO,
    functionName: "pricePUSD",
  });

  const { data: tokensSold } = useReadContract({
    address: CONTRACTS.IDO_ADDRESS as `0x${string}`,
    abi: ABI.IDO,
    functionName: "tokensSold",
  });

  const { data: tokensForSale } = useReadContract({
    address: CONTRACTS.IDO_ADDRESS as `0x${string}`,
    abi: ABI.IDO,
    functionName: "tokensForSale",
  });

  const { data: isPaused } = useReadContract({
    address: CONTRACTS.IDO_ADDRESS as `0x${string}`,
    abi: ABI.IDO,
    functionName: "paused",
  });

  const { data: saleStart } = useReadContract({
    address: CONTRACTS.IDO_ADDRESS as `0x${string}`,
    abi: ABI.IDO,
    functionName: "startTime",
  });

  const { data: saleEnd } = useReadContract({
    address: CONTRACTS.IDO_ADDRESS as `0x${string}`,
    abi: ABI.IDO,
    functionName: "endTime",
  });

  // Contract writes
  const { writeContractAsync } = useWriteContract();

  // Transaction receipts
  const { isLoading: isApprovalPending, isSuccess: isApprovalSuccess } = useWaitForTransactionReceipt({
    hash: approvalHash,
  });

  const { isLoading: isPurchasePending, isSuccess: isPurchaseSuccess } = useWaitForTransactionReceipt({
    hash: purchaseHash,
  });

  // Get human readable price - IDO price is in PUSD decimals (0)
  const pricePerG8S = (() => {
    if (!idoPrice) return 0;
    try {
      // IDO price is stored with 0 decimals (raw value)
      return Number(idoPrice as bigint);
    } catch {
      return 0;
    }
  })();

  // Calculate G8S tokens from PUSD amount
  const g8sTokens = (() => {
    if (!pusdAmount || !pricePerG8S) return "0";
    
    try {
      const pusdNum = parseFloat(pusdAmount);
      
      // Calculate G8S tokens: PUSD amount / price per G8S
      const g8sAmount = pusdNum / pricePerG8S;
      
      return g8sAmount.toFixed(6).replace(/\.?0+$/, '');
    } catch {
      return "0";
    }
  })();

  const hasEnoughBalance = pusdBalance && pusdAmount 
    ? Number(pusdBalance as bigint) >= parseFloat(pusdAmount)
    : false;

  // Force approval for every transaction - don't check existing allowance
  const hasEnoughAllowance = false; // Always require fresh approval

  const nowSec = Math.floor(Date.now() / 1000);
  const withinWindow = saleStart && saleEnd ? (Number(saleStart) <= nowSec && nowSec <= Number(saleEnd)) : true;
  const pausedBool = isPaused === true;
  const saleActive = !pausedBool && withinWindow;

  const handleApprove = async () => {
    if (!address || !pusdAmount) return;

    setIsApproving(true);
    setError("");

    try {
      // PUSD has 0 decimals, so we use the raw amount
      const amount = BigInt(Math.floor(parseFloat(pusdAmount)));
      
      console.log('Approval details:', {
        pusdAddress: CONTRACTS.PUSD_ADDRESS,
        idoAddress: CONTRACTS.IDO_ADDRESS,
        amount: amount.toString(),
        userAddress: address
      });
      
      const hash = await writeContractAsync({
        address: CONTRACTS.PUSD_ADDRESS as `0x${string}`,
        abi: ABI.ERC20,
        functionName: "approve",
        args: [CONTRACTS.IDO_ADDRESS as `0x${string}`, amount],
        gas: 100000n, // Set explicit gas limit
        gasPrice: undefined, // Let viem estimate
      });

      setApprovalHash(hash);
      setSuccess("Approval transaction sent. Confirming...");
    } catch (err: unknown) {
      console.error('Approval error:', err);
      const message = err instanceof Error ? err.message : 'Failed to approve PUSD tokens';
      
      // More specific error handling
      if (message.includes('RetryOnEmptyMiddleware')) {
        setError(`Network error: Please check your internet connection and try again. If the problem persists, try switching to a different RPC endpoint.`);
      } else if (message.includes('insufficient funds')) {
        setError(`Insufficient funds: You need ETH for gas fees. Please add ETH to your wallet.`);
      } else if (message.includes('user rejected')) {
        setError(`Transaction rejected: Please approve the transaction in MetaMask.`);
      } else {
        setError(`Approval failed: ${message}. Please try again.`);
      }
    } finally {
      setIsApproving(false);
    }
  };

  const handlePurchase = async () => {
    if (!address || !pusdAmount) return;

    setIsPurchasing(true);
    setError("");

    try {
      // PUSD has 0 decimals, so we use the raw amount
      const amount = BigInt(Math.floor(parseFloat(pusdAmount)));
      
      const hash = await writeContractAsync({
        address: CONTRACTS.IDO_ADDRESS as `0x${string}`,
        abi: ABI.IDO,
        functionName: "buyWithPUSD",
        args: [amount],
        gas: 200000n, // Set explicit gas limit
      });

      setPurchaseHash(hash);
      setSuccess("Purchase transaction sent. Confirming...");
      onPurchaseSuccess?.();
    } catch (err: unknown) {
      console.error('Purchase error:', err);
      const message = err instanceof Error ? err.message : 'Failed to purchase tokens';
      setError(`Purchase failed: ${message}. Please try again or check your network connection.`);
    } finally {
      setIsPurchasing(false);
    }
  };

  // Update messages post-confirmation
  useEffect(() => {
    if (isApprovalSuccess) {
      setSuccess("✅ Approval confirmed! You can now buy G8S tokens.");
      setError("");
      setApprovalCompleted(true);
    }
  }, [isApprovalSuccess]);

  useEffect(() => {
    if (isPurchaseSuccess) {
      setSuccess("🎉 Purchase confirmed! G8S tokens have been added to your wallet.");
      setError("");
      setShowSuccessModal(true);
      // Don't auto-reset - let user close modal manually
    }
  }, [isPurchaseSuccess]);

  const progressPercentage = tokensSold && tokensForSale
    ? (Number(tokensSold) / Number(tokensForSale)) * 100
    : 0;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
      <div className="text-center mb-8">
        <div className="relative inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-2 border-green-400/40 rounded-full px-6 py-3 mb-4 shadow-lg shadow-green-500/20">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-emerald-400/10 to-green-400/10 rounded-full animate-pulse"></div>
          <div className="relative flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
            <span className="text-green-300 text-sm font-bold tracking-wide">LATEST v2.4 - Smart Contract Price</span>
            <div className="w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Purchase G8S Tokens</h2>
        <p className="text-gray-300">
          Connect your wallet and purchase G8S tokens using PUSD
        </p>
      </div>

      {/* Wallet Connection */}
      {!isConnected ? (
        <div className="text-center py-8">
          <Wallet className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-4">Connect Your Wallet</h3>
          <p className="text-gray-300 mb-6">
            Connect your wallet to start purchasing G8S tokens
          </p>
          <ConnectButton />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Network Status */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2">
              <div className={`w-2 h-2 rounded-full ${
                networkStatus === 'connected' ? 'bg-green-400 animate-pulse' :
                networkStatus === 'disconnected' ? 'bg-red-400' : 'bg-yellow-400 animate-pulse'
              }`}></div>
              <span className={`text-sm font-medium ${
                networkStatus === 'connected' ? 'text-green-400' :
                networkStatus === 'disconnected' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {networkStatus === 'connected' ? 'Network Connected' :
                 networkStatus === 'disconnected' ? 'Network Disconnected' : 'Checking Network...'}
              </span>
            </div>
          </div>

          {/* Sale Status */}
          <div className="bg-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Sale Progress</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-red-400' : 'bg-green-400 animate-pulse'}`} />
                <span className={`text-sm font-medium ${pausedBool ? 'text-red-400' : 'text-green-400'}`}>
                  {pausedBool ? 'Paused' : 'Active'}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Tokens Sold</span>
                <span className="text-white">
                  {typeof tokensSold === 'bigint' ? formatUnits(tokensSold as bigint, 18) : "0"} G8S
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Total Supply</span>
                <span className="text-white">
                  {typeof tokensForSale === 'bigint' ? formatUnits(tokensForSale as bigint, 18) : "0"} G8S
                </span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                />
              </div>
              <p className="text-center text-xs text-gray-400">
                {progressPercentage.toFixed(1)}% sold
              </p>
            </div>
          </div>

          {/* Balance Display */}
          <div className="bg-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Coins className="w-5 h-5 mr-2 text-orange-400" />
              Your Balance
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">PUSD Balance</span>
                <span className="text-white font-semibold">
                  {pusdBalance ? Number(pusdBalance as bigint).toLocaleString() : "0"} PUSD
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Allowance</span>
                <span className="text-white font-semibold">
                  {pusdAllowance ? Number(pusdAllowance as bigint).toLocaleString() : "0"} PUSD
                </span>
              </div>
            </div>
          </div>

          {/* Purchase Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                PUSD Amount
              </label>
              <input
                type="text"
                value={pusdAmount}
                onChange={(e) => setPusdAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="Enter PUSD amount"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400"
                inputMode="numeric"
                disabled={pausedBool}
              />
            </div>

            <div className="text-center text-sm text-gray-400">
              Price: {pricePerG8S > 0 ? `${pricePerG8S.toFixed(0)} PUSD per G8S token` : 'Loading price...'}
            </div>

            {pusdAmount && g8sTokens !== "0" && (
              <div className="text-center text-sm text-gray-300">
                You will receive: <span className="text-white font-semibold">{g8sTokens}</span> G8S
              </div>
            )}

            {/* Error/Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-red-500/20 border border-red-500/30 rounded-xl"
              >
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
                {error.includes('Network error') && retryCount < 3 && (
                  <button
                    onClick={() => {
                      setRetryCount(prev => prev + 1);
                      setError("");
                      setSuccess("");
                    }}
                    className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                  >
                    Retry
                  </button>
                )}
              </motion.div>
            )}

            {/* Success message now shown in modal */}

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Step 1: Approval Button - Always show first */}
              {!approvalCompleted && pusdAmount && hasEnoughBalance ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-blue-400">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                    <span>Step 1: Approve PUSD spending</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleApprove}
                    disabled={isApproving || isApprovalPending || pausedBool}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    {isApproving || isApprovalPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{isApprovalPending ? 'Waiting for confirmation...' : 'Approving...'}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Approve PUSD</span>
                      </>
                    )}
                  </motion.button>
                </div>
              ) : null}

              {/* Step 2: Purchase Button - Show after approval */}
              {approvalCompleted && pusdAmount && hasEnoughBalance ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-green-400">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                    <span>Step 2: Buy G8S tokens</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePurchase}
                    disabled={!saleActive || isPurchasePending || isApproving || isApprovalPending}
                    className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    {isPurchasing || isPurchasePending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{isPurchasePending ? 'Waiting for confirmation...' : 'Purchasing...'}</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        <span>Buy G8S Tokens</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              ) : null}

              {/* Validation Messages */}
              {pusdAmount && !hasEnoughBalance && (
                <p className="text-red-400 text-sm text-center">
                  Insufficient PUSD balance
                </p>
              )}

              {!saleActive && (
                <p className="text-yellow-400 text-sm text-center">
                  Sale is not active (paused or outside start/end time)
                </p>
              )}
            </div>
          </div>
          <p className="text-center text-xs text-gray-500">Build: IDOPurchase v2.4 - Smart Contract Integration</p>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-xl border border-green-500/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setShowSuccessModal(false);
                setPusdAmount("");
                setApprovalCompleted(false);
                setSuccess("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Success Content */}
            <div className="text-center">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-400/30"
              >
                <CheckCircle className="w-12 h-12 text-green-400" />
              </motion.div>

              {/* Success Title */}
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-white mb-4"
              >
                🎉 Purchase Successful!
              </motion.h3>

              {/* Success Message */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-green-300 text-lg mb-6 leading-relaxed"
              >
                Your G8S tokens have been successfully added to your wallet!
              </motion.p>

              {/* Transaction Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10"
              >
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">Amount Purchased:</span>
                  <span className="text-white font-semibold">{g8sTokens} G8S</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-gray-300">PUSD Spent:</span>
                  <span className="text-white font-semibold">{pusdAmount} PUSD</span>
                </div>
              </motion.div>

              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={() => {
                  setShowSuccessModal(false);
                  setPusdAmount("");
                  setApprovalCompleted(false);
                  setSuccess("");
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Continue</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}