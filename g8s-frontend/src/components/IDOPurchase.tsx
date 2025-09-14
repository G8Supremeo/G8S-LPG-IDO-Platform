"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ConnectButton, 
  useAccount, 
  useBalance, 
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt 
} from "wagmi";
import { parseEther, formatEther, formatUnits } from "viem";
import { 
  Zap, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Wallet,
  Coins,
  Clock
} from "lucide-react";
import { CONTRACTS, ABI } from "@/lib/contracts";

interface IDOPurchaseProps {
  onPurchaseSuccess?: () => void;
}

export default function IDOPurchase({ onPurchaseSuccess }: IDOPurchaseProps) {
  const { address, isConnected } = useAccount();
  const [tokenAmount, setTokenAmount] = useState("");
  const [pusdAmount, setPusdAmount] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Contract reads
  const { data: pusdBalance } = useBalance({
    address,
    token: CONTRACTS.PUSD_ADDRESS as `0x${string}`,
  });

  const { data: pusdAllowance } = useReadContract({
    address: CONTRACTS.PUSD_ADDRESS as `0x${string}`,
    abi: ABI.ERC20,
    functionName: "allowance",
    args: address ? [address, CONTRACTS.IDO_ADDRESS as `0x${string}`] : undefined,
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

  // Contract writes
  const { writeContract: writePUSD } = useWriteContract();
  const { writeContract: writeIDO } = useWriteContract();

  // Transaction receipts
  const { isLoading: isApprovalPending } = useWaitForTransactionReceipt({
    hash: undefined, // Will be set when approval transaction is submitted
  });

  const { isLoading: isPurchasePending } = useWaitForTransactionReceipt({
    hash: undefined, // Will be set when purchase transaction is submitted
  });

  // Calculate PUSD amount when token amount changes
  useEffect(() => {
    if (tokenAmount && idoPrice) {
      const tokens = parseFloat(tokenAmount);
      const price = Number(formatEther(idoPrice));
      const pusd = tokens * price;
      setPusdAmount(pusd.toFixed(6));
    } else {
      setPusdAmount("");
    }
  }, [tokenAmount, idoPrice]);

  // Calculate token amount when PUSD amount changes
  useEffect(() => {
    if (pusdAmount && idoPrice) {
      const pusd = parseFloat(pusdAmount);
      const price = Number(formatEther(idoPrice));
      const tokens = pusd / price;
      setTokenAmount(tokens.toFixed(2));
    } else {
      setTokenAmount("");
    }
  }, [pusdAmount, idoPrice]);

  const handleApprove = async () => {
    if (!address || !pusdAmount) return;

    setIsApproving(true);
    setError("");

    try {
      const amount = parseEther(pusdAmount);
      
      await writePUSD({
        address: CONTRACTS.PUSD_ADDRESS as `0x${string}`,
        abi: ABI.ERC20,
        functionName: "approve",
        args: [CONTRACTS.IDO_ADDRESS as `0x${string}`, amount],
      });

      setSuccess("Approval transaction submitted! Please wait for confirmation.");
    } catch (err: any) {
      setError(err.message || "Failed to approve PUSD tokens");
    } finally {
      setIsApproving(false);
    }
  };

  const handlePurchase = async () => {
    if (!address || !pusdAmount) return;

    setIsPurchasing(true);
    setError("");

    try {
      const amount = parseEther(pusdAmount);
      
      await writeIDO({
        address: CONTRACTS.IDO_ADDRESS as `0x${string}`,
        abi: ABI.IDO,
        functionName: "buyWithPUSD",
        args: [amount],
      });

      setSuccess("Purchase transaction submitted! Please wait for confirmation.");
      onPurchaseSuccess?.();
    } catch (err: any) {
      setError(err.message || "Failed to purchase tokens");
    } finally {
      setIsPurchasing(false);
    }
  };

  const hasEnoughBalance = pusdBalance && pusdAmount 
    ? Number(formatUnits(pusdBalance.value, pusdBalance.decimals)) >= parseFloat(pusdAmount)
    : false;

  const hasEnoughAllowance = pusdAllowance && pusdAmount
    ? Number(formatEther(pusdAllowance)) >= parseFloat(pusdAmount)
    : false;

  const canPurchase = isConnected && 
    pusdAmount && 
    tokenAmount && 
    hasEnoughBalance && 
    hasEnoughAllowance && 
    !isPaused &&
    !isApproving && 
    !isPurchasing;

  const progressPercentage = tokensSold && tokensForSale
    ? (Number(tokensSold) / Number(tokensForSale)) * 100
    : 0;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
      <div className="text-center mb-8">
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
          {/* Sale Status */}
          <div className="bg-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Sale Progress</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-red-400' : 'bg-green-400 animate-pulse'}`} />
                <span className={`text-sm font-medium ${isPaused ? 'text-red-400' : 'text-green-400'}`}>
                  {isPaused ? 'Paused' : 'Active'}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Tokens Sold</span>
                <span className="text-white">
                  {tokensSold ? formatEther(tokensSold) : "0"} G8S
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Total Supply</span>
                <span className="text-white">
                  {tokensForSale ? formatEther(tokensForSale) : "0"} G8S
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
                  {pusdBalance ? formatUnits(pusdBalance.value, pusdBalance.decimals) : "0"} PUSD
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Allowance</span>
                <span className="text-white font-semibold">
                  {pusdAllowance ? formatEther(pusdAllowance) : "0"} PUSD
                </span>
              </div>
            </div>
          </div>

          {/* Purchase Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount of G8S Tokens
              </label>
              <input
                type="number"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400"
                disabled={isPaused}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                PUSD Amount
              </label>
              <input
                type="number"
                value={pusdAmount}
                onChange={(e) => setPusdAmount(e.target.value)}
                placeholder="Enter PUSD amount"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400"
                disabled={isPaused}
              />
            </div>

            {idoPrice && (
              <div className="text-center text-sm text-gray-400">
                Price: {formatEther(idoPrice)} PUSD per G8S token
              </div>
            )}

            {/* Error/Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 p-3 bg-red-500/20 border border-red-500/30 rounded-xl"
              >
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 text-sm">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 p-3 bg-green-500/20 border border-green-500/30 rounded-xl"
              >
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 text-sm">{success}</span>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {!hasEnoughAllowance && pusdAmount && hasEnoughBalance ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApprove}
                  disabled={isApproving || isPaused}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  {isApproving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Approving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Approve PUSD</span>
                    </>
                  )}
                </motion.button>
              ) : null}

              <motion.button
                whileHover={{ scale: canPurchase ? 1.02 : 1 }}
                whileTap={{ scale: canPurchase ? 0.98 : 1 }}
                onClick={handlePurchase}
                disabled={!canPurchase}
                className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                {isPurchasing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Purchasing...</span>
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

            {/* Validation Messages */}
            {pusdAmount && !hasEnoughBalance && (
              <p className="text-red-400 text-sm text-center">
                Insufficient PUSD balance
              </p>
            )}

            {isPaused && (
              <p className="text-yellow-400 text-sm text-center">
                Sale is currently paused
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
