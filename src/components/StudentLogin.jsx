import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

import { useEffect } from "react";

export default function StudentLogin() {
  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "student") {
      navigate("/student/profile");
    }

    if (role === "teacher") {
      navigate("/teacher/profile");
    }

    if (role === "admin") {
      navigate("/admin/add-teachers");
    }
  }, [navigate]);

  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/student/auth/login", data);

      // console.log(res.data);

      setResponseMessage(res.data?.Status);

      if (res.data?.Status.includes("Successfully")) {
        localStorage.setItem("role", "student");

        setIsSuccess(true);

        setTimeout(() => {
          navigate("/student/student-dashboard");
        }, 1000);
      } else {
        setIsSuccess(false);
      }
    } catch (error) {
      setIsSuccess(false);

      setResponseMessage(error.response?.data?.Status || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
        <h1 className="text-4xl font-bold text-center text-white">
          Student Login
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>

            <input
              type="email"
              placeholder="Enter Email"
              {...register("email", {
                required: "Email is required",
                setValueAs: (value) => value?.toLowerCase().trim(),
              })}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none"
            />

            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Password</label>

            <input
              type="password"
              placeholder="Enter Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none"
            />

            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold hover:bg-blue-500 transition hover:cursor-pointer"
          >
            Login
          </button>

          {/* Backend Response */}
          {responseMessage && (
            <div
              className={`text-center ${
                isSuccess

              }`}
            >
              <p
                className={`font-medium ${
                  isSuccess ? "text-green-400" : "text-red-400"
                }`}
              >
                {responseMessage}
              </p>
            </div>
          )}
        </form>

        {/* Signup Link */}
        <div className="mt-6 border-t border-white/10 pt-4 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link
              to="/student/signup"
              className="text-blue-400 hover:text-blue-300 font-medium hover:cursor-pointer"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
