const express = require("express");
const router = require("express").Router();


const teacherController = require("../controllers/teacherController");
const {verifyToken} = require("../utils/tokenFile");


const upload = require("../middleware/upload");



// teacher routes
router.get("/profile",verifyToken,teacherController.profile)
router.get("/students_list",verifyToken,teacherController.students_list)
// router.post("/upload", verifyToken, teacherController.upload);
router.post("/upload",verifyToken,upload.single("image"),teacherController.upload);
router.get("/attendance-issues",verifyToken,teacherController.attendance_issues);
router.patch("/attendance-review",verifyToken,teacherController.attendance_review);
router.get("/attendance-history",verifyToken,teacherController.attendance_date_history);

router.post("/attendance-details", verifyToken, teacherController.attendance_details);

router.post("/attendance-export", verifyToken,teacherController.attendance_export);






module.exports = router;