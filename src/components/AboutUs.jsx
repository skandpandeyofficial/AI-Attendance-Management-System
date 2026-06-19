import React from "react";

import { FaArrowRight } from "react-icons/fa6";
import { LiaGithub } from "react-icons/lia";
import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <div
      id="about"
      className="min-h-screen bg-[#020617] text-white relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-20 left-10 h-100 w-100 rounded-full bg-blue-600/20 blur-[180px]" />
      <div className="absolute top-10 right-10 h-100 w-100 rounded-full bg-purple-600/20 blur-[180px]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Heading */}
        <div className="text-center">
          <span className="px-6 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-sm tracking-widest">
            ABOUT US
          </span>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h1 className="mt-8 text-5xl md:text-6xl font-bold">
              Revolutionizing Attendance with{" "}
              <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Artificial Intelligence
              </span>
            </h1>
          </motion.div>

          <p className="mt-6 text-gray-300 max-w-3xl mx-auto text-lg">
            Our AI-powered attendance system combines Face Recognition
            technology to provide a secure, accurate, and efficient attendance
            management solution.
          </p>
        </div>

        {/* Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="p-8 rounded-3xl border border-blue-500/20 bg-white/5 backdrop-blur-md">
              <div className="text-5xl">🎯</div>
              <h2 className="mt-4 text-2xl font-semibold">Our Mission</h2>
              <p className="mt-3 text-gray-300">
                To eliminate manual attendance processes and create a smarter,
                faster, and more reliable system using AI.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-purple-500/20 bg-white/5 backdrop-blur-md">
              <div className="text-5xl">🤖</div>
              <h2 className="mt-4 text-2xl font-semibold">AI Technology</h2>
              <p className="mt-3 text-gray-300">
                Transforming attendance management through intelligent face
                recognition technology and real-time automation.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-green-500/20 bg-white/5 backdrop-blur-md">
              <div className="text-5xl">🔒</div>
              <h2 className="mt-4 text-2xl font-semibold">Secure & Reliable</h2>
              <p className="mt-3 text-gray-300">
                Designed with security and privacy in mind while ensuring
                seamless attendance tracking.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            <div className="text-center p-6 rounded-2xl bg-white/5">
              <h3 className="text-4xl font-bold text-blue-400">99%</h3>
              <p className="text-gray-300 mt-2">Accuracy</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-white/5">
              <h3 className="text-4xl font-bold text-purple-400">24/7</h3>
              <p className="text-gray-300 mt-2">Availability</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-white/5">
              <h3 className="text-4xl font-bold text-green-400">100%</h3>
              <p className="text-gray-300 mt-2">Secure</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-white/5">
              <h3 className="text-4xl font-bold text-cyan-400">AI</h3>
              <p className="text-gray-300 mt-2">Powered</p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="flex justify-center mt-10">
          <a
            href="https://github.com/skandpandeyofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center text-gray-400 hover:text-white transition-all duration-300"
          >
            <span className="font-medium">Developed by Skand Pandey</span>

            <span className="absolute -right-12 flex items-center gap-1 opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              <LiaGithub className="text-2xl" />
              <FaArrowRight className="text-sm" />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
