"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  useAccount, 
  useBalance, 
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt 
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
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
  const [waitingForApproval, setWaitingForApproval] = useState(false);
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

  // Helpers: sanitize number input and format token amounts for display
  const sanitizeNumberInput = (value: string, maxWhole = 12, maxDecimals = 6) => {
  // Allow only digits and a single decimal point
  const v = value.replace(/[^0-9.]/g, "");
    const parts = v.split('.');
    if (parts.length > 2) parts.splice(2); // keep only one dot
    const whole = parts[0].slice(0, maxWhole);
    const frac = parts[1] ? parts[1].slice(0, maxDecimals) : undefined;
    return frac !== undefined ? `${whole}.${frac}` : whole;
  };

  const formatTokenAmountString = (weiValue: bigint | 0n) => {
    if (!weiValue || weiValue === 0n) return '0';
    try {
      // formatUnits returns a decimal string with token decimals (G8S uses 18)
      const s = formatUnits(weiValue, 18);
      if (!s.includes('.')) return Number(s).toLocaleString();
      const [intPart, fracPart] = s.split('.');
      const trimmedFrac = fracPart.replace(/0+$/, '').slice(0, 6); // max 6 decimals
      const intFormatted = Number(intPart).toLocaleString();
      return trimmedFrac ? `${intFormatted}.${trimmedFrac}` : intFormatted;
    } catch {
      return '0';
    }
  };

  // Calculate PUSD amount when token amount changes
  useEffect(() => {
    if (tokenAmount && idoPrice) {
      const tokens = parseFloat(tokenAmount || '0');
      const decimals = typeof pusdDecimals === 'number' ? (pusdDecimals as number) : 18;
      const price = Number(formatUnits(idoPrice as bigint, decimals));
      const pusd = tokens * price;
      setPusdAmount(pusd.toFixed(Math.min(6, decimals)));
    } else {
      setPusdAmount("");
    }
  }, [tokenAmount, idoPrice, pusdDecimals]);

  // Calculate token amount when PUSD amount changes
  useEffect(() => {
    if (pusdAmount && idoPrice) {
      const pusd = parseFloat(pusdAmount || '0');
      const decimals = typeof pusdDecimals === 'number' ? (pusdDecimals as number) : 18;
      const price = Number(formatUnits(idoPrice as bigint, decimals));
      const tokens = price > 0 ? pusd / price : 0;
      setTokenAmount(tokens.toFixed(2));
    } else {
      setTokenAmount("");
    }
  }, [pusdAmount, idoPrice, pusdDecimals]);

  const handleApprove = async () => {
    if (!address || !pusdAmount) return;

    setIsApproving(true);
    setWaitingForApproval(true);
    setError("");

    try {
      if (chainId !== sepolia.id) {
        await switchChainAsync({ chainId: sepolia.id });
      }
      const decimals = typeof pusdDecimals === 'number' ? pusdDecimals : 0;
      const amount = parseUnits(pusdAmount, decimals);
      const hash = await writeContractAsync({
        address: CONTRACTS.PUSD_ADDRESS as `0x${string}`,
        abi: ABI.ERC20,
        functionName: "approve",
        args: [CONTRACTS.IDO_ADDRESS as `0x${string}`, amount],
      });

      setApprovalHash(hash);
      setSuccess("Approval transaction sent. Confirming...");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to approve PUSD tokens';
      setError(message);
      setWaitingForApproval(false);
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
      const decimals = typeof pusdDecimals === 'number' ? pusdDecimals : 0;
      const amount = parseUnits(pusdAmount, decimals);
      if (!hasEnoughAllowance) {
        throw new Error('Please approve PUSD first.');
      }
      const hash = await writeContractAsync({
        address: CONTRACTS.IDO_ADDRESS as `0x${string}`,
        abi: ABI.IDO,
        functionName: "buyWithPUSD",
        args: [amount],
      });

      setPurchaseHash(hash);
      setSuccess("Purchase transaction sent. Confirming...");
      onPurchaseSuccess?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to purchase tokens';
      setError(message);
    } finally {
      setIsPurchasing(false);
    }
  };

  // Update messages post-confirmation
  useEffect(() => {
    if (isApprovalSuccess) {
      setSuccess("Approval confirmed. You can now buy tokens.");
      setWaitingForApproval(false);
    }
  }, [isApprovalSuccess]);

  useEffect(() => {
    if (isPurchaseSuccess) {
      setSuccess("Purchase confirmed. G8S tokens will reflect shortly.");
    }
  }, [isPurchaseSuccess]);

  const decimalsLoaded = typeof pusdDecimals === 'number';
  const decimalsNum = decimalsLoaded ? (pusdDecimals as number) : 18;

  // Derived pricing and tokens-out for display (human-friendly)
  const priceNum = typeof idoPrice === 'bigint' ? Number(formatUnits(idoPrice as bigint, decimalsNum)) : undefined;
  let computedTokensOutWei: bigint = 0n;
  try {
    if (pusdAmount && typeof idoPrice === 'bigint') {
      const amount = parseUnits(pusdAmount, decimalsNum);
      const ONE = 1000000000000000000n;
      computedTokensOutWei = (amount * ONE) / (idoPrice as bigint);
    }
  } catch {}

  // For display, prefer a decimal float computed from numeric price to avoid showing raw wei integers
  const computedTokensOutHuman = (() => {
    if (!pusdAmount) return '0';
    const pusdNum = parseFloat(pusdAmount || '0');
    if (priceNum && priceNum > 0) {
      const tokensFloat = pusdNum / priceNum;
      // limit to 6 decimals and trim trailing zeros
      const fixed = tokensFloat.toFixed(6).replace(/(?:\.0+|(?<=\.[0-9]*?)0+)$/, '');
      // add thousands separators for the integer part
      const [intPart, fracPart] = fixed.split('.');
      const intFormatted = Number(intPart).toLocaleString();
      return fracPart ? `${intFormatted}.${fracPart}` : intFormatted;
    }
    // fallback to wei formatting if priceNum not available
    return computedTokensOutWei ? formatTokenAmountString(computedTokensOutWei) : '0';
  })();

  const hasEnoughBalance = pusdBalance && pusdAmount 
    ? Number(formatUnits(pusdBalance.value, pusdBalance.decimals)) >= parseFloat(pusdAmount)
    : false;

  const hasEnoughAllowance = !waitingForApproval && pusdAllowance && pusdAmount
    ? Number(formatUnits(pusdAllowance as bigint, decimalsNum)) >= parseFloat(pusdAmount)
    : false;

  const nowSec = Math.floor(Date.now() / 1000);
  const withinWindow = saleStart && saleEnd ? (Number(saleStart) <= nowSec && nowSec <= Number(saleEnd)) : true;
  const pausedBool = isPaused === true;
  const saleActive = !pausedBool && withinWindow;

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
    !isPurchasing &&
    !isApprovalPending &&
    !waitingForApproval;

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
                <span className={`text-sm font-medium ${pausedBool ? 'text-red-400' : 'text-green-400'}`}>
                  {pausedBool ? 'Paused' : 'Active'}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Tokens Sold</span>
                <span className="text-white">
                  {typeof tokensSold === 'bigint' ? formatEther(tokensSold as bigint) : "0"} G8S
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Total Supply</span>
                <span className="text-white">
                  {typeof tokensForSale === 'bigint' ? formatEther(tokensForSale as bigint) : "0"} G8S
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
                type="text"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(sanitizeNumberInput(e.target.value, 8, 4))}
                placeholder="Enter amount"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400"
                inputMode="decimal"
                disabled={pausedBool}
                maxLength={13}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                PUSD Amount
              </label>
              <input
                type="text"
                value={pusdAmount}
                onChange={(e) => setPusdAmount(sanitizeNumberInput(e.target.value, 10, decimalsNum === 0 ? 0 : 6))}
                placeholder="Enter PUSD amount"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400"
                inputMode="numeric"
                disabled={pausedBool}
                maxLength={16}
              />
            </div>

            {typeof idoPrice === 'bigint' && (
              <div className="text-center text-sm text-gray-400">
                Price: {formatUnits(idoPrice as bigint, decimalsNum)} PUSD per G8S token
              </div>
            )}

            {pusdAmount && (
              <div className="text-center text-sm text-gray-300">
                You will receive (est.): <span className="text-white font-semibold">{computedTokensOutHuman}</span> G8S
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
              ) : null}

              {hasEnoughAllowance && pusdAmount && hasEnoughBalance ? (
                <motion.button
                  whileHover={{ scale: canPurchase ? 1.02 : 1 }}
                  whileTap={{ scale: canPurchase ? 0.98 : 1 }}
                  onClick={handlePurchase}
                  disabled={!canPurchase || isPurchasePending || isApproving || isApprovalPending}
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
              ) : null}
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
          <p className="text-center text-xs text-gray-500">Build: IDOPurchase v2.1</p>
        </div>
      )}
    </div>
  );
}
