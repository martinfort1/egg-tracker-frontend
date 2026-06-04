"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Lightbulb, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import ProtectedRoute from "@/components/protected-route";

const featureSuggestionSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  email: z.string().email("Please enter a valid email"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description must be less than 5000 characters"),
  category: z.enum(["sales", "employees", "analytics", "automation", "ui", "other"], {
    message: "Please select a category"
  }),
});

type FeatureSuggestionFormValues = z.infer<typeof featureSuggestionSchema>;

const categories = [
  { value: "sales", label: "Sales & Invoicing" },
  { value: "employees", label: "Employee Management" },
  { value: "analytics", label: "Analytics & Reports" },
  { value: "automation", label: "Automation" },
  { value: "ui", label: "User Interface" },
  { value: "other", label: "Other" },
];

function SuggestFeaturePageContent() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FeatureSuggestionFormValues>({
    resolver: zodResolver(featureSuggestionSchema),
    defaultValues: {
      email: "",
      title: "",
      category: "other",
      description: "",
    },
  });

  const onSubmit = async (data: FeatureSuggestionFormValues) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      // Submit feature suggestion to backend
      await api.post("/feature-suggestions", data);
      toast.success("Feature suggestion submitted! Thank you for helping us improve.");
      reset();
      // Redirect to dashboard after successful submission
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      toast.error("Failed to submit feature suggestion");
      setServerError(
        (error as any)?.response?.data?.message ??
          "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-xl font-bold">Suggest a Feature</h1>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <Lightbulb className="w-16 h-16 text-yellow-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Share Your Idea</h2>
          <p className="text-gray-400 text-lg">
            We'd love to hear your suggestions for new features or improvements to
            Egg Tracker. Your feedback helps us build a better product for you.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl"
        >
          {serverError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl bg-red-500/20 border border-red-400/30 p-4"
            >
              <p className="text-sm text-red-300">{serverError}</p>
            </motion.div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white" htmlFor="email">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register("email")}
              className={`${
                errors.email
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-white/20"
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Category Select */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white" htmlFor="category">
              Feature Category
            </label>
            <select
              id="category"
              {...register("category")}
              className="w-full h-8 rounded-lg border border-white/20 bg-slate-800/50 px-3 py-1 text-sm text-white placeholder:text-gray-500 focus:border-ring focus:ring-3 focus:ring-ring/50 disabled:opacity-50 dark:bg-input/30 transition-colors outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-slate-800">
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-400">{errors.category.message}</p>
            )}
          </div>

          {/* Title Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white" htmlFor="title">
              Feature Title
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Give your feature idea a catchy title"
              {...register("title")}
              className={`${
                errors.title
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-white/20"
              }`}
            />
            {errors.title && (
              <p className="text-sm text-red-400">{errors.title.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white" htmlFor="description">
              Detailed Description
            </label>
            <textarea
              id="description"
              placeholder="Describe your feature idea in detail. How would it work? What problem does it solve? Why would it be useful?"
              rows={6}
              {...register("description")}
              className={`w-full rounded-lg border bg-slate-800/50 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-ring focus:ring-3 focus:ring-ring/50 disabled:opacity-50 dark:bg-input/30 transition-colors outline-none ${
                errors.description
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-white/20"
              }`}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <p>
                {errors.description ? (
                  <span className="text-red-400">{errors.description.message}</span>
                ) : (
                  `Be as detailed as possible`
                )}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold h-10 transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Feature Idea
              </>
            )}
          </Button>

          <p className="text-center text-xs text-gray-400">
            We review all suggestions and implement the most requested features
          </p>
        </motion.form>

        {/* Additional Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 mb-4">
            Other ways to connect with us:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm">
            <Link
              href="/feedback/support"
              className="hover:text-yellow-400 transition-colors"
            >
              Contact Support
            </Link>
            <span className="text-white/20">•</span>
            <Link
              href="/faq"
              className="hover:text-yellow-400 transition-colors"
            >
              Check FAQ
            </Link>
            <span className="text-white/20">•</span>
            <Link
              href="/feedback/status"
              className="hover:text-yellow-400 transition-colors"
            >
              Account Status
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SuggestFeaturePage() {
  return (
    <ProtectedRoute>
      <SuggestFeaturePageContent />
    </ProtectedRoute>
  );
}
