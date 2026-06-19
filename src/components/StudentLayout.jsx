import { Outlet, NavLink, useNavigate } from "react-router-dom";
import API from "../api/axios";

import { RiGraduationCapLine } from "react-icons/ri";

import { MdDashboard } from "react-icons/md";

import { CiUser } from "react-icons/ci";

import { TbLogout2 } from "react-icons/tb";

import { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

export default function StudentLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await API.post("/student/auth/logout");
    } catch (error) {
      console.log(error.response?.data);
    } finally {
      localStorage.removeItem("role");
      localStorage.removeItem("email");

      navigate("/");
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] overflow-hidden">
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-40 md:hidden bg-blue-600 p-2 rounded-lg text-white"
      >
        <HiMenuAlt3 size={24} />
      </button>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 z-50 w-64 h-screen border-r border-white/10 bg-[#0f172a] p-5 flex flex-col shrink-0 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-1xl font-bold text-white flex items-center gap-3">
            <RiGraduationCapLine className="text-4xl" />
            Student Portal
          </h1>

          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setSidebarOpen(false)}
          >
            <IoClose />
          </button>
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-3">
          <NavLink
            onClick={() => setSidebarOpen(false)}
            to="/student/student-dashboard"
            className={({ isActive }) =>
              `rounded-sm p-2.5 transition-all duration-300 flex items-center gap-2 text-xs ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105"
                  : "text-white hover:bg-white/10"
              }`
            }
          >
            <MdDashboard /> Dashboard
          </NavLink>
          <NavLink
            onClick={() => setSidebarOpen(false)}
            to="/student/profile"
            className={({ isActive }) =>
              `rounded-sm p-2.5 transition-all duration-300 flex items-center gap-2 text-xs ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105"
                  : "text-white hover:bg-white/10"
              }`
            }
          >
            <CiUser /> Profile
          </NavLink>
        </div>

        {/* Logout Bottom */}
        <div className="mt-auto pt-5">
          <button
            onClick={handleLogout}
            className="w-full rounded-xl border border-red-500/20 p-3 text-left text-red-400 hover:bg-red-500/10 transition hover:cursor-pointer flex items-center gap-2"
          >
            <TbLogout2 /> Logout
          </button>
        </div>
      </div>

      {/* Page Content */}
      <div
        className={`flex-1 overflow-y-auto overflow-x-hidden p-4 pt-16 md:p-8 transition-all duration-300 ${
          sidebarOpen ? "pointer-events-none blur-sm" : ""
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
}
