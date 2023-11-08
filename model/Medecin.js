const mongoose = require('mongoose');

const MedecinSchema = mongoose.Schema({
    nom:{
        type:String,
        required:true
    },
    prenom:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:truess
    },
    password:{
        type:String,
        required:true
    },
    adresse:{
        type:String,
        required:true
    },
    telephone:{
        type:String,
        required:true
    },
    date_naissance:{
        type:Date,
        required:true
    },
    sexe:{
        type:String,
        required:true
    },
    service:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Service',
    }
    
});

const Medecin=mongoose.model('Medecin',MedecinSchema,'medecin');

module.exports=Medecin;