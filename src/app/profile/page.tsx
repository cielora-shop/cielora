"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Order } from "@/lib/db";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserProfile from "@/components/UserProfile";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"login" | "create">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Create Account States
  const [createFirstName, setCreateFirstName] = useState("");
  const [createLastName, setCreateLastName] = useState("");
  const [createPhone, setCreatePhone] = useState("");
  const [createDob, setCreateDob] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createConfirmPassword, setCreateConfirmPassword] = useState("");
  const [createGender, setCreateGender] = useState("");
  const [createError, setCreateError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Check Order states
  const [orderNumber, setOrderNumber] = useState("");
  const [orderEmail, setOrderEmail] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchResults, setSearchResults] = useState<Order[] | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      setOrderEmail(session.user.email);
      
      const fetchOrders = async () => {
        setIsLoading(true);
        setErrorMsg("");
        try {
          const res = await fetch(`/api/orders/search?email=${encodeURIComponent(session.user.email as string)}`);
          const data = await res.json();
          
          if (res.ok && data.results) {
            if (data.results.length === 1) {
              setSelectedOrder(data.results[0]);
            } else if (data.results.length > 1) {
              setSearchResults(data.results);
            } else {
              setErrorMsg("No orders found for this account.");
            }
          }
        } catch (err) {
          console.error("Error auto-fetching orders:", err);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchOrders();
    } else if (status === "unauthenticated") {
      setOrderEmail("");
      setSearchResults(null);
      setSelectedOrder(null);
      setErrorMsg("");
    }
  }, [status, session?.user?.email]);

  const handleSearch = async () => {
    if (!orderNumber && !orderEmail) {
      setErrorMsg("Please enter either an Order Number or an Email.");
      return;
    }
    
    setIsLoading(true);
    setErrorMsg("");
    setSearchResults(null);
    setSelectedOrder(null);

    try {
      let query = "";
      if (orderNumber) {
        query = `orderId=${encodeURIComponent(orderNumber)}`;
      } else if (orderEmail) {
        query = `email=${encodeURIComponent(orderEmail)}`;
      }

      const res = await fetch(`/api/orders/search?${query}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch orders");
      }

      if (data.results && data.results.length > 0) {
        if (data.results.length === 1) {
          router.push(`/order/${data.results[0].id}`);
        } else {
          setSearchResults(data.results);
        }
      } else {
        setErrorMsg("No orders found with that information.");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: loginEmail,
        password: loginPassword,
        rememberMe: rememberMe.toString(),
      });

      if (res?.error) {
        setLoginError(res.error);
      } else {
        // Set a session cookie to track the browser lifecycle
        document.cookie = "browser_session_active=true; path=/";
        router.refresh();
      }
    } catch (err: any) {
      setLoginError("An unexpected error occurred.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    
    if (createPassword !== createConfirmPassword) {
      setCreateError("Passwords do not match");
      return;
    }

    setIsCreating(true);
    
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: createFirstName,
          lastName: createLastName,
          email: createEmail,
          password: createPassword,
          phone: createPhone,
          dob: createDob,
          gender: createGender
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setCreateError(data.error || "Failed to create account");
      } else {
        // Log them in automatically after successful signup
        const signInRes = await signIn("credentials", {
          redirect: false,
          email: createEmail,
          password: createPassword,
        });
        
        if (signInRes?.error) {
          setCreateError("Account created, but failed to log in automatically.");
        } else {
          router.refresh();
        }
      }
    } catch (err: any) {
      setCreateError("An unexpected error occurred.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full min-h-[70vh] bg-white flex justify-center py-20 px-4">
      <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 gap-20">
        
        {/* Left Column - Authentication */}
        <div className="flex flex-col w-full">
          {status === "loading" ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : status === "authenticated" ? (
            <UserProfile />
          ) : (
            <>
              {/* Tabs */}
          <div className="flex w-full mb-8 border-b border-gray-200 relative">
            <button 
              onClick={() => setActiveTab("login")}
              className={`flex-1 pb-4 text-center text-[14px] ${activeTab === "login" ? "text-gray-900 font-medium" : "text-gray-500 hover:text-gray-700"}`}
            >
              Login
            </button>
            <button 
              onClick={() => setActiveTab("create")}
              className={`flex-1 pb-4 text-center text-[14px] ${activeTab === "create" ? "text-gray-900 font-medium" : "text-gray-500 hover:text-gray-700"}`}
            >
              Create account
            </button>
            {/* Active indicator */}
            <div 
              className="absolute bottom-0 h-[2px] bg-[#ac2505] transition-all duration-300 w-1/2"
              style={{ left: activeTab === "login" ? "0%" : "50%" }}
            ></div>
          </div>

          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="flex flex-col gap-5 w-full">
              <input 
                type="email" 
                placeholder="Email" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full border border-gray-200 px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
              />
              
              <div className="w-full relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="w-full border border-gray-200 px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors pr-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>

              {loginError && <p className="text-red-500 text-[13px]">{loginError}</p>}

              <div className="flex justify-between items-center mt-1 mb-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative w-[18px] h-[18px] shrink-0">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer opacity-0 absolute w-full h-full cursor-pointer z-20" 
                    />
                    <div className="absolute inset-0 border border-gray-300 peer-checked:bg-[#1a1a1a] peer-checked:border-[#1a1a1a] group-hover:border-gray-500 transition-colors z-0"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity z-10 pointer-events-none"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-[13px] text-gray-800">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-[13px] text-gray-600 hover:text-black">
                  forgot password?
                </Link>
              </div>

              <button 
                type="submit" 
                disabled={isLoggingIn}
                className="w-full bg-[#1a1a1a] text-white border border-[#1a1a1a] py-3.5 text-[14px] font-medium hover:bg-white hover:text-black transition-colors disabled:opacity-70"
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {activeTab === "create" && (
            <form onSubmit={handleCreateAccount} className="flex flex-col gap-5 w-full">
              <input 
                type="text" 
                placeholder="First Name *" 
                value={createFirstName}
                onChange={(e) => setCreateFirstName(e.target.value)}
                required
                className="w-full border border-gray-200 px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
              />
              <input 
                type="text" 
                placeholder="Last Name *" 
                value={createLastName}
                onChange={(e) => setCreateLastName(e.target.value)}
                required
                className="w-full border border-gray-200 px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
              />
              <input 
                type="tel" 
                placeholder="Phone (Optional)" 
                value={createPhone}
                onChange={(e) => setCreatePhone(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
              />
              
              <div className="flex flex-col gap-2 mt-1">
                <label className="text-[14px] font-semibold text-gray-900">Date of birth (Optional)</label>
                <div className="w-full relative">
                  <input 
                    type="date" 
                    value={createDob}
                    onChange={(e) => setCreateDob(e.target.value)}
                    className="w-full border border-gray-200 px-4 py-3 text-[14px] text-gray-900 outline-none focus:border-gray-400 transition-colors"
                  />
                </div>
              </div>

              <input 
                type="email" 
                placeholder="Email *" 
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
                required
                className="w-full border border-gray-200 px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors mt-1"
              />

              <div className="w-full relative">
                <input 
                  type={showCreatePassword ? "text" : "password"} 
                  placeholder="Password *" 
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  required
                  className="w-full border border-gray-200 px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors pr-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowCreatePassword(!showCreatePassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showCreatePassword ? "Hide password" : "Show password"}
                >
                  {showCreatePassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>

              <div className="w-full relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirm Password *" 
                  value={createConfirmPassword}
                  onChange={(e) => setCreateConfirmPassword(e.target.value)}
                  required
                  className="w-full border border-gray-200 px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors pr-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-6 mt-1 mb-2">
                <span className="text-[14px] font-semibold text-gray-900">Gender (Optional)</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" value="female" checked={createGender === "female"} onChange={(e) => setCreateGender(e.target.value)} className="w-[16px] h-[16px] border-gray-300 focus:ring-black accent-black" />
                  <span className="text-[14px] text-gray-800">Female</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" value="male" checked={createGender === "male"} onChange={(e) => setCreateGender(e.target.value)} className="w-[16px] h-[16px] border-gray-300 focus:ring-black accent-black" />
                  <span className="text-[14px] text-gray-800">Male</span>
                </label>
              </div>

              <div className="flex flex-col gap-3">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative w-[18px] h-[18px] mt-[2px] shrink-0">
                    <input type="checkbox" required className="peer opacity-0 absolute w-full h-full cursor-pointer z-20" />
                    <div className="absolute inset-0 border border-gray-300 peer-checked:bg-[#1a1a1a] peer-checked:border-[#1a1a1a] group-hover:border-gray-500 transition-colors z-0"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity z-10 pointer-events-none"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-[13px] text-gray-900 leading-[1.3]">
                    I have read and understand the <Link href="#" className="underline hover:text-gray-600 transition-colors">See privacy policy</Link>
                  </span>
                </label>
              </div>

              {createError && <p className="text-red-500 text-[13px]">{createError}</p>}

              <button 
                type="submit" 
                disabled={isCreating}
                className="w-full bg-[#1a1a1a] text-white border border-[#1a1a1a] py-3.5 text-[14px] font-medium hover:bg-white hover:text-black transition-colors mt-2 disabled:opacity-70"
              >
                {isCreating ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          )}
          

            </>
          )}
        </div>

        {/* Right Column - Check Order */}
        <div className="flex flex-col w-full pl-0 md:pl-8">
          {/* Form moved below */}
            <div className="mb-8 pb-8 border-b border-gray-100">
              <h2 className="text-[14px] font-medium text-gray-900 mb-2">Check order</h2>
              <p className="text-[13px] text-gray-500 leading-relaxed mb-6 pr-8">
                See your order even if you are not a registered user. Enter the order number or the order email.
              </p>

              <div className="flex flex-col gap-5 w-full">
                <input 
                  type="text" 
                  placeholder="Order number" 
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full border border-gray-200 px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
                />
                <div className="text-center text-[12px] text-gray-400 font-medium">OR</div>
                <input 
                  type="email" 
                  placeholder="Order Email" 
                  value={orderEmail}
                  onChange={(e) => setOrderEmail(e.target.value)}
                  className="w-full border border-gray-200 px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
                />
                
                {errorMsg && (
                  <p className="text-red-600 text-[13px]">{errorMsg}</p>
                )}

                <button 
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="w-full bg-white border border-black text-black py-3.5 text-[14px] font-medium hover:bg-black hover:text-white transition-colors mt-2 disabled:opacity-50"
                >
                  {isLoading ? "Checking..." : "Check status"}
                </button>
              </div>
            </div>

          {searchResults && (
            <div className="flex flex-col w-full mb-10">
              {status !== "authenticated" && (
                <button 
                  onClick={() => { setSearchResults(null); setOrderEmail(""); }} 
                  className="text-[13px] underline mb-4 text-left hover:text-[#b44131]"
                >
                  &larr; Back to search
                </button>
              )}
              <h2 className="text-[16px] font-medium text-gray-900 mb-4">Found Orders</h2>
              <div className="flex flex-col gap-4">
                {searchResults.map(order => (
                  <div 
                    key={order.id} 
                    className="border border-gray-200 transition-colors"
                  >
                    {/* Summary Header */}
                    <div 
                      onClick={() => router.push(`/order/${order.id}`)}
                      className="p-4 cursor-pointer hover:border-black transition-colors flex justify-between items-start"
                    >
                      <div>
                        <span className="font-semibold text-[14px]">{order.id}</span>
                        <p className="text-[12px] text-gray-500 mt-1">{new Date(order.date).toLocaleDateString()}</p>
                        <p className="text-[14px] font-medium mt-2">€{order.total.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-[12px] px-2 py-1 ${order.status === "Pending" ? "bg-yellow-100 text-yellow-800" : order.status === "Processing" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>{order.status}</span>
                        <span className="text-[12px] text-gray-400 mt-2 underline">
                          View details
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Removed selectedOrder details inline rendering as it now goes to a new page */}
        </div>

      </div>
    </div>
  );
}
