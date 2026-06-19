import API from "../api/axios";

import Select from "react-select";
import { FiDownload, FiCalendar } from "react-icons/fi";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { PiFilePdfLight } from "react-icons/pi";

const TeacherExport = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState("");

  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const yearOptions = [];

  const selectedMonth = monthOptions.find(
    (m) => m.value === Number(month),
  )?.label;

  for (let year = 2024; year <= 2035; year++) {
    yearOptions.push({
      value: year,
      label: year.toString(),
    });
  }

  useEffect(() => {
    const getTeacher = async () => {
      try {
        const res = await API.get("/teacher/profile");

        setTeacher(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getTeacher();
  }, []);

  const generateReport = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.post("/teacher/attendance-export", {
        subjectCode: teacher?.teaching_sub,
        month,
        year,
      });

      setReport(res.data);
    } catch (error) {
      //   console.log(error);
      //   console.log(error.response);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!report) return;

    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setFont(undefined, "bold");

    doc.text("AI Attendance Management System", 105, 20, { align: "center" });

    doc.setFont(undefined, "normal");
    doc.setFontSize(12);

    doc.text(`Teacher: ${report.teacherName}`, 14, 35);
    doc.text(`Subject: ${report.subjectName}`, 14, 43);
    doc.text(`Subject Code: ${report.subjectCode}`, 14, 51);
    doc.text(`Month: ${selectedMonth} ${year}`, 14, 59);

    // Summary Box
    doc.setFillColor(245, 245, 245);
    doc.rect(14, 68, 182, 18, "F");

    doc.setFontSize(11);

    doc.text(`Present: ${report.presentCount}`, 18, 78);
    doc.text(`Absent: ${report.absentCount}`, 65, 78);
    doc.text(`Issue: ${report.issueCount}`, 105, 78);
    doc.text(`Attendance: ${report.attendancePercentage}`, 140, 78);

    doc.setFontSize(10);

    const sortedData = [...report.data].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );

    const tableData = sortedData.map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-GB"),
      name: item.name || "Unknown",
      status: item.status,
      admissionNo: item.admissionNo,
    }));

    autoTable(doc, {
      startY: 95,

      head: [["Date", "Name", "Status", "Admission No"]],

      body: tableData.map((row) => [
        row.date,
        row.name,
        row.status,
        row.admissionNo,
      ]),

      styles: {
        fontSize: 10,
        cellPadding: 3,
        halign: "center",
        valign: "middle",
      },

      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },

      didParseCell: (data) => {
        if (data.section !== "body") return;

        const rowDate = tableData[data.row.index]?.date;

        const uniqueDates = [...new Set(tableData.map((r) => r.date))];

        const dateIndex = uniqueDates.indexOf(rowDate);

        // Alternate Date Groups
        if (dateIndex % 2 === 0) {
          data.cell.styles.fillColor = [255, 247, 242];
        } else {
          data.cell.styles.fillColor = [242, 255, 253];
        }

        // Status Color
        if (data.column.index === 2) {
          const status = tableData[data.row.index]?.status;

          if (status === "P") {
            data.cell.styles.textColor = [0, 128, 0];
          }

          if (status === "A") {
            data.cell.styles.textColor = [255, 0, 0];
          }

          if (status === "I") {
            data.cell.styles.textColor = [255, 165, 0];
          }
        }
      },
    });

    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      doc.setFontSize(10);
      doc.text("Developed by Skand Pandey", 14, 290);

      doc.text(`Page ${i} of ${pageCount}`, 170, 290);
    }

    doc.save(`${report.subjectCode}_${selectedMonth}_${year}.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
    >
      <div className="min-h-screen p-3 ">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl border p-4">
            <div className="flex items-center gap-3 mb-4">
              {/* <FiCalendar size={40} />  */}
              <PiFilePdfLight className="text-6xl" />
              <div>
                <h1 className="text-2xl font-bold">Attendance Report Export</h1>
                <p className="text-gray-500 text-sm">
                  Download Monthly Attendance Reports
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-sm p-3">
              <div className="mb-3">
                <p className="text-sm text-slate-500 mb-2">Assigned Subject</p>

                <div className="bg-white border border-slate-300 rounded-xl h-14 px-4 flex items-center">
                  <span className="font-semibold text-lg">
                    {teacher?.teaching_sub || "Loading..."}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <Select
                  options={monthOptions}
                  placeholder="Select Month"
                  onChange={(selected) => setMonth(selected.value)}
                />

                <Select
                  options={yearOptions}
                  placeholder="Select Year"
                  onChange={(selected) => setYear(selected.value)}
                />

                <button
                  onClick={generateReport}
                  disabled={loading || !month || !year}
                  className={`h-[38px] rounded-md font-semibold transition hover:cursor-pointer ${
                    loading || !month || !year
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {loading ? "Generating..." : "Generate Report"}
                </button>
              </div>
            </div>
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
          </div>

          {report && (
            <>
              <div className="mt-6 bg-white rounded-3xl shadow-lg p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold">{report.subjectName}</h2>

                    <p className="text-gray-500 mt-1">{report.subjectCode}</p>

                    <div className="mt-3 space-y-1">
                      <p>
                        <span className="font-semibold">Teacher:</span>{" "}
                        {report.teacherName}
                      </p>

                      <p>
                        <span className="font-semibold">Month:</span>{" "}
                        {selectedMonth} {year}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={downloadPDF}
                    className="hover:cursor-pointer flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition-all duration-200"
                  >
                    {/* <FiDownload /> */}
                    <PiFilePdfLight className="text-xl" />
                    Download PDF
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                    <p className="text-gray-500 text-sm">Present</p>
                    <h3 className="text-4xl font-bold text-green-600">
                      {report.presentCount}
                    </h3>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                    <p className="text-gray-500 text-sm">Absent</p>
                    <h3 className="text-4xl font-bold text-red-600">
                      {report.absentCount}
                    </h3>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
                    <p className="text-gray-500 text-sm">Issue</p>
                    <h3 className="text-4xl font-bold text-yellow-600">
                      {report.issueCount}
                    </h3>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                    <p className="text-gray-500 text-sm">Attendance %</p>
                    <h3 className="text-4xl font-bold text-blue-600">
                      {report.attendancePercentage}
                    </h3>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
                    <p className="text-gray-500 text-sm">Total Records</p>

                    <h3 className="text-4xl font-bold text-purple-600">
                      {report.totalRecords}
                    </h3>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TeacherExport;
