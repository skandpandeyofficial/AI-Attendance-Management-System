import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { motion } from "framer-motion";

export default function TeacherAttendanceHistory() {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  const getAttendanceDetails = async (date) => {
    setSelectedDate(date);
    try {
      setDetailsLoading(true);

      const res = await API.post("/teacher/attendance-details", { date });

      setDetails(res.data);
      setSelectedDate(date);
    } catch (error) {
      console.log(error.response?.data);
    } finally {
      setDetailsLoading(false);
    }
  };

  const getAttendanceHistory = async () => {
    try {
      setLoading(true);

      const historyRes = await API.get("/teacher/attendance-history");

      if (historyRes.data.length === 0) {
        setDates([]);
        return;
      }

      const latestDate = historyRes.data[0];

      const detailsRes = await API.post("/teacher/attendance-details", {
        date: latestDate,
      });

      setDates(historyRes.data);
      setSelectedDate(latestDate);
      setDetails(detailsRes.data);
    } catch (error) {
      console.log(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAttendanceHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>

          <p className="text-white mt-4">Loading...</p>
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
      <div className="w-full max-w-full overflow-x-hidden p-1">
        <div className="sticky top-0 z-50 bg-[#020617] pb-4">
          <h1 className="text-2xl font-bold text-white mb-4">
            Attendance History
          </h1>

          <div className="flex gap-2 overflow-x-auto ">
            {dates.map((date) => (
              <button
                key={date}
                onClick={() => getAttendanceDetails(date)}
                className={`shrink-0 rounded-full px-3 py-2 text-xs font-medium transition-all duration-200 hover:cursor-pointer ${
                  selectedDate === date
                    ? "bg-blue-600 text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                {formatDate(date)}
              </button>
            ))}
          </div>
        </div>

        {detailsLoading ? (
          <div className="flex justify-center py-10">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : details ? (
          <div
            className={`transition-all duration-300 ${
              detailsLoading ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            {/* Selected Date */}
            <div className="mb-2">
              <p className="text-gray-400 text-xs ">Selected Date</p>

              <h2 className="text-xl font-semibold text-white">
                {new Date(details.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </h2>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="rounded-sm border border-green-500/20 bg-green-500/10 p-5">
                <p className="text-green-300 text-xs">Present Students</p>

                <h2 className="text-3xl font-bold text-green-400 mt-2">
                  {details.presentCount}
                </h2>
              </div>

              <div className="rounded-sm border border-red-500/20 bg-red-500/10 p-5">
                <p className="text-red-300 text-xs">Absent Students</p>

                <h2 className="text-3xl font-bold text-red-400 mt-2">
                  {details.absentCount}
                </h2>
              </div>

              <div className="rounded-sm border border-yellow-500/20 bg-yellow-500/10 p-5">
                <p className="text-yellow-300 text-xs">Face Issues</p>

                <h2 className="text-3xl font-bold text-yellow-400 mt-2">
                  {details.issueCount}
                </h2>
              </div>
            </div>

            {/* Present Students */}
            <div className="rounded-sm border border-green-500/20 bg-green-500/5 p-5 mb-6">
              <h2 className="text-xl font-bold text-green-400 mb-4">
                Present Students
              </h2>

              {details.present.length === 0 ? (
                <p className="text-gray-400">No Present Students</p>
              ) : (
                <div className="space-y-2">
                  {details.present.map((student) => (
                    <div
                      key={student.admissionNo}
                      className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"
                    >
                      <div>
                        <p className="text-white font-medium">{student.name}</p>

                        <p className="text-xs text-gray-400">
                          {student.admissionNo}
                        </p>
                      </div>

                      <span className="text-green-400 text-lg">✓</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Absent Students */}
            <div className="rounded-sm border border-red-500/20 bg-red-500/5 p-5">
              <h2 className="text-xl font-bold text-red-400 mb-4">
                Absent Students
              </h2>

              {details.absent.length === 0 ? (
                <p className="text-gray-400">No Absent Students</p>
              ) : (
                <div className="space-y-2">
                  {details.absent.map((student) => (
                    <div
                      key={student.admissionNo}
                      className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"
                    >
                      <div>
                        <p className="text-white font-medium">{student.name}</p>

                        <p className="text-xs text-gray-400">
                          {student.admissionNo}
                        </p>
                      </div>

                      <span className="text-red-400 text-lg">✗</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Face Issues */}
            <div className="rounded-sm border border-yellow-500/20 bg-yellow-500/5 p-5 mt-6">
              <h2 className="text-xl font-bold text-yellow-400 mb-4">
                Face Issues
              </h2>

              {details.issue?.length === 0 ? (
                <p className="text-gray-400">No Face Issues</p>
              ) : (
                <div className="space-y-2">
                  {details.issue.map((student) => (
                    <div
                      key={student.admissionNo}
                      className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"
                    >
                      <div>
                        <p className="text-white font-medium">{student.name}</p>

                        <p className="text-xs text-gray-400">
                          {student.admissionNo}
                        </p>
                      </div>

                      <span className="text-yellow-400 text-lg">⚠️</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
