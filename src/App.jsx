import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";

import { Navigate } from "react-router-dom";

import StudentLogin from "./components/StudentLogin";
import StudentSignup from "./components/StudentSignup";
import StudentLayout from "./components/StudentLayout";
import StudentProfile from "./components/StudentProfile";
import StudentDashboard from "./components/StudentDashboard";

import TeacherLogin from "./components/TeacherLogin";
import TeacherLayout from "./components/TeacherLayout";
import TeacherProfile from "./components/TeacherProfile";
import TeacherStudentsList from "./components/TeacherStudentsList";
import TeacherUpload from "./components/TeacherUpload";
import TeacherAttendanceIssue from "./components/TeacherAttendanceIssue";
import TeacherDahboard from "./components/TeacherDashboard";
import TeacherExport from "./components/TeacherExport";

import AdminLogin from "./components/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import AdminAddTeachers from "./components/AdminAddTeachers";
import AdminAddStudents from "./components/AdminAddStudents";
import AdminTeachersList from "./components/AdminTeachersList";
import AdminStudentsList from "./components/AdminStudentsList";

import PageNotFound from "./components/PageNotFound";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        {/* Student Auth */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/signup" element={<StudentSignup />} />

        {/* Student Portal */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="student-dashboard" replace />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="student-dashboard" element={<StudentDashboard />} />
        </Route>

        {/* Teacher Auth */}
        <Route path="/teacher/login" element={<TeacherLogin />} />

        {/* Teacher Portal */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="teacher-dashboard" replace />} />
          <Route path="profile" element={<TeacherProfile />} />
          <Route path="students-list" element={<TeacherStudentsList />} />
          <Route path="upload" element={<TeacherUpload />} />
          <Route path="attendance-issue" element={<TeacherAttendanceIssue />} />
          <Route path="teacher-dashboard" element={<TeacherDahboard />} />
          <Route path="attendance-export" element={<TeacherExport />} />
        </Route>

        {/* Admin Auth */}
        <Route path="/admin/auth/login" element={<AdminLogin />} />

        {/* Admin Portal */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="add-teachers" replace />} />
          <Route path="add-teachers" element={<AdminAddTeachers />} />
          <Route path="add-students" element={<AdminAddStudents />} />
          <Route path="teachers-list" element={<AdminTeachersList />} />
          <Route path="students-list" element={<AdminStudentsList />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
