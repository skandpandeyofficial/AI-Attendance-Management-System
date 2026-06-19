const express = require("express");
const router = require("express").Router();

const authControllerTeacher = require("../controllers/authControllerTeacher");

// auth routes Teacher
router.post("/login", authControllerTeacher.login);
router.post("/logout", authControllerTeacher.logout);



module.exports = router;
