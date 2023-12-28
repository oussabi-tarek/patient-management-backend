const patientController = require('../controller/patient.controller');
const { authenticateJWT } = require('../middleware/authenticateJWT.middleware');


module.exports=function(app){
    app.get('/api/info', authenticateJWT, patientController.getPatientInfo);
    app.post('/api/login', patientController.loginPatient);
    app.post('/api/register',patientController.registerPatient);
    app.put("/api/updatePatient", authenticateJWT, patientController.updatePatient);
    app.put('/api/updateImagePatient',authenticateJWT,patientController.updateImageProfile)
    app.delete('/api/deleteImagePatient',authenticateJWT,patientController.deleteImageProfile)
}




