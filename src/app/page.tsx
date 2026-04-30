"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Egg, TrendingUp, Users, DollarSign, Zap, BarChart3,  Briefcase, Calendar, Github } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Sales Analytics",
    description: "Track and visualize all your egg sales"
  },
  {
    icon: Users,
    title: "Customer Management",
    description: "Manage buyers and track interactions"
  },
  {
    icon: DollarSign,
    title: "Debt Tracking",
    description: "Monitor customer payments and debts"
  },
  {
    icon: Briefcase,
    title: "Employee Payments",
    description: "Track employee compensation and payments"
  },
  {
    icon: Zap,
    title: "Expenses Control",
    description: "Monitor all operational expenses"
  },
  {
    icon: Calendar,
    title: "Egg Laying History",
    description: "Record and analyze laying patterns"
  },
  {
    icon: BarChart3,
    title: "Margins Graphs",
    description: "Visualize profit margins and trends"
  },
  {
    icon: Calendar,
    title: "Chicken Tracking",
    description: "Complete flock management system"
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      {/* Hero Section */}
      <div
        className="flex-1 flex items-center justify-center bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage: "url('/egg-bg.jpg')"
        }}
      >
        {/* Enhanced overlay with gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-black/80 via-black/60 to-black/40 backdrop-blur-[2px]" />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute top-20 left-20 w-32 h-32 bg-yellow-400/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute bottom-20 right-20 w-40 h-40 bg-orange-400/10 rounded-full blur-xl"
          />
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center text-white max-w-4xl px-6">

          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0, y: -180 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6"
          >
            <img src="/Logo_NoBuffer.png" alt="Egg Tracker Logo" className="mx-auto size-3/4 md:size-2/5 my-4" />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-200 mb-8 font-light leading-relaxed"
          >
            Manage your sales, track debts, and understand your business in one place.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/register"
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:border-white/50"
            >
              Create Account
            </Link>
            <Link
              href="/dashboard"
              className="group bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 px-8 py-4 rounded-full font-semibold text-lg shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105"
            >
              Get Started
              <span className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>

        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-6 bg-slate-900/50 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 text-lg">Everything you need to manage your poultry business efficiently</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-white/10 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-orange-500/0 group-hover:from-yellow-500/5 group-hover:to-orange-500/5 rounded-xl transition-all duration-300" />
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Egg className="w-6 h-6 text-yellow-400" />
                <span className="text-lg font-bold">Egg Tracker</span>
              </div>
              <p className="text-gray-400 text-sm">Simplifying poultry business management</p>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#features" className="hover:text-yellow-400 transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-yellow-400 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-yellow-400 transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-yellow-400 transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-yellow-400 transition-colors">Support</Link></li>
                <li><Link href="#" className="hover:text-yellow-400 transition-colors">Status</Link></li>
              </ul>
            </div>

            {/* Social/Contact Column */}
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-yellow-500/20 hover:border-yellow-500/50 border border-white/10 transition-all duration-300"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2026 Egg Tracker. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-yellow-400 transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}