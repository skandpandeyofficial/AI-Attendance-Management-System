import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { motion } from "framer-motion";

import { GiTeacher } from "react-icons/gi";

export default function TeacherProfile() {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await API.get("/teacher/profile");

        // console.log(res.data);

        setTeacher(res.data);
      } catch (error) {
        console.log(error.response?.data);

        navigate("/teacher/login");
      }
    };

    getProfile();
  }, [navigate]);

  if (!teacher) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white text-2xl">
        Loading...
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
      <div className="min-h-screen bg-[#020617]">
        <div className="max-w-5xl mx-auto p-2">
          <h1 className="text-4xl text-white font-bold mb-8">
            Teacher Profile
          </h1>

          {/* Profile Card */}
          <div className="rounded-3xl border border-white/10 bg-linear-to-br from-white/10 to-white/5 p-8 backdrop-blur-xl">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-2xl bg-green-600 flex items-center justify-center shadow-lg shadow-green-600/30 text-4xl text-white">
                <GiTeacher />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  {teacher.name}
                </h2>

                <p className="text-slate-400 mt-1 text-sm">Faculty Member</p>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-5 mt-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-gray-400 text-1xl">Email Address</p>

              <h3 className="text-base text-white font-medium mt-2">
                {teacher.email}
              </h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-gray-400 ">Teaching Subject</p>

              <h3 className="text-sm text-green-400 font-semibold mt-2">
                {teacher.teaching_sub}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
