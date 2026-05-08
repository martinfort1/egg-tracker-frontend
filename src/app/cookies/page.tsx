"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function CookiePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 z-50 bg-slate-950/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back Home</span>
          </Link>
          <h1 className="text-xl font-bold">Cookie Policy</h1>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-2">Cookie Policy</h2>
          <p className="text-gray-400 mb-8">Last updated: April 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">1. What Are Cookies?</h3>
              <p className="text-gray-300 leading-relaxed">
                Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently and to provide information to the website owners.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">2. Our Cookie Policy</h3>
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-6 border border-yellow-500/30 mb-6">
                <p className="text-lg font-semibold text-yellow-400 mb-2">Privacy First Approach</p>
                <p className="text-gray-300 leading-relaxed">
                  <strong>We do not use cookies on Egg Tracker.</strong> We are committed to protecting your privacy and maintaining a transparent relationship with our users. We have designed our Service to function without the use of cookies or other tracking technologies.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">3. Why We Don't Use Cookies</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Our privacy-first approach means we avoid cookies for several reasons:
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">•</span>
                  <span className="text-gray-300"><strong>Your Privacy:</strong> We respect your right to privacy and don't need cookies to track your behavior.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">•</span>
                  <span className="text-gray-300"><strong>User Control:</strong> You have full control over your data without any hidden tracking.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">•</span>
                  <span className="text-gray-300"><strong>Security:</strong> Fewer tracking mechanisms mean fewer potential security vulnerabilities.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">•</span>
                  <span className="text-gray-300"><strong>Simplicity:</strong> Our Service is optimized to work efficiently without unnecessary tracking.</span>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">4. Session Management</h3>
              <p className="text-gray-300 leading-relaxed">
                While we don't use persistent cookies, we may use session tokens to maintain your authenticated session while you're using our Service. These are temporary and are cleared when you log out or close your browser. These session tokens are essential for the basic functionality of our platform and are not used for tracking or advertising purposes.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">5. Third-Party Services</h3>
              <p className="text-gray-300 leading-relaxed">
                We do not integrate with third-party tracking services, analytics providers, or advertising networks that would place cookies on your device. This means you can use Egg Tracker with confidence knowing that your browsing behavior is not being tracked or sold to third parties.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">6. Your Browser Settings</h3>
              <p className="text-gray-300 leading-relaxed">
                Most web browsers allow you to control cookies through their settings. Since we don't use cookies, there's no need to adjust your cookie settings when using Egg Tracker. However, you can manage cookie settings in your browser preferences at any time.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">7. Changes to This Policy</h3>
              <p className="text-gray-300 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. If we make significant changes, we will notify you by email or through a prominent notice on our website.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">8. Contact Us</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have any questions about this Cookie Policy or our privacy practices, please don't hesitate to contact us:
              </p>
              <div className="bg-slate-800/50 rounded-lg p-6 border border-white/10">
                <p className="text-gray-300 mb-2">
                  Email: <a href="mailto:privacy@eggtracker.com" className="text-yellow-400 hover:text-yellow-300">privacy@eggtracker.com</a>
                </p>
                <p className="text-gray-400 text-sm mt-4">
                  We're happy to answer any questions about how we handle your data and maintain your privacy.
                </p>
              </div>
            </section>

            <section className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-6 mt-8">
              <p className="text-gray-300">
                <strong className="text-yellow-400">Summary:</strong> Egg Tracker does not use cookies. We are committed to providing a privacy-respecting experience where your data remains yours, and we do not track or monitor your behavior for advertising or other purposes.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
