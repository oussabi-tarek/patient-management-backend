const assistantController=require('../controller/assistant.controller');

module.exports=function(app){
    app.get("/api/assistants", assistantController.getAllAssistants);
}