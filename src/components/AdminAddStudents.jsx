import React, { useState } from "react";
import { useForm } from "react-hook-form";
import API from "../api/axios";

export default function AdminAddStudents() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (data) => {
    data.subjectCode = data.subjectCode.split(",").map((item) => item.trim());

    try {
      const res = await API.post("/admin/add-students", data);

      // console.log(res.data);

      setIsSuccess(true);

      setResponseMessage(res.data?.message || "Student Added Successfully");
    } catch (error) {
      setIsSuccess(false);

      setResponseMessage(
        error.response?.data?.message || "Failed To Add Student",
      );
    }
  };

  return (
    <div className="h-full bg-[#020617]">
      <div className="max-w-4xl mx-auto px-1 ">
        <div className="rounded-lg border border-white/10 bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl p-4 shadow-xl shadow-black/20">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-white">Add Student</h1>

            <p className="text-slate-400 text-sm mt-1">
              Create and manage student records
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid md:grid-cols-2 gap-4"
          >
            {/* Admission No */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                Admission Number
              </label>

              <input
                type="text"
                placeholder="Admission Number"
                {...register("admissionNo", {
                  required: "Admission Number is required",
                })}
                className="w-full text-sm rounded-sm bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-blue-500"
              />
              <p className="h-5 text-red-400 text-xs mt-1">
                {errors.admissionNo?.message}
              </p>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                Branch
              </label>

              <input
                type="text"
                placeholder="Example: CSE"
                {...register("branch", {
                  required: "Branch is required",
                })}
                className="w-full text-sm rounded-sm  bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-blue-500"
              />
              <p className="h-5 text-red-400 text-xs mt-1">
                {errors.branch?.message}
              </p>
            </div>

            {/* Subject Codes */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                Subject Codes
              </label>

              <input
                type="text"
                placeholder="KCS301,KCS401,KCS402"
                {...register("subjectCode", {
                  required: "Subject Code is required",
                })}
                className="w-full text-sm rounded-sm bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-blue-500"
              />
              <p className="h-5 text-red-400 text-xs mt-1">
                {errors.subjectCode?.message}
              </p>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                Gender
              </label>

              <select
                {...register("gender", {
                  required: "Gender is required",
                })}
                className="w-full text-sm rounded-sm bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-blue-500"
              >
                <option value="" className="text-black">
                  Select Gender
                </option>

                <option value="Male" className="text-black">
                  Male
                </option>

                <option value="Female" className="text-black">
                  Female
                </option>
              </select>
              <p className="h-5 text-red-400 text-xs mt-1">
                {errors.gender?.message}
              </p>
            </div>

            {/* Profile Image */}
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                Profile Image URL
              </label>

              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                {...register("profileImage", {
                  required: "Profile Image URL is required",
                })}
                className="w-full text-sm rounded-sm bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-blue-500"
              />
              <p className="h-5 text-red-400 text-xs mt-1">
                {errors.profileImage?.message}
              </p>
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold hover:bg-blue-500 transition hover:cursor-pointer"
              >
                Add Student
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
