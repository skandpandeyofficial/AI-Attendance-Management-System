const student = require("../models/Student");
const admissionNo = require("../models/admissionNo");
const subjects = require("../models/Subject");
const AttendanceSchema = require("../models/Attendance");

// const subSchema = require("../models/subject");

// profile fuction
const profile = async (req, res) => {
  const user = await student.findOne({
    email: req.user.email,
  });

  const info = await admissionNo.findOne({
    admissionNo: user.admissionNo,
  });

  const subjectInfo = await subjects.find({
    sub_code: { $in: info.subjectCode },
  });

  res.status(200).json({
    admissionNo: info.admissionNo,
    name: user.name,
    branch: info.branch,
    email: user.email,
    gender: info.gender,
    profileImage: info.profileImage,

    subjects: subjectInfo.map((sub) => ({
      code: sub.sub_code,
      name: sub.name,
    })),
  });
};



const attendance = async (req, res) => {
  try {
    const user = await student.findOne({
      email: req.user.email,
    });

    if (!user) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const admissionData = await admissionNo.findOne({
      admissionNo: user.admissionNo,
    });

    if (!admissionData) {
      return res.status(404).json({
        message: "Admission data not found",
      });
    }

    const subjectCodes =
      admissionData.subjectCode || [];

    const subjectData = await subjects.find({
      sub_code: {
        $in: subjectCodes,
      },
    });

    const subjectMap = {};

    subjectData.forEach((subject) => {
      subjectMap[subject.sub_code] =
        subject.name;
    });

    const attendanceInfo =
      await AttendanceSchema.find({
        admissionNo: user.admissionNo,
      }).sort({
        date: -1,
      });

    const attendanceHistory = {};
    const subjectStats = {};

    let totalPresent = 0;
    let totalAbsent = 0;

    attendanceInfo.forEach((item) => {
      const date = item.date
        .toISOString()
        .split("T")[0];

      // History
      if (!attendanceHistory[date]) {
        attendanceHistory[date] = [];
      }

      attendanceHistory[date].push({
        subjectCode: item.sub_code,

        subjectName:
          subjectMap[item.sub_code] ||
          "Unknown Subject",

        status: item.status,
      });

      // Subject Stats
      if (!subjectStats[item.sub_code]) {
        subjectStats[item.sub_code] = {
          present: 0,
          absent: 0,
        };
      }

      if (item.status === "P") {
        subjectStats[item.sub_code].present++;
        totalPresent++;
      }

      if (item.status === "A") {
        subjectStats[item.sub_code].absent++;
        totalAbsent++;
      }
    });

    // IMPORTANT:
    // Assigned subjects se analytics banao
    const subjectAnalytics =
      subjectCodes.map((code) => {
        const stats =
          subjectStats[code];

        if (!stats) {
          return {
            subjectCode: code,

            subjectName:
              subjectMap[code] ||
              "Unknown Subject",

            present: 0,

            absent: 0,

            attendancePercentage: 0,
          };
        }

        const total =
          stats.present +
          stats.absent;

        return {
          subjectCode: code,

          subjectName:
            subjectMap[code] ||
            "Unknown Subject",

          present: stats.present,

          absent: stats.absent,

          attendancePercentage:
            total === 0
              ? 0
              : Number(
                  (
                    (stats.present /
                      total) *
                    100
                  ).toFixed(2)
                ),
        };
      });

    const overallAttendance =
      totalPresent + totalAbsent === 0
        ? 0
        : Number(
            (
              (totalPresent /
                (totalPresent +
                  totalAbsent)) *
              100
            ).toFixed(2)
          );

    return res.status(200).json({
      admissionNo:
        user.admissionNo,

      overall: {
        attendancePercentage:
          overallAttendance,

        totalPresent,

        totalAbsent,
      },

      totalSubjects:
        subjectCodes.length,

      subjects:
        subjectAnalytics,

      attendanceHistory,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message:
        "Internal Server Error",
    });
  }
};


module.exports = { profile, attendance };
