const serviceController = require('../controller/service.controller');

module.exports = function (app) {
    app.get('/services', serviceController.getServices);
};
  