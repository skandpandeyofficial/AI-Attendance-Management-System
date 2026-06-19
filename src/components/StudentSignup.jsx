import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function StudentSignup() {
  const navigate = useNavigate();
  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "student") {
      navigate("/student/profile");
    } else if (role === "teacher") {
      navigate("/teacher/profile");
    } else if (role === "admin") {
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
      const res = await API.post("/student/auth/signup", data);

      // console.log(res.data);

      setIsSuccess(true);

      setResponseMessage(res.data.message);

      setTimeout(() => {
        navigate("/student/login");
      }, 1500);
    } catch (error) {
      console.log(error.response?.data);

      setIsSuccess(false);

      setResponseMessage(error.response?.data?.message || "Signup Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-white">
          Student Signup
        </h1>

        <p className="text-center text-gray-400 mt-2">
          Create your student account
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 grid md:grid-cols-2 gap-5"
        >
          {/* Admission No */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Admission Number
            </label>

            <input
              type="text"
              placeholder="Enter Admission Number"
              {...register("admissionNo", {
                required: "Admission Number is required",
              })}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            {errors.admissionNo && (
              <p className="text-red-400 text-sm mt-1">
                {errors.admissionNo.message}
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter Full Name"
              {...register("name", {
                required: "Name is required",
              })}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

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
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-blue-500"
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
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-linear-to-r from-blue-600 to-indigo-500 py-3 text-white font-semibold hover:opacity-90 transition hover:cursor-pointer"
            >
              Create Account
            </button>
            {responseMessage && (
              <div
                className={`mt-4 rounded-xl border p-3 text-center ${
                  isSuccess
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-red-500/10 border-red-500/30"
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
        </form>

        {/* Login Link */}
        <div className="mt-6 border-t border-white/10 pt-4 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <Link
              to="/student/login"
              className="text-blue-400 hover:text-blue-300 font-medium hover:cursor-pointer"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
