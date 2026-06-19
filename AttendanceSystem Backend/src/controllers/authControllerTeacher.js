const teacher = require("../models/Teacher");
const { hashPassword, comparePassword } = require("../utils/hashPassword");

const { generateToken } = require("../utils/tokenFile");

//login function teacher
const login = async (req, res) => {
  const email = req.body.email;
  const user = await teacher.findOne({
    email: email,
  });

  if (!user) {
    return res.status(404).json({
      Status: "Email Incorrect",
    });
  }

  const plainPassword = req.body.password;
  const hashedPassword = user.password;

  const isMatch = await comparePassword(plainPassword, hashedPassword);

  if (isMatch) {


    // Token
    const token = generateToken(user);


    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });



    res.status(200).json({
      Status: "Teacher Login Successfully ✅",
    });
  } else {
    res.status(200).json({
      Status: "Password Incorrect",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");

    res.status(200).json({
      message: "Logout Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { login, logout };
