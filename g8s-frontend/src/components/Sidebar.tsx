"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  TrendingUp,
  Users,
  Settings,
  LogIn,
  UserPlus,
  Menu,
  X,
  Flame,
  Zap,
  Globe,
  Shield,
  BarChart3,
  Wallet,
  HelpCircle,
  Mail,
  Twitter,
  Linkedin,
  Github,
  ChevronRight,
  Target
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: Home,
      current: pathname === "/"
    },
    {
      name: "IDO Sale",
      href: "/ido",
      icon: TrendingUp,
      current: pathname === "/ido"
    },
    {
      name: "About",
      href: "/about",
      icon: Globe,
      current: pathname === "/about",
      submenu: [
        { name: "Mission", href: "/about/mission", icon: Target },
        { name: "Team", href: "/about/team", icon: Users },
        { name: "Partners", href: "/about/partners", icon: Shield }
      ]
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      current: pathname === "/analytics"
    },
    {
      name: "Wallet",
      href: "/wallet",
      icon: Wallet,
      current: pathname === "/wallet"
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      current: pathname === "/settings"
    }
  ];

  const authLinks = [
    { name: "Sign In", href: "/signin", icon: LogIn },
    { name: "Sign Up", href: "/signup", icon: UserPlus }
  ];

  const socialLinks = [
    { name: "Twitter", href: "https://twitter.com/G8S_LPG", icon: Twitter },
    { name: "LinkedIn", href: "https://linkedin.com/company/g8s-lpg", icon: Linkedin },
    { name: "GitHub", href: "https://github.com/G8S-LPG", icon: Github },
    { name: "Email", href: "mailto:info@g8s-lpg.com", icon: Mail }
  ];

  return (
    <>
      {/* Desktop Sidebar - Always Visible */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="hidden lg:block fixed inset-y-0 left-0 z-30 w-80 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 border-r border-blue-500/20 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">G8S LPG</h1>
              <p className="text-xs text-blue-300">Clean Energy IDO</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => (
            <div key={item.name}>
              <Link
                href={item.href}
                onClick={() => {
                  if (item.submenu) {
                    setActiveSubmenu(activeSubmenu === item.name ? null : item.name);
                  }
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                  item.current
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </div>
                {item.submenu && (
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeSubmenu === item.name ? "rotate-90" : ""
                    }`}
                  />
                )}
              </Link>

              {/* Submenu */}
              {item.submenu && activeSubmenu === item.name && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-4 mt-2 space-y-1"
                >
                  {item.submenu.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className="flex items-center space-x-3 px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <subItem.icon className="w-4 h-4" />
                      <span>{subItem.name}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </nav>

        {/* Auth Links */}
        <div className="px-4 py-4 border-t border-blue-500/20">
          <div className="space-y-2">
            {authLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center space-x-3 px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="p-4 border-t border-blue-500/20">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Connect With Us</h3>
          <div className="flex space-x-3">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <link.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-blue-500/20">
          <p className="text-xs text-gray-500 text-center">
            © 2024 G8S LPG. All rights reserved.
          </p>
        </div>
      </motion.div>

      {/* Mobile Sidebar - Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={onClose}
            />
            
            {/* Mobile Sidebar */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 border-r border-blue-500/20 shadow-2xl lg:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-blue-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">G8S LPG</h1>
                    <p className="text-xs text-blue-300">Clean Energy IDO</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        if (item.submenu) {
                          setActiveSubmenu(activeSubmenu === item.name ? null : item.name);
                        } else {
                          onClose();
                        }
                      }}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                        item.current
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                          : "text-gray-300 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      {item.submenu && (
                        <ChevronRight
                          className={`w-4 h-4 transition-transform duration-200 ${
                            activeSubmenu === item.name ? "rotate-90" : ""
                          }`}
                        />
                      )}
                    </Link>

                    {/* Submenu */}
                    {item.submenu && activeSubmenu === item.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-4 mt-2 space-y-1"
                      >
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={onClose}
                            className="flex items-center space-x-3 px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <subItem.icon className="w-4 h-4" />
                            <span>{subItem.name}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Auth Links */}
              <div className="px-4 py-4 border-t border-blue-500/20">
                <div className="space-y-2">
                  {authLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center space-x-3 px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <link.icon className="w-4 h-4" />
                      <span>{link.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="p-4 border-t border-blue-500/20">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Connect With Us</h3>
                <div className="flex space-x-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      <link.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-blue-500/20">
                <p className="text-xs text-gray-500 text-center">
                  © 2024 G8S LPG. All rights reserved.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}