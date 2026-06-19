import React from "react";
import student from "../assets/student.png";
import teacher from "../assets/teacher.png";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import AboutUs from "./AboutUs";

import { FaGraduationCap } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="relative overflow-hidden bg-[#020617]">
        {/* Background Glow */}
        <div className="absolute top-20 left-10 h-125 w-125 rounded-full bg-blue-600/20 blur-[180px]" />
        <div className="absolute top-10 right-10 h-112.5 w-112.5 rounded-full bg-purple-600/20 blur-[180px]" />
        <div className="absolute bottom-0 left-1/2 h-75 w-75 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[180px]" />

        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Hero Section */}
        <div className="relative z-10 pt-24 pb-16">
          {/* AI Badge */}
          <div className="flex justify-center">
            <span className="border border-indigo-500/40 bg-indigo-500/10 px-5 py-2 rounded-full text-white tracking-[4px] text-xs font-medium">
              AI POWERED
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-4 text-center text-4xl md:text-5xl lg:text-6xl font-extrabold text-white">
            Smart{" "}
            <span className="bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Attendance
            </span>{" "}
            System
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-center text-sm md:text-lg text-gray-300">
            Mark attendance using Face Recognition AI
          </p>

          {/* Features */}
          <div className="mt-3 flex justify-center items-center gap-4 text-sm font-semibold">
            <span className="text-blue-400">Secure</span>
            <span className="text-gray-500">•</span>
            <span className="text-purple-400">Fast</span>
            <span className="text-gray-500">•</span>
            <span className="text-green-400">Accurate</span>
          </div>

          {/* Cards */}
          <div className="mt-10 flex flex-col lg:flex-row gap-8 justify-center items-center px-6">
            {/* Student Card */}
            <div className="w-full max-w-100 overflow-hidden rounded-[30px] border border-blue-500/50 bg-linear-to-b from-blue-950/80 to-blue-950/30 shadow-[0_0_40px_rgba(59,130,246,0.25)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_60px_rgba(59,130,246,0.5)]">
              <div className="h-57.5 overflow-hidden border-b border-blue-500/30">
                <img
                  src={student}
                  alt="Student"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="relative p-6 text-center">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-16 rounded-full bg-white flex items-center justify-center text-3xl">
                  <FaGraduationCap className="text-blue-900" />
                </div>

                <h2 className="mt-5 text-3xl font-bold text-white">Student</h2>

                <button
                  onClick={() => navigate("/student/login")}
                  className="mt-6 w-full rounded-2xl bg-linear-to-r from-blue-600 to-blue-500 py-3 text-lg font-semibold text-white hover:cursor-pointer"
                >
                  Enter as Student →
                </button>
              </div>
            </div>

            {/* Teacher Card */}
            <div className="w-full max-w-100 overflow-hidden rounded-[30px] border border-green-500/50 bg-linear-to-b from-green-950/80 to-green-950/30 shadow-[0_0_40px_rgba(34,197,94,0.25)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_60px_rgba(34,197,94,0.5)]">
              <div className="h-57.5 overflow-hidden border-b border-green-500/30">
                <img
                  src={teacher}
                  alt="Teacher"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="relative p-6 text-center">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-16 rounded-full bg-white flex items-center justify-center text-3xl">
                  <GiTeacher className="text-green-900" />
                </div>

                <h2 className="mt-5 text-3xl font-bold text-white">Teacher</h2>

                <button
                  onClick={() => navigate("/teacher/login")}
                  className="mt-6 w-full rounded-2xl bg-linear-to-r from-green-500 to-emerald-400 py-3 text-lg font-semibold text-white hover:cursor-pointer"
                >
                  Enter as Teacher →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AboutUs />
    </>
  );
}
