"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs: { question: string; answer: string }[] = [
  {
    question: "What is Egg Tracker?",
    answer: "Egg Tracker is a comprehensive management system designed for poultry businesses. It helps you track egg sales, manage customers, monitor employee payments, control expenses, and analyze your business performance all in one place.",
  },
  {
    question: "Can I use Egg Tracker for free?",
    answer: "Yes! Our Starter plan is free and includes basic sales tracking, customer management, and monthly reports. It's perfect for small operations or getting started.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take security very seriously. All your data is encrypted in transit and at rest. We use industry-standard security practices and comply with data protection regulations. Learn more in our Privacy Policy.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, MercadoPago, and bank transfers for premium plans. You can manage your billing and payment methods directly from your account settings.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Absolutely! You can cancel your subscription at any time without penalties. Your data will remain available for 30 days after cancellation for download.",
  },
  {
    question: "Is there a mobile app?",
    answer: "Currently, Egg Tracker is available as a web application that works great on mobile browsers. A native mobile app is planned for future releases.",
  },
  {
    question: "What if I need help or support?",
    answer: "We offer email support for all plans and priority support for Professional and Enterprise customers. You can also check our documentation or contact our support team at support@eggtracker.com.",
  },
  {
    question: "Can I upgrade or downgrade my plan anytime?",
    answer: "Yes, you can change your plan at any time. We'll prorate charges based on your usage, ensuring you only pay for what you use.",
  },
];

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border border-white/10 rounded-lg overflow-hidden hover:border-yellow-500/30 transition-colors duration-300"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-slate-800/50 hover:bg-slate-800 transition-colors duration-300"
      >
        <h3 className="text-lg font-semibold text-left">{question}</h3>
        <ChevronDown
          className={`w-5 h-5 text-yellow-400 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isOpen ? "auto" : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 py-4 bg-slate-900/50 text-gray-300 border-t border-white/10">
          {answer}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 z-50 bg-slate-950/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back Home</span>
          </Link>
          <h1 className="text-xl font-bold">FAQ</h1>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-lg">Find answers to common questions about Egg Tracker</p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              index={index}
            />
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center bg-linear-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-8 border border-yellow-500/30"
        >
          <h3 className="text-2xl font-bold mb-4">Didn't find your answer?</h3>
          <p className="text-gray-300 mb-6">Our support team is here to help. Get in touch with us and we'll respond as soon as possible.</p>
          <a
            href="mailto:support@eggtracker.com"
            className="inline-block px-8 py-3 bg-linear-to-r from-yellow-500 to-orange-500 rounded-lg hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 font-semibold"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </div>
  );
}
