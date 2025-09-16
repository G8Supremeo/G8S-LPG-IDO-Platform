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
import { parseEther, parseUnits, formatEther, formatUnits } from "viem";
import { useChainId, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";
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
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const [tokenAmount, setTokenAmount] = useState("");
  const [pusdAmount, setPusdAmount] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [approvalHash, setApprovalHash] = useState<`0x${string}` | undefined>();
  const [purchaseHash, setPurchaseHash] = useState<`0x${string}` | undefined>();

  // Contract reads
  const { data: pusdBalance } = useBalance({
    address,
    token: CONTRACTS.PUSD_ADDRESS as `0x${string}`,
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

  // Resolve G8S token address and IDO G8S balance to prevent transfer failures
  const { data: g8sAddress } = useReadContract({
    address: CONTRACTS.IDO_ADDRESS as `0x${string}`,
    abi: ABI.IDO,
    functionName: "g8sToken",
  });

  const { data: idoG8sBalance } = useBalance({
    address: CONTRACTS.IDO_ADDRESS as `0x${string}`,
    token: (g8sAddress as `0x${string}`) || undefined,
    query: { enabled: !!g8sAddress },
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

  // Calculate PUSD amount when token amount changes
  useEffect(() => {
    if (tokenAmount && idoPrice) {
      const tokens = parseFloat(tokenAmount);
      const decimals = typeof pusdDecimals === 'number' ? (pusdDecimals as number) : 18;
      const price = Number(formatUnits(idoPrice as bigint, decimals));
      const pusd = tokens * price;
      setPusdAmount(pusd.toFixed(6));
    } else {
      setPusdAmount("");
    }
  }, [tokenAmount, idoPrice, pusdDecimals]);

  // Calculate token amount when PUSD amount changes
  useEffect(() => {
    if (pusdAmount && idoPrice) {
      const pusd = parseFloat(pusdAmount);
      const decimals = typeof pusdDecimals === 'number' ? (pusdDecimals as number) : 18;
      const price = Number(formatUnits(idoPrice as bigint, decimals));
      const tokens = pusd / price;
      setTokenAmount(tokens.toFixed(2));
    } else {
      setTokenAmount("");
    }
  }, [pusdAmount, idoPrice, pusdDecimals]);

  const handleApprove = async () => {
    if (!address || !pusdAmount) return;

    setIsApproving(true);
    setError("");

    try {
      if (chainId !== sepolia.id) {
        await switchChainAsync({ chainId: sepolia.id });
      }
      const decimals = typeof pusdDecimals === 'number' ? pusdDecimals : 18;
      const amount = parseUnits(pusdAmount, decimals);
      const hash = await writeContractAsync({
        address: CONTRACTS.PUSD_ADDRESS as `0x${string}`,
        abi: ABI.ERC20,
        functionName: "approve",
        args: [CONTRACTS.IDO_ADDRESS as `0x${string}`, amount],
      });

      setApprovalHash(hash);
      setSuccess("Approval transaction sent. Confirming...");
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
      if (chainId !== sepolia.id) {
        await switchChainAsync({ chainId: sepolia.id });
      }
      const decimals = typeof pusdDecimals === 'number' ? pusdDecimals : 18;
      const amount = parseUnits(pusdAmount, decimals);
      const hash = await writeContractAsync({
        address: CONTRACTS.IDO_ADDRESS as `0x${string}`,
        abi: ABI.IDO,
        functionName: "buyWithPUSD",
        args: [amount],
      });

      setPurchaseHash(hash);
      setSuccess("Purchase transaction sent. Confirming...");
      onPurchaseSuccess?.();
    } catch (err: any) {
      setError(err.message || "Failed to purchase tokens");
    } finally {
      setIsPurchasing(false);
    }
  };

  // Update messages post-confirmation
  useEffect(() => {
    if (isApprovalSuccess) {
      setSuccess("Approval confirmed. You can now buy tokens.");
    }
  }, [isApprovalSuccess]);

  useEffect(() => {
    if (isPurchaseSuccess) {
      setSuccess("Purchase confirmed. G8S tokens will reflect shortly.");
    }
  }, [isPurchaseSuccess]);

  const decimalsLoaded = typeof pusdDecimals === 'number';
  const decimalsNum = decimalsLoaded ? (pusdDecimals as number) : 18;

  const hasEnoughBalance = pusdBalance && pusdAmount 
    ? Number(formatUnits(pusdBalance.value, pusdBalance.decimals)) >= parseFloat(pusdAmount)
    : false;

  const hasEnoughAllowance = pusdAllowance && pusdAmount
    ? Number(formatUnits(pusdAllowance as bigint, decimalsNum)) >= parseFloat(pusdAmount)
    : false;

  const nowSec = Math.floor(Date.now() / 1000);
  const withinWindow = saleStart && saleEnd ? (Number(saleStart) <= nowSec && nowSec <= Number(saleEnd)) : true;
  const saleActive = !isPaused && withinWindow;

  // Pre-check cap based on entered PUSD
  let exceedsCap = false;
  let exceedsIdoBalance = false;
  try {
    if (pusdAmount && idoPrice && tokensSold && tokensForSale) {
      const amountWei = parseUnits(pusdAmount, decimalsNum);
      const ONE = 1000000000000000000n;
      const tokensOut = (amountWei * ONE) / (idoPrice as bigint);
      const sold = tokensSold as bigint;
      const cap = tokensForSale as bigint;
      exceedsCap = (sold + tokensOut) > cap;

      if (idoG8sBalance && typeof idoG8sBalance.value === 'bigint') {
        exceedsIdoBalance = tokensOut > (idoG8sBalance.value as bigint);
      }
    }
  } catch (_) {
    // ignore precheck errors
  }

  const canPurchase = isConnected && 
    pusdAmount && 
    tokenAmount && 
    hasEnoughBalance && 
    hasEnoughAllowance && 
    saleActive &&
    decimalsLoaded &&
    !exceedsIdoBalance &&
    !exceedsCap &&
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
                  {pusdAllowance ? formatUnits(pusdAllowance as bigint, decimalsNum) : "0"} PUSD
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
                Price: {formatUnits(idoPrice as bigint, decimalsNum)} PUSD per G8S token
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
                  disabled={isApproving || isApprovalPending || isPaused}
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
              ) : null}

              <motion.button
                whileHover={{ scale: canPurchase ? 1.02 : 1 }}
                whileTap={{ scale: canPurchase ? 0.98 : 1 }}
                onClick={handlePurchase}
                disabled={!canPurchase || isPurchasePending}
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

            {exceedsCap && (
              <p className="text-red-400 text-sm text-center">
                Purchase exceeds remaining IDO allocation
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
