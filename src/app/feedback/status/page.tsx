"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";
import LoadSpin from "@/components/load-spin";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/protected-route";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

function StatusPageContent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine plan - for now default to Free (this can be extended later with subscription model)
  const plan = "Free"; // TODO: Fetch from user subscription model when added
  const isFreePlan = plan === "Free";

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchUserProfile();
    }
  }, [authLoading, isAuthenticated]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/auth/me");
      setUserProfile(response.data);
    } catch (err) {
      setError("Failed to load profile");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadSpin />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link href="/dashboard">
            <Button variant="default">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const freePlanFeatures = [
    "Basic sales tracking",
    "Customer management",
    "Monthly sales reports",
    "Email support",
  ];

  const premiumFeatures = [
    "Everything in Free plan",
    "Advanced analytics",
    "Employee management",
    "Expense tracking",
    "Egg laying history",
    "Priority support",
    "Custom reports",
  ];

  const currentFeatures = isFreePlan ? freePlanFeatures : premiumFeatures;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 z-50 bg-slate-950/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <h1 className="text-xl font-bold">Account Status</h1>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome, {userProfile?.name}!
          </h2>
          <p className="text-gray-400 text-lg">
            Here's your current account and plan information
          </p>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="border border-white/10 rounded-xl p-8 mb-12 bg-slate-800/50 hover:bg-slate-800 transition-colors"
        >
          <h3 className="text-2xl font-bold mb-6">Account Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Full Name:</span>
              <span className="font-semibold text-white">{userProfile?.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Email:</span>
              <span className="font-semibold text-white">{userProfile?.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Member Since:</span>
              <span className="font-semibold text-white">
                {userProfile?.createdAt
                  ? new Date(userProfile.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Current Plan Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold mb-8">Your Current Plan</h3>

          {/* Plan Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={`relative rounded-xl overflow-hidden transition-all duration-300 border-2 ${
              isFreePlan
                ? "border-yellow-500/50 bg-linear-to-br from-yellow-500/10 to-orange-500/10"
                : "border-green-500/50 bg-linear-to-br from-green-500/10 to-emerald-500/10"
            }`}
          >
            {/* Header */}
            <div className={`px-8 py-6 flex items-center justify-between ${
              isFreePlan
                ? "bg-linear-to-r from-yellow-500 to-orange-500"
                : "bg-linear-to-r from-green-500 to-emerald-500"
            }`}>
              <div className="flex items-center gap-4">
                {isFreePlan ? (
                  <Zap className="w-8 h-8 text-white" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-white" />
                )}
                <div>
                  <h4 className="text-xl font-bold text-white">{plan} Plan</h4>
                  <p className="text-white/90 text-sm">
                    {isFreePlan ? "$0/month" : "$19/month"}
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="p-8">
              <h5 className="font-semibold mb-6 text-lg">Included Features:</h5>
              <ul className="space-y-3">
                {currentFeatures.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <CheckCircle className={`w-5 h-5 shrink-0 ${
                      isFreePlan ? "text-yellow-400" : "text-green-400"
                    }`} />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            {isFreePlan && (
              <div className="px-8 pb-8">
                <Link href="/pricing">
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                    Upgrade to Professional
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <p className="text-gray-400 mb-6">Need help or have questions?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/feedback/support">
              <Button variant="outline" className="w-full sm:w-auto bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 
text-black font-semibold h-10 transition-all duration-300">
                Contact Support
              </Button>
            </Link>
            <Link href="/feedback/suggest-feature">
              <Button variant="outline" className="w-full sm:w-auto bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 
text-black font-semibold h-10 transition-all duration-300">
                Suggest a Feature
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function StatusPage() {
  return (
    <ProtectedRoute>
      <StatusPageContent />
    </ProtectedRoute>
  );
}
