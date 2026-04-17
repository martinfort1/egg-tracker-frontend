"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Egg } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { saveToken } from "@/lib/auth"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"

const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const { refreshAuth } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null)
    setIsSubmitting(true)

    try {
      const res = await api.post("/auth/register", data)
      saveToken(res.data.access_token)
      refreshAuth()
      toast.success("Account created successfully! 🎉")
      router.push("/dashboard")
    } catch (error) {
      toast.error("Registration failed")
      setServerError(
        (error as any)?.response?.data?.message ??
          "Something went wrong. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden"
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
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md px-6"
      >

        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full shadow-2xl mb-4">
            <Egg className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2 bg-linear-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-gray-300 text-lg">Join us today</p>
        </motion.div>

        {/* Register Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl"
        >

          {serverError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl bg-red-500/20 border border-red-400/30 p-4"
            >
              <p className="text-sm text-red-300 text-center">{serverError}</p>
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-white" htmlFor="name">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              className="w-full bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-yellow-400 focus:ring-yellow-400/20"
              {...register("name")}
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-300"
              >
                {errors.name.message}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-white" htmlFor="email">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-yellow-400 focus:ring-yellow-400/20"
              {...register("email")}
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-300"
              >
                {errors.email.message}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-white" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-yellow-400 focus:ring-yellow-400/20 pr-12"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-300"
              >
                {errors.password.message}
              </motion.p>
            )}
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              className="w-full bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-semibold py-3 rounded-xl shadow-lg hover:shadow-yellow-500/25 transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </motion.div>

          <div className="text-center pt-4">
            <p className="text-gray-300 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </motion.form>

      </motion.div>
    </div>
  )
}