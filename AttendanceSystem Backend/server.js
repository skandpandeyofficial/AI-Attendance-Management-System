const express = require("express");
const app = express();
// Import .env file
require("dotenv").config({ quiet: true });
const DBconnect = require("./src/config/db");
const authRoutesStudent = require("./src/routes/authRoutesStudent");
const authRoutesTeacher = require("./src/routes/authRoutesTeacher");
const authRoutesAdmin = require("./src/routes/authRoutesAdmin");

const studentRoutes = require("./src/routes/studentRoutes");
const teacherRoutes = require("./src/routes/teacherRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const PORT = process.env.PORT;

// DB connection function
DBconnect();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL],
    credentials: true,
  }),
);

// Server Listen at PORT
app.listen(PORT, () => {
  console.log("Server is Running 🚀");
});

// auth student
app.use("/student/auth", authRoutesStudent);

//student
app.use("/student", studentRoutes);

// auth teacher
app.use("/teacher/auth", authRoutesTeacher);

// teacher
app.use("/teacher", teacherRoutes);

// auth admin
app.use("/admin/auth", authRoutesAdmin);

// admin
app.use("/admin", adminRoutes);
