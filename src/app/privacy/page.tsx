"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 z-50 bg-slate-950/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back Home</span>
          </Link>
          <h1 className="text-xl font-bold">Privacy Policy</h1>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-2">Privacy Policy</h2>
          <p className="text-gray-400 mb-8">Last updated: April 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">1. Introduction</h3>
              <p className="text-gray-300 leading-relaxed">
                Egg Tracker ("we", "our", or "us") operates the Egg Tracker platform. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">2. Information Collection and Use</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                We collect several different types of information for various purposes to provide and improve our Service to you.
              </p>
              <div className="bg-slate-800/50 rounded-lg p-6 border border-white/10">
                <h4 className="font-semibold mb-3">Types of Data Collected:</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Personal Data:</strong> Name, email address, phone number, billing address</li>
                  <li>• <strong>Business Data:</strong> Sales records, customer information, employee data, expense records</li>
                  <li>• <strong>Usage Data:</strong> Browser type, pages visited, time spent, IP address</li>
                  <li>• <strong>Technical Data:</strong> Device information, operating system, device identifiers</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">3. Use of Data</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Egg Tracker uses the collected data for various purposes:
              </p>
              <ul className="space-y-2 text-gray-300 ml-4">
                <li>• To provide and maintain our Service</li>
                <li>• To notify you about changes to our Service</li>
                <li>• To allow you to participate in interactive features of our Service</li>
                <li>• To provide customer support</li>
                <li>• To gather analysis or valuable information so we can improve our Service</li>
                <li>• To monitor the usage of our Service</li>
                <li>• To detect, prevent and address technical issues</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">4. Security of Data</h3>
              <p className="text-gray-300 leading-relaxed">
                The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security. All data is encrypted in transit using SSL/TLS protocols and encrypted at rest using industry-standard encryption algorithms.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">5. Data Retention</h3>
              <p className="text-gray-300 leading-relaxed">
                We will retain your Personal Data only for as long as necessary for the purposes set out in this Privacy Policy. However, we may retain your Personal Data for a longer period in the event of a complaint or if we reasonably believe that there is a prospect of litigation relating to your Personal Data or transactions.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">6. Your Rights</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Depending on your location, you may have certain rights regarding your Personal Data:
              </p>
              <ul className="space-y-2 text-gray-300 ml-4">
                <li>• The right to access your Personal Data</li>
                <li>• The right to correct inaccurate Personal Data</li>
                <li>• The right to request deletion of your Personal Data</li>
                <li>• The right to restrict processing of your Personal Data</li>
                <li>• The right to data portability</li>
                <li>• The right to withdraw consent</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">7. Contact Us</h3>
              <p className="text-gray-300 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-slate-800/50 rounded-lg p-6 border border-white/10 mt-4">
                <p className="text-gray-300">
                  Email: <a href="mailto:privacy@eggtracker.com" className="text-yellow-400 hover:text-yellow-300">privacy@eggtracker.com</a>
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
