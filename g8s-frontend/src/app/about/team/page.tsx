"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Users,
  User,
  Linkedin,
  Twitter,
  Mail,
  Award,
  GraduationCap,
  Briefcase,
  MapPin,
  Star,
  Target,
  Zap,
  Shield,
  Globe
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function Team() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState("leadership");

  const departments = [
    { id: "leadership", label: "Leadership", icon: Star },
    { id: "technology", label: "Technology", icon: Zap },
    { id: "business", label: "Business", icon: Briefcase },
    { id: "operations", label: "Operations", icon: Target }
  ];

  const leadershipTeam = [
    {
      name: "Supreme Oghenewoakpo",
      role: "Chief Executive Officer",
      bio: "Visionary and strategic leader with over 8 years of expertise in the oil and gas industry. A data-driven Process Operations expert and certified Process Safety Manager via NEBOSH, holding an MSc in Data Science from Pan-Atlantic University. Now pioneering the future of clean energy investments through blockchain technology at G8S LPG.",
      image: "/images/team/supreme-oghenewoakpo.jpg",
      location: "Lagos, Nigeria",
      experience: "8+ years",
      education: "MSc Data Science (PAU) & NEBOSH Certified",
      linkedin: "https://www.linkedin.com/in/supreme-oghenewoakpo-195ab134/",
      twitter: "https://x.com/DeSupreme",
      email: "supreme@g8s-lpg.com",
      achievements: ["MSc Data Science (PAU)", "NEBOSH Certified", "Process Safety Manager", "Oil & Gas Expert", "Data-Driven Operations", "G8S LPG Founder & CEO"]
    },
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      bio: "Blockchain expert and former Ethereum core developer. Built DeFi protocols with $1B+ TVL.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      location: "San Francisco, USA",
      experience: "12+ years",
      education: "Stanford MS",
      linkedin: "https://linkedin.com/in/michaelchen",
      twitter: "https://twitter.com/michaelchen",
      email: "michael@g8s-lpg.com",
      achievements: ["Ethereum Core Dev", "DeFi Pioneer", "TechCrunch 40 Under 40"]
    },
    {
      name: "Aisha Okafor",
      role: "Chief Financial Officer",
      bio: "Former Goldman Sachs VP with expertise in energy finance and sustainable investments.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      location: "Lagos, Nigeria",
      experience: "10+ years",
      education: "Harvard MBA",
      linkedin: "https://linkedin.com/in/aishaokafor",
      twitter: "https://twitter.com/aishaokafor",
      email: "aisha@g8s-lpg.com",
      achievements: ["Goldman Sachs VP", "CFA Charterholder", "Energy Finance Expert"]
    }
  ];

  const technologyTeam = [
    {
      name: "David Rodriguez",
      role: "Lead Blockchain Developer",
      bio: "Smart contract architect with expertise in Solidity and DeFi protocols.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      location: "Barcelona, Spain",
      experience: "8+ years",
      education: "UPC Barcelona",
      linkedin: "https://linkedin.com/in/davidrodriguez",
      twitter: "https://twitter.com/davidrodriguez",
      email: "david@g8s-lpg.com",
      achievements: ["Solidity Expert", "DeFi Architect", "OpenZeppelin Contributor"]
    },
    {
      name: "Emma Thompson",
      role: "Frontend Lead",
      bio: "React and Web3 specialist creating intuitive user experiences for blockchain applications.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
      location: "Toronto, Canada",
      experience: "6+ years",
      education: "Waterloo University",
      linkedin: "https://linkedin.com/in/emmathompson",
      twitter: "https://twitter.com/emmathompson",
      email: "emma@g8s-lpg.com",
      achievements: ["React Expert", "Web3 UX Designer", "Dribbble Top Designer"]
    }
  ];

  const businessTeam = [
    {
      name: "James Wilson",
      role: "Head of Partnerships",
      bio: "Energy industry veteran with extensive network in LPG distribution and clean energy sectors.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
      location: "Houston, USA",
      experience: "20+ years",
      education: "Rice University MBA",
      linkedin: "https://linkedin.com/in/jameswilson",
      twitter: "https://twitter.com/jameswilson",
      email: "james@g8s-lpg.com",
      achievements: ["Energy Industry Expert", "Partnership Builder", "Sales Leader"]
    },
    {
      name: "Priya Patel",
      role: "Marketing Director",
      bio: "Digital marketing expert specializing in Web3 and sustainable energy campaigns.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
      location: "Mumbai, India",
      experience: "7+ years",
      education: "IIM Ahmedabad",
      linkedin: "https://linkedin.com/in/priyapatel",
      twitter: "https://twitter.com/priyapatel",
      email: "priya@g8s-lpg.com",
      achievements: ["Web3 Marketing Expert", "Growth Hacker", "Brand Strategist"]
    }
  ];

  const operationsTeam = [
    {
      name: "Robert Kim",
      role: "Operations Manager",
      bio: "Supply chain expert with focus on sustainable energy distribution and logistics.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      location: "Seoul, South Korea",
      experience: "12+ years",
      education: "KAIST MS",
      linkedin: "https://linkedin.com/in/robertkim",
      twitter: "https://twitter.com/robertkim",
      email: "robert@g8s-lpg.com",
      achievements: ["Supply Chain Expert", "Operations Leader", "Process Optimizer"]
    }
  ];

  const getTeamByDepartment = (department: string) => {
    switch (department) {
      case "leadership": return leadershipTeam;
      case "technology": return technologyTeam;
      case "business": return businessTeam;
      case "operations": return operationsTeam;
      default: return leadershipTeam;
    }
  };

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
            className="text-center mb-12"
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 mb-6">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Our Team</span>
            </div>
            
            <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Meet the Team
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A diverse team of energy experts, blockchain developers, and business leaders 
              working together to revolutionize clean energy investments.
            </p>
          </motion.div>

          {/* Department Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {departments.map((department) => (
              <motion.button
                key={department.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveDepartment(department.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeDepartment === department.id
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                <department.icon className="w-5 h-5" />
                <span className="font-medium">{department.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Team Grid */}
          <motion.div
            key={activeDepartment}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {getTeamByDepartment(activeDepartment).map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300 group"
              >
                <div className="text-center mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500 mx-auto mb-4 ring-4 ring-white/20">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-blue-400 font-medium">{member.role}</p>
                  <div className="flex items-center justify-center space-x-1 mt-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">{member.location}</span>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4 leading-relaxed text-sm">
                  {member.bio}
                </p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center space-x-2 text-sm">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{member.experience} experience</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{member.education}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white mb-2">Key Achievements</h4>
                  <div className="space-y-1">
                    {member.achievements.map((achievement, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs">
                        <Award className="w-3 h-3 text-yellow-400" />
                        <span className="text-gray-300">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-4">
                  <motion.a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-white" />
                  </motion.a>
                  <motion.a
                    href={member.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center hover:bg-cyan-700 transition-colors"
                  >
                    <Twitter className="w-4 h-4 text-white" />
                  </motion.a>
                  <motion.a
                    href={`mailto:${member.email}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-white" />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Team Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Team Statistics</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Our diverse team brings together decades of experience across energy, technology, and finance.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Users, title: "Team Members", value: "15+", description: "Global team" },
                { icon: Briefcase, title: "Combined Experience", value: "150+", description: "Years of expertise" },
                { icon: Globe, title: "Countries", value: "8", description: "Global presence" },
                { icon: Award, title: "Awards", value: "25+", description: "Industry recognition" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                  <h4 className="text-lg font-semibold text-blue-400 mb-1">{stat.title}</h4>
                  <p className="text-gray-400 text-sm">{stat.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
