const mongoose = require('mongoose');

const ConsultationSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    etat: {
        type: String,
        required: true,
        enum: ['close', 'contrôle']
    },
    ordonnance: {
        type: Buffer,
        required: false
    },
    analyses: [
        {
            type: Buffer,
            required: false
        }
    ],
    scanner: [
        {
            type: Buffer,
            required: false
        }
    ],

});

const Consultation = mongoose.model('Consultation', ConsultationSchema, 'consultation');

module.exports = Consultation;