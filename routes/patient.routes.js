const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const { authenticatePatient } = require('../middleware/auth.middleware');

router.get('/info', authenticatePatient, patientController.getPatientInfo);
router.post('/register',patientController.registerPatient)

module.exports = router;