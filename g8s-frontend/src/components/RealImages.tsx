"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function RealImages() {
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  const cleanEnergyImages = [
    {
      id: 1,
      title: "Happy Family Cooking",
      description: "Clean LPG cooking for healthy family meals",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center",
      category: "Cooking",
      icon: "🍳"
    },
    {
      id: 2,
      title: "Home Heating",
      description: "Efficient LPG heating for comfortable homes",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center",
      category: "Heating",
      icon: "🔥"
    },
    {
      id: 3,
      title: "Industrial Use",
      description: "LPG powering clean industrial processes",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop&crop=center",
      category: "Industry",
      icon: "🏭"
    },
    {
      id: 4,
      title: "Transportation",
      description: "Clean LPG fuel for vehicles",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&crop=center",
      category: "Transport",
      icon: "🚛"
    },
    {
      id: 5,
      title: "Rural Communities",
      description: "LPG bringing energy to remote areas",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center",
      category: "Rural",
      icon: "🏘️"
    },
    {
      id: 6,
      title: "Clean Environment",
      description: "Reducing carbon footprint with LPG",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&crop=center",
      category: "Environment",
      icon: "🌱"
    }
  ];

  return (
    <div className="relative">
      {/* Floating Images */}
      {cleanEnergyImages.map((item, index) => (
        <motion.div
          key={item.id}
          className="absolute"
          initial={{ 
            opacity: 0, 
            scale: 0,
            x: Math.random() * 200 - 100,
            y: Math.random() * 200 - 100
          }}
          animate={{ 
            opacity: 0.8, 
            scale: 1,
            x: [0, Math.random() * 50 - 25, 0],
            y: [0, Math.random() * 50 - 25, 0]
          }}
          transition={{
            duration: Math.random() * 4 + 6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: index * 0.5
          }}
          style={{
            left: `${20 + (index * 15)}%`,
            top: `${10 + (index * 12)}%`,
            zIndex: 10 - index
          }}
          whileHover={{ 
            scale: 1.2, 
            opacity: 1,
            zIndex: 20
          }}
          onHoverStart={() => setHoveredImage(item.id)}
          onHoverEnd={() => setHoveredImage(null)}
        >
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-white/10 backdrop-blur-sm">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-1 left-1 text-2xl">{item.icon}</div>
            </div>
            
            {/* Hover Tooltip */}
            <AnimatePresence>
              {hoveredImage === item.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-2xl min-w-[200px]"
                >
                  <h4 className="text-white font-semibold text-sm mb-1">{item.title}</h4>
                  <p className="text-gray-300 text-xs mb-2">{item.description}</p>
                  <span className="text-blue-400 text-xs font-medium">{item.category}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-green-500/10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]" />
      </div>
    </div>
  );
}
