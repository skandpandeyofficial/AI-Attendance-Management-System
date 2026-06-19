const express = require("express");
const router = require("express").Router();

const adminController = require("../controllers/adminController");
const {verifyToken} = require("../utils/tokenFile");


// admin routes
router.post("/add-teachers",verifyToken,adminController.add_teachers)
router.post("/add-students",verifyToken,adminController.add_students)
router.get("/teachers-list",verifyToken,adminController.teachers_list)
router.get("/students-list",verifyToken,adminController.students_list)








module.exports = router;