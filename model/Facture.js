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
    
const Facture=mongoose.model('Facture',FactureSchema,'facture');

module.exports=Facture;