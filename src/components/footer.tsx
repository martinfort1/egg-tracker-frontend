"use client";

import {  Briefcase, Github } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10 py-12 px-6 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/Logo_NoBuffer.png"
                alt="Egg Tracker Logo"
                className="w-40 h-48 object-contain"
              />
            </div>
            <p className="text-gray-400 text-sm">
              Simplifying poultry business management
            </p>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/#features"
                  scroll={true}
                  className="hover:text-yellow-400 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-yellow-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/*  Column */}
          <div>
            <h4 className="font-semibold mb-4">Feedback</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/feedback/status"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Check your account status
                </Link>
              </li>
              <li>
                <Link
                  href="/feedback/support"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  href="/feedback/suggest-feature"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Suggest a feature
                </Link>
              </li>
            </ul>
          </div>

          {/* Social/Contact Column */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com/martinfort1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-yellow-500/20 hover:border-yellow-500/50 border border-white/10 transition-all duration-300"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://martinfort.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-yellow-500/20 hover:border-yellow-500/50 border border-white/10 transition-all duration-300"
              >
                <Briefcase className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2026 Egg Tracker. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="hover:text-yellow-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-yellow-400 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="hover:text-yellow-400 transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
