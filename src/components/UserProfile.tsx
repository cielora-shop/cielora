"use client";

import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

export default function UserProfile() {
  const { data: session, update: updateSession } = useSession();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: session?.user?.email || "",
    phone: "",
    dob: "",
    gender: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        
        if (res.ok && data) {
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || session?.user?.email || "",
            phone: data.phone || "",
            dob: data.dob || "",
            gender: data.gender || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (session?.user?.email) {
      fetchProfile();
    }
  }, [session]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          dob: formData.dob,
          gender: formData.gender,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setSuccessMsg("Profile updated successfully!");
      setIsEditing(false);
      
      // Tell NextAuth to update the session in case the name changed
      await updateSession();
      
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col border border-gray-200 p-8 items-center justify-center">
        <p className="text-gray-500">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col border border-gray-200 p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-[20px] font-semibold text-gray-900 mb-1">
            Welcome back, {formData.firstName || session?.user?.name || "User"}!
          </h2>
          <p className="text-[14px] text-gray-500">Manage your account details below.</p>
        </div>
      </div>
      
      {successMsg && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 text-[13px]">
          {successMsg}
        </div>
      )}
      
      {errorMsg && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-[13px]">
          {errorMsg}
        </div>
      )}

      {!isEditing ? (
        <div className="flex flex-col gap-6 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[12px] text-gray-500 uppercase tracking-wider mb-1">First Name</p>
              <p className="text-[15px] text-gray-900">{formData.firstName || "—"}</p>
            </div>
            <div>
              <p className="text-[12px] text-gray-500 uppercase tracking-wider mb-1">Last Name</p>
              <p className="text-[15px] text-gray-900">{formData.lastName || "—"}</p>
            </div>
          </div>
          
          <div>
            <p className="text-[12px] text-gray-500 uppercase tracking-wider mb-1">Email</p>
            <p className="text-[15px] text-gray-900">{formData.email}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[12px] text-gray-500 uppercase tracking-wider mb-1">Phone</p>
              <p className="text-[15px] text-gray-900">{formData.phone || "—"}</p>
            </div>
            <div>
              <p className="text-[12px] text-gray-500 uppercase tracking-wider mb-1">Gender</p>
              <p className="text-[15px] text-gray-900 capitalize">{formData.gender || "—"}</p>
            </div>
          </div>

          <div>
            <p className="text-[12px] text-gray-500 uppercase tracking-wider mb-1">Date of Birth</p>
            <p className="text-[15px] text-gray-900">{formData.dob || "—"}</p>
          </div>

          <div className="flex gap-4 mt-2">
            <button 
              onClick={() => setIsEditing(true)}
              className="flex-1 bg-white text-black border border-gray-300 py-2.5 text-[14px] font-medium hover:border-black transition-colors"
            >
              Edit Details
            </button>
            <button 
              onClick={() => signOut()}
              className="flex-1 bg-[#1a1a1a] text-white border border-[#1a1a1a] py-2.5 text-[14px] font-medium hover:bg-white hover:text-black transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="flex flex-col gap-5 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="First Name" 
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="w-full border border-gray-200 px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
            />
            <input 
              type="text" 
              placeholder="Last Name" 
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="w-full border border-gray-200 px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
            />
          </div>
          
          <input 
            type="email" 
            value={formData.email}
            disabled
            className="w-full border border-gray-200 bg-gray-50 text-gray-500 px-4 py-3 text-[14px] outline-none cursor-not-allowed"
          />
          
          <input 
            type="tel" 
            placeholder="Phone Number" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full border border-gray-200 px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
          />
          
          <input 
            type="date" 
            value={formData.dob}
            onChange={(e) => setFormData({...formData, dob: e.target.value})}
            className="w-full border border-gray-200 px-4 py-3 text-[14px] text-gray-900 outline-none focus:border-gray-400 transition-colors"
          />
          
          <div className="flex items-center gap-6 mt-1 mb-2">
            <span className="text-[14px] font-semibold text-gray-900">Gender (Optional)</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="profile_gender" 
                value="female" 
                checked={formData.gender === "female"} 
                onChange={(e) => setFormData({...formData, gender: e.target.value})} 
                className="w-[16px] h-[16px] border-gray-300 focus:ring-black accent-black" 
              />
              <span className="text-[14px] text-gray-800">Female</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="profile_gender" 
                value="male" 
                checked={formData.gender === "male"} 
                onChange={(e) => setFormData({...formData, gender: e.target.value})} 
                className="w-[16px] h-[16px] border-gray-300 focus:ring-black accent-black" 
              />
              <span className="text-[14px] text-gray-800">Male</span>
            </label>
          </div>

          <div className="flex gap-4 mt-2">
            <button 
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-white text-black border border-gray-300 py-3 text-[14px] font-medium hover:border-black transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 bg-[#1a1a1a] text-white border border-[#1a1a1a] py-3 text-[14px] font-medium hover:bg-white hover:text-black transition-colors disabled:opacity-70"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
