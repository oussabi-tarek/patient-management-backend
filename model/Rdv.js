const sequelize=require('../model/db')
const mongoose=require('mongoose')

const RdvSchema=mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    cause:{
        type:String,
        required:true
    },
    etat:{
        type:String,
        required:true,
        enum:['annulé','réel']
    },
    type:{
        type:String,
        required:true,
        enum:["en ligne","sur place"]
    },
    documents:[
        {
            type:Buffer,
            required:false
        }
    ],
    patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Patient',
    },
    medecin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Medecin',
    },
    consultation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Consultation',
    },
});

const Rdv=mongoose.model('Rdv',RdvSchema);