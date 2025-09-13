"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Settings,
  User,
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
  Trash2,
  Download,
  Upload,
  Key,
  Smartphone,
  Mail,
  MessageSquare,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showBalance: true,
    allowMessages: true
  });
  const [theme, setTheme] = useState("dark");
  const [profile, setProfile] = useState({
    displayName: "G8S Investor",
    email: "investor@g8s-lpg.com",
    bio: ""
  });
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("g8s-settings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.notifications) setNotifications(settings.notifications);
        if (settings.privacy) setPrivacy(settings.privacy);
        if (settings.theme) setTheme(settings.theme);
        if (settings.profile) setProfile(settings.profile);
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = async () => {
    setSaveStatus("saving");
    try {
      const settings = {
        notifications,
        privacy,
        theme,
        profile
      };
      localStorage.setItem("g8s-settings", JSON.stringify(settings));
      
      // Apply theme
      document.documentElement.setAttribute("data-theme", theme);
      
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  const exportData = () => {
    const data = {
      notifications,
      privacy,
      theme,
      profile,
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
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "security", label: "Security", icon: Lock },
    { id: "preferences", label: "Preferences", icon: Settings }
  ];

  const themes = [
    { id: "light", name: "Light", icon: Sun, gradient: "from-blue-50 to-cyan-50" },
    { id: "dark", name: "Dark", icon: Moon, gradient: "from-slate-900 to-gray-900" },
    { id: "lpg", name: "LPG", icon: Flame, gradient: "from-blue-900 via-cyan-900 to-blue-900" }
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-300">Customize your G8S LPG experience</p>
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
            {activeTab === "profile" && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <button className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors">
                        Change Avatar
                      </button>
                      <p className="text-sm text-gray-400 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                      <input
                        type="text"
                        value={profile.displayName}
                        onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about yourself..."
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={saveSettings}
                    disabled={saveStatus === "saving"}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center space-x-2"
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
                        <span>Save Changes</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-blue-400" />
                        <div>
                          <h3 className="text-white font-medium">Email Notifications</h3>
                          <p className="text-sm text-gray-400">Receive updates via email</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.email}
                          onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-5 h-5 text-green-400" />
                        <div>
                          <h3 className="text-white font-medium">Push Notifications</h3>
                          <p className="text-sm text-gray-400">Receive push notifications on your device</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.push}
                          onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="w-5 h-5 text-purple-400" />
                        <div>
                          <h3 className="text-white font-medium">SMS Notifications</h3>
                          <p className="text-sm text-gray-400">Receive text message alerts</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.sms}
                          onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Bell className="w-5 h-5 text-orange-400" />
                        <div>
                          <h3 className="text-white font-medium">Marketing Updates</h3>
                          <p className="text-sm text-gray-400">Receive promotional content and updates</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.marketing}
                          onChange={(e) => setNotifications({...notifications, marketing: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">Appearance Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Theme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {themes.map((themeOption) => (
                        <button
                          key={themeOption.id}
                          onClick={() => setTheme(themeOption.id)}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                            theme === themeOption.id
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
                    <h3 className="text-lg font-semibold text-white mb-4">Display Options</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                          <h4 className="text-white font-medium">Show Balance</h4>
                          <p className="text-sm text-gray-400">Display token balances in wallet</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacy.showBalance}
                            onChange={(e) => setPrivacy({...privacy, showBalance: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        Enable
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Change Password</h3>
                        <p className="text-sm text-gray-400">Update your account password</p>
                      </div>
                      <button className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors">
                        Change
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Export Data</h3>
                        <p className="text-sm text-gray-400">Download your account data</p>
                      </div>
                      <button 
                        onClick={exportData}
                        className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-red-400 font-medium">Delete Account</h3>
                        <p className="text-sm text-gray-400">Permanently delete your account and all data</p>
                      </div>
                      <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
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