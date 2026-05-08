"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 z-50 bg-slate-950/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back Home</span>
          </Link>
          <h1 className="text-xl font-bold">Terms of Service</h1>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-2">Terms of Service</h2>
          <p className="text-gray-400 mb-8">Last updated: April 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">1. Agreement to Terms</h3>
              <p className="text-gray-300 leading-relaxed">
                These Terms of Service constitute a legally binding agreement made between you and Egg Tracker ("Company", "we", "us", or "our"), concerning your access to and use of the Egg Tracker website as well as any associated applications (the "Service").
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">2. Use License</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) on Egg Tracker's Service for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="space-y-2 text-gray-300 ml-4">
                <li>• Modifying or copying the materials</li>
                <li>• Using the materials for any commercial purpose or for any public display</li>
                <li>• Attempting to decompile or reverse engineer any software contained on Egg Tracker's Service</li>
                <li>• Removing any copyright or other proprietary notations from the materials</li>
                <li>• Transferring the materials to another person or "mirroring" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">3. Account Registration</h3>
              <p className="text-gray-300 leading-relaxed">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account. You are responsible for safeguarding the password and all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">4. User Responsibilities</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                You agree that you will not use Egg Tracker's Service to:
              </p>
              <ul className="space-y-2 text-gray-300 ml-4">
                <li>• Attempt to gain unauthorized access to the Service or its related systems</li>
                <li>• Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">5. Data and Content</h3>
              <p className="text-gray-300 leading-relaxed">
                You retain all rights to any data and content you provide to Egg Tracker. By using our Service, you grant us a limited license to store, process, and display your data for the purposes of providing the Service. We are not responsible for any data loss, corruption, or unauthorized access that may occur due to your negligence.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">6. Intellectual Property Rights</h3>
              <p className="text-gray-300 leading-relaxed">
                The Service and its entire contents, features and functionality (including but not limited to all information, software, text, displays, images, video and audio) are owned by Egg Tracker, its licensors or other providers of such material and are protected by copyright and other intellectual property laws.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">7. Limitation of Liability</h3>
              <p className="text-gray-300 leading-relaxed">
                In no event shall Egg Tracker, nor its directors, employees or agents, be liable to you for any indirect, incidental, special, consequential, punitive damages or lost profits resulting from your use of or inability to use the Service, even if we have been advised of the possibility of such damages.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">8. Disclaimer</h3>
              <p className="text-gray-300 leading-relaxed">
                The materials on Egg Tracker's Service are provided on an 'as is' basis. Egg Tracker makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">9. Modifications to Service</h3>
              <p className="text-gray-300 leading-relaxed">
                Egg Tracker may modify or discontinue, temporarily or permanently, the Service or any features or portions thereof without prior notice. You agree that Egg Tracker will not be liable to you or to any third party for any modification, suspension or discontinuance of the Service.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">10. Governing Law</h3>
              <p className="text-gray-300 leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Egg Tracker operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 text-yellow-400">11. Contact Us</h3>
              <p className="text-gray-300 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-slate-800/50 rounded-lg p-6 border border-white/10 mt-4">
                <p className="text-gray-300">
                  Email: <a href="mailto:legal@eggtracker.com" className="text-yellow-400 hover:text-yellow-300">legal@eggtracker.com</a>
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
