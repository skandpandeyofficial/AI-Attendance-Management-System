const teacher = require("../models/Teacher");
const admissiondatas = require("../models/admissionNo");
const student = require("../models/Student");
const AttendanceSchema = require("../models/Attendance");
const Subject = require("../models/Subject");

const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const axios = require("axios");

// const { hashPassword, comparePassword } = require("../utils/hashPassword");

// profile fuction
const profile = async (req, res) => {
  const user = await teacher.findOne({
    email: req.user.email,
  });

  if (!user) {
    return res.status(404).json({
      message: "Teacher not found",
    });
  }

  res.status(200).json({
    name: user.name,
    email: user.email,
    teaching_sub: user.teaching_sub,
  });
};

// student list
const students_list = async (req, res) => {
  try {
    const user = await teacher.findOne({
      email: req.user.email,
    });

    if (!user) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    const studentList = await admissiondatas.find({
      subjectCode: user.teaching_sub,
    });

    const admissionNos = studentList.map((item) => item.admissionNo);

    const students = await student.find({
      admissionNo: {
        $in: admissionNos,
      },
    });

    const result = students.map((stu) => {
      const admissionData = studentList.find(
        (item) => item.admissionNo === stu.admissionNo,
      );

      return {
        admissionNo: stu.admissionNo,
        name: stu.name,
        subjectCode: admissionData.subjectCode,
        branch: admissionData.branch,
      };
    });

    res.status(200).json({
      students: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// upload
const upload = async (req, res) => {
  try {
    const { img_url, date } = req.body;

    if (!date) {
      return res.status(400).json({
        message: "Date is required",
      });
    }

    let imageUrl = img_url;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "AttendanceSystemFolder",
      });

      imageUrl = uploadResult.secure_url;

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    if (!imageUrl) {
      return res.status(400).json({
        message: "Image or URL is required",
      });
    }

    // Teacher Info
    const teacherInfo = await teacher.findOne({
      email: req.user.email,
    });

    if (!teacherInfo) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }


    // Duplicate Attendance Check
    const alreadyMarked = await AttendanceSchema.findOne({
      sub_code: teacherInfo.teaching_sub,
      date: new Date(date),
    });

    if (alreadyMarked) {
      return res.status(400).json({
        message: "Attendance already marked for this date",
      });
    }

    // Subject Students (Admission DB)
    const subjectStudents = await admissiondatas.find({
      subjectCode: teacherInfo.teaching_sub,
    });

    if (!subjectStudents.length) {
      return res.status(404).json({
        message: "No students found for this subject",
      });
    }

    // AI ko profile images bhejne ke liye
    const studentData = subjectStudents.map((stu) => ({
      admissionNo: stu.admissionNo,
      profileImage: stu.profileImage,
    }));

    // Registered Students Only
    const registeredStudents = await student.find({
      admissionNo: {
        $in: subjectStudents.map((s) => s.admissionNo),
      },
    });

    if (!registeredStudents.length) {
      return res.status(404).json({
        message: "No registered students found",
      });
    }

    // AI Service
    const response = await axios.post("http://127.0.0.1:8000/face-attendance", {
      groupImage: imageUrl,
      date,
      students: studentData,
      subjectCode: teacherInfo.teaching_sub,
    });

    const presentStudents = response.data.presentStudents || [];
    const faceIssue = response.data.faceIssue || [];
    const annotatedImageUrl = response.data.annotatedImageUrl || "";

    const present = [];
    const absent = [];
    const issue = [];

    for (const stu of registeredStudents) {
      let status = "A";

      if (presentStudents.includes(stu.admissionNo)) {
        status = "P";
      }

      const issueObj = faceIssue.find(
        (item) => item.admissionNo === stu.admissionNo,
      );

      if (issueObj) {
        status = "I";
      }

      await AttendanceSchema.create({
        admissionNo: stu.admissionNo,
        sub_code: teacherInfo.teaching_sub,
        date: new Date(date),
        status,
      });

      if (status === "P") {
        present.push({
          admissionNo: stu.admissionNo,
          name: stu.name,
        });
      }

      if (status === "A") {
        absent.push({
          admissionNo: stu.admissionNo,
          name: stu.name,
        });
      }

      if (status === "I") {
        issue.push({
          admissionNo: stu.admissionNo,
          name: stu.name,
          reason: issueObj.reason || "Face issue",
        });
      }
    }

    return res.status(200).json({
      subjectCode: teacherInfo.teaching_sub,
      date,

      totalStudents: registeredStudents.length,
      totalPresent: present.length,
      totalAbsent: absent.length,
      totalIssue: issue.length,

      present,
      absent,
      faceIssue: issue,
      annotatedImageUrl,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const attendance_issues = async (req, res) => {
  try {
    const teacherInfo = await teacher.findOne({
      email: req.user.email,
    });

    const issues = await AttendanceSchema.find({
      sub_code: teacherInfo.teaching_sub,
      status: "I",
    });

    res.status(200).json({
      issues,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const attendance_review = async (req, res) => {
  try {
    const { admissionNo, date, status } = req.body;

    const updatedAttendance = await AttendanceSchema.findOneAndUpdate(
      {
        admissionNo,
        date: new Date(date),
        status: "I",
      },
      {
        status,
      },
      {
        returnDocument: "after",
      },
    );

    if (!updatedAttendance) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      message: "Attendance Updated",
      attendance: updatedAttendance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// attendance (date) history
const attendance_date_history = async (req, res) => {
  try {
    const teacherInfo = await teacher.findOne({
      email: req.user.email,
    });

    const records = await AttendanceSchema.find({
      sub_code: teacherInfo.teaching_sub,
    }).sort({ date: -1 });

    const dates = [
      ...new Set(
        records.map((record) => record.date.toISOString().split("T")[0]),
      ),
    ];

    return res.status(200).json(dates);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// attendance details by input date
const attendance_details = async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({
        message: "Date is required",
      });
    }

    const teacherInfo = await teacher.findOne({
      email: req.user.email,
    });

    if (!teacherInfo) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    const startDate = new Date(date);
    const endDate = new Date(date);

    endDate.setDate(endDate.getDate() + 1);

    const records = await AttendanceSchema.find({
      sub_code: teacherInfo.teaching_sub,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const present = [];
    const absent = [];
    const issue = [];

    for (const record of records) {
      const stu = await student.findOne({
        admissionNo: record.admissionNo,
      });

      if (!stu) continue;

      const data = {
        admissionNo: stu.admissionNo,
        name: stu.name,
      };

      if (record.status === "P") {
        present.push(data);
      } else if (record.status === "A") {
        absent.push(data);
      } else if (record.status === "I") {
        issue.push(data);
      }
    }

    return res.status(200).json({
      date,

      totalStudents: present.length + absent.length + issue.length,

      presentCount: present.length,
      absentCount: absent.length,
      issueCount: issue.length,

      present,
      absent,
      issue,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};



// export
const attendance_export = async (req, res) => {
  try {
    const { subjectCode, month, year } = req.body;

    if (!subjectCode || !month || !year) {
      return res.status(400).json({
        success: false,
        message: "Subject Code, Month and Year are required",
      });
    }

    const teacherInfo = await teacher.findOne({
      email: req.user.email,
    });

    if (!teacherInfo) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    if (teacherInfo.teaching_sub !== subjectCode) {
      return res.status(403).json({
        success: false,
        message: "Please enter your assigned subject code only",
      });
    }

    const subjectInfo = await Subject.findOne({
      sub_code: subjectCode,
    });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const records = await AttendanceSchema.find({
      sub_code: subjectCode,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    }).sort({ date: 1 });

    if (!records.length) {
      return res.status(404).json({
        success: false,
        message: "No attendance data found",
      });
    }

    const admissionNos = [
      ...new Set(records.map((item) => item.admissionNo)),
    ];

    const students = await student.find({
      admissionNo: {
        $in: admissionNos,
      },
    });

    const studentMap = {};

    students.forEach((stu) => {
      studentMap[stu.admissionNo] = stu.name;
    });

    const formattedData = records.map((item) => ({
      admissionNo: item.admissionNo,
      name: studentMap[item.admissionNo] || "Unknown",
      date: item.date,
      status: item.status,
    }));

    const presentCount = records.filter(
      (item) => item.status === "P"
    ).length;

    const absentCount = records.filter(
      (item) => item.status === "A"
    ).length;

    const issueCount = records.filter(
      (item) => item.status === "I"
    ).length;

    const totalRecords = records.length;

    const attendancePercentage = (
      (presentCount / totalRecords) *
      100
    ).toFixed(2);

    return res.status(200).json({
      success: true,

      teacherName: teacherInfo.name,

      subjectCode,
      subjectName: subjectInfo?.name || "Unknown Subject",

      month,
      year,

      totalRecords,
      presentCount,
      absentCount,
      issueCount,

      attendancePercentage: `${attendancePercentage}%`,

      data: formattedData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



module.exports = {
  profile,
  students_list,
  upload,
  attendance_review,
  attendance_issues,
  attendance_date_history,
  attendance_details,
  attendance_export,
};
