const patientController = require('../controller/patient.controller');
const { authenticatePatient } = require('../middleware/auth.middleware');
const multer = require('multer')
const upload = multer();


module.exports=function(app){
    app.get('/api/info', authenticatePatient, patientController.getPatientInfo);
    app.post('/api/register',patientController.registerPatient);
    app.put("/api/updatePatient", authenticatePatient, patientController.updatePatient);
    app.put('/api/updateImagePatient',authenticatePatient,authenticatePatient,upload.single("file"),patientController.updateImageProfile)
    app.delete('/api/deleteImagePatient',authenticatePatient,patientController.deleteImageProfile)
}



