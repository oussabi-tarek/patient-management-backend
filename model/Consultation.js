const mongoose=require('mongoose');

const ConsultationSchema=mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    ordonnance:{
        type:Buffer,
        required:false
    },
    analyse:{
        type:Buffer,
        required:false
    },
    scanner:{
        type:Buffer,
        required:false
    },
    radio:{
        type:Buffer,
        required:false
    },

    });

const Consultation=mongoose.model('Consultation',ConsultationSchema,'consultation');

module.exports=Consultation;