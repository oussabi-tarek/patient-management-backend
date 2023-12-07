const express = require("express");
const router = express.Router();
const patientInfo = require("../controllers/patientController");

router.get("/patientInfo", patientInfo);

module.exports = router;
