"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Menu,
  Bell,
  Search,
  Flame,
  Zap,
  Sun,
  Moon,
  Settings
} from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'lpg'>('lpg');
  const [notifications, setNotifications] = useState(3);

  const themes = {
    light: {
      name: 'Light',
      icon: Sun,
      gradient: 'from-blue-50 to-cyan-50',
      text: 'text-slate-900'
    },
    dark: {
      name: 'Dark',
      icon: Moon,
      gradient: 'from-slate-900 to-gray-900',
      text: 'text-white'
    },
    lpg: {
      name: 'LPG',
      icon: Flame,
      gradient: 'from-blue-900 via-cyan-900 to-blue-900',
      text: 'text-white'
    }
  };

  const currentTheme = themes[theme];

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`sticky top-0 z-30 bg-gradient-to-r ${currentTheme.gradient} backdrop-blur-xl border-b border-blue-500/20 shadow-lg`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-400/25 transition-all duration-300">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white">G8S LPG</h1>
                <p className="text-xs text-blue-300">Clean Energy IDO</p>
              </div>
            </Link>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tokens, addresses..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Selector */}
            <div className="hidden sm:flex items-center space-x-2">
              {Object.entries(themes).map(([key, themeConfig]) => (
                <button
                  key={key}
                  onClick={() => setTheme(key as any)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    theme === key
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  title={themeConfig.name}
                >
                  <themeConfig.icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Bell className="w-5 h-5 text-white" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {/* Settings */}
            <Link
              href="/settings"
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Settings className="w-5 h-5 text-white" />
            </Link>

            {/* Wallet Connect */}
            <div className="hidden sm:block">
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
