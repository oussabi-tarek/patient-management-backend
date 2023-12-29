const mongoose = require('mongoose');
const bcrypt=require("bcryptjs")

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
        required:true
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
    image:{
        type:String,
        required:true
    },
    service:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Service',
    },
    assisstant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Assisstant',
    }
});
    MedecinSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
   }
const Medecin=mongoose.model('Medecin',MedecinSchema,'medecin');

module.exports=Medecin;