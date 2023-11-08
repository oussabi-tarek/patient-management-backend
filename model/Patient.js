const mongoose=require('mongoose')

const  PatientSchema=mongoose.Schema({
    id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
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
    numero_cnss:{
        type:String,
        required:true
    },
});

const Patient=mongoose.model('Patient',PatientSchema,'patient');

module.exports=Patient;