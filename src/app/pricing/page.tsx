"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowLeft } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "Free",
    description: "Perfect for getting started",
    features: [
      "Basic sales tracking",
      "Customer management",
      "Monthly sales reports",
      "Email support",
    ],
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$19",
    period: "/month",
    description: "For growing businesses",
    features: [
      "Advanced analytics",
      "Employee management",
      "Expense tracking",
      "Egg laying history",
      "Priority support",
      "Custom reports",
    ],
    highlighted: true,
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 z-50 bg-slate-950/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back Home</span>
          </Link>
          <h1 className="text-xl font-bold">Pricing</h1>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-400 text-lg mb-8">Choose the perfect plan for your business needs</p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 ">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
                plan.highlighted
                  ? "ring-2 ring-yellow-500 md:scale-105 hover:scale-110"
                  : "border border-white/10 hover:scale-105"
              }`}
            >
              {/* Background */}
              <div className={`absolute inset-0 ${
                plan.highlighted
                  ? "bg-linear-to-br from-yellow-500/10 to-orange-500/10"
                  : "bg-linear-to-br from-slate-800 to-slate-900"
              }`} />

              {/* Most Popular Badge */}
              {plan.highlighted && (
                <div className="relative z-10 bg-linear-to-r from-yellow-500 to-orange-500 text-white text-sm font-semibold py-2 text-center">
                  MOST POPULAR
                </div>
              )}

              {/* Content */}
              <div className="relative z-10 p-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400 ml-2">{plan.period}</span>
                </div>

                <button className={`w-full py-3 rounded-lg font-semibold mb-8 transition-all duration-300 cursor-pointer ${
                  plan.highlighted
                    ? "bg-linear-to-r from-yellow-500 to-orange-500 hover:shadow-lg hover:shadow-yellow-500/25 text-white"
                    : "bg-white/10 border border-white/20 hover:bg-white/20 text-white"
                }`}>
                  Get Started
                </button>

                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center bg-slate-900/50 rounded-xl p-8 border border-white/10"
        >
          <h3 className="text-2xl font-bold mb-4">Questions about pricing?</h3>
          <p className="text-gray-400 mb-6">Check out our FAQ or contact our sales team for enterprise solutions.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/faq" className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
              View FAQ
            </Link>
            <a href="mailto:sales@eggtracker.com" className="px-6 py-3 bg-linear-to-r from-yellow-500 to-orange-500 rounded-lg hover:shadow-lg hover:shadow-yellow-500/25 transition-all">
              Contact Sales
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
