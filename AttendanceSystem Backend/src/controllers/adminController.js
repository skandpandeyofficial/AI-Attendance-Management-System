const teacher = require("../models/Teacher");
const admissiondatas = require("../models/admissionNo");
// const student = require("../models/Student");

const { hashPassword, comparePassword } = require("../utils/hashPassword");




// add-teacher function (post)
const add_teachers = async (req, res) => {
  try {
    const existingTeacher = await teacher.findOne({
      email: req.body.email,
    });

    if (existingTeacher) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    await teacher.create({
      name: req.body.name,
      email: req.body.email,
      teaching_sub: req.body.teaching_sub,
      password: await hashPassword(req.body.password),
    });

    res.status(201).json({
      message: "Teacher Added Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};



// add-student function (post)
const add_students = async (req, res) => {
  try {
    const existingStudent = await admissiondatas.findOne({
      admissionNo: req.body.admissionNo,
    });

    if (existingStudent) {
      return res.status(400).json({
        message: "Admission No already registered",
      });
    }

    await admissiondatas.create({
      admissionNo: req.body.admissionNo,
      subjectCode: req.body.subjectCode,
      branch: req.body.branch,
      gender: req.body.gender,
      profileImage: req.body.profileImage,
    });

    res.status(201).json({
      message: "Student Added Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};


// teachers-list function (get)
const teachers_list = async (req, res) => {
  try {
    const teachers = await teacher.find({}, "name email teaching_sub");

    const formatted = teachers.map((t) => ({
      _id: t._id,
      teacher: {
        name: t.name,
        email: t.email,
        teaching_sub: t.teaching_sub,
      },
    }));

    return res.status(200).json({
      teachers_list: formatted,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching teachers",
      error: error.message,
    });
  }
};



// students-list function (get)
const students_list = async (req, res) => {
  try {
    const students = await admissiondatas.find(
      {},
      "admissionNo subjectCode branch gender"
    );

    const formatted = students.map((s) => ({
      _id: s._id,
      student: {
        admissionNo: s.admissionNo,
        subjectCode: s.subjectCode,
        branch: s.branch,
        gender: s.gender,
      },
    }));

    return res.status(200).json({
      students_list: formatted,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching students",
      error: error.message,
    });
  }
};


module.exports = { add_teachers,add_students,teachers_list,students_list };
