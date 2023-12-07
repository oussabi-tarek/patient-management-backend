const chatController = require('../controller/chat.controller');


module.exports=function(app){
    app.post("/chat", chatController.chatAuthenticator);
}