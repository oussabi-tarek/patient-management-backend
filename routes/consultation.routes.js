const consultationController=require('../controller/consultation.controller');
const { authenticateJWT } = require('../middleware/authenticateJWT.middleware');

module.exports=function(app){
    app.post('/api/consultations/:idRendezVous',consultationController.createConsultation);
}