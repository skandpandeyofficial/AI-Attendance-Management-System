import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { VscGraphLine } from "react-icons/vsc";

import { CiCalendarDate } from "react-icons/ci";
import { LuLibrary } from "react-icons/lu";

import { motion } from "framer-motion";

export default function StudentAttendance() {
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState(null);
  const [activeTab, setActiveTab] = useState("analytics");

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTimelineDate, setSelectedTimelineDate] = useState(null);

  const subjectOrder = [
    "KCS301",
    "KCS401",
    "KCS402",
    "KCS501",
    "KCS701",
    "KCS702",
  ];

  const attendanceDates = attendance
    ? Object.keys(attendance.attendanceHistory)
    : [];

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  useEffect(() => {
    if (attendance?.attendanceHistory) {
      const dates = Object.keys(attendance.attendanceHistory);

      if (dates.length > 0) {
        setSelectedTimelineDate(dates[0]);

        const firstDate = new Date(dates[0]);
        setCurrentMonth(firstDate);
      }
    }
  }, [attendance]);

  const formatDate = (date) => {
    const d = new Date(date);

    return `${String(d.getDate()).padStart(2, "0")}/${d.toLocaleString(
      "en-US",
      { month: "long" },
    )}/${d.getFullYear()}`;
  };

  useEffect(() => {
    const getAttendance = async () => {
      try {
        const res = await API.get("/student/attendance");

        // console.log(res.data);

        setAttendance(res.data);
      } catch (error) {
        // console.log(error.response?.data);

        navigate("/student/login");
      }
    };

    getAttendance();
  }, [navigate]);

  if (!attendance) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white text-2xl">
        Loading...
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
        {/* Overall Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-10">
          <div className="relative overflow-hidden bg-blue-500 rounded-lg p-4 text-white border-2 border-blue-300 border-solid">
            <VscGraphLine className="absolute -right-8 -bottom-8 text-[140px] text-white/10" />

            <p className="text-sm opacity-80 relative z-10">
              Overall Attendance
            </p>

            <h2 className="text-4xl font-bold mt-2 relative z-10">
              {attendance.overall.attendancePercentage}%
            </h2>
          </div>

          <div className="bg-green-500 rounded-lg p-4 text-white border-2 border-green-300 border-solid">
            <p className="text-sm opacity-80">Present</p>
            <h2 className="text-4xl font-bold mt-2">
              {attendance.overall.totalPresent}
            </h2>
          </div>

          <div className="bg-red-500 rounded-lg p-4 text-white border-2 border-red-300 border-solid">
            <p className="text-sm opacity-80">Absent</p>
            <h2 className="text-4xl font-bold mt-2">
              {attendance.overall.totalAbsent}
            </h2>
          </div>

          <div className="bg-purple-300 rounded-lg p-4 text-black">
            <p className="text-sm opacity-80">Admission No.</p>
            <h2 className="text-2xl font-bold mt-2">
              {attendance.admissionNo}
            </h2>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-5 py-1 rounded-lg font-semibold transition flex items-center gap-2 hover:cursor-pointer ${
              activeTab === "analytics"
                ? "bg-blue-600 text-white"
                : "bg-white/10 text-slate-300"
            }`}
          >
            <LuLibrary className="text-2xl" /> Subject Analytics
          </button>

          <button
            onClick={() => setActiveTab("timeline")}
            className={`px-5 py-3 rounded-xl font-semibold transition flex items-center gap-2 hover:cursor-pointer ${
              activeTab === "timeline"
                ? "bg-blue-600 text-white"
                : "bg-white/10 text-slate-300"
            }`}
          >
            <CiCalendarDate className="text-2xl" /> Attendance Timeline
          </button>
        </div>

        {/* Analytics */}
        {activeTab === "analytics" && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-5">
              Subject Analytics
            </h2>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {attendance.subjects.map((subject) => (
                <div
                  key={subject.subjectCode}
                  className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-3"
                >
                  <h3 className="text-lg font-bold text-white">
                    {subject.subjectName}
                  </h3>

                  <p className="text-slate-400 text-xs">
                    {subject.subjectCode}
                  </p>

                  <div className="flex items-center justify-between mt-3 ">
                    <div className="w-20 h-20">
                      <CircularProgressbar
                        value={subject.attendancePercentage}
                        text={`${subject.attendancePercentage}%`}
                        styles={buildStyles({
                          textSize: "18px",
                          strokeLinecap: "round",
                          pathTransitionDuration: 1,

                          pathColor:
                            subject.attendancePercentage >= 75
                              ? "#22c55e"
                              : subject.attendancePercentage >= 60
                                ? "#eab308"
                                : "#ef4444",

                          textColor: "#ffffff",
                          trailColor: "rgba(255,255,255,0.08)",
                        })}
                      />
                    </div>

                    <div className="text-right text-xs">
                      <p className="text-green-400">
                        Present: {subject.present}
                      </p>

                      <p className="text-red-400">Absent: {subject.absent}</p>

                      <div className="mt-2">
                        {subject.attendancePercentage >= 75 ? (
                          <span className="inline-flex items-center rounded-full border border-green-400/40 bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-300">
                            Good
                          </span>
                        ) : subject.attendancePercentage >= 60 ? (
                          <span className="inline-flex items-center rounded-full border border-yellow-400/40 bg-yellow-500/15 px-3 py-1 text-xs font-semibold text-yellow-300">
                            Warning
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border border-red-400/40 bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-300">
                            Short
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        {activeTab === "timeline" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-5">
              Attendance Timeline
            </h2>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* LEFT SIDE DATES */}
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between mb-5">
                  <button
                    onClick={() =>
                      setCurrentMonth(new Date(year, month - 1, 1))
                    }
                    className="h-10 w-10 rounded-lg bg-white/10 text-white hover:cursor-pointer "
                  >
                    ←
                  </button>

                  <h3 className="text-xl font-bold text-white">
                    {currentMonth.toLocaleString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>

                  <button
                    onClick={() =>
                      setCurrentMonth(new Date(year, month + 1, 1))
                    }
                    className="h-10 w-10 rounded-lg bg-white/10 text-white hover:cursor-pointer"
                  >
                    →
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-3">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                    <div key={i} className="text-center text-slate-400 text-sm">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => {
                    if (!day) {
                      return <div key={index} className="aspect-square te" />;
                    }

                    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                    const hasAttendance = attendanceDates.includes(dateStr);

                    return (
                      <button
                        key={dateStr}
                        disabled={!hasAttendance}
                        onClick={() =>
                          hasAttendance && setSelectedTimelineDate(dateStr)
                        }
                        className={`
            aspect-square rounded-sm text-xl transition 
            ${
              selectedTimelineDate === dateStr
                ? "bg-blue-600 text-white"
                : hasAttendance
                  ? "bg-white/10 text-white hover:bg-white/20 hover:cursor-pointer"
                  : "bg-white/5 text-gray-500 opacity-30 "
            }
          `}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT SIDE DETAILS */}
              <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                {selectedTimelineDate ? (
                  <>
                    <h3 className="text-xl font-bold text-blue-400 mb-5">
                      {formatDate(selectedTimelineDate)}
                    </h3>

                    <div className="space-y-3">
                      {subjectOrder.map((subjectCode) => {
                        const record = attendance.attendanceHistory[
                          selectedTimelineDate
                        ]?.find((r) => r.subjectCode === subjectCode);

                        return (
                          <div
                            key={subjectCode}
                            className="flex items-center justify-between rounded-xl bg-slate-800/40 px-4 py-3"
                          >
                            <div>
                              <p className="text-white font-semibold">
                                {subjectCode}
                              </p>

                              <p className="text-xs text-slate-400">
                                {record?.subjectName || "No Class"}
                              </p>
                            </div>

                            {record ? (
                              <span
                                className={`font-bold ${
                                  record.status === "P"
                                    ? "text-green-400"
                                    : "text-red-400"
                                }`}
                              >
                                {record.status === "P" ? "Present" : "Absent"}
                              </span>
                            ) : (
                              <span className="text-slate-500">No Class</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <p className="text-slate-400">Select a date</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
