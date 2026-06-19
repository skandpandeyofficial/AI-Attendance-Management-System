import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

import { RiGraduationCapLine } from "react-icons/ri";

export default function AdminStudentsList() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStudents = async () => {
      try {
        const res = await API.get("/admin/students-list");

        setStudents(res.data.students_list);
      } catch (error) {
        navigate("/admin/auth/login");
      } finally {
        setLoading(false);
      }
    };

    getStudents();
  }, [navigate]);

  const filteredStudents = students.filter((item) =>
    item.student.admissionNo.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>

          <p className="text-white mt-4 text-lg">Loading Students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] ">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">Students List</h1>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Admission No..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-5 py-4 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((item) => (
              <div
                key={item._id}
                className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-md"
              >
                {/* Header */}
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl">
                    <RiGraduationCapLine className="text-white" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {item.student.admissionNo}
                    </h2>

                    <p className="text-gray-400 text-sm">Student</p>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-2 space-y-4">
                  <div>
                    <p className="text-gray-500 text-sm">Branch</p>

                    <p className="text-white">{item.student.branch}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">Gender</p>

                    <p className="text-white">{item.student.gender}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm mb-2">Subjects</p>

                    <div className="flex flex-wrap gap-2">
                      {item.student.subjectCode.map((subject) => (
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
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 text-xl">
              No Student Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
