const chatController = require('../controller/chat.controller');


module.exports=function(app){
    app.post("/authenticate", chatController.chatAuthenticator);
}