const { generateToken } = require("../utils/tokenFile");


//login function
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ENV credentials check
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        status: "Email or Password Incorrect",
      });
    }

    // Token generate
    const token = generateToken({
      email: process.env.ADMIN_EMAIL,
    });

    // Save token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: "ADMIN Login Successfully ✅",
    });
  } catch (error) {
    return res.status(500).json({
      status: "Server Error",
      message: error.message,
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

module.exports = { login, logout };
