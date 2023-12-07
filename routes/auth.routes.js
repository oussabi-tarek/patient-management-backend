const patientController = require('../controller/patient.controller')

module.exports=function(app){
    app.post('/api/login', patientController.loginPatient)
}   