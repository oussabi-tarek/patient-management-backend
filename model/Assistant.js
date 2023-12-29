const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AssissstantSchema = mongoose.Schema({
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
})
// Méthode pour comparer les mots de passe hachés
AssissstantSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Assisstant=mongoose.model('Assisstant',AssissstantSchema,'assisstant');

module.exports=Assisstant;