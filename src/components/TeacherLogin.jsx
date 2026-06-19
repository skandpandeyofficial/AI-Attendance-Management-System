import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function TeacherLogin() {
  const navigate = useNavigate();
  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/teacher/auth/login", data);

      // console.log(res.data);

      setResponseMessage(res.data?.Status || res.data?.message);

      if (res.data?.Status === "Teacher Login Successfully ✅") {
        localStorage.setItem("role", "teacher");

        setIsSuccess(true);

        setTimeout(() => {
          navigate("/teacher/teacher-dashboard");
        }, 1000);
      } else {
        setIsSuccess(false);
      }
    } catch (error) {
      console.log(error.response?.data);

      setIsSuccess(false);

      setResponseMessage(
        error.response?.data?.message ||
          error.response?.data?.Status ||
          "Login Failed",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
        <h1 className="text-4xl font-bold text-center text-white">
          Teacher Login
        </h1>

        <p className="text-center text-gray-400 mt-2">
          Sign in to access your account
        </p>

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
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-green-500"
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
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-green-500"
            />

            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-linear-to-r from-green-600 to-emerald-500 py-3 text-white font-semibold hover:opacity-90 transition hover:cursor-pointer"
          >
            Login
          </button>
        </form>
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
      </div>
    </div>
  );
}
