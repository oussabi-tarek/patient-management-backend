const  mongoose = require('mongoose');

const  FactureSchema = mongoose.Schema({
    id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    montant:{
        type:Number,
        required:true
    },
    rdv:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Rdv',
    },
});
    