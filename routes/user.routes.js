const express = require('express');
const userController = require('../controller/user.controller');



module.exports = function (app) {
  app.post('/api/users/login', userController.loginUser);
  app.post('/api/users/register',userController.registerUser);
};
