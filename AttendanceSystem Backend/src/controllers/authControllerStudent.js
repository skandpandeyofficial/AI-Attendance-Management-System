const student = require("../models/Student");
const admissionNo = require("../models/admissionNo");

const { hashPassword, comparePassword } = require("../utils/hashPassword");

const { generateToken } = require("../utils/tokenFile");

// sign up function
const signup = async (req, res) => {
  try {
    // Step 1: Check admission number exists in admissionNo collection
    const validAdmission = await admissionNo.findOne({
      admissionNo: req.body.admissionNo,
    });

    if (!validAdmission) {
      return res.status(400).json({
        message: "Contact Admin, Admission Number Not Registered",
      });
    }

    // Step 2: Check admission number already registered
    const admissionExists = await student.findOne({
      admissionNo: req.body.admissionNo,
    });

    if (admissionExists) {
      return res.status(400).json({
        message: "Admission Number Already Registered",
      });
    }

    // Step 3: Check email already registered
    const emailExists = await student.findOne({
      email: req.body.email,
    });

    if (emailExists) {
      return res.status(400).json({
        message: "Email Already Registered",
      });
    }

    // Step 4: Create account
    const user = await student.create({
      admissionNo: req.body.admissionNo,
      name: req.body.name,
      email: req.body.email,
      password: await hashPassword(req.body.password),
    });

    res.status(201).json({
      message: "User Signup Successfully",
      info: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//login function
const login = async (req, res) => {
  const email = req.body.email;
  const user = await student.findOne({
    email: email,
  });

  if (!user) {
    return res.status(401).json({
      Status: "Email Incorrect",
    });
  }

  const plainPassword = req.body.password;
  const hashedPassword = user.password;

  const isMatch = await comparePassword(plainPassword, hashedPassword);

  if (isMatch) {
    // Token
    const token = generateToken(user);

    // token Save by using cookies => Broswer/Postman
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      Status: "User Login Successfully ✅",
    });
  } else {
    res.status(401).json({
      Status: "Password Incorrect",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      message: "Logout Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { signup, login, logout };
