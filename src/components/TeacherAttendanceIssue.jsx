import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { motion } from "framer-motion";

export default function AttendanceIssue() {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const getIssues = async () => {
      try {
        const res = await API.get("/teacher/attendance-issues");

        // console.log(res.data);

        setIssues(res.data.issues);
      } catch (error) {
        console.log(error.response?.data);

        navigate("/teacher/login");
      } finally {
        setLoading(false);
      }
    };

    getIssues();
  }, [navigate]);

  const handleReview = async (admissionNo, date, status, id) => {
    try {
      setRemovingId(id);

      await API.patch("/teacher/attendance-review", {
        admissionNo,
        date,
        status,
      });

      setTimeout(() => {
        setIssues((prev) => prev.filter((item) => item._id !== id));

        setRemovingId(null);
      }, 500);
    } catch (error) {
      console.log(error.response?.data);
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>

          <p className="text-white mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
        <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
    >
    <div className="min-h-screen bg-[#020617]">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Attendance Issues
        </h1>

        {issues.length === 0 ? (
          <div className="rounded-xl border border-gray-500/20 bg-gray-500/10 p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-400" >
              No Attendance Issues Found
            </h2>

            <p className="text-gray-300 mt-4 text-xs">
              All attendance records have been reviewed.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {issues.map((issue) => (
              <div
                key={issue._id}
                className={`rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-500 ease-in-out ${
                  removingId === issue._id
                    ? "opacity-0 scale-95 -translate-x-10"
                    : "opacity-100 scale-100 translate-x-0"
                }`}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Admission No</p>

                    <h3 className="text-white text-lg font-semibold">
                      {issue.admissionNo}
                    </h3>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Subject Code</p>

                    <h3 className="text-white text-lg font-semibold">
                      {issue.sub_code}
                    </h3>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Date</p>

                    <h3 className="text-white text-lg font-semibold">
                      {issue.date.split("T")[0]}
                    </h3>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Status</p>

                    <h3 className="text-yellow-400 text-lg font-semibold">
                      {issue.status}
                    </h3>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() =>
                      handleReview(
                        issue.admissionNo,
                        issue.date,
                        "P",
                        issue._id,
                      )
                    }
                    className="flex-1 rounded-xl bg-green-600 py-3 text-white font-semibold hover:bg-green-500"
                  >
                    Present
                  </button>

                  <button
                    onClick={() =>
                      handleReview(
                        issue.admissionNo,
                        issue.date,
                        "A",
                        issue._id,
                      )
                    }
                    className="flex-1 rounded-xl bg-red-600 py-3 text-white font-semibold hover:bg-red-500"
                  >
                    Absent
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </motion.div>
  );
}
