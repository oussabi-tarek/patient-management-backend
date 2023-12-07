const express = require('express');
const router = express.Router();
const rdvController = require('../controllers/rdvController');

// Middleware to check JWT authentication for protected routes
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token not provided' });
    }
  
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

// Get appointments for a specific patient
router.get('/appointments', authenticateJWT, rdvController.getAppointmentsForPatient);

// Create a new appointment
router.post('/appointments', authenticateJWT, rdvController.createAppointment);

// Update an existing appointment
router.put('/appointments/:id', authenticateJWT, rdvController.updateAppointment);

// Delete an existing appointment
router.delete('/appointments/:id', authenticateJWT, rdvController.deleteAppointment);

module.exports = router;