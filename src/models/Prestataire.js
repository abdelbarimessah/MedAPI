const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const prestataireSchema = new Schema({

    firstname: { 
        type: String, 
        required: true 
    },
    lastname: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    nomEtablissement: {
        type:String,
        required: true,
    },
    description: {
        type:String,
    },
    specialites:{
        type: [String]
    },
    adresse: {
        type:String
    },
    telephoneProfessionnel:{
        type: String
    },
    horairesDisponibilite: {
        type:[{ jour: String, ouverture: String, fermeture: String }] 
    },
    tarifs:{
        type: [{ service: String, prix: Number }]
    },
    avis:{
        type: [{ idUtilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, note: Number, commentaire: String, dateAvis: Date }]
    },
    role:{
        type:String,
        default:'prestataire',
        required:true
    }
    ,
    isBanned:{
        type:Boolean,
        default:false
    },
    chnaces_left:{
        type:Number,
        default:3,
    }

})

const Prestataire = mongoose.model('Prestataire',prestataireSchema);

module.exports=Prestataire;