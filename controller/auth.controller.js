const Patient = require('../model/Patient');
const Medecin = require('../model/Medecin');
const Assistant = require('../model/Assistant');
const generateToken = require('../middleware/generateToken.middleware');

const login = async (req, res) => {
    const { email, password,profil } = req.body;
    let user;
    
  
    if(profil==="patient")
       user= await Patient.findOne({ email });
    else if(profil==="medecin")
       user=await Medecin.findOne({ email });
    else if(profil==="assistant")
       user=await Assistant.findOne({ email });

    console.log(user);   
    if (user && (await user.comparePassword(password))) {
      const token = generateToken(user._id);
      // Retourner le token et les informations de l'utilisateur après la connexion
      res.status(200).json({
        token,
        user: {
          id: user._id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          adresse: user.adresse,
          telephone: user.telephone,
          date_naissance: user.date_naissance,
          sexe: user.sexe,
          numero_cnss: user.numero_cnss ,
        },
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  };
  module.exports = {
    login,
  };