import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { motion } from "framer-motion";

export default function TeacherStudentsList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const getStudents = async () => {
      try {
        const res = await API.get("/teacher/students_list");

        // console.log(res.data);

        setStudents(res.data.students);
      } catch (error) {
        console.log(error.response?.data);

        navigate("/teacher/login");
      }
    };

    getStudents();
  }, [navigate]);

  if (!students.length) {
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
    <div className="min-h-screen bg-[#020617] p-2">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Students List
        </h1>

        <div className="grid gap-5">
          {students.map((student) => (
            <div
              key={student.admissionNo}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-1xl font-bold text-white">
                    {student.name}
                  </h2>

                  <p className="text-blue-400 mt-1 text-xs">
                    {student.admissionNo}
                  </p>

                  <p className="text-gray-400 mt-1 text-xs">
                    Branch: {student.branch}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {student.subjectCode.map((subject) => (
                    <span
                      key={subject}
                      className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-400"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </motion.div>
  );
}