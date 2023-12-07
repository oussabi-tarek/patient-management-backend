const mongoose=require('mongoose')
const bcrypt = require('bcrypt');

const  PatientSchema=mongoose.Schema({
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
    medecin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Medecin'
    },
});

// Méthode pour comparer les mots de passe hachés
PatientSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

const Patient=mongoose.model('Patient',PatientSchema,'patient');

module.exports=Patient;