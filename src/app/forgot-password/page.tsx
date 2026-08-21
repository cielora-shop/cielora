"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

type Step = "email" | "otp" | "password" | "success";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      setStep("otp");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setErrorMsg("Please enter a 6-digit code");
      return;
    }
    
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Invalid OTP");

      setStep("password");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to reset password");

      setStep("success");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[70vh] bg-white flex justify-center items-center py-20 px-4">
      <div className="w-full max-w-[450px]">
        <h1 className="text-[24px] font-semibold text-center mb-2">Reset Password</h1>
        
        {step === "email" && (
          <>
            <p className="text-[14px] text-gray-500 text-center mb-8">
              Enter your email address and we'll send you a code to reset your password.
            </p>
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-200 px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
              />
              {errorMsg && <p className="text-red-500 text-[13px]">{errorMsg}</p>}
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1a1a1a] text-white border border-[#1a1a1a] py-3.5 text-[14px] font-medium hover:bg-white hover:text-black transition-colors mt-2 disabled:opacity-70"
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </>
        )}

        {step === "otp" && (
          <>
            <p className="text-[14px] text-gray-500 text-center mb-8">
              We've sent a 6-digit code to <span className="font-medium text-black">{email}</span>. Enter it below.
            </p>
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="6-digit OTP Code" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
                className="w-full border border-gray-200 px-4 py-3 text-[14px] text-gray-900 text-center tracking-[0.5em] font-medium placeholder:tracking-normal placeholder:font-normal placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
              />
              {errorMsg && <p className="text-red-500 text-[13px]">{errorMsg}</p>}
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1a1a1a] text-white border border-[#1a1a1a] py-3.5 text-[14px] font-medium hover:bg-white hover:text-black transition-colors mt-2 disabled:opacity-70"
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </button>
              <div className="text-center mt-2">
                <button type="button" onClick={handleSendOtp} disabled={isLoading} className="text-[13px] text-gray-500 hover:text-black underline disabled:opacity-50">
                  Resend code
                </button>
              </div>
            </form>
          </>
        )}

        {step === "password" && (
          <>
            <p className="text-[14px] text-gray-500 text-center mb-8">
              Please enter your new password below.
            </p>
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <div className="w-full relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="New Password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full border border-gray-200 px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors pr-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              <div className="w-full relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirm New Password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full border border-gray-200 px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors pr-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              {errorMsg && <p className="text-red-500 text-[13px]">{errorMsg}</p>}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1a1a1a] text-white border border-[#1a1a1a] py-3.5 text-[14px] font-medium hover:bg-white hover:text-black transition-colors mt-2 disabled:opacity-70"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[15px] text-gray-900 mb-8">
              Your password has been successfully reset! You can now use your new password to log in.
            </p>
            <Link 
              href="/profile"
              className="w-full bg-[#1a1a1a] text-center text-white border border-[#1a1a1a] py-3.5 text-[14px] font-medium hover:bg-white hover:text-black transition-colors"
            >
              Return to Login
            </Link>
          </div>
        )}

        {step !== "success" && (
          <div className="text-center mt-8">
            <Link href="/profile" className="text-[13px] text-gray-500 hover:text-black underline">
              &larr; Back to login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
