const medecinController = require('../controller/medecin.controller');

module.exports = function (app) {
    app.get('/medecins/:serviceId', medecinController.getMedecinsByService);
};
  