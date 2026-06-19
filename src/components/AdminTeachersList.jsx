import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

import { GiTeacher } from "react-icons/gi";

export default function AdminTeachersList() {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTeachers = async () => {
      try {
        const res = await API.get("/admin/teachers-list");

        // console.log(res.data);

        setTeachers(res.data.teachers_list);
      } catch (error) {
        // console.log(error.response?.data);

        navigate("/admin/auth/login");
      } finally {
        setLoading(false);
      }
    };

    getTeachers();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-green-500 border-t-transparent mx-auto"></div>

          <p className="text-white mt-4 text-lg">Loading Teachers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] ">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Teachers List</h1>

        {teachers.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <h2 className="text-2xl font-bold text-white">No Teachers Found</h2>

            <p className="text-gray-400 mt-2">
              Teachers will appear here once added.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-6">
            {teachers.map((item) => (
              <div
                key={item._id}
                className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-md"
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-green-500/20 flex items-center justify-center text-2xl">
                    <GiTeacher className="text-white" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {item.teacher.name}
                    </h2>

                    <p className="text-gray-400 text-sm">Faculty Member</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>

                    <p className="text-white break-all">{item.teacher.email}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">Teaching Subject</p>

                    <span className="inline-block mt-1 rounded-full bg-green-500/20 px-3 py-1 text-green-400 text-sm">
                      {item.teacher.teaching_sub}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
