"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Settings,
  Wallet,
  Bell,
  Shield,
  Globe,
  Moon,
  Sun,
  Flame,
  Palette,
  Lock,
  Eye,
  EyeOff,
  Save,
  Download,
  Key,
  Smartphone,
  Mail,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  User,
  CreditCard,
  Network,
  Database
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("wallet");
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Wallet Settings
  const [walletSettings, setWalletSettings] = useState({
    showBalances: true,
    showNGN: true,
    autoRefresh: true,
    confirmTransactions: true
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    purchaseAlerts: true,
    priceAlerts: true,
    transactionUpdates: true,
    marketingEmails: false
  });

  // Display Settings
  const [displaySettings, setDisplaySettings] = useState({
    theme: "dark",
    currency: "USD",
    language: "en",
    compactMode: false
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    sessionTimeout: 30,
    autoLock: true
  });

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && mounted) {
      const savedSettings = localStorage.getItem("g8s-settings");
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          if (settings.wallet) setWalletSettings(settings.wallet);
          if (settings.notifications) setNotifications(settings.notifications);
          if (settings.display) setDisplaySettings(settings.display);
          if (settings.security) setSecuritySettings(settings.security);
        } catch (error) {
          console.error("Error loading settings:", error);
        }
      }
    }
  }, [mounted]);

  // Save settings to localStorage
  const saveSettings = () => {
    setSaveStatus("saving");
    try {
      if (typeof window !== 'undefined' && mounted) {
        const settings = {
          wallet: walletSettings,
          notifications,
          display: displaySettings,
          security: securitySettings
        };
        localStorage.setItem("g8s-settings", JSON.stringify(settings));
        
        // Apply theme
        if (document.documentElement) {
          document.documentElement.setAttribute("data-theme", displaySettings.theme);
        }
      }
      
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  const exportData = () => {
    const data = {
      wallet: walletSettings,
      notifications,
      display: displaySettings,
      security: securitySettings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "g8s-settings.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "display", label: "Display", icon: Palette },
    { id: "security", label: "Security", icon: Shield },
    { id: "network", label: "Network", icon: Network }
  ];

  const themes = [
    { id: "dark", name: "Dark", icon: Moon, gradient: "from-slate-900 to-gray-900" },
    { id: "light", name: "Light", icon: Sun, gradient: "from-blue-50 to-cyan-50" },
    { id: "lpg", name: "LPG", icon: Flame, gradient: "from-blue-900 via-cyan-900 to-blue-900" }
  ];

  const currencies = [
    { id: "USD", name: "US Dollar", symbol: "$" },
    { id: "NGN", name: "Nigerian Naira", symbol: "₦" },
    { id: "EUR", name: "Euro", symbol: "€" }
  ];

  // Show loading state until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
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
              <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
              <p className="text-gray-300">Configure your G8S LPG IDO experience</p>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportData}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveSettings}
                disabled={saveStatus === "saving"}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center space-x-2"
              >
                {saveStatus === "saving" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : saveStatus === "saved" ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : saveStatus === "error" ? (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    <span>Error</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            {/* Wallet Settings */}
            {activeTab === "wallet" && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Wallet className="w-6 h-6" />
                  <span>Wallet Settings</span>
                </h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Eye className="w-5 h-5 text-blue-400" />
                        <div>
                          <h3 className="text-white font-medium">Show Token Balances</h3>
                          <p className="text-sm text-gray-400">Display your PUSD and G8S balances</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={walletSettings.showBalances}
                          onChange={(e) => setWalletSettings({...walletSettings, showBalances: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5 text-green-400" />
                        <div>
                          <h3 className="text-white font-medium">Show NGN Values</h3>
                          <p className="text-sm text-gray-400">Display Nigerian Naira equivalent values</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={walletSettings.showNGN}
                          onChange={(e) => setWalletSettings({...walletSettings, showNGN: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Database className="w-5 h-5 text-purple-400" />
                        <div>
                          <h3 className="text-white font-medium">Auto Refresh Balances</h3>
                          <p className="text-sm text-gray-400">Automatically update wallet balances</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={walletSettings.autoRefresh}
                          onChange={(e) => setWalletSettings({...walletSettings, autoRefresh: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-orange-400" />
                        <div>
                          <h3 className="text-white font-medium">Confirm Transactions</h3>
                          <p className="text-sm text-gray-400">Require confirmation for all transactions</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={walletSettings.confirmTransactions}
                          onChange={(e) => setWalletSettings({...walletSettings, confirmTransactions: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Bell className="w-6 h-6" />
                  <span>Notification Settings</span>
                </h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <div>
                          <h3 className="text-white font-medium">Purchase Alerts</h3>
                          <p className="text-sm text-gray-400">Get notified when G8S token purchases complete</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.purchaseAlerts}
                          onChange={(e) => setNotifications({...notifications, purchaseAlerts: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Flame className="w-5 h-5 text-orange-400" />
                        <div>
                          <h3 className="text-white font-medium">Price Alerts</h3>
                          <p className="text-sm text-gray-400">Get notified about G8S token price changes</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.priceAlerts}
                          onChange={(e) => setNotifications({...notifications, priceAlerts: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Database className="w-5 h-5 text-blue-400" />
                        <div>
                          <h3 className="text-white font-medium">Transaction Updates</h3>
                          <p className="text-sm text-gray-400">Get notified about transaction status changes</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.transactionUpdates}
                          onChange={(e) => setNotifications({...notifications, transactionUpdates: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-purple-400" />
                        <div>
                          <h3 className="text-white font-medium">Marketing Emails</h3>
                          <p className="text-sm text-gray-400">Receive promotional content and updates</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.marketingEmails}
                          onChange={(e) => setNotifications({...notifications, marketingEmails: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Display Settings */}
            {activeTab === "display" && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Palette className="w-6 h-6" />
                  <span>Display Settings</span>
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Theme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {themes.map((themeOption) => (
                        <button
                          key={themeOption.id}
                          onClick={() => setDisplaySettings({...displaySettings, theme: themeOption.id})}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                            displaySettings.theme === themeOption.id
                              ? "border-blue-400 bg-blue-500/20"
                              : "border-white/20 bg-white/5 hover:border-white/40"
                          }`}
                        >
                          <div className={`w-full h-16 rounded-lg bg-gradient-to-r ${themeOption.gradient} mb-3 flex items-center justify-center`}>
                            <themeOption.icon className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-white font-medium">{themeOption.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Default Currency</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {currencies.map((currency) => (
                        <button
                          key={currency.id}
                          onClick={() => setDisplaySettings({...displaySettings, currency: currency.id})}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                            displaySettings.currency === currency.id
                              ? "border-blue-400 bg-blue-500/20"
                              : "border-white/20 bg-white/5 hover:border-white/40"
                          }`}
                        >
                          <div className="text-2xl font-bold text-white mb-2">{currency.symbol}</div>
                          <p className="text-white font-medium">{currency.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div>
                        <h4 className="text-white font-medium">Compact Mode</h4>
                        <p className="text-sm text-gray-400">Use smaller spacing and components</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={displaySettings.compactMode}
                          onChange={(e) => setDisplaySettings({...displaySettings, compactMode: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Shield className="w-6 h-6" />
                  <span>Security Settings</span>
                </h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Key className="w-5 h-5 text-green-400" />
                        <div>
                          <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        {securitySettings.twoFactor ? "Disable" : "Enable"}
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Lock className="w-5 h-5 text-orange-400" />
                        <div>
                          <h3 className="text-white font-medium">Auto Lock</h3>
                          <p className="text-sm text-gray-400">Automatically lock the app after inactivity</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.autoLock}
                          onChange={(e) => setSecuritySettings({...securitySettings, autoLock: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium">Session Timeout</h3>
                        <span className="text-blue-400 font-semibold">{securitySettings.sessionTimeout} minutes</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-4">Automatically log out after this period of inactivity</p>
                      <input
                        type="range"
                        min="5"
                        max="120"
                        step="5"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>5 min</span>
                        <span>120 min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Network Settings */}
            {activeTab === "network" && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Network className="w-6 h-6" />
                  <span>Network Settings</span>
                </h2>
                <div className="space-y-6">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <h3 className="text-white font-medium mb-4">Current Network</h3>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 font-semibold">Sepolia Testnet</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Connected to Ethereum Sepolia test network</p>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-xl">
                    <h3 className="text-white font-medium mb-4">Contract Addresses</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">G8S Token</p>
                        <p className="text-white font-mono text-sm">0xCe28Eb32bbd8c66749b227A860beFcC12e612295</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">PUSD Token</p>
                        <p className="text-white font-mono text-sm">0xe1976f47c72409aE1De3572403E4D3E8EF447289</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">IDO Contract</p>
                        <p className="text-white font-mono text-sm">0x182a1b31e2C57B44D6700eEBBD6733511b559782</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-xl">
                    <h3 className="text-white font-medium mb-4">RPC Endpoints</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Primary RPC</span>
                        <span className="text-white text-sm">sepolia.drpc.org</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Backup RPC</span>
                        <span className="text-white text-sm">rpc.sepolia.org</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Status</span>
                        <span className="text-green-400 text-sm">Connected</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
        </div>
      </div>
    </div>
  );
}