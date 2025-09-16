"use client";

import { ReactNode, useState, useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import "../lib/errorHandler";

const DEFAULT_SEPOLIA_RPC = "https://sepolia.drpc.org";

// Suppress Coinbase Wallet SDK console errors in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Filter out Coinbase Wallet SDK Cross-Origin-Opener-Policy errors
    if (args[0] && typeof args[0] === 'string' && 
        args[0].includes('Cross-Origin-Opener-Policy') && 
        args[0].includes('404')) {
      return; // Suppress this specific error
    }
    originalConsoleError.apply(console, args);
  };
}

// Create config only once to prevent multiple initializations
let config: ReturnType<typeof getDefaultConfig> | null = null;

const getConfig = () => {
  if (!config) {
    config = getDefaultConfig({
      appName: "G8S_LPG IDO",
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "demo",
      chains: [sepolia],
      transports: {
        [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL_SEPOLIA || DEFAULT_SEPOLIA_RPC),
      },
    });
  }
  return config;
};

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          // Don't retry on 404 errors from wallet SDK
          if (error && typeof error === 'object' && 'message' in error) {
            const message = (error as Error).message;
            if (message.includes('Cross-Origin-Opener-Policy') || message.includes('404')) {
              return false;
            }
          }
          return failureCount < 2; // Reduced retries
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        refetchOnWindowFocus: false, // Disable refetch on focus
        refetchOnMount: false, // Disable refetch on mount
      },
    },
  }));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Additional error suppression for wallet-related errors
    const handleError = (event: ErrorEvent) => {
      if (event.message && 
          (event.message.includes('Cross-Origin-Opener-Policy') || 
           event.message.includes('404') ||
           event.message.includes('coinbase'))) {
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>;
  }

  return (
    <WagmiProvider config={getConfig()}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          showRecentTransactions={true}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
