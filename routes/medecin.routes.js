const medecinController = require('../controller/medecin.controller');

module.exports = function (app) {
  app.get('/medecins/:serviceName', medecinController.getMedecinsByService);
};