const generateFacture = require('../controller/facture.controller')

module.exports = function(app){
    app.post('/api/facture', generateFacture);
}