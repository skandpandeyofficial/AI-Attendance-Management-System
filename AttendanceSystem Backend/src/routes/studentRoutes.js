const express = require("express");
const router = require("express").Router();

const studentController = require("../controllers/studentController");
const {verifyToken} = require("../utils/tokenFile");


// students routes
router.get("/profile",verifyToken,studentController.profile)
router.get("/attendance",verifyToken,studentController.attendance)





module.exports = router;