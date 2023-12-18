const rdvController = require('../controller/rdv.controller');
const { authenticateJWT } = require('../middleware/authenticateJWT.middleware');

module.exports = function(app){
   // Get appointments for a specific patient
    app.get('/appointments', authenticateJWT, rdvController.getAppointmentsForPatient);

    // Create a new appointment
    app.post('/appointments', authenticateJWT, rdvController.createAppointment);

    // Update an existing appointment
    app.put('/appointments/:id', authenticateJWT, rdvController.updateAppointment);

    // Delete an existing appointment
    app.delete('/appointments/:id', authenticateJWT, rdvController.deleteAppointment);
    // Get appointments for a specific doctor
    app.get('/appointments/doctor', authenticateJWT, rdvController.getAppointmentsForDoctor);
}
