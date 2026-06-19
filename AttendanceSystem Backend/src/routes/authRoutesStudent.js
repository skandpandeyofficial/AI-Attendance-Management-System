const express = require("express");
const router = require("express").Router();

const authControllerStudent = require("../controllers/authControllerStudent");

// auth routes students
router.post("/signup", authControllerStudent.signup);
router.post("/login", authControllerStudent.login);
router.post("/logout", authControllerStudent.logout);

//students routes
// router.get("/profile",)

module.exports = router;
