// routes.js

// Importez le contrôleur correspondant
const { authenticateJWT } = require('../middleware/authenticateJWT.middleware');
const consultationController = require('../controller/consultation.controller');

module.exports = function(app){

    app.get('/consultations/unbilled', authenticateJWT, consultationController.getUnbilledConsultations);
}