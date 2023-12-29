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
    
    // Download document
    app.get('/documents/:rdvId/:index', rdvController.downloadDocument);

    // Get appointments for a specific doctor
    app.get('/appointments/doctor', authenticateJWT, rdvController.getAppointmentsForDoctor);

    // Get pending appointments for the medecin associated with the assistant
    app.get('/appointments/pending', authenticateJWT,rdvController.getPendingAppointmentsForAssistant);
    
    //Get appointments in waiting and those validated
    app.get('/appointments/forAssistant',authenticateJWT,rdvController.getAppointmentsForAssistant )
    //Validate appointment
    app.put('/appointments/:id/validate', authenticateJWT,rdvController.validateAppointment);
    
    //Cancel appointment
    app.put('/appointments/:id/cancel', authenticateJWT,rdvController.cancelAppointment);


}
