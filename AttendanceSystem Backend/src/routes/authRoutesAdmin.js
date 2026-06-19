const express = require("express");
const router = require("express").Router();

const authControllerAdmin = require("../controllers/authControllerAdmin");


// auth routes admin
router.post("/login", authControllerAdmin.login);
router.post("/logout", authControllerAdmin.logout);



module.exports = router;
