import React, { useState, useRef } from "react";

import { useForm } from "react-hook-form";
import API from "../api/axios";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Webcam from "react-webcam";

export default function UploadAttendance() {
  const { register, handleSubmit, reset } = useForm();

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const [uploadMode, setUploadMode] = useState("url");
  const [selectedFile, setSelectedFile] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const webcamRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState(null);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });

  const handleCameraProceed = async () => {
    try {
      setLoading(true);

      const blob = await fetch(capturedImage).then((r) => r.blob());

      const file = new File([blob], `attendance-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      const formData = new FormData();

      formData.append("image", file);

      formData.append(
        "date",
        `${selectedDate.getFullYear()}-${String(
          selectedDate.getMonth() + 1,
        ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`,
      );

      const res = await API.post("/teacher/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResponse(res.data);
    } catch (error) {
      console.log(error);

      setResponse({
        message: error.response?.data?.message || "Upload Failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      let res;

      if (uploadMode === "file") {
        const formData = new FormData();

        formData.append("image", selectedFile);
        formData.append(
          "date",
          `${selectedDate.getFullYear()}-${String(
            selectedDate.getMonth() + 1,
          ).padStart(
            2,
            "0",
          )}-${String(selectedDate.getDate()).padStart(2, "0")}`,
        );

        res = await API.post("/teacher/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        res = await API.post("/teacher/upload", {
          img_url: data.img_url,
          date: `${selectedDate.getFullYear()}-${String(
            selectedDate.getMonth() + 1,
          ).padStart(
            2,
            "0",
          )}-${String(selectedDate.getDate()).padStart(2, "0")}`,
        });
      }

      setResponse(res.data);

      reset();
    } catch (error) {
      console.log(error.response?.data);

      setResponse({
        message: error.response?.data?.message || "Upload Failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: "easeIn",
      }}
    >
      <div className="min-h-screen bg-[#020617] ">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">AI Attendance</h1>

            <p className="mt-1 text-xs text-gray-400">
              Upload a class image and mark attendance automatically
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            {loading && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                <div className="text-center">
                  <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>

                  <p className="mt-4 text-white text-lg font-medium">
                    Processing Attendance...
                  </p>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-3 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setUploadMode("file")}
                  className={`px-4 py-2 rounded-xl text-sm hover:cursor-pointer ${
                    uploadMode === "file"
                      ? "bg-blue-600 text-white"
                      : "bg-white/10 text-gray-300"
                  }`}
                >
                  Upload Image
                </button>

                <button
                  type="button"
                  onClick={() => setUploadMode("url")}
                  className={`px-4 py-2 rounded-xl text-sm hover:cursor-pointer ${
                    uploadMode === "url"
                      ? "bg-blue-600 text-white"
                      : "bg-white/10 text-gray-300"
                  }`}
                >
                  Image URL
                </button>

                <button
                  type="button"
                  onClick={() => setUploadMode("camera")}
                  className={`px-4 py-2 rounded-xl text-sm hover:cursor-pointer ${
                    uploadMode === "camera"
                      ? "bg-blue-600 text-white"
                      : "bg-white/10 text-gray-300"
                  }`}
                >
                  Camera
                </button>
              </div>

              {uploadMode === "camera" && (
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-xl border border-white/10 max-w-md mx-auto">
                    {!capturedImage ? (
                      <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-55 object-cover"
                      />
                    ) : (
                      <img
                        src={capturedImage}
                        alt="Preview"
                        className="w-full h-55 object-cover"
                      />
                    )}
                  </div>

                  {!capturedImage ? (
                    <button
                      type="button"
                      onClick={() => {
                        const image = webcamRef.current.getScreenshot();
                        setCapturedImage(image);
                      }}
                      className="w-full rounded-xl bg-green-600 py-3 text-white hover:cursor-pointer "
                    >
                      Capture Photo
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setCapturedImage(null)}
                        className="rounded-xl bg-gray-700 py-3 text-white hover:cursor-pointer "
                      >
                        Retake
                      </button>

                      <button
                        type="button"
                        onClick={handleCameraProceed}
                        className="rounded-xl bg-green-600 py-3 text-white hover:cursor-pointer "
                      >
                        Proceed
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Image URL */}
              {uploadMode === "url" && (
                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Image URL
                  </label>

                  <input
                    type="text"
                    placeholder="Paste Image URL"
                    {...register("img_url")}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                  />
                </div>
              )}

              {/* File Upload */}
              {uploadMode === "file" && (
                <div
                  {...getRootProps()}
                  className={`flex cursor-pointer text-sm flex-col items-center justify-center rounded-2xl border-2 border-dashed min-h-45 p-5 text-center transition
    ${
      isDragActive
        ? "border-blue-500 bg-blue-500/10"
        : "border-white/20 bg-white/5 hover:border-blue-500"
    }`}
                >
                  <input {...getInputProps()} />

                  <div className="text-3xl mb-2">☁️</div>

                  <h3 className="text-lg font-semibold text-white">
                    Upload Image
                  </h3>

                  <p className="mt-2 text-gray-400">
                    {isDragActive
                      ? "Drop image here..."
                      : "Drag & Drop or Click to Browse"}
                  </p>

                  {selectedFile && (
                    <p className="mt-4 text-green-400 font-medium">
                      {selectedFile.name}
                    </p>
                  )}
                </div>
              )}

              {/* Date */}
              <div>
                <label className="block text-gray-300 mb-3 text-sm font-medium">
                  Attendance Date
                </label>

                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd MMMM yyyy"
                  className="
    w-full
    rounded-xl
    border
    border-white/10
    bg-white/5
    px-5
    py-4
    text-white
    outline-none
  "
                />
              </div>

              {/* Submit */}
              {uploadMode !== "camera" && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white"
                >
                  {loading ? "Please Wait..." : "Process Attendance"}
                </button>
              )}
            </form>
          </div>

          {response && (
            <div className="mt-5 rounded-2xl border border-green-500/20 bg-green-500/10 p-6">
              <h2 className="text-2xl font-bold text-green-400 mb-6">
                Upload Result
              </h2>
              {response.message && !response.subjectCode ? (
                <p className="text-red-400 font-medium">{response.message}</p>
              ) : (
                <>
                  {/* Subject Info */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                      <p className="text-gray-400">Subject</p>
                      <h3 className="text-xl font-bold text-white">
                        {response.subjectCode}
                      </h3>
                    </div>

                    <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                      <p className="text-gray-400">Date</p>
                      <h3 className="text-xl font-bold text-white">
                        {new Date(response.date).toLocaleDateString("en-GB")}
                      </h3>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
                      <p className="text-gray-400 text-sm">Students</p>
                      <h2 className="text-3xl font-bold text-white">
                        {response.totalStudents}
                      </h2>
                    </div>

                    <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4">
                      <p className="text-gray-400 text-sm">Present</p>
                      <h2 className="text-3xl font-bold text-green-400">
                        {response.totalPresent}
                      </h2>
                    </div>

                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                      <p className="text-gray-400 text-sm">Absent</p>
                      <h2 className="text-3xl font-bold text-red-400">
                        {response.totalAbsent}
                      </h2>
                    </div>

                    <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-4">
                      <p className="text-gray-400 text-sm">Issues</p>
                      <h2 className="text-3xl font-bold text-yellow-400">
                        {response.totalIssue}
                      </h2>
                    </div>
                  </div>

                  {response.annotatedImageUrl && (
                    <div className="mb-8 overflow-hidden rounded-2xl border border-blue-500/20">
                      <div className="bg-blue-500/10 px-4 py-3">
                        <h3 className="text-blue-400 font-bold">
                          Scanned Image
                        </h3>
                      </div>

                      <div className="p-4">
                        <img
                          src={response.annotatedImageUrl}
                          alt="Attendance Result"
                          className="w-full rounded-xl border border-white/10"
                        />
                      </div>
                    </div>
                  )}

                  {/* Present Students */}
                  {response.present?.length > 0 && (
                    <div className="mb-8 overflow-hidden rounded-2xl border border-green-500/20">
                      <div className="bg-green-500/10 px-4 py-3">
                        <h3 className="text-green-400 font-bold">
                          Present Students ({response.present.length})
                        </h3>
                      </div>

                      <table className="w-full">
                        <thead className="bg-white/5">
                          <tr>
                            <th className="p-3 text-left text-white">#</th>
                            <th className="p-3 text-left text-white">
                              Admission No
                            </th>
                            <th className="p-3 text-left text-white">Name</th>
                          </tr>
                        </thead>

                        <tbody>
                          {response.present.map((student, index) => (
                            <tr
                              key={index}
                              className="border-t border-white/10"
                            >
                              <td className="p-3 text-gray-300">{index + 1}</td>

                              <td className="p-3 text-green-300">
                                {student.admissionNo}
                              </td>

                              <td className="p-3 text-white">{student.name}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Absent Students */}
                  {response.absent?.length > 0 && (
                    <div className="mb-8 overflow-hidden rounded-2xl border border-red-500/20">
                      <div className="bg-red-500/10 px-4 py-3">
                        <h3 className="text-red-400 font-bold">
                          Absent Students ({response.absent.length})
                        </h3>
                      </div>

                      <table className="w-full">
                        <thead className="bg-white/5">
                          <tr>
                            <th className="p-3 text-left text-white">#</th>
                            <th className="p-3 text-left text-white">
                              Admission No
                            </th>
                            <th className="p-3 text-left text-white">Name</th>
                          </tr>
                        </thead>

                        <tbody>
                          {response.absent.map((student, index) => (
                            <tr
                              key={index}
                              className="border-t border-white/10"
                            >
                              <td className="p-3 text-gray-300">{index + 1}</td>

                              <td className="p-3 text-red-300">
                                {student.admissionNo}
                              </td>

                              <td className="p-3 text-white">{student.name}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Face Issues */}
                  {response.faceIssue?.length > 0 && (
                    <div className="overflow-hidden rounded-2xl border border-yellow-500/20">
                      <div className="bg-yellow-500/10 px-4 py-3">
                        <h3 className="text-yellow-400 font-bold">
                          Face Issues ({response.faceIssue.length})
                        </h3>
                      </div>

                      <table className="w-full">
                        <thead className="bg-white/5">
                          <tr>
                            <th className="p-3 text-left text-white">
                              Admission No
                            </th>
                            <th className="p-3 text-left text-white">Name</th>
                            <th className="p-3 text-left text-white">Reason</th>
                          </tr>
                        </thead>

                        <tbody>
                          {response.faceIssue.map((issue, index) => (
                            <tr
                              key={index}
                              className="border-t border-white/10"
                            >
                              <td className="p-3 text-yellow-300">
                                {issue.admissionNo}
                              </td>

                              <td className="p-3 text-white">{issue.name}</td>

                              <td className="p-3 text-gray-300">
                                {issue.reason}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
