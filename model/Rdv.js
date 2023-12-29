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
        enum:['annulé','réel','en attente'],
        default:'en attente'
    },
    type:{
        type:String,
        required:true,
        enum:["en ligne","sur place"]
    },
    documents:[
        {
          name: {
            type: String,
            required: false
          },
          type: {
            type: String,
            required: false
          },
          data: {
            type: Buffer,
            required: false
          }
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

const Rdv=mongoose.model('Rdv',RdvSchema,'rdv');

module.exports=Rdv;