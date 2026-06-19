import React, { useEffect, useState } from "react";
import API from "../api/axios";

import { motion } from "framer-motion";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await API.get("/student/profile");

        setProfile(res.data);
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.status ||
          "Please Login Account";

        setError(message);
      }
    };

    getProfile();
  }, []);

  // Error UI
  if (error) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
        <div className="rounded-3xl border border-red-500/20 bg-white/5 backdrop-blur-md p-8 text-center">
          <h2 className="text-3xl font-bold text-red-400">{error}</h2>

          <p className="text-gray-400 mt-3">Please login to continue.</p>
        </div>
      </div>
    );
  }

  // Loading UI
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />

        <p className="text-slate-400 mt-4">Loading profile...</p>
      </div>
    );
  }

  return (
        <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
    >
    
    <div className="min-h-screen bg-[#020617] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-30 left-10 h-100 w-100 rounded-full bg-blue-600/20 blur-[180px]" />
      <div className="absolute top-30 right-10 h-100 w-100 rounded-full bg-purple-600/20 blur-[180px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-1">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-white">Student Profile</h1>

          <p className="text-slate-400 mt-1 text-sm">
            Personal information and enrolled subjects
          </p>
        </div>

        <div className="grid xl:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="rounded-3xl border border-white/10 bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
            <div className="flex flex-col items-center">
              <img
                src={profile.profileImage}
                alt={profile.name}
                className="h-28 w-28 rounded-2xl object-cover border-2 border-blue-500 shadow-lg shadow-blue-600/20"
              />

              <h2 className="mt-4 text-xl font-bold text-white">
                {profile.name}
              </h2>

              <p className="text-xs uppercase tracking-wider text-[11px] text-blue-400 mt-2">
                {profile.admissionNo}
              </p>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider">
                  Email
                </p>
                <p className="text-white font-medium mt-1">{profile.email}</p>
              </div>

              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider">
                  Branch
                </p>
                <p className="text-white font-medium mt-1">{profile.branch}</p>
              </div>

              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider">
                  Gender
                </p>
                <p className="text-white font-medium mt-1">{profile.gender}</p>
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
            <h2 className="text-xl font-bold text-white mb-6">
              Enrolled Subjects
            </h2>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {profile.subjects?.map((subject) => (
                <div
                  key={subject.code}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:bg-white/10 hover:border-blue-500/30 hover:-translate-y-1"
                >
                  <h3 className="text-sm font-semibold text-white">
                    {subject.name}
                  </h3>

                  <p className="text-[11px] text-blue-400 mt-2 uppercase tracking-wider">
                    {subject.code}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </motion.div>
  );
}
