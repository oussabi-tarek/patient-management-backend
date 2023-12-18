const patientController = require('../controller/patient.controller');
const { authenticatePatient } = require('../middleware/auth.middleware');

module.exports=function(app){
    app.get('/api/info', authenticatePatient, patientController.getPatientInfo);
    app.post('/api/register',patientController.registerPatient);
    app.put("/api/updatePatient", authenticatePatient, patientController.updatePatient);
  
}



