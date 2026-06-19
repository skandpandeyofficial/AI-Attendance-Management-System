import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/axios";

import { MdAdminPanelSettings } from "react-icons/md";
import { GiTeacher } from "react-icons/gi";
import { RiGraduationCapLine } from "react-icons/ri";
import { CiViewList } from "react-icons/ci";

import { TbLogout2 } from "react-icons/tb";

import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

export default function AdminLayout() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);

      const res = await API.post("/admin/auth/logout");

      // console.log(res.data);

      setMessage(res.data?.message || "Logout Successfully");

      setTimeout(() => {
        localStorage.clear();

        navigate("/");
      }, 500);
    } catch (error) {
      // console.log(error.response?.data);

      setMessage(error.response?.data?.message || "Logout Failed");

      setTimeout(() => {
        localStorage.clear();

        navigate("/");
      }, 500);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="text-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto"></div>

            <p className="text-white text-xl mt-4">
              {message || "Logging Out..."}
            </p>

            <p className="text-gray-400 mt-2">Please wait...</p>
          </div>
        </div>
      )}

      <div className="flex h-screen bg-[#020617] overflow-hidden">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {/* Sidebar */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-40 md:hidden bg-blue-600 p-2 rounded-lg text-white"
        >
          <HiMenuAlt3 size={24} />
        </button>
        <div
          className={`fixed md:static top-0 left-0 z-50 w-64 h-screen border-r border-white/10 bg-[#0f172a] p-5 flex flex-col shrink-0 transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-1xl font-bold text-white flex items-center gap-1">
              <MdAdminPanelSettings className="text-4xl text-red-500" />
              Admin Panel
            </h1>

            <button
              className="md:hidden text-white text-2xl"
              onClick={() => setSidebarOpen(false)}
            >
              <IoClose className="text-5xl" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <NavLink
              onClick={() => setSidebarOpen(false)}
              to="/admin/add-teachers"
              className={({ isActive }) =>
                `rounded-sm p-2.5 transition-all duration-300 flex items-center gap-2 text-xs ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105"
                    : "text-white hover:bg-white/10"
                }`
              }
            >
              <GiTeacher />
              Add Teacher
            </NavLink>

            <NavLink
              onClick={() => setSidebarOpen(false)}
              to="/admin/add-students"
              className={({ isActive }) =>
                `rounded-sm p-2.5 transition-all duration-300 flex items-center gap-2 text-xs ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105"
                    : "text-white hover:bg-white/10"
                }`
              }
            >
              <RiGraduationCapLine /> Add Student
            </NavLink>

            <NavLink
              onClick={() => setSidebarOpen(false)}
              to="/admin/teachers-list"
              className={({ isActive }) =>
                `rounded-sm p-2.5 transition-all duration-300 flex items-center gap-2 text-xs ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105"
                    : "text-white hover:bg-white/10"
                }`
              }
            >
              <CiViewList />
              Teachers List
            </NavLink>

            <NavLink
              onClick={() => setSidebarOpen(false)}
              to="/admin/students-list"
              className={({ isActive }) =>
                `rounded-sm p-2.5 transition-all duration-300 flex items-center gap-2 text-xs ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105"
                    : "text-white hover:bg-white/10"
                }`
              }
            >
              <CiViewList />
              Students List
            </NavLink>
          </div>

          <div className="mt-auto">
            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full rounded-xl border flex items-center gap-3 text-sm border-red-500/20 p-3 text-left text-red-400 hover:bg-red-500/10 transition disabled:opacity-50 hover:cursor-pointer"
            >
              {loading ? (
                "⏳ Logging Out..."
              ) : (
                <>
                  <TbLogout2 /> Logout
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className={`flex-1 overflow-y-auto overflow-x-hidden p-4 pt-16 md:p-8 transition-all duration-300 ${
            sidebarOpen ? "pointer-events-none blur-sm" : ""
          }`}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
}
