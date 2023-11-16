const  mongoose = require('mongoose');

const  FactureSchema = mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    montant:{
        type:Number,
        required:true
    },
    consultation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Consultation',
    },
});
    