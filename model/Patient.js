const mongoose=require('mongoose')
const bcrypt = require('bcryptjs');


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
    numero_cnss:{
        type:String,
        required:true
    },
    medecins:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Medecin'
        }
    ],
});

   PatientSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
   }

const Patient=mongoose.model('Patient',PatientSchema,'patient');

module.exports=Patient;