import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "admin") {
      navigate("/admin/add-teachers");
    }

    if (role === "student") {
      navigate("/student/profile");
    }

    if (role === "teacher") {
      navigate("/teacher/profile");
    }
  }, [navigate]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/admin/auth/login", data);

      // console.log(res.data);

      setResponseMessage(res.data?.status || "Login Successful");

      if (res.data?.status?.includes("Successfully")) {
        localStorage.setItem("role", "admin");

        setIsSuccess(true);

        setTimeout(() => {
          navigate("/admin/add-teachers");
        }, 1000);
      } else {
        setIsSuccess(false);
      }
    } catch (error) {
      // console.log(error.response?.data);

      setIsSuccess(false);

      setResponseMessage(
        error.response?.data?.message ||
          error.response?.data?.status ||
          "Login Failed",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-purple-500/20 blur-[180px]" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/20 blur-[180px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-100 rounded-3xl p-8 shadow-2xl border border-slate-200">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-slate-900 flex items-center justify-center text-3xl">
              👑
            </div>
          </div>

          {/* Heading */}
          <h1 className="mt-5 text-center text-4xl font-bold text-slate-900">
            Admin
          </h1>

          <p className="text-center text-slate-500 mt-2">
            Secure Dashboard Access
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>

              <input
                type="email"
                placeholder="admin@example.com"
                {...register("email", {
                  required: "Email is required",
                })}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-purple-500"
              />

              <p className="h-5 text-red-500 text-sm mt-1">
                {errors.email?.message}
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter Password"
                {...register("password", {
                  required: "Password is required",
                })}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-purple-500"
              />

              <p className="h-5 text-red-500 text-sm mt-1">
                {errors.password?.message}
              </p>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 py-3 text-white font-semibold hover:bg-slate-800 transition hover:cursor-pointer"
            >
              Login
            </button>
          </form>
          {responseMessage && (
            <div
              className={`rounded-xl border p-3 text-center mt-4 ${
                isSuccess
                  ? "bg-green-500/10 border-green-500/30"
                  : "bg-red-500/10 border-red-500/30"
              }`}
            >
              <p
                className={`font-medium ${
                  isSuccess ? "text-green-500" : "text-red-500"
                }`}
              >
                {responseMessage}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
