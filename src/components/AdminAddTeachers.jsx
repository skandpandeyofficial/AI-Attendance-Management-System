// import React from "react";
import { useForm } from "react-hook-form";
import API from "../api/axios";
import React, { useState } from "react";

export default function AdminAddTeachers() {
  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/admin/add-teachers", data);

      // console.log(res.data);

      setIsSuccess(true);

      setResponseMessage(res.data?.message || "Teacher Added Successfully");
    } catch (error) {
      // console.log(error.response?.data);

      setIsSuccess(false);

      setResponseMessage(
        error.response?.data?.message || "Failed To Add Teacher",
      );
    }
  };

  return (
    <div className="h-full bg-[#020617]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Form Section */}
        <div className="p-5 rounded-xl border border-white/10 bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-xl shadow-black/20">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">Add Teacher</h1>

            <p className="text-slate-400 text-sm mt-1">
              Create a new faculty account
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid md:grid-cols-2 gap-4"
          >
            {/* Name */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                Teacher Name
              </label>

              <input
                type="text"
                placeholder="Enter Name"
                {...register("name", {
                  required: "Name is required",
                })}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-blue-500"
              />

              <p className="h-5 text-red-400 text-xs mt-1">
                {errors.name?.message}
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="teacher@college.edu"
                {...register("email", {
                  required: "Email is required",
                })}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-blue-500"
              />

              <p className="h-5 text-red-400 text-xs mt-1">
                {errors.email?.message}
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter Password"
                {...register("password", {
                  required: "Password is required",
                })}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-blue-500"
              />

              <p className="h-5 text-red-400 text-xs mt-1">
                {errors.password?.message}
              </p>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                Subject Code
              </label>

              <input
                type="text"
                placeholder="CS301"
                {...register("teaching_sub", {
                  required: "Subject Code is required",
                })}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-blue-500"
              />

              <p className="h-5 text-red-400 text-xs mt-1">
                {errors.teaching_sub?.message}
              </p>
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-green-600 py-3 text-white font-semibold hover:bg-green-500 transition hover:cursor-pointer"
              >
                Add Teacher
              </button>
            </div>
          </form>

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
      </div>
    </div>
  );
}
