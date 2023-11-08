const mongoose=require('mongoose');

const ServiceSchema=mongoose.Schema({
  libelle:{
    type:String,
    required:true
  },
    description:{
        type:String,
        required:true
    },
});

const Service=mongoose.model('Service',ServiceSchema,'service');

module.exports=Service;